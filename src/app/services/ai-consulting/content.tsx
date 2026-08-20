"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  Plus,
  ClipboardCheck,
  FlaskConical,
  Database,
  Blocks,
  ShieldCheck,
  Gauge,
  GraduationCap,
} from "lucide-react";
import { Section } from "@/components/ui/section";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { DURATION, EASE, viewportOnce } from "@/lib/motion";
import { AI_CONSULTING_FAQS } from "./faqs";

const DELIVERABLES = [
  {
    icon: ClipboardCheck,
    title: "AI readiness assessment",
    body: "Two weeks inside your workflows, data, and systems. You get 8 to 12 ranked use cases, each with an hours-saved estimate, a build cost, and the reason we would kill it.",
  },
  {
    icon: FlaskConical,
    title: "Proof of concept on your real data",
    body: "Not a demo on sample rows. We run against a slice of production data, publish the accuracy numbers, and tell you plainly when the approach does not clear the bar.",
  },
  {
    icon: Database,
    title: "RAG implementation",
    body: "Chunking strategy, embedding model selection, a vector index in pgvector or Qdrant, a reranking pass, and a retrieval eval set so you can see when a change makes answers worse.",
  },
  {
    icon: Blocks,
    title: "LLM features in your existing product",
    body: "OpenAI, Anthropic, or an open-weight model wired into your current codebase behind a provider interface, with streaming, retries, timeouts, and a fallback model.",
  },
  {
    icon: ShieldCheck,
    title: "Evaluation harness and guardrails",
    body: "100 to 300 graded examples running in CI on every commit, plus schema-enforced outputs, input validation, and PII redaction before a single token leaves your network.",
  },
  {
    icon: Gauge,
    title: "Cost and latency control",
    body: "Prompt caching, model routing, per-request token budgets, and a dashboard that shows spend per feature per day. Most teams find 60 percent of their bill is avoidable context.",
  },
  {
    icon: GraduationCap,
    title: "Team enablement",
    body: "Two half-day sessions with your engineers, a written playbook against your own codebase, and four weeks of review on their pull requests after we hand over.",
  },
];

const STACK = [
  {
    group: "Models",
    items: ["OpenAI API", "Anthropic Claude", "Llama", "Qwen", "Mistral"],
    why: "We benchmark two or three candidates on your task before committing. The leaderboard winner is rarely the winner on your data, and a second provider behind the same interface is your insurance against a deprecation notice.",
  },
  {
    group: "Retrieval",
    items: ["pgvector", "Qdrant", "Pinecone", "Cross-encoder rerankers"],
    why: "pgvector when you already run Postgres and want one less system to operate. A dedicated vector database when you need filtered search across millions of chunks. Reranking always, because raw embedding similarity plateaus around 70 percent recall.",
  },
  {
    group: "Orchestration",
    items: ["LangGraph", "Plain TypeScript", "Temporal", "Inngest"],
    why: "Most agents do not need a framework, and a 200-line state machine you can read beats a graph you cannot debug. We add durable execution only when a job runs for minutes and has to survive a restart.",
  },
  {
    group: "Evaluation & observability",
    items: ["Ragas", "Custom graders", "Langfuse", "LangSmith"],
    why: "Every call is traced with its prompt, retrieved context, latency, and cost. When a customer reports a bad answer, you find the exact trace in about two minutes instead of guessing.",
  },
  {
    group: "Application layer",
    items: ["Next.js", "TypeScript", "Python", "FastAPI", "PostgreSQL"],
    why: "TypeScript for the interface, Python for the model service, because that is where the libraries live. Responses stream over server-sent events, so the first token lands in under a second even when the full answer takes eight.",
  },
  {
    group: "Deployment",
    items: ["Vercel", "AWS Lambda", "Fly.io", "Docker"],
    why: "Containers throughout, so the inference service runs identically on your infrastructure or ours. If you need everything inside your own VPC for compliance reasons, that is a deployment target, not a rebuild.",
  },
];

const PRICING = [
  {
    name: "AI readiness assessment",
    price: "$3,500 – $6,000",
    time: "2 weeks",
    detail:
      "Ranked use case list, effort and cost per item, data gaps we found, and a recommended first build. Yours to keep whether or not you hire us for the build.",
  },
  {
    name: "Proof of concept",
    price: "$8,000 – $18,000",
    time: "3 – 4 weeks",
    detail:
      "One use case, running on real data, with measured accuracy against a graded test set and a projected monthly running cost at your volume.",
  },
  {
    name: "Production LLM feature",
    price: "$18,000 – $45,000",
    time: "5 – 8 weeks",
    detail:
      "Shipped into your existing product with evals in CI, tracing, cost controls, rate limiting, and a runbook for the team that inherits it.",
  },
  {
    name: "Advisory retainer",
    price: "from $3,000 / month",
    time: "rolling, 30 days notice",
    detail:
      "Architecture review, model and vendor decisions, eval design, and code review for your in-house team. Capped hours, no minimum term beyond the first month.",
  },
];

export function AIIntegrationConsultingPageContent() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      {/* Hero */}
      <Section variant="light" className="pt-40 lg:pt-48">
        <Breadcrumbs items={[
            { label: "Home", href: "/" },
            { label: "Services", href: "/services" },
            { label: "AI Integration & Consulting" },
          ]} />
        <motion.p
          className="text-xs uppercase tracking-[0.2em] text-[var(--color-mute)] mb-4 font-medium"
          data-reveal="fade"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow }}
        >
          AI Integration &amp; Consulting
        </motion.p>
        <motion.h1
          className="text-display-xl max-w-3xl mb-6"
          data-reveal="y30"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.1 }}
        >
          AI integration without the hype cycle.
        </motion.h1>
        <motion.p
          className="text-lg text-[var(--color-mute)] max-w-2xl mb-10"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.2 }}
        >
          Most AI projects die somewhere between the demo and production. We work
          as your AI integration consultant to find the two or three places a
          language model actually earns its cost, then build one and prove it with
          measured numbers. You get a working proof of concept in three weeks, not
          a six-week discovery phase and a slide deck.
        </motion.p>
        <motion.div
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.3 }}
        >
          <ButtonLink href="/contact" size="lg">
            <span>Book a scoping call</span>
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
            Deliverables
          </motion.p>
          <motion.h2
            className="text-display-lg mb-6"
            data-reveal="y30"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.1 }}
          >
            Every engagement ends with something running.
          </motion.h2>
          <motion.p
            className="text-lg text-[var(--color-offwhite)]/70"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.2 }}
          >
            Strategy decks are cheap and nobody deploys one. These are the
            artifacts you actually take away.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--color-hairline-dark)] rounded-[var(--radius-lg)] overflow-hidden">
          {DELIVERABLES.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                className="bg-[var(--color-ink)] p-8"
                data-reveal="y20"
                initial={false}
                whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{
                  duration: DURATION.slow,
                  ease: EASE.standard,
                  delay: (i % 3) * 0.08,
                }}
              >
                <Icon
                  size={20}
                  className="text-[var(--color-yellow)] mb-5"
                  strokeWidth={1.5}
                />
                <h3 className="text-base font-medium mb-3">{item.title}</h3>
                <p className="text-sm text-[var(--color-offwhite)]/60 leading-relaxed">
                  {item.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </Section>

      {/* How we approach it */}
      <Section variant="light">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-4">
            <motion.p
              className="text-xs uppercase tracking-[0.2em] text-[var(--color-mute)] mb-4 font-medium"
              data-reveal="fade"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow }}
            >
              How we think
            </motion.p>
            <motion.h2
              className="text-display-lg lg:sticky lg:top-32"
              data-reveal="y30"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow, delay: 0.1 }}
            >
              Most LLM integration fails on evaluation, not on the model.
            </motion.h2>
          </div>

          <motion.div
            className="lg:col-span-8 space-y-8 text-base lg:text-lg leading-relaxed text-[var(--color-ink)]/75"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.2 }}
          >
            <p>
              The first question is never which model to use. It is which manual
              step costs you the most hours, and whether that step tolerates an
              error rate above zero. Those two filters kill most of the ideas on
              a whiteboard. A workflow that runs 40 times a day and already has a
              human checking the output is a strong candidate. A workflow that
              runs twice a month and has to be exactly right is not, however good
              the demo looks. We spend the first week reading your process
              documents and watching the work happen, then rank candidates by
              hours saved against build cost. Usually two or three survive.
            </p>
            <p>
              On architecture, start with retrieval. Almost every fine-tuning
              request we receive turns out to be a retrieval problem wearing a
              costume. Fine-tuning teaches a model a format or a voice. It does
              not teach it facts that change weekly, and it welds you to a model
              version with a deprecation date. Retrieval keeps your knowledge in
              a database you control, so fixing a wrong answer means updating a
              row rather than retraining. We reach for fine-tuning in two cases:
              a small open model that has to hit one narrow, high-volume task
              cheaply, and outputs where format matters more than content.
              Everything else is a chunking and reranking problem.
            </p>
            <p>
              Then there is the part nobody sells. Most LLM features ship on
              vibes. Someone tries ten prompts, it looks convincing, it goes
              live, and three weeks later support is fielding complaints nobody
              can reproduce. We build the evaluation set before we build the
              feature: 100 to 300 real inputs with graded expected outputs,
              split by category, running on every commit. When a prompt change
              lifts accuracy on refunds and drops it on cancellations, you see
              that in the pull request instead of in a customer email. It is
              unglamorous work. It is also the difference between a feature you
              can improve and a feature you can only pray over.
            </p>
            <p>
              Pick the model last, and pick two. Every call goes behind a thin
              provider interface, so moving from one vendor to another is a
              config change rather than a rewrite. Prices move, rate limits
              bite, and a model you depend on will eventually be retired. On
              cost, the culprit is rarely the model itself. It is sending 8,000
              tokens of context where 1,200 would do. Trimming retrieval,
              caching stable prefixes, and routing the easy 70 percent of
              requests to a cheaper model typically halves a monthly bill with
              no measurable quality loss. We measure it per feature, per day,
              so the saving is a number rather than a claim.
            </p>
            <p>
              Consulting and building are not separate businesses here. The
              engineer who scopes your use case writes the code, which is why
              our advice runs conservative about what a model can do
              unattended. When the work becomes a production pipeline it moves
              across to{" "}
              <Link
                href="/services/ai-automation"
                className="underline underline-offset-4 decoration-[var(--color-yellow)] decoration-2 hover:text-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]"
              >
                our AI automation and workflow builds
              </Link>
              , and the interface around it comes from the same team that does
              our{" "}
              <Link
                href="/services/web-development"
                className="underline underline-offset-4 decoration-[var(--color-yellow)] decoration-2 hover:text-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]"
              >
                Next.js web development work
              </Link>
              . Look through{" "}
              <Link
                href="/work"
                className="underline underline-offset-4 decoration-[var(--color-yellow)] decoration-2 hover:text-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]"
              >
                the projects we have shipped
              </Link>{" "}
              or{" "}
              <Link
                href="/services"
                className="underline underline-offset-4 decoration-[var(--color-yellow)] decoration-2 hover:text-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]"
              >
                everything the studio builds
              </Link>
              .
            </p>
          </motion.div>
        </div>
      </Section>

      {/* Stack */}
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
            className="text-display-lg"
            data-reveal="y30"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.1 }}
          >
            Boring tools, chosen on purpose.
          </motion.h2>
        </div>

        <div className="space-y-0">
          {STACK.map((row, i) => (
            <motion.div
              key={row.group}
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
              <h3 className="lg:col-span-3 text-base font-medium">
                {row.group}
              </h3>
              <div className="lg:col-span-4 flex flex-wrap gap-2 h-fit">
                {row.items.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 rounded-[var(--radius-full)] text-xs font-medium bg-[var(--color-offwhite)]/5 text-[var(--color-offwhite)]/60 border border-[var(--color-hairline-dark)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <p className="lg:col-span-5 text-sm text-[var(--color-offwhite)]/60 leading-relaxed">
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
            What it costs, published before you email us.
          </motion.h2>
          <motion.p
            className="text-lg text-[var(--color-mute)]"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.2 }}
          >
            These are the bands we quote inside. Scope is fixed and priced before
            kickoff, so the number on the proposal is the number on the invoice.
          </motion.p>
        </div>

        <div className="space-y-0 mb-16">
          {PRICING.map((tier, i) => (
            <motion.div
              key={tier.name}
              className="border-t border-[var(--color-hairline-light)] py-8 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6"
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
              <h3 className="lg:col-span-3 text-base font-medium">
                {tier.name}
              </h3>
              <div className="lg:col-span-3">
                <p className="text-base font-medium">{tier.price}</p>
                <p className="text-sm text-[var(--color-mute)] mt-1">
                  {tier.time}
                </p>
              </div>
              <p className="lg:col-span-6 text-sm text-[var(--color-ink)]/70 leading-relaxed">
                {tier.detail}
              </p>
            </motion.div>
          ))}
          <div className="border-t border-[var(--color-hairline-light)]" />
        </div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 max-w-5xl text-base leading-relaxed text-[var(--color-ink)]/75"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.2 }}
        >
          <div>
            <h3 className="text-base font-medium text-[var(--color-ink)] mb-3">
              What moves the number
            </h3>
            <p>
              Four things, in order of impact. How clean your data is and how
              many systems it lives in. Your accuracy target, because moving
              from 85 to 95 percent often costs more than the first 85. Whether
              a human stays in the loop, since a review interface is real
              product work. And compliance, where SOC 2 evidence, HIPAA, or EU
              data residency add two to three weeks and push you toward
              self-hosted models.
            </p>
          </div>
          <div>
            <h3 className="text-base font-medium text-[var(--color-ink)] mb-3">
              The offshore question, answered
            </h3>
            <p>
              We are in Lahore, so we overlap four to five hours with London and
              three with New York mornings. Standups happen inside that window.
              You get the repository, the staging URL, and a shared Slack channel
              on day one, plus a working build every Friday. IP assigns to you at
              signature. Payment runs in milestones, so if week three goes badly
              you stop at week three.
            </p>
          </div>
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
              The questions that decide it.
            </motion.h2>
          </div>

          <div className="space-y-0">
            {AI_CONSULTING_FAQS.map((faq, i) => {
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
            Tell us the workflow. We&rsquo;ll tell you if AI is the answer.
          </motion.h2>
          <motion.p
            className="text-base text-[var(--color-ink)]/70 mb-10 max-w-xl mx-auto"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{
              delay: 0.15,
              duration: DURATION.slow,
              ease: EASE.standard,
            }}
          >
            A 30-minute call, no deck. Sometimes the honest answer is that a
            script and a database index would fix it for a tenth of the price.
            We&rsquo;ll say so.
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
