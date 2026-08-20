export const N8N_FAQS = [
  {
    question: "What does it cost to hire n8n developers?",
    answer:
      "The same published rates as the rest of our automation work. AI pilots start at $2,500, one production workflow starts at $7,000, and ongoing support starts at $1,800 a month. What moves the number is integration surface. A documented REST API with sane pagination is a day of work. A legacy SOAP endpoint with a PDF spec is a week. Scope and price are fixed before kickoff.",
  },
  {
    question: "Should we self-host n8n or pay for n8n Cloud?",
    answer:
      "Self-host when the data legally cannot leave your network, when you need worker capacity you control, or when execution volume makes per-execution pricing hurt. Otherwise Cloud is cheaper than it looks once you count the hours somebody spends patching containers and watching the execution table grow. Self-hosting is an operational commitment, not a licence saving.",
  },
  {
    question: "Do we actually need a custom n8n node?",
    answer:
      "Usually not. The HTTP Request node with a generic credential will talk to your internal API today and costs nothing to maintain. A custom node earns its place in three cases: non-engineers have to use the integration, the auth or pagination is fiddly enough that repeating it across a dozen workflows is a liability, or you want it callable as a tool by an AI agent.",
  },
  {
    question: "Is n8n better than Zapier for production workflows?",
    answer:
      "For anything with branching, retries, or real logic, yes. Zapier bills per task, so a thirty-step automation costs thirty tasks every run. n8n bills per execution, and self-hosted it bills nothing. The tradeoff is operations. Zapier stays up without you. Self-hosted n8n stays up because somebody owns the database, the queue, and the upgrades.",
  },
  {
    question: "Who owns the workflows after handover?",
    answer:
      "You do. Workflow JSON lives in your repository, n8n runs in your cloud account under your credentials, and the encryption key sits in your secret manager. There is no wrapper, no proprietary node you keep licensing from us, and no hosting arrangement you cannot exit. If you stop working with us tomorrow, everything keeps running.",
  },
  {
    question: "What happens when a workflow fails at 3am?",
    answer:
      "Every workflow we ship has a designated error workflow, retry with backoff on anything network-bound, and error output branches on the steps that fail predictably. Failures land in a queue with the original payload attached, so a run can be replayed once the upstream system recovers rather than reconstructed by hand from a log line.",
  },
];
