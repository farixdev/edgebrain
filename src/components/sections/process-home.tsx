"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { PROCESS_STEPS } from "@/lib/constants";
import { DURATION, EASE, viewportOnce } from "@/lib/motion";
import { useHydrated } from "@/lib/use-hydrated";

/**
 * Step numbers, titles, and the summary line come from content.json.
 * The substance of each step lives here: how long it runs, what you do, and
 * what lands in your hands at the end of it.
 */
interface StepDetail {
  timing: string;
  youDo: string;
  youGet: string[];
}

const STEP_DETAIL: Record<string, StepDetail> = {
  "01": {
    timing: "Week 1",
    youDo:
      "One 60-minute call, plus access to whatever already exists: the spreadsheet, the old codebase, the analytics. No 40-page brief required.",
    youGet: [
      "A written scope listing every screen, endpoint, and integration",
      "A fixed price and a ship date, both agreed before any code is written",
      "A stack recommendation with the reasoning, not just a list of logos",
    ],
  },
  "02": {
    timing: "Weeks 1 to 2",
    youDo:
      "Two rounds of feedback in Figma comments, inside 48 hours each. If you already have a designer, we skip this step and build to their file.",
    youGet: [
      "A clickable prototype of the real flows, not decorative screens",
      "Mobile drawn at 360px before desktop, because that is where your users are",
      "A component and token set the build inherits directly, so nothing is redrawn in code",
    ],
  },
  "03": {
    timing: "Weeks 2 to 7",
    youDo:
      "Fifteen minutes a week in the shared Slack channel. Click through the staging build and tell us what is wrong while it is still cheap to change.",
    youGet: [
      "Repo access from the first commit, in your GitHub organisation where possible",
      "A staging URL that redeploys on every merge, so progress is visible daily",
      "A Friday build note: what shipped, what is next, what is blocked and why",
    ],
  },
  "04": {
    timing: "Launch week, then 30 days",
    youDo:
      "Approve the launch checklist, point your domain, and tell us who inherits the system on your side.",
    youGet: [
      "Deployment, monitoring, and error tracking wired up before launch, not after",
      "A handover document and a recorded walkthrough for whoever maintains it",
      "30 days of bug fixes at no cost, then a retainer only if you want one",
    ],
  },
};

export function ProcessHome() {
  const [activeStep, setActiveStep] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  /**
   * The step panel below is keyed on `activeStep`, so it remounts every time
   * the reader picks a step and its `initial` state is read fresh each time.
   * Holding `initial={false}` until after hydration keeps the hidden state out
   * of the SSR HTML (Motion serialises `initial` as an inline style) while
   * still animating every swap the reader actually triggers.
   */
  const hydrated = useHydrated();

  const step = PROCESS_STEPS[activeStep];
  const detail = STEP_DETAIL[step.number];

  return (
    <Section variant="dark" noise>
      <div className="mb-16">
        <motion.p
          className="text-xs uppercase tracking-[0.2em] text-[var(--color-yellow)] mb-4 font-medium"
          data-reveal="fade"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow }}
        >
          How we work
        </motion.p>
        <motion.h2
          className="text-display-lg max-w-4xl"
          data-reveal="y30"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.1 }}
        >
          Scoped in week one.{" "}
          <span className="text-[var(--color-yellow)]">Shipping by week eight</span>.
        </motion.h2>
        <motion.p
          className="mt-6 max-w-2xl text-base lg:text-lg text-[var(--color-offwhite)]/60 leading-relaxed"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.2 }}
        >
          Four steps, and you can see the state of the build on any day of any
          one of them. Pick a step to see what it asks of you, what it costs you
          in time, and what you actually hold at the end of it.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Left: step info (swaps on active) */}
        <div className="lg:sticky lg:top-40 lg:self-start">
          <motion.div
            key={activeStep}
            initial={
              hydrated && !shouldReduceMotion ? { opacity: 0, y: 10 } : false
            }
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.base, ease: EASE.standard }}
          >
            <span className="text-6xl lg:text-8xl font-bold text-[var(--color-yellow)]/10 font-[var(--font-display)]">
              {step.number}
            </span>
            <h3 className="text-display-md mt-4 mb-3">{step.title}</h3>
            {detail && (
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-yellow)] mb-4 font-medium">
                {detail.timing}
              </p>
            )}
            <p className="text-[var(--color-offwhite)]/60 text-base lg:text-lg leading-relaxed max-w-md">
              {step.description}
            </p>

            {detail && (
              <div className="mt-8 max-w-md space-y-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-[var(--color-offwhite)] mb-2 font-medium">
                    What you do
                  </p>
                  <p className="text-sm text-[var(--color-offwhite)]/60 leading-relaxed">
                    {detail.youDo}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-[var(--color-offwhite)] mb-3 font-medium">
                    What you get
                  </p>
                  <ul className="space-y-2">
                    {detail.youGet.map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 text-sm text-[var(--color-offwhite)]/60 leading-relaxed"
                      >
                        <span
                          className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-[var(--color-yellow)]"
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Right: step list */}
        <div className="space-y-0">
          {PROCESS_STEPS.map((item, i) => (
            <motion.button
              key={item.number}
              className={`w-full text-left py-6 lg:py-8 border-t border-[var(--color-hairline-dark)] flex items-center gap-6 group cursor-pointer transition-colors duration-[var(--duration-fast)] ${
                activeStep === i
                  ? "text-[var(--color-offwhite)]"
                  : "text-[var(--color-offwhite)]/30 hover:text-[var(--color-offwhite)]/60"
              }`}
              onClick={() => setActiveStep(i)}
              aria-pressed={activeStep === i}
              data-reveal="y20"
              initial={false}
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
                {item.number}
              </span>
              <span className="text-display-sm lg:text-display-md">
                {item.title}
              </span>
              <span className="ml-auto hidden sm:block text-xs uppercase tracking-[0.15em] text-[var(--color-mute)]">
                {STEP_DETAIL[item.number]?.timing}
              </span>
              {activeStep === i && (
                <motion.div
                  className="ml-auto sm:ml-3 w-2 h-2 rounded-full bg-[var(--color-yellow)] flex-shrink-0"
                  layoutId="process-indicator"
                  transition={{ duration: DURATION.base, ease: EASE.standard }}
                />
              )}
            </motion.button>
          ))}
          <div className="border-t border-[var(--color-hairline-dark)]" />

          <motion.p
            className="pt-8 text-sm text-[var(--color-offwhite)]/60 leading-relaxed max-w-md"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.2 }}
          >
            Change requests are part of the process, not a penalty. Anything
            that adds more than a day gets a written estimate before we touch
            it, and you approve it or defer it. The repo carries a change log of
            what was added, what it cost, and what was cut to make room.
          </motion.p>
        </div>
      </div>
    </Section>
  );
}
