/**
 * POST /api/chat/message — one visitor turn in, one assistant turn out.
 *
 * The grounding contract lives here. The model is handed the part of the
 * site's own content this question needs as CONTEXT — see `selectKnowledge`,
 * and `src/lib/token-budget.ts` for why it is a part and not the whole thing —
 * and told that anything outside it must produce the `[[ESCALATE]]` sentinel
 * rather than a guess. When that sentinel arrives — or
 * when the model call fails for any reason at all — this route takes the same
 * branch: store the owner's fallback sentence as the reply, flag the message
 * `escalated`, move the thread to `needs_human`, and email the owner the whole
 * transcript.
 *
 * A visitor therefore never sees a model error and never sees an invented
 * answer. They see one of two things: a grounded reply, or a sentence saying a
 * person will follow up. Both are true.
 */

import { NextResponse } from "next/server";

import {
  addMessage,
  getChatSettings,
  getConversation,
  getMessages,
  isDbConfigured,
  setConversationStatus,
  type ChatMessage,
  type ChatSettings,
  type Conversation,
  type ConversationStatus,
} from "@/lib/db";
import {
  buildSystemPrompt,
  callGroq,
  fail,
  GENERIC_FAILURE,
  hasSentinel,
  MAX_VISITOR_MESSAGES,
  NOT_CONFIGURED,
  readJsonBody,
  stripSentinel,
  toPromptHistory,
  notifyOwner,
  validateConversationId,
  validateMessage,
  type PromptMessage,
} from "../_lib/chat-core";

/** Writes to Postgres and calls a third-party API — never prerender this. */
export const dynamic = "force-dynamic";
/** The Groq call is given 25s, so the handler needs headroom above that. */
export const maxDuration = 45;

/**
 * Decides what the assistant says.
 *
 * Returns the reply text plus whether this turn escalated, along with the
 * server-side reason so the log explains *why* a thread went to a human.
 */
async function resolveReply(
  settings: ChatSettings,
  conversation: Conversation,
  history: ChatMessage[]
): Promise<{ content: string; escalated: boolean; reason: string }> {
  const system = await buildSystemPrompt(settings, conversation, history);
  const messages: PromptMessage[] = [
    { role: "system", content: system },
    ...toPromptHistory(history),
  ];

  const result = await callGroq(settings, messages);

  if (!result.ok) {
    return {
      content: settings.fallbackMessage,
      escalated: true,
      reason: result.reason,
    };
  }

  if (hasSentinel(result.content)) {
    return {
      content: settings.fallbackMessage,
      escalated: true,
      reason: "The assistant could not ground an answer in site content.",
    };
  }

  // A completion that is only whitespace once cleaned is no answer at all.
  const clean = stripSentinel(result.content);
  if (!clean) {
    return {
      content: settings.fallbackMessage,
      escalated: true,
      reason: "The assistant returned no usable text.",
    };
  }

  return { content: clean, escalated: false, reason: "" };
}

export async function POST(request: Request) {
  try {
    if (!isDbConfigured()) {
      console.error("[chat/message] DATABASE_URL is not set.");
      return fail("not_configured", NOT_CONFIGURED, 503);
    }

    const body = await readJsonBody(request);
    if (!body) {
      return fail("invalid_request", "Expected a JSON body.", 400);
    }

    const id = validateConversationId(body.conversationId);
    if (!id.ok) return fail("invalid_request", id.message, 400);

    const text = validateMessage(body.message);
    if (!text.ok) return fail("invalid_request", text.message, 400);

    const settings = await getChatSettings();
    if (!settings.enabled) {
      return fail(
        "chat_disabled",
        "Live chat is switched off right now. Please use the contact form and we will reply within 24 hours.",
        503
      );
    }

    const conversation = await getConversation(id.value);
    if (!conversation) {
      return fail(
        "not_found",
        "We could not find that chat. Refresh the page to start a new one.",
        404
      );
    }

    if (conversation.status === "closed") {
      return fail(
        "conversation_closed",
        "This chat has been closed. Refresh the page to start a new one.",
        409
      );
    }

    const history = await getMessages(conversation.id);
    const visitorTurns = history.filter(
      (message) => message.role === "visitor"
    ).length;

    if (visitorTurns >= MAX_VISITOR_MESSAGES) {
      return fail(
        "rate_limited",
        `This chat has reached its ${MAX_VISITOR_MESSAGES}-message limit. Email edgebrainstudios@gmail.com and a senior engineer will pick it up from here.`,
        429
      );
    }

    /* ---- Store the visitor turn first ---------------------------------- */
    // Written before the model is called, so a timeout or a crash still leaves
    // the question in the owner's inbox.
    const visitorMessage = await addMessage({
      conversationId: conversation.id,
      role: "visitor",
      content: text.value,
    });

    const transcript = [...history, visitorMessage];

    /* ---- Optional "new conversation" notice ----------------------------- */
    // Kicked off now and awaited at the end, so the mail round-trip overlaps
    // the model call instead of stacking on top of it.
    const newConversationNotice =
      visitorTurns === 0 && settings.notifyOnEvery
        ? notifyOwner({
            settings,
            conversation,
            messages: transcript,
            subject: `New chat — ${conversation.visitorName}`,
            headline: "A new chat conversation started",
            reason:
              "You have notifications set to every new conversation, so this is not an escalation. The assistant is handling it.",
          })
        : null;

    /* ---- Ask the model ------------------------------------------------- */
    const reply = await resolveReply(settings, conversation, transcript);

    const assistantMessage = await addMessage({
      conversationId: conversation.id,
      role: "assistant",
      content: reply.content,
      escalated: reply.escalated,
    });

    /* ---- Escalation ----------------------------------------------------- */
    let status: ConversationStatus = conversation.status;

    if (reply.escalated) {
      console.warn(
        `[chat/message] escalating ${conversation.id}: ${reply.reason}`
      );

      try {
        const updated = await setConversationStatus(
          conversation.id,
          "needs_human"
        );
        status = updated?.status ?? "needs_human";
      } catch (error) {
        // The reply is already stored; a failed status write must not cost the
        // visitor their answer. The email below still reaches the owner.
        console.error("[chat/message] could not flag needs_human:", error);
        status = "needs_human";
      }

      await notifyOwner({
        settings,
        conversation: { ...conversation, status: "needs_human" },
        messages: [...transcript, assistantMessage],
        subject: `Chat needs you — ${conversation.visitorName}`,
        headline: "A visitor needs a human reply",
        reason:
          "The assistant could not answer from published site content, so it escalated rather than guessing.",
      });
    }

    if (newConversationNotice) await newConversationNotice;

    return NextResponse.json({
      conversationId: conversation.id,
      status,
      escalated: reply.escalated,
      userMessage: visitorMessage,
      reply: assistantMessage,
      remaining: Math.max(0, MAX_VISITOR_MESSAGES - (visitorTurns + 1)),
    });
  } catch (error) {
    console.error("[chat/message] failed:", error);
    return fail("server_error", GENERIC_FAILURE, 500);
  }
}
