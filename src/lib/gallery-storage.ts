import fs from "fs/promises";
import path from "path";

const APP_GALLERY_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "gallery");
const STANDALONE_GALLERY_UPLOAD_DIR = path.join(
  process.cwd(),
  ".next",
  "standalone",
  "public",
  "uploads",
  "gallery",
);

const CONTENT_TYPES: Record<string, string> = {
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

function normalizeFileName(fileName: string) {
  const decoded = decodeURIComponent(fileName || "");
  const sanitized = path.basename(decoded).trim();
  if (!sanitized || sanitized.includes("..")) {
    throw new Error("invalid_gallery_file_name");
  }
  return sanitized;
}

export function getGalleryMediaUrl(fileName: string) {
  return `/api/gallery/media?file=${encodeURIComponent(normalizeFileName(fileName))}`;
}

export async function getWritableGalleryUploadTargets() {
  const targets = [APP_GALLERY_UPLOAD_DIR];
  try {
    await fs.mkdir(STANDALONE_GALLERY_UPLOAD_DIR, { recursive: true });
    targets.push(STANDALONE_GALLERY_UPLOAD_DIR);
  } catch {
    // Standalone output does not exist in every environment.
  }

  await Promise.all(targets.map((target) => fs.mkdir(target, { recursive: true })));
  return targets;
}

export async function persistGalleryUpload(fileName: string, buffer: Buffer) {
  const normalizedFileName = normalizeFileName(fileName);
  const targets = await getWritableGalleryUploadTargets();
  const absolutePaths = targets.map((target) => path.join(target, normalizedFileName));

  await Promise.all(absolutePaths.map((absolutePath) => fs.writeFile(absolutePath, buffer)));

  const verification = await Promise.all(
    absolutePaths.map(async (absolutePath) => {
      const stat = await fs.stat(absolutePath);
      return { absolutePath, size: stat.size };
    }),
  );

  if (verification.some((entry) => entry.size === 0)) {
    throw new Error("upload_written_but_empty");
  }

  return {
    fileName: normalizedFileName,
    storagePath: absolutePaths[0],
    writtenFiles: absolutePaths,
  };
}

export function extractGalleryFileName(imageUrl?: string | null, storagePath?: string | null) {
  const fromStorage = storagePath ? path.basename(storagePath) : "";
  if (fromStorage) return normalizeFileName(fromStorage);

  if (!imageUrl) return null;

  try {
    const parsedUrl = new URL(imageUrl, "https://seeltransport.de");
    const queryFile = parsedUrl.searchParams.get("file");
    if (queryFile) {
      return normalizeFileName(queryFile);
    }
  } catch {
    // Ignore invalid URL parsing and continue with regex extraction.
  }

  const mediaMatch = imageUrl.match(/\/api\/gallery\/media\/([^/?#]+)/i);
  if (mediaMatch?.[1]) {
    return normalizeFileName(mediaMatch[1]);
  }

  const uploadsMatch = imageUrl.match(/\/uploads\/gallery\/([^/?#]+)/i);
  if (uploadsMatch?.[1]) {
    return normalizeFileName(uploadsMatch[1]);
  }

  return null;
}

export async function findGalleryUpload(fileName: string) {
  const normalizedFileName = normalizeFileName(fileName);
  const candidates = [
    path.join(APP_GALLERY_UPLOAD_DIR, normalizedFileName),
    path.join(STANDALONE_GALLERY_UPLOAD_DIR, normalizedFileName),
  ];

  for (const absolutePath of candidates) {
    try {
      const stat = await fs.stat(absolutePath);
      if (stat.isFile() && stat.size > 0) {
        return { absolutePath, stat };
      }
    } catch {
      // Continue with next candidate.
    }
  }

  return null;
}

export function getGalleryContentType(fileName: string) {
  return CONTENT_TYPES[path.extname(fileName).toLowerCase()] || "application/octet-stream";
}

export async function removeGalleryUploadCopies(imageUrl?: string | null, storagePath?: string | null) {
  const fileName = extractGalleryFileName(imageUrl, storagePath);
  const targets = new Set<string>();

  if (storagePath) targets.add(storagePath);
  if (fileName) {
    targets.add(path.join(APP_GALLERY_UPLOAD_DIR, fileName));
    targets.add(path.join(STANDALONE_GALLERY_UPLOAD_DIR, fileName));
  }

  await Promise.all(
    Array.from(targets).map(async (targetPath) => {
      try {
        await fs.rm(targetPath, { force: true });
      } catch {
        // Ignore missing files.
      }
    }),
  );
}
