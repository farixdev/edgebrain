"use client";

import { TECH_LOGOS } from "@/lib/constants";

export function TechStrip() {
  const items = [...TECH_LOGOS, ...TECH_LOGOS, ...TECH_LOGOS];

  return (
    <section className="py-10 bg-[var(--color-offwhite)] border-y border-[var(--color-hairline-light)] overflow-hidden">
      <div className="flex animate-tech-marquee whitespace-nowrap">
        {items.map((tech, i) => (
          <span
            key={i}
            className="mx-10 text-sm font-medium text-[var(--color-mute)]/30 uppercase tracking-[0.15em] flex-shrink-0"
          >
            {tech}
          </span>
        ))}
      </div>

      <style jsx>{`
        @keyframes techMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-tech-marquee {
          animation: techMarquee 40s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-tech-marquee {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
