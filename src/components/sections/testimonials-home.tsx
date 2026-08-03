"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { DURATION, EASE, viewportOnce } from "@/lib/motion";

const TESTIMONIALS = [
  {
    quote:
      "EdgeBrain delivered a platform that exceeded our expectations — fast, polished, and exactly what our users needed.",
    name: "Sarah Chen",
    role: "Head of Product",
    company: "TechCorp",
    placeholder: true,
  },
  {
    quote:
      "Their AI integration work saved our team 20+ hours a week. Clear communication, sharp execution.",
    name: "Marcus Rivera",
    role: "CTO",
    company: "DataFlow",
    placeholder: true,
  },
  {
    quote:
      "We needed a partner who could move fast without cutting corners. EdgeBrain was exactly that.",
    name: "Aisha Patel",
    role: "Founder",
    company: "NovaBuild",
    placeholder: true,
  },
];

export function TestimonialsHome() {
  const [active, setActive] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % TESTIMONIALS.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, [next]);

  return (
    <Section variant="light">
      <div className="mb-12">
        <motion.p
          className="text-xs uppercase tracking-[0.2em] text-[var(--color-mute)] mb-4 font-medium"
          initial={shouldReduceMotion ? {} : { opacity: 0 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow }}
        >
          Testimonials
        </motion.p>
      </div>

      <div className="max-w-3xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? {} : { opacity: 0, y: -20 }}
            transition={{ duration: DURATION.base, ease: EASE.standard }}
          >
            <blockquote className="text-display-sm lg:text-display-md mb-8 text-[var(--color-ink)]">
              &ldquo;{TESTIMONIALS[active].quote}&rdquo;
            </blockquote>
            <div className="flex items-center gap-4">
              {/* Avatar placeholder */}
              <div className="w-12 h-12 rounded-full bg-[var(--color-ink)]/5 flex items-center justify-center text-sm font-semibold text-[var(--color-mute)]">
                {TESTIMONIALS[active].name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--color-ink)]">
                  {TESTIMONIALS[active].name}
                </p>
                <p className="text-sm text-[var(--color-mute)]">
                  {TESTIMONIALS[active].role}, {TESTIMONIALS[active].company}
                  {TESTIMONIALS[active].placeholder && (
                    <span className="text-xs ml-2 opacity-50">(placeholder)</span>
                  )}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dots — wrapped in 44px hit area for touch */}
        <div className="flex gap-1 mt-10">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="w-11 h-11 flex items-center justify-center cursor-pointer"
              aria-label={`Go to testimonial ${i + 1}`}
            >
              <span
                className={`block h-2 rounded-full transition-all duration-[var(--duration-base)] ${
                  active === i
                    ? "bg-[var(--color-yellow)] w-6"
                    : "bg-[var(--color-ink)]/10 hover:bg-[var(--color-ink)]/20 w-2"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </Section>
  );
}
