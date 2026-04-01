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

  const renderGroupedItems = (
    items: typeof groupedCart,
    emptyText: string,
    helperText: string,
  ) => {
    if (items.length === 0) {
      return <p className="text-sm leading-6 text-[#667164]">{emptyText}</p>;
    }

    return (
      <div className="space-y-4">
        {items.map(({ item, quantity }) => (
          <div
            key={item.name}
            className="flex flex-col gap-4 border-b border-[#f0e8dc] pb-4 md:flex-row md:items-center md:justify-between"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <div className="text-base font-medium text-[#243328] md:text-lg">
                  {item.name}
                </div>

                <span className="rounded-full border border-[#ddd4c8] bg-[#fbfaf8] px-3 py-1 text-xs text-[#5f675c]">
                  {item.checkoutType === "subscription"
                    ? "Subscription-friendly"
                    : "One-off add-on"}
                </span>
              </div>

              <div className="mt-1 text-sm text-[#6d756a]">
                £{item.price.toFixed(2)} each
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <div className="inline-flex w-fit items-center rounded-full border border-[#ddd4c8] bg-[#fbfaf8]">
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

              <div className="min-w-[72px] text-sm font-medium text-[#243328] sm:text-right">
                £{(item.price * quantity).toFixed(2)}
              </div>

              <button
                type="button"
                onClick={() => clearItemFromCart(item.name)}
                className="w-fit text-sm text-[#5f675c] underline underline-offset-4 transition hover:text-[#243328]"
              >
                Remove all
              </button>
            </div>
          </div>
        ))}

        <p className="text-sm leading-6 text-[#667164]">{helperText}</p>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-[#f4efe9] px-5 py-8 text-[#243328] md:px-10 md:py-10">
      <div aria-live="polite" className="sr-only">
        {totalItems} item{totalItems === 1 ? "" : "s"} in basket. Current total
        £{orderTotal.toFixed(2)}.
      </div>

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
                Start with a produce box, then add pantry items and useful
                extras to build your order.
              </p>

              <div className="mt-8 grid gap-3 text-left sm:grid-cols-3">
                <div className="rounded-2xl border border-[#e5ddcf] bg-white p-4">
                  <p className="text-sm font-medium text-[#243328]">
                    Produce boxes
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#667164]">
                    The strongest fit for weekly subscription.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#e5ddcf] bg-white p-4">
                  <p className="text-sm font-medium text-[#243328]">
                    One-off add-ons
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#667164]">
                    Pantry jars, cupboard goods, and extras stay flexible.
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

                <div className="mt-6 rounded-2xl border border-[#ddd4c8] bg-[#fbfaf8] p-4">
                  <p className="text-sm font-medium text-[#243328]">
                    Subscription-friendly items
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#667164]">
                    These are the items that suit weekly recurring delivery
                    best.
                  </p>

                  <div className="mt-4">
                    {renderGroupedItems(
                      groupedSubscriptionItems,
                      "You have no subscription-friendly items in your basket yet.",
                      "These items can form the weekly part of your order.",
                    )}
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-[#ddd4c8] bg-[#fbfaf8] p-4">
                  <p className="text-sm font-medium text-[#243328]">
                    One-off add-ons
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#667164]">
                    These are the flexible extras you can add as needed.
                  </p>

                  <div className="mt-4">
                    {renderGroupedItems(
                      groupedOneOffItems,
                      "You have no one-off add-ons in your basket yet.",
                      "These can stay as one-off extras, even if you choose subscription.",
                    )}
                  </div>
                </div>

                <div className="mt-6 space-y-3 border-t border-[#ece4d8] pt-5">
                  <div className="flex items-center justify-between text-sm text-[#667164]">
                    <span>Subtotal</span>
                    <span>£{subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-[#667164]">
                    <span>Delivery</span>
                    <span>
                      {delivery === 0 ? "Free" : `£${delivery.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#ece4d8] pt-3">
                    <span className="font-serif text-2xl">Total today</span>
                    <span className="font-serif text-2xl">
                      £{orderTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {remainingForFreeDelivery > 0 && (
                  <div className="mt-5 rounded-2xl border border-[#ddd4c8] bg-[#f8f4ee] p-4">
                    <p className="text-sm font-medium text-[#243328]">
                      Add £{remainingForFreeDelivery.toFixed(2)} more for free
                      delivery
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#667164]">
                      A pantry jar, cupboard staple, or a useful extra could get
                      you there.
                    </p>
                  </div>
                )}
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
                    Weekly subscription works best when you have a produce box
                    in your basket. One-off order is there if you&apos;re
                    ordering just for this week.
                  </p>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  <button
                    type="button"
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
                          Everything is treated as a one-time order for this
                          week.
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
                    type="button"
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
                          Subscription-friendly items recur weekly. One-off
                          add-ons stay flexible.
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

                {isSubscription && subscriptionItemCount === 0 && (
                  <div className="mt-4 rounded-2xl border border-[#e4d8cb] bg-[#fbf6f0] p-4">
                    <p className="text-sm font-medium text-[#243328]">
                      No subscription-friendly items yet
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#667164]">
                      Add a produce box if you want the weekly subscription
                      option to make the most sense.
                    </p>
                  </div>
                )}

                {isSubscription && subscriptionItemCount > 0 && (
                  <div className="mt-4 rounded-2xl border border-[#ddd4c8] bg-white p-4">
                    <p className="text-sm font-medium text-[#243328]">
                      What happens with this order
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#667164]">
                      Your subscription-friendly items are intended to form the
                      weekly part of your order. Your pantry extras and add-ons
                      can stay more flexible.
                    </p>
                  </div>
                )}
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
                  onChange={(e) =>
                    setDeliveryNotes(e.target.value.slice(0, 200))
                  }
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
                    Boxes work well weekly
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#667164]">
                    Produce boxes are the strongest fit for subscription.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#ddd4c8] bg-[#fbfaf8] p-4">
                  <p className="text-sm font-medium text-[#243328]">
                    Add-ons stay flexible
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#667164]">
                    Pantry and cupboard extras can still be treated as one-offs.
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
                    <span className="text-sm text-[#667164]">
                      Subscription-friendly
                    </span>
                    <span className="text-sm font-medium text-[#243328]">
                      {subscriptionItemCount}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-[#f0e8dc] py-4">
                    <span className="text-sm text-[#667164]">
                      One-off add-ons
                    </span>
                    <span className="text-sm font-medium text-[#243328]">
                      {oneOffItemCount}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-[#f0e8dc] py-4">
                    <span className="text-sm text-[#667164]">Order type</span>
                    <span className="text-sm font-medium text-[#243328]">
                      {isSubscription ? "Weekly subscription" : "One-off"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-[#f0e8dc] py-4">
                    <span className="text-sm text-[#667164]">
                      Subscription items
                    </span>
                    <span className="text-sm font-medium text-[#243328]">
                      £{subscriptionSubtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-[#f0e8dc] py-4">
                    <span className="text-sm text-[#667164]">
                      One-off items
                    </span>
                    <span className="text-sm font-medium text-[#243328]">
                      £{oneOffSubtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-[#f0e8dc] py-4">
                    <span className="text-sm text-[#667164]">Delivery</span>
                    <span className="text-sm font-medium text-[#243328]">
                      {delivery === 0 ? "Free" : `£${delivery.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <span className="font-serif text-2xl text-[#243328]">
                      Total today
                    </span>
                    <span className="font-serif text-2xl text-[#243328]">
                      £{orderTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-[#ddd4c8] bg-[#fbfaf8] p-4">
                  <p className="text-sm font-medium text-[#243328]">
                    Delivery area
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#667164]">
                    Local delivery is £2.50 for orders below £30, and free for
                    orders of £30 or more.
                  </p>
                </div>

                <div className="mt-4 rounded-2xl border border-[#ddd4c8] bg-white p-4">
                  <p className="text-sm font-medium text-[#243328]">
                    Today&apos;s checkout
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#667164]">
                    Today you&apos;re paying £{orderTotal.toFixed(2)}.
                    {isSubscription
                      ? " The weekly part of the order should come from your subscription-friendly items."
                      : " Everything is being treated as a one-off order."}
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
                    Order directly via WhatsApp
                  </a>

                  <p className="text-center text-xs text-[#7a8478]">
                    We&apos;ll confirm your order and delivery details with you
                    directly.
                  </p>
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
                    Your basket summary
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#667164]">
                    {basketSummaryText}
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
