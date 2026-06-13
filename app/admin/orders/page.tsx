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

const FULFILMENT_STATUSES = [
  "new",
  "packing",
  "packed",
  "delivered",
  "cancelled",
];

const ACTIVE_STATUSES = ["new", "packing", "packed"];

function formatDate(value: string) {
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
  }).format(new Date(value));
}

function getDeliveryLabel(order: Order) {
  if (order.delivery_date) {
    return formatDeliveryDateOnly(order.delivery_date);
  }

  if (order.delivery_day) {
    return order.delivery_day;
  }

  return "Delivery day not set";
}

function getDeliverySortValue(order: Order) {
  if (order.delivery_date) {
    const time = new Date(order.delivery_date).getTime();
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

        if (deliveryA !== deliveryB) {
          return deliveryA - deliveryB;
        }

        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      }),
      sortValue: Math.min(...groupedOrders.map(getDeliverySortValue)),
    }))
    .sort((a, b) => {
      if (a.sortValue !== b.sortValue) {
        return a.sortValue - b.sortValue;
      }

      return a.label.localeCompare(b.label);
    });
}

function formatMoney(value: number | null | undefined) {
  return `£${Number(value ?? 0).toFixed(2)}`;
}

function normaliseStatus(value: string | null | undefined) {
  return value || "new";
}

function getOrderSortPriority(order: Order) {
  if (order.payment_status !== "paid") return 50;

  const status = normaliseStatus(order.fulfilment_status);

  if (status === "new") return 1;
  if (status === "packing") return 2;
  if (status === "packed") return 3;
  if (status === "delivered") return 20;
  if (status === "cancelled") return 30;

  return 10;
}

function sortOrdersForWorkflow(orders: Order[]) {
  return [...orders].sort((a, b) => {
    const priorityA = getOrderSortPriority(a);
    const priorityB = getOrderSortPriority(b);

    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

function buildCopyText(order: Order) {
  const items = Array.isArray(order.items) ? order.items : [];
  const itemLines = items
    .map((item) => `- ${item.name ?? "Unnamed item"}`)
    .join("\n");

  return [
    `ORDER: ${order.customer_name}`,
    `STATUS: ${order.fulfilment_status}`,
    `TYPE: ${order.order_type}${order.subscription_frequency ? ` / ${order.subscription_frequency}` : ""}`,
    `TOTAL: ${formatMoney(order.total)}`,
    "",
    "DELIVERY:",
    order.delivery_address_line_1,
    order.delivery_address_line_2,
    order.delivery_town,
    order.delivery_postcode,
    "",
    `DELIVERY ROUND: ${getDeliveryLabel(order)}`,
    order.delivery_notes ? `NOTES: ${order.delivery_notes}` : "NOTES: none",
    "",
    "ITEMS:",
    itemLines || "No item data found.",
    "",
    order.launch_gift
      ? `LAUNCH GIFT: ${order.launch_gift}`
      : "LAUNCH GIFT: none",
    "",
    `CUSTOMER EMAIL: ${order.customer_email}`,
    order.customer_phone
      ? `CUSTOMER PHONE: ${order.customer_phone}`
      : "CUSTOMER PHONE: none",
  ]
    .filter(Boolean)
    .join("\n");
}

type PackingSummaryLine = {
  name: string;
  quantity: number;
};

function itemQuantity(item: OrderItem) {
  const quantity = Number(item.quantity ?? 1);
  return Number.isFinite(quantity) && quantity > 0 ? quantity : 1;
}

function buildPackingSummary(orders: Order[]) {
  const itemCounts = new Map<string, number>();
  const giftCounts = new Map<string, number>();
  let orderCount = 0;
  let subscriptionCount = 0;
  let oneOffCount = 0;

  orders.forEach((order) => {
    orderCount += 1;

    if (order.order_type === "subscription") {
      subscriptionCount += 1;
    } else {
      oneOffCount += 1;
    }

    const items = Array.isArray(order.items) ? order.items : [];

    items.forEach((item) => {
      const name = item.name?.trim() || "Unnamed item";
      itemCounts.set(name, (itemCounts.get(name) ?? 0) + itemQuantity(item));
    });

    if (order.launch_gift) {
      const giftName = order.launch_gift.trim();
      giftCounts.set(giftName, (giftCounts.get(giftName) ?? 0) + 1);
    }
  });

  const sortLines = (
    [nameA, quantityA]: [string, number],
    [nameB, quantityB]: [string, number],
  ) => {
    if (quantityA !== quantityB) return quantityB - quantityA;
    return nameA.localeCompare(nameB);
  };

  return {
    orderCount,
    subscriptionCount,
    oneOffCount,
    items: Array.from(itemCounts.entries())
      .sort(sortLines)
      .map(([name, quantity]) => ({ name, quantity })),
    gifts: Array.from(giftCounts.entries())
      .sort(sortLines)
      .map(([name, quantity]) => ({ name, quantity })),
  };
}

function PackingSummaryList({
  emptyText,
  lines,
}: {
  emptyText: string;
  lines: PackingSummaryLine[];
}) {
  if (lines.length === 0) {
    return <p className="text-sm text-[#667164]">{emptyText}</p>;
  }

  return (
    <div className="grid gap-2">
      {lines.map((line) => (
        <div
          key={line.name}
          className="flex items-center justify-between rounded-2xl border border-[#eee5d8] bg-[#fbfaf8] px-4 py-3 text-sm"
        >
          <span className="font-medium text-[#243328]">{line.name}</span>
          <span className="rounded-full bg-[#243328] px-3 py-1 text-xs font-medium text-white">
            x {line.quantity}
          </span>
        </div>
      ))}
    </div>
  );
}

function SectionHeading({
  title,
  count,
  description,
}: {
  title: string;
  count: number;
  description: string;
}) {
  return (
    <div className="mb-3 mt-8 flex flex-col gap-1 border-b border-[#ddd4c8] pb-3 md:flex-row md:items-end md:justify-between">
      <div>
        <h2 className="font-serif text-2xl">{title}</h2>
        <p className="text-sm text-[#667164]">{description}</p>
      </div>
      <p className="text-sm font-medium text-[#243328]">{count} orders</p>
    </div>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  async function loadOrders() {
    setLoading(true);
    setError("");

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
    setUpdatingOrderId(null);
  }

  async function copyOrder(order: Order) {
    await navigator.clipboard.writeText(buildCopyText(order));
    setCopiedOrderId(order.id);

    window.setTimeout(() => {
      setCopiedOrderId(null);
    }, 1800);
  }

  useEffect(() => {
    void loadOrders();
  }, []);

  const sortedOrders = useMemo(() => sortOrdersForWorkflow(orders), [orders]);

  const activePaidOrders = useMemo(
    () =>
      sortedOrders.filter(
        (order) =>
          order.payment_status === "paid" &&
          ACTIVE_STATUSES.includes(normaliseStatus(order.fulfilment_status)),
      ),
    [sortedOrders],
  );

  const deliveredOrders = useMemo(
    () =>
      sortedOrders.filter(
        (order) =>
          order.payment_status === "paid" &&
          normaliseStatus(order.fulfilment_status) === "delivered",
      ),
    [sortedOrders],
  );

  const cancelledOrders = useMemo(
    () =>
      sortedOrders.filter(
        (order) => normaliseStatus(order.fulfilment_status) === "cancelled",
      ),
    [sortedOrders],
  );

  const unpaidOrders = useMemo(
    () => sortedOrders.filter((order) => order.payment_status !== "paid"),
    [sortedOrders],
  );

  const paidOrders = useMemo(
    () => orders.filter((order) => order.payment_status === "paid"),
    [orders],
  );

  const newOrders = useMemo(
    () =>
      activePaidOrders.filter(
        (order) => normaliseStatus(order.fulfilment_status) === "new",
      ),
    [activePaidOrders],
  );

  const packingOrders = useMemo(
    () =>
      activePaidOrders.filter(
        (order) => normaliseStatus(order.fulfilment_status) === "packing",
      ),
    [activePaidOrders],
  );

  const packedOrders = useMemo(
    () =>
      activePaidOrders.filter(
        (order) => normaliseStatus(order.fulfilment_status) === "packed",
      ),
    [activePaidOrders],
  );

  const ordersStillNeedingPacked = useMemo(
    () =>
      activePaidOrders.filter((order) => {
        const status = normaliseStatus(order.fulfilment_status);
        return status === "new" || status === "packing";
      }),
    [activePaidOrders],
  );

  const packingSummary = useMemo(
    () => buildPackingSummary(ordersStillNeedingPacked),
    [ordersStillNeedingPacked],
  );

  const activePaidDeliveryGroups = useMemo(
    () => groupOrdersByDelivery(activePaidOrders),
    [activePaidOrders],
  );

  const packingDeliveryGroups = useMemo(
    () => groupOrdersByDelivery(ordersStillNeedingPacked),
    [ordersStillNeedingPacked],
  );

  function renderOrderCard(order: Order) {
    const items = Array.isArray(order.items) ? order.items : [];
    const isUpdating = updatingOrderId === order.id;
    const status = normaliseStatus(order.fulfilment_status);

    return (
      <article
        key={order.id}
        className={`overflow-hidden rounded-[28px] border bg-white/88 shadow-[0_12px_28px_rgba(36,51,40,0.06)] ${
          status === "cancelled"
            ? "border-red-200 opacity-75"
            : status === "delivered"
              ? "border-[#d8dfd2] opacity-85"
              : "border-[#ddd4c8]"
        }`}
      >
        <div className="grid gap-4 border-b border-[#eee5d8] p-5 lg:grid-cols-[1.1fr_0.9fr_0.8fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-[#7a8478]">
              {formatDate(order.created_at)}
            </p>

            <h3 className="mt-2 font-serif text-2xl">{order.customer_name}</h3>

            <div className="mt-2 space-y-1 text-sm text-[#667164]">
              <p>{order.customer_email}</p>

              {order.customer_phone ? <p>{order.customer_phone}</p> : null}
            </div>

            <button
              type="button"
              onClick={() => copyOrder(order)}
              className="mt-4 rounded-full border border-[#d6cec2] bg-white px-4 py-2 text-sm font-medium text-[#243328] hover:bg-[#f7f2eb]"
            >
              {copiedOrderId === order.id ? "Copied" : "Copy order"}
            </button>
          </div>

          <div className="text-sm leading-6 text-[#667164]">
            <p className="font-medium text-[#243328]">Delivery</p>
            <p className="mb-2 inline-flex rounded-full bg-[#243328] px-3 py-1 text-xs font-medium text-white">
              {getDeliveryLabel(order)}
            </p>
            <p>{order.delivery_address_line_1}</p>

            {order.delivery_address_line_2 ? (
              <p>{order.delivery_address_line_2}</p>
            ) : null}

            <p>{order.delivery_town}</p>

            <p className="font-medium text-[#243328]">
              {order.delivery_postcode}
            </p>

            {order.delivery_notes ? (
              <p className="mt-2 rounded-xl bg-[#f7f2eb] p-3">
                <span className="font-medium text-[#243328]">Notes: </span>
                {order.delivery_notes}
              </p>
            ) : null}
          </div>

          <div>
            <div className="flex flex-wrap gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  order.payment_status === "paid"
                    ? "bg-[#e8f3e5] text-[#315333]"
                    : "bg-[#fbf0dc] text-[#725a20]"
                }`}
              >
                Payment: {order.payment_status}
              </span>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  status === "new"
                    ? "bg-[#fbf0dc] text-[#725a20]"
                    : status === "packing"
                      ? "bg-[#edf1df] text-[#596126]"
                      : status === "packed"
                        ? "bg-[#e6eef5] text-[#29445c]"
                        : status === "delivered"
                          ? "bg-[#e8f3e5] text-[#315333]"
                          : status === "cancelled"
                            ? "bg-red-50 text-red-700"
                            : "bg-[#f7f2eb] text-[#243328]"
                }`}
              >
                Fulfilment: {status}
              </span>

              <span className="rounded-full bg-[#f7f2eb] px-3 py-1 text-xs">
                {order.order_type}
              </span>

              {order.subscription_frequency ? (
                <span className="rounded-full bg-[#f7f2eb] px-3 py-1 text-xs">
                  {order.subscription_frequency}
                </span>
              ) : null}
            </div>

            <div className="mt-4 rounded-2xl border border-[#eee5d8] bg-[#fbfaf8] p-4">
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
          </div>
        </div>

        <div className="grid gap-5 p-5 lg:grid-cols-[1fr_0.55fr]">
          <div>
            <p className="text-sm font-medium">Items to pack</p>

            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {items.length > 0 ? (
                items.map((item, index) => (
                  <div
                    key={`${item.name ?? "item"}-${index}`}
                    className="rounded-2xl border border-[#eee5d8] bg-[#fbfaf8] p-3"
                  >
                    <p className="font-medium">{item.name}</p>
                    <p className="mt-1 text-sm text-[#667164]">
                      {formatMoney(item.price)} · {item.checkoutType ?? "item"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[#667164]">No item data found.</p>
              )}
            </div>

            {order.launch_gift ? (
              <div className="mt-4 rounded-2xl border border-[#d8cbbd] bg-[#f7f2eb] p-4">
                <p className="text-sm font-medium">Free launch gift</p>
                <p className="mt-1 font-serif text-2xl">{order.launch_gift}</p>
              </div>
            ) : null}
          </div>

          <div>
            <p className="text-sm font-medium">Move order through workflow</p>

            <div className="mt-3 grid gap-2">
              {FULFILMENT_STATUSES.map((fulfilmentStatus) => (
                <button
                  key={fulfilmentStatus}
                  type="button"
                  disabled={isUpdating}
                  onClick={() =>
                    updateFulfilmentStatus(order.id, fulfilmentStatus)
                  }
                  className={`w-full rounded-full border px-4 py-2.5 text-sm font-medium transition disabled:opacity-50 ${
                    status === fulfilmentStatus
                      ? "border-[#243328] bg-[#243328] text-white"
                      : "border-[#d6cec2] bg-white text-[#243328] hover:bg-[#f7f2eb]"
                  }`}
                >
                  {status === fulfilmentStatus ? "Current: " : "Mark "}
                  {fulfilmentStatus}
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
                Work from the top down: delivery round first, then new, packing,
                packed, and finished orders.
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
                href="/"
                className="rounded-full bg-[#243328] px-4 py-2 text-sm font-medium text-white"
              >
                Back to site
              </Link>
            </div>
          </div>
        </header>

        <section className="mb-6 grid gap-3 md:grid-cols-5">
          <div className="rounded-[22px] border border-[#ddd4c8] bg-white/85 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-[#7a8478]">
              Total
            </p>
            <p className="mt-1 font-serif text-3xl">{orders.length}</p>
          </div>

          <div className="rounded-[22px] border border-[#ddd4c8] bg-white/85 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-[#7a8478]">
              Paid
            </p>
            <p className="mt-1 font-serif text-3xl">{paidOrders.length}</p>
          </div>

          <div className="rounded-[22px] border border-[#ddd4c8] bg-white/85 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-[#7a8478]">
              New
            </p>
            <p className="mt-1 font-serif text-3xl">{newOrders.length}</p>
          </div>

          <div className="rounded-[22px] border border-[#ddd4c8] bg-white/85 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-[#7a8478]">
              Packing
            </p>
            <p className="mt-1 font-serif text-3xl">{packingOrders.length}</p>
          </div>

          <div className="rounded-[22px] border border-[#ddd4c8] bg-white/85 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-[#7a8478]">
              Packed
            </p>
            <p className="mt-1 font-serif text-3xl">{packedOrders.length}</p>
          </div>
        </section>

        {!loading && ordersStillNeedingPacked.length > 0 ? (
          <section className="mb-6 rounded-[28px] border border-[#ddd4c8] bg-white/88 p-5 shadow-[0_12px_28px_rgba(36,51,40,0.06)]">
            <div className="flex flex-col gap-3 border-b border-[#eee5d8] pb-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-[#7a8478]">
                  Packing summary
                </p>
                <h2 className="mt-1 font-serif text-3xl">What needs packed</h2>
                <p className="mt-1 text-sm text-[#667164]">
                  Counts only paid orders marked new or packing. Packed,
                  delivered, cancelled, and unpaid orders are excluded.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-2xl bg-[#f7f2eb] px-4 py-3">
                  <p className="text-xs text-[#667164]">Orders</p>
                  <p className="font-serif text-2xl">
                    {packingSummary.orderCount}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#f7f2eb] px-4 py-3">
                  <p className="text-xs text-[#667164]">One-off</p>
                  <p className="font-serif text-2xl">
                    {packingSummary.oneOffCount}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#f7f2eb] px-4 py-3">
                  <p className="text-xs text-[#667164]">Subs</p>
                  <p className="font-serif text-2xl">
                    {packingSummary.subscriptionCount}
                  </p>
                </div>
              </div>
            </div>

            {packingDeliveryGroups.length > 0 ? (
              <div className="mt-5">
                <p className="mb-3 text-sm font-medium">
                  Delivery rounds needing packed
                </p>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {packingDeliveryGroups.map((group) => (
                    <div
                      key={group.label}
                      className="rounded-2xl border border-[#eee5d8] bg-[#fbfaf8] p-4"
                    >
                      <p className="font-medium text-[#243328]">
                        {group.label}
                      </p>
                      <p className="mt-1 text-sm text-[#667164]">
                        {group.orders.length} order
                        {group.orders.length === 1 ? "" : "s"} still needing
                        packed
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_0.65fr]">
              <div>
                <p className="mb-3 text-sm font-medium">Items</p>
                <PackingSummaryList
                  lines={packingSummary.items}
                  emptyText="No item data found for orders needing packed."
                />
              </div>

              <div>
                <p className="mb-3 text-sm font-medium">Free launch gifts</p>
                <PackingSummaryList
                  lines={packingSummary.gifts}
                  emptyText="No launch gifts to prepare."
                />
              </div>
            </div>
          </section>
        ) : null}

        {!loading &&
        ordersStillNeedingPacked.length === 0 &&
        orders.length > 0 ? (
          <section className="mb-6 rounded-[28px] border border-[#d8dfd2] bg-white/88 p-5">
            <p className="font-serif text-2xl">
              Nothing currently needs packed
            </p>
            <p className="mt-1 text-sm text-[#667164]">
              Paid orders are either packed, delivered, cancelled, or there are
              no active paid orders.
            </p>
          </section>
        ) : null}

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

        {!loading && orders.length === 0 ? (
          <div className="rounded-[28px] border border-[#ddd4c8] bg-white/85 p-8 text-center">
            <h2 className="font-serif text-3xl">No orders yet</h2>
            <p className="mt-2 text-sm text-[#667164]">
              New orders will appear here after checkout starts.
            </p>
          </div>
        ) : null}

        {!loading && activePaidOrders.length > 0 ? (
          <section>
            <SectionHeading
              title="To do now"
              count={activePaidOrders.length}
              description="Paid orders grouped by delivery round. Work through the earliest delivery group first."
            />

            <div className="space-y-7">
              {activePaidDeliveryGroups.map((group) => (
                <div key={group.label}>
                  <div className="mb-3 rounded-[22px] border border-[#ddd4c8] bg-[#fbfaf8] px-4 py-3">
                    <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                      <h3 className="font-serif text-2xl">{group.label}</h3>
                      <p className="text-sm font-medium text-[#243328]">
                        {group.orders.length} order
                        {group.orders.length === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {group.orders.map(renderOrderCard)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {!loading && unpaidOrders.length > 0 ? (
          <section>
            <SectionHeading
              title="Unpaid or problem orders"
              count={unpaidOrders.length}
              description="Do not pack these until payment is clear."
            />
            <div className="space-y-5">{unpaidOrders.map(renderOrderCard)}</div>
          </section>
        ) : null}

        {!loading && deliveredOrders.length > 0 ? (
          <section>
            <SectionHeading
              title="Delivered"
              count={deliveredOrders.length}
              description="Completed orders are kept below the working list."
            />
            <div className="space-y-5">
              {deliveredOrders.map(renderOrderCard)}
            </div>
          </section>
        ) : null}

        {!loading && cancelledOrders.length > 0 ? (
          <section>
            <SectionHeading
              title="Cancelled"
              count={cancelledOrders.length}
              description="Cancelled orders stay visible but out of the way."
            />
            <div className="space-y-5">
              {cancelledOrders.map(renderOrderCard)}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
