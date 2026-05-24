import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable.");
}

const stripe = new Stripe(stripeSecretKey);

type PortalBody = {
  email?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as PortalBody;
    const email = body.email?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        { error: "Email address is required." },
        { status: 400 },
      );
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";

    const customers = await stripe.customers.list({
      email,
      limit: 1,
    });

    const customer = customers.data[0];

    if (!customer) {
      return NextResponse.json(
        {
          error:
            "No subscription was found for that email address. Please use the email you subscribed with.",
        },
        { status: 404 },
      );
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `${origin}/basket`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error("Customer portal error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Could not open subscription portal.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
