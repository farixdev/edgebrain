/**
 * The single source for this route's FAQ copy.
 *
 * Rendered by content.tsx and declared as FAQPage in page.tsx, so the visible
 * answers and the structured data cannot drift. Edit here, never in either.
 *
 * FAQ rich results were retired in May 2026. This block stays because it still
 * helps AI search parse the page, not because it earns a SERP feature.
 */
export const WP_MIGRATION_FAQS = [
  {
    question: "Will migrating from WordPress to Next.js lose my search rankings?",
    answer:
      "Not if the redirect map is derived from the live permalink structure rather than written by hand. Every indexed URL gets a mapped destination, including archives, paginated pages and feeds, and canonicals, metadata and structured data are ported before cutover rather than patched after. Expect two to three weeks of movement while Google recrawls. Sustained losses come from unmapped URLs, and those surface in the first 48 hours of redirect logging.",
  },
  {
    question: "Can I keep WordPress as the CMS after moving to Next.js?",
    answer:
      "Yes. Headless WordPress through WPGraphQL keeps your editors, your ACF fields and your existing content model, while Next.js renders the front end. You still run and patch PHP and MySQL, and wp-admin needs locking down harder once it is no longer the public face of the site. We recommend keeping it when the editorial workflow works and the theme layer is the actual problem.",
  },
  {
    question: "How long does a WordPress to Next.js migration take?",
    answer:
      "Four to six weeks for a content site with a clean permalink structure and a content model we lift across as it stands. Longer when the model is being rebuilt, when commerce or membership is involved, or when thousands of URLs need individual decisions rather than a rule. You get a staging URL by the end of week one and a new build every Friday after that.",
  },
  {
    question: "What happens to my WordPress plugins after the migration?",
    answer:
      "Every active plugin gets an entry in a replacement inventory before the contract is signed: what it does, what replaces it, and what has no replacement at all. Forms, sitemaps, redirects, caching and analytics have straightforward equivalents. Membership, LMS and deep WooCommerce logic usually do not, because that is application code rather than content, and it gets scoped and priced as a separate build.",
  },
  {
    question: "How do editors preview and publish once WordPress stops rendering the site?",
    answer:
      "We wire draft mode to a preview route so editors see unpublished changes on the real front end, and publishing fires a signed webhook that revalidates the affected routes. The failure mode is a webhook that quietly stops firing, which is indistinguishable from a broken CMS from the editor's chair, so build status gets surfaced in the place where they publish.",
  },
  {
    question: "How much does a WordPress to Next.js migration cost?",
    answer:
      "We quote against the published rate card once the site has been crawled: marketing sites start at $6,000, platforms at $18,000, and the minimum engagement is $2,500. Calculators that return a number from a six-field form are guessing. What moves the price is the count of URLs needing a decision, whether the content model is remodelled, the plugin surface, and whether design changes at the same time.",
  },
];
