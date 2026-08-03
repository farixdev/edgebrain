"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { Section } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button";
import { DURATION, EASE, viewportOnce } from "@/lib/motion";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface CaseStudyProps {
  project: {
    title: string;
    category: string;
    description: string;
    problem: string;
    approach: string;
    build: string;
    result: string;
    tech: string[];
    color: string;
    accent: string;
    placeholder?: boolean;
  };
  nextProject: { slug: string; title: string };
}

export function CaseStudyContent({ project, nextProject }: CaseStudyProps) {
  const shouldReduceMotion = useReducedMotion();

  const sections = [
    { label: "The Problem", content: project.problem },
    { label: "Our Approach", content: project.approach },
    { label: "The Build", content: project.build },
    { label: "The Result", content: project.result },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 lg:pt-40 pb-0 bg-[var(--color-offwhite)]">
        <div className="container-site">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-mute)] hover:text-[var(--color-ink)] transition-colors mb-8"
          >
            <ArrowLeft size={14} /> All projects
          </Link>

          <motion.p
            className="text-xs uppercase tracking-[0.2em] text-[var(--color-mute)] mb-3 font-medium"
            initial={shouldReduceMotion ? {} : { opacity: 0 }}
            whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow }}
          >
            {project.category}
          </motion.p>
          <motion.h1
            className="text-display-xl mb-4"
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.1 }}
          >
            {project.title}
          </motion.h1>
          <motion.p
            className="text-lg text-[var(--color-mute)] max-w-2xl mb-10"
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.2 }}
          >
            {project.description}
          </motion.p>

          {project.placeholder && (
            <motion.p
              className="text-xs text-[var(--color-mute)]/50 mb-6 uppercase tracking-[0.15em]"
              initial={shouldReduceMotion ? {} : { opacity: 0 }}
              whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow, delay: 0.25 }}
            >
              Featured build (placeholder)
            </motion.p>
          )}
        </div>

        {/* Hero image placeholder */}
        <div className="container-site pb-section">
          <motion.div
            className="aspect-[16/9] lg:aspect-[21/9] rounded-[var(--radius-lg)] overflow-hidden"
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
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
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow }}
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
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow, delay: 0.1 }}
            >
              <p
                className={`text-lg leading-relaxed ${
                  i % 2 === 0
                    ? "text-[var(--color-offwhite)]/80"
                    : "text-[var(--color-ink)]/80"
                }`}
              >
                {section.content}
              </p>
            </motion.div>
          </div>
        </Section>
      ))}

      {/* Tech stack */}
      <Section variant="light">
        <motion.p
          className="text-xs uppercase tracking-[0.15em] text-[var(--color-mute)] mb-6 font-medium"
          initial={shouldReduceMotion ? {} : { opacity: 0 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow }}
        >
          Built with
        </motion.p>
        <motion.div
          className="flex flex-wrap gap-3"
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.1 }}
        >
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="px-4 py-2 rounded-[var(--radius-full)] text-sm font-medium bg-[var(--color-ink)]/5 text-[var(--color-ink)]/70 border border-[var(--color-hairline-light)]"
            >
              {tech}
            </span>
          ))}
        </motion.div>
      </Section>

      {/* Next project */}
      <Section variant="dark" noise>
        <div className="flex flex-col items-center text-center">
          <p className="text-xs uppercase tracking-[0.15em] text-[var(--color-mute)] mb-4 font-medium">
            Next project
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
          <h2 className="text-display-md mb-6">
            Want something like this?
          </h2>
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
