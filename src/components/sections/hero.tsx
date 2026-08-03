"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ButtonLink } from "@/components/ui/button";
import { AnimatedText } from "@/components/ui/animated-text";
import { DURATION, EASE, viewportOnce } from "@/lib/motion";
import { SERVICES } from "@/lib/constants";

function ServicesMarquee() {
  const items = [...SERVICES, ...SERVICES, ...SERVICES];

  return (
    <div className="absolute bottom-0 left-0 right-0 border-t border-[var(--color-hairline-light)] overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap py-3">
        {items.map((service, i) => (
          <span
            key={i}
            className="mx-8 text-xs uppercase tracking-[0.2em] text-[var(--color-mute)]/40 font-medium flex-shrink-0"
          >
            {service.title}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Hero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative bg-[var(--color-offwhite)] min-h-screen flex items-center overflow-hidden">
      <div className="container-site relative z-10 pt-32 pb-24 lg:pt-40 lg:pb-32">
        <div className="max-w-4xl">
          <AnimatedText
            text="We design & build software with an edge."
            className="text-display-xl mb-6"
            yellowWord="edge."
          />

          <motion.p
            className="text-lg lg:text-xl text-[var(--color-mute)] max-w-lg mb-10"
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{
              delay: 0.5,
              duration: DURATION.slow,
              ease: EASE.standard,
            }}
          >
            A software studio shipping performant web apps, mobile
            experiences, and AI-powered systems.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-4"
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{
              delay: 0.7,
              duration: DURATION.slow,
              ease: EASE.standard,
            }}
          >
            <ButtonLink href="/contact" size="lg">
              <span>Start a project</span>
            </ButtonLink>
            <ButtonLink href="/work" variant="secondary" size="lg">
              <span>See our work</span>
            </ButtonLink>
          </motion.div>
        </div>
      </div>

      {/* Decorative geometric shape (static on all devices for now) */}
      <div
        className="absolute right-[-5%] top-1/2 -translate-y-1/2 w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] hidden lg:block pointer-events-none"
        aria-hidden="true"
      >
        <div className="relative w-full h-full">
          <div
            className="absolute inset-0 rounded-[30%] bg-gradient-to-br from-[var(--color-ink)]/[0.03] to-[var(--color-ink)]/[0.08] rotate-12"
            style={{ animationDuration: "20s" }}
          />
          <div className="absolute inset-[15%] rounded-[40%] border border-[var(--color-hairline-light)] rotate-[-8deg]" />
          <div className="absolute inset-[30%] rounded-[35%] bg-[var(--color-yellow)]/[0.06] rotate-[20deg]" />
          <div className="absolute top-[45%] left-[42%] w-3 h-3 rounded-full bg-[var(--color-yellow)]" />
        </div>
      </div>

      {/* Mobile decorative element */}
      <div className="absolute right-6 top-28 lg:hidden" aria-hidden="true">
        <div className="w-2 h-2 rounded-full bg-[var(--color-yellow)]" />
      </div>

      <ServicesMarquee />

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
