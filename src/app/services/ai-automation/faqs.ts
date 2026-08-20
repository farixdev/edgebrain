export const AI_AUTOMATION_FAQS = [
  {
    question:
      "Can AI automate invoice data extraction accurately enough to actually trust?",
    answer:
      "Yes, if you build for the exceptions instead of the average. We target 95 percent or better on straight-through processing for a stable supplier set, measured against a labelled test set of your real documents. The remaining documents route to a human with the extracted fields pre-filled. Accuracy is reported per field, not as one number.",
  },
  {
    question: "How long does an AI workflow automation project take?",
    answer:
      "A single production workflow takes 3 to 5 weeks from kickoff to live traffic. Multi-workflow platforms run 8 to 14 weeks and go live in stages, so the first automation is earning back its cost while we build the second. You get a working staging URL in week one and a weekly build you can test.",
  },
  {
    question: "Who owns the code, the prompts, and the extracted data?",
    answer:
      "You do, from the first commit. We work in your GitHub organisation or transfer the repository at handover. Prompts, evaluation sets, infrastructure config, and documentation are part of the deliverable. Your data stays in your cloud account and your database. We sign your NDA and MSA, or use ours if you prefer.",
  },
  {
    question: "What timezone overlap do we get with a team in Lahore?",
    answer:
      "We are UTC+5. That gives European clients a full working day of overlap, and US East Coast clients four hours from 9am ET. We hold one 30 minute call a week at a time that suits you, keep a shared Slack channel for everything else, and reply within your working day, not ours.",
  },
  {
    question: "Do we have to replace the tools we already use?",
    answer:
      "No. Most of our automation work sits between existing systems rather than replacing them. We read from and write to Salesforce, HubSpot, NetSuite, Zendesk, Airtable, Stripe, and internal APIs through their published interfaces. If a tool has no API, we automate around it with a queue and a small review step.",
  },
  {
    question:
      "What is the difference between an AI chatbot and an AI agent for business?",
    answer:
      "A chatbot answers. An agent acts. A chatbot for business support retrieves an answer and shows it to a person. An agent is given tools, so it can create the refund, update the CRM record, or reassign the ticket, then log what it did. Agents need permission boundaries and audit trails. Chatbots mostly need good retrieval.",
  },
];
