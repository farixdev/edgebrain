"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_HEIGHT = 128;

interface ChatComposerProps {
  disabled: boolean;
  onSend: (message: string) => void;
}

export function ChatComposer({ disabled, onSend }: ChatComposerProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus({ preventScroll: true });
  }, []);

  // Grow with the content, then scroll inside itself.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT)}px`;
  }, [value]);

  const submit = () => {
    const message = value.trim();
    if (!message || disabled) return;
    onSend(message);
    setValue("");
    textareaRef.current?.focus({ preventScroll: true });
  };

  const ready = value.trim().length > 0 && !disabled;

  return (
    <div className="border-t border-[var(--color-hairline-light)] bg-[var(--color-offwhite)] px-3 py-3">
      <div className="flex items-end gap-2 rounded-[var(--radius-md)] border border-[var(--color-hairline-light)] bg-[var(--color-white)] py-1.5 pl-3 pr-1.5 transition-colors duration-[var(--duration-fast)] focus-within:border-[var(--color-ink)]/40">
        <label htmlFor="eb-chat-input" className="sr-only">
          Type your message
        </label>
        <textarea
          id="eb-chat-input"
          ref={textareaRef}
          rows={1}
          value={value}
          disabled={disabled}
          placeholder="Ask about scope, timelines, cost…"
          enterKeyHint="send"
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              submit();
            }
          }}
          className="max-h-32 flex-1 resize-none bg-transparent py-1.5 text-[14px] leading-[1.5] text-[var(--color-ink)] outline-none placeholder:text-[var(--color-mute)]/70 disabled:opacity-60"
        />
        <button
          type="button"
          onClick={submit}
          disabled={!ready}
          aria-label="Send message"
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-[var(--duration-fast)] ease-[var(--ease-standard)]",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--chat-accent)]",
            ready
              ? "bg-[var(--chat-accent)] text-[var(--color-ink)] hover:scale-105 active:scale-95"
              : "cursor-not-allowed bg-[var(--color-hairline-light)] text-[var(--color-mute)]"
          )}
        >
          <ArrowUp className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <p className="mt-2 px-1 text-[10.5px] text-[var(--color-mute)]">
        Enter to send &middot; Shift + Enter for a new line
      </p>
    </div>
  );
}
