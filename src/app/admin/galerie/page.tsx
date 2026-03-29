"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  Loader2,
  Plus,
  Save,
  Star,
  Trash2,
  Upload,
} from "lucide-react";
import type { GalleryCategory, GalleryItem } from "@/types/site-content";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-emerald-500 dark:border-navy-700 dark:bg-navy-900 dark:text-white";

const categoryOptions: Array<{ value: GalleryCategory; label: string }> = [
  { value: "umzug", label: "Umzug" },
  { value: "reinigung", label: "Reinigung" },
  { value: "entruempelung", label: "Entrümpelung" },
  { value: "gewerbe", label: "Gewerbe" },
  { value: "express", label: "Express" },
];

export default function GaleriePage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: "",
    alt: "",
    category: "umzug" as GalleryCategory,
    isVisible: true,
    showOnHomepage: true,
    isFeatured: false,
  });
  const [file, setFile] = useState<File | null>(null);

  async function load() {
    setLoading(true);
    const response = await fetch("/api/admin/gallery", { cache: "no-store" });
    if (response.ok) {
      const data = (await response.json()) as GalleryItem[];
      setItems(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const orderedItems = useMemo(
    () => [...items].sort((a, b) => a.sortOrder - b.sortOrder),
    [items],
  );

  function updateItem(id: string, patch: Partial<GalleryItem>) {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }

  function moveItem(id: string, direction: -1 | 1) {
    setItems((current) => {
      const ordered = [...current].sort((a, b) => a.sortOrder - b.sortOrder);
      const index = ordered.findIndex((item) => item.id === id);
      const targetIndex = index + direction;
      if (index < 0 || targetIndex < 0 || targetIndex >= ordered.length) return current;
      const next = [...ordered];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next.map((item, orderIndex) => ({ ...item, sortOrder: orderIndex }));
    });
  }

  async function saveOrder() {
    setSaving(true);
    try {
      await fetch("/api/admin/gallery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: orderedItems.map((item, index) => ({ ...item, sortOrder: index })) }),
      });
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function saveItem(item: GalleryItem) {
    setSaving(true);
    try {
      await fetch(`/api/admin/gallery/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function deleteItem(id: string) {
    const confirmed = window.confirm("Bild wirklich löschen?");
    if (!confirmed) return;
    await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
    await load();
  }

  async function uploadItem() {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", uploadForm.title);
      formData.append("alt", uploadForm.alt);
      formData.append("category", uploadForm.category);
      formData.append("isVisible", String(uploadForm.isVisible));
      formData.append("showOnHomepage", String(uploadForm.showOnHomepage));
      formData.append("isFeatured", String(uploadForm.isFeatured));
      await fetch("/api/admin/gallery", { method: "POST", body: formData });
      setFile(null);
      setUploadForm({
        title: "",
        alt: "",
        category: "umzug",
        isVisible: true,
        showOnHomepage: true,
        isFeatured: false,
      });
      await load();
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-3 py-20 text-slate-500">
        <Loader2 size={18} className="animate-spin" />
        Galerie wird geladen...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-800 dark:text-white">Galerie</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Bilder hochladen, bearbeiten, für die Homepage auswählen und sortieren.
          </p>
        </div>
        <button
          onClick={saveOrder}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-70"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Reihenfolge und Änderungen speichern
        </button>
      </div>

      <section className="glass-card rounded-[28px] p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-700 dark:text-emerald-300">
            <Upload size={18} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Neues Bild hochladen</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Neue Uploads werden im Ordner `public/uploads/gallery` gespeichert.</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <input className={inputClass} placeholder="Titel" value={uploadForm.title} onChange={(event) => setUploadForm((current) => ({ ...current, title: event.target.value }))} />
          <input className={inputClass} placeholder="Alt-Text" value={uploadForm.alt} onChange={(event) => setUploadForm((current) => ({ ...current, alt: event.target.value }))} />
          <select className={inputClass} value={uploadForm.category} onChange={(event) => setUploadForm((current) => ({ ...current, category: event.target.value as GalleryCategory }))}>
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <label className={`${inputClass} flex cursor-pointer items-center justify-center gap-2`}>
            <Plus size={16} />
            <span>{file ? file.name : "Datei auswählen"}</span>
            <input type="file" accept="image/*" className="hidden" onChange={(event) => setFile(event.target.files?.[0] || null)} />
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-300">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={uploadForm.isVisible} onChange={(event) => setUploadForm((current) => ({ ...current, isVisible: event.target.checked }))} />
            Sichtbar
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={uploadForm.showOnHomepage} onChange={(event) => setUploadForm((current) => ({ ...current, showOnHomepage: event.target.checked }))} />
            Auf Homepage zeigen
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={uploadForm.isFeatured} onChange={(event) => setUploadForm((current) => ({ ...current, isFeatured: event.target.checked }))} />
            Als hervorgehobenes Bild markieren
          </label>
        </div>

        <div className="mt-5">
          <button onClick={uploadItem} disabled={uploading || !file} className="inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100 disabled:opacity-60 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            Bild hochladen
          </button>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        {orderedItems.map((item, index) => (
          <article key={item.id} className="glass-card rounded-[28px] p-5">
            <div className="grid gap-5 md:grid-cols-[180px_1fr]">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-white/5">
                <Image src={item.imageUrl} alt={item.alt} fill className="object-cover" sizes="180px" />
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => moveItem(item.id, -1)} className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:text-white">
                    <ArrowUp size={14} /> Hoch
                  </button>
                  <button type="button" onClick={() => moveItem(item.id, 1)} className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:text-white">
                    <ArrowDown size={14} /> Runter
                  </button>
                  <button type="button" onClick={() => updateItem(item.id, { isVisible: !item.isVisible })} className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:text-white">
                    {item.isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                    {item.isVisible ? "Sichtbar" : "Versteckt"}
                  </button>
                  <button type="button" onClick={() => updateItem(item.id, { isFeatured: !item.isFeatured })} className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:text-white">
                    <Star size={14} className={item.isFeatured ? "fill-current" : ""} />
                    Featured
                  </button>
                </div>

                <input className={inputClass} value={item.title} onChange={(event) => updateItem(item.id, { title: event.target.value })} placeholder="Titel" />
                <input className={inputClass} value={item.alt} onChange={(event) => updateItem(item.id, { alt: event.target.value })} placeholder="Alt-Text" />

                <div className="grid gap-3 sm:grid-cols-2">
                  <select className={inputClass} value={item.category} onChange={(event) => updateItem(item.id, { category: event.target.value as GalleryCategory })}>
                    {categoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  <input className={inputClass} type="number" value={index + 1} onChange={(event) => updateItem(item.id, { sortOrder: Number(event.target.value) - 1 })} />
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-300">
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={item.isVisible} onChange={(event) => updateItem(item.id, { isVisible: event.target.checked })} />
                    Sichtbar
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={item.showOnHomepage} onChange={(event) => updateItem(item.id, { showOnHomepage: event.target.checked })} />
                    Auf Homepage
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={item.isFeatured} onChange={(event) => updateItem(item.id, { isFeatured: event.target.checked })} />
                    Featured
                  </label>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button onClick={() => saveItem(item)} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100">
                    <Save size={15} />
                    Speichern
                  </button>
                  <button onClick={() => deleteItem(item.id)} className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 dark:border-red-500/20 dark:text-red-300 dark:hover:bg-red-500/10">
                    <Trash2 size={15} />
                    Löschen
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
