"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";

type OrderItem = {
  name?: string;
  price?: number;
  image?: string;
  category?: string;
  checkoutType?: string;
};

type Order = {
  id: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  delivery_address_line_1: string;
  delivery_address_line_2: string | null;
  delivery_town: string;
  delivery_postcode: string;
  delivery_notes: string | null;
  items: OrderItem[] | null;
  launch_gift: string | null;
  order_type: "oneoff" | "subscription";
  subscription_frequency: "weekly" | "fortnightly" | null;
  subtotal: number;
  delivery: number;
  total: number;
  payment_status: string;
  fulfilment_status: string;
  paid_at: string | null;
};

const FULFILMENT_STATUSES = [
  "new",
  "packing",
  "packed",
  "delivered",
  "cancelled",
];

const STATUS_PRIORITY: Record<string, number> = {
  new: 1,
  packing: 2,
  packed: 3,
  delivered: 10,
  cancelled: 20,
};

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  packing: "Packing",
  packed: "Packed",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(value));
}

function formatMoney(value: number | null | undefined) {
  return `£${Number(value ?? 0).toFixed(2)}`;
}

function normaliseStatus(status: string | null | undefined) {
  return status || "new";
}

function statusLabel(status: string | null | undefined) {
  const normalised = normaliseStatus(status);
  return STATUS_LABELS[normalised] ?? normalised;
}

function getStatusClasses(status: string | null | undefined) {
  const normalised = normaliseStatus(status);

  if (normalised === "new") {
    return "border-[#d7b56d] bg-[#fff6df] text-[#6f4e05]";
  }

  if (normalised === "packing") {
    return "border-[#b8c7a3] bg-[#f0f6e8] text-[#40542b]";
  }

  if (normalised === "packed") {
    return "border-[#9bb6c9] bg-[#eef7fb] text-[#294c61]";
  }

  if (normalised === "delivered") {
    return "border-[#d9d4ca] bg-[#f5f2ec] text-[#6d7168]";
  }

  if (normalised === "cancelled") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  return "border-[#d6cec2] bg-[#f7f2eb] text-[#243328]";
}

function getPaymentClasses(status: string | null | undefined) {
  if (status === "paid") {
    return "border-[#bdd7b6] bg-[#e8f3e5] text-[#315333]";
  }

  return "border-[#ebd4a5] bg-[#fbf0dc] text-[#725a20]";
}

function copyOrderText(order: Order) {
  const items = Array.isArray(order.items) ? order.items : [];
  const itemLines = items.map((item) => `- ${item.name ?? "Item"}`).join("\n");

  return [
    `Order: ${order.customer_name}`,
    `Status: ${statusLabel(order.fulfilment_status)}`,
    `Payment: ${order.payment_status}`,
    `Type: ${order.order_type}${order.subscription_frequency ? ` / ${order.subscription_frequency}` : ""}`,
    "",
    "Delivery address:",
    order.delivery_address_line_1,
    order.delivery_address_line_2,
    order.delivery_town,
    order.delivery_postcode,
    "",
    order.delivery_notes
      ? `Delivery notes: ${order.delivery_notes}`
      : "Delivery notes: none",
    "",
    "Items:",
    itemLines || "No item data found.",
    order.launch_gift ? `\nLaunch gift: ${order.launch_gift}` : "",
    "",
    `Total: ${formatMoney(order.total)}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  async function loadOrders() {
    setLoading(true);
    setError("");
    setNotice("");

    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    if (!token) {
      setError("Please sign in first, then return to this page.");
      setLoading(false);
      return;
    }

    const response = await fetch("/api/admin/orders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Could not load orders.");
      setLoading(false);
      return;
    }

    setOrders(Array.isArray(data.orders) ? data.orders : []);
    setLoading(false);
  }

  async function updateFulfilmentStatus(
    orderId: string,
    fulfilmentStatus: string,
  ) {
    setUpdatingOrderId(orderId);
    setError("");
    setNotice("");

    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    if (!token) {
      setError("Please sign in first.");
      setUpdatingOrderId(null);
      return;
    }

    const response = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        orderId,
        fulfilmentStatus,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Could not update order.");
      setUpdatingOrderId(null);
      return;
    }

    await loadOrders();
    setNotice(`Order marked ${statusLabel(fulfilmentStatus).toLowerCase()}.`);
    setUpdatingOrderId(null);
  }

  async function copyOrder(order: Order) {
    try {
      await navigator.clipboard.writeText(copyOrderText(order));
      setNotice("Order details copied.");
    } catch {
      setError("Could not copy order details.");
    }
  }

  useEffect(() => {
    void loadOrders();
  }, []);

  const paidOrders = useMemo(
    () => orders.filter((order) => order.payment_status === "paid"),
    [orders],
  );

  const activeOrders = useMemo(
    () =>
      orders.filter(
        (order) =>
          order.payment_status === "paid" &&
          !["delivered", "cancelled"].includes(
            normaliseStatus(order.fulfilment_status),
          ),
      ),
    [orders],
  );

  const unpaidOrders = useMemo(
    () => orders.filter((order) => order.payment_status !== "paid"),
    [orders],
  );

  const deliveredOrders = useMemo(
    () =>
      orders.filter(
        (order) => normaliseStatus(order.fulfilment_status) === "delivered",
      ),
    [orders],
  );

  const cancelledOrders = useMemo(
    () =>
      orders.filter(
        (order) => normaliseStatus(order.fulfilment_status) === "cancelled",
      ),
    [orders],
  );

  const sortedOrders = useMemo(
    () =>
      [...orders].sort((a, b) => {
        const priorityA =
          STATUS_PRIORITY[normaliseStatus(a.fulfilment_status)] ?? 5;
        const priorityB =
          STATUS_PRIORITY[normaliseStatus(b.fulfilment_status)] ?? 5;

        if (a.payment_status !== "paid" && b.payment_status === "paid") {
          return 1;
        }

        if (a.payment_status === "paid" && b.payment_status !== "paid") {
          return -1;
        }

        if (priorityA !== priorityB) {
          return priorityA - priorityB;
        }

        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }),
    [orders],
  );

  const activeSortedOrders = sortedOrders.filter(
    (order) =>
      order.payment_status === "paid" &&
      !["delivered", "cancelled"].includes(
        normaliseStatus(order.fulfilment_status),
      ),
  );

  const completedSortedOrders = sortedOrders.filter((order) =>
    ["delivered", "cancelled"].includes(
      normaliseStatus(order.fulfilment_status),
    ),
  );

  const unpaidSortedOrders = sortedOrders.filter(
    (order) => order.payment_status !== "paid",
  );

  function renderOrderCard(order: Order, subdued = false) {
    const items = Array.isArray(order.items) ? order.items : [];
    const isUpdating = updatingOrderId === order.id;

    return (
      <article
        key={order.id}
        className={`overflow-hidden rounded-[28px] border border-[#ddd4c8] bg-white/90 shadow-[0_12px_28px_rgba(36,51,40,0.06)] ${
          subdued ? "opacity-80" : ""
        }`}
      >
        <div className="grid gap-4 border-b border-[#eee5d8] p-5 lg:grid-cols-[1fr_1fr_0.7fr]">
          <div>
            <div className="flex flex-wrap gap-2">
              <span
                className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusClasses(
                  order.fulfilment_status,
                )}`}
              >
                {statusLabel(order.fulfilment_status)}
              </span>

              <span
                className={`rounded-full border px-3 py-1 text-xs font-medium ${getPaymentClasses(
                  order.payment_status,
                )}`}
              >
                Payment: {order.payment_status}
              </span>
            </div>

            <p className="mt-4 text-xs uppercase tracking-[0.16em] text-[#7a8478]">
              {formatDate(order.created_at)}
            </p>

            <h2 className="mt-2 font-serif text-2xl leading-tight">
              {order.customer_name}
            </h2>

            <div className="mt-3 space-y-1 text-sm text-[#667164]">
              <p>{order.customer_email}</p>
              {order.customer_phone ? <p>{order.customer_phone}</p> : null}
            </div>
          </div>

          <div className="rounded-2xl border border-[#eee5d8] bg-[#fbfaf8] p-4 text-sm leading-6 text-[#667164]">
            <p className="font-medium text-[#243328]">Delivery address</p>
            <p className="mt-2">{order.delivery_address_line_1}</p>

            {order.delivery_address_line_2 ? (
              <p>{order.delivery_address_line_2}</p>
            ) : null}

            <p>{order.delivery_town}</p>

            <p className="font-semibold text-[#243328]">
              {order.delivery_postcode}
            </p>

            {order.delivery_notes ? (
              <div className="mt-3 rounded-xl border border-[#d8cbbd] bg-[#f7f2eb] p-3">
                <p className="text-xs uppercase tracking-[0.14em] text-[#7a8478]">
                  Notes
                </p>
                <p className="mt-1 text-[#243328]">{order.delivery_notes}</p>
              </div>
            ) : null}
          </div>

          <div>
            <div className="rounded-2xl border border-[#eee5d8] bg-[#fbfaf8] p-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatMoney(order.subtotal)}</span>
              </div>

              <div className="mt-2 flex justify-between text-sm">
                <span>Delivery</span>
                <span>{formatMoney(order.delivery)}</span>
              </div>

              <div className="mt-3 flex justify-between border-t border-[#eee5d8] pt-3 font-serif text-xl">
                <span>Total</span>
                <span>{formatMoney(order.total)}</span>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-[#f7f2eb] px-3 py-1 text-xs">
                {order.order_type}
              </span>

              {order.subscription_frequency ? (
                <span className="rounded-full bg-[#f7f2eb] px-3 py-1 text-xs">
                  {order.subscription_frequency}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="grid gap-5 p-5 lg:grid-cols-[1fr_0.42fr]">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-semibold">Packing list</p>

              <button
                type="button"
                onClick={() => copyOrder(order)}
                className="rounded-full border border-[#d6cec2] bg-white px-3 py-1.5 text-xs font-medium hover:bg-[#f7f2eb]"
              >
                Copy order
              </button>
            </div>

            <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {items.length > 0 ? (
                items.map((item, index) => (
                  <div
                    key={`${item.name ?? "item"}-${index}`}
                    className="rounded-2xl border border-[#eee5d8] bg-[#fbfaf8] p-3"
                  >
                    <p className="font-medium leading-snug">{item.name}</p>
                    <p className="mt-1 text-sm text-[#667164]">
                      {formatMoney(item.price)} · {item.checkoutType ?? "item"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="rounded-2xl border border-[#eee5d8] bg-[#fbfaf8] p-4 text-sm text-[#667164]">
                  No item data found.
                </p>
              )}
            </div>

            {order.launch_gift ? (
              <div className="mt-4 rounded-2xl border border-[#d8cbbd] bg-[#f7f2eb] p-4">
                <p className="text-sm font-medium">Free launch gift</p>
                <p className="mt-1 font-serif text-2xl">{order.launch_gift}</p>
              </div>
            ) : null}
          </div>

          <div className="rounded-2xl border border-[#eee5d8] bg-[#fbfaf8] p-4">
            <p className="text-sm font-semibold">Move order through</p>
            <p className="mt-1 text-xs text-[#667164]">
              New → Packing → Packed → Delivered
            </p>

            <div className="mt-4 grid gap-2">
              {FULFILMENT_STATUSES.map((status) => (
                <button
                  key={status}
                  type="button"
                  disabled={isUpdating}
                  onClick={() => updateFulfilmentStatus(order.id, status)}
                  className={`w-full rounded-full border px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                    normaliseStatus(order.fulfilment_status) === status
                      ? "border-[#243328] bg-[#243328] text-white"
                      : "border-[#d6cec2] bg-white text-[#243328] hover:bg-[#f7f2eb]"
                  }`}
                >
                  {isUpdating ? "Updating..." : `Mark ${STATUS_LABELS[status]}`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4efe9] px-4 py-8 text-[#243328] md:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 rounded-[28px] border border-[#ddd4c8] bg-white/85 p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
            The Local Pantry
          </p>

          <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-serif text-4xl">Orders</h1>
              <p className="mt-2 text-sm text-[#667164]">
                Work from top to bottom. Paid active orders stay first.
                Delivered and cancelled orders move below.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={loadOrders}
                className="rounded-full border border-[#d6cec2] bg-white px-4 py-2 text-sm font-medium hover:bg-[#f7f2eb]"
              >
                Refresh
              </button>

              <Link
                href="/"
                className="rounded-full bg-[#243328] px-4 py-2 text-sm font-medium text-white"
              >
                Back to site
              </Link>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-2xl border border-[#eee5d8] bg-[#fbfaf8] p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-[#7a8478]">
                Needs done
              </p>
              <p className="mt-1 font-serif text-3xl">{activeOrders.length}</p>
            </div>

            <div className="rounded-2xl border border-[#eee5d8] bg-[#fbfaf8] p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-[#7a8478]">
                Paid
              </p>
              <p className="mt-1 font-serif text-3xl">{paidOrders.length}</p>
            </div>

            <div className="rounded-2xl border border-[#eee5d8] bg-[#fbfaf8] p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-[#7a8478]">
                Unpaid
              </p>
              <p className="mt-1 font-serif text-3xl">{unpaidOrders.length}</p>
            </div>

            <div className="rounded-2xl border border-[#eee5d8] bg-[#fbfaf8] p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-[#7a8478]">
                Delivered
              </p>
              <p className="mt-1 font-serif text-3xl">
                {deliveredOrders.length}
              </p>
            </div>

            <div className="rounded-2xl border border-[#eee5d8] bg-[#fbfaf8] p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-[#7a8478]">
                Cancelled
              </p>
              <p className="mt-1 font-serif text-3xl">
                {cancelledOrders.length}
              </p>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="rounded-[28px] border border-[#ddd4c8] bg-white/85 p-8 text-center">
            Loading orders...
          </div>
        ) : null}

        {error ? (
          <div className="mb-5 rounded-[20px] border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {notice ? (
          <div className="mb-5 rounded-[20px] border border-[#bdd7b6] bg-[#e8f3e5] p-4 text-sm text-[#315333]">
            {notice}
          </div>
        ) : null}

        {!loading && orders.length === 0 ? (
          <div className="rounded-[28px] border border-[#ddd4c8] bg-white/85 p-8 text-center">
            <h2 className="font-serif text-3xl">No orders yet</h2>
            <p className="mt-2 text-sm text-[#667164]">
              New orders will appear here after checkout starts.
            </p>
          </div>
        ) : null}

        {!loading && activeSortedOrders.length > 0 ? (
          <section className="space-y-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="font-serif text-3xl">Needs action</h2>
                <p className="mt-1 text-sm text-[#667164]">
                  Pack these first. Oldest status priority appears first, newest
                  order within each status appears first.
                </p>
              </div>
            </div>

            {activeSortedOrders.map((order) => renderOrderCard(order))}
          </section>
        ) : null}

        {!loading && unpaidSortedOrders.length > 0 ? (
          <section className="mt-10 space-y-5">
            <div>
              <h2 className="font-serif text-3xl">Payment not confirmed</h2>
              <p className="mt-1 text-sm text-[#667164]">
                Do not pack these until payment is marked paid.
              </p>
            </div>

            {unpaidSortedOrders.map((order) => renderOrderCard(order, true))}
          </section>
        ) : null}

        {!loading && completedSortedOrders.length > 0 ? (
          <section className="mt-10 space-y-5 pb-10">
            <div>
              <h2 className="font-serif text-3xl">Completed or closed</h2>
              <p className="mt-1 text-sm text-[#667164]">
                Delivered and cancelled orders are kept here for reference.
              </p>
            </div>

            {completedSortedOrders.map((order) => renderOrderCard(order, true))}
          </section>
        ) : null}
      </div>
    </main>
  );
}
