"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "../cart-context";

export default function BasketPage() {
  const {
    cart,
    groupedCart,
    total,
    addToCart,
    removeOneFromCart,
    clearItemFromCart,
  } = useCart();

  const [isSubscription, setIsSubscription] = useState(true);
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  const totalItems = useMemo(() => cart.length, [cart]);

  const whatsappLink = `https://wa.me/447000000000?text=${encodeURIComponent(
    `Hi The Local Pantry, I'd like to place an order.

Order type: ${isSubscription ? "Weekly subscription" : "One-off order"}
Items: ${
      groupedCart.length > 0
        ? groupedCart
            .map(({ item, quantity }) => `${item.name} x${quantity}`)
            .join(", ")
        : "No items yet"
    }
Total: £${total.toFixed(2)}
${deliveryNotes ? `Delivery notes: ${deliveryNotes}` : ""}`,
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
    <main className="min-h-screen bg-[#f4efe9] px-5 py-8 text-[#243328] md:px-10 md:py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[#ddd4c8] pb-4">
          <Link
            href="/"
            className="text-sm tracking-[0.35em] text-[#60705f] transition hover:text-[#243328]"
          >
            THE LOCAL PANTRY
          </Link>

          <nav className="flex items-center gap-5 sm:gap-6">
            <Link
              href="/"
              className="text-sm text-[#4f5e52] transition hover:text-[#243328]"
            >
              Home
            </Link>

            <Link
              href="/shop"
              className="text-sm text-[#4f5e52] transition hover:text-[#243328]"
            >
              Shop
            </Link>

            <Link
              href="/recipes"
              className="text-sm text-[#4f5e52] transition hover:text-[#243328]"
            >
              Recipes
            </Link>

            <Link
              href="/basket"
              className="text-sm text-[#243328] underline underline-offset-4"
            >
              Basket{totalItems > 0 ? ` (${totalItems})` : ""}
            </Link>
          </nav>
        </div>

        <div className="mb-6">
          <Link
            href="/shop"
            className="text-sm text-[#5f675c] underline underline-offset-4 transition hover:text-[#243328]"
          >
            ← Continue shopping
          </Link>
        </div>

        <div className="mb-8 max-w-3xl">
          <p className="text-sm uppercase tracking-[0.2em] text-[#6b776c]">
            Your order
          </p>
          <h1 className="mt-3 font-serif text-4xl md:text-6xl">Basket</h1>
          <p className="mt-4 max-w-2xl text-[#667164]">
            Review your items, choose how you&apos;d like to order, and add any
            useful delivery notes before checkout.
          </p>
        </div>

        {cart.length === 0 ? (
          <section className="rounded-[28px] border border-[#ddd4c8] bg-[#f7f2eb] p-8 shadow-[0_12px_30px_rgba(36,51,40,0.06)] md:p-10">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#ddd4c8] bg-white text-2xl">
                🧺
              </div>

              <h2 className="mt-6 font-serif text-3xl md:text-4xl">
                Your basket is empty
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-[#667164]">
                Start with a produce box, then add pantry items to build a
                simple weekly order.
              </p>

              <div className="mt-8 grid gap-3 text-left sm:grid-cols-3">
                <div className="rounded-2xl border border-[#e5ddcf] bg-white p-4">
                  <p className="text-sm font-medium text-[#243328]">
                    Weekly produce boxes
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#667164]">
                    A straightforward base for the week.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#e5ddcf] bg-white p-4">
                  <p className="text-sm font-medium text-[#243328]">
                    Pantry essentials
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#667164]">
                    Jars, staples, and everyday add-ons.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#e5ddcf] bg-white p-4">
                  <p className="text-sm font-medium text-[#243328]">
                    Order your way
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#667164]">
                    Choose a one-off order or a weekly subscription.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/shop"
                  className="rounded-full bg-[#2f4635] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
                >
                  Browse the shop
                </Link>

                <Link
                  href="/"
                  className="rounded-full border border-[#d6cec2] bg-white px-6 py-3 text-sm font-medium text-[#243328] transition hover:bg-[#faf7f2]"
                >
                  Back to homepage
                </Link>
              </div>
            </div>
          </section>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
            <section className="rounded-[28px] border border-[#ddd4c8] bg-[#f7f2eb] p-5 shadow-[0_12px_30px_rgba(36,51,40,0.06)] md:p-8">
              <div className="rounded-2xl border border-[#e5ddcf] bg-white p-5 md:p-6">
                <div className="flex flex-col gap-2 border-b border-[#ece4d8] pb-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="font-serif text-3xl">Your basket</h2>
                    <p className="mt-1 text-sm text-[#697166]">
                      {totalItems} item{totalItems === 1 ? "" : "s"} in your
                      order
                    </p>
                  </div>

                  <p className="text-sm text-[#697166]">
                    Adjust quantities before checkout
                  </p>
                </div>

                <div className="mt-5 space-y-4">
                  {groupedCart.map(({ item, quantity }) => (
                    <div
                      key={item.name}
                      className="flex flex-col gap-4 border-b border-[#f0e8dc] pb-4 md:flex-row md:items-center md:justify-between"
                    >
                      <div className="min-w-0">
                        <div className="text-base font-medium text-[#243328] md:text-lg">
                          {item.name}
                        </div>
                        <div className="mt-1 text-sm text-[#6d756a]">
                          £{item.price.toFixed(2)} each
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                        <div className="inline-flex w-fit items-center rounded-full border border-[#ddd4c8] bg-[#fbfaf8]">
                          <button
                            onClick={() => removeOneFromCart(item.name)}
                            className="px-4 py-2 text-lg text-[#243328] transition hover:bg-[#f3eee7]"
                            aria-label={`Decrease quantity of ${item.name}`}
                          >
                            −
                          </button>

                          <span className="min-w-[2rem] text-center text-sm">
                            {quantity}
                          </span>

                          <button
                            onClick={() => addToCart(item)}
                            className="px-4 py-2 text-lg text-[#243328] transition hover:bg-[#f3eee7]"
                            aria-label={`Increase quantity of ${item.name}`}
                          >
                            +
                          </button>
                        </div>

                        <div className="min-w-[72px] text-sm font-medium text-[#243328] sm:text-right">
                          £{(item.price * quantity).toFixed(2)}
                        </div>

                        <button
                          onClick={() => clearItemFromCart(item.name)}
                          className="w-fit text-sm text-[#5f675c] underline underline-offset-4 transition hover:text-[#243328]"
                        >
                          Remove all
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-[#ece4d8] pt-5">
                  <span className="font-serif text-2xl">Total</span>
                  <span className="font-serif text-2xl">
                    £{total.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-[#ddd4c8] bg-[#efe8dd] p-5 md:p-6">
                <div className="max-w-2xl">
                  <p className="text-sm uppercase tracking-[0.18em] text-[#6b776c]">
                    Order type
                  </p>
                  <h2 className="mt-2 font-serif text-3xl">
                    Choose how you&apos;d like to order
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[#667164]">
                    Pick a one-off order if you&apos;re ordering just for this
                    week, or choose a weekly subscription if you&apos;d like a
                    regular delivery.
                  </p>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  <button
                    onClick={() => setIsSubscription(false)}
                    className={`rounded-2xl border p-5 text-left transition ${
                      !isSubscription
                        ? "border-[#314534] bg-white shadow-[0_10px_25px_rgba(36,51,40,0.06)]"
                        : "border-[#d6cec2] bg-[#f4efe9] hover:bg-[#f8f3ed]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-serif text-2xl text-[#243328]">
                          One-off order
                        </div>
                        <p className="mt-2 text-sm leading-6 text-[#667164]">
                          Suitable for occasional orders or trying the service
                          for the first time.
                        </p>
                      </div>

                      {!isSubscription && (
                        <span className="rounded-full bg-[#243328] px-3 py-1 text-xs text-white">
                          Selected
                        </span>
                      )}
                    </div>
                  </button>

                  <button
                    onClick={() => setIsSubscription(true)}
                    className={`rounded-2xl border p-5 text-left transition ${
                      isSubscription
                        ? "border-[#314534] bg-white shadow-[0_10px_25px_rgba(36,51,40,0.06)]"
                        : "border-[#d6cec2] bg-[#f4efe9] hover:bg-[#f8f3ed]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-serif text-2xl text-[#243328]">
                          Weekly subscription
                        </div>
                        <p className="mt-2 text-sm leading-6 text-[#667164]">
                          A recurring weekly order for households who want a
                          regular delivery rhythm.
                        </p>
                      </div>

                      {isSubscription && (
                        <span className="rounded-full bg-[#243328] px-3 py-1 text-xs text-white">
                          Selected
                        </span>
                      )}
                    </div>
                  </button>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-[#ddd4c8] bg-white p-5 md:p-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-[#6b776c]">
                    Delivery notes
                  </p>
                  <h2 className="mt-2 font-serif text-3xl">
                    Anything we should know?
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[#667164]">
                    Add any useful details for delivery, such as a safe place,
                    gate code, or timing preference.
                  </p>
                </div>

                <label htmlFor="delivery-notes" className="sr-only">
                  Delivery notes
                </label>
                <textarea
                  id="delivery-notes"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  rows={5}
                  placeholder="For example: Please leave by the side gate if no one is in."
                  className="mt-5 w-full rounded-2xl border border-[#ddd4c8] bg-[#fbfaf8] px-4 py-3 text-sm text-[#243328] outline-none transition placeholder:text-[#8a9388] focus:border-[#314534]"
                />

                <div className="mt-2 flex items-center justify-between gap-4">
                  <p className="text-xs text-[#7a8478]">
                    Keep notes brief and delivery-specific.
                  </p>
                  <p className="text-xs text-[#7a8478]">
                    {deliveryNotes.length}/200
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-[#ddd4c8] bg-[#fbfaf8] p-4">
                  <p className="text-sm font-medium text-[#243328]">
                    Simple checkout
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#667164]">
                    Review your order and continue when you&apos;re ready.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#ddd4c8] bg-[#fbfaf8] p-4">
                  <p className="text-sm font-medium text-[#243328]">
                    Flexible ordering
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#667164]">
                    Choose one-off or weekly, depending on what suits you.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#ddd4c8] bg-[#fbfaf8] p-4">
                  <p className="text-sm font-medium text-[#243328]">
                    Prefer WhatsApp?
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#667164]">
                    You can place the same order there instead.
                  </p>
                </div>
              </div>
            </section>

            <aside className="lg:sticky lg:top-8 lg:self-start">
              <div className="rounded-[28px] border border-[#ddd4c8] bg-[#f7f2eb] p-6 shadow-[0_12px_30px_rgba(36,51,40,0.06)] md:p-8">
                <p className="text-sm uppercase tracking-[0.18em] text-[#6b776c]">
                  Order summary
                </p>

                <div className="mt-4 rounded-2xl border border-[#e5ddcf] bg-white p-5">
                  <div className="flex items-center justify-between border-b border-[#f0e8dc] pb-4">
                    <span className="text-sm text-[#667164]">Items</span>
                    <span className="text-sm font-medium text-[#243328]">
                      {totalItems}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-[#f0e8dc] py-4">
                    <span className="text-sm text-[#667164]">Order type</span>
                    <span className="text-sm font-medium text-[#243328]">
                      {isSubscription ? "Weekly" : "One-off"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-[#f0e8dc] py-4">
                    <span className="text-sm text-[#667164]">Checkout</span>
                    <span className="text-sm font-medium text-[#243328]">
                      Secure
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <span className="font-serif text-2xl text-[#243328]">
                      Total
                    </span>
                    <span className="font-serif text-2xl text-[#243328]">
                      £{total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <button
                    onClick={startCheckout}
                    disabled={cart.length === 0 || isLoadingCheckout}
                    className="w-full rounded-2xl bg-gradient-to-r from-[#334e39] to-[#5a5326] px-6 py-4 text-sm font-medium text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoadingCheckout
                      ? "Opening checkout..."
                      : "Continue to checkout"}
                  </button>

                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full rounded-2xl border border-[#d6cec2] bg-white px-6 py-4 text-center text-sm font-medium text-[#243328] transition hover:bg-[#faf7f2]"
                  >
                    Order via WhatsApp instead
                  </a>
                </div>

                {checkoutError && (
                  <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {checkoutError}
                  </p>
                )}

                <div className="mt-6 rounded-2xl bg-[#efe8dd] p-4">
                  <p className="text-sm font-medium text-[#243328]">
                    Before you check out
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#5f675c]">
                    You&apos;ll be able to review the order details again before
                    payment is completed.
                  </p>
                </div>

                <div className="mt-3 rounded-2xl border border-[#ddd4c8] bg-white p-4">
                  <p className="text-sm font-medium text-[#243328]">
                    Need a different ordering route?
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#667164]">
                    WhatsApp is available if you&apos;d prefer to place the same
                    order there instead of using checkout.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
