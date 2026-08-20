import Link from "next/link";

export interface Crumb {
  label: string;
  /** Omit on the final crumb — the page you are already on. */
  href?: string;
}

/**
 * The visible half of a BreadcrumbList.
 *
 * Eight routes declared BreadcrumbList JSON-LD while rendering no trail at all,
 * which is structured data describing content that is not on the page — a rich
 * result eligibility risk across the whole commercial section of the site.
 *
 * Keep `items` in the same order as the `itemListElement` array in that route's
 * JSON-LD. If a page should not show a trail, delete its BreadcrumbList node
 * rather than leaving the two out of sync.
 */
export function Breadcrumbs({
  items,
  className = "",
}: {
  items: Crumb[];
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={`mb-8 ${className}`}>
      <ol className="flex flex-wrap items-center gap-2 text-sm text-[var(--color-mute)]">
        {items.map((crumb, i) => (
          <li key={crumb.label} className="flex items-center gap-2">
            {i > 0 && (
              <span aria-hidden="true" className="opacity-60">
                /
              </span>
            )}
            {crumb.href ? (
              <Link
                href={crumb.href}
                className="hover:text-[var(--color-ink)] transition-colors"
              >
                {crumb.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-[var(--color-ink)]/60">
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
