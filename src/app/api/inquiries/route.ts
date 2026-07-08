import { NextResponse } from "next/server";
import { sendLead, validateLead } from "@/lib/sendLead";

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
    await sendLead("New Trip Inquiry — Flywings Website", {
      Phone: lead.phone,
      Email: lead.email,
      Source: lead.source,
    });
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
