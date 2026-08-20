/**
 * The token budget every chat request has to fit inside.
 *
 * This exists because the failure it prevents is invisible. The Groq account
 * behind this site is on the free `on_demand` tier, whose limit is 8,000
 * *tokens per minute* — and Groq counts `prompt + max_tokens` against it
 * before it counts anything else. Send a 9K-token prompt and every request
 * comes back 413 before the model ever runs.
 *
 * That is not a loud failure. `/api/chat/message` treats a provider error
 * exactly like an ungrounded answer: it escalates, stores the owner's fallback
 * sentence, emails a human, and returns HTTP 200. The database rows look
 * correct. The widget looks alive. Only the server log says the assistant has
 * been dead since deploy.
 *
 * So the budget is a first-class, testable constant rather than a comment, and
 * `tests/knowledge-budget.test.ts` asserts the assembled prompt fits it.
 *
 * Deliberately dependency-free: the regression test imports this and
 * `@/lib/knowledge` and nothing else, so it runs under bare `node --test`
 * without pulling in `next/server`, the database driver, or nodemailer.
 */

/**
 * The provider's hard cap on one request, in tokens.
 *
 * Groq rejects with 413 when `prompt_tokens + max_tokens` exceeds the account's
 * tokens-per-minute allowance. On the on_demand tier that allowance is 8,000
 * for every chat model this key can reach — verified against
 * groq/compound-mini, groq/compound, qwen/qwen3.6-27b,
 * openai/gpt-oss-safeguard-20b and openai/gpt-oss-120b. Raising this number
 * requires upgrading the Groq plan, not editing this file.
 */
export const MODEL_TPM_LIMIT = 8_000;

/**
 * What one request is allowed to cost, prompt plus completion, as estimated
 * here rather than as Groq counts it.
 *
 * Measured against the live API: a prompt this module estimated at 3,438
 * tokens was billed at 2,513, a ratio of about 1.37. So 4,200 estimated is
 * roughly 2,700 real, and 8,000 tokens per minute buys about three turns —
 * enough for one visitor typing steadily, with `Retry-After` in `callGroq`
 * covering the bursts when two of them overlap.
 *
 * This is the dial to turn if the Groq plan is ever upgraded. Nothing else
 * needs to change: the prompt builder derives its budget from here.
 */
export const REQUEST_TOKEN_CEILING = 4_200;

/**
 * Upper bound on `max_tokens`, whatever the admin panel has been set to.
 *
 * Rule 5 of the grounding prompt asks for two to four sentences, so 500 is
 * generous. Every token here is one the prompt cannot have.
 */
export const MAX_COMPLETION_TOKENS = 500;

/** How much of a request the replayed transcript may occupy. */
export const HISTORY_TOKEN_BUDGET = 700;

/**
 * Slack for the parts we do not model: the JSON envelope, role markers, and
 * the per-message overhead every chat API adds around `content`.
 */
export const ENVELOPE_TOKEN_OVERHEAD = 80;

/** Everything the system prompt — rules plus CONTEXT — may cost. */
export const SYSTEM_PROMPT_TOKEN_BUDGET =
  REQUEST_TOKEN_CEILING -
  MAX_COMPLETION_TOKENS -
  HISTORY_TOKEN_BUDGET -
  ENVELOPE_TOKEN_OVERHEAD;

/**
 * Characters per token, used to convert a budget into a slice length.
 *
 * Measured against the real rejection: a 40.5K-character prompt was counted at
 * 8,934 tokens, or 4.53 characters per token. Dividing by 3.6 therefore
 * over-estimates by roughly a quarter, which is the direction an estimate used
 * for a hard provider limit has to err in.
 */
const CHARS_PER_TOKEN = 3.6;

/** Conservative token count for a string. Always rounds up. */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / CHARS_PER_TOKEN);
}

/** How many characters fit in `tokens`, using the same conservative ratio. */
export function tokensToChars(tokens: number): number {
  return Math.floor(tokens * CHARS_PER_TOKEN);
}
