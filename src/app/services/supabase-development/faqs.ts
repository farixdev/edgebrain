/**
 * The single source for this route's FAQ copy.
 *
 * Rendered by content.tsx and declared as FAQPage in page.tsx, so the visible
 * answers and the structured data cannot drift. Edit here, never in either.
 *
 * FAQ rich results were retired in May 2026. This block stays because it still
 * helps AI search parse the page, not because it earns a SERP feature.
 */
export const SUPABASE_FAQS = [
  {
    question: "How do you make a Row Level Security policy fast?",
    answer:
      "Two things. Wrap the call in a scalar subquery — using (user_id = (select auth.uid())) — so Postgres evaluates it once per statement instead of once per row. Then index the column the policy filters on, because RLS is folded into your query as a WHERE clause rather than applied above it. TO authenticated lets anonymous requests skip evaluation entirely.",
  },
  {
    question: "Is Supabase production-ready, or will we outgrow it?",
    answer:
      "It is Postgres, so you outgrow it the way you outgrow any single-primary Postgres: multi-region writes, or analytics competing with the application for one instance. Neither arrives early. What kills projects sooner is treating it as a Firebase clone — no migration history, policies clicked into the dashboard, service_role used everywhere.",
  },
  {
    question: "Should we use Supabase Auth or a separate identity provider?",
    answer:
      "Supabase Auth when you want email, OAuth and magic links wired to your own tables cheaply. A dedicated provider such as Clerk or WorkOS when enterprise SSO or SCIM provisioning is on the roadmap. Either way, authentication is not authorisation: roles and membership belong in your schema, and the policies read them from there.",
  },
  {
    question: "Do we put logic in Edge Functions or Next.js route handlers?",
    answer:
      "Edge Functions when the code must deploy independently of the frontend: third-party webhooks whose URLs you do not want to re-point every release, scheduled jobs, work that belongs near the database. Route handlers when it shares your application's types, session and validation. Both is fine; both without a written rule produces two half-finished webhooks.",
  },
  {
    question: "Can pgvector handle production RAG, or do we need a vector database?",
    answer:
      "pgvector covers the large majority of application search, and keeping embeddings beside the rows they describe removes an entire class of sync bugs. Choose HNSW over IVFFlat unless index build time genuinely dominates, and measure recall against a labelled question set rather than judging it by feel. A dedicated store earns its place past tens of millions of vectors.",
  },
  {
    question: "What does a Supabase build cost?",
    answer:
      "We quote fixed scope against the published rate card once the schema and policy surface are understood. Platforms start at $18,000, MVPs at $14,000, and the minimum engagement is $2,500. Most projects land between $12,000 and $35,000. What moves the number is table count, how many roles the policies encode, and whether data is migrating in.",
  },
];
