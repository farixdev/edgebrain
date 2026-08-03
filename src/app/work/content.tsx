"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { Section } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button";
import { DURATION, EASE, viewportOnce } from "@/lib/motion";
import { ArrowRight } from "lucide-react";

const PROJECTS = [
  {
    slug: "edgebrain-studios",
    title: "EdgeBrain Studios",
    category: "Web Development",
    description:
      "Our own portfolio site — built with Next.js 14, Tailwind CSS, GSAP, and Framer Motion. A showcase of our design and engineering standards.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "GSAP"],
    color: "#1a1a1a",
    accent: "#FFD400",
  },
  {
    slug: "project-atlas",
    title: "Project Atlas",
    category: "AI Automation",
    description:
      "An intelligent document processing pipeline for enterprise clients. Automated extraction, classification, and routing of business documents.",
    tech: ["Python", "OpenAI", "FastAPI", "PostgreSQL", "AWS"],
    color: "#0f1923",
    accent: "#4A9EFF",
    placeholder: true,
  },
  {
    slug: "pulse-mobile",
    title: "Pulse Mobile",
    category: "Mobile App",
    description:
      "Cross-platform health tracking app with real-time data sync, offline support, and integration with wearable devices.",
    tech: ["React Native", "TypeScript", "Supabase", "Expo"],
    color: "#1a0f23",
    accent: "#9B59B6",
    placeholder: true,
  },
];

export function WorkPageContent() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      {/* Hero */}
      <Section variant="light" className="pt-40 lg:pt-48">
        <motion.p
          className="text-xs uppercase tracking-[0.2em] text-[var(--color-mute)] mb-4 font-medium"
          initial={shouldReduceMotion ? {} : { opacity: 0 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow }}
        >
          Our work
        </motion.p>
        <motion.h1
          className="text-display-xl max-w-3xl mb-6"
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.1 }}
        >
          Projects we&rsquo;re proud of.
        </motion.h1>
        <motion.p
          className="text-lg text-[var(--color-mute)] max-w-xl"
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.2 }}
        >
          A selection of what we&rsquo;ve built. Each one shipped, live, and
          delivering value.
        </motion.p>
      </Section>

      {/* Projects grid */}
      <Section variant="light" className="pt-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {PROJECTS.map((project, i) => (
            <motion.div
              key={project.slug}
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
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
                    {"placeholder" in project && project.placeholder && (
                      <div className="absolute bottom-6 right-6 text-white/20 text-xs uppercase tracking-[0.2em]">
                        Featured Build
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs text-[var(--color-mute)] uppercase tracking-[0.1em] mb-1">
                      {project.category}
                    </p>
                    <h3 className="text-display-sm mb-2 group-hover:text-[var(--color-yellow)] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-[var(--color-mute)] max-w-md">
                      {project.description}
                    </p>
                  </div>
                  <span className="text-[var(--color-mute)] group-hover:text-[var(--color-ink)] group-hover:translate-x-1 transition-all mt-1">
                    <ArrowRight size={18} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section variant="dark" noise>
        <div className="max-w-2xl mx-auto text-center">
          <motion.h2
            className="text-display-lg mb-6"
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow }}
          >
            Want your project here?
          </motion.h2>
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
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
