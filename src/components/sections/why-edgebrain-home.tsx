"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { DURATION, EASE, viewportOnce } from "@/lib/motion";
import { DIFFERENTIATORS } from "@/lib/constants";

/**
 * Differentiator titles and one-line descriptions come from content.json.
 * The consequence copy lives here, keyed by title: each card states the claim,
 * then what it actually means for the buyer.
 */
const CONSEQUENCE: Record<string, { proof: string; body: string }> = {
  "End-to-end ownership": {
    proof: "One team, one contract",
    body: "There is no gap between the Figma file and the deploy, and no three-day wait while a design vendor and a dev vendor argue about whose bug it is. The engineer who built your checkout flow is the one who fixes it when a payment fails at 2am.",
  },
  "AI-first thinking": {
    proof: "95% straight-through on a stable document set",
    body: "Most studios add a chatbot and call it AI. We look for the manual work first: the invoices someone retypes, the tickets someone sorts, the report someone rebuilds every Monday. Accuracy is measured per field against your own documents, and exceptions route to a human with the fields pre-filled.",
  },
  "Built for speed": {
    proof: "Staging URL in week one",
    body: "A marketing site goes live in 3 to 4 weeks. A SaaS MVP with auth, billing, and a dashboard takes 6 to 8. You get a new build every week, so you correct course in week three instead of finding the problem at launch.",
  },
  "No agency bloat": {
    proof: "Two senior engineers, no account managers",
    body: "You talk to the person writing your code. We hold 6pm to 10pm Lahore time open every working day, which is 9am to 1pm in New York and a normal working morning in London. A shared Slack channel, not a ticket queue and a 12-hour reply delay.",
  },
};

export function WhyEdgeBrainHome() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Section variant="light">
      <div className="mb-16">
        <motion.p
          className="text-xs uppercase tracking-[0.2em] text-[var(--color-mute)] mb-4 font-medium"
          data-reveal="fade"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow }}
        >
          Why EdgeBrain
        </motion.p>
        <motion.h2
          className="text-display-lg max-w-3xl"
          data-reveal="y30"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.1 }}
        >
          Good software isn&rsquo;t about more features. It&rsquo;s about the
          right ones,{" "}
          <span className="text-[var(--color-yellow)]">built sharp</span>.
        </motion.h2>
        <motion.p
          className="mt-6 max-w-2xl text-base lg:text-lg text-[var(--color-mute)] leading-relaxed"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.2 }}
        >
          Most people land here after comparing a freelance marketplace against
          a Western agency. One is cheap and carries real delivery risk. The
          other is safe and billed at $150 an hour, half of it to people who
          never open the repo. We are the third option: an offshore development
          team for startups that is small enough to answer you directly and
          senior enough to be trusted with the build. Four reasons that works.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {DIFFERENTIATORS.map((item, i) => {
          const extra = CONSEQUENCE[item.title];

          return (
            <motion.div
              key={item.title}
              className="border-t border-[var(--color-hairline-light)] pt-8"
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
              {extra && (
                <p className="text-xs uppercase tracking-[0.15em] text-[var(--color-ink)] mb-3 font-medium">
                  {extra.proof}
                </p>
              )}
              <h3 className="text-lg lg:text-xl font-semibold mb-3 text-[var(--color-ink)]">
                {item.title}
              </h3>
              <p className="text-sm lg:text-base text-[var(--color-mute)] leading-relaxed">
                {item.description}
              </p>
              {extra && (
                <p className="mt-4 text-sm lg:text-base text-[var(--color-mute)] leading-relaxed">
                  {extra.body}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>

      <motion.p
        className="mt-14 max-w-3xl text-sm lg:text-base text-[var(--color-mute)] leading-relaxed border-t border-[var(--color-hairline-light)] pt-8"
        data-reveal="y20"
        initial={false}
        whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: DURATION.slow, delay: 0.2 }}
      >
        <span className="text-[var(--color-ink)] font-medium">
          The part nobody else puts in writing.
        </span>{" "}
        You own the code and the IP from the first commit. We work in your
        GitHub organisation where possible, sign your NDA rather than ours, and
        quote fixed scope before kickoff. Payment runs 40% at kickoff, 40% at
        the midpoint build, 20% at handover, so neither side is ever more than
        one milestone exposed.
      </motion.p>
    </Section>
  );
}
