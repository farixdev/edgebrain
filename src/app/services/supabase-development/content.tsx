"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { DURATION, EASE, viewportOnce } from "@/lib/motion";
import { Plus } from "lucide-react";
import { SUPABASE_FAQS } from "./faqs";

const DELIVERABLES = [
  {
    title: "A policy set, and the tests that prove it",
    body: "RLS on every table holding user data, policies split by command rather than one catch-all FOR ALL, and tests that run each policy as a real signed-in user.",
  },
  {
    title: "A migration history that is the schema",
    body: "Every change lands as a file in version control, exercised against a branch database first. Nothing exists only because somebody clicked it in the dashboard.",
  },
  {
    title: "A connection strategy, written per runtime",
    body: "Which processes use the pooler in transaction mode, which need a session, which hold a direct connection. Wrong here fails as intermittent timeouts, not as a review comment.",
  },
  {
    title: "Auth wired to actual authorisation",
    body: "Supabase Auth answers who you are. Roles, org membership and plan tier become tables, with only what belongs in the token surfaced through a custom access token hook.",
  },
  {
    title: "A boundary map for functions, triggers and jobs",
    body: "What runs in a Deno Edge Function, what in a route handler, what is a trigger, what is a queue row drained by pg_cron — each with its reason attached.",
  },
  {
    title: "Storage policies and a measurable pgvector layer",
    body: "Object policies on storage.objects mirroring the table policies, signed URLs with real expiry, and retrieval recall measured against a labelled question set.",
  },
];

const POSITIONS = [
  {
    heading: "auth.uid() inside a policy runs once per row until you wrap it",
    body: [
      "A policy written as using (user_id = auth.uid()) re-evaluates that function for every candidate row; the planner has no licence to hoist it. Write using (user_id = (select auth.uid())) and it becomes an InitPlan, evaluated once for the statement. At five thousand rows the difference is invisible. At five million it is a gateway timeout, and it arrives suddenly rather than gradually. Add TO authenticated so anonymous requests are refused before evaluation, and split policies by command: one FOR ALL policy whose WITH CHECK was copied from its USING clause is how a user writes a row into a tenant they cannot read.",
    ],
  },
  {
    heading: "Every policy is a WHERE clause, so every policy needs an index",
    body: [
      "RLS is folded into your query, not layered above it. using (tenant_id = (select auth.jwt() ->> 'tenant_id')) is a predicate the planner must satisfy on every read, and an unindexed tenant_id hands each authenticated user a sequential scan. A policy on org_members that queries org_members fails outright with infinite recursion detected; move that lookup into a SECURITY DEFINER function, declared STABLE with SET search_path = ''. And on the record: below Series A, absent a contractual isolation requirement, shared schema with a tenant column beats database-per-tenant, which buys you migrations that run N times and a connection budget scaling with customer count.",
    ],
  },
  {
    heading: "service_role does not bypass a policy, it bypasses the model",
    body: [
      "The service key maps to a Postgres role with BYPASSRLS. One server action instantiated with it and every policy on every table stops applying for that request — the authorisation layer switched off, not bent. It usually happens because a developer hit a policy that was wrong and reached for the key that silenced the error. Use the anon key with the user's JWT for anything user-scoped, including on the server, where the session comes off the cookie. Keep service_role to paths no user request can reach, never behind a NEXT_PUBLIC_ prefix, and list every file that holds it.",
    ],
  },
  {
    heading: "Serverless plus Postgres is connection exhaustion without a pooler",
    body: [
      "A small instance tops out in the low hundreds of connections, each one a backend process holding memory, while serverless scales to hundreds of concurrent invocations by design. Supavisor transaction mode on port 6543 returns the connection after every statement and is what functions should use — at the cost of prepared statements, which postgres-js needs prepare set to false for, and of session state, so SET, LISTEN and NOTIFY, and advisory locks held across statements do not survive. Session mode on 5432 suits a long-lived container and migration tooling. Decide per runtime, not once per project.",
    ],
  },
  {
    heading: "Where code lives is an architecture decision, not a preference",
    body: [
      "Edge Functions run Deno on their own deploy clock, which is what you want for third-party webhooks whose URLs should not move every release and for jobs that belong near the database. Route handlers are right when the code shares your application's types, session and validation. Triggers are excellent for invariants — updated_at, an audit row, a denormalised counter — and poor as business logic: a trigger reaching out over pg_net has no retries and no way to test the transaction that fired it. Realtime is not a queue either. Postgres Changes is an at-most-once broadcast with no replay after a reconnect, so use it to say something changed and refetch. Work that must happen exactly once belongs in a table read with FOR UPDATE SKIP LOCKED.",
    ],
  },
  {
    heading: "pgvector is a real vector store if you choose the index deliberately",
    body: [
      "IVFFlat builds fast but clusters rows into lists, so it wants representative data present at build time and its recall drifts as you insert until you reindex. HNSW builds slower and costs more memory, holds recall as the table grows, and can be built on an empty table; m and ef_construction are fixed at build, while ef_search trades recall against latency per query. Filtering is the trap nobody warns you about: an approximate index answers nearest neighbours overall, then your tenant predicate is applied to that result, so a narrow filter returns fewer rows than you asked for. Partial indexes per tenant, or honest exact search when the candidate set is small. An indexed vector column also stops at 2,000 dimensions.",
    ],
  },
];


const WRONG_CHOICE = [
  {
    title: "Writes that must be fast on three continents",
    body: "One primary Postgres, with read replicas as an option. Reads move closer to users; writes do not. If that is your hot path, pick a distributed database before the schema exists.",
  },
  {
    title: "Analytics sharing the transactional instance",
    body: "Wide aggregate scans against the instance serving your app will starve it, and the answer is not another index. Replicate to a warehouse and let the database stay transactional.",
  },
  {
    title: "Offline-first is the product, not a nicety",
    body: "There is no built-in conflict resolution for a client offline a week. Use a sync engine built for it — PowerSync or ElectricSQL over Postgres. Merge semantics do not bolt on afterwards.",
  },
  {
    title: "Nobody on your side will own a database",
    body: "Postgres becomes yours: migrations, indexes, the connection budget, the plan for when a table gets large. A feature when somebody will hold it, a liability when no one will.",
  },
  {
    title: "Everything already lives in one cloud's private network",
    body: "If the architecture requires the database never be reachable from the public internet, a managed Postgres in that same account with IAM authentication is fewer exceptions to write down.",
  },
];

const COMMITMENTS = [
  {
    title: "Your repo and your cloud from commit one",
    body: "Schema, policies, functions and policy tests are files in your repository from the first migration, not screenshots in a thread.",
  },
  {
    title: "A staging URL by the end of week one",
    body: "Deployed and clickable on a branch database, so migrations are exercised somewhere safe. A build and a short written note every Friday.",
  },
  {
    title: "Decisions in writing",
    body: "Every use of service_role, every trigger, every boundary between an Edge Function and a route handler, recorded with its reasoning.",
  },
  {
    title: "Fixed scope, quoted before kickoff",
    body: "Change requests are priced and confirmed in writing before anyone starts. Database work has a tail of small discoveries; that tail gets quoted, not absorbed.",
  },
];

export function SupabaseDevelopmentPageContent() {
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
            { label: "Supabase Development" },
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
          Supabase Development
        </motion.p>
        <motion.h1
          className="text-display-xl max-w-4xl mb-6"
          data-reveal="y30"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.1 }}
        >
          Supabase development, treated as Postgres engineering rather than a
          Firebase clone.
        </motion.h1>
        <motion.p
          className="text-lg text-[var(--color-mute)] max-w-2xl mb-6"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.2 }}
        >
          You have already chosen Supabase. What you need next is an opinion
          about Row Level Security, connection pooling and vector indexes, not a
          marketplace renting you a body for forty hours. This page covers the
          decisions that decide whether the project survives its first ten
          thousand users: how policies get written so they use their indexes,
          which runtime talks to which port, and where{" "}
          <span className="text-[var(--color-ink)]">service_role</span> is
          allowed to appear at all.
        </motion.p>
        <motion.p
          className="text-base text-[var(--color-mute)] max-w-2xl mb-10"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.25 }}
        >
          Still choosing the stack rather than confirming it?{" "}
          <Link
            href="/services/web-development"
            className="underline underline-offset-4 decoration-[var(--color-hairline-light)] hover:decoration-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]"
          >
            How we build web applications
          </Link>{" "}
          covers the framework and hosting decisions this page assumes are
          settled. If it is really an AI feature with a database attached,{" "}
          <Link
            href="/services/ai-consulting"
            className="underline underline-offset-4 decoration-[var(--color-hairline-light)] hover:decoration-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]"
          >
            our AI consulting engagement
          </Link>{" "}
          is the better door.
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
            <span>Scope the build</span>
          </ButtonLink>
          <Link
            href="/work"
            className="text-sm font-medium underline underline-offset-4 decoration-[var(--color-hairline-light)] hover:decoration-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]"
          >
            See how we document a build
          </Link>
        </motion.div>
      </Section>

      {/* Deliverables */}
      <Section variant="dark" noise>
        <motion.h2
          className="text-display-lg max-w-3xl mb-4"
          data-reveal="y30"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.1 }}
        >
          Six things that end up in your repository.
        </motion.h2>
        <motion.p
          className="text-lg text-[var(--color-offwhite)]/60 max-w-2xl mb-16"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.2 }}
        >
          Not a demo with RLS switched off so the queries return something. This
          build is judged six months later, when a new engineer changes one
          policy without leaking another tenant&rsquo;s rows.
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
          <div className="lg:col-span-4">
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
              Six things that separate a Supabase build from a Supabase demo.
            </motion.h2>
          </div>

          <div className="lg:col-span-8 space-y-0">
            {POSITIONS.map((block, i) => (
              <motion.div
                key={block.heading}
                className="border-t border-[var(--color-hairline-light)] py-8"
                data-reveal="y20"
                initial={false}
                whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{
                  duration: DURATION.slow,
                  ease: EASE.standard,
                  delay: (i % 2) * 0.05,
                }}
              >
                <h3 className="text-display-sm mb-4">{block.heading}</h3>
                <div className="space-y-4 text-base lg:text-lg text-[var(--color-ink)]/75 leading-relaxed">
                  {block.body.map((para) => (
                    <p key={para.slice(0, 48)}>{para}</p>
                  ))}
                </div>
              </motion.div>
            ))}
            <div className="border-t border-[var(--color-hairline-light)]" />

            <motion.p
              className="pt-8 text-base lg:text-lg text-[var(--color-ink)]/75 leading-relaxed"
              data-reveal="y20"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow, delay: 0.1 }}
            >
              The vector half leads straight into the case for{" "}
              <Link
                href="/insights/rag-vs-fine-tuning"
                className="underline underline-offset-4 decoration-[var(--color-hairline-light)] hover:decoration-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]"
              >
                retrieval over fine-tuning for most product features
              </Link>{" "}
              and into how we scope{" "}
              <Link
                href="/services/ai-automation"
                className="underline underline-offset-4 decoration-[var(--color-hairline-light)] hover:decoration-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]"
              >
                AI automation that reads your own data
              </Link>
              .
            </motion.p>
          </div>
        </div>
      </Section>

      {/* When this is the wrong choice */}
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
            When not to use it
          </motion.p>
          <motion.h2
            className="text-display-lg mb-6"
            data-reveal="y30"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.1 }}
          >
            Five projects we would not put on Supabase.
          </motion.h2>
          <motion.p
            className="text-lg text-[var(--color-offwhite)]/60 leading-relaxed"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.2 }}
          >
            We build on this stack and we are still talking you out of it five
            times. The offline case in particular is a{" "}
            <Link
              href="/services/mobile-app-development"
              className="underline underline-offset-4 decoration-[var(--color-hairline-dark)] hover:decoration-[var(--color-yellow)] transition-colors duration-[var(--duration-fast)]"
            >
              mobile architecture question
            </Link>{" "}
            long before it is a database one.
          </motion.p>
        </div>

        <div className="space-y-0">
          {WRONG_CHOICE.map((item, i) => (
            <motion.div
              key={item.title}
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
              <h3 className="md:col-span-5 text-base lg:text-lg font-medium">
                {item.title}
              </h3>
              <p className="md:col-span-7 text-sm lg:text-base text-[var(--color-offwhite)]/60 leading-relaxed">
                {item.body}
              </p>
            </motion.div>
          ))}
          <div className="border-t border-[var(--color-hairline-dark)]" />
        </div>
      </Section>

      {/* How we work and what it costs */}
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
            How it runs
          </motion.p>
          <motion.h2
            className="text-display-lg mb-6"
            data-reveal="y30"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.1 }}
          >
            Four commitments, and what moves the number.
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-0 mb-16">
          {COMMITMENTS.map((item, i) => (
            <motion.div
              key={item.title}
              className="border-t border-[var(--color-hairline-light)] py-8"
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
              <p className="text-sm lg:text-base text-[var(--color-ink)]/70 leading-relaxed">
                {item.body}
              </p>
            </motion.div>
          ))}
          <div className="border-t border-[var(--color-hairline-light)] md:col-span-2" />
        </div>

        <motion.div
          className="max-w-3xl space-y-6 text-base lg:text-lg text-[var(--color-ink)]/75 leading-relaxed"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.15 }}
        >
          <p>
            We quote fixed scope against a published rate card rather than
            selling hours, which is the real difference between this page and
            the staffing marketplaces. Platforms start at $18,000 and MVPs at
            $14,000. The minimum engagement is $2,500, a retainer starts at
            $1,800 a month, and most projects land between $12,000 and $35,000.
          </p>
          <p>
            What moves it: the number of tables holding user data, how many
            distinct roles the policies must encode, whether existing data is
            migrating in, and whether the product needs realtime or vector
            search. The same reasoning we apply to{" "}
            <Link
              href="/insights/mvp-development-cost"
              className="underline underline-offset-4 decoration-[var(--color-hairline-light)] hover:decoration-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]"
            >
              what an MVP actually costs
            </Link>
            . Send us the schema, or just who is allowed to see what, and you
            get the policy surface back before you get a price.
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
            {SUPABASE_FAQS.map((faq, i) => {
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

                  {/* Always mounted so every answer ships in the server HTML.
                      The FAQPage JSON-LD on this route declares these answers,
                      and declaring markup for content that never renders is a
                      structured-data violation. `inert` keeps the collapsed
                      panel out of the tab order. */}
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
            Send the schema. Get the policy surface back first.
          </motion.h2>
          <motion.p
            className="text-lg text-[var(--color-ink)]/70 mb-10 max-w-xl mx-auto"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ delay: 0.15, duration: DURATION.slow }}
          >
            Tell us who is allowed to see what and we will map it to policies
            before we quote. Fixed scope, fixed price, start date within two
            working days. Email edgebrainstudios@gmail.com or call the number
            below.
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
