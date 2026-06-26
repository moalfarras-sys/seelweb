import { test, expect } from "@playwright/test";

test("public pages buttons and links smoke", async ({ page }) => {
  const pages = [
    "/",
    "/buchen",
    "/track",
    "/leistungen",
    "/leistungen/umzug",
    "/leistungen/expressumzug",
    "/leistungen/entruempelung",
    "/leistungen/entsorgung",
    "/unternehmen",
    "/kontakt",
    "/agb",
    "/impressum",
    "/datenschutz",
  ];

  for (const p of pages) {
    await page.goto(p);
    await expect(page.locator("body")).toBeVisible();
    const clickables = page.locator("a:visible,button:visible");
    await expect(clickables.first()).toBeVisible();
    await page.waitForTimeout(150);
  }

  await page.goto("/buchen");
  await page.getByRole("button", { name: /Wohnungsreinigung/i }).click();
  await page.getByRole("button", { name: /^Umzug Standardumzug/i }).click();
  await page.getByRole("button", { name: /Weiter zu Details/i }).click();
  await expect(page.getByRole("heading", { name: /Konfiguration/i })).toBeVisible();
  await expect(page.getByText(/Startadresse/i)).toBeVisible();
  await expect(page.getByText(/Zieladresse/i)).toBeVisible();
});

test("admin navigation buttons smoke", async ({ page }) => {
  test.setTimeout(180000);
  await page.goto("/admin/login");
  await page.locator('input[type="email"]').fill("info@seeltransport.de");
  await page.locator('input[type="password"]').fill("Amalia@2024.");
  await page.getByRole("button", { name: /Anmelden|Login/i }).click();
  await expect(page).toHaveURL(/\/admin(\/)?$/);

  const adminPages = [
    "/admin",
    "/admin/buchungen",
    "/admin/angebote",
    "/admin/kunden",
    "/admin/preise",
    "/admin/rechnungen",
    "/admin/buchhaltung",
    "/admin/berichte",
    "/admin/gesundheit",
    "/admin/einstellungen",
  ];

  for (const p of adminPages) {
    await page.goto(p);
    await expect(page.locator("main").first()).toBeVisible();
    await expect(page.locator('a[href^="/admin"]:visible').first()).toBeVisible();
    await page.waitForTimeout(150);
  }

  await page.goto("/admin");
  await page.getByRole("button", { name: /Abmelden|Logout/i }).click();
  await expect(page).toHaveURL(/\/admin\/login/);
});
