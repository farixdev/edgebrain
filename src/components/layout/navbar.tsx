"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { ButtonLink } from "@/components/ui/button";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { DURATION, EASE } from "@/lib/motion";

/**
 * A nav item is current for its whole section, not just its index page.
 * /insights has six article routes under it and /work and /services each have
 * their own children; matching on equality alone left the underline off on
 * every one of them, which is the case a visitor most needs it in.
 */
function isCurrentSection(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  /* Close the mobile menu whenever the route changes (covers browser
     back/forward as well as in-menu clicks). Adjusting state during render
     is the React-recommended alternative to a setState-in-effect. */
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMobileOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape" && mobileOpen) setMobileOpen(false);
    },
    [mobileOpen]
  );

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all",
          scrolled
            ? "bg-[var(--color-offwhite)]/80 backdrop-blur-xl border-b border-[var(--color-hairline-light)] py-3"
            : "bg-transparent py-5"
        )}
        style={{
          transitionDuration: "var(--duration-base)",
          transitionTimingFunction: "var(--ease-standard)",
        }}
      >
        <nav
          className="container-site flex items-center justify-between"
          aria-label="Main navigation"
        >
          <Logo size="md" />

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative text-sm font-medium transition-colors duration-[var(--duration-fast)]",
                  "after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-[var(--color-yellow)]",
                  "after:transition-all after:duration-[var(--duration-base)] after:ease-[var(--ease-standard)]",
                  isCurrentSection(pathname, link.href)
                    ? "text-[var(--color-ink)] after:w-full"
                    : "text-[var(--color-mute)] hover:text-[var(--color-ink)] after:w-0 hover:after:w-full"
                )}
                aria-current={
                  isCurrentSection(pathname, link.href) ? "page" : undefined
                }
              >
                {link.label}
              </Link>
            ))}
            <ButtonLink href="/contact" size="sm">
              <span>Start a project</span>
            </ButtonLink>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden relative w-10 h-10 flex items-center justify-center"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            <div className="w-6 flex flex-col gap-1.5">
              <span
                className={cn(
                  "block h-[2px] bg-[var(--color-ink)] transition-all duration-300 origin-center",
                  mobileOpen && "rotate-45 translate-y-[5px]"
                )}
              />
              <span
                className={cn(
                  "block h-[2px] bg-[var(--color-ink)] transition-all duration-300",
                  mobileOpen && "opacity-0 scale-x-0"
                )}
              />
              <span
                className={cn(
                  "block h-[2px] bg-[var(--color-ink)] transition-all duration-300 origin-center",
                  mobileOpen && "-rotate-45 -translate-y-[5px]"
                )}
              />
            </div>
          </button>
        </nav>
      </header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-[var(--color-offwhite)] flex flex-col justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.base, ease: EASE.standard }}
            onKeyDown={handleKeyDown}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <nav className="flex flex-col items-center gap-8">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.1 + i * 0.08,
                    duration: DURATION.slow,
                    ease: EASE.standard,
                  }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "text-display-md transition-colors",
                      isCurrentSection(pathname, link.href)
                        ? "text-[var(--color-ink)]"
                        : "text-[var(--color-mute)] hover:text-[var(--color-ink)]"
                    )}
                    aria-current={
                      isCurrentSection(pathname, link.href) ? "page" : undefined
                    }
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.1 + NAV_LINKS.length * 0.08,
                  duration: DURATION.slow,
                  ease: EASE.standard,
                }}
                className="mt-4"
              >
                <ButtonLink
                  href="/contact"
                  size="lg"
                  onClick={() => setMobileOpen(false)}
                >
                  <span>Start a project</span>
                </ButtonLink>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
