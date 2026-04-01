import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  getGalleryMediaUrl,
  persistGalleryUpload,
} from "@/lib/gallery-storage";
import {
  createUploadFileName,
  getGalleryItems,
  saveGalleryItems,
} from "@/lib/site-content";
import type { GalleryCategory, GalleryItem } from "@/types/site-content";

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
      return NextResponse.json({ error: "Bitte ein Bild ausw\u00e4hlen" }, { status: 400 });
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Es k\u00f6nnen nur Bilddateien hochgeladen werden" }, { status: 400 });
    }

    const fileName = createUploadFileName(file.name);
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadResult = await persistGalleryUpload(fileName, buffer);

    const items = await getGalleryItems();
    const shouldFeature = toBoolean(formData.get("isFeatured"), false);
    const nextItem: GalleryItem = {
      id: randomUUID(),
      title: String(formData.get("title") || "Neues Bild").trim(),
      alt: String(formData.get("alt") || "Bild von SEEL Transport & Reinigung").trim(),
      imageUrl: getGalleryMediaUrl(uploadResult.fileName),
      storagePath: uploadResult.storagePath,
      category: sanitizeCategory(String(formData.get("category") || "umzug")),
      sortOrder: items.length,
      isVisible: toBoolean(formData.get("isVisible"), true),
      showOnHomepage: shouldFeature ? true : toBoolean(formData.get("showOnHomepage"), true),
      isFeatured: shouldFeature,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const nextItems = shouldFeature
      ? [...items.map((item) => ({ ...item, isFeatured: false })), nextItem]
      : [...items, nextItem];

    await saveGalleryItems(nextItems);
    return NextResponse.json({ success: true, item: nextItem, writtenFiles: uploadResult.writtenFiles });
  } catch (error) {
    console.error("POST /api/admin/gallery error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload fehlgeschlagen" },
      { status: 500 },
    );
  }
}
