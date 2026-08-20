"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { DURATION, EASE, viewportOnce } from "@/lib/motion";

/**
 * Overlap windows are computed against the opening hours this site actually
 * publishes: 10:00 to 22:00 PKT, Monday to Friday. See the
 * openingHoursSpecification in src/app/layout.tsx and in this route's page.tsx.
 *
 * Pakistan Standard Time is UTC+5 and has not observed daylight saving since
 * 2009, so every number below moves only when the client side changes clocks.
 * If the published working hours ever change, these rows have to change with
 * them, or the page is quoting availability the studio does not offer.
 */
const OVERLAP = [
  {
    city: "London",
    gap: "Ahead by 4 hours, 5 from late October",
    hours: "8 to 9 hours",
    window: "13:00 to 22:00 PKT",
    theirs: "09:00 to 18:00 in London",
    note: "Your entire working day sits inside ours. Nothing about a UK engagement needs special handling.",
  },
  {
    city: "Dubai",
    gap: "Ahead by 1 hour, all year",
    hours: "9 hours",
    window: "10:00 to 19:00 PKT",
    theirs: "09:00 to 18:00 in Dubai",
    note: "Effectively the same working day. The UAE moved to a Saturday and Sunday weekend in 2022, so the week lines up too.",
  },
  {
    city: "New York",
    gap: "Ahead by 9 hours, 10 in winter",
    hours: "4 hours, 3 in winter",
    window: "18:00 to 22:00 PKT",
    theirs: "09:00 to 13:00 Eastern",
    note: "The engagement runs on your morning. Anything needing a decision must be in front of you before 13:00 Eastern or it costs a day.",
  },
  {
    city: "Sydney",
    gap: "Behind by 5 hours, 6 from October",
    hours: "3 hours",
    window: "10:00 to 13:00 PKT",
    theirs: "15:00 to 18:00 in Sydney",
    note: "The tail of your day against the start of ours. In Australian summer the same Lahore window lands at 16:00 to 19:00 for you.",
  },
  {
    city: "San Francisco",
    gap: "Ahead by 12 hours, 13 in winter",
    hours: "2 hours, 1 in winter",
    window: "20:00 to 22:00 PKT",
    theirs: "08:00 to 10:00 Pacific",
    note: "The hard one, and we will not pretend otherwise. Two hours is a handoff, not a collaboration. West Coast projects run written-first or they fail.",
  },
];

/*
 * There is no NOT_US list here on purpose.
 *
 * This page and /about used to carry near-identical "what we turn down"
 * blocks — five items, the same wording, 53 shared 8-grams between the two
 * pages. Two URLs answering the same question in the same words is how a site
 * splits its own relevance. The list lives on /about, which is the page about
 * how the studio works; this page links to it and keeps only the part that is
 * genuinely about Lahore. If you are tempted to restore the list here, link
 * instead.
 */

export function LahorePageContent() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      {/* Hero */}
      <Section variant="light" className="pt-40 lg:pt-48">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Software Development in Lahore" },
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
          Lahore, Pakistan
        </motion.p>
        <motion.h1
          className="text-display-xl max-w-4xl mb-8"
          data-reveal="y30"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.1 }}
        >
          Software development in Lahore, with the{" "}
          <span className="text-[var(--color-yellow)]">
            tradeoffs written down
          </span>
          .
        </motion.h1>
        <motion.p
          className="text-lg text-[var(--color-mute)] max-w-2xl mb-10 leading-relaxed"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.2 }}
        >
          EdgeBrain Studios is a small senior team in Lahore building web apps,
          mobile apps, and AI automation. This is the page we wanted when we sat
          on the other side of the table: what the local engineering market is
          really like, the exact hours you overlap with us from London, New
          York, San Francisco, Dubai or Sydney, and how money and IP cross the
          border.
        </motion.p>
        <motion.div
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.3 }}
        >
          <ButtonLink href="/contact" size="lg">
            <span>Start a project</span>
          </ButtonLink>
        </motion.div>
      </Section>

      {/* The local talent market */}
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
              The talent market
            </motion.p>
            <motion.h2
              className="text-display-lg lg:sticky lg:top-32"
              data-reveal="y30"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow, delay: 0.1 }}
            >
              Volume is not the same thing as depth.
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
              Lahore is one of three cities where Pakistan&rsquo;s software
              industry concentrates, alongside Karachi and Islamabad, and it has
              the deepest university pipeline of the three. FAST NUCES, LUMS,
              UET, ITU and COMSATS push computer science cohorts into the same
              few square kilometres of Gulberg and Johar Town every summer. That
              is the supply side:
              large, young, and most of the reason a Lahore engineering hour
              costs a fraction of a London one.
            </p>
            <p>
              The demand side is the part buyers never see. Systems Limited,
              NETSOL Technologies, Contour Software and Arbisoft are not our
              clients and not our partners. They are who we compete with when we
              hire, and they set the floor. An engineer who has carried a
              production system through two years of incidents has offers in
              this city. They are not on a marketplace waiting to be discovered
              at nine dollars an hour, and a studio quoting that rate is
              describing somebody else.
            </p>
            <p>
              So here is the part a location page is not supposed to say. The
              graduate pipeline is enormous. The pool of engineers who have owned
              a system in production is not. Most of the local industry is
              organised around that gap: seats billed by the month, teams
              assembled from whoever is on the bench, one lead engineer split
              across three accounts. It is why so much offshore work arrives
              technically complete and operationally naive. No indexes. No error
              states. No evaluation set.
            </p>
            <p>
              We are built the other way round, and the tradeoff cuts against us
              as often as for us. We cannot put fourteen people on your project
              next Monday. If you need fourteen next Monday, hire a firm that
              can; there are good ones here. Where we draw that line is set out
              on{" "}
              <Link
                href="/about"
                className="underline underline-offset-4 decoration-[var(--color-offwhite)]/30 hover:decoration-[var(--color-offwhite)] transition-colors duration-[var(--duration-fast)]"
              >
                the page about how this studio works
              </Link>
              .
            </p>
          </motion.div>
        </div>
      </Section>

      {/* Time zone overlap */}
      <Section variant="light">
        <div className="max-w-3xl mb-14">
          <motion.p
            className="text-xs uppercase tracking-[0.2em] text-[var(--color-mute)] mb-4 font-medium"
            data-reveal="fade"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow }}
          >
            Overlap, in real hours
          </motion.p>
          <motion.h2
            className="text-display-lg mb-6"
            data-reveal="y30"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.1 }}
          >
            UTC+5, and we never move the clocks.
          </motion.h2>
          <motion.p
            className="text-lg text-[var(--color-mute)] leading-relaxed"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.2 }}
          >
            Pakistan Standard Time is UTC+5, and Pakistan has not observed
            daylight saving since 2009. The second fact matters more than the
            first: we never move, so the gap shifts underneath you twice a year,
            always in the direction that costs you an hour once your clocks go
            back. Our working day runs 10:00 to 22:00 PKT, Monday to Friday.
          </motion.p>
        </div>

        <div className="border-t border-[var(--color-hairline-light)]">
          {OVERLAP.map((row, i) => (
            <motion.div
              key={row.city}
              className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6 border-b border-[var(--color-hairline-light)] py-7"
              data-reveal="y20"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{
                duration: DURATION.slow,
                ease: EASE.standard,
                delay: i * 0.06,
              }}
            >
              <div className="md:col-span-3">
                <h3 className="text-display-sm mb-1">{row.city}</h3>
                <p className="text-sm text-[var(--color-mute)]">{row.gap}</p>
              </div>
              <div className="md:col-span-3">
                <p className="text-base font-medium">{row.hours}</p>
                <p className="text-sm text-[var(--color-mute)] mt-1">
                  {row.window}
                </p>
                <p className="text-sm text-[var(--color-mute)]">{row.theirs}</p>
              </div>
              <p className="md:col-span-6 text-sm lg:text-base text-[var(--color-ink)]/75 leading-relaxed">
                {row.note}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="max-w-3xl mt-14 space-y-7 text-base lg:text-lg text-[var(--color-ink)]/75 leading-relaxed"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.15 }}
        >
          <p>
            Two things that never appear on a page like this. Friday carries a prayer break of roughly ninety minutes from 13:00
            PKT, which lands at 09:00 in London and before New York is awake, so
            it costs a UK engagement the first hour of the week&rsquo;s last day.
            And a Saudi week runs Sunday to Thursday against our Monday to
            Friday, which leaves four shared working days, not five. Plan the
            sprint around four.
          </p>
          <p>
            Four hours with New York is plenty if they are structured and
            worthless if they are not. Ours are structured: a written update
            waiting before your morning, decisions posed with a recommendation
            attached rather than as open questions, and a deployed staging URL
            every Friday you can open without us on the call. The general
            version, including the failure modes, is in{" "}
            <Link
              href="/insights/working-with-offshore-development-team"
              className="underline underline-offset-4 decoration-[var(--color-ink)]/30 hover:decoration-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]"
            >
              our guide to working with an offshore development team
            </Link>
            .
          </p>
        </motion.div>
      </Section>

      {/* Contracts, money, IP */}
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
              Money and IP across a border
            </motion.p>
            <motion.h2
              className="text-display-lg lg:sticky lg:top-32"
              data-reveal="y30"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow, delay: 0.1 }}
            >
              Where cross-border engagements actually stall.
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
              Payments first, because that is where these engagements stall.
              Stripe does not support businesses incorporated in Pakistan.
              Neither does PayPal. That is a fact about the country, not a signal
              about the studio. What works is a SWIFT wire in USD, Wise, or
              Payoneer. Wire fees run higher than people expect and clearing
              takes two to four working days, so write payment terms as business
              days from invoice.
            </p>
            <p>
              On our side the proceeds arrive through a bank under State Bank of
              Pakistan rules, and exporters registered with the Pakistan Software
              Export Board may retain a share of earnings in a foreign currency
              account. That share has been revised more than once and is not
              worth quoting. What matters to your finance team is that the money
              is documented, banked, and traceable end to end.
            </p>
            <p>
              US clients normally want a W-8BEN-E on file before the first
              payment. UK and EU clients generally treat a services invoice from
              Pakistan as outside the scope of domestic VAT under the
              business-to-business place-of-supply rules and account for it their
              own side. Both are your accountant&rsquo;s questions, not ours, and
              a studio that answers them with confidence rather than paperwork
              should worry you.
            </p>
            <p>
              IP assignment is the clause to read twice. Ask for present-tense
              assignment on creation, not a promise to assign on final payment,
              and check that it names the whole surface: source, designs,
              prompts, evaluation sets, infrastructure configuration, repository
              history. Then ask what happens if it stops in week three. Our
              answer is structural rather than contractual: the repository is
              yours from the first commit and every deployment runs in a cloud
              account you own, so there is no handover event. A vendor that stages
              work in its own repository and migrates it at the end is telling
              you where the leverage sits. Pay in milestones
              tied to something you can open, never to percentage complete, and
              treat resistance to that shape as information.
            </p>
          </motion.div>
        </div>
      </Section>

      {/* Local clients */}
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
              If you are already here
            </motion.p>
            <motion.h2
              className="text-display-lg"
              data-reveal="y30"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow, delay: 0.1 }}
            >
              For clients in Lahore, Karachi and Islamabad.
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
              Most of this page is written for somebody eight thousand
              kilometres away. If you are down the road, the pitch is simpler:
              we can be in your office. Mapping a workflow you want automated
              goes faster across a table with the person who actually does it
              than across four video calls, and for the AI work that one session
              beats a month of specification documents.
            </p>
            <p>
              No time zone to manage, no waiting a day for an answer, no
              conversation about wire clearing. Call the number at the bottom of
              this page during a working day and you reach somebody who writes
              the code. The scope is still written down, the quote still fixed
              before kickoff, and the rule about a working build every week does
              not soften because you are local.
            </p>
            <p>
              One thing to be straight about.{" "}
              <Link
                href="/work"
                className="underline underline-offset-4 decoration-[var(--color-ink)]/30 hover:decoration-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]"
              >
                Our published case studies
              </Link>{" "}
              number three: this site, and two reference builds we label as such
              because they are not client engagements. There is no wall of local
              logos here, and inventing one would be the first thing we lied to
              you about. Judge the engineering on the writing and the first two
              weeks.
            </p>
          </motion.div>
        </div>
      </Section>

      {/* What we take on */}
      <Section variant="light" className="pt-0">
        <div className="max-w-3xl mb-12">
          <motion.h2
            className="text-display-lg"
            data-reveal="y30"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow }}
          >
            What we take on.
          </motion.h2>
        </div>

        <motion.p
          className="max-w-3xl text-base lg:text-lg text-[var(--color-ink)]/75 leading-relaxed"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.15 }}
        >
          The work splits four ways:{" "}
          <Link
            href="/services/web-development"
            className="underline underline-offset-4 decoration-[var(--color-ink)]/30 hover:decoration-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]"
          >
            web development for marketing sites and product interfaces
          </Link>
          ,{" "}
          <Link
            href="/services/mobile-app-development"
            className="underline underline-offset-4 decoration-[var(--color-ink)]/30 hover:decoration-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]"
          >
            mobile app development in React Native and native where it earns it
          </Link>
          ,{" "}
          <Link
            href="/services/ai-automation"
            className="underline underline-offset-4 decoration-[var(--color-ink)]/30 hover:decoration-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]"
          >
            AI automation for document and workflow pipelines
          </Link>
          , and{" "}
          <Link
            href="/services/ai-consulting"
            className="underline underline-offset-4 decoration-[var(--color-ink)]/30 hover:decoration-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]"
          >
            AI integration consulting
          </Link>{" "}
          for when the real question is whether to build the thing at all. Each
          page carries its own scope, stack, and published price bands.
        </motion.p>

        <motion.p
          className="max-w-3xl mt-8 text-base lg:text-lg text-[var(--color-ink)]/75 leading-relaxed"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.2 }}
        >
          The list runs the other way too, and the Lahore-specific entry on it
          is staff augmentation by the seat &mdash; the dominant model in this
          city, and the one thing we will not sell, because you cannot hold
          anyone to an outcome they only partly control. The rest of what we
          decline, and the reasoning behind each line, is set out on{" "}
          <Link
            href="/about"
            className="underline underline-offset-4 decoration-[var(--color-ink)]/30 hover:decoration-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]"
          >
            how we build and what we turn down
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
            Talk to the engineers, not a sales desk.
          </motion.h2>
          <motion.p
            className="text-lg text-[var(--color-ink)]/70 mb-10 max-w-xl mx-auto leading-relaxed"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ delay: 0.15, duration: DURATION.slow }}
          >
            One paragraph on what you are building and roughly when it needs to
            be live. We come back with a scope, a price, and a start date inside
            two working days. Office visits in Lahore are welcome; so is a
            message sent at midnight from three continents away.
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
            <a
              href="https://wa.me/923270944766"
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-medium underline underline-offset-4 decoration-[var(--color-ink)]/40 hover:decoration-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]"
            >
              WhatsApp
            </a>
          </motion.div>
        </div>
      </Section>
    </>
  );
}
