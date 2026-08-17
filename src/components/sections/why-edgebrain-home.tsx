"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { DURATION, EASE, viewportOnce } from "@/lib/motion";
import { DIFFERENTIATORS } from "@/lib/constants";

export function WhyEdgeBrainHome() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Section variant="light">
      <div className="mb-16">
        <motion.p
          className="text-xs uppercase tracking-[0.2em] text-[var(--color-mute)] mb-4 font-medium"
          initial={shouldReduceMotion ? {} : { opacity: 0 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow }}
        >
          Why EdgeBrain
        </motion.p>
        <motion.h2
          className="text-display-lg max-w-3xl"
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.1 }}
        >
          Good software isn&rsquo;t about more features. It&rsquo;s about the
          right ones,{" "}
          <span className="text-[var(--color-yellow)]">built sharp</span>.
        </motion.h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {DIFFERENTIATORS.map((item, i) => (
          <motion.div
            key={item.title}
            className="border-t border-[var(--color-hairline-light)] pt-8"
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{
              duration: DURATION.slow,
              ease: EASE.standard,
              delay: i * 0.1,
            }}
          >
            <h3 className="text-lg lg:text-xl font-semibold mb-3 text-[var(--color-ink)]">
              {item.title}
            </h3>
            <p className="text-sm lg:text-base text-[var(--color-mute)] leading-relaxed">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
