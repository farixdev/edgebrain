"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { DURATION, EASE, viewportOnce } from "@/lib/motion";
import { REVIEWS } from "@/lib/constants";

function StarRating() {
  return (
    <div className="flex gap-0.5 mb-4" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="var(--color-yellow)"
          aria-hidden="true"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export function ReviewsHome() {
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
          Client reviews
        </motion.p>
        <motion.h2
          className="text-display-lg"
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.1 }}
        >
          Trusted by teams that ship
        </motion.h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {REVIEWS.map((review, i) => (
          <motion.div
            key={review.name}
            className="bg-[var(--color-ink)]/[0.02] border border-[var(--color-hairline-light)] rounded-[var(--radius-lg)] p-6 lg:p-8 flex flex-col"
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{
              duration: DURATION.slow,
              ease: EASE.standard,
              delay: i * 0.08,
            }}
          >
            <StarRating />
            <p className="text-sm lg:text-base text-[var(--color-ink)] leading-relaxed mb-6 flex-1">
              &ldquo;{review.quote}&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--color-ink)]/5 flex items-center justify-center text-xs font-semibold text-[var(--color-mute)]">
                {review.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--color-ink)]">
                  {review.name}
                </p>
                <p className="text-xs text-[var(--color-mute)]">
                  {review.role}, {review.company}
                  {review.placeholder && (
                    <span className="ml-1 opacity-50">(placeholder)</span>
                  )}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
