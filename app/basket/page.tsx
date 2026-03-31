"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "../cart-context";

export default function BasketPage() {
  const { cart, groupedCart, total, removeOneFromCart } = useCart();

  const [isSubscription, setIsSubscription] = useState(true);
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  const whatsappLink = `https://wa.me/447000000000?text=${encodeURIComponent(
    "Hi The Local Pantry, I'd like to place an order.",
  )}`;

  const startCheckout = async () => {
    try {
      setCheckoutError("");
      setIsLoadingCheckout(true);

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart,
          isSubscription,
          deliveryNotes,
        }),
      });

      const text = await response.text();
      console.log("Basket page checkout response:", text);

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Checkout API returned HTML instead of JSON.");
      }

      if (!response.ok) {
        throw new Error(data.error || "Checkout failed.");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned.");
      }
    } catch (error) {
      setCheckoutError(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setIsLoadingCheckout(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4efe9] px-6 py-10 text-[#243328] md:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[#ddd4c8] pb-4">
          <Link
            href="/"
            className="text-sm tracking-[0.35em] text-[#60705f] hover:text-[#243328]"
          >
            THE LOCAL PANTRY
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm text-[#4f5e52] hover:text-[#243328]"
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="text-sm text-[#4f5e52] hover:text-[#243328]"
            >
              Shop
            </Link>
            <Link
              href="/basket"
              className="text-sm text-[#243328] underline underline-offset-4"
            >
              Basket{cart.length > 0 ? ` (${cart.length})` : ""}
            </Link>
          </nav>
        </div>

        <div className="mb-6">
          <Link
            href="/shop"
            className="text-sm text-[#5f675c] underline underline-offset-4 hover:text-[#243328]"
          >
            ← Continue shopping
          </Link>
        </div>

        <div className="rounded-[28px] border border-[#ddd4c8] bg-[#f7f2eb] p-6 shadow-[0_12px_30px_rgba(36,51,40,0.06)] md:p-8">
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-[#6b776c]">
              Your order
            </p>
            <h1 className="mt-3 font-serif text-4xl text-[#243328] md:text-6xl">
              Basket
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-[#667164]">
              Review your items, choose your order type, then continue to secure
              checkout.
            </p>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 md:flex-row">
            <button
              onClick={() => setIsSubscription(false)}
              className={`rounded-2xl border px-8 py-4 font-serif text-2xl ${
                !isSubscription
                  ? "border-[#314534] bg-white text-[#243328]"
                  : "border-[#d6cec2] bg-[#f4efe9] text-[#5f675c]"
              }`}
            >
              One-Off Order
            </button>

            <button
              onClick={() => setIsSubscription(true)}
              className={`rounded-2xl px-8 py-4 font-serif text-2xl ${
                isSubscription
                  ? "bg-gradient-to-r from-[#334e39] to-[#5a5326] text-white"
                  : "border border-[#d6cec2] bg-[#f4efe9] text-[#5f675c]"
              }`}
            >
              Weekly Subscription
            </button>
          </div>

          <div className="mt-8 rounded-2xl border border-[#e5ddcf] bg-white p-5">
            <h2 className="font-serif text-3xl text-[#243328]">
              Your Basket
              {cart.length > 0
                ? ` (${cart.length} item${cart.length === 1 ? "" : "s"})`
                : ""}
            </h2>

            {cart.length === 0 ? (
              <div className="mt-4">
                <p className="text-[#697166]">Your basket is empty for now.</p>

                <Link
                  href="/shop"
                  className="mt-4 inline-block rounded-full bg-[#2f4635] px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-[#243328]"
                >
                  Go to Shop
                </Link>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {groupedCart.map(({ item, quantity }) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between border-b border-[#eee6da] pb-4 text-lg text-[#314534]"
                  >
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-[#6d756a]">
                        £{item.price.toFixed(2)} × {quantity}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-medium">
                        £{(item.price * quantity).toFixed(2)}
                      </span>

                      <button
                        type="button"
                        onClick={() => removeOneFromCart(item.name)}
                        className="cursor-pointer text-sm underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-between pt-4 text-2xl font-medium text-[#243328]">
                  <span>Total</span>
                  <span>£{total.toFixed(2)}</span>
                </div>

                <p className="mt-2 text-sm text-[#6d756a]">
                  Delivery calculated at checkout.
                </p>
              </div>
            )}
          </div>

          <div className="mt-5 rounded-2xl border border-[#e5ddcf] bg-white p-5">
            <label className="block font-serif text-2xl text-[#243328]">
              Delivery instructions
            </label>
            <textarea
              value={deliveryNotes}
              onChange={(e) => setDeliveryNotes(e.target.value)}
              placeholder="Leave in porch, by side gate, with neighbour at number 12…"
              className="mt-3 min-h-[120px] w-full rounded-2xl border border-[#ddd4c8] bg-[#fbfaf8] p-4 text-lg outline-none placeholder:text-[#9aa099]"
            />
          </div>

          <div className="mt-5 flex flex-col gap-4 md:flex-row">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="flex-1 rounded-2xl border border-[#d6cec2] bg-white px-6 py-4 text-center font-serif text-2xl text-[#243328]"
            >
              Order via WhatsApp
            </a>

            <button
              onClick={startCheckout}
              disabled={cart.length === 0 || isLoadingCheckout}
              className="flex-1 rounded-2xl bg-gradient-to-r from-[#334e39] to-[#5a5326] px-6 py-4 font-serif text-2xl text-white shadow-sm transition hover:scale-[1.01] disabled:opacity-50 disabled:hover:scale-100"
            >
              {isLoadingCheckout
                ? "Opening Stripe..."
                : isSubscription
                  ? "Start Weekly Subscription"
                  : "Pay for One-Off Order"}
            </button>
          </div>

          {checkoutError && (
            <p className="mt-4 text-center text-sm text-red-700">
              {checkoutError}
            </p>
          )}

          <p className="mt-5 text-center text-sm text-[#6d756a]">
            Secure checkout with Stripe.
          </p>
        </div>
      </div>
    </main>
  );
}
