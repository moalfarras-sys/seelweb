import { NextResponse } from "next/server";
import JSZip from "jszip";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateInvoicePDF, generateOfferPDF, generateSignedContractPDF } from "@/lib/pdf";

export const dynamic = "force-dynamic";

function safeName(input: string) {
  return (input || "unbekannt")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\- ]+/g, "")
    .trim()
    .replace(/\s+/g, "_")
    .slice(0, 80);
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      include: {
        customer: true,
        service: true,
        fromAddress: true,
        toAddress: true,
        offer: {
          include: {
            items: { orderBy: { position: "asc" } },
            contracts: true,
          },
        },
        invoices: {
          include: {
            contract: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const zip = new JSZip();
    const root = zip.folder(`seel-export-${new Date().toISOString().slice(0, 10)}`);
    if (!root) throw new Error("ZIP root konnte nicht erstellt werden");

    const manifest: Array<Record<string, string | number | null>> = [];

    for (const order of orders) {
      const customerFolder = root.folder(
        `kunden/${safeName(order.customer.name)}-${order.customer.id.slice(-6)}`
      );
      if (!customerFolder) continue;

      const orderFolder = customerFolder.folder(`auftrag-${order.orderNumber}`);
      if (!orderFolder) continue;

      orderFolder.file(
        "auftrag.json",
        JSON.stringify(
          {
            orderNumber: order.orderNumber,
            trackingNumber: order.trackingNumber,
            status: order.status,
            customer: {
              name: order.customer.name,
              email: order.customer.email,
              phone: order.customer.phone,
              company: order.customer.company,
            },
            service: {
              category: order.service.category,
              nameDe: order.service.nameDe,
            },
            addresses: {
              from: order.fromAddress,
              to: order.toAddress,
            },
            scheduledAt: order.scheduledAt,
            timeSlot: order.timeSlot,
            totalHours: order.totalHours,
            distanceKm: order.distanceKm,
            subtotal: order.subtotal,
            discountAmount: order.discountAmount,
            netto: order.netto,
            mwst: order.mwst,
            totalPrice: order.totalPrice,
            paymentMethod: order.paymentMethod,
            paymentStatus: order.paymentStatus,
            notes: order.notes,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
          },
          null,
          2
        )
      );

      if (order.offer) {
        const offer = order.offer;
        const offerPdf = generateOfferPDF({
          offerNumber: offer.offerNumber,
          validUntil: offer.validUntil.toLocaleDateString("de-DE"),
          customerName: order.customer.name,
          customerEmail: order.customer.email,
          customerPhone: order.customer.phone || undefined,
          customerCompany: order.customer.company || undefined,
          serviceSummary: order.service.nameDe,
          routeDistanceKm: order.distanceKm,
          serviceDate: order.scheduledAt?.toLocaleDateString("de-DE") || null,
          timeSlot: order.timeSlot,
          fromAddress: order.fromAddress
            ? [order.fromAddress.street, order.fromAddress.houseNumber, order.fromAddress.zip, order.fromAddress.city]
                .filter(Boolean)
                .join(", ")
            : null,
          toAddress: order.toAddress
            ? [order.toAddress.street, order.toAddress.houseNumber, order.toAddress.zip, order.toAddress.city]
                .filter(Boolean)
                .join(", ")
            : null,
          items: offer.items.map((item) => ({
            title: item.title,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
          })),
          subtotal: offer.subtotal,
          discountAmount: offer.discountAmount,
          extraFees: offer.extraFees,
          netto: offer.netto,
          mwst: offer.mwst,
          totalPrice: offer.totalPrice,
          notes: order.notes,
          trackingNumber: order.trackingNumber || undefined,
          agbText: "Es gelten unsere AGB.",
        });

        orderFolder.file(`angebot-${offer.offerNumber}.pdf`, offerPdf);
        orderFolder.file(
          "angebot.json",
          JSON.stringify(
            {
              offerNumber: offer.offerNumber,
              status: offer.status,
              validUntil: offer.validUntil,
              subtotal: offer.subtotal,
              discountAmount: offer.discountAmount,
              extraFees: offer.extraFees,
              netto: offer.netto,
              mwst: offer.mwst,
              totalPrice: offer.totalPrice,
              items: offer.items,
            },
            null,
            2
          )
        );

        for (const contract of offer.contracts) {
          let contractPdf: Buffer;
          if (contract.signedPdfBase64) {
            contractPdf = Buffer.from(contract.signedPdfBase64, "base64");
          } else {
            contractPdf = await generateSignedContractPDF({
              contractNumber: contract.contractNumber,
              offerNumber: offer.offerNumber,
              customerName: order.customer.name,
              customerEmail: order.customer.email,
              customerCompany: order.customer.company,
              serviceSummary: order.service.nameDe,
              serviceDate: order.scheduledAt?.toLocaleDateString("de-DE") || null,
              timeSlot: order.timeSlot,
              fromAddress: order.fromAddress
                ? [order.fromAddress.street, order.fromAddress.houseNumber, order.fromAddress.zip, order.fromAddress.city]
                    .filter(Boolean)
                    .join(", ")
                : null,
              toAddress: order.toAddress
                ? [order.toAddress.street, order.toAddress.houseNumber, order.toAddress.zip, order.toAddress.city]
                    .filter(Boolean)
                    .join(", ")
                : null,
              items: offer.items.map((item) => ({
                title: item.title,
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: item.totalPrice,
              })),
              subtotal: offer.subtotal,
              discountAmount: offer.discountAmount,
              extraFees: offer.extraFees,
              totalPrice: contract.finalTotalPrice,
              netto: contract.finalNetto,
              mwst: contract.finalMwst,
              signedByName: contract.signedByName || "Nicht unterschrieben",
              signedAt: contract.signedAt?.toLocaleString("de-DE") || "Nicht unterschrieben",
              ipAddress: contract.signedByIp,
              signatureDataUrl: null,
            });
          }

          orderFolder.file(`vertrag-${contract.contractNumber}.pdf`, contractPdf);
          orderFolder.file(
            `vertrag-${contract.contractNumber}.json`,
            JSON.stringify(
              {
                contractNumber: contract.contractNumber,
                status: contract.status,
                signedAt: contract.signedAt,
                signedByName: contract.signedByName,
                total: contract.finalTotalPrice,
              },
              null,
              2
            )
          );
        }
      }

      for (const invoice of order.invoices) {
        const breakdown = order.breakdownJson as
          | { services: Array<{ pricing: { lines: Array<{ label: string; amount: number }> } }> }
          | null;

        const fallbackItems = [{ description: order.service.nameDe, amount: invoice.amount }];
        const items =
          breakdown?.services?.flatMap((s) =>
            (s.pricing.lines || [])
              .filter(
                (line) =>
                  line.label !== "Nettobetrag" &&
                  line.label !== "MwSt. (19%)" &&
                  line.label !== "Gesamtbetrag"
              )
              .map((line) => ({ description: line.label, amount: Number(line.amount || 0) }))
          ) || fallbackItems;

        const invoicePdf = generateInvoicePDF({
          invoiceNumber: invoice.invoiceNumber,
          orderNumber: order.orderNumber,
          customerName: order.customer.name,
          customerEmail: order.customer.email,
          customerCompany: order.customer.company || undefined,
          service: order.service.nameDe,
          date: invoice.createdAt.toLocaleDateString("de-DE"),
          netto: invoice.amount,
          mwst: invoice.tax,
          total: invoice.totalAmount,
          items,
          dueDate: invoice.dueDate.toLocaleDateString("de-DE"),
        });

        orderFolder.file(`rechnung-${invoice.invoiceNumber}.pdf`, invoicePdf);
      }

      manifest.push({
        customer: order.customer.name,
        customerEmail: order.customer.email,
        orderNumber: order.orderNumber,
        trackingNumber: order.trackingNumber,
        offerNumber: order.offer?.offerNumber || null,
        contracts: order.offer?.contracts.length || 0,
        invoices: order.invoices.length,
        totalPrice: order.totalPrice,
        status: order.status,
      });
    }

    root.file("manifest.json", JSON.stringify(manifest, null, 2));

    const buffer = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE", compressionOptions: { level: 7 } });
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="seel-komplettexport-${stamp}.zip"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("GET /api/admin/export/all error:", error);
    return NextResponse.json({ error: "Export fehlgeschlagen" }, { status: 500 });
  }
}
