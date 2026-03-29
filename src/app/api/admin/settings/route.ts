import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getPublicSiteSettings, updateSiteSettings } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  const settings = await getPublicSiteSettings();
  return NextResponse.json(settings);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const settings = await updateSiteSettings(body);
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("POST /api/admin/settings error:", error);
    return NextResponse.json(
      { error: "Speichern fehlgeschlagen" },
      { status: 500 },
    );
  }
}
