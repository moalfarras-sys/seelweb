import fs from "fs/promises";
import path from "path";

const APP_ACCOUNTING_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "accounting");
const STANDALONE_ACCOUNTING_UPLOAD_DIR = path.join(
  process.cwd(),
  ".next",
  "standalone",
  "public",
  "uploads",
  "accounting",
);

const CONTENT_TYPES: Record<string, string> = {
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".webp": "image/webp",
};

function normalizeFileName(fileName: string) {
  const sanitized = path.basename(decodeURIComponent(fileName || "")).trim();
  if (!sanitized || sanitized.includes("..")) {
    throw new Error("invalid_accounting_file_name");
  }
  return sanitized;
}

export function getAccountingMediaUrl(fileName: string) {
  return `/api/accounting/media?file=${encodeURIComponent(normalizeFileName(fileName))}`;
}

async function getWritableAccountingUploadTargets() {
  const targets = [APP_ACCOUNTING_UPLOAD_DIR];
  try {
    await fs.mkdir(STANDALONE_ACCOUNTING_UPLOAD_DIR, { recursive: true });
    targets.push(STANDALONE_ACCOUNTING_UPLOAD_DIR);
  } catch {
    // Standalone output does not exist in every environment.
  }

  await Promise.all(targets.map((target) => fs.mkdir(target, { recursive: true })));
  return targets;
}

export async function persistAccountingUpload(fileName: string, buffer: Buffer) {
  const normalizedFileName = normalizeFileName(fileName);
  const targets = await getWritableAccountingUploadTargets();
  const absolutePaths = targets.map((target) => path.join(target, normalizedFileName));
  await Promise.all(absolutePaths.map((absolutePath) => fs.writeFile(absolutePath, buffer)));
  return {
    fileName: normalizedFileName,
    storagePath: absolutePaths[0],
    writtenFiles: absolutePaths,
  };
}

export async function findAccountingUpload(fileName: string) {
  const normalizedFileName = normalizeFileName(fileName);
  const candidates = [
    path.join(APP_ACCOUNTING_UPLOAD_DIR, normalizedFileName),
    path.join(STANDALONE_ACCOUNTING_UPLOAD_DIR, normalizedFileName),
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

export function getAccountingContentType(fileName: string) {
  return CONTENT_TYPES[path.extname(fileName).toLowerCase()] || "application/octet-stream";
}

export async function removeAccountingUploadCopies(attachmentUrl?: string | null, storagePath?: string | null) {
  const fileName = attachmentUrl
    ? (() => {
        try {
          const parsed = new URL(attachmentUrl, "https://seeltransport.de");
          const queryFile = parsed.searchParams.get("file");
          return queryFile ? normalizeFileName(queryFile) : null;
        } catch {
          return null;
        }
      })()
    : null;

  const targets = new Set<string>();
  if (storagePath) targets.add(storagePath);
  if (fileName) {
    targets.add(path.join(APP_ACCOUNTING_UPLOAD_DIR, fileName));
    targets.add(path.join(STANDALONE_ACCOUNTING_UPLOAD_DIR, fileName));
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
