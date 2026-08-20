"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { DURATION, EASE, viewportOnce } from "@/lib/motion";
import { Plus } from "lucide-react";
import { WP_MIGRATION_FAQS } from "./faqs";

const DELIVERABLES = [
  {
    title: "A redirect map generated from your permalinks",
    body: "Not typed into a spreadsheet. We read the permalink structure and the posts table, then reconcile the result against a full crawl and against every URL with a Search Console impression.",
  },
  {
    title: "A parity report you sign off before cutover",
    body: "Old URL against new URL: status code, canonical, title, meta description, H1, indexable word count, internal link count, and the whole JSON-LD graph. Differences become decisions instead of accidents.",
  },
  {
    title: "A headless WordPress front end, or a clean break",
    body: "WPGraphQL against the install you already run, with ACF fields typed end to end. Or a content model rebuilt in Sanity or Payload. We recommend one and write down why.",
  },
  {
    title: "A publishing loop your editors recognise",
    body: "Draft mode preview on the real front end, revalidation on publish through a signed webhook, and visible build status so nobody has to guess whether a change went live.",
  },
  {
    title: "A plugin replacement inventory",
    body: "Every active plugin, what it does, and what replaces it: forms, redirects, sitemaps, caching, analytics, membership. The ones with no replacement get named before the contract, not during week four.",
  },
  {
    title: "A cutover runbook with a rollback in it",
    body: "TTLs lowered days ahead, the old stack left running and reachable, and a written condition for reverting. Cutover happens on a Tuesday morning. Never on a Friday.",
  },
  {
    title: "Two weeks of post-launch redirect telemetry",
    body: "Every 404 and every redirect hit logged with its referrer, reviewed daily for the first week. Migrations lose traffic to a handful of URLs nobody thought to map, and those surface here inside 48 hours.",
  },
];

const POSITIONS = [
  {
    heading: "The redirect map comes out of the database, not a spreadsheet",
    body: [
      "A WordPress install serves far more URLs than its sitemap admits. Posts and pages are the easy part. Underneath sit category, tag, author and date archives, an attachment page for every image ever uploaded, feed endpoints hanging off most of them, and a /page/2/, /page/3/ tail on each archive carrying most of the internal links that point at your older posts.",
      "So the map is generated from the permalink structure, then reconciled against a crawl and against Search Console impressions. Anything surviving all three gets a destination. Anything never meant to exist — attachment pages, thin tag archives, replytocom parameters — gets a 410 or a redirect to its parent, deliberately.",
    ],
  },
  {
    heading: "Trailing slashes are a site-wide redirect nobody budgets for",
    body: [
      "WordPress serves /about/ with a trailing slash. Next.js, by default, serves /about without one. Miss that and every URL takes an extra hop before it renders, on top of whatever redirect the migration itself needed, and a two-hop chain is how a clean 301 becomes a crawl-budget problem. Keep the slashes or drop them, but decide.",
      "The same bug hides in the old rules. A site that has run a redirect plugin for five years holds rules pointing at URLs that have themselves since moved. Those chains get flattened to a single hop against the final destination, or you ship three-hop redirects on your best-linked pages.",
    ],
  },
  {
    heading: "Parity gets checked before cutover, because afterwards there is nothing left to compare against",
    body: [
      "Most rebuilds port the title tag and the meta description and quietly drop everything else. An SEO plugin on a mature WordPress site emits a canonical, an Open Graph block, a Twitter card, and a JSON-LD graph with Article, BreadcrumbList, WebPage and Organization nodes wired together by @id. Rebuild without reproducing that and you have not migrated a site, you have published a new one.",
      "Pagination is the other quiet casualty. When /blog/page/2/ becomes an infinite scroll rendering nothing on the server, the internal link path to every post older than six weeks disappears and those posts start behaving like orphans. We diff old against new URL by URL while both are still standing.",
    ],
  },
  {
    heading: "Headless WordPress is a real answer, and so is leaving",
    body: [
      "Keeping WordPress behind WPGraphQL is right more often than replatform enthusiasts admit. A trained editorial team and a genuine ACF content model are not the problem; the theme layer is. WPGraphQL with the ACF extension gives you typed fields, and you cache at the render layer rather than per request, because a deeply nested query against a large wp_postmeta table is slow and always will be. You also inherit PHP, MySQL, and a wp-admin that now needs locking down harder rather than less.",
      "Move content into Payload or Sanity when the existing model is a page builder's soup of one rich-text blob per page. That content has to be remodelled to be useful in any front end, and the migration is the only moment you will be paid to do it.",
      "Either way the editing experience gets rebuilt rather than assumed. Once the CMS stops rendering the site, Preview is dead until draft mode is wired to a preview route, and Publish no longer means live, it means a webhook fired and a revalidation ran. A webhook that silently stops firing is indistinguishable from a broken CMS.",
    ],
  },
  {
    heading: "Next.js is not the thing that makes you fast",
    body: [
      "Deleting the fourteen plugins that each enqueue their own copy of jQuery makes you fast. Serving images that were resized rather than the 4000-pixel originals in the media library makes you fast. If your pages ship several hundred kilobytes of render-blocking CSS because a page builder emits a stylesheet per widget, porting the same DOM into React changes the logo on the invoice and little else.",
      "A well-built WordPress theme behind full-page edge caching is genuinely quick, and if that is already where you are, the case for migrating is maintainability and product surfaces the theme layer cannot reach. Not Core Web Vitals. Next.js earns its keep where the dynamic and the cacheable are tangled together, because the render path can finally be drawn per route instead of per plugin.",
    ],
  },
  {
    heading: "Do not change your information architecture in the same release",
    body: [
      "The most expensive migration failure has nothing to do with code. It is shipping a replatform and a new URL structure in the same week. Traffic moves for two or three weeks regardless, and with two candidate causes you cannot separate them, so a month goes into arguing instead of fixing.",
      "Migrate first, on the structure you already have, and let it settle until the crawl stats flatten. Then restructure, with a second redirect map you can reason about on its own. The same holds for a rebrand and for a content prune. All three at once is a coin toss you paid for.",
    ],
  },
];

const WRONG_CHOICE = [
  {
    title: "You have not yet fixed the WordPress you have",
    body: "If the complaint is speed and nobody has removed the page builder, put caching at the edge, or resized the media library, do that first. It is a week of work and it is reversible. Migrating to prove an untested point is an expensive way to discover the bottleneck was a chat widget.",
  },
  {
    title: "A high-volume editorial operation living inside the plugin ecosystem",
    body: "Forty posts a week, multiple authors, an editorial calendar, in-editor SEO scoring and a review workflow, all of it in plugins. Headless keeps the database and breaks about half that tooling. When the newsroom is the product, keep WordPress rendering and spend the budget on caching and templates.",
  },
  {
    title: "WooCommerce with real logic in the checkout",
    body: "Decoupling a storefront is a larger project than migrating content, and Woo's extension ecosystem is where the pricing rules, tax logic and shipping tables actually live. Either keep Woo and rebuild only the catalogue, or move commerce wholesale to a platform with a real checkout API. Halfway is the worst of both.",
  },
  {
    title: "A membership site, an LMS, or a booking system",
    body: "LearnDash, MemberPress and their equivalents are applications, not content. The value sits in plugin code you would be rewriting from scratch. That can be worth doing, but it is a product build with a migration attached, and it gets priced and sequenced that way.",
  },
  {
    title: "A five-page brochure site nobody edits",
    body: "It will get faster. It will not make more money. Our minimum engagement is $2,500 and this is not where it belongs. Spend it on something that changes the business, or keep the site and spend nothing at all.",
  },
];

const COMMITMENTS = [
  {
    title: "Your repo, your cloud, from commit one",
    body: "The migration happens in your GitHub organisation and your hosting account. The redirect map, the parity report and the runbook are files in that repo, not attachments in an email thread.",
  },
  {
    title: "A staging URL by the end of week one",
    body: "The new front end is deployed and clickable long before the content is finished. Every Friday you get a build, a short note on what changed, and what is queued next.",
  },
  {
    title: "Decisions in writing",
    body: "Every URL that does not map one to one is recorded with its destination and the reason. When rankings move six months from now, the record of what changed is already in the repository.",
  },
  {
    title: "Fixed scope, quoted before kickoff",
    body: "Change requests are priced and confirmed in writing before anyone starts them. A migration has a natural tail of small discoveries. That tail gets quoted, not absorbed quietly and billed later.",
  },
];

export function WordPressMigrationPageContent() {
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
            { label: "WordPress to Next.js Migration" },
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
          WordPress to Next.js Migration
        </motion.p>
        <motion.h1
          className="text-display-xl max-w-4xl mb-6"
          data-reveal="y30"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.1 }}
        >
          WordPress to Next.js migration, without losing the traffic you already
          have.
        </motion.h1>
        <motion.p
          className="text-lg text-[var(--color-mute)] max-w-2xl mb-6"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.2 }}
        >
          You have decided to leave WordPress and you have picked Next.js. The
          only question left is whether the swap costs you your organic search
          traffic. This page is about that risk: how the redirect map gets
          built, what gets checked before cutover, and what happens to your
          editors on the Monday after.
        </motion.p>
        <motion.p
          className="text-base text-[var(--color-mute)] max-w-2xl mb-10"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.25 }}
        >
          Still choosing a framework, or building something new rather than
          moving something old? Start at{" "}
          <Link
            href="/services/web-development"
            className="underline underline-offset-4 decoration-[var(--color-hairline-light)] hover:decoration-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]"
          >
            our Next.js web development service
          </Link>{" "}
          instead. This page assumes the decision is already made.
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
            <span>Scope the migration</span>
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
          Seven artifacts, and none of them is a slide.
        </motion.h2>
        <motion.p
          className="text-lg text-[var(--color-offwhite)]/60 max-w-2xl mb-16"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.2 }}
        >
          A migration is judged on what exists the week after cutover. These are
          the things that end up in your repository, each reviewable before
          anything goes live.
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
              Six things that decide whether this goes well.
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
            When not to do this
          </motion.p>
          <motion.h2
            className="text-display-lg mb-6"
            data-reveal="y30"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.1 }}
          >
            Five sites we would tell to stay on WordPress.
          </motion.h2>
          <motion.p
            className="text-lg text-[var(--color-offwhite)]/60 leading-relaxed"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.2 }}
          >
            We sell migrations, so read this as an argument against our own
            invoice. It is still the right call in each case, and the reasoning
            behind{" "}
            <Link
              href="/insights/in-house-vs-agency-vs-freelancer"
              className="underline underline-offset-4 decoration-[var(--color-hairline-dark)] hover:decoration-[var(--color-yellow)] transition-colors duration-[var(--duration-fast)]"
            >
              when to hire an agency at all
            </Link>{" "}
            applies here without much modification.
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
            We do not publish a per-page migration price, and you should be
            suspicious of the calculators that do. A form with six fields cannot
            know how many of your URLs need a decision rather than a rule, and
            that is the largest variable in the estimate. What we publish is a
            rate card: marketing sites start at $6,000, platforms at $18,000,
            and the minimum engagement is $2,500. A migration is quoted against
            whichever of those it resembles once the site has been crawled.
          </p>
          <p>
            What moves it, in roughly descending order: URLs needing an
            individual decision rather than a pattern; whether the content model
            is remodelled or lifted as it stands; the plugin surface, especially
            forms, membership and commerce; whether design changes in the same
            release; and how much of the old stack keeps running afterwards.
            Same argument we make about{" "}
            <Link
              href="/insights/mvp-development-cost"
              className="underline underline-offset-4 decoration-[var(--color-hairline-light)] hover:decoration-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]"
            >
              what an MVP actually costs
            </Link>
            . The estimate follows the decisions, not the page count.
          </p>
          <p>
            Send the domain and we crawl it before quoting: URL count, archive
            and pagination surface, plugin list, and an honest read on whether
            headless WordPress or a content move is the better shape.{" "}
            <Link
              href="/contact"
              className="underline underline-offset-4 decoration-[var(--color-hairline-light)] hover:decoration-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]"
            >
              Send us the URL and get a fixed quote
            </Link>
            , or read the rest of{" "}
            <Link
              href="/services/web-development"
              className="underline underline-offset-4 decoration-[var(--color-hairline-light)] hover:decoration-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]"
            >
              what we build in Next.js
            </Link>{" "}
            if the migration is only the first phase.
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
            {WP_MIGRATION_FAQS.map((faq, i) => {
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
            Send the domain. Get the redirect map first.
          </motion.h2>
          <motion.p
            className="text-lg text-[var(--color-ink)]/70 mb-10 max-w-xl mx-auto"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ delay: 0.15, duration: DURATION.slow }}
          >
            We crawl before quoting, so the first thing you see is the URL
            surface you are actually migrating. Fixed scope, fixed price, start
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
