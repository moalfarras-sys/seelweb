import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { company, contact, email, category, description } = body;

    if (!company || !contact || !email || !category || !description) {
      return NextResponse.json({ error: "Pflichtfelder fehlen" }, { status: 400 });
    } // Save tender and notify admin
    console.log("Tender submission:", body);

    return NextResponse.json({ success: true, message: "Ausschreibung erhalten" });
  } catch {
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}
