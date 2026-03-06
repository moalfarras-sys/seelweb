import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { buildContractSignatureEmail, getContractSignatureSubject } from "@/lib/contract-email";
import { toContractSummary } from "@/lib/contracts";
import { createContractFromOffer } from "@/lib/workflow";

type Params = { params: Promise<{ id: string }> };

export async function POST(_req: NextRequest, { params }: Params) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 });
    }

    const { id } = await params;
    const offer = await prisma.offer.findUnique({
      where: { id },
      include: { customer: true, order: true, contracts: true },
    });

    if (!offer) {
      return NextResponse.json({ error: "Angebot nicht gefunden" }, { status: 404 });
    }

    const contract = offer.contracts[0] || (await createContractFromOffer(offer.id));
    const pendingContract =
      contract.status === "SIGNED" || contract.status === "LOCKED"
        ? contract
        : await prisma.contract.update({
            where: { id: contract.id },
            data: { status: "PENDING_SIGNATURE" },
          });

    const updated = await prisma.offer.update({
      where: { id: offer.id },
      data: {
        status: "APPROVED",
        approvedAt: new Date(),
        order: { update: { status: "ANGEBOT" } },
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
    const signUrl = `${baseUrl}/vertrag/${pendingContract.token}`;

    await sendEmail({
      to: offer.customer.email,
      subject: getContractSignatureSubject(offer.offerNumber),
      html: buildContractSignatureEmail({
        customerName: offer.customer.name,
        offerNumber: offer.offerNumber,
        contractNumber: pendingContract.contractNumber,
        totalPrice: offer.totalPrice,
        signUrl,
      }),
    });

    await prisma.communication.create({
      data: {
        customerId: offer.customerId,
        offerId: offer.id,
        contractId: pendingContract.id,
        channel: "EMAIL",
        direction: "OUTBOUND",
        subject: `Freigabe und Signaturlink fuer ${offer.offerNumber}`,
        message: "Angebot freigegeben und Vertrag zur digitalen Unterschrift automatisch versendet.",
        metaJson: { signUrl },
        sentBy: session.email || "admin",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Angebot freigegeben und Signaturlink automatisch versendet.",
      offer: updated,
      contract: toContractSummary(pendingContract),
    });
  } catch (error) {
    console.error("POST /api/admin/angebote/[id]/approve error:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
