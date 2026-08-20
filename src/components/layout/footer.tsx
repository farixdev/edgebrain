import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { NAV_LINKS, SERVICES, CONTACT, serviceHref } from "@/lib/constants";
import { ARTICLES, articleHref } from "@/app/insights/articles";
import { Mail, Phone, MapPin } from "lucide-react";

/**
 * Second-tier routes that are not primary sections.
 *
 * These are the pages the header deliberately does not carry — a location
 * page and the tools hub. The footer is where they get their site-wide
 * crawlable link, with anchor text that says what the page is rather than
 * where it sits. Appended to NAV_LINKS below rather than merged into it,
 * because NAV_LINKS is what "primary section" means everywhere else.
 */
const SECONDARY_LINKS = [
  { label: "Free tools & calculators", href: "/tools" },
  { label: "Software development in Lahore", href: "/software-development-lahore" },
] as const;

/**
 * Technology-specific service pages.
 *
 * They sit under the four disciplines in the Services column, not beside
 * them: a WordPress migration is web development and an n8n build is AI
 * automation. Listing them after the four, above "All services", is the
 * flattest way to show that nesting in a list that has no indentation.
 */
const TECHNOLOGY_PAGES = [
  {
    label: "WordPress to Next.js migration",
    href: "/services/wordpress-to-nextjs-migration",
  },
  {
    label: "n8n automation development",
    href: "/services/n8n-automation-development",
  },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[var(--color-ink)] text-[var(--color-offwhite)] relative noise-overlay">
      {/* Yellow accent line */}
      <div className="h-[2px] bg-[var(--color-yellow)]" />

      <div className="container-site section-padding">
        {/* Top: big wordmark */}
        <div className="mb-16 lg:mb-20">
          <Logo size="xl" variant="light" />
        </div>

        {/* Columns — three, not four. The fourth was a "Connect" column of
            LinkedIn / Instagram / Facebook icons all pointing at href="#",
            which is a self-link: dead for a visitor and wasted crawl signal.
            Removed pending real profile URLs; to restore, add a fourth column
            here with the real hrefs and set lg:grid-cols-4 again. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Navigation */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.15em] text-[var(--color-mute)] mb-5 font-medium">
              Navigation
            </h3>
            <ul className="space-y-3">
              {[...NAV_LINKS, ...SECONDARY_LINKS].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-offwhite)]/70 hover:text-[var(--color-yellow)] transition-colors duration-[var(--duration-fast)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.15em] text-[var(--color-mute)] mb-5 font-medium">
              Services
            </h3>
            {/* Each service links to its dedicated page rather than a
                /services#anchor, so all six are crawlable from every page on
                the site and each one accrues its own internal links. */}
            <ul className="space-y-3">
              {SERVICES.map((service) => (
                <li key={service.number}>
                  <Link
                    href={serviceHref(service)}
                    className="text-sm text-[var(--color-offwhite)]/70 hover:text-[var(--color-yellow)] transition-colors duration-[var(--duration-fast)]"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
              {TECHNOLOGY_PAGES.map((page) => (
                <li key={page.href}>
                  <Link
                    href={page.href}
                    className="text-sm text-[var(--color-offwhite)]/70 hover:text-[var(--color-yellow)] transition-colors duration-[var(--duration-fast)]"
                  >
                    {page.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/services"
                  className="text-sm text-[var(--color-offwhite)]/70 hover:text-[var(--color-yellow)] transition-colors duration-[var(--duration-fast)]"
                >
                  All services
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact — promoted into the space the removed social column
              freed. Spans the full width at sm so three columns never leave an
              orphan on the second row. */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-xs uppercase tracking-[0.15em] text-[var(--color-mute)] mb-5 font-medium">
              Contact
            </h3>
            <p className="text-sm text-[var(--color-offwhite)]/70 leading-relaxed mb-5 max-w-sm">
              Send us the problem in two paragraphs. You get a scope and a fixed
              price back, usually inside two working days.
            </p>
            <ul className="space-y-3">
              <li>
                <a
                  href={CONTACT.phoneTel}
                  className="flex items-center gap-2 text-sm text-[var(--color-offwhite)]/70 hover:text-[var(--color-yellow)] transition-colors"
                >
                  <Phone size={14} />
                  {CONTACT.phone}
                </a>
              </li>
              <li>
                <a
                  href={CONTACT.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-[var(--color-offwhite)]/70 hover:text-[var(--color-yellow)] transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="flex items-center gap-2 text-sm text-[var(--color-offwhite)]/70 hover:text-[var(--color-yellow)] transition-colors"
                >
                  <Mail size={14} />
                  {CONTACT.email}
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-[var(--color-offwhite)]/70">
                <MapPin size={14} />
                {CONTACT.locationDetail}
              </li>
            </ul>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-yellow)] underline decoration-[var(--color-yellow)] decoration-2 underline-offset-4 hover:gap-3 transition-all duration-[var(--duration-fast)]"
            >
              Start a project with EdgeBrain Studios
            </Link>
          </div>
        </div>

        {/* Insights — a full-width band rather than a fourth column, so the
            three-column grid above keeps its balance and the Contact block
            keeps its width. Every entry is derived from the article registry
            in src/app/insights/articles.ts, so a new piece appears here (and
            in the sitemap) without anyone remembering to edit this file. The
            anchor text is the article title, which is the descriptive version
            of itself — no "read more" links. */}
        <div className="mt-16 pt-8 border-t border-[var(--color-hairline-dark)]">
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 mb-6">
            <h3 className="text-xs uppercase tracking-[0.15em] text-[var(--color-mute)] font-medium">
              Insights
            </h3>
            <Link
              href="/insights"
              className="text-xs font-medium text-[var(--color-yellow)] underline decoration-[var(--color-yellow)]/50 underline-offset-4 hover:decoration-[var(--color-yellow)] transition-colors duration-[var(--duration-fast)]"
            >
              All insights
            </Link>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-3">
            {ARTICLES.map((article) => (
              <li key={article.slug}>
                <Link
                  href={articleHref(article.slug)}
                  className="text-sm text-[var(--color-offwhite)]/70 hover:text-[var(--color-yellow)] transition-colors duration-[var(--duration-fast)]"
                >
                  {article.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[var(--color-hairline-dark)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--color-mute)]">
            &copy; {year} EdgeBrain Studios. All rights reserved.
          </p>
          <p className="text-xs text-[var(--color-mute)]">
            Lahore, Pakistan
          </p>
        </div>
      </div>
    </footer>
  );
}
