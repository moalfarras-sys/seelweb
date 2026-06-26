import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import { findAccountingUpload, getAccountingContentType } from "@/lib/accounting-storage";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  // Accounting documents are confidential business records → admin session required.
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

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
      "Cache-Control": "private, no-store, max-age=0",
      "X-Robots-Tag": "noindex, nofollow",
      "Content-Disposition": `inline; filename="${encodeURIComponent(file)}"`,
    },
  });
}
