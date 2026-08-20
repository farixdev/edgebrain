/**
 * The single definition of "is this request the owner?".
 *
 * The admin panel authenticates every request by sending the two credentials
 * as headers rather than holding a session cookie. That is deliberate for a
 * one-operator panel: no session store, no CSRF surface (a cross-site form
 * cannot set custom headers), and logging out is just forgetting the values in
 * React state.
 *
 * It also means the check has to happen on *every* admin route. The chat inbox
 * carries customer names, email addresses and the full text of what they wrote
 * to us — an endpoint that forgets this check is a data-leak, not a bug. So the
 * check lives here once and each route calls `requireAdmin` as its first line.
 */

import { NextResponse } from "next/server";

/**
 * Constant-time-ish string compare.
 *
 * `===` on secrets leaks length and first-difference position through timing.
 * The exposure over a network is tiny, but the fix costs three lines, so there
 * is no reason to take even the tiny version.
 */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/** True when the request carries the owner's credentials. */
export function isAdminRequest(request: Request): boolean {
  const email = request.headers.get("x-admin-email");
  const password = request.headers.get("x-admin-password");
  const expectedEmail = process.env.ADMIN_EMAIL;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  // A missing env var must never mean "everybody is an admin".
  if (!expectedEmail || !expectedPassword) {
    console.error(
      "[admin-auth] ADMIN_EMAIL / ADMIN_PASSWORD are not set — refusing every admin request."
    );
    return false;
  }
  if (!email || !password) return false;

  return safeEqual(email, expectedEmail) && safeEqual(password, expectedPassword);
}

/**
 * Guard for route handlers. Returns a 401 `NextResponse` to return as-is, or
 * `null` when the caller is authenticated:
 *
 *   const denied = requireAdmin(request);
 *   if (denied) return denied;
 */
export function requireAdmin(request: Request): NextResponse | null {
  if (isAdminRequest(request)) return null;
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
