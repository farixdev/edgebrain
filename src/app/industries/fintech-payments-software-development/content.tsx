"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { DURATION, EASE, viewportOnce } from "@/lib/motion";

const linkLight =
  "underline underline-offset-4 decoration-[var(--color-ink)]/30 hover:decoration-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]";
const linkDark =
  "underline underline-offset-4 decoration-[var(--color-offwhite)]/40 hover:decoration-[var(--color-yellow)] hover:text-[var(--color-yellow)] transition-colors duration-[var(--duration-fast)]";

const SAQ_FORK = [
  {
    tag: "SAQ A",
    title: "Full redirect, or an iframe your origin never serves",
    body: "The customer lands on the processor page, or the card field lives inside a frame whose contents come entirely from the processor. Your servers never see a primary account number, and your origin does not affect the security of the transaction. v4.0.1 rebuilt SAQ A eligibility around precisely that attestation. Smallest control set, cheapest assessment, least control over how checkout looks and behaves.",
  },
  {
    tag: "SAQ A-EP",
    title: "Your page serves the script that touches the field",
    body: "Hosted fields, a tokenising SDK, a direct post. The PAN still bypasses your backend, but your origin ships the code around it, and that alone moves you. You inherit quarterly ASV scanning, penetration testing, a documented secure SDLC, and requirements 6.4.3 and 11.6.1: an authorised inventory of every script on the payment page plus tamper detection on it, both mandatory since 31 March 2025. Magecart is why those two exist.",
  },
  {
    tag: "SAQ D",
    title: "The PAN reaches your server",
    body: "You now store, process or transmit account data, and effectively all twelve requirement families apply. Requirement 3 by itself means PAN rendered unreadable at rest, documented key management with split knowledge and dual control, and sensitive authentication data — full track, card verification value, PIN blocks — never retained after authorisation, encrypted or not. Add segmentation testing, file integrity monitoring, internal and external scanning. Past roughly six million card transactions a year an SAQ is off the table entirely and a QSA writes a Report on Compliance.",
  },
];

const EUROPE = [
  {
    term: "Strong Customer Authentication",
    detail: "Two independent factors",
    body: "Knowledge, possession, inherence — any two, and compromising one must not compromise the other. That is an architecture constraint, not a checkout preference. An OTP delivered to the same device that already holds the authenticated session is a conversation you will end up having with your acquirer.",
  },
  {
    term: "Dynamic linking",
    detail: "Amount and payee bound to the code",
    body: "For remote payments the authentication code has to be dynamically linked to the specific amount and the specific payee, and a change to either invalidates it. Your authorisation request and your challenge payload have to agree, which is where partial captures and post-authorisation amount edits start to hurt.",
  },
  {
    term: "Exemptions",
    detail: "An actuarial bet, not a feature",
    body: "Low value, transaction risk analysis, trusted beneficiaries, recurring fixed amounts, merchant-initiated transactions. TRA thresholds hang off a reference fraud rate held by the payment service provider claiming them — the 100, 250 and 500 euro bands sit behind rates of 0.13, 0.06 and 0.01 percent. Chasing exemptions is betting that a number someone else measures stays where it is.",
  },
  {
    term: "AIS and PIS",
    detail: "A licence, not a library",
    body: "Account information and payment initiation are regulated roles. Acting as an AISP or a PISP requires authorisation or registration from a national competent authority. A software studio cannot supply that. You bring the permission or the agent arrangement, and we build against it.",
  },
  {
    term: "QWACs and QSealCs",
    detail: "The certificate stack nobody mentions",
    body: "Common and secure communication under the RTS runs on eIDAS certificates from a qualified trust service provider: a QWAC identifying you at the transport layer in mutual TLS, a QSealC sealing the message itself for non-repudiation. Your roles and your competent-authority identifier are carried inside the certificate. Renewal, revocation and role changes are operational work with a calendar attached, and every EU open-banking build hits it.",
  },
];

const PRICING = [
  {
    name: "Architecture and scope review",
    price: "from $3,500",
    time: "1 to 2 weeks",
    body: "The SAQ fork settled on paper before anyone writes checkout code, a cardholder data environment boundary drawn, a ledger schema, and the integration list with the painful ones flagged. Delivered as a document your assessor and your acquirer can both read.",
  },
  {
    name: "Payments platform build",
    price: "from $18,000",
    time: "10 to 20 weeks",
    body: "Ledger, idempotent write paths, webhook ingestion, reconciliation jobs, dispute workflow, and the admin and operations surfaces around them. Most projects across the studio land between $12,000 and $35,000; payments work sits in the upper half of that because the correctness bar is higher.",
  },
];

export function FintechPaymentsPageContent() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      {/* Hero */}
      <Section variant="light" className="pt-40 lg:pt-48">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Industries", href: "/industries" },
            { label: "Fintech & Payments" },
          ]}
        />
        <motion.p
          className="text-xs uppercase tracking-[0.2em] text-[var(--color-mute)] mb-4 font-medium"
          data-reveal="fade"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow }}
        >
          Industries &mdash; Fintech &amp; payments
        </motion.p>
        <motion.h1
          className="text-display-xl max-w-4xl mb-8"
          data-reveal="y30"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.1 }}
        >
          PCI scope is an architecture decision. You make it in week one.
        </motion.h1>
        <motion.p
          className="text-lg text-[var(--color-mute)] max-w-2xl mb-10 leading-relaxed"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.2 }}
        >
          A payments product gets expensive at the moment someone decides how the
          card field renders. That one choice sets which Self-Assessment
          Questionnaire you fall under, and the distance between SAQ A and SAQ D
          is roughly twenty controls against three hundred. This is PCI compliant
          app development written as engineering: the SAQ fork, a ledger that
          survives an audit, and what PSD2 actually demands of a European
          architecture. It is written from regulatory and engineering knowledge.
          We have no published fintech clients and we do not claim any.
        </motion.p>
        <motion.div
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.3 }}
        >
          <ButtonLink href="/contact" size="lg">
            <span>Scope a payments build</span>
          </ButtonLink>
        </motion.div>
      </Section>

      {/* The SAQ fork */}
      <Section variant="dark" noise>
        <div className="max-w-3xl mb-16">
          <motion.p
            className="text-xs uppercase tracking-[0.2em] text-[var(--color-yellow)] mb-4 font-medium"
            data-reveal="fade"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow }}
          >
            The fork
          </motion.p>
          <motion.h2
            className="text-display-lg mb-6"
            data-reveal="y30"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.1 }}
          >
            Three checkout architectures, three different companies.
          </motion.h2>
          <motion.p
            className="text-lg text-[var(--color-offwhite)]/60 leading-relaxed"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.2 }}
          >
            PCI DSS v4.0.1 has twelve requirement families. Which of them bind
            your engineering team is decided almost entirely by where the card
            number travels on its way to the processor.
          </motion.p>
        </div>

        <div className="space-y-0">
          {SAQ_FORK.map((row, i) => (
            <motion.div
              key={row.tag}
              className="border-t border-[var(--color-hairline-dark)] py-8 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8"
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
              <p className="md:col-span-2 text-sm font-medium text-[var(--color-yellow)] uppercase tracking-[0.15em]">
                {row.tag}
              </p>
              <h3 className="md:col-span-4 text-base lg:text-lg font-medium">
                {row.title}
              </h3>
              <p className="md:col-span-6 text-sm lg:text-base text-[var(--color-offwhite)]/60 leading-relaxed">
                {row.body}
              </p>
            </motion.div>
          ))}
          <div className="border-t border-[var(--color-hairline-dark)]" />
        </div>

        <motion.div
          className="max-w-3xl mt-14 space-y-6 text-base lg:text-lg text-[var(--color-offwhite)]/70 leading-relaxed"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.2 }}
        >
          <p>
            The position we take: never store a PAN. Scope reduction is a
            deliberate design goal from the first sprint rather than a clean-up
            in month nine, because scope spreads by accident. One debug line that
            logs a request body drags an entire logging cluster, its backups and
            everyone with read access into the cardholder data environment.
            Network segmentation is the cheapest control you will ever buy, and
            it is worth building before an assessor asks for it.
          </p>
          <p>
            Tokenisation is the same argument in different clothes. A token from
            your processor, or a network token from the scheme, keeps the card
            number somewhere you do not have to defend. Operating your own token
            vault is a decision to become a Level 1 service provider problem,
            with the scope, the assessment and the annual cost that implies.
            Some businesses genuinely need it. Most companies that build one
            wanted portability between processors, and could have bought that
            instead.
          </p>
        </motion.div>
      </Section>

      {/* Ledger */}
      <Section variant="light">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-4">
            <motion.p
              className="text-xs uppercase tracking-[0.2em] text-[var(--color-mute)] mb-4 font-medium"
              data-reveal="fade"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow }}
            >
              Money-movement correctness
            </motion.p>
            <motion.h2
              className="text-display-lg lg:sticky lg:top-32"
              data-reveal="y30"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow, delay: 0.1 }}
            >
              Your processor is not your system of record.
            </motion.h2>
          </div>

          <motion.div
            className="lg:col-span-8 space-y-7 text-base lg:text-lg text-[var(--color-ink)]/75 leading-relaxed"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.2 }}
          >
            <p>
              A balance is not a column. The moment a mutable integer represents
              what someone is owed, two concurrent writes will eventually
              disagree with the truth, and you find out at month end with no way
              to reconstruct what happened. Double entry is the only defensible
              model: every movement writes two or more entries that sum to zero
              within a currency, and the balance is derived by summing them.
              Entries are append-only. Nothing is updated or deleted, and a
              mistake is corrected by a compensating reversal that leaves both
              the error and the fix visible forever.
            </p>
            <p>
              Money is an integer in minor units with the currency stored beside
              it, and never a float. The exponent is not always two &mdash; JPY
              has none, KWD, BHD and JOD have three &mdash; so a hardcoded
              multiplication by one hundred is a bug waiting for its first
              customer in Tokyo. When you split an amount, allocate the remainder
              deliberately so the parts sum exactly to the whole, instead of
              rounding each share on its own and losing a unit per transaction.
              For anything cross-border, capture the FX rate, its source, its
              timestamp and the quote identity at the moment it applied.
              Authorisation-time rate and capture-time rate are different
              numbers, and the difference belongs in its own ledger account
              rather than quietly inside revenue.
            </p>
            <p>
              Every write path takes an idempotency key, stored with the response
              it produced and a unique constraint that makes a replay return the
              original result instead of moving money twice. Webhooks are
              at-least-once and arrive out of order, so exactly-once is an
              illusion you build on top of them: deduplicate on event identity,
              gate handlers on the object version rather than assuming arrival
              order is causal order, and re-fetch the object instead of trusting
              the payload. Authorisation, capture and settlement are three
              distinct states with their own timers, partial captures and
              expiries, and collapsing them into one boolean is the most common
              data-model mistake in this vertical.
            </p>
            <p>
              Then reconciliation, as a first-class scheduled job with alerting
              rather than a spreadsheet somebody opens in January. A three-way
              match between your ledger, the processor settlement file and the
              bank statement is the control that catches what every other control
              misses: fees you never modelled, a refund that landed twice,
              reserve holds, payout timing, a chargeback that silently reversed a
              transaction you still show as complete. It is unglamorous, it is
              the difference between a product and a liability, and it is the
              same engineering discipline behind{" "}
              <Link href="/services/web-development" className={linkLight}>
                our Next.js and TypeScript platform work
              </Link>
              .
            </p>
          </motion.div>
        </div>
      </Section>

      {/* Europe */}
      <Section variant="dark" noise>
        <div className="max-w-3xl mb-16">
          <motion.p
            className="text-xs uppercase tracking-[0.2em] text-[var(--color-yellow)] mb-4 font-medium"
            data-reveal="fade"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow }}
          >
            Europe
          </motion.p>
          <motion.h2
            className="text-display-lg mb-6"
            data-reveal="y30"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.1 }}
          >
            PSD2 is a set of build constraints, not a compliance chapter.
          </motion.h2>
          <motion.p
            className="text-lg text-[var(--color-offwhite)]/60 leading-relaxed"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.2 }}
          >
            If any of your payers sit in the EEA or the UK, four of these five
            rows change your data model and one of them changes your
            infrastructure. PSD3 and the Payment Services Regulation are still
            moving through the legislative process, and nothing here assumes a
            date for them.
          </motion.p>
        </div>

        <div className="space-y-0">
          {EUROPE.map((row, i) => (
            <motion.div
              key={row.term}
              className="border-t border-[var(--color-hairline-dark)] py-7 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8"
              data-reveal="y20"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{
                duration: DURATION.slow,
                ease: EASE.standard,
                delay: i * 0.05,
              }}
            >
              <h3 className="md:col-span-3 text-base font-medium">{row.term}</h3>
              <p className="md:col-span-3 text-sm text-[var(--color-yellow)]">
                {row.detail}
              </p>
              <p className="md:col-span-6 text-sm lg:text-base text-[var(--color-offwhite)]/60 leading-relaxed">
                {row.body}
              </p>
            </motion.div>
          ))}
          <div className="border-t border-[var(--color-hairline-dark)]" />
        </div>

        <motion.div
          className="max-w-3xl mt-14 space-y-6 text-base lg:text-lg text-[var(--color-offwhite)]/70 leading-relaxed"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.2 }}
        >
          <p>
            The card networks meet PSD2 through EMV 3-D Secure 2. Your 3DS server
            passes a large device and behaviour payload to the directory server,
            the issuer access control server decides frictionless or challenge,
            and a successfully authenticated transaction shifts fraud-dispute
            liability to the issuer. Read that last clause narrowly: the shift
            covers fraud reason codes, not a customer who says the goods never
            arrived. Building the challenge flow properly inside an app &mdash;
            the redirect, the return, the state that has to survive a
            backgrounded process &mdash; is real work, and it is the kind of
            thing{" "}
            <Link href="/services/mobile-app-development" className={linkDark}>
              our React Native and native mobile engineering
            </Link>{" "}
            has to get right on the first attempt rather than the third.
          </p>
        </motion.div>
      </Section>

      {/* Operational surface */}
      <Section variant="light">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-4">
            <motion.p
              className="text-xs uppercase tracking-[0.2em] text-[var(--color-mute)] mb-4 font-medium"
              data-reveal="fade"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow }}
            >
              The surface nobody scopes
            </motion.p>
            <motion.h2
              className="text-display-lg lg:sticky lg:top-32"
              data-reveal="y30"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow, delay: 0.1 }}
            >
              Onboarding, disputes, and the logs that outlive the payment.
            </motion.h2>
          </div>

          <motion.div
            className="lg:col-span-8 space-y-7 text-base lg:text-lg text-[var(--color-ink)]/75 leading-relaxed"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.2 }}
          >
            <p>
              KYC and AML onboarding is an asynchronous state machine, not a
              form. A customer sits in pending, then documents-requested, then
              vendor-review, then manual-review or approved, and the transitions
              arrive as callbacks hours or days later from an identity or
              screening provider. Model it as a state machine on day one, or
              retrofit one under pressure. Sanctions screening is not a
              signup-time check either: the OFAC, EU, UN and UK lists change, so
              the whole customer base is rescreened on a schedule, with every
              hit, disposition and reviewer recorded.
            </p>
            <p>
              Disputes are where missing data becomes money. Representment
              deadlines run in days, and the evidence that wins &mdash; device
              fingerprint, IP, address and card-verification results, delivery
              confirmation, the authentication outcome &mdash; can only come from
              fields captured at authorisation. If it was not logged then, the
              dispute is unwinnable, and you pay the transaction plus the fee.
              Audit logs outlive the transaction by years: PCI DSS wants twelve
              months retained with three immediately available and clocks
              synchronised across the estate, while EU anti-money-laundering
              record keeping runs to five years after the relationship ends.
              Those are two different clocks on the same data, and they have to
              be designed together.
            </p>
            <p>
              Transaction monitoring is the one place in this vertical where a
              model genuinely belongs, and also the one place where an
              unexplainable model is a regulatory problem rather than an
              engineering preference. A freeze or a decline is an adverse
              decision a customer can contest, so every alert needs a reason
              code, the feature attributions behind it, the model version, and a
              stored snapshot of the inputs, with a human review path attached.
              That is how we would build the pipeline in an{" "}
              <Link href="/services/ai-automation" className={linkLight}>
                AI automation engagement
              </Link>
              , and whether a model is even the right tool for a given alert
              class is what an{" "}
              <Link href="/services/ai-consulting" className={linkLight}>
                AI readiness assessment
              </Link>{" "}
              exists to answer before anyone writes a training pipeline.
            </p>
          </motion.div>
        </div>
      </Section>

      {/* Where not to build */}
      <Section variant="dark" noise>
        <div className="max-w-3xl">
          <motion.p
            className="text-xs uppercase tracking-[0.2em] text-[var(--color-yellow)] mb-4 font-medium"
            data-reveal="fade"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow }}
          >
            Where we would tell you not to build
          </motion.p>
          <motion.h2
            className="text-display-lg mb-8"
            data-reveal="y30"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.1 }}
          >
            Most companies asking for this should buy instead.
          </motion.h2>
          <motion.div
            className="space-y-6 text-base lg:text-lg text-[var(--color-offwhite)]/70 leading-relaxed"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.2 }}
          >
            <p>
              If payments are a feature of your product rather than the product,
              stop here. Take the hosted checkout, stay at SAQ A, and spend the
              engineering budget on the thing customers actually buy. That is a
              different job with{" "}
              <Link href="/services/stripe-integration" className={linkDark}>
                its own page on Stripe integration
              </Link>
              . This page is about being a payments product; that one is about a
              product that takes payments.
            </p>
            <p>
              If you need to issue cards or hold customer funds, that is a
              licence and a sponsor relationship before it is a codebase. Build
              on an issuer-processor or a banking-as-a-service provider rather
              than against a scheme directly. And if you are a lender writing a
              few hundred loans a month, a configured origination and servicing
              platform will beat a custom build on both cost and time. The honest
              version of that conversation is that we would rather integrate you
              into one than sell you a rewrite of it.
            </p>
            <p>
              What we cannot bring: EdgeBrain Studios is not a Qualified Security
              Assessor, not an Approved Scanning Vendor, and holds no PCI
              attestation, SOC 2 report or payments licence. Those come from your
              assessor, your scanning vendor, your acquirer and your regulator.
              What a software studio can do is make sure the architecture they
              assess is the small one rather than the large one, and that the
              evidence they ask for already exists. Treat any plan where
              compliance comes later as a rewrite scheduled for a date nobody has
              picked yet. If you are still deciding how to staff this,{" "}
              <Link
                href="/insights/in-house-vs-agency-vs-freelancer"
                className={linkDark}
              >
                our breakdown of in-house versus agency versus freelancer
              </Link>{" "}
              covers the tradeoff, and{" "}
              <Link href="/work" className={linkDark}>
                our published case studies
              </Link>{" "}
              show the engineering standard we hold ourselves to.
            </p>
          </motion.div>
        </div>
      </Section>

      {/* Cost */}
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
            Budget and timeline
          </motion.p>
          <motion.h2
            className="text-display-lg mb-6"
            data-reveal="y30"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.1 }}
          >
            What a payments build costs here.
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 mb-14">
          {PRICING.map((tier, i) => (
            <motion.div
              key={tier.name}
              className="border-t border-[var(--color-hairline-light)] pt-6"
              data-reveal="y20"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{
                duration: DURATION.slow,
                ease: EASE.standard,
                delay: i * 0.08,
              }}
            >
              <h3 className="text-base font-medium mb-2">{tier.name}</h3>
              <p className="text-display-sm mb-1">{tier.price}</p>
              <p className="text-xs uppercase tracking-[0.15em] text-[var(--color-mute)] mb-4 font-medium">
                {tier.time}
              </p>
              <p className="text-sm lg:text-base text-[var(--color-ink)]/70 leading-relaxed">
                {tier.body}
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
            Three things move the number. Which SAQ you land in, because A-EP
            adds scanning, testing and script controls to the build and D changes
            the shape of the company. How many currencies and corridors, since
            one currency is a ledger and four is a ledger plus an FX policy. And
            whether you are entering the EEA, where SCA, the certificate stack
            and open-banking interfaces are all real weeks of work. None of the
            assessment, scanning or licensing cost sits inside these numbers, so
            budget for it separately.{" "}
            <Link href="/insights/mvp-development-cost" className={linkLight}>
              Our breakdown of what an MVP actually costs
            </Link>{" "}
            explains how we build a number instead of guessing one.
          </p>
        </motion.div>
      </Section>

      {/* CTA */}
      <Section variant="yellow" className="py-28 lg:py-40">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            className="text-display-xl mb-8"
            data-reveal="y40"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slower, ease: EASE.standard }}
          >
            Decide the SAQ before you write the checkout.
          </motion.h2>
          <motion.p
            className="text-lg text-[var(--color-ink)]/70 mb-10 max-w-xl mx-auto leading-relaxed"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ delay: 0.15, duration: DURATION.slow }}
          >
            Tell us who moves money to whom, in which currencies, and under whose
            licence. We reply with a scope, the SAQ we think you land in, and a
            price inside two working days.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{
              delay: 0.2,
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
