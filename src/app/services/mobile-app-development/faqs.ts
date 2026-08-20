export const MOBILE_APP_FAQS = [
  {
    question: "How much does mobile app development cost for a startup?",
    answer:
      "A cross-platform MVP built from scratch runs $14,000 to $26,000 and ships in six to nine weeks. Adding a mobile client to a product whose API already exists starts around $9,000. Offline sync, Bluetooth hardware, and in-app purchases are the three features that move the number most. We quote fixed scope before kickoff, not after a discovery phase.",
  },
  {
    question: "Should we build in React Native or Flutter?",
    answer:
      "React Native for most products, because you keep sharing TypeScript, validators, and a hiring pool with your web team. Flutter when pixel-identical rendering across every Android device matters more than that sharing, or when your team already writes Dart. Neither is right for custom camera pipelines or ARKit scene work, which want native Swift and Kotlin.",
  },
  {
    question: "Can you turn our website or SaaS into a mobile app?",
    answer:
      "Yes, and not by wrapping it in a WebView. Apple rejects repackaged websites under guideline 4.2, and users notice the scroll behaviour immediately. We consume your existing API, build real native screens for the three or four workflows people actually perform on a phone, and add push notifications and offline reads. That work usually takes four to six weeks.",
  },
  {
    question: "Do you handle App Store and Google Play submission?",
    answer:
      "Both, including the first rejection. We prepare screenshots at every required size, write the privacy nutrition labels and the Play data safety form, configure TestFlight and internal testing tracks, and submit under your developer accounts. Apple review typically returns in 24 to 48 hours. If it comes back rejected, we respond and resubmit at no extra cost.",
  },
  {
    question: "Who owns the code, the IP, and the developer accounts?",
    answer:
      "You do, from the first commit. The repository lives in your GitHub organization and we work inside it as collaborators. The Apple Developer and Google Play accounts are registered to your company, so signing certificates and release keys never sit with us. IP assignment is written into the contract. We sign your NDA or ours, whichever you prefer.",
  },
  {
    question:
      "How much timezone overlap do we get with a development team in Lahore?",
    answer:
      "Lahore is UTC+5. That gives you roughly five working hours of overlap with London and three with New York mornings, and we schedule the standup inside your window rather than ours. Async is the default regardless. You get a shared Slack channel, a TestFlight build every Friday, and a written update waiting before your day starts.",
  },
];
