import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const secret = process.env.STRIPE_SECRET_KEY || "";
const stripe = secret && secret.startsWith("sk_") ? new Stripe(secret, { apiVersion : "2025-02-24.acacia" as Stripe.LatestApiVersion }) : null;

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";
  if (!stripe || !webhookSecret.startsWith("whsec_")) {
    return NextResponse.json({ error: "Webhook nicht konfiguriert" }, { status: 503 });
  }
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderNumber = session.metadata?.orderNumber;
      console.log(`Payment completed for order ${orderNumber}`);
      // TODO: Update order status in database to BEZAHLT and send confirmation email
      break;
    } case "payment_intent.payment_failed": {
      const intent = event.data.object as Stripe.PaymentIntent;
      console.log(`Payment failed for intent ${intent.id}`);
      break;
    }
  } return NextResponse.json({ received: true });
}

