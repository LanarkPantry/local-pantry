import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "../../lib/supabase-admin";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable.");
}

const stripe = new Stripe(stripeSecretKey);

type SubscriptionFrequency = "weekly" | "fortnightly";

type OrderItem = {
  name?: string;
  price?: number;
  image?: string;
  category?: string;
  checkoutType?: string;
};

type PaidOrder = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  delivery_address_line_1: string;
  delivery_address_line_2: string | null;
  delivery_town: string;
  delivery_postcode: string;
  delivery_notes: string | null;
  items: OrderItem[] | null;
  order_type: "oneoff" | "subscription";
  subscription_frequency: SubscriptionFrequency | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
};

function addDaysToToday(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function unixToIsoDate(value: number | null | undefined) {
  if (!value) return null;
  return new Date(value * 1000).toISOString().slice(0, 10);
}

function getSubscriptionBoxName(order: PaidOrder) {
  const items = Array.isArray(order.items) ? order.items : [];

  const subscriptionItem =
    items.find((item) => item.checkoutType === "subscription") ?? items[0];

  return subscriptionItem?.name?.trim() || "Produce Box";
}

function getLocalStatusFromStripe(subscription: Stripe.Subscription) {
  if (subscription.cancel_at_period_end || subscription.status === "canceled") {
    return "cancelled";
  }

  if (subscription.pause_collection) {
    return "paused";
  }

  if (
    subscription.status === "active" ||
    subscription.status === "trialing" ||
    subscription.status === "past_due"
  ) {
    return "active";
  }

  if (
    subscription.status === "incomplete" ||
    subscription.status === "incomplete_expired" ||
    subscription.status === "unpaid"
  ) {
    return "paused";
  }

  return "active";
}

async function createOrUpdatePantrySubscription(orderId: string) {
  const { data: order, error: orderError } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    console.error(
      "Could not load paid order for subscription setup:",
      orderError,
    );
    throw new Error("Could not load paid order for subscription setup.");
  }

  const paidOrder = order as PaidOrder;

  if (
    paidOrder.order_type !== "subscription" ||
    !paidOrder.subscription_frequency ||
    !paidOrder.stripe_subscription_id
  ) {
    return;
  }

  const daysToAdd = paidOrder.subscription_frequency === "fortnightly" ? 14 : 7;

  const nextDeliveryDate = addDaysToToday(daysToAdd);
  const boxName = getSubscriptionBoxName(paidOrder);

  const { data: existingSubscription, error: existingError } =
    await supabaseAdmin
      .from("pantry_subscriptions")
      .select("id")
      .eq("stripe_subscription_id", paidOrder.stripe_subscription_id)
      .maybeSingle();

  if (existingError) {
    console.error(
      "Could not check existing pantry subscription:",
      existingError,
    );
    throw new Error("Could not check existing pantry subscription.");
  }

  if (existingSubscription?.id) {
    const { error: updateError } = await supabaseAdmin
      .from("pantry_subscriptions")
      .update({
        customer_name: paidOrder.customer_name,
        customer_email: paidOrder.customer_email,
        customer_phone: paidOrder.customer_phone,
        delivery_address_line_1: paidOrder.delivery_address_line_1,
        delivery_address_line_2: paidOrder.delivery_address_line_2,
        delivery_town: paidOrder.delivery_town,
        delivery_postcode: paidOrder.delivery_postcode,
        delivery_notes: paidOrder.delivery_notes,
        box_name: boxName,
        frequency: paidOrder.subscription_frequency,
        stripe_customer_id: paidOrder.stripe_customer_id,
        status: "active",
      })
      .eq("id", existingSubscription.id);

    if (updateError) {
      console.error("Could not update pantry subscription:", updateError);
      throw new Error("Could not update pantry subscription.");
    }

    return;
  }

  const { error: insertError } = await supabaseAdmin
    .from("pantry_subscriptions")
    .insert({
      customer_name: paidOrder.customer_name,
      customer_email: paidOrder.customer_email,
      customer_phone: paidOrder.customer_phone,
      delivery_address_line_1: paidOrder.delivery_address_line_1,
      delivery_address_line_2: paidOrder.delivery_address_line_2,
      delivery_town: paidOrder.delivery_town,
      delivery_postcode: paidOrder.delivery_postcode,
      delivery_notes: paidOrder.delivery_notes,
      box_name: boxName,
      frequency: paidOrder.subscription_frequency,
      next_delivery_date: nextDeliveryDate,
      preferred_delivery_day: null,
      status: "active",
      pause_until: null,
      stripe_customer_id: paidOrder.stripe_customer_id,
      stripe_subscription_id: paidOrder.stripe_subscription_id,
      admin_notes: `Created automatically from order ${paidOrder.id}`,
    });

  if (insertError) {
    console.error("Could not create pantry subscription:", insertError);
    throw new Error("Could not create pantry subscription.");
  }
}

async function syncPantrySubscriptionFromStripe(
  subscription: Stripe.Subscription,
) {
  const stripeSubscriptionId = subscription.id;
  const stripeCustomerId =
    typeof subscription.customer === "string" ? subscription.customer : null;

  const localStatus = getLocalStatusFromStripe(subscription);
  const pauseUntil =
    localStatus === "paused"
      ? unixToIsoDate(subscription.pause_collection?.resumes_at)
      : null;

  const { data: existingSubscription, error: findError } = await supabaseAdmin
    .from("pantry_subscriptions")
    .select("id, admin_notes")
    .eq("stripe_subscription_id", stripeSubscriptionId)
    .maybeSingle();

  if (findError) {
    console.error("Could not find pantry subscription to sync:", findError);
    throw new Error("Could not find pantry subscription to sync.");
  }

  if (!existingSubscription?.id) {
    console.warn(
      `No pantry_subscriptions row found for Stripe subscription ${stripeSubscriptionId}.`,
    );
    return;
  }

  const note =
    localStatus === "cancelled"
      ? "Stripe subscription cancelled or set to cancel."
      : localStatus === "paused"
        ? "Stripe subscription paused or unpaid."
        : "Stripe subscription active.";

  const existingNotes =
    typeof existingSubscription.admin_notes === "string"
      ? existingSubscription.admin_notes
      : "";

  const adminNotes = existingNotes.includes(note)
    ? existingNotes
    : `${existingNotes}${existingNotes ? "\n" : ""}${note}`;

  const { error: updateError } = await supabaseAdmin
    .from("pantry_subscriptions")
    .update({
      status: localStatus,
      pause_until: pauseUntil,
      stripe_customer_id: stripeCustomerId,
      admin_notes: adminNotes,
    })
    .eq("id", existingSubscription.id);

  if (updateError) {
    console.error("Could not sync pantry subscription:", updateError);
    throw new Error("Could not sync pantry subscription.");
  }
}

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

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const orderId =
        session.metadata?.orderId || session.client_reference_id || "";

      if (!orderId) {
        console.error("Webhook received checkout session without orderId.");
        return NextResponse.json({ received: true });
      }

      const stripeCustomerId =
        typeof session.customer === "string" ? session.customer : null;

      const stripeSubscriptionId =
        typeof session.subscription === "string" ? session.subscription : null;

      const stripePaymentIntentId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : null;

      const { error } = await supabaseAdmin
        .from("orders")
        .update({
          payment_status: "paid",
          stripe_session_id: session.id,
          stripe_customer_id: stripeCustomerId,
          stripe_subscription_id: stripeSubscriptionId,
          stripe_payment_intent_id: stripePaymentIntentId,
          paid_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      if (error) {
        console.error("Supabase order update error:", error);

        return NextResponse.json(
          { error: "Could not update order payment status." },
          { status: 500 },
        );
      }

      if (session.mode === "subscription" && stripeSubscriptionId) {
        await createOrUpdatePantrySubscription(orderId);
      }
    }

    if (
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      const subscription = event.data.object as Stripe.Subscription;
      await syncPantrySubscriptionFromStripe(subscription);
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
