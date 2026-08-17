"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { Section } from "@/components/ui/section";
import { DURATION, EASE, viewportOnce } from "@/lib/motion";
import { ArrowRight } from "lucide-react";
import { PROJECTS } from "@/lib/constants";

function ProjectCard({
  project,
  index,
}: {
  project: (typeof PROJECTS)[0];
  index: number;
}) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group block flex-shrink-0 w-[85vw] md:w-[60vw] lg:w-[45vw] max-w-[700px]"
    >
      <div className="relative aspect-[4/3] rounded-[var(--radius-lg)] overflow-hidden mb-5">
        {/* Abstract cover art */}
        <div
          className="absolute inset-0 transition-transform duration-[var(--duration-slow)] ease-[var(--ease-standard)] group-hover:scale-[1.03]"
          style={{ backgroundColor: project.color }}
        >
          {/* Geometric shapes as abstract cover */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-[40%] h-[40%] rounded-[30%] opacity-20 rotate-12"
              style={{ backgroundColor: project.accent }}
            />
            <div
              className="absolute w-[25%] h-[25%] rounded-full opacity-10 -translate-x-[20%] translate-y-[15%]"
              style={{ backgroundColor: project.accent }}
            />
            <div
              className="absolute w-3 h-3 rounded-full"
              style={{ backgroundColor: project.accent, top: "30%", right: "25%" }}
            />
          </div>
          {/* Project number */}
          <div className="absolute top-6 left-6 text-white/20 text-sm font-medium">
            {String(index + 1).padStart(2, "0")}
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
          <h3 className="text-display-sm mb-1 group-hover:text-[var(--color-yellow)] transition-colors duration-[var(--duration-fast)]">
            {project.title}
          </h3>
          <p className="text-sm text-[var(--color-mute)]">{project.category}</p>
        </div>
        <span className="text-[var(--color-mute)] group-hover:text-[var(--color-ink)] group-hover:translate-x-1 transition-all duration-[var(--duration-fast)] mt-2">
          <ArrowRight size={18} />
        </span>
      </div>
    </Link>
  );
}

export function WorkHome() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  return (
    <Section variant="light" container={false}>
      <div className="container-site mb-12">
        <div className="flex items-end justify-between gap-6">
          <div>
            <motion.p
              className="text-xs uppercase tracking-[0.2em] text-[var(--color-mute)] mb-4 font-medium"
              initial={shouldReduceMotion ? {} : { opacity: 0 }}
              whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow }}
            >
              Selected work
            </motion.p>
            <motion.h2
              className="text-display-lg"
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow, delay: 0.1 }}
            >
              Projects we&rsquo;re proud of
            </motion.h2>
          </div>
          <Link
            href="/work"
            className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-[var(--color-mute)] hover:text-[var(--color-ink)] hover:gap-3 transition-all"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Horizontal scrollable on all sizes */}
      <div
        ref={scrollRef}
        className="flex gap-6 lg:gap-8 overflow-x-auto px-[var(--gutter)] pb-6 snap-x snap-mandatory scrollbar-hide"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {PROJECTS.map((project, i) => (
          <motion.div
            key={project.slug}
            className="snap-start"
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{
              duration: DURATION.slow,
              ease: EASE.standard,
              delay: i * 0.15,
            }}
          >
            <ProjectCard project={project} index={i} />
          </motion.div>
        ))}
      </div>

      <div className="container-site mt-8 md:hidden">
        <Link
          href="/work"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-mute)] hover:text-[var(--color-ink)] transition-colors"
        >
          View all projects <ArrowRight size={14} />
        </Link>
      </div>
    </Section>
  );
}
