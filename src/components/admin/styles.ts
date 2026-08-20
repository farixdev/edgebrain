/**
 * The admin panel's visual vocabulary, in one place.
 *
 * These strings started life inline in src/app/admin/page.tsx. They moved here
 * unchanged when the Inbox and Chat Settings tabs were added, so a new panel
 * matches the existing ones by construction rather than by a developer
 * remembering the exact focus-ring opacity.
 *
 * The palette is the site's, darkened for a tool: #0E0E0E page, #141414 cards,
 * #1a1a1a inputs, #FFD400 for anything actionable.
 */

export const INPUT =
  "w-full rounded-md border border-white/10 bg-[#1a1a1a] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#FFD400] focus:outline-none focus:ring-1 focus:ring-[#FFD400]/40 transition-colors";

export const TEXTAREA = `${INPUT} resize-y min-h-[72px]`;

export const CARD =
  "rounded-lg border border-white/10 bg-[#141414] p-4 space-y-3 relative";

export const LABEL = "block text-xs font-medium text-white/50 mb-1";

/** Explanatory copy under a control. Deliberately quieter than LABEL. */
export const HELP = "mt-1 text-xs leading-relaxed text-white/30";

export const BTN_PRIMARY =
  "inline-flex items-center gap-2 rounded-md bg-[#FFD400] px-4 py-2 text-sm font-semibold text-[#0E0E0E] hover:bg-[#ffe44d] transition-colors cursor-pointer";

export const BTN_SECONDARY =
  "inline-flex items-center gap-2 rounded-md border border-white/10 bg-[#1a1a1a] px-4 py-2 text-sm font-medium text-white/70 hover:text-white hover:border-white/20 transition-colors cursor-pointer";

export const BTN_DANGER =
  "absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-md text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-colors cursor-pointer";

/** Small inline button used inside the inbox toolbar. */
export const BTN_GHOST =
  "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-white/50 hover:text-white hover:bg-white/5 transition-colors cursor-pointer";
