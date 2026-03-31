"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useCart, type ShopItem } from "../cart-context";

type BoxItem = ShopItem & {
  contents: string[];
  note: string;
  cta: string;
  description: string;
};

export default function ShopPage() {
  const { cart, addToCart, getItemCount } = useCart();

  const [successMessage, setSuccessMessage] = useState("");
  const [lastAddedItem, setLastAddedItem] = useState<string | null>(null);

  const totalItems = useMemo(() => cart.length, [cart]);

  const addOns: (ShopItem & { description: string })[] = [
    {
      name: "Sorrel & Walnut Pesto",
      price: 4.5,
      image: "/sorrel-walnut-pesto.png",
      description:
        "Fresh and nutty, good for pasta or spooned over roasted veg.",
    },
    {
      name: "Rose Harissa",
      price: 5.25,
      image: "/rose-harissa.png",
      description:
        "A gently spiced chilli paste, great for roasting or adding warmth to dishes.",
    },
    {
      name: "Salted Caramel Sauce",
      price: 5,
      image: "/salted-caramel.png",
      description: "Rich and smooth, for drizzling over desserts or fruit.",
    },
    {
      name: "Dark Chocolate & Hazelnut Spread",
      price: 5,
      image: "/dark-chocolate.png",
      description: "A simple chocolate spread for toast, oats, or baking.",
    },
  ];

  const boxes: BoxItem[] = [
    {
      name: "Weekly Produce Box",
      price: 20,
      image: "/weekly-harvest-box.png",
      contents: ["Carrots", "Potatoes", "Leeks", "Lettuce", "Onions", "Apples"],
      note: "A simple box for the week ahead.",
      cta: "Add weekly box",
      description:
        "A smaller produce box with a useful mix of everyday fruit and veg.",
    },
    {
      name: "Family Produce Box",
      price: 30,
      image: "/family-harvest-box.png",
      contents: [
        "Carrots",
        "Potatoes",
        "Tomatoes",
        "Apples",
        "Kale",
        "Mushrooms",
      ],
      note: "A larger box for households that need a bit more.",
      cta: "Add family box",
      description:
        "A fuller produce box designed for families or bigger weekly shops.",
    },
  ];

  const handleAddToCart = (item: ShopItem) => {
    addToCart(item);
    setSuccessMessage(`${item.name} added to basket`);
    setLastAddedItem(item.name);

    setTimeout(() => setSuccessMessage(""), 2000);
    setTimeout(() => {
      setLastAddedItem((current) => (current === item.name ? null : current));
    }, 1200);
  };

  return (
    <main className="min-h-screen bg-[#f4efe9] px-6 py-10 text-[#243328] md:px-10">
      <div className="mx-auto max-w-7xl">
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
              className="text-sm text-[#243328] underline underline-offset-4"
            >
              Shop
            </Link>
            <Link
              href="/recipes"
              className="text-sm text-[#4f5e52] hover:text-[#243328]"
            >
              Recipes
            </Link>
            <Link
              href="/basket"
              className="text-sm text-[#4f5e52] hover:text-[#243328]"
            >
              Basket{totalItems > 0 ? ` (${totalItems})` : ""}
            </Link>
          </nav>
        </div>

        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-[#6b776c]">
            Fresh produce and pantry essentials
          </p>

          <h1 className="mt-3 font-serif text-5xl md:text-7xl">
            Shop the range
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-[#6d756a]">
            A small, carefully chosen selection of produce boxes, pantry
            essentials, and useful extras for the week ahead.
          </p>

          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="rounded-full border border-[#d6cec2] bg-white px-6 py-3 text-sm font-medium text-[#243328] shadow-sm transition hover:bg-[#faf7f2]"
            >
              Back to home
            </Link>

            <Link
              href="/basket"
              className="rounded-full bg-[#2f4635] px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-[#243328]"
            >
              View basket{totalItems > 0 ? ` (${totalItems})` : ""}
            </Link>
          </div>

          {successMessage && (
            <div className="mx-auto mt-6 inline-flex rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-800">
              {successMessage}
            </div>
          )}
        </div>

        {/* PRODUCE BOXES */}
        <section className="mt-14">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.18em] text-[#6b776c]">
              Produce boxes
            </p>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl">
              Chosen for the week
            </h2>
            <p className="mt-4 text-[#5f675c]">
              Our produce boxes are built around a simple weekly selection, with
              contents changing depending on availability and what looks best.
            </p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {boxes.map((box) => {
              const count = getItemCount(box.name);
              const added = lastAddedItem === box.name;

              return (
                <div
                  key={box.name}
                  className="rounded-[28px] border border-[#ddd4c8] bg-[#f7f2eb] p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="overflow-hidden rounded-[22px] border border-[#e5ddcf] bg-white">
                    <img
                      src={box.image}
                      alt={box.name}
                      className="h-[320px] w-full bg-[#f8f5ef] p-4 object-contain"
                    />

                    <div className="px-6 pb-6 pt-6 md:px-8 md:pb-8 text-center">
                      <p className="text-sm uppercase tracking-[0.16em] text-[#6b776c]">
                        Produce box
                      </p>

                      <h3 className="mt-3 font-serif text-4xl md:text-5xl">
                        {box.name}
                      </h3>

                      <p className="mt-4 text-base leading-7 text-[#5f675c]">
                        {box.description}
                      </p>

                      <p className="mt-4 font-serif text-3xl">
                        £{box.price}
                        <span className="ml-2 text-lg text-[#5f675c]">
                          per week
                        </span>
                      </p>

                      <div className="mt-4 rounded-2xl border border-[#e7ddd1] bg-[#fbf8f3] px-5 py-3 text-sm text-[#5f675c]">
                        {box.note}
                      </div>

                      <div className="mt-5">
                        <p className="text-sm uppercase tracking-[0.14em] text-[#6b776c]">
                          This week may include
                        </p>

                        <div className="mt-3 flex flex-wrap justify-center gap-2">
                          {box.contents.map((item) => (
                            <span
                              key={item}
                              className="rounded-full border border-[#ddd4c8] bg-[#f7f2eb] px-3 py-1 text-sm text-[#4f5e52]"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => handleAddToCart(box)}
                        className="mt-6 w-full rounded-2xl bg-[#2f4635] px-6 py-4 text-base font-medium text-white transition hover:bg-[#243328]"
                      >
                        {added ? "Added ✓" : box.cta}
                      </button>

                      {count > 0 && (
                        <p className="mt-2 text-sm text-[#5f675c]">
                          {count} in basket
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* PANTRY ESSENTIALS */}
        <section className="mt-16">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.18em] text-[#6b776c]">
              Pantry essentials
            </p>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl">
              Useful extras
            </h2>
            <p className="mt-4 text-[#5f675c]">
              A small selection of pantry essentials, from jars and sauces to
              grains, nuts, and everyday cupboard staples.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {addOns.map((item) => {
              const count = getItemCount(item.name);
              const added = lastAddedItem === item.name;

              return (
                <div
                  key={item.name}
                  className="rounded-[22px] border border-[#ddd4c8] bg-[#f7f2eb] p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="overflow-hidden rounded-[18px] border border-[#e5ddcf] bg-white">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-56 w-full bg-[#f8f5ef] p-4 object-contain"
                    />

                    <div className="px-4 pb-5 pt-4 text-center">
                      <h3 className="font-serif text-2xl leading-tight">
                        {item.name}
                      </h3>

                      <p className="mt-2 text-sm text-[#5f675c] leading-6">
                        {item.description}
                      </p>

                      <p className="mt-3 text-2xl">£{item.price.toFixed(2)}</p>

                      <button
                        onClick={() => handleAddToCart(item)}
                        className="mt-4 w-full rounded-2xl bg-[#2f4635] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#243328]"
                      >
                        {added ? "Added ✓" : "Add to basket"}
                      </button>

                      {count > 0 && (
                        <p className="mt-2 text-sm text-[#5f675c]">
                          {count} in basket
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
