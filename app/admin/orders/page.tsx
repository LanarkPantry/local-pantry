import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "../../lib/supabase-admin";

export const dynamic = "force-dynamic";

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

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatMoney(value: number | null | undefined) {
  return `£${Number(value ?? 0).toFixed(2)}`;
}

async function updateFulfilmentStatus(formData: FormData) {
  "use server";

  const orderId = String(formData.get("orderId") ?? "");
  const status = String(formData.get("status") ?? "");
  const adminKey = String(formData.get("adminKey") ?? "");

  const expectedAdminKey =
    process.env.ADMIN_PASSWORD ?? process.env.ORDERS_ADMIN_PASSWORD ?? "";

  if (!expectedAdminKey || adminKey !== expectedAdminKey) {
    throw new Error("Unauthorised");
  }

  if (
    !orderId ||
    !["new", "packing", "packed", "delivered", "cancelled"].includes(status)
  ) {
    throw new Error("Invalid order update");
  }

  const { error } = await supabaseAdmin
    .from("orders")
    .update({ fulfilment_status: status })
    .eq("id", orderId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/orders");
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams?: Promise<{ key?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const adminKey = resolvedSearchParams?.key ?? "";

  const expectedAdminKey =
    process.env.ADMIN_PASSWORD ?? process.env.ORDERS_ADMIN_PASSWORD ?? "";

  if (!expectedAdminKey || adminKey !== expectedAdminKey) {
    return (
      <main className="min-h-screen bg-[#f4efe9] px-4 py-10 text-[#243328]">
        <div className="mx-auto max-w-xl rounded-[28px] border border-[#ddd4c8] bg-white/85 p-6">
          <h1 className="font-serif text-3xl">Admin Orders</h1>
          <p className="mt-3 text-sm leading-6 text-[#667164]">
            Add your admin key to the URL to view orders.
          </p>
          <p className="mt-4 rounded-2xl bg-[#f7f2eb] p-4 text-sm">
            /admin/orders?key=YOUR_ADMIN_PASSWORD
          </p>
        </div>
      </main>
    );
  }

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen bg-[#f4efe9] px-4 py-10 text-[#243328]">
        <div className="mx-auto max-w-3xl rounded-[28px] border border-red-200 bg-red-50 p-6 text-red-700">
          Could not load orders: {error.message}
        </div>
      </main>
    );
  }

  const orders = (data ?? []) as Order[];

  return (
    <main className="min-h-screen bg-[#f4efe9] px-4 py-8 text-[#243328] md:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 rounded-[28px] border border-[#ddd4c8] bg-white/85 p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
            The Local Pantry
          </p>
          <h1 className="mt-2 font-serif text-4xl">Orders</h1>
          <p className="mt-2 text-sm text-[#667164]">
            {orders.length} order{orders.length === 1 ? "" : "s"} found.
          </p>
        </header>

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
                      <span className="rounded-full bg-[#f7f2eb] px-3 py-1 text-xs">
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
                      {[
                        "new",
                        "packing",
                        "packed",
                        "delivered",
                        "cancelled",
                      ].map((status) => (
                        <form key={status} action={updateFulfilmentStatus}>
                          <input
                            type="hidden"
                            name="orderId"
                            value={order.id}
                          />
                          <input type="hidden" name="status" value={status} />
                          <input
                            type="hidden"
                            name="adminKey"
                            value={adminKey}
                          />

                          <button
                            type="submit"
                            className={`w-full rounded-full border px-4 py-2.5 text-sm font-medium transition ${
                              order.fulfilment_status === status
                                ? "border-[#243328] bg-[#243328] text-white"
                                : "border-[#d6cec2] bg-white text-[#243328] hover:bg-[#f7f2eb]"
                            }`}
                          >
                            Mark {status}
                          </button>
                        </form>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}

          {orders.length === 0 ? (
            <div className="rounded-[28px] border border-[#ddd4c8] bg-white/85 p-8 text-center">
              <h2 className="font-serif text-3xl">No orders yet</h2>
              <p className="mt-2 text-sm text-[#667164]">
                New orders will appear here after checkout starts.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
