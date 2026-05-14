"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useCart } from "./cart-context";

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
            Preview planner
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <img
          src="/hero.jpg"
          alt="The Local Pantry"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.2)_0%,rgba(0,0,0,0.35)_60%,rgba(0,0,0,0.45)_100%)]" />

        <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-7xl items-end px-4 pb-10 sm:px-6 md:px-10">
          <div className="max-w-2xl text-white">
            <h1 className="font-serif text-4xl leading-tight md:text-6xl">
              Your week of meals, already figured out.
            </h1>

            <p className="mt-4 text-lg text-white/90">
              Preview a weekly meal plan built around seasonal produce, pantry
              staples and real recipes.
            </p>

            <p className="mt-3 text-sm text-white/80">
              Weekly box subscribers unlock adjustable planning, swaps, saved
              weeks and basket-aware recipes.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/planner"
                className="rounded-full bg-white px-6 py-3 text-sm font-medium text-[#243328]"
              >
                Preview the planner
              </Link>

              <Link
                href="#how"
                className="rounded-full border border-white/50 px-6 py-3 text-sm text-white"
              >
                See how it works
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        id="how"
        className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6"
      >
        <p className="text-lg text-[#4f5e52]">
          No more standing in the kitchen wondering what to cook.
        </p>

        <h2 className="mt-10 font-serif text-3xl">How it works</h2>

        <div className="mt-10 grid gap-10 md:grid-cols-3">
          <div>
            <p className="text-lg font-medium">Preview the week</p>
            <p className="mt-2 text-sm text-[#667164]">
              Choose your mood, nights and eating style.
            </p>
          </div>

          <div>
            <p className="text-lg font-medium">Start a weekly box</p>
            <p className="mt-2 text-sm text-[#667164]">
              The produce box gives the plan its base.
            </p>
          </div>

          <div>
            <p className="text-lg font-medium">Unlock the full planner</p>
            <p className="mt-2 text-sm text-[#667164]">
              Subscribers get swaps, saved weeks and basket-aware planning.
            </p>
          </div>
        </div>

        <Link
          href="/planner"
          className="mt-12 inline-block text-sm underline underline-offset-4"
        >
          Preview the planner →
        </Link>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="mb-6 text-center">
          <p className="text-sm text-[#667164]">
            This is the local pantry model: seasonal produce, useful pantry
            goods and calmer weekly cooking.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-2xl">
          <img
            src="/hero.jpg"
            alt="Shop vision"
            className="h-[420px] w-full object-cover"
          />
        </div>

        <p className="mt-6 text-center text-sm text-[#667164]">
          Built online first — with local delivery at the centre.
        </p>
      </section>

      <section className="bg-[#243328] py-16 text-center text-white">
        <div className="mx-auto max-w-xl px-4">
          <h2 className="font-serif text-3xl">Starting small, on purpose</h2>

          <p className="mt-4 text-white/80">
            Limited weekly deliveries in ML11. One drop each week.
          </p>

          <Link
            href="/planner"
            className="mt-6 inline-block rounded-full bg-white px-6 py-3 text-sm text-[#243328]"
          >
            Preview the planner
          </Link>
        </div>
      </section>
    </main>
  );
}
