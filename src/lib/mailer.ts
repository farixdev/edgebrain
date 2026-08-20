/**
 * The single outbound-email path.
 *
 * The contact form, the chat escalation notice, and anything else that needs
 * to reach the owner all go through `sendMail`. Nothing else should call
 * `nodemailer.createTransport` — one transport, one from-address, one place to
 * change when the mail provider changes.
 *
 * Credentials come from GMAIL_USER / GMAIL_APP_PASSWORD (a Gmail app password,
 * not the account password). If either is missing, `sendMail` throws with a
 * message that says which one, so a 500 is diagnosable from the log line.
 */

import nodemailer, { type Transporter } from "nodemailer";

/** Display name on every message we send. */
const FROM_NAME = "EdgeBrain Studios";

let cachedTransporter: Transporter | null = null;

/** True when both Gmail credentials are present. */
export function isMailConfigured(): boolean {
  return Boolean(
    process.env.GMAIL_USER?.trim() && process.env.GMAIL_APP_PASSWORD?.trim()
  );
}

/**
 * Created on first send, never at module load, so importing this file is safe
 * in a build with no mail credentials.
 */
function getTransporter(): Transporter {
  if (!isMailConfigured()) {
    const missing = [
      process.env.GMAIL_USER?.trim() ? null : "GMAIL_USER",
      process.env.GMAIL_APP_PASSWORD?.trim() ? null : "GMAIL_APP_PASSWORD",
    ]
      .filter(Boolean)
      .join(" and ");
    throw new Error(`Cannot send mail: ${missing} is not set.`);
  }

  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }
  return cachedTransporter;
}

export interface SendMailOptions {
  /** One address, or several — an array is joined into the To header. */
  to: string | string[];
  subject: string;
  /** Already-escaped HTML. Run any user-supplied value through `escapeHtml`. */
  html: string;
  /** Usually the visitor's address, so hitting Reply reaches them. */
  replyTo?: string;
  /** Optional plain-text alternative. */
  text?: string;
}

/**
 * Sends one message. Rejects on transport failure — callers decide whether
 * that is fatal (contact form: yes, return 500) or merely logged (chat
 * notification: yes, the message is already stored).
 */
export async function sendMail({
  to,
  subject,
  html,
  replyTo,
  text,
}: SendMailOptions): Promise<void> {
  const transporter = getTransporter();

  await transporter.sendMail({
    from: `"${FROM_NAME}" <${process.env.GMAIL_USER}>`,
    to: Array.isArray(to) ? to.join(", ") : to,
    replyTo,
    subject,
    html,
    text,
  });
}

/**
 * Minimal HTML escaping for values that land inside an email body.
 *
 * Covers the four characters that can break out of text content or an
 * attribute value. Not a sanitiser for rich input — everything we send is
 * plain text dropped into markup we wrote.
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
