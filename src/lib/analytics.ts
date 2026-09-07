"use client";

/**
 * Lead event tracking (GA4).
 *
 * Every action that can turn a visitor into an enquiry fires exactly one
 * named event here, so GA4 can attribute leads back to the page and
 * channel that produced them. Before this existed the site fired a single
 * event (`fare_request`) and nothing else, which made it impossible to
 * answer "which page produced that phone call?".
 *
 * Mark these as Key Events in GA4 (Admin → Events → Mark as key event):
 *   whatsapp_click, phone_click, contact_submit, inquiry_submit,
 *   fare_request, newsletter_signup
 *
 * `sendGAEvent` pushes onto the dataLayer created by the <GoogleAnalytics>
 * component in the root layout. It is a no-op if that component has not
 * mounted, so calling these on a page without analytics is harmless.
 */

import { sendGAEvent } from "@next/third-parties/google";

/** Every lead-generating interaction we measure. */
export type LeadEvent =
  | "whatsapp_click"
  | "phone_click"
  | "email_click"
  | "contact_submit"
  | "inquiry_submit"
  | "fare_request"
  | "newsletter_signup";

/**
 * Page context attached to every event. Without this, GA4 reports which
 * events fired but not where, which is the whole question worth asking.
 */
function pageContext(): Record<string, string> {
  if (typeof window === "undefined") return {};
  return {
    page_path: window.location.pathname,
    page_title: document.title,
  };
}

/** Fire a lead event with page context plus any event-specific params. */
export function trackLead(
  event: LeadEvent,
  params: Record<string, string | number> = {}
): void {
  try {
    sendGAEvent("event", event, { ...pageContext(), ...params });
  } catch {
    // Analytics must never break a form submission or a link click.
  }
}

/**
 * Records the lead in the Google Sheet as well as GA4.
 *
 * GA4 tells you how many leads arrived; the sheet is the list the sales
 * team actually calls. Leads previously existed only as an email, so a
 * delivery failure or a spam filter lost them silently with no record
 * that they ever came in.
 *
 * Fire-and-forget on purpose: the visitor's success screen must never
 * wait on, or be blocked by, logging.
 */
export function logLead(fields: Record<string, string>): void {
  if (typeof window === "undefined") return;
  try {
    const payload = JSON.stringify({
      ...fields,
      pageUrl: window.location.href,
      referrer: document.referrer || "direct",
      userAgent: navigator.userAgent,
    });

    // sendBeacon survives the page being closed straight after submit,
    // which is exactly when mobile users tend to leave.
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/lead-log",
        new Blob([payload], { type: "application/json" })
      );
      return;
    }

    void fetch("/api/lead-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Never surface a logging failure to the visitor.
  }
}

/**
 * Marketing attribution captured from the landing URL.
 *
 * Read once per session and stored, because the UTM tags are on the first
 * page a visitor lands on and the enquiry usually happens several pages
 * later, by which point the query string is long gone.
 */
const ATTRIBUTION_KEY = "fw_attribution";

export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  try {
    if (sessionStorage.getItem(ATTRIBUTION_KEY)) return;

    const params = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};
    for (const key of [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
      "gclid",
      "fbclid",
    ]) {
      const value = params.get(key);
      if (value) utm[key] = value.slice(0, 100);
    }

    // A visit with no UTM tags still has a referrer worth keeping: it is
    // how organic, direct and Google Business Profile traffic separate.
    utm.landing_page = window.location.pathname;
    utm.first_referrer = document.referrer || "direct";

    sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(utm));
  } catch {
    // Private browsing can throw on sessionStorage. Attribution is a
    // nice-to-have; the lead itself still gets through.
  }
}

/** The stored attribution, flattened for sending with a lead. */
export function getAttribution(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(ATTRIBUTION_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}
