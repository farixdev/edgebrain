"use client";

import { useCallback, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import { ButtonLink } from "@/components/ui/button";
import { AnimatedText } from "@/components/ui/animated-text";
import { DURATION, EASE, viewportOnce } from "@/lib/motion";
import { SERVICES } from "@/lib/constants";

const LiquidEther = dynamic(() => import("@/components/ui/liquid-ether"), {
  ssr: false,
});

function ServicesMarquee() {
  const items = [...SERVICES, ...SERVICES, ...SERVICES];

  return (
    <div className="absolute bottom-0 left-0 right-0 border-t border-[var(--color-hairline-light)] overflow-hidden z-10">
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

function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onStoreChange);
      return () => mql.removeEventListener("change", onStoreChange);
    },
    [query]
  );

  /* Server snapshot is `false` so the SSR markup matches the pre-hydration
     client render; the real match is picked up on the first client read. */
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
}

export function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const showEther = isDesktop && !shouldReduceMotion;

  return (
    <section className="relative bg-[var(--color-offwhite)] min-h-screen flex items-center overflow-hidden">
      {/* LiquidEther background — subtle yellow/white, low opacity, desktop only */}
      {showEther && (
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{ opacity: 0.35 }}
          aria-hidden="true"
        >
          <LiquidEther
            colors={["#FFD400", "#FFF8DC", "#FFFBE6"]}
            mouseForce={15}
            cursorSize={120}
            isViscous
            viscous={35}
            iterationsViscous={32}
            iterationsPoisson={32}
            resolution={0.4}
            isBounce={false}
            autoDemo
            autoSpeed={0.3}
            autoIntensity={1.8}
            takeoverDuration={0.3}
            autoResumeDelay={3000}
            autoRampDuration={0.8}
          />
        </div>
      )}

      <div className="container-site relative z-10 pt-32 pb-24 lg:pt-40 lg:pb-32">
        <div className="max-w-4xl">
          <AnimatedText
            text="We design & build software with an edge."
            className="text-display-xl mb-6"
            yellowWord="edge."
          />

          <motion.p
            className="text-lg lg:text-xl text-[var(--color-mute)] max-w-lg mb-10"
            data-reveal="y20"
            initial={false}
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
            data-reveal="y20"
            initial={false}
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
