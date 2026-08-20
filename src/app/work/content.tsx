"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { Section } from "@/components/ui/section";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { DURATION, EASE, viewportOnce } from "@/lib/motion";
import { ArrowRight } from "lucide-react";

const PROJECTS = [
  {
    slug: "edgebrain-studios",
    title: "EdgeBrain Studios",
    category: "Web Development",
    description:
      "Our own site, built to the standard we hold client work to. Next.js App Router, sub-second load on a mid-range Android, zero layout shift, scroll motion still on.",
    anchor: "Read the Next.js web development case study",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "GSAP"],
    color: "#1a1a1a",
    accent: "#FFD400",
  },
  {
    slug: "project-atlas",
    title: "Project Atlas",
    category: "AI Automation",
    description:
      "A document processing pipeline that reads, classifies, and routes business paperwork with no human retyping it. Forty hours a week of manual entry, removed.",
    anchor: "Read the AI automation case study",
    tech: ["Python", "OpenAI", "FastAPI", "PostgreSQL", "AWS"],
    color: "#0f1923",
    accent: "#4A9EFF",
    placeholder: true,
    disclosure:
      "Reference build — architecture we ship, not a named client engagement.",
  },
  {
    slug: "pulse-mobile",
    title: "Pulse Mobile",
    category: "Mobile App",
    description:
      "An offline-first health tracking app on React Native. One codebase across iOS and Android, sync that survives a week with no signal, charts at sixty frames per second.",
    anchor: "Read the React Native mobile app case study",
    tech: ["React Native", "TypeScript", "Supabase", "Expo"],
    color: "#1a0f23",
    accent: "#9B59B6",
    placeholder: true,
    disclosure:
      "Reference build — architecture we ship, not a named client engagement.",
  },
];

/* What every case study on this page is written to document. Kept as data so
   the "does not claim" item sits in the same list as the three it does claim —
   the disclosure is part of the format, not a footnote bolted onto it. */
const HOW_TO_READ = [
  {
    title: "The constraint that shaped it",
    body: "Every build is pinned to something: a device budget, a document format nobody controls, a network that disappears for days. Each study names that constraint first, because every decision after it only makes sense in its light.",
  },
  {
    title: "The architecture decision",
    body: "One or two choices decide how a project ages. Rendering strategy, sync model, where state lives, what the queue is for. We write down what we picked and what we rejected, so you can argue with the reasoning instead of admiring the screenshot.",
  },
  {
    title: "The tradeoff we accepted",
    body: "Nothing is free. Offline-first buys reliability and costs you conflict resolution. An extraction pipeline buys hours back and costs you an evaluation set to maintain. Each study says what a choice cost, not only what it bought.",
  },
  {
    title: "What it does not claim",
    body: "No invented revenue lift. No conversion percentage we were never in a position to measure. No logo we lack permission to show. Where a build is a reference build rather than a named engagement, the card says so and the study repeats it.",
  },
];

/* The four service pages, each reached by an anchor that describes the page it
   opens. Descriptive anchor text here is the only internal link signal /work
   passes down to the service pages, so "learn more" would waste it. */
const PROBLEM_TYPES = [
  {
    label: "Web",
    title: "A product that survives real data and a mid-range phone",
    body: "Marketing sites that load in under a second on a three-year-old Android. Dashboards that stay fast past the ten-thousandth row. Portals with auth, roles, and an admin screen nobody dreads. Next.js and TypeScript, deployed into your cloud account.",
    href: "/services/web-development",
    anchor: "Next.js web development scope, timeline, and pricing",
  },
  {
    label: "Mobile",
    title: "One codebase that behaves on both stores",
    body: "React Native builds where offline is a designed feature rather than a bug report, sync is settled before the first screen is drawn, and app review rules are read in week one instead of discovered in week six.",
    href: "/services/mobile-app-development",
    anchor: "React Native mobile app development scope and timeline",
  },
  {
    label: "AI automation",
    title: "Manual work you can point at",
    body: "Document processing, extraction, classification, routing, ticket triage. If someone retypes the same thing dozens of times a week, that is the shape we automate — and we measure accuracy field by field against your real documents before it reaches production.",
    href: "/services/ai-automation",
    anchor: "AI automation for document and workflow processing",
  },
  {
    label: "AI consulting",
    title: "Deciding what is worth building at all",
    body: "Sometimes the useful answer is that the model is not your bottleneck. We audit the workflow, price the options, and say which parts are worth automating this quarter, before anyone commits to a pipeline.",
    href: "/services/ai-consulting",
    anchor: "AI consulting for teams deciding what to build",
  },
];

export function WorkPageContent() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      {/* Hero */}
      <Section variant="light" className="pt-40 lg:pt-48">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Work" }]} />
        <motion.p
          className="text-xs uppercase tracking-[0.2em] text-[var(--color-mute)] mb-4 font-medium"
          data-reveal="fade"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow }}
        >
          Case studies
        </motion.p>
        <motion.h1
          className="text-display-xl max-w-3xl mb-8"
          data-reveal="y30"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.1 }}
        >
          The engineering, not the mood board.
        </motion.h1>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.2 }}
        >
          <div className="lg:col-span-8 lg:col-start-1 space-y-5 text-lg leading-relaxed text-[var(--color-ink)]/80">
            <p>
              EdgeBrain Studios is a software house in Lahore building
              production software for founders and lean product teams
              worldwide. The case studies below cover the three things we ship
              most: web applications on Next.js, cross-platform mobile apps on
              React Native, and AI automation that removes manual work instead
              of bolting a chatbot onto it.
            </p>
            <p>
              Each one is written as an engineering narrative rather than a
              brochure. You get the constraint that shaped the architecture, the
              tradeoff we took, the part that turned out harder than expected,
              and the numbers the build was measured against. If you are
              shortlisting a development partner, that detail is the only thing
              separating a real team from a folder of stock screenshots.
            </p>
            <p>
              Two of the three are reference builds. They describe the
              architecture and delivery approach we use in that category, drawn
              from the engagements we run, without attaching a client name we
              are not free to publish. They are labelled on the card and again
              at the top of the page. We would rather show you the engineering
              honestly than assemble a logo wall.
            </p>
            <p className="text-[var(--color-mute)]">
              Typical engagement: fixed scope, quoted before kickoff, four to
              eight weeks to production, working software in your hands every
              week. Senior engineers write the code and you talk to them
              directly.
            </p>
          </div>
        </motion.div>
      </Section>

      {/* Projects grid */}
      <Section variant="light" className="pt-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {PROJECTS.map((project, i) => (
            <motion.article
              key={project.slug}
              data-reveal="y30"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{
                duration: DURATION.slow,
                ease: EASE.standard,
                delay: i * 0.1,
              }}
            >
              <Link
                href={`/work/${project.slug}`}
                aria-label={`${project.anchor}: ${project.title}`}
                className="group block"
              >
                <div className="relative aspect-[4/3] rounded-[var(--radius-lg)] overflow-hidden mb-5">
                  <div
                    className="absolute inset-0 transition-transform duration-[var(--duration-slow)] ease-[var(--ease-standard)] group-hover:scale-[1.03]"
                    style={{ backgroundColor: project.color }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="w-[35%] h-[35%] rounded-[30%] opacity-20 rotate-12"
                        style={{ backgroundColor: project.accent }}
                      />
                      <div
                        className="absolute w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: project.accent,
                          top: "30%",
                          right: "25%",
                        }}
                      />
                    </div>
                    <div className="absolute top-6 left-6 text-white/20 text-sm font-medium">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    {/* `placeholder` marks a project as NOT a named client
                        engagement. The badge it drives has to say that, and
                        has to be readable — it used to read "Featured Build"
                        at 20% opacity, which inverted the meaning of the flag
                        and contradicted the case study it links to. */}
                    {"placeholder" in project && project.placeholder && (
                      <div className="absolute bottom-6 right-6 text-white/60 text-xs uppercase tracking-[0.2em]">
                        Reference build
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs text-[var(--color-mute)] uppercase tracking-[0.1em] mb-1">
                      {project.category}
                    </p>
                    <h2 className="text-display-sm mb-2 group-hover:text-[var(--color-yellow)] transition-colors">
                      {project.title}
                    </h2>
                    <p className="text-sm text-[var(--color-mute)] max-w-md mb-4">
                      {project.description}
                    </p>
                    {"disclosure" in project && project.disclosure && (
                      <p className="text-sm text-[var(--color-mute)] max-w-md mb-4">
                        {project.disclosure}
                      </p>
                    )}
                    <span className="text-sm font-medium text-[var(--color-ink)] underline decoration-[var(--color-yellow)] decoration-2 underline-offset-4">
                      {project.anchor}
                    </span>
                  </div>
                  <span className="text-[var(--color-mute)] group-hover:text-[var(--color-ink)] group-hover:translate-x-1 transition-all mt-1">
                    <ArrowRight size={18} />
                  </span>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </Section>

      {/* How to read these case studies */}
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
              How to read these
            </motion.p>
            <motion.h2
              className="text-display-lg lg:sticky lg:top-32"
              data-reveal="y30"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow, delay: 0.1 }}
            >
              Three studies you can interrogate beats thirty tiles.
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
              Three case studies is the entire portfolio, and that is the
              honest number. EdgeBrain Studios is a young studio. We would
              rather publish three builds you can take apart in a call than
              thirty thumbnails carrying a logo and an adjective. The first is
              this website, which we own outright and can describe down to the
              render path. The other two are reference builds.
            </p>
            <p>
              A reference build is not a mock-up, and it is not a quiet claim of
              a finished client project. It documents the stack, the structure,
              and the decisions we bring to that category of problem, written up
              the way we write up an engagement. Read it as engineering you can
              question, not as proof of a customer. If your shortlist turns on a
              wall of recognisable brands, we are not the strongest name on it
              &mdash; better learned here than on the second call.
            </p>
            <p>
              What these studies are good for is the thing portfolios are
              usually worst at: showing how a team reasons once a constraint
              stops being negotiable. Four things each one puts on the record.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 pt-2">
              {HOW_TO_READ.map((item, i) => (
                <motion.div
                  key={item.title}
                  className="border-t border-[var(--color-hairline-dark)] pt-5"
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
                  <h3 className="text-base lg:text-lg font-medium text-[var(--color-offwhite)] mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm lg:text-base text-[var(--color-offwhite)]/70 leading-relaxed">
                    {item.body}
                  </p>
                </motion.div>
              ))}
            </div>

            <p>
              Ask us in the first call about the part where the reasoning turned
              out wrong. Every one of these builds has one, and we will tell you
              which.
            </p>
          </motion.div>
        </div>
      </Section>

      {/* The kinds of problems we take on — descriptive links to all four
          service pages */}
      <Section variant="light">
        <div className="max-w-3xl mb-14 lg:mb-16">
          <motion.p
            className="text-xs uppercase tracking-[0.2em] text-[var(--color-mute)] mb-4 font-medium"
            data-reveal="fade"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow }}
          >
            What we take on
          </motion.p>
          <motion.h2
            className="text-display-lg mb-6"
            data-reveal="y30"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.1 }}
          >
            Four kinds of problem, described by their shape.
          </motion.h2>
          <motion.p
            className="text-lg text-[var(--color-mute)] leading-relaxed"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.2 }}
          >
            The case studies above are three instances of the work below. If
            your project sits in one of these shapes, the service page has the
            scope, the timeline, and where pricing starts.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
          {PROBLEM_TYPES.map((item, i) => (
            <motion.div
              key={item.href}
              className="border-t border-[var(--color-hairline-light)] pt-6"
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
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-mute)] font-medium mb-3">
                {item.label}
              </p>
              <h3 className="text-display-sm mb-3">{item.title}</h3>
              <p className="text-sm lg:text-base text-[var(--color-ink)]/75 leading-relaxed mb-4">
                {item.body}
              </p>
              <Link
                href={item.href}
                className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-ink)] underline decoration-[var(--color-yellow)] decoration-2 underline-offset-4 hover:gap-3 transition-all"
              >
                {item.anchor}
                <ArrowRight size={14} />
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="max-w-3xl mt-14 lg:mt-16 text-base lg:text-lg text-[var(--color-ink)]/75 leading-relaxed"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.15 }}
        >
          Plenty of projects straddle two of these, and a few sit outside all
          four. If yours does, describe it in two paragraphs on{" "}
          <Link
            href="/contact"
            className="underline decoration-[var(--color-yellow)] decoration-2 underline-offset-4"
          >
            the EdgeBrain Studios contact page
          </Link>{" "}
          and we will say which parts we would take and who is better placed for
          the rest.
        </motion.p>
      </Section>

      {/* CTA */}
      <Section variant="dark" noise>
        <div className="max-w-2xl mx-auto text-center">
          <motion.h2
            className="text-display-lg mb-6"
            data-reveal="y30"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow }}
          >
            Your build is the next one written up.
          </motion.h2>
          <motion.p
            className="text-[var(--color-offwhite)]/70 mb-8"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ delay: 0.1, duration: DURATION.slow }}
          >
            Send us the problem in two paragraphs. You get a scope and a fixed
            price back, not a discovery invoice.
          </motion.p>
          <motion.div
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ delay: 0.15, duration: DURATION.slow }}
          >
            <ButtonLink href="/contact" size="lg">
              <span>Start a project</span>
            </ButtonLink>
          </motion.div>
        </div>
      </Section>
    </>
  );
}
