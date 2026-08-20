import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * The 404 route previously rendered no heading at all — the two giant "4"
 * glyphs are decorative text, not structure, so the only headings in the
 * document came from the footer. A page with no h1 tells a crawler nothing
 * about what it is, and tells a screen reader user even less.
 *
 * The numerals are now aria-hidden and the h1 carries the actual message.
 * No motion here on purpose: this route has to be readable the instant it
 * paints, so there is nothing to reveal and nothing to fail open.
 */
const DESTINATIONS = [
  {
    href: "/services",
    label: "Web, mobile, and AI automation services",
    detail: "What we build, what it costs, and how long it takes.",
  },
  {
    href: "/work",
    label: "Case studies from our recent builds",
    detail: "The architecture, the tradeoffs, and the numbers.",
  },
  {
    href: "/about",
    label: "About EdgeBrain Studios",
    detail: "Who works on your project and how we run one.",
  },
  {
    href: "/contact",
    label: "Start a project with us",
    detail: "Tell us the scope and we’ll come back with a plan.",
  },
];

export default function NotFound() {
  return (
    <section className="min-h-screen bg-[var(--color-offwhite)] flex items-center justify-center">
      <div className="container-site py-20 max-w-2xl">
        <div
          className="flex items-center gap-2 mb-8"
          aria-hidden="true"
        >
          <span className="text-[6rem] lg:text-[9rem] font-bold text-[var(--color-ink)] font-[var(--font-display)] leading-none tracking-tighter">
            4
          </span>
          <span className="w-12 h-12 lg:w-20 lg:h-20 rounded-full bg-[var(--color-yellow)] inline-block" />
          <span className="text-[6rem] lg:text-[9rem] font-bold text-[var(--color-ink)] font-[var(--font-display)] leading-none tracking-tighter">
            4
          </span>
        </div>

        <h1 className="text-display-lg text-[var(--color-ink)] mb-4">
          This page doesn&rsquo;t exist
        </h1>

        <p className="text-lg text-[var(--color-mute)] mb-10">
          The URL was mistyped, or the page moved. Here is where the rest of
          the site lives.
        </p>

        <nav aria-label="Popular pages" className="mb-10">
          <ul className="border-t border-[var(--color-hairline-light)]">
            {DESTINATIONS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group flex items-center justify-between gap-6 py-5 border-b border-[var(--color-hairline-light)]"
                >
                  <span>
                    <span className="block font-medium text-[var(--color-ink)] group-hover:text-[var(--color-yellow)] transition-colors duration-[var(--duration-fast)]">
                      {item.label}
                    </span>
                    <span className="block text-sm text-[var(--color-mute)] mt-1">
                      {item.detail}
                    </span>
                  </span>
                  <span className="text-[var(--color-mute)] group-hover:text-[var(--color-ink)] group-hover:translate-x-1 transition-all duration-[var(--duration-fast)] shrink-0">
                    <ArrowRight size={18} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link
          href="/"
          className="inline-flex items-center justify-center h-12 px-8 bg-[var(--color-yellow)] text-[var(--color-ink)] font-medium rounded-[var(--radius-full)] hover:opacity-90 transition-opacity text-sm"
        >
          Back to home
        </Link>
      </div>
    </section>
  );
}
