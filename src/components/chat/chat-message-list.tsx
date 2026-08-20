"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDown, Clock, Headset } from "lucide-react";
import { cn } from "@/lib/utils";
import { DURATION, EASE } from "@/lib/motion";
import type { UiMessage } from "./chat-types";

/* -------------------------------------------------------------------------- */
/* Linkify                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Absolute URLs, bare `www.` hosts, email addresses, and site-relative routes.
 *
 * The relative-route branch is the one worth caring about: the assistant is
 * grounded in site content and answers with paths like `/services/ai-automation`,
 * which should be clickable rather than read out as text.
 */
const TOKEN_RE =
  /(https?:\/\/[^\s<>]+|www\.[^\s<>]+|[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.[A-Za-z0-9.-]+|\/[a-z][a-z0-9-]+(?:\/[a-z0-9-]+)*)/g;

const TRAILING_PUNCTUATION = /[.,;:!?)\]}'"]+$/;

const linkClass =
  "underline decoration-[var(--chat-accent)] decoration-2 underline-offset-[3px] transition-colors duration-[var(--duration-fast)] hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--chat-accent)]";

function linkify(text: string): React.ReactNode {
  const nodes: React.ReactNode[] = [];
  let cursor = 0;
  let key = 0;

  TOKEN_RE.lastIndex = 0;
  let match = TOKEN_RE.exec(text);

  while (match !== null) {
    const start = match.index;
    const token = match[0].replace(TRAILING_PUNCTUATION, "");
    const previous = start > 0 ? text[start - 1] : "";

    // `24/7` and `and/or` are not routes. A path only counts when the slash
    // does not follow a word character.
    const isPath = token.startsWith("/");
    const validPath = isPath && !/[A-Za-z0-9]/.test(previous);

    if (token && (!isPath || validPath)) {
      if (start > cursor) nodes.push(text.slice(cursor, start));

      key += 1;
      if (isPath) {
        nodes.push(
          <Link key={`l${key}`} href={token} className={linkClass}>
            {token}
          </Link>
        );
      } else if (token.includes("@") && !token.includes("/")) {
        nodes.push(
          <a key={`l${key}`} href={`mailto:${token}`} className={linkClass}>
            {token}
          </a>
        );
      } else {
        const href = token.startsWith("http") ? token : `https://${token}`;
        nodes.push(
          <a
            key={`l${key}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            {token}
          </a>
        );
      }
      cursor = start + token.length;
    }

    TOKEN_RE.lastIndex = start + Math.max(token.length, 1);
    match = TOKEN_RE.exec(text);
  }

  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes.length ? nodes : text;
}

/** Keeps paragraph breaks from the model intact without dangerous HTML. */
function renderContent(content: string): React.ReactNode {
  const lines = content.split(/\n/);
  return lines.map((line, index) => (
    <Fragment key={index}>
      {index > 0 ? <br /> : null}
      {linkify(line)}
    </Fragment>
  ));
}

/* -------------------------------------------------------------------------- */
/* Time                                                                       */
/* -------------------------------------------------------------------------- */

function formatTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  try {
    return date.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

/* -------------------------------------------------------------------------- */
/* Bubble                                                                     */
/* -------------------------------------------------------------------------- */

interface BubbleProps {
  message: UiMessage;
  /** Last of a same-role run, so only it carries the timestamp. */
  showTime: boolean;
  /** First of a same-role run, so only it carries the Team badge. */
  showBadge: boolean;
  reduceMotion: boolean;
}

function Bubble({ message, showTime, showBadge, reduceMotion }: BubbleProps) {
  const isVisitor = message.role === "visitor";
  const isAdmin = message.role === "admin";

  return (
    <motion.li
      layout={reduceMotion ? false : "position"}
      initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: reduceMotion ? 0 : DURATION.base,
        ease: EASE.standard,
      }}
      className={cn(
        "flex w-full flex-col",
        isVisitor ? "items-end" : "items-start"
      )}
    >
      {isAdmin && showBadge ? (
        <span className="mb-1.5 inline-flex items-center gap-1.5 rounded-[var(--radius-full)] bg-[var(--color-ink)] px-2 py-[3px] font-[family-name:var(--font-display)] text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--chat-accent)]">
          <Headset className="h-3 w-3" aria-hidden="true" />
          Team
        </span>
      ) : null}

      <div
        className={cn(
          "max-w-[86%] whitespace-pre-wrap break-words px-3.5 py-2.5 text-[14px] leading-[1.55]",
          isVisitor &&
            "rounded-[var(--radius-md)] rounded-br-[4px] bg-[var(--color-ink)] text-[var(--color-offwhite)]",
          !isVisitor &&
            !isAdmin &&
            "rounded-[var(--radius-md)] rounded-bl-[4px] border border-[var(--color-hairline-light)] bg-[var(--color-white)] text-[var(--color-ink)] shadow-[0_1px_2px_rgba(14,14,14,0.04)]",
          isAdmin &&
            "rounded-[var(--radius-md)] rounded-bl-[4px] border border-[var(--color-hairline-light)] border-l-[3px] border-l-[var(--chat-accent)] bg-[var(--color-white)] text-[var(--color-ink)] shadow-[0_1px_2px_rgba(14,14,14,0.04)]"
        )}
      >
        {isAdmin ? <span className="sr-only">From the team: </span> : null}
        {renderContent(message.content)}
      </div>

      {message.escalated ? (
        <div className="mt-2 flex max-w-[86%] items-start gap-2 rounded-[var(--radius-md)] border border-dashed border-[var(--color-ink)]/20 px-3 py-2 text-[11.5px] leading-snug text-[var(--color-mute)]">
          <Clock className="mt-[2px] h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>
            Passed to a human. Someone from the team replies here, and by email
            if you have closed the tab.
          </span>
        </div>
      ) : null}

      {showTime ? (
        <time
          dateTime={message.createdAt}
          className="mt-1 px-1 text-[10.5px] tabular-nums tracking-wide text-[var(--color-mute)]"
        >
          {formatTime(message.createdAt)}
        </time>
      ) : null}
    </motion.li>
  );
}

/* -------------------------------------------------------------------------- */
/* Typing indicator                                                           */
/* -------------------------------------------------------------------------- */

function TypingIndicator({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <motion.li
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{
        duration: reduceMotion ? 0 : DURATION.fast,
        ease: EASE.standard,
      }}
      className="flex items-start"
    >
      <span className="sr-only">Assistant is typing</span>
      <div className="flex items-center gap-1.5 rounded-[var(--radius-md)] rounded-bl-[4px] border border-[var(--color-hairline-light)] bg-[var(--color-white)] px-3.5 py-3 shadow-[0_1px_2px_rgba(14,14,14,0.04)]">
        {[0, 1, 2].map((dot) => (
          <motion.span
            key={dot}
            aria-hidden="true"
            className="block h-[6px] w-[6px] rounded-full bg-[var(--color-ink)]"
            animate={
              reduceMotion
                ? { opacity: 0.45 }
                : { opacity: [0.25, 1, 0.25], y: [0, -3, 0] }
            }
            transition={
              reduceMotion
                ? { duration: 0 }
                : {
                    duration: 1.1,
                    ease: "easeInOut",
                    repeat: Infinity,
                    delay: dot * 0.15,
                  }
            }
          />
        ))}
      </div>
    </motion.li>
  );
}

/* -------------------------------------------------------------------------- */
/* List                                                                       */
/* -------------------------------------------------------------------------- */

interface ChatMessageListProps {
  messages: UiMessage[];
  awaitingReply: boolean;
  restoring: boolean;
}

const STICK_THRESHOLD = 72;

export function ChatMessageList({
  messages,
  awaitingReply,
  restoring,
}: ChatMessageListProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const scrollerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  /** False once the visitor scrolls up to read; we never yank them back. */
  const stickRef = useRef(true);
  const [showJump, setShowJump] = useState(false);

  const scrollToEnd = useCallback(
    (behavior: ScrollBehavior) => {
      endRef.current?.scrollIntoView({
        behavior: reduceMotion ? "auto" : behavior,
        block: "end",
      });
      stickRef.current = true;
      setShowJump(false);
    },
    [reduceMotion]
  );

  /**
   * The only place `showJump` is written from - a scroll event, never an
   * effect. The pill is a function of where the visitor is in the thread, so
   * new messages arriving while they read do not move anything under them.
   */
  const handleScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    stickRef.current = distance < STICK_THRESHOLD;
    setShowJump(!stickRef.current);
  }, []);

  // New content: follow it only if the visitor was already at the bottom.
  useEffect(() => {
    if (!stickRef.current) return;
    endRef.current?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "end",
    });
  }, [messages, awaitingReply, reduceMotion]);

  // Land at the bottom on the first paint of a restored thread.
  useEffect(() => {
    if (restoring) return;
    endRef.current?.scrollIntoView({ block: "end" });
  }, [restoring]);

  return (
    <div className="relative min-h-0 flex-1">
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        data-lenis-prevent
        className="h-full overflow-y-auto overscroll-contain px-4 py-4 [scrollbar-width:thin]"
      >
        <ul
          aria-live="polite"
          aria-relevant="additions text"
          aria-busy={restoring}
          className="flex flex-col gap-3"
        >
          {restoring ? (
            <li className="py-6 text-center text-[12px] text-[var(--color-mute)]">
              Picking up where you left off&hellip;
            </li>
          ) : null}

          {messages.map((message, index) => {
            const next = messages[index + 1];
            const previous = messages[index - 1];
            return (
              <Bubble
                key={message.id}
                message={message}
                reduceMotion={reduceMotion}
                showTime={!next || next.role !== message.role}
                showBadge={!previous || previous.role !== message.role}
              />
            );
          })}

          <AnimatePresence initial={false}>
            {awaitingReply ? (
              <TypingIndicator key="typing" reduceMotion={reduceMotion} />
            ) : null}
          </AnimatePresence>
        </ul>
        <div ref={endRef} aria-hidden="true" className="h-px" />
      </div>

      <AnimatePresence>
        {showJump ? (
          <motion.button
            type="button"
            onClick={() => scrollToEnd("smooth")}
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{
              duration: reduceMotion ? 0 : DURATION.fast,
              ease: EASE.standard,
            }}
            className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-[var(--radius-full)] bg-[var(--color-ink)] px-3 py-1.5 text-[11.5px] font-medium text-[var(--color-offwhite)] shadow-[0_6px_18px_-8px_rgba(14,14,14,0.6)]"
          >
            <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
            Newest
          </motion.button>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
