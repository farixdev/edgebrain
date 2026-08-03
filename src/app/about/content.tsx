"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button";
import { PROCESS_STEPS } from "@/lib/constants";
import { DURATION, EASE, viewportOnce } from "@/lib/motion";

const TEAM = [
  { name: "Founder & Lead", role: "Full-stack Engineer", initials: "EB" },
  { name: "Design Lead", role: "UI/UX Design", initials: "DL" },
  { name: "AI Engineer", role: "Machine Learning", initials: "AE" },
];

const VALUES = [
  "Ship quality, not quantity.",
  "Every line of code should earn its place.",
  "Clear communication beats clever solutions.",
  "Move fast, but don't break trust.",
];

export function AboutPageContent() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      {/* Hero */}
      <Section variant="light" className="pt-40 lg:pt-48">
        <motion.p
          className="text-xs uppercase tracking-[0.2em] text-[var(--color-mute)] mb-4 font-medium"
          initial={shouldReduceMotion ? {} : { opacity: 0 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow }}
        >
          About us
        </motion.p>
        <motion.h1
          className="text-display-xl max-w-4xl mb-6"
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.1 }}
        >
          A small studio with a{" "}
          <span className="text-[var(--color-yellow)]">sharp edge</span>.
        </motion.h1>
        <motion.p
          className="text-lg text-[var(--color-mute)] max-w-xl"
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.2 }}
        >
          We&rsquo;re a software studio based in Lahore, Pakistan — building
          for clients worldwide. We care about craft, clarity, and shipping
          things that actually work.
        </motion.p>
      </Section>

      {/* Story */}
      <Section variant="dark" noise>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <motion.h2
              className="text-display-md mb-6"
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow }}
            >
              Why EdgeBrain?
            </motion.h2>
            <motion.div
              className="space-y-4 text-[var(--color-offwhite)]/70"
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow, delay: 0.1 }}
            >
              <p>
                We started EdgeBrain because we kept seeing the same problem:
                businesses getting software that looked fine on the surface but
                fell apart where it mattered — performance, maintainability,
                the details.
              </p>
              <p>
                Our approach is simple. Understand the problem deeply, design
                for clarity, build with modern tools, and ship something you
                can be proud of. No bloat, no unnecessary complexity.
              </p>
            </motion.div>
          </div>

          <div>
            <motion.h2
              className="text-display-md mb-6"
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow }}
            >
              What we believe
            </motion.h2>
            <div className="space-y-6">
              {VALUES.map((value, i) => (
                <motion.p
                  key={i}
                  className="text-display-sm text-[var(--color-offwhite)]"
                  initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                  whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                  viewport={viewportOnce}
                  transition={{
                    duration: DURATION.slow,
                    delay: 0.1 + i * 0.08,
                  }}
                >
                  <span className="text-[var(--color-yellow)] mr-2">/</span>
                  {value}
                </motion.p>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* How we work */}
      <Section variant="light">
        <motion.p
          className="text-xs uppercase tracking-[0.2em] text-[var(--color-mute)] mb-4 font-medium"
          initial={shouldReduceMotion ? {} : { opacity: 0 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow }}
        >
          How we work
        </motion.p>
        <motion.h2
          className="text-display-lg mb-12"
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.1 }}
        >
          From idea to launch
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {PROCESS_STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{
                duration: DURATION.slow,
                delay: i * 0.1,
              }}
            >
              <span className="text-4xl font-bold text-[var(--color-yellow)]/20 font-[var(--font-display)] block mb-3">
                {step.number}
              </span>
              <h3 className="text-display-sm mb-2">{step.title}</h3>
              <p className="text-sm text-[var(--color-mute)] leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Team */}
      <Section variant="dark" noise>
        <motion.p
          className="text-xs uppercase tracking-[0.2em] text-[var(--color-yellow)] mb-4 font-medium"
          initial={shouldReduceMotion ? {} : { opacity: 0 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow }}
        >
          The team
        </motion.p>
        <motion.h2
          className="text-display-lg mb-12"
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.1 }}
        >
          Small team, big output.
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {TEAM.map((member, i) => (
            <motion.div
              key={member.initials}
              className="p-6 rounded-[var(--radius-lg)] border border-[var(--color-hairline-dark)]"
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{
                duration: DURATION.slow,
                delay: i * 0.1,
              }}
            >
              <div className="w-16 h-16 rounded-full bg-[var(--color-offwhite)]/5 flex items-center justify-center text-lg font-bold text-[var(--color-yellow)] mb-4">
                {member.initials}
              </div>
              <h3 className="text-sm font-medium text-[var(--color-offwhite)] mb-1">
                {member.name}
              </h3>
              <p className="text-xs text-[var(--color-mute)]">
                {member.role}
              </p>
              <p className="text-xs text-[var(--color-mute)]/50 mt-2">
                (placeholder)
              </p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section variant="yellow" className="py-24 lg:py-32">
        <div className="max-w-2xl mx-auto text-center">
          <motion.h2
            className="text-display-lg mb-6"
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow }}
          >
            Let&rsquo;s work together.
          </motion.h2>
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ delay: 0.15, duration: DURATION.slow }}
          >
            <ButtonLink
              href="/contact"
              size="lg"
              className="bg-[var(--color-ink)] text-[var(--color-yellow)] before:bg-[var(--color-offwhite)] hover:text-[var(--color-ink)]"
            >
              <span>Get in touch</span>
            </ButtonLink>
          </motion.div>
        </div>
      </Section>
    </>
  );
}
