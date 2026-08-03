export const EASE = {
  standard: [0.22, 1, 0.36, 1] as const,
  out: [0, 0, 0.2, 1] as const,
  in: [0.4, 0, 1, 1] as const,
};

export const DURATION = {
  fast: 0.2,
  base: 0.4,
  slow: 0.7,
  slower: 0.9,
};

export const EASE_CSS = `cubic-bezier(${EASE.standard.join(", ")})`;

export const fadeUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: DURATION.slow, ease: EASE.standard },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: DURATION.base, ease: EASE.standard },
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slow, ease: EASE.standard },
  },
};

export const maskReveal = {
  initial: { clipPath: "inset(100% 0 0 0)" },
  animate: {
    clipPath: "inset(0% 0 0 0)",
    transition: { duration: DURATION.slower, ease: EASE.standard },
  },
};

export const viewportOnce = {
  once: true,
  margin: "-100px",
};
