"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useCart } from "./cart-context";

export default function HomePage() {
  const { cart } = useCart();
  const totalItems = useMemo(() => cart.length, [cart]);

  return (
    <main className="min-h-screen bg-[#f4efe9] text-[#243328]">
      <header className="sticky top-0 z-30 border-b border-[rgba(230,221,210,0.92)] bg-[rgba(244,239,233,0.88)] backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 md:px-10">
          <Link
            href="/"
            className="text-[11px] tracking-[0.28em] text-[#60705f] hover:text-[#243328] sm:text-sm"
          >
            THE LOCAL PANTRY
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/"
              className="text-sm text-[#243328] underline underline-offset-4"
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="text-sm text-[#4f5e52] hover:text-[#243328]"
            >
              Shop
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

          <div className="flex items-center gap-2">
            <Link
              href="/planner"
              className="hidden rounded-full bg-[#243328] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 md:inline-flex"
            >
              Plan my week
            </Link>

            <Link
              href="/basket"
              className="inline-flex rounded-full border border-[#d6cec2] bg-[rgba(255,255,255,0.88)] px-4 py-2 text-sm text-[#243328] shadow-sm transition hover:bg-white"
            >
              Basket{totalItems > 0 ? ` (${totalItems})` : ""}
            </Link>
          </div>
        </div>
      </header>

      <section className="relative isolate overflow-hidden">
        <img
          src="/hero.jpg"
          alt="A warm, welcoming pantry-style shop interior"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.18)_0%,rgba(0,0,0,0.42)_45%,rgba(0,0,0,0.68)_100%)]" />

        <div className="relative z-10 mx-auto flex min-h-[76vh] max-w-7xl items-end px-4 pb-10 pt-16 sm:px-6 md:min-h-[84vh] md:px-10 md:pb-16">
          <div className="max-w-3xl text-white">
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/82 sm:text-sm">
              ML11 weekly delivery
            </p>

            <h1 className="mt-3 max-w-2xl font-serif text-[2.5rem] leading-[0.95] tracking-tight text-white sm:text-5xl md:text-7xl">
              Plan the week. Fill the basket. Get it delivered locally.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-white/92 md:text-xl md:leading-8">
              The Local Pantry helps you decide what to cook, then brings the
              fruit, veg, pantry extras, and weekly staples to your door.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/planner"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 text-sm font-medium text-[#243328] shadow-sm transition hover:bg-[#f5f1ea]"
              >
                Plan my week
              </Link>

              <Link
                href="/shop"
                className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/10 px-6 py-3.5 text-sm font-medium text-white transition hover:bg-white/16"
              >
                Browse the shop
              </Link>
            </div>

            <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm text-white/80">
              <span>Launch area: ML11</span>
              <span className="hidden sm:inline">•</span>
              <span>Small weekly drop</span>
              <span className="hidden sm:inline">•</span>
              <span>Limited delivery spots</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#e6ddd2] bg-[#f8f4ee]">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 py-8 sm:px-6 md:grid-cols-3 md:px-10 md:py-10">
          {[
            {
              title: "1. Start with a week that feels doable",
              text: "Use the planner to get quick, flexible meal ideas built around real weeknight cooking.",
            },
            {
              title: "2. Turn the plan into a basket",
              text: "Pick a produce box, add a few pantry extras, and keep it simple.",
            },
            {
              title: "3. Get a local weekly delivery",
              text: "Launching small to keep quality high, delivery manageable, and the experience personal.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-[24px] border border-[#e3d9ce] bg-white/80 p-5 shadow-[0_10px_30px_rgba(36,51,40,0.04)]"
            >
              <h2 className="font-serif text-2xl text-[#243328]">
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#5f675c] md:text-[15px]">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.05fr_0.95fr] md:px-10 md:py-16">
        <div className="order-2 md:order-1">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#6a756a]">
            The vision
          </p>

          <h2 className="mt-3 max-w-xl font-serif text-3xl leading-tight text-[#243328] md:text-5xl">
            A more beautiful way to sort out food for the week.
          </h2>

          <p className="mt-5 max-w-xl text-base leading-8 text-[#556357] md:text-lg">
            This is not meant to feel like a cold supermarket checkout. The idea
            is a local pantry: thoughtful produce, a few special extras, and
            help deciding what to make with it all.
          </p>

          <p className="mt-4 max-w-xl text-base leading-8 text-[#556357] md:text-lg">
            Start online, keep the drop small, learn from real local orders,
            then grow carefully from there.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/planner"
              className="inline-flex rounded-full bg-[#243328] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Try the planner
            </Link>
            <Link
              href="/shop"
              className="inline-flex rounded-full border border-[#d8cec2] bg-white px-5 py-3 text-sm font-medium text-[#243328] transition hover:bg-[#faf7f3]"
            >
              See the boxes
            </Link>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <div className="overflow-hidden rounded-[30px] bg-[#e9e1d6] shadow-[0_30px_60px_rgba(36,51,40,0.12)]">
            <img
              src="/hero.jpg"
              alt="Warm wooden shelving and a calm pantry-style retail space"
              className="h-full min-h-[320px] w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-[#243328] text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1fr_auto] md:items-end md:px-10 md:py-14">
          <div className="max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.22em] text-white/70">
              First launch
            </p>

            <h2 className="mt-3 font-serif text-3xl leading-tight md:text-5xl">
              Starting with one local drop a week.
            </h2>

            <p className="mt-4 text-base leading-8 text-white/84 md:text-lg">
              Limited delivery spots. ML11 only to begin with. Built to be
              personal, dependable, and worth telling people about.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row md:flex-col md:items-end">
            <Link
              href="/planner"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 text-sm font-medium text-[#243328] transition hover:bg-[#f3eee7]"
            >
              Plan my first week
            </Link>

            <Link
              href="/basket"
              className="inline-flex items-center justify-center rounded-full border border-white/22 bg-white/8 px-6 py-3.5 text-sm font-medium text-white transition hover:bg-white/12"
            >
              Open basket{totalItems > 0 ? ` (${totalItems})` : ""}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
