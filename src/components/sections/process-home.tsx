"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { PROCESS_STEPS } from "@/lib/constants";
import { DURATION, EASE, viewportOnce } from "@/lib/motion";

export function ProcessHome() {
  const [activeStep, setActiveStep] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  return (
    <Section variant="dark" noise>
      <div className="mb-16">
        <motion.p
          className="text-xs uppercase tracking-[0.2em] text-[var(--color-yellow)] mb-4 font-medium"
          initial={shouldReduceMotion ? {} : { opacity: 0 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow }}
        >
          How we work
        </motion.p>
        <motion.h2
          className="text-display-lg"
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.1 }}
        >
          Our process
        </motion.h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Left: step info (swaps on active) */}
        <div className="lg:sticky lg:top-40 lg:self-start">
          <motion.div
            key={activeStep}
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.base, ease: EASE.standard }}
          >
            <span className="text-6xl lg:text-8xl font-bold text-[var(--color-yellow)]/10 font-[var(--font-display)]">
              {PROCESS_STEPS[activeStep].number}
            </span>
            <h3 className="text-display-md mt-4 mb-4">
              {PROCESS_STEPS[activeStep].title}
            </h3>
            <p className="text-[var(--color-offwhite)]/60 text-base lg:text-lg leading-relaxed max-w-md">
              {PROCESS_STEPS[activeStep].description}
            </p>
          </motion.div>
        </div>

        {/* Right: step list */}
        <div className="space-y-0">
          {PROCESS_STEPS.map((step, i) => (
            <motion.button
              key={step.number}
              className={`w-full text-left py-6 lg:py-8 border-t border-[var(--color-hairline-dark)] flex items-center gap-6 group cursor-pointer transition-colors duration-[var(--duration-fast)] ${
                activeStep === i
                  ? "text-[var(--color-offwhite)]"
                  : "text-[var(--color-offwhite)]/30 hover:text-[var(--color-offwhite)]/60"
              }`}
              onClick={() => setActiveStep(i)}
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{
                duration: DURATION.slow,
                ease: EASE.standard,
                delay: i * 0.1,
              }}
            >
              <span
                className={`text-sm font-medium min-w-[2rem] transition-colors duration-[var(--duration-fast)] ${
                  activeStep === i
                    ? "text-[var(--color-yellow)]"
                    : "text-[var(--color-mute)]/30"
                }`}
              >
                {step.number}
              </span>
              <span className="text-display-sm lg:text-display-md">
                {step.title}
              </span>
              {activeStep === i && (
                <motion.div
                  className="ml-auto w-2 h-2 rounded-full bg-[var(--color-yellow)]"
                  layoutId="process-indicator"
                  transition={{ duration: DURATION.base, ease: EASE.standard }}
                />
              )}
            </motion.button>
          ))}
          <div className="border-t border-[var(--color-hairline-dark)]" />
        </div>
      </div>
    </Section>
  );
}
