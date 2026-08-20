"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { SERVICES } from "@/lib/constants";
import { DURATION, viewportOnce } from "@/lib/motion";

const SERVICE_DETAILS = [
  {
    id: "web-development",
    href: "/services/web-development",
    linkLabel: "See how we build Next.js web apps",
    pricing: "Marketing sites from $6,000. Platforms and dashboards from $18,000.",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Node.js", "PostgreSQL"],
    scope: [
      "Marketing & corporate websites",
      "SaaS platforms & dashboards",
      "E-commerce storefronts",
      "Progressive web apps",
      "API design & integration",
    ],
    outcome:
      "Pages that load in under a second on a mid-range phone, on a codebase your next engineer can read.",
  },
  {
    id: "mobile-apps",
    href: "/services/mobile-app-development",
    linkLabel: "See how we build React Native apps",
    pricing: "A mobile client on an existing API from $9,000. Full MVPs from $14,000.",
    stack: ["React Native", "Flutter", "iOS", "Android", "Firebase", "Supabase"],
    scope: [
      "Cross-platform mobile apps",
      "Native iOS & Android builds",
      "Offline-first architecture",
      "Push notifications & real-time sync",
      "App Store submission & optimization",
    ],
    outcome:
      "One codebase, two stores, 60fps on hardware people actually own. We handle review and submission.",
  },
  {
    id: "ai-automation",
    href: "/services/ai-automation",
    linkLabel: "See how we approach AI automation",
    pricing: "Pilots from $2,500. Production workflows from $7,000.",
    stack: ["Python", "OpenAI", "LangChain", "Pinecone", "AWS Lambda", "n8n"],
    scope: [
      "Document processing pipelines",
      "Automated data extraction",
      "Workflow automation",
      "Intelligent chatbots & assistants",
      "Custom ML model deployment",
    ],
    outcome:
      "We do not add a chatbot. We remove the manual step, then report the hours it gave back each month.",
  },
  {
    id: "ai-consulting",
    href: "/services/ai-consulting",
    linkLabel: "See how we scope and integrate AI",
    pricing: "Readiness sprints from $3,500. Proofs of concept from $8,000.",
    stack: ["GPT-4", "Claude", "Fine-tuning", "RAG", "Vector databases", "LLM evaluation"],
    scope: [
      "AI readiness assessment",
      "Use case identification & scoping",
      "Proof of concept builds",
      "LLM integration into existing products",
      "Prompt engineering & optimization",
    ],
    outcome:
      "A working prototype on your real data in three weeks, with accuracy numbers and a projected monthly model spend.",
  },
];

const ENGAGEMENT_STEPS = [
  {
    number: "01",
    title: "A 30-minute call with the engineer who would lead the build",
    timing: "This week",
    body: "No salesperson, no deck, no discovery invoice. Bring the problem, any code that already exists, and the date you need to be live. We ask what breaks today and what a good outcome looks like in numbers.",
    you: "Book a slot and bring whoever knows the current system best.",
  },
  {
    number: "02",
    title: "A fixed-price proposal within three working days",
    timing: "Days 2 to 4",
    body: "One page of scope, a week-by-week plan, the named engineers on the build, and an explicit list of what is excluded. If the project is wrong for us, we say so on the call and point you somewhere better.",
    you: "Read it, argue with the scope, agree a start date.",
  },
  {
    number: "03",
    title: "Working software in your hands every Friday",
    timing: "Weeks 1 to 8",
    body: "Repo access and a shared Slack channel on day one. A staging URL by the end of week one. Every Friday you get a build you can click through, a short note on what changed, and what is queued next. Change requests are priced and confirmed in writing before anyone starts them.",
    you: "Use the Friday build for ten minutes and reply with what is wrong.",
  },
  {
    number: "04",
    title: "Handover you can actually take over",
    timing: "Launch week",
    body: "The repo, the deployment pipeline, environment docs, and a runbook written for an engineer who has never seen the codebase. You own the code and the IP from the first commit. Bugs inside delivered scope are fixed free for 30 days after launch.",
    you: "Take the keys. Keep us on retainer only if it earns its place.",
  },
];

const ENGAGEMENT_MODELS = [
  {
    name: "Fixed-scope project",
    price: "From $6,000",
    typical: "Most land between $12,000 and $35,000",
    fits: "You know roughly what needs building and want the number before you commit.",
    avoid: "Open-ended research, or scope you expect to rewrite twice before it settles.",
  },
  {
    name: "Monthly retainer",
    price: "From $1,800 a month",
    typical: "Typically $2,400 to $4,000 a month",
    fits: "The product is live and needs steady feature work, monitoring, and fixes.",
    avoid: "A single large build. That belongs in a fixed-scope project.",
  },
  {
    name: "Embedded engineers",
    price: "From $6,500 per engineer a month",
    typical: "Three-month minimum, full-time",
    fits: "You have a roadmap and a technical lead, and you are short one or two senior people.",
    avoid: "Teams with nobody to set direction. You would be buying hands with no head.",
  },
];

export function ServicesPageContent() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      {/* Hero */}
      <Section variant="light" className="pt-40 lg:pt-48">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Services" }]} />
        <motion.p
          className="text-xs uppercase tracking-[0.2em] text-[var(--color-mute)] mb-4 font-medium"
          data-reveal="fade"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow }}
        >
          Services
        </motion.p>
        <motion.h1
          className="text-display-xl max-w-4xl mb-6"
          data-reveal="y30"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.1 }}
        >
          Custom software development services, priced before we start.
        </motion.h1>
        <motion.p
          className="text-lg text-[var(--color-mute)] max-w-2xl mb-6"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.2 }}
        >
          EdgeBrain Studios is a product development agency for founders and
          lean product teams. We are a small senior team, a software house in
          Lahore working with clients across the US, UK, and the Gulf. Four
          services: web development, mobile apps, AI automation, and AI
          integration.
        </motion.p>
        <motion.p
          className="text-base text-[var(--color-mute)] max-w-2xl"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.3 }}
        >
          You are probably weighing a $15 an hour marketplace against a $150 an
          hour agency. One carries delivery risk, the other carries account
          managers and a six-week discovery phase. We sit in the middle and are
          specific about the three things both stay vague on: senior engineers
          write the code, the scope and price are fixed before kickoff, and most
          projects ship in 4 to 8 weeks. The long version of that comparison,
          in-house option included, is in{" "}
          <Link
            href="/insights/in-house-vs-agency-vs-freelancer"
            className="underline underline-offset-4 decoration-[var(--color-ink)]/30 hover:decoration-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]"
          >
            in-house vs agency vs freelancer
          </Link>
          .
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
                  data-reveal="fade"
                  initial={false}
                  whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
                  viewport={viewportOnce}
                  transition={{ duration: DURATION.slow }}
                >
                  {service.number}
                </motion.span>
                <motion.h2
                  className="text-display-lg mb-4"
                  data-reveal="y30"
                  initial={false}
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
                  data-reveal="y20"
                  initial={false}
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
                  data-reveal="fade"
                  initial={false}
                  whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
                  viewport={viewportOnce}
                  transition={{ duration: DURATION.slow, delay: 0.3 }}
                >
                  {detail.outcome}
                </motion.p>

                {/* Pricing signal + link to the dedicated service page */}
                <motion.div
                  className="mt-6"
                  data-reveal="y20"
                  initial={false}
                  whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                  viewport={viewportOnce}
                  transition={{ duration: DURATION.slow, delay: 0.4 }}
                >
                  <p
                    className={`text-sm mb-5 ${
                      variant === "dark"
                        ? "text-[var(--color-offwhite)]/60"
                        : "text-[var(--color-mute)]"
                    }`}
                  >
                    {detail.pricing}
                  </p>
                  <Link
                    href={detail.href}
                    className={`group inline-flex items-center gap-2 text-sm font-medium border-b pb-1 transition-colors duration-[var(--duration-fast)] ${
                      variant === "dark"
                        ? "text-[var(--color-yellow)] border-[var(--color-yellow)]/40 hover:border-[var(--color-yellow)]"
                        : "text-[var(--color-ink)] border-[var(--color-ink)]/25 hover:border-[var(--color-yellow)]"
                    }`}
                  >
                    {detail.linkLabel}
                    <ArrowRight className="w-4 h-4 transition-transform duration-[var(--duration-fast)] group-hover:translate-x-1" />
                  </Link>
                </motion.div>
              </div>

              <div>
                {/* Scope */}
                <motion.div
                  className="mb-10"
                  data-reveal="y20"
                  initial={false}
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
                  data-reveal="y20"
                  initial={false}
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

      {/* How engagements work */}
      <Section variant="dark" noise id="how-engagements-work">
        <div className="max-w-3xl mb-16">
          <motion.p
            className="text-xs uppercase tracking-[0.2em] text-[var(--color-mute)] mb-4 font-medium"
            data-reveal="fade"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow }}
          >
            How engagements work
          </motion.p>
          <motion.h2
            className="text-display-lg mb-6"
            data-reveal="y30"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.1 }}
          >
            What happens after you send the first email
          </motion.h2>
          <motion.p
            className="text-lg text-[var(--color-offwhite)]/70"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.2 }}
          >
            Most studio sites stop at &ldquo;get in touch&rdquo; and leave you
            guessing. Here is the whole sequence, including the parts that are
            your job.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
          {ENGAGEMENT_STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              className="border-t border-[var(--color-hairline-dark)] pt-6"
              data-reveal="y30"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow, delay: 0.1 + i * 0.08 }}
            >
              <div className="flex items-baseline justify-between gap-4 mb-4">
                <span className="text-sm font-medium text-[var(--color-yellow)]">
                  {step.number}
                </span>
                <span className="text-xs uppercase tracking-[0.15em] text-[var(--color-mute)] font-medium">
                  {step.timing}
                </span>
              </div>
              <h3 className="text-xl font-medium mb-3">{step.title}</h3>
              <p className="text-sm text-[var(--color-offwhite)]/70 mb-4">
                {step.body}
              </p>
              <p className="text-sm text-[var(--color-offwhite)]/90">
                <span className="text-[var(--color-yellow)]">Your part: </span>
                {step.you}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="text-sm text-[var(--color-offwhite)]/70 max-w-3xl mt-14 border-t border-[var(--color-hairline-dark)] pt-8"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.2 }}
        >
          On the questions offshore buyers actually ask: we hold 1pm to 9pm
          Lahore time, which covers a full London working day and the New York
          morning. We sign your NDA before the first call if you want one, and
          we work on your contract or ours. Payment runs 40 percent at kickoff,
          40 percent at the midpoint, 20 percent on handover. You own the
          repository and the IP from the first commit, not from the final
          invoice. If you have not run a distributed build before, our guide to{" "}
          <Link
            href="/insights/working-with-offshore-development-team"
            className="underline underline-offset-4 decoration-[var(--color-offwhite)]/30 hover:decoration-[var(--color-offwhite)] transition-colors duration-[var(--duration-fast)]"
          >
            working with an offshore development team
          </Link>{" "}
          covers the first ninety days in more detail.
        </motion.p>
      </Section>

      {/* Engagement models */}
      <Section variant="light" id="engagement-models">
        <div className="max-w-3xl mb-16">
          <motion.p
            className="text-xs uppercase tracking-[0.2em] text-[var(--color-mute)] mb-4 font-medium"
            data-reveal="fade"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow }}
          >
            Engagement models
          </motion.p>
          <motion.h2
            className="text-display-lg mb-6"
            data-reveal="y30"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.1 }}
          >
            Three ways to hire us, and when each one is wrong
          </motion.h2>
          <motion.p
            className="text-lg text-[var(--color-mute)]"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.2 }}
          >
            Choose by how settled your scope is, not by budget. The numbers
            below are real starting points, not anchors we walk back later.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ENGAGEMENT_MODELS.map((model, i) => (
            <motion.div
              key={model.name}
              className="rounded-[var(--radius-lg)] border border-[var(--color-hairline-light)] p-8 flex flex-col"
              data-reveal="y30"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow, delay: 0.1 + i * 0.1 }}
            >
              <h3 className="text-xl font-medium mb-3">{model.name}</h3>
              <p className="text-2xl font-medium mb-1">{model.price}</p>
              <p className="text-xs text-[var(--color-mute)] mb-6">
                {model.typical}
              </p>
              <div className="space-y-4 text-sm">
                <p className="text-[var(--color-ink)]/80">
                  <span className="block text-xs uppercase tracking-[0.15em] text-[var(--color-mute)] mb-1 font-medium">
                    Right when
                  </span>
                  {model.fits}
                </p>
                <p className="text-[var(--color-ink)]/80">
                  <span className="block text-xs uppercase tracking-[0.15em] text-[var(--color-mute)] mb-1 font-medium">
                    Wrong when
                  </span>
                  {model.avoid}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="text-sm text-[var(--color-mute)] max-w-3xl mt-10"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.2 }}
        >
          Our minimum engagement is $2,500. Below that a good freelancer serves
          you better, and we will tell you so rather than take the work. Every
          model bills monthly in arrears except fixed-scope projects, which run
          on the three-payment schedule above. If the ranges above are the part
          you are trying to sanity-check, we pulled the number apart in{" "}
          <Link
            href="/insights/mvp-development-cost"
            className="underline underline-offset-4 decoration-[var(--color-ink)]/30 hover:decoration-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]"
          >
            what building an MVP actually costs
          </Link>
          .
        </motion.p>
      </Section>

      {/* Not sure which you need */}
      <Section variant="dark" noise id="not-sure">
        <div className="max-w-3xl">
          <motion.h2
            className="text-display-sm mb-6"
            data-reveal="y30"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow }}
          >
            Not sure which of these you need
          </motion.h2>
          <motion.p
            className="text-lg text-[var(--color-offwhite)]/70 mb-8"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.1 }}
          >
            Most enquiries arrive as a problem, not a service. &ldquo;Two people
            spend nine hours a week retyping invoices.&rdquo; &ldquo;Our app
            takes six seconds to load on a phone.&rdquo; &ldquo;We have an idea
            and no engineering team.&rdquo; That is enough to start with. Send
            the problem and we will tell you which service fits, what it
            realistically costs, and whether it is worth building at all.
          </motion.p>
          <motion.div
            className="flex flex-wrap items-center gap-6"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.2 }}
          >
            <ButtonLink href="/contact" size="lg">
              <span>Describe your problem</span>
            </ButtonLink>
            <p className="text-sm text-[var(--color-offwhite)]/60">
              Or message us on WhatsApp at +92 327 0944766. We reply within one
              working day.
            </p>
          </motion.div>
        </div>
      </Section>

      {/* Bottom CTA */}
      <Section variant="yellow" className="py-24 lg:py-32">
        <div className="max-w-2xl mx-auto text-center">
          <motion.h2
            className="text-display-lg mb-6"
            data-reveal="y30"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow }}
          >
            Got a project in mind?
          </motion.h2>
          <motion.div
            data-reveal="y20"
            initial={false}
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
