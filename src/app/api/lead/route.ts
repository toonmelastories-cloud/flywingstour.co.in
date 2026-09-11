import { NextResponse } from "next/server";
import {
  customerConfirmationEmail,
  leadAlertEmail,
  newsletterWelcomeEmail,
  type Lead,
  type LeadKind,
} from "@/lib/email/templates";
import { SALES_INBOX, isSmtpConfigured, sendEmail } from "@/lib/email/smtp";

/**
 * Delivers a website lead as a branded email.
 *
 * Sends the sales team an alert with one-tap Call and WhatsApp buttons,
 * and sends the customer a confirmation. Any non-2xx reply tells the
 * browser to fall back to FormSubmit (see src/lib/leadSubmit.ts), so a
 * missing password, a mail server outage or a timeout never loses a lead.
 */

const KINDS: LeadKind[] = ["contact", "inquiry", "fare", "newsletter"];

/** Trims and caps a field so a malformed post cannot bloat an email. */
function str(value: unknown, max = 120): string | undefined {
  if (typeof value !== "string") return undefined;
  const v = value.trim().slice(0, max);
  return v || undefined;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Per-instance throttle. The confirmation goes to whatever address a
 * visitor types, so without a limit a bot could use this form to mail
 * strangers. This is not a hard guarantee across serverless instances,
 * but it stops the naive loop, and the honeypot below stops the rest.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 6;
const hits = new Map<string, number[]>();

function throttled(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  if (!isSmtpConfigured()) {
    return NextResponse.json({ success: false, fallback: true, reason: "smtp-not-configured" }, { status: 503 });
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ success: false, fallback: true }, { status: 400 });

  // Honeypot: a hidden field real visitors never fill. Bots do. Report
  // success so the bot moves on, but send nothing.
  if (str(body.company)) return NextResponse.json({ success: true });

  const kind = str(body.kind) as LeadKind | undefined;
  if (!kind || !KINDS.includes(kind)) {
    return NextResponse.json({ success: false, fallback: true }, { status: 400 });
  }

  const lead: Lead = {
    kind,
    name: str(body.name, 80),
    phone: str(body.phone, 20),
    email: str(body.email, 100),
    destination: str(body.destination, 80),
    travelMonth: str(body.travelMonth, 40),
    route: str(body.route, 120),
    departure: str(body.departure, 40),
    returnDate: str(body.returnDate, 40),
    travellers: str(body.travellers, 10),
    source: str(body.source, 50),
    pageUrl: str(body.pageUrl, 300),
    landing_page: str(body.landing_page, 200),
    first_referrer: str(body.first_referrer, 300),
    utm_source: str(body.utm_source, 100),
    utm_medium: str(body.utm_medium, 100),
    utm_campaign: str(body.utm_campaign, 100),
  };

  const emailOk = lead.email ? EMAIL_RE.test(lead.email) : false;
  const valid =
    kind === "newsletter" ? emailOk : kind === "fare" ? Boolean(lead.phone) : Boolean(lead.phone) && emailOk;
  if (!valid) return NextResponse.json({ success: false, fallback: false, message: "Invalid details" }, { status: 400 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (throttled(ip)) {
    return NextResponse.json({ success: false, fallback: false, message: "Too many submissions" }, { status: 429 });
  }

  // The sales alert is the part that matters. If it fails, report
  // failure so the browser retries through FormSubmit.
  try {
    await sendEmail(SALES_INBOX, leadAlertEmail(lead), emailOk ? lead.email : undefined);
  } catch (err) {
    console.error("lead alert failed", err);
    return NextResponse.json({ success: false, fallback: true, reason: "smtp-send-failed" }, { status: 502 });
  }

  // The customer email is a courtesy. The lead is already safe, so a
  // failure here is logged and otherwise ignored.
  if (emailOk && lead.email) {
    const courtesy = kind === "newsletter" ? newsletterWelcomeEmail() : customerConfirmationEmail(lead);
    await sendEmail(lead.email, courtesy, SALES_INBOX).catch((err) =>
      console.error("customer email failed", err)
    );
  }

  return NextResponse.json({ success: true, delivered: "smtp" });
}
