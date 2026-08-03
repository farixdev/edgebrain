"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button";
import { SERVICES } from "@/lib/constants";
import { DURATION, EASE, viewportOnce } from "@/lib/motion";

const SERVICE_DETAILS = [
  {
    id: "web-development",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Node.js", "PostgreSQL"],
    scope: [
      "Marketing & corporate websites",
      "SaaS platforms & dashboards",
      "E-commerce storefronts",
      "Progressive web apps",
      "API design & integration",
    ],
    outcome:
      "Fast, accessible, and scalable web experiences that convert visitors and serve your users.",
  },
  {
    id: "mobile-apps",
    stack: ["React Native", "Flutter", "iOS", "Android", "Firebase", "Supabase"],
    scope: [
      "Cross-platform mobile apps",
      "Native iOS & Android builds",
      "Offline-first architecture",
      "Push notifications & real-time sync",
      "App Store submission & optimization",
    ],
    outcome:
      "Mobile experiences that feel native, perform smoothly, and keep users coming back.",
  },
  {
    id: "ai-automation",
    stack: ["Python", "OpenAI", "LangChain", "Pinecone", "AWS Lambda", "n8n"],
    scope: [
      "Document processing pipelines",
      "Automated data extraction",
      "Workflow automation",
      "Intelligent chatbots & assistants",
      "Custom ML model deployment",
    ],
    outcome:
      "Intelligent systems that eliminate manual work and save your team hours every week.",
  },
  {
    id: "ai-consulting",
    stack: ["GPT-4", "Claude", "Fine-tuning", "RAG", "Vector databases", "LLM evaluation"],
    scope: [
      "AI readiness assessment",
      "Use case identification & scoping",
      "Proof of concept builds",
      "LLM integration into existing products",
      "Prompt engineering & optimization",
    ],
    outcome:
      "Clear strategy and working prototypes that prove ROI before you commit to a full build.",
  },
];

export function ServicesPageContent() {
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
          Services
        </motion.p>
        <motion.h1
          className="text-display-xl max-w-3xl mb-6"
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.1 }}
        >
          Software that works as hard as you do.
        </motion.h1>
        <motion.p
          className="text-lg text-[var(--color-mute)] max-w-xl"
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.2 }}
        >
          From concept to production — we design, build, and ship digital
          products across web, mobile, and AI.
        </motion.p>
      </Section>

      {/* Service sections */}
      {SERVICES.map((service, i) => {
        const detail = SERVICE_DETAILS[i];
        const variant = i % 2 === 0 ? "dark" : "light";

        return (
          <Section
            key={service.number}
            variant={variant as "dark" | "light"}
            noise={variant === "dark"}
            id={detail.id}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
              <div>
                <motion.span
                  className={`text-sm font-medium mb-4 block ${
                    variant === "dark"
                      ? "text-[var(--color-yellow)]"
                      : "text-[var(--color-mute)]"
                  }`}
                  initial={shouldReduceMotion ? {} : { opacity: 0 }}
                  whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
                  viewport={viewportOnce}
                  transition={{ duration: DURATION.slow }}
                >
                  {service.number}
                </motion.span>
                <motion.h2
                  className="text-display-lg mb-4"
                  initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
                  whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                  viewport={viewportOnce}
                  transition={{ duration: DURATION.slow, delay: 0.1 }}
                >
                  {service.title}
                </motion.h2>
                <motion.p
                  className={`text-lg mb-8 ${
                    variant === "dark"
                      ? "text-[var(--color-offwhite)]/70"
                      : "text-[var(--color-mute)]"
                  }`}
                  initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                  whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                  viewport={viewportOnce}
                  transition={{ duration: DURATION.slow, delay: 0.2 }}
                >
                  {service.detail}
                </motion.p>

                {/* Outcome */}
                <motion.p
                  className={`text-sm font-medium ${
                    variant === "dark"
                      ? "text-[var(--color-yellow)]"
                      : "text-[var(--color-ink)]"
                  }`}
                  initial={shouldReduceMotion ? {} : { opacity: 0 }}
                  whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
                  viewport={viewportOnce}
                  transition={{ duration: DURATION.slow, delay: 0.3 }}
                >
                  {detail.outcome}
                </motion.p>
              </div>

              <div>
                {/* Scope */}
                <motion.div
                  className="mb-10"
                  initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                  whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                  viewport={viewportOnce}
                  transition={{ duration: DURATION.slow, delay: 0.2 }}
                >
                  <h3
                    className={`text-xs uppercase tracking-[0.15em] mb-4 font-medium ${
                      variant === "dark"
                        ? "text-[var(--color-mute)]"
                        : "text-[var(--color-mute)]"
                    }`}
                  >
                    What&rsquo;s included
                  </h3>
                  <ul className="space-y-3">
                    {detail.scope.map((item) => (
                      <li
                        key={item}
                        className={`flex items-start gap-3 text-sm ${
                          variant === "dark"
                            ? "text-[var(--color-offwhite)]/70"
                            : "text-[var(--color-ink)]/70"
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-yellow)] mt-1.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Stack */}
                <motion.div
                  initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                  whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                  viewport={viewportOnce}
                  transition={{ duration: DURATION.slow, delay: 0.3 }}
                >
                  <h3
                    className={`text-xs uppercase tracking-[0.15em] mb-4 font-medium ${
                      variant === "dark"
                        ? "text-[var(--color-mute)]"
                        : "text-[var(--color-mute)]"
                    }`}
                  >
                    Tech we use
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {detail.stack.map((tech) => (
                      <span
                        key={tech}
                        className={`px-3 py-1.5 rounded-[var(--radius-full)] text-xs font-medium ${
                          variant === "dark"
                            ? "bg-[var(--color-offwhite)]/5 text-[var(--color-offwhite)]/60 border border-[var(--color-hairline-dark)]"
                            : "bg-[var(--color-ink)]/5 text-[var(--color-ink)]/60 border border-[var(--color-hairline-light)]"
                        }`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </Section>
        );
      })}

      {/* Bottom CTA */}
      <Section variant="yellow" className="py-24 lg:py-32">
        <div className="max-w-2xl mx-auto text-center">
          <motion.h2
            className="text-display-lg mb-6"
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow }}
          >
            Got a project in mind?
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
              <span>Let&rsquo;s talk</span>
            </ButtonLink>
          </motion.div>
        </div>
      </Section>
    </>
  );
}
