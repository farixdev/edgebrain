"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence } from "framer-motion";
import { CHAT_WIDGET_DEFAULTS, type ChatWidgetSettings } from "./chat-types";
import { useChat } from "./use-chat";
import { ChatLauncher } from "./chat-launcher";
import { ChatPanel } from "./chat-panel";

const OPEN_KEY = "eb.chat.open.v1";
const SEEN_KEY = "eb.chat.seen.v1";
const MOBILE_QUERY = "(max-width: 639px)";
const HEX_RE = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

export interface ChatWidgetProps {
  /**
   * Server-resolved `chat_settings`. The root layout is a server component, so
   * it can pass these straight from `getChatSettings()` and the widget paints
   * the right copy on the first frame. Anything missing is filled in from
   * `/api/chat/settings` when that route exists, and from the defaults if not.
   */
  settings?: Partial<ChatWidgetSettings>;
}

/* -------------------------------------------------------------------------- */
/* External stores (client detection + viewport), so neither needs an effect   */
/* -------------------------------------------------------------------------- */

const noopSubscribe = () => () => {};

function subscribeMedia(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const query = window.matchMedia(MOBILE_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function readMedia(): boolean {
  return window.matchMedia(MOBILE_QUERY).matches;
}

function readFlag(
  store: "local" | "session",
  key: string,
  truthy: string
): boolean {
  if (typeof window === "undefined") return false;
  try {
    const storage =
      store === "local" ? window.localStorage : window.sessionStorage;
    return storage.getItem(key) === truthy;
  } catch {
    return false;
  }
}

function sanitize(
  partial: Partial<ChatWidgetSettings> | undefined,
  base: ChatWidgetSettings
): ChatWidgetSettings {
  if (!partial) return base;
  const accent =
    typeof partial.accentColor === "string" && HEX_RE.test(partial.accentColor)
      ? partial.accentColor
      : base.accentColor;

  return {
    enabled:
      typeof partial.enabled === "boolean" ? partial.enabled : base.enabled,
    botName:
      typeof partial.botName === "string" && partial.botName.trim()
        ? partial.botName.trim()
        : base.botName,
    greeting:
      typeof partial.greeting === "string" && partial.greeting.trim()
        ? partial.greeting.trim()
        : base.greeting,
    aiDisclosure:
      typeof partial.aiDisclosure === "string" && partial.aiDisclosure.trim()
        ? partial.aiDisclosure.trim()
        : base.aiDisclosure,
    accentColor: accent,
  };
}

/* -------------------------------------------------------------------------- */
/* Widget                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * The chat widget: launcher, panel, and everything under them.
 *
 * Rendered into `document.body` through a portal so no ancestor `transform`
 * can break `position: fixed`, and so the panel always wins the stacking
 * contest with the navbar.
 *
 * This is fixed UI, not page content, so it deliberately does not use the
 * `data-reveal` / `initial={false}` scroll-reveal pattern the sections use.
 * Nothing here is server-rendered text a crawler needs to see.
 */
export function ChatWidget({ settings }: ChatWidgetProps) {
  /** False on the server and through hydration, true afterwards. */
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );
  const isMobile = useSyncExternalStore(subscribeMedia, readMedia, () => false);

  const [open, setOpen] = useState(() => readFlag("session", OPEN_KEY, "1"));
  const [pulse, setPulse] = useState(() => !readFlag("local", SEEN_KEY, "1"));
  const [fetched, setFetched] = useState<Partial<ChatWidgetSettings> | null>(
    null
  );

  const launcherRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);

  // Defaults < whatever the settings route knows < what the server passed in.
  const base = useMemo(
    () =>
      sanitize(settings, sanitize(fetched ?? undefined, CHAT_WIDGET_DEFAULTS)),
    [settings, fetched]
  );

  const chat = useChat({ open, greeting: base.greeting });

  /**
   * `/api/chat/start` echoes the owner-editable copy back, which is the only
   * public source for it today, so it outranks the defaults - but never the
   * settings a server component handed down explicitly.
   */
  const resolved = useMemo(
    () =>
      chat.serverSettings
        ? sanitize(settings, sanitize(chat.serverSettings, base))
        : base,
    [settings, base, chat.serverSettings]
  );

  /* --- settings the server did not hand us ------------------------------- */
  useEffect(() => {
    if (settings && settings.botName !== undefined) return;
    let cancelled = false;

    void (async () => {
      try {
        const res = await fetch("/api/chat/settings", { cache: "no-store" });
        if (!res.ok) return;
        const data: unknown = await res.json();
        if (cancelled || !data || typeof data !== "object") return;
        const record = data as Record<string, unknown>;
        const payload =
          record.settings && typeof record.settings === "object"
            ? (record.settings as Partial<ChatWidgetSettings>)
            : (record as Partial<ChatWidgetSettings>);
        setFetched(payload);
      } catch {
        /* No settings route, or offline: the defaults are already good copy. */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [settings]);

  /* --- persist open state across route changes --------------------------- */
  useEffect(() => {
    try {
      window.sessionStorage.setItem(OPEN_KEY, open ? "1" : "0");
    } catch {
      /* no-op */
    }
  }, [open]);

  /* --- lock the page behind the mobile sheet ----------------------------- */
  useEffect(() => {
    if (!open || !isMobile) return;
    const root = document.documentElement;
    const previous = document.body.style.overflow;
    // Lenis owns the scroll, and its own stop class is what it honours.
    root.classList.add("lenis-stopped");
    document.body.style.overflow = "hidden";
    return () => {
      root.classList.remove("lenis-stopped");
      document.body.style.overflow = previous;
    };
  }, [open, isMobile]);

  /* --- return focus to the launcher on close ----------------------------- */
  useEffect(() => {
    if (wasOpenRef.current && !open) {
      launcherRef.current?.focus({ preventScroll: true });
    }
    wasOpenRef.current = open;
  }, [open]);

  const handleOpen = useCallback(() => {
    setOpen(true);
    setPulse(false);
    try {
      window.localStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* no-op */
    }
  }, []);

  const handleClose = useCallback(() => setOpen(false), []);

  if (!mounted || !resolved.enabled) return null;

  return createPortal(
    <div
      style={{ "--chat-accent": resolved.accentColor } as React.CSSProperties}
      className="contents"
    >
      <AnimatePresence initial={false}>
        {open ? null : (
          <ChatLauncher
            key="launcher"
            ref={launcherRef}
            label={`Open chat with ${resolved.botName}`}
            hint="Ask us anything"
            pulse={pulse}
            onOpen={handleOpen}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open ? (
          <ChatPanel
            key="panel"
            settings={resolved}
            chat={chat}
            isMobile={isMobile}
            onClose={handleClose}
          />
        ) : null}
      </AnimatePresence>
    </div>,
    document.body
  );
}

export default ChatWidget;
