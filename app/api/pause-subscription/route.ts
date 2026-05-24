import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable.");
}

const stripe = new Stripe(stripeSecretKey);

type PauseBody = {
  email?: string;
  weeks?: number;
};

function getResumeTimestamp(weeks: number) {
  const now = new Date();
  now.setDate(now.getDate() + weeks * 7);
  return Math.floor(now.getTime() / 1000);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as PauseBody;

    const email = body.email?.trim().toLowerCase();
    const weeks = Number(body.weeks);

    if (!email) {
      return NextResponse.json(
        { error: "Email address is required." },
        { status: 400 },
      );
    }

    if (![1, 2, 4].includes(weeks)) {
      return NextResponse.json(
        { error: "Please choose 1, 2 or 4 weeks." },
        { status: 400 },
      );
    }

    const customers = await stripe.customers.list({
      email,
      limit: 1,
    });

    const customer = customers.data[0];

    if (!customer) {
      return NextResponse.json(
        {
          error:
            "No Stripe customer was found for that email. Use the email you subscribed with.",
        },
        { status: 404 },
      );
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: "active",
      limit: 1,
    });

    const subscription = subscriptions.data[0];

    if (!subscription) {
      return NextResponse.json(
        {
          error: "No active subscription was found for that email address.",
        },
        { status: 404 },
      );
    }

    const resumesAt = getResumeTimestamp(weeks);

    const updatedSubscription = await stripe.subscriptions.update(
      subscription.id,
      {
        pause_collection: {
          behavior: "void",
          resumes_at: resumesAt,
        },
        metadata: {
          pauseRequestedBy: email,
          pauseLengthWeeks: String(weeks),
          pauseRequestedAt: new Date().toISOString(),
        },
      },
    );

    return NextResponse.json({
      success: true,
      subscriptionId: updatedSubscription.id,
      resumesAt,
      message: `Your subscription has been paused for ${weeks} week${
        weeks === 1 ? "" : "s"
      }.`,
    });
  } catch (error) {
    console.error("Pause subscription error:", error);

    const message =
      error instanceof Error ? error.message : "Could not pause subscription.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
