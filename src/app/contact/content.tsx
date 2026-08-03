"use client";

import { useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { CONTACT } from "@/lib/constants";
import { DURATION, EASE, viewportOnce } from "@/lib/motion";
import { Phone, Mail, MapPin, Check } from "lucide-react";

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

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    // TODO: Wire to Resend, Formspree, or Next.js API route
    // POST to /api/contact with form data
    setSubmitted(true);
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
          {/* Left: Form */}
          <div>
            <motion.h1
              className="text-display-xl mb-4"
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow }}
            >
              Let&rsquo;s build something.
            </motion.h1>
            <motion.p
              className="text-[var(--color-mute)] mb-10"
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: DURATION.slow, delay: 0.1 }}
            >
              Tell us about your project. We&rsquo;ll get back to you within
              24 hours.
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
                <p className="text-sm text-[var(--color-mute)]">
                  We&rsquo;ll be in touch soon.
                </p>
              </motion.div>
            ) : (
              <motion.form
                onSubmit={handleSubmit}
                className="space-y-5"
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
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
                    placeholder="Tell us about your project — what you need, timeline, and any other details."
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

                <Button type="submit" size="lg" className="w-full sm:w-auto mt-2">
                  <span>Send message</span>
                </Button>
              </motion.form>
            )}
          </div>

          {/* Right: Contact info */}
          <motion.div
            className="lg:pt-24"
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
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

            <div className="mt-12 p-5 rounded-[var(--radius-md)] bg-[var(--color-ink)]/[0.03] border border-[var(--color-hairline-light)]">
              <p className="text-sm text-[var(--color-mute)]">
                <span className="text-[var(--color-ink)] font-medium">
                  Typical response time:
                </span>{" "}
                within 24 hours on business days.
              </p>
            </div>
          </motion.div>
        </div>
      </Section>
    </>
  );
}
