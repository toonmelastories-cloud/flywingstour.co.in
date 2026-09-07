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
    await sendLead("New Trip Inquiry — Flywings Website", leadFields(lead));
    await logLeadToSheet({ type: "inquiry_submit", ...lead });
    return NextResponse.json({
      success: true,
      data: { id: `inq-${Date.now()}` },
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Could not send inquiry, please call us" },
      { status: 502 }
    );
  }
}
