"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { Section } from "@/components/ui/section";
import { DURATION, EASE, viewportOnce } from "@/lib/motion";
import { Plus } from "lucide-react";
import { HOME_FAQS } from "./faq-home-data";

export function FAQHome() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  return (
    <Section variant="dark" noise>
      <div className="max-w-3xl mx-auto">
        <div className="mb-16 text-center">
          <motion.p
            className="text-xs uppercase tracking-[0.2em] text-[var(--color-yellow)] mb-4 font-medium"
            data-reveal="fade"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow }}
          >
            FAQ
          </motion.p>
          <motion.h2
            className="text-display-lg"
            data-reveal="y30"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.1 }}
          >
            The questions that decide it
          </motion.h2>
          <motion.p
            className="mt-6 text-base text-[var(--color-offwhite)]/60 leading-relaxed max-w-xl mx-auto"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.2 }}
          >
            Cost, timelines, IP, timezones, and what happens if it goes wrong.
            Answered here so you do not have to email us to build a shortlist.
          </motion.p>
        </div>

        <div className="space-y-0">
          {HOME_FAQS.map((faq, i) => {
            const isExpanded = expanded === i;

            return (
              <motion.div
                key={faq.question}
                className="border-t border-[var(--color-hairline-dark)]"
                data-reveal="y20"
                initial={false}
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
                  aria-controls={`faq-answer-${i}`}
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

                {/* Always mounted so every answer is in the HTML for crawlers
                    and AI search; `inert` keeps it out of the tab order while
                    collapsed. */}
                <motion.div
                  id={`faq-answer-${i}`}
                  initial={false}
                  animate={{
                    height: isExpanded ? "auto" : 0,
                    opacity: isExpanded ? 1 : 0,
                  }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : DURATION.base,
                    ease: EASE.standard,
                  }}
                  className="overflow-hidden"
                  inert={!isExpanded}
                >
                  <p className="pb-6 text-sm lg:text-base text-[var(--color-offwhite)]/60 leading-relaxed">
                    {faq.answer}
                  </p>
                </motion.div>
              </motion.div>
            );
          })}
          <div className="border-t border-[var(--color-hairline-dark)]" />
        </div>

        <motion.p
          className="mt-10 text-sm text-[var(--color-offwhite)]/60 leading-relaxed text-center"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.2 }}
        >
          Still unanswered?{" "}
          <Link
            href="/contact"
            className="text-[var(--color-yellow)] font-medium hover:underline underline-offset-4"
          >
            Ask us directly
          </Link>{" "}
          and you will have a reply within 24 hours on a business day.
        </motion.p>
      </div>
    </Section>
  );
}
