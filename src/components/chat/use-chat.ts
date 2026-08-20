"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  normalizeRole,
  type ChatRole,
  type ChatWidgetSettings,
  type UiMessage,
} from "./chat-types";

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

const SESSION_KEY = "eb.chat.session.v1";
const POLL_MS = 6000;
/** Polling stops after this much silence so an abandoned tab stops talking. */
const IDLE_LIMIT_MS = 10 * 60 * 1000;
const EPOCH = new Date(0).toISOString();

const GENERIC_ERROR =
  "That did not go through. Check your connection and try again.";

/* -------------------------------------------------------------------------- */
/* Persistence                                                                */
/* -------------------------------------------------------------------------- */

export interface StoredSession {
  conversationId: string;
  name: string;
  email: string;
}

function readSession(): StoredSession | null {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const record = parsed as Record<string, unknown>;
    const id = record.conversationId;
    if (typeof id !== "string" || id.length < 8) return null;
    return {
      conversationId: id,
      name: typeof record.name === "string" ? record.name : "",
      email: typeof record.email === "string" ? record.email : "",
    };
  } catch {
    return null;
  }
}

function writeSession(session: StoredSession): void {
  try {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    /* private mode / quota - the chat still works, it just will not resume. */
  }
}

function clearSession(): void {
  try {
    window.localStorage.removeItem(SESSION_KEY);
  } catch {
    /* no-op */
  }
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

let idCounter = 0;
function uid(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${idCounter}-${Date.now().toString(36)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function timeOf(iso: string): number {
  const t = Date.parse(iso);
  return Number.isNaN(t) ? 0 : t;
}

async function readJson(res: Response): Promise<Record<string, unknown>> {
  try {
    const data: unknown = await res.json();
    return data && typeof data === "object"
      ? (data as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

function errorFrom(data: Record<string, unknown>, fallback: string): string {
  return typeof data.error === "string" && data.error.trim()
    ? data.error
    : fallback;
}

/** Shape a `ChatMessage` row - or a bare string - into something mergeable. */
function asMessageRecord(
  value: unknown,
  role: ChatRole
): Record<string, unknown> | null {
  if (typeof value === "string") {
    return value.trim()
      ? { role, content: value, createdAt: nowIso(), escalated: false }
      : null;
  }
  if (!value || typeof value !== "object") return null;

  const record = value as Record<string, unknown>;
  if (typeof record.content !== "string" || !record.content.trim()) return null;

  return {
    role: record.role ?? role,
    content: record.content,
    createdAt:
      typeof record.createdAt === "string" ? record.createdAt : nowIso(),
    escalated: record.escalated === true,
  };
}

/** The presentation half of `chat_settings`, as `/api/chat/start` returns it. */
function pickSettings(
  data: Record<string, unknown>
): Partial<ChatWidgetSettings> | null {
  const keys = ["botName", "greeting", "aiDisclosure", "accentColor"] as const;
  const picked: Partial<ChatWidgetSettings> = {};

  for (const key of keys) {
    const value = data[key];
    if (typeof value === "string" && value.trim()) picked[key] = value.trim();
  }

  return Object.keys(picked).length ? picked : null;
}

/* -------------------------------------------------------------------------- */
/* Hook                                                                       */
/* -------------------------------------------------------------------------- */

export type ChatPhase = "lead" | "chat";

export interface UseChatOptions {
  /** Only the open panel polls; a closed panel is inert. */
  open: boolean;
  /** First assistant line, rendered locally - it is not a stored message. */
  greeting: string;
}

export interface UseChat {
  phase: ChatPhase;
  messages: UiMessage[];
  visitor: { name: string; email: string };
  /** True while `/api/chat/start` is in flight. */
  starting: boolean;
  /** True between sending a message and the reply landing. */
  awaitingReply: boolean;
  /** True while the stored thread is being restored from the poll endpoint. */
  restoring: boolean;
  error: string | null;
  hasSession: boolean;
  /** The owner closed the thread from the admin inbox. */
  closed: boolean;
  /** The server has flagged this conversation `needs_human`. */
  needsHuman: boolean;
  /** Visitor turns left before the server-side cap, or null if unknown. */
  remaining: number | null;
  /**
   * Presentation settings as reported by `/api/chat/start`, so the owner's
   * copy wins over the widget defaults from the first reply onwards.
   */
  serverSettings: Partial<ChatWidgetSettings> | null;
  start: (name: string, email: string) => Promise<boolean>;
  send: (message: string) => Promise<void>;
  reset: () => void;
  dismissError: () => void;
}

export function useChat({ open, greeting }: UseChatOptions): UseChat {
  /**
   * Read once, during the first render, rather than in a mount effect: the
   * widget renders nothing until it is mounted client-side, so there is no
   * hydration surface for the difference to show up on, and this keeps the
   * resumed thread out of a setState-in-effect cascade.
   */
  const [restored] = useState<StoredSession | null>(() =>
    typeof window === "undefined" ? null : readSession()
  );

  const [phase, setPhase] = useState<ChatPhase>(restored ? "chat" : "lead");
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(
    restored?.conversationId ?? null
  );
  const [visitor, setVisitor] = useState({
    name: restored?.name ?? "",
    email: restored?.email ?? "",
  });
  const [starting, setStarting] = useState(false);
  const [awaitingReply, setAwaitingReply] = useState(false);
  /** True from the first render of a resumed thread until its history lands. */
  const [restoring, setRestoring] = useState<boolean>(Boolean(restored));
  const [error, setError] = useState<string | null>(null);
  const [idle, setIdle] = useState(false);
  const [activityTick, setActivityTick] = useState(0);
  const [closed, setClosed] = useState(false);
  const [needsHuman, setNeedsHuman] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [serverSettings, setServerSettings] =
    useState<Partial<ChatWidgetSettings> | null>(null);

  const conversationRef = useRef<string | null>(
    restored?.conversationId ?? null
  );
  const cursorRef = useRef<string>(EPOCH);
  const inFlightRef = useRef(false);
  const restoredRef = useRef(false);

  /** Any visitor action re-arms the idle timer and resumes polling. */
  const bump = useCallback(() => {
    setIdle(false);
    setActivityTick((tick) => tick + 1);
  }, []);

  const makeGreeting = useCallback(
    (override?: string): UiMessage => ({
      id: uid("greeting"),
      role: "assistant",
      content: override?.trim() ? override.trim() : greeting,
      createdAt: nowIso(),
      escalated: false,
      origin: "local",
    }),
    [greeting]
  );

  /* --- merge polled messages into the optimistic list -------------------- */
  const mergeServer = useCallback((incoming: unknown[]) => {
    if (!incoming.length) return;

    setMessages((prev) => {
      const next = prev.slice();
      let changed = false;

      for (const raw of incoming) {
        if (!raw || typeof raw !== "object") continue;
        const record = raw as Record<string, unknown>;
        const content = typeof record.content === "string" ? record.content : "";
        if (!content.trim()) continue;

        const role: ChatRole = normalizeRole(record.role);
        const createdAt =
          typeof record.createdAt === "string" ? record.createdAt : nowIso();
        const escalated = record.escalated === true;

        if (timeOf(createdAt) > timeOf(cursorRef.current)) {
          cursorRef.current = createdAt;
        }

        const twin = next.findIndex(
          (message) =>
            message.origin === "optimistic" &&
            message.role === role &&
            message.content.trim() === content.trim()
        );

        if (twin >= 0) {
          next[twin] = {
            ...next[twin],
            origin: "server",
            createdAt,
            escalated: escalated || next[twin].escalated,
          };
        } else {
          next.push({
            id: uid("server"),
            role,
            content,
            createdAt,
            escalated,
            origin: "server",
          });
        }
        changed = true;
      }

      if (!changed) return prev;
      // Array.prototype.sort is stable, so same-instant messages keep the order
      // they arrived in.
      next.sort((a, b) => timeOf(a.createdAt) - timeOf(b.createdAt));
      return next;
    });
  }, []);

  const poll = useCallback(
    async (full = false) => {
      const id = conversationRef.current;
      if (!id || inFlightRef.current) return;
      inFlightRef.current = true;

      try {
        const since = full ? EPOCH : cursorRef.current;
        const res = await fetch(
          `/api/chat/poll?conversationId=${encodeURIComponent(
            id
          )}&since=${encodeURIComponent(since)}`,
          { cache: "no-store" }
        );

        const isApiAnswer = (res.headers.get("content-type") ?? "").includes(
          "application/json"
        );

        if (isApiAnswer && (res.status === 404 || res.status === 410)) {
          // The API says this thread is gone, so drop the stale id rather than
          // polling a ghost forever. A non-JSON 404 is the framework saying the
          // route is missing (mid-deploy, say) and must not cost the visitor
          // their conversation.
          clearSession();
          conversationRef.current = null;
          setConversationId(null);
          setMessages([]);
          setRestoring(false);
          setPhase("lead");
          return;
        }
        if (!res.ok) return;

        const data = await readJson(res);
        if (Array.isArray(data.messages)) mergeServer(data.messages);
        if (typeof data.status === "string") {
          setClosed(data.status === "closed");
          setNeedsHuman(data.status === "needs_human");
        }
        if (typeof data.remaining === "number") setRemaining(data.remaining);
      } catch {
        /* A dropped poll is not worth surfacing; the next tick retries. */
      } finally {
        inFlightRef.current = false;
      }
    },
    [mergeServer]
  );

  /* --- first open of a stored thread: pull the full history -------------- */
  useEffect(() => {
    if (!open || !conversationId || restoredRef.current) return;
    // `restoring` already started true for a resumed thread, so the effect only
    // ever has to turn it off - no synchronous setState on the way in.
    restoredRef.current = true;
    cursorRef.current = EPOCH;

    void poll(true).finally(() => {
      setRestoring(false);
      // An empty restore still deserves the greeting.
      setMessages((prev) => (prev.length ? prev : [makeGreeting()]));
      bump();
    });
  }, [open, conversationId, poll, makeGreeting, bump]);

  /* --- idle timer -------------------------------------------------------- */
  useEffect(() => {
    if (!open || phase !== "chat") return;
    const timer = window.setTimeout(() => setIdle(true), IDLE_LIMIT_MS);
    return () => window.clearTimeout(timer);
  }, [open, phase, activityTick]);

  /* --- the poll loop ----------------------------------------------------- */
  useEffect(() => {
    if (!open || idle || phase !== "chat" || !conversationId) return;

    const tick = () => {
      if (typeof document !== "undefined" && document.hidden) return;
      void poll();
    };

    const interval = window.setInterval(tick, POLL_MS);
    return () => window.clearInterval(interval);
  }, [open, idle, phase, conversationId, poll]);

  /* --- actions ----------------------------------------------------------- */

  const start = useCallback(
    async (name: string, email: string): Promise<boolean> => {
      setError(null);
      setStarting(true);
      try {
        const res = await fetch("/api/chat/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            pageUrl: typeof window === "undefined" ? "" : window.location.href,
          }),
        });
        const data = await readJson(res);
        const id =
          typeof data.conversationId === "string" ? data.conversationId : "";

        if (!res.ok || !id) {
          setError(
            errorFrom(
              data,
              "We could not open a conversation just now. Please try again."
            )
          );
          return false;
        }

        // `/api/chat/start` also returns the owner-editable presentation copy,
        // which is the only public source for it, so adopt whatever it sends.
        const announced = pickSettings(data);

        conversationRef.current = id;
        cursorRef.current = EPOCH;
        restoredRef.current = true;
        setConversationId(id);
        setVisitor({ name, email });
        setClosed(false);
        setNeedsHuman(false);
        setRemaining(
          typeof data.messageLimit === "number" ? data.messageLimit : null
        );
        if (announced) setServerSettings(announced);
        writeSession({ conversationId: id, name, email });
        setMessages([makeGreeting(announced?.greeting)]);
        setPhase("chat");
        bump();
        return true;
      } catch {
        setError(GENERIC_ERROR);
        return false;
      } finally {
        setStarting(false);
      }
    },
    [makeGreeting, bump]
  );

  const send = useCallback(
    async (raw: string) => {
      const message = raw.trim();
      const id = conversationRef.current;
      if (!message || !id || awaitingReply) return;

      setError(null);
      setMessages((prev) => [
        ...prev,
        {
          id: uid("visitor"),
          role: "visitor",
          content: message,
          createdAt: nowIso(),
          escalated: false,
          origin: "optimistic",
        },
      ]);
      setAwaitingReply(true);
      bump();

      try {
        const res = await fetch("/api/chat/message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ conversationId: id, message }),
        });
        const data = await readJson(res);
        // The route answers with stored rows (`userMessage`, `reply`), but a
        // plain `{ reply: string }` is accepted too so the widget survives the
        // endpoint being simplified later.
        const replyRecord = asMessageRecord(data.reply, "assistant");

        if (!res.ok || !replyRecord) {
          if (res.status === 409) setClosed(true);
          setError(
            errorFrom(
              data,
              "The reply did not come through. Your message was saved - the team can still see it."
            )
          );
          return;
        }

        if (data.escalated === true) {
          replyRecord.escalated = true;
          setNeedsHuman(true);
        }
        if (typeof data.status === "string") {
          setNeedsHuman(data.status === "needs_human");
          setClosed(data.status === "closed");
        }
        if (typeof data.remaining === "number") setRemaining(data.remaining);

        // Reconciling through the same merge the poll uses means the visitor
        // bubble is upgraded in place and the poll cursor moves past both rows,
        // so nothing arrives twice six seconds later.
        const echo = asMessageRecord(data.userMessage, "visitor");
        mergeServer(echo ? [echo, replyRecord] : [replyRecord]);
      } catch {
        setError(GENERIC_ERROR);
      } finally {
        setAwaitingReply(false);
        bump();
      }
    },
    [awaitingReply, bump, mergeServer]
  );

  const reset = useCallback(() => {
    clearSession();
    conversationRef.current = null;
    cursorRef.current = EPOCH;
    restoredRef.current = false;
    setConversationId(null);
    setMessages([]);
    setVisitor({ name: "", email: "" });
    setRestoring(false);
    setClosed(false);
    setNeedsHuman(false);
    setRemaining(null);
    setPhase("lead");
    setError(null);
    bump();
  }, [bump]);

  const dismissError = useCallback(() => setError(null), []);

  return {
    phase,
    messages,
    visitor,
    starting,
    awaitingReply,
    restoring,
    error,
    hasSession: conversationId !== null,
    closed,
    needsHuman,
    remaining,
    serverSettings,
    start,
    send,
    reset,
    dismissError,
  };
}
