"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useCart } from "../cart-context";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import {
  type ShopDisplayItem,
  cupboardItems,
  extraItems,
  pantryItems,
  produceBoxes,
} from "./shop-data";

function formatPrice(value: number) {
  return `£${value.toFixed(2)}`;
}

export default function ShopPage() {
  const { cart, groupedCart, addToCart, removeOneFromCart } = useCart();

  const totalItems = useMemo(() => cart.length, [cart]);

  const quantityByName = useMemo(() => {
    return groupedCart.reduce<Record<string, number>>((acc, entry) => {
      acc[entry.item.name] = entry.quantity;
      return acc;
    }, {});
  }, [groupedCart]);

  const weeklyProduceBox =
    produceBoxes.find((item) => item.name === "Weekly Produce Box") ??
    produceBoxes[0] ??
    null;

  const familyProduceBox =
    produceBoxes.find((item) => item.name === "Family Produce Box") ??
    produceBoxes.find((item) => item.name !== weeklyProduceBox?.name) ??
    null;

  function getQuantity(itemName: string) {
    return quantityByName[itemName] ?? 0;
  }

  function addDisplayItemToCart(item: ShopDisplayItem) {
    addToCart({
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
      checkoutType: item.checkoutType,
    });
  }

  function renderOrderBadge(item: ShopDisplayItem) {
    if (item.checkoutType === "subscription") {
      return (
        <span className="rounded-full border border-[#d9d1c5] bg-white/85 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-[#5f675c]">
          Weekly or fortnightly
        </span>
      );
    }

    return (
      <span className="rounded-full border border-[#d9d1c5] bg-white/85 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-[#5f675c]">
        One-off add-on
      </span>
    );
  }

  function renderAddControls(item: ShopDisplayItem) {
    const quantity = getQuantity(item.name);

    if (quantity === 0) {
      return (
        <button
          type="button"
          onClick={() => addDisplayItemToCart(item)}
          className="inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-[#243328] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 sm:w-auto"
        >
          {item.buttonLabel ?? "Add to basket"}
        </button>
      );
    }

    return (
      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
        <div className="inline-flex items-center self-start overflow-hidden rounded-full border border-[#d8d0c4] bg-white/90">
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

        <span className="text-sm text-[#5f675c]">{quantity} in basket</span>
      </div>
    );
  }

  function ProductCard({
    item,
    label,
    compact = false,
  }: {
    item: ShopDisplayItem;
    label: string;
    compact?: boolean;
  }) {
    return (
      <article className="overflow-hidden rounded-[28px] border border-[#ddd4c8] bg-white/80 shadow-[0_10px_24px_rgba(36,51,40,0.05)] transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_14px_32px_rgba(36,51,40,0.07)]">
        <div className="grid gap-0 sm:grid-cols-[200px_1fr]">
          <div className="border-b border-[#e9dfd2] bg-[#eee7dc]/70 p-5 sm:border-b-0 sm:border-r">
            <div
              className={`flex h-full items-center justify-center rounded-[22px] bg-[#f8f4ee]/95 p-5 ${
                compact ? "min-h-[170px]" : "min-h-[200px]"
              }`}
            >
              <img
                src={item.image}
                alt={item.name}
                className={`w-full object-contain ${
                  compact ? "max-h-[145px]" : "max-h-[175px]"
                }`}
              />
            </div>
          </div>

          <div className="flex flex-col justify-between p-5 md:p-6">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[11px] uppercase tracking-[0.16em] text-[#6b776c]">
                  {label}
                </p>

                {item.weight ? (
                  <span className="rounded-full border border-[#e0d6ca] bg-[#f7f2eb] px-2.5 py-1 text-xs text-[#5f675c]">
                    {item.weight}
                  </span>
                ) : null}
              </div>

              <h3 className="mt-3 font-serif text-[1.65rem] leading-tight text-[#243328] md:text-[1.95rem]">
                {item.name}
              </h3>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-[#ddd4c8] bg-white/90 px-4 py-2 text-sm font-medium text-[#243328]">
                  {formatPrice(item.price)}
                </span>

                {renderOrderBadge(item)}
              </div>

              <p className="mt-4 text-sm leading-7 text-[#667164]">
                {item.description}
              </p>

              {item.details ? (
                <p className="mt-2 text-sm leading-7 text-[#5f675c]">
                  {item.details}
                </p>
              ) : null}
            </div>

            <div className="mt-5">
              {renderAddControls(item)}

              {item.checkoutType === "subscription" ? (
                <p className="mt-3 text-xs leading-5 text-[#6b776c]">
                  Pause, skip or cancel anytime.
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </article>
    );
  }

  function ProductSection({
    title,
    eyebrow,
    description,
    items,
    label,
  }: {
    title: string;
    eyebrow: string;
    description: string;
    items: ShopDisplayItem[];
    label: string;
  }) {
    if (items.length === 0) return null;

    return (
      <section className="mt-12">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
              {eyebrow}
            </p>

            <h2 className="mt-2 font-serif text-[2rem] leading-tight text-[#243328] md:text-[2.55rem]">
              {title}
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#667164] md:text-base">
              {description}
            </p>
          </div>

          <Link
            href="/basket"
            className="text-sm text-[#5f675c] underline underline-offset-4 transition hover:text-[#243328]"
          >
            Review basket{totalItems > 0 ? ` (${totalItems})` : ""}
          </Link>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {items.map((item) => (
            <ProductCard key={item.name} item={item} label={label} compact />
          ))}
        </div>
      </section>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4efe9] text-[#243328]">
      <SiteHeader />

      <div className="px-4 pt-4 sm:px-6 md:hidden">
        <div className="overflow-hidden rounded-[24px] border border-[#ddd4c8] shadow-[0_10px_24px_rgba(36,51,40,0.06)]">
          <img
            src="/images/home/local-delivery.jpg"
            alt="A Local Pantry delivery with fresh produce and pantry staples"
            className="h-44 w-full object-cover"
          />
        </div>
      </div>

      <section className="px-4 py-8 sm:px-6 md:px-10 md:py-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
            <article className="rounded-[32px] border border-[#ddd4c8] bg-[#f7f2eb]/86 p-6 shadow-[0_12px_30px_rgba(36,51,40,0.06)] md:p-8">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#6b776c]">
                Shop
              </p>

              <h1 className="mt-3 max-w-3xl font-serif text-[2.45rem] leading-[1.02] tracking-tight text-[#243328] md:text-[4.3rem]">
                Start with the box. Add what helps.
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#667164] md:text-base">
                Choose a weekly fruit and veg box, then add regular staples when
                you need them.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#weekly-boxes"
                  className="rounded-full bg-[#243328] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
                >
                  Choose your box
                </a>

                <Link
                  href="/planner"
                  className="rounded-full border border-[#d6cec2] bg-white/80 px-5 py-3 text-sm text-[#243328] transition hover:bg-white"
                >
                  Open planner
                </Link>
              </div>
            </article>

            <article className="rounded-[32px] border border-[#ddd4c8] bg-white/80 p-6 shadow-[0_12px_30px_rgba(36,51,40,0.05)] md:p-8">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
                Your basket
              </p>

              <h2 className="mt-3 font-serif text-3xl leading-tight text-[#243328]">
                {totalItems > 0
                  ? `${totalItems} item${totalItems === 1 ? "" : "s"} selected`
                  : "Your basket is empty"}
              </h2>

              <p className="mt-3 text-sm leading-7 text-[#667164]">
                Build a smaller, more useful weekly shop around the meals you
                actually cook.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/basket"
                  className="rounded-full bg-[#243328] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
                >
                  Review basket
                </Link>

                <Link
                  href="/saved-weeks"
                  className="rounded-full border border-[#d6cec2] bg-[#f7f2eb] px-5 py-3 text-sm text-[#243328] transition hover:bg-white"
                >
                  Saved weeks
                </Link>
              </div>
            </article>
          </div>

          <section id="weekly-boxes" className="mt-12">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
                  Weekly base
                </p>

                <h2 className="mt-2 font-serif text-[2rem] leading-tight text-[#243328] md:text-[2.65rem]">
                  Weekly fruit and veg boxes
                </h2>

                <p className="mt-3 max-w-3xl text-sm leading-7 text-[#667164] md:text-base">
                  A practical starting point for the week. Contents shift
                  slightly through the seasons depending on availability.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              {weeklyProduceBox ? (
                <ProductCard item={weeklyProduceBox} label="Smaller box" />
              ) : null}

              {familyProduceBox ? (
                <ProductCard item={familyProduceBox} label="Larger box" />
              ) : null}
            </div>
          </section>

          <div id="pantry-staples">
            <ProductSection
              title="Useful regulars"
              eyebrow="Cupboard staples"
              description="The everyday ingredients that help turn fresh produce into simple meals."
              items={cupboardItems}
              label="Regular staple"
            />
          </div>

          <ProductSection
            title="Small flavour boosts"
            eyebrow="Sauces and jars"
            description="A few stronger flavours for quick dinners, roast vegetables, beans and grains."
            items={pantryItems}
            label="Flavour jar"
          />

          <ProductSection
            title="Kitchen extras"
            eyebrow="Useful add-ons"
            description="Small extras for texture, richness and easy upgrades through the week."
            items={extraItems}
            label="Extra"
          />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
