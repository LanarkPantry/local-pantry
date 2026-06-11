"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useCart } from "../cart-context";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import {
  type ShopDisplayItem,
  cupboardItems,
  dryGoodsItems,
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

  function getShortLine(item: ShopDisplayItem) {
    if (item.name === "Sorrel & Walnut Pesto") return "Fresh & herbaceous";
    if (item.name === "Rose Harissa Paste") return "Warm & fragrant";
    if (item.name === "Vegetable Stock") return "Deep savoury base";
    if (item.name === "Gochujang Sauce") return "Sweet, savoury & spicy";

    if (item.name === "Farro") return "Nutty ancient grain";
    if (item.name === "Polenta") return "Italian cornmeal";
    if (item.name === "Bucatini") return "Hollow pasta";
    if (item.name === "Casarecce Pasta") return "Twisted pasta";
    if (item.name === "Orzo Pasta") return "Rice-shaped pasta";
    if (item.name === "Giant Couscous") return "Pearl pasta";
    if (item.name === "Puy Lentils") return "Rich & peppery";
    if (item.name === "Risotto Rice") return "For creamy risotto";

    if (item.name === "Blanched Almonds") return "For baking & breakfasts";
    if (item.name === "Walnuts") return "Great with salads";
    if (item.name === "Hazelnuts") return "Perfect for baking";
    if (item.name === "Cashews") return "Soft, rich & useful";

    if (item.name.includes("Butter Beans")) return "Large & creamy";
    if (item.name.includes("Chickpeas")) return "Pantry essential";
    if (item.name.includes("White Beans")) return "Creamy white beans";
    if (item.name === "Mutti Polpa Tomatoes") return "Sauce base";

    if (item.name === "Weekly Produce Box") return "Fruit & veg for the week";
    if (item.name === "Family Produce Box") return "For fuller weekly cooking";

    return item.description;
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

  function renderAddControls(item: ShopDisplayItem) {
    const quantity = getQuantity(item.name);

    if (quantity === 0) {
      return (
        <button
          type="button"
          onClick={() => addDisplayItemToCart(item)}
          className="mt-4 inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-[#243328] px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
        >
          {item.buttonLabel ?? "Add"}
        </button>
      );
    }

    return (
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="inline-flex items-center overflow-hidden rounded-full border border-[#d8d0c4] bg-white/90">
          <button
            type="button"
            onClick={() => removeOneFromCart(item.name)}
            className="cursor-pointer px-3 py-1.5 text-lg text-[#243328] transition hover:bg-[#f4efe9]"
          >
            −
          </button>

          <span className="min-w-[2rem] text-center text-sm font-medium text-[#243328]">
            {quantity}
          </span>

          <button
            type="button"
            onClick={() => addDisplayItemToCart(item)}
            className="cursor-pointer px-3 py-1.5 text-lg text-[#243328] transition hover:bg-[#f4efe9]"
          >
            +
          </button>
        </div>

        <span className="text-xs text-[#6b776c]">{quantity} in basket</span>
      </div>
    );
  }

  function ProductCard({
    item,
    label,
    large = false,
  }: {
    item: ShopDisplayItem;
    label: string;
    large?: boolean;
  }) {
    return (
      <article className="overflow-hidden rounded-[24px] border border-[#ddd4c8] bg-white/82 shadow-[0_8px_20px_rgba(36,51,40,0.045)] transition hover:-translate-y-0.5 hover:bg-white">
        <div
          className={
            large
              ? "grid gap-0 sm:grid-cols-[190px_1fr]"
              : "grid grid-cols-[116px_1fr] gap-0 sm:grid-cols-[170px_1fr]"
          }
        >
          <div className="border-r border-[#e9dfd2] bg-[#eee7dc]/70 p-3 sm:p-4">
            <div
              className={
                large
                  ? "flex min-h-[150px] items-center justify-center rounded-[18px] bg-[#f8f4ee]/95 p-3 sm:min-h-[185px]"
                  : "flex min-h-[118px] items-center justify-center rounded-[18px] bg-[#f8f4ee]/95 p-2 sm:min-h-[145px]"
              }
            >
              <img
                src={item.image}
                alt={item.name}
                className={
                  large
                    ? "max-h-[145px] w-full object-contain sm:max-h-[165px]"
                    : "max-h-[105px] w-full object-contain sm:max-h-[130px]"
                }
              />
            </div>
          </div>

          <div className="flex flex-col justify-between p-4 sm:p-5">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[10px] uppercase tracking-[0.16em] text-[#6b776c]">
                  {label}
                </p>

                {item.weight ? (
                  <span className="rounded-full border border-[#e0d6ca] bg-[#f7f2eb] px-2.5 py-0.5 text-xs text-[#5f675c]">
                    {item.weight}
                  </span>
                ) : null}
              </div>

              <h3 className="mt-2 font-serif text-[1.25rem] leading-tight text-[#243328] sm:text-[1.65rem]">
                {item.name}
              </h3>

              <p className="mt-1 text-xs leading-5 text-[#6b776c] sm:text-sm">
                {getShortLine(item)}
              </p>

              <div className="mt-3">
                <span className="inline-flex rounded-full border border-[#ddd4c8] bg-white/90 px-3 py-1.5 text-sm font-medium text-[#243328]">
                  {formatPrice(item.price)}
                </span>
              </div>

              {large && item.checkoutType === "subscription" ? (
                <p className="mt-3 text-xs leading-5 text-[#6b776c]">
                  Weekly or fortnightly. Pause, skip or cancel anytime.
                </p>
              ) : null}
            </div>

            {renderAddControls(item)}
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
      <section className="mt-10">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#6b776c]">
              {eyebrow}
            </p>

            <h2 className="mt-1 font-serif text-[1.8rem] leading-tight text-[#243328] md:text-[2.35rem]">
              {title}
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#667164]">
              {description}
            </p>
          </div>

          <Link
            href="/basket"
            className="text-sm text-[#5f675c] underline underline-offset-4 transition hover:text-[#243328]"
          >
            Basket{totalItems > 0 ? ` (${totalItems})` : ""}
          </Link>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {items.map((item) => (
            <ProductCard key={item.name} item={item} label={label} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4efe9] text-[#243328]">
      <SiteHeader />

      <section className="px-4 py-4 sm:px-6 md:px-10 md:py-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr] lg:items-stretch">
            <article className="order-1 overflow-hidden rounded-[28px] border border-[#ddd4c8] bg-white/80 shadow-[0_10px_24px_rgba(36,51,40,0.05)] lg:order-2">
              <img
                src="/images/home/local-delivery.jpg"
                alt="A Local Pantry delivery with fresh produce and pantry staples"
                className="h-auto w-full object-contain lg:h-full lg:min-h-[310px] lg:object-cover"
              />
            </article>

            <article className="order-2 rounded-[28px] border border-[#ddd4c8] bg-[#f7f2eb]/86 p-5 shadow-[0_10px_24px_rgba(36,51,40,0.055)] md:p-8 lg:order-1">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#6b776c]">
                Shop
              </p>

              <h1 className="mt-3 max-w-3xl font-serif text-[2.1rem] leading-[1.02] tracking-tight text-[#243328] md:text-[4rem]">
                Start with the box. Add what helps.
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-[#667164] md:text-base md:leading-7">
                Choose a weekly fruit and veg box, then add jars, dry goods and
                cupboard staples when you need them.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#weekly-boxes"
                  className="rounded-full bg-[#243328] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
                >
                  Choose your box
                </a>

                <Link
                  href="/basket"
                  className="rounded-full border border-[#d6cec2] bg-white/80 px-5 py-2.5 text-sm text-[#243328] transition hover:bg-white"
                >
                  Basket{totalItems > 0 ? ` (${totalItems})` : ""}
                </Link>
              </div>
            </article>
          </div>

          <section id="weekly-boxes" className="mt-10">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#6b776c]">
                Weekly base
              </p>

              <h2 className="mt-1 font-serif text-[1.8rem] leading-tight text-[#243328] md:text-[2.35rem]">
                Weekly fruit and veg boxes
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#667164]">
                A practical starting point for the week. Contents shift slightly
                with the seasons.
              </p>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {weeklyProduceBox ? (
                <ProductCard
                  item={weeklyProduceBox}
                  label="Smaller box"
                  large
                />
              ) : null}

              {familyProduceBox ? (
                <ProductCard item={familyProduceBox} label="Larger box" large />
              ) : null}
            </div>
          </section>

          <ProductSection
            title="Small-batch pantry jars"
            eyebrow="Made fresh to order in-house"
            description="Pesto, harissa, stock and gochujang for fast flavour."
            items={pantryItems}
            label="Pantry jar"
          />

          <div id="pantry-staples">
            <ProductSection
              title="Dry goods"
              eyebrow="Cupboard staples"
              description="Pasta, grains, rice and lentils for everyday cooking."
              items={dryGoodsItems}
              label="Dry good"
            />
          </div>

          <ProductSection
            title="Nuts and extras"
            eyebrow="Useful add-ons"
            description="Texture, richness and easy upgrades through the week."
            items={extraItems}
            label="Extra"
          />

          <ProductSection
            title="Beans and tomatoes"
            eyebrow="Cupboard essentials"
            description="Ready-to-use jars and tins for quick dinners."
            items={cupboardItems}
            label="Cupboard staple"
          />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
