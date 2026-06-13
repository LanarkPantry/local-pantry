"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";

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
  frequency: "weekly" | "fortnightly";
  next_delivery_date: string;
  preferred_delivery_day: "Tuesday" | "Wednesday" | null;
  status: "active" | "paused" | "cancelled";
  pause_until: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  admin_notes: string | null;
};

function formatDate(value: string | null | undefined) {
  if (!value) return "Not set";

  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}

function getDaysUntil(value: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(`${value}T00:00:00`);
  target.setHours(0, 0, 0, 0);

  const diffMs = target.getTime() - today.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

function deliveryUrgencyLabel(value: string) {
  const days = getDaysUntil(value);

  if (days < 0) return "Overdue";
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days <= 7) return `${days} days`;

  return `${days} days`;
}

function statusClasses(status: PantrySubscription["status"]) {
  if (status === "active") return "bg-[#e8f3e5] text-[#315333]";
  if (status === "paused") return "bg-[#fbf0dc] text-[#725a20]";
  return "bg-[#f4e4e1] text-[#7a2f25]";
}

function frequencyLabel(frequency: PantrySubscription["frequency"]) {
  return frequency === "weekly" ? "Weekly" : "Fortnightly";
}

function sortSubscriptions(subscriptions: PantrySubscription[]) {
  const statusPriority: Record<PantrySubscription["status"], number> = {
    active: 1,
    paused: 2,
    cancelled: 3,
  };

  return [...subscriptions].sort((a, b) => {
    const statusDiff = statusPriority[a.status] - statusPriority[b.status];

    if (statusDiff !== 0) return statusDiff;

    const dateDiff =
      new Date(`${a.next_delivery_date}T00:00:00`).getTime() -
      new Date(`${b.next_delivery_date}T00:00:00`).getTime();

    if (dateDiff !== 0) return dateDiff;

    return a.customer_name.localeCompare(b.customer_name);
  });
}

function SubscriptionCard({
  subscription,
}: {
  subscription: PantrySubscription;
}) {
  return (
    <article className="overflow-hidden rounded-[28px] border border-[#ddd4c8] bg-white/88 shadow-[0_12px_28px_rgba(36,51,40,0.06)]">
      <div className="grid gap-4 border-b border-[#eee5d8] p-5 lg:grid-cols-[1fr_0.9fr_0.75fr]">
        <div>
          <div className="flex flex-wrap gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${statusClasses(
                subscription.status,
              )}`}
            >
              {subscription.status}
            </span>

            <span className="rounded-full bg-[#f7f2eb] px-3 py-1 text-xs font-medium text-[#243328]">
              {frequencyLabel(subscription.frequency)}
            </span>

            {subscription.preferred_delivery_day ? (
              <span className="rounded-full bg-[#f7f2eb] px-3 py-1 text-xs font-medium text-[#243328]">
                {subscription.preferred_delivery_day}
              </span>
            ) : null}
          </div>

          <h2 className="mt-3 font-serif text-2xl">
            {subscription.customer_name}
          </h2>

          <p className="mt-1 text-sm text-[#667164]">
            {subscription.customer_email}
          </p>

          {subscription.customer_phone ? (
            <p className="mt-1 text-sm text-[#667164]">
              {subscription.customer_phone}
            </p>
          ) : null}
        </div>

        <div className="text-sm leading-6 text-[#667164]">
          <p className="font-medium text-[#243328]">Delivery address</p>
          <p>{subscription.delivery_address_line_1}</p>

          {subscription.delivery_address_line_2 ? (
            <p>{subscription.delivery_address_line_2}</p>
          ) : null}

          <p>{subscription.delivery_town}</p>
          <p className="font-medium text-[#243328]">
            {subscription.delivery_postcode}
          </p>

          {subscription.delivery_notes ? (
            <p className="mt-2 rounded-xl bg-[#f7f2eb] p-3">
              {subscription.delivery_notes}
            </p>
          ) : null}
        </div>

        <div>
          <div className="rounded-2xl border border-[#eee5d8] bg-[#fbfaf8] p-4">
            <p className="text-sm font-medium text-[#243328]">Next delivery</p>
            <p className="mt-2 font-serif text-2xl">
              {formatDate(subscription.next_delivery_date)}
            </p>
            <p className="mt-1 text-sm text-[#667164]">
              {deliveryUrgencyLabel(subscription.next_delivery_date)}
            </p>
          </div>

          {subscription.pause_until ? (
            <div className="mt-3 rounded-2xl border border-[#eee5d8] bg-[#fbf0dc] p-4 text-sm text-[#725a20]">
              Paused until {formatDate(subscription.pause_until)}
            </div>
          ) : null}
        </div>
      </div>

      <div className="grid gap-5 p-5 lg:grid-cols-[1fr_0.75fr]">
        <div>
          <p className="text-sm font-medium">Subscription</p>

          <div className="mt-3 rounded-2xl border border-[#eee5d8] bg-[#fbfaf8] p-4">
            <p className="font-medium">{subscription.box_name}</p>
            <p className="mt-1 text-sm text-[#667164]">
              {frequencyLabel(subscription.frequency)} delivery
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium">Admin notes</p>

          <div className="mt-3 rounded-2xl border border-[#eee5d8] bg-[#fbfaf8] p-4 text-sm text-[#667164]">
            {subscription.admin_notes
              ? subscription.admin_notes
              : "No notes yet."}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<PantrySubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadSubscriptions() {
    setLoading(true);
    setError("");

    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

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

  useEffect(() => {
    void loadSubscriptions();
  }, []);

  const sortedSubscriptions = useMemo(
    () => sortSubscriptions(subscriptions),
    [subscriptions],
  );

  const activeSubscriptions = useMemo(
    () => sortedSubscriptions.filter((item) => item.status === "active"),
    [sortedSubscriptions],
  );

  const pausedSubscriptions = useMemo(
    () => sortedSubscriptions.filter((item) => item.status === "paused"),
    [sortedSubscriptions],
  );

  const cancelledSubscriptions = useMemo(
    () => sortedSubscriptions.filter((item) => item.status === "cancelled"),
    [sortedSubscriptions],
  );

  const dueSoonCount = useMemo(
    () =>
      activeSubscriptions.filter(
        (item) => getDaysUntil(item.next_delivery_date) <= 7,
      ).length,
    [activeSubscriptions],
  );

  return (
    <main className="min-h-screen bg-[#f4efe9] px-4 py-8 text-[#243328] md:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 rounded-[28px] border border-[#ddd4c8] bg-white/85 p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
            The Local Pantry
          </p>

          <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-serif text-4xl">Subscriptions</h1>
              <p className="mt-2 text-sm text-[#667164]">
                {activeSubscriptions.length} active ·{" "}
                {pausedSubscriptions.length} paused ·{" "}
                {cancelledSubscriptions.length} cancelled
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
                href="/admin/orders"
                className="rounded-full border border-[#d6cec2] bg-white px-4 py-2 text-sm font-medium"
              >
                Orders
              </Link>

              <Link
                href="/"
                className="rounded-full bg-[#243328] px-4 py-2 text-sm font-medium text-white"
              >
                Back to site
              </Link>
            </div>
          </div>
        </header>

        <section className="mb-6 grid gap-3 md:grid-cols-4">
          <div className="rounded-[22px] border border-[#ddd4c8] bg-white/85 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-[#7a8478]">
              Active
            </p>
            <p className="mt-2 font-serif text-3xl">
              {activeSubscriptions.length}
            </p>
          </div>

          <div className="rounded-[22px] border border-[#ddd4c8] bg-white/85 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-[#7a8478]">
              Due within 7 days
            </p>
            <p className="mt-2 font-serif text-3xl">{dueSoonCount}</p>
          </div>

          <div className="rounded-[22px] border border-[#ddd4c8] bg-white/85 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-[#7a8478]">
              Paused
            </p>
            <p className="mt-2 font-serif text-3xl">
              {pausedSubscriptions.length}
            </p>
          </div>

          <div className="rounded-[22px] border border-[#ddd4c8] bg-white/85 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-[#7a8478]">
              Cancelled
            </p>
            <p className="mt-2 font-serif text-3xl">
              {cancelledSubscriptions.length}
            </p>
          </div>
        </section>

        {loading ? (
          <div className="rounded-[28px] border border-[#ddd4c8] bg-white/85 p-8 text-center">
            Loading subscriptions...
          </div>
        ) : null}

        {error ? (
          <div className="mb-5 rounded-[20px] border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {!loading && subscriptions.length === 0 ? (
          <div className="rounded-[28px] border border-[#ddd4c8] bg-white/85 p-8 text-center">
            <h2 className="font-serif text-3xl">No subscriptions yet</h2>
            <p className="mt-2 text-sm text-[#667164]">
              When subscription customers are added, they will appear here.
            </p>
          </div>
        ) : null}

        {!loading && activeSubscriptions.length > 0 ? (
          <section className="mb-8">
            <div className="mb-3 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-[#7a8478]">
                  Active subscriptions
                </p>
                <h2 className="font-serif text-3xl">Next deliveries</h2>
              </div>
            </div>

            <div className="space-y-5">
              {activeSubscriptions.map((subscription) => (
                <SubscriptionCard
                  key={subscription.id}
                  subscription={subscription}
                />
              ))}
            </div>
          </section>
        ) : null}

        {!loading && pausedSubscriptions.length > 0 ? (
          <section className="mb-8">
            <div className="mb-3">
              <p className="text-xs uppercase tracking-[0.16em] text-[#7a8478]">
                Paused subscriptions
              </p>
              <h2 className="font-serif text-3xl">Paused</h2>
            </div>

            <div className="space-y-5 opacity-90">
              {pausedSubscriptions.map((subscription) => (
                <SubscriptionCard
                  key={subscription.id}
                  subscription={subscription}
                />
              ))}
            </div>
          </section>
        ) : null}

        {!loading && cancelledSubscriptions.length > 0 ? (
          <section>
            <div className="mb-3">
              <p className="text-xs uppercase tracking-[0.16em] text-[#7a8478]">
                Cancelled subscriptions
              </p>
              <h2 className="font-serif text-3xl">Cancelled</h2>
            </div>

            <div className="space-y-5 opacity-75">
              {cancelledSubscriptions.map((subscription) => (
                <SubscriptionCard
                  key={subscription.id}
                  subscription={subscription}
                />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
