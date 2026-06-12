import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "../../lib/supabase-admin";
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable.");
}

const stripe = new Stripe(stripeSecretKey);

type SubscriptionFrequency = "weekly" | "fortnightly";

type CartItem = {
  name: string;
  price: number;
  image?: string;
  category?: string;
  checkoutType?: "subscription" | "one-off" | "oneoff";
};

type CheckoutBody = {
  cart?: CartItem[];
  isSubscription?: boolean;
  subscriptionFrequency?: SubscriptionFrequency;
  deliveryNotes?: string;
  launchGift?: string;
  subtotal?: number;
  delivery?: number;
  total?: number;
  subscriptionItems?: CartItem[];
  oneOffItems?: CartItem[];

  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  deliveryAddressLine1?: string;
  deliveryAddressLine2?: string;
  deliveryTown?: string;
  deliveryPostcode?: string;
};

function buildOneOffLineItem(
  item: CartItem,
): Stripe.Checkout.SessionCreateParams.LineItem {
  return {
    quantity: 1,
    price_data: {
      currency: "gbp",
      product_data: {
        name: item.name,
      },
      unit_amount: Math.round(item.price * 100),
    },
  };
}

function buildSubscriptionLineItem(
  item: CartItem,
  subscriptionFrequency: SubscriptionFrequency,
): Stripe.Checkout.SessionCreateParams.LineItem {
  return {
    quantity: 1,
    price_data: {
      currency: "gbp",
      product_data: {
        name: item.name,
      },
      recurring: {
        interval: "week",
        interval_count: subscriptionFrequency === "fortnightly" ? 2 : 1,
      },
      unit_amount: Math.round(item.price * 100),
    },
  };
}

function cleanText(value: unknown, maxLength = 500) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function normalisePostcode(value: unknown) {
  return cleanText(value, 20).toUpperCase();
}

function normaliseCheckoutType(value: CartItem["checkoutType"]) {
  if (value === "subscription") return "subscription";
  return "one-off";
}

function buildOrderItems(items: CartItem[]) {
  return items.map((item) => ({
    name: item.name,
    price: item.price,
    image: item.image ?? "",
    category: item.category ?? "",
    checkoutType: normaliseCheckoutType(item.checkoutType),
  }));
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CheckoutBody;

    const cart = Array.isArray(body.cart) ? body.cart : [];
    const subscriptionItems = Array.isArray(body.subscriptionItems)
      ? body.subscriptionItems
      : [];
    const oneOffItems = Array.isArray(body.oneOffItems) ? body.oneOffItems : [];

    const customerName = cleanText(body.customerName, 120);
    const customerEmail = cleanText(body.customerEmail, 180).toLowerCase();
    const customerPhone = cleanText(body.customerPhone, 60);

    const deliveryAddressLine1 = cleanText(body.deliveryAddressLine1, 180);
    const deliveryAddressLine2 = cleanText(body.deliveryAddressLine2, 180);
    const deliveryTown = cleanText(body.deliveryTown, 120);
    const deliveryPostcode = normalisePostcode(body.deliveryPostcode);

    const delivery = typeof body.delivery === "number" ? body.delivery : 0;
    const subtotal = typeof body.subtotal === "number" ? body.subtotal : 0;
    const total = typeof body.total === "number" ? body.total : 0;

    const deliveryNotes = cleanText(body.deliveryNotes, 500);
    const launchGift = cleanText(body.launchGift, 100);

    const subscriptionFrequency: SubscriptionFrequency =
      body.subscriptionFrequency === "fortnightly" ? "fortnightly" : "weekly";

    const isSubscription = Boolean(body.isSubscription);

    if (cart.length === 0) {
      return NextResponse.json(
        { error: "Your basket is empty." },
        { status: 400 },
      );
    }

    if (!customerName) {
      return NextResponse.json(
        { error: "Please enter your name before checkout." },
        { status: 400 },
      );
    }

    if (!customerEmail) {
      return NextResponse.json(
        { error: "Please enter your email before checkout." },
        { status: 400 },
      );
    }

    if (!deliveryAddressLine1 || !deliveryTown || !deliveryPostcode) {
      return NextResponse.json(
        { error: "Please enter your full delivery address before checkout." },
        { status: 400 },
      );
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";

    let mode: Stripe.Checkout.SessionCreateParams.Mode = "payment";
    let line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    const orderType =
      isSubscription && subscriptionItems.length > 0
        ? "subscription"
        : "oneoff";

    if (orderType === "subscription") {
      mode = "subscription";

      const recurringLineItems = subscriptionItems.map((item) =>
        buildSubscriptionLineItem(item, subscriptionFrequency),
      );

      const oneOffLineItems = oneOffItems.map(buildOneOffLineItem);

      line_items = [...recurringLineItems, ...oneOffLineItems];
    } else {
      mode = "payment";
      line_items = cart.map(buildOneOffLineItem);
    }

    if (delivery > 0) {
      line_items.push({
        quantity: 1,
        price_data: {
          currency: "gbp",
          product_data: {
            name: "Delivery",
          },
          unit_amount: Math.round(delivery * 100),
        },
      });
    }

    if (launchGift) {
      line_items.push({
        quantity: 1,
        price_data: {
          currency: "gbp",
          product_data: {
            name: `Free launch gift: ${launchGift}`,
          },
          unit_amount: 0,
        },
      });
    }

    const orderItems = buildOrderItems(cart);

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone || null,

        delivery_address_line_1: deliveryAddressLine1,
        delivery_address_line_2: deliveryAddressLine2 || null,
        delivery_town: deliveryTown,
        delivery_postcode: deliveryPostcode,
        delivery_notes: deliveryNotes || null,

        items: orderItems,
        launch_gift: launchGift || null,

        order_type: orderType === "subscription" ? "subscription" : "oneoff",
        subscription_frequency:
          orderType === "subscription" ? subscriptionFrequency : null,

        subtotal,
        delivery,
        total,

        payment_status: "pending",
        fulfilment_status: "new",
      })
      .select("id")
      .single();

    if (orderError || !order) {
      console.error("Supabase order insert error:", orderError);

      return NextResponse.json(
        { error: "Could not create order before checkout." },
        { status: 500 },
      );
    }

    const cartSummary = cart
      .map((item) => item.name)
      .join(" | ")
      .slice(0, 500);

    const metadata = {
      orderId: order.id,
      customerName: customerName.slice(0, 100),
      customerEmail: customerEmail.slice(0, 100),
      deliveryPostcode: deliveryPostcode.slice(0, 20),
      deliveryNotes: deliveryNotes.slice(0, 500),
      launchGift: launchGift.slice(0, 100),
      cartSummary,
      orderType,
      subscriptionFrequency,
      subscriptionItemCount: String(subscriptionItems.length),
      oneOffItemCount: String(oneOffItems.length),
    };

    const session = await stripe.checkout.sessions.create({
      mode,
      payment_method_types: ["card"],
      line_items,
      customer_email: customerEmail,
      client_reference_id: order.id,
      success_url: `${origin}/basket?success=true&order_id=${order.id}`,
      cancel_url: `${origin}/basket?cancelled=true&order_id=${order.id}`,
      metadata,

      ...(mode === "payment"
        ? {
            customer_creation: "always" as const,
            payment_intent_data: {
              metadata,
            },
          }
        : {}),

      ...(mode === "subscription"
        ? {
            subscription_data: {
              metadata,
            },
          }
        : {}),
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "No checkout URL returned." },
        { status: 500 },
      );
    }

    await supabaseAdmin
      .from("orders")
      .update({
        stripe_session_id: session.id,
      })
      .eq("id", order.id);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);

    const message = error instanceof Error ? error.message : "Checkout failed.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
