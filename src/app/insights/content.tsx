"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { DURATION, EASE, viewportOnce } from "@/lib/motion";
import {
  ARTICLES,
  articleHref,
  articlesByCategory,
  formatPublishedDate,
  type Article,
} from "./articles";

/**
 * One line of framing per category, rendered above its group.
 *
 * Keyed by the category strings in articles.ts. A category with no entry here
 * still renders — it just gets no subhead — so adding a category cannot break
 * the page.
 */
const CATEGORY_BLURBS: Record<string, string> = {
  "Choosing a partner":
    "The decision before the build. Who writes the code, what that costs you in control, and what happens the first time it goes wrong.",
  "Cost & planning":
    "The number everyone asks for first, taken apart into the decisions that actually set it.",
  "Engineering decisions":
    "The calls we make on real projects, with the tradeoffs left in rather than resolved in our favour.",
};

function ArticleCard({ article, index }: { article: Article; index: number }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.article
      className="bg-[var(--color-offwhite)]"
      data-reveal="y20"
      initial={false}
      whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{
        duration: DURATION.slow,
        ease: EASE.standard,
        delay: index * 0.08,
      }}
    >
      <Link
        href={articleHref(article.slug)}
        className="group flex h-full flex-col p-8 lg:p-10 transition-colors duration-[var(--duration-fast)] hover:bg-[var(--color-white)]"
      >
        <h3 className="text-display-sm mb-4 max-w-[24ch] group-hover:text-[var(--color-yellow)] transition-colors duration-[var(--duration-fast)]">
          {article.title}
        </h3>
        <p className="text-sm lg:text-base leading-relaxed text-[var(--color-mute)] mb-8 max-w-[52ch]">
          {article.excerpt}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 text-xs uppercase tracking-[0.14em] text-[var(--color-mute)]">
          <time dateTime={article.publishedAt}>
            {formatPublishedDate(article.publishedAt)}
          </time>
          <span aria-hidden="true" className="opacity-50">
            /
          </span>
          <span>{article.readingMinutes} min read</span>
          <ArrowRight
            size={14}
            className="ml-auto text-[var(--color-ink)] transition-transform duration-[var(--duration-fast)] group-hover:translate-x-1"
          />
        </div>
      </Link>
    </motion.article>
  );
}

export function InsightsPageContent() {
  const shouldReduceMotion = useReducedMotion();
  const groups = articlesByCategory();

  return (
    <>
      {/* Hero + intro */}
      <Section variant="light" className="pt-40 lg:pt-48 pb-0">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Insights" }]}
        />

        <motion.p
          className="text-xs uppercase tracking-[0.2em] text-[var(--color-mute)] mb-5 font-medium"
          data-reveal="y10"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, ease: EASE.standard }}
        >
          Insights
        </motion.p>

        <motion.h1
          className="text-display-xl max-w-[16ch]"
          data-reveal="y40"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slower, ease: EASE.standard }}
        >
          Straight answers about buying software.
        </motion.h1>

        <motion.div
          className="mt-12 max-w-[68ch] space-y-6 text-base lg:text-lg leading-[1.75] text-[var(--color-ink)]/85"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, ease: EASE.standard, delay: 0.15 }}
        >
          <p>
            Almost everything written about how to commission software is written
            by someone who wants the answer to come out a particular way. We know,
            because we are one of them. This section exists because the
            alternative — publishing nothing and letting a sales call carry the
            whole argument — is worse for you and worse for us.
          </p>
          <p>
            Six pieces, in three groups. <strong>Choosing a partner</strong>{" "}
            covers the decision before any code exists: in-house team, agency, or
            freelancer, and how to run an offshore team so the handover does not
            eat the savings. <strong>Cost &amp; planning</strong> covers the
            number everyone asks for first, and why the published ranges for it
            disagree with each other by a factor of fifty.{" "}
            <strong>Engineering decisions</strong> covers the calls we make on
            real projects — React Native or two native codebases, retrieval or a
            fine-tune, and how to get a filing cabinet of PDFs into a database
            without hiring a data team.
          </p>
          <p>
            Who it is for: founders and operators who have to commission software
            they cannot personally write, and who have already noticed that every
            vendor comparison online concludes in favour of the vendor who wrote
            it. That suspicion is correct. Keep it.
          </p>
          <p>
            So here is the rule we hold ourselves to. Every figure is either
            linked to its source or labelled as our own estimate. Where our
            commercial interest points one way and the evidence points another,
            the article says so in the paragraph rather than in a footer. There
            are no client names on these pages, because we have not published
            any. There are no satisfaction percentages, because we have never
            measured one. If a piece here helps you decide not to hire us, it did
            its job.
          </p>
        </motion.div>

        <div className="mt-16 border-t border-[var(--color-hairline-light)]" />
      </Section>

      {/* Articles, grouped by category */}
      <Section variant="light" className="pt-14 lg:pt-20">
        <div className="space-y-20 lg:space-y-28">
          {groups.map((group) => (
            <div key={group.category}>
              <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <motion.h2
                  className="text-display-md"
                  data-reveal="y30"
                  initial={false}
                  whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                  viewport={viewportOnce}
                  transition={{ duration: DURATION.slow, ease: EASE.standard }}
                >
                  {group.category}
                </motion.h2>
                {CATEGORY_BLURBS[group.category] && (
                  <motion.p
                    className="max-w-[46ch] text-sm lg:text-base leading-relaxed text-[var(--color-mute)]"
                    data-reveal="y16"
                    initial={false}
                    whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                    viewport={viewportOnce}
                    transition={{
                      duration: DURATION.slow,
                      ease: EASE.standard,
                      delay: 0.1,
                    }}
                  >
                    {CATEGORY_BLURBS[group.category]}
                  </motion.p>
                )}
              </div>

              {/* gap-px over a hairline background draws the dividing rules
                  between cards. A one-article group must therefore stay single
                  column, or the empty cell renders as a grey slab. */}
              <div
                className={`grid gap-px overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-hairline-light)] ${
                  group.articles.length > 1 ? "md:grid-cols-2" : "grid-cols-1"
                }`}
              >
                {group.articles.map((article, i) => (
                  <ArticleCard key={article.slug} article={article} index={i} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Plain-text index. Cards are the pleasant way to browse; this is the
          scannable one, and it gives every article a second internal link with
          its own descriptive anchor text. */}
      <Section variant="light" className="pt-0">
        <div className="border-t border-[var(--color-hairline-light)] pt-12">
          <motion.h2
            className="text-xs uppercase tracking-[0.2em] text-[var(--color-mute)] mb-6 font-medium"
            data-reveal="y10"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, ease: EASE.standard }}
          >
            All articles
          </motion.h2>
          <ul className="max-w-[70ch] space-y-3">
            {ARTICLES.map((article) => (
              <li key={article.slug} className="text-base leading-relaxed">
                <Link
                  href={articleHref(article.slug)}
                  className="underline underline-offset-4 decoration-[var(--color-ink)]/25 hover:decoration-[var(--color-yellow)] transition-colors duration-[var(--duration-fast)]"
                >
                  {article.title}
                </Link>
                <span className="text-[var(--color-mute)]">
                  {" "}
                  — {article.category}, {article.readingMinutes} min read
                </span>
              </li>
            ))}
          </ul>
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
            Still not sure which way to go?
          </motion.h2>
          <motion.p
            className="text-lg text-[var(--color-ink)]/70 mb-10 max-w-xl mx-auto leading-relaxed"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, ease: EASE.standard, delay: 0.15 }}
          >
            Describe the problem in a paragraph. We reply with a scope, a price
            and a start date inside two working days — or with the reason we are
            not the right people for it.
          </motion.p>
          <motion.div
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, ease: EASE.standard, delay: 0.2 }}
          >
            <ButtonLink
              href="/contact"
              size="lg"
              className="bg-[var(--color-ink)] text-[var(--color-yellow)] before:bg-[var(--color-offwhite)] hover:text-[var(--color-ink)]"
            >
              <span>Start a conversation</span>
            </ButtonLink>
          </motion.div>
        </div>
      </Section>
    </>
  );
}
