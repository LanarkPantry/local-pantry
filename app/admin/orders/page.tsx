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

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatMoney(value: number | null | undefined) {
  return `£${Number(value ?? 0).toFixed(2)}`;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

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

  useEffect(() => {
    void loadOrders();
  }, []);

  const paidOrders = useMemo(
    () => orders.filter((order) => order.payment_status === "paid"),
    [orders],
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
              <h1 className="font-serif text-4xl">Orders</h1>
              <p className="mt-2 text-sm text-[#667164]">
                {orders.length} total · {paidOrders.length} paid
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

        <div className="space-y-5">
          {orders.map((order) => {
            const items = Array.isArray(order.items) ? order.items : [];

            return (
              <article
                key={order.id}
                className="overflow-hidden rounded-[28px] border border-[#ddd4c8] bg-white/88 shadow-[0_12px_28px_rgba(36,51,40,0.06)]"
              >
                <div className="grid gap-4 border-b border-[#eee5d8] p-5 lg:grid-cols-[1.1fr_0.9fr_0.8fr]">
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-[#7a8478]">
                      {formatDate(order.created_at)}
                    </p>

                    <h2 className="mt-2 font-serif text-2xl">
                      {order.customer_name}
                    </h2>

                    <p className="mt-1 text-sm text-[#667164]">
                      {order.customer_email}
                    </p>

                    {order.customer_phone ? (
                      <p className="mt-1 text-sm text-[#667164]">
                        {order.customer_phone}
                      </p>
                    ) : null}
                  </div>

                  <div className="text-sm leading-6 text-[#667164]">
                    <p className="font-medium text-[#243328]">Delivery</p>
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
                        {order.delivery_notes}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs ${
                          order.payment_status === "paid"
                            ? "bg-[#e8f3e5] text-[#315333]"
                            : "bg-[#fbf0dc] text-[#725a20]"
                        }`}
                      >
                        Payment: {order.payment_status}
                      </span>

                      <span className="rounded-full bg-[#f7f2eb] px-3 py-1 text-xs">
                        Fulfilment: {order.fulfilment_status}
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
                              {formatMoney(item.price)} ·{" "}
                              {item.checkoutType ?? "item"}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-[#667164]">
                          No item data found.
                        </p>
                      )}
                    </div>

                    {order.launch_gift ? (
                      <div className="mt-4 rounded-2xl border border-[#d8cbbd] bg-[#f7f2eb] p-4">
                        <p className="text-sm font-medium">Free launch gift</p>
                        <p className="mt-1 font-serif text-2xl">
                          {order.launch_gift}
                        </p>
                      </div>
                    ) : null}
                  </div>

                  <div>
                    <p className="text-sm font-medium">Update fulfilment</p>

                    <div className="mt-3 grid gap-2">
                      {FULFILMENT_STATUSES.map((status) => (
                        <button
                          key={status}
                          type="button"
                          disabled={updatingOrderId === order.id}
                          onClick={() =>
                            updateFulfilmentStatus(order.id, status)
                          }
                          className={`w-full rounded-full border px-4 py-2.5 text-sm font-medium transition disabled:opacity-50 ${
                            order.fulfilment_status === status
                              ? "border-[#243328] bg-[#243328] text-white"
                              : "border-[#d6cec2] bg-white text-[#243328] hover:bg-[#f7f2eb]"
                          }`}
                        >
                          Mark {status}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
