/**
 * The admin chat inbox.
 *
 * Everything here is owner-only and every handler starts with `requireAdmin`.
 * That is not boilerplate: these rows hold visitor names, email addresses and
 * the verbatim text of what people typed into the widget, including whatever
 * they said about their budget. An unauthenticated GET on this route would be
 * a customer-data leak with a public URL.
 *
 *   GET    /api/admin/chat                    → conversation list + unread count
 *   GET    /api/admin/chat?status=needs_human → filtered list
 *   GET    /api/admin/chat?id=<uuid>          → one thread + full transcript
 *   POST   /api/admin/chat                    → send an admin reply
 *   PATCH  /api/admin/chat                    → set status, or mark read
 *
 * The panel polls the list endpoint every ~10s while the Inbox tab is open, so
 * the list handler stays cheap: two indexed queries, no transcript bodies.
 */

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import {
  addMessage,
  getConversation,
  getMessages,
  isDbConfigured,
  listConversations,
  markRead,
  setConversationStatus,
  unreadCount,
  type ConversationStatus,
} from "@/lib/db";

export const dynamic = "force-dynamic";

const STATUSES: ConversationStatus[] = ["open", "needs_human", "closed"];

function isStatus(value: unknown): value is ConversationStatus {
  return typeof value === "string" && STATUSES.includes(value as ConversationStatus);
}

/** Every write path needs a database; say so plainly instead of 500-ing. */
function dbUnavailable() {
  return NextResponse.json(
    {
      error:
        "DATABASE_URL is not configured, so the chat inbox has no data to work with.",
    },
    { status: 503 }
  );
}

/* -------------------------------------------------------------------------- */
/* GET                                                                        */
/* -------------------------------------------------------------------------- */

export async function GET(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  /* ---- One thread ------------------------------------------------------ */
  if (id) {
    const conversation = await getConversation(id);
    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    const messages = await getMessages(id);

    // Opening a thread is reading it. Done here rather than in the client so
    // the badge cannot get out of step with what is actually on screen.
    // `?peek=1` opts out, for a poll that refreshes an already-open thread.
    if (url.searchParams.get("peek") !== "1" && conversation.unreadForAdmin) {
      try {
        await markRead(id);
        conversation.unreadForAdmin = false;
      } catch (error) {
        // A failed mark-read must not blank the transcript the owner asked for.
        console.error("[api/admin/chat] markRead failed:", error);
      }
    }

    return NextResponse.json({
      conversation,
      messages,
      unread: await unreadCount(),
    });
  }

  /* ---- The list -------------------------------------------------------- */
  const statusParam = url.searchParams.get("status");
  const status = isStatus(statusParam) ? statusParam : undefined;
  const limitParam = Number(url.searchParams.get("limit"));

  const [conversations, unread] = await Promise.all([
    listConversations({
      status,
      limit: Number.isFinite(limitParam) && limitParam > 0 ? limitParam : 100,
    }),
    unreadCount(),
  ]);

  return NextResponse.json({
    conversations,
    unread,
    configured: isDbConfigured(),
  });
}

/* -------------------------------------------------------------------------- */
/* POST — admin reply                                                         */
/* -------------------------------------------------------------------------- */

export async function POST(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  if (!isDbConfigured()) return dbUnavailable();

  let body: { conversationId?: unknown; content?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body is not valid JSON" }, { status: 400 });
  }

  const conversationId =
    typeof body.conversationId === "string" ? body.conversationId : "";
  const content = typeof body.content === "string" ? body.content.trim() : "";

  if (!conversationId) {
    return NextResponse.json(
      { error: "conversationId is required" },
      { status: 400 }
    );
  }
  if (!content) {
    return NextResponse.json({ error: "Message cannot be empty" }, { status: 400 });
  }

  const conversation = await getConversation(conversationId);
  if (!conversation) {
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  }

  try {
    const message = await addMessage({
      conversationId,
      role: "admin",
      content,
    });

    /**
     * `unread_for_admin` and `last_message_at` are maintained by the
     * `chat_messages_touch` trigger — a human reply is by definition the owner
     * having read the thread, and the trigger already knows that. Nothing here
     * touches those columns.
     *
     * Status is a separate decision and stays the owner's: replying to an
     * escalated thread does not silently resolve it. The panel has explicit
     * "Mark resolved" and "Reopen" buttons for that.
     */
    const updated = await getConversation(conversationId);

    return NextResponse.json({
      message,
      conversation: updated ?? conversation,
      unread: await unreadCount(),
    });
  } catch (error) {
    console.error("[api/admin/chat] reply failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to send reply" },
      { status: 500 }
    );
  }
}

/* -------------------------------------------------------------------------- */
/* PATCH — status / mark read                                                 */
/* -------------------------------------------------------------------------- */

export async function PATCH(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  if (!isDbConfigured()) return dbUnavailable();

  let body: { id?: unknown; status?: unknown; read?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body is not valid JSON" }, { status: 400 });
  }

  const id = typeof body.id === "string" ? body.id : "";
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  try {
    if (body.read === true) {
      await markRead(id);
    }

    let conversation = null;
    if (body.status !== undefined) {
      if (!isStatus(body.status)) {
        return NextResponse.json(
          { error: `status must be one of: ${STATUSES.join(", ")}` },
          { status: 400 }
        );
      }
      conversation = await setConversationStatus(id, body.status);
      if (!conversation) {
        return NextResponse.json(
          { error: "Conversation not found" },
          { status: 404 }
        );
      }
    } else {
      conversation = await getConversation(id);
    }

    return NextResponse.json({
      conversation,
      unread: await unreadCount(),
    });
  } catch (error) {
    console.error("[api/admin/chat] patch failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Update failed" },
      { status: 500 }
    );
  }
}
