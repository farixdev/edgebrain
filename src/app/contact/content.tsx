"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { CONTACT } from "@/lib/constants";
import { DURATION, EASE, viewportOnce } from "@/lib/motion";
import { Phone, Mail, MapPin, Check } from "lucide-react";

const NEXT_STEPS = [
  {
    number: "01",
    title: "A human reads it",
    timing: "Within 24 hours",
    body: "One of the two engineers who would build the thing, not a sales rep and not an autoresponder. If your message lands outside our hours, it is answered the next business morning in Lahore.",
  },
  {
    number: "02",
    title: "We scope it in writing",
    timing: "Within 2 business days",
    body: "You get a written scope, a fixed price, and a ship date. Where the brief is thin, we ask two or three specific questions rather than booking a call to extract them. If the work is not a fit for us, we say so and name someone who is better placed.",
  },
  {
    number: "03",
    title: "You decide, then we start",
    timing: "Kickoff within a week",
    body: "Approve the scope and we open the repo, the shared Slack channel, and a staging URL in week one. Payment runs 40% at kickoff, 40% at the midpoint build, and 20% at handover. Nothing is committed before you sign.",
  },
];

const WHAT_TO_INCLUDE = [
  {
    label: "What you are building, in one paragraph",
    body: "The product, who uses it, and the one job it has to do well. A link to a competitor doing something similar is worth more than a page of description.",
  },
  {
    label: "What already exists",
    body: "A repo, a Figma file, an API, a spreadsheet holding the whole business together, or nothing at all. All four are fine answers. It changes the estimate more than anything else you can tell us.",
  },
  {
    label: "Your deadline and what drives it",
    body: "A demo day, a funding round, a contract renewal, a competitor launch. The reason behind the date tells us what can be cut and what cannot.",
  },
  {
    label: "A budget range",
    body: "Even a rough band. It is not a negotiation tactic, it is how we tell you in the first reply whether we can build what you want for what you have, or which parts to stage across two phases.",
  },
];

interface FormData {
  name: string;
  email: string;
  company: string;
  details: string;
  budget: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  details?: string;
}

export function ContactPageContent() {
  const shouldReduceMotion = useReducedMotion();
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    details: "",
    budget: "",
  });

  function validate(): boolean {
    const newErrors: FormErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!form.details.trim())
      newErrors.details = "Tell us about your project.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSending(true);
    setSendError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Something went wrong.");
      }

      setSubmitted(true);
    } catch (err) {
      setSendError(
        err instanceof Error ? err.message : "Failed to send. Please try again."
      );
    } finally {
      setSending(false);
    }
  }

  function updateField(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field as keyof FormErrors];
        return next;
      });
    }
  }

  const inputStyles =
    "w-full bg-transparent border border-[var(--color-hairline-light)] rounded-[var(--radius-md)] px-4 py-3 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-mute)]/50 focus:outline-none focus:border-[var(--color-yellow)] focus:ring-1 focus:ring-[var(--color-yellow)] transition-colors";

  const errorStyles = "text-xs text-red-500 mt-1.5";

  return (
    <>
      <Section variant="light" className="pt-40 lg:pt-48">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
          {/* Left: Form */}
          <div>
            <motion.h1
              className="text-display-xl mb-4"
              data-reveal="y30"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow }}
            >
              Let&rsquo;s build something.
            </motion.h1>
            <motion.p
              className="text-[var(--color-mute)] mb-6"
              data-reveal="y20"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow, delay: 0.1 }}
            >
              Tell us what you&rsquo;re building. A senior engineer reads every
              message and replies within 24 hours on a business day. If the
              scope is clear enough to price, you get a fixed quote and a ship
              date within two business days.
            </motion.p>
            <motion.p
              className="text-sm text-[var(--color-mute)] mb-10 leading-relaxed"
              data-reveal="y20"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow, delay: 0.15 }}
            >
              No sales sequence, no discovery deck, no 20-minute call to
              qualify you. If we&rsquo;re the wrong fit, we&rsquo;ll say so in
              the first reply and point you somewhere better.
            </motion.p>

            {submitted ? (
              <motion.div
                className="flex flex-col items-center justify-center py-20 text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: DURATION.base, ease: EASE.standard }}
              >
                <div className="w-16 h-16 rounded-full bg-[var(--color-yellow)] flex items-center justify-center mb-6">
                  <Check size={28} className="text-[var(--color-ink)]" />
                </div>
                <h2 className="text-display-sm mb-2">Message sent.</h2>
                <p className="text-sm text-[var(--color-mute)] max-w-sm">
                  An engineer reads it and replies within 24 hours on a
                  business day. If the scope is clear, the reply includes a
                  fixed price and a ship date. Need it faster? Message us on
                  WhatsApp.
                </p>
              </motion.div>
            ) : (
              <motion.form
                onSubmit={handleSubmit}
                className="space-y-5"
                data-reveal="y20"
                initial={false}
                whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ duration: DURATION.slow, delay: 0.2 }}
              >
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs font-medium text-[var(--color-mute)] uppercase tracking-[0.1em] mb-2"
                  >
                    Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    className={inputStyles}
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  {errors.name && (
                    <p id="name-error" className={errorStyles}>
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-medium text-[var(--color-mute)] uppercase tracking-[0.1em] mb-2"
                  >
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    className={inputStyles}
                    placeholder="you@company.com"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email && (
                    <p id="email-error" className={errorStyles}>
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="company"
                    className="block text-xs font-medium text-[var(--color-mute)] uppercase tracking-[0.1em] mb-2"
                  >
                    Company (optional)
                  </label>
                  <input
                    id="company"
                    type="text"
                    className={inputStyles}
                    placeholder="Your company"
                    value={form.company}
                    onChange={(e) => updateField("company", e.target.value)}
                  />
                </div>

                <div>
                  <label
                    htmlFor="details"
                    className="block text-xs font-medium text-[var(--color-mute)] uppercase tracking-[0.1em] mb-2"
                  >
                    Project details *
                  </label>
                  <textarea
                    id="details"
                    rows={5}
                    className={`${inputStyles} resize-none`}
                    placeholder="What you are building, what already exists (repo, Figma, API, spreadsheet), and the deadline you are working to."
                    value={form.details}
                    onChange={(e) => updateField("details", e.target.value)}
                    aria-invalid={!!errors.details}
                    aria-describedby={
                      errors.details ? "details-error" : undefined
                    }
                  />
                  {errors.details && (
                    <p id="details-error" className={errorStyles}>
                      {errors.details}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="budget"
                    className="block text-xs font-medium text-[var(--color-mute)] uppercase tracking-[0.1em] mb-2"
                  >
                    Budget range (optional)
                  </label>
                  <select
                    id="budget"
                    className={`${inputStyles} appearance-none cursor-pointer`}
                    value={form.budget}
                    onChange={(e) => updateField("budget", e.target.value)}
                  >
                    <option value="">Select a range</option>
                    <option value="<5k">Under $5,000</option>
                    <option value="5k-15k">$5,000 – $15,000</option>
                    <option value="15k-50k">$15,000 – $50,000</option>
                    <option value="50k+">$50,000+</option>
                  </select>
                </div>

                {sendError && (
                  <p className="text-sm text-red-500">{sendError}</p>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full sm:w-auto mt-2"
                  disabled={sending}
                >
                  <span>{sending ? "Sending..." : "Send message"}</span>
                </Button>
              </motion.form>
            )}
          </div>

          {/* Right: Contact info */}
          <motion.div
            className="lg:pt-24"
            data-reveal="y30"
            initial={false}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: DURATION.slow, delay: 0.3 }}
          >
            <h2 className="text-xs uppercase tracking-[0.15em] text-[var(--color-mute)] mb-6 font-medium">
              Get in touch directly
            </h2>

            <div className="space-y-6">
              <a
                href={CONTACT.phoneTel}
                className="flex items-start gap-4 group"
              >
                <div className="w-10 h-10 rounded-full border border-[var(--color-hairline-light)] flex items-center justify-center group-hover:border-[var(--color-yellow)] transition-colors">
                  <Phone
                    size={16}
                    className="text-[var(--color-mute)] group-hover:text-[var(--color-yellow)] transition-colors"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium group-hover:text-[var(--color-yellow)] transition-colors">
                    {CONTACT.phone}
                  </p>
                  <p className="text-xs text-[var(--color-mute)]">Phone</p>
                </div>
              </a>

              <a
                href={CONTACT.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 group"
              >
                <div className="w-10 h-10 rounded-full border border-[var(--color-hairline-light)] flex items-center justify-center group-hover:border-[var(--color-yellow)] transition-colors">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-[var(--color-mute)] group-hover:text-[var(--color-yellow)] transition-colors"
                    aria-hidden="true"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium group-hover:text-[var(--color-yellow)] transition-colors">
                    WhatsApp
                  </p>
                  <p className="text-xs text-[var(--color-mute)]">Chat with us</p>
                </div>
              </a>

              <a
                href={`mailto:${CONTACT.email}`}
                className="flex items-start gap-4 group"
              >
                <div className="w-10 h-10 rounded-full border border-[var(--color-hairline-light)] flex items-center justify-center group-hover:border-[var(--color-yellow)] transition-colors">
                  <Mail
                    size={16}
                    className="text-[var(--color-mute)] group-hover:text-[var(--color-yellow)] transition-colors"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium group-hover:text-[var(--color-yellow)] transition-colors">
                    {CONTACT.email}
                  </p>
                  <p className="text-xs text-[var(--color-mute)]">Email</p>
                </div>
              </a>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full border border-[var(--color-hairline-light)] flex items-center justify-center">
                  <MapPin size={16} className="text-[var(--color-mute)]" />
                </div>
                <div>
                  <p className="text-sm font-medium">{CONTACT.location}</p>
                  <p className="text-xs text-[var(--color-mute)]">
                    Working worldwide
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-5 rounded-[var(--radius-md)] bg-[var(--color-ink)]/[0.03] border border-[var(--color-hairline-light)] space-y-3">
              <p className="text-sm text-[var(--color-mute)]">
                <span className="text-[var(--color-ink)] font-medium">
                  Response time:
                </span>{" "}
                within 24 hours on business days. Fixed quote within two
                business days once scope is clear.
              </p>
              <p className="text-sm text-[var(--color-mute)]">
                <span className="text-[var(--color-ink)] font-medium">
                  Overlap hours:
                </span>{" "}
                Lahore is UTC+5. We hold 6pm to 10pm local open every working
                day, which is 9am to 1pm in New York and a full working
                afternoon in London.
              </p>
              <p className="text-sm text-[var(--color-mute)]">
                <span className="text-[var(--color-ink)] font-medium">
                  In a hurry?
                </span>{" "}
                WhatsApp is the fastest route. Most messages get an answer the
                same day.
              </p>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* What happens next */}
      <Section variant="dark" noise>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-5">
            <motion.p
              className="text-xs uppercase tracking-[0.2em] text-[var(--color-yellow)] mb-4 font-medium"
              data-reveal="fade"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow }}
            >
              After you hit send
            </motion.p>
            <motion.h2
              className="text-display-lg"
              data-reveal="y30"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow, delay: 0.1 }}
            >
              Three steps, then a{" "}
              <span className="text-[var(--color-yellow)]">number</span>.
            </motion.h2>
            <motion.p
              className="mt-6 text-base text-[var(--color-offwhite)]/60 leading-relaxed max-w-md"
              data-reveal="y20"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow, delay: 0.2 }}
            >
              You are not entering a nurture campaign. The whole point of this
              form is to get you a scope, a price, and a date fast enough that
              you can compare us against the other two vendors on your list.
            </motion.p>
          </div>

          <div className="lg:col-span-7 space-y-0">
            {NEXT_STEPS.map((item, i) => (
              <motion.div
                key={item.title}
                className="border-t border-[var(--color-hairline-dark)] py-8 grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-6"
                data-reveal="y20"
                initial={false}
                whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{
                  duration: DURATION.slow,
                  ease: EASE.standard,
                  delay: i * 0.1,
                }}
              >
                <div className="sm:col-span-4">
                  <p className="text-sm text-[var(--color-yellow)] font-medium mb-1">
                    {item.number}
                  </p>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-xs uppercase tracking-[0.15em] text-[var(--color-mute)] mt-1">
                    {item.timing}
                  </p>
                </div>
                <p className="sm:col-span-8 text-sm lg:text-base text-[var(--color-offwhite)]/60 leading-relaxed">
                  {item.body}
                </p>
              </motion.div>
            ))}
            <div className="border-t border-[var(--color-hairline-dark)]" />
          </div>
        </div>

        {/* What to include */}
        <div className="mt-20 lg:mt-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-5">
            <motion.h2
              className="text-display-sm lg:text-display-md"
              data-reveal="y30"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow }}
            >
              Four lines that get you a real answer
            </motion.h2>
            <motion.p
              className="mt-4 text-sm lg:text-base text-[var(--color-offwhite)]/60 leading-relaxed max-w-md"
              data-reveal="y20"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow, delay: 0.1 }}
            >
              A three-word enquiry gets a reply asking for details, which costs
              us both two days. Include these four things and the first reply
              can carry an estimate instead of a question.
            </motion.p>
          </div>

          <ul className="lg:col-span-7 space-y-6">
            {WHAT_TO_INCLUDE.map((item, i) => (
              <motion.li
                key={item.label}
                className="border-t border-[var(--color-hairline-dark)] pt-6"
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
                <h3 className="text-base font-medium mb-2">{item.label}</h3>
                <p className="text-sm text-[var(--color-offwhite)]/60 leading-relaxed">
                  {item.body}
                </p>
              </motion.li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Local + worldwide */}
      <Section variant="light">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-5">
            <motion.p
              className="text-xs uppercase tracking-[0.2em] text-[var(--color-mute)] mb-4 font-medium"
              data-reveal="fade"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow }}
            >
              Where we are
            </motion.p>
            <motion.h2
              className="text-display-md"
              data-reveal="y30"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow, delay: 0.1 }}
            >
              A software house in Lahore. Most of our clients have never been
              here.
            </motion.h2>
          </div>

          <div className="lg:col-span-7 space-y-5 text-sm lg:text-base text-[var(--color-mute)] leading-relaxed">
            <motion.p
              data-reveal="y20"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow, delay: 0.1 }}
            >
              EdgeBrain Studios is a software company in Lahore, Pakistan. We
              work with founders in Karachi and Islamabad the same way we work
              with teams in London, Berlin, Toronto, Dubai, and across the US:
              a shared Slack channel, a staging URL, and a build note every
              Friday. If you are in Lahore and would rather meet in person, say
              so and we will find a coffee.
            </motion.p>
            <motion.p
              data-reveal="y20"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow, delay: 0.2 }}
            >
              People find us searching for a web development company in Lahore,
              an app development company in Lahore, or an AI automation company
              in Pakistan. They usually arrive with the same worry: whether
              outsourcing software development to Pakistan means late nights,
              vague invoices, and a codebase nobody at home can read. Our
              answer is structural. Fixed scope agreed before kickoff. Your IP
              from the first commit. Repo access on day one. Payment split 40 /
              40 / 20 across kickoff, midpoint, and handover, so neither side
              is ever more than one milestone exposed.
            </motion.p>
            <motion.p
              data-reveal="y20"
              initial={false}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow, delay: 0.3 }}
            >
              Hiring developers in Pakistan should cost you less than a Western
              agency and less risk than a marketplace. That is the whole
              proposition. Not sure which service you need yet? Start with{" "}
              <Link
                href="/services/web-development"
                className="text-[var(--color-ink)] font-medium underline underline-offset-4 decoration-[var(--color-yellow)] decoration-2"
              >
                Next.js web development
              </Link>
              ,{" "}
              <Link
                href="/services/mobile-app-development"
                className="text-[var(--color-ink)] font-medium underline underline-offset-4 decoration-[var(--color-yellow)] decoration-2"
              >
                React Native app development
              </Link>
              ,{" "}
              <Link
                href="/services/ai-automation"
                className="text-[var(--color-ink)] font-medium underline underline-offset-4 decoration-[var(--color-yellow)] decoration-2"
              >
                AI automation
              </Link>
              , or{" "}
              <Link
                href="/services/ai-consulting"
                className="text-[var(--color-ink)] font-medium underline underline-offset-4 decoration-[var(--color-yellow)] decoration-2"
              >
                AI integration consulting
              </Link>
              .
            </motion.p>
          </div>
        </div>
      </Section>
    </>
  );
}
