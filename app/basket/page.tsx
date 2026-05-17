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
  const [subscriptionFrequency, setSubscriptionFrequency] = useState<
    "weekly" | "fortnightly"
  >("weekly");
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

  const orderTypeLabel = isSubscription
    ? subscriptionFrequency === "weekly"
      ? "Weekly box delivery"
      : "Every two weeks"
    : "One-off order";

  const whatsappOrderTypeText = isSubscription
    ? subscriptionFrequency === "weekly"
      ? "Weekly box delivery with one-off add-ons"
      : "Box delivery every two weeks with one-off add-ons"
    : "One-off order";

  const whatsappLink = `https://wa.me/447576613770?text=${encodeURIComponent(
    `Hi The Local Pantry,

I'd like to place an order:

${basketSummaryText}

Order type: ${whatsappOrderTypeText}

Boxes that can repeat: ${subscriptionItemCount}
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
          subscriptionFrequency,
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
            className="rounded-2xl border border-[#e7dfd3] bg-[rgba(255,255,255,0.82)] p-4"
          >
            <div className="flex min-w-0 flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <h3 className="min-w-0 break-words text-base font-medium text-[#243328] md:text-lg">
                    {item.name}
                  </h3>

                  <span className="max-w-full rounded-full border border-[#ddd4c8] bg-[rgba(251,250,248,0.86)] px-3 py-1 text-[11px] leading-5 text-[#5f675c]">
                    {sectionType === "subscription"
                      ? "Can repeat"
                      : "One-off add-on"}
                  </span>
                </div>

                <p className="mt-1 text-sm text-[#6d756a]">
                  £{item.price.toFixed(2)} each
                </p>
              </div>

              <div className="flex min-w-0 flex-wrap items-center gap-3">
                <div className="inline-flex shrink-0 items-center rounded-full border border-[#ddd4c8] bg-[rgba(251,250,248,0.86)]">
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
    <main className="min-h-screen overflow-x-clip px-4 py-6 text-[#243328] sm:px-5 md:px-8 md:py-10">
      <div aria-live="polite" className="sr-only">
        {totalItems} item{totalItems === 1 ? "" : "s"} in basket. Current total
        £{orderTotal.toFixed(2)}.
      </div>

      <div className="mx-auto w-full max-w-6xl pb-24 md:pb-10">
        <div className="mb-5 block md:hidden">
          <div className="overflow-hidden rounded-[24px] border border-[#ddd4c8] shadow-[0_10px_24px_rgba(36,51,40,0.06)]">
            <img
              src="/images/home/local-delivery.jpg"
              alt="Basket"
              className="h-44 w-full object-cover"
            />
          </div>
        </div>

        <div className="mb-5 block md:hidden">
          <div className="overflow-hidden rounded-[24px] border border-[#ddd4c8] shadow-[0_10px_24px_rgba(36,51,40,0.06)]">
            <img
              src="/images/home/local-delivery.jpg"
              alt="Basket"
              className="h-44 w-full object-cover"
            />
          </div>
        </div>
        <header className="mb-6 border-b border-[rgba(221,212,200,0.9)] pb-4">
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
                href="/planner"
                className="text-sm text-[#4f5e52] transition hover:text-[#243328]"
              >
                Planner
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

        <div className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-2">
          <Link
            href="/shop"
            className="text-sm text-[#5f675c] underline underline-offset-4 transition hover:text-[#243328]"
          >
            ← Continue shopping
          </Link>

          <Link
            href="/planner"
            className="text-sm text-[#5f675c] underline underline-offset-4 transition hover:text-[#243328]"
          >
            Continue planning
          </Link>
        </div>

        <section className="mb-6 rounded-[28px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.76)] p-5 shadow-[0_12px_30px_rgba(36,51,40,0.05)] backdrop-blur-md md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
                Local delivery across ML11
              </p>
              <h1 className="mt-2 font-serif text-[2.2rem] leading-tight md:text-[3.3rem]">
                Review your basket for the week ahead
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#667164] md:text-base">
                Boxes can be one-off, weekly, or every two weeks. Everything
                else stays easy to add whenever you like.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-full border border-[#ddd4c8] bg-[rgba(255,255,255,0.82)] px-4 py-2 text-sm text-[#5f675c]">
                {totalItems} item{totalItems === 1 ? "" : "s"} · £
                {orderTotal.toFixed(2)} today
              </div>

              <div className="rounded-full border border-[#ddd4c8] bg-[rgba(255,255,255,0.82)] px-4 py-2 text-sm text-[#5f675c]">
                {delivery === 0
                  ? "Free delivery"
                  : `£${DELIVERY_FEE.toFixed(2)} delivery under £${FREE_DELIVERY_THRESHOLD}`}
              </div>
            </div>
          </div>
        </section>

        {cart.length === 0 ? (
          <section className="rounded-[28px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.76)] p-6 shadow-[0_12px_30px_rgba(36,51,40,0.06)] backdrop-blur-md md:p-10">
            <div className="mx-auto max-w-xl text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#ddd4c8] bg-[rgba(255,255,255,0.84)] text-2xl">
                🧺
              </div>

              <h2 className="mt-5 font-serif text-3xl md:text-4xl">
                Your basket is empty
              </h2>

              <p className="mx-auto mt-3 text-sm leading-6 text-[#667164] md:text-base">
                Start with a produce box, then add pantry items or extras. You
                can plan meals from anywhere, and order locally across ML11.
              </p>

              <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/shop"
                  className="w-full rounded-full bg-[#2f4635] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90 sm:w-auto"
                >
                  Browse the shop
                </Link>

                <Link
                  href="/planner"
                  className="w-full rounded-full border border-[#d6cec2] bg-[rgba(255,255,255,0.86)] px-6 py-3 text-sm font-medium text-[#243328] transition hover:bg-white sm:w-auto"
                >
                  Open planner
                </Link>
              </div>
            </div>
          </section>
        ) : (
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.9fr)]">
            <section className="min-w-0 space-y-6">
              <div className="rounded-[28px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.76)] p-4 shadow-[0_12px_30px_rgba(36,51,40,0.06)] backdrop-blur-md md:p-6">
                <div className="rounded-2xl border border-[#e5ddcf] bg-[rgba(255,255,255,0.78)] p-4 md:p-6">
                  <div className="rounded-2xl border border-[#ddd4c8] bg-[rgba(251,250,248,0.82)] p-4">
                    <p className="text-sm font-medium text-[#243328]">
                      Boxes are the only items that can repeat
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#667164]">
                      You can keep the whole order one-off, or choose to repeat
                      just your box. Everything else stays one-off and easy to
                      add any time.
                    </p>
                  </div>

                  <div className="mt-5 flex flex-col gap-2 border-b border-[#ece4d8] pb-4 sm:flex-row sm:items-end sm:justify-between">
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
                            Boxes that can repeat
                          </h3>
                          <p className="mt-1 text-sm text-[#667164]">
                            These only repeat if you choose weekly or every two
                            weeks below.
                          </p>
                        </div>
                        <span className="rounded-full border border-[#ddd4c8] bg-[rgba(251,250,248,0.86)] px-3 py-1 text-xs text-[#5f675c]">
                          {subscriptionItemCount}
                        </span>
                      </div>

                      {renderGroupedItems(
                        groupedSubscriptionItems,
                        "You have no repeatable box items in your basket yet.",
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
                            These stay one-off, whatever you choose for your
                            box.
                          </p>
                        </div>
                        <span className="rounded-full border border-[#ddd4c8] bg-[rgba(251,250,248,0.86)] px-3 py-1 text-xs text-[#5f675c]">
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

                  <div className="mt-6 rounded-2xl border border-[#ece4d8] bg-[rgba(251,250,248,0.82)] p-4">
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
                    <div className="mt-4 rounded-2xl border border-[#ddd4c8] bg-[rgba(248,244,238,0.8)] p-4">
                      <p className="text-sm font-medium text-[#243328]">
                        Add £{remainingForFreeDelivery.toFixed(2)} more for free
                        delivery
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-[28px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.76)] p-4 shadow-[0_12px_30px_rgba(36,51,40,0.06)] backdrop-blur-md md:p-6">
                <div className="rounded-2xl border border-[#e5ddcf] bg-[rgba(255,255,255,0.78)] p-4 md:p-6">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
                    Order type
                  </p>
                  <h2 className="mt-2 font-serif text-3xl">
                    Choose how this order should work
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-[#667164]">
                    Keep this as a one-off order, or repeat just your box.
                    Everything else stays flexible.
                  </p>

                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setIsSubscription(false)}
                      className={`rounded-2xl border p-4 text-left transition ${
                        !isSubscription
                          ? "border-[#314534] bg-[rgba(251,250,248,0.86)] shadow-[0_10px_25px_rgba(36,51,40,0.06)]"
                          : "border-[#d6cec2] bg-[rgba(255,255,255,0.82)] hover:bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-serif text-2xl text-[#243328]">
                            One-off
                          </div>
                          <p className="mt-2 text-sm leading-6 text-[#667164]">
                            Nothing repeats. This is just this delivery.
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
                          ? "border-[#314534] bg-[rgba(251,250,248,0.86)] shadow-[0_10px_25px_rgba(36,51,40,0.06)]"
                          : "border-[#d6cec2] bg-[rgba(255,255,255,0.82)] hover:bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-serif text-2xl text-[#243328]">
                            Repeat my box
                          </div>
                          <p className="mt-2 text-sm leading-6 text-[#667164]">
                            Only your box repeats. One-off add-ons stay one-off.
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

                  {isSubscription && (
                    <div className="mt-4 rounded-2xl border border-[#ddd4c8] bg-[rgba(251,250,248,0.82)] p-4">
                      <p className="text-sm font-medium text-[#243328]">
                        How often should your box repeat?
                      </p>

                      <div className="mt-4 grid gap-3 md:grid-cols-2">
                        <button
                          type="button"
                          onClick={() => setSubscriptionFrequency("weekly")}
                          className={`rounded-2xl border p-4 text-left transition ${
                            subscriptionFrequency === "weekly"
                              ? "border-[#314534] bg-[rgba(255,255,255,0.9)] shadow-[0_10px_25px_rgba(36,51,40,0.06)]"
                              : "border-[#d6cec2] bg-[rgba(255,255,255,0.82)] hover:bg-white"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="font-serif text-2xl text-[#243328]">
                                Every week
                              </div>
                              <p className="mt-2 text-sm leading-6 text-[#667164]">
                                Best if you want your regular weekly box.
                              </p>
                            </div>

                            {subscriptionFrequency === "weekly" && (
                              <span className="shrink-0 rounded-full bg-[#243328] px-3 py-1 text-xs text-white">
                                Selected
                              </span>
                            )}
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setSubscriptionFrequency("fortnightly")
                          }
                          className={`rounded-2xl border p-4 text-left transition ${
                            subscriptionFrequency === "fortnightly"
                              ? "border-[#314534] bg-[rgba(255,255,255,0.9)] shadow-[0_10px_25px_rgba(36,51,40,0.06)]"
                              : "border-[#d6cec2] bg-[rgba(255,255,255,0.82)] hover:bg-white"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="font-serif text-2xl text-[#243328]">
                                Every two weeks
                              </div>
                              <p className="mt-2 text-sm leading-6 text-[#667164]">
                                A lighter rhythm if weekly feels too much.
                              </p>
                            </div>

                            {subscriptionFrequency === "fortnightly" && (
                              <span className="shrink-0 rounded-full bg-[#243328] px-3 py-1 text-xs text-white">
                                Selected
                              </span>
                            )}
                          </div>
                        </button>
                      </div>

                      <p className="mt-4 text-sm leading-6 text-[#667164]">
                        You can still add one-off extras whenever you like.
                      </p>
                    </div>
                  )}

                  {!isSubscription && (
                    <div className="mt-4 rounded-2xl border border-[#ddd4c8] bg-[rgba(251,250,248,0.82)] p-4">
                      <p className="text-sm leading-6 text-[#667164]">
                        Your whole basket will be treated as a one-off order
                        this time.
                      </p>
                    </div>
                  )}

                  {isSubscription && subscriptionItemCount === 0 && (
                    <div className="mt-4 rounded-2xl border border-[#e4d8cb] bg-[#fbf6f0] p-4">
                      <p className="text-sm font-medium text-[#243328]">
                        No box in yet
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[#667164]">
                        Add a box if you want weekly or every two weeks to make
                        sense.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-[28px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.76)] p-4 shadow-[0_12px_30px_rgba(36,51,40,0.06)] backdrop-blur-md md:p-6">
                <div className="rounded-2xl border border-[#e5ddcf] bg-[rgba(255,255,255,0.78)] p-4 md:p-6">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
                    Delivery notes
                  </p>
                  <h2 className="mt-2 font-serif text-3xl">
                    Anything we should know?
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-[#667164]">
                    Add any useful delivery details, like a safe place, gate
                    code, or anything that helps us keep things straightforward.
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
                    className="mt-4 w-full rounded-2xl border border-[#ddd4c8] bg-[rgba(251,250,248,0.86)] px-4 py-3 text-sm text-[#243328] outline-none transition placeholder:text-[#8a9388] focus:border-[#314534]"
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
              <div className="rounded-[28px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.76)] p-4 shadow-[0_12px_30px_rgba(36,51,40,0.06)] backdrop-blur-md md:p-6">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
                  Order summary
                </p>

                <div className="mt-4 rounded-2xl border border-[#e5ddcf] bg-[rgba(255,255,255,0.78)] p-4 md:p-5">
                  {summaryRow("Items", `${totalItems}`)}
                  {summaryRow(
                    "Boxes that can repeat",
                    `${subscriptionItemCount}`,
                  )}
                  {summaryRow("One-off add-ons", `${oneOffItemCount}`)}
                  {summaryRow("Order type", orderTypeLabel)}
                  {summaryRow(
                    "Boxes total",
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

                <div className="mt-4 rounded-2xl border border-[#ddd4c8] bg-[rgba(251,250,248,0.82)] p-4">
                  <p className="text-sm font-medium text-[#243328]">
                    Local delivery
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#667164]">
                    Delivery is currently available across ML11. If anything
                    about your order needs checked, we’ll confirm it with you
                    directly.
                  </p>
                  <Link
                    href="/#postcode-checker"
                    className="mt-3 inline-flex text-sm text-[#243328] underline underline-offset-4 transition hover:text-[#4f5e52]"
                  >
                    Check your postcode
                  </Link>
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
                    className="block w-full rounded-2xl border border-[#d6cec2] bg-[rgba(255,255,255,0.86)] px-6 py-4 text-center text-sm font-medium text-[#243328] transition hover:bg-white"
                  >
                    Order via WhatsApp
                  </a>

                  <p className="text-center text-xs leading-5 text-[#7a8478]">
                    We’ll confirm delivery details with you directly.
                  </p>
                </div>

                {checkoutError && (
                  <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {checkoutError}
                  </p>
                )}

                <div className="mt-5 rounded-2xl border border-[#ddd4c8] bg-[rgba(255,255,255,0.78)] p-4">
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
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#ddd4c8] bg-[rgba(247,242,235,0.9)] px-3 py-2 backdrop-blur-md md:hidden">
          <div className="mx-auto flex w-full max-w-6xl items-center gap-2">
            <button
              type="button"
              onClick={scrollToTop}
              className="shrink-0 rounded-full border border-[#d6cec2] bg-[rgba(255,255,255,0.86)] px-3 py-2 text-xs font-medium text-[#243328] transition hover:bg-white"
            >
              Top
            </button>

            <Link
              href="/basket"
              className="min-w-0 flex-1 truncate rounded-full bg-[#2f4635] px-4 py-2 text-center text-sm font-medium text-white transition hover:opacity-90"
            >
              {totalItems} item{totalItems === 1 ? "" : "s"} · £
              {orderTotal.toFixed(2)}
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
