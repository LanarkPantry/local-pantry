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
  },
  {
    name: "Family Produce Box",
    price: 30,
    image: "/family-harvest-box.png",
    category: "boxes",
    buttonLabel: "Add family box",
    description:
      "A larger produce box for households that cook regularly through the week.",
  },
];

const pantryItems: ShopDisplayItem[] = [
  {
    name: "Sorrel & Walnut Pesto",
    price: 4.5,
    image: "/sorrel-walnut-pesto.png",
    category: "pantry",
    description: "A fresh, savoury jar for pasta or roasted vegetables.",
  },
  {
    name: "Rose Harissa",
    price: 5.25,
    image: "/rose-harissa.png",
    category: "pantry",
    description: "A gently spiced pantry extra for roasting or dressing.",
  },
  {
    name: "Salted Caramel Sauce",
    price: 5.0,
    image: "/salted-caramel.png",
    category: "pantry",
    description: "A rich sauce for desserts or simple extras.",
  },
  {
    name: "Dark Chocolate & Hazelnut Spread",
    price: 5.0,
    image: "/dark-chocolate.png",
    category: "pantry",
    description: "A simple chocolate spread for toast or baking.",
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
          className="rounded-full bg-[#2f4635] px-5 py-3 text-sm font-medium text-white"
        >
          {item.buttonLabel ?? "Add to basket"}
        </button>
      );
    }

    return (
      <div className="flex items-center gap-3">
        <button onClick={() => removeOneFromCart(item.name)}>−</button>
        <span>{quantity}</span>
        <button onClick={() => addDisplayItemToCart(item)}>+</button>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-[#f4efe9] px-6 py-10 text-[#243328] md:px-10">
      <div className="mx-auto max-w-6xl">
        {/* HEADER */}
        <div className="mb-10 flex justify-between">
          <Link href="/">THE LOCAL PANTRY</Link>
          <Link href="/basket">
            Basket{totalItems > 0 ? ` (${totalItems})` : ""}
          </Link>
        </div>

        {/* PRODUCE */}
        <section>
          <h2 className="mb-6 font-serif text-3xl">Produce boxes</h2>

          <div className="grid gap-6 md:grid-cols-2">
            {produceBoxes.map((item) => (
              <div key={item.name} className="rounded-2xl bg-white p-4">
                {/* IMAGE */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="mb-4 h-48 w-full rounded-xl object-cover"
                />

                <h3 className="font-serif text-2xl">{item.name}</h3>
                <p className="mt-2 text-sm">{item.description}</p>

                <div className="mt-4 flex justify-between items-center">
                  <span>£{item.price}</span>
                  {renderAddControls(item)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PANTRY */}
        <section className="mt-12">
          <h2 className="mb-6 font-serif text-3xl">Pantry</h2>

          <div className="grid gap-6 md:grid-cols-2">
            {pantryItems.map((item) => (
              <div key={item.name} className="rounded-2xl bg-white p-4">
                {/* IMAGE */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="mb-4 h-48 w-full rounded-xl object-cover"
                />

                <h3 className="font-serif text-xl">{item.name}</h3>
                <p className="mt-2 text-sm">{item.description}</p>

                <div className="mt-4 flex justify-between items-center">
                  <span>£{item.price}</span>
                  {renderAddControls(item)}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
