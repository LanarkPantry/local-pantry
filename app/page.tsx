"use client";

import Link from "next/link";
import { useCart } from "./cart-context";
import { useMemo } from "react";

export default function HomePage() {
  const { cart } = useCart();
  const totalItems = useMemo(() => cart.length, [cart]);

  return (
    <main className="min-h-screen bg-[#f4efe9] text-[#243328]">
      {/* HEADER */}
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
            Plan my week
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <img
          src="/hero.jpg"
          alt="The Local Pantry"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* LIGHTER GRADIENT OVERLAY */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.2)_0%,rgba(0,0,0,0.35)_60%,rgba(0,0,0,0.45)_100%)]" />

        <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-7xl items-end px-4 pb-10 sm:px-6 md:px-10">
          <div className="max-w-2xl text-white">
            <h1 className="font-serif text-4xl leading-tight md:text-6xl">
              Your week of meals, already figured out.
            </h1>

            <p className="mt-4 text-lg text-white/90">
              Planned around real food. Delivered locally.
            </p>

            <p className="mt-3 text-sm text-white/80">
              The part of your shop that makes the week work.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/planner"
                className="rounded-full bg-white px-6 py-3 text-sm font-medium text-[#243328]"
              >
                Plan my week
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

      {/* FIRST SCROLL */}
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
            <p className="font-medium text-lg">We plan your week</p>
            <p className="mt-2 text-sm text-[#667164]">
              Built around real food.
            </p>
          </div>

          <div>
            <p className="font-medium text-lg">You get your basket</p>
            <p className="mt-2 text-sm text-[#667164]">Just what you need.</p>
          </div>

          <div>
            <p className="font-medium text-lg">Delivered locally</p>
            <p className="mt-2 text-sm text-[#667164]">One drop each week.</p>
          </div>
        </div>

        <Link
          href="/planner"
          className="mt-12 inline-block text-sm underline underline-offset-4"
        >
          Plan my week →
        </Link>
      </section>

      {/* VISION */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="mb-6 text-center">
          <p className="text-sm text-[#667164]">
            This is the shop we’re building locally.
          </p>
          <p className="mt-1 text-sm text-[#667164]">
            Starting online first — and growing it from here.
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
          What a local pantry could feel like.
        </p>
      </section>

      {/* LAUNCH */}
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
            Plan my week
          </Link>
        </div>
      </section>
    </main>
  );
}
