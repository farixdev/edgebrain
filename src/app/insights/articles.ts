/**
 * The single source of truth for everything under /insights.
 *
 * The hub, the shared article chrome, the JSON-LD on both, and the six article
 * routes all read from this array. Nothing about an article — its H1, its meta
 * description, its published date, its reading time — should be typed twice.
 * If a route disagrees with this file, the route is wrong.
 *
 * Field discipline, because these are the things that quietly rot:
 *
 *   seoTitle    Brand-free. The root layout's metadata template appends
 *               " | EdgeBrain Studios" (20 characters), so keep this at or
 *               under 40 to stay inside the ~60-character SERP cut. There is a
 *               length assertion in the test note at the bottom of this file;
 *               if you lengthen one, re-count it.
 *
 *   description The meta description, 150-160 characters. Under 150 wastes the
 *               snippet, over 160 gets truncated mid-sentence.
 *
 *   excerpt     Hub-card copy only. Never rendered on the article itself, so it
 *               can repeat the description's angle in different words rather
 *               than duplicating it verbatim.
 *
 *   relatedSlugs  The internal-link graph, set deliberately rather than derived
 *               from category. Two clusters exist here: a commercial one
 *               (in-house-vs-agency-vs-freelancer at the top of the funnel,
 *               feeding mvp-development-cost and the offshore piece) and an
 *               engineering one (rag-vs-fine-tuning and
 *               automate-document-processing, which are the same buyer at two
 *               depths). react-native-vs-native has no topical sibling, so it
 *               is wired to the cost piece on the platform-choice question
 *               rather than left orphaned.
 */

export interface Article {
  slug: string;
  /** The article H1. Rendered by ArticleLayout — do not re-type it in a route. */
  title: string;
  /** Brand-free, <= 40 chars. The layout template appends " | EdgeBrain Studios". */
  seoTitle: string;
  /** Meta description, 150-160 chars. */
  description: string;
  /** 1-2 sentences for the hub card. */
  excerpt: string;
  category: string;
  readingMinutes: number;
  /** ISO date, YYYY-MM-DD. */
  publishedAt: string;
  /** Route of the service this piece sits closest to, used by the closing CTA. */
  relatedService?: string;
  /** Slugs for the "Keep reading" block. Ordered — the first is the strongest link. */
  relatedSlugs?: string[];
}

/**
 * Category order is the order the hub renders them in, and it is a funnel:
 * the decision before the build, then the budget, then the build itself.
 */
export const ARTICLE_CATEGORIES = [
  "Choosing a partner",
  "Cost & planning",
  "Engineering decisions",
] as const;

export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number];

export const ARTICLES: Article[] = [
  {
    slug: "in-house-vs-agency-vs-freelancer",
    title: "In-house vs agency vs freelancer for building software",
    seoTitle: "In-House vs Agency vs Freelancer 2026",
    description:
      "In-house team, agency, or freelancer? What each one really costs, how fast each moves, and the failure mode of each — written by an agency, said plainly.",
    excerpt:
      "The three ways to get software built, compared by a studio that sells one of them. Includes the cases where hiring us would be the wrong call, and how to spot them before you sign.",
    category: "Choosing a partner",
    readingMinutes: 9,
    publishedAt: "2026-08-20",
    relatedService: "/services/web-development",
    relatedSlugs: ["mvp-development-cost", "working-with-offshore-development-team"],
  },
  {
    slug: "mvp-development-cost",
    title: "What building an MVP actually costs",
    seoTitle: "What an MVP Actually Costs in 2026",
    description:
      "Published MVP prices run from $5,000 to $250,000 for the same brief. Here is what actually moves the number, and how to read a quote you have been handed.",
    excerpt:
      "Every MVP price range on the internet is unsourced, and they disagree by a factor of fifty. This takes the number apart into the decisions that drive it, so a quote stops being a mystery.",
    category: "Cost & planning",
    readingMinutes: 10,
    publishedAt: "2026-08-20",
    relatedService: "/services/web-development",
    relatedSlugs: [
      "in-house-vs-agency-vs-freelancer",
      "working-with-offshore-development-team",
      "react-native-vs-native",
    ],
  },
  {
    slug: "automate-document-processing",
    title: "How to automate document processing without a data team",
    seoTitle: "Automate Document Processing in 2026",
    description:
      "Turn invoices, PDFs, and scans into structured data without hiring a data team: extraction, confidence thresholds, review queues, and what each stage costs.",
    excerpt:
      "A working document pipeline is four stages, not a platform purchase. What to build, where to put a human, and the confidence threshold that decides which records get read.",
    category: "Engineering decisions",
    readingMinutes: 11,
    publishedAt: "2026-08-20",
    relatedService: "/services/ai-automation",
    relatedSlugs: ["rag-vs-fine-tuning", "mvp-development-cost"],
  },
  {
    slug: "rag-vs-fine-tuning",
    title: "RAG vs fine-tuning: which do you actually need",
    seoTitle: "When to Use RAG vs Fine-Tuning 2026",
    description:
      "RAG or fine-tuning? Pick by what is failing: missing knowledge, or the wrong behaviour. Cost, latency, and maintenance for each, with the boring answer first.",
    excerpt:
      "Almost every team asking this question needs retrieval, not a fine-tune. The rule for telling them apart, what each costs to run, and the narrow cases where fine-tuning earns its keep.",
    category: "Engineering decisions",
    readingMinutes: 10,
    publishedAt: "2026-08-20",
    relatedService: "/services/ai-consulting",
    relatedSlugs: ["automate-document-processing", "in-house-vs-agency-vs-freelancer"],
  },
  {
    slug: "react-native-vs-native",
    title: "React Native vs native iOS and Android",
    seoTitle: "React Native vs Native iOS/Android 2026",
    description:
      "React Native or two native codebases? What the New Architecture changed, where cross-platform breaks, and how the choice moves your build and rebuild cost.",
    excerpt:
      "Most of page one still describes the bridge React Native removed in 2025. Here is the current architecture, the parts that genuinely still need native code, and what the decision costs either way.",
    category: "Engineering decisions",
    readingMinutes: 10,
    publishedAt: "2026-08-20",
    relatedService: "/services/mobile-app-development",
    relatedSlugs: ["mvp-development-cost", "in-house-vs-agency-vs-freelancer"],
  },
  {
    slug: "working-with-offshore-development-team",
    title: "How to work with an offshore development team",
    seoTitle: "Working With an Offshore Dev Team 2026",
    description:
      "Offshore work fails on handover, not on time zones. How to run the first ninety days, spot a bait-and-switch, and keep the code reviewable from the other side.",
    excerpt:
      "We are the offshore team on somebody else's org chart, so this is written from that side. The contract terms, rituals, and access rules that decide whether it works.",
    category: "Choosing a partner",
    readingMinutes: 9,
    publishedAt: "2026-08-20",
    relatedService: "/services/web-development",
    relatedSlugs: ["in-house-vs-agency-vs-freelancer", "mvp-development-cost"],
  },
  {
    slug: "fixed-price-vs-time-and-materials",
    title: "Fixed price vs time and materials: which contract to sign",
    seoTitle: "Fixed Price vs Time and Materials 2026",
    description:
      "Fixed price is not a discount, it is a risk transfer you pay a buffer for. How the buffer gets sized, what shrinks it, and the change-order clauses to read.",
    excerpt:
      "We sell fixed scope, so read this as a hostile witness. The buffer priced into every fixed bid, the change-order mechanics no competitor writes about, and the cases where our own quote is the wrong thing to buy.",
    category: "Cost & planning",
    readingMinutes: 11,
    publishedAt: "2026-08-20",
    relatedService: "/services/web-development",
    relatedSlugs: ["mvp-development-cost", "in-house-vs-agency-vs-freelancer"],
  },
  {
    slug: "llm-cost-per-user",
    title: "What an AI feature actually costs to run per user",
    seoTitle: "LLM Cost Per User: How to Forecast",
    description:
      "What an AI feature costs per user, worked forward from the request path: tokens per turn, cache hit rate, and why a pilot average under-reads the real bill.",
    excerpt:
      "The finance posts tell you gross margin matters. This one does the request-path arithmetic that produces it, then explains why the average user is the wrong unit to forecast against.",
    category: "Cost & planning",
    readingMinutes: 11,
    publishedAt: "2026-08-20",
    relatedService: "/services/ai-consulting",
    relatedSlugs: ["rag-vs-fine-tuning", "automate-document-processing", "mvp-development-cost"],
  },
  {
    slug: "rewrite-vs-refactor-legacy-app",
    title: "Rewrite or refactor: how to judge a codebase you inherited",
    seoTitle: "Rewrite vs Refactor a Legacy Codebase",
    description:
      "Rewrite or refactor an inherited codebase? Five signals you can measure in a day, the one case a rewrite is truly justified, and why strangling beats both.",
    excerpt:
      "Rewrite-vs-refactor gets argued in the abstract because nobody publishes a way to measure the thing being argued about. Here is one: five signals, one working day, from a clean checkout.",
    category: "Engineering decisions",
    readingMinutes: 12,
    publishedAt: "2026-08-20",
    relatedService: "/services/web-development",
    relatedSlugs: [
      "fixed-price-vs-time-and-materials",
      "in-house-vs-agency-vs-freelancer",
      "mvp-development-cost",
    ],
  },
  {
    slug: "why-your-nextjs-site-is-slow",
    title: "Why your Next.js site is slow, and which fixes are worth doing",
    seoTitle: "Why Your Next.js Site Is Slow (2026)",
    description:
      "Your Next.js site is slow for one of three reasons. Read field data at p75, map each Core Web Vital to its real cause, and fix them in the order that pays.",
    excerpt:
      "Most of this SERP is a list of Next.js APIs presented as if order does not matter. It matters enormously. Diagnosis first, then the fix that survives the next deploy.",
    category: "Engineering decisions",
    readingMinutes: 12,
    publishedAt: "2026-08-20",
    relatedService: "/services/web-development",
    relatedSlugs: ["react-native-vs-native", "fixed-price-vs-time-and-materials", "mvp-development-cost"],
  },
];

/** Human labels for the routes used in `relatedService`. */
export const SERVICE_LABELS: Record<string, string> = {
  "/services/web-development": "Web development",
  "/services/mobile-app-development": "Mobile app development",
  "/services/ai-automation": "AI automation",
  "/services/ai-consulting": "AI integration consulting",
};

export function articleHref(slug: string): string {
  return `/insights/${slug}`;
}

/**
 * Throws rather than returning undefined on purpose. ArticleLayout calls this
 * during prerender, so a slug typo in a route fails the build instead of
 * shipping an article with no H1.
 */
export function getArticle(slug: string): Article {
  const article = ARTICLES.find((entry) => entry.slug === slug);
  if (!article) {
    throw new Error(
      `No entry for "${slug}" in src/app/insights/articles.ts. Add it there first — the registry is what the hub, the JSON-LD and the sitemap read.`
    );
  }
  return article;
}

/**
 * The 2-3 pieces the "Keep reading" block shows. Uses the hand-set
 * `relatedSlugs` graph, falls back to same-category, then to anything else, so
 * the block is never empty and never links to the article you are reading.
 */
export function getRelatedArticles(slug: string, count = 3): Article[] {
  const current = getArticle(slug);
  const picked: Article[] = [];

  const push = (article: Article) => {
    if (article.slug === slug) return;
    if (picked.some((entry) => entry.slug === article.slug)) return;
    if (picked.length >= count) return;
    picked.push(article);
  };

  for (const related of current.relatedSlugs ?? []) {
    const match = ARTICLES.find((entry) => entry.slug === related);
    if (match) push(match);
  }
  for (const entry of ARTICLES) {
    if (entry.category === current.category) push(entry);
  }
  for (const entry of ARTICLES) {
    push(entry);
  }

  return picked;
}

export function articlesByCategory(): { category: string; articles: Article[] }[] {
  return ARTICLE_CATEGORIES.map((category) => ({
    category: category as string,
    articles: ARTICLES.filter((article) => article.category === category),
  })).filter((group) => group.articles.length > 0);
}

/** Deterministic on both sides of the hydration boundary, unlike toLocaleDateString. */
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function formatPublishedDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return `${MONTHS[month - 1]} ${day}, ${year}`;
}
