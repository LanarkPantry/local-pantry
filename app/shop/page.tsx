"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart, type ShopItem } from "../cart-context";

type BoxItem = ShopItem & {
  contents: string[];
  urgency: string;
  cta: string;
};

export default function ShopPage() {
  const { cart, addToCart, getItemCount } = useCart();
  const [successMessage, setSuccessMessage] = useState("");

  const addOns: ShopItem[] = [
    {
      name: "Sorrel & Walnut Pesto",
      price: 4.5,
      image: "/sorrel-walnut-pesto.png",
    },
    {
      name: "Rose Harissa",
      price: 5.25,
      image: "/rose-harissa.png",
    },
    {
      name: "Salted Caramel Sauce",
      price: 5,
      image: "/salted-caramel.png",
    },
    {
      name: "Dark Chocolate & Hazelnut Spread",
      price: 5,
      image: "/dark-chocolate.png",
    },
  ];

  const boxes: BoxItem[] = [
    {
      name: "Weekly Harvest",
      price: 20,
      image: "/weekly-harvest-box.png",
      contents: ["Carrots", "Potatoes", "Leeks", "Lettuce", "Onions", "Apples"],
      urgency: "Limited slots available this week.",
      cta: "Subscribe Weekly",
    },
    {
      name: "Family Harvest",
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
      urgency: "Only 8 boxes left for this week",
      cta: "Choose Family Harvest",
    },
  ];

  const handleAddToCart = (item: ShopItem) => {
    addToCart(item);
    setSuccessMessage(`${item.name} added to basket`);

    setTimeout(() => {
      setSuccessMessage("");
    }, 2000);
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
              href="/basket"
              className="text-sm text-[#4f5e52] hover:text-[#243328]"
            >
              Basket{cart.length > 0 ? ` (${cart.length})` : ""}
            </Link>
          </nav>
        </div>

        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-[#6b776c]">
            Seasonal groceries from local farms
          </p>

          <h1 className="mt-3 font-serif text-5xl md:text-7xl">Shop</h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-[#6d756a]">
            Browse our seasonal harvest boxes and pantry extras.
          </p>

          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="rounded-full border border-[#d6cec2] bg-white px-6 py-3 text-sm font-medium text-[#243328] shadow-sm transition hover:bg-[#faf7f2]"
            >
              Back to Home
            </Link>

            <Link
              href="/basket"
              className="rounded-full bg-[#2f4635] px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-[#243328]"
            >
              View Basket{cart.length > 0 ? ` (${cart.length})` : ""}
            </Link>
          </div>

          {successMessage && (
            <div className="mx-auto mt-6 inline-flex rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-800">
              {successMessage}
            </div>
          )}
        </div>

        <section className="mt-14">
          <h2 className="font-serif text-4xl text-[#243328] md:text-5xl">
            Harvest Boxes
          </h2>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {boxes.map((box) => (
              <div
                key={box.name}
                className="rounded-[28px] border border-[#ddd4c8] bg-[#f7f2eb] p-5 shadow-[0_12px_30px_rgba(36,51,40,0.06)]"
              >
                <div className="overflow-hidden rounded-[22px] border border-[#e5ddcf] bg-white">
                  <img
                    src={box.image}
                    alt={box.name}
                    className="h-[320px] w-full bg-[#f8f5ef] p-4 object-contain"
                  />

                  <div className="px-8 pb-8 pt-6 text-center">
                    <h3 className="font-serif text-4xl leading-none text-[#243328] md:text-5xl">
                      {box.name}
                    </h3>

                    <p className="mt-4 font-serif text-3xl text-[#243328]">
                      £{box.price} <span className="text-xl">per week</span>
                    </p>

                    <div className="mx-auto mt-8 max-w-md border-t border-[#d8d0c5] pt-6">
                      <p className="font-serif text-2xl text-[#243328]">
                        Typical contents:
                      </p>

                      <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-left text-lg text-[#38473b]">
                        {box.contents.map((item) => (
                          <div key={item}>• {item}</div>
                        ))}
                      </div>

                      <p className="mt-6 border-t border-[#d8d0c5] pt-5 text-lg text-[#5f675c]">
                        Changes weekly based on what’s fresh.
                      </p>
                    </div>

                    <div className="mt-4 rounded-2xl border border-[#e7d2a9] bg-[#f3dfb9] px-5 py-3 text-lg text-[#5d4f2a]">
                      {box.urgency}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddToCart(box)}
                      className="mt-6 w-full rounded-2xl bg-gradient-to-r from-[#334e39] to-[#5a5326] px-6 py-4 font-serif text-2xl text-white shadow-sm transition hover:scale-[1.01]"
                    >
                      {box.cta}
                      {getItemCount(box.name) > 0
                        ? ` (${getItemCount(box.name)})`
                        : ""}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <div className="text-center">
            <h2 className="font-serif text-4xl text-[#243328] md:text-6xl">
              Gourmet Add-Ons
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[#667164]">
              Luxury pantry jars designed to sit beautifully alongside your
              weekly harvest box.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {addOns.map((item) => (
              <div
                key={item.name}
                className="rounded-[22px] border border-[#ddd4c8] bg-[#f7f2eb] p-3 shadow-[0_10px_24px_rgba(36,51,40,0.05)]"
              >
                <div className="overflow-hidden rounded-[18px] border border-[#e5ddcf] bg-white">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-56 w-full bg-[#f8f5ef] p-4 object-contain"
                  />

                  <div className="px-4 pb-5 pt-4 text-center">
                    <h3 className="font-serif text-2xl leading-tight text-[#243328]">
                      {item.name}
                    </h3>

                    <p className="mt-2 text-2xl text-[#243328]">
                      £{item.price.toFixed(2)}
                    </p>

                    <button
                      type="button"
                      onClick={() => handleAddToCart(item)}
                      className="mt-4 w-full rounded-2xl bg-gradient-to-r from-[#334e39] to-[#5a5326] px-4 py-3 font-serif text-xl text-white shadow-sm transition hover:scale-[1.01]"
                    >
                      Add to Basket
                      {getItemCount(item.name) > 0
                        ? ` (${getItemCount(item.name)})`
                        : ""}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
