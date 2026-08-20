"use client";

/**
 * Chat Settings tab.
 *
 * Every column of `chat_settings` is editable here, because the point of that
 * table is that none of it should require a redeploy — least of all the model
 * id, which is the field most likely to break on someone else's schedule when
 * a hosted model is retired.
 *
 * Each control carries helper text explaining what it actually does, since the
 * person using this panel is the studio owner, not the developer who wrote the
 * prompt plumbing.
 */

import { useCallback, useEffect, useState } from "react";
import type { ChatSettings } from "@/lib/db";
import {
  BTN_PRIMARY,
  BTN_SECONDARY,
  CARD,
  HELP,
  INPUT,
  LABEL,
  TEXTAREA,
} from "./styles";

/** Matches the schema default; shown as a hint, never silently written. */
const RECOMMENDED_MODEL = "openai/gpt-oss-120b";

export interface ChatSettingsPanelProps {
  email: string;
  password: string;
  onToast: (msg: string, ok: boolean) => void;
  onUnauthorized: () => void;
}

function Field({
  label,
  help,
  children,
}: {
  label: string;
  help?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={LABEL}>{label}</label>
      {children}
      {help && <p className={HELP}>{help}</p>}
    </div>
  );
}

export function ChatSettingsPanel({
  email,
  password,
  onToast,
  onUnauthorized,
}: ChatSettingsPanelProps) {
  const [settings, setSettings] = useState<ChatSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const authHeaders = useCallback(
    (): HeadersInit => ({
      "x-admin-email": email,
      "x-admin-password": password,
    }),
    [email, password]
  );

  /**
   * No `setLoading(true)` before the first `await`: a state update that runs
   * synchronously inside an effect body causes a cascading render, and the
   * React Compiler lint rule rightly rejects it. `loading` already starts
   * `true`, and the manual Discard button sets it itself.
   */
  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/chat-settings", {
        headers: authHeaders(),
        cache: "no-store",
      });
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      if (!res.ok) throw new Error("Could not load chat settings");
      const data = (await res.json()) as { settings: ChatSettings };
      setSettings(data.settings);
    } catch (err) {
      onToast(err instanceof Error ? err.message : "Load failed", false);
    } finally {
      setLoading(false);
    }
  }, [authHeaders, onToast, onUnauthorized]);

  useEffect(() => {
    // `load` is a useCallback, and the lint rule reads a direct call from an
    // effect body as a synchronous setState even when every update inside it
    // happens after an await. The local wrapper makes that deferral explicit.
    const run = async () => {
      await load();
    };
    void run();
  }, [load]);

  /** Discard: re-read from the server, with the spinner this time. */
  const reload = () => {
    setLoading(true);
    void load();
  };

  const set = <K extends keyof ChatSettings>(key: K, value: ChatSettings[K]) => {
    setSettings((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const save = async () => {
    if (!settings || saving) return;
    setSaving(true);
    try {
      // `updatedAt` is the server's to set; sending it back would be noise.
      const { updatedAt: _ignored, ...payload } = settings;
      void _ignored;

      const res = await fetch("/api/admin/chat-settings", {
        method: "PUT",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Save failed");
      setSettings(data.settings as ChatSettings);
      onToast("Chat settings saved", true);
    } catch (err) {
      onToast(err instanceof Error ? err.message : "Save failed", false);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <p className="py-16 text-center text-sm text-white/30">
        Loading chat settings&hellip;
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">Chat Settings</h3>
          {settings.updatedAt && (
            <p className="text-xs text-white/30">
              Last saved {new Date(settings.updatedAt).toLocaleString()}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={reload} className={BTN_SECONDARY} disabled={saving}>
            Discard
          </button>
          <button onClick={() => void save()} className={BTN_PRIMARY} disabled={saving}>
            {saving ? "Saving…" : "Save settings"}
          </button>
        </div>
      </div>

      {/* ---------------- Master switch ---------------- */}
      <div className={CARD}>
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={(e) => set("enabled", e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-[#FFD400]"
          />
          <span>
            <span className="block text-sm font-medium text-white">
              Chat widget enabled
            </span>
            <span className={HELP}>
              Off removes the bubble from every public page immediately &mdash;
              no redeploy. Existing conversations stay in the Inbox; visitors
              just cannot start new ones.
            </span>
          </span>
        </label>
      </div>

      {/* ---------------- What the visitor sees ---------------- */}
      <div className={CARD}>
        <h4 className="text-sm font-semibold text-white">What the visitor sees</h4>

        <Field
          label="Bot name"
          help="Shown in the widget header and above each of its replies."
        >
          <input
            className={INPUT}
            value={settings.botName}
            onChange={(e) => set("botName", e.target.value)}
            maxLength={80}
          />
        </Field>

        <Field
          label="Greeting"
          help="The first thing in the window, before the visitor has typed anything."
        >
          <textarea
            className={TEXTAREA}
            value={settings.greeting}
            onChange={(e) => set("greeting", e.target.value)}
            maxLength={500}
          />
        </Field>

        <Field
          label="AI disclosure"
          help="Rendered as persistent UI rather than a message, so it cannot scroll away. Saying plainly that this is a bot is both the honest thing and, in several markets, the required one."
        >
          <textarea
            className={TEXTAREA}
            value={settings.aiDisclosure}
            onChange={(e) => set("aiDisclosure", e.target.value)}
            maxLength={500}
          />
        </Field>

        <Field
          label="Accent colour"
          help="The widget's highlight colour. Defaults to the brand yellow."
        >
          <div className="flex items-center gap-2">
            <input
              className={INPUT}
              value={settings.accentColor}
              onChange={(e) => set("accentColor", e.target.value)}
              placeholder="#FFD400"
              maxLength={32}
            />
            <span
              className="h-9 w-9 shrink-0 rounded border border-white/10"
              style={{ backgroundColor: settings.accentColor }}
            />
          </div>
        </Field>
      </div>

      {/* ---------------- Model behaviour ---------------- */}
      <div className={CARD}>
        <h4 className="text-sm font-semibold text-white">Model behaviour</h4>

        <Field
          label="Extra prompt instructions"
          help="Appended to the system prompt the bot runs under, after the site knowledge it is allowed to answer from. Use it for positioning and rules — “never quote a fixed price”, “always mention we work in the client's timezone”. It cannot give the bot new facts; anything factual belongs in the site content, which is what the bot is grounded on."
        >
          <textarea
            className={`${TEXTAREA} min-h-[140px] font-mono text-xs`}
            value={settings.promptExtra}
            onChange={(e) => set("promptExtra", e.target.value)}
            maxLength={8000}
            placeholder="e.g. Never quote a fixed price. Offer a call instead."
          />
        </Field>

        <Field
          label="Model id"
          help={`Groq model id, stored as data on purpose: when a hosted model is retired the fix is typing a new id here, not a redeploy. Current default is ${RECOMMENDED_MODEL}. Only change this if you know the replacement follows the grounding rule as strictly.`}
        >
          <div className="flex flex-wrap items-center gap-2">
            <input
              className={`${INPUT} font-mono flex-1 min-w-[220px]`}
              value={settings.model}
              onChange={(e) => set("model", e.target.value)}
              maxLength={120}
              spellCheck={false}
            />
            {settings.model !== RECOMMENDED_MODEL && (
              <button
                onClick={() => set("model", RECOMMENDED_MODEL)}
                className="shrink-0 rounded-md px-2 py-1 text-xs text-white/40 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
              >
                Reset to default
              </button>
            )}
          </div>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label={`Temperature — ${settings.temperature.toFixed(2)}`}
            help="How much the model improvises. Low is what you want here: this bot's job is to repeat what the site says, accurately."
          >
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={settings.temperature}
              onChange={(e) => set("temperature", Number(e.target.value))}
              className="w-full accent-[#FFD400]"
            />
            <div className="mt-1 flex justify-between text-[10px] text-white/25">
              <span>0 · literal</span>
              <span>1 · loose</span>
            </div>
          </Field>

          <Field
            label="Max tokens per reply"
            help="Hard ceiling on reply length. ~700 is three or four short paragraphs. Raising it raises cost and latency."
          >
            <input
              type="number"
              className={INPUT}
              min={64}
              max={8000}
              step={50}
              value={settings.maxTokens}
              onChange={(e) => set("maxTokens", Number(e.target.value))}
            />
          </Field>
        </div>

        <Field
          label="Fallback message"
          help="Sent verbatim when the bot cannot ground an answer in the site content. This is the sentence that turns a hallucination into a lead — it should promise a human, and the Inbox should be where that human shows up."
        >
          <textarea
            className={TEXTAREA}
            value={settings.fallbackMessage}
            onChange={(e) => set("fallbackMessage", e.target.value)}
            maxLength={800}
          />
        </Field>
      </div>

      {/* ---------------- Notifications ---------------- */}
      <div className={CARD}>
        <h4 className="text-sm font-semibold text-white">Notifications</h4>

        <Field
          label="Notify this address"
          help="Where escalation emails go. Usually the studio inbox you actually watch."
        >
          <input
            type="email"
            className={INPUT}
            value={settings.notifyEmail}
            onChange={(e) => set("notifyEmail", e.target.value)}
            maxLength={200}
          />
        </Field>

        <label className="flex cursor-pointer items-start gap-3 pt-1">
          <input
            type="checkbox"
            checked={settings.notifyOnEvery}
            onChange={(e) => set("notifyOnEvery", e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-[#FFD400]"
          />
          <span>
            <span className="block text-sm font-medium text-white">
              Email me about every new conversation
            </span>
            <span className={HELP}>
              Off (recommended) means you are emailed only when the bot escalates
              and a human is actually needed. On means every visitor who opens the
              chat sends you mail &mdash; useful for the first week, noise after
              that.
            </span>
          </span>
        </label>
      </div>

      <div className="flex justify-end gap-2 pb-2">
        <button onClick={reload} className={BTN_SECONDARY} disabled={saving}>
          Discard
        </button>
        <button onClick={() => void save()} className={BTN_PRIMARY} disabled={saving}>
          {saving ? "Saving…" : "Save settings"}
        </button>
      </div>
    </div>
  );
}
