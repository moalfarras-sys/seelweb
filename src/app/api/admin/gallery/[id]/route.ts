import fs from "fs/promises";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  getGalleryItems,
  removeGalleryItem,
  saveGalleryItems,
} from "@/lib/site-content";
import type { GalleryCategory } from "@/types/site-content";

function sanitizeCategory(value: string): GalleryCategory {
  const allowed: GalleryCategory[] = ["umzug", "reinigung", "entruempelung", "gewerbe", "express"];
  return allowed.includes(value as GalleryCategory) ? (value as GalleryCategory) : "umzug";
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const items = await getGalleryItems();
    const updated = items.map((item) =>
      item.id === params.id
        ? {
            ...item,
            title: typeof body.title === "string" ? body.title.trim() : item.title,
            alt: typeof body.alt === "string" ? body.alt.trim() : item.alt,
            category: typeof body.category === "string" ? sanitizeCategory(body.category) : item.category,
            isVisible: typeof body.isVisible === "boolean" ? body.isVisible : item.isVisible,
            showOnHomepage:
              typeof body.showOnHomepage === "boolean" ? body.showOnHomepage : item.showOnHomepage,
            isFeatured: typeof body.isFeatured === "boolean" ? body.isFeatured : item.isFeatured,
            sortOrder: typeof body.sortOrder === "number" ? body.sortOrder : item.sortOrder,
            updatedAt: new Date().toISOString(),
          }
        : item,
    );

    await saveGalleryItems(updated);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH /api/admin/gallery/[id] error:", error);
    return NextResponse.json({ error: "Aktualisierung fehlgeschlagen" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
  }

  try {
    const removed = await removeGalleryItem(params.id);
    if (removed?.imageUrl.startsWith("/uploads/gallery/")) {
      const absolute = removed.storagePath;
      if (absolute) {
        await fs.rm(absolute, { force: true });
      }
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/gallery/[id] error:", error);
    return NextResponse.json({ error: "Löschen fehlgeschlagen" }, { status: 500 });
  }
}
