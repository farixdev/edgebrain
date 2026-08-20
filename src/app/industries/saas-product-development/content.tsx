"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { DURATION, EASE, viewportOnce } from "@/lib/motion";

const linkClassLight =
  "underline underline-offset-4 decoration-[var(--color-ink)]/30 hover:decoration-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]";
const linkClassDark =
  "underline underline-offset-4 decoration-[var(--color-yellow)]/50 hover:decoration-[var(--color-yellow)] transition-colors duration-[var(--duration-fast)]";

const ISOLATION_MODELS = [
  {
    name: "Shared schema, tenant_id column, filtering in application code",
    verdict: "Unacceptable in 2026",
    body: "Every table carries a tenant_id and every query is supposed to filter on it. Blast radius is the entire customer base, and the failure mode is one forgotten WHERE clause in a reporting endpoint written at 2am. There is no enforcement boundary below your ORM, so every customer's safety rests on code review catching a missing predicate, forever. Cheapest to run, and the reason most cross-tenant leak postmortems read the same way.",
  },
  {
    name: "Shared schema with Postgres row level security",
    verdict: "Correct for almost everyone under Series A",
    body: "Same physical layout, but the filter moves into the database as a policy the application cannot forget. Blast radius shrinks to a policy bug rather than a query bug, and policy bugs are testable in a way that absent WHERE clauses are not. Noisy neighbours still share a buffer cache and a pool, and per-tenant point-in-time restore is hard because one tenant's rows are interleaved with everyone else's. Migrations are one ALTER TABLE.",
  },
  {
    name: "Schema per tenant",
    verdict: "A middle position that ages badly",
    body: "Isolation is real and per-tenant restore becomes tractable. The cost lands on migrations: at 2,000 schemas a single column addition is 2,000 DDL statements, catalogue bloat starts to hurt autovacuum and planning, and pooling gets awkward because search_path is session state. Online schema change tooling stops being optional the day a migration cannot finish inside a deploy window.",
  },
  {
    name: "Database per tenant",
    verdict: "A commercial decision, not an engineering default",
    body: "The cleanest possible answer to an enterprise security questionnaire, the cleanest per-tenant restore, and complete freedom from noisy neighbours. It also runs roughly two to three times the infrastructure and operational cost of a shared model, and every migration becomes a fleet orchestration problem with partial-failure states. Build this when a named customer is paying for it, or when a regulator or data-residency rule leaves you no choice.",
  },
];

const PRICING = [
  {
    name: "Architecture and readiness sprint",
    price: "from $3,500",
    time: "1 to 2 weeks",
    body: "Tenancy model chosen and written down with its consequences, an RLS policy design with the indexes it needs, an identity plan, and a migration path if you are already live on application-level filtering. You leave with a document and a working proof, not a recommendation deck.",
  },
  {
    name: "SaaS MVP build",
    price: "from $14,000",
    time: "8 to 12 weeks",
    body: "Tenancy, auth, roles, billing, and one core product loop, live. Built so the enterprise-readiness work later is an addition rather than a rewrite: audit events emitted from day one, identity abstracted behind an interface, entitlements read from data rather than hard-coded.",
  },
  {
    name: "Platform engagement",
    price: "from $18,000",
    time: "12 weeks and up",
    body: "Multi-tenant platform work with the enterprise surface included: SAML and OIDC single sign-on, SCIM provisioning, an immutable audit log, role-based access enforced at the data layer, and metering reconciled against your billing provider.",
  },
  {
    name: "Ongoing engineering",
    price: "from $1,800 per month",
    time: "rolling, 30 days notice",
    body: "The work that arrives after launch: the second identity provider that behaves nothing like the first, migrations across a growing tenant fleet, and the security questionnaire that lands mid-quarter with a deadline attached.",
  },
];

export function SaaSProductDevelopmentContent() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      {/* Hero */}
      <Section variant="light" className="pt-40 lg:pt-48">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Industries", href: "/industries" },
            { label: "B2B SaaS Product Development" },
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
          B2B SaaS product development
        </motion.p>
        <motion.h1
          className="text-display-xl max-w-4xl mb-8"
          data-reveal="y30"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.1 }}
        >
          Multi-tenant SaaS is one decision you make early and pay for slowly.
        </motion.h1>
        <motion.p
          className="text-lg text-[var(--color-mute)] max-w-2xl mb-10 leading-relaxed"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.2 }}
        >
          Everything expensive about a B2B SaaS product traces back to three
          choices: how tenants are isolated, how enterprise identity is handled,
          and how usage becomes an invoice. Get them wrong and you find out in
          the quarter a serious customer asks for SAML and a security review.
          This page is what we would actually build, and why.
        </motion.p>
        <motion.div
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.3 }}
        >
          <ButtonLink href="/contact" size="lg">
            <span>Pressure-test your architecture</span>
          </ButtonLink>
        </motion.div>
      </Section>

      {/* Isolation models */}
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
            The tenancy decision
          </motion.p>
          <motion.h2
            className="text-display-lg mb-6"
            data-reveal="y30"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.1 }}
          >
            Four isolation models, judged on what they cost you in year three.
          </motion.h2>
          <motion.p
            className="text-lg text-[var(--color-offwhite)]/60 leading-relaxed"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.2 }}
          >
            Judge them on four axes, not on elegance: blast radius when
            something goes wrong, behaviour under a noisy neighbour, whether a
            single tenant can be restored to a point in time, and what a schema
            migration costs once you have N tenants instead of five.
          </motion.p>
        </div>

        <div className="space-y-0">
          {ISOLATION_MODELS.map((model, i) => (
            <motion.div
              key={model.name}
              className="border-t border-[var(--color-hairline-dark)] py-8 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8"
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
              <div className="md:col-span-5">
                <h3 className="text-base lg:text-lg font-medium mb-2">
                  {model.name}
                </h3>
                <p className="text-sm text-[var(--color-yellow)]">
                  {model.verdict}
                </p>
              </div>
              <p className="md:col-span-7 text-sm lg:text-base text-[var(--color-offwhite)]/60 leading-relaxed">
                {model.body}
              </p>
            </motion.div>
          ))}
          <div className="border-t border-[var(--color-hairline-dark)]" />
        </div>
      </Section>

      {/* RLS as enforcement */}
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
              Row level security
            </motion.p>
            <motion.h2
              className="text-display-lg lg:sticky lg:top-32"
              data-reveal="y30"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow, delay: 0.1 }}
            >
              Put the boundary somewhere a developer cannot forget it.
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
              Postgres row level security turns tenant scoping from a convention
              into a constraint. Two details decide whether it works. A{" "}
              <code className="text-[0.9em]">USING</code> clause filters the
              rows a statement is allowed to see, so it governs SELECT, UPDATE
              and DELETE. A <code className="text-[0.9em]">WITH CHECK</code>{" "}
              clause governs the rows a statement is allowed to write. Declare
              only <code className="text-[0.9em]">USING</code> and you have
              built a system where a tenant cannot read another tenant&rsquo;s
              row but can happily insert one stamped with their neighbour&rsquo;s
              identifier. That is a real bug, it is quiet, and it usually
              surfaces as corrupted data rather than as a security alert.
            </p>
            <p>
              The second detail is boring and costs more money: every policy
              predicate needs a supporting index. A policy is appended to your
              query, so a tenant filter without a leading index on the tenant
              column turns a list endpoint into a sequential scan across every
              customer&rsquo;s rows. Fast in staging with four tenants, over at
              four hundred. Composite indexes generally need the tenant column
              first, and plans need checking under the policy, not without it.
            </p>
            <p>
              Then there is the question of how the database learns which tenant
              is asking. A session variable set per request is simple and works
              anywhere, but it is session state, and if you run transaction-mode
              connection pooling that state does not belong to your request for
              longer than a statement. The fix is to set it inside the
              transaction and let it die with the transaction, never on a
              checked-out connection. The alternative is signed claims carried
              in a JWT and read directly by the policy, which removes the
              session-state problem and replaces it with token lifetime and
              revocation questions. Both are defensible. Choosing one by
              accident is not. We work through this in detail on our{" "}
              <Link href="/services/supabase-development" className={linkClassLight}>
                Supabase and Postgres RLS work
              </Link>
              .
            </p>
            <p>
              Two operational requirements quietly eliminate options. Migrations
              across thousands of schemas need online change tooling and a
              resumable runner, because a fleet migration will fail halfway at
              some point and you need to know which tenants are on which
              version. And per-tenant point-in-time restore, which enterprise
              contracts increasingly ask for by name, is close to trivial with a
              database per tenant and painful in a shared schema, where
              restoring one customer means extracting their rows from a
              full-cluster snapshot into a staging instance and replaying them
              without touching anyone else. If that requirement is real, decide
              it before you write the first migration.
            </p>
          </motion.div>
        </div>
      </Section>

      {/* Enterprise readiness */}
      <Section variant="dark" noise>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-4">
            <motion.p
              className="text-xs uppercase tracking-[0.2em] text-[var(--color-yellow)] mb-4 font-medium"
              data-reveal="fade"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow }}
            >
              The enterprise wall
            </motion.p>
            <motion.h2
              className="text-display-lg lg:sticky lg:top-32"
              data-reveal="y30"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow, delay: 0.1 }}
            >
              SSO and SCIM are not features. They are the price of the logo.
            </motion.h2>
          </div>

          <motion.div
            className="lg:col-span-8 space-y-7 text-base lg:text-lg text-[var(--color-offwhite)]/70 leading-relaxed"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.2 }}
          >
            <p>
              B2B SaaS budgets die at the enterprise-readiness wall. A deal
              reaches procurement, security review asks for single sign-on,
              directory-driven deprovisioning, an audit trail and granular
              roles, and a team that built none of it loses a quarter. Building
              the seams for it during the MVP costs comparatively little.
            </p>
            <p>
              On identity, SAML 2.0 and OIDC are not interchangeable. OIDC is
              cleaner, JSON-native and far easier to implement, and it is what
              you want when the customer will let you have it. SAML is XML,
              signature-canonicalisation-sensitive, and still what large
              enterprises run, so a B2B product that wants those customers
              supports both. Within SAML, service-provider-initiated flows begin
              at your login screen and are straightforward. Identity-provider
              initiated flows begin in the customer&rsquo;s app portal, arrive
              unsolicited with no request to correlate against, and are where
              replay and audience-confusion vulnerabilities live. Support them
              because customers demand them, and validate them properly.
            </p>
            <p>
              Just-in-time provisioning creates the user on first successful
              login, which feels like the whole answer and is not. It has no
              answer for the employee who left: their directory account is
              disabled, your record is not, and their session or API token
              outlives their employment. SCIM 2.0 is the actual answer, because
              deprovisioning is a push from the directory rather than something
              you infer. JIT also drifts, since attributes are only refreshed
              when someone happens to log in, so a role change in the IdP can go
              months without reaching you. Domain-based auto-join is worth
              calling out separately: letting anyone with a matching email
              domain join an existing tenant is convenient and is a real
              escalation path when the domain is a shared consumer provider or
              the company was acquired. And supporting Okta well tells you
              almost nothing about how the next customer&rsquo;s Entra ID or
              Ping deployment will behave.
            </p>
            <p>
              Authorisation deserves the same seriousness. Role-based access
              covers most products. Attribute-based rules earn their place when
              access depends on record state rather than user identity, and
              relationship-based models are what you need once permissions
              inherit down a hierarchy of workspaces, folders and documents.
              Wherever the model lands, the check belongs at the query layer
              rather than the route layer: a guard on an endpoint protects one
              path, a predicate in the data layer protects every path, including
              the export job someone adds next year. Cross-tenant admin
              impersonation is the last piece. Support will need it, it is the
              most dangerous capability in the product, and unless every
              impersonated session is logged with the operator, the tenant, the
              reason and the duration, it becomes the incident.
            </p>
          </motion.div>
        </div>
      </Section>

      {/* SOC 2, stated plainly */}
      <Section variant="light">
        <div className="max-w-3xl">
          <motion.p
            className="text-xs uppercase tracking-[0.2em] text-[var(--color-mute)] mb-4 font-medium"
            data-reveal="fade"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow }}
          >
            SOC 2, without pretence
          </motion.p>
          <motion.h2
            className="text-display-lg mb-8"
            data-reveal="y30"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.1 }}
          >
            We hold no certification. Here is the part that is still ours.
          </motion.h2>
          <motion.div
            className="space-y-7 text-base lg:text-lg text-[var(--color-ink)]/75 leading-relaxed"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.2 }}
          >
            <p>
              EdgeBrain Studios is not SOC 2 certified and has not been through
              an audit. No agency can hand you a report anyway: SOC 2 is issued
              to your company by a licensed CPA firm, against controls your
              company operates. You bring the auditor, the policies, the
              onboarding and offboarding process, the vendor register and the
              risk assessment. A compliance platform will handle most of the
              paperwork side of that.
            </p>
            <p>
              What an engineering partner can own is the half of the Trust
              Services Criteria that turns into architecture and cannot be
              bolted on afterwards. Immutable audit logging with an actor, a
              resource, a before-and-after and a timestamp on every state
              change, written in the same transaction as the change so the log
              cannot drift from reality. Access review evidence that is
              queryable, because an auditor asking who had admin on this tenant
              in March is a database question if you modelled it that way and a
              forensic exercise if you did not. Change management traceability
              linking a deployed commit to a reviewed pull request. And an
              honest encryption scope: transport and at-rest encryption are the
              easy claims, key custody and rotation generate the follow-up
              questions.
            </p>
            <p>
              The pattern is the same in every direction. Retrofitting audit
              logging into a product that has been mutating rows in place for
              two years is one of the most expensive pieces of work in B2B SaaS,
              and it is entirely avoidable by emitting events from the first
              week. If you are weighing that kind of retrofit against starting
              again, our{" "}
              <Link href="/insights/rewrite-vs-refactor-legacy-app" className={linkClassLight}>
                guide to judging a rewrite against a refactor
              </Link>{" "}
              covers how we make that call.
            </p>
          </motion.div>
        </div>
      </Section>

      {/* Metering, billing, AI */}
      <Section variant="dark" noise>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-4">
            <motion.p
              className="text-xs uppercase tracking-[0.2em] text-[var(--color-yellow)] mb-4 font-medium"
              data-reveal="fade"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow }}
            >
              Metering and money
            </motion.p>
            <motion.h2
              className="text-display-lg lg:sticky lg:top-32"
              data-reveal="y30"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow, delay: 0.1 }}
            >
              Never bill from a counter you updated in place.
            </motion.h2>
          </div>

          <motion.div
            className="lg:col-span-8 space-y-7 text-base lg:text-lg text-[var(--color-offwhite)]/70 leading-relaxed"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.2 }}
          >
            <p>
              Usage metering should be an append-only event stream with an
              idempotency key on every event, aggregated into invoice lines and
              reconciled against your billing provider on a schedule. An
              incremented counter cannot be explained. When a customer disputes
              a bill, and they will, an event log lets you show them the
              timestamped records behind the number. Retries, replays and a
              late webhook all break counters silently.
            </p>
            <p>
              The pricing model then reaches back into the data model. Seat
              pricing needs a defensible definition of an active seat and
              proration that survives mid-cycle changes. Usage pricing needs
              accurate, near-real-time aggregation plus soft limits and alerts,
              because the fastest way to lose a customer is a surprise invoice.
              Hybrid pricing needs both, plus entitlements that live in data
              rather than in conditionals scattered through the codebase, so a
              plan change is a row update instead of a deploy. Trials add
              expiry, grace periods and a conversion path that does not lose
              work. The plumbing side of this is on our{" "}
              <Link href="/services/stripe-integration" className={linkClassDark}>
                Stripe integration page
              </Link>
              , and{" "}
              <Link href="/tools/mvp-cost-estimator" className={linkClassDark}>
                the MVP cost estimator
              </Link>{" "}
              will give you a rough figure for the build around it.
            </p>
            <p>
              One more, because it is new enough that most architectures have
              not caught up. If your product has an AI feature over customer
              data, tenancy has to reach into the vector layer too. A single
              shared embedding index with tenant metadata attached is a
              cross-tenant leak waiting to happen, because approximate nearest
              neighbour search returns semantic neighbours first and applies
              your filter second, and any gap between those two steps is an
              exposure. Separate namespaces, collections or indexes per tenant,
              and per-tenant scoping on retrieval before generation. Our{" "}
              <Link href="/services/ai-automation" className={linkClassDark}>
                AI automation and RAG engineering
              </Link>{" "}
              and{" "}
              <Link href="/services/ai-consulting" className={linkClassDark}>
                AI consulting practice
              </Link>{" "}
              exist for exactly these decisions.
            </p>
          </motion.div>
        </div>
      </Section>

      {/* Where not to build */}
      <Section variant="light">
        <div className="max-w-3xl">
          <motion.p
            className="text-xs uppercase tracking-[0.2em] text-[var(--color-mute)] mb-4 font-medium"
            data-reveal="fade"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow }}
          >
            When not to hire us
          </motion.p>
          <motion.h2
            className="text-display-lg mb-8"
            data-reveal="y30"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.1 }}
          >
            Some of these products should not be built at all.
          </motion.h2>
          <motion.div
            className="space-y-7 text-base lg:text-lg text-[var(--color-ink)]/75 leading-relaxed"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.2 }}
          >
            <p>
              If you are building an internal tool that happens to serve several
              departments, you do not have a multi-tenant SaaS problem and you
              should not pay for one. Departments are not tenants. Use one
              database, real roles, and skip every word above.
            </p>
            <p>
              If your idea sits in a well-served horizontal category, buy the
              incumbent. Applicant tracking, help desk, expense management,
              e-signature, basic CRM: solved at a price no custom build reaches.
              The honest test is whether your differentiation lives in the
              workflow or only in the interface. Interface dissatisfaction is
              not a business case, and a configured off-the-shelf product with
              an integration layer on top is usually the right answer.
            </p>
            <p>
              And if you have not yet validated demand, a multi-tenant platform
              is premature. A single-tenant instance for your first three
              design-partner customers will teach you more, cost a fraction, and
              can be migrated later at a known price. Do not let an architecture
              article talk you into infrastructure your revenue does not
              justify. Our writeups on{" "}
              <Link href="/insights/mvp-development-cost" className={linkClassLight}>
                what an MVP actually costs
              </Link>{" "}
              and{" "}
              <Link href="/insights/fixed-price-vs-time-and-materials" className={linkClassLight}>
                choosing between fixed price and time and materials
              </Link>{" "}
              are the honest versions of that conversation.
            </p>
          </motion.div>
        </div>
      </Section>

      {/* Cost and timeline */}
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
            What this costs, before you email us.
          </motion.h2>
          <motion.p
            className="text-lg text-[var(--color-offwhite)]/60 leading-relaxed"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.2 }}
          >
            Published bands in USD, provisional and subject to scope. Most
            projects land between $12,000 and $35,000, and our minimum
            engagement is $2,500.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 mb-16">
          {PRICING.map((tier, i) => (
            <motion.div
              key={tier.name}
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
              <h3 className="text-base font-medium mb-2">{tier.name}</h3>
              <p className="text-display-sm mb-1">{tier.price}</p>
              <p className="text-xs uppercase tracking-[0.15em] text-[var(--color-mute)] mb-4 font-medium">
                {tier.time}
              </p>
              <p className="text-sm lg:text-base text-[var(--color-offwhite)]/60 leading-relaxed">
                {tier.body}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="max-w-3xl text-base lg:text-lg text-[var(--color-offwhite)]/70 leading-relaxed"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.2 }}
        >
          Three things move a quote inside those bands: how many identity
          providers you support on day one, whether metering has to be
          near-real-time or can settle nightly, and whether you are starting
          clean or migrating a live product off application-level tenant
          filtering. That last one is the largest, because it is a data
          migration with a security deadline attached. Products with a mobile
          client scope separately under our{" "}
          <Link href="/services/mobile-app-development" className={linkClassDark}>
            mobile app development
          </Link>{" "}
          work, and the web application layer sits with our{" "}
          <Link href="/services/web-development" className={linkClassDark}>
            Next.js web development
          </Link>{" "}
          practice. You can see how we document builds across{" "}
          <Link href="/work" className={linkClassDark}>
            our published case studies
          </Link>
          .
        </motion.p>
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
            Send us your tenancy model.
          </motion.h2>
          <motion.p
            className="text-lg text-[var(--color-ink)]/70 mb-10 max-w-xl mx-auto leading-relaxed"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ delay: 0.15, duration: DURATION.slow }}
          >
            One paragraph on what you are building, how tenants are separated
            today, and the largest customer you want to close. We reply with the
            architectural risks we can see, a scope and a price, inside two
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
