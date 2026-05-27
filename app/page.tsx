// FULL UPDATED HOMEPAGE
// Tightened structure for launch
// Reduced repetition and visual clutter
// Merged delivery + postcode messaging
// Cleaner premium rhythm

"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useCart } from "./cart-context";
import SiteHeader from "./components/SiteHeader";
import PostcodeChecker from "./components/PostcodeChecker";
import SiteFooter from "./components/SiteFooter";
import { type ShopDisplayItem, produceBoxes } from "./shop/shop-data";

const sampleWeek = [
  {
    day: "Monday",
    meal: "Harissa Butter Beans & Couscous",
    image: "/images/recipes/harissa-butterbeans-peppers-couscous.jpg",
    note: "A fast dinner using fresh veg and regular staples.",
  },
  {
    day: "Wednesday",
    meal: "Courgette Bucatini with Pesto",
    image: "/images/recipes/bucatini-courgette-pesto.jpg",
    note: "Weeknight pasta using what is already at home.",
  },
  {
    day: "Friday",
    meal: "Hot Honey Halloumi Couscous",
    image: "/images/recipes/hot-honey-halloumi-couscous.jpg",
    note: "Quick comfort food built around grains, herbs and veg.",
  },
];

const kitchenWeekStrip = [
  {
    label: "Delivery day",
    title: "Start with the box",
    text: "Fresh fruit and veg gives the week a simple starting point.",
    image: "/images/home/week-box-arrives.png",
    alt: "A fresh fruit and veg box on a kitchen counter",
  },
  {
    label: "Pantry extras",
    title: "Add what helps",
    text: "Add the regular staples you use most.",
    image: "/images/home/week-pantry-extras.png",
    alt: "Pantry jars and dry goods beside fresh vegetables",
  },
  {
    label: "Meal planning",
    title: "Know what’s for dinner",
    text: "Keep weekday meals realistic and simple.",
    image: "/images/home/week-planner-counter.png",
    alt: "A phone showing a meal planner beside vegetables and pantry staples",
  },
  {
    label: "Midweek cooking",
    title: "Use the same ingredients",
    text: "Use what you already have before adding more.",
    image: "/images/home/week-midweek-cooking.png",
    alt: "Simple midweek cooking with chopped vegetables and pantry staples",
  },
  {
    label: "Repeat what works",
    title: "Make next week easier",
    text: "Keep your regulars close and repeat what works.",
    image: "/images/home/week-repeat-regulars.png",
    alt: "A calm kitchen counter with remaining produce, jars and a meal note",
  },
];

function formatPrice(value: number) {
  return `£${value.toFixed(2)}`;
}

export default function HomePage() {
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

  function renderAddControls(item: ShopDisplayItem) {
    const quantity = getQuantity(item.name);

    if (quantity === 0) {
      return (
        <button
          type="button"
          onClick={() => addDisplayItemToCart(item)}
          className="inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-[#243328] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 sm:w-auto"
        >
          Add to basket
        </button>
      );
    }

    return (
      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
        <div className="inline-flex items-center self-start overflow-hidden rounded-full border border-[#d8d0c4] bg-white/88">
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

  function BoxCard({
    item,
    label,
    fallbackImage,
  }: {
    item: ShopDisplayItem;
    label: string;
    fallbackImage: string;
  }) {
    return (
      <article className="overflow-hidden rounded-[30px] bg-white/85 shadow-[0_10px_28px_rgba(36,51,40,0.06)]">
        <div className="h-64 overflow-hidden bg-[#f4efe9]">
          <img
            src={item.image || fallbackImage}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="p-6">
          <div className="flex items-center gap-2">
            <p className="inline-flex rounded-full bg-[#243328] px-3 py-1 text-xs text-white">
              {formatPrice(item.price)}
            </p>

            <p className="text-xs uppercase tracking-[0.14em] text-[#667164]">
              {label}
            </p>
          </div>

          <h3 className="mt-5 font-serif text-3xl text-[#243328]">
            {item.name}
          </h3>

          <p className="mt-3 text-sm leading-7 text-[#667164] md:text-base">
            {item.description}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {renderAddControls(item)}

            <Link
              href="/basket"
              className="text-sm text-[#5f675c] underline underline-offset-4 transition hover:text-[#243328]"
            >
              Review basket{totalItems > 0 ? ` (${totalItems})` : ""}
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4efe9] text-[#243328]">
      <SiteHeader />

      <section className="relative overflow-hidden bg-[#243328] text-white">
        <div className="relative min-h-[68vh] md:min-h-[82vh]">
          <picture>
            <source
              media="(max-width: 768px)"
              srcSet="/images/home/mobile-pantry-hero.png"
            />

            <img
              src="/images/home/pantry-kitchen-scene-wide.png"
              alt="The Local Pantry fruit, veg and pantry staples"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          </picture>

          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.12)_0%,rgba(0,0,0,0.18)_34%,rgba(0,0,0,0.68)_100%)]" />

          <div className="relative z-10 mx-auto flex min-h-[68vh] max-w-7xl items-end px-4 pb-8 pt-28 sm:px-6 md:min-h-[82vh] md:px-10 md:pb-14">
            <div className="max-w-3xl">
              <p className="inline-flex rounded-full border border-white/35 bg-white/15 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-white backdrop-blur">
                Local fruit & veg delivery
              </p>

              <h1 className="mt-5 font-serif text-[2.5rem] leading-[0.98] tracking-tight text-white sm:text-[3.8rem] md:text-[5.3rem]">
                Make everyday cooking easier.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-white/90 md:text-lg">
                Weekly fruit and veg delivery with optional regular staples and
                simple weekday meal support.
              </p>

              <div className="mt-6 inline-flex rounded-full border border-white/20 bg-white/10 px-5 py-3 backdrop-blur">
                <p className="text-sm text-white/82">
                  Delivered every Monday and Tuesday across Lanark, Carluke and
                  surrounding areas.
                </p>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/shop"
                  className="rounded-full bg-white px-7 py-3 text-center text-sm font-medium text-[#243328] transition hover:bg-[#f4efe9]"
                >
                  Choose your box
                </Link>

                <Link
                  href="/planner"
                  className="rounded-full border border-white/35 bg-white/10 px-7 py-3 text-center text-sm font-medium text-white backdrop-blur transition hover:bg-white/20"
                >
                  Start planning meals
                </Link>
              </div>

              <p className="mt-4 text-xs leading-6 text-white/72">
                Weekly or fortnightly. Pause or cancel anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 md:px-10 md:py-14">
        <div className="mx-auto max-w-7xl">
          <section className="overflow-hidden rounded-[34px] bg-[#efe7db] shadow-[0_12px_34px_rgba(36,51,40,0.06)]">
            <div className="p-6 md:p-9 lg:p-10">
              <div className="grid gap-6 lg:grid-cols-[0.72fr_0.28fr] lg:items-end">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
                    A week in the kitchen
                  </p>

                  <h2 className="mt-3 max-w-4xl font-serif text-[2.35rem] leading-[0.98] tracking-tight text-[#243328] sm:text-[3rem] md:text-[3.6rem] lg:text-[4.1rem]">
                    The box is the base. The planner keeps it simple.
                  </h2>

                  <p className="mt-5 max-w-2xl text-sm leading-8 text-[#667164] md:text-base">
                    Fruit and veg delivery, regular staples and simple meal
                    support working together — so the week feels easier, not
                    more complicated.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-[#ded4c6] bg-[#f6f1ea]/60">
              <div className="flex items-center justify-between px-5 pt-4 lg:hidden">
                <p className="text-[11px] uppercase tracking-[0.16em] text-[#6b776c]">
                  Swipe through the week
                </p>

                <span className="text-lg text-[#6b776c]">→</span>
              </div>

              <div className="relative">
                <div className="flex snap-x gap-3 overflow-x-auto p-4 pr-12 sm:p-5 sm:pr-16 lg:grid lg:grid-cols-5 lg:overflow-visible lg:p-5">
                  {kitchenWeekStrip.map((item) => (
                    <article
                      key={item.title}
                      className="min-w-[82%] snap-start overflow-hidden rounded-[26px] bg-white shadow-[0_8px_22px_rgba(36,51,40,0.06)] sm:min-w-[46%] lg:min-w-0"
                    >
                      <div className="h-48 overflow-hidden bg-[#e8dfd3] sm:h-52 lg:h-44 xl:h-48">
                        <img
                          src={item.image}
                          alt={item.alt}
                          className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]"
                        />
                      </div>

                      <div className="p-4 lg:min-h-[150px]">
                        <p className="text-[10px] uppercase tracking-[0.16em] text-[#7a8478]">
                          {item.label}
                        </p>

                        <h3 className="mt-2 font-serif text-[1.45rem] leading-tight text-[#243328] lg:text-[1.35rem] xl:text-[1.5rem]">
                          {item.title}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-[#667164] lg:text-[13px] lg:leading-6 xl:text-sm">
                          {item.text}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="pointer-events-none absolute right-0 top-0 h-full w-14 bg-gradient-to-l from-[#f6f1ea] to-transparent lg:hidden" />
              </div>
            </div>
          </section>
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-6 md:px-10 md:pb-16">
        <div className="mx-auto max-w-7xl">
          <section className="rounded-[32px] bg-[#efe7db] p-6 shadow-[0_10px_28px_rgba(36,51,40,0.05)] md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
                  Choose your box
                </p>

                <h2 className="mt-3 max-w-3xl font-serif text-[1.9rem] leading-tight text-[#243328] md:text-[2.8rem]">
                  Start with the fruit and veg box.
                </h2>
              </div>
            </div>

            <div className="mt-7 grid gap-5 md:grid-cols-2">
              {weeklyProduceBox ? (
                <BoxCard
                  item={weeklyProduceBox}
                  label="Smaller box"
                  fallbackImage="/weekly-harvest-box-v2.png"
                />
              ) : null}

              {familyProduceBox ? (
                <BoxCard
                  item={familyProduceBox}
                  label="Larger box"
                  fallbackImage="/family-harvest-box-v2.png"
                />
              ) : null}
            </div>
          </section>
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-6 md:px-10 md:pb-16">
        <div className="mx-auto max-w-7xl">
          <section className="overflow-hidden rounded-[32px] bg-[#243328] text-white shadow-[0_10px_28px_rgba(36,51,40,0.08)]">
            <div className="grid gap-0 lg:grid-cols-[1fr_0.95fr]">
              <div className="p-6 md:p-10 lg:p-14">
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">
                  Designed for repeat use
                </p>

                <h2 className="mt-4 max-w-2xl font-serif text-[2.1rem] leading-tight text-white md:text-[3.5rem]">
                  Keep useful food in the house.
                </h2>

                <p className="mt-6 max-w-2xl text-sm leading-8 text-white/78 md:text-base">
                  Fresh produce, regular staples and simple meal support without
                  the big weekly supermarket shop.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/shop#pantry-staples"
                    className="rounded-full bg-white px-6 py-3 text-center text-sm font-medium text-[#243328] transition hover:bg-[#f4efe9]"
                  >
                    Browse regular staples
                  </Link>
                </div>
              </div>

              <div className="relative min-h-[340px] lg:min-h-full">
                <img
                  src="/images/home/pantry-kitchen-scene-wide.png"
                  alt="Fresh produce and pantry staples"
                  className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05)_0%,rgba(0,0,0,0.38)_100%)]" />
              </div>
            </div>
          </section>
        </div>
      </section>

      <section className="bg-[#243328] px-4 py-14 text-white sm:px-6 md:px-10 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-white/60">
                Built around normal home cooking
              </p>

              <h2 className="mt-3 font-serif text-3xl md:text-5xl">
                Simple meals for the week ahead.
              </h2>

              <p className="mt-5 text-base leading-8 text-white/80">
                Simple meal ideas built around seasonal produce and regular
                staples — without turning dinner into a project.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/planner"
                  className="rounded-full bg-white px-6 py-3 text-sm font-medium text-[#243328] transition hover:bg-[#f4efe9]"
                >
                  Start planning meals
                </Link>
              </div>
            </div>

            <div className="grid gap-4">
              {sampleWeek.map((item) => (
                <article
                  key={item.day}
                  className="flex items-center gap-4 rounded-[24px] border border-white/10 bg-white/5 p-4 backdrop-blur transition hover:bg-white/[0.07]"
                >
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-[18px] border border-white/10 bg-white/5">
                    <img
                      src={item.image}
                      alt={item.meal}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm uppercase tracking-[0.12em] text-white/50">
                      {item.day}
                    </p>

                    <h3 className="mt-1 font-serif text-2xl leading-tight text-white">
                      {item.meal}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-white/65">
                      {item.note}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 md:px-10 md:py-18">
        <div className="mx-auto max-w-5xl">
          <section className="rounded-[32px] bg-white/82 p-6 text-center shadow-[0_10px_28px_rgba(36,51,40,0.05)] md:p-10">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
              Local delivery
            </p>

            <h2 className="mx-auto mt-3 max-w-3xl font-serif text-[2rem] leading-tight text-[#243328] md:text-[3.1rem]">
              Delivered across Lanark, Carluke and surrounding areas.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-[#667164] md:text-base">
              Deliveries currently run every Monday and Tuesday. More areas will
              be added as the service grows.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/shop"
                className="rounded-full bg-[#243328] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
              >
                Choose your box
              </Link>

              <a
                href="#postcode-checker"
                className="rounded-full border border-[#d3cabd] bg-[#f7f2eb] px-6 py-3 text-sm font-medium text-[#243328] transition hover:bg-white"
              >
                Check your postcode
              </a>
            </div>
          </section>
        </div>
      </section>

      <PostcodeChecker />

      <SiteFooter />
    </main>
  );
}
