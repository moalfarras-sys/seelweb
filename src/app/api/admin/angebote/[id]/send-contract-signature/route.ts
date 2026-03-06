import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getInternalNotificationBcc, sendEmail } from "@/lib/email";
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
      include: { customer: true, contracts: true },
    });

    if (!offer) {
      return NextResponse.json({ error: "Angebot nicht gefunden" }, { status: 404 });
    }

    if (offer.status !== "APPROVED" && offer.status !== "ACCEPTED") {
      return NextResponse.json({ error: "Angebot ist noch nicht freigegeben." }, { status: 409 });
    }

    const contract = offer.contracts[0] || (await createContractFromOffer(offer.id));
    if (contract.status === "SIGNED" || contract.status === "LOCKED") {
      return NextResponse.json({ error: "Vertrag ist bereits unterschrieben." }, { status: 409 });
    }

    const pendingContract =
      contract.status === "PENDING_SIGNATURE"
        ? contract
        : await prisma.contract.update({
            where: { id: contract.id },
            data: { status: "PENDING_SIGNATURE" },
          });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
    const signUrl = `${baseUrl}/vertrag/${pendingContract.token}`;
    const internalBcc = getInternalNotificationBcc(offer.customer.email);

    const emailResult = await sendEmail({
      to: offer.customer.email,
      bcc: internalBcc,
      subject: getContractSignatureSubject(offer.offerNumber),
      html: buildContractSignatureEmail({
        customerName: offer.customer.name,
        offerNumber: offer.offerNumber,
        contractNumber: pendingContract.contractNumber,
        totalPrice: offer.totalPrice,
        signUrl,
      }),
      requestId: `contract-resend-${offer.id}`,
      throwOnFailure: true,
    });

    await prisma.communication.create({
      data: {
        customerId: offer.customerId,
        offerId: offer.id,
        contractId: pendingContract.id,
        channel: "EMAIL",
        direction: "OUTBOUND",
        subject: `Vertrag zur Signatur gesendet (${offer.offerNumber})`,
        message: `Signaturlink versendet: ${signUrl}`,
        metaJson: { signUrl, messageId: emailResult.messageId, internalBcc },
        sentBy: session.email || "admin",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Signaturlink erneut versendet.",
      contract: toContractSummary(pendingContract),
      contractToken: pendingContract.token,
      signUrl,
    });
  } catch (error) {
    console.error("POST /api/admin/angebote/[id]/send-contract-signature error:", error);
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
  }
}
