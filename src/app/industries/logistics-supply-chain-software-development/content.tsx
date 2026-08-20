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
  "underline underline-offset-4 decoration-[var(--color-offwhite)]/40 hover:decoration-[var(--color-yellow)] transition-colors duration-[var(--duration-fast)]";

const TRANSACTIONS = [
  {
    code: "204",
    name: "Motor carrier load tender",
    body: "The shipper offers a load. Every reference number the rest of the lifecycle depends on — shipment ID, stop sequence, appointment windows — is set here and never renegotiated cleanly afterwards.",
  },
  {
    code: "990",
    name: "Response to a load tender",
    body: "Accept or decline. The window is measured in minutes, so the decline path has to be automated or a dispatcher becomes the rate limiter for your entire network.",
  },
  {
    code: "214",
    name: "Shipment status message",
    body: "The status feed, carrying codes such as AF for departed pickup and X1 for arrived at the delivery location. Your customer-facing tracking page is mostly a rendering of 214 traffic.",
  },
  {
    code: "856",
    name: "Advance ship notice",
    body: "A nested hierarchy: shipment, order, pack, item. Build the HL loop wrong and the receiving dock rejects the whole ASN, which in retail comes back as a chargeback rather than an error message.",
  },
  {
    code: "810",
    name: "Invoice",
    body: "Where the money is. It has to reconcile against the tender, the rate confirmation and every accessorial applied after the truck left. That reconciliation is the line item nobody budgets for.",
  },
  {
    code: "997",
    name: "Functional acknowledgement",
    body: "The only document that tells you whether any of the previous six actually landed. Unreconciled 997s are the classic silent failure: you believe you shipped, the partner has no record, you find out at month end.",
  },
];

const FIELD = [
  {
    group: "Offline write queue",
    items: "SQLite, operation log, server authority",
    why: "Sync an append-only log of intents, not rows. Rows lose the reason a change happened; a log lets you replay a scan, a status change and a signature in the order the driver performed them.",
  },
  {
    group: "Conflict resolution",
    items: "Per-field merge, monotonic sequence",
    why: "Last-writer-wins quietly destroys data when a dispatcher edits a stop the driver just completed. Merge per field, and treat driver-captured facts as authoritative over office-entered plans.",
  },
  {
    group: "Background location",
    items: "iOS Always, Android foreground service",
    why: "iOS re-prompts on the Always permission and downgrades silently. Android Doze, standby buckets and OEM battery managers on Xiaomi, Huawei and Samsung kill naive trackers with no crash and no log.",
  },
  {
    group: "Geofencing",
    items: "20 regions on iOS, 100 on Android",
    why: "Platform caps, not suggestions. With docks clustered inside a few hundred metres and GPS drift between buildings, a raw geofence entry needs a dwell time and a speed gate before it is allowed to move a shipment status.",
  },
  {
    group: "Proof of delivery",
    items: "Signature, photo, resumable upload",
    why: "Capture has to complete with the radio off. Compress on device, queue media separately from metadata, and store a device timestamp alongside a server timestamp, because drivers do change device clocks.",
  },
  {
    group: "Telematics ingest",
    items: "Positions, fault codes, duty events",
    why: "Five hundred vehicles pinging every thirty seconds is roughly 1.4 million position rows a day. That is an ingest and storage problem long before it is a mapping problem.",
  },
];

const REGS = [
  {
    group: "FMCSA ELD mandate",
    items: "49 CFR Part 395, Appendix A",
    why: "If your app records duty status it is an electronic logging device, and it must be self-certified against the published technical specification and registered on the FMCSA list. Most builds should read hours from an already-registered provider instead of becoming one.",
  },
  {
    group: "Hours of service",
    items: "11-hour drive, 14-hour window, 30-minute break",
    why: "Planning constraints as much as compliance rules. A route plan that ignores the 14-hour window and the 60 or 70-hour cycle produces schedules dispatchers cannot legally run.",
  },
  {
    group: "Records of duty status",
    items: "Six-month retention, 49 CFR 395.8(k)",
    why: "Retention is an architecture decision. Duty records and their supporting documents have to survive device loss, driver turnover and your own data-pruning job.",
  },
  {
    group: "Customs and export filing",
    items: "ACE, ISF 10+2, AES",
    why: "Importer Security Filing data is due before vessel lading, not before arrival, so the system has to hold commercial-party and container-stuffing detail far earlier in the flow than a domestic-only build ever would.",
  },
  {
    group: "Hazardous materials",
    items: "49 CFR Part 172",
    why: "Shipping papers and emergency response information must physically accompany the load. A digital bill of lading is an addition to the paper in the cab, never a replacement for it.",
  },
  {
    group: "Food transport",
    items: "FSMA sanitary transportation, 21 CFR Part 1 Subpart O",
    why: "Written procedures, precooling and temperature records, and defined retention periods. Cold-chain telemetry stops being a dashboard and becomes an evidentiary record you must be able to produce.",
  },
  {
    group: "Pharmaceutical distribution",
    items: "DSCSA, EPCIS, GS1 identifiers",
    why: "Unit-level serialisation and interoperable EPCIS event exchange between trading partners, plus authorised-trading-partner verification. Software does not confer that status on anyone; the licence does.",
  },
  {
    group: "Driver personal data",
    items: "GDPR lawful basis, works council agreements",
    why: "Continuous location is personal data about an identifiable employee. In Germany that means agreement with the works council before rollout, and everywhere it means retention minimisation and a documented purpose.",
  },
];

const PRICING = [
  {
    name: "Integration readiness sprint",
    price: "from $3,500",
    time: "1 to 2 weeks",
    body: "We map the real integration surface: which partners are on EDI and which are on APIs, which carrier contracts you hold, what your WMS or ERP will and will not expose, and where the data model already contradicts itself. You get a written architecture and a build estimate.",
  },
  {
    name: "Proof of concept",
    price: "from $8,000",
    time: "3 to 4 weeks",
    body: "One end-to-end slice running against real data. Usually a live 204 to 990 to 214 loop with a single trading partner, or rate shopping and label generation across two carriers, so the risky part is proven before the platform is scoped.",
  },
  {
    name: "Platform build",
    price: "from $18,000",
    time: "10 to 16 weeks",
    body: "The API-first core, the translation layer at the boundary, the operational dashboards and the position store. Engagements of this shape typically land between $12,000 and $35,000 depending on how many partners and carriers are in scope.",
  },
  {
    name: "Driver or warehouse app",
    price: "from $9,000",
    time: "6 to 10 weeks",
    body: "Offline-first React Native, local queue, background location, scanning and proof-of-delivery capture. Priced separately because the sync layer is the expensive component and it deserves its own estimate.",
  },
];

export function LogisticsIndustryContent() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      {/* Hero */}
      <Section variant="light" className="pt-40 lg:pt-48">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Industries", href: "/industries" },
            { label: "Logistics & Supply Chain" },
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
          Logistics &amp; supply chain
        </motion.p>
        <motion.h1
          className="text-display-xl max-w-4xl mb-8"
          data-reveal="y30"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.1 }}
        >
          Logistics software is an integration problem wearing a UI.
        </motion.h1>
        <motion.p
          className="text-lg text-[var(--color-mute)] max-w-2xl mb-10 leading-relaxed"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.2 }}
        >
          The dashboard is the easy part. The hard part is that your largest
          customer sends an EDI 856 through a value-added network older than most
          of your engineers, your carrier rates arrive from three REST APIs that
          disagree about what a valid address is, and your driver is in a dead
          zone holding a signed proof of delivery on a phone with no bars. That
          is what custom logistics software development actually has to solve.
        </motion.p>
        <motion.div
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.3 }}
        >
          <ButtonLink href="/contact" size="lg">
            <span>Scope your integration surface</span>
          </ButtonLink>
        </motion.div>
      </Section>

      {/* The integration surface — EDI */}
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
            The integration surface
          </motion.p>
          <motion.h2
            className="text-display-lg mb-6"
            data-reveal="y30"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.1 }}
          >
            EDI is not legacy trivia. It is the contract.
          </motion.h2>
          <motion.div
            className="space-y-6 text-base lg:text-lg text-[var(--color-offwhite)]/60 leading-relaxed"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.2 }}
          >
            <p>
              ANSI X12 is a living standard in North American freight, and
              UN/EDIFACT messages such as IFTMIN and IFTSTA are the same story in
              Europe and Asia. Documents travel inside a three-level envelope:
              ISA for the interchange, GS for the functional group, ST for the
              transaction set, each with its own control number and matching
              trailer. Those control numbers are not ceremony. They are how you
              prove a file arrived, and how you avoid processing the same
              interchange twice when a partner replays it.
            </p>
            <p>
              The honest architecture is an API-first core with an EDI
              translation layer at the boundary. Your domain model should be
              clean JSON and typed events; X12 should exist only inside an
              adapter, because the shipper on the other end is not migrating to
              your REST API for you. That same boundary carries warehouse
              traffic: a 940 shipping order out, a 945 shipping advice back, a
              947 inventory adjustment when the count disagrees with the system.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 mb-14">
          {TRANSACTIONS.map((item, i) => (
            <motion.div
              key={item.code}
              className="border-t border-[var(--color-hairline-dark)] pt-6"
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
              <p className="text-display-sm text-[var(--color-yellow)] mb-1">
                {item.code}
              </p>
              <h3 className="text-base lg:text-lg font-medium mb-3">
                {item.name}
              </h3>
              <p className="text-sm lg:text-base text-[var(--color-offwhite)]/60 leading-relaxed">
                {item.body}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="max-w-3xl text-base lg:text-lg text-[var(--color-offwhite)]/60 leading-relaxed"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.2 }}
        >
          Transport matters as much as the payload. A value-added network is a
          mailbox you poll, with per-character billing and a support queue. AS2
          is a direct HTTP exchange with signed receipts, which is faster and
          cheaper right up until a certificate expires at 2am and both sides stop
          talking without raising an alarm. Whichever you use, treat
          acknowledgement latency as a monitored metric in its own right.
        </motion.p>
      </Section>

      {/* Carriers, WMS, inventory */}
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
              Carriers, warehouses, inventory
            </motion.p>
            <motion.h2
              className="text-display-lg lg:sticky lg:top-32"
              data-reveal="y30"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow, delay: 0.1 }}
            >
              Where the quoted rate and the invoiced rate stop matching.
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
              Carrier API integration looks trivial until you compare a quote
              with an invoice. FedEx, UPS and DHL each expose rate, label and
              tracking endpoints with their own OAuth lifecycles, their own
              address models and their own opinion about what counts as
              residential. Address validation is the quiet killer: a
              normalisation that silently reclassifies a commercial address as
              residential adds a surcharge you never quoted, and it does it
              without returning an error. Dimensional weight does the rest, since
              billable weight is the greater of actual weight and volume divided
              by the dimensional divisor in your contract, 139 being the common
              US domestic figure. Add address correction fees, liftgate, delivery
              area and fuel surcharges, and the gap between what you charged the
              customer and what the carrier billed you becomes a monthly
              reconciliation job. Design for it on day one rather than bolting it
              on in month six.
            </p>
            <p>
              Label generation deserves the same respect. Creating a label is a
              financial event, not a PDF render. Once it is manifested it can be
              billed whether or not the parcel ever moves, void windows are
              finite, and a naive retry loop that generates duplicates on timeout
              costs real money before anyone notices. Idempotency keys on every
              rate and ship call, and a stored carrier response for every label,
              are not optional here.
            </p>
            <p>
              On the warehouse side the first question is which system owns what.
              A WMS owns location-level stock, licence plates, putaway and pick
              paths. An ERP owns the financial value of inventory and the
              purchase and sales orders. Your application usually owns the
              promise you made to a customer, and that is the only one of the
              three you should be storing as truth. Writing directly into a WMS
              database is a decision you regret at the first vendor upgrade, when
              your inserts bypass the triggers maintaining their allocation
              tables and you discover the support contract no longer covers you.
            </p>
            <p>
              Then the data-model problem this vertical owns outright: inventory
              is an eventually-consistent number, not a fact. On-hand, allocated,
              available-to-promise and in-transit are four different quantities
              that disagree at any given second. Soft reservations expire, hard
              allocations do not, cycle counts reconcile against a physical
              reality neither system observed, and a picker who cannot find a
              case creates a short-ship that has to unwind an allocation, a
              customer promise and possibly a payment. Model reservations
              explicitly with expiry, keep an event log of every quantity change,
              and never expose a single integer called stock to your checkout.
            </p>
          </motion.div>
        </div>
      </Section>

      {/* Field operations */}
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
            Field operations
          </motion.p>
          <motion.h2
            className="text-display-lg mb-6"
            data-reveal="y30"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.1 }}
          >
            Offline-first is the baseline, not a feature request.
          </motion.h2>
          <motion.p
            className="text-base lg:text-lg text-[var(--color-offwhite)]/60 leading-relaxed"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.2 }}
          >
            A driver app that needs connectivity is a driver app that produces
            paper. Loading docks are steel boxes, rural routes have gaps measured
            in tens of minutes, and cross-border roaming is a policy decision
            made by someone in finance. Everything the driver does has to
            complete locally and reconcile later, which makes the sync layer the
            most expensive component in the build and the one most often
            estimated as an afterthought. That is where{" "}
            <Link href="/services/mobile-app-development" className={linkDark}>
              offline-first mobile app development
            </Link>{" "}
            does the real work.
          </motion.p>
        </div>

        <div className="space-y-0 mb-14">
          {FIELD.map((row, i) => (
            <motion.div
              key={row.group}
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
              <h3 className="md:col-span-3 text-base font-medium">
                {row.group}
              </h3>
              <p className="md:col-span-4 text-sm text-[var(--color-yellow)]">
                {row.items}
              </p>
              <p className="md:col-span-5 text-sm lg:text-base text-[var(--color-offwhite)]/60 leading-relaxed">
                {row.why}
              </p>
            </motion.div>
          ))}
          <div className="border-t border-[var(--color-hairline-dark)]" />
        </div>

        <motion.p
          className="max-w-3xl text-base lg:text-lg text-[var(--color-offwhite)]/60 leading-relaxed"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.2 }}
        >
          Position history is time-series data and it does not belong in your
          transactional tables. Keep one small hot row per vehicle for
          last-known position, and write history to a partitioned or
          purpose-built time-series store where you can downsample after thirty
          days and tier the rest to cheap storage. Retention is a cost decision
          with a legal floor underneath it, so decide it deliberately instead of
          discovering it when the table passes a billion rows and every tracking
          query starts timing out.
        </motion.p>
      </Section>

      {/* Route optimisation */}
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
              Route optimisation
            </motion.p>
            <motion.h2
              className="text-display-lg lg:sticky lg:top-32"
              data-reveal="y30"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow, delay: 0.1 }}
            >
              Anyone promising optimal routes is selling you a heuristic.
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
              What you are asking for is the vehicle routing problem with time
              windows and capacity constraints. It generalises the travelling
              salesman problem, it is NP-hard, and exact methods stop being
              practical well below the size of a real urban fleet. So the
              question is never whether you are running a heuristic. It is which
              one, and what it costs you.
            </p>
            <p>
              In practice: a Clarke-Wright savings or cheapest-insertion pass to
              reach a feasible plan quickly, then local search with 2-opt,
              Or-opt, relocate and swap moves, then a metaheuristic such as large
              neighbourhood search or guided local search if you can afford the
              runtime. Google OR-Tools covers most of that without anyone writing
              a solver. The tradeoff is blunt: five seconds of search and five
              minutes of search usually differ by a few percent of distance, and
              dispatchers care far more about a plan that stays stable between
              runs than about those few percent.
            </p>
            <p>
              Two things sink these projects. First, the travel-time matrix. Five
              hundred stops means 250,000 pairs, and live traffic matrix calls
              are typically the largest running cost in the whole feature, so
              cache aggressively and batch. Second, the objective function.
              Optimising pure distance produces routes drivers refuse to run. The
              real objective mixes driver hours and overtime, missed-window
              penalties, vehicle access limits and territory familiarity, and
              tuning those weights against your own historical days is the work
              that decides whether anybody uses the output.
            </p>
          </motion.div>
        </div>
      </Section>

      {/* Freight documents */}
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
            Where AI genuinely belongs
          </motion.p>
          <motion.h2
            className="text-display-lg mb-6"
            data-reveal="y30"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.1 }}
          >
            The paperwork arrives as a scan attached to an email.
          </motion.h2>
          <motion.div
            className="space-y-6 text-base lg:text-lg text-[var(--color-offwhite)]/60 leading-relaxed"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.2 }}
          >
            <p>
              The partners who are not on EDI are on email. Bills of lading,
              signed delivery receipts, rate confirmations, customs paperwork and
              carrier invoices arrive as photographs and scanned PDFs in a
              hundred different layouts, and somebody in operations retypes them
              every morning. This is the one place in a logistics build where a
              model earns its cost, because the input is genuinely unstructured
              and the alternative is a person.
            </p>
            <p>
              It is worth being precise about why workflow tools alone do not
              solve it. An orchestrator moves the attachment and calls the next
              step; it cannot read a crumpled bill of lading photographed at an
              angle, because it is an orchestrator, not an extractor. The working
              shape is a deterministic parser first, a model only on the pages
              that defeat it, a confidence threshold per field, and a review
              queue for everything below it. That pattern is set out in full in{" "}
              <Link href="/insights/automate-document-processing" className={linkDark}>
                our guide to automating document processing
              </Link>
              , and it is the same approach behind our{" "}
              <Link href="/services/ai-automation" className={linkDark}>
                AI automation and extraction pipelines
              </Link>
              . Where your ops team should be able to change the flow without us,
              we build the orchestration in{" "}
              <Link href="/services/n8n-automation-development" className={linkDark}>
                n8n
              </Link>{" "}
              and keep the extraction behind an API.
            </p>
          </motion.div>
        </div>
      </Section>

      {/* Regulatory surface */}
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
            The regulatory surface
          </motion.p>
          <motion.h2
            className="text-display-lg mb-6"
            data-reveal="y30"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.1 }}
          >
            What the rules demand of the architecture.
          </motion.h2>
          <motion.p
            className="text-lg text-[var(--color-mute)] leading-relaxed"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.2 }}
          >
            Not a summary of the law, which your counsel owns. These are the
            points where a regulation reaches into the data layer and changes
            what you have to store, log, retain and prove.
          </motion.p>
        </div>

        <div className="space-y-0 mb-14">
          {REGS.map((row, i) => (
            <motion.div
              key={row.group}
              className="border-t border-[var(--color-hairline-light)] py-7 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8"
              data-reveal="y20"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{
                duration: DURATION.slow,
                ease: EASE.standard,
                delay: i * 0.04,
              }}
            >
              <h3 className="md:col-span-3 text-base font-medium">
                {row.group}
              </h3>
              <p className="md:col-span-4 text-sm text-[var(--color-ink)]/50">
                {row.items}
              </p>
              <p className="md:col-span-5 text-sm lg:text-base text-[var(--color-ink)]/70 leading-relaxed">
                {row.why}
              </p>
            </motion.div>
          ))}
          <div className="border-t border-[var(--color-hairline-light)]" />
        </div>

        <motion.p
          className="max-w-3xl text-base lg:text-lg text-[var(--color-ink)]/75 leading-relaxed"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.2 }}
        >
          Being plain about the limits, because it saves everyone a wasted call.
          EdgeBrain Studios is an engineering studio. We hold no SOC 2
          attestation, no C-TPAT validation and no customs brokerage licence, and
          we are not a registered ELD provider. If your buyer or your insurer
          requires any of those, you bring the accreditation or the accredited
          vendor and we build against it: reading hours from a registered ELD
          platform rather than recording duty status ourselves, filing through a
          licensed broker rather than direct. Where the open question is whether
          a model belongs in a regulated step at all, that is what an{" "}
          <Link href="/services/ai-consulting" className={linkLight}>
            AI readiness assessment
          </Link>{" "}
          is for.
        </motion.p>
      </Section>

      {/* When to buy instead */}
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
            Most of this vertical should buy, not build.
          </motion.h2>
          <motion.div
            className="space-y-6 text-base lg:text-lg text-[var(--color-offwhite)]/60 leading-relaxed"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.2 }}
          >
            <p>
              If you run a small fleet on standard parcel and LTL lanes, buy a
              TMS. If you operate a warehouse with conventional receiving,
              putaway and wave picking, buy a WMS. The long tail of a mature WMS
              is five to ten years of product work — slotting strategies, cycle
              count variance rules, licence plate handling, cartonisation — and
              no fixed-scope engagement reproduces that. A subscription is the
              correct answer, and we will say so rather than quote you.
            </p>
            <p>
              The same applies to X12 itself. Do not commission a hand-written
              EDI parser. Buy a translator or an EDI-as-an-API service and spend
              your budget on the mapping and the reconciliation logic, which is
              where the domain complexity actually lives and where no vendor can
              help you.
            </p>
            <p>
              Custom is right when your operating model is the product: a service
              promise nobody sells software for, a customer-facing tracking and
              booking experience that is part of how you win accounts, a pricing
              engine encoding rules that currently live in one person&rsquo;s
              head, or the connective tissue between five systems no vendor
              integrates. That last one is the most common honest answer, and it
              is usually a{" "}
              <Link href="/services/web-development" className={linkDark}>
                Next.js application layered over your existing systems
              </Link>{" "}
              rather than a replacement for any of them. You can see the range of
              what we ship in{" "}
              <Link href="/work" className={linkDark}>
                the case studies we publish
              </Link>
              .
            </p>
          </motion.div>
        </div>
      </Section>

      {/* Cost and timeline */}
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
            What a build like this costs.
          </motion.h2>
          <motion.p
            className="text-lg text-[var(--color-mute)] leading-relaxed"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.2 }}
          >
            Our published bands, in USD, with a $2,500 minimum engagement. In
            this vertical the estimate moves on one variable more than any other:
            how many external systems have to be spoken to, and how badly each
            one behaves.
          </motion.p>
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
                delay: (i % 2) * 0.08,
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

        <motion.p
          className="max-w-3xl text-base lg:text-lg text-[var(--color-ink)]/75 leading-relaxed"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.2 }}
        >
          Document extraction pipelines are priced as production workflows, from
          $7,000. Ongoing support runs from $1,800 per month, which in this
          vertical mostly buys somebody who notices a trading partner changed
          their 214 mapping before your customers do. These figures are
          provisional, and every engagement is quoted properly before anything
          starts.
        </motion.p>
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
            Send us the integration list.
          </motion.h2>
          <motion.p
            className="text-lg text-[var(--color-ink)]/70 mb-10 max-w-xl mx-auto leading-relaxed"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ delay: 0.15, duration: DURATION.slow }}
          >
            Name the systems: the trading partners, the carriers, the WMS or ERP,
            the telematics provider. We come back with an architecture and a
            number inside two working days.
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
