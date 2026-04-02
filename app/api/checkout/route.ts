import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable.");
}

const stripe = new Stripe(stripeSecretKey);

type CartItem = {
  name: string;
  price: number;
  checkoutType?: "subscription" | "oneoff";
};

type CheckoutBody = {
  cart?: CartItem[];
  isSubscription?: boolean;
  deliveryNotes?: string;
  subtotal?: number;
  delivery?: number;
  total?: number;
  subscriptionItems?: CartItem[];
  oneOffItems?: CartItem[];
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

function buildWeeklySubscriptionLineItem(
  item: CartItem,
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
      },
      unit_amount: Math.round(item.price * 100),
    },
  };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CheckoutBody;

    const cart = Array.isArray(body.cart) ? body.cart : [];
    const subscriptionItems = Array.isArray(body.subscriptionItems)
      ? body.subscriptionItems
      : [];
    const oneOffItems = Array.isArray(body.oneOffItems) ? body.oneOffItems : [];
    const delivery = typeof body.delivery === "number" ? body.delivery : 0;
    const deliveryNotes =
      typeof body.deliveryNotes === "string" ? body.deliveryNotes : "";
    const isSubscription = Boolean(body.isSubscription);

    if (cart.length === 0) {
      return NextResponse.json(
        { error: "Your basket is empty." },
        { status: 400 },
      );
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";

    let mode: Stripe.Checkout.SessionCreateParams.Mode = "payment";
    let line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    if (isSubscription && subscriptionItems.length > 0) {
      mode = "subscription";

      const recurringLineItems = subscriptionItems.map(
        buildWeeklySubscriptionLineItem,
      );

      const oneOffLineItems = oneOffItems.map(buildOneOffLineItem);

      line_items = [...recurringLineItems, ...oneOffLineItems];

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
    } else {
      mode = "payment";

      line_items = cart.map(buildOneOffLineItem);

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
    }

    const session = await stripe.checkout.sessions.create({
      mode,
      payment_method_types: ["card"],
      line_items,
      success_url: `${origin}/basket?success=true`,
      cancel_url: `${origin}/basket?cancelled=true`,
      metadata: {
        deliveryNotes: deliveryNotes.slice(0, 500),
        orderType:
          isSubscription && subscriptionItems.length > 0
            ? "subscription"
            : "oneoff",
        subscriptionItemCount: String(subscriptionItems.length),
        oneOffItemCount: String(oneOffItems.length),
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "No checkout URL returned." },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);

    const message = error instanceof Error ? error.message : "Checkout failed.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
