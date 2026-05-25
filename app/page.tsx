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
    note: "Fast pantry dinner using optional add-ons like beans, couscous and harissa.",
  },
  {
    day: "Wednesday",
    meal: "Courgette Bucatini with Pesto",
    image: "/images/recipes/bucatini-courgette-pesto.jpg",
    note: "A quick pasta built around fresh veg and a useful pantry jar.",
  },
  {
    day: "Friday",
    meal: "Hot Honey Halloumi Couscous",
    image: "/images/recipes/hot-honey-halloumi-couscous.jpg",
    note: "Flexible Friday food using grains, herbs, veg and something punchy.",
  },
];

const benefits = [
  {
    title: "Fewer supermarket trips",
    text: "Keep a useful base of fresh food coming in without relying on last-minute supermarket runs.",
    icon: "🛒",
  },
  {
    title: "Easier weeknight cooking",
    text: "Get quick meal inspiration that works with the kind of food you already have at home.",
    icon: "🍽️",
  },
  {
    title: "Better pantry add-ons",
    text: "Add sauces, pastes, beans, grains and cupboard staples that are not always easy to find locally.",
    icon: "🥫",
  },
  {
    title: "Flexible subscription",
    text: "Choose weekly or fortnightly, then pause or cancel easily when your plans change.",
    icon: "↻",
  },
];

const orderSteps = [
  {
    number: "1",
    title: "Choose a box",
    text: "Fruit and veg weekly or fortnightly.",
  },
  {
    number: "2",
    title: "Add extras",
    text: "Pantry items only when useful.",
  },
  {
    number: "3",
    title: "Cook easier",
    text: "Quick ideas for the week ahead.",
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
          {item.buttonLabel ?? "Add to basket"}
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
            aria-label={`Decrease quantity of ${item.name}`}
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
            aria-label={`Increase quantity of ${item.name}`}
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
    bestFor,
  }: {
    item: ShopDisplayItem;
    label: string;
    fallbackImage: string;
    bestFor: string;
  }) {
    return (
      <article className="overflow-hidden rounded-[30px] border border-[#ddd4c8] bg-white/78">
        <div className="h-64 overflow-hidden bg-[#f4efe9]">
          <img
            src={item.image || fallbackImage}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="p-6">
          <div className="flex flex-wrap items-center gap-2">
            <p className="inline-flex rounded-full bg-[#243328] px-3 py-1 text-xs text-white">
              {formatPrice(item.price)}
            </p>

            <p className="inline-flex rounded-full border border-[#ddd4c8] bg-white/88 px-3 py-1 text-xs text-[#5f675c]">
              {label}
            </p>
          </div>

          <h3 className="mt-5 font-serif text-3xl text-[#243328]">
            {item.name}
          </h3>

          <p className="mt-3 text-sm leading-7 text-[#667164] md:text-base">
            {item.description}
          </p>

          {item.details ? (
            <p className="mt-2 text-sm leading-6 text-[#5f675c]">
              {item.details}
            </p>
          ) : null}

          <p className="mt-5 text-sm font-medium text-[#243328]">Best for:</p>

          <p className="mt-2 text-sm leading-7 text-[#667164]">
            {item.bestFor ?? bestFor}
          </p>

          {item.weeklyIncludes && item.weeklyIncludes.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {item.weeklyIncludes.map((included) => (
                <span
                  key={included}
                  className="rounded-full border border-[#ddd4c8] bg-[#f7f2eb] px-3 py-1.5 text-xs text-[#4f5e52]"
                >
                  {included}
                </span>
              ))}
            </div>
          ) : null}

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
        <div className="relative min-h-[78vh] md:min-h-[82vh]">
          <img
            src="/images/home/hero-image.png"
            alt="The Local Pantry fruit and veg box with pantry extras"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.12)_0%,rgba(0,0,0,0.18)_34%,rgba(0,0,0,0.68)_100%)]" />

          <div className="relative z-10 mx-auto flex min-h-[78vh] max-w-7xl items-end px-4 pb-8 pt-28 sm:px-6 md:min-h-[82vh] md:px-10 md:pb-14">
            <div className="max-w-3xl">
              <p className="inline-flex rounded-full border border-white/35 bg-white/15 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-white backdrop-blur">
                Local fruit & veg delivery
              </p>

              <h1 className="mt-5 font-serif text-[2.75rem] leading-[0.98] tracking-tight text-white sm:text-[3.6rem] md:text-[5.2rem]">
                Make everyday cooking easier.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-white/90 md:text-lg">
                Weekly fruit and veg delivery with optional pantry extras and
                quick meal inspiration for the week ahead.
              </p>

              <div className="mt-5 rounded-[24px] border border-white/20 bg-white/12 p-4 backdrop-blur">
                <p className="text-sm leading-7 text-white/86">
                  Delivered every Tuesday and Wednesday across Lanark, Carluke
                  and surrounding areas.
                </p>
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/shop"
                  className="rounded-full bg-white px-7 py-3 text-center text-sm font-medium text-[#243328] transition hover:bg-[#f4efe9]"
                >
                  Choose your box
                </Link>

                <Link
                  href="/shop#pantry-staples"
                  className="rounded-full border border-white/35 bg-white/10 px-7 py-3 text-center text-sm font-medium text-white backdrop-blur transition hover:bg-white/20"
                >
                  Browse pantry extras
                </Link>
              </div>

              <p className="mt-4 text-xs leading-6 text-white/72">
                Choose weekly or fortnightly. Pause or cancel easily.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 md:px-10 md:py-14">
        <div className="mx-auto max-w-7xl">
          <section className="rounded-[32px] border border-[#ddd4c8] bg-white/80 p-5 shadow-[0_10px_28px_rgba(36,51,40,0.05)] md:p-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
                  How orders work
                </p>

                <h2 className="mt-3 font-serif text-[1.8rem] leading-tight text-[#243328] md:text-[2.4rem]">
                  Your box is the regular part. Everything else is flexible.
                </h2>
              </div>

              <Link
                href="/shop"
                className="rounded-full bg-[#243328] px-6 py-3 text-center text-sm font-medium text-white transition hover:opacity-90"
              >
                Start with a box
              </Link>
            </div>

            <div className="mt-7 grid gap-3 md:grid-cols-3">
              {orderSteps.map((step) => (
                <article
                  key={step.number}
                  className="rounded-[24px] border border-[#e5dccf] bg-[#f8f4ee]/85 p-5"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#243328] text-sm font-medium text-white">
                      {step.number}
                    </div>

                    <div>
                      <h3 className="font-serif text-[1.35rem] leading-tight text-[#243328]">
                        {step.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-[#667164]">
                        {step.text}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-5 rounded-[22px] border border-[#ddd4c8] bg-white/70 px-5 py-4">
              <p className="text-sm leading-7 text-[#667164]">
                Only your fruit and veg box repeats. Pantry extras are one-off
                unless you add them again.
              </p>
            </div>
          </section>
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-6 md:px-10 md:pb-16">
        <div className="mx-auto max-w-7xl">
          <section className="rounded-[32px] border border-[#d9d0c4] bg-[#efe7db] p-6 shadow-[0_10px_28px_rgba(36,51,40,0.05)] md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
                  Choose your box
                </p>

                <h2 className="mt-3 max-w-3xl font-serif text-[1.9rem] leading-tight text-[#243328] md:text-[2.7rem]">
                  Fruit and veg for the way you cook.
                </h2>
              </div>

              <Link
                href="/shop"
                className="rounded-full bg-[#243328] px-6 py-3 text-center text-sm font-medium text-white transition hover:opacity-90"
              >
                View all shop items
              </Link>
            </div>

            <div className="mt-7 grid gap-5 md:grid-cols-2">
              {weeklyProduceBox ? (
                <BoxCard
                  item={weeklyProduceBox}
                  label="Smaller box"
                  fallbackImage="/weekly-harvest-box.png"
                  bestFor="Smaller households, solo cooking, couples, or anyone wanting a useful regular produce base."
                />
              ) : null}

              {familyProduceBox ? (
                <BoxCard
                  item={familyProduceBox}
                  label="Larger box"
                  fallbackImage="/family-harvest-box.png"
                  bestFor="Families, shared homes, and people who cook most nights."
                />
              ) : null}
            </div>

            <div className="mt-6 rounded-[24px] border border-[#ddd4c8] bg-white/60 p-5">
              <p className="text-sm leading-7 text-[#667164]">
                Both boxes can be weekly or fortnightly. You can pause or cancel
                easily, and cupboard staples can be added as one-off extras.
              </p>
            </div>
          </section>
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-6 md:px-10 md:pb-16">
        <div className="mx-auto max-w-7xl">
          <section className="rounded-[32px] border border-[#d9d0c4] bg-white/78 p-6 shadow-[0_10px_28px_rgba(36,51,40,0.05)] md:p-8">
            <div className="max-w-3xl">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
                Why people use it
              </p>

              <h2 className="mt-3 font-serif text-[1.9rem] leading-tight text-[#243328] md:text-[2.7rem]">
                Less supermarket reliance. More useful food at home.
              </h2>

              <p className="mt-5 max-w-2xl text-sm leading-8 text-[#667164] md:text-base">
                The Local Pantry is for people who want better everyday food
                without needing to plan everything from scratch after a busy
                day.
              </p>
            </div>

            <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {benefits.map((benefit) => (
                <article
                  key={benefit.title}
                  className="rounded-[24px] border border-[#e5dccf] bg-[#f8f4ee]/85 p-5"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl">
                    {benefit.icon}
                  </div>

                  <h3 className="mt-4 font-serif text-[1.35rem] leading-tight text-[#243328]">
                    {benefit.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#667164]">
                    {benefit.text}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-6 md:px-10 md:pb-16">
        <div className="mx-auto max-w-7xl">
          <section className="overflow-hidden rounded-[32px] border border-[#d9d0c4] bg-[#efe7db] shadow-[0_10px_28px_rgba(36,51,40,0.05)]">
            <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="p-6 md:p-10">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
                  Pantry extras
                </p>

                <h2 className="mt-3 font-serif text-[2rem] leading-tight text-[#243328] md:text-[3rem]">
                  Add the useful extras when you need them.
                </h2>

                <p className="mt-5 max-w-2xl text-sm leading-8 text-[#667164] md:text-base">
                  Pantry add-ons are there to make cooking easier: sauces,
                  pastes, beans, grains, pasta and harder-to-find cupboard
                  staples.
                </p>

                <div className="mt-6 rounded-[24px] border border-[#ddd4c8] bg-white/65 p-5">
                  <p className="text-sm font-medium text-[#243328]">
                    Only the box repeats.
                  </p>

                  <p className="mt-2 text-sm leading-7 text-[#667164]">
                    Pantry extras are one-off unless you add them again.
                  </p>
                </div>

                <div className="mt-7">
                  <Link
                    href="/shop#pantry-staples"
                    className="rounded-full bg-[#243328] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
                  >
                    Browse pantry extras
                  </Link>
                </div>
              </div>

              <div className="relative min-h-[320px] overflow-hidden">
                <img
                  src="/images/home/hero-image.png"
                  alt="Pantry extras with fresh produce"
                  className="absolute inset-0 h-full w-full object-cover"
                />
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
                Meal inspiration
              </p>

              <h2 className="mt-3 font-serif text-3xl md:text-5xl">
                Quick ideas for the week ahead.
              </h2>

              <p className="mt-5 text-base leading-8 text-white/80">
                The planner is there when you want inspiration. It suggests
                practical meals using seasonal produce and useful pantry extras,
                without turning dinner into a project.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/planner"
                  className="rounded-full bg-white px-6 py-3 text-sm font-medium text-[#243328] transition hover:bg-[#f4efe9]"
                >
                  Explore the planner
                </Link>

                <Link
                  href="/shop"
                  className="rounded-full border border-white/25 bg-white/5 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Choose your box
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

      <section className="px-4 py-12 sm:px-6 md:px-10 md:py-16">
        <div className="mx-auto max-w-7xl">
          <section className="rounded-[32px] border border-[#d9d0c4] bg-white/78 p-6 text-center shadow-[0_10px_28px_rgba(36,51,40,0.05)] md:p-10">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
              Local delivery
            </p>

            <h2 className="mx-auto mt-3 max-w-3xl font-serif text-[2rem] leading-tight text-[#243328] md:text-[3rem]">
              Delivered Tuesday and Wednesday across Lanark, Carluke and
              surrounding areas.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-[#667164] md:text-base">
              More areas will be added as demand grows. Check your postcode or
              register interest if you are just outside the current delivery
              area.
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
                className="rounded-full border border-[#d3cabd] bg-white/70 px-6 py-3 text-sm font-medium text-[#243328] transition hover:bg-white"
              >
                Check delivery area
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
