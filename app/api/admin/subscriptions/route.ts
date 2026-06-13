import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "../../../lib/supabase-admin";
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

export async function GET(request: Request) {
  const adminCheck = await requireAdmin(request);

  if (!adminCheck.ok) {
    return adminCheck.response;
  }

  const { data, error } = await supabaseAdmin
    .from("pantry_subscriptions")
    .select("*")
    .order("status", { ascending: true })
    .order("next_delivery_date", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: error.message || "Could not load subscriptions." },
      { status: 500 },
    );
  }

  return NextResponse.json({ subscriptions: data ?? [] });
}
