import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "../../../../lib/supabase-admin";

type PantrySubscription = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  delivery_address_line_1: string;
  delivery_address_line_2: string | null;
  delivery_town: string;
  delivery_postcode: string;
  delivery_notes: string | null;
  box_name: string;
  frequency: "weekly" | "fortnightly";
  next_delivery_date: string;
  preferred_delivery_day: "Tuesday" | "Wednesday" | null;
  status: "active" | "paused" | "cancelled";
  pause_until: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  admin_notes: string | null;
};

function getSupabaseUrl() {
  const value = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!value) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  }

  return value;
}

function getSupabaseAnonKey() {
  const value = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!value) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return value;
}

function getAdminEmails() {
  const emails =
    process.env.ADMIN_EMAILS ??
    process.env.ORDERS_ADMIN_EMAIL ??
    "ainsleykingyoga@gmail.com";

  return emails
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function addDaysToDate(dateValue: string, days: number) {
  const date = new Date(`${dateValue}T12:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

async function requireAdmin(request: Request) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "").trim();

  if (!token) {
    return {
      ok: false as const,
      response: NextResponse.json(
        { error: "Missing auth token." },
        { status: 401 },
      ),
    };
  }

  const authClient = createClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { data, error } = await authClient.auth.getUser(token);

  if (error || !data.user?.email) {
    return {
      ok: false as const,
      response: NextResponse.json(
        { error: "Invalid auth token." },
        { status: 401 },
      ),
    };
  }

  const adminEmails = getAdminEmails();
  const userEmail = data.user.email.toLowerCase();

  if (!adminEmails.includes(userEmail)) {
    return {
      ok: false as const,
      response: NextResponse.json(
        { error: "Not authorised." },
        { status: 403 },
      ),
    };
  }

  return { ok: true as const, user: data.user };
}

export async function POST(request: Request) {
  const adminCheck = await requireAdmin(request);

  if (!adminCheck.ok) {
    return adminCheck.response;
  }

  const today = todayIsoDate();

  const { data: dueSubscriptions, error: dueError } = await supabaseAdmin
    .from("pantry_subscriptions")
    .select("*")
    .eq("status", "active")
    .lte("next_delivery_date", today)
    .order("next_delivery_date", { ascending: true });

  if (dueError) {
    return NextResponse.json(
      { error: dueError.message || "Could not load due subscriptions." },
      { status: 500 },
    );
  }

  const subscriptions = (dueSubscriptions ?? []) as PantrySubscription[];

  if (subscriptions.length === 0) {
    return NextResponse.json({
      createdCount: 0,
      skippedCount: 0,
      message: "No subscriptions are due today.",
      orders: [],
    });
  }

  const createdOrders = [];
  const skippedSubscriptions = [];

  for (const subscription of subscriptions) {
    const deliveryDate = subscription.next_delivery_date;

    const { data: existingOrder, error: existingError } = await supabaseAdmin
      .from("orders")
      .select("id")
      .eq("customer_email", subscription.customer_email)
      .eq("order_type", "subscription")
      .eq("delivery_date", deliveryDate)
      .maybeSingle();

    if (existingError) {
      return NextResponse.json(
        {
          error:
            existingError.message ||
            `Could not check existing order for ${subscription.customer_email}.`,
        },
        { status: 500 },
      );
    }

    if (existingOrder?.id) {
      skippedSubscriptions.push(subscription);
      continue;
    }

    const item = {
      name: subscription.box_name,
      price: 0,
      category: "produce-box",
      checkoutType: "subscription",
    };

    const { data: newOrder, error: insertError } = await supabaseAdmin
      .from("orders")
      .insert({
        customer_name: subscription.customer_name,
        customer_email: subscription.customer_email,
        customer_phone: subscription.customer_phone,
        delivery_address_line_1: subscription.delivery_address_line_1,
        delivery_address_line_2: subscription.delivery_address_line_2,
        delivery_town: subscription.delivery_town,
        delivery_postcode: subscription.delivery_postcode,
        delivery_notes: subscription.delivery_notes,
        items: [item],
        launch_gift: null,
        order_type: "subscription",
        subscription_frequency: subscription.frequency,
        subtotal: 0,
        delivery: 0,
        total: 0,
        stripe_customer_id: subscription.stripe_customer_id,
        stripe_subscription_id: subscription.stripe_subscription_id,
        payment_status: "paid",
        fulfilment_status: "new",
        paid_at: new Date().toISOString(),
        delivery_date: deliveryDate,
      })
      .select("*")
      .single();

    if (insertError) {
      return NextResponse.json(
        {
          error:
            insertError.message ||
            `Could not create delivery order for ${subscription.customer_email}.`,
        },
        { status: 500 },
      );
    }

    createdOrders.push(newOrder);

    const daysToAdd = subscription.frequency === "weekly" ? 7 : 14;
    const nextDeliveryDate = addDaysToDate(deliveryDate, daysToAdd);

    const { error: updateError } = await supabaseAdmin
      .from("pantry_subscriptions")
      .update({
        next_delivery_date: nextDeliveryDate,
      })
      .eq("id", subscription.id);

    if (updateError) {
      return NextResponse.json(
        {
          error:
            updateError.message ||
            `Order was created, but subscription date could not be advanced for ${subscription.customer_email}.`,
        },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({
    createdCount: createdOrders.length,
    skippedCount: skippedSubscriptions.length,
    message: `${createdOrders.length} delivery order${
      createdOrders.length === 1 ? "" : "s"
    } created.`,
    orders: createdOrders,
  });
}
