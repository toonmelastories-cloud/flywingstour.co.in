import { NextResponse } from "next/server";
import { logLeadToSheet, type LeadRecord } from "@/lib/leadLog";

/**
 * Records a lead in the Google Sheet.
 *
 * Called from the browser after a form submits successfully. It exists as
 * a server route so the sheet's webhook URL stays in server-side env and
 * never ships in the client bundle, where anyone could spam it.
 *
 * The forms deliver to the sales inbox directly from the browser (see
 * `src/hooks/useApi.ts`), so server-side logging inside sendLead would
 * never run for real traffic. This is the path real leads take.
 */

/** Trims and caps a field so a malformed post cannot bloat the sheet. */
function str(value: unknown, max = 200): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;

  if (!body) {
    return NextResponse.json({ logged: false }, { status: 400 });
  }

  // A row with no way to contact anyone is not a lead.
  const phone = str(body.phone, 20);
  const email = str(body.email, 100);
  if (!phone && !email) {
    return NextResponse.json({ logged: false }, { status: 400 });
  }

  const record: LeadRecord = {
    type: str(body.type, 40) || "enquiry",
    name: str(body.name, 80),
    phone,
    email,
    destination: str(body.destination, 80),
    travelMonth: str(body.travelMonth, 40),
    source: str(body.source, 50),
    pageUrl: str(body.pageUrl, 300),
    referrer: str(body.referrer, 300),
    utm_source: str(body.utm_source, 100),
    utm_medium: str(body.utm_medium, 100),
    utm_campaign: str(body.utm_campaign, 100),
    notes: str(body.notes, 500),
  };

  await logLeadToSheet(record);

  // Always 204: the browser fires this with sendBeacon and cannot act on
  // a failure anyway, and the visitor's lead is already delivered.
  return new NextResponse(null, { status: 204 });
}
