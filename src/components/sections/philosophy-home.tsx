"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { DURATION, EASE, viewportOnce } from "@/lib/motion";

export function PhilosophyHome() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Section variant="dark" noise className="py-32 lg:py-48">
      <div className="max-w-4xl mx-auto text-center">
        <motion.blockquote
          className="text-display-lg lg:text-display-xl"
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 40 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slower, ease: EASE.standard }}
        >
          Good software isn&rsquo;t about more features.
          <br className="hidden md:block" />{" "}
          It&rsquo;s about the right ones,{" "}
          <span className="text-[var(--color-yellow)]">built sharp</span>.
        </motion.blockquote>
      </div>
    </Section>
  );
}
