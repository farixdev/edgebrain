"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { DURATION, EASE, viewportOnce } from "@/lib/motion";
import { Plus } from "lucide-react";
import { PAYLOAD_FAQS } from "./faqs";

const DELIVERABLES = [
  {
    title: "A Payload 3 install inside your Next.js app",
    body: "The (payload) route group, withPayload wired into next.config, and an admin panel rendering as React Server Components. One repo, one build, one deploy.",
  },
  {
    title: "A content model with the arguments written down",
    body: "Every collection, global and block type, and the reason it exists rather than the alternative. The decision log lives beside payload.config.ts.",
  },
  {
    title: "Access control that is the authorisation layer",
    body: "Read functions returning Where constraints so list views stay one indexed query, field access kept synchronous, and a test per role that fails the build on a regression.",
  },
  {
    title: "A localisation call made before the first collection",
    body: "Locale list, per-field fallback, and an explicit decision on localised slugs. Chosen up front it costs an afternoon. Retrofitted it is a migration through every nested block.",
  },
  {
    title: "A media pipeline that survives a restart",
    body: "S3, R2 or Vercel Blob through the cloud storage adapter, with imageSizes chosen against layouts that exist, and no local staticDir a container can forget.",
  },
  {
    title: "Migrations, drafts and preview wired for CI",
    body: "Generated Postgres migrations reviewed in a pull request, draft mode on a real preview route, revalidation from an afterChange hook, and version retention capped.",
  },
];

const POSITIONS = [
  {
    heading: "Where collections end and globals begin",
    body: [
      "A global is a single document: no list view, no per-document access control, and on the Postgres adapter its own table. Right for the things there will only ever be one of, like navigation or site-wide SEO defaults. Teams reach past that line because the sidebar looks tidier, then find the Homepage global cannot be duplicated for a campaign variant, cannot carry the draft workflow the rest of the site uses, and cannot be versioned per market once localisation lands. Converting it afterwards is a data migration.",
      "The opposite mistake is a collection holding one row forever, which makes editors hunt a list view for the only document in it and hands them a delete button for the site configuration. The rule: if the business could plausibly want two, it is a collection. If two would be a bug, it is a global.",
    ],
  },
  {
    heading: "Blocks are not free, and block soup makes editors slower",
    body: [
      "The blocks field is what sells Payload to a marketing team and what wrecks the schema eighteen months later. Every block type is another entry in the editor's picker and, on Postgres, another table joined on read. Forty block types is not a page builder. It is an undocumented design system with three near-identical hero variants, because adding the second was faster than reconciling it with the first.",
      "The test is whether the editor is choosing content or choosing layout. Content belongs in blocks. Layout belongs in the front end, as a variant select on one block rather than three blocks. Where a page is genuinely fixed, flat named fields win outright: the editor gets a form instead of a canvas, and the front end gets a type rather than a union it must defend against.",
    ],
  },
  {
    heading: "Localisation is a storage decision, not a checkbox",
    body: [
      "Adding localization to the config and localized: true to a field looks like flipping a switch. It changes where the data lives. On Postgres, localised fields move out of the parent table into locale tables, and localised arrays and blocks cascade that structure down every nested level. Retrofitting it after a year of content means a migration lifting existing column values into the default locale for every affected field, including the ones buried inside blocks.",
      "Fallback is the second call and not a default to accept unread: it renders the English title wherever the German one is missing, right for a catalogue and wrong for a legal page. Then decide whether slugs localise at all. Localised slugs buy per-locale URLs and a routing layer to match; unlocalised slugs buy one URL per document.",
    ],
  },
  {
    heading: "Access control is the authorisation layer, and field-level access is where list views die",
    body: [
      "A Payload access function can return a boolean or a Where query, and that difference matters more than anything else on this page. A read function returning a constraint, tenant equals the current user's tenant, is pushed down into the database query, so the list view stays a single indexed lookup whether the collection holds two hundred documents or two hundred thousand. One that fetches something and returns true or false is evaluated per document, and a page of twenty-five rows becomes twenty-five extra round trips.",
      "Field-level access is worse: it can only return a boolean, and it runs per field, per document. Ten restricted fields across twenty-five rows is 250 evaluations on every page of the list view, and any database call inside them is an N+1 engineered into the CMS itself. Keep field access synchronous and derived from req.user alone.",
      "The related trap is the Local API. payload.find runs with overrideAccess true by default, which is correct for seed scripts and catastrophic in a server component that forgot to pass the current user and overrideAccess false. Documented behaviour rather than a bug, and the most common way a Payload app serves one tenant another tenant's rows.",
    ],
  },
  {
    heading: "Payload 3 runs inside your Next.js app. Know what that buys and what it costs",
    body: [
      "This is the version-defining change and the honest reason to pick Payload over a hosted CMS. Payload 3 installs into a route group inside your App Router project rather than alongside it. The admin panel is React Server Components, not a separate single-page app pointed at an API. getPayload gives you the Local API in-process, so a server component queries the database directly: no HTTP hop, no API token, no network latency between the CMS and the page rendering its content.",
      "The tradeoff is that sentence read backwards. CMS and front end share a deployment, a build and a cold start. For a marketing site that is close to ideal. It is a liability the moment the two want different scaling profiles: an editorial team hammering a write-heavy admin while the public site is almost entirely cached, or Sharp resizing a 40-megapixel upload on the same function meant to render pages. That is when the admin gets split onto its own instance against the same database.",
    ],
  },
  {
    heading: "Self-hosting, database and media are three separate bills",
    body: [
      "Payload is MIT-licensed, so the cost moved rather than disappeared. The Postgres adapter builds a real relational schema through Drizzle, so schema changes need real migrations: generated with the CLI, committed, reviewed in a pull request, run in CI before the deploy that depends on them. Mongo removes that step and hands you the flexibility bill later, when four years of documents have three shapes and nothing ever stopped them.",
      "Two costs accumulate quietly. Drafts with autosave write a version row per interval per document, and versions tables grow without limit unless a max is set. And uploads run Sharp in the process that renders your pages, so every imageSizes entry is CPU and memory at upload time; a large original on a serverless function does not throw a helpful error, it hits the timeout.",
    ],
  },
];

const WRONG_CHOICE = [
  {
    title: "Nobody on your team writes TypeScript",
    body: "Payload's schema is code: a new field is a commit, a migration and a deploy. Directus and Strapi let a non-engineer add one from a UI. If nobody on staff can review a payload.config.ts pull request, Payload makes you permanently dependent on whoever built it.",
  },
  {
    title: "Your front end is not Next.js",
    body: "The whole argument for Payload 3 is that it lives inside the App Router. Serve Astro, SvelteKit, Rails or a native mobile client and you are back to an HTTP API and a token, at which point a CDN-backed hosted CMS costs less to run and less to think about.",
  },
  {
    title: "Two editors need the same document at once",
    body: "Payload has drafts, version history and document locking. It does not have Google-Docs-style multiplayer editing on a single record. If simultaneous editing is daily rather than an edge case, Sanity's real-time model is the honest recommendation, and we will say so before the contract.",
  },
  {
    title: "You want a plugin ecosystem more than a content model",
    body: "A team that wants forms, SEO, redirects and forty more capabilities installed without an engineer is describing WordPress, and that is a legitimate thing to want. Payload's official plugins are good, but installing one is still a dependency bump and a deploy.",
  },
  {
    title: "You are really asking for a checkout",
    body: "Payload models a product catalogue well. Payments, tax, fraud and checkout are a different problem with regulated answers and incumbents who solved them. Keep Shopify or Stripe for the transaction. A CMS that grows a payments module is one you will be patching at midnight.",
  },
];

const COMMITMENTS = [
  {
    title: "Your repo, your cloud, from commit one",
    body: "The config, the migrations and the schema decision log live in your GitHub organisation and deploy to your hosting account. Nothing important sits somewhere you would have to ask us for.",
  },
  {
    title: "A staging URL by the end of week one",
    body: "The admin panel is deployed and clickable before the model is finished, because arguing about a collection is faster when editors can open it. A build and a short note every Friday after that.",
  },
  {
    title: "Decisions in writing",
    body: "Collection against global, block against field, localised against not, and every access rule with its reasoning. Two years from now the record of why the schema looks like this is in the repository.",
  },
  {
    title: "Fixed scope, quoted before kickoff",
    body: "Change requests are priced and confirmed in writing before anyone starts them. A content model always grows a tail of small discoveries. That tail gets quoted, not absorbed quietly and billed later.",
  },
];

export function PayloadCMSPageContent() {
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
            { label: "Payload CMS Development" },
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
          Payload CMS Development
        </motion.p>
        <motion.h1
          className="text-display-xl max-w-4xl mb-6"
          data-reveal="y30"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.1 }}
        >
          Payload CMS development, where the content model is the deliverable.
        </motion.h1>
        <motion.p
          className="text-lg text-[var(--color-mute)] max-w-2xl mb-6"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.2 }}
        >
          You have already chosen Payload. The risk left is not whether it can
          be built. Payload will let you model almost anything, and that is
          precisely the failure mode: a schema nobody argued about becomes
          editorial and technical debt inside eighteen months. This page is
          about the modelling, access-control and hosting decisions that
          determine which one you get.
        </motion.p>
        <motion.p
          className="text-base text-[var(--color-mute)] max-w-2xl mb-10"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.25 }}
        >
          Still comparing content platforms, or scoping the application around
          the CMS? Start at{" "}
          <Link
            href="/services/web-development"
            className="underline underline-offset-4 decoration-[var(--color-hairline-light)] hover:decoration-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]"
          >
            our Next.js web development service
          </Link>{" "}
          instead. Everything below assumes Payload is settled.
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
            <span>Scope the content model</span>
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
          What a Payload build leaves behind.
        </motion.h2>
        <motion.p
          className="text-lg text-[var(--color-offwhite)]/60 max-w-2xl mb-16"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.2 }}
        >
          Six artifacts, all of them files in your repository. A Payload
          project is judged on what the next engineer finds when they open the
          config, not on how the admin panel looked at launch.
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
              Six decisions that outlive the build.
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
            Five projects where we would talk you out of Payload.
          </motion.h2>
          <motion.p
            className="text-lg text-[var(--color-offwhite)]/60 leading-relaxed"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.2 }}
          >
            We like Payload, which is exactly why the boundary is worth
            drawing. If you are weighing it against staying where you are,{" "}
            <Link
              href="/services/wordpress-to-nextjs-migration"
              className="underline underline-offset-4 decoration-[var(--color-hairline-dark)] hover:decoration-[var(--color-yellow)] transition-colors duration-[var(--duration-fast)]"
            >
              our WordPress to Next.js migration page
            </Link>{" "}
            argues both directions on the same question.
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

      {/* How it runs */}
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
            We are not a Payload partner agency. The official programme is
            small and awarded on evidence of shipped Payload work, so we would
            rather say that plainly than let a badge do work the code should be
            doing. Judge us on the reasoning above and on{" "}
            <Link
              href="/work"
              className="underline underline-offset-4 decoration-[var(--color-hairline-light)] hover:decoration-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]"
            >
              how we document the builds we publish
            </Link>
            .
          </p>
          <p>
            Pricing follows the published rate card rather than a per-field
            calculator: marketing sites start at $6,000, platforms at $18,000,
            and the minimum engagement is $2,500. What moves it, roughly in
            order: how much of the content model is genuinely distinct; whether
            localisation is in scope; how many roles the access layer expresses,
            and whether tenancy is one of them; whether existing content is
            remodelled on the way in; and whether the admin deploys separately
            from the front end. The same argument we make about{" "}
            <Link
              href="/insights/mvp-development-cost"
              className="underline underline-offset-4 decoration-[var(--color-hairline-light)] hover:decoration-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]"
            >
              what an MVP actually costs
            </Link>{" "}
            applies here: the estimate follows the decisions, not the page
            count.
          </p>
          <p>
            If the site is already live and the complaint is speed rather than
            structure, read{" "}
            <Link
              href="/insights/why-your-nextjs-site-is-slow"
              className="underline underline-offset-4 decoration-[var(--color-hairline-light)] hover:decoration-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]"
            >
              why your Next.js site is slow
            </Link>{" "}
            before commissioning anything. Otherwise, send the content you have
            and the shape you want, and{" "}
            <Link
              href="/contact"
              className="underline underline-offset-4 decoration-[var(--color-hairline-light)] hover:decoration-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]"
            >
              get a fixed quote against a written schema
            </Link>
            .
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
            {PAYLOAD_FAQS.map((faq, i) => {
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
            Argue the schema before anyone writes it.
          </motion.h2>
          <motion.p
            className="text-lg text-[var(--color-ink)]/70 mb-10 max-w-xl mx-auto"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ delay: 0.15, duration: DURATION.slow }}
          >
            Send us the content you have and the editing experience you want.
            You get a proposed content model back, with the collection, block
            and localisation calls written down. Fixed scope, fixed price, start
            date within two working days. Email edgebrainstudios@gmail.com or
            call the number below.
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
