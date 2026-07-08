import { NextResponse } from "next/server";
import { sendLead } from "@/lib/sendLead";

/**
 * Fare-request leads from the homepage flight search form. There is no
 * flight API — the form is a lead capture: the route/date/traveller
 * details plus the caller's phone number are emailed to the sales inbox
 * so the ticketing desk can call back with the day's lowest fare.
 */

const str = (v: unknown, max = 80): string | null =>
  typeof v === "string" && v.trim().length > 0 && v.trim().length <= max
    ? v.trim()
    : null;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;
  if (!body) {
    return NextResponse.json(
      { success: false, message: "Invalid request" },
      { status: 400 }
    );
  }

  const from = str(body.from);
  const to = str(body.to);
  const departure = str(body.departure, 40);
  const returnDate = str(body.returnDate, 40); // optional (one-way)
  const travelers = str(body.travelers, 20);
  const phone = str(body.phone, 20);

  if (!from || !to || !departure || !travelers || !phone) {
    return NextResponse.json(
      { success: false, message: "Missing fields" },
      { status: 400 }
    );
  }
  if (phone.length < 7 || !/^[+\d\s()-]+$/.test(phone)) {
    return NextResponse.json(
      { success: false, message: "Invalid phone number" },
      { status: 400 }
    );
  }

  try {
    await sendLead(`Fare Request: ${from} → ${to} — Flywings Website`, {
      Route: `${from} → ${to}`,
      Departure: departure,
      Return: returnDate ?? "One-way / not selected",
      Travelers: travelers,
      Phone: phone,
      Source: "homepage-flight-search",
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, message: "Could not send request, please call us" },
      { status: 502 }
    );
  }
}
