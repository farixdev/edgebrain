"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "default" | "lg" | "sm";
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center font-medium transition-all overflow-hidden",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-yellow)]",
          "disabled:opacity-50 disabled:pointer-events-none",
          {
            primary: [
              "bg-[var(--color-yellow)] text-[var(--color-ink)]",
              "before:absolute before:inset-0 before:bg-[var(--color-ink)] before:origin-left before:scale-x-0",
              "before:transition-transform before:duration-[var(--duration-base)] before:ease-[var(--ease-standard)]",
              "hover:before:scale-x-100 hover:text-[var(--color-yellow)]",
              "[&>span]:relative [&>span]:z-10",
            ].join(" "),
            secondary: [
              "border border-[var(--color-ink)] text-[var(--color-ink)] bg-transparent",
              "hover:bg-[var(--color-ink)] hover:text-[var(--color-offwhite)]",
              "transition-colors duration-[var(--duration-base)] ease-[var(--ease-standard)]",
            ].join(" "),
            ghost: [
              "text-[var(--color-ink)] bg-transparent",
              "hover:bg-[var(--color-ink)]/5",
              "transition-colors duration-[var(--duration-fast)]",
            ].join(" "),
          }[variant],
          {
            default: "h-11 px-6 text-sm rounded-[var(--radius-full)]",
            lg: "h-14 px-8 text-base rounded-[var(--radius-full)]",
            sm: "h-9 px-4 text-xs rounded-[var(--radius-full)]",
          }[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

interface ButtonLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "default" | "lg" | "sm";
}

const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center font-medium transition-all overflow-hidden cursor-pointer",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-yellow)]",
          {
            primary: [
              "bg-[var(--color-yellow)] text-[var(--color-ink)]",
              "before:absolute before:inset-0 before:bg-[var(--color-ink)] before:origin-left before:scale-x-0",
              "before:transition-transform before:duration-[var(--duration-base)] before:ease-[var(--ease-standard)]",
              "hover:before:scale-x-100 hover:text-[var(--color-yellow)]",
              "[&>span]:relative [&>span]:z-10",
            ].join(" "),
            secondary: [
              "border border-[var(--color-ink)] text-[var(--color-ink)] bg-transparent",
              "hover:bg-[var(--color-ink)] hover:text-[var(--color-offwhite)]",
              "transition-colors duration-[var(--duration-base)] ease-[var(--ease-standard)]",
            ].join(" "),
            ghost: [
              "text-[var(--color-ink)] bg-transparent",
              "hover:bg-[var(--color-ink)]/5",
              "transition-colors duration-[var(--duration-fast)]",
            ].join(" "),
          }[variant],
          {
            default: "h-11 px-6 text-sm rounded-[var(--radius-full)]",
            lg: "h-14 px-8 text-base rounded-[var(--radius-full)]",
            sm: "h-9 px-4 text-xs rounded-[var(--radius-full)]",
          }[size],
          className
        )}
        {...props}
      />
    );
  }
);
ButtonLink.displayName = "ButtonLink";

export { Button, ButtonLink };
export type { ButtonProps, ButtonLinkProps };
