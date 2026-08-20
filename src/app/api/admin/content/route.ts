/**
 * The site content document — read by the site, written by the admin panel.
 *
 * This used to `fs.writeFileSync` src/data/content.json. That works on a laptop
 * and silently fails on Vercel, whose runtime filesystem is read-only: the PUT
 * returned 200, the panel showed "Changes saved", and nothing changed. Content
 * now lives in the `site_content` table and every access goes through
 * `@/lib/db`, whose `saveSiteContent` throws rather than pretending.
 *
 * GET is deliberately unauthenticated. The payload is exactly the copy already
 * rendered on every public page, so there is nothing here to protect, and
 * keeping it open means the panel can load the editor before asking who you
 * are. PUT is the write, and PUT is guarded.
 */

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import {
  getSiteContent,
  saveSiteContent,
  getSiteContentUpdatedAt,
  isDbConfigured,
} from "@/lib/db";

/**
 * Content is edited live and must never be served from a build-time snapshot,
 * which is precisely the failure this route was written to end.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  // Never throws: falls back to the bundled content.json when the database is
  // unreachable, so the editor still opens instead of showing a dead panel.
  const data = await getSiteContent();
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  if (!isDbConfigured()) {
    return NextResponse.json(
      {
        error:
          "DATABASE_URL is not configured, so there is nowhere to save. Set it in the environment and redeploy.",
      },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body is not valid JSON" }, { status: 400 });
  }

  // The document is a single JSON object round-tripped whole. An array or a
  // scalar would replace the live content with something no page can read.
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return NextResponse.json(
      { error: "Expected a JSON object" },
      { status: 400 }
    );
  }

  try {
    const saved = await saveSiteContent(body as Record<string, unknown>);
    return NextResponse.json({
      success: true,
      updatedAt: await getSiteContentUpdatedAt(),
      content: saved,
    });
  } catch (error) {
    console.error("[api/admin/content] save failed:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to save content",
      },
      { status: 500 }
    );
  }
}
