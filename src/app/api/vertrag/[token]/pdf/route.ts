import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateSignedContractPDF } from "@/lib/pdf";

type Params = { params: Promise<{ token: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { token } = await params;
    const download = req.nextUrl.searchParams.get("download") === "1";

    const contract = await prisma.contract.findUnique({
      where: { token },
      include: {
        customer: true,
        offer: {
          include: {
            items: { orderBy: { position: "asc" } },
            order: { include: { service: true, fromAddress: true, toAddress: true } },
          },
        },
      },
    });

    if (!contract) {
      return NextResponse.json({ error: "Vertrag nicht gefunden" }, { status: 404 });
    }

    let pdfBuffer: Buffer;
    if (contract.signedPdfBase64) {
      pdfBuffer = Buffer.from(contract.signedPdfBase64, "base64");
    } else {
      pdfBuffer = generateSignedContractPDF({
        contractNumber: contract.contractNumber,
        offerNumber: contract.offer.offerNumber,
        customerName: contract.customer.name,
        customerEmail: contract.customer.email,
        customerCompany: contract.customer.company,
        serviceSummary: contract.offer.order.service.nameDe,
        serviceDate: contract.offer.order.scheduledAt?.toLocaleDateString("de-DE") ?? null,
        timeSlot: contract.offer.order.timeSlot,
        fromAddress: contract.offer.order.fromAddress
          ? [
              contract.offer.order.fromAddress.street,
              contract.offer.order.fromAddress.houseNumber,
              contract.offer.order.fromAddress.zip,
              contract.offer.order.fromAddress.city,
            ]
              .filter(Boolean)
              .join(", ")
          : null,
        toAddress: contract.offer.order.toAddress
          ? [
              contract.offer.order.toAddress.street,
              contract.offer.order.toAddress.houseNumber,
              contract.offer.order.toAddress.zip,
              contract.offer.order.toAddress.city,
            ]
              .filter(Boolean)
              .join(", ")
          : null,
        items: contract.offer.items.map((i) => ({
          title: i.title,
          description: i.description,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          totalPrice: i.totalPrice,
        })),
        subtotal: contract.offer.items.reduce((sum, i) => sum + i.totalPrice, 0),
        discountAmount: contract.offer.discountAmount,
        extraFees: contract.offer.extraFees,
        totalPrice: contract.finalTotalPrice,
        netto: contract.finalNetto,
        mwst: contract.finalMwst,
        signedByName: contract.signedByName || "Nicht unterschrieben",
        signedAt: contract.signedAt?.toLocaleString("de-DE") || "Nicht unterschrieben",
        ipAddress: contract.signedByIp,
        signatureDataUrl: null,
      });
    }

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `${download ? "attachment" : "inline"}; filename="Vertrag-${contract.contractNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error("GET /api/vertrag/[token]/pdf error:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}

