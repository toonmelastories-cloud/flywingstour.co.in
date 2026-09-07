import { NextResponse } from "next/server";
import { sendLead, validateLead, leadFields } from "@/lib/sendLead";
import { logLeadToSheet } from "@/lib/leadLog";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const lead = validateLead(body);

  if (!lead) {
    return NextResponse.json(
      { success: false, message: "Invalid phone or email" },
      { status: 400 }
    );
  }

  try {
    await sendLead("New Contact Enquiry — Flywings Website", leadFields(lead));
    await logLeadToSheet({ type: "contact_submit", ...lead });
    return NextResponse.json({
      success: true,
      data: { id: `contact-${Date.now()}` },
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: "Could not send enquiry, please call us",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 502 }
    );
  }
}
