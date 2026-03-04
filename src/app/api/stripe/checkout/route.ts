import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const secret = process.env.STRIPE_SECRET_KEY || "";
const stripe = secret && secret.startsWith("sk_") ? new Stripe(secret, { apiVersion : "2025-02-24.acacia" as Stripe.LatestApiVersion }) : null;

export async function POST(req: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json({ error: "Zahlung derzeit nicht verfügbar. Bitte wählen Sie „Auf Rechnung“." }, { status: 503 });
    }
    const { orderNumber, amount, customerEmail, description } = await req.json();

    if (!amount || !customerEmail || !orderNumber) {
      return NextResponse.json({ error: "Fehlende Pflichtfelder" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "sepa_debit"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Seel Transport – ${description || "Dienstleistung"}`,
              description: `Buchung ${orderNumber}`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.nextUrl.origin}/buchen/erfolgsession_id={CHECKOUT_SESSION_ID}&order=${orderNumber}`,
      cancel_url: `${req.nextUrl.origin}/buchencancelled=true`,
      customer_email: customerEmail,
      metadata: { orderNumber },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: "Fehler beim Erstellen der Checkout-Sitzung" }, { status: 500 });
  }
}
