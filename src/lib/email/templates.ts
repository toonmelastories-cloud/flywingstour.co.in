/**
 * Branded HTML emails for website leads.
 *
 * Email HTML is its own dialect: table layout, inline styles, no web
 * fonts, no CSS the Outlook renderer ignores. Every template here keeps
 * to that so it reads the same in Gmail, Outlook, Apple Mail and on a
 * phone. The header is a text wordmark rather than the logo image,
 * because the logo is a WebP that Outlook desktop will not display and
 * many clients block remote images until the reader allows them.
 *
 * Everything a visitor typed goes through `esc()` before it reaches
 * HTML, so a form field cannot inject markup into the sales inbox.
 */

import { CONTACT, SITE_URL } from "@/lib/seo";

export type LeadKind = "contact" | "inquiry" | "fare" | "newsletter";

export interface Lead {
  kind: LeadKind;
  name?: string;
  phone?: string;
  email?: string;
  destination?: string;
  travelMonth?: string;
  route?: string;
  departure?: string;
  returnDate?: string;
  travellers?: string;
  source?: string;
  pageUrl?: string;
  landing_page?: string;
  first_referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

/* ─── Brand ─────────────────────────────────────────────────── */

const NAVY = "#0C1F36";
const NAVY_DARK = "#061323";
const GOLD = "#C9940D";
const GOLD_LIGHT = "#F1B827";
const INK = "#1E2A38";
const MUTED = "#5B6B7C";
const LINE = "#E4E8EE";
const GROUND = "#F3F5F8";
const WHATSAPP = "#1FA855";
const FONT = "-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

const HOURS = "Mon to Sat, 9:30 am to 6:30 pm";

/* ─── Helpers ───────────────────────────────────────────────── */

export function esc(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** "98765 43210", "098765...", "+91 98765..." → "919876543210" */
export function phoneDigits(phone: string | undefined): string {
  const d = (phone ?? "").replace(/\D/g, "");
  if (d.length === 10) return `91${d}`;
  if (d.length === 11 && d.startsWith("0")) return `91${d.slice(1)}`;
  return d;
}

function nowIST(): string {
  return new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

const SOURCE_LABELS: Record<string, string> = {
  "contact-page": "Contact page form",
  "inquiry-modal": "Plan Your Trip popup",
  "homepage-flight-search": "Homepage flight search",
  newsletter: "Footer newsletter",
};

function sourceLabel(source?: string): string {
  if (!source) return "Website";
  return SOURCE_LABELS[source] ?? source;
}

/** Where the visitor came from, in words the sales team can use. */
function cameFrom(lead: Lead): string {
  const utm = [lead.utm_source, lead.utm_medium, lead.utm_campaign].filter(Boolean).join(" / ");
  if (utm) return utm;
  const ref = lead.first_referrer;
  if (!ref || ref === "direct") return "Direct visit or bookmarked";
  try {
    const host = new URL(ref).hostname.replace(/^www\./, "");
    if (host.includes("google")) return "Google search";
    if (host.includes("bing")) return "Bing search";
    if (host.includes("facebook") || host.includes("instagram")) return `Social (${host})`;
    if (host.includes("flywingstour")) return "Internal page";
    return host;
  } catch {
    return ref;
  }
}

/* ─── Building blocks ───────────────────────────────────────── */

function shell(preheader: string, inner: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<title>Flywings Tour &amp; Packages</title>
</head>
<body style="margin:0;padding:0;background:${GROUND};">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:${GROUND};">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${GROUND};">
<tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:10px;overflow:hidden;border:1px solid ${LINE};">
${header()}
${inner}
${footer()}
</table>
</td></tr>
</table>
</body>
</html>`;
}

function header(): string {
  return `<tr><td style="background:${NAVY};padding:22px 28px;border-bottom:3px solid ${GOLD};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td style="font-family:${FONT};">
<div style="font-size:22px;font-weight:800;letter-spacing:3px;color:${GOLD_LIGHT};line-height:1;">FLYWINGS</div>
<div style="font-size:11px;letter-spacing:2px;color:#C7D2E0;text-transform:uppercase;margin-top:5px;">Tour &amp; Packages Pvt Ltd</div>
</td>
<td align="right" style="font-family:${FONT};font-size:11px;color:#8FA3BA;">Mohali &middot; since 2005</td>
</tr></table>
</td></tr>`;
}

function footer(): string {
  return `<tr><td style="background:${NAVY_DARK};padding:20px 28px;font-family:${FONT};font-size:12px;line-height:1.6;color:#8FA3BA;">
<strong style="color:#C7D2E0;">Flywings Tour &amp; Packages Pvt Ltd</strong><br>
${esc(CONTACT.streetAddress)}, ${esc(CONTACT.locality)}, ${esc(CONTACT.region)} ${esc(CONTACT.postalCode)}<br>
<a href="tel:${CONTACT.phoneE164}" style="color:${GOLD_LIGHT};text-decoration:none;">${esc(CONTACT.phoneDisplay)}</a> &middot;
<a href="mailto:${CONTACT.email}" style="color:${GOLD_LIGHT};text-decoration:none;">${esc(CONTACT.email)}</a> &middot;
<a href="${SITE_URL}/" style="color:${GOLD_LIGHT};text-decoration:none;">flywingstour.co.in</a>
</td></tr>`;
}

/** A bulletproof button: renders as a solid block even in Outlook. */
function button(label: string, href: string, bg: string, color = "#ffffff", outlined = false): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="display:inline-table;margin:0 8px 8px 0;"><tr>
<td bgcolor="${bg}" style="background:${bg};border-radius:6px;${outlined ? `border:1px solid ${LINE};` : ""}">
<a href="${esc(href)}" style="display:inline-block;padding:13px 22px;font-family:${FONT};font-size:15px;font-weight:700;color:${color};text-decoration:none;border-radius:6px;">${esc(label)}</a>
</td></tr></table>`;
}

function detailRows(rows: Array<[string, string | undefined, string?]>): string {
  const filled = rows.filter(([, v]) => v && String(v).trim());
  return filled
    .map(
      ([label, value, href], i) => `<tr>
<td style="padding:11px 0;${i < filled.length - 1 ? `border-bottom:1px solid ${LINE};` : ""}font-family:${FONT};font-size:13px;color:${MUTED};width:38%;vertical-align:top;">${esc(label)}</td>
<td style="padding:11px 0;${i < filled.length - 1 ? `border-bottom:1px solid ${LINE};` : ""}font-family:${FONT};font-size:14px;color:${INK};font-weight:600;vertical-align:top;">${
        href ? `<a href="${esc(href)}" style="color:${NAVY};text-decoration:underline;">${esc(value)}</a>` : esc(value)
      }</td></tr>`
    )
    .join("");
}

/* ─── 1. Lead alert, to the sales inbox ─────────────────────── */

const KIND_LABEL: Record<LeadKind, string> = {
  contact: "New enquiry",
  inquiry: "New trip enquiry",
  fare: "Fare request",
  newsletter: "Newsletter signup",
};

export function leadAlertEmail(lead: Lead): RenderedEmail {
  const digits = phoneDigits(lead.phone);
  const who = lead.name?.trim() || lead.phone || lead.email || "Website visitor";
  const trip = lead.kind === "fare" ? lead.route : lead.destination;

  const subject =
    lead.kind === "newsletter"
      ? `Newsletter signup: ${lead.email}`
      : lead.kind === "fare"
        ? `Fare request: ${lead.route ?? "route not given"} - ${lead.phone}`
        : `${KIND_LABEL[lead.kind]}: ${trip || "trip not specified"}${lead.travelMonth ? `, ${lead.travelMonth}` : ""} - ${who}`;

  const greeting = `Hi${lead.name ? ` ${lead.name.split(" ")[0]}` : ""}, this is Flywings Tour & Packages. Thank you for your enquiry${trip ? ` about ${trip}` : ""}.`;

  const actions =
    lead.kind === "newsletter"
      ? ""
      : `<tr><td style="padding:4px 28px 18px;">
${digits ? button("Call now", `tel:+${digits}`, NAVY, GOLD_LIGHT) : ""}
${digits ? button("WhatsApp", `https://wa.me/${digits}?text=${encodeURIComponent(greeting)}`, WHATSAPP) : ""}
${lead.email ? button("Email", `mailto:${lead.email}`, "#ffffff", NAVY, true) : ""}
</td></tr>`;

  const details = detailRows([
    ["Name", lead.name],
    ["Phone", lead.phone, digits ? `tel:+${digits}` : undefined],
    ["Email", lead.email, lead.email ? `mailto:${lead.email}` : undefined],
    ["Destination", lead.destination],
    ["Travel month", lead.travelMonth],
    ["Route", lead.route],
    ["Departure", lead.departure],
    ["Return", lead.returnDate],
    ["Travellers", lead.travellers],
    ["Form", sourceLabel(lead.source)],
    ["Page", lead.pageUrl, lead.pageUrl],
    ["Came from", lead.kind === "newsletter" ? undefined : cameFrom(lead)],
  ]);

  const nudge =
    lead.kind === "newsletter"
      ? "Added to the newsletter list. No call needed."
      : "Leads called within 30 minutes convert several times better than next-day callbacks. Reply to this email to write back to the customer directly.";

  const html = shell(
    `${KIND_LABEL[lead.kind]} from ${who}${trip ? ` for ${trip}` : ""}`,
    `<tr><td style="padding:24px 28px 6px;font-family:${FONT};">
<div style="display:inline-block;background:${lead.kind === "newsletter" ? LINE : "#FDF3DA"};color:${lead.kind === "newsletter" ? MUTED : "#7A5A06"};font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;padding:5px 10px;border-radius:4px;">${esc(KIND_LABEL[lead.kind])}</div>
<div style="font-size:12px;color:${MUTED};margin-top:10px;">${esc(nowIST())} IST</div>
<div style="font-size:24px;font-weight:800;color:${INK};margin-top:6px;line-height:1.25;">${esc(who)}</div>
${trip ? `<div style="font-size:16px;color:${NAVY};margin-top:4px;">${esc(trip)}${lead.travelMonth ? ` &middot; ${esc(lead.travelMonth)}` : ""}</div>` : ""}
</td></tr>
${actions}
<tr><td style="padding:0 28px 8px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${details}</table>
</td></tr>
<tr><td style="padding:14px 28px 26px;font-family:${FONT};font-size:12px;line-height:1.6;color:${MUTED};">${esc(nudge)}</td></tr>`
  );

  const text = [
    `${KIND_LABEL[lead.kind]} - ${nowIST()} IST`,
    "",
    lead.name && `Name: ${lead.name}`,
    lead.phone && `Phone: ${lead.phone}`,
    lead.email && `Email: ${lead.email}`,
    lead.destination && `Destination: ${lead.destination}`,
    lead.travelMonth && `Travel month: ${lead.travelMonth}`,
    lead.route && `Route: ${lead.route}`,
    lead.departure && `Departure: ${lead.departure}`,
    lead.returnDate && `Return: ${lead.returnDate}`,
    lead.travellers && `Travellers: ${lead.travellers}`,
    `Form: ${sourceLabel(lead.source)}`,
    lead.pageUrl && `Page: ${lead.pageUrl}`,
    lead.kind !== "newsletter" && `Came from: ${cameFrom(lead)}`,
    "",
    digits && `Call: +${digits}`,
    digits && `WhatsApp: https://wa.me/${digits}`,
  ]
    .filter(Boolean)
    .join("\n");

  return { subject, html, text };
}

/* ─── 2. Confirmation, to the customer ──────────────────────── */

export function customerConfirmationEmail(lead: Lead): RenderedEmail {
  const first = lead.name?.trim().split(" ")[0];
  const trip = lead.kind === "fare" ? lead.route : lead.destination;
  const waText = `Hi Flywings, I just sent an enquiry on your website${trip ? ` about ${trip}` : ""}.`;
  const subject = "We've got your enquiry - Flywings Tour & Packages";

  const summary = detailRows([
    ["Destination", lead.destination],
    ["Travel month", lead.travelMonth],
    ["Route", lead.route],
    ["Departure", lead.departure],
    ["Travellers", lead.travellers],
    ["We'll call", lead.phone],
  ]);

  const step = (n: string, title: string, body: string) => `<tr>
<td style="width:34px;vertical-align:top;padding:0 0 16px;">
<div style="width:26px;height:26px;border-radius:13px;background:${NAVY};color:${GOLD_LIGHT};font-family:${FONT};font-size:13px;font-weight:700;text-align:center;line-height:26px;">${n}</div>
</td>
<td style="vertical-align:top;padding:2px 0 16px;font-family:${FONT};">
<div style="font-size:15px;font-weight:700;color:${INK};">${esc(title)}</div>
<div style="font-size:14px;line-height:1.55;color:${MUTED};margin-top:3px;">${esc(body)}</div>
</td></tr>`;

  const html = shell(
    `Thanks${first ? ` ${first}` : ""}. A travel expert will call you shortly.`,
    `<tr><td style="padding:30px 28px 8px;font-family:${FONT};">
<div style="font-size:24px;font-weight:800;color:${INK};line-height:1.3;">Thanks${first ? `, ${esc(first)}` : ""}. We've got your enquiry.</div>
<div style="font-size:15px;line-height:1.6;color:${MUTED};margin-top:10px;">A Flywings travel expert will call you back with real options${trip ? ` for ${esc(trip)}` : ""}, usually within a few hours during office hours (${HOURS}).</div>
</td></tr>
${summary ? `<tr><td style="padding:14px 28px 4px;">
<div style="font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${GOLD};margin-bottom:4px;">What you asked about</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${summary}</table>
</td></tr>` : ""}
<tr><td style="padding:22px 28px 6px;">
<div style="font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${GOLD};margin-bottom:12px;">What happens next</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
${step("1", "We call you", "A travel expert calls to understand your dates, budget and who is travelling.")}
${step("2", "You get real options", "Hotels, flights and a clear price, with honest notes on what changes the cost.")}
${step("3", "Book when you're ready", "No pressure and no charge for planning. Change your mind any time before booking.")}
</table>
</td></tr>
<tr><td style="padding:6px 28px 8px;font-family:${FONT};font-size:14px;color:${MUTED};">Can't wait? Message us now:</td></tr>
<tr><td style="padding:4px 28px 26px;">
${button("Chat on WhatsApp", `https://wa.me/${CONTACT.phoneE164.replace("+", "")}?text=${encodeURIComponent(waText)}`, WHATSAPP)}
${button(`Call ${CONTACT.phoneDisplay}`, `tel:${CONTACT.phoneE164}`, NAVY, GOLD_LIGHT)}
</td></tr>
<tr><td style="padding:0 28px 24px;font-family:${FONT};font-size:11px;line-height:1.6;color:#98A6B5;">You're receiving this because an enquiry was sent from flywingstour.co.in with this email address. If that wasn't you, you can ignore this email.</td></tr>`
  );

  const text = [
    `Thanks${first ? `, ${first}` : ""}. We've got your enquiry.`,
    "",
    `A Flywings travel expert will call you back${trip ? ` about ${trip}` : ""}, usually within a few hours during office hours (${HOURS}).`,
    "",
    "What happens next:",
    "1. We call you to understand your dates, budget and who is travelling.",
    "2. You get real options with a clear price.",
    "3. Book when you're ready. Planning is free.",
    "",
    `WhatsApp: https://wa.me/${CONTACT.phoneE164.replace("+", "")}`,
    `Phone: ${CONTACT.phoneDisplay}`,
    "",
    "Flywings Tour & Packages Pvt Ltd",
    `${CONTACT.streetAddress}, ${CONTACT.locality}, ${CONTACT.region} ${CONTACT.postalCode}`,
  ].join("\n");

  return { subject, html, text };
}

/* ─── 3. Welcome, to a newsletter subscriber ────────────────── */

export function newsletterWelcomeEmail(): RenderedEmail {
  const subject = "You're on the Flywings travel list";
  const html = shell(
    "Travel deals, visa rule changes and trip ideas from Chandigarh, a couple of times a month.",
    `<tr><td style="padding:30px 28px 10px;font-family:${FONT};">
<div style="font-size:24px;font-weight:800;color:${INK};line-height:1.3;">You're on the list.</div>
<div style="font-size:15px;line-height:1.6;color:${MUTED};margin-top:10px;">Expect a couple of emails a month: fare drops from Chandigarh and Amritsar, visa rule changes that affect Indian travellers, and trip ideas worth taking. No daily spam.</div>
</td></tr>
<tr><td style="padding:14px 28px 26px;">
${button("Browse tour packages", `${SITE_URL}/packages`, NAVY, GOLD_LIGHT)}
${button("Read the travel blog", `${SITE_URL}/blog`, "#ffffff", NAVY, true)}
</td></tr>
<tr><td style="padding:0 28px 24px;font-family:${FONT};font-size:11px;line-height:1.6;color:#98A6B5;">You signed up at flywingstour.co.in. To stop these emails, reply with "unsubscribe" and we'll remove you.</td></tr>`
  );
  const text = [
    "You're on the Flywings travel list.",
    "",
    "Expect a couple of emails a month: fare drops, visa rule changes and trip ideas. No daily spam.",
    "",
    `Tour packages: ${SITE_URL}/packages`,
    `Travel blog: ${SITE_URL}/blog`,
    "",
    'To stop these emails, reply with "unsubscribe".',
  ].join("\n");
  return { subject, html, text };
}
