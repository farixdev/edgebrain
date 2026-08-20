export const AI_CONSULTING_FAQS = [
  {
    question: "Should we use fine-tuning or RAG for our business data?",
    answer:
      "Start with retrieval. Most fine-tuning requests are retrieval problems in disguise. Fine-tuning teaches a model a format or a tone, not facts that change weekly, and it pins you to a model version that will be deprecated. RAG keeps knowledge in a database you control, so correcting an answer means updating a row. Fine-tune later, for narrow high-volume tasks where a small open model needs to be cheap.",
  },
  {
    question: "How do we work out where AI will actually help our company?",
    answer:
      "Two filters remove most whiteboard ideas. First, how many hours a week does the manual step consume? Second, can the workflow tolerate an error rate above zero, or does a human check the output anyway? A task that runs 40 times a day with a reviewer at the end is a strong candidate. A task that runs twice a month and must be exact is not.",
  },
  {
    question: "Can you add AI features to our existing product without a rewrite?",
    answer:
      "Yes, and that is most of our work. We add a service alongside your current stack rather than inside it, expose it over an internal API, and integrate through your existing auth and data layer. Nothing in your application depends on a specific model vendor. First feature typically ships in five to eight weeks, with your team reviewing every pull request.",
  },
  {
    question: "How do you test an LLM feature before it goes live?",
    answer:
      "We build the evaluation set before the feature. That means 100 to 300 real inputs with graded expected outputs, split by category, run on every commit with a pass rate reported per category. Regressions show up in the diff, not in a support ticket. For open-ended outputs we combine deterministic checks with a grading model, and we audit the grader against human labels.",
  },
  {
    question: "Who owns the code, the prompts, and the model outputs?",
    answer:
      "You do. IP assigns to you on signature, before we write a line. That covers source code, prompts, eval sets, fine-tuned weights, and any synthetic data we generate. We work in your repository under your accounts wherever possible. We sign your NDA and MSA rather than asking you to sign ours, and we do not reuse client work in other projects.",
  },
  {
    question: "What does an AI proof of concept cost and how long does it take?",
    answer:
      "Between $8,000 and $18,000 over three to four weeks for a single use case running on your real data. The range moves on data access, how many source systems are involved, and your accuracy target. You get measured results and a projected monthly model spend, so the decision to continue is made on numbers rather than on a demo.",
  },
];
