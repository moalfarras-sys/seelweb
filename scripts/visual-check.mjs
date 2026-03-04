import { chromium } from "@playwright/test";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const BASE = "http://127.0.0.1:3003";
console.log("Using", BASE);

const OUT = join(process.cwd(), "screenshots");
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();

const pages = [
  { name: "home", url: "/" },
  { name: "leistungen", url: "/leistungen" },
  { name: "buchen", url: "/buchen" },
  { name: "kontakt", url: "/kontakt" },
];

for (const { name, url } of pages) {
  try {
    await page.goto(BASE + url, { waitUntil: "load", timeout: 60000 });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: join(OUT, `${name}.png`), fullPage: false });
    console.log("OK", name);
  } catch (e) {
    console.log("FAIL", name, e.message);
  }
}

await browser.close();
console.log("Screenshots in", OUT);
