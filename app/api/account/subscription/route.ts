import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabase-admin";

type SubscriptionLookupBody = {
  email?: string;
};

function cleanEmail(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim().toLowerCase().slice(0, 180);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as SubscriptionLookupBody;
    const email = cleanEmail(body.email);

    if (!email) {
      return NextResponse.json(
        { error: "Please enter the email address used for your subscription." },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseAdmin
      .from("pantry_subscriptions")
      .select(
        "id, customer_email, box_name, frequency, next_delivery_date, preferred_delivery_day, status, pause_until",
      )
      .eq("customer_email", email)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Subscription lookup error:", error);

      return NextResponse.json(
        { error: "Could not check subscription status." },
        { status: 500 },
      );
    }

    if (!data) {
      return NextResponse.json({
        subscription: null,
        message: "No subscription was found for that email address.",
      });
    }

    return NextResponse.json({ subscription: data });
  } catch (error) {
    console.error("Account subscription route error:", error);

    return NextResponse.json(
      { error: "Could not check subscription status." },
      { status: 500 },
    );
  }
}
