"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useCart } from "../cart-context";
import ShopRecipeCard from "./shop-recipe-card";
import {
  type ShopDisplayItem,
  cupboardItems,
  extraItems,
  pantryItems,
  produceBoxes,
} from "./shop-data";

export default function ShopPage() {
  const { cart, groupedCart, addToCart, removeOneFromCart } = useCart();

  const totalItems = useMemo(() => cart.length, [cart]);

  const quantityByName = useMemo(() => {
    return groupedCart.reduce<Record<string, number>>((acc, entry) => {
      acc[entry.item.name] = entry.quantity;
      return acc;
    }, {});
  }, [groupedCart]);

  const weeklyProduceBox = useMemo(() => {
    return (
      produceBoxes.find((item) => item.name === "Weekly Produce Box") ??
      produceBoxes[0] ??
      null
    );
  }, []);

  const familyProduceBox = useMemo(() => {
    return (
      produceBoxes.find((item) => item.name === "Family Produce Box") ??
      produceBoxes.find((item) => item.name !== weeklyProduceBox?.name) ??
      null
    );
  }, [weeklyProduceBox]);

  const featuredProduceBox = weeklyProduceBox;

  const getQuantity = (itemName: string) => quantityByName[itemName] ?? 0;

  const addDisplayItemToCart = (item: ShopDisplayItem) => {
    addToCart({
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
      checkoutType: item.checkoutType,
    });
  };

  const handleStartWeeklyBox = () => {
    if (!featuredProduceBox) return;
    addDisplayItemToCart(featuredProduceBox);
  };

  const renderOrderBadge = (item: ShopDisplayItem) => {
    if (item.checkoutType === "subscription") {
      return (
        <div className="inline-flex rounded-full border border-[#d9d1c5] bg-[rgba(255,255,255,0.86)] px-3 py-1 text-xs font-medium uppercase tracking-[0.08em] text-[#5f675c]">
          Weekly starter
        </div>
      );
    }

    return (
      <div className="inline-flex rounded-full border border-[#d9d1c5] bg-[rgba(255,255,255,0.86)] px-3 py-1 text-xs font-medium uppercase tracking-[0.08em] text-[#5f675c]">
        One-off add-on
      </div>
    );
  };

  const renderAddControls = (item: ShopDisplayItem) => {
    const quantity = getQuantity(item.name);

    if (quantity === 0) {
      return (
        <button
          type="button"
          onClick={() => addDisplayItemToCart(item)}
          className="inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-[#2f4635] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 sm:w-auto"
        >
          {item.buttonLabel ?? "Add to basket"}
        </button>
      );
    }

    return (
      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
        <div className="inline-flex items-center self-start rounded-full border border-[#d8d0c4] bg-[rgba(255,255,255,0.88)]">
          <button
            type="button"
            onClick={() => removeOneFromCart(item.name)}
            className="cursor-pointer px-4 py-2 text-lg text-[#243328] transition hover:bg-[#f4efe9]"
          >
            −
          </button>

          <span className="min-w-[2.2rem] text-center text-sm font-medium text-[#243328]">
            {quantity}
          </span>

          <button
            type="button"
            onClick={() => addDisplayItemToCart(item)}
            className="cursor-pointer px-4 py-2 text-lg text-[#243328] transition hover:bg-[#f4efe9]"
          >
            +
          </button>
        </div>

        <span className="text-sm text-[#5f675c]">Added to basket</span>
      </div>
    );
  };

  const renderCompactCard = (
    item: ShopDisplayItem,
    label: string,
    helperText?: string,
  ) => {
    return (
      <article
        key={item.name}
        className="overflow-hidden rounded-[24px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.74)] shadow-[0_10px_24px_rgba(36,51,40,0.05)] backdrop-blur-md"
      >
        <div className="flex flex-col sm:flex-row">
          <div className="border-b border-[#e9dfd2] bg-[rgba(238,231,220,0.72)] p-4 sm:w-[190px] sm:shrink-0 sm:border-b-0 sm:border-r md:w-[220px]">
            <div className="flex h-full items-center justify-center rounded-[20px] bg-[rgba(248,244,238,0.82)] p-4">
              <img
                src={item.image}
                alt={item.name}
                className="h-28 w-full object-contain sm:h-36"
              />
            </div>
          </div>

          <div className="flex flex-1 flex-col justify-between p-5 md:p-6">
            <div>
              <p className="text-sm uppercase tracking-[0.14em] text-[#6b776c]">
                {label}
              </p>

              <h3 className="mt-2 font-serif text-[1.75rem] text-[#243328]">
                {item.name}
              </h3>

              <div className="mt-3 rounded-full border border-[#ddd4c8] bg-[rgba(255,255,255,0.88)] px-4 py-2 text-sm">
                £{item.price.toFixed(2)}
              </div>

              <div className="mt-4">{renderOrderBadge(item)}</div>

              <p className="mt-4 text-sm text-[#667164]">{item.description}</p>

              {helperText ? (
                <p className="mt-3 text-sm text-[#5f675c]">{helperText}</p>
              ) : null}

              {item.bestFor ? (
                <p className="mt-3 text-sm text-[#5f675c]">{item.bestFor}</p>
              ) : null}

              {item.note ? (
                <p className="mt-2 text-sm text-[#5f675c]">{item.note}</p>
              ) : null}
            </div>

            <div className="mt-6">{renderAddControls(item)}</div>
          </div>
        </div>
      </article>
    );
  };

  const renderSection = (
    title: string,
    id: string,
    items: ShopDisplayItem[],
    label: string,
  ) => {
    if (items.length === 0) return null;

    return (
      <section id={id} className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl text-[#243328]">{title}</h2>
            <p className="mt-2 text-sm text-[#667164]">
              Useful additions for the week ahead.
            </p>
          </div>

          <Link
            href="/basket"
            className="hidden cursor-pointer text-sm text-[#5f675c] underline md:block"
          >
            Review basket
          </Link>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {items.map((item) => renderCompactCard(item, label))}
        </div>
      </section>
    );
  };

  return (
    <main className="min-h-screen px-4 py-5 text-[#243328] sm:px-5 md:px-10 md:py-8">
      <div className="mx-auto max-w-6xl pb-24 md:pb-10">
        <div className="mb-5 flex items-center justify-between border-b border-[rgba(221,212,200,0.9)] pb-4">
          <Link
            href="/"
            className="cursor-pointer text-sm tracking-[0.35em] text-[#60705f]"
          >
            THE LOCAL PANTRY
          </Link>

          <Link
            href="/basket"
            className="cursor-pointer text-sm text-[#243328]"
          >
            Basket{totalItems > 0 ? ` (${totalItems})` : ""}
          </Link>
        </div>

        <section className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="rounded-[28px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.78)] p-5 shadow-[0_12px_30px_rgba(36,51,40,0.05)] backdrop-blur-md md:p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-[#6b776c]">
              Shop
            </p>

            <h1 className="mt-3 font-serif text-[2rem] leading-tight md:text-[2.5rem]">
              Start with your weekly veg box
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-7 text-[#667164]">
              Choose the size that suits your week, then we’ll help you plan
              meals around it.
            </p>

            <div className="mt-4 inline-flex rounded-full border border-[#d9d1c5] bg-[rgba(255,255,255,0.82)] px-3 py-1 text-xs font-medium text-[#5f675c]">
              Most people start here
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {weeklyProduceBox ? (
                <div className="rounded-[24px] border border-[#ddd4c8] bg-[rgba(255,255,255,0.74)] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.14em] text-[#6b776c]">
                        Smaller box
                      </p>
                      <h2 className="mt-2 font-serif text-xl text-[#243328]">
                        {weeklyProduceBox.name}
                      </h2>
                    </div>

                    <div className="rounded-full border border-[#ddd4c8] bg-[rgba(255,255,255,0.88)] px-3 py-1.5 text-sm text-[#243328]">
                      £{weeklyProduceBox.price.toFixed(2)}
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-[#667164]">
                    {weeklyProduceBox.description}
                  </p>

                  {weeklyProduceBox.bestFor ? (
                    <p className="mt-3 text-sm text-[#5f675c]">
                      {weeklyProduceBox.bestFor}
                    </p>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => addDisplayItemToCart(weeklyProduceBox)}
                    className="mt-4 inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-[#2f4635] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
                  >
                    Add smaller box
                  </button>
                </div>
              ) : null}

              {familyProduceBox ? (
                <div className="rounded-[24px] border border-[#ddd4c8] bg-[rgba(255,255,255,0.74)] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.14em] text-[#6b776c]">
                        Larger box
                      </p>
                      <h2 className="mt-2 font-serif text-xl text-[#243328]">
                        {familyProduceBox.name}
                      </h2>
                    </div>

                    <div className="rounded-full border border-[#ddd4c8] bg-[rgba(255,255,255,0.88)] px-3 py-1.5 text-sm text-[#243328]">
                      £{familyProduceBox.price.toFixed(2)}
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-[#667164]">
                    {familyProduceBox.description}
                  </p>

                  {familyProduceBox.bestFor ? (
                    <p className="mt-3 text-sm text-[#5f675c]">
                      {familyProduceBox.bestFor}
                    </p>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => addDisplayItemToCart(familyProduceBox)}
                    className="mt-4 inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-[#2f4635] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
                  >
                    Add larger box
                  </button>
                </div>
              ) : null}
            </div>

            <div className="mt-5 rounded-[22px] border border-[#ddd4c8] bg-[rgba(255,255,255,0.76)] p-4">
              <p className="text-sm text-[#5f675c]">Your basket</p>
              <p className="mt-2 text-2xl font-serif text-[#243328]">
                {totalItems > 0
                  ? `${totalItems} item${totalItems === 1 ? "" : "s"}`
                  : "Empty"}
              </p>
              <Link
                href="/basket"
                className="mt-3 inline-block cursor-pointer text-sm underline"
              >
                Review basket
              </Link>
            </div>
          </div>

          <ShopRecipeCard
            starterBox={featuredProduceBox}
            onStartWeeklyBox={handleStartWeeklyBox}
          />
        </section>

        <section id="produce-boxes" className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl text-[#243328]">
                Produce boxes
              </h2>
              <p className="mt-2 text-sm text-[#667164]">
                Start with a weekly box, then top up with a few extras.
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {produceBoxes.map((item) =>
              renderCompactCard(
                item,
                item.checkoutType === "subscription"
                  ? "Weekly starter"
                  : "Produce box",
                item.checkoutType === "subscription"
                  ? "A simple base for the week."
                  : undefined,
              ),
            )}
          </div>
        </section>

        {renderSection(
          "Pantry additions",
          "pantry-additions",
          pantryItems,
          "Pantry",
        )}
        {renderSection(
          "Cupboard essentials",
          "cupboard-essentials",
          cupboardItems,
          "Cupboard",
        )}
        {renderSection("Extras", "extras", extraItems, "Extra")}
      </div>
    </main>
  );
}
