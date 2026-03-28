import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-03-31.basil",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cart, isSubscription } = body;

    if (!cart || cart.length === 0) {
      return new Response(
        JSON.stringify({ error: "Your basket is empty." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
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
      mode: isSubscription ? "subscription" : "payment",
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}`,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Something went wrong creating checkout." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
