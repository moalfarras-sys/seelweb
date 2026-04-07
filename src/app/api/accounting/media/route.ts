import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import { findAccountingUpload, getAccountingContentType } from "@/lib/accounting-storage";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const file = request.nextUrl.searchParams.get("file") || "";
  if (!file) {
    return NextResponse.json({ error: "Datei fehlt" }, { status: 400 });
  }

  const found = await findAccountingUpload(file);
  if (!found) {
    return NextResponse.json({ error: "Datei nicht gefunden" }, { status: 404 });
  }

  const buffer = await fs.readFile(found.absolutePath);

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": getAccountingContentType(file),
      "Cache-Control": "private, max-age=60",
      "Content-Disposition": `inline; filename="${encodeURIComponent(file)}"`,
    },
  });
}
