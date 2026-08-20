export const WEB_DEV_FAQS = [
  {
    question: "How long does it take to build a web app in Next.js?",
    answer:
      "Three to four weeks for a marketing site on a headless CMS. Six to eight weeks for a SaaS MVP with authentication, billing, and a dashboard. The clock starts at kickoff, not at contract signing, and assumes design is finished or ours to produce. You get a staging URL in week one and a new build every week after.",
  },
  {
    question: "Can you migrate WordPress to Next.js without losing search rankings?",
    answer:
      "Yes, and the redirect map is most of the job. We crawl every indexed URL, map each one to its new route, and 301 anything that moves. Titles, canonical tags, and structured data are ported before launch, not patched after. The old site stays live until a crawl comparison passes. Expect rankings to settle within three weeks.",
  },
  {
    question: "Who owns the code and the intellectual property?",
    answer:
      "You do, from the first commit. We work inside your GitHub organisation where possible, or in ours with ownership transferred at handover. The contract assigns all IP to you and includes an NDA if you want one. No license fee, no retained component library you keep paying for, no hosting lock-in.",
  },
  {
    question: "How much timezone overlap do we get with a team in Lahore?",
    answer:
      "Four hours with the US East Coast and the full working day with Europe. Lahore is UTC+5. We hold 6pm to 10pm local, which is 9am to 1pm in New York and a normal morning in London. For West Coast teams we shift that window later. You get a shared Slack channel, not a ticket queue.",
  },
  {
    question: "What happens if the scope changes mid-build?",
    answer:
      "We quote fixed scope, so a change is a conversation rather than an invoice surprise. Small adjustments inside the same week get absorbed. Anything adding more than a day gets a written estimate before we touch it, and you approve or defer. A change log in the repo records what was added, what it cost, and what was cut.",
  },
  {
    question: "Do you work with our existing designer or design system?",
    answer:
      "Yes. Roughly half our web development work starts from Figma files we did not draw. We build to the tokens you already have, and we flag where a spec breaks on a 360px viewport or fails colour contrast before building it. If there is no design, we produce it, which adds a week to a marketing site and two to a product build.",
  },
];
