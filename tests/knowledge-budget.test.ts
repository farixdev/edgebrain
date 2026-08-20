/**
 * The assertion that would have caught a dead chat widget before it shipped.
 *
 * The bug this file exists for: the whole knowledge corpus was being sent as
 * the system prompt. At ~39,000 characters that is nearly 9,000 tokens, and
 * the Groq account behind this site is capped at 8,000 tokens per minute with
 * `max_tokens` counted up front. Every single visitor message came back 413.
 *
 * What made it survive a manual verification pass is that the failure has no
 * symptom. `/api/chat/message` escalates on a provider error using the exact
 * same branch it uses for an honestly ungrounded question: fallback sentence
 * stored, `escalated` set, owner emailed, HTTP 200 returned. The API looked
 * healthy, the database rows looked correct, the widget looked alive, and the
 * assistant had never once answered anything. Only a line in the server log
 * said so.
 *
 * A silent failure needs a loud test. These assertions are on the *shape* of
 * the prompt, not on a live API call, so they run in CI, offline, in
 * milliseconds — and they fail on the content edit that would break
 * production, not on the deploy afterwards.
 *
 * Run with: npm test
 */

import assert from "node:assert/strict";
import { test } from "node:test";

import {
  buildKnowledgeBase,
  buildKnowledgeChunks,
  selectKnowledge,
  type KnowledgeChunk,
} from "@/lib/knowledge";
import {
  estimateTokens,
  MAX_COMPLETION_TOKENS,
  MODEL_TPM_LIMIT,
  REQUEST_TOKEN_CEILING,
  SYSTEM_PROMPT_TOKEN_BUDGET,
  tokensToChars,
} from "@/lib/token-budget";

/**
 * Characters of non-corpus scaffolding the real prompt adds around CONTEXT:
 * the seven grounding rules, the CONTEXT delimiters, the conversation details,
 * and the owner's `promptExtra` at its clipped maximum. Measured generously —
 * `buildSystemPrompt` measures the real thing and subtracts it exactly, so
 * this only has to be an upper bound.
 */
const SCAFFOLD_ALLOWANCE_CHARS = 3_000;

const CONTEXT_BUDGET_CHARS =
  tokensToChars(SYSTEM_PROMPT_TOKEN_BUDGET) - SCAFFOLD_ALLOWANCE_CHARS;

const chunks: KnowledgeChunk[] = buildKnowledgeChunks();

/**
 * Questions a real visitor asks, paired with the page they would be on and a
 * term the answer has to be grounded in. Retrieval that stops surfacing these
 * has not crashed — it has quietly turned the assistant into a machine that
 * escalates everything, which is the same silent failure in a new costume.
 */
const RETRIEVAL_CASES: {
  question: string;
  page: string | null;
  expect: RegExp;
}[] = [
  {
    question: "How much does an MVP cost to build?",
    page: "/",
    expect: /mvp|cost|price|budget/i,
  },
  {
    question: "Will migrating off WordPress wreck my SEO rankings?",
    page: "/services/wordpress-to-nextjs-migration",
    expect: /wordpress|redirect|seo/i,
  },
  {
    question: "Can you build a React Native app, and how long does it take?",
    page: "/services/mobile-app-development",
    expect: /react native|mobile|app/i,
  },
  {
    question: "Do you self-host n8n, and what is queue mode?",
    page: "/services/n8n-automation-development",
    expect: /n8n|queue|self-host/i,
  },
  {
    question: "What do you charge for AI integration work?",
    page: "/services/ai-consulting",
    expect: /ai|integration|consult/i,
  },
];

/* -------------------------------------------------------------------------- */
/* The budget                                                                 */
/* -------------------------------------------------------------------------- */

test("the constants describe a request that can actually be served", () => {
  assert.ok(
    REQUEST_TOKEN_CEILING < MODEL_TPM_LIMIT,
    `A request targeting ${REQUEST_TOKEN_CEILING} tokens cannot fit a ${MODEL_TPM_LIMIT}-token-per-minute account.`
  );
  assert.ok(
    SYSTEM_PROMPT_TOKEN_BUDGET + MAX_COMPLETION_TOKENS < MODEL_TPM_LIMIT,
    "The system prompt plus a full completion must leave room under the per-minute limit."
  );
  assert.ok(
    CONTEXT_BUDGET_CHARS > 0,
    "The scaffolding allowance has eaten the entire system-prompt budget."
  );
});

test("the full corpus is too big to send, which is why retrieval exists", () => {
  // Not a failure — a statement of the premise. If the corpus ever shrinks
  // below the budget this test goes red, and that is the moment to ask whether
  // retrieval is still buying anything.
  const tokens = estimateTokens(buildKnowledgeBase());
  assert.ok(
    tokens > SYSTEM_PROMPT_TOKEN_BUDGET,
    `The whole corpus is now ${tokens} tokens, inside the ${SYSTEM_PROMPT_TOKEN_BUDGET}-token budget. Retrieval may no longer be needed — re-check before deleting it.`
  );
});

test("core chunks alone fit the context budget", () => {
  // Core is what every prompt carries no matter what is asked. If core alone
  // overflows, retrieval has nothing left to work with and no question can be
  // answered — the exact state this whole change exists to prevent.
  const core = selectKnowledge({
    query: "",
    pageUrl: null,
    budgetChars: Number.MAX_SAFE_INTEGER,
    chunks: chunks.filter((chunk) => chunk.core),
  });

  assert.ok(
    estimateTokens(core) < CONTEXT_BUDGET_CHARS / 3.6,
    `Core chunks are ${estimateTokens(core)} tokens against a ${Math.floor(
      CONTEXT_BUDGET_CHARS / 3.6
    )}-token context budget. Move something out of core or raise the budget.`
  );
});

test("every retrieved context fits the system prompt budget", () => {
  for (const { question, page } of RETRIEVAL_CASES) {
    const context = selectKnowledge({
      query: question,
      pageUrl: page,
      budgetChars: CONTEXT_BUDGET_CHARS,
      chunks,
    });

    assert.ok(
      context.length <= CONTEXT_BUDGET_CHARS,
      `"${question}" produced ${context.length} characters against a ${CONTEXT_BUDGET_CHARS}-character budget.`
    );

    const promptTokens =
      estimateTokens(context) + estimateTokens("x".repeat(SCAFFOLD_ALLOWANCE_CHARS));

    assert.ok(
      promptTokens <= SYSTEM_PROMPT_TOKEN_BUDGET,
      `"${question}" produced a ~${promptTokens}-token system prompt against a ${SYSTEM_PROMPT_TOKEN_BUDGET}-token budget.`
    );

    // The number that Groq actually rejected on.
    const requested = promptTokens + MAX_COMPLETION_TOKENS;
    assert.ok(
      requested < MODEL_TPM_LIMIT,
      `"${question}" would ask Groq for ~${requested} tokens against a hard limit of ${MODEL_TPM_LIMIT}. This is the 413 that took the widget offline.`
    );
  }
});

test("a pathological question cannot overflow the budget", () => {
  // Every corpus term at once, which is the worst case for a scorer that fills
  // the budget with whatever matches.
  const everything = chunks
    .map((chunk) => chunk.body)
    .join(" ")
    .slice(0, 4_000);

  const context = selectKnowledge({
    query: everything,
    pageUrl: "/services/ai-automation",
    budgetChars: CONTEXT_BUDGET_CHARS,
    chunks,
  });

  assert.ok(
    context.length <= CONTEXT_BUDGET_CHARS,
    `A question matching everything produced ${context.length} characters against a ${CONTEXT_BUDGET_CHARS}-character budget.`
  );
});

/* -------------------------------------------------------------------------- */
/* Grounding                                                                  */
/* -------------------------------------------------------------------------- */

test("retrieval still surfaces the content real questions need", () => {
  for (const { question, page, expect } of RETRIEVAL_CASES) {
    const context = selectKnowledge({
      query: question,
      pageUrl: page,
      budgetChars: CONTEXT_BUDGET_CHARS,
      chunks,
    });

    assert.match(
      context,
      expect,
      `"${question}" retrieved a context with nothing matching ${expect}. The assistant would escalate a question the site answers.`
    );
  }
});

test("every prompt carries contact details and the list of valid URLs", () => {
  // Rule 5 forbids citing a URL that is not in the CONTEXT, and the fallback
  // for anything unanswerable is "email us". Both stop working silently if
  // these ever drop out of core.
  for (const { question, page } of RETRIEVAL_CASES) {
    const context = selectKnowledge({
      query: question,
      pageUrl: page,
      budgetChars: CONTEXT_BUDGET_CHARS,
      chunks,
    });

    assert.match(
      context,
      /edgebrainstudios@gmail\.com/,
      `"${question}" lost the contact email.`
    );
    assert.match(
      context,
      /Never cite a URL that does not appear somewhere in this CONTEXT/,
      `"${question}" lost the site map.`
    );

    // Every durable route, on every turn. Article URLs are deliberately not
    // here — they ride along in the article chunks retrieval pulls in.
    for (const route of ["/", "/services", "/work", "/insights", "/about", "/contact"]) {
      assert.ok(
        context.includes(`\n${route} — `),
        `"${question}" lost ${route} from the site map, so the assistant can no longer link it.`
      );
    }
  }
});

test("an unanswerable question retrieves no invented supporting material", () => {
  // The corpus says nothing about SOC 2, so nothing in it should score. The
  // assistant is then left with core only, rule 2 fires, and the conversation
  // escalates — which is the correct outcome, not a bug.
  const context = selectKnowledge({
    query: "Are you SOC 2 Type II certified and can you sign a BAA?",
    pageUrl: "/contact",
    budgetChars: CONTEXT_BUDGET_CHARS,
    chunks,
  });

  assert.doesNotMatch(
    context,
    /soc 2|type ii|baa/i,
    "The corpus appears to contain compliance claims. Verify they are real before the assistant repeats them."
  );
});
