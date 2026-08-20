/**
 * The single source for this route's FAQ copy.
 *
 * Rendered by content.tsx and declared as FAQPage in page.tsx, so the visible
 * answers and the structured data cannot drift. Edit here, never in either.
 *
 * FAQ rich results were retired in May 2026. This block stays because it still
 * helps AI search parse the page, not because it earns a SERP feature.
 */
export const PAYLOAD_FAQS = [
  {
    question: "What does a Payload CMS development agency do that a general Next.js developer does not?",
    answer:
      "The build is not the hard part. Payload will let you model almost anything, and that is the risk: schema decisions get made in week one and paid for over three years. The work worth hiring for is arguing collections against globals, capping the block inventory, settling localisation before the first field, and writing access control that returns query constraints rather than booleans.",
  },
  {
    question: "Should I run Payload on PostgreSQL or MongoDB?",
    answer:
      "Postgres if the content has real relationships and you want the database to enforce them. It builds a relational schema through Drizzle, so schema changes need migrations committed to the repo and run in CI. Mongo if the shapes are irregular and you would rather not run migrations at all, accepting that four years of documents may end up in three shapes.",
  },
  {
    question: "Does Payload 3 have to run inside my Next.js app?",
    answer:
      "That is the default and the main reason to choose it. Payload 3 installs into a route group in your App Router project, so the admin panel and the public site share a repo, a build and a deployment, and server components query the database in-process through the Local API. You can split the admin onto its own instance when scaling profiles diverge.",
  },
  {
    question: "Can I migrate an existing WordPress or Contentful site to Payload?",
    answer:
      "Yes, and the export is the easy half. Content usually has to be remodelled on the way in, because a page builder's single rich-text blob per page is not a content model and porting it faithfully just moves the problem. Migration is the only moment anyone will pay to fix the structure, so it gets scoped as remodelling with a redirect map attached.",
  },
  {
    question: "How much does a Payload CMS build cost?",
    answer:
      "We quote against the published rate card: marketing sites start at $6,000, platforms at $18,000, and the minimum engagement is $2,500. What moves the number is the size of the content model, whether localisation is in scope, how many roles the access layer expresses, whether existing content is remodelled, and whether the admin deploys separately from the front end.",
  },
  {
    question: "Why does my Payload admin list view get slow as content grows?",
    answer:
      "Usually access control. A read function returning a Where constraint is pushed into the database query and stays one indexed lookup. One returning a boolean is evaluated per document, and field-level access returns booleans only and runs per field per document, so ten restricted fields across twenty-five rows is 250 evaluations per page. Database calls inside those are an N+1.",
  },
];
