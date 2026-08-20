"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { DURATION, EASE, viewportOnce } from "@/lib/motion";

const LINK_LIGHT =
  "underline underline-offset-4 decoration-[var(--color-ink)]/30 hover:decoration-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]";
const LINK_DARK =
  "underline underline-offset-4 decoration-[var(--color-offwhite)]/30 hover:decoration-[var(--color-yellow)] transition-colors duration-[var(--duration-fast)]";

const SAFEGUARDS = [
  {
    cite: "§164.312(a)",
    name: "Access control",
    status: "Unique user ID and emergency access required. Automatic logoff and encryption at rest are addressable.",
    body: "Unique user identification is the one that cannot be retrofitted. A shared nurse-station login destroys every audit trail downstream of it, and no amount of later work reconstructs who read what.",
  },
  {
    cite: "§164.312(b)",
    name: "Audit controls",
    status: "Required. No addressable escape hatch.",
    body: "Record and examine activity in systems containing ePHI. Reads count, not just writes. That is a data-layer decision: a query interceptor or an outbox on every PHI-touching repository, written on day one or bolted on badly forever.",
  },
  {
    cite: "§164.312(c)",
    name: "Integrity",
    status: "Addressable mechanism to authenticate ePHI.",
    body: "Prove a record has not been altered or destroyed improperly. In practice this pushes toward append-only clinical history with versioned amendments, rather than an UPDATE that overwrites the previous observation.",
  },
  {
    cite: "§164.312(d)",
    name: "Person or entity authentication",
    status: "Required.",
    body: "Verify the person seeking access is who they claim to be. Session fixation, a reset flow that leaks account existence, or a JWT with no revocation path all fail this at the application layer, not the hosting layer.",
  },
  {
    cite: "§164.312(e)",
    name: "Transmission security",
    status: "Addressable integrity controls and encryption.",
    body: "Addressable does not mean optional. It means implement it, or document in writing why it is not reasonable and what equivalent measure you put in its place. Writing that memo credibly for transport encryption in 2026 is close to impossible.",
  },
];

export function HealthcareIndustryPageContent() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      {/* Hero */}
      <Section variant="light" className="pt-40 lg:pt-48">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Industries", href: "/industries" },
            { label: "Healthcare & Telehealth" },
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
          Healthcare &amp; telehealth
        </motion.p>
        <motion.h1
          className="text-display-xl max-w-4xl mb-8"
          data-reveal="y30"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.1 }}
        >
          HIPAA compliant app development, control by control.
        </motion.h1>
        <motion.p
          className="text-lg text-[var(--color-mute)] max-w-2xl mb-10 leading-relaxed"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.2 }}
        >
          This page is not a claim about healthcare clients. We have none
          published, and you should distrust any studio whose vertical page
          implies otherwise. What follows is what the HIPAA Security Rule and
          the interoperability standards demand of a system, decision by
          decision, and how we would build a telehealth product against them.
        </motion.p>
        <motion.div
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.3 }}
        >
          <ButtonLink href="/contact" size="lg">
            <span>Talk through an architecture</span>
          </ButtonLink>
        </motion.div>
      </Section>

      {/* The hosting lie */}
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
              Start here
            </motion.p>
            <motion.h2
              className="text-display-lg lg:sticky lg:top-32"
              data-reveal="y30"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow, delay: 0.1 }}
            >
              A BAA with AWS does not make your application compliant.
            </motion.h2>
          </div>

          <motion.div
            className="lg:col-span-8 space-y-7 text-base lg:text-lg text-[var(--color-offwhite)]/65 leading-relaxed"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.2 }}
          >
            <p>
              Almost every &ldquo;HIPAA-compliant hosting&rdquo; claim on the
              internet resolves to one artefact: a signed Business Associate
              Agreement with a cloud provider. That obligation is real and it
              sits at §164.308(b) &mdash; a covered entity may only disclose
              protected health information to a business associate under a
              written contract, and a subcontractor handling PHI needs one too.
              Your developer needs one. Your error tracker needs one. Your
              transactional email vendor needs one.
            </p>
            <p>
              But the agreement covers what the provider operates, which is
              infrastructure. Every major cloud publishes a list of
              HIPAA-eligible services and a shared responsibility model saying
              plainly that the customer owns the application. Row-level
              authorisation, audit logging on reads, session handling, what ends
              up in a log line &mdash; none of that is in scope for anybody but
              the team writing the code. You can run an entirely non-compliant
              application on perfectly compliant infrastructure, and most breach
              settlements read exactly like that.
            </p>
            <p>
              One term to strike from any proposal you receive:
              HIPAA-certified. There is no such accreditation. HHS certifies no
              vendor, no product and no development studio. What exists is
              third-party attestation against a framework &mdash; HITRUST CSF,
              or a SOC 2 Type II report scoped to the HIPAA criteria. We hold
              neither. If procurement requires one from your build partner, we
              are the wrong firm, and we would say so on the first call.
            </p>
          </motion.div>
        </div>
      </Section>

      {/* Technical safeguards */}
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
            Technical safeguards
          </motion.p>
          <motion.h2
            className="text-display-lg mb-6"
            data-reveal="y30"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.1 }}
          >
            §164.312, and which half you cannot retrofit.
          </motion.h2>
          <motion.p
            className="text-lg text-[var(--color-mute)] leading-relaxed"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.2 }}
          >
            Five standards. Some specifications are required, some are
            addressable, and the difference is widely misread as
            required-versus-optional. It is not. Addressable means assess it,
            implement it if reasonable, and document the equivalent alternative
            if you do not.
          </motion.p>
        </div>

        <div className="space-y-0 mb-16">
          {SAFEGUARDS.map((row, i) => (
            <motion.div
              key={row.cite}
              className="border-t border-[var(--color-hairline-light)] py-7 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8"
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
              <div className="md:col-span-3">
                <h3 className="text-base font-medium">{row.name}</h3>
                <p className="text-xs uppercase tracking-[0.15em] text-[var(--color-mute)] mt-1 font-medium">
                  {row.cite}
                </p>
              </div>
              <p className="md:col-span-4 text-sm text-[var(--color-ink)]/60">
                {row.status}
              </p>
              <p className="md:col-span-5 text-sm lg:text-base text-[var(--color-ink)]/75 leading-relaxed">
                {row.body}
              </p>
            </motion.div>
          ))}
          <div className="border-t border-[var(--color-hairline-light)]" />
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
            Sitting above all five is the minimum necessary standard, and it is
            the one that reshapes a schema. A role check at the route &mdash;
            is this user a clinician, yes, render the chart &mdash; satisfies
            nothing. Minimum necessary is a row-level and column-level question:
            this clinician, for this encounter, may see these fields of this
            patient, and the billing coder beside them may see the diagnosis
            codes but not the psychotherapy notes. That is Postgres row-level
            security or an equivalent policy layer in the data access path, plus
            a break-glass route that grants emergency access and screams about
            it in the audit log. Decided in week one it is a schema convention.
            Decided in month six it is a rewrite of every query, which is the
            same arithmetic we lay out in our piece on{" "}
            <Link href="/insights/rewrite-vs-refactor-legacy-app" className={LINK_LIGHT}>
              rewriting versus refactoring a legacy codebase
            </Link>
            .
          </p>
        </motion.div>
      </Section>

      {/* Interoperability */}
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
              Integration surface
            </motion.p>
            <motion.h2
              className="text-display-lg lg:sticky lg:top-32"
              data-reveal="y30"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow, delay: 0.1 }}
            >
              Reading a record out of Epic is an OAuth problem, not a database
              problem.
            </motion.h2>
          </div>

          <motion.div
            className="lg:col-span-8 space-y-7 text-base lg:text-lg text-[var(--color-offwhite)]/65 leading-relaxed"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.2 }}
          >
            <p>
              Hospitals still run on HL7 v2. Pipe-delimited segments, ADT
              messages announcing an admission, transfer or discharge, ORU
              messages carrying observation results, moving over MLLP on a port
              somebody opened in 2009. Interface engines like Mirth Connect,
              Rhapsody and Cloverleaf exist because every site profiles the
              standard differently, and the Z-segments a given hospital invented
              are load-bearing. If your plan says &ldquo;FHIR&rdquo; and the
              counterparty says &ldquo;we will send you an ADT feed&rdquo;, you
              have an interface engine in your architecture whether you budgeted
              for one or not.
            </p>
            <p>
              FHIR R4 is the better road, and the thing to understand about it
              is that it is a wire format, not a schema to mirror internally.
              Modelling your own database as Patient, Encounter, Observation and
              DocumentReference resources feels tidy for a fortnight and then
              punishes you, because FHIR is deliberately permissive: almost
              every field is optional, cardinalities are loose, and extensions
              carry what matters locally. Keep a normalised domain model of your
              own and treat FHIR as a boundary you validate on both sides.
            </p>
            <p>
              SMART on FHIR is how a third-party app gets authorised against an
              EHR, and the two launch modes are genuinely different products.
              EHR launch means a clinician opens your app from inside the chart;
              you receive a launch token, exchange it for an access token, and
              get launch context back &mdash; the patient and encounter already
              in focus. Standalone launch means the user starts at your app and
              picks an EHR, which puts patient selection and scope negotiation
              on you. Scopes are the fiddly part: patient/Observation.rs versus
              user/Patient.r versus system-level backend access with a signed
              JWT client assertion and no human present at all.
            </p>
            <p>
              Then the part no sprint plan survives. Registering an application
              with Epic&rsquo;s vendor programme or Oracle Health&rsquo;s
              equivalent, promoting it from sandbox to a real customer
              organisation, and getting that customer&rsquo;s IT department to
              enable it, is calendar time measured in months and it is not yours
              to compress. Build against the public sandboxes from day one and
              keep the registration queue off the critical path. The reason any
              of this is on offer is regulatory: the 21st Century Cures Act
              information-blocking rule is why patient-facing API access became
              table stakes rather than a differentiator.
            </p>
          </motion.div>
        </div>
      </Section>

      {/* How we would build it */}
      <Section variant="light">
        <div className="max-w-3xl mb-14">
          <motion.p
            className="text-xs uppercase tracking-[0.2em] text-[var(--color-mute)] mb-4 font-medium"
            data-reveal="fade"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow }}
          >
            Approach
          </motion.p>
          <motion.h2
            className="text-display-lg mb-6"
            data-reveal="y30"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.1 }}
          >
            How we would build a telehealth platform.
          </motion.h2>
        </div>

        <motion.div
          className="max-w-3xl space-y-7 text-base lg:text-lg text-[var(--color-ink)]/75 leading-relaxed"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.2 }}
        >
          <p>
            What follows is an illustration, not a description of delivered
            work. A telemedicine app architecture we would propose puts every
            PHI read behind a single data access layer that emits an audit event
            with actor, patient, purpose and timestamp to an append-only store
            the application role cannot delete. That store has to outlive the
            record it describes: when a record is amended or purged, the trail
            of who read it must remain, which means it cannot be a foreign key
            into the table it audits. Video runs through a HIPAA-eligible
            provider under a BAA rather than hand-rolled WebRTC, and clinical
            documents live in an object store with server-side encryption,
            deny-by-default policies and access logging turned on before the
            first upload, not after.
          </p>
          <p>
            The failure modes are boringly consistent, and three of them are
            logging bugs. PHI written into application logs and shipped to a
            third-party error tracker that has no BAA. Push-notification
            payloads carrying a patient name or an appointment reason, rendered
            on a lock screen by an operating system nobody in your compliance
            scope controls &mdash; the fix is a content-free ping and a fetch
            after unlock, a decision that belongs in the{" "}
            <Link href="/services/mobile-app-development" className={LINK_LIGHT}>
              mobile app architecture
            </Link>{" "}
            rather than patched later. Video-consult recordings landing in an
            unaudited bucket because a convenience feature shipped ahead of the
            retention policy. And session tokens with no server-side revocation,
            so a lost device stays authenticated for the life of the JWT.
          </p>
          <p>
            The clinician and patient surfaces themselves are ordinary product
            engineering, built the way we build any{" "}
            <Link href="/services/web-development" className={LINK_LIGHT}>
              Next.js web application
            </Link>{" "}
            &mdash; server components, a typed data layer, and real
            accessibility work, because a portal that fails keyboard navigation
            fails a meaningful share of the people it exists for. How we write
            up scope and tradeoffs is visible in{" "}
            <Link href="/work" className={LINK_LIGHT}>
              the builds we have published
            </Link>
            .
          </p>
        </motion.div>
      </Section>

      {/* AI on PHI */}
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
            AI on clinical data
          </motion.p>
          <motion.h2
            className="text-display-lg mb-8"
            data-reveal="y30"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.1 }}
          >
            De-identification is harder than your budget assumes.
          </motion.h2>
          <motion.div
            className="space-y-7 text-base lg:text-lg text-[var(--color-offwhite)]/65 leading-relaxed"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.2 }}
          >
            <p>
              Routing PHI to a language model is a disclosure. It requires an
              endpoint covered by a BAA with zero-retention terms in writing.
              The consumer tier of most model APIs is not that endpoint; the
              enterprise and cloud-hosted tiers generally are. Read the
              contract, not the marketing page.
            </p>
            <p>
              The tempting alternative is to de-identify first and then use
              anything. Safe Harbor at §164.514(b) lists eighteen identifiers
              that must be stripped, including all dates more precise than a
              year and any age above 89. On structured fields that is
              tractable. On free-text clinical notes it is a genuinely hard
              extraction problem, because the identifiers arrive as
              &ldquo;saw Dr Okafor at the Riverside clinic on the 14th&rdquo;
              buried in a paragraph, and one missed name means the dataset was
              never de-identified at all. Budget it as its own project with its
              own evaluation set, the way we treat every extraction pipeline in
              our{" "}
              <Link href="/services/ai-automation" className={LINK_DARK}>
                document processing automation work
              </Link>
              . Before any of it, an{" "}
              <Link href="/services/ai-consulting" className={LINK_DARK}>
                AI readiness assessment
              </Link>{" "}
              is the cheaper way to find out whether the use case survives
              contact with the constraints and the unit economics.
            </p>
          </motion.div>
        </div>
      </Section>

      {/* Do not build / pricing */}
      <Section variant="light">
        <div className="max-w-3xl mb-14">
          <motion.p
            className="text-xs uppercase tracking-[0.2em] text-[var(--color-mute)] mb-4 font-medium"
            data-reveal="fade"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow }}
          >
            When not to hire us
          </motion.p>
          <motion.h2
            className="text-display-lg mb-6"
            data-reveal="y30"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.1 }}
          >
            Most clinics should buy, not build.
          </motion.h2>
        </div>

        <motion.div
          className="max-w-3xl space-y-7 text-base lg:text-lg text-[var(--color-ink)]/75 leading-relaxed"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.2 }}
        >
          <p>
            If what you need is scheduling, charting, e-prescribing, claims and
            a patient portal for a practice, buy a vertical SaaS. Athenahealth,
            DrChrono and SimplePractice already carry the certified EHR module,
            the
            clearinghouse relationships, the prescribing integrations and the
            compliance paperwork, and no custom build at any budget we would
            quote reaches parity. The same goes for video: buy a HIPAA-eligible
            telehealth vendor rather than commissioning WebRTC infrastructure.
          </p>
          <p>
            Custom earns its place when the workflow is the product and no
            vendor sells it &mdash; a remote monitoring pathway, a specialist
            triage tool, a payer-side data product, an app that has to sit on
            top of an EHR through SMART on FHIR rather than replace one. That is
            the honest boundary, and it is the same one we draw in{" "}
            <Link href="/insights/in-house-vs-agency-vs-freelancer" className={LINK_LIGHT}>
              choosing between in-house, an agency and a freelancer
            </Link>
            .
          </p>
          <p>
            On budget, our published bands apply here without a healthcare
            surcharge: platforms from $18,000, mobile from $9,000, MVPs from
            $14,000, AI pilots from $2,500. What moves the number inside those
            bands is integration count and audit surface, not the word HIPAA.
            One SMART on FHIR connection to a sandbox is a few weeks. Three EHR
            vendors, an HL7 v2 feed and a de-identified analytics path is a
            different project, which is why we scope before quoting.
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
            Send us the architecture question.
          </motion.h2>
          <motion.p
            className="text-lg text-[var(--color-ink)]/70 mb-10 max-w-xl mx-auto leading-relaxed"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ delay: 0.15, duration: DURATION.slow }}
          >
            Tell us which systems you have to talk to and who is allowed to see
            what. We will come back with a scope, a price and the parts we think
            you should buy instead.
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
              <span>Start a conversation</span>
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
