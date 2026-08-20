"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { DURATION, EASE, viewportOnce } from "@/lib/motion";
import { Plus } from "lucide-react";
import { WEB_DEV_FAQS } from "./faqs";

const DELIVERABLES = [
  {
    title: "A Next.js SaaS platform",
    body: "Auth, organisation-level roles, Stripe billing with webhook reconciliation, and a dashboard that still renders in under a second at 10,000 rows.",
  },
  {
    title: "A marketing site your team can edit",
    body: "A Next.js front end on a headless CMS like Sanity or Payload, so marketing publishes a landing page without opening a pull request.",
  },
  {
    title: "A rebuild of the site that got slow",
    body: "We migrate WordPress to Next.js, keep the URL structure, redirect what changes, and take Largest Contentful Paint from four seconds to under 1.5 on 4G.",
  },
  {
    title: "An internal tool that retires the spreadsheet",
    body: "Role-based access, an audit trail, CSV import and export, and a Postgres schema behind it instead of forty tabs and one person who understands them.",
  },
  {
    title: "A storefront wired to Shopify",
    body: "Next.js against the Shopify Storefront API. You keep Shopify checkout and stop paying the theme-engine tax on every product page load.",
  },
  {
    title: "An API layer between systems never meant to talk",
    body: "Typed endpoints, retries with backoff, idempotency keys, and a sync log you can read at 2am when a third-party provider goes down.",
  },
];

const STACK = [
  {
    group: "Framework and language",
    items: [
      "Next.js App Router. Routing, server rendering, and asset optimisation in one place, instead of five libraries and the seams between them.",
      "React 19 and TypeScript in strict mode. A column rename should break the build, not production.",
    ],
  },
  {
    group: "Interface",
    items: [
      "Tailwind CSS v4. One file of design tokens instead of a stylesheet that grows every sprint and gets deleted by nobody.",
      "Radix primitives for menus and dialogs. Keyboard and screen-reader behaviour is not worth rewriting badly.",
    ],
  },
  {
    group: "Data and backend",
    items: [
      "PostgreSQL on Supabase or Neon. Both give you database branching, so migrations get tested before they touch live data.",
      "Drizzle or Prisma for typed queries. Redis for caching, rate limits, and job queues that survive a deploy.",
    ],
  },
  {
    group: "Content and commerce",
    items: [
      "Sanity or Payload, modelled to your editorial structure rather than dumped into one rich-text field.",
      "Stripe for billing, Shopify Storefront API for commerce. Payments stay with providers who solved compliance already.",
    ],
  },
  {
    group: "Infrastructure and quality",
    items: [
      "Vercel or AWS, chosen on your constraints rather than our habit. Preview deploys on every pull request either way.",
      "GitHub Actions running type checks, Lighthouse budgets, and Playwright tests on the flows that make money.",
    ],
  },
];

const PRICING = [
  {
    scope: "Marketing or brand site on a headless CMS",
    time: "3 to 4 weeks",
    price: "$6k to $12k",
  },
  {
    scope: "SaaS MVP with auth, billing, and a dashboard",
    time: "6 to 8 weeks",
    price: "$18k to $35k",
  },
  {
    scope: "WordPress to Next.js migration or performance rebuild",
    time: "4 to 6 weeks",
    price: "$9k to $20k",
  },
  {
    scope: "Internal tool or admin dashboard",
    time: "5 to 7 weeks",
    price: "$12k to $25k",
  },
  {
    scope: "Ongoing development after launch",
    time: "Monthly",
    price: "From $4k / mo",
  },
];

export function WebDevelopmentPageContent() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      {/* Hero */}
      <Section variant="light" className="pt-40 lg:pt-48">
        <Breadcrumbs items={[
            { label: "Home", href: "/" },
            { label: "Services", href: "/services" },
            { label: "Web Development" },
          ]} />
        <motion.p
          className="text-xs uppercase tracking-[0.2em] text-[var(--color-mute)] mb-4 font-medium"
          data-reveal="fade"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow }}
        >
          Web Development
        </motion.p>
        <motion.h1
          className="text-display-xl max-w-4xl mb-6"
          data-reveal="y30"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.1 }}
        >
          Next.js web development that earns its keep.
        </motion.h1>
        <motion.p
          className="text-lg text-[var(--color-mute)] max-w-2xl mb-10"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.2 }}
        >
          We are a Next.js development agency built for founders and lean
          product teams. You get a production web application from two senior
          engineers, shipped in 4 to 8 weeks, on a scope and price agreed before
          anyone writes code. No account manager. No junior billed as a senior.
        </motion.p>
        <motion.div
          className="flex flex-wrap items-center gap-6"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.3 }}
        >
          <ButtonLink href="/contact" size="lg">
            <span>Scope your build</span>
          </ButtonLink>
          <Link
            href="/work"
            className="text-sm font-medium underline underline-offset-4 decoration-[var(--color-hairline-light)] hover:decoration-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]"
          >
            See recent web projects
          </Link>
        </motion.div>
      </Section>

      {/* What we build */}
      <Section variant="dark" noise>
        <motion.h2
          className="text-display-lg max-w-3xl mb-4"
          data-reveal="y30"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.1 }}
        >
          What actually lands in your repository.
        </motion.h2>
        <motion.p
          className="text-lg text-[var(--color-offwhite)]/60 max-w-2xl mb-16"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.2 }}
        >
          Custom web application development, described as artifacts rather than
          categories. These are the briefs we take most often.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-0">
          {DELIVERABLES.map((item, i) => (
            <motion.div
              key={item.title}
              className="border-t border-[var(--color-hairline-dark)] py-8"
              data-reveal="y20"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{
                duration: DURATION.slow,
                ease: EASE.standard,
                delay: (i % 2) * 0.1,
              }}
            >
              <h3 className="text-lg font-medium mb-3">{item.title}</h3>
              <p className="text-sm lg:text-base text-[var(--color-offwhite)]/60 leading-relaxed">
                {item.body}
              </p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* How we approach it */}
      <Section variant="light">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <motion.p
              className="text-xs uppercase tracking-[0.2em] text-[var(--color-mute)] mb-4 font-medium"
              data-reveal="fade"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow }}
            >
              Engineering position
            </motion.p>
            <motion.h2
              className="text-display-lg lg:sticky lg:top-32"
              data-reveal="y30"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow, delay: 0.1 }}
            >
              We render on the server by default, and we tell you what that
              costs.
            </motion.h2>
          </div>

          <motion.div
            className="lg:col-span-7 space-y-6 text-base lg:text-lg text-[var(--color-ink)]/75 leading-relaxed"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.2 }}
          >
            <p>
              Most React work still ships an empty div and fetches everything in
              the browser. It looks fine on a MacBook on office wifi. On a
              mid-range Android over 4G it is a spinner, a layout shift, and a
              Largest Contentful Paint north of four seconds. We default to
              React Server Components for anything content-heavy, so the HTML
              arrives populated and the browser parses far less JavaScript.
            </p>
            <p>
              The cost of that choice is real. Server components hold no state.
              Every interactive island needs an explicit{" "}
              <code className="text-[0.9em] px-1.5 py-0.5 rounded-[var(--radius-md)] bg-[var(--color-ink)]/5 border border-[var(--color-hairline-light)]">
                &ldquo;use client&rdquo;
              </code>{" "}
              boundary, and a badly drawn boundary drags half your tree back to
              the client anyway. We take that trade for marketing pages,
              catalogues, and dashboards where the first view is read-only. We
              do not take it for a canvas editor or a chart that updates twice a
              second, where client-side fetching with a proper cache is the
              honest answer.
            </p>
            <p>
              Types stop at the boundary where they stop being true. TypeScript
              runs strict from the first commit, but a type assertion on a JSON
              response is a comment, not a check, so anything crossing the
              network is validated at runtime with Zod. Database types are
              generated from the schema, never hand-written. This is the boring
              half of the work and it decides whether the next developer can
              change things without fear.
            </p>
            <p>
              Performance is a budget you enforce, not an audit you run in the
              last week. We set the numbers before writing code: LCP under 1.5
              seconds, INP under 200ms, CLS under 0.1, and under 150KB of
              JavaScript on the first route. Lighthouse runs in CI and a
              regression fails the pull request. What breaks those numbers is
              almost never the framework. It is the analytics tag, the chat
              widget, the unresized hero image, and the 400KB font.
            </p>
            <p>
              Accessibility and SEO are structural, so they get built in week
              one. Semantic landmarks, focus states, and a keyboard path through
              every flow cost almost nothing up front and are miserable to
              retrofit in month six. Metadata, sitemaps, and JSON-LD come from
              the same data that renders the page, so structured data cannot
              drift.
            </p>
            <p>
              We will also tell you when Next.js is the wrong tool. A five-page
              brochure site does not need a React framework. An offline-first
              field workflow usually belongs in{" "}
              <Link
                href="/services/mobile-app-development"
                className="underline underline-offset-4 decoration-[var(--color-hairline-light)] hover:decoration-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]"
              >
                a cross-platform mobile app
              </Link>
              . And if the real problem is hours lost to manual data entry
              rather than a slow website, the fix is{" "}
              <Link
                href="/services/ai-automation"
                className="underline underline-offset-4 decoration-[var(--color-hairline-light)] hover:decoration-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]"
              >
                AI automation, not a rebuild
              </Link>
              .
            </p>
          </motion.div>
        </div>
      </Section>

      {/* The stack */}
      <Section variant="dark" noise>
        <motion.h2
          className="text-display-lg max-w-3xl mb-16"
          data-reveal="y30"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.1 }}
        >
          The stack, and why each piece is on the list.
        </motion.h2>

        <div className="space-y-0">
          {STACK.map((block, i) => (
            <motion.div
              key={block.group}
              className="border-t border-[var(--color-hairline-dark)] py-8 grid grid-cols-1 lg:grid-cols-12 gap-6"
              data-reveal="y20"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{
                duration: DURATION.slow,
                ease: EASE.standard,
                delay: i * 0.05,
              }}
            >
              <h3 className="lg:col-span-4 text-xs uppercase tracking-[0.15em] text-[var(--color-yellow)] font-medium pt-1">
                {block.group}
              </h3>
              <ul className="lg:col-span-8 space-y-4">
                {block.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm lg:text-base text-[var(--color-offwhite)]/65 leading-relaxed"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-yellow)] mt-2.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
          <div className="border-t border-[var(--color-hairline-dark)]" />
        </div>
      </Section>

      {/* Cost and timeline */}
      <Section variant="light">
        <motion.h2
          className="text-display-lg max-w-3xl mb-6"
          data-reveal="y30"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.1 }}
        >
          What it costs and when it ships.
        </motion.h2>
        <motion.p
          className="text-lg text-[var(--color-mute)] max-w-2xl mb-14"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.2 }}
        >
          Most studios make you book a call to get a number. Here are the bands
          we actually quote, in US dollars, fixed scope.
        </motion.p>

        <div className="space-y-0 mb-14">
          {PRICING.map((row, i) => (
            <motion.div
              key={row.scope}
              className="border-t border-[var(--color-hairline-light)] py-6 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-6 items-baseline"
              data-reveal="y16"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{
                duration: DURATION.slow,
                ease: EASE.standard,
                delay: i * 0.05,
              }}
            >
              <p className="sm:col-span-7 text-base lg:text-lg font-medium">
                {row.scope}
              </p>
              <p className="sm:col-span-2 text-sm text-[var(--color-mute)]">
                {row.time}
              </p>
              <p className="sm:col-span-3 text-base lg:text-lg font-medium sm:text-right">
                {row.price}
              </p>
            </motion.div>
          ))}
          <div className="border-t border-[var(--color-hairline-light)]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            className="space-y-5 text-base text-[var(--color-ink)]/75 leading-relaxed"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.1 }}
          >
            <h3 className="text-display-sm">What moves the number</h3>
            <p>
              Integrations are the biggest lever. A system with a documented
              REST API adds three to five days. One with a SOAP endpoint, a PDF
              spec, and a support inbox adds two weeks. Permission depth is
              next: a single admin role is cheap, per-record sharing across
              nested teams is not.
            </p>
            <p>
              After that it is data migration volume, whether design exists, and
              compliance. SOC 2 or HIPAA adds audit logging, encryption at rest,
              and access review. That is real engineering, not a checkbox. All
              of it is priced before kickoff.
            </p>
          </motion.div>

          <motion.div
            className="space-y-5 text-base text-[var(--color-ink)]/75 leading-relaxed"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.2 }}
          >
            <h3 className="text-display-sm">
              Why we sit between $15 and $150 an hour
            </h3>
            <p>
              Hire a marketplace developer at $15 an hour and you carry the
              delivery risk. Hire a Western agency at $150 an hour and you fund
              an account manager, a six-week discovery phase, and a junior
              billed as a senior. We sit in the middle on purpose. In the
              middle, the person you talk to is the person writing the code.
            </p>
            <p>
              Payment runs on milestones: 40% at kickoff, 30% at the midpoint
              demo, 30% at handover. You own the repository and the IP from the
              first commit. If you want the full picture across web, mobile, and
              AI work, the{" "}
              <Link
                href="/services"
                className="underline underline-offset-4 decoration-[var(--color-hairline-light)] hover:decoration-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]"
              >
                overview of every EdgeBrain service
              </Link>{" "}
              covers the rest, or{" "}
              <Link
                href="/contact"
                className="underline underline-offset-4 decoration-[var(--color-hairline-light)] hover:decoration-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]"
              >
                send us the brief and get a fixed quote
              </Link>
              .
            </p>
          </motion.div>
        </div>
      </Section>

      {/* FAQ */}
      <Section variant="dark" noise>
        <div className="max-w-3xl mx-auto">
          <div className="mb-16 text-center">
            <motion.p
              className="text-xs uppercase tracking-[0.2em] text-[var(--color-yellow)] mb-4 font-medium"
              data-reveal="fade"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow }}
            >
              FAQ
            </motion.p>
            <motion.h2
              className="text-display-lg"
              data-reveal="y30"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow, delay: 0.1 }}
            >
              The questions that decide it
            </motion.h2>
          </div>

          <div className="space-y-0">
            {WEB_DEV_FAQS.map((faq, i) => {
              const isExpanded = expanded === i;

              return (
                <motion.div
                  key={faq.question}
                  className="border-t border-[var(--color-hairline-dark)]"
                  data-reveal="y20"
                  initial={false}
                  whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                  viewport={viewportOnce}
                  transition={{
                    duration: DURATION.slow,
                    ease: EASE.standard,
                    delay: i * 0.05,
                  }}
                >
                  <button
                    className="w-full py-6 flex items-center justify-between gap-4 text-left cursor-pointer group"
                    onClick={() => setExpanded(isExpanded ? null : i)}
                    aria-expanded={isExpanded}
                    aria-controls={`faq-answer-${i}`}
                  >
                    <span className="text-base lg:text-lg font-medium group-hover:text-[var(--color-yellow)] transition-colors duration-[var(--duration-fast)]">
                      {faq.question}
                    </span>
                    <motion.span
                      className="text-[var(--color-mute)] flex-shrink-0"
                      animate={{ rotate: isExpanded ? 45 : 0 }}
                      transition={{ duration: DURATION.fast }}
                    >
                      <Plus size={18} />
                    </motion.span>
                  </button>

                  {/* Always mounted so every answer is in the HTML for crawlers
                      and AI search — the FAQPage JSON-LD on this route declares
                      these answers, and declaring markup for content that is
                      never rendered is a Google structured-data violation.
                      `inert` keeps the collapsed panel out of the tab order. */}
                  <motion.div
                    id={`faq-answer-${i}`}
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
                    <p className="pb-6 text-sm lg:text-base text-[var(--color-offwhite)]/60 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                </motion.div>
              );
            })}
            <div className="border-t border-[var(--color-hairline-dark)]" />
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section variant="yellow" className="py-28 lg:py-40">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            className="text-display-xl mb-8"
            data-reveal="y40"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slower, ease: EASE.standard }}
          >
            Send us the brief. Get a number back.
          </motion.h2>
          <motion.p
            className="text-lg text-[var(--color-ink)]/70 mb-10 max-w-xl mx-auto"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ delay: 0.15, duration: DURATION.slow }}
          >
            Tell us what you are building and what it has to do by when. You get
            a fixed scope, a fixed price, and a start date within two working
            days. Email edgebrainstudios@gmail.com or call the number below.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{
              delay: 0.25,
              duration: DURATION.slow,
              ease: EASE.standard,
            }}
          >
            <ButtonLink
              href="/contact"
              size="lg"
              className="bg-[var(--color-ink)] text-[var(--color-yellow)] before:bg-[var(--color-offwhite)] hover:text-[var(--color-ink)]"
            >
              <span>Start a project</span>
            </ButtonLink>
            <a
              href="tel:+923270944766"
              className="text-base font-medium underline underline-offset-4 decoration-[var(--color-ink)]/30 hover:decoration-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]"
            >
              +92 327 0944766
            </a>
          </motion.div>
        </div>
      </Section>
    </>
  );
}
