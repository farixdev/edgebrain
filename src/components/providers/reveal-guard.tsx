"use client";

import { useEffect } from "react";

/**
 * Cancels the failsafe in the pre-hydration reveal script.
 *
 * The script adds `js-reveal` to <html> before first paint, which is what lets
 * the entrance animations start from a hidden state without that hidden state
 * ever appearing in the served HTML. It also arms a timer that strips the class
 * again, so a page whose JS bundle fails to load cannot end up with permanently
 * invisible copy. Once React is running, Motion will do the revealing, so the
 * timer is no longer wanted.
 */
export function RevealGuard() {
  useEffect(() => {
    const w = window as Window & { __ebRevealFailsafe?: number };
    if (w.__ebRevealFailsafe !== undefined) {
      clearTimeout(w.__ebRevealFailsafe);
      delete w.__ebRevealFailsafe;
    }
  }, []);

  return null;
}
