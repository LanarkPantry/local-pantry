"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "../cart-context";

const DELIVERY_FEE = 2.5;
const FREE_DELIVERY_THRESHOLD = 30;

export default function BasketPage() {
  const {
    cart,
    groupedCart,
    total,
    addToCart,
    removeOneFromCart,
    clearItemFromCart,
    subscriptionItems,
    oneOffItems,
  } = useCart();

  const [isSubscription, setIsSubscription] = useState(true);
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  const totalItems = cart.length;

  const subscriptionSubtotal = useMemo(() => {
    return subscriptionItems.reduce((sum, item) => sum + item.price, 0);
  }, [subscriptionItems]);

  const oneOffSubtotal = useMemo(() => {
    return oneOffItems.reduce((sum, item) => sum + item.price, 0);
  }, [oneOffItems]);

  const subtotal = total;
  const delivery =
    subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0 ? 0 : DELIVERY_FEE;
  const orderTotal = subtotal + delivery;
  const remainingForFreeDelivery =
    subtotal > 0 && subtotal < FREE_DELIVERY_THRESHOLD
      ? FREE_DELIVERY_THRESHOLD - subtotal
      : 0;

  const subscriptionItemCount = subscriptionItems.length;
  const oneOffItemCount = oneOffItems.length;

  const groupedSubscriptionItems = useMemo(() => {
    return groupedCart.filter(
      ({ item }) => item.checkoutType === "subscription",
    );
  }, [groupedCart]);

  const groupedOneOffItems = useMemo(() => {
    return groupedCart.filter(
      ({ item }) => item.checkoutType !== "subscription",
    );
  }, [groupedCart]);

  const basketSummaryText = useMemo(() => {
    if (groupedCart.length === 0) return "No items yet";

    return groupedCart
      .map(({ item, quantity }) => `${item.name} x${quantity}`)
      .join(", ");
  }, [groupedCart]);

  const whatsappOrderTypeText = isSubscription
    ? "Weekly subscription with one-off add-ons"
    : "One-off order";

  const whatsappLink = `https://wa.me/447576613770?text=${encodeURIComponent(
    `Hi The Local Pantry,

I'd like to place an order:

${basketSummaryText}

Order type: ${whatsappOrderTypeText}

Subscription-friendly items: ${subscriptionItemCount}
One-off items: ${oneOffItemCount}

Subtotal: £${subtotal.toFixed(2)}
Delivery: ${delivery === 0 ? "Free" : `£${delivery.toFixed(2)}`}
Total today: £${orderTotal.toFixed(2)}
${deliveryNotes ? `Delivery notes: ${deliveryNotes}` : ""}

Thanks!`,
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
          subtotal,
          delivery,
          total: orderTotal,
          subscriptionItems,
          oneOffItems,
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderGroupedItems = (
    items: typeof groupedCart,
    emptyText: string,
    sectionType: "subscription" | "oneoff",
  ) => {
    if (items.length === 0) {
      return <p className="text-sm leading-6 text-[#667164]">{emptyText}</p>;
    }

    return (
      <div className="space-y-4">
        {items.map(({ item, quantity }) => (
          <div
            key={item.name}
            className="rounded-2xl border border-[#e7dfd3] bg-white p-4"
          >
            <div className="flex min-w-0 flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <h3 className="min-w-0 break-words text-base font-medium text-[#243328] md:text-lg">
                    {item.name}
                  </h3>

                  <span className="max-w-full rounded-full border border-[#ddd4c8] bg-[#fbfaf8] px-3 py-1 text-[11px] leading-5 text-[#5f675c]">
                    {sectionType === "subscription"
                      ? "Weekly item"
                      : "One-off add-on"}
                  </span>
                </div>

                <p className="mt-1 text-sm text-[#6d756a]">
                  £{item.price.toFixed(2)} each
                </p>
              </div>

              <div className="flex min-w-0 flex-wrap items-center gap-3">
                <div className="inline-flex shrink-0 items-center rounded-full border border-[#ddd4c8] bg-[#fbfaf8]">
                  <button
                    type="button"
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
                    type="button"
                    onClick={() => addToCart(item)}
                    className="px-4 py-2 text-lg text-[#243328] transition hover:bg-[#f3eee7]"
                    aria-label={`Increase quantity of ${item.name}`}
                  >
                    +
                  </button>
                </div>

                <div className="min-w-[64px] shrink-0 text-sm font-medium text-[#243328]">
                  £{(item.price * quantity).toFixed(2)}
                </div>

                <button
                  type="button"
                  onClick={() => clearItemFromCart(item.name)}
                  className="text-sm text-[#5f675c] underline underline-offset-4 transition hover:text-[#243328]"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const summaryRow = (label: string, value: string, strong?: boolean) => (
    <div
      className={`flex items-start justify-between gap-4 ${
        strong ? "pt-3" : "border-b border-[#f0e8dc] py-4"
      }`}
    >
      <span
        className={`min-w-0 text-sm ${
          strong ? "font-serif text-2xl text-[#243328]" : "text-[#667164]"
        }`}
      >
        {label}
      </span>
      <span
        className={`shrink-0 text-right ${
          strong
            ? "font-serif text-2xl text-[#243328]"
            : "text-sm font-medium text-[#243328]"
        }`}
      >
        {value}
      </span>
    </div>
  );

  return (
    <main className="min-h-screen overflow-x-clip bg-[#f4efe9] px-4 py-6 text-[#243328] sm:px-5 md:px-8 md:py-10">
      <div aria-live="polite" className="sr-only">
        {totalItems} item{totalItems === 1 ? "" : "s"} in basket. Current total
        £{orderTotal.toFixed(2)}.
      </div>

      <div className="mx-auto w-full max-w-6xl pb-24 md:pb-10">
        <header className="mb-6 border-b border-[#ddd4c8] pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/"
              className="text-sm tracking-[0.28em] text-[#60705f] transition hover:text-[#243328]"
            >
              THE LOCAL PANTRY
            </Link>

            <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
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
        </header>

        <div className="mb-5">
          <Link
            href="/shop"
            className="text-sm text-[#5f675c] underline underline-offset-4 transition hover:text-[#243328]"
          >
            ← Continue shopping
          </Link>
        </div>

        <div className="mb-6 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.2em] text-[#6b776c]">
            Your order
          </p>
          <h1 className="mt-2 font-serif text-4xl md:text-6xl">Basket</h1>
          <p className="mt-3 text-sm leading-6 text-[#667164] md:text-base">
            Review your items, choose one-off or weekly, and add any delivery
            notes before checkout.
          </p>
        </div>

        {cart.length === 0 ? (
          <section className="rounded-[28px] border border-[#ddd4c8] bg-[#f7f2eb] p-6 shadow-[0_12px_30px_rgba(36,51,40,0.06)] md:p-10">
            <div className="mx-auto max-w-xl text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#ddd4c8] bg-white text-2xl">
                🧺
              </div>

              <h2 className="mt-5 font-serif text-3xl md:text-4xl">
                Your basket is empty
              </h2>

              <p className="mx-auto mt-3 text-sm leading-6 text-[#667164] md:text-base">
                Start with a produce box, then add pantry items or extras.
              </p>

              <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/shop"
                  className="w-full rounded-full bg-[#2f4635] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90 sm:w-auto"
                >
                  Browse the shop
                </Link>

                <Link
                  href="/recipes"
                  className="w-full rounded-full border border-[#d6cec2] bg-white px-6 py-3 text-sm font-medium text-[#243328] transition hover:bg-[#faf7f2] sm:w-auto"
                >
                  View recipes
                </Link>
              </div>
            </div>
          </section>
        ) : (
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.9fr)]">
            <section className="min-w-0 space-y-6">
              <div className="rounded-[28px] border border-[#ddd4c8] bg-[#f7f2eb] p-4 shadow-[0_12px_30px_rgba(36,51,40,0.06)] md:p-6">
                <div className="rounded-2xl border border-[#e5ddcf] bg-white p-4 md:p-6">
                  <div className="flex flex-col gap-2 border-b border-[#ece4d8] pb-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="min-w-0">
                      <h2 className="font-serif text-3xl">Your basket</h2>
                      <p className="mt-1 text-sm text-[#697166]">
                        {totalItems} item{totalItems === 1 ? "" : "s"} in your
                        order
                      </p>
                    </div>

                    <p className="text-sm text-[#697166]">
                      Adjust quantities here
                    </p>
                  </div>

                  <div className="mt-5 space-y-5">
                    <div>
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-medium text-[#243328]">
                            Weekly items
                          </h3>
                          <p className="mt-1 text-sm text-[#667164]">
                            Best suited to recurring delivery.
                          </p>
                        </div>
                        <span className="rounded-full border border-[#ddd4c8] bg-[#fbfaf8] px-3 py-1 text-xs text-[#5f675c]">
                          {subscriptionItemCount}
                        </span>
                      </div>

                      {renderGroupedItems(
                        groupedSubscriptionItems,
                        "You have no weekly items in your basket yet.",
                        "subscription",
                      )}
                    </div>

                    <div>
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-medium text-[#243328]">
                            One-off add-ons
                          </h3>
                          <p className="mt-1 text-sm text-[#667164]">
                            Flexible extras for this order.
                          </p>
                        </div>
                        <span className="rounded-full border border-[#ddd4c8] bg-[#fbfaf8] px-3 py-1 text-xs text-[#5f675c]">
                          {oneOffItemCount}
                        </span>
                      </div>

                      {renderGroupedItems(
                        groupedOneOffItems,
                        "You have no one-off add-ons in your basket yet.",
                        "oneoff",
                      )}
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl border border-[#ece4d8] bg-[#fbfaf8] p-4">
                    <div className="flex items-center justify-between text-sm text-[#667164]">
                      <span>Subtotal</span>
                      <span>£{subtotal.toFixed(2)}</span>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-sm text-[#667164]">
                      <span>Delivery</span>
                      <span>
                        {delivery === 0 ? "Free" : `£${delivery.toFixed(2)}`}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-[#ece4d8] pt-3">
                      <span className="font-serif text-2xl">Total today</span>
                      <span className="font-serif text-2xl">
                        £{orderTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {remainingForFreeDelivery > 0 && (
                    <div className="mt-4 rounded-2xl border border-[#ddd4c8] bg-[#f8f4ee] p-4">
                      <p className="text-sm font-medium text-[#243328]">
                        Add £{remainingForFreeDelivery.toFixed(2)} more for free
                        delivery
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-[28px] border border-[#ddd4c8] bg-[#f7f2eb] p-4 shadow-[0_12px_30px_rgba(36,51,40,0.06)] md:p-6">
                <div className="rounded-2xl border border-[#e5ddcf] bg-white p-4 md:p-6">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#6b776c]">
                    Order type
                  </p>
                  <h2 className="mt-2 font-serif text-3xl">
                    How should this order work?
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-[#667164]">
                    Choose one-off for this week, or weekly if your produce box
                    should repeat.
                  </p>

                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setIsSubscription(false)}
                      className={`rounded-2xl border p-4 text-left transition ${
                        !isSubscription
                          ? "border-[#314534] bg-[#fbfaf8] shadow-[0_10px_25px_rgba(36,51,40,0.06)]"
                          : "border-[#d6cec2] bg-white hover:bg-[#faf7f2]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-serif text-2xl text-[#243328]">
                            One-off
                          </div>
                          <p className="mt-2 text-sm leading-6 text-[#667164]">
                            Everything is for this week only.
                          </p>
                        </div>

                        {!isSubscription && (
                          <span className="shrink-0 rounded-full bg-[#243328] px-3 py-1 text-xs text-white">
                            Selected
                          </span>
                        )}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsSubscription(true)}
                      className={`rounded-2xl border p-4 text-left transition ${
                        isSubscription
                          ? "border-[#314534] bg-[#fbfaf8] shadow-[0_10px_25px_rgba(36,51,40,0.06)]"
                          : "border-[#d6cec2] bg-white hover:bg-[#faf7f2]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-serif text-2xl text-[#243328]">
                            Weekly
                          </div>
                          <p className="mt-2 text-sm leading-6 text-[#667164]">
                            Your produce box repeats. Add-ons stay one-off.
                          </p>
                        </div>

                        {isSubscription && (
                          <span className="shrink-0 rounded-full bg-[#243328] px-3 py-1 text-xs text-white">
                            Selected
                          </span>
                        )}
                      </div>
                    </button>
                  </div>

                  {isSubscription && subscriptionItemCount === 0 && (
                    <div className="mt-4 rounded-2xl border border-[#e4d8cb] bg-[#fbf6f0] p-4">
                      <p className="text-sm font-medium text-[#243328]">
                        No weekly item yet
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[#667164]">
                        Add a produce box if you want the weekly option to make
                        sense.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-[28px] border border-[#ddd4c8] bg-[#f7f2eb] p-4 shadow-[0_12px_30px_rgba(36,51,40,0.06)] md:p-6">
                <div className="rounded-2xl border border-[#e5ddcf] bg-white p-4 md:p-6">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#6b776c]">
                    Delivery notes
                  </p>
                  <h2 className="mt-2 font-serif text-3xl">
                    Anything we should know?
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-[#667164]">
                    Add any useful delivery details, like a safe place or gate
                    code.
                  </p>

                  <label htmlFor="delivery-notes" className="sr-only">
                    Delivery notes
                  </label>

                  <textarea
                    id="delivery-notes"
                    value={deliveryNotes}
                    onChange={(e) =>
                      setDeliveryNotes(e.target.value.slice(0, 200))
                    }
                    rows={5}
                    placeholder="For example: Please leave by the side gate if no one is in."
                    className="mt-4 w-full rounded-2xl border border-[#ddd4c8] bg-[#fbfaf8] px-4 py-3 text-sm text-[#243328] outline-none transition placeholder:text-[#8a9388] focus:border-[#314534]"
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
              </div>
            </section>

            <aside className="min-w-0 lg:sticky lg:top-8">
              <div className="rounded-[28px] border border-[#ddd4c8] bg-[#f7f2eb] p-4 shadow-[0_12px_30px_rgba(36,51,40,0.06)] md:p-6">
                <p className="text-xs uppercase tracking-[0.18em] text-[#6b776c]">
                  Order summary
                </p>

                <div className="mt-4 rounded-2xl border border-[#e5ddcf] bg-white p-4 md:p-5">
                  {summaryRow("Items", `${totalItems}`)}
                  {summaryRow("Weekly items", `${subscriptionItemCount}`)}
                  {summaryRow("One-off add-ons", `${oneOffItemCount}`)}
                  {summaryRow(
                    "Order type",
                    isSubscription ? "Weekly" : "One-off",
                  )}
                  {summaryRow(
                    "Weekly items total",
                    `£${subscriptionSubtotal.toFixed(2)}`,
                  )}
                  {summaryRow(
                    "One-off items total",
                    `£${oneOffSubtotal.toFixed(2)}`,
                  )}
                  {summaryRow(
                    "Delivery",
                    delivery === 0 ? "Free" : `£${delivery.toFixed(2)}`,
                  )}
                  {summaryRow("Total today", `£${orderTotal.toFixed(2)}`, true)}
                </div>

                <div className="mt-4 rounded-2xl border border-[#ddd4c8] bg-[#fbfaf8] p-4">
                  <p className="text-sm font-medium text-[#243328]">Delivery</p>
                  <p className="mt-2 text-sm leading-6 text-[#667164]">
                    £2.50 under £30, free at £30 and above.
                  </p>
                </div>

                <div className="mt-5 space-y-3">
                  <button
                    type="button"
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
                    Order via WhatsApp
                  </a>

                  <p className="text-center text-xs leading-5 text-[#7a8478]">
                    We&apos;ll confirm delivery details with you directly.
                  </p>
                </div>

                {checkoutError && (
                  <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {checkoutError}
                  </p>
                )}

                <div className="mt-5 rounded-2xl border border-[#ddd4c8] bg-white p-4">
                  <p className="text-sm font-medium text-[#243328]">
                    Basket summary
                  </p>
                  <p className="mt-2 break-words text-sm leading-6 text-[#667164]">
                    {basketSummaryText}
                  </p>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>

      {totalItems > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#ddd4c8] bg-[#f7f2eb]/95 px-3 py-2 backdrop-blur md:hidden">
          <div className="mx-auto flex w-full max-w-6xl items-center gap-2">
            <button
              type="button"
              onClick={scrollToTop}
              className="shrink-0 rounded-full border border-[#d6cec2] bg-white px-3 py-2 text-xs font-medium text-[#243328] transition hover:bg-[#faf7f2]"
            >
              Top
            </button>

            <Link
              href="/basket"
              className="min-w-0 flex-1 truncate rounded-full bg-[#2f4635] px-4 py-2 text-center text-sm font-medium text-white transition hover:opacity-90"
            >
              {totalItems} item{totalItems === 1 ? "" : "s"} · £
              {total.toFixed(2)}
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
