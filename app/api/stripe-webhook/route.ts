import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "../../lib/supabase-admin";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable.");
}

const stripe = new Stripe(stripeSecretKey);

export async function POST(req: Request) {
  try {
    const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!stripeWebhookSecret) {
      return NextResponse.json(
        { error: "Missing STRIPE_WEBHOOK_SECRET environment variable." },
        { status: 500 },
      );
    }

    const body = await req.text();

    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing Stripe signature." },
        { status: 400 },
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        stripeWebhookSecret,
      );
    } catch (error) {
      console.error("Stripe webhook signature error:", error);

      return NextResponse.json(
        { error: "Invalid webhook signature." },
        { status: 400 },
      );
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const orderId =
          session.metadata?.orderId ?? session.client_reference_id ?? "";

        if (!orderId) {
          console.error(
            "checkout.session.completed received without orderId",
            session.id,
          );

          break;
        }

        const { error } = await supabaseAdmin
          .from("orders")
          .update({
            payment_status: "paid",
            stripe_session_id: session.id,
            stripe_customer_id:
              typeof session.customer === "string" ? session.customer : null,
            stripe_subscription_id:
              typeof session.subscription === "string"
                ? session.subscription
                : null,
            stripe_payment_intent_id:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : null,
            paid_at: new Date().toISOString(),
          })
          .eq("id", orderId);

        if (error) {
          console.error("Supabase order update error:", error);

          return NextResponse.json(
            { error: "Could not update order." },
            { status: 500 },
          );
        }

        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);

    return NextResponse.json(
      { error: "Webhook handler failed." },
      { status: 500 },
    );
  }
}
