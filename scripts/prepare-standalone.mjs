import { cp, mkdir, stat } from "fs/promises";
import path from "path";

const root = process.cwd();
const source = path.join(root, ".next", "static");
const target = path.join(root, ".next", "standalone", ".next", "static");

async function exists(targetPath) {
  try {
    await stat(targetPath);
    return true;
  } catch {
    return false;
  }
}

if (await exists(source)) {
  await mkdir(path.dirname(target), { recursive: true });
  await cp(source, target, { recursive: true, force: true });
  console.log(`[prepare-standalone] copied ${source} -> ${target}`);
} else {
  console.warn(`[prepare-standalone] skipped; source not found: ${source}`);
}
