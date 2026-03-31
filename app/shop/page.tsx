"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useCart } from "../cart-context";

type ShopItem = {
  name: string;
  price: number;
  description: string;
  details?: string;
  category: "boxes" | "pantry";
  buttonLabel?: string;
};

const produceBoxes: ShopItem[] = [
  {
    name: "Essential Produce Box",
    price: 18,
    category: "boxes",
    buttonLabel: "Add box",
    description:
      "A smaller weekly produce box for one to two people, with a balanced mix of fruit and vegetables.",
    details:
      "Contents change week to week depending on market availability. A practical base for the week rather than a fixed list.",
  },
  {
    name: "Family Produce Box",
    price: 30,
    category: "boxes",
    buttonLabel: "Add box",
    description:
      "A larger produce box for families or households that cook regularly through the week.",
    details:
      "Built around a wider quantity of seasonal fruit and vegetables sourced from market suppliers, with contents adjusted week by week.",
  },
];

const pantryItems: ShopItem[] = [
  {
    name: "Passata",
    price: 2.8,
    category: "pantry",
    description:
      "A simple pantry staple for soups, sauces, and midweek cooking.",
    details:
      "Easy to keep on hand and useful across a range of everyday meals.",
  },
  {
    name: "Green Olives",
    price: 3.9,
    category: "pantry",
    description:
      "A savoury pantry extra that works well for grazing boards, salads, or simple suppers.",
    details: "A useful jar to keep in for quick lunches and easy hosting.",
  },
  {
    name: "Chilli Jam",
    price: 4.5,
    category: "pantry",
    description:
      "A sweet and savoury condiment for sandwiches, cheese, roasted vegetables, and simple dinners.",
    details: "A small extra that adds variety without overcomplicating a meal.",
  },
  {
    name: "Porridge Oats",
    price: 3.2,
    category: "pantry",
    description:
      "A dry-goods staple for breakfast, baking, or keeping the cupboard stocked with the basics.",
    details: "A useful everyday item as the pantry range expands beyond jars.",
  },
  {
    name: "Red Lentils",
    price: 3.6,
    category: "pantry",
    description:
      "A versatile dry-goods staple for soups, dals, traybakes, and simple weeknight cooking.",
    details:
      "Quick to cook and practical for households building a regular pantry order.",
  },
  {
    name: "Almonds",
    price: 4.9,
    category: "pantry",
    description:
      "A cupboard staple for snacking, baking, breakfast bowls, or adding texture to simple meals.",
    details:
      "A straightforward pantry extra that fits naturally with weekly essentials.",
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

  const renderAddControls = (item: ShopItem) => {
    const quantity = getQuantity(item.name);

    if (quantity === 0) {
      return (
        <button
          onClick={() => addToCart(item)}
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
            onClick={() => addToCart(item)}
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
              Build your order with a weekly produce box and a few pantry
              additions. Produce is sourced from market suppliers, and contents
              may change week to week depending on availability.
            </p>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl border border-[#ddd4c8] bg-white p-4 md:p-5">
              <p className="text-sm font-medium text-[#243328]">
                A simple way to order
              </p>
              <p className="mt-2 text-sm leading-6 text-[#667164]">
                Start with produce, add pantry items if needed, then choose
                one-off or weekly in the basket.
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
              These boxes are designed to make weekly ordering simple. The
              contents are not fixed, so the mix may vary depending on what is
              available at market that week.
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

                  <div className="mt-5 rounded-2xl border border-[#ddd4c8] bg-white p-4">
                    <p className="text-sm font-medium text-[#243328]">
                      Before checkout
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#667164]">
                      You can choose one-off or weekly in the basket after
                      adding your box.
                    </p>
                  </div>

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
              Add a few cupboard essentials
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#667164]">
              A small pantry range to round out the order, starting with jars
              and expanding into practical dry goods such as oats, nuts, grains,
              and other everyday basics.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {pantryItems.map((item) => {
              const quantity = getQuantity(item.name);

              return (
                <article
                  key={item.name}
                  className="rounded-[28px] border border-[#ddd4c8] bg-[#f7f2eb] p-5 shadow-[0_12px_30px_rgba(36,51,40,0.06)] md:p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.14em] text-[#6b776c]">
                        Pantry item
                      </p>
                      <h3 className="mt-2 font-serif text-2xl text-[#243328]">
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

                  {item.details && (
                    <p className="mt-3 text-sm leading-7 text-[#667164]">
                      {item.details}
                    </p>
                  )}

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

        <section className="mt-10 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#ddd4c8] bg-[#fbfaf8] p-4">
            <p className="text-sm font-medium text-[#243328]">
              Clear next step
            </p>
            <p className="mt-2 text-sm leading-6 text-[#667164]">
              Basket totals update as you add items, so it&apos;s always obvious
              what&apos;s in the order.
            </p>
          </div>

          <div className="rounded-2xl border border-[#ddd4c8] bg-[#fbfaf8] p-4">
            <p className="text-sm font-medium text-[#243328]">
              Flexible ordering
            </p>
            <p className="mt-2 text-sm leading-6 text-[#667164]">
              You don&apos;t need to decide between one-off and weekly until the
              basket step.
            </p>
          </div>

          <div className="rounded-2xl border border-[#ddd4c8] bg-[#fbfaf8] p-4">
            <p className="text-sm font-medium text-[#243328]">
              Built for simple weekly shops
            </p>
            <p className="mt-2 text-sm leading-6 text-[#667164]">
              Start with produce, then add pantry extras only where they make
              sense.
            </p>
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
