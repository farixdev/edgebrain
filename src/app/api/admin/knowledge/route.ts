/**
 * GET /api/admin/knowledge — what the chat assistant is grounded on.
 *
 * This replaces `/api/kbprobe`, which was the same diagnostic with no auth on
 * it. That route disclosed the corpus size and every section heading — for
 * example `## FAQs — AI Integration & Consulting` — to anyone who guessed the
 * path. No secret and no corpus body leaked, but it mapped out the structure
 * of the assistant's grounding, which is the first thing anyone probing for a
 * prompt-injection foothold wants, and a debug endpoint has no business being
 * reachable in production regardless.
 *
 * So it is behind `requireAdmin` now, and it earns its place by answering the
 * question that actually matters day to day: given a visitor's message, which
 * chunks does retrieval pick, and does the assembled prompt fit the budget?
 *
 *   GET /api/admin/knowledge
 *   GET /api/admin/knowledge?q=how+much+does+an+MVP+cost&page=/services
 *
 * Bodies are never returned, only headings, sizes and chunk ids.
 */

import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin-auth";
import { getSiteContent } from "@/lib/db";
import {
  buildKnowledgeBase,
  buildKnowledgeChunks,
  selectKnowledge,
} from "@/lib/knowledge";
import {
  estimateTokens,
  MODEL_TPM_LIMIT,
  REQUEST_TOKEN_CEILING,
  SYSTEM_PROMPT_TOKEN_BUDGET,
  tokensToChars,
} from "@/lib/token-budget";

export const dynamic = "force-dynamic";

/** Characters of scaffolding the real prompt wraps the corpus in. */
const SCAFFOLD_ALLOWANCE_CHARS = 3_000;

export async function GET(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const params = new URL(request.url).searchParams;
  const query = params.get("q")?.slice(0, 500) ?? "";
  const pageUrl = params.get("page")?.slice(0, 300) ?? null;

  const content = await getSiteContent();
  const chunks = buildKnowledgeChunks(content);
  const full = buildKnowledgeBase(content);

  const budgetChars = Math.max(
    0,
    tokensToChars(SYSTEM_PROMPT_TOKEN_BUDGET) - SCAFFOLD_ALLOWANCE_CHARS
  );
  const selected = selectKnowledge({ query, pageUrl, budgetChars, chunks });

  return NextResponse.json({
    budget: {
      modelTpmLimit: MODEL_TPM_LIMIT,
      requestTokenCeiling: REQUEST_TOKEN_CEILING,
      systemPromptTokenBudget: SYSTEM_PROMPT_TOKEN_BUDGET,
      contextBudgetChars: budgetChars,
    },
    corpus: {
      chunks: chunks.length,
      coreChunks: chunks.filter((chunk) => chunk.core).length,
      totalChars: full.length,
      approxTokens: estimateTokens(full),
    },
    selection: {
      query,
      pageUrl,
      chars: selected.length,
      approxTokens: estimateTokens(selected),
      fits: estimateTokens(selected) <= SYSTEM_PROMPT_TOKEN_BUDGET,
      headings: selected
        .split(/\n(?=## )/g)
        .map((section) => section.split("\n")[0]),
    },
  });
}
