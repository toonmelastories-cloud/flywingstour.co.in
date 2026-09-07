"use client";

import { useEffect } from "react";
import { trackLead, captureAttribution } from "@/lib/analytics";

/**
 * Site-wide lead tracking, mounted once in the root layout.
 *
 * Phone and WhatsApp links appear in roughly fifteen components (navbar,
 * footer, hero, every blog post, every package page, the floating
 * button…). Rather than editing each one and having the next new link
 * silently go untracked, this listens on the document in the capture
 * phase and classifies clicks by href. Any link added later is tracked
 * automatically.
 *
 * WhatsApp and phone taps are the two highest-volume ways visitors
 * actually contact this business, and neither produced any analytics
 * signal before this existed.
 */
export default function LeadTracking() {
  useEffect(() => {
    // Stash UTM tags / referrer from the landing URL for the whole session.
    captureAttribution();

    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      const link = target?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!link) return;

      // getAttribute, not .href: the DOM property resolves relative URLs
      // and normalises the scheme, which loses the tel:/mailto: prefix.
      const href = link.getAttribute("href") || "";

      if (href.startsWith("tel:")) {
        trackLead("phone_click", { number: href.replace("tel:", "") });
        return;
      }

      if (href.includes("wa.me") || href.includes("api.whatsapp.com")) {
        // The share buttons on blog posts point at wa.me with no number.
        // Those are shares, not enquiries, and must not inflate the
        // lead count.
        const isShare = /wa\.me\/\?/.test(href);
        if (!isShare) trackLead("whatsapp_click");
        return;
      }

      if (href.startsWith("mailto:")) {
        trackLead("email_click");
      }
    };

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
