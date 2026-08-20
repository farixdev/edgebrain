"use client";

/**
 * The chat inbox.
 *
 * Built to read like a mail client rather than a database viewer, because that
 * is what it is: a list of people waiting on a reply. Two panes on desktop,
 * one-at-a-time on mobile. Newest activity first, unread threads marked, and
 * escalated threads — the ones where the bot gave up and promised a human —
 * called out loudly enough that they cannot be scrolled past.
 *
 * Polling: every 10s while this component is mounted. The parent unmounts it
 * when you switch tabs, so the interval dies with it; the effect's cleanup
 * handles unmount and every dependency change in between.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage, Conversation, ConversationStatus } from "@/lib/db";
import { BTN_GHOST, BTN_PRIMARY, BTN_SECONDARY, TEXTAREA } from "./styles";

const POLL_MS = 10_000;

type Filter = "all" | "needs_human" | "open" | "closed";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "needs_human", label: "Needs human" },
  { key: "open", label: "Open" },
  { key: "closed", label: "Closed" },
];

export interface InboxProps {
  email: string;
  password: string;
  /** Bubbles the server's unread count up so the tab label can show it. */
  onUnreadChange: (count: number) => void;
  onToast: (msg: string, ok: boolean) => void;
  /** Called on a 401 so the panel can drop back to the login screen. */
  onUnauthorized: () => void;
}

/* -------------------------------------------------------------------------- */
/* Time formatting                                                            */
/* -------------------------------------------------------------------------- */

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then)) return "";
  const seconds = Math.round((Date.now() - then) / 1000);

  if (seconds < 45) return "just now";
  if (seconds < 90) return "1 min ago";
  if (seconds < 3600) return `${Math.round(seconds / 60)} min ago`;
  if (seconds < 7200) return "1 hr ago";
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hr ago`;
  if (seconds < 172800) return "yesterday";
  if (seconds < 604800) return `${Math.round(seconds / 86400)} days ago`;
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function clockTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/* -------------------------------------------------------------------------- */
/* Small presentational pieces                                                */
/* -------------------------------------------------------------------------- */

function StatusBadge({ status }: { status: ConversationStatus }) {
  if (status === "needs_human") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#FFD400]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#FFD400]">
        Needs human
      </span>
    );
  }
  if (status === "closed") {
    return (
      <span className="inline-flex shrink-0 items-center rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/35">
        Resolved
      </span>
    );
  }
  return null;
}

/** Initials avatar. Gives the list a left edge to scan down. */
function Avatar({ name }: { name: string }) {
  const initials =
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("") || "?";

  return (
    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/[0.06] text-xs font-semibold text-white/60">
      {initials}
    </span>
  );
}

function EmptyState({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-3 px-8 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-white/[0.02]">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white/25"
          aria-hidden="true"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </div>
      <p className="text-sm font-medium text-white/70">{title}</p>
      <p className="max-w-[38ch] text-xs leading-relaxed text-white/35">{body}</p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Inbox                                                                      */
/* -------------------------------------------------------------------------- */

export function Inbox({
  email,
  password,
  onUnreadChange,
  onToast,
  onUnauthorized,
}: InboxProps) {
  const [filter, setFilter] = useState<Filter>("all");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [listLoading, setListLoading] = useState(true);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [thread, setThread] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [threadLoading, setThreadLoading] = useState(false);

  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [statusBusy, setStatusBusy] = useState(false);

  const transcriptRef = useRef<HTMLDivElement | null>(null);
  /** Message count at last scroll, so polling does not yank the view. */
  const lastCountRef = useRef(0);

  const authHeaders = useCallback(
    (): HeadersInit => ({
      "x-admin-email": email,
      "x-admin-password": password,
    }),
    [email, password]
  );

  /* ---- List ------------------------------------------------------------ */

  /**
   * Note what is missing: a `setListLoading(true)` before the first `await`.
   * A state update that runs synchronously inside an effect body triggers a
   * cascading render, which the React Compiler lint rule rejects — correctly.
   * `listLoading` starts `true` for the first fetch and the effects below only
   * ever set state after awaiting.
   */
  const loadList = useCallback(
    async (opts: { quiet?: boolean } = {}) => {
      try {
        const qs = filter === "all" ? "" : `?status=${filter}`;
        const res = await fetch(`/api/admin/chat${qs}`, {
          headers: authHeaders(),
          cache: "no-store",
        });
        if (res.status === 401) {
          onUnauthorized();
          return;
        }
        if (!res.ok) throw new Error("Could not load conversations");
        const data = (await res.json()) as {
          conversations: Conversation[];
          unread: number;
        };
        setConversations(data.conversations);
        onUnreadChange(data.unread);
      } catch (err) {
        if (!opts.quiet) {
          onToast(err instanceof Error ? err.message : "Load failed", false);
        }
      } finally {
        if (!opts.quiet) setListLoading(false);
      }
    },
    [filter, authHeaders, onUnreadChange, onToast, onUnauthorized]
  );

  /* ---- One thread ------------------------------------------------------ */

  const loadThread = useCallback(
    async (id: string, opts: { quiet?: boolean } = {}) => {
      try {
        // `peek=1` on a poll: refreshing an open thread should not fight the
        // owner over the unread flag, only an explicit open clears it.
        const res = await fetch(
          `/api/admin/chat?id=${encodeURIComponent(id)}${opts.quiet ? "&peek=1" : ""}`,
          { headers: authHeaders(), cache: "no-store" }
        );
        if (res.status === 401) {
          onUnauthorized();
          return;
        }
        if (!res.ok) throw new Error("Could not load that conversation");
        const data = (await res.json()) as {
          conversation: Conversation;
          messages: ChatMessage[];
          unread: number;
        };
        setThread(data.conversation);
        setMessages(data.messages);
        onUnreadChange(data.unread);
        if (!opts.quiet) {
          // Reflect the just-cleared unread dot without a full list refetch.
          setConversations((prev) =>
            prev.map((c) => (c.id === id ? { ...c, unreadForAdmin: false } : c))
          );
        }
      } catch (err) {
        if (!opts.quiet) {
          onToast(err instanceof Error ? err.message : "Load failed", false);
        }
      } finally {
        if (!opts.quiet) setThreadLoading(false);
      }
    },
    [authHeaders, onUnreadChange, onToast, onUnauthorized]
  );

  /* ---- Effects --------------------------------------------------------- */

  // Initial load, and a reload whenever the filter changes.
  useEffect(() => {
    // `loadList` is a useCallback, and the lint rule reads a direct call from an
    // effect body as a synchronous setState even when every update inside it
    // happens after an await. The local wrapper makes that deferral explicit.
    const run = async () => {
      await loadList();
    };
    void run();
  }, [loadList]);

  /**
   * Opening and closing a thread are user events, so they are handled here
   * rather than in an effect watching `selectedId`. Effects are for
   * synchronising with something outside React; a click is not that.
   */
  const openThread = (id: string) => {
    if (id === selectedId) return;
    setSelectedId(id);
    setThread(null);
    setMessages([]);
    setReply("");
    setThreadLoading(true);
    lastCountRef.current = 0;
    void loadThread(id);
  };

  const closeThread = () => {
    setSelectedId(null);
    setThread(null);
    setMessages([]);
    setReply("");
  };

  /**
   * The poll. One interval covers both panes.
   *
   * Cleanup runs on unmount — which is what happens when the owner switches to
   * another tab, since the parent renders this component only for the Inbox —
   * and on every dependency change, so there is never more than one live timer.
   */
  useEffect(() => {
    const tick = () => {
      if (typeof document !== "undefined" && document.hidden) return;
      void loadList({ quiet: true });
      if (selectedId) void loadThread(selectedId, { quiet: true });
    };
    const timer = window.setInterval(tick, POLL_MS);
    return () => window.clearInterval(timer);
  }, [loadList, loadThread, selectedId]);

  // Keep the transcript pinned to the newest message when new ones arrive.
  useEffect(() => {
    const el = transcriptRef.current;
    if (!el) return;
    if (messages.length === lastCountRef.current) return;
    lastCountRef.current = messages.length;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  /* ---- Actions --------------------------------------------------------- */

  const sendReply = async () => {
    const content = reply.trim();
    if (!content || !selectedId || sending) return;
    setSending(true);
    try {
      const res = await fetch("/api/admin/chat", {
        method: "POST",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: selectedId, content }),
      });
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Could not send");

      setMessages((prev) => [...prev, data.message as ChatMessage]);
      setThread(data.conversation as Conversation);
      setReply("");
      onUnreadChange(data.unread ?? 0);
      // The list's preview and ordering both changed.
      void loadList({ quiet: true });
    } catch (err) {
      onToast(err instanceof Error ? err.message : "Could not send", false);
    } finally {
      setSending(false);
    }
  };

  const changeStatus = async (status: ConversationStatus) => {
    if (!selectedId || statusBusy) return;
    setStatusBusy(true);
    try {
      const res = await fetch("/api/admin/chat", {
        method: "PATCH",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedId, status }),
      });
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Update failed");

      setThread(data.conversation as Conversation);
      onUnreadChange(data.unread ?? 0);
      onToast(status === "closed" ? "Marked resolved" : "Reopened", true);
      void loadList({ quiet: true });
    } catch (err) {
      onToast(err instanceof Error ? err.message : "Update failed", false);
    } finally {
      setStatusBusy(false);
    }
  };

  const copyEmail = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      onToast("Email copied", true);
    } catch {
      onToast("Could not copy — select it manually", false);
    }
  };

  const unreadInView = conversations.filter((c) => c.unreadForAdmin).length;

  /* ---- Render ---------------------------------------------------------- */

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => {
                setFilter(f.key);
                closeThread();
              }}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                filter === f.key
                  ? "bg-[#FFD400] text-[#0E0E0E]"
                  : "text-white/50 hover:bg-white/5 hover:text-white/80"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            void loadList({ quiet: true });
            if (selectedId) void loadThread(selectedId, { quiet: true });
          }}
          className={BTN_GHOST}
          title="Refresh now"
        >
          Refresh
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-[minmax(260px,320px)_1fr]">
        {/* ---------------- List ---------------- */}
        <div
          className={`rounded-lg border border-white/10 bg-[#141414] ${
            selectedId ? "hidden md:block" : ""
          }`}
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-white/40">
              {conversations.length}{" "}
              {conversations.length === 1 ? "thread" : "threads"}
            </span>
            {unreadInView > 0 && (
              <span className="text-xs font-semibold text-[#FFD400]">
                {unreadInView} unread
              </span>
            )}
          </div>

          <div className="max-h-[calc(100vh-320px)] min-h-[240px] overflow-y-auto">
            {listLoading && conversations.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-white/30">
                Loading&hellip;
              </p>
            ) : conversations.length === 0 ? (
              <EmptyState
                title={
                  filter === "all"
                    ? "No conversations yet"
                    : "Nothing in this filter"
                }
                body={
                  filter === "all"
                    ? "When someone opens the chat widget and leaves their name, the thread lands here. Nothing has come in so far."
                    : "Threads matching this filter will appear here. Try All."
                }
              />
            ) : (
              <ul className="divide-y divide-white/[0.06]">
                {conversations.map((c) => {
                  const active = c.id === selectedId;
                  return (
                    <li key={c.id}>
                      <button
                        onClick={() => openThread(c.id)}
                        className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors cursor-pointer ${
                          active ? "bg-[#FFD400]/[0.07]" : "hover:bg-white/[0.03]"
                        }`}
                      >
                        <Avatar name={c.visitorName} />
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2">
                            <span
                              className={`truncate text-sm ${
                                c.unreadForAdmin
                                  ? "font-semibold text-white"
                                  : "font-medium text-white/75"
                              }`}
                            >
                              {c.visitorName || "Anonymous"}
                            </span>
                            {c.unreadForAdmin && (
                              <span
                                className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#FFD400]"
                                aria-label="Unread"
                              />
                            )}
                            <span className="ml-auto shrink-0 text-[10px] text-white/30">
                              {relativeTime(c.lastMessageAt)}
                            </span>
                          </span>
                          <span className="mt-0.5 block truncate text-xs text-white/40">
                            {c.visitorEmail}
                          </span>
                          <span className="mt-1.5 flex items-center gap-1.5">
                            <StatusBadge status={c.status} />
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* ---------------- Transcript ---------------- */}
        <div
          className={`flex min-h-[420px] flex-col rounded-lg border border-white/10 bg-[#141414] ${
            selectedId ? "" : "hidden md:flex"
          }`}
        >
          {!thread ? (
            <EmptyState
              title="No thread selected"
              body="Pick a conversation on the left to read the full transcript and reply as yourself."
            />
          ) : (
            <>
              {/* Thread header */}
              <div className="flex flex-wrap items-start gap-3 border-b border-white/10 px-4 py-3">
                <button
                  onClick={closeThread}
                  className={`${BTN_GHOST} md:hidden`}
                >
                  &larr; Back
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm font-semibold text-white">
                      {thread.visitorName || "Anonymous"}
                    </h4>
                    <StatusBadge status={thread.status} />
                  </div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-white/40">
                    <a
                      href={`mailto:${thread.visitorEmail}`}
                      className="hover:text-[#FFD400]"
                    >
                      {thread.visitorEmail}
                    </a>
                    <button
                      onClick={() => copyEmail(thread.visitorEmail)}
                      className="rounded px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-white/30 hover:bg-white/5 hover:text-white/70 transition-colors cursor-pointer"
                      title="Copy email address"
                    >
                      Copy
                    </button>
                    <span className="text-white/15">|</span>
                    <span>Started {clockTime(thread.createdAt)}</span>
                  </div>
                  {thread.pageUrl && (
                    <p className="mt-1 truncate text-[11px] text-white/25">
                      From {thread.pageUrl}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 gap-2">
                  {thread.status === "closed" ? (
                    <button
                      onClick={() => changeStatus("open")}
                      disabled={statusBusy}
                      className={`${BTN_SECONDARY} disabled:opacity-50`}
                    >
                      Reopen
                    </button>
                  ) : (
                    <button
                      onClick={() => changeStatus("closed")}
                      disabled={statusBusy}
                      className={`${BTN_SECONDARY} disabled:opacity-50`}
                    >
                      Mark resolved
                    </button>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div
                ref={transcriptRef}
                className="flex-1 space-y-4 overflow-y-auto px-4 py-4 max-h-[calc(100vh-460px)] min-h-[220px]"
              >
                {threadLoading && messages.length === 0 ? (
                  <p className="py-8 text-center text-sm text-white/30">
                    Loading transcript&hellip;
                  </p>
                ) : messages.length === 0 ? (
                  <p className="py-8 text-center text-sm text-white/30">
                    No messages in this thread yet.
                  </p>
                ) : (
                  messages.map((m) => <Bubble key={m.id} message={m} />)
                )}
              </div>

              {/* Reply box */}
              <div className="border-t border-white/10 p-3">
                {thread.status === "closed" && (
                  <p className="mb-2 text-xs text-white/35">
                    This thread is resolved. Sending a reply does not reopen it
                    &mdash; use Reopen if you want it back in the queue.
                  </p>
                )}
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      void sendReply();
                    }
                  }}
                  placeholder={`Reply to ${thread.visitorName || "this visitor"}…`}
                  className={TEXTAREA}
                  rows={3}
                />
                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="text-[11px] text-white/25">
                    Sent as you, not the bot. Enter to send, Shift+Enter for a
                    new line.
                  </p>
                  <button
                    onClick={() => void sendReply()}
                    disabled={sending || !reply.trim()}
                    className={`${BTN_PRIMARY} disabled:opacity-40`}
                  >
                    {sending ? "Sending…" : "Send reply"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Message bubble                                                             */
/* -------------------------------------------------------------------------- */

const ROLE_META: Record<
  ChatMessage["role"],
  { label: string; bubble: string; name: string }
> = {
  /**
   * The customer's own words are the reason this screen exists, so they get the
   * highest-contrast treatment on the page.
   *
   * This used to be `bg-[#1a1a1a]` on a `#141414` panel — two greys four points
   * apart, which read as no bubble at all. Next to an AI reply that is usually
   * three times longer, the eye skipped the question entirely and the inbox
   * looked like it was dropping visitor messages.
   */
  visitor: {
    label: "Customer",
    name: "text-white",
    bubble: "bg-white/[0.13] border border-white/25 text-white",
  },
  /** Deliberately recessed: the dashed border marks it as machine-written. */
  assistant: {
    label: "AI assistant",
    name: "text-white/40",
    bubble: "bg-white/[0.03] border border-dashed border-white/15 text-white/65",
  },
  admin: {
    label: "You",
    name: "text-[#FFD400]/70",
    bubble: "bg-[#FFD400]/10 border border-[#FFD400]/25 text-white",
  },
};

function Bubble({ message }: { message: ChatMessage }) {
  const meta = ROLE_META[message.role];
  const mine = message.role === "admin";

  return (
    <div className={`flex flex-col gap-1 ${mine ? "items-end" : "items-start"}`}>
      <div className="flex items-center gap-2 px-1">
        <span className={`text-[10px] font-semibold uppercase tracking-wider ${meta.name}`}>
          {meta.label}
        </span>
        {message.escalated && (
          <span className="rounded-full bg-[#FFD400]/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#FFD400]">
            Escalated
          </span>
        )}
        <span className="text-[10px] text-white/20">
          {clockTime(message.createdAt)}
        </span>
      </div>
      <div
        className={`max-w-[85%] whitespace-pre-wrap break-words rounded-lg px-3 py-2 text-sm leading-relaxed ${meta.bubble}`}
      >
        {message.content}
      </div>
    </div>
  );
}
