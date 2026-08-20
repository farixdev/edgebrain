/**
 * Chat settings — everything about the widget the owner can change without a
 * redeploy.
 *
 *   GET /api/admin/chat-settings → the current settings row
 *   PUT /api/admin/chat-settings → partial update, returns the saved row
 *
 * Both require admin. GET is guarded too, even though most of these fields end
 * up rendered publicly in the widget: `notify_email` and `prompt_extra` do not.
 * `prompt_extra` is appended to the system prompt, so publishing it hands
 * anyone the instructions the bot is operating under. The widget gets its own
 * public, filtered read from the chat API — not this route.
 *
 * This route is also the panel's login probe: it authenticates, reads nothing
 * sensitive to the caller who passes, and writes nothing. Before this existed
 * the panel verified a password by PUTting the entire content document back,
 * which meant every login attempt was a live write.
 */

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import {
  DEFAULT_CHAT_SETTINGS,
  getChatSettings,
  isDbConfigured,
  saveChatSettings,
  type ChatSettings,
} from "@/lib/db";

export const dynamic = "force-dynamic";

/** Hard bounds. The UI clamps too, but a UI is not a validator. */
const LIMITS = {
  temperature: { min: 0, max: 1 },
  maxTokens: { min: 64, max: 8000 },
} as const;

export async function GET(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  // Never throws — returns DEFAULT_CHAT_SETTINGS if the database is down, so
  // the panel renders the form rather than an error page.
  const settings = await getChatSettings();
  return NextResponse.json({
    settings,
    defaults: DEFAULT_CHAT_SETTINGS,
    configured: isDbConfigured(),
  });
}

export async function PUT(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  if (!isDbConfigured()) {
    return NextResponse.json(
      {
        error:
          "DATABASE_URL is not configured, so settings cannot be saved. Set it in the environment and redeploy.",
      },
      { status: 503 }
    );
  }

  let body: Record<string, unknown>;
  try {
    const parsed = await request.json();
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return NextResponse.json({ error: "Expected a JSON object" }, { status: 400 });
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Body is not valid JSON" }, { status: 400 });
  }

  /**
   * Built key by key rather than spread wholesale. `saveChatSettings` treats an
   * absent key as "leave it alone" via COALESCE, so anything not picked up here
   * simply keeps its stored value — which is the behaviour we want for a form
   * that may post a subset of fields.
   */
  const patch: Partial<Omit<ChatSettings, "updatedAt">> = {};

  const str = (key: keyof ChatSettings, max = 8000) => {
    const value = body[key];
    if (typeof value === "string") {
      (patch as Record<string, unknown>)[key] = value.slice(0, max);
    }
  };
  const bool = (key: keyof ChatSettings) => {
    const value = body[key];
    if (typeof value === "boolean") {
      (patch as Record<string, unknown>)[key] = value;
    }
  };

  bool("enabled");
  bool("notifyOnEvery");
  str("botName", 80);
  str("greeting", 500);
  str("aiDisclosure", 500);
  str("promptExtra", 8000);
  str("model", 120);
  str("fallbackMessage", 800);
  str("notifyEmail", 200);
  str("accentColor", 32);

  if (typeof body.temperature === "number" && Number.isFinite(body.temperature)) {
    patch.temperature = clamp(
      body.temperature,
      LIMITS.temperature.min,
      LIMITS.temperature.max
    );
  }
  if (typeof body.maxTokens === "number" && Number.isFinite(body.maxTokens)) {
    patch.maxTokens = Math.round(
      clamp(body.maxTokens, LIMITS.maxTokens.min, LIMITS.maxTokens.max)
    );
  }

  // An empty model string would take the widget down with a 400 from Groq that
  // nobody would connect back to this form.
  if (patch.model !== undefined && !patch.model.trim()) {
    return NextResponse.json(
      { error: "Model id cannot be empty." },
      { status: 400 }
    );
  }
  if (patch.notifyEmail !== undefined && patch.notifyEmail.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patch.notifyEmail.trim())) {
    return NextResponse.json(
      { error: "Notification email does not look like an email address." },
      { status: 400 }
    );
  }

  try {
    const settings = await saveChatSettings(patch);
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("[api/admin/chat-settings] save failed:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to save settings",
      },
      { status: 500 }
    );
  }
}

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}
