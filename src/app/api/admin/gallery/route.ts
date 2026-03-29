import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  createUploadFileName,
  getGalleryItems,
  saveGalleryItems,
} from "@/lib/site-content";
import type { GalleryCategory, GalleryItem } from "@/types/site-content";

const GALLERY_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "gallery");

function toBoolean(value: FormDataEntryValue | null, fallback = false) {
  if (value === null) return fallback;
  return value === "true" || value === "on" || value === "1";
}

function sanitizeCategory(value: string): GalleryCategory {
  const allowed: GalleryCategory[] = ["umzug", "reinigung", "entruempelung", "gewerbe", "express"];
  return allowed.includes(value as GalleryCategory) ? (value as GalleryCategory) : "umzug";
}

export async function GET() {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  const items = await getGalleryItems();
  return NextResponse.json(items);
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { items?: GalleryItem[] };
    const items = Array.isArray(body.items) ? body.items : [];
    await saveGalleryItems(items);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/admin/gallery error:", error);
    return NextResponse.json({ error: "Galerie konnte nicht gespeichert werden" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "Bitte ein Bild auswählen" }, { status: 400 });
    }

    await fs.mkdir(GALLERY_UPLOAD_DIR, { recursive: true });
    const fileName = createUploadFileName(file.name);
    const absoluteFile = path.join(GALLERY_UPLOAD_DIR, fileName);
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(absoluteFile, buffer);

    const items = await getGalleryItems();
    const nextItem: GalleryItem = {
      id: randomUUID(),
      title: String(formData.get("title") || "Neues Bild").trim(),
      alt: String(formData.get("alt") || "Bild von SEEL Transport & Reinigung").trim(),
      imageUrl: `/uploads/gallery/${fileName}`,
      storagePath: absoluteFile,
      category: sanitizeCategory(String(formData.get("category") || "umzug")),
      sortOrder: items.length,
      isVisible: toBoolean(formData.get("isVisible"), true),
      showOnHomepage: toBoolean(formData.get("showOnHomepage"), true),
      isFeatured: toBoolean(formData.get("isFeatured"), false),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveGalleryItems([...items, nextItem]);
    return NextResponse.json({ success: true, item: nextItem });
  } catch (error) {
    console.error("POST /api/admin/gallery error:", error);
    return NextResponse.json({ error: "Upload fehlgeschlagen" }, { status: 500 });
  }
}
