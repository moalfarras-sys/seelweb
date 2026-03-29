import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { CONTACT } from "@/config/contact";
import type { ServiceCategory } from "@prisma/client";

const CATEGORY_MAP: Record<string, ServiceCategory> = {
  BUEROUMZUG: "MOVING",
  SCHULUMZUG: "MOVING",
  REINIGUNG: "OFFICE_CLEANING",
  ENTRUEMPELUNG: "DISPOSAL",
  SONSTIGES: "MOVING",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { company, contact, email, phone, category, description, budget } = body;

    if (!company || !contact || !email || !phone || !category || !description) {
      return NextResponse.json({ error: "Pflichtfelder fehlen" }, { status: 400 });
    }

    const customer = await prisma.customer.upsert({
      where: { email },
      update: {
        name: contact,
        phone,
        company,
      },
      create: {
        name: contact,
        email,
        phone,
        company,
      },
    });

    const tender = await prisma.tender.create({
      data: {
        customerId: customer.id,
        title: `${category} - ${company}`,
        description: `${description}${budget ? `\n\nBudget: ${budget}` : ""}`,
        category: CATEGORY_MAP[category] || "MOVING",
        startDate: new Date(),
        status: "OFFEN",
      },
    });

    await sendEmail({
      to: CONTACT.EMAIL,
      subject: `Neue Ausschreibung - ${company}`,
      html: `
        <h2>Neue Ausschreibung</h2>
        <p><strong>Unternehmen:</strong> ${company}</p>
        <p><strong>Ansprechpartner:</strong> ${contact}</p>
        <p><strong>E-Mail:</strong> ${email}</p>
        <p><strong>Telefon:</strong> ${phone}</p>
        <p><strong>Kategorie:</strong> ${category}</p>
        <p><strong>Budget:</strong> ${budget || "-"}</p>
        <p><strong>Beschreibung:</strong></p>
        <p>${String(description).replace(/\n/g, "<br />")}</p>
        <p><strong>Vorgangs-ID:</strong> ${tender.id}</p>
      `,
    });

    return NextResponse.json({ success: true, message: "Ausschreibung erhalten" });
  } catch (error) {
    console.error("[tender] error:", error);
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}
