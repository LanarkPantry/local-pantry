"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";

type SubscriptionStatus = "active" | "paused" | "cancelled";
type SubscriptionFrequency = "weekly" | "fortnightly";

type PantrySubscription = {
  id: string;
  created_at: string;
  updated_at: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  delivery_address_line_1: string;
  delivery_address_line_2: string | null;
  delivery_town: string;
  delivery_postcode: string;
  delivery_notes: string | null;
  box_name: string;
  frequency: SubscriptionFrequency;
  next_delivery_date: string;
  preferred_delivery_day: "Tuesday" | "Wednesday" | null;
  status: SubscriptionStatus;
  pause_until: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  admin_notes: string | null;
};

function formatDate(value: string | null | undefined) {
  if (!value) return "Not set";

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
  }).format(new Date(`${value}T12:00:00`));
}

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function isDue(subscription: PantrySubscription) {
  return (
    subscription.status === "active" &&
    subscription.next_delivery_date <= todayIsoDate()
  );
}

function sortByNextDelivery(a: PantrySubscription, b: PantrySubscription) {
  return a.next_delivery_date.localeCompare(b.next_delivery_date);
}

export default function AdminDeliveryRoundsPage() {
  const [subscriptions, setSubscriptions] = useState<PantrySubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function getToken() {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  }

  async function loadSubscriptions() {
    setLoading(true);
    setError("");
    setMessage("");

    const token = await getToken();

    if (!token) {
      setError("Please sign in first, then return to this page.");
      setLoading(false);
      return;
    }

    const response = await fetch("/api/admin/subscriptions", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Could not load subscriptions.");
      setLoading(false);
      return;
    }

    setSubscriptions(
      Array.isArray(data.subscriptions) ? data.subscriptions : [],
    );
    setLoading(false);
  }

  async function generateDeliveryOrders() {
    const confirmed = window.confirm(
      "Generate delivery orders for all active subscriptions due today or earlier? This will also move their next delivery dates forward.",
    );

    if (!confirmed) return;

    setGenerating(true);
    setError("");
    setMessage("");

    const token = await getToken();

    if (!token) {
      setError("Please sign in first.");
      setGenerating(false);
      return;
    }

    const response = await fetch("/api/admin/delivery-rounds/generate", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Could not generate delivery orders.");
      setGenerating(false);
      return;
    }

    setMessage(data.message || "Delivery orders generated.");
    await loadSubscriptions();
    setGenerating(false);
  }

  useEffect(() => {
    void loadSubscriptions();
  }, []);

  const activeSubscriptions = useMemo(
    () =>
      subscriptions
        .filter((subscription) => subscription.status === "active")
        .sort(sortByNextDelivery),
    [subscriptions],
  );

  const dueSubscriptions = useMemo(
    () => activeSubscriptions.filter(isDue),
    [activeSubscriptions],
  );

  const upcomingSubscriptions = useMemo(
    () => activeSubscriptions.filter((subscription) => !isDue(subscription)),
    [activeSubscriptions],
  );

  const dueWeeklyCount = dueSubscriptions.filter(
    (subscription) => subscription.frequency === "weekly",
  ).length;

  const dueFortnightlyCount = dueSubscriptions.filter(
    (subscription) => subscription.frequency === "fortnightly",
  ).length;

  return (
    <main className="min-h-screen bg-[#f4efe9] px-4 py-8 text-[#243328] md:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 rounded-[28px] border border-[#ddd4c8] bg-white/85 p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
            The Local Pantry
          </p>

          <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-serif text-4xl">Delivery rounds</h1>
              <p className="mt-2 text-sm text-[#667164]">
                Generate working delivery orders from active subscriptions.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={loadSubscriptions}
                className="rounded-full border border-[#d6cec2] bg-white px-4 py-2 text-sm font-medium"
              >
                Refresh
              </button>

              <Link
                href="/admin/subscriptions"
                className="rounded-full border border-[#d6cec2] bg-white px-4 py-2 text-sm font-medium"
              >
                Subscriptions
              </Link>

              <Link
                href="/admin/orders"
                className="rounded-full bg-[#243328] px-4 py-2 text-sm font-medium text-white"
              >
                Orders
              </Link>
            </div>
          </div>
        </header>

        {error ? (
          <div className="mb-5 rounded-[20px] border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {message ? (
          <div className="mb-5 rounded-[20px] border border-[#c8dbc2] bg-[#eef8ea] p-4 text-sm text-[#315333]">
            {message}
          </div>
        ) : null}

        <section className="mb-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-[24px] border border-[#ddd4c8] bg-white/85 p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-[#7a8478]">
              Due now
            </p>
            <p className="mt-2 font-serif text-4xl">
              {dueSubscriptions.length}
            </p>
          </div>

          <div className="rounded-[24px] border border-[#ddd4c8] bg-white/85 p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-[#7a8478]">
              Weekly due
            </p>
            <p className="mt-2 font-serif text-4xl">{dueWeeklyCount}</p>
          </div>

          <div className="rounded-[24px] border border-[#ddd4c8] bg-white/85 p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-[#7a8478]">
              Fortnightly due
            </p>
            <p className="mt-2 font-serif text-4xl">{dueFortnightlyCount}</p>
          </div>

          <div className="rounded-[24px] border border-[#ddd4c8] bg-white/85 p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-[#7a8478]">
              Active subscribers
            </p>
            <p className="mt-2 font-serif text-4xl">
              {activeSubscriptions.length}
            </p>
          </div>
        </section>

        <section className="mb-6 rounded-[28px] border border-[#ddd4c8] bg-white/85 p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-serif text-3xl">Generate due deliveries</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#667164]">
                This creates one order for each active subscription whose next
                delivery date is today or earlier. After creation, weekly
                subscribers move forward 7 days and fortnightly subscribers move
                forward 14 days.
              </p>
            </div>

            <button
              type="button"
              disabled={generating || loading || dueSubscriptions.length === 0}
              onClick={generateDeliveryOrders}
              className="rounded-full bg-[#243328] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-45"
            >
              {generating
                ? "Generating..."
                : dueSubscriptions.length === 0
                  ? "Nothing due"
                  : "Generate delivery orders"}
            </button>
          </div>
        </section>

        {loading ? (
          <div className="rounded-[28px] border border-[#ddd4c8] bg-white/85 p-8 text-center">
            Loading delivery rounds...
          </div>
        ) : null}

        {!loading ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <section className="rounded-[28px] border border-[#ddd4c8] bg-white/85 p-5">
              <h2 className="font-serif text-3xl">Due now</h2>

              <div className="mt-4 space-y-3">
                {dueSubscriptions.length > 0 ? (
                  dueSubscriptions.map((subscription) => (
                    <div
                      key={subscription.id}
                      className="rounded-2xl border border-[#eee5d8] bg-[#fbfaf8] p-4"
                    >
                      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                        <div>
                          <p className="font-medium">
                            {subscription.customer_name}
                          </p>
                          <p className="text-sm text-[#667164]">
                            {subscription.box_name}
                          </p>
                          <p className="text-sm text-[#667164]">
                            {subscription.delivery_postcode}
                          </p>
                        </div>

                        <div className="text-left md:text-right">
                          <p className="text-sm font-medium">
                            {formatDate(subscription.next_delivery_date)}
                          </p>
                          <p className="text-sm text-[#667164]">
                            {subscription.frequency}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="rounded-2xl border border-[#eee5d8] bg-[#fbfaf8] p-4 text-sm text-[#667164]">
                    No subscriptions are due today.
                  </p>
                )}
              </div>
            </section>

            <section className="rounded-[28px] border border-[#ddd4c8] bg-white/85 p-5">
              <h2 className="font-serif text-3xl">Coming next</h2>

              <div className="mt-4 space-y-3">
                {upcomingSubscriptions.length > 0 ? (
                  upcomingSubscriptions.slice(0, 12).map((subscription) => (
                    <div
                      key={subscription.id}
                      className="rounded-2xl border border-[#eee5d8] bg-[#fbfaf8] p-4"
                    >
                      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                        <div>
                          <p className="font-medium">
                            {subscription.customer_name}
                          </p>
                          <p className="text-sm text-[#667164]">
                            {subscription.box_name}
                          </p>
                          <p className="text-sm text-[#667164]">
                            {subscription.delivery_postcode}
                          </p>
                        </div>

                        <div className="text-left md:text-right">
                          <p className="text-sm font-medium">
                            {formatDate(subscription.next_delivery_date)}
                          </p>
                          <p className="text-sm text-[#667164]">
                            {subscription.frequency}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="rounded-2xl border border-[#eee5d8] bg-[#fbfaf8] p-4 text-sm text-[#667164]">
                    No upcoming active subscriptions found.
                  </p>
                )}
              </div>
            </section>
          </div>
        ) : null}
      </div>
    </main>
  );
}
