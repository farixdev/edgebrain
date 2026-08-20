"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { Section } from "@/components/ui/section";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { DURATION, EASE, viewportOnce } from "@/lib/motion";
import { ArrowRight, ArrowLeft } from "lucide-react";

/**
 * One subheaded block of a long section. `heading` renders as an h3 above the
 * body copy; sections that are a single sustained argument (problem, result)
 * are normalised into one headless block so the renderer has one code path.
 */
export type ProseBlock = { heading: string; body: string };

/** A plain string is one block with no h3. Anything else is already blocks. */
function toBlocks(content: string | ProseBlock[]): ProseBlock[] {
  return typeof content === "string" ? [{ heading: "", body: content }] : content;
}

interface CaseStudyProps {
  project: {
    title: string;
    category: string;
    description: string;
    problem: string;
    approach: ProseBlock[];
    build: ProseBlock[];
    result: string;
    tech: string[];
    color: string;
    accent: string;
    placeholder?: boolean;
    disclosure?: string;
    service: {
      href: string;
      anchor: string;
      lead: string;
      tail: string;
    };
  };
  nextProject: { slug: string; title: string };
}

export function CaseStudyContent({ project, nextProject }: CaseStudyProps) {
  const shouldReduceMotion = useReducedMotion();

  const sections = [
    {
      label: "The Problem",
      heading: "What was actually broken",
      blocks: toBlocks(project.problem),
    },
    {
      label: "Our Approach",
      heading: "The decision that shaped everything else",
      blocks: toBlocks(project.approach),
    },
    {
      label: "The Build",
      heading: "What we shipped, and what fought back",
      blocks: toBlocks(project.build),
    },
    {
      label: "The Result",
      heading: "The numbers it holds",
      blocks: toBlocks(project.result),
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 lg:pt-40 pb-0 bg-[var(--color-offwhite)]">
        <div className="container-site">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Work", href: "/work" },
              { label: project.title },
            ]}
          />

          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-mute)] hover:text-[var(--color-ink)] transition-colors mb-8"
          >
            <ArrowLeft size={14} /> All case studies
          </Link>

          <motion.p
            className="text-xs uppercase tracking-[0.2em] text-[var(--color-mute)] mb-3 font-medium"
            data-reveal="fade"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow }}
          >
            {project.category} case study
          </motion.p>
          <motion.h1
            className="text-display-xl mb-4"
            data-reveal="y30"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.1 }}
          >
            {project.title}
          </motion.h1>
          <motion.p
            className="text-lg text-[var(--color-mute)] max-w-2xl mb-10"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.2 }}
          >
            {project.description}
          </motion.p>

          {project.placeholder && project.disclosure && (
            <motion.div
              className="max-w-2xl mb-10 border-l-2 border-[var(--color-yellow)] pl-5 py-1"
              data-reveal="fade"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow, delay: 0.25 }}
            >
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-mute)] font-medium mb-2">
                Reference build
              </p>
              <p className="text-sm text-[var(--color-mute)] leading-relaxed">
                {project.disclosure}
              </p>
            </motion.div>
          )}
        </div>

        {/* Hero image placeholder */}
        <div className="container-site pb-section">
          <motion.div
            className="aspect-[16/9] lg:aspect-[21/9] rounded-[var(--radius-lg)] overflow-hidden"
            data-reveal="y30"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.3 }}
          >
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ backgroundColor: project.color }}
            >
              <div className="relative">
                <div
                  className="w-32 h-32 lg:w-48 lg:h-48 rounded-[30%] opacity-20 rotate-12"
                  style={{ backgroundColor: project.accent }}
                />
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full"
                  style={{ backgroundColor: project.accent }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content sections */}
      {sections.map((section, i) => (
        <Section
          key={section.label}
          variant={i % 2 === 0 ? "dark" : "light"}
          noise={i % 2 === 0}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            <motion.div
              className="lg:col-span-4"
              data-reveal="y20"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow, ease: EASE.standard }}
            >
              <span
                className={`text-xs uppercase tracking-[0.15em] font-medium ${
                  i % 2 === 0
                    ? "text-[var(--color-yellow)]"
                    : "text-[var(--color-mute)]"
                }`}
              >
                {section.label}
              </span>
            </motion.div>
            <motion.div
              className="lg:col-span-8"
              data-reveal="y20"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow, delay: 0.1 }}
            >
              <h2
                className={`text-display-sm mb-6 ${
                  i % 2 === 0
                    ? "text-[var(--color-offwhite)]"
                    : "text-[var(--color-ink)]"
                }`}
              >
                {section.heading}
              </h2>
              <div className="space-y-5">
                {section.blocks.map((block, b) => (
                  <div key={b} className={block.heading ? "pt-3" : undefined}>
                    {block.heading && (
                      <h3
                        className={`text-lg font-semibold mb-3 ${
                          i % 2 === 0
                            ? "text-[var(--color-offwhite)]"
                            : "text-[var(--color-ink)]"
                        }`}
                      >
                        {block.heading}
                      </h3>
                    )}
                    <div className="space-y-5">
                      {block.body.split("\n\n").map((paragraph, p) => (
                        <p
                          key={p}
                          className={`text-lg leading-relaxed ${
                            i % 2 === 0
                              ? "text-[var(--color-offwhite)]/80"
                              : "text-[var(--color-ink)]/80"
                          }`}
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </Section>
      ))}

      {/* Tech stack */}
      <Section variant="light">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          <motion.div
            className="lg:col-span-4"
            data-reveal="fade"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow }}
          >
            <span className="text-xs uppercase tracking-[0.15em] text-[var(--color-mute)] font-medium">
              Built with
            </span>
          </motion.div>
          <motion.div
            className="lg:col-span-8"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.1 }}
          >
            <div className="flex flex-wrap gap-3 mb-8">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 rounded-[var(--radius-full)] text-sm font-medium bg-[var(--color-ink)]/5 text-[var(--color-ink)]/70 border border-[var(--color-hairline-light)]"
                >
                  {tech}
                </span>
              ))}
            </div>
            <p className="text-lg leading-relaxed text-[var(--color-ink)]/80 max-w-2xl">
              {project.service.lead}{" "}
              <Link
                href={project.service.href}
                className="underline decoration-[var(--color-yellow)] decoration-2 underline-offset-4 hover:text-[var(--color-ink)] transition-colors"
              >
                {project.service.anchor}
              </Link>{" "}
              {project.service.tail}
            </p>
          </motion.div>
        </div>
      </Section>

      {/* Next project */}
      <Section variant="dark" noise>
        <div className="flex flex-col items-center text-center">
          <p className="text-xs uppercase tracking-[0.15em] text-[var(--color-mute)] mb-4 font-medium">
            Next case study
          </p>
          <Link
            href={`/work/${nextProject.slug}`}
            className="text-display-lg hover:text-[var(--color-yellow)] transition-colors inline-flex items-center gap-4"
          >
            {nextProject.title} <ArrowRight size={32} />
          </Link>
        </div>
      </Section>

      {/* CTA */}
      <Section variant="yellow" className="py-20 lg:py-28">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-display-md mb-4">
            Tell us what is slowing you down.
          </h2>
          <p className="text-[var(--color-ink)]/70 mb-8">
            Fixed scope, quoted before kickoff, four to eight weeks to
            production. You talk to the engineer writing your code.
          </p>
          <ButtonLink
            href="/contact"
            size="lg"
            className="bg-[var(--color-ink)] text-[var(--color-yellow)] before:bg-[var(--color-offwhite)] hover:text-[var(--color-ink)]"
          >
            <span>Start a project</span>
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
