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
    note: "Fast pantry dinner using beans, couscous and rose harissa.",
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

const orderSteps = [
  {
    number: "01",
    title: "Choose your box",
    text: "Pick the regular fruit and veg box that fits the way you cook.",
  },
  {
    number: "02",
    title: "Add only what helps",
    text: "Top up with pantry extras when you need them. No filler, no pressure.",
  },
  {
    number: "03",
    title: "Cook from what arrives",
    text: "Use quick recipe ideas to make the week feel easier.",
  },
];

const reasons = [
  {
    title: "Less supermarket drift",
    text: "A useful base of fresh food arrives each week or fortnight, so you are not starting from zero.",
  },
  {
    title: "Better everyday dinners",
    text: "Fresh produce, useful staples and simple ideas make midweek food less of a scramble.",
  },
  {
    title: "Flexible by design",
    text: "The box can repeat. Pantry extras are one-off unless you add them again.",
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
    const includesPreview =
      item.weeklyIncludes && item.weeklyIncludes.length > 0
        ? item.weeklyIncludes.slice(0, 4).join(", ")
        : "";

    return (
      <article className="overflow-hidden rounded-[30px] border border-[#ddd4c8] bg-white shadow-[0_12px_30px_rgba(36,51,40,0.06)]">
        <div className="h-56 overflow-hidden bg-[#f4efe9] sm:h-64">
          <img
            src={item.image || fallbackImage}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#7a806f]">
                {label}
              </p>

              <h3 className="mt-2 font-serif text-3xl leading-tight text-[#243328]">
                {item.name}
              </h3>
            </div>

            <p className="shrink-0 font-serif text-2xl text-[#243328]">
              {formatPrice(item.price)}
            </p>
          </div>

          <p className="mt-4 text-sm leading-7 text-[#667164] md:text-base">
            {item.description}
          </p>

          {item.details ? (
            <p className="mt-3 text-sm leading-6 text-[#5f675c]">
              {item.details}
            </p>
          ) : null}

          <div className="mt-5 border-t border-[#eee5d9] pt-5">
            <p className="text-sm font-medium text-[#243328]">Best for</p>

            <p className="mt-2 text-sm leading-7 text-[#667164]">
              {item.bestFor ?? bestFor}
            </p>

            {includesPreview ? (
              <p className="mt-3 text-sm leading-7 text-[#667164]">
                Typical box: {includesPreview}.
              </p>
            ) : null}
          </div>

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

          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.10)_0%,rgba(0,0,0,0.20)_38%,rgba(0,0,0,0.70)_100%)]" />

          <div className="relative z-10 mx-auto flex min-h-[78vh] max-w-7xl items-end px-4 pb-8 pt-28 sm:px-6 md:min-h-[82vh] md:px-10 md:pb-14">
            <div className="max-w-3xl">
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/78">
                Local fruit & veg delivery
              </p>

              <h1 className="mt-4 font-serif text-[2.8rem] leading-[0.96] tracking-tight text-white sm:text-[3.7rem] md:text-[5.4rem]">
                Better food in the house.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-white/90 md:text-lg">
                Seasonal fruit and veg boxes with optional pantry extras and
                quick meal ideas for the week ahead.
              </p>

              <p className="mt-4 max-w-xl text-sm leading-7 text-white/76">
                Delivered Tuesday and Wednesday across Lanark, Carluke and
                surrounding areas.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/shop"
                  className="rounded-full bg-white px-7 py-3 text-center text-sm font-medium text-[#243328] transition hover:bg-[#f4efe9]"
                >
                  Choose your box
                </Link>

                <a
                  href="#postcode-checker"
                  className="rounded-full border border-white/35 bg-white/10 px-7 py-3 text-center text-sm font-medium text-white backdrop-blur transition hover:bg-white/20"
                >
                  Check your postcode
                </a>
              </div>

              <p className="mt-4 text-xs leading-6 text-white/70">
                Weekly or fortnightly. Pause or cancel easily.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 md:px-10 md:py-14">
        <div className="mx-auto max-w-7xl">
          <section className="rounded-[32px] border border-[#ddd4c8] bg-white/82 p-5 shadow-[0_10px_28px_rgba(36,51,40,0.05)] md:p-8">
            <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
                  How it works
                </p>

                <h2 className="mt-3 font-serif text-[1.9rem] leading-tight text-[#243328] md:text-[2.7rem]">
                  Your box is regular. Everything else stays flexible.
                </h2>

                <p className="mt-4 text-sm leading-7 text-[#667164] md:text-base">
                  Start with fruit and veg, then add pantry staples only when
                  they are useful.
                </p>
              </div>

              <div className="grid gap-3">
                {orderSteps.map((step) => (
                  <article
                    key={step.number}
                    className="rounded-[24px] border border-[#e5dccf] bg-[#f8f4ee] p-5"
                  >
                    <div className="flex gap-4">
                      <p className="pt-1 font-serif text-2xl text-[#8b6f4e]">
                        {step.number}
                      </p>

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
            </div>
          </section>
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-6 md:px-10 md:pb-16">
        <div className="mx-auto max-w-7xl">
          <section className="rounded-[32px] border border-[#d9d0c4] bg-[#efe7db] p-5 shadow-[0_10px_28px_rgba(36,51,40,0.05)] md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
                  Choose your box
                </p>

                <h2 className="mt-3 max-w-3xl font-serif text-[2rem] leading-tight text-[#243328] md:text-[2.9rem]">
                  Fruit and veg for the way you actually cook.
                </h2>
              </div>

              <Link
                href="/shop"
                className="rounded-full bg-[#243328] px-6 py-3 text-center text-sm font-medium text-white transition hover:opacity-90"
              >
                View the shop
              </Link>
            </div>

            <div className="mt-7 grid gap-5 md:grid-cols-2">
              {weeklyProduceBox ? (
                <BoxCard
                  item={weeklyProduceBox}
                  label="Smaller household"
                  fallbackImage="/weekly-harvest-box.png"
                  bestFor="Smaller households, solo cooking, couples, or anyone wanting a useful regular produce base."
                />
              ) : null}

              {familyProduceBox ? (
                <BoxCard
                  item={familyProduceBox}
                  label="Bigger household"
                  fallbackImage="/family-harvest-box.png"
                  bestFor="Families, shared homes, and people who cook most nights."
                />
              ) : null}
            </div>
          </section>
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-6 md:px-10 md:pb-16">
        <div className="mx-auto max-w-7xl">
          <section className="overflow-hidden rounded-[32px] border border-[#d9d0c4] bg-white shadow-[0_10px_28px_rgba(36,51,40,0.05)]">
            <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
              <div className="relative min-h-[280px] overflow-hidden lg:min-h-[520px]">
                <img
                  src="/images/home/hero-image.png"
                  alt="Fresh produce and pantry staples"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>

              <div className="p-6 md:p-10 lg:p-12">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
                  Why it works
                </p>

                <h2 className="mt-3 font-serif text-[2rem] leading-tight text-[#243328] md:text-[3rem]">
                  Less supermarket reliance. More useful food at home.
                </h2>

                <p className="mt-5 text-sm leading-8 text-[#667164] md:text-base">
                  The Local Pantry is built for real weeks: busy days, quick
                  dinners, half-full cupboards and the need to make food feel
                  manageable again.
                </p>

                <div className="mt-8 grid gap-5">
                  {reasons.map((reason) => (
                    <article
                      key={reason.title}
                      className="border-t border-[#eadfd2] pt-5"
                    >
                      <h3 className="font-serif text-[1.45rem] leading-tight text-[#243328]">
                        {reason.title}
                      </h3>

                      <p className="mt-2 text-sm leading-7 text-[#667164]">
                        {reason.text}
                      </p>
                    </article>
                  ))}
                </div>

                <div className="mt-8">
                  <Link
                    href="/shop"
                    className="rounded-full bg-[#243328] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
                  >
                    Start with a box
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-6 md:px-10 md:pb-16">
        <div className="mx-auto max-w-7xl">
          <section className="rounded-[32px] border border-[#d9d0c4] bg-[#efe7db] p-6 shadow-[0_10px_28px_rgba(36,51,40,0.05)] md:p-10">
            <div className="mx-auto max-w-4xl text-center">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
                Pantry extras
              </p>

              <h2 className="mt-3 font-serif text-[2rem] leading-tight text-[#243328] md:text-[3rem]">
                Add the useful extras when you need them.
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-[#667164] md:text-base">
                Sauces, pastes, beans, grains, pasta and cupboard staples that
                make the produce easier to turn into dinner.
              </p>

              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#667164]">
                Pantry items are one-off additions unless you choose them again.
              </p>

              <div className="mt-7">
                <Link
                  href="/shop#pantry-staples"
                  className="rounded-full bg-[#243328] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
                >
                  Browse pantry extras
                </Link>
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

              <h2 className="mt-3 font-serif text-3xl leading-tight md:text-5xl">
                Quick ideas for the week ahead.
              </h2>

              <p className="mt-5 text-base leading-8 text-white/80">
                The planner suggests practical meals using seasonal produce and
                useful pantry extras, without turning dinner into a project.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/planner"
                  className="rounded-full bg-white px-6 py-3 text-center text-sm font-medium text-[#243328] transition hover:bg-[#f4efe9]"
                >
                  Explore the planner
                </Link>

                <Link
                  href="/shop"
                  className="rounded-full border border-white/25 bg-white/5 px-6 py-3 text-center text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Choose your box
                </Link>
              </div>
            </div>

            <div className="grid gap-4">
              {sampleWeek.map((item) => (
                <article
                  key={item.day}
                  className="flex gap-4 rounded-[24px] border border-white/10 bg-white/5 p-4 backdrop-blur transition hover:bg-white/[0.07]"
                >
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-[18px] border border-white/10 bg-white/5">
                    <img
                      src={item.image}
                      alt={item.meal}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs uppercase tracking-[0.14em] text-white/50">
                      {item.day}
                    </p>

                    <h3 className="mt-1 font-serif text-xl leading-tight text-white sm:text-2xl">
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
          <section className="rounded-[32px] border border-[#d9d0c4] bg-white/82 p-6 text-center shadow-[0_10px_28px_rgba(36,51,40,0.05)] md:p-10">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
              Local delivery
            </p>

            <h2 className="mx-auto mt-3 max-w-3xl font-serif text-[2rem] leading-tight text-[#243328] md:text-[3rem]">
              Delivered Tuesday and Wednesday across Lanark, Carluke and nearby
              areas.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-[#667164] md:text-base">
              Check your postcode before ordering. More areas will be added as
              demand grows.
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
