"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useCart } from "../cart-context";

type ShopDisplayItem = {
  name: string;
  price: number;
  image: string;
  description: string;
  details?: string;
  category: "boxes" | "pantry";
  buttonLabel?: string;
  weeklyIncludes?: string[];
};

const produceBoxes: ShopDisplayItem[] = [
  {
    name: "Weekly Produce Box",
    price: 20,
    image: "/weekly-harvest-box.png",
    category: "boxes",
    buttonLabel: "Add weekly box",
    description:
      "A smaller produce box with a useful mix of everyday fruit and veg.",
    details:
      "Contents change week to week depending on availability, so the mix is not fixed.",
    weeklyIncludes: ["Carrots", "Potatoes", "Leeks", "Apples", "Onions"],
  },
  {
    name: "Family Produce Box",
    price: 30,
    image: "/family-harvest-box.png",
    category: "boxes",
    buttonLabel: "Add family box",
    description:
      "A larger produce box for households that cook regularly through the week.",
    details:
      "Designed as a fuller weekly box, with contents changing depending on what is available.",
    weeklyIncludes: ["Carrots", "Potatoes", "Tomatoes", "Apples", "Greens"],
  },
];

const pantryItems: ShopDisplayItem[] = [
  {
    name: "Sorrel & Walnut Pesto",
    price: 4.5,
    image: "/sorrel-walnut-pesto.png",
    category: "pantry",
    description:
      "A fresh, savoury jar for pasta, toast, or spooning over roasted vegetables.",
  },
  {
    name: "Rose Harissa",
    price: 5.25,
    image: "/rose-harissa.png",
    category: "pantry",
    description:
      "A gently spiced pantry extra for roasting, dressing, or adding warmth to simple meals.",
  },
  {
    name: "Salted Caramel Sauce",
    price: 5.0,
    image: "/salted-caramel.png",
    category: "pantry",
    description:
      "A rich, smooth sauce for desserts, baking, or adding something extra to a simple pudding.",
  },
  {
    name: "Dark Chocolate & Hazelnut Spread",
    price: 5.0,
    image: "/dark-chocolate.png",
    category: "pantry",
    description:
      "A chocolate spread for toast, baking, or keeping in the cupboard as a useful sweet extra.",
  },
];

export default function ShopPage() {
  const { cart, groupedCart, total, addToCart, removeOneFromCart } = useCart();

  const totalItems = useMemo(() => cart.length, [cart]);

  const quantityByName = useMemo(() => {
    return groupedCart.reduce<Record<string, number>>((acc, entry) => {
      acc[entry.item.name] = entry.quantity;
      return acc;
    }, {});
  }, [groupedCart]);

  const basketHref = "/basket";

  const getQuantity = (itemName: string) => quantityByName[itemName] ?? 0;

  const addDisplayItemToCart = (item: ShopDisplayItem) => {
    addToCart({
      name: item.name,
      price: item.price,
      image: item.image,
    });
  };

  const renderAddControls = (item: ShopDisplayItem) => {
    const quantity = getQuantity(item.name);

    if (quantity === 0) {
      return (
        <button
          onClick={() => addDisplayItemToCart(item)}
          className="rounded-full bg-[#2f4635] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
        >
          {item.buttonLabel ?? "Add to basket"}
        </button>
      );
    }

    return (
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex items-center rounded-full border border-[#d8d0c4] bg-white">
          <button
            onClick={() => removeOneFromCart(item.name)}
            aria-label={`Decrease quantity of ${item.name}`}
            className="px-4 py-2 text-lg text-[#243328] transition hover:bg-[#f4efe9]"
          >
            −
          </button>

          <span className="min-w-[2.2rem] text-center text-sm font-medium text-[#243328]">
            {quantity}
          </span>

          <button
            onClick={() => addDisplayItemToCart(item)}
            aria-label={`Increase quantity of ${item.name}`}
            className="px-4 py-2 text-lg text-[#243328] transition hover:bg-[#f4efe9]"
          >
            +
          </button>
        </div>

        <span className="text-sm text-[#5f675c]">Added to basket</span>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-[#f4efe9] px-5 py-8 text-[#243328] md:px-10 md:py-10">
      <div className="mx-auto max-w-6xl pb-24 md:pb-10">
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
              className="text-sm text-[#243328] underline underline-offset-4"
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
              href={basketHref}
              className="text-sm text-[#4f5e52] transition hover:text-[#243328]"
            >
              Basket{totalItems > 0 ? ` (${totalItems})` : ""}
            </Link>
          </nav>
        </div>

        <section className="rounded-[28px] border border-[#ddd4c8] bg-[#f7f2eb] p-6 shadow-[0_12px_30px_rgba(36,51,40,0.06)] md:p-8">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.2em] text-[#6b776c]">
              Shop
            </p>

            <h1 className="mt-3 font-serif text-4xl md:text-6xl">
              Weekly essentials
            </h1>

            <p className="mt-4 max-w-2xl text-[#667164]">
              Build your order with a produce box and a few pantry additions.
              Produce is sourced from market suppliers, and contents can change
              week to week depending on availability.
            </p>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl border border-[#ddd4c8] bg-white p-4 md:p-5">
              <p className="text-sm font-medium text-[#243328]">
                A simple way to order
              </p>
              <p className="mt-2 text-sm leading-6 text-[#667164]">
                Start with a produce box, add pantry items if needed, then
                choose one-off or weekly in the basket.
              </p>
            </div>

            <div className="rounded-2xl border border-[#ddd4c8] bg-[#efe8dd] p-4 md:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-[#243328]">
                    Basket summary
                  </p>
                  <p className="mt-1 text-sm text-[#667164]">
                    {totalItems > 0
                      ? `${totalItems} item${totalItems === 1 ? "" : "s"} · £${total.toFixed(2)}`
                      : "No items added yet"}
                  </p>
                </div>

                <Link
                  href={basketHref}
                  className="inline-flex w-fit rounded-full border border-[#d6cec2] bg-white px-5 py-3 text-sm font-medium text-[#243328] transition hover:bg-[#faf7f2]"
                >
                  View basket
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-5">
            <p className="text-sm uppercase tracking-[0.18em] text-[#6b776c]">
              Produce boxes
            </p>
            <h2 className="mt-2 font-serif text-3xl md:text-4xl">
              Choose your base for the week
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#667164]">
              These boxes are designed to make weekly ordering simple. The mix
              changes depending on what is available and looking good that week.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {produceBoxes.map((item) => {
              const quantity = getQuantity(item.name);

              return (
                <article
                  key={item.name}
                  className="rounded-[28px] border border-[#ddd4c8] bg-[#f7f2eb] p-6 shadow-[0_12px_30px_rgba(36,51,40,0.06)] md:p-7"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.14em] text-[#6b776c]">
                        Produce box
                      </p>
                      <h3 className="mt-2 font-serif text-3xl text-[#243328]">
                        {item.name}
                      </h3>
                    </div>

                    <div className="rounded-full border border-[#ddd4c8] bg-white px-4 py-2 text-sm font-medium text-[#243328]">
                      £{item.price.toFixed(2)}
                    </div>
                  </div>

                  <p className="mt-5 text-sm leading-7 text-[#667164]">
                    {item.description}
                  </p>

                  {item.details && (
                    <p className="mt-3 text-sm leading-7 text-[#667164]">
                      {item.details}
                    </p>
                  )}

                  {item.weeklyIncludes && (
                    <div className="mt-5 rounded-2xl border border-[#ddd4c8] bg-white p-4">
                      <p className="text-sm font-medium text-[#243328]">
                        This week may include
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.weeklyIncludes.map((entry) => (
                          <span
                            key={entry}
                            className="rounded-full border border-[#e5ddcf] bg-[#fbfaf8] px-3 py-1 text-sm text-[#5f675c]"
                          >
                            {entry}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {renderAddControls(item)}

                    {quantity > 0 && (
                      <Link
                        href={basketHref}
                        className="text-sm text-[#5f675c] underline underline-offset-4 transition hover:text-[#243328]"
                      >
                        Review in basket
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5">
            <p className="text-sm uppercase tracking-[0.18em] text-[#6b776c]">
              Pantry additions
            </p>
            <h2 className="mt-2 font-serif text-3xl md:text-4xl">
              Useful extras
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#667164]">
              A small selection of pantry essentials and useful extras to round
              out the weekly order.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {pantryItems.map((item) => {
              const quantity = getQuantity(item.name);

              return (
                <article
                  key={item.name}
                  className="rounded-[28px] border border-[#ddd4c8] bg-[#f7f2eb] p-5 shadow-[0_12px_30px_rgba(36,51,40,0.06)] md:p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-serif text-2xl text-[#243328]">
                        {item.name}
                      </h3>
                    </div>

                    <div className="rounded-full border border-[#ddd4c8] bg-white px-4 py-2 text-sm font-medium text-[#243328]">
                      £{item.price.toFixed(2)}
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-7 text-[#667164]">
                    {item.description}
                  </p>

                  <div className="mt-6 flex flex-col gap-3">
                    {renderAddControls(item)}

                    {quantity > 0 && (
                      <p className="text-xs text-[#7a8478]">
                        You can adjust quantities here or review everything in
                        the basket.
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>

      {totalItems > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#ddd4c8] bg-[#f7f2eb]/95 px-4 py-3 backdrop-blur md:hidden">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-[#243328]">
                {totalItems} item{totalItems === 1 ? "" : "s"} · £
                {total.toFixed(2)}
              </p>
              <p className="truncate text-xs text-[#667164]">
                Ready to review in your basket
              </p>
            </div>

            <Link
              href={basketHref}
              className="shrink-0 rounded-full bg-[#2f4635] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              View basket
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
