"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { DURATION, EASE, viewportOnce } from "@/lib/motion";
import {
  SERVICE_LABELS,
  articleHref,
  formatPublishedDate,
  getArticle,
  getRelatedArticles,
} from "@/app/insights/articles";

/**
 * Body prose styling, as descendant selectors on one wrapper.
 *
 * There is no typography plugin in this project, and adding one to style six
 * routes would pull a dependency into the bundle for every page. The article
 * body is plain semantic HTML written by the route, and this is the stylesheet
 * for it.
 *
 * The two numbers that matter for an 1800-word read: the measure is capped at
 * roughly 70 characters, and the body line-height is 1.8 rather than the 1.6
 * the rest of the site uses. Long-form reading tolerates — wants — more air
 * than a landing page does.
 */
const PROSE = [
  // Measure and base rhythm.
  "max-w-[70ch] text-[1.0625rem] lg:text-[1.125rem] leading-[1.8] text-[var(--color-ink)]/85",

  // Paragraphs.
  "[&_p]:mb-6 [&_p:last-child]:mb-0",

  // Headings. Display face, tight leading, generous space above so the
  // section break is visible before it is read.
  "[&_h2]:[font-family:var(--font-display)] [&_h2]:text-[clamp(1.6rem,2.6vw,2.125rem)]",
  "[&_h2]:font-bold [&_h2]:leading-[1.15] [&_h2]:tracking-[-0.02em]",
  "[&_h2]:text-[var(--color-ink)] [&_h2]:mt-16 [&_h2]:mb-5 [&_h2]:scroll-mt-32",

  "[&_h3]:[font-family:var(--font-display)] [&_h3]:text-[clamp(1.15rem,1.8vw,1.375rem)]",
  "[&_h3]:font-semibold [&_h3]:leading-[1.25] [&_h3]:tracking-[-0.01em]",
  "[&_h3]:text-[var(--color-ink)] [&_h3]:mt-10 [&_h3]:mb-3 [&_h3]:scroll-mt-32",

  // Nothing pushes the top of the body away from the header rule.
  "[&>*:first-child]:mt-0",

  // Lists.
  "[&_ul]:mb-6 [&_ul]:pl-6 [&_ul]:list-disc",
  "[&_ol]:mb-6 [&_ol]:pl-6 [&_ol]:list-decimal",
  "[&_li]:mb-2 [&_li]:pl-1 [&_li]:marker:text-[var(--color-mute)]",
  "[&_li>ul]:mt-2 [&_li>ol]:mt-2",

  // Links. Underlined by default — an in-body link that only reveals itself on
  // hover is not a link, it is a rumour.
  "[&_a]:underline [&_a]:underline-offset-[3px] [&_a]:decoration-[var(--color-ink)]/30",
  "[&_a]:hover:decoration-[var(--color-yellow)] [&_a]:transition-colors",
  "[&_a]:duration-[var(--duration-fast)]",

  "[&_strong]:font-semibold [&_strong]:text-[var(--color-ink)]",

  // Pull quote / callout.
  "[&_blockquote]:my-8 [&_blockquote]:border-l-2 [&_blockquote]:border-[var(--color-yellow)]",
  "[&_blockquote]:pl-6 [&_blockquote]:text-[var(--color-ink)]/70",

  // Code.
  "[&_code]:text-[0.9em] [&_code]:bg-[var(--color-ink)]/5 [&_code]:px-1.5",
  "[&_code]:py-0.5 [&_code]:rounded-[var(--radius-sm)]",
  "[&_pre]:my-8 [&_pre]:bg-[var(--color-ink)] [&_pre]:text-[var(--color-offwhite)]",
  "[&_pre]:p-6 [&_pre]:rounded-[var(--radius-md)] [&_pre]:overflow-x-auto",
  "[&_pre]:text-[0.875rem] [&_pre]:leading-[1.6]",
  "[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit",

  // Tables. Wide ones scroll rather than forcing the page sideways.
  "[&_table]:w-full [&_table]:my-8 [&_table]:text-[0.95rem] [&_table]:border-collapse",
  "[&_th]:text-left [&_th]:font-semibold [&_th]:py-3 [&_th]:pr-5 [&_th]:align-bottom",
  "[&_th]:border-b [&_th]:border-[var(--color-ink)]/25 [&_th]:text-[var(--color-ink)]",
  "[&_td]:py-3 [&_td]:pr-5 [&_td]:align-top",
  "[&_td]:border-b [&_td]:border-[var(--color-hairline-light)]",

  "[&_figure]:my-8 [&_figcaption]:mt-3 [&_figcaption]:text-sm [&_figcaption]:text-[var(--color-mute)]",
  "[&_hr]:my-12 [&_hr]:border-[var(--color-hairline-light)]",
].join(" ");

/**
 * The standing disclosure, rendered on every article above the body.
 *
 * Across the six SERPs these pieces target, not one top-ten result carried a
 * visible conflict-of-interest note — while every one of them was written by a
 * vendor whose product happened to be the conclusion. Saying it out loud costs
 * nothing, because it is true, and it is the one credibility signal on these
 * pages that a better-funded competitor cannot copy without changing how they
 * write.
 *
 * Keep the second sentence accurate. It is a promise the article body has to
 * keep, not a slogan.
 */
function Disclosure() {
  return (
    <aside className="mb-12 border-l-2 border-[var(--color-yellow)] pl-5 py-1 max-w-[62ch]">
      <p className="text-sm leading-relaxed text-[var(--color-mute)]">
        <span className="font-semibold text-[var(--color-ink)]">Disclosure.</span>{" "}
        We are a software studio, so we sell some of what this article discusses.
        Every figure below is either linked to its source or labelled as our own
        estimate. Where the honest answer is that you should not hire a studio
        like ours, it says so.
      </p>
    </aside>
  );
}

export interface ArticleLayoutProps {
  /** Must match a `slug` in src/app/insights/articles.ts. Everything else is read from there. */
  slug: string;
  children: ReactNode;
}

/**
 * Shared chrome for the six /insights articles.
 *
 * The route supplies its slug and its body. Title, category, date, reading
 * time, the related-service CTA and the "Keep reading" links all come from the
 * registry, so a route can never disagree with the hub or with its own JSON-LD.
 */
export function ArticleLayout({ slug, children }: ArticleLayoutProps) {
  const shouldReduceMotion = useReducedMotion();
  const article = getArticle(slug);
  const related = getRelatedArticles(slug, 3);
  const serviceLabel = article.relatedService
    ? SERVICE_LABELS[article.relatedService]
    : undefined;

  return (
    <article>
      {/* Header */}
      <Section variant="light" className="pt-40 lg:pt-48 pb-0">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Insights", href: "/insights" },
            { label: article.title },
          ]}
        />

        <motion.p
          className="text-xs uppercase tracking-[0.2em] text-[var(--color-mute)] mb-5 font-medium"
          data-reveal="y10"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, ease: EASE.standard }}
        >
          {article.category}
        </motion.p>

        <motion.h1
          className="text-display-lg max-w-[18ch]"
          data-reveal="y30"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slower, ease: EASE.standard, delay: 0.05 }}
        >
          {article.title}
        </motion.h1>

        <motion.div
          className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[var(--color-mute)]"
          data-reveal="y16"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, ease: EASE.standard, delay: 0.15 }}
        >
          <span>EdgeBrain Studios</span>
          <span aria-hidden="true" className="opacity-50">
            /
          </span>
          <time dateTime={article.publishedAt}>
            {formatPublishedDate(article.publishedAt)}
          </time>
          <span aria-hidden="true" className="opacity-50">
            /
          </span>
          <span>{article.readingMinutes} min read</span>
        </motion.div>

        <div className="mt-10 border-t border-[var(--color-hairline-light)]" />
      </Section>

      {/* Body */}
      <Section variant="light" className="pt-12 lg:pt-16">
        <motion.div
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, ease: EASE.standard }}
        >
          <Disclosure />
          <div className={PROSE}>{children}</div>
        </motion.div>
      </Section>

      {/* Keep reading */}
      {related.length > 0 && (
        <Section variant="light" className="pt-0">
          <div className="border-t border-[var(--color-hairline-light)] pt-12">
            <motion.h2
              className="text-xs uppercase tracking-[0.2em] text-[var(--color-mute)] mb-8 font-medium"
              data-reveal="y10"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow, ease: EASE.standard }}
            >
              Keep reading
            </motion.h2>

            <div className="grid gap-px bg-[var(--color-hairline-light)] sm:grid-cols-2 lg:grid-cols-3 rounded-[var(--radius-md)] overflow-hidden">
              {related.map((entry, i) => (
                <motion.div
                  key={entry.slug}
                  className="bg-[var(--color-offwhite)]"
                  data-reveal="y20"
                  initial={false}
                  whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                  viewport={viewportOnce}
                  transition={{
                    duration: DURATION.slow,
                    ease: EASE.standard,
                    delay: i * 0.08,
                  }}
                >
                  <Link
                    href={articleHref(entry.slug)}
                    className="group flex h-full flex-col p-7 transition-colors duration-[var(--duration-fast)] hover:bg-[var(--color-white)]"
                  >
                    <span className="text-xs uppercase tracking-[0.16em] text-[var(--color-mute)] mb-4">
                      {entry.category}
                    </span>
                    <h3 className="text-display-sm mb-3 group-hover:text-[var(--color-yellow)] transition-colors duration-[var(--duration-fast)]">
                      {entry.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-[var(--color-mute)] mb-6">
                      {entry.excerpt}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-[var(--color-ink)]">
                      {entry.readingMinutes} min read
                      <ArrowRight
                        size={14}
                        className="transition-transform duration-[var(--duration-fast)] group-hover:translate-x-1"
                      />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* Closing CTA */}
      <Section variant="dark" noise>
        <div className="max-w-3xl">
          <motion.h2
            className="text-display-lg mb-6"
            data-reveal="y30"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slower, ease: EASE.standard }}
          >
            Got a version of this problem?
          </motion.h2>
          <motion.p
            className="text-lg text-[var(--color-offwhite)]/70 mb-10 max-w-xl leading-relaxed"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, ease: EASE.standard, delay: 0.1 }}
          >
            Send a paragraph describing what you are trying to build and what is
            currently in the way. We reply with a scope, a price and a start date
            inside two working days — or with the reason we are not the right
            people for it.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row sm:items-center gap-6"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, ease: EASE.standard, delay: 0.15 }}
          >
            <ButtonLink href="/contact" size="lg">
              <span>Start a conversation</span>
            </ButtonLink>
            {article.relatedService && serviceLabel && (
              <Link
                href={article.relatedService}
                className="inline-flex items-center gap-2 text-base font-medium text-[var(--color-offwhite)]/70 underline underline-offset-4 decoration-[var(--color-offwhite)]/30 hover:text-[var(--color-offwhite)] hover:decoration-[var(--color-yellow)] transition-colors duration-[var(--duration-fast)]"
              >
                How we handle {serviceLabel.toLowerCase()}
                <ArrowRight size={14} />
              </Link>
            )}
          </motion.div>
        </div>
      </Section>
    </article>
  );
}
