/**
 * POST /api/chat/start — open a conversation.
 *
 * The widget collects a name and an email before the first message, so this is
 * the only place a `chat_conversations` row is created. It returns the id the
 * other two routes key off, plus the presentation settings the widget needs
 * (bot name, greeting, AI disclosure, accent colour) so the widget never has to
 * hard-code copy the owner can edit.
 *
 * The greeting is deliberately NOT stored as a message. Storing it would mark
 * the thread unread for the owner via the `chat_messages_touch` trigger before
 * the visitor has actually said anything, filling the admin inbox with threads
 * nobody started. The widget renders it client-side instead.
 */

import { NextResponse } from "next/server";

import {
  createConversation,
  getChatSettings,
  isDbConfigured,
} from "@/lib/db";
import {
  allowNewConversation,
  clientKey,
  fail,
  GENERIC_FAILURE,
  MAX_MESSAGE_LENGTH,
  MAX_VISITOR_MESSAGES,
  NOT_CONFIGURED,
  asClipped,
  readJsonBody,
  validateEmail,
  validateName,
} from "../_lib/chat-core";

/** Reads request headers and writes to Postgres — never prerender this. */
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    if (!isDbConfigured()) {
      console.error("[chat/start] DATABASE_URL is not set.");
      return fail("not_configured", NOT_CONFIGURED, 503);
    }

    const settings = await getChatSettings();
    if (!settings.enabled) {
      return fail(
        "chat_disabled",
        "Live chat is switched off right now. Please use the contact form and we will reply within 24 hours.",
        503
      );
    }

    const body = await readJsonBody(request);
    if (!body) {
      return fail("invalid_request", "Expected a JSON body.", 400);
    }

    const name = validateName(body.name);
    if (!name.ok) return fail("invalid_request", name.message, 400);

    const email = validateEmail(body.email);
    if (!email.ok) return fail("invalid_request", email.message, 400);

    if (!allowNewConversation(clientKey(request))) {
      return fail(
        "rate_limited",
        "That is a lot of new chats in a short time. Please continue in your existing chat, or email edgebrainstudios@gmail.com.",
        429
      );
    }

    const conversation = await createConversation({
      name: name.value,
      email: email.value,
      pageUrl: asClipped(body.pageUrl, 500),
      referrer:
        asClipped(body.referrer, 500) ??
        asClipped(request.headers.get("referer"), 500),
      userAgent: asClipped(request.headers.get("user-agent"), 400),
    });

    return NextResponse.json({
      conversationId: conversation.id,
      status: conversation.status,
      createdAt: conversation.createdAt,
      botName: settings.botName,
      greeting: settings.greeting,
      aiDisclosure: settings.aiDisclosure,
      accentColor: settings.accentColor,
      maxMessageLength: MAX_MESSAGE_LENGTH,
      messageLimit: MAX_VISITOR_MESSAGES,
      messages: [],
    });
  } catch (error) {
    console.error("[chat/start] failed:", error);
    return fail("server_error", GENERIC_FAILURE, 500);
  }
}
