import fs from "fs/promises";
import { NextResponse } from "next/server";
import {
  extractGalleryFileName,
  findGalleryUpload,
  getGalleryContentType,
} from "@/lib/gallery-storage";

async function getGalleryFileResponse(request: Request, headOnly = false) {
  const { searchParams } = new URL(request.url);
  const fileName = extractGalleryFileName(
    searchParams.get("file") ? `/uploads/gallery/${searchParams.get("file")}` : "",
  );

  if (!fileName) {
    return NextResponse.json({ error: "Datei nicht gefunden" }, { status: 404 });
  }

  const match = await findGalleryUpload(fileName);
  if (!match) {
    return NextResponse.json({ error: "Datei nicht gefunden" }, { status: 404 });
  }

  const headers = new Headers({
    "Cache-Control": "public, max-age=31536000, immutable",
    "Content-Length": String(match.stat.size),
    "Content-Type": getGalleryContentType(fileName),
  });

  if (headOnly) {
    return new NextResponse(null, { status: 200, headers });
  }

  const buffer = await fs.readFile(match.absolutePath);
  return new NextResponse(buffer, { status: 200, headers });
}

export async function GET(request: Request) {
  return getGalleryFileResponse(request, false);
}

export async function HEAD(request: Request) {
  return getGalleryFileResponse(request, true);
}
