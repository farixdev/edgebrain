"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { DURATION, EASE, viewportOnce } from "@/lib/motion";
import { Plus } from "lucide-react";
import { N8N_FAQS } from "./faqs";

const DELIVERABLES = [
  {
    title: "A custom node for the API nobody else has integrated",
    body: "Declarative style when the API is a well-behaved REST surface, programmatic when auth refresh, cursor pagination, or binary handling needs real code. Shipped as a versioned npm package under the n8n-nodes- convention, in your repository, installable without us.",
  },
  {
    title: "A self-hosted instance that survives its first busy Tuesday",
    body: "Queue mode with Redis, worker containers you can scale on their own, Postgres instead of the default SQLite, binary data pushed to S3, and a pruning policy configured before the execution table is 40GB rather than after.",
  },
  {
    title: "AI agent workflows with a tool list you can read",
    body: "The Agent node wired to a named, bounded set of tools. Chat memory in Postgres rather than in process. A retrieval step that returns what it cited. A hard stop that hands the run to a person when confidence drops, instead of guessing confidently.",
  },
  {
    title: "An error architecture, not an error message",
    body: "A designated error workflow set at instance level, retry with backoff on every network-bound node, error output branches on the steps that fail predictably, and a dead-letter queue holding the original payload so a run can be replayed.",
  },
  {
    title: "A rescue of the workflows you already have",
    body: "The ninety-node canvas somebody built in a fortnight and nobody now dares touch. We split it into sub-workflows, get the JSON into git, add the checks a canvas cannot hold, and write down what each branch was actually for.",
  },
  {
    title: "A migration off Zapier or Make",
    body: "Rebuilt rather than transliterated. Most Zap chains are linear because Zapier makes branching expensive to run. The n8n version is usually half the steps, does more, and stops billing you per step.",
  },
  {
    title: "The interface n8n does not give you",
    body: "An exception dashboard or an approval screen in Next.js, reading the same Postgres. Asking an operations lead to log into a workflow editor to correct one record is not a product, it is a hostage situation.",
  },
];

const WRONG = [
  {
    title: "Volume in the millions of records a day",
    body: "n8n holds the items of an execution in memory. Fan out to a million records in one run and you have not scaled a workflow, you have written a memory leak with a pleasant interface. Past a few thousand items in a single execution the honest answer is a real queue and application code. SQS and Lambda, or Temporal, with n8n demoted to the trigger and the notification.",
  },
  {
    title: "Anything sitting in a user-facing request path",
    body: "A webhook workflow is a fine integration endpoint and a poor API. Node initialisation, queue wait, and per-node persistence put your tail latency somewhere you would not enjoy defending. If a human is watching a spinner, write an endpoint.",
  },
  {
    title: "Long-running processes with genuine state",
    body: "Multi-week approval chains, compensation logic, saga patterns where step six failing means unwinding steps one through five. The Wait node offloads to the database past roughly a minute and resumes correctly, but n8n has no durable state model beyond the execution itself. Temporal exists for this and is worth the learning curve.",
  },
  {
    title: "When the workflow has quietly become an application",
    body: "The tell is not node count, though past forty we start asking. It is when the thing has its own permissions model, its own multi-tenant data, or a second workflow depending on its internal shape. At that point you are maintaining an application in a format with no tests, no code review, and no type checking.",
  },
  {
    title: "When nobody on your side will operate it",
    body: "A self-hosted instance needs an owner: someone who applies upgrades, watches the database, and rotates credentials. If that person does not exist and you do not want us on a retainer, n8n Cloud or Zapier is the better answer even at a worse price per run. Reliability you did not have to build is worth paying for.",
  },
];

const COMMITMENTS = [
  {
    title: "A running instance in week one",
    body: "Not a diagram of a workflow. A deployed n8n you can open, trigger, and break, sitting in your infrastructure, with the first workflow already firing against real data.",
  },
  {
    title: "Your repo, your cloud, your keys",
    body: "The instance runs in your account. Workflow JSON lives in your repository. The encryption key is in your secret manager from the first commit, and we never hold the only copy of anything.",
  },
  {
    title: "Decisions in writing",
    body: "Every choice worth arguing about gets a short note in the repo with the reasoning attached. Queue mode or single process. Custom node or HTTP Request. Where the human sits in the loop.",
  },
  {
    title: "Fixed scope, quoted before kickoff",
    body: "You approve a scope and a price before anyone writes a node. A change that adds more than a day is estimated in writing and either approved or deferred. Nothing arrives as an invoice surprise.",
  },
];

export function N8NAutomationPageContent() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      {/* Hero */}
      <Section variant="light" className="pt-40 lg:pt-48">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Services", href: "/services" },
            { label: "n8n Automation Development" },
          ]}
        />
        <motion.p
          className="text-xs uppercase tracking-[0.2em] text-[var(--color-mute)] mb-4 font-medium"
          data-reveal="fade"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow }}
        >
          n8n Automation Development
        </motion.p>
        <motion.h1
          className="text-display-xl max-w-4xl mb-6"
          data-reveal="y30"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.1 }}
        >
          Hire n8n developers who will tell you when n8n is the wrong answer.
        </motion.h1>
        <motion.p
          className="text-lg text-[var(--color-mute)] max-w-2xl mb-6 leading-relaxed"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.2 }}
        >
          This page assumes you have already chosen the tool. What you need next
          is somebody who has run n8n in queue mode under load, written a custom
          node against an API with a badly behaved token refresh, and recovered
          a self-hosted instance whose encryption key vanished on a container
          restart. Custom nodes, self-hosted deployment, credential handling,
          error branches and retries, and the point at which a workflow should
          stop being a workflow.
        </motion.p>
        <motion.p
          className="text-base text-[var(--color-mute)] max-w-2xl mb-10 leading-relaxed"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.25 }}
        >
          If the tool question is still open and what you actually want to know
          is which manual work should disappear first, start one level up with{" "}
          <Link
            href="/services/ai-automation"
            className="underline underline-offset-4 decoration-[var(--color-hairline-light)] hover:decoration-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]"
          >
            our AI automation service
          </Link>
          . That page is about the outcome. This one is about the tooling.
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
            <span>Scope your workflow</span>
          </ButtonLink>
          <a
            href="tel:+923270944766"
            className="text-sm font-medium underline underline-offset-4 decoration-[var(--color-hairline-light)] hover:decoration-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]"
          >
            +92 327 0944766
          </a>
        </motion.div>
      </Section>

      {/* What we build with it */}
      <Section variant="dark" noise>
        <motion.h2
          className="text-display-lg max-w-3xl mb-4"
          data-reveal="y30"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.1 }}
        >
          What we actually build in n8n.
        </motion.h2>
        <motion.p
          className="text-lg text-[var(--color-offwhite)]/60 max-w-2xl mb-16 leading-relaxed"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.2 }}
        >
          Artifacts, not service categories. For the anatomy of one of these
          pipelines end to end, including where the human review queue belongs,
          we wrote up{" "}
          <Link
            href="/insights/automate-document-processing"
            className="underline underline-offset-4 decoration-[var(--color-hairline-dark)] hover:decoration-[var(--color-yellow)] transition-colors duration-[var(--duration-fast)]"
          >
            how to automate document processing
          </Link>{" "}
          separately.
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
          <div className="border-t border-[var(--color-hairline-dark)] md:col-span-2" />
        </div>
      </Section>

      {/* Technical positions */}
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
              What decides whether a self-hosted instance is still standing in a
              year.
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
              Start with the encryption key, because the most common way a
              self-hosted instance dies has nothing to do with workflows. On
              first boot n8n writes a key into its home directory and encrypts
              every stored credential with it. Run the container without a
              persistent volume mounted at that path and the next restart
              generates a fresh key, at which point every credential in the
              database is ciphertext nobody can read. We set{" "}
              <code className="text-[0.9em] px-1.5 py-0.5 rounded-[var(--radius-md)] bg-[var(--color-ink)]/5 border border-[var(--color-hairline-light)]">
                N8N_ENCRYPTION_KEY
              </code>{" "}
              explicitly from your secret manager on day one and treat it like a
              database password, because losing it costs about the same.
            </p>
            <p>
              Second, know what the licence actually is before you commit to
              self-hosting. n8n is fair-code under the Sustainable Use Licence,
              not OSI open source. Internal business use is fine; reselling it
              as your own hosted product is not. And the features an enterprise
              tends to assume are included &mdash; single sign-on, git-backed
              environments, external secrets, log streaming &mdash; sit behind a
              paid licence. Self-hosting saves you per-execution pricing. It
              does not automatically save you a licence fee, and a procurement
              team discovering that in month four is not a pleasant meeting.
            </p>
            <p>
              Third, queue mode is not an optimisation, it is where we start.
              Out of the box n8n executes workflows inside the same Node process
              that serves the editor. One workflow doing a synchronous transform
              over twenty thousand items will block the event loop, and the
              symptom your team reports is not &ldquo;the workflow is
              slow&rdquo; but &ldquo;the canvas has frozen.&rdquo; Setting{" "}
              <code className="text-[0.9em] px-1.5 py-0.5 rounded-[var(--radius-md)] bg-[var(--color-ink)]/5 border border-[var(--color-hairline-light)]">
                EXECUTIONS_MODE=queue
              </code>{" "}
              with Redis in front and separate worker containers costs an hour
              in week one and is miserable to retrofit during an incident.
              Worker concurrency then becomes a real number with real
              consequences: set it high against a rate-limited API and you have
              built a distributed way to generate 429s.
            </p>
            <p>
              Fourth, the execution table is what actually takes instances down.
              Every run persists its per-node input and output data, on success
              as well as on failure, and by default into SQLite. A workflow
              firing every minute with a moderately fat payload will put tens of
              gigabytes in there inside a quarter, and by the time anyone looks,
              the pruning job is competing with live traffic on a database that
              can no longer breathe. So: Postgres from the start, retention and
              max-age pruning configured before launch rather than after, saving
              on success turned down for high-frequency workflows, and binary
              data moved to filesystem or S3 so a 40MB PDF is not copied through
              execution history at every node it passes.
            </p>
            <p>
              Fifth, retry is not recovery, and n8n makes the two easy to
              confuse. Per-node retry with a wait between attempts handles a
              flaky endpoint well. It does nothing about the case that actually
              hurts, which is a workflow failing at node nine after node four
              already created a record; re-running from the start creates it
              again. So anything that writes gets an idempotency key or a
              lookup-before-insert, and the steps that genuinely cannot be made
              idempotent get isolated into their own sub-workflow with their own
              error branch. The error workflow itself is set at instance level,
              not per workflow, so a new automation cannot ship silently
              unmonitored.
            </p>
            <p>
              Sixth, most requests for a custom node do not need one. The HTTP
              Request node with a generic credential will talk to your internal
              API today, costs nothing to maintain, and needs no republishing
              when that API changes. A custom node earns its keep when the
              integration will be used by people who should never see a header,
              when auth or cursor pagination is fiddly enough that repeating it
              across a dozen workflows is a liability, or when you want the
              thing callable as a tool by an agent. When we do build one:
              declarative style for well-behaved REST surfaces because there is
              far less to break, programmatic when binary handling or a token
              refresh quirk needs actual control.
            </p>
            <p>
              A last one that is procedural rather than technical. A workflow
              living only on a canvas is not under source control, and the
              feature that fixes that properly sits on the paid tier. Where that
              licence is not in the budget, we export workflow JSON into your
              repository and review changes as diffs, which is uglier than it
              sounds useful but means somebody can answer what changed on
              Tuesday. Either way the rule holds: production is deployed to, not
              edited in. Two adjacent decisions come up on nearly every
              engagement and are worth settling before kickoff &mdash; where the
              confidence threshold sits, and whether the retrieval step needs{" "}
              <Link
                href="/insights/rag-vs-fine-tuning"
                className="underline underline-offset-4 decoration-[var(--color-hairline-light)] hover:decoration-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]"
              >
                RAG or a fine-tune
              </Link>
              , which is almost always retrieval.
            </p>
          </motion.div>
        </div>
      </Section>

      {/* When this is the wrong choice */}
      <Section variant="dark" noise>
        <motion.h2
          className="text-display-lg max-w-3xl mb-4"
          data-reveal="y30"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.1 }}
        >
          Where we would tell you not to use n8n.
        </motion.h2>
        <motion.p
          className="text-lg text-[var(--color-offwhite)]/60 max-w-2xl mb-16 leading-relaxed"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.2 }}
        >
          Everyone selling n8n hours has an incentive to say it fits. It has
          edges, they are knowable in advance, and finding them in month five is
          expensive for both of us. Here they are, with what we would build
          instead.
        </motion.p>

        <div className="space-y-0">
          {WRONG.map((item, i) => (
            <motion.div
              key={item.title}
              className="border-t border-[var(--color-hairline-dark)] py-8 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8"
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
              <h3 className="lg:col-span-5 text-base lg:text-lg font-medium">
                {item.title}
              </h3>
              <p className="lg:col-span-7 text-sm lg:text-base text-[var(--color-offwhite)]/60 leading-relaxed">
                {item.body}
              </p>
            </motion.div>
          ))}

          <motion.div
            className="border-t border-[var(--color-hairline-dark)] py-8 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, ease: EASE.standard }}
          >
            <h3 className="lg:col-span-5 text-base lg:text-lg font-medium">
              What replaces it in that fourth case
            </h3>
            <p className="lg:col-span-7 text-sm lg:text-base text-[var(--color-offwhite)]/60 leading-relaxed">
              A service with a job queue, tests, and types: ordinary{" "}
              <Link
                href="/services/web-development"
                className="underline underline-offset-4 decoration-[var(--color-hairline-dark)] hover:decoration-[var(--color-yellow)] transition-colors duration-[var(--duration-fast)]"
              >
                Next.js and TypeScript web development
              </Link>
              , which is cheaper to own across five years than an application
              hiding inside a workflow canvas. n8n usually stays in the picture
              afterwards as the trigger, the notification layer, and the
              integrations your operations team edits without calling us.
            </p>
          </motion.div>
          <div className="border-t border-[var(--color-hairline-dark)]" />
        </div>
      </Section>

      {/* How we work */}
      <Section variant="light">
        <motion.h2
          className="text-display-lg max-w-3xl mb-6"
          data-reveal="y30"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.1 }}
        >
          How the engagement runs, and what it costs.
        </motion.h2>
        <motion.p
          className="text-lg text-[var(--color-mute)] max-w-2xl mb-14 leading-relaxed"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.2 }}
        >
          Pricing follows the rates already published across our automation
          work, because n8n is a tool we use rather than a separate business
          line. AI pilots start at $2,500. One production workflow, monitored,
          with error handling and a review queue, starts at $7,000. Ongoing
          support &mdash; upgrades, database health, credential rotation, and a
          set number of changes each month &mdash; starts at $1,800 a month.
          Scope and price are fixed before kickoff.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-0 mb-14">
          {COMMITMENTS.map((item, i) => (
            <motion.div
              key={item.title}
              className="border-t border-[var(--color-hairline-light)] py-8"
              data-reveal="y16"
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
              <p className="text-sm lg:text-base text-[var(--color-ink)]/70 leading-relaxed">
                {item.body}
              </p>
            </motion.div>
          ))}
          <div className="border-t border-[var(--color-hairline-light)] md:col-span-2" />
        </div>

        <motion.p
          className="text-base lg:text-lg text-[var(--color-ink)]/75 max-w-3xl leading-relaxed"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.2 }}
        >
          Two senior engineers, four hours of overlap with the US East Coast and
          the full working day with Europe. The person on the call is the person
          writing the nodes. You can judge the standard of the work from{" "}
          <Link
            href="/work"
            className="underline underline-offset-4 decoration-[var(--color-hairline-light)] hover:decoration-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]"
          >
            our published case studies
          </Link>
          , or skip ahead and{" "}
          <Link
            href="/contact"
            className="underline underline-offset-4 decoration-[var(--color-hairline-light)] hover:decoration-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]"
          >
            send us the workflow you want built
          </Link>
          .
        </motion.p>
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
            {N8N_FAQS.map((faq, i) => {
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
            Send us the workflow. Get a straight answer.
          </motion.h2>
          <motion.p
            className="text-lg text-[var(--color-ink)]/70 mb-10 max-w-xl mx-auto"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ delay: 0.15, duration: DURATION.slow }}
          >
            Describe what has to happen, how often, and what it touches. You get
            a fixed scope, a fixed price, and an honest note if n8n is not the
            right home for it. Email edgebrainstudios@gmail.com or call the
            number below.
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
