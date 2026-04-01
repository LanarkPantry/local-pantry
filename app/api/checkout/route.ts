import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY");
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2026-03-25.dahlia",
});

type CartItem = {
  name: string;
  price: number;
  image?: string;
  category?: "boxes" | "pantry" | "cupboard" | "extras";
  checkoutType?: "subscription" | "one-off";
};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      cart,
      isSubscription,
      deliveryNotes,
      subtotal,
      delivery,
      total,
      subscriptionItems,
      oneOffItems,
    }: {
      cart: CartItem[];
      isSubscription?: boolean;
      deliveryNotes?: string;
      subtotal?: number;
      delivery?: number;
      total?: number;
      subscriptionItems?: CartItem[];
      oneOffItems?: CartItem[];
    } = body;

    if (!cart || cart.length === 0) {
      return new Response(JSON.stringify({ error: "Your basket is empty." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

    if (!siteUrl) {
      return new Response(
        JSON.stringify({ error: "Missing NEXT_PUBLIC_SITE_URL" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const safeSubscriptionItems = Array.isArray(subscriptionItems)
      ? subscriptionItems
      : [];

    const safeOneOffItems = Array.isArray(oneOffItems) ? oneOffItems : [];

    if (isSubscription && safeSubscriptionItems.length === 0) {
      return new Response(
        JSON.stringify({
          error:
            "Please add a produce box before choosing weekly subscription.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    let mode: "payment" | "subscription" = "payment";
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    if (isSubscription) {
      mode = "subscription";

      for (const item of safeSubscriptionItems) {
        lineItems.push({
          price_data: {
            currency: "gbp",
            product_data: {
              name: item.name,
            },
            unit_amount: Math.round(item.price * 100),
            recurring: {
              interval: "week",
              interval_count: 1,
            },
          },
          quantity: 1,
        });
      }

      for (const item of safeOneOffItems) {
        lineItems.push({
          price_data: {
            currency: "gbp",
            product_data: {
              name: item.name,
            },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: 1,
        });
      }

      if (delivery && delivery > 0) {
        lineItems.push({
          price_data: {
            currency: "gbp",
            product_data: {
              name: "Local delivery",
            },
            unit_amount: Math.round(delivery * 100),
          },
          quantity: 1,
        });
      }
    } else {
      mode = "payment";

      for (const item of cart) {
        lineItems.push({
          price_data: {
            currency: "gbp",
            product_data: {
              name: item.name,
            },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: 1,
        });
      }

      if (delivery && delivery > 0) {
        lineItems.push({
          price_data: {
            currency: "gbp",
            product_data: {
              name: "Local delivery",
            },
            unit_amount: Math.round(delivery * 100),
          },
          quantity: 1,
        });
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: lineItems,
      success_url: `${siteUrl}/success`,
      cancel_url: `${siteUrl}/basket`,
      billing_address_collection: "required",
      phone_number_collection: {
        enabled: true,
      },
      allow_promotion_codes: true,
      metadata: {
        orderType: isSubscription ? "subscription" : "one-off",
        deliveryNotes: deliveryNotes || "",
        subtotal: typeof subtotal === "number" ? subtotal.toFixed(2) : "0.00",
        delivery: typeof delivery === "number" ? delivery.toFixed(2) : "0.00",
        total: typeof total === "number" ? total.toFixed(2) : "0.00",
        subscriptionItemCount: String(safeSubscriptionItems.length),
        oneOffItemCount: String(safeOneOffItems.length),
      },
      subscription_data: isSubscription
        ? {
            metadata: {
              orderType: "subscription",
              deliveryNotes: deliveryNotes || "",
            },
          }
        : undefined,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);

    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong creating checkout.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
