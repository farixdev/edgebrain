/**
 * Home-page FAQ list.
 *
 * Kept in a plain (non-"use client") module for two reasons:
 *  1. The answers are long enough to work as featured snippets and AI-search
 *     citations, which content.json was not sized for.
 *  2. Server components can import it directly. Importing a constant out of a
 *     "use client" module gives a client reference, not the array, so the
 *     FAQPage JSON-LD on the home page must import from here.
 *
 * If you edit a question or an answer, the JSON-LD in src/app/page.tsx must
 * mirror it exactly.
 */
export const HOME_FAQS = [
  {
    question: "What does EdgeBrain Studios do?",
    answer:
      "We are an AI-native software studio in Lahore, Pakistan, working with clients worldwide. We build four things: web applications in Next.js and React, cross-platform mobile apps in React Native, AI automation that removes manual work, and AI integration consulting. Every engagement is fixed scope, quoted before kickoff, and built by senior engineers rather than juniors billed as seniors.",
  },
  {
    question: "How long does a typical project take?",
    answer:
      "Most builds ship in 4 to 8 weeks from kickoff. A marketing site on a headless CMS takes 3 to 4 weeks. A SaaS MVP with authentication, billing, and a dashboard takes 6 to 8 weeks. A cross-platform mobile MVP takes 6 to 9. You get a staging URL in week one and a new build every week after, so nothing waits until launch to be seen.",
  },
  {
    question: "How much does it cost to build an MVP?",
    answer:
      "A web MVP with authentication, billing, and a dashboard runs $18,000 to $35,000. A cross-platform mobile MVP runs $14,000 to $26,000. A marketing site starts at $6,000, and a single production AI workflow runs $7,000 to $15,000. We quote fixed scope before kickoff. Payment is 40% at kickoff, 40% at the midpoint build, and 20% at handover.",
  },
  {
    question: "Who owns the code and the intellectual property?",
    answer:
      "You do, from the first commit. We work inside your GitHub organisation where possible, or in ours with ownership transferred at handover. The contract assigns all IP to you. There is no license fee, no retained component library you keep paying for, and no hosting lock-in. You can hand the repo to another team the day after launch and nothing breaks.",
  },
  {
    question: "Do you sign NDAs?",
    answer:
      "Yes, before the first call if you prefer. We sign your NDA rather than insisting on our template, and we can usually return it the same day. Standard terms cover your code, your data, and the fact that you hired us at all. If you need us excluded from working with a named competitor for a set period, say so and we will put it in writing.",
  },
  {
    question:
      "How does the timezone gap work with an offshore team in Pakistan?",
    answer:
      "Lahore is UTC+5. We hold 6pm to 10pm local open every working day, which is 9am to 1pm in New York and a full working afternoon in London. West Coast teams get a later window. You get a shared Slack channel and a named engineer, not a ticket queue and a reply the following morning.",
  },
  {
    question: "Can you take over an existing codebase?",
    answer:
      "Often, yes. We start with a paid two-day audit: we read the repo, run it locally, and return a written list of what is safe to build on, what needs replacing, and what each option costs. Roughly a third of the takeovers we look at are worth continuing as they are. If a rebuild is cheaper than the rescue, we tell you that instead.",
  },
  {
    question: "What if we already have a designer?",
    answer:
      "Then we skip design and build to their file. About half our work starts from Figma we did not draw. We build to your existing tokens and components, and we flag anything that breaks at 360px or fails colour contrast before we build it, not after. If you have no designer, we produce the design, which adds a week to a site and two to a product build.",
  },
  {
    question: "What happens after launch?",
    answer:
      "You get 30 days of bug fixes at no cost, starting the day you go live. Before that we hand over the repo, the deployment pipeline, monitoring, and a recorded walkthrough for whoever inherits the system. After 30 days you can take it in-house or keep us on a retainer, from $1,800 a month for automation support and $4,000 a month for ongoing product work.",
  },
  {
    question: "What if the scope changes mid-build?",
    answer:
      "We quote fixed scope, so a change is a conversation rather than an invoice surprise. Small adjustments inside the same week get absorbed. Anything that adds more than a day gets a written estimate before we touch it, and you approve it or defer it. The repo carries a change log recording what was added, what it cost, and what was cut to make room.",
  },
];
