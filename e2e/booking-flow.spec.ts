import { test, expect } from "@playwright/test";
import { prisma } from "../src/lib/db";
import { createContractFromOffer } from "../src/lib/workflow";
import "dotenv/config";

const hasDatabase = Boolean(process.env.DATABASE_URL);

test.describe("Booking flow hardening", () => {
  test("quote -> booking -> tracking -> offer pdf -> sign", async ({ request }) => {
    test.skip(!hasDatabase, "DATABASE_URL is required for booking flow integration tests.");
    const unique = Date.now().toString(36);
    const customerEmail = `qa+${unique}@example.com`;

    const quoteRes = await request.post("/api/preisrechner", {
      data: {
        services: [
          {
            serviceType: "HOME_CLEANING",
            zip: "10115",
            hours: 2,
            workers: 1,
            hasElevatorFrom: false,
            hasElevatorTo: false,
            express24h: false,
            express48h: false,
            extras: [],
          },
        ],
        customerEmail,
      },
    });
    expect(quoteRes.ok()).toBeTruthy();
    const quoteJson = await quoteRes.json();
    expect(quoteJson.success).toBeTruthy();
    expect(typeof quoteJson.pricing?.total).toBe("number");
    expect(typeof quoteJson.pricing?.quoteFingerprint).toBe("string");

    const bookingRes = await request.post("/api/buchung", {
      data: {
        customer: {
          name: `QA User ${unique}`,
          email: customerEmail,
          phone: "+491700000000",
        },
        services: [
          {
            serviceType: "HOME_CLEANING",
            hours: 2,
            extras: [],
            addressFrom: {
              displayName: "Musterstrasse 1, 10115 Berlin",
              street: "Musterstrasse",
              houseNumber: "1",
              zip: "10115",
              city: "Berlin",
              state: "",
            },
          },
        ],
        scheduledAt: "2026-04-15",
        timeSlot: "10:00-12:00",
        paymentMethod: "UEBERWEISUNG",
        quotedTotal: quoteJson.pricing.total,
        quoteFingerprint: quoteJson.pricing.quoteFingerprint,
      },
    });

    expect(bookingRes.ok()).toBeTruthy();
    const bookingJson = await bookingRes.json();
    expect(bookingJson.success).toBeTruthy();
    expect(typeof bookingJson.offerToken).toBe("string");
    expect(String(bookingJson.trackingNumber)).toMatch(/^T-\d{4}-\d{5}$/);

    const trackingRes = await request.get(`/api/tracking/${encodeURIComponent(bookingJson.trackingNumber)}`);
    expect(trackingRes.ok()).toBeTruthy();
    const trackingJson = await trackingRes.json();
    expect(trackingJson.success).toBeTruthy();
    expect(trackingJson.trackingNumber).toBe(bookingJson.trackingNumber);
    expect(trackingJson.status).toBe("ANFRAGE");

    const offerToken = String(bookingJson.offerToken);
    const offer = await prisma.offer.findUnique({
      where: { token: offerToken },
      include: { contracts: true },
    });
    expect(offer).toBeTruthy();

    const contract = await createContractFromOffer(offer!.id);
    await prisma.offer.update({
      where: { id: offer!.id },
      data: { status: "APPROVED", approvedAt: new Date() },
    });

    const previewRes = await request.get(`/api/angebot/${offerToken}/pdf`);
    expect(previewRes.ok()).toBeTruthy();
    expect(previewRes.headers()["content-disposition"]).toContain("inline;");

    const downloadRes = await request.get(`/api/angebot/${offerToken}/pdf?download=1`);
    expect(downloadRes.ok()).toBeTruthy();
    expect(downloadRes.headers()["content-disposition"]).toContain("attachment;");

    const signRes = await request.post(`/api/vertrag/${contract.token}/sign`, {
      data: {
        name: "QA Signer",
        agreed: true,
        signatureType: "TYPED",
      },
    });
    expect(signRes.ok()).toBeTruthy();
    const signJson = await signRes.json();
    expect(signJson.success).toBeTruthy();

    const signedContract = await prisma.contract.findUnique({
      where: { id: contract.id },
      select: { status: true, signedPdfBase64: true, signedAt: true },
    });
    expect(signedContract?.status).toBe("SIGNED");
    expect(Boolean(signedContract?.signedPdfBase64)).toBeTruthy();
    expect(Boolean(signedContract?.signedAt)).toBeTruthy();
  });

  test("booking page renders service-first flow", async ({ page }) => {
    await page.goto("/buchen");
    await expect(page.getByRole("heading", { name: /Intelligente Buchung|Online buchen/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Wohnungsreinigung/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Umzug/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Live-Preis/i })).toBeVisible();
    await expect(page.getByText(/Services konfigurieren, um Preis zu sehen\./i)).toBeVisible();
  });
});
