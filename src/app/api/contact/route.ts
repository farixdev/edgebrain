import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const RECIPIENTS = [
  "edgebrainstudios@gmail.com",
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, company, details, budget } = body;

    if (!name?.trim() || !email?.trim() || !details?.trim()) {
      return NextResponse.json(
        { error: "Name, email, and project details are required." },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const htmlBody = `
      <h2>New Project Inquiry</h2>
      <table style="border-collapse:collapse;width:100%;max-width:600px;">
        <tr><td style="padding:8px 12px;font-weight:bold;border-bottom:1px solid #eee;">Name</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${escapeHtml(name)}</td></tr>
        <tr><td style="padding:8px 12px;font-weight:bold;border-bottom:1px solid #eee;">Email</td><td style="padding:8px 12px;border-bottom:1px solid #eee;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
        ${company ? `<tr><td style="padding:8px 12px;font-weight:bold;border-bottom:1px solid #eee;">Company</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${escapeHtml(company)}</td></tr>` : ""}
        ${budget ? `<tr><td style="padding:8px 12px;font-weight:bold;border-bottom:1px solid #eee;">Budget</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${escapeHtml(budget)}</td></tr>` : ""}
        <tr><td style="padding:8px 12px;font-weight:bold;vertical-align:top;">Details</td><td style="padding:8px 12px;white-space:pre-wrap;">${escapeHtml(details)}</td></tr>
      </table>
    `;

    await transporter.sendMail({
      from: `"EdgeBrain Studios" <${process.env.GMAIL_USER}>`,
      to: RECIPIENTS.join(", "),
      replyTo: email,
      subject: `New Project Inquiry from ${name}`,
      html: htmlBody,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
