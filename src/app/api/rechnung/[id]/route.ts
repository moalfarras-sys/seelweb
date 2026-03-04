import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateInvoicePDF } from "@/lib/pdf";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;

  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      order: {
        include: {
          customer: true,
          service: true,
        },
      },
      contract: true,
    },
  });

  if (!invoice) {
    return NextResponse.json({ error: "Rechnung nicht gefunden" }, { status: 404 });
  }

  const breakdown = invoice.order.breakdownJson as {
    services: Array<{ pricing: { lines: Array<{ label: string; amount: number }> } }>;
  } | null;

  const fallbackItems = [{ description: invoice.order.service.nameDe, amount: invoice.amount }];
  const items =
    breakdown?.services?.flatMap((s) =>
      (s.pricing.lines || [])
        .filter(
          (line) =>
            line.label !== "Nettobetrag" &&
            line.label !== "MwSt. (19%)" &&
            line.label !== "Gesamtbetrag"
        ).map((line) => ({ description: line.label, amount: Number(line.amount || 0) }))
    ) || fallbackItems;

  const pdf = generateInvoicePDF({
    invoiceNumber: invoice.invoiceNumber,
    orderNumber: invoice.order.orderNumber,
    customerName: invoice.order.customer.name,
    customerEmail: invoice.order.customer.email,
    customerCompany: invoice.order.customer.company || undefined,
    service: invoice.order.service.nameDe,
    date: invoice.createdAt.toLocaleDateString("de-DE"),
    netto: invoice.amount,
    mwst: invoice.tax,
    total: invoice.totalAmount,
    items,
    dueDate: invoice.dueDate.toLocaleDateString("de-DE"),
  });

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="Rechnung-${invoice.invoiceNumber}.pdf"`,
    },
  });
}