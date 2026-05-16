"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useCart } from "./cart-context";

const steps = [
  {
    title: "Choose your weekly box",
    text: "Start with seasonal produce designed around realistic home cooking.",
  },
  {
    title: "Get matched meal ideas",
    text: "The planner helps turn the box into proper meals for the week.",
  },
  {
    title: "Add only what you need",
    text: "Pantry extras, beans, grains, sauces and cupboard staples can be added around the plan.",
  },
  {
    title: "Build your rotation",
    text: "Save meals you like and gradually build your own library of reliable dinners.",
  },
];

const benefits = [
  "Fewer food decisions",
  "Less wasted produce",
  "Repeatable favourites",
  "Basket-aware planning",
  "Pantry-led meals",
  "Flexible weeknight cooking",
];

export default function HomePage() {
  const { cart } = useCart();
  const totalItems = useMemo(() => cart.length, [cart]);

  return (
    <main className="min-h-screen bg-[#f4efe9] text-[#243328]">
      <header className="sticky top-0 z-30 border-b border-[rgba(230,221,210,0.92)] bg-[rgba(244,239,233,0.86)] backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 md:px-10">
          <Link
            href="/"
            className="text-[11px] tracking-[0.28em] text-[#60705f] hover:text-[#243328] sm:text-sm"
          >
            THE LOCAL PANTRY
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/" className="text-sm underline underline-offset-4">
              Home
            </Link>
            <Link
              href="/shop"
              className="text-sm text-[#4f5e52] hover:text-[#243328]"
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
              href="/planner"
              className="text-sm text-[#4f5e52] hover:text-[#243328]"
            >
              Planner
            </Link>
            <Link
              href="/basket"
              className="text-sm text-[#4f5e52] hover:text-[#243328]"
            >
              Basket{totalItems > 0 ? ` (${totalItems})` : ""}
            </Link>
          </nav>

          <Link
            href="/planner"
            className="rounded-full bg-[#243328] px-4 py-2 text-sm text-white"
          >
            Start planning
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <img
          src="/hero.jpg"
          alt="The Local Pantry"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.18)_0%,rgba(0,0,0,0.38)_58%,rgba(0,0,0,0.58)_100%)]" />

        <div className="relative z-10 mx-auto flex min-h-[76vh] max-w-7xl items-end px-4 pb-12 sm:px-6 md:px-10">
          <div className="max-w-3xl text-white">
            <p className="mb-4 inline-flex rounded-full border border-white/35 bg-white/12 px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/90 backdrop-blur">
              A veg box that comes with a plan
            </p>

            <h1 className="font-serif text-4xl leading-tight md:text-6xl">
              Your weekly box, already matched to meals you’ll actually want to
              cook.
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/90">
              Seasonal produce, useful pantry staples and a flexible planner
              that helps you decide what to make without starting from scratch
              every night.
            </p>

            <p className="mt-3 text-sm leading-6 text-white/80">
              Save meals to your rotation, build your own library of reliable
              dinners, and add ingredients straight to your basket.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/planner"
                className="rounded-full bg-white px-6 py-3 text-sm font-medium text-[#243328]"
              >
                Start your weekly plan
              </Link>

              <Link
                href="/recipes"
                className="rounded-full border border-white/50 px-6 py-3 text-sm text-white"
              >
                See meal ideas
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        id="how"
        className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20"
      >
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm uppercase tracking-[0.18em] text-[#6b776c]">
            The real problem
          </p>

          <h2 className="mt-3 font-serif text-3xl md:text-5xl">
            Most people don’t need more recipes.
          </h2>

          <p className="mt-5 text-base leading-8 text-[#5f675c] md:text-lg">
            They need fewer decisions, less waste, reliable meals, and
            ingredients that work across the week. The Local Pantry is built
            around that.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => (
            <div
              key={benefit}
              className="rounded-[24px] border border-[#ddd4c8] bg-white/60 p-5 text-center shadow-[0_10px_24px_rgba(36,51,40,0.04)]"
            >
              <p className="text-sm font-medium text-[#243328]">{benefit}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#ede5da] px-4 py-16 sm:px-6 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-[#6b776c]">
                How it works
              </p>

              <h2 className="mt-3 font-serif text-3xl md:text-5xl">
                A weekly food rhythm, not just a delivery.
              </h2>

              <p className="mt-5 text-base leading-8 text-[#5f675c]">
                The box gives the week a starting point. The planner turns it
                into meals. Your saved rotation makes it easier every time you
                come back.
              </p>

              <Link
                href="/planner"
                className="mt-7 inline-flex rounded-full bg-[#243328] px-6 py-3 text-sm font-medium text-white"
              >
                Open the planner
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {steps.map((step, index) => (
                <article
                  key={step.title}
                  className="rounded-[28px] border border-[#d8d0c4] bg-[#f7f2eb]/90 p-6 shadow-[0_12px_30px_rgba(36,51,40,0.05)]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#243328] text-sm text-white">
                    {index + 1}
                  </div>

                  <h3 className="mt-5 font-serif text-2xl">{step.title}</h3>

                  <p className="mt-3 text-sm leading-6 text-[#667164]">
                    {step.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="relative overflow-hidden rounded-[32px] border border-[#ddd4c8] bg-[#ede5da] shadow-[0_18px_48px_rgba(36,51,40,0.1)]">
            <img
              src="/hero.jpg"
              alt="Seasonal produce and pantry ingredients"
              className="h-[420px] w-full object-cover"
            />
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-[#6b776c]">
              Your rotation
            </p>

            <h2 className="mt-3 font-serif text-3xl md:text-5xl">
              The more you use it, the better it gets.
            </h2>

            <p className="mt-5 text-base leading-8 text-[#5f675c]">
              Save the meals that work. Reuse favourites. Build a personal
              library of dinners you actually trust. Over time, your weekly shop
              becomes quicker, calmer and more useful.
            </p>

            <div className="mt-6 rounded-[24px] border border-[#ddd4c8] bg-white/70 p-5">
              <p className="text-sm font-medium text-[#243328]">
                Save to Rotation
              </p>
              <p className="mt-2 text-sm leading-6 text-[#667164]">
                This is stronger than ordinary favourites. It turns good meals
                into repeatable weeknight habits.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#243328] px-4 py-16 text-white sm:px-6 md:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm uppercase tracking-[0.18em] text-white/60">
            Starting local
          </p>

          <h2 className="mt-3 font-serif text-3xl md:text-5xl">
            Weekly food planning for ML11.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/80">
            Limited weekly deliveries, one drop each week, built around useful
            produce, pantry staples and proper meal ideas.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/shop"
              className="rounded-full bg-white px-6 py-3 text-sm font-medium text-[#243328]"
            >
              Start with a weekly box
            </Link>

            <Link
              href="/planner"
              className="rounded-full border border-white/35 px-6 py-3 text-sm text-white"
            >
              Preview the planner
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
