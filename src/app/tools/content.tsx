"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { DURATION, EASE, viewportOnce } from "@/lib/motion";

/**
 * One entry per tool. Defined in page.tsx — the server component — because it
 * feeds the CollectionPage ItemList as well as these cards, and a registry that
 * lives on the client side of the boundary cannot be read during prerender.
 *
 * `status` exists so a tool can be listed before it is built without the card
 * pretending to be a link. Only add an entry with status "live" once the route
 * exists.
 */
export interface Tool {
  slug: string;
  name: string;
  /** One line, on the card and in the ItemList. */
  summary: string;
  /** Two or three sentences of real detail. Cards without it read as filler. */
  detail: string;
  /** The thing this tool refuses to do that its competitors all do. */
  pledge: string;
  status: "live" | "planned";
}

export function ToolsPageContent({ tools }: { tools: Tool[] }) {
  const shouldReduceMotion = useReducedMotion();
  const live = tools.filter((tool) => tool.status === "live");

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <Section variant="light" className="pt-40 lg:pt-48 pb-0">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Tools" }]} />

        <motion.p
          className="text-xs uppercase tracking-[0.2em] text-[var(--color-mute)] mb-5 font-medium"
          data-reveal="y10"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, ease: EASE.standard }}
        >
          Tools
        </motion.p>

        <motion.h1
          className="text-display-xl max-w-[17ch]"
          data-reveal="y40"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slower, ease: EASE.standard }}
        >
          Free tools that do not want your email.
        </motion.h1>

        <motion.div
          className="mt-10 max-w-[68ch] space-y-6 text-base lg:text-lg leading-[1.75] text-[var(--color-ink)]/85"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, ease: EASE.standard, delay: 0.12 }}
        >
          <p>
            The convention in this industry is a calculator that collects ten
            answers, then asks for a work email and promises a number within a
            business day. That is not a tool. It is a lead form wearing one, and
            the arithmetic behind it is usually a lookup table nobody will show
            you.
          </p>
          <p>
            Everything here works the other way round. It runs in your browser,
            it shows the arithmetic, it lets you disagree with the assumptions,
            and it never asks who you are. If a tool on this page ever needs an
            account to be useful, it will not go on this page.
          </p>
        </motion.div>
      </Section>

      {/* ── Tool cards ─────────────────────────────────────────────────── */}
      <Section variant="light" className="pt-16 lg:pt-20">
        <ul className="grid gap-6 lg:grid-cols-2">
          {tools.map((tool, index) => {
            const card = (
              <>
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-display-sm group-hover:text-[var(--color-yellow)] transition-colors duration-[var(--duration-fast)]">
                    {tool.name}
                  </h2>
                  {tool.status === "live" ? (
                    <ArrowRight
                      size={18}
                      aria-hidden="true"
                      className="mt-1 flex-shrink-0 text-[var(--color-mute)] transition-transform duration-[var(--duration-fast)] group-hover:translate-x-1"
                    />
                  ) : (
                    <span className="mt-1 flex-shrink-0 text-xs uppercase tracking-[0.14em] text-[var(--color-mute)]">
                      In progress
                    </span>
                  )}
                </div>
                <p className="mt-4 text-base leading-relaxed text-[var(--color-ink)]/80">
                  {tool.summary}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-mute)]">
                  {tool.detail}
                </p>
                <p className="mt-6 border-t border-[var(--color-hairline-light)] pt-4 text-xs uppercase tracking-[0.14em] text-[var(--color-ink)]/60">
                  {tool.pledge}
                </p>
              </>
            );

            return (
              <motion.li
                key={tool.slug}
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
                {tool.status === "live" ? (
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="group flex h-full flex-col rounded-[var(--radius-lg)] border border-[var(--color-hairline-light)] bg-[var(--color-white)] p-8 lg:p-10 transition-colors duration-[var(--duration-fast)] hover:border-[var(--color-ink)]"
                  >
                    {card}
                  </Link>
                ) : (
                  <div className="flex h-full flex-col rounded-[var(--radius-lg)] border border-dashed border-[var(--color-hairline-light)] p-8 lg:p-10">
                    {card}
                  </div>
                )}
              </motion.li>
            );
          })}
        </ul>

        {live.length === 1 ? (
          <motion.p
            className="mt-10 max-w-[60ch] text-sm leading-relaxed text-[var(--color-mute)]"
            data-reveal="y16"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, ease: EASE.standard }}
          >
            One tool so far. We would rather ship one that earns its place than
            five that pad a page, so the next one arrives when there is a
            question we get asked often enough to be worth automating an answer
            to.
          </motion.p>
        ) : null}
      </Section>

      {/* ── Why ────────────────────────────────────────────────────────── */}
      <Section variant="dark" noise>
        <motion.h2
          className="text-display-lg max-w-[22ch]"
          data-reveal="y30"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, ease: EASE.standard }}
        >
          The rules these have to follow
        </motion.h2>
        <motion.div
          className="mt-10 grid gap-8 md:grid-cols-3"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, ease: EASE.standard, delay: 0.1 }}
        >
          <div className="border-t border-[var(--color-hairline-dark)] pt-6">
            <h3 className="text-display-sm mb-3">The answer is free</h3>
            <p className="text-sm lg:text-base leading-relaxed text-[var(--color-offwhite)]/60">
              No email, no account, no &ldquo;unlock your result&rdquo;. If we
              cannot make something useful enough that you come back without
              being captured, the answer is to make it better rather than to put
              a form in front of it.
            </p>
          </div>
          <div className="border-t border-[var(--color-hairline-dark)] pt-6">
            <h3 className="text-display-sm mb-3">The arithmetic is visible</h3>
            <p className="text-sm lg:text-base leading-relaxed text-[var(--color-offwhite)]/60">
              A single number you cannot interrogate is worth nothing, because
              you have no way to tell a model from a guess. Every figure comes
              with the lines that produced it and the assumptions underneath,
              and you can change both.
            </p>
          </div>
          <div className="border-t border-[var(--color-hairline-dark)] pt-6">
            <h3 className="text-display-sm mb-3">
              The limits are stated on the page
            </h3>
            <p className="text-sm lg:text-base leading-relaxed text-[var(--color-offwhite)]/60">
              Every one of these is a sanity check rather than a substitute for
              a conversation, and each one says so in its own words, on itself,
              above the fold rather than in a footnote.
            </p>
          </div>
        </motion.div>
      </Section>

      {/* ── CTA ────────────────────────────────────────────────────────── */}
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
            Past the estimate stage?
          </motion.h2>
          <motion.p
            className="text-lg text-[var(--color-ink)]/70 mb-10 max-w-xl mx-auto"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ delay: 0.15, duration: DURATION.slow }}
          >
            Tell us what you are building and what it has to do by when. Our
            posted price bands sit on the services pages, so you can check
            whether we are in your range before you spend an email on us.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ delay: 0.25, duration: DURATION.slow, ease: EASE.standard }}
          >
            <ButtonLink
              href="/contact"
              size="lg"
              className="bg-[var(--color-ink)] text-[var(--color-yellow)] before:bg-[var(--color-offwhite)] hover:text-[var(--color-ink)]"
            >
              <span>Start a project</span>
            </ButtonLink>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-base font-medium underline underline-offset-4 decoration-[var(--color-ink)]/30 hover:decoration-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]"
            >
              See services and pricing
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </motion.div>
        </div>
      </Section>
    </>
  );
}
