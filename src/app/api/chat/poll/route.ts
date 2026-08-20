/**
 * GET /api/chat/poll?conversationId=…&since=… — what happened since I last looked.
 *
 * This is the channel that makes a human reply appear in an open widget. When
 * the owner answers from the admin inbox the message lands in `chat_messages`
 * with role `admin`; the next poll picks it up and the visitor sees it without
 * refreshing.
 *
 * `since` is an ISO timestamp — pass the `createdAt` of the newest message you
 * already have and you get back only what is newer. Omit it and you get the
 * whole transcript, which is what a widget resuming a session after a reload
 * wants.
 *
 * The response is deliberately cheap: no model call, one indexed read, and
 * `no-store` so nothing between here and the browser caches a stale answer.
 */

import { NextResponse } from "next/server";

import {
  getConversation,
  getMessages,
  isDbConfigured,
  type ChatMessage,
} from "@/lib/db";
import {
  fail,
  GENERIC_FAILURE,
  MAX_VISITOR_MESSAGES,
  NOT_CONFIGURED,
  validateConversationId,
} from "../_lib/chat-core";

/** Reads live rows on every request — never prerender or cache this. */
export const dynamic = "force-dynamic";

const NO_STORE = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
} as const;

/**
 * Milliseconds for a caller-supplied `since`, or `null` when it is absent or
 * unparseable. A bad value is treated as "give me everything" rather than an
 * error — a widget with a corrupt timestamp should recover, not break.
 */
function parseSince(raw: string | null): number | null {
  if (!raw) return null;
  const at = Date.parse(raw);
  return Number.isNaN(at) ? null : at;
}

function isNewerThan(message: ChatMessage, since: number): boolean {
  return Date.parse(message.createdAt) > since;
}

export async function GET(request: Request) {
  try {
    if (!isDbConfigured()) {
      console.error("[chat/poll] DATABASE_URL is not set.");
      return fail("not_configured", NOT_CONFIGURED, 503);
    }

    const params = new URL(request.url).searchParams;

    const id = validateConversationId(params.get("conversationId"));
    if (!id.ok) return fail("invalid_request", id.message, 400);

    const conversation = await getConversation(id.value);
    if (!conversation) {
      return fail(
        "not_found",
        "We could not find that chat. Refresh the page to start a new one.",
        404
      );
    }

    const since = parseSince(params.get("since"));
    const all = await getMessages(conversation.id);
    const messages =
      since === null
        ? all
        : all.filter((message) => isNewerThan(message, since));

    const visitorTurns = all.filter(
      (message) => message.role === "visitor"
    ).length;

    return NextResponse.json(
      {
        conversationId: conversation.id,
        status: conversation.status,
        closed: conversation.status === "closed",
        needsHuman: conversation.status === "needs_human",
        lastMessageAt: conversation.lastMessageAt,
        messages,
        remaining: Math.max(0, MAX_VISITOR_MESSAGES - visitorTurns),
      },
      { headers: NO_STORE }
    );
  } catch (error) {
    console.error("[chat/poll] failed:", error);
    return fail("server_error", GENERIC_FAILURE, 500);
  }
}
