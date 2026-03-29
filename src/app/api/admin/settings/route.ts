import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getBusinessSettings, invalidateBusinessSettings } from "@/lib/getBusinessSettings";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

const OVERRIDES_FILE = path.join(process.cwd(), "data", "settings-overrides.json");

async function readOverrides(): Promise<Record<string, unknown>> {
  try {
    const raw = await fs.readFile(OVERRIDES_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function writeOverrides(data: Record<string, unknown>) {
  const dir = path.dirname(OVERRIDES_FILE);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(OVERRIDES_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET() {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  const settings = getBusinessSettings();
  const overrides = await readOverrides();

  return NextResponse.json({
    ...settings,
    trustBadges:
      (overrides.trustBadges as Record<string, string>) ||
      settings.trustBadges,
    googlePlaceId: process.env.GOOGLE_PLACE_ID || "",
  });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const current = await readOverrides();

    if (body.trustBadges) {
      current.trustBadges = body.trustBadges;
    }

    await writeOverrides(current);
    invalidateBusinessSettings();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/admin/settings error:", error);
    return NextResponse.json(
      { error: "Speichern fehlgeschlagen" },
      { status: 500 }
    );
  }
}
