"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { DURATION, EASE, viewportOnce } from "@/lib/motion";

const PRINCIPLES = [
  {
    title: "You get a build every week, not a status update.",
    body: "Every Friday you get a deployed staging URL you can click and break. Not a percentage in a spreadsheet. If a week produces nothing you can open, the week went wrong, and you hear that on Monday rather than in month two.",
  },
  {
    title: "You talk to the engineer writing your code.",
    body: "There is no account manager relaying your question and returning with a softened answer. You are in a shared Slack channel with the people on your project, and replies land inside your working day.",
  },
  {
    title: "Decisions get written down, not remembered.",
    body: "Every non-obvious choice lands in a one-page note in the repo: what we picked, what we rejected, what would make us change our mind. A year later, when a new developer asks why the queue exists, the answer is a file, not a person.",
  },
  {
    title: "Your repo and your cloud, from the first commit.",
    body: "We commit to your GitHub organisation and deploy into your Vercel, AWS, or GCP account. There is no handover event because you already hold everything. Stop working with us in week three and you keep every line.",
  },
  {
    title: "Scope changes get priced in daylight.",
    body: "Change requests are normal and we plan for them. Each one is quoted in hours and cost before we start it, so the budget moves visibly instead of becoming an uncomfortable conversation in week seven.",
  },
  {
    title: "We build the risky part first.",
    body: "The payment flow, the extraction accuracy, the sync that nobody has proven yet. Settings screens can wait. Bad news in week two is a schedule change. The same news in week six is a new project.",
  },
];

const GOOD_FIT = [
  "The build is roughly $7,000 to $50,000 and 4 to 8 weeks. That band is where a small senior team beats both cheaper and more expensive options.",
  "The requirements are still moving. We are most useful when there are product decisions left to make, not just a finished spec to type up.",
  "There is real manual work to remove. Document processing, data entry, ticket triage, anything a person repeats dozens of times a week.",
  "You want to own the result outright. Your repository, your cloud account, your API keys, your hosting bill.",
];

const BAD_FIT = [
  "Brand identity from scratch. We design product interfaces well. Naming, logo systems, and brand strategy are a different craft, and we will point you at people who do them properly.",
  "Builds under about $5,000. A good freelancer serves you better at that size, and we will tell you what to look for rather than stretch the scope.",
  "Staff augmentation by the seat. We take responsibility for outcomes, which stops being possible when we are three of fourteen people in a sprint we do not run.",
  "WordPress theme work, Shopify customisation, and CMS rescue jobs. Legitimate work. Not our work.",
  "Anything that has to launch next week. Compressed timelines produce exactly the software this studio was started to avoid.",
];

export function AboutPageContent() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      {/* Hero */}
      <Section variant="light" className="pt-40 lg:pt-48">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />
        <motion.p
          className="text-xs uppercase tracking-[0.2em] text-[var(--color-mute)] mb-4 font-medium"
          data-reveal="fade"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow }}
        >
          About us
        </motion.p>
        <motion.h1
          className="text-display-xl max-w-4xl mb-6"
          data-reveal="y30"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.1 }}
        >
          How we build, and what we{" "}
          <span className="text-[var(--color-yellow)]">turn down</span>.
        </motion.h1>
        <motion.p
          className="text-lg text-[var(--color-mute)] max-w-2xl leading-relaxed"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.2 }}
        >
          EdgeBrain Studios builds web apps, mobile apps, and AI automation for
          founders and product teams worldwide. Fixed scope, quoted before
          kickoff. A staging URL in week one. Most projects ship in 4 to 8
          weeks. This page is about how that runs; the studio&rsquo;s home
          market, the time-zone arithmetic and the contract mechanics live on{" "}
          <Link
            href="/software-development-lahore"
            className="underline underline-offset-4 decoration-[var(--color-mute)]/50 hover:decoration-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]"
          >
            software development in Lahore
          </Link>
          .
        </motion.p>
      </Section>

      {/* Why we exist */}
      <Section variant="dark" noise>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-4">
            <motion.p
              className="text-xs uppercase tracking-[0.2em] text-[var(--color-yellow)] mb-4 font-medium"
              data-reveal="fade"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow }}
            >
              Why we exist
            </motion.p>
            <motion.h2
              className="text-display-lg lg:sticky lg:top-32"
              data-reveal="y30"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow, delay: 0.1 }}
            >
              Built for the gap between a $15 freelancer and a $150 agency.
            </motion.h2>
          </div>

          <motion.div
            className="lg:col-span-8 space-y-7 text-base lg:text-lg text-[var(--color-offwhite)]/70 leading-relaxed"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.2 }}
          >
            <p>
              Almost every founder shopping for a build weighs the same two
              options. A marketplace freelancer at $15 to $30 an hour, where the
              price is right and the delivery risk is entirely yours. Or a
              Western agency at $120 to $180 an hour, where the code is usually
              fine and you also pay for an account manager, a six-week discovery
              phase, and an invoice five times the size. We started EdgeBrain
              because the option in the middle kept not existing. We take that
              choice apart properly in{" "}
              <Link
                href="/insights/in-house-vs-agency-vs-freelancer"
                className="underline underline-offset-4 decoration-[var(--color-offwhite)]/30 hover:decoration-[var(--color-offwhite)] transition-colors duration-[var(--duration-fast)]"
              >
                in-house vs agency vs freelancer
              </Link>
              , including the cases where hiring us is the wrong call.
            </p>
            <p>
              What we kept being called in to fix was rarely bad code. It was
              software that looked finished and was not. A dashboard that took
              eleven seconds to load once real data arrived. A mobile app
              rejected twice by app review over permissions nobody had read the
              rules on. An AI feature built in an afternoon that guessed wrong
              roughly 8 percent of the time and told nobody. That is not what
              cheap developers produce. It is what happens when nobody senior
              owns the unglamorous parts: indexes, error states, evaluation
              sets, the second launch.
            </p>
            <p>
              So the studio is built around the three things both alternatives
              stay vague about. Who writes the code: senior engineers only, no
              juniors billed at senior rates, no quiet subcontracting. What it
              costs: fixed scope, quoted in writing before kickoff, with the
              assumptions listed so you can see exactly what would move the
              number. When it lands: a staging URL in week one, a working build
              every week after that, live in 4 to 8 weeks.
            </p>
            <p>
              The AI work is what keeps this from being a commodity offshore
              pitch. We are not here to bolt a chatbot onto your marketing site.
              We build{" "}
              <Link
                href="/insights/automate-document-processing"
                className="underline underline-offset-4 decoration-[var(--color-offwhite)]/30 hover:decoration-[var(--color-offwhite)] transition-colors duration-[var(--duration-fast)]"
              >
                document processing pipelines
              </Link>
              , extraction systems, and agents that
              remove hours of repeated manual work each week, and we measure
              accuracy per field against your real documents before any of it
              touches production. That is the whole practice behind our{" "}
              <Link
                href="/services/ai-automation"
                className="underline underline-offset-4 decoration-[var(--color-offwhite)]/30 hover:decoration-[var(--color-offwhite)] transition-colors duration-[var(--duration-fast)]"
              >
                AI automation work
              </Link>
              , and it runs on the same engineering standards as everything else
              we ship.
            </p>
          </motion.div>
        </div>
      </Section>

      {/* How we work */}
      <Section variant="light">
        <div className="max-w-3xl mb-16">
          <motion.p
            className="text-xs uppercase tracking-[0.2em] text-[var(--color-mute)] mb-4 font-medium"
            data-reveal="fade"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow }}
          >
            How we work
          </motion.p>
          <motion.h2
            className="text-display-lg mb-6"
            data-reveal="y30"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.1 }}
          >
            Six rules, each one paid for by a project that went badly.
          </motion.h2>
          <motion.p
            className="text-lg text-[var(--color-mute)] leading-relaxed"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.2 }}
          >
            These are not values on a wall. They are the operating rules we work
            to on every engagement, and you can hold us to each one.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 mb-16">
          {PRINCIPLES.map((item, i) => (
            <motion.div
              key={item.title}
              className="border-t border-[var(--color-hairline-light)] pt-6"
              data-reveal="y20"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{
                duration: DURATION.slow,
                ease: EASE.standard,
                delay: (i % 2) * 0.08,
              }}
            >
              <h3 className="text-base lg:text-lg font-medium mb-3">
                {item.title}
              </h3>
              <p className="text-sm lg:text-base text-[var(--color-ink)]/70 leading-relaxed">
                {item.body}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="max-w-3xl space-y-6 text-base lg:text-lg text-[var(--color-ink)]/75 leading-relaxed"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.2 }}
        >
          <p>
            The first seven days are concrete. Day one you get repository
            access, a Slack channel, a staging URL that already deploys, and a
            written scope listing what is in, what is out, and what we assumed.
            By day three the data model and the two or three decisions that
            shape the build are agreed in writing. By day seven something real
            is running on that staging URL. It will be ugly, and it will still
            tell you more than a 40-page discovery document.
          </p>
        </motion.div>
      </Section>

      {/* Where we are and who we serve */}
      <Section variant="dark" noise>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-4">
            <motion.p
              className="text-xs uppercase tracking-[0.2em] text-[var(--color-yellow)] mb-4 font-medium"
              data-reveal="fade"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow }}
            >
              Lahore, working worldwide
            </motion.p>
            <motion.h2
              className="text-display-lg lg:sticky lg:top-32"
              data-reveal="y30"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow, delay: 0.1 }}
            >
              Where we sit is not what you are buying.
            </motion.h2>
          </div>

          <motion.div
            className="lg:col-span-8 space-y-7 text-base lg:text-lg text-[var(--color-offwhite)]/70 leading-relaxed"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.2 }}
          >
            <p>
              We are a software house in Lahore, and most of our clients have
              never been to Pakistan. Being a web development company in Lahore
              is why the pricing works. It is not the reason to hire us. Any
              software company in Lahore Pakistan that leads with its hourly
              rate is telling you where it thinks its ceiling is.
            </p>
            <p>
              The timezone question, answered properly. We are UTC+5. London,
              Berlin, and Dubai get a full working day of overlap with us. New
              York gets four hours from 9am ET, and we keep those hours for
              calls and live debugging instead of filling them with internal
              meetings. Sydney and the US West Coast are harder, and we say so
              before you sign rather than after. The cadence is one 30 minute
              call a week, a shared channel for everything else, and a written
              reply inside your working day. Hours of overlap are the easy part;{" "}
              <Link
                href="/insights/working-with-offshore-development-team"
                className="underline underline-offset-4 decoration-[var(--color-offwhite)]/30 hover:decoration-[var(--color-offwhite)] transition-colors duration-[var(--duration-fast)]"
              >
                working with an offshore development team
              </Link>{" "}
              turns on handover and access instead.
            </p>
            <p>
              Ownership and contracts, before you have to ask. You own the code,
              the designs, the prompts, and the data from the first commit,
              because that commit is already in your repository. We sign your
              NDA and your MSA, or provide ours if you would rather not draft
              one. Payment is 40 percent at kickoff and the balance on handover,
              split into milestones above $20,000. No license on the thing you
              paid us to build, and no retainer to remember to cancel.
            </p>
            <p>
              Then the question nobody puts in writing: what happens if it goes
              sideways. Fixed scope means a bad estimate is our problem, not
              your invoice. If we run late, you do not pay more. If two weeks in
              it is clear we are the wrong team, we stop, hand over everything
              built so far, and bill only completed work. Losing a project in
              week two costs us less than defending one in month four.
            </p>
            <p>
              Closer to home the work is identical. Teams hiring an app
              development company in Lahore for a React Native build. Operations
              leads looking for an AI company in Lahore to take manual
              processing off their team. Founders who want to hire developers in
              Pakistan without running a six-week recruitment process. Same
              scope document, same weekly builds, same senior engineers. The
              range is visible in{" "}
              <Link
                href="/work"
                className="underline underline-offset-4 decoration-[var(--color-offwhite)]/30 hover:decoration-[var(--color-offwhite)] transition-colors duration-[var(--duration-fast)]"
              >
                our published case studies
              </Link>
              .
            </p>
          </motion.div>
        </div>
      </Section>

      {/* Fit and not fit */}
      <Section variant="light">
        <div className="max-w-3xl mb-16">
          <motion.p
            className="text-xs uppercase tracking-[0.2em] text-[var(--color-mute)] mb-4 font-medium"
            data-reveal="fade"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow }}
          >
            Fit
          </motion.p>
          <motion.h2
            className="text-display-lg mb-6"
            data-reveal="y30"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.1 }}
          >
            We turn down a good share of what we are asked to build.
          </motion.h2>
          <motion.p
            className="text-lg text-[var(--color-mute)] leading-relaxed"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.2 }}
          >
            A studio that says yes to everything is telling you nothing. Here
            is the line in both directions, so you can decide before you spend
            an hour on a call.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <motion.h3
              className="text-display-sm mb-8"
              data-reveal="y20"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow }}
            >
              <span className="text-[var(--color-yellow)] mr-2">/</span>
              Worth a conversation
            </motion.h3>
            <div className="space-y-6">
              {GOOD_FIT.map((item, i) => (
                <motion.p
                  key={i}
                  className="border-t border-[var(--color-hairline-light)] pt-5 text-sm lg:text-base text-[var(--color-ink)]/75 leading-relaxed"
                  data-reveal="y20"
                  initial={false}
                  whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                  viewport={viewportOnce}
                  transition={{
                    duration: DURATION.slow,
                    ease: EASE.standard,
                    delay: i * 0.06,
                  }}
                >
                  {item}
                </motion.p>
              ))}
            </div>
          </div>

          <div>
            <motion.h3
              className="text-display-sm mb-8"
              data-reveal="y20"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow }}
            >
              <span className="text-[var(--color-mute)] mr-2">/</span>
              Not us, and we will say so
            </motion.h3>
            <div className="space-y-6">
              {BAD_FIT.map((item, i) => (
                <motion.p
                  key={i}
                  className="border-t border-[var(--color-hairline-light)] pt-5 text-sm lg:text-base text-[var(--color-mute)] leading-relaxed"
                  data-reveal="y20"
                  initial={false}
                  whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                  viewport={viewportOnce}
                  transition={{
                    duration: DURATION.slow,
                    ease: EASE.standard,
                    delay: i * 0.06,
                  }}
                >
                  {item}
                </motion.p>
              ))}
            </div>
          </div>
        </div>

        <motion.p
          className="max-w-3xl mt-16 text-base lg:text-lg text-[var(--color-ink)]/75 leading-relaxed"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.15 }}
        >
          Turning work away costs less than delivering it badly. If you are not
          sure which column you sit in, describe the project in a paragraph and
          we will tell you plainly, including when the honest answer is somebody
          else. What we do take on is set out across{" "}
          <Link
            href="/services"
            className="underline underline-offset-4 decoration-[var(--color-ink)]/30 hover:decoration-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]"
          >
            our software development services
          </Link>
          .
        </motion.p>
      </Section>

      {/* CTA */}
      <Section variant="yellow" className="py-24 lg:py-32">
        <div className="max-w-2xl mx-auto text-center">
          <motion.h2
            className="text-display-lg mb-6"
            data-reveal="y30"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow }}
          >
            Tell us what you are building.
          </motion.h2>
          <motion.p
            className="text-lg text-[var(--color-ink)]/70 mb-10 leading-relaxed"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ delay: 0.1, duration: DURATION.slow }}
          >
            One paragraph on the problem and roughly when you need it live. We
            come back with a scope, a price, and a start date inside two working
            days.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{
              delay: 0.15,
              duration: DURATION.slow,
              ease: EASE.standard,
            }}
          >
            <ButtonLink
              href="/contact"
              size="lg"
              className="bg-[var(--color-ink)] text-[var(--color-yellow)] before:bg-[var(--color-offwhite)] hover:text-[var(--color-ink)]"
            >
              <span>Start a project</span>
            </ButtonLink>
            <a
              href="tel:+923270944766"
              className="text-base font-medium underline underline-offset-4 decoration-[var(--color-ink)]/40 hover:decoration-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]"
            >
              +92 327 0944766
            </a>
          </motion.div>
        </div>
      </Section>
    </>
  );
}
