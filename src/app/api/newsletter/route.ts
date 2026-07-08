import { NextResponse } from "next/server";
import { sendLead } from "@/lib/sendLead";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email =
    body && typeof body.email === "string" ? body.email.trim() : "";

  if (!email || email.length > 100 || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json(
      { success: false, message: "Invalid email" },
      { status: 400 }
    );
  }

  try {
    await sendLead("Newsletter Signup — Flywings Website", { Email: email });
    return NextResponse.json({ success: true, data: { subscribed: true } });
  } catch {
    return NextResponse.json(
      { success: false, message: "Could not subscribe" },
      { status: 502 }
    );
  }
}
