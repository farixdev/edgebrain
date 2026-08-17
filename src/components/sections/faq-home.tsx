"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { DURATION, EASE, viewportOnce } from "@/lib/motion";
import { Plus } from "lucide-react";
import { FAQS } from "@/lib/constants";

export function FAQHome() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  return (
    <Section variant="dark" noise>
      <div className="max-w-3xl mx-auto">
        <div className="mb-16 text-center">
          <motion.p
            className="text-xs uppercase tracking-[0.2em] text-[var(--color-yellow)] mb-4 font-medium"
            initial={shouldReduceMotion ? {} : { opacity: 0 }}
            whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow }}
          >
            FAQ
          </motion.p>
          <motion.h2
            className="text-display-lg"
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.1 }}
          >
            Common questions
          </motion.h2>
        </div>

        <div className="space-y-0">
          {FAQS.map((faq, i) => {
            const isExpanded = expanded === i;

            return (
              <motion.div
                key={i}
                className="border-t border-[var(--color-hairline-dark)]"
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{
                  duration: DURATION.slow,
                  ease: EASE.standard,
                  delay: i * 0.05,
                }}
              >
                <button
                  className="w-full py-6 flex items-center justify-between gap-4 text-left cursor-pointer group"
                  onClick={() => setExpanded(isExpanded ? null : i)}
                  aria-expanded={isExpanded}
                >
                  <span className="text-base lg:text-lg font-medium group-hover:text-[var(--color-yellow)] transition-colors duration-[var(--duration-fast)]">
                    {faq.question}
                  </span>
                  <motion.span
                    className="text-[var(--color-mute)] flex-shrink-0"
                    animate={{ rotate: isExpanded ? 45 : 0 }}
                    transition={{ duration: DURATION.fast }}
                  >
                    <Plus size={18} />
                  </motion.span>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: DURATION.base,
                        ease: EASE.standard,
                      }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 text-sm lg:text-base text-[var(--color-offwhite)]/60 leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
          <div className="border-t border-[var(--color-hairline-dark)]" />
        </div>
      </div>
    </Section>
  );
}
