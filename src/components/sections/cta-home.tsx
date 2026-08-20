"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { DURATION, EASE, viewportOnce } from "@/lib/motion";

export function CTAHome() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Section variant="yellow" className="py-28 lg:py-40">
      <div className="max-w-3xl mx-auto text-center">
        <motion.h2
          className="text-display-xl mb-8"
          data-reveal="y40"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slower, ease: EASE.standard }}
        >
          Let&rsquo;s build something sharp.
        </motion.h2>
        <motion.div
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{
            delay: 0.2,
            duration: DURATION.slow,
            ease: EASE.standard,
          }}
        >
          <ButtonLink
            href="/contact"
            size="lg"
            className="bg-[var(--color-ink)] text-[var(--color-yellow)] before:bg-[var(--color-offwhite)] hover:text-[var(--color-ink)]"
          >
            <span>Start a project</span>
          </ButtonLink>
        </motion.div>
      </div>
    </Section>
  );
}
