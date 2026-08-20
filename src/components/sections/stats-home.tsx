"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { STATS } from "@/lib/constants";
import { DURATION, EASE, viewportOnce } from "@/lib/motion";

/**
 * Seeded with `target`, not 0.
 *
 * The state used to start at 0 and only move once `useInView` fired, so the
 * served HTML read `<span>0+</span> Projects Shipped` — every crawler and AI
 * fetcher that does not execute JS saw a wall of zeroes. Seeding with the real
 * figure puts the correct number in the SSR output; the count-up still runs
 * from 0 on the client once the section scrolls into view.
 */
function CountUp({
  target,
  suffix,
  inView,
}: {
  target: number;
  suffix: string;
  inView: boolean;
}) {
  const [count, setCount] = useState(target);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!inView) return;

    let frame = 0;

    // `count` is already seeded with `target`, so there is nothing to do when
    // the visitor has asked for less motion — the correct figure is on screen
    // (and in the SSR HTML) from the first paint.
    if (shouldReduceMotion) return;

    const start = 0;
    const duration = 2000;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (target - start) * eased;

      setCount(Number.isInteger(target) ? Math.round(current) : parseFloat(current.toFixed(1)));

      if (progress < 1) frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, target, shouldReduceMotion]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

export function StatsHome() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const shouldReduceMotion = useReducedMotion();

  return (
    <Section variant="dark" noise>
      <div
        ref={ref}
        className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
      >
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="text-center"
            data-reveal="y30"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{
              duration: DURATION.slow,
              ease: EASE.standard,
              delay: i * 0.1,
            }}
          >
            <div className="text-display-xl text-[var(--color-offwhite)] mb-2">
              <CountUp target={stat.value} suffix={stat.suffix} inView={inView} />
            </div>
            <p className="text-sm text-[var(--color-mute)] uppercase tracking-[0.1em] font-medium">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Every figure above is either a term we commit to in writing or a count
          of something published on this site. The section previously carried
          invented numbers — "12+ Projects Shipped", "98% Client Satisfaction",
          "99.9% Uptime" — none of which could be substantiated, and the
          satisfaction figure contradicted the fact that the site had no real
          client testimonials at all. */}
      <p className="mt-10 text-sm text-[var(--color-mute)] max-w-2xl">
        Delivery window, reply time, and the post-launch fix period are terms we
        put in the contract. The case study count is what is published on this
        site. We do not publish client-outcome statistics we cannot attribute.
      </p>
    </Section>
  );
}
