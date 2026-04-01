"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  AlertCircle,
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

type UploadFormState = {
  title: string;
  alt: string;
  category: GalleryCategory;
  isVisible: boolean;
  showOnHomepage: boolean;
  isFeatured: boolean;
};

const emptyUploadForm: UploadFormState = {
  title: "",
  alt: "",
  category: "umzug",
  isVisible: true,
  showOnHomepage: true,
  isFeatured: false,
};

export default function GaleriePage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [renderErrors, setRenderErrors] = useState<Record<string, boolean>>({});
  const [uploadForm, setUploadForm] = useState<UploadFormState>(emptyUploadForm);

  const orderedItems = useMemo(
    () => [...items].sort((a, b) => a.sortOrder - b.sortOrder),
    [items],
  );

  const stats = useMemo(
    () => ({
      total: orderedItems.length,
      visible: orderedItems.filter((item) => item.isVisible).length,
      hidden: orderedItems.filter((item) => !item.isVisible).length,
      homepage: orderedItems.filter((item) => item.isVisible && item.showOnHomepage).length,
    }),
    [orderedItems],
  );

  async function load() {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/gallery", { cache: "no-store" });
      if (!response.ok) throw new Error("Galerie konnte nicht geladen werden");
      const data = (await response.json()) as GalleryItem[];
      setItems(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

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

  function selectFiles(nextFiles: File[]) {
    setUploadError("");
    setUploadSuccess("");
    setUploadProgress(0);
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setSelectedFiles(nextFiles);
    setPreviewUrls(nextFiles.map((file) => URL.createObjectURL(file)));
  }

  function uploadGalleryFormData(formData: FormData) {
    return new Promise<{ item?: GalleryItem }>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/admin/gallery");
      xhr.responseType = "json";

      xhr.upload.onprogress = (event) => {
        if (!event.lengthComputable) return;
        const nextProgress = Math.max(15, Math.min(85, Math.round((event.loaded / event.total) * 85)));
        setUploadProgress(nextProgress);
      };

      xhr.onerror = () => reject(new Error("Netzwerkfehler beim Upload"));
      xhr.onload = () => {
        const payload =
          xhr.response && typeof xhr.response === "object"
            ? (xhr.response as { error?: string; item?: GalleryItem })
            : null;

        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(payload || {});
          return;
        }

        reject(new Error(payload?.error || "Upload fehlgeschlagen"));
      };

      xhr.send(formData);
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
    const confirmed = window.confirm("Bild wirklich dauerhaft löschen?");
    if (!confirmed) return;
    await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
    await load();
  }

  async function uploadItems() {
    if (selectedFiles.length === 0) return;
    setUploading(true);
    setUploadError("");
    setUploadSuccess("");
    setUploadProgress(10);

    try {
      let completed = 0;

      for (let index = 0; index < selectedFiles.length; index += 1) {
        const file = selectedFiles[index];
        const fallbackName = file.name.replace(/\.[^.]+$/, "");
        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", uploadForm.title || fallbackName);
        formData.append("alt", uploadForm.alt || fallbackName);
        formData.append("category", uploadForm.category);
        formData.append("isVisible", String(uploadForm.isVisible));
        formData.append("showOnHomepage", String(uploadForm.showOnHomepage));
        formData.append("isFeatured", String(index === 0 ? uploadForm.isFeatured : false));

        const payload = await uploadGalleryFormData(formData);
        const uploadedItem = payload.item;
        if (!uploadedItem?.imageUrl) {
          throw new Error("Bilddatensatz wurde ohne gültige Bild-URL gespeichert");
        }

        const imageCheck = await fetch(uploadedItem.imageUrl, { method: "HEAD", cache: "no-store" });
        if (!imageCheck.ok) {
          throw new Error(`Bild ist nach dem Upload nicht erreichbar (${imageCheck.status})`);
        }

        completed += 1;
        setUploadProgress(Math.max(15, Math.min(100, Math.round((completed / selectedFiles.length) * 100))));
      }

      setUploadSuccess(
        selectedFiles.length === 1
          ? "Bild erfolgreich hochgeladen und gespeichert."
          : `${selectedFiles.length} Bilder erfolgreich hochgeladen und gespeichert.`,
      );
      selectFiles([]);
      setUploadForm(emptyUploadForm);
      await load();
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload fehlgeschlagen");
    } finally {
      setUploading(false);
      window.setTimeout(() => setUploadProgress(0), 1200);
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
            Bilder hochladen, sichtbar oder verborgen schalten, für die Website sortieren und vollständig verwalten.
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

      <section className="grid gap-4 md:grid-cols-4">
        <div className="glass-card rounded-[24px] p-5">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-white/45">Gesamt</p>
          <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
        </div>
        <div className="glass-card rounded-[24px] p-5">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-white/45">Sichtbar</p>
          <p className="mt-3 text-3xl font-bold text-emerald-700 dark:text-emerald-300">{stats.visible}</p>
        </div>
        <div className="glass-card rounded-[24px] p-5">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-white/45">Verborgen</p>
          <p className="mt-3 text-3xl font-bold text-amber-700 dark:text-amber-300">{stats.hidden}</p>
        </div>
        <div className="glass-card rounded-[24px] p-5">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-white/45">Homepage-Cover</p>
          <p className="mt-3 text-3xl font-bold text-sky-700 dark:text-sky-300">{stats.homepage}</p>
        </div>
      </section>

      <section className="glass-card rounded-[28px] p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-700 dark:text-emerald-300">
            <Upload size={18} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Neue Bilder hochladen</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Einzelne Bilder oder mehrere Dateien gleichzeitig hochladen, sofort speichern und anschließend steuern.
            </p>
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
            <span>{selectedFiles.length > 0 ? `${selectedFiles.length} Datei(en) ausgewählt` : "Datei(en) auswählen"}</span>
            <input type="file" accept="image/*" multiple className="hidden" onChange={(event) => selectFiles(Array.from(event.target.files || []))} />
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-300">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={uploadForm.isVisible} onChange={(event) => setUploadForm((current) => ({ ...current, isVisible: event.target.checked }))} />
            Sichtbar auf Website
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={uploadForm.showOnHomepage} onChange={(event) => setUploadForm((current) => ({ ...current, showOnHomepage: event.target.checked }))} />
            Als Startseiten-Cover verwendbar
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={uploadForm.isFeatured} onChange={(event) => setUploadForm((current) => ({ ...current, isFeatured: event.target.checked }))} />
            Erstes Bild hervorheben
          </label>
        </div>

        {previewUrls.length > 0 && (
          <div className="mt-5 rounded-[24px] border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
            <div className="mb-4 space-y-1 text-sm text-slate-600 dark:text-white/60">
              <p className="font-semibold text-slate-900 dark:text-white">Lokale Vorschau vor dem Upload</p>
              <p>{selectedFiles.length} Datei(en) werden nach dem Speichern direkt in die Galerie übernommen.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {previewUrls.map((url, index) => (
                <div key={url} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-white/5">
                  <div className="relative aspect-[4/3]">
                    <Image src={url} alt={`Lokale Vorschau ${index + 1}`} fill unoptimized className="object-cover" />
                  </div>
                  <div className="px-3 py-2 text-xs text-slate-600 dark:text-white/60">
                    <p className="truncate font-medium text-slate-900 dark:text-white">{selectedFiles[index]?.name}</p>
                    <p>{selectedFiles[index] ? `${Math.round(selectedFiles[index].size / 1024)} KB` : ""}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(uploading || uploadError || uploadSuccess) && (
          <div className="mt-5 space-y-3">
            {uploading && (
              <div className="space-y-2">
                <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-navy-800">
                  <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${uploadProgress}%` }} />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Upload wird verarbeitet und geprüft...</p>
              </div>
            )}
            {uploadError && (
              <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}
            {uploadSuccess && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                {uploadSuccess}
              </div>
            )}
          </div>
        )}

        <div className="mt-5">
          <button onClick={uploadItems} disabled={uploading || selectedFiles.length === 0} className="inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100 disabled:opacity-60 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            {selectedFiles.length > 1 ? `${selectedFiles.length} Bilder hochladen` : "Bild hochladen"}
          </button>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        {orderedItems.map((item, index) => (
          <article key={item.id} className="glass-card rounded-[28px] p-5">
            <div className="grid gap-5 md:grid-cols-[180px_1fr]">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-white/5">
                {!renderErrors[item.id] ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.alt}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="180px"
                    onError={() => setRenderErrors((current) => ({ ...current, [item.id]: true }))}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center gap-2 px-4 text-center text-xs text-red-600 dark:text-red-300">
                    <AlertCircle size={14} />
                    <span>Bild kann nicht geladen werden: {item.imageUrl}</span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700 dark:bg-white/10 dark:text-white/80">
                    Position {index + 1}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700 dark:bg-white/10 dark:text-white/80">
                    {categoryOptions.find((option) => option.value === item.category)?.label || item.category}
                  </span>
                  <span className={`rounded-full px-3 py-1 ${item.isVisible ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300" : "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300"}`}>
                    {item.isVisible ? "Sichtbar auf Website" : "Nur im Admin"}
                  </span>
                  <span className={`rounded-full px-3 py-1 ${item.showOnHomepage ? "bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300" : "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-white/70"}`}>
                    {item.showOnHomepage ? "Homepage-Cover" : "Nicht auf Startseite"}
                  </span>
                </div>

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

                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-white/45">
                  <p>Bild-URL: {item.imageUrl}</p>
                  <p className="mt-1 break-all">Storage-Pfad: {item.storagePath || "nicht gesetzt"}</p>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-300">
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={item.isVisible} onChange={(event) => updateItem(item.id, { isVisible: event.target.checked })} />
                    Sichtbar
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={item.showOnHomepage} onChange={(event) => updateItem(item.id, { showOnHomepage: event.target.checked })} />
                    Für Homepage erlauben
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={item.isFeatured} onChange={(event) => updateItem(item.id, { isFeatured: event.target.checked })} />
                    Hervorgehoben
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
