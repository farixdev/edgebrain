/**
 * Shared vocabulary for the chat widget.
 *
 * Mirrors the server-side `ChatSettings` / `MessageRole` shapes in `@/lib/db`
 * without importing them, so this module stays free of anything that would drag
 * the Neon client into the browser bundle.
 */

export type ChatRole = "visitor" | "assistant" | "admin";

/** The subset of `chat_settings` the browser is allowed to know about. */
export interface ChatWidgetSettings {
  enabled: boolean;
  botName: string;
  greeting: string;
  aiDisclosure: string;
  accentColor: string;
}

export const CHAT_WIDGET_DEFAULTS: ChatWidgetSettings = {
  enabled: true,
  botName: "EdgeBrain Assistant",
  greeting:
    "Hi. Ask me anything about what we build, how we work, or what a project costs.",
  aiDisclosure:
    "You are chatting with our AI assistant. A human will step in when it cannot help.",
  accentColor: "#FFD400",
};

/**
 * A message as rendered.
 *
 * `origin` is how we reconcile the optimistic UI with the poll feed:
 * - `local`     never existed server-side (the greeting) — never deduped, never
 *               advances the poll cursor.
 * - `optimistic` we rendered it before the server echoed it back; the next poll
 *               that returns a matching role+content upgrades it in place
 *               instead of appending a duplicate.
 * - `server`    came from `/api/chat/poll`; its `createdAt` is authoritative and
 *               drives the `since` cursor.
 */
export interface UiMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
  escalated: boolean;
  origin: "local" | "optimistic" | "server";
}

export function normalizeRole(value: unknown): ChatRole {
  return value === "visitor" || value === "admin" ? value : "assistant";
}
