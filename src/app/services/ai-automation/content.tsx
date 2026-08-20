"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { DURATION, EASE, viewportOnce } from "@/lib/motion";
import { Plus } from "lucide-react";
import { AI_AUTOMATION_FAQS } from "./faqs";

const DELIVERABLES = [
  {
    title: "Document processing pipelines",
    body: "A PDF lands in a shared inbox or an S3 bucket. Ninety seconds later the fields are validated JSON in your database, with a confidence score attached and anything below threshold sitting in a review queue.",
  },
  {
    title: "Invoice and purchase order extraction",
    body: "Line items pulled from supplier invoices, matched against the PO, written to QuickBooks, Xero, or NetSuite. Mismatches route to a person. The clean ones nobody ever opens again.",
  },
  {
    title: "Support ticket triage and drafted replies",
    body: "Inbound tickets classified by intent and urgency, routed to the right queue, with a suggested reply your agent approves or rewrites. Wired into Zendesk, Intercom, Front, or your own tables.",
  },
  {
    title: "RAG systems over your own documents",
    body: "Hybrid keyword and vector search across contracts, SOPs, and three years of resolved tickets. Every answer cites the paragraph it came from, so your team can check it instead of trusting it.",
  },
  {
    title: "Agents that take actions, not just answer",
    body: "An agent with an explicit tool list: read the CRM, create the record, post to Slack, stop and ask a human when confidence drops. Every tool call logged, replayable, and reversible.",
  },
  {
    title: "Workflow automation across the tools you already pay for",
    body: "n8n or Temporal wiring HubSpot, Airtable, Stripe, Slack, and your internal API into one flow with retries, idempotency keys, and a pager alert when a step fails twice.",
  },
  {
    title: "Classification and routing at volume",
    body: "Tens of thousands of records a day tagged against your taxonomy, with a labelled evaluation set so you can see accuracy per category rather than one flattering average.",
  },
];

const STACK = [
  {
    group: "Models",
    items: "Claude, GPT, Gemini, Llama, Qwen",
    why: "Frontier models for reasoning-heavy steps. Smaller open models on your own hardware when the data legally cannot leave your network.",
  },
  {
    group: "Extraction and parsing",
    items: "PyMuPDF, Unstructured, AWS Textract, Docling",
    why: "Deterministic parsers first. Textract for scanned and handwritten pages where layout matters more than language.",
  },
  {
    group: "Retrieval",
    items: "pgvector, Qdrant, Pinecone, BM25",
    why: "pgvector by default, because one Postgres you already run beats a second database you have to babysit. Dedicated stores above roughly 10 million chunks.",
  },
  {
    group: "Orchestration",
    items: "Python, LangGraph, Temporal, n8n",
    why: "Temporal for long-running work that must survive a crash. n8n where your ops team should be able to edit the flow without us.",
  },
  {
    group: "Runtime",
    items: "AWS Lambda, Cloud Run, Postgres, Redis",
    why: "Serverless for bursty document loads so you pay per invoice, not per idle server. Redis for queues and dedupe.",
  },
  {
    group: "Evaluation and observability",
    items: "Langfuse, promptfoo, Sentry, OpenTelemetry",
    why: "Every run traced with its inputs, cost, and latency. Prompt changes go through a regression suite before they reach production.",
  },
];

const PRICING = [
  {
    name: "Automation audit",
    price: "$2,500 to $4,000",
    time: "1 week",
    body: "We time your actual processes, count the volumes, and return a written map of what to automate, what to leave alone, and the payback period on each. Includes one working prototype of the highest-value step.",
  },
  {
    name: "One production workflow",
    price: "$7,000 to $15,000",
    time: "3 to 5 weeks",
    body: "One pipeline, live, monitored, with a review UI and an evaluation set. Typical scope: invoice extraction into your ERP, or ticket classification into your helpdesk.",
  },
  {
    name: "Multi-workflow platform",
    price: "$20,000 to $50,000",
    time: "8 to 14 weeks",
    body: "Three to six connected workflows, a shared review dashboard, role-based access, and integrations across CRM, billing, and internal systems. Rolled out one workflow at a time, not in one launch.",
  },
  {
    name: "Ongoing support",
    price: "from $1,800 per month",
    time: "rolling, 30 days notice",
    body: "Monitoring, model and prompt updates as vendors ship new versions, accuracy reporting, and a set number of change requests each month.",
  },
];

export function AIAutomationPageContent() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      {/* Hero */}
      <Section variant="light" className="pt-40 lg:pt-48">
        <Breadcrumbs items={[
            { label: "Home", href: "/" },
            { label: "Services", href: "/services" },
            { label: "AI Automation" },
          ]} />
        <motion.p
          className="text-xs uppercase tracking-[0.2em] text-[var(--color-mute)] mb-4 font-medium"
          data-reveal="fade"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow }}
        >
          AI Automation
        </motion.p>
        <motion.h1
          className="text-display-xl max-w-4xl mb-8"
          data-reveal="y30"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.1 }}
        >
          Automate the work nobody should be doing.
        </motion.h1>
        <motion.p
          className="text-lg text-[var(--color-mute)] max-w-2xl mb-10 leading-relaxed"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.2 }}
        >
          Most operations teams lose 15 to 30 hours a week to retyping. Invoices
          keyed into the ERP, support tickets sorted by hand, PDFs read line by
          line. We are an AI automation agency for startups and lean operations
          teams, and we build the pipelines and agents that do that work
          instead. First production workflow live in 3 to 5 weeks, priced before
          we start.
        </motion.p>
        <motion.div
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.3 }}
        >
          <ButtonLink href="/contact" size="lg">
            <span>Scope your first workflow</span>
          </ButtonLink>
        </motion.div>
      </Section>

      {/* What we build */}
      <Section variant="dark" noise>
        <div className="max-w-3xl mb-16">
          <motion.p
            className="text-xs uppercase tracking-[0.2em] text-[var(--color-yellow)] mb-4 font-medium"
            data-reveal="fade"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow }}
          >
            What we build
          </motion.p>
          <motion.h2
            className="text-display-lg mb-6"
            data-reveal="y30"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.1 }}
          >
            You get running systems, not a strategy deck.
          </motion.h2>
          <motion.p
            className="text-lg text-[var(--color-offwhite)]/60 leading-relaxed"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.2 }}
          >
            Each of these is a thing we have shipped into production and handed
            over with the repo, the runbook, and the alerting.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {DELIVERABLES.map((item, i) => (
            <motion.div
              key={item.title}
              className="border-t border-[var(--color-hairline-dark)] pt-6"
              data-reveal="y20"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{
                duration: DURATION.slow,
                ease: EASE.standard,
                delay: (i % 2) * 0.08,
              }}
            >
              <h3 className="text-base lg:text-lg font-medium mb-3">
                {item.title}
              </h3>
              <p className="text-sm lg:text-base text-[var(--color-offwhite)]/60 leading-relaxed">
                {item.body}
              </p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* How we approach it */}
      <Section variant="light">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-4">
            <motion.p
              className="text-xs uppercase tracking-[0.2em] text-[var(--color-mute)] mb-4 font-medium"
              data-reveal="fade"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow }}
            >
              How we approach it
            </motion.p>
            <motion.h2
              className="text-display-lg lg:sticky lg:top-32"
              data-reveal="y30"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow, delay: 0.1 }}
            >
              We use the model last, not first.
            </motion.h2>
          </div>

          <motion.div
            className="lg:col-span-8 space-y-7 text-base lg:text-lg text-[var(--color-ink)]/75 leading-relaxed"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.2 }}
          >
            <p>
              The first week is spent counting, not coding. We sit with the
              person doing the task and time it. A four-minute process that runs
              180 times a week is 12 hours of salary, every week, forever. A
              nine-minute process that runs twice a month is not worth
              automating and we will say so. Roughly one in four candidate
              workflows fails this test, and telling you that early is cheaper
              for both of us than discovering it in week six.
            </p>
            <p>
              Then we resist the model for as long as possible. A typed parser,
              a lookup table, and a regex beat a language model on cost,
              latency, and reliability for anything with a fixed structure. A
              deterministic step costs nothing per run and fails the same way
              twice, which means you can write a test for it. In a typical
              document pipeline about 60 percent of the logic ends up as plain
              Python. We reach for a model where the input is genuinely
              unstructured: free-text notes, inconsistent supplier layouts, an
              email that could mean three different things.
            </p>
            <p>
              For retrieval, we start with hybrid search and almost never
              fine-tune. Fine-tuning is expensive to maintain, and every time
              your policy documents change you own a stale model. Retrieval
              augmented generation over pgvector with a BM25 pass for exact
              terms like part numbers gets you most of the way, and updating it
              means updating a document. Fine-tuning earns its place for
              narrow-format output at very high volume, not for knowledge. If
              you want that decision made properly before anyone writes code,
              our{" "}
              <Link
                href="/services/ai-consulting"
                className="underline underline-offset-4 decoration-[var(--color-ink)]/30 hover:decoration-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]"
              >
                AI consulting and readiness assessment
              </Link>{" "}
              exists for exactly that.
            </p>
            <p>
              Every automation ships with a confidence threshold and a human
              queue. A system that is right 92 percent of the time and silent
              about the other 8 percent is worse than no system, because it
              quietly poisons your database. So we build a labelled evaluation
              set of 100 to 300 of your real documents before the first prompt
              goes to production, and we report accuracy per field. When a new
              model version lands, we rerun the suite instead of guessing. The
              honest cost of working this way: the first two weeks look slow
              compared to a demo someone can build in an afternoon. The
              difference shows up in month three, when nobody has quietly gone
              back to doing it by hand.
            </p>
            <p>
              Most of these systems need a face. A review queue, an exception
              dashboard, an admin screen for the ops lead. We build those in
              Next.js as part of the same engagement, which is the same practice
              behind our{" "}
              <Link
                href="/services/web-development"
                className="underline underline-offset-4 decoration-[var(--color-ink)]/30 hover:decoration-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]"
              >
                Next.js web development work
              </Link>
              . You can see the range of what we ship across{" "}
              <Link
                href="/work"
                className="underline underline-offset-4 decoration-[var(--color-ink)]/30 hover:decoration-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]"
              >
                our published case studies
              </Link>
              .
            </p>
          </motion.div>
        </div>
      </Section>

      {/* The stack */}
      <Section variant="dark" noise>
        <div className="max-w-3xl mb-16">
          <motion.p
            className="text-xs uppercase tracking-[0.2em] text-[var(--color-yellow)] mb-4 font-medium"
            data-reveal="fade"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow }}
          >
            The stack
          </motion.p>
          <motion.h2
            className="text-display-lg mb-6"
            data-reveal="y30"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.1 }}
          >
            Boring tools, chosen on purpose.
          </motion.h2>
          <motion.p
            className="text-lg text-[var(--color-offwhite)]/60 leading-relaxed"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.2 }}
          >
            We are not model-loyal. Every choice below has a reason attached,
            and we will swap any of it if your constraints say otherwise.
          </motion.p>
        </div>

        <div className="space-y-0">
          {STACK.map((row, i) => (
            <motion.div
              key={row.group}
              className="border-t border-[var(--color-hairline-dark)] py-7 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8"
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
              <h3 className="md:col-span-3 text-base font-medium">
                {row.group}
              </h3>
              <p className="md:col-span-4 text-sm text-[var(--color-yellow)]">
                {row.items}
              </p>
              <p className="md:col-span-5 text-sm lg:text-base text-[var(--color-offwhite)]/60 leading-relaxed">
                {row.why}
              </p>
            </motion.div>
          ))}
          <div className="border-t border-[var(--color-hairline-dark)]" />
        </div>
      </Section>

      {/* Cost and timeline */}
      <Section variant="light">
        <div className="max-w-3xl mb-16">
          <motion.p
            className="text-xs uppercase tracking-[0.2em] text-[var(--color-mute)] mb-4 font-medium"
            data-reveal="fade"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow }}
          >
            Budget and timeline
          </motion.p>
          <motion.h2
            className="text-display-lg mb-6"
            data-reveal="y30"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.1 }}
          >
            What it costs, before you email us.
          </motion.h2>
          <motion.p
            className="text-lg text-[var(--color-mute)] leading-relaxed"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.2 }}
          >
            These are the bands we actually quote in, in USD. Scope is fixed and
            priced before kickoff, and 40 percent is due at start with the
            balance on handover.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 mb-16">
          {PRICING.map((tier, i) => (
            <motion.div
              key={tier.name}
              className="border-t border-[var(--color-hairline-light)] pt-6"
              data-reveal="y20"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{
                duration: DURATION.slow,
                ease: EASE.standard,
                delay: (i % 2) * 0.08,
              }}
            >
              <h3 className="text-base font-medium mb-2">{tier.name}</h3>
              <p className="text-display-sm mb-1">{tier.price}</p>
              <p className="text-xs uppercase tracking-[0.15em] text-[var(--color-mute)] mb-4 font-medium">
                {tier.time}
              </p>
              <p className="text-sm lg:text-base text-[var(--color-ink)]/70 leading-relaxed">
                {tier.body}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="max-w-3xl space-y-6 text-base lg:text-lg text-[var(--color-ink)]/75 leading-relaxed"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.2 }}
        >
          <p>
            Four things move a quote inside those bands. How many source systems
            we have to integrate. How much your documents vary, because 3
            suppliers is a different job to 300 templates. How high the accuracy
            bar is, since moving from 90 to 98 percent roughly doubles the
            evaluation work. And whether your data is allowed to leave your
            network, which pushes you toward self-hosted models and adds
            infrastructure time.
          </p>
          <p>
            Running costs are usually smaller than people expect. At 5,000
            documents a month, model inference typically lands between $40 and
            $250, plus $20 to $80 of hosting. We report those numbers to you per
            workflow so you can see the unit economics rather than a cloud bill.
            If the payback period on a workflow is longer than nine months, we
            will tell you not to build it. That is not modesty, it is the
            fastest way to a second project. You can compare this against{" "}
            <Link
              href="/services"
              className="underline underline-offset-4 decoration-[var(--color-ink)]/30 hover:decoration-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]"
            >
              our full range of software services
            </Link>{" "}
            or{" "}
            <Link
              href="/contact"
              className="underline underline-offset-4 decoration-[var(--color-ink)]/30 hover:decoration-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]"
            >
              send us the process you want automated
            </Link>{" "}
            and we will come back with a number inside two working days.
          </p>
        </motion.div>
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
            {AI_AUTOMATION_FAQS.map((faq, i) => {
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
            Tell us the task you hate.
          </motion.h2>
          <motion.p
            className="text-lg text-[var(--color-ink)]/70 mb-10 max-w-xl mx-auto leading-relaxed"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ delay: 0.15, duration: DURATION.slow }}
          >
            Send one paragraph describing the process and roughly how often it
            runs. We reply with a scope, a price, and a start date inside two
            working days.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{
              delay: 0.2,
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
              className="text-base font-medium underline underline-offset-4 decoration-[var(--color-ink)]/40 hover:decoration-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]"
            >
              +92 327 0944766
            </a>
          </motion.div>
        </div>
      </Section>
    </>
  );
}
