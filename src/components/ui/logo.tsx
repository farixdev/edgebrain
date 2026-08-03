import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "light" | "dark";
}

const sizeMap = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
  xl: "text-4xl",
};

export function Logo({ className, size = "md", variant = "dark" }: LogoProps) {
  return (
    <a
      href="/"
      className={cn(
        "font-[var(--font-logo)] font-extrabold tracking-tight inline-flex items-baseline gap-0",
        sizeMap[size],
        variant === "dark"
          ? "text-[var(--color-ink)]"
          : "text-[var(--color-offwhite)]",
        className
      )}
      aria-label="EdgeBrain Studios — Home"
    >
      edgebrain
      <span
        className="inline-block w-[0.35em] h-[0.35em] rounded-full bg-[var(--color-yellow)] ml-[0.05em] translate-y-[0.05em]"
        aria-hidden="true"
      />
    </a>
  );
}
