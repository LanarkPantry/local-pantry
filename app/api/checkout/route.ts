<<<<<<< HEAD
// checkout route
import Stripe from "stripe";

export async function POST(req: Request) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      return new Response(
        JSON.stringify({ error: "Missing STRIPE_SECRET_KEY" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const stripe = new Stripe(stripeSecretKey);

=======
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY");
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2026-03-25.dahlia",
});

export async function POST(req: Request) {
  try {
>>>>>>> aa7f09367e22ff2a6278faad3fdd9032ebb37454
    const body = await req.json();
    const { cart } = body;

    if (!cart || cart.length === 0) {
<<<<<<< HEAD
      return new Response(JSON.stringify({ error: "Your basket is empty." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

    if (!siteUrl) {
=======
      return new Response(
        JSON.stringify({ error: "Your basket is empty." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (!process.env.NEXT_PUBLIC_SITE_URL) {
>>>>>>> aa7f09367e22ff2a6278faad3fdd9032ebb37454
      return new Response(
        JSON.stringify({ error: "Missing NEXT_PUBLIC_SITE_URL" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
<<<<<<< HEAD
        },
=======
        }
>>>>>>> aa7f09367e22ff2a6278faad3fdd9032ebb37454
      );
    }

    const lineItems = cart.map((item: { name: string; price: number }) => ({
      price_data: {
        currency: "gbp",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: 1,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
<<<<<<< HEAD
      success_url: `${siteUrl}/success`,
      cancel_url: `${siteUrl}`,
=======
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}`,
>>>>>>> aa7f09367e22ff2a6278faad3fdd9032ebb37454
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Stripe checkout error:", error);

    return new Response(
      JSON.stringify({
<<<<<<< HEAD
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong creating checkout.",
=======
        error: error instanceof Error ? error.message : "Something went wrong creating checkout.",
>>>>>>> aa7f09367e22ff2a6278faad3fdd9032ebb37454
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
<<<<<<< HEAD
      },
=======
      }
>>>>>>> aa7f09367e22ff2a6278faad3fdd9032ebb37454
    );
  }
}
