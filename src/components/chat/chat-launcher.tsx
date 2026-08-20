"use client";

import { forwardRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { DURATION, EASE } from "@/lib/motion";

interface ChatLauncherProps {
  label: string;
  hint: string;
  /** A single slow breathing ring, retired once the visitor has engaged. */
  pulse: boolean;
  onOpen: () => void;
}

/**
 * The resting state of the widget: an ink disc with one accent ring breathing
 * behind it. The ring is the only motion on the page that loops, so it stops
 * for good the first time the panel is opened.
 */
export const ChatLauncher = forwardRef<HTMLButtonElement, ChatLauncherProps>(
  function ChatLauncher({ label, hint, pulse, onOpen }, ref) {
    const reduceMotion = useReducedMotion();

    return (
      <motion.div
        className="group fixed bottom-5 right-5 z-[95] sm:bottom-6 sm:right-6"
        initial={{ opacity: 0, scale: 0.7, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.6, y: 8 }}
        transition={{
          duration: reduceMotion ? 0 : DURATION.base,
          ease: EASE.standard,
        }}
      >
        {/* Desktop-only affordance: a pill that slides out of the disc. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-16 top-1/2 hidden -translate-y-1/2 translate-x-2 whitespace-nowrap rounded-[var(--radius-full)] bg-[var(--color-ink)] px-3.5 py-2 font-[family-name:var(--font-display)] text-[13px] font-medium text-[var(--color-offwhite)] opacity-0 shadow-[0_8px_20px_-10px_rgba(14,14,14,0.6)] transition-all duration-[var(--duration-base)] ease-[var(--ease-standard)] group-hover:translate-x-0 group-hover:opacity-100 group-focus-within:translate-x-0 group-focus-within:opacity-100 sm:block"
        >
          {hint}
        </span>

        <button
          ref={ref}
          type="button"
          onClick={onOpen}
          aria-label={label}
          aria-haspopup="dialog"
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-ink)] text-[var(--color-offwhite)] shadow-[0_2px_6px_rgba(14,14,14,0.18),0_14px_34px_-12px_rgba(14,14,14,0.55)] outline-offset-4 transition-transform duration-[var(--duration-base)] ease-[var(--ease-standard)] hover:scale-[1.06] active:scale-95 sm:h-[3.75rem] sm:w-[3.75rem]"
        >
          {pulse && !reduceMotion ? (
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 rounded-full border border-[var(--chat-accent)]"
              animate={{ scale: [1, 1.45], opacity: [0.55, 0] }}
              transition={{
                duration: 2.6,
                ease: "easeOut",
                repeat: Infinity,
                repeatDelay: 1.4,
              }}
            />
          ) : null}

          {/* A hairline of accent that only shows on hover, keeping the
              resting disc quiet. */}
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full ring-0 ring-[var(--chat-accent)] transition-all duration-[var(--duration-base)] ease-[var(--ease-standard)] group-hover:ring-2"
          />

          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="relative h-[26px] w-[26px]"
            fill="none"
          >
            <path
              d="M5 5.6h14A1.9 1.9 0 0 1 20.9 7.5v7.2A1.9 1.9 0 0 1 19 16.6h-6.2l-3.9 2.9a.55.55 0 0 1-.88-.44v-2.46H5A1.9 1.9 0 0 1 3.1 14.7V7.5A1.9 1.9 0 0 1 5 5.6Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <circle cx="8.6" cy="11.1" r="1.05" fill="currentColor" />
            <circle cx="12" cy="11.1" r="1.05" fill="currentColor" />
            <circle cx="15.4" cy="11.1" r="1.35" fill="var(--chat-accent)" />
          </svg>
        </button>
      </motion.div>
    );
  }
);
