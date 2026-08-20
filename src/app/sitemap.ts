import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";
import { ARTICLES, articleHref } from "@/app/insights/articles";

/**
 * Case-study slugs.
 *
 * These mirror the PROJECTS map in src/app/work/[slug]/page.tsx, which is what
 * actually decides whether a /work/<slug> URL renders or 404s. Do not derive
 * them from content.json: the admin panel can add a project there without a
 * matching case study, and a sitemap full of 404s is worse than a short one.
 */
const CASE_STUDY_SLUGS = [
  "edgebrain-studios",
  "project-atlas",
  "pulse-mobile",
] as const;

/**
 * Every indexable route on the site.
 *
 * Excluded on purpose: /admin and /api/* (both disallowed in robots.ts) and
 * the not-found route. If you add a route under src/app, add it here too —
 * except under /insights, which is derived from the article registry below and
 * needs no edit here when a new piece ships.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE.url;
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },

    // Services hub plus the six dedicated service pages — the four core
    // disciplines and the two technology-specific pages beneath them. These
    // are the commercial-intent pages, so they carry the highest priority
    // after home.
    { url: `${baseUrl}/services`, changeFrequency: "monthly", priority: 0.9 },
    {
      url: `${baseUrl}/services/web-development`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services/mobile-app-development`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services/ai-automation`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services/ai-consulting`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    // Technology-specific spokes. Same priority as the four disciplines
    // because the intent behind them is at least as commercial: somebody
    // searching "WordPress to Next.js migration" has already decided to buy.
    {
      url: `${baseUrl}/services/wordpress-to-nextjs-migration`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services/n8n-automation-development`,
      changeFrequency: "monthly",
      priority: 0.9,
    },

    { url: `${baseUrl}/contact`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/work`, changeFrequency: "weekly", priority: 0.8 },

    // The insights hub gains a new card every time an article ships, so it
    // changes as often as /work does and sits at the same priority.
    { url: `${baseUrl}/insights`, changeFrequency: "weekly", priority: 0.8 },

    // The location page. Below the service pages because its intent is
    // narrower, above /about because it is still a page somebody lands on
    // while deciding whether to hire.
    {
      url: `${baseUrl}/software-development-lahore`,
      changeFrequency: "monthly",
      priority: 0.8,
    },

    { url: `${baseUrl}/about`, changeFrequency: "monthly", priority: 0.7 },

    // The estimator outranks its own hub on purpose: the tool is the thing
    // people search for and link to, and /tools is currently a one-card index
    // whose job is to be a crawlable parent rather than a destination.
    {
      url: `${baseUrl}/tools/mvp-cost-estimator`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    { url: `${baseUrl}/tools`, changeFrequency: "monthly", priority: 0.6 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = CASE_STUDY_SLUGS.map((slug) => ({
    url: `${baseUrl}/work/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  /**
   * Derived from ARTICLES rather than hardcoded, so a new article is in the
   * sitemap the moment its route exists. `articleHref` is the same helper the
   * hub and the "keep reading" blocks use, which is what stops this file and
   * the rendered links from ever disagreeing about a URL.
   *
   * lastModified is the publish date, not build time. Stamping every article
   * with `new Date()` on each deploy tells crawlers ten pages changed when
   * nothing did, and that signal stops being worth anything quickly.
   */
  const articleRoutes: MetadataRoute.Sitemap = ARTICLES.map((article) => ({
    url: `${baseUrl}${articleHref(article.slug)}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
    lastModified: new Date(`${article.publishedAt}T00:00:00Z`),
  }));

  return [...staticRoutes, ...projectRoutes, ...articleRoutes].map((entry) => ({
    ...entry,
    lastModified: entry.lastModified ?? lastModified,
  }));
}
