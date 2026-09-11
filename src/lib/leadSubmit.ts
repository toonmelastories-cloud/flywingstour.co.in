"use client";

/**
 * One delivery path for every website form.
 *
 * First choice is /api/lead, which sends branded emails through the
 * company mailbox. If that route is unavailable (password not set yet,
 * mail server down, timeout), the same lead goes to FormSubmit straight
 * from the browser, which is how every form worked before. A lead only
 * fails if both paths fail.
 *
 * The honeypot field is sent empty on purpose; see the route for why.
 */

import { getAttribution } from "@/lib/analytics";

export type LeadKind = "contact" | "inquiry" | "fare" | "newsletter";

export interface LeadInput {
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
}

export interface FormSubmitFallback {
  subject: string;
  fields: Record<string, string>;
}

const FORMSUBMIT = "https://formsubmit.co/ajax/sales@flywingstour.co.in";

class LeadRejected extends Error {}

async function viaOwnMailbox(lead: LeadInput): Promise<void> {
  const res = await fetch("/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...lead,
      ...getAttribution(),
      pageUrl: typeof window !== "undefined" ? window.location.href : "",
      company: "",
    }),
  });
  const json = (await res.json().catch(() => null)) as
    | { success?: boolean; fallback?: boolean; message?: string }
    | null;
  if (res.ok && json?.success) return;
  // A deliberate refusal (bad input, rate limit) must not be retried
  // through FormSubmit, or the fallback just becomes a way around it.
  if (json && json.fallback === false) throw new LeadRejected(json.message || "Submission refused");
  throw new Error("own mailbox unavailable");
}

async function viaFormSubmit(lead: LeadInput, fb: FormSubmitFallback): Promise<void> {
  const res = await fetch(FORMSUBMIT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      ...fb.fields,
      ...(lead.email ? { _replyto: lead.email } : {}),
      _subject: fb.subject,
      _template: "table",
      _captcha: "false",
    }),
  });
  const json = (await res.json().catch(() => null)) as { success?: string | boolean; message?: string } | null;
  const ok = res.ok && (json?.success === true || json?.success === "true");
  if (!ok) throw new Error(json?.message || "Submission failed");
}

export async function submitLead(lead: LeadInput, fallback: FormSubmitFallback): Promise<void> {
  try {
    await viaOwnMailbox(lead);
  } catch (err) {
    if (err instanceof LeadRejected) throw err;
    await viaFormSubmit(lead, fallback);
  }
}
