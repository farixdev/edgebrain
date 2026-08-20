"use client";

import { useEffect, useId, useRef } from "react";
import {
  AnimatePresence,
  motion,
  useDragControls,
  useReducedMotion,
  type PanInfo,
} from "framer-motion";
import { CircleAlert, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { DURATION, EASE } from "@/lib/motion";
import type { ChatWidgetSettings } from "./chat-types";
import type { UseChat } from "./use-chat";
import { ChatComposer } from "./chat-composer";
import { ChatLeadForm } from "./chat-lead-form";
import { ChatMessageList } from "./chat-message-list";

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

interface ChatPanelProps {
  settings: ChatWidgetSettings;
  chat: UseChat;
  isMobile: boolean;
  onClose: () => void;
}

export function ChatPanel({
  settings,
  chat,
  isMobile,
  onClose,
}: ChatPanelProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const disclosureId = useId();
  const dragControls = useDragControls();

  const humanWaiting =
    chat.needsHuman ||
    chat.messages.some(
      (message) => message.escalated || message.role === "admin"
    );

  /* Focus trap + ESC. The trap is scoped to the panel node; ESC is on the
     document so it still closes when focus has slipped to the body. */
  useEffect(() => {
    const node = panelRef.current;
    if (!node) return;

    const onDocumentKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
      }
    };

    const onPanelKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const items = Array.from(
        node.querySelectorAll<HTMLElement>(FOCUSABLE)
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);
      if (!items.length) return;

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !node.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onDocumentKeyDown);
    node.addEventListener("keydown", onPanelKeyDown);
    return () => {
      document.removeEventListener("keydown", onDocumentKeyDown);
      node.removeEventListener("keydown", onPanelKeyDown);
    };
  }, [onClose]);

  const handleDragEnd = (_event: unknown, info: PanInfo) => {
    if (info.offset.y > 110 || info.velocity.y > 700) onClose();
  };

  const enter = isMobile
    ? { opacity: 1, y: 0 }
    : { opacity: 1, scale: 1, y: 0 };
  const from = isMobile
    ? { opacity: 1, y: "100%" }
    : { opacity: 0, scale: 0.94, y: 18 };
  const leave = isMobile
    ? { opacity: 1, y: "100%" }
    : { opacity: 0, scale: 0.96, y: 12 };

  const statusLabel = chat.closed
    ? "Chat closed"
    : chat.awaitingReply
      ? "Thinking"
      : humanWaiting
        ? "A human is joining"
        : "Online now";

  return (
    <>
      {isMobile ? (
        <motion.div
          aria-hidden="true"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : DURATION.base }}
          className="fixed inset-0 z-[96] bg-[var(--color-ink)]/40 backdrop-blur-[3px]"
        />
      ) : null}

      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={disclosureId}
        drag={isMobile && !reduceMotion ? "y" : false}
        dragListener={false}
        dragControls={dragControls}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.35 }}
        onDragEnd={handleDragEnd}
        initial={reduceMotion ? { opacity: 0 } : from}
        animate={reduceMotion ? { opacity: 1 } : enter}
        exit={reduceMotion ? { opacity: 0 } : leave}
        transition={{
          duration: reduceMotion ? 0 : isMobile ? 0.42 : DURATION.base,
          ease: EASE.standard,
        }}
        style={{ transformOrigin: "bottom right" }}
        className={cn(
          "fixed z-[97] flex flex-col overflow-hidden bg-[var(--color-offwhite)]",
          "shadow-[0_1px_2px_rgba(14,14,14,0.06),0_18px_36px_-16px_rgba(14,14,14,0.28),0_48px_88px_-36px_rgba(14,14,14,0.5)]",
          "ring-1 ring-[var(--color-hairline-light)]",
          isMobile
            ? "inset-x-0 bottom-0 top-[max(1.25rem,6vh)] rounded-t-[var(--radius-lg)]"
            : "bottom-6 right-6 h-[min(41rem,calc(100vh_-_7rem))] w-[23.75rem] max-w-[calc(100vw_-_2.5rem)] rounded-[var(--radius-lg)]"
        )}
      >
        {/* ---- Drag-to-dismiss handle (mobile) ---- */}
        {isMobile ? (
          <div
            aria-hidden="true"
            onPointerDown={(event) => dragControls.start(event)}
            className="flex w-full shrink-0 cursor-grab touch-none items-center justify-center bg-[var(--color-ink)] pb-1 pt-2.5 active:cursor-grabbing"
          >
            <span className="h-1 w-10 rounded-full bg-[var(--color-offwhite)]/35" />
          </div>
        ) : null}

        {/* ---- Header ---- */}
        <header className="flex shrink-0 items-center gap-3 bg-[var(--color-ink)] px-4 pb-3.5 pt-3.5 text-[var(--color-offwhite)]">
          <span
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[var(--chat-accent)] text-[var(--color-ink)]"
          >
            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none">
              <path
                d="M5 5.6h14A1.9 1.9 0 0 1 20.9 7.5v7.2A1.9 1.9 0 0 1 19 16.6h-6.2l-3.9 2.9a.55.55 0 0 1-.88-.44v-2.46H5A1.9 1.9 0 0 1 3.1 14.7V7.5A1.9 1.9 0 0 1 5 5.6Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          </span>

          <div className="min-w-0 flex-1">
            <p
              id={titleId}
              className="truncate font-[family-name:var(--font-display)] text-[15px] font-semibold leading-tight tracking-[-0.01em]"
            >
              {settings.botName}
            </p>
            <p className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-[var(--color-offwhite)]/70">
              <span className="relative flex h-1.5 w-1.5">
                {!reduceMotion ? (
                  <motion.span
                    className="absolute inset-0 rounded-full bg-[var(--chat-accent)]"
                    animate={{ scale: [1, 2.2], opacity: [0.7, 0] }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  />
                ) : null}
                <span className="relative h-1.5 w-1.5 rounded-full bg-[var(--chat-accent)]" />
              </span>
              {statusLabel}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close chat"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--color-offwhite)]/70 transition-colors duration-[var(--duration-fast)] hover:bg-[var(--color-offwhite)]/10 hover:text-[var(--color-offwhite)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--chat-accent)]"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </header>

        {/* ---- AI disclosure: permanent, legible, never a scrolling message ---- */}
        <div className="flex shrink-0 items-start gap-2.5 border-b border-[var(--color-hairline-light)] bg-[var(--color-white)] px-4 py-2.5">
          <span
            aria-hidden="true"
            className="mt-[1px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[var(--chat-accent)]"
          >
            <Sparkles className="h-2.5 w-2.5 text-[var(--color-ink)]" />
          </span>
          <p
            id={disclosureId}
            className="text-[12px] font-medium leading-snug text-[var(--color-ink)]"
          >
            {settings.aiDisclosure}
          </p>
        </div>

        {/* ---- Body ---- */}
        {chat.phase === "lead" ? (
          <ChatLeadForm
            botName={settings.botName}
            submitting={chat.starting}
            initialName={chat.visitor.name}
            initialEmail={chat.visitor.email}
            onSubmit={(name, email) => {
              void chat.start(name, email);
            }}
          />
        ) : (
          <ChatMessageList
            messages={chat.messages}
            awaitingReply={chat.awaitingReply}
            restoring={chat.restoring}
          />
        )}

        {/* ---- Error strip ---- */}
        <AnimatePresence initial={false}>
          {chat.error ? (
            <motion.div
              key="error"
              role="status"
              initial={reduceMotion ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{
                duration: reduceMotion ? 0 : DURATION.fast,
                ease: EASE.standard,
              }}
              className="shrink-0 overflow-hidden border-t border-[#b3261e]/25 bg-[#b3261e]/[0.06]"
            >
              <div className="flex items-start gap-2 px-4 py-2.5 text-[12px] leading-snug text-[#8c1d18]">
                <CircleAlert
                  className="mt-[1px] h-3.5 w-3.5 shrink-0"
                  aria-hidden="true"
                />
                <span className="flex-1">{chat.error}</span>
                <button
                  type="button"
                  onClick={chat.dismissError}
                  className="shrink-0 font-medium underline underline-offset-2"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* ---- Composer, or the reason there is not one ---- */}
        {chat.phase === "chat" ? (
          <div className="shrink-0">
            {chat.closed || chat.remaining === 0 ? (
              <div className="border-t border-[var(--color-hairline-light)] bg-[var(--color-offwhite)] px-4 py-4">
                <p className="text-[12.5px] leading-snug text-[var(--color-mute)]">
                  {chat.closed
                    ? "The team closed this conversation. Start a new one whenever you need us."
                    : "This thread has reached its message limit. Start a new one, or email edgebrainstudios@gmail.com."}
                </p>
                <button
                  type="button"
                  onClick={chat.reset}
                  className="mt-3 inline-flex h-9 items-center rounded-[var(--radius-full)] bg-[var(--color-ink)] px-4 text-[12.5px] font-medium text-[var(--color-offwhite)] transition-colors duration-[var(--duration-fast)] hover:bg-[var(--color-ink)]/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--chat-accent)]"
                >
                  Start a new chat
                </button>
              </div>
            ) : (
              <ChatComposer
                disabled={chat.awaitingReply || chat.restoring}
                onSend={(message) => {
                  void chat.send(message);
                }}
              />
            )}
          </div>
        ) : null}
      </motion.div>
    </>
  );
}
