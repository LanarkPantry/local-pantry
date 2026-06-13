import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../lib/supabase-admin";

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

async function getAuthorisedUser(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.replace("Bearer ", "").trim();

  const { data, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !data.user?.email) {
    return null;
  }

  const userEmail = data.user.email.toLowerCase();

  if (!getAdminEmails().includes(userEmail)) {
    return null;
  }

  return data.user;
}

export async function GET(req: Request) {
  const user = await getAuthorisedUser(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ orders: data ?? [] });
}

export async function PATCH(req: Request) {
  const user = await getAuthorisedUser(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const body = (await req.json()) as {
    orderId?: string;
    fulfilmentStatus?: string;
  };

  const allowedStatuses = [
    "new",
    "packing",
    "packed",
    "delivered",
    "cancelled",
  ];

  if (!body.orderId || !allowedStatuses.includes(body.fulfilmentStatus ?? "")) {
    return NextResponse.json({ error: "Invalid update" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("orders")
    .update({ fulfilment_status: body.fulfilmentStatus })
    .eq("id", body.orderId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
