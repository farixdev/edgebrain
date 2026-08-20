"use client";

/**
 * Decides whether the chat widget is on screen.
 *
 * The root layout wraps every route, including /admin. Rendering the widget
 * there would put the owner in a conversation with their own bot while they
 * are reading the inbox of other people's conversations — and any thread it
 * created would land in that same inbox as a real lead. So /admin, and
 * anything under it, is excluded.
 *
 * This lives in a client component because a root layout is a server
 * component and cannot read the pathname. It renders nothing itself, so it
 * adds no markup to the server HTML — which matters here, since the whole
 * reveal system depends on the server HTML containing no hidden content.
 * The widget is fixed-position UI and animates itself; it is deliberately
 * outside the `data-reveal` scroll system.
 */

import { usePathname } from "next/navigation";
import { ChatWidget } from "@/components/chat/chat-widget";

/** Routes the widget must never appear on. */
const EXCLUDED_PREFIXES = ["/admin"];

export function ChatMount() {
  const pathname = usePathname();

  // `usePathname` can be null in edge cases (e.g. during a static export of a
  // route with no path). Failing closed is right: no widget beats a widget in
  // the admin panel.
  if (!pathname) return null;

  const excluded = EXCLUDED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
  if (excluded) return null;

  return <ChatWidget />;
}
