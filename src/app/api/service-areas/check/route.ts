import { NextRequest, NextResponse } from "next/server";
import { resolveRegionByZip } from "@/lib/pricing/rules";

export async function GET(req: NextRequest) {
  const zip = String(req.nextUrl.searchParams.get("zip") || "").trim();
  if (!/^\d{5}$/.test(zip)) {
    return NextResponse.json({ supported: false, region: null, message: "Ungültige PLZ" });
  }

  const region = await resolveRegionByZip(zip);
  if (!region) {
    return NextResponse.json({ supported: false, region: null, message: "Für diese PLZ ist aktuell kein Einsatzgebiet konfiguriert." });
  }

  return NextResponse.json({ supported: true, region: { id: region.id, name: region.regionName }, message: "PLZ wird bedient." });
}
