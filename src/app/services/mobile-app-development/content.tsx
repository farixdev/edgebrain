"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { DURATION, EASE, viewportOnce } from "@/lib/motion";
import { MOBILE_APP_FAQS } from "./faqs";

const DELIVERABLES = [
  {
    title: "A cross-platform app in React Native and Expo",
    body: "One TypeScript codebase for iOS and Android, sharing types with your web backend so a schema change breaks the build instead of production.",
  },
  {
    title: "Offline-first storage with a real sync layer",
    body: "SQLite on device, a write queue, and conflict resolution you can inspect. The app works in a basement lift and reconciles when signal returns.",
  },
  {
    title: "Real-time sync between phone and dashboard",
    body: "Postgres changes streamed over WebSockets. An edit made on the phone lands in your web admin in under a second, without a pull-to-refresh.",
  },
  {
    title: "Push notifications wired to APNs and FCM",
    body: "Per-user routing, quiet hours, and deep links that open the exact record rather than dumping the user on the home tab.",
  },
  {
    title: "A native client for your existing SaaS",
    body: "We consume your API and build real screens. No WebView wrapper, because Apple rejects those under guideline 4.2 and users can feel the difference.",
  },
  {
    title: "App Store and Google Play submission",
    body: "Screenshots at every required size, privacy nutrition labels, the Play data safety form, and review notes. We push the first build and answer the first rejection.",
  },
  {
    title: "Device, Bluetooth, and wearable integrations",
    body: "BLE peripherals, barcode scanning, HealthKit and Health Connect, and an Apple Watch companion when the product genuinely belongs on a wrist.",
  },
];

const STACK = [
  {
    group: "App layer",
    items: [
      {
        name: "React Native and Expo",
        why: "Config plugins let us use any native module without ejecting, so the managed workflow stops being a ceiling.",
      },
      {
        name: "TypeScript, strict mode",
        why: "The same types cover your API, your web app, and your mobile app. Renaming a field fails at compile time.",
      },
      {
        name: "Expo Router",
        why: "File-based routing that reads like the Next.js app directory your web team already knows.",
      },
      {
        name: "Flutter",
        why: "Reached for when pixel-identical rendering across every Android device matters more than shared code.",
      },
    ],
  },
  {
    group: "Data and state",
    items: [
      {
        name: "TanStack Query",
        why: "Caching, retries, and an offline mutation queue in one place instead of three hand-rolled hooks.",
      },
      {
        name: "op-sqlite or WatermelonDB",
        why: "A local database that still scrolls at 60fps past 100,000 rows. AsyncStorage does not.",
      },
      {
        name: "Zod",
        why: "One schema validates the API response on the server, the web client, and the phone.",
      },
    ],
  },
  {
    group: "Backend",
    items: [
      {
        name: "Supabase",
        why: "Postgres, auth, realtime, and row-level security without writing an auth service from scratch.",
      },
      {
        name: "Node with Fastify",
        why: "Used when the business logic is genuinely yours and does not belong in a database policy.",
      },
      {
        name: "Firebase Cloud Messaging",
        why: "Push delivery on Android that survives aggressive OEM battery managers.",
      },
    ],
  },
  {
    group: "Motion and release",
    items: [
      {
        name: "Reanimated 3 and Gesture Handler",
        why: "Animations run on the UI thread, so a busy JavaScript thread cannot drop your swipe to 20fps.",
      },
      {
        name: "EAS Build and EAS Update",
        why: "Over-the-air JavaScript fixes reach users in minutes rather than waiting on a store review.",
      },
      {
        name: "Sentry and Maestro",
        why: "Crash traces with readable source maps, and end-to-end flows that run against every pull request.",
      },
    ],
  },
];

const PRICING = [
  {
    label: "Mobile client for an existing product",
    price: "$9,000 to $16,000",
    time: "4 to 6 weeks",
    body: "Your API already exists. We build the screens, auth flow, push notifications, and both store listings.",
  },
  {
    label: "MVP from scratch",
    price: "$14,000 to $26,000",
    time: "6 to 9 weeks",
    body: "App, backend, admin view, and both submissions. Enough real product to put in front of paying users.",
  },
  {
    label: "Full product with offline sync",
    price: "$28,000 to $50,000",
    time: "10 to 16 weeks",
    body: "Offline-first data layer, real-time sync, payments, multiple roles, and analytics wired end to end.",
  },
  {
    label: "Post-launch support",
    price: "From $2,400 per month",
    time: "Rolling, 30 days notice",
    body: "OS upgrades, store policy changes, crash triage, and a fixed block of feature hours each month.",
  },
];

export function MobileAppDevelopmentPageContent() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      {/* Hero */}
      <Section variant="light" className="pt-40 lg:pt-48">
        <Breadcrumbs items={[
            { label: "Home", href: "/" },
            { label: "Services", href: "/services" },
            { label: "Mobile App Development" },
          ]} />
        <motion.p
          className="text-xs uppercase tracking-[0.2em] text-[var(--color-mute)] mb-4 font-medium"
          data-reveal="fade"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow }}
        >
          Mobile App Development
        </motion.p>
        <motion.h1
          className="text-display-xl max-w-3xl mb-6"
          data-reveal="y30"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.1 }}
        >
          Mobile apps that feel native, from one codebase.
        </motion.h1>
        <motion.p
          className="text-lg text-[var(--color-mute)] max-w-2xl mb-10"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.2 }}
        >
          You need iOS and Android. You do not need two native teams, two
          backlogs, and two release cycles to get there. We build cross-platform
          apps in React Native, Flutter, and Expo, and the first build reaches
          your phone through TestFlight in week two.
        </motion.p>
        <motion.div
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.3 }}
        >
          <ButtonLink href="/contact" size="lg">
            <span>Scope your app</span>
          </ButtonLink>
        </motion.div>
      </Section>

      {/* What we build */}
      <Section variant="dark" noise>
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20">
          <div>
            <motion.p
              className="text-xs uppercase tracking-[0.2em] text-[var(--color-yellow)] mb-4 font-medium"
              data-reveal="fade"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow }}
            >
              What we build
            </motion.p>
            <motion.h2
              className="text-display-lg mb-6"
              data-reveal="y30"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow, delay: 0.1 }}
            >
              What lands in your App Store Connect account.
            </motion.h2>
            <motion.p
              className="text-base text-[var(--color-offwhite)]/60 max-w-md"
              data-reveal="y20"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow, delay: 0.2 }}
            >
              Not capabilities. Artifacts. Every item below is something you can
              open, install, or ship on the day we hand it over.
            </motion.p>
          </div>

          <div className="space-y-0">
            {DELIVERABLES.map((item, i) => (
              <motion.div
                key={item.title}
                className="border-t border-[var(--color-hairline-dark)] py-6"
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
                <div className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-yellow)] mt-2.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-base lg:text-lg font-medium mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[var(--color-offwhite)]/60 leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
            <div className="border-t border-[var(--color-hairline-dark)]" />
          </div>
        </div>
      </Section>

      {/* How we approach it */}
      <Section variant="light">
        <div className="max-w-3xl">
          <motion.p
            className="text-xs uppercase tracking-[0.2em] text-[var(--color-mute)] mb-4 font-medium"
            data-reveal="fade"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow }}
          >
            How we approach it
          </motion.p>
          <motion.h2
            className="text-display-lg mb-10"
            data-reveal="y30"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.1 }}
          >
            React Native by default. Native when the product earns it.
          </motion.h2>

          <motion.div
            className="space-y-6 text-base lg:text-lg text-[var(--color-ink)]/75 leading-relaxed"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.2 }}
          >
            <p>
              React Native is the right call for roughly four out of five apps
              we get asked about. You share 90 to 95 percent of the code across
              iOS and Android, you hire from a much larger pool, and a
              TypeScript engineer who knows your web app can read your mobile
              app on day one. It is the wrong call in specific, nameable cases.
              Custom camera pipelines, real-time video processing, ARKit scene
              work, and audio DSP all fight the bridge. If your product lives in
              one of those, you want Swift and Kotlin, and we will say so on the
              first call rather than after you have signed.
            </p>
            <p>
              Flutter earns its place when you want the same frame on every
              device. Impeller paints every widget itself, so an Android 9
              budget phone and a current iPhone render identically instead of
              inheriting different platform controls. The cost is real and worth
              stating. You write Dart, so you stop sharing types, validators,
              and utilities with the{" "}
              <Link
                href="/services/web-development"
                className="underline underline-offset-4 decoration-[var(--color-ink)]/30 hover:decoration-[var(--color-yellow)] transition-colors duration-[var(--duration-fast)]"
              >
                Next.js web app we build alongside it
              </Link>
              , and your hiring pool narrows. We pick Flutter when the design
              demands it or your team already ships Dart. Otherwise React Native
              wins on total cost of ownership.
            </p>
            <p>
              Offline-first is a data model decision, not a feature you bolt on
              in week six. Retrofitting sync into an app built on
              request-response reliably takes longer than building it correctly
              the first time, so we settle it in week one. We ask which entities
              a user can edit while disconnected, what happens when two devices
              touch the same record, and whether last-write-wins is acceptable
              or you need a merge the user can actually see. Most products want
              a queue of intents rather than a queue of rows.{" "}
              <span className="text-[var(--color-ink)]">
                &ldquo;Mark invoice 4471 paid&rdquo;
              </span>{" "}
              replays cleanly against a server state that has moved on. A blind
              row overwrite silently destroys someone else&rsquo;s edit.
            </p>
            <p>
              Performance problems in cross-platform apps are almost always the
              same three problems: animations running on the JavaScript thread,
              unvirtualized lists, and too much chatter across the bridge. So we
              use Reanimated worklets to keep gestures on the UI thread,
              FlashList for anything past twenty rows, and the New Architecture
              so native modules are called synchronously. You get a TestFlight
              build every Friday from week two, which means you are judging a
              real app on your own phone weeks before launch. Browse{" "}
              <Link
                href="/work"
                className="underline underline-offset-4 decoration-[var(--color-ink)]/30 hover:decoration-[var(--color-yellow)] transition-colors duration-[var(--duration-fast)]"
              >
                the products we have shipped
              </Link>{" "}
              if you want to see the standard before you talk to us.
            </p>
          </motion.div>
        </div>
      </Section>

      {/* The stack */}
      <Section variant="dark" noise>
        <motion.p
          className="text-xs uppercase tracking-[0.2em] text-[var(--color-yellow)] mb-4 font-medium"
          data-reveal="fade"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow }}
        >
          The stack
        </motion.p>
        <motion.h2
          className="text-display-lg mb-14 max-w-2xl"
          data-reveal="y30"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.1 }}
        >
          Every tool here is here for a reason we can defend.
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
          {STACK.map((group, i) => (
            <motion.div
              key={group.group}
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
              <h3 className="text-xs uppercase tracking-[0.15em] text-[var(--color-mute)] mb-5 font-medium">
                {group.group}
              </h3>
              <ul className="space-y-5">
                {group.items.map((item) => (
                  <li key={item.name}>
                    <p className="text-base font-medium mb-1">{item.name}</p>
                    <p className="text-sm text-[var(--color-offwhite)]/60 leading-relaxed">
                      {item.why}
                    </p>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Cost and timeline */}
      <Section variant="light">
        <motion.p
          className="text-xs uppercase tracking-[0.2em] text-[var(--color-mute)] mb-4 font-medium"
          data-reveal="fade"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow }}
        >
          Cost and timeline
        </motion.p>
        <motion.h2
          className="text-display-lg mb-6 max-w-2xl"
          data-reveal="y30"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.1 }}
        >
          What a mobile app costs, published before you call us.
        </motion.h2>
        <motion.p
          className="text-lg text-[var(--color-mute)] max-w-2xl mb-14"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, delay: 0.2 }}
        >
          Most studios make you book a call to find out. These are the bands we
          actually quote against, and the quote is fixed before kickoff rather
          than after a discovery phase spends three weeks of your runway.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--color-hairline-light)] border border-[var(--color-hairline-light)] rounded-[var(--radius-lg)] overflow-hidden mb-14">
          {PRICING.map((tier, i) => (
            <motion.div
              key={tier.label}
              className="bg-[var(--color-offwhite)] p-8 lg:p-10"
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
              <h3 className="text-xs uppercase tracking-[0.15em] text-[var(--color-mute)] mb-4 font-medium">
                {tier.label}
              </h3>
              <p className="text-display-sm mb-2">{tier.price}</p>
              <p className="text-sm text-[var(--color-ink)] font-medium mb-4">
                {tier.time}
              </p>
              <p className="text-sm text-[var(--color-ink)]/70 leading-relaxed">
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
            Four variables move the number more than anything else. Offline sync
            adds roughly two weeks and about a third of the build cost, because
            conflict handling touches every screen that writes data. Native
            modules such as Bluetooth, background location, or a custom camera
            add real integration time and real device testing. In-app purchases
            cost more than Stripe, since receipt validation is a subsystem of
            its own and Apple takes 15 to 30 percent forever. And design from a
            blank page costs more than design against an existing system, which
            is the saving most teams underestimate.
          </p>
          <p>
            Now the part offshore studios tend to skip. You own the code from
            the first commit, in your GitHub organization, not ours. You own the
            Apple Developer and Google Play accounts, so we never hold your
            release keys or your listing hostage. Payment is milestone-based,
            typically 40 percent at kickoff and the remainder against builds you
            have already installed and used. If the engagement stops, you keep a
            running app and a repository with readable commit history, not a
            zip file and a handover call.
          </p>
          <p>
            We are a{" "}
            <Link
              href="/services"
              className="underline underline-offset-4 decoration-[var(--color-ink)]/30 hover:decoration-[var(--color-yellow)] transition-colors duration-[var(--duration-fast)]"
            >
              software house in Lahore
            </Link>{" "}
            working with founders across the US, UK, and Gulf, which means the
            timezone question deserves a straight answer. Lahore is UTC+5. You
            get five working hours of overlap with London and three with New
            York mornings, and we hold the standup inside your window. Many of
            our mobile builds ship with{" "}
            <Link
              href="/services/ai-automation"
              className="underline underline-offset-4 decoration-[var(--color-ink)]/30 hover:decoration-[var(--color-yellow)] transition-colors duration-[var(--duration-fast)]"
            >
              an AI automation layer behind them
            </Link>
            , handling document capture or classification server-side so the app
            stays thin. Tell us the constraint and we will scope it in a{" "}
            <Link
              href="/contact"
              className="underline underline-offset-4 decoration-[var(--color-ink)]/30 hover:decoration-[var(--color-yellow)] transition-colors duration-[var(--duration-fast)]"
            >
              30-minute call
            </Link>
            .
          </p>
        </motion.div>
      </Section>

      {/* FAQ */}
      <Section variant="dark" noise>
        <div className="max-w-3xl mx-auto">
          <div className="mb-16 text-center">
            <motion.p
              className="text-xs uppercase tracking-[0.2em] text-[var(--color-yellow)] mb-4 font-medium"
              data-reveal="fade"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow }}
            >
              FAQ
            </motion.p>
            <motion.h2
              className="text-display-lg"
              data-reveal="y30"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow, delay: 0.1 }}
            >
              The questions that decide it.
            </motion.h2>
          </div>

          <div className="space-y-0">
            {MOBILE_APP_FAQS.map((faq, i) => {
              const isExpanded = expanded === i;

              return (
                <motion.div
                  key={faq.question}
                  className="border-t border-[var(--color-hairline-dark)]"
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
                  <button
                    className="w-full py-6 flex items-center justify-between gap-4 text-left cursor-pointer group"
                    onClick={() => setExpanded(isExpanded ? null : i)}
                    aria-expanded={isExpanded}
                    aria-controls={`faq-answer-${i}`}
                  >
                    <span className="text-base lg:text-lg font-medium group-hover:text-[var(--color-yellow)] transition-colors duration-[var(--duration-fast)]">
                      {faq.question}
                    </span>
                    <motion.span
                      className="text-[var(--color-mute)] flex-shrink-0"
                      animate={{ rotate: isExpanded ? 45 : 0 }}
                      transition={{ duration: DURATION.fast }}
                    >
                      <Plus size={18} />
                    </motion.span>
                  </button>

                  {/* Always mounted so every answer is in the HTML for crawlers
                      and AI search — the FAQPage JSON-LD on this route declares
                      these answers, and declaring markup for content that is
                      never rendered is a Google structured-data violation.
                      `inert` keeps the collapsed panel out of the tab order. */}
                  <motion.div
                    id={`faq-answer-${i}`}
                    initial={false}
                    animate={{
                      height: isExpanded ? "auto" : 0,
                      opacity: isExpanded ? 1 : 0,
                    }}
                    transition={{
                      duration: shouldReduceMotion ? 0 : DURATION.base,
                      ease: EASE.standard,
                    }}
                    className="overflow-hidden"
                    inert={!isExpanded}
                  >
                    <p className="pb-6 text-sm lg:text-base text-[var(--color-offwhite)]/60 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                </motion.div>
              );
            })}
            <div className="border-t border-[var(--color-hairline-dark)]" />
          </div>
        </div>
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
            Tell us what the app has to do.
          </motion.h2>
          <motion.p
            className="text-lg text-[var(--color-ink)]/70 mb-10 max-w-xl mx-auto"
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
            Send us the feature list, or a paragraph and a rough deadline. You
            get a fixed-scope quote and a week-by-week plan within two working
            days.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{
              delay: 0.25,
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
              className="text-base font-medium text-[var(--color-ink)] underline underline-offset-4 decoration-[var(--color-ink)]/30 hover:decoration-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]"
            >
              +92 327 0944766
            </a>
          </motion.div>
        </div>
      </Section>
    </>
  );
}
