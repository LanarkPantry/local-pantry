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
  quantity?: number;
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
  delivery_date?: string | null;
  delivery_day?: string | null;
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

const DELIVERY_STATUSES = [
  "new",
  "packing",
  "packed",
  "delivered",
  "cancelled",
];

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatDeliveryDateOnly(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
  }).format(new Date(`${value}T12:00:00`));
}

function formatMoney(value: number | null | undefined) {
  return `£${Number(value ?? 0).toFixed(2)}`;
}

function normaliseStatus(value: string | null | undefined) {
  return value || "new";
}

function itemQuantity(item: OrderItem) {
  const quantity = Number(item.quantity ?? 1);
  return Number.isFinite(quantity) && quantity > 0 ? quantity : 1;
}

function getDeliveryLabel(order: Order) {
  if (order.delivery_date) return formatDeliveryDateOnly(order.delivery_date);
  if (order.delivery_day) return order.delivery_day;
  return "Delivery day not set";
}

function getDeliverySortValue(order: Order) {
  if (order.delivery_date) {
    const time = new Date(`${order.delivery_date}T12:00:00`).getTime();
    return Number.isFinite(time) ? time : Number.MAX_SAFE_INTEGER;
  }

  const day = order.delivery_day?.toLowerCase();

  if (day === "monday") return 1;
  if (day === "tuesday") return 2;
  if (day === "wednesday") return 3;
  if (day === "thursday") return 4;
  if (day === "friday") return 5;
  if (day === "saturday") return 6;
  if (day === "sunday") return 7;

  return Number.MAX_SAFE_INTEGER;
}

function groupOrdersByDelivery(orders: Order[]) {
  const groups = new Map<string, Order[]>();

  orders.forEach((order) => {
    const label = getDeliveryLabel(order);
    groups.set(label, [...(groups.get(label) ?? []), order]);
  });

  return Array.from(groups.entries())
    .map(([label, groupedOrders]) => ({
      label,
      orders: groupedOrders.sort((a, b) => {
        const deliveryA = getDeliverySortValue(a);
        const deliveryB = getDeliverySortValue(b);

        if (deliveryA !== deliveryB) return deliveryA - deliveryB;

        return a.delivery_postcode.localeCompare(b.delivery_postcode);
      }),
      sortValue: Math.min(...groupedOrders.map(getDeliverySortValue)),
    }))
    .sort((a, b) => {
      if (a.sortValue !== b.sortValue) return a.sortValue - b.sortValue;
      return a.label.localeCompare(b.label);
    });
}

function buildMapSearchUrl(order: Order) {
  const address = [
    order.delivery_address_line_1,
    order.delivery_address_line_2,
    order.delivery_town,
    order.delivery_postcode,
  ]
    .filter(Boolean)
    .join(", ");

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address,
  )}`;
}

function buildManifestCopyText(order: Order) {
  const items = Array.isArray(order.items) ? order.items : [];

  const itemLines = items
    .map((item) => {
      const quantity = itemQuantity(item);
      return `- ${item.name ?? "Unnamed item"}${quantity > 1 ? ` x${quantity}` : ""}`;
    })
    .join("\\n");

  return [
    `${order.customer_name}`,
    order.customer_phone ? `Phone: ${order.customer_phone}` : "Phone: none",
    "",
    "Address:",
    order.delivery_address_line_1,
    order.delivery_address_line_2,
    order.delivery_town,
    order.delivery_postcode,
    "",
    `Delivery: ${getDeliveryLabel(order)}`,
    order.delivery_notes ? `Notes: ${order.delivery_notes}` : "Notes: none",
    "",
    "Items:",
    itemLines || "No item data found.",
    order.launch_gift ? `\\nLaunch gift: ${order.launch_gift}` : "",
  ]
    .filter(Boolean)
    .join("\\n");
}

function buildRoundCopyText(label: string, orders: Order[]) {
  return [
    `DELIVERY ROUND: ${label}`,
    `${orders.length} deliveries`,
    "",
    ...orders.flatMap((order, index) => [
      `${index + 1}. ${order.customer_name}`,
      order.customer_phone ? `Phone: ${order.customer_phone}` : "Phone: none",
      [
        order.delivery_address_line_1,
        order.delivery_address_line_2,
        order.delivery_town,
        order.delivery_postcode,
      ]
        .filter(Boolean)
        .join(", "),
      order.delivery_notes ? `Notes: ${order.delivery_notes}` : "Notes: none",
      `Items: ${
        Array.isArray(order.items) && order.items.length > 0
          ? order.items
              .map((item) => {
                const quantity = itemQuantity(item);
                return `${item.name ?? "Unnamed item"}${quantity > 1 ? ` x${quantity}` : ""}`;
              })
              .join(", ")
          : "No item data found"
      }`,
      "",
    ]),
  ].join("\\n");
}

export default function AdminDeliveryManifestPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showDelivered, setShowDelivered] = useState(false);

  async function getToken() {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  }

  async function loadOrders() {
    setLoading(true);
    setError("");

    const token = await getToken();

    if (!token) {
      setError("Please sign in first, then return to this page.");
      setLoading(false);
      return;
    }

    const response = await fetch("/api/admin/orders", {
      headers: { Authorization: `Bearer ${token}` },
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

    const token = await getToken();

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
      body: JSON.stringify({ orderId, fulfilmentStatus }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Could not update order.");
      setUpdatingOrderId(null);
      return;
    }

    await loadOrders();
    setUpdatingOrderId(null);
  }

  async function copyText(id: string, text: string) {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);

    window.setTimeout(() => {
      setCopiedId(null);
    }, 1600);
  }

  useEffect(() => {
    void loadOrders();
  }, []);

  const deliveryOrders = useMemo(() => {
    return orders
      .filter((order) => order.payment_status === "paid")
      .filter((order) => {
        const status = normaliseStatus(order.fulfilment_status);

        if (showDelivered) return status !== "cancelled";

        return status === "new" || status === "packing" || status === "packed";
      })
      .sort((a, b) => {
        const deliveryA = getDeliverySortValue(a);
        const deliveryB = getDeliverySortValue(b);

        if (deliveryA !== deliveryB) return deliveryA - deliveryB;

        return a.delivery_postcode.localeCompare(b.delivery_postcode);
      });
  }, [orders, showDelivered]);

  const deliveryGroups = useMemo(
    () => groupOrdersByDelivery(deliveryOrders),
    [deliveryOrders],
  );

  const totalRevenue = deliveryOrders.reduce(
    (sum, order) => sum + Number(order.total ?? 0),
    0,
  );

  const packedCount = deliveryOrders.filter(
    (order) => normaliseStatus(order.fulfilment_status) === "packed",
  ).length;

  const deliveredCount = deliveryOrders.filter(
    (order) => normaliseStatus(order.fulfilment_status) === "delivered",
  ).length;

  function renderOrder(order: Order, index: number) {
    const items = Array.isArray(order.items) ? order.items : [];
    const status = normaliseStatus(order.fulfilment_status);
    const isUpdating = updatingOrderId === order.id;

    return (
      <article
        key={order.id}
        className={`rounded-[26px] border bg-white/90 p-4 shadow-[0_10px_22px_rgba(36,51,40,0.05)] ${
          status === "delivered"
            ? "border-[#d8dfd2] opacity-75"
            : status === "packed"
              ? "border-[#bfcfc2]"
              : "border-[#ddd4c8]"
        }`}
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-[#7a8478]">
              Stop {index + 1} · {status}
            </p>

            <h3 className="mt-1 font-serif text-3xl">{order.customer_name}</h3>

            <div className="mt-2 space-y-1 text-sm leading-6 text-[#667164]">
              <p>{order.delivery_address_line_1}</p>
              {order.delivery_address_line_2 ? (
                <p>{order.delivery_address_line_2}</p>
              ) : null}
              <p>{order.delivery_town}</p>
              <p className="font-medium text-[#243328]">
                {order.delivery_postcode}
              </p>
            </div>

            {order.customer_phone ? (
              <a
                href={`tel:${order.customer_phone}`}
                className="mt-3 inline-flex rounded-full border border-[#d6cec2] bg-white px-4 py-2 text-sm font-medium text-[#243328]"
              >
                Call {order.customer_phone}
              </a>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2 md:justify-end">
            <a
              href={buildMapSearchUrl(order)}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-[#243328] px-4 py-2 text-sm font-medium text-white"
            >
              Open map
            </a>

            <button
              type="button"
              onClick={() => copyText(order.id, buildManifestCopyText(order))}
              className="rounded-full border border-[#d6cec2] bg-white px-4 py-2 text-sm font-medium text-[#243328]"
            >
              {copiedId === order.id ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        {order.delivery_notes ? (
          <div className="mt-4 rounded-2xl border border-[#e5ddcf] bg-[#fbfaf8] p-4">
            <p className="text-sm font-medium text-[#243328]">Delivery notes</p>
            <p className="mt-1 text-sm leading-6 text-[#667164]">
              {order.delivery_notes}
            </p>
          </div>
        ) : null}

        <div className="mt-4 rounded-2xl border border-[#e5ddcf] bg-[#fbfaf8] p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-[#243328]">Items</p>
            <p className="text-sm text-[#667164]">
              {order.order_type}
              {order.subscription_frequency
                ? ` · ${order.subscription_frequency}`
                : ""}
            </p>
          </div>

          <div className="grid gap-2">
            {items.length > 0 ? (
              items.map((item, itemIndex) => {
                const quantity = itemQuantity(item);

                return (
                  <div
                    key={`${item.name ?? "item"}-${itemIndex}`}
                    className="flex items-center justify-between rounded-xl bg-white/75 px-3 py-2 text-sm"
                  >
                    <span className="font-medium">{item.name}</span>
                    <span className="text-[#667164]">
                      {quantity > 1 ? `x ${quantity}` : "x 1"}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-[#667164]">No item data found.</p>
            )}
          </div>

          {order.launch_gift ? (
            <p className="mt-3 rounded-xl bg-[#f7f2eb] px-3 py-2 text-sm">
              Launch gift: {order.launch_gift}
            </p>
          ) : null}
        </div>

        <div className="mt-4 grid gap-2 md:grid-cols-5">
          {DELIVERY_STATUSES.map((fulfilmentStatus) => (
            <button
              key={fulfilmentStatus}
              type="button"
              disabled={isUpdating}
              onClick={() => updateFulfilmentStatus(order.id, fulfilmentStatus)}
              className={`rounded-full border px-3 py-2 text-sm font-medium disabled:opacity-50 ${
                status === fulfilmentStatus
                  ? "border-[#243328] bg-[#243328] text-white"
                  : "border-[#d6cec2] bg-white text-[#243328]"
              }`}
            >
              {fulfilmentStatus}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#eee5d8] pt-4 text-sm text-[#667164]">
          <p>{formatDateTime(order.created_at)}</p>
          <p className="font-medium text-[#243328]">
            Total {formatMoney(order.total)}
          </p>
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
              <h1 className="font-serif text-4xl">Delivery Manifest</h1>
              <p className="mt-2 text-sm text-[#667164]">
                Use this on your phone while loading the car and delivering.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={loadOrders}
                className="rounded-full border border-[#d6cec2] bg-white px-4 py-2 text-sm font-medium"
              >
                Refresh
              </button>

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

        <section className="mb-6 grid gap-3 md:grid-cols-4">
          <div className="rounded-[22px] border border-[#ddd4c8] bg-white/85 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-[#7a8478]">
              Deliveries
            </p>
            <p className="mt-1 font-serif text-3xl">{deliveryOrders.length}</p>
          </div>

          <div className="rounded-[22px] border border-[#ddd4c8] bg-white/85 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-[#7a8478]">
              Packed
            </p>
            <p className="mt-1 font-serif text-3xl">{packedCount}</p>
          </div>

          <div className="rounded-[22px] border border-[#ddd4c8] bg-white/85 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-[#7a8478]">
              Delivered
            </p>
            <p className="mt-1 font-serif text-3xl">{deliveredCount}</p>
          </div>

          <div className="rounded-[22px] border border-[#ddd4c8] bg-white/85 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-[#7a8478]">
              Value
            </p>
            <p className="mt-1 font-serif text-3xl">
              {formatMoney(totalRevenue)}
            </p>
          </div>
        </section>

        <section className="mb-6 rounded-[28px] border border-[#ddd4c8] bg-white/85 p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-serif text-3xl">Delivery controls</h2>
              <p className="mt-1 text-sm text-[#667164]">
                Delivered orders are hidden by default so the live route stays
                tidy.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowDelivered((value) => !value)}
              className="rounded-full border border-[#d6cec2] bg-white px-4 py-2 text-sm font-medium"
            >
              {showDelivered ? "Hide delivered" : "Show delivered"}
            </button>
          </div>
        </section>

        {loading ? (
          <div className="rounded-[28px] border border-[#ddd4c8] bg-white/85 p-8 text-center">
            Loading delivery manifest...
          </div>
        ) : null}

        {!loading && deliveryGroups.length === 0 ? (
          <div className="rounded-[28px] border border-[#ddd4c8] bg-white/85 p-8 text-center">
            <h2 className="font-serif text-3xl">No deliveries to show</h2>
            <p className="mt-2 text-sm text-[#667164]">
              Paid orders marked new, packing or packed will appear here.
            </p>
          </div>
        ) : null}

        <div className="space-y-8">
          {deliveryGroups.map((group) => (
            <section key={group.label}>
              <div className="mb-4 rounded-[24px] border border-[#ddd4c8] bg-white/85 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-[#7a8478]">
                      Delivery round
                    </p>
                    <h2 className="mt-1 font-serif text-3xl">{group.label}</h2>
                    <p className="mt-1 text-sm text-[#667164]">
                      {group.orders.length} deliver
                      {group.orders.length === 1 ? "y" : "ies"} ·{" "}
                      {formatMoney(
                        group.orders.reduce(
                          (sum, order) => sum + Number(order.total ?? 0),
                          0,
                        ),
                      )}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      copyText(
                        `round-${group.label}`,
                        buildRoundCopyText(group.label, group.orders),
                      )
                    }
                    className="rounded-full border border-[#d6cec2] bg-white px-4 py-2 text-sm font-medium"
                  >
                    {copiedId === `round-${group.label}`
                      ? "Round copied"
                      : "Copy round"}
                  </button>
                </div>
              </div>

              <div className="space-y-5">
                {group.orders.map((order, index) => renderOrder(order, index))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
