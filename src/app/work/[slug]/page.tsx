import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ORGANIZATION_ID } from "@/lib/constants";
import { CaseStudyContent, type ProseBlock } from "./content";

const SITE = "https://edgebrainstudios.com";
const BRAND = "EdgeBrain Studios";

export type CaseStudy = {
  title: string;
  category: string;
  /**
   * The <title> for this case study, WITHOUT the brand suffix — the root
   * layout's title template appends " | EdgeBrain Studios" (20 chars) on top.
   * Keep each one at 40 chars or under so the rendered title stays inside the
   * ~60-char SERP cut, and never put the brand in here: the derived
   * `${title} Case Study` shape used to print "EdgeBrain Studios" twice on our
   * own case study.
   */
  seoTitle: string;
  description: string;
  metaDescription: string;
  problem: string;
  /**
   * `approach` and `build` are the two long sections, and they used to be one
   * ~350-word string each rendered under a single h2. That gave all three case
   * studies a completely flat heading tree — five h2s, zero h3s — so neither a
   * reader skimming nor a crawler had any signal about what the section covers.
   *
   * They are now arrays of `{ heading, body }` blocks. The h3 layer lives in the
   * DATA, not in the JSX, so a new case study cannot silently regress to flat
   * prose and the subheadings stay editable next to the copy they describe.
   * `problem` and `result` stay as plain strings on purpose: they are shorter,
   * they read as a single argument, and subdividing them would be heading
   * decoration rather than structure.
   */
  approach: ProseBlock[];
  build: ProseBlock[];
  result: string;
  tech: string[];
  color: string;
  accent: string;
  placeholder?: boolean;
  disclosure?: string;
  service: {
    href: string;
    anchor: string;
    lead: string;
    tail: string;
  };
  datePublished: string;
  dateModified: string;
};

const PROJECTS: Record<string, CaseStudy> = {
  "edgebrain-studios": {
    title: "EdgeBrain Studios",
    category: "Web Development",
    seoTitle: "Next.js Web Development Case Study",
    description:
      "Our own site, built to the same standard we hold client work to. Sub-second load, zero layout shift, scroll motion still on.",
    metaDescription:
      "How we built the EdgeBrain Studios site: Next.js App Router, server components, sub-second LCP on mid-range Android, zero layout shift. The full build breakdown.",
    problem:
      "A studio site is the only piece of work a buyer can inspect before they pay you. Ours had to survive that inspection.\n\nThe technical brief we wrote for ourselves was narrow. Load in under a second on a mid-range Android phone over a throttled 4G connection. Score 100 on Lighthouse for performance and accessibility. Move nothing on the page after first paint. Do all of that while carrying scroll-driven motion, self-hosted display type, and full-bleed imagery, which are the three things that usually blow a performance budget.\n\nThe harder constraint was editorial. Most sites in this category are template purchases with the colours swapped. A buyer comparing a software house in Lahore against a London agency cannot tell the two apart from a screenshot, so the screenshot has to do more work. We needed a page that reads as built rather than bought. The only way to prove that is to make decisions a template cannot make: an asymmetric grid, a three-colour system held under discipline, and type set at sizes that only hold together if someone tuned the line height by hand.",
    approach: [
      {
        heading: "The server and client boundary is the whole decision",
        body: "We started with the thing that kills most portfolio sites, which is JavaScript weight. The App Router lets almost every route render on the server, so the browser receives HTML first and hydrates only the parts that actually move. Page files stay server components and export metadata. Anything interactive lives in a sibling client component. Nothing else ships to the browser. That single boundary decision is why the site stays fast with animation still on it.",
      },
      {
        heading: "Three colours, four type sizes, no boxes",
        body: "Design came next, and we set rules before drawing anything. Three colours: off-white, near-black, and one yellow held to roughly ten percent of the visual weight so it still reads as an accent on the twentieth screen rather than wallpaper. Type does the heavy lifting. A display scale with four steps, generous whitespace, hairline rules instead of boxes and drop shadows. Sections alternate light and dark down the page so the scroll has a rhythm you feel without noticing.",
      },
      {
        heading: "What we gave up: this is harder to build than a template",
        body: "The tradeoff we accepted was build complexity. Server and client boundaries, two animation libraries, and a token layer in CSS variables are more moving parts than a one-file template. We took that cost because it is the only version of the site that stays fast as it grows past twenty pages.",
      },
    ],
    build: [
      {
        heading: "The stack, and where every token lives",
        body: "Next.js App Router on React 19, TypeScript in strict mode, Tailwind CSS v4 with every design token declared as a CSS custom property in a single file. Colours, radii, easing curves, and durations all resolve from there, so changing the accent yellow is one edit rather than forty.",
      },
      {
        heading: "Two animation libraries, split by job",
        body: "Motion is split by job. Framer Motion handles entrance reveals and route transitions because its viewport hooks are declarative and cheap. GSAP with ScrollTrigger handles the scroll-driven sequences that need frame-level control. Every animation reads the reduced-motion preference first and collapses to a static state when the visitor has asked their operating system for less movement. That is a two-line habit, not a feature, and it is the difference between an accessible site and a nauseating one.",
      },
      {
        heading: "Fonts and images are where layout shift is won",
        body: "Fonts are self-hosted, subset, preloaded, and declared with explicit size-adjust values so the fallback face occupies the same box as the real one. That detail is what takes cumulative layout shift to zero, and it is the one most sites skip. Images go through the Next image pipeline as AVIF with WebP fallback and fixed intrinsic dimensions.",
      },
      {
        heading: "The part that fought back was the type scale",
        body: "The part that took longest was not the animation. It was getting the type scale to hold between a 360px phone and a 2560px monitor without one awkward step in the middle.",
      },
    ],
    result:
      "Every route ships as static HTML, so first paint never waits on a database. Largest contentful paint lands under one second on a mid-range Android over throttled 4G in our own testing. Cumulative layout shift measures zero. Lighthouse returns 100 for performance, accessibility, and best practices on the routes we check before each deploy.\n\nThe commercial result matters more than the scores. Enquiries now arrive with the scope half-written, because the service pages answer the questions people used to send an email to ask. A buyer weighing a $15 an hour freelancer against a $150 an hour agency can see there is a third option, and can see what that option builds like before the first call.\n\nIt is also the reference build for client work. The token system, the server and client component split, the motion patterns, and the accessibility defaults all move into new projects on day one rather than getting renegotiated each time. That is a large part of why a marketing site takes four weeks here instead of twelve. Reuse is not a shortcut. It is the only honest way a small senior team ships at that pace without cutting the parts nobody sees.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "GSAP", "Vercel"],
    color: "#1a1a1a",
    accent: "#FFD400",
    service: {
      href: "/services/web-development",
      anchor: "Next.js web development",
      lead: "This is the standard we apply to every marketing site, dashboard, and web app we ship. If you want the same build quality on your product, that work sits under our",
      tail: "service, where the scope, timeline, and starting price are published before you talk to anyone.",
    },
    datePublished: "2025-01-15",
    dateModified: "2026-08-19",
  },
  "project-atlas": {
    title: "Project Atlas",
    category: "AI Automation",
    seoTitle: "Project Atlas: AI Automation Case Study",
    description:
      "A document processing pipeline that reads, classifies, and routes business paperwork automatically. Written up as a reference build.",
    metaDescription:
      "AI automation case study: a document processing pipeline that extracts, classifies, and routes documents in under 30 seconds. Architecture and tradeoffs.",
    disclosure:
      "Reference build. This describes the architecture and delivery approach we use for document automation, drawn from the engagements we run. It is not a named client engagement and the figures are our own measurements, not a client’s reported results.",
    problem:
      "This is the engagement we get asked about most, so we have written it up properly instead of leaving it abstract. The shape barely changes between companies.\n\nAn operations team receives documents in every format a business can produce. Supplier invoices as PDFs. Delivery notes photographed on a phone at an angle. Purchase orders pasted into the body of an email. Spreadsheets attached to a forwarded thread with no subject line. Somebody opens each one, reads it, types six to twenty fields into an internal system, decides which department owns it, and forwards it on. At forty hours a week across a team, that is a full-time salary spent retyping things a computer can already read.\n\nThe cost is not only the hours. Manual entry carries a steady error rate, and an error in invoice data becomes a payment dispute six weeks later, when nobody remembers the document. Throughput is capped by headcount, so the queue grows every time volume spikes and shrinks only when somebody works late.\n\nMost teams try a template-based OCR tool first. It works beautifully for the two suppliers whose layout never changes, and falls over on everything else. That is usually the point at which we get the call.",
    approach: [
      {
        heading: "One model for every document fails on cost and on trust",
        body: "The instinct is to point one large language model at every document and accept whatever comes back. That fails on cost and it fails on trust. We split the pipeline into stages so each document only pays for the processing it actually needs.",
      },
      {
        heading: "Three stages: classify, extract, verify",
        body: "Stage one is classification. It runs on a small, cheap model because deciding invoice against delivery note against contract is a narrow task and does not need a frontier model. Stage two is extraction, where a vision-capable model reads the page and returns structured JSON validated against a schema defined per document type. Stage three is verification. Every extracted field carries a confidence score, totals are recomputed from line items, dates are range-checked, and any document that fails a check goes to a human review queue instead of straight into the accounting system.",
      },
      {
        heading: "The review queue is what makes it usable",
        body: "That review queue is the decision that makes the whole thing usable. A pipeline claiming ninety-five percent accuracy with no way to catch the other five percent is worse than manual entry, because now the errors are invisible. We size the queue so a reviewer sees the ten percent of documents that genuinely need a human and never sees the ninety that do not.",
      },
      {
        heading: "Cost control is a design-time decision or it does not happen",
        body: "Cost control is the second decision, and it is made at design time or not at all. Prompt caching on the static schema portion. Batch processing for anything not time-sensitive. A hard per-document budget that alerts when one class of document starts costing more than it should.",
      },
    ],
    build: [
      {
        heading: "Ingestion: FastAPI in front, object storage underneath",
        body: "Python with FastAPI at the front, holding an ingestion endpoint plus connectors that poll a shared mailbox and a cloud storage folder. Documents land in object storage first and every stage after that reads by reference, so a retry never re-uploads a fifty-page scan.",
      },
      {
        heading: "Orchestration is a queue, not a chain of function calls",
        body: "Orchestration runs on a queue with idempotency keys rather than a chain of direct function calls. Document pipelines fail in unglamorous ways: a rate limit at the model provider, a corrupt PDF, a scan rotated ninety degrees, a supplier who changes their template without telling anyone. Every stage retries in isolation and every failure leaves the document in a state you can inspect. PostgreSQL holds the structured output with the raw model response stored beside it, which matters six months later when somebody asks why a field came out the way it did.",
      },
      {
        heading: "Extraction schemas and the eight-second review screen",
        body: "Extraction uses a vision model with a JSON schema per document type and a repair pass when validation fails. The review interface is a plain Next.js app: document on the left, extracted fields on the right, keyboard shortcuts to accept or correct. Reviewers clear a document in about eight seconds once the shortcuts are in their hands.",
      },
      {
        heading: "The hard part was multi-page documents",
        body: "The genuinely hard part was neither the model nor the infrastructure. It was multi-page documents, where one invoice runs across four separate scans and the page boundaries are nowhere near the document boundaries. Solving that took a stitching pass that groups pages by supplier, invoice number, and continuity of line items before extraction ever runs.",
      },
    ],
    result:
      "The figures below are what this architecture holds in our own testing. They are not a client’s reported numbers, and we will not present them as such.\n\nA pipeline of this shape takes a document from arrival to routed record in under thirty seconds, against the two to four hours a queue-based manual process typically takes. Straight-through processing settles around ninety percent on stable supplier layouts. Nine documents in ten reach the destination system with no human touching them, and the tenth arrives in a review queue with the uncertain fields already highlighted.\n\nPer-document model cost lands in the low single-digit cents once caching and batching are in place. That is the number that decides whether automation is worth doing at all, and it is the number most vendors will not put in writing. At ten thousand documents a month it is a rounding error against the salary cost it displaces.\n\nThe outcome an operations lead actually feels is none of the above. The queue stops being something anyone thinks about on a Monday. A volume spike stops meaning overtime. And the error rate becomes a number on a dashboard you can improve, rather than a surprise that shows up in a payment dispute.",
    tech: ["Python", "OpenAI", "FastAPI", "PostgreSQL", "AWS Lambda"],
    color: "#0f1923",
    accent: "#4A9EFF",
    placeholder: true,
    service: {
      href: "/services/ai-automation",
      anchor: "AI automation for document processing",
      lead: "If your team is retyping paperwork into a system, this is the pattern that removes it. The scope, the pricing bands, and the first-workflow timeline are all published on our",
      tail: "page. Not sure whether the problem is worth automating yet? Our AI consulting engagement answers that in two weeks for a fixed fee.",
    },
    datePublished: "2025-03-04",
    dateModified: "2026-08-19",
  },
  "pulse-mobile": {
    title: "Pulse Mobile",
    category: "Mobile App",
    seoTitle: "Pulse Mobile: React Native Case Study",
    description:
      "An offline-first health tracking app on React Native. One codebase, two stores, sync that survives a week with no signal.",
    metaDescription:
      "Mobile app case study: an offline-first React Native health tracker with conflict-free sync, HealthKit and Health Connect, and 60fps charts. Built in 8 weeks.",
    disclosure:
      "Reference build. This describes the architecture and delivery approach we use for cross-platform mobile apps. It is not a named client engagement, and the figures are measured on our own test devices rather than reported by a client.",
    problem:
      "Health tracking is one of the hardest consumer categories to get right on mobile, for a reason that has nothing to do with health. People use these apps in exactly the places where connectivity fails. A basement gym. An aeroplane. A trail. A hospital corridor.\n\nSo the app has to work with no network at all, then reconcile whatever happened offline against whatever the same person did on a second device, without losing an entry or quietly duplicating one. That is a distributed systems problem wearing a fitness tracker.\n\nThe second constraint is trust. A workout logged and then lost is not a minor bug. It is the reason someone deletes the app and does not come back, and they tell the review page why. Health data also carries a higher privacy bar than most consumer categories, so anything that leaves the device needs a defensible reason to be there and a clear place where the user agreed to it.\n\nThe third is reach. Building iOS first and Android six months later doubles the timeline and splits the product into two codebases that immediately start to drift. For a small team shipping an MVP in eight weeks, that is not a real option. This build starts from those three constraints rather than from a feature list.",
    approach: [
      {
        heading: "Offline-first is a data model decision, not a cache",
        body: "Offline-first is a data model decision, not a caching decision. Bolt a cache onto an app that assumes the network is there and you get an app that works right up until it does not. We start from the other end. The local database is the source of truth. The interface reads and writes locally only, never awaiting a network call, and sync is a background process the user never waits on.",
      },
      {
        heading: "Append-only events, aggregates derived on read",
        body: "That makes conflict resolution the central design question rather than an afterthought. Health entries are append-only events with a client-generated identifier and a device timestamp, so two devices writing while offline produce two records instead of one contested record. Aggregates such as daily step totals are derived on read, never stored as truth, which means a late-arriving entry recomputes the day rather than fighting a number already sitting in a column.",
      },
      {
        heading: "Where React Native is the right call, and where it is not",
        body: "React Native carries the cross-platform decision. It is the right call when an app is data and interface heavy, which this one is, and the wrong call when it lives on the camera or the GPU. We say that plainly during scoping, because the alternative is a client paying for a rewrite in year two. The two places React Native needed help here were the health integrations and the chart. Both were solved with native modules, not by abandoning the approach.",
      },
    ],
    build: [
      {
        heading: "SQLite on the device, Postgres behind it",
        body: "React Native with Expo and TypeScript in strict mode. SQLite on device behind a typed data layer, plus a change log table recording every local mutation and its sync state. Supabase supplies Postgres, auth, row level security, and a realtime channel for pushing changes to a second device.",
      },
      {
        heading: "A two-phase sync loop and the health integrations",
        body: "Sync is a two-phase loop. Push unsynced local changes with their client identifiers, then pull everything changed since the last cursor. On the server, row level security means a user can only ever read or write their own rows, so a bug in the client cannot become a data leak. Health integrations use HealthKit on iOS and Health Connect on Android through native modules, behind an explicit permission screen that names each data type and why it is read.",
      },
      {
        heading: "The chart had to leave JavaScript",
        body: "Charts were the one place the default toolkit gave out. A year of daily entries rendered through a JavaScript chart library dropped frames badly on mid-range Android, so the chart moved to Skia and now scrolls at sixty frames per second on a four-year-old device.",
      },
      {
        heading: "Time zones quietly corrupt every streak in the app",
        body: "The subtle problem was time zones. A run logged at 11pm in Berlin and the same run viewed from a flight over New York belong to different calendar days depending on how you store it, and getting that wrong quietly corrupts every streak in the app. Entries store an instant plus the originating zone, and every daily rollup is computed in the user’s current zone at read time.",
      },
    ],
    result:
      "These figures are measured on our own test devices. They are not a client’s reported metrics and we are not presenting them as such.\n\nCold start to interactive runs under two seconds on a mid-range Android. The app is fully usable with the network switched off, and a device that has been offline for a week reconciles in a few seconds once it reconnects. A year of entries scrolls at sixty frames per second on hardware from 2021.\n\nThe number a founder should care about is the timeline. One codebase, two stores, eight weeks to a build that testers can install from TestFlight and the Play internal track. The same scope built natively twice runs closer to sixteen weeks and leaves two codebases to maintain, which is a permanent tax on every feature that follows.\n\nWhat we would keep from this build is the append-only event model. It costs a little more effort in week one and removes an entire class of bug for the life of the app. What we would change is the permissions flow, which asked for every health data type at once. Requesting each type at the moment it is first needed converts far better, and it is a change worth making before launch rather than after the first cohort of reviews.",
    tech: ["React Native", "TypeScript", "Supabase", "Expo", "Skia"],
    color: "#1a0f23",
    accent: "#9B59B6",
    placeholder: true,
    service: {
      href: "/services/mobile-app-development",
      anchor: "React Native app development",
      lead: "Offline-first sync, native integrations, and a single codebase across iOS and Android are the default on every app we build. The engagement shape and timeline are published on our",
      tail: "page, including when we will tell you to go native instead.",
    },
    datePublished: "2025-05-20",
    dateModified: "2026-08-19",
  },
};

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return Object.keys(PROJECTS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS[slug];
  if (!project) return { title: "Not Found" };

  // The layout template turns this into "<seoTitle> | EdgeBrain Studios".
  // OpenGraph does not inherit that template, so the brand is appended once
  // here by hand — appending it to a title that already carried the brand is
  // what produced "… | EdgeBrain Studios | EdgeBrain Studios".
  return {
    title: project.seoTitle,
    description: project.metaDescription,
    alternates: {
      canonical: `/work/${slug}`,
    },
    openGraph: {
      title: `${project.seoTitle} | ${BRAND}`,
      description: project.metaDescription,
      url: `/work/${slug}`,
      type: "article",
    },
  };
}

function buildJsonLd(slug: string, project: CaseStudy) {
  const url = `${SITE}/work/${slug}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${url}#casestudy`,
        name: `${project.title} Case Study`,
        headline: `${project.title}: ${project.category} case study`,
        description: project.metaDescription,
        url,
        genre: "Case study",
        about: project.category,
        keywords: [
          project.category,
          ...project.tech,
          "software development case study",
          "EdgeBrain Studios",
        ].join(", "),
        inLanguage: "en",
        datePublished: project.datePublished,
        dateModified: project.dateModified,
        isPartOf: {
          "@type": "CollectionPage",
          "@id": `${SITE}/work#collection`,
          name: "EdgeBrain Studios Work",
          url: `${SITE}/work`,
        },
        // All three are the same company, and that company already has a node
        // in the graph (src/app/layout.tsx). Spelling it out three times with
        // no @id declared three anonymous Organizations per case study.
        author: { "@id": ORGANIZATION_ID },
        creator: { "@id": ORGANIZATION_ID },
        publisher: { "@id": ORGANIZATION_ID },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Work",
            item: `${SITE}/work`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: project.title,
            item: url,
          },
        ],
      },
    ],
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const project = PROJECTS[slug];
  if (!project) notFound();

  const slugs = Object.keys(PROJECTS);
  const currentIndex = slugs.indexOf(slug);
  const nextSlug = slugs[(currentIndex + 1) % slugs.length];
  const nextProject = PROJECTS[nextSlug];

  return (
    <>
      {/* `<` is escaped so no case-study string can terminate the block
          early. See src/app/layout.tsx. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildJsonLd(slug, project)).replace(
            /</g,
            "\\u003c"
          ),
        }}
      />
      <CaseStudyContent
        project={project}
        nextProject={{ slug: nextSlug, title: nextProject.title }}
      />
    </>
  );
}
