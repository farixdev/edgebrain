"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const ERROR_COLOR = "#b3261e";

interface FieldErrors {
  name?: string;
  email?: string;
}

function validate(name: string, email: string): FieldErrors {
  const errors: FieldErrors = {};
  if (name.trim().length < 2) errors.name = "Please tell us what to call you.";
  if (!EMAIL_RE.test(email.trim()))
    errors.email = "That email does not look right.";
  return errors;
}

interface ChatLeadFormProps {
  botName: string;
  submitting: boolean;
  initialName: string;
  initialEmail: string;
  onSubmit: (name: string, email: string) => void;
}

/**
 * Two fields, no more. Anything else here is a form the visitor did not ask
 * for, and the whole point of the widget is that talking is cheaper than a
 * contact page.
 */
export function ChatLeadForm({
  botName,
  submitting,
  initialName,
  initialEmail,
  onSubmit,
}: ChatLeadFormProps) {
  const nameId = useId();
  const emailId = useId();
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<{ name: boolean; email: boolean }>({
    name: false,
    email: false,
  });
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameRef.current?.focus({ preventScroll: true });
  }, []);

  const revalidate = (nextName: string, nextEmail: string) => {
    const next = validate(nextName, nextEmail);
    setErrors((prev) => ({
      name: touched.name ? next.name : prev.name && next.name,
      email: touched.email ? next.email : prev.email && next.email,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = validate(name, email);
    setTouched({ name: true, email: true });
    setErrors(next);
    if (next.name || next.email) return;
    onSubmit(name.trim(), email.trim());
  };

  const fieldClass = (invalid: boolean) =>
    cn(
      "w-full rounded-[var(--radius-md)] border bg-[var(--color-white)] px-3.5 py-2.5 text-[14px] text-[var(--color-ink)] outline-none transition-colors duration-[var(--duration-fast)]",
      "placeholder:text-[var(--color-mute)]/70",
      "focus-visible:border-[var(--color-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--chat-accent)]",
      invalid
        ? "border-[color:var(--chat-error)]"
        : "border-[var(--color-hairline-light)] hover:border-[var(--color-ink)]/30"
    );

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      style={{ "--chat-error": ERROR_COLOR } as React.CSSProperties}
      className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-5 py-6"
      data-lenis-prevent
    >
      <div>
        <h3 className="text-display-sm">Before we start</h3>
        <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--color-mute)]">
          {botName} answers straight away. We take your email so a human can
          pick the thread back up if the answer needs one.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <label
            htmlFor={nameId}
            className="mb-1.5 block font-[family-name:var(--font-display)] text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink)]"
          >
            Your name
          </label>
          <input
            ref={nameRef}
            id={nameId}
            name="name"
            type="text"
            autoComplete="name"
            enterKeyHint="next"
            value={name}
            disabled={submitting}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${nameId}-error` : undefined}
            placeholder="Your name"
            onChange={(event) => {
              setName(event.target.value);
              revalidate(event.target.value, email);
            }}
            onBlur={() => {
              setTouched((prev) => ({ ...prev, name: true }));
              setErrors((prev) => ({ ...prev, name: validate(name, email).name }));
            }}
            className={fieldClass(Boolean(errors.name))}
          />
          {errors.name ? (
            <p
              id={`${nameId}-error`}
              className="mt-1.5 flex items-center gap-1.5 text-[12px] text-[color:var(--chat-error)]"
            >
              <CircleAlert className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor={emailId}
            className="mb-1.5 block font-[family-name:var(--font-display)] text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink)]"
          >
            Email
          </label>
          <input
            id={emailId}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            enterKeyHint="send"
            value={email}
            disabled={submitting}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${emailId}-error` : undefined}
            placeholder="you@company.com"
            onChange={(event) => {
              setEmail(event.target.value);
              revalidate(name, event.target.value);
            }}
            onBlur={() => {
              setTouched((prev) => ({ ...prev, email: true }));
              setErrors((prev) => ({
                ...prev,
                email: validate(name, email).email,
              }));
            }}
            className={fieldClass(Boolean(errors.email))}
          />
          {errors.email ? (
            <p
              id={`${emailId}-error`}
              className="mt-1.5 flex items-center gap-1.5 text-[12px] text-[color:var(--chat-error)]"
            >
              <CircleAlert className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {errors.email}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-auto">
        <Button
          type="submit"
          size="default"
          disabled={submitting}
          className="w-full bg-[var(--chat-accent)]"
        >
          <span>{submitting ? "Opening the thread…" : "Start chatting"}</span>
        </Button>
        <p className="mt-3 text-[11.5px] leading-snug text-[var(--color-mute)]">
          Used only to reply to you. No list, no newsletter.
        </p>
      </div>
    </form>
  );
}
