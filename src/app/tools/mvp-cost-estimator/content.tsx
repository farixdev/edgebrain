"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, RotateCcw } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { DURATION, EASE, viewportOnce } from "@/lib/motion";

/* ────────────────────────────────────────────────────────────────────────────
   THE MODEL

   Everything below the fold on this page is arithmetic the reader can check,
   so the arithmetic lives in one pure function with no React in it. Change a
   default here and the table, the headline range and the first-year figure all
   move together; there is no second copy of any number.

   Calibration note, because this is the part that could quietly become a lie.
   Re-measured against the shipped defaults on 2026-08-20; if you change any
   default below, re-run this and rewrite these numbers rather than trusting
   them. A web MVP with authentication, billing and an admin dashboard — the
   exact configuration priced in src/components/sections/faq-home-data.ts —
   returns $19,000-$32,700 at the shipped defaults, against that posted band of
   $18,000-$35,000. It sits inside the band but does not reach the ceiling: the
   high end runs about $2,300 short, so this tool reads low against a top-of-
   band brief and must never be cited back as a quote. The default state of the
   page (authentication and admin, no billing) shows $16,500-$28,400, which is
   below the posted $18,000 floor because it is a smaller scope than the one
   that floor prices — not a discount. The blended rate default of $55
   sits inside the $25-$60 South and Southeast Asia agency band quoted in
   /insights/mvp-development-cost. It is a market figure, not a quote, and the
   page says so.
   ──────────────────────────────────────────────────────────────────────────── */

export type Platform = "web" | "mobile" | "both";
export type DesignTier = "lean" | "standard" | "bespoke";
export type FeatureId =
  | "auth"
  | "payments"
  | "admin"
  | "realtime"
  | "ai"
  | "integrations"
  | "files"
  | "notifications";

/** Every quantity in this model is a low-to-high band. Point estimates lie. */
export interface Band {
  low: number;
  high: number;
}

export interface EstimatorInput {
  platform: Platform;
  features: FeatureId[];
  design: DesignTier;
  /** Screens unique to your product, over and above the feature areas. */
  coreSurfaces: number;
  hoursPerSurface: Band;
  featureHours: Record<FeatureId, Band>;
  blendedRate: number;
  /** Discovery as a share of build hours, floored and capped. */
  discoveryPct: number;
  /** QA as a share of build + integration hours. */
  qaPct: number;
  environmentHours: Band;
  deployHours: Band;
  contingencyPct: number;
  /** First-year maintenance as a share of build cost. */
  maintenancePct: number;
}

export interface LineItem {
  id: string;
  group: string;
  label: string;
  note: string;
  hours: Band;
  cost: Band;
}

export interface Estimate {
  lines: LineItem[];
  labourHours: Band;
  labourCost: Band;
  contingency: Band;
  total: Band;
  /** Costs that sit outside the build and outside most build quotes. */
  runningCostYearOne: Band;
  storeFeesYearOne: Band;
  maintenanceYearOne: Band;
  firstYearTotal: Band;
}

export const PLATFORM_MULTIPLIER: Record<Platform, number> = {
  web: 1,
  mobile: 1.2,
  both: 1.6,
};

export const DESIGN_SHARE: Record<DesignTier, number> = {
  lean: 0.12,
  standard: 0.2,
  bespoke: 0.32,
};

/**
 * Third-party running cost, per month, for a conventional stack: managed auth,
 * Stripe, transactional email, error monitoring, hosting with a managed
 * Postgres. Same $80-$400 band as the companion article.
 */
const RUNNING_COST_PER_MONTH: Band = { low: 80, high: 400 };

/** Apple Developer $99/year. Google Play $25, once. Both are published fees. */
const STORE_FEES_YEAR_ONE = 99 + 25;

/** Extra hours for store submission prep when a mobile client is in scope. */
const STORE_SUBMISSION_HOURS: Band = { low: 8, high: 16 };

const DISCOVERY_FLOOR = 16;
const DISCOVERY_CEILING = 60;

const scale = (band: Band, factor: number): Band => ({
  low: band.low * factor,
  high: band.high * factor,
});

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export function estimate(input: EstimatorInput): Estimate {
  const multiplier = PLATFORM_MULTIPLIER[input.platform];
  const hasMobile = input.platform !== "web";
  const rate = input.blendedRate;

  const selected = FEATURES.filter((feature) =>
    input.features.includes(feature.id)
  );

  // ── Build: the core product, then one row per selected feature area.
  const coreHours = scale(
    {
      low: input.hoursPerSurface.low * input.coreSurfaces,
      high: input.hoursPerSurface.high * input.coreSurfaces,
    },
    multiplier
  );

  const buildRows: { id: string; label: string; note: string; hours: Band }[] = [
    {
      id: "core",
      label: "Core product surfaces",
      note: `${input.coreSurfaces} screens unique to your product, at ${input.hoursPerSurface.low}-${input.hoursPerSurface.high} hours each.`,
      hours: coreHours,
    },
  ];

  for (const feature of selected) {
    if (feature.id === "integrations") continue; // Its own line item below.
    buildRows.push({
      id: feature.id,
      label: feature.label,
      note: feature.note,
      hours: scale(input.featureHours[feature.id], multiplier),
    });
  }

  const buildHours = buildRows.reduce<Band>(
    (sum, row) => ({ low: sum.low + row.hours.low, high: sum.high + row.hours.high }),
    { low: 0, high: 0 }
  );

  const integrationHours = input.features.includes("integrations")
    ? scale(input.featureHours.integrations, multiplier)
    : { low: 0, high: 0 };

  const designHours = scale(buildHours, DESIGN_SHARE[input.design]);

  const discoveryHours: Band = {
    low: clamp(buildHours.low * input.discoveryPct, DISCOVERY_FLOOR, DISCOVERY_CEILING),
    high: clamp(buildHours.high * input.discoveryPct, DISCOVERY_FLOOR, DISCOVERY_CEILING),
  };

  const qaHours: Band = {
    low: (buildHours.low + integrationHours.low) * input.qaPct,
    high: (buildHours.high + integrationHours.high) * input.qaPct,
  };

  const deployHours: Band = hasMobile
    ? {
        low: input.deployHours.low + STORE_SUBMISSION_HOURS.low,
        high: input.deployHours.high + STORE_SUBMISSION_HOURS.high,
      }
    : input.deployHours;

  const priced = (hours: Band): Band => ({
    low: hours.low * rate,
    high: hours.high * rate,
  });

  const lines: LineItem[] = [
    {
      id: "discovery",
      group: "Discovery",
      label: "Scope, data model, risk register",
      note: "One week. Produces the surface inventory that every other line on this table is calculated from.",
      hours: discoveryHours,
      cost: priced(discoveryHours),
    },
    {
      id: "design",
      group: "Design",
      label:
        DESIGN_TIERS.find((tier) => tier.id === input.design)?.label ??
        "Design",
      note: `${Math.round(DESIGN_SHARE[input.design] * 100)}% of build hours. Includes the empty, loading, error and permission-denied states nobody puts in the mock.`,
      hours: designHours,
      cost: priced(designHours),
    },
    ...buildRows.map((row) => ({
      id: `build-${row.id}`,
      group: "Build",
      label: row.label,
      note: row.note,
      hours: row.hours,
      cost: priced(row.hours),
    })),
  ];

  if (input.features.includes("integrations")) {
    lines.push({
      id: "integrations",
      group: "Integrations",
      label: "Third-party integrations",
      note: "Auth, retries, rate limits, and the sandbox that behaves differently from production.",
      hours: integrationHours,
      cost: priced(integrationHours),
    });
  }

  lines.push(
    {
      id: "qa",
      group: "QA",
      label: "Test pass and device matrix",
      note: `${Math.round(input.qaPct * 100)}% of build and integration hours. A written pass against the scope document, not a click-around.`,
      hours: qaHours,
      cost: priced(qaHours),
    },
    {
      id: "environments",
      group: "Environments",
      label: "Staging, CI, secrets, migrations",
      note: "Real engineering that appears in no design mock, which is why it gets absorbed into the build line until the week it cannot be.",
      hours: input.environmentHours,
      cost: priced(input.environmentHours),
    },
    {
      id: "deploy",
      group: "Deploy",
      label: hasMobile
        ? "Production cutover, handover, store submission"
        : "Production cutover and handover",
      note: hasMobile
        ? "Monitoring, backups with a tested restore, repository transfer, plus privacy labels, screenshots and review notes for two stores."
        : "Monitoring, backups with a tested restore, repository transfer, and a recorded walkthrough. Handover is work.",
      hours: deployHours,
      cost: priced(deployHours),
    }
  );

  const labourHours = lines.reduce<Band>(
    (sum, line) => ({ low: sum.low + line.hours.low, high: sum.high + line.hours.high }),
    { low: 0, high: 0 }
  );
  const labourCost = priced(labourHours);
  const contingency = scale(labourCost, input.contingencyPct);
  const total: Band = {
    low: labourCost.low + contingency.low,
    high: labourCost.high + contingency.high,
  };

  const runningCostYearOne = scale(RUNNING_COST_PER_MONTH, 12);
  const storeFeesYearOne: Band = hasMobile
    ? { low: STORE_FEES_YEAR_ONE, high: STORE_FEES_YEAR_ONE }
    : { low: 0, high: 0 };
  const maintenanceYearOne = scale(total, input.maintenancePct);

  return {
    lines,
    labourHours,
    labourCost,
    contingency,
    total,
    runningCostYearOne,
    storeFeesYearOne,
    maintenanceYearOne,
    firstYearTotal: {
      low:
        total.low +
        runningCostYearOne.low +
        storeFeesYearOne.low +
        maintenanceYearOne.low,
      high:
        total.high +
        runningCostYearOne.high +
        storeFeesYearOne.high +
        maintenanceYearOne.high,
    },
  };
}

/* ────────────────────────────────────────────────────────────────────────────
   OPTION DATA
   ──────────────────────────────────────────────────────────────────────────── */

interface FeatureDef {
  id: FeatureId;
  label: string;
  note: string;
}

export const FEATURES: FeatureDef[] = [
  {
    id: "auth",
    label: "Authentication and accounts",
    note: "Signup, email verification, password reset, sessions, rate limiting, account deletion.",
  },
  {
    id: "payments",
    label: "Payments and billing",
    note: "Checkout, subscription state, webhook handler, failed-payment handling, customer portal.",
  },
  {
    id: "admin",
    label: "Admin dashboard",
    note: "Internal CRUD screens, roles, search, audit trail. Usually the first thing worth cutting.",
  },
  {
    id: "realtime",
    label: "Real-time or offline sync",
    note: "Live updates, presence, conflict resolution, or an offline-first local store.",
  },
  {
    id: "ai",
    label: "An AI feature",
    note: "Retrieval, prompt plumbing, an evaluation harness, and a fallback for when the model is wrong.",
  },
  {
    id: "integrations",
    label: "Third-party integrations",
    note: "Every external system you read from or write to. Two or three is typical for an MVP.",
  },
  {
    id: "files",
    label: "File upload and handling",
    note: "Storage, scanning, previews or thumbnails, signed URLs, per-account quota.",
  },
  {
    id: "notifications",
    label: "Notifications",
    note: "Transactional email, push, in-app inbox, and the preference screen that comes with them.",
  },
];

const DEFAULT_FEATURE_HOURS: Record<FeatureId, Band> = {
  auth: { low: 24, high: 40 },
  payments: { low: 30, high: 50 },
  admin: { low: 60, high: 100 },
  realtime: { low: 40, high: 80 },
  ai: { low: 50, high: 90 },
  integrations: { low: 30, high: 90 },
  files: { low: 20, high: 40 },
  notifications: { low: 16, high: 32 },
};

const PLATFORMS: { id: Platform; label: string; note: string }[] = [
  {
    id: "web",
    label: "Web only",
    note: "One responsive application. The cheapest way to find out whether anyone wants it.",
  },
  {
    id: "mobile",
    label: "Mobile only",
    note: "One cross-platform codebase, two app stores, two review queues.",
  },
  {
    id: "both",
    label: "Web and mobile",
    note: "Shared API, two clients. Not one project. Closer to one and a half.",
  },
];

const DESIGN_TIERS: { id: DesignTier; label: string; note: string }[] = [
  {
    id: "lean",
    label: "Themed component library",
    note: "An off-the-shelf design system, lightly themed. The fastest route to a usable product.",
  },
  {
    id: "standard",
    label: "Custom UI, full state coverage",
    note: "Wireframes for every surface, plus the four states that get underquoted by half.",
  },
  {
    id: "bespoke",
    label: "Brand-led and bespoke",
    note: "Custom visual language, illustration, motion. Worth buying when the product is the brand.",
  },
];

export const DEFAULTS: EstimatorInput = {
  platform: "web",
  features: ["auth", "admin"],
  design: "standard",
  coreSurfaces: 8,
  hoursPerSurface: { low: 10, high: 18 },
  featureHours: DEFAULT_FEATURE_HOURS,
  blendedRate: 55,
  discoveryPct: 0.07,
  qaPct: 0.17,
  environmentHours: { low: 20, high: 36 },
  deployHours: { low: 12, high: 24 },
  contingencyPct: 0.1,
  maintenancePct: 0.18,
};

/* ────────────────────────────────────────────────────────────────────────────
   FORMATTING

   Deterministic on both sides of the hydration boundary. Intl.NumberFormat is
   not guaranteed to be, and a currency string that differs between server and
   client is a hydration error on the highest-value page on the site.
   ──────────────────────────────────────────────────────────────────────────── */

function withCommas(value: number): string {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function money(value: number): string {
  return `$${withCommas(Math.round(value / 100) * 100)}`;
}

function moneyExact(value: number): string {
  return `$${withCommas(Math.round(value))}`;
}

function hours(value: number): string {
  return withCommas(Math.round(value));
}

function moneyRange(band: Band): string {
  if (Math.round(band.low / 100) === Math.round(band.high / 100)) {
    return money(band.low);
  }
  return `${money(band.low)} – ${money(band.high)}`;
}

function hourRange(band: Band): string {
  if (Math.round(band.low) === Math.round(band.high)) return hours(band.low);
  return `${hours(band.low)} – ${hours(band.high)}`;
}

/* ────────────────────────────────────────────────────────────────────────────
   CONTROLS
   ──────────────────────────────────────────────────────────────────────────── */

function NumberField({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  prefix,
  suffix,
  describedBy,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  describedBy?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium leading-snug">
        {label}
      </label>
      <div className="flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-hairline-light)] bg-[var(--color-white)] px-3 py-2 focus-within:border-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]">
        {prefix ? (
          <span aria-hidden="true" className="text-sm text-[var(--color-mute)]">
            {prefix}
          </span>
        ) : null}
        <input
          id={id}
          type="number"
          inputMode="numeric"
          value={String(value)}
          min={min}
          max={max}
          step={step}
          aria-describedby={describedBy}
          onChange={(event) => {
            const parsed = Number(event.target.value);
            onChange(Number.isFinite(parsed) ? clamp(parsed, min, max) : min);
          }}
          className="w-full bg-transparent text-base font-medium tabular-nums outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        {suffix ? (
          <span aria-hidden="true" className="whitespace-nowrap text-sm text-[var(--color-mute)]">
            {suffix}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function BandField({
  idBase,
  label,
  value,
  onChange,
}: {
  idBase: string;
  label: string;
  value: Band;
  onChange: (band: Band) => void;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-3 py-2.5 border-b border-[var(--color-hairline-light)] last:border-b-0">
      <span id={`${idBase}-label`} className="text-sm leading-snug pr-2">
        {label}
      </span>
      <div className="flex items-center gap-1.5">
        <label htmlFor={`${idBase}-low`} className="sr-only">
          {label}, low estimate in hours
        </label>
        <input
          id={`${idBase}-low`}
          type="number"
          inputMode="numeric"
          min={0}
          max={400}
          value={String(value.low)}
          onChange={(event) => {
            const parsed = Number(event.target.value);
            onChange({
              ...value,
              low: Number.isFinite(parsed) ? clamp(parsed, 0, 400) : 0,
            });
          }}
          className="w-16 rounded-[var(--radius-sm)] border border-[var(--color-hairline-light)] bg-[var(--color-white)] px-2 py-1.5 text-sm tabular-nums outline-none focus:border-[var(--color-ink)] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
        />
        <span aria-hidden="true" className="text-[var(--color-mute)]">
          &ndash;
        </span>
        <label htmlFor={`${idBase}-high`} className="sr-only">
          {label}, high estimate in hours
        </label>
        <input
          id={`${idBase}-high`}
          type="number"
          inputMode="numeric"
          min={0}
          max={400}
          value={String(value.high)}
          onChange={(event) => {
            const parsed = Number(event.target.value);
            onChange({
              ...value,
              high: Number.isFinite(parsed) ? clamp(parsed, 0, 400) : 0,
            });
          }}
          className="w-16 rounded-[var(--radius-sm)] border border-[var(--color-hairline-light)] bg-[var(--color-white)] px-2 py-1.5 text-sm tabular-nums outline-none focus:border-[var(--color-ink)] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>
      <span aria-hidden="true" className="text-xs text-[var(--color-mute)] w-8">
        hrs
      </span>
    </div>
  );
}

const CARD_BASE =
  "relative flex cursor-pointer gap-3 rounded-[var(--radius-md)] border p-4 transition-colors duration-[var(--duration-fast)]";

/* ────────────────────────────────────────────────────────────────────────────
   PAGE
   ──────────────────────────────────────────────────────────────────────────── */

export function MvpCostEstimatorContent() {
  const shouldReduceMotion = useReducedMotion();

  const [platform, setPlatform] = useState<Platform>(DEFAULTS.platform);
  const [features, setFeatures] = useState<FeatureId[]>(DEFAULTS.features);
  const [design, setDesign] = useState<DesignTier>(DEFAULTS.design);
  const [coreSurfaces, setCoreSurfaces] = useState(DEFAULTS.coreSurfaces);
  const [hoursPerSurface, setHoursPerSurface] = useState<Band>(
    DEFAULTS.hoursPerSurface
  );
  const [featureHours, setFeatureHours] = useState<Record<FeatureId, Band>>(
    DEFAULTS.featureHours
  );
  const [blendedRate, setBlendedRate] = useState(DEFAULTS.blendedRate);
  const [qaPct, setQaPct] = useState(Math.round(DEFAULTS.qaPct * 100));
  const [contingencyPct, setContingencyPct] = useState(
    Math.round(DEFAULTS.contingencyPct * 100)
  );
  const [maintenancePct, setMaintenancePct] = useState(
    Math.round(DEFAULTS.maintenancePct * 100)
  );
  const [environmentHours, setEnvironmentHours] = useState<Band>(
    DEFAULTS.environmentHours
  );
  const [deployHours, setDeployHours] = useState<Band>(DEFAULTS.deployHours);

  const result = useMemo(
    () =>
      estimate({
        platform,
        features,
        design,
        coreSurfaces,
        hoursPerSurface,
        featureHours,
        blendedRate,
        discoveryPct: DEFAULTS.discoveryPct,
        qaPct: qaPct / 100,
        environmentHours,
        deployHours,
        contingencyPct: contingencyPct / 100,
        maintenancePct: maintenancePct / 100,
      }),
    [
      platform,
      features,
      design,
      coreSurfaces,
      hoursPerSurface,
      featureHours,
      blendedRate,
      qaPct,
      environmentHours,
      deployHours,
      contingencyPct,
      maintenancePct,
    ]
  );

  const reset = () => {
    setPlatform(DEFAULTS.platform);
    setFeatures(DEFAULTS.features);
    setDesign(DEFAULTS.design);
    setCoreSurfaces(DEFAULTS.coreSurfaces);
    setHoursPerSurface(DEFAULTS.hoursPerSurface);
    setFeatureHours(DEFAULTS.featureHours);
    setBlendedRate(DEFAULTS.blendedRate);
    setQaPct(Math.round(DEFAULTS.qaPct * 100));
    setContingencyPct(Math.round(DEFAULTS.contingencyPct * 100));
    setMaintenancePct(Math.round(DEFAULTS.maintenancePct * 100));
    setEnvironmentHours(DEFAULTS.environmentHours);
    setDeployHours(DEFAULTS.deployHours);
  };

  const toggleFeature = (id: FeatureId) => {
    setFeatures((current) =>
      current.includes(id)
        ? current.filter((entry) => entry !== id)
        : [...current, id]
    );
  };

  // Guardrails, not gates. The first fires on the midpoint rather than the low
  // end, because a wide range whose bottom is $56k is still not an MVP.
  const tooBig = (result.total.low + result.total.high) / 2 > 60000;
  const tooSmall = result.total.high < 2500;

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <Section variant="light" className="pt-40 lg:pt-48 pb-0">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Tools", href: "/tools" },
            { label: "MVP cost estimator" },
          ]}
        />

        <motion.p
          className="text-xs uppercase tracking-[0.2em] text-[var(--color-mute)] mb-5 font-medium"
          data-reveal="y10"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, ease: EASE.standard }}
        >
          Free tool &middot; No email required
        </motion.p>

        <motion.h1
          className="text-display-xl max-w-[15ch]"
          data-reveal="y40"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slower, ease: EASE.standard }}
        >
          MVP cost estimator
        </motion.h1>

        <motion.div
          className="mt-10 max-w-[68ch] space-y-6 text-base lg:text-lg leading-[1.75] text-[var(--color-ink)]/85"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, ease: EASE.standard, delay: 0.12 }}
        >
          <p>
            Every other MVP calculator on this search result asks for a work
            email and promises a number by tomorrow. This one shows the number
            as you type, shows every line that produced it, and lets you change
            the assumptions underneath. There is no form. There is nothing to
            unlock. Nothing you enter leaves your browser, because nothing is
            sent anywhere.
          </p>
          <p>
            The model is the one from our piece on{" "}
            <Link
              href="/insights/mvp-development-cost"
              className="underline underline-offset-4 decoration-[var(--color-ink)]/30 hover:decoration-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]"
            >
              what building an MVP actually costs
            </Link>
            : count your surfaces, multiply by a rate, then add the four costs
            that sit outside the build. Read that first if you want the
            reasoning. Use this to run the arithmetic.
          </p>
        </motion.div>

        <noscript>
          <p className="mt-8 max-w-[68ch] rounded-[var(--radius-md)] border border-[var(--color-hairline-light)] bg-[var(--color-white)] p-5 text-sm leading-relaxed">
            The calculator needs JavaScript to run. The model it uses, the
            default hour bands, and the four costs it accounts for are all
            written out in the sections below, so you can do the same arithmetic
            on paper.
          </p>
        </noscript>
      </Section>

      {/* ── Calculator ─────────────────────────────────────────────────── */}
      <Section variant="light" className="pt-16 lg:pt-20">
        <motion.div
          className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, ease: EASE.standard }}
        >
          {/* ── Inputs ── */}
          <form
            className="space-y-10"
            aria-label="MVP cost estimator inputs"
            onSubmit={(event) => event.preventDefault()}
          >
            <fieldset className="border-0 p-0 m-0">
              <legend className="text-xs uppercase tracking-[0.2em] text-[var(--color-mute)] font-medium mb-4">
                1. What are you building
              </legend>
              <div className="grid gap-3 sm:grid-cols-3">
                {PLATFORMS.map((option) => {
                  const active = platform === option.id;
                  return (
                    <label
                      key={option.id}
                      className={`${CARD_BASE} flex-col ${
                        active
                          ? "border-[var(--color-ink)] bg-[var(--color-white)]"
                          : "border-[var(--color-hairline-light)] bg-transparent hover:border-[var(--color-mute)]"
                      } has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--color-yellow)]`}
                    >
                      <input
                        type="radio"
                        name="platform"
                        value={option.id}
                        checked={active}
                        onChange={() => setPlatform(option.id)}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium">{option.label}</span>
                      <span className="text-xs leading-relaxed text-[var(--color-mute)]">
                        {option.note}
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="border-0 p-0 m-0">
              <legend className="text-xs uppercase tracking-[0.2em] text-[var(--color-mute)] font-medium mb-2">
                2. Feature areas
              </legend>
              <p
                id="features-hint"
                className="text-sm text-[var(--color-mute)] mb-4 max-w-[52ch]"
              >
                Hour bands are shown on each. They are the defaults, and you can
                change every one of them further down.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {FEATURES.map((feature) => {
                  const active = features.includes(feature.id);
                  const band = featureHours[feature.id];
                  return (
                    <label
                      key={feature.id}
                      className={`${CARD_BASE} items-start ${
                        active
                          ? "border-[var(--color-ink)] bg-[var(--color-white)]"
                          : "border-[var(--color-hairline-light)] bg-transparent hover:border-[var(--color-mute)]"
                      } has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--color-yellow)]`}
                    >
                      <input
                        type="checkbox"
                        checked={active}
                        onChange={() => toggleFeature(feature.id)}
                        aria-describedby="features-hint"
                        className="mt-0.5 h-4 w-4 flex-shrink-0 accent-[var(--color-ink)]"
                      />
                      <span className="min-w-0">
                        <span className="block text-sm font-medium">
                          {feature.label}
                        </span>
                        <span className="mt-1 block text-xs leading-relaxed text-[var(--color-mute)]">
                          {feature.note}
                        </span>
                        <span className="mt-2 block text-xs font-medium tabular-nums text-[var(--color-ink)]/60">
                          {band.low}&ndash;{band.high} hrs
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="border-0 p-0 m-0">
              <legend className="text-xs uppercase tracking-[0.2em] text-[var(--color-mute)] font-medium mb-4">
                3. Design
              </legend>
              <div className="grid gap-3 sm:grid-cols-3">
                {DESIGN_TIERS.map((tier) => {
                  const active = design === tier.id;
                  return (
                    <label
                      key={tier.id}
                      className={`${CARD_BASE} flex-col ${
                        active
                          ? "border-[var(--color-ink)] bg-[var(--color-white)]"
                          : "border-[var(--color-hairline-light)] bg-transparent hover:border-[var(--color-mute)]"
                      } has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--color-yellow)]`}
                    >
                      <input
                        type="radio"
                        name="design"
                        value={tier.id}
                        checked={active}
                        onChange={() => setDesign(tier.id)}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium">{tier.label}</span>
                      <span className="text-xs leading-relaxed text-[var(--color-mute)]">
                        {tier.note}
                      </span>
                      <span className="mt-1 text-xs font-medium tabular-nums text-[var(--color-ink)]/60">
                        {Math.round(DESIGN_SHARE[tier.id] * 100)}% of build
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="border-0 p-0 m-0">
              <legend className="text-xs uppercase tracking-[0.2em] text-[var(--color-mute)] font-medium mb-2">
                4. Assumptions
              </legend>
              <p
                id="assumptions-hint"
                className="text-sm text-[var(--color-mute)] mb-5 max-w-[56ch]"
              >
                Published, and editable. Nothing here is hidden inside the
                model. The blended rate default of {moneyExact(DEFAULTS.blendedRate)} an hour is
                a market figure for a South and Southeast Asia agency, not a
                quote from us.
              </p>

              <div className="grid gap-5 sm:grid-cols-2">
                <NumberField
                  id="blended-rate"
                  label="Blended hourly rate"
                  value={blendedRate}
                  onChange={setBlendedRate}
                  min={15}
                  max={400}
                  step={5}
                  prefix="$"
                  suffix="/ hr"
                  describedBy="assumptions-hint"
                />
                <NumberField
                  id="core-surfaces"
                  label="Core product surfaces"
                  value={coreSurfaces}
                  onChange={setCoreSurfaces}
                  min={1}
                  max={60}
                  suffix="screens"
                  describedBy="core-surfaces-hint"
                />
                <p
                  id="core-surfaces-hint"
                  className="text-xs leading-relaxed text-[var(--color-mute)] sm:col-span-2 -mt-2"
                >
                  Screens unique to your product, not counted in the feature
                  areas above. Most MVPs are 12 to 25 surfaces in total once the
                  feature areas are added in.
                </p>
                <NumberField
                  id="qa-pct"
                  label="QA, as a share of build hours"
                  value={qaPct}
                  onChange={setQaPct}
                  min={0}
                  max={40}
                  suffix="%"
                />
                <NumberField
                  id="contingency-pct"
                  label="Contingency"
                  value={contingencyPct}
                  onChange={setContingencyPct}
                  min={0}
                  max={40}
                  suffix="%"
                  describedBy="contingency-hint"
                />
                <p
                  id="contingency-hint"
                  className="text-xs leading-relaxed text-[var(--color-mute)] sm:col-span-2 -mt-2"
                >
                  Low by design. The spread between the low and high column
                  already carries most of the uncertainty. A fixed-price bid
                  collapses that spread into a single number, which is why a
                  fixed price typically buries 25 to 40 percent contingency
                  instead.
                </p>
                <NumberField
                  id="maintenance-pct"
                  label="First-year maintenance, share of build"
                  value={maintenancePct}
                  onChange={setMaintenancePct}
                  min={0}
                  max={40}
                  suffix="%"
                />
              </div>

              <details className="mt-6 rounded-[var(--radius-md)] border border-[var(--color-hairline-light)] bg-[var(--color-white)]">
                <summary className="cursor-pointer list-none px-5 py-4 text-sm font-medium [&::-webkit-details-marker]:hidden">
                  Edit the hours behind every line
                  <span className="ml-2 font-normal text-[var(--color-mute)]">
                    (low &ndash; high, per feature area)
                  </span>
                </summary>
                <div className="border-t border-[var(--color-hairline-light)] px-5 py-3">
                  <BandField
                    idBase="hours-surface"
                    label="Hours per core product surface"
                    value={hoursPerSurface}
                    onChange={setHoursPerSurface}
                  />
                  {FEATURES.map((feature) => (
                    <BandField
                      key={feature.id}
                      idBase={`hours-${feature.id}`}
                      label={feature.label}
                      value={featureHours[feature.id]}
                      onChange={(band) =>
                        setFeatureHours((current) => ({
                          ...current,
                          [feature.id]: band,
                        }))
                      }
                    />
                  ))}
                  <BandField
                    idBase="hours-environments"
                    label="Environment setup"
                    value={environmentHours}
                    onChange={setEnvironmentHours}
                  />
                  <BandField
                    idBase="hours-deploy"
                    label="Deploy and handover"
                    value={deployHours}
                    onChange={setDeployHours}
                  />
                </div>
              </details>

              <button
                type="button"
                onClick={reset}
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-mute)] underline underline-offset-4 decoration-[var(--color-mute)]/40 hover:text-[var(--color-ink)] hover:decoration-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]"
              >
                <RotateCcw size={14} aria-hidden="true" />
                Reset every assumption to its default
              </button>
            </fieldset>
          </form>

          {/* ── Output ── */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[var(--radius-lg)] bg-[var(--color-ink)] text-[var(--color-offwhite)] p-6 sm:p-8">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-offwhite)]/50 font-medium">
                Estimated build cost
              </p>
              {/* A polite live region on the headline only. Announcing the
                  whole table on every keystroke would make the tool unusable
                  with a screen reader; the table itself is read on demand. */}
              <output
                aria-live="polite"
                className="mt-3 block text-display-lg tabular-nums leading-none"
              >
                {moneyRange(result.total)}
              </output>
              <p className="mt-4 text-sm leading-relaxed text-[var(--color-offwhite)]/60">
                {hourRange(result.labourHours)} hours at{" "}
                {moneyExact(blendedRate)} an hour, plus {contingencyPct}%
                contingency. Rounded to the nearest hundred, because a build
                estimate accurate to the dollar is a build estimate that is
                lying to you.
              </p>

              {tooBig ? (
                <p className="mt-5 rounded-[var(--radius-md)] border border-[var(--color-yellow)]/40 bg-[var(--color-yellow)]/10 p-4 text-sm leading-relaxed">
                  Past roughly $60,000 this has stopped being an MVP and become
                  a first release. That is a legitimate thing to build, but it
                  is not a way to find out cheaply whether anyone wants the
                  product. Try unchecking the two features you would defend
                  least in a room.
                </p>
              ) : null}
              {tooSmall ? (
                <p className="mt-5 rounded-[var(--radius-md)] border border-[var(--color-yellow)]/40 bg-[var(--color-yellow)]/10 p-4 text-sm leading-relaxed">
                  This lands under our published $2,500 minimum engagement. At
                  this size a good freelancer serves you better than a studio,
                  and we will say so on the call.
                </p>
              ) : null}

              <div className="mt-8 overflow-x-auto">
                <table className="w-full min-w-[420px] border-collapse text-left text-sm">
                  <caption className="sr-only">
                    Line-by-line breakdown of the estimated build cost, showing
                    hours and cost as a low-to-high range for each item.
                  </caption>
                  <thead>
                    <tr className="border-b border-[var(--color-hairline-dark)]">
                      <th
                        scope="col"
                        className="pb-3 pr-3 text-xs uppercase tracking-[0.14em] font-medium text-[var(--color-offwhite)]/50"
                      >
                        Line item
                      </th>
                      <th
                        scope="col"
                        className="pb-3 px-3 text-right text-xs uppercase tracking-[0.14em] font-medium text-[var(--color-offwhite)]/50"
                      >
                        Hours
                      </th>
                      <th
                        scope="col"
                        className="pb-3 pl-3 text-right text-xs uppercase tracking-[0.14em] font-medium text-[var(--color-offwhite)]/50"
                      >
                        Cost
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.lines.map((line) => (
                      <tr
                        key={line.id}
                        className="border-b border-[var(--color-hairline-dark)] align-top"
                      >
                        <th scope="row" className="py-4 pr-3 font-normal">
                          <span className="block text-[11px] uppercase tracking-[0.14em] text-[var(--color-offwhite)]/40">
                            {line.group}
                          </span>
                          <span className="mt-1 block font-medium">
                            {line.label}
                          </span>
                          <span className="mt-1.5 block text-xs leading-relaxed text-[var(--color-offwhite)]/50">
                            {line.note}
                          </span>
                        </th>
                        <td className="py-4 px-3 text-right tabular-nums whitespace-nowrap text-[var(--color-offwhite)]/70">
                          {hourRange(line.hours)}
                        </td>
                        <td className="py-4 pl-3 text-right tabular-nums whitespace-nowrap">
                          {moneyRange(line.cost)}
                        </td>
                      </tr>
                    ))}
                    <tr className="border-b border-[var(--color-hairline-dark)]">
                      <th scope="row" className="py-4 pr-3 font-medium">
                        Labour subtotal
                      </th>
                      <td className="py-4 px-3 text-right tabular-nums whitespace-nowrap text-[var(--color-offwhite)]/70">
                        {hourRange(result.labourHours)}
                      </td>
                      <td className="py-4 pl-3 text-right tabular-nums whitespace-nowrap">
                        {moneyRange(result.labourCost)}
                      </td>
                    </tr>
                    <tr className="border-b border-[var(--color-hairline-dark)]">
                      <th scope="row" className="py-4 pr-3 font-medium">
                        Contingency
                        <span className="ml-2 font-normal text-[var(--color-offwhite)]/50">
                          {contingencyPct}%
                        </span>
                      </th>
                      <td className="py-4 px-3 text-right text-[var(--color-offwhite)]/40">
                        &mdash;
                      </td>
                      <td className="py-4 pl-3 text-right tabular-nums whitespace-nowrap">
                        {moneyRange(result.contingency)}
                      </td>
                    </tr>
                    <tr>
                      <th
                        scope="row"
                        className="py-4 pr-3 text-base font-medium text-[var(--color-yellow)]"
                      >
                        Build total
                      </th>
                      <td className="py-4 px-3 text-right text-[var(--color-offwhite)]/40">
                        &mdash;
                      </td>
                      <td className="py-4 pl-3 text-right text-base font-medium tabular-nums whitespace-nowrap text-[var(--color-yellow)]">
                        {moneyRange(result.total)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── What sits outside the build ── */}
            <div className="mt-6 rounded-[var(--radius-lg)] border border-[var(--color-hairline-light)] bg-[var(--color-white)] p-6 sm:p-8">
              <h2 className="text-display-sm">
                What the build number leaves out
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-mute)]">
                None of this is fraud. These costs sit outside the build, which
                is why they sit outside most build quotes, and why founders meet
                them one at a time after signing.
              </p>
              <dl className="mt-6 space-y-5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-[var(--color-hairline-light)] pt-5">
                  <dt className="text-sm font-medium">
                    Third-party running costs, year one
                    <span className="mt-1 block text-xs font-normal leading-relaxed text-[var(--color-mute)]">
                      Managed auth, payments, transactional email, error
                      monitoring, hosting with a managed database. Monthly from
                      day one, forever.
                      {features.includes("ai")
                        ? " Model tokens are on top, and they are priced per user action rather than per month."
                        : ""}
                    </span>
                  </dt>
                  <dd className="text-sm font-medium tabular-nums whitespace-nowrap">
                    {moneyRange(result.runningCostYearOne)}
                  </dd>
                </div>
                {result.storeFeesYearOne.high > 0 ? (
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-[var(--color-hairline-light)] pt-5">
                    <dt className="text-sm font-medium">
                      App store fees, year one
                      <span className="mt-1 block text-xs font-normal leading-relaxed text-[var(--color-mute)]">
                        Apple Developer at $99 a year, Google Play at $25 once.
                        The trivial part. The real cost is two calendar weeks
                        between the app being finished and the app being
                        downloadable, which is latency rather than work.
                      </span>
                    </dt>
                    <dd className="text-sm font-medium tabular-nums whitespace-nowrap">
                      {moneyExact(result.storeFeesYearOne.low)}
                    </dd>
                  </div>
                ) : null}
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-[var(--color-hairline-light)] pt-5">
                  <dt className="text-sm font-medium">
                    Maintenance, year one
                    <span className="mt-1 block text-xs font-normal leading-relaxed text-[var(--color-mute)]">
                      {maintenancePct}% of build cost, starting the month after
                      launch. Breaking dependency majors, OS versions dropping
                      support, store policy changes, security patches. A quote
                      that never mentions month thirteen is a quote that ends at
                      month twelve.
                    </span>
                  </dt>
                  <dd className="text-sm font-medium tabular-nums whitespace-nowrap">
                    {moneyRange(result.maintenanceYearOne)}
                  </dd>
                </div>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-[var(--color-ink)] pt-5">
                  <dt className="text-base font-medium">
                    Total first-year cost of ownership
                  </dt>
                  <dd className="text-base font-medium tabular-nums whitespace-nowrap">
                    {moneyRange(result.firstYearTotal)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </motion.div>
      </Section>

      {/* ── Limitations ────────────────────────────────────────────────── */}
      <Section variant="dark" noise>
        <motion.h2
          className="text-display-lg max-w-[20ch]"
          data-reveal="y30"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, ease: EASE.standard }}
        >
          What this cannot do
        </motion.h2>
        <motion.div
          className="mt-10 grid gap-8 md:grid-cols-3"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, ease: EASE.standard, delay: 0.1 }}
        >
          <div className="border-t border-[var(--color-hairline-dark)] pt-6">
            <h3 className="text-display-sm mb-3">It cannot scope anything</h3>
            <p className="text-sm lg:text-base leading-relaxed text-[var(--color-offwhite)]/60">
              A checkbox labelled &ldquo;payments&rdquo; is not a specification.
              One team reads that word as a Stripe checkout link; another reads
              it as multi-currency, proration, dunning and a tax engine. This
              tool prices the first reading. Scope is a conversation, and it is
              the conversation that sets the number.
            </p>
          </div>
          <div className="border-t border-[var(--color-hairline-dark)] pt-6">
            <h3 className="text-display-sm mb-3">
              It is a sanity check, not a quote
            </h3>
            <p className="text-sm lg:text-base leading-relaxed text-[var(--color-offwhite)]/60">
              Use it on a quote you have already been handed. If the two numbers
              are in the same neighbourhood, the quote is at least internally
              coherent. If they are a factor apart, you now know which line to
              ask about. Nothing here binds anyone, including us.
            </p>
          </div>
          <div className="border-t border-[var(--color-hairline-dark)] pt-6">
            <h3 className="text-display-sm mb-3">The defaults are ours</h3>
            <p className="text-sm lg:text-base leading-relaxed text-[var(--color-offwhite)]/60">
              The hour bands come from how we have seen these surfaces get
              built, not from an industry survey, and they are calibrated so a
              conventional brief lands inside our own posted price bands. A
              studio with different senior-to-junior ratios would defend
              different numbers. Change them.
            </p>
          </div>
        </motion.div>
      </Section>

      {/* ── Guidance prose ─────────────────────────────────────────────── */}
      <Section variant="light">
        <motion.h2
          className="text-display-lg max-w-[22ch]"
          data-reveal="y30"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, ease: EASE.standard }}
        >
          How to actually use this number
        </motion.h2>

        <motion.div
          className="mt-10 max-w-[68ch] space-y-6 text-base lg:text-lg leading-[1.75] text-[var(--color-ink)]/85"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, ease: EASE.standard, delay: 0.1 }}
        >
          <p>
            The output is not a budget. It is a reference point you hold next to
            a real quote so that the conversation stops being about whether a
            number feels high and starts being about which line you disagree on.
            That shift is the entire value of the exercise.
          </p>

          <h3 className="text-display-sm pt-4">
            Comparing it against a quote you have been handed
          </h3>
          <p>
            Set the inputs to match the brief you actually sent, not the product
            you imagine in eighteen months. Then compare structure before you
            compare totals. Take the vendor&rsquo;s number, divide it by the
            hours in the table here, and see what hourly rate falls out. If that
            implied rate is far below the market band for wherever the team
            sits, the difference is not efficiency, it is hours they have not
            budgeted. If it is far above, ask what seniority you are buying and
            on which lines.
          </p>
          <p>
            A quote that lands inside this range and itemises differently is
            fine and often better informed than the model. A quote that lands
            inside the range as a single undifferentiated number is not fine.
            Ask for the six lines. A vendor who cannot defend a forty-hour QA
            line would rather you never saw it, and that reluctance is the
            signal.
          </p>

          <h3 className="text-display-sm pt-4">
            The four lines that quietly go missing
          </h3>
          <p>
            <strong>Environment setup.</strong> Staging and production, CI,
            secrets management, migrations, seed data, preview deployments.
            Twenty to forty hours of engineering that appears in no design mock.
            If you are told it is included, ask which number it is included
            inside; the answer is usually the build line, which is the line you
            were least equipped to check.
          </p>
          <p>
            <strong>Third-party running costs.</strong> These are monthly, not
            one-off, and they begin before you have a single paying user. They
            are not the vendor&rsquo;s to pay, which is exactly why nobody
            mentions them until the first invoice arrives from somebody else.
          </p>
          <p>
            <strong>Store and compliance overhead.</strong> The developer
            account fees are trivial. The privacy labels, the data safety form,
            the screenshots at every required size, the review notes and the
            first rejection are not, and none of it can be parallelised by
            adding people.
          </p>
          <p>
            <strong>Maintenance from month one.</strong> Fifteen to twenty
            percent of build cost a year is not a service upsell, it is the cost
            of the thing continuing to work. Software that nobody maintains does
            not hold still; it degrades, because everything underneath it moves.
          </p>

          <h3 className="text-display-sm pt-4">
            What a suspiciously low number usually means
          </h3>
          <p>
            A bid at a third of everything else on your desk is rarely a
            discovered efficiency. It is one of four things, and they are
            distinguishable if you ask.
          </p>
          <p>
            It may be a narrower reading of the same words &mdash; login as one
            line rather than eleven &mdash; in which case the gap reappears as
            change orders in week six. It may be missing lines, most often QA,
            project management and infrastructure, absorbed rather than removed.
            It may be a seniority swap, where the people in the pitch are not
            the people on the branch, which is the failure mode to watch for
            when you are{" "}
            <Link
              href="/insights/working-with-offshore-development-team"
              className="underline underline-offset-4 decoration-[var(--color-ink)]/30 hover:decoration-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]"
            >
              running an offshore engagement
            </Link>
            . Or it is a genuine rate difference, which is real and which we
            benefit from, and which still does not explain a factor of four on
            its own.
          </p>
          <p>
            The test that separates them costs one email. Send the low bidder
            the line-item table this tool produced and ask them to map their
            number onto it. A vendor who has thought about the work will
            disagree with specific rows and tell you why. A vendor who has not
            will restate the total.
          </p>

          <h3 className="text-display-sm pt-4">And then cut</h3>
          <p>
            If the number is bigger than the money you have, do not compress the
            timeline. Compression does not remove hours; it relocates them into
            the bug budget at a worse exchange rate. Cut surfaces instead. Untick
            the admin dashboard and watch what happens to the total &mdash; for
            most early products, a database client and a couple of scripts do
            that job for the first six months. That is a real reduction in
            hours, and it is reversible. A rushed launch is not.
          </p>
        </motion.div>
      </Section>

      {/* ── Related ────────────────────────────────────────────────────── */}
      <Section variant="light" className="pt-0">
        <motion.div
          className="border-t border-[var(--color-hairline-light)] pt-12"
          data-reveal="y20"
          initial={false}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: DURATION.slow, ease: EASE.standard }}
        >
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-mute)] font-medium mb-6">
            Keep reading
          </p>
          <ul className="grid gap-6 md:grid-cols-3">
            <li>
              <Link
                href="/insights/mvp-development-cost"
                className="group block border-t border-[var(--color-ink)] pt-4"
              >
                <span className="block text-base font-medium group-hover:text-[var(--color-yellow)] transition-colors duration-[var(--duration-fast)]">
                  What building an MVP actually costs
                </span>
                <span className="mt-2 block text-sm text-[var(--color-mute)]">
                  The reasoning behind every default in this calculator, at
                  length.
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/services/web-development"
                className="group block border-t border-[var(--color-ink)] pt-4"
              >
                <span className="block text-base font-medium group-hover:text-[var(--color-yellow)] transition-colors duration-[var(--duration-fast)]">
                  Next.js web application development
                </span>
                <span className="mt-2 block text-sm text-[var(--color-mute)]">
                  What we build on the web, and the posted bands these defaults
                  are calibrated against.
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/services/mobile-app-development"
                className="group block border-t border-[var(--color-ink)] pt-4"
              >
                <span className="block text-base font-medium group-hover:text-[var(--color-yellow)] transition-colors duration-[var(--duration-fast)]">
                  Cross-platform mobile app development
                </span>
                <span className="mt-2 block text-sm text-[var(--color-mute)]">
                  Why the mobile multiplier exists, and what the app stores add
                  to a timeline.
                </span>
              </Link>
            </li>
          </ul>
        </motion.div>
      </Section>

      {/* ── CTA ────────────────────────────────────────────────────────── */}
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
            Now get a real number.
          </motion.h2>
          <motion.p
            className="text-lg text-[var(--color-ink)]/70 mb-10 max-w-xl mx-auto"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ delay: 0.15, duration: DURATION.slow }}
          >
            A calculator cannot ask you the question that changes the estimate.
            Send us what you are building and what it has to do by when. A real
            quote follows a discovery conversation, and you keep the output
            either way.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
            data-reveal="y20"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ delay: 0.25, duration: DURATION.slow, ease: EASE.standard }}
          >
            <ButtonLink
              href="/contact"
              size="lg"
              className="bg-[var(--color-ink)] text-[var(--color-yellow)] before:bg-[var(--color-offwhite)] hover:text-[var(--color-ink)]"
            >
              <span>Talk to us about the build</span>
            </ButtonLink>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-base font-medium underline underline-offset-4 decoration-[var(--color-ink)]/30 hover:decoration-[var(--color-ink)] transition-colors duration-[var(--duration-fast)]"
            >
              See what each service costs
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </motion.div>
        </div>
      </Section>
    </>
  );
}
