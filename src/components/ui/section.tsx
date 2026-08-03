"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "light" | "dark" | "yellow";
  container?: boolean;
  noise?: boolean;
}

const Section = forwardRef<HTMLElement, SectionProps>(
  (
    { className, variant = "light", container = true, noise = false, children, ...props },
    ref
  ) => {
    return (
      <section
        ref={ref}
        className={cn(
          "section-padding relative overflow-hidden",
          {
            light: "bg-[var(--color-offwhite)] text-[var(--color-ink)]",
            dark: "bg-[var(--color-ink)] text-[var(--color-offwhite)]",
            yellow: "bg-[var(--color-yellow)] text-[var(--color-ink)]",
          }[variant],
          noise && variant === "dark" && "noise-overlay",
          className
        )}
        {...props}
      >
        {container ? (
          <div className="container-site relative z-10">{children}</div>
        ) : (
          children
        )}
      </section>
    );
  }
);
Section.displayName = "Section";

export { Section };
