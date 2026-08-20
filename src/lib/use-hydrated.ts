"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/**
 * `false` on the server and during the hydration render, `true` afterwards.
 *
 * Use it to hold back anything that must not appear in the server-rendered
 * markup — most importantly a Framer Motion `initial` prop, which Motion
 * serialises into an inline style during SSR. Reading through
 * `useSyncExternalStore` rather than a `useEffect` + `setState` pair keeps the
 * hydration render consistent with the server output and avoids the cascading
 * render that `react-hooks/set-state-in-effect` flags.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );
}
