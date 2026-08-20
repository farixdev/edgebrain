/**
 * The grounding corpus for the site chat assistant.
 *
 * The bot is only allowed to answer from real site content. This module builds
 * that content into one plain-text document by IMPORTING the same data
 * modules the pages render from — never by restating them. Nothing here should
 * be a fact typed twice:
 *
 *   src/data/content.json ................ services, projects, process, stats,
 *                                          FAQs, differentiators, contact
 *   src/app/insights/articles.ts ......... the article registry
 *   src/app/services/(*)/faqs.ts ......... per-service FAQ modules
 *   src/components/sections/faq-home-data  the long-form home FAQs
 *   src/lib/constants.ts ................. SITE identity, service routes
 *
 * The only literals below are ROUTE_SUMMARIES, because a route is a file on
 * disk, not a content field — there is nowhere else for a one-line description
 * of /about to live. Each one mirrors that route's `metadata.description`.
 *
 * Live content: every builder here defaults to the bundled content.json but
 * takes an override. The chat route passes `await getSiteContent()`, so an
 * edit made in the admin panel is in the bot's knowledge on the very next
 * message.
 *
 * SIZE. The full corpus is roughly 38,000 characters — about 8,900 tokens —
 * and the Groq account this site runs on refuses any request over 8,000
 * tokens per minute, `max_tokens` included. Sending the whole document meant
 * every single visitor message came back 413 and escalated. So the corpus is
 * built as chunks rather than a blob:
 *
 *   buildKnowledgeChunks()  every chunk, tagged core / retrievable
 *   selectKnowledge()       the chunks one question needs, inside a budget
 *   buildKnowledgeBase()    all of them joined — the reference document, used
 *                           by tests and audits, never sent to the model
 *
 * See `src/lib/token-budget.ts` for the numbers and
 * `tests/knowledge-budget.test.ts` for the assertion that keeps them true.
 */

import fallbackContent from "@/data/content.json";
import { SITE, SERVICE_ROUTES } from "@/lib/constants";
import type { SiteContent } from "@/lib/db";
import { ARTICLES, articleHref, SERVICE_LABELS } from "@/app/insights/articles";
import { HOME_FAQS } from "@/components/sections/faq-home-data";
import { WEB_DEV_FAQS } from "@/app/services/web-development/faqs";
import { MOBILE_APP_FAQS } from "@/app/services/mobile-app-development/faqs";
import { AI_AUTOMATION_FAQS } from "@/app/services/ai-automation/faqs";
import { AI_CONSULTING_FAQS } from "@/app/services/ai-consulting/faqs";
import { WP_MIGRATION_FAQS } from "@/app/services/wordpress-to-nextjs-migration/faqs";
import { N8N_FAQS } from "@/app/services/n8n-automation-development/faqs";

/* -------------------------------------------------------------------------- */
/* Site map                                                                   */
/* -------------------------------------------------------------------------- */

export interface SiteMapEntry {
  /** Root-relative path, e.g. "/services/ai-automation". */
  url: string;
  title: string;
  summary: string;
  /**
   * Articles are excluded from the always-on URL index in the system prompt.
   * There are a lot of them, their titles are long, and each one already
   * carries its own URL in the chunk that gets retrieved when it is relevant.
   * Everything else is short enough to list on every single turn.
   */
  kind: "page" | "case-study" | "article";
}

/**
 * Case-study slugs, mirroring the list in src/app/sitemap.ts.
 *
 * Deliberately not derived from content.json: the admin panel can add a
 * project there without a matching /work/<slug> route existing, and the bot
 * pointing a visitor at a 404 is worse than it not mentioning the project.
 */
const CASE_STUDY_SLUGS = [
  "edgebrain-studios",
  "project-atlas",
  "pulse-mobile",
] as const;

/**
 * One line per fixed route, mirroring that page's `metadata.description`.
 * If you change a page's meta description, change it here too.
 */
const ROUTE_SUMMARIES: Record<string, { title: string; summary: string }> = {
  "/": {
    title: "Home — EdgeBrain Studios",
    summary:
      "AI-native software studio in Lahore, Pakistan, working worldwide. Web development, mobile apps, AI automation, and AI integration consulting. Fixed scope, quoted upfront.",
  },
  "/services": {
    title: "Services",
    summary:
      "Web development, mobile apps, AI automation, and AI integration from a senior team in Lahore. Fixed scope, quoted upfront, most projects ship in 4 to 8 weeks.",
  },
  "/services/web-development": {
    title: "Web Development",
    summary:
      "A Next.js development agency for founders and lean product teams. We ship SaaS platforms, dashboards, and marketing sites in 4 to 8 weeks. Priced upfront.",
  },
  "/services/mobile-app-development": {
    title: "Mobile App Development",
    summary:
      "Cross-platform iOS and Android apps in React Native, Flutter, and Expo. Senior engineers, fixed scope, first build in your hands in 4 to 8 weeks.",
  },
  "/services/ai-automation": {
    title: "AI Automation",
    summary:
      "AI automation for startups and operations teams: document processing, data extraction, and back-office workflows. Fixed scope, quoted upfront, live in 6 weeks.",
  },
  "/services/ai-consulting": {
    title: "AI Integration & Consulting",
    summary:
      "AI integration consulting for product teams worldwide. We scope LLM features, RAG, evals, and cost control, then ship a working proof of concept in three weeks.",
  },
  "/services/wordpress-to-nextjs-migration": {
    title: "WordPress to Next.js Migration",
    summary:
      "We migrate WordPress to Next.js without wrecking organic traffic. A crawled redirect map, canonical and schema parity checks, and a reversible cutover plan.",
  },
  "/services/n8n-automation-development": {
    title: "n8n Automation Development",
    summary:
      "Hire n8n developers for self-hosted deployment, custom nodes, queue mode, and AI agent workflows built for production. Fixed scope, quoted before kickoff.",
  },
  "/work": {
    title: "Work — case studies",
    summary:
      "Case studies from EdgeBrain Studios: Next.js web apps, React Native mobile builds, and an AI automation pipeline. The architecture, tradeoffs, and the numbers.",
  },
  "/insights": {
    title: "Insights",
    summary:
      "Guides on choosing a build team, what software actually costs, and shipping AI features that hold up. Written by the engineers doing the work, sources linked.",
  },
  "/about": {
    title: "About",
    summary:
      "How EdgeBrain Studios works: the way we scope and price, the risky part built first, what makes a project a good fit, and the work we turn down and why.",
  },
  "/contact": {
    title: "Contact",
    summary:
      "Tell us what you are building. A senior engineer replies within 24 hours and a fixed quote follows within two business days. Software studio in Lahore, clients worldwide.",
  },
  "/software-development-lahore": {
    title: "Software Development in Lahore",
    summary:
      "Software house in Lahore building web apps, mobile apps, and AI automation. The local engineering market, real overlap hours with London, New York and Dubai.",
  },
  "/tools": {
    title: "Free tools",
    summary:
      "Free calculators for people commissioning software. No email gate, no signup, and the arithmetic behind every number is visible on the page and editable.",
  },
  "/tools/mvp-cost-estimator": {
    title: "MVP Cost Estimator",
    summary:
      "A free MVP cost calculator that shows its arithmetic. Every line item, every hour band, every assumption editable. No email gate, no signup, no data sent.",
  },
};

function buildSiteMap(): SiteMapEntry[] {
  const fixed: SiteMapEntry[] = Object.entries(ROUTE_SUMMARIES).map(
    ([url, meta]) => ({ url, ...meta, kind: "page" })
  );

  const projects = fallbackContent.projects as SiteContent["projects"];

  const caseStudies: SiteMapEntry[] = CASE_STUDY_SLUGS.map((slug) => {
    const project = projects.find((entry) => entry.slug === slug);
    return {
      url: `/work/${slug}`,
      title: project ? `${project.title} — case study` : `${slug} — case study`,
      summary: project
        ? `${project.category}. ${project.description}`
        : "Case study.",
      kind: "case-study",
    };
  });

  const articles: SiteMapEntry[] = ARTICLES.map((article) => ({
    url: articleHref(article.slug),
    title: article.title,
    summary: article.description,
    kind: "article",
  }));

  return [...fixed, ...caseStudies, ...articles];
}

/**
 * Every real, indexable route on the site with a one-line summary.
 *
 * The bot uses this to answer "where do I read more about X" with a URL that
 * actually resolves. Anything not in this list does not exist — the assistant
 * must never invent a path.
 */
export const SITE_MAP: SiteMapEntry[] = buildSiteMap();

/** Fast lookup used by the corpus builder to avoid re-scanning SITE_MAP. */
const SITE_MAP_BY_URL = new Map(SITE_MAP.map((entry) => [entry.url, entry]));


/* -------------------------------------------------------------------------- */
/* Corpus                                                                     */
/* -------------------------------------------------------------------------- */

type Faq = { question: string; answer: string };

/** The six service FAQ modules, each tied to the route that renders it. */
const SERVICE_FAQ_SETS: { url: string; faqs: readonly Faq[] }[] = [
  { url: "/services/web-development", faqs: WEB_DEV_FAQS },
  { url: "/services/mobile-app-development", faqs: MOBILE_APP_FAQS },
  { url: "/services/ai-automation", faqs: AI_AUTOMATION_FAQS },
  { url: "/services/ai-consulting", faqs: AI_CONSULTING_FAQS },
  { url: "/services/wordpress-to-nextjs-migration", faqs: WP_MIGRATION_FAQS },
  { url: "/services/n8n-automation-development", faqs: N8N_FAQS },
];

/**
 * One addressable piece of the corpus.
 *
 * The corpus is chunked rather than emitted as one blob because the whole
 * document is ~38,000 characters — about 8,900 tokens — and the Groq account
 * this site runs on rejects any request over 8,000. Chunking is what makes it
 * possible to send only the ~10% of the corpus a given question needs.
 *
 * `core` chunks are the studio's identity: who it is, what it sells, how to
 * reach it, and every URL that exists. Those go in every prompt, because
 * without them the assistant cannot answer anything at all and cannot link
 * safely. Everything else — FAQ entries, article summaries, per-page
 * descriptions — is retrieved per question by `selectKnowledge`.
 */
export interface KnowledgeChunk {
  /** Stable identifier, useful in tests and logs. */
  id: string;
  /** Markdown heading this chunk sits under. Chunks may share one. */
  heading: string;
  /** The route this chunk describes, if any. Drives page-affinity scoring. */
  url: string | null;
  body: string;
  /** True when the chunk belongs in every prompt regardless of the question. */
  core: boolean;
}

function heading(title: string): string {
  return `\n## ${title}\n`;
}

function faqText(faq: Faq): string {
  return `Q: ${faq.question}\nA: ${faq.answer}`;
}

/** Fixed preamble, always first, never counted against retrieval. */
const PREAMBLE = [
  `# ${SITE.name} — knowledge base`,
  "",
  "Everything below is real content from edgebrainstudios.com. Answer only from it.",
].join("\n");

/**
 * Breaks the site's content into the chunks the assistant can be grounded on.
 *
 * @param content Optional live content document (from `getSiteContent()`).
 *                Defaults to the bundled src/data/content.json.
 */
export function buildKnowledgeChunks(content?: SiteContent): KnowledgeChunk[] {
  const data = (content ?? fallbackContent) as unknown as SiteContent;
  const contact = data.contact ?? fallbackContent.contact;
  const chunks: KnowledgeChunk[] = [];

  const push = (chunk: KnowledgeChunk) => {
    if (chunk.body.trim()) chunks.push(chunk);
  };

  /* ---- Identity (core) -------------------------------------------------- */
  push({
    id: "company",
    heading: "Company",
    url: "/about",
    core: true,
    body: [
      `Name: ${SITE.name}`,
      `Tagline: ${SITE.tagline}`,
      `What we are: ${SITE.description}`,
      `Website: ${SITE.url}`,
      `Location: ${contact.location} (${contact.locationDetail})`,
      "Timezone: UTC+5 (Pakistan Standard Time). Full working-day overlap with Europe; about four hours with US East Coast from 9am ET.",
    ].join("\n"),
  });

  /* ---- Contact (core) --------------------------------------------------- */
  push({
    id: "contact",
    heading: "Contact",
    url: "/contact",
    core: true,
    body: [
      `Email: ${contact.email}`,
      `Phone: ${contact.phone} (tel link: ${contact.phoneTel})`,
      `WhatsApp: ${contact.whatsapp}`,
      `Contact page: ${SITE.url}/contact`,
      "How enquiries are handled: a senior engineer replies within 24 hours, and a fixed quote follows within two business days. Every engagement starts with a free discovery call.",
    ].join("\n"),
  });

  /* ---- Site map (core, but URL + title only) ---------------------------- */
  // The full one-line summaries run to ~5,900 characters, far too much to
  // carry in every prompt. The list of URLs is the part rule 5 depends on —
  // the assistant may not cite a path it has not been shown — so a bare index
  // of the durable routes stays core, each summary becomes its own retrievable
  // chunk below, and the long tail of article URLs rides along in the article
  // chunks that retrieval pulls in when an article is actually relevant.
  push({
    id: "sitemap",
    heading: "Site map — the pages that exist, with their URLs",
    url: null,
    core: true,
    body: [
      "Never cite a URL that does not appear somewhere in this CONTEXT. Individual /insights articles have their own URLs, listed with the article.",
      "",
      ...SITE_MAP.filter((entry) => entry.kind !== "article").map(
        (entry) => `${entry.url} — ${entry.title}`
      ),
    ].join("\n"),
  });

  /* ---- Services (core) -------------------------------------------------- */
  // No `Page summary:` line here: it duplicated the site-map summary, which is
  // retrievable as `route:<url>` when a question is actually about that page.
  const serviceLines = data.services.map((service) => {
    const url = SERVICE_ROUTES[service.number] ?? service.href;
    return [`### ${service.title} (${url})`, service.description, service.detail]
      .filter(Boolean)
      .join("\n");
  });

  // The two technology spokes have no content.json entry — they are routes,
  // not content rows — so they are described from the site map.
  const spokeLines = [
    "/services/wordpress-to-nextjs-migration",
    "/services/n8n-automation-development",
  ].map((url) => {
    const entry = SITE_MAP_BY_URL.get(url);
    return `### ${entry?.title ?? url} (${url})\n${entry?.summary ?? ""}`;
  });

  push({
    id: "services",
    heading: "Services",
    url: "/services",
    core: true,
    body: `Hub page: /services\n\n${[...serviceLines, ...spokeLines].join(
      "\n\n"
    )}`,
  });

  /* ---- Process, numbers, differentiators (core) ------------------------- */
  push({
    id: "process",
    heading: "How we work — the four-step process",
    url: "/about",
    core: true,
    body: data.processSteps
      .map((step) => `${step.number}. ${step.title} — ${step.description}`)
      .join("\n"),
  });

  // Retrievable, not core: headline figures are a nice flourish on "tell me
  // about yourselves" and dead weight on the other ninety per cent of turns.
  push({
    id: "stats",
    heading: "Numbers we publish",
    url: null,
    core: false,
    body: data.stats
      .map((stat) => `${stat.value}${stat.suffix} — ${stat.label}`)
      .join("\n"),
  });

  push({
    id: "differentiators",
    heading: "Why clients pick us",
    url: null,
    core: true,
    body: data.differentiators
      .map((item) => `${item.title}: ${item.description}`)
      .join("\n"),
  });

  /* ---- Case studies (core) ---------------------------------------------- */
  // Small, and rule 3 holds the assistant answerable for describing the
  // portfolio accurately — disclosures included — so it is never dropped.
  const caseStudies = data.projects.filter((project) =>
    (CASE_STUDY_SLUGS as readonly string[]).includes(project.slug)
  );
  push({
    id: "case-studies",
    heading: "Case studies (/work)",
    url: "/work",
    core: true,
    body: caseStudies
      .map((project) =>
        [
          `### ${project.title} — /work/${project.slug}`,
          `Category: ${project.category}`,
          project.description,
          project.disclosure
            ? `Important disclosure: ${project.disclosure}`
            : null,
        ]
          .filter(Boolean)
          .join("\n")
      )
      .join("\n\n"),
  });

  /* ---- Free tools (retrievable) ----------------------------------------- */
  // /tools and /tools/mvp-cost-estimator are both in the core site map, so the
  // assistant can always link them. Only the descriptions are retrieved.
  push({
    id: "tools",
    heading: "Free tools",
    url: "/tools",
    core: false,
    body: [
      `/tools — ${SITE_MAP_BY_URL.get("/tools")?.summary ?? ""}`,
      `/tools/mvp-cost-estimator — ${
        SITE_MAP_BY_URL.get("/tools/mvp-cost-estimator")?.summary ?? ""
      }`,
    ].join("\n"),
  });

  /* ---- Page summaries (retrievable) ------------------------------------- */
  for (const entry of SITE_MAP) {
    push({
      id: `route:${entry.url}`,
      heading: "What each page covers",
      url: entry.url,
      core: false,
      body: `${entry.url} — ${entry.title}: ${entry.summary}`,
    });
  }

  /* ---- FAQs (retrievable, one chunk per question) ----------------------- */
  HOME_FAQS.forEach((faq, index) => {
    push({
      id: `faq:home:${index}`,
      heading: "General FAQs (home page)",
      url: "/",
      core: false,
      body: faqText(faq),
    });
  });

  data.faqs.forEach((faq, index) => {
    push({
      id: `faq:library:${index}`,
      heading: "General FAQs (content library)",
      url: null,
      core: false,
      body: faqText(faq),
    });
  });

  for (const set of SERVICE_FAQ_SETS) {
    const entry = SITE_MAP_BY_URL.get(set.url);
    set.faqs.forEach((faq, index) => {
      push({
        id: `faq:${set.url}:${index}`,
        heading: `FAQs — ${entry?.title ?? set.url} (${set.url})`,
        url: set.url,
        core: false,
        body: faqText(faq),
      });
    });
  }

  /* ---- Articles (retrievable, one chunk each) --------------------------- */
  for (const article of ARTICLES) {
    push({
      id: `article:${article.slug}`,
      heading:
        "Insights articles (hub: /insights) — link visitors to the URL rather than reproducing the article",
      url: articleHref(article.slug),
      core: false,
      body: [
        `### ${article.title}`,
        `URL: ${articleHref(article.slug)}`,
        `Category: ${article.category} | ${article.readingMinutes} min read | published ${article.publishedAt}`,
        `What it covers: ${article.description}`,
        `Angle: ${article.excerpt}`,
        article.relatedService
          ? `Related service: ${
              SERVICE_LABELS[article.relatedService] ?? article.relatedService
            } (${article.relatedService})`
          : null,
      ]
        .filter(Boolean)
        .join("\n"),
    });
  }

  return chunks;
}

/**
 * Joins chunks back into the plain-text document handed to the model.
 *
 * Chunks sharing a heading are emitted under one copy of it, so a selection of
 * four Web Development FAQs reads as one section rather than four. Callers
 * must pass chunks in corpus order; `selectKnowledge` restores it.
 */
function renderChunks(chunks: KnowledgeChunk[]): string {
  const parts: string[] = [PREAMBLE];
  let current = "";

  for (const chunk of chunks) {
    if (chunk.heading !== current) {
      parts.push(heading(chunk.heading));
      current = chunk.heading;
    }
    parts.push(chunk.body);
  }

  return parts.join("\n").trim();
}

/**
 * The complete corpus, every chunk, in order.
 *
 * Far too large to send to the model — see `src/lib/token-budget.ts` — so this
 * is deliberately not what the chat route uses. It is the reference document:
 * the regression test measures it, and it is what `selectKnowledge` selects
 * from.
 *
 * @param content Optional live content document (from `getSiteContent()`).
 */
export function buildKnowledgeBase(content?: SiteContent): string {
  return renderChunks(buildKnowledgeChunks(content));
}

/* -------------------------------------------------------------------------- */
/* Retrieval                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Words carrying no signal about which chunk answers a question. Dropping them
 * stops "what do you do about pricing" scoring every chunk that contains "do"
 * and burying the one that contains "pricing".
 */
const STOPWORDS = new Set([
  "the", "and", "are", "for", "you", "your", "with", "that", "this", "have",
  "has", "how", "what", "when", "where", "who", "why", "can", "could", "would",
  "should", "will", "does", "did", "was", "were", "there", "their", "them",
  "they", "from", "about", "into", "out", "any", "all", "not", "but", "our",
  "its", "been", "being", "get", "got", "much", "many", "long", "like",
  "just", "know", "want", "need", "tell", "give", "say", "please", "hello",
  "hey", "thanks", "thank", "yes", "guys", "team", "edgebrain", "studios",
  "com",
]);

/**
 * A deliberately crude suffix stripper.
 *
 * Not linguistics — just enough that a visitor asking about "pricing" matches
 * a FAQ that says "price", and "migrate" matches "migration". Both sides of
 * the comparison go through it, so it only has to be *consistent*, not
 * correct: "wordpress" stemming to "wordpres" costs nothing as long as the
 * corpus stems the same way.
 */
function stem(word: string): string {
  let base = word;

  if (base.length > 4 && base.endsWith("ies")) {
    base = `${base.slice(0, -3)}y`;
  }

  for (const suffix of ["ions", "ing", "ion", "ers", "er", "ed", "es", "s"]) {
    if (base.endsWith(suffix) && base.length - suffix.length >= 3) {
      base = base.slice(0, -suffix.length);
      break;
    }
  }

  return base.length > 3 && base.endsWith("e") ? base.slice(0, -1) : base;
}

/** Stemmed word-ish tokens. Keeps `+`, `#` and `.` so "next.js" survives. */
function terms(text: string): string[] {
  const raw = text.toLowerCase().match(/[a-z0-9][a-z0-9+#.-]*/g) ?? [];
  return raw.map((token) => stem(token.replace(/[.-]+$/, "")));
}

/** How often each term occurs, so scoring is a lookup rather than a scan. */
function frequencies(text: string): Map<string, number> {
  const counts = new Map<string, number>();
  for (const term of terms(text)) {
    counts.set(term, (counts.get(term) ?? 0) + 1);
  }
  return counts;
}

/** Query terms worth scoring on: deduplicated, no stopwords, 3+ characters. */
function queryTerms(query: string): string[] {
  const raw = query.toLowerCase().match(/[a-z0-9][a-z0-9+#.-]*/g) ?? [];
  const seen = new Set<string>();

  for (const token of raw) {
    const trimmed = token.replace(/[.-]+$/, "");
    // Stopwords are matched before stemming, so the list stays readable.
    if (trimmed.length >= 3 && !STOPWORDS.has(trimmed)) seen.add(stem(trimmed));
  }

  return [...seen];
}

export interface SelectKnowledgeOptions {
  /** What the visitor just asked, plus any recent turns worth matching on. */
  query: string;
  /** The page the widget is open on, used to break ties toward local content. */
  pageUrl?: string | null;
  /** Hard ceiling for the rendered result, in characters. */
  budgetChars: number;
  /** Optional pre-built chunk list, so a caller can build once and reuse it. */
  chunks?: KnowledgeChunk[];
}

/**
 * Assembles the CONTEXT block for one question, inside a character budget.
 *
 * Core chunks go in first and are never dropped: an assistant that has lost
 * its own contact details or the list of valid URLs is worse than one that has
 * lost a FAQ. Whatever budget is left over is filled with the highest-scoring
 * retrievable chunks.
 *
 * Scoring is deliberately plain lexical matching weighted by inverse document
 * frequency — no embedding model, no second network call, no vector store, and
 * so nothing else that can fail between a visitor's question and an answer. A
 * miss is safe by construction: a question whose supporting chunk did not make
 * the cut is simply not in the CONTEXT, so rule 2 fires and the conversation
 * escalates to a human rather than being answered from thin air.
 */
export function selectKnowledge({
  query,
  pageUrl,
  budgetChars,
  chunks,
}: SelectKnowledgeOptions): string {
  const all = chunks ?? buildKnowledgeChunks();
  const core = all.filter((chunk) => chunk.core);
  const pool = all.filter((chunk) => !chunk.core);

  const order = new Map(all.map((chunk, index) => [chunk.id, index]));
  const chosen = new Set(core.map((chunk) => chunk.id));
  let used = renderChunks(core).length;

  const wanted = queryTerms(query);
  const path = normalisePath(pageUrl);

  // Term statistics computed over the retrievable pool only.
  const bodyFreq = pool.map((chunk) => frequencies(chunk.body));
  const headingFreq = pool.map((chunk) => frequencies(chunk.heading));

  const idf = new Map<string, number>();
  for (const term of wanted) {
    let docs = 0;
    for (let index = 0; index < pool.length; index += 1) {
      if (bodyFreq[index].has(term) || headingFreq[index].has(term)) docs += 1;
    }
    // The +0.2 floor keeps a term present in every chunk scoring above zero.
    idf.set(term, Math.log((pool.length + 1) / (docs + 1)) + 0.2);
  }

  const scored = pool.map((chunk, index) => {
    let score = 0;

    for (const term of wanted) {
      const inHeading = headingFreq[index].has(term);
      const hits = (bodyFreq[index].get(term) ?? 0) + (inHeading ? 1 : 0);
      if (hits === 0) continue;
      // Repeats are capped: a long chunk saying one word four times is not
      // four times as relevant as a short chunk saying it once.
      score += Math.min(hits, 3) * (idf.get(term) ?? 1);
      if (inHeading) score += 1.5;
    }

    // Page affinity, additive and small: it breaks ties toward the page the
    // visitor is reading without drowning out a direct term match.
    if (path && chunk.url === path) score += score > 0 ? 2 : 1;

    return { chunk, score };
  });

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return (order.get(a.chunk.id) ?? 0) - (order.get(b.chunk.id) ?? 0);
  });

  for (const { chunk, score } of scored) {
    if (score <= 0) break;
    // Slightly over-counts, because a chunk sharing its heading with one
    // already chosen will not re-emit that heading. Over-counting is the safe
    // direction for a hard provider limit.
    const cost = chunk.body.length + chunk.heading.length + 8;
    if (used + cost > budgetChars) continue;
    chosen.add(chunk.id);
    used += cost;
  }

  const text = renderChunks(all.filter((chunk) => chosen.has(chunk.id)));

  // Belt and braces: the cost model above is an estimate, the budget is not.
  return text.length <= budgetChars ? text : text.slice(0, budgetChars);
}

/** Reduces an absolute URL, or a path with a query or hash, to a bare route. */
function normalisePath(value: string | null | undefined): string | null {
  const raw = value?.trim();
  if (!raw) return null;

  let path = raw;
  if (/^https?:\/\//i.test(raw)) {
    try {
      path = new URL(raw).pathname;
    } catch {
      return null;
    }
  }

  path = path.split("?")[0].split("#")[0];
  if (path.length > 1) path = path.replace(/\/+$/, "");
  return path.startsWith("/") ? path : null;
}
