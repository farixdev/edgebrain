"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { Section } from "@/components/ui/section";
import { SERVICES } from "@/lib/constants";
import { DURATION, EASE, viewportOnce } from "@/lib/motion";
import { ArrowRight } from "lucide-react";

/**
 * Service data lives in content.json and still points at the old
 * /services#anchor routes. Each service now has a dedicated page, so we map
 * the anchor slug to its real URL and to deeper, page-specific copy here.
 */
interface ServiceDetail {
  href: string;
  linkLabel: string;
  detail: string;
  points: string[];
  meta: string;
}

const SERVICE_DETAIL: Record<string, ServiceDetail> = {
  "web-development": {
    href: "/services/web-development",
    linkLabel: "Next.js and React web development",
    detail:
      "We build the web application your business actually runs on. Next.js with server components, so a dashboard still renders in under a second at 10,000 rows on a mid-range laptop. TypeScript in strict mode, because a column rename should break the build rather than production.",
    points: [
      "SaaS platforms with auth, roles, and Stripe billing reconciled by webhook",
      "Marketing sites on a headless CMS your team edits without a pull request",
      "WordPress rebuilds that take Largest Contentful Paint from four seconds to under 1.5",
    ],
    meta: "Marketing site: 3 to 4 weeks, $6k to $12k. SaaS MVP: 6 to 8 weeks, $18k to $35k.",
  },
  "mobile-apps": {
    href: "/services/mobile-app-development",
    linkLabel: "React Native and Flutter app development",
    detail:
      "One codebase, two stores, native where it counts. We handle the parts that sink mobile projects late: offline-first data, push permissions, biometric auth, and the review process at Apple and Google. You get TestFlight and internal-track builds from week two, not a demo video at the end.",
    points: [
      "Offline-first sync that survives a tunnel, a flight, and a dead battery",
      "Both store submissions handled, including the rejections nobody warns you about",
      "Crash reporting and release channels wired before the first public build",
    ],
    meta: "Mobile client on an existing API: 4 to 6 weeks, $9k to $16k. MVP from scratch: 6 to 9 weeks, $14k to $26k.",
  },
  "ai-automation": {
    href: "/services/ai-automation",
    linkLabel: "AI automation and document processing",
    detail:
      "We remove manual work instead of adding a chatbot. The invoices someone retypes, the tickets someone sorts, the report someone rebuilds every Monday. Accuracy gets measured per field against a labelled set of your own documents, and anything below threshold routes to a human with the fields already filled in.",
    points: [
      "Document pipelines and data extraction into your ERP, CRM, or helpdesk",
      "Workflow agents with retries, audit trails, and a review UI a non-engineer can use",
      "A written payback estimate per workflow before we build any of them",
    ],
    meta: "Automation audit: 1 week, $2,500 to $4,000. One production workflow: 3 to 5 weeks, $7k to $15k.",
  },
  "ai-consulting": {
    href: "/services/ai-consulting",
    linkLabel: "AI integration and LLM consulting",
    detail:
      "You have a model budget and a list of ideas. We rank them by payback, kill the ones that do not survive contact with your data, and build the one that does. Every LLM feature ships with evals in CI, request tracing, a cost cap, and a runbook for whoever inherits it.",
    points: [
      "Ranked use case list with effort, cost, and the data gaps we found",
      "Proof of concept on real data, scored against a graded test set",
      "Production LLM features shipped into the product you already have",
    ],
    meta: "Readiness assessment: 2 weeks, $3,500 to $6,000. Proof of concept: 3 to 4 weeks, $8k to $18k.",
  },
};

/**
 * content.json now stores the dedicated service-page route in `href`. It used
 * to store `/services#anchor`, and the admin panel can still be used to save
 * either shape, so resolve both to the SERVICE_DETAIL key above. Without this
 * the lookup misses and every panel silently loses its bullets and pricing.
 */
const DETAIL_KEY_BY_PATH: Record<string, string> = {
  "/services/web-development": "web-development",
  "/services/mobile-app-development": "mobile-apps",
  "/services/ai-automation": "ai-automation",
  "/services/ai-consulting": "ai-consulting",
};

function slugFor(href: string): string {
  const [path, hash] = href.split("#");
  return hash ?? DETAIL_KEY_BY_PATH[path] ?? "";
}

export function ServicesHome() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  return (
    <Section variant="dark" noise>
      <div className="mb-16">
        <motion.p
          className="text-xs uppercase tracking-[0.2em] text-[var(--color-yellow)] mb-4 font-medium"
          data-reveal="fade"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, ease: EASE.standard }}
        >
          What we do
        </motion.p>
        <motion.h2
          className="text-display-lg max-w-4xl"
          data-reveal="y30"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, ease: EASE.standard, delay: 0.1 }}
        >
          Web, mobile, and AI builds. Scoped and priced{" "}
          <span className="text-[var(--color-yellow)]">before kickoff</span>.
        </motion.h2>
        <motion.p
          className="mt-6 max-w-2xl text-base lg:text-lg text-[var(--color-offwhite)]/60 leading-relaxed"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, ease: EASE.standard, delay: 0.2 }}
        >
          EdgeBrain Studios is an AI-native software studio in Lahore working
          with founders and lean product teams worldwide. Four services, senior
          engineers on every build, and a fixed scope you approve before we open
          an editor. Most projects ship in 4 to 8 weeks.
        </motion.p>
      </div>

      <div className="space-y-0">
        {SERVICES.map((service, i) => {
          const isExpanded = expanded === i;
          const info = SERVICE_DETAIL[slugFor(service.href)];
          const href = info?.href ?? service.href;

          return (
            <motion.div
              key={service.number}
              className="border-t border-[var(--color-hairline-dark)] group"
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
              <button
                className="w-full py-8 lg:py-10 flex items-start lg:items-center gap-6 lg:gap-10 text-left cursor-pointer"
                onClick={() => setExpanded(isExpanded ? null : i)}
                aria-expanded={isExpanded}
              >
                <span className="text-sm text-[var(--color-yellow)] font-medium min-w-[2rem]">
                  {service.number}
                </span>
                <span className="text-display-sm lg:text-display-md flex-1 group-hover:text-[var(--color-yellow)] transition-colors duration-[var(--duration-base)]">
                  {service.title}
                </span>
                <span className="text-sm text-[var(--color-mute)] hidden lg:block max-w-xs">
                  {service.description}
                </span>
                <motion.span
                  className="text-[var(--color-mute)] group-hover:text-[var(--color-yellow)] transition-colors"
                  animate={{ rotate: isExpanded ? 90 : 0 }}
                  transition={{ duration: DURATION.fast }}
                >
                  <ArrowRight size={20} />
                </motion.span>
              </button>

              {/* Always mounted so the links to each service page stay in the
                  HTML for crawlers; `inert` keeps it out of the tab order
                  while collapsed. */}
              <motion.div
                initial={false}
                animate={{
                  height: isExpanded ? "auto" : 0,
                  opacity: isExpanded ? 1 : 0,
                }}
                transition={{
                  duration: shouldReduceMotion ? 0 : DURATION.base,
                  ease: EASE.standard,
                }}
                className="overflow-hidden"
                inert={!isExpanded}
              >
                <div className="pb-8 lg:pb-10 pl-[calc(2rem+1.5rem)] lg:pl-[calc(2rem+2.5rem)]">
                  <p className="text-[var(--color-offwhite)]/70 max-w-xl mb-5 text-sm lg:text-base leading-relaxed">
                    {info?.detail ?? service.detail}
                  </p>

                  {info && (
                    <>
                      <ul className="max-w-xl mb-5 space-y-2">
                        {info.points.map((point) => (
                          <li
                            key={point}
                            className="flex gap-3 text-sm text-[var(--color-offwhite)]/60 leading-relaxed"
                          >
                            <span
                              className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-[var(--color-yellow)]"
                              aria-hidden="true"
                            />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="max-w-xl mb-6 text-xs uppercase tracking-[0.1em] text-[var(--color-mute)] leading-relaxed">
                        {info.meta}
                      </p>
                    </>
                  )}

                  <Link
                    href={href}
                    className="inline-flex items-center gap-2 text-sm text-[var(--color-yellow)] font-medium hover:gap-3 transition-all duration-[var(--duration-fast)]"
                  >
                    {info?.linkLabel ?? service.title} <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
        <div className="border-t border-[var(--color-hairline-dark)]" />
      </div>
    </Section>
  );
}
