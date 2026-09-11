/**
 * Sends email through the company's own Hostinger mailbox.
 *
 * Replaces FormSubmit as the primary delivery path because FormSubmit
 * only offers three fixed plain templates and no confirmation email to
 * the customer. Sending from sales@ also means the SPF, DKIM and DMARC
 * records already set on the domain vouch for every message, so the
 * customer confirmation lands in the inbox rather than spam.
 *
 * Configuration (Vercel env vars):
 *   SMTP_PASS   required. The sales@flywingstour.co.in mailbox password.
 *               Until it is set, isSmtpConfigured() is false and the forms
 *               fall back to FormSubmit, so nothing breaks in between.
 *   SMTP_USER   optional, defaults to sales@flywingstour.co.in
 *   SMTP_HOST   optional, defaults to smtp.hostinger.com
 *   SMTP_PORT   optional, defaults to 465 (implicit TLS)
 */

import nodemailer, { type Transporter } from "nodemailer";
import type { RenderedEmail } from "./templates";

const USER = process.env.SMTP_USER || "sales@flywingstour.co.in";
const PASS = process.env.SMTP_PASS;
const HOST = process.env.SMTP_HOST || "smtp.hostinger.com";
const PORT = Number(process.env.SMTP_PORT || 465);

export const SALES_INBOX = process.env.SALES_EMAIL || "sales@flywingstour.co.in";
const FROM = `"Flywings Tour & Packages" <${USER}>`;

export function isSmtpConfigured(): boolean {
  return Boolean(PASS);
}

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: HOST,
      port: PORT,
      secure: PORT === 465,
      auth: { user: USER, pass: PASS },
      // A slow mail server must not leave a visitor staring at a spinner.
      // If these trip, the route reports failure and the browser falls
      // back to FormSubmit.
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 12000,
    });
  }
  return transporter;
}

export async function sendEmail(
  to: string,
  email: RenderedEmail,
  replyTo?: string
): Promise<void> {
  await getTransporter().sendMail({
    from: FROM,
    to,
    replyTo: replyTo || undefined,
    subject: email.subject,
    html: email.html,
    text: email.text,
  });
}
