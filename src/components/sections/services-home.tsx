"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { Section } from "@/components/ui/section";
import { SERVICES } from "@/lib/constants";
import { DURATION, EASE, viewportOnce } from "@/lib/motion";
import { ArrowRight } from "lucide-react";

export function ServicesHome() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  return (
    <Section variant="dark" noise>
      <div className="mb-16">
        <motion.p
          className="text-xs uppercase tracking-[0.2em] text-[var(--color-yellow)] mb-4 font-medium"
          initial={shouldReduceMotion ? {} : { opacity: 0 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, ease: EASE.standard }}
        >
          What we do
        </motion.p>
        <motion.h2
          className="text-display-lg"
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, ease: EASE.standard, delay: 0.1 }}
        >
          Services
        </motion.h2>
      </div>

      <div className="space-y-0">
        {SERVICES.map((service, i) => {
          const isExpanded = expanded === i;

          return (
            <motion.div
              key={service.number}
              className="border-t border-[var(--color-hairline-dark)] group"
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{
                duration: DURATION.slow,
                ease: EASE.standard,
                delay: i * 0.1,
              }}
            >
              <button
                className="w-full py-8 lg:py-10 flex items-start lg:items-center gap-6 lg:gap-10 text-left cursor-pointer"
                onClick={() => setExpanded(isExpanded ? null : i)}
                aria-expanded={isExpanded}
              >
                <span className="text-sm text-[var(--color-yellow)] font-medium min-w-[2rem]">
                  {service.number}
                </span>
                <span className="text-display-sm lg:text-display-md flex-1 group-hover:text-[var(--color-yellow)] transition-colors duration-[var(--duration-base)]">
                  {service.title}
                </span>
                <span className="text-sm text-[var(--color-mute)] hidden lg:block max-w-xs">
                  {service.description}
                </span>
                <motion.span
                  className="text-[var(--color-mute)] group-hover:text-[var(--color-yellow)] transition-colors"
                  animate={{ rotate: isExpanded ? 90 : 0 }}
                  transition={{ duration: DURATION.fast }}
                >
                  <ArrowRight size={20} />
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
                    <div className="pb-8 lg:pb-10 pl-[calc(2rem+1.5rem)] lg:pl-[calc(2rem+2.5rem)]">
                      <p className="text-[var(--color-offwhite)]/70 max-w-lg mb-4 text-sm lg:text-base">
                        {service.detail}
                      </p>
                      <Link
                        href={service.href}
                        className="inline-flex items-center gap-2 text-sm text-[var(--color-yellow)] font-medium hover:gap-3 transition-all duration-[var(--duration-fast)]"
                      >
                        Learn more <ArrowRight size={14} />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
        <div className="border-t border-[var(--color-hairline-dark)]" />
      </div>
    </Section>
  );
}
