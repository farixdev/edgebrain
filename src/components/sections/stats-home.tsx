"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { STATS } from "@/lib/constants";
import { DURATION, EASE, viewportOnce } from "@/lib/motion";

function CountUp({
  target,
  suffix,
  inView,
}: {
  target: number;
  suffix: string;
  inView: boolean;
}) {
  const [count, setCount] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!inView) return;
    if (shouldReduceMotion) {
      setCount(target);
      return;
    }

    let start = 0;
    const duration = 2000;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (target - start) * eased;

      setCount(Number.isInteger(target) ? Math.round(current) : parseFloat(current.toFixed(1)));

      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
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
    <Section variant="light">
      <div
        ref={ref}
        className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
      >
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="text-center"
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{
              duration: DURATION.slow,
              ease: EASE.standard,
              delay: i * 0.1,
            }}
          >
            <div className="text-display-xl text-[var(--color-ink)] mb-2">
              <CountUp target={stat.value} suffix={stat.suffix} inView={inView} />
            </div>
            <p className="text-sm text-[var(--color-mute)] uppercase tracking-[0.1em] font-medium">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
