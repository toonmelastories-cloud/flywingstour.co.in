/**
 * Server-side lead forwarding. Delivers form submissions to the sales
 * inbox via FormSubmit's AJAX API (free, no account needed — the inbox
 * owner just clicks the one-time activation link FormSubmit emails on
 * first use).
 */

const SALES_EMAIL = process.env.SALES_EMAIL || "sales@flywingstour.co.in";

export async function sendLead(
  subject: string,
  fields: Record<string, string>
): Promise<void> {
  const res = await fetch(`https://formsubmit.co/ajax/${SALES_EMAIL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      // FormSubmit rejects requests that don't look like a browser
      Origin: "https://www.flywingstour.co.in",
      Referer: "https://www.flywingstour.co.in/contact",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
    },
    body: JSON.stringify({
      ...fields,
      _subject: subject,
      _template: "table",
      _captcha: "false",
    }),
  });

  // FormSubmit returns HTTP 200 even on failure — check the body flag
  const json = (await res.json().catch(() => null)) as
    | { success?: string | boolean; message?: string }
    | null;
  const ok =
    res.ok && (json?.success === true || json?.success === "true");

  if (!ok) {
    throw new Error(
      `Lead delivery failed: ${json?.message || `HTTP ${res.status}`}`
    );
  }
}

/** Shared validation for the lead forms (phone + email). */
export function validateLead(body: unknown): {
  phone: string;
  email: string;
  source: string;
} | null {
  if (typeof body !== "object" || body === null) return null;
  const { phone, email, source } = body as Record<string, unknown>;

  if (typeof phone !== "string" || typeof email !== "string") return null;
  const cleanPhone = phone.trim();
  const cleanEmail = email.trim();

  if (cleanPhone.length < 7 || cleanPhone.length > 20) return null;
  if (!/^[+\d\s()-]+$/.test(cleanPhone)) return null;
  if (cleanEmail.length > 100 || !/^\S+@\S+\.\S+$/.test(cleanEmail)) return null;

  return {
    phone: cleanPhone,
    email: cleanEmail,
    source: typeof source === "string" ? source.slice(0, 50) : "website",
  };
}
