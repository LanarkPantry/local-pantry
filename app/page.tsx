"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useCart } from "./cart-context";

export default function HomePage() {
  const { cart } = useCart();
  const totalItems = useMemo(() => cart.length, [cart]);

  return (
    <main className="min-h-screen text-[#243328]">
      <header className="sticky top-0 z-30 border-b border-[rgba(230,221,210,0.9)] bg-[rgba(244,239,233,0.72)] backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
          <Link
            href="/"
            className="text-sm tracking-[0.35em] text-[#60705f] hover:text-[#243328]"
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
            href="/basket"
            className="hidden rounded-full border border-[#d6cec2] bg-[rgba(255,255,255,0.82)] px-4 py-2 text-sm text-[#243328] shadow-sm transition hover:bg-white md:inline-flex"
          >
            View basket{totalItems > 0 ? ` (${totalItems})` : ""}
          </Link>
        </div>
      </header>

      <section className="relative min-h-[78vh] overflow-hidden">
        <img
          src="/hero.jpg"
          alt="The Local Pantry interior"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/20 to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[78vh] max-w-7xl items-end px-6 pb-14 pt-16 md:px-10 md:pb-20">
          <div className="max-w-3xl text-white">
            <p className="text-sm uppercase tracking-[0.25em] text-white/80">
              Local delivery, week to week
            </p>

            <h1 className="mt-4 font-serif text-5xl leading-none tracking-tight text-white/95 md:text-7xl">
              A local pantry that helps you plan what to cook.
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/90 md:text-xl">
              Weekly produce, a small range of good things, and recipe ideas
              that help turn what you pick into real meals.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/shop"
                className="rounded-full bg-white px-6 py-3 text-sm font-medium text-[#243328] shadow-sm transition hover:bg-[#f5f1ea]"
              >
                Shop the pantry
              </Link>

              <Link
                href="/planner"
                className="rounded-full border border-white/40 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Plan your week
              </Link>
            </div>

            <p className="mt-5 text-sm text-white/75">
              Built from a real local kitchen and delivery service.
            </p>

            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/78">
              <span>ML11 delivery</span>
              <span>•</span>
              <span>Delivery only</span>
              <span>•</span>
              <span>Weekly produce and useful extras</span>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-14 md:px-10 md:py-18">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.18em] text-[#6b776c]">
              How it works
            </p>

            <h2 className="mt-3 font-serif text-3xl leading-tight md:text-4xl">
              Start with the week. Build from there.
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-[#5f675c]">
              Choose a box or a few useful things, get ideas for what to make,
              then save meals for later or build the basket around them.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-[22px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.74)] p-5 backdrop-blur-md">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#6b776c]">
                1. Pick well
              </p>
              <h3 className="mt-2 font-serif text-2xl">
                Pick something to start from
              </h3>
              <p className="mt-3 leading-7 text-[#5f675c]">
                Start with a weekly fruit and veg box or a few carefully chosen
                pantry items.
              </p>
            </div>

            <div className="rounded-[22px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.74)] p-5 backdrop-blur-md">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#6b776c]">
                2. Get an idea
              </p>
              <h3 className="mt-2 font-serif text-2xl">
                Work out what to cook
              </h3>
              <p className="mt-3 leading-7 text-[#5f675c]">
                Use recipe ideas and the planner to turn what you have picked
                into meals you will actually want to make.
              </p>
            </div>

            <div className="rounded-[22px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.74)] p-5 backdrop-blur-md">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#6b776c]">
                3. Keep it moving
              </p>
              <h3 className="mt-2 font-serif text-2xl">Add what you need</h3>
              <p className="mt-3 leading-7 text-[#5f675c]">
                Save what you want to cook, top up around it, and keep the
                week’s food connected to the shop.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-14 md:px-10 md:pb-18">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[26px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.78)] p-6 backdrop-blur-md md:p-8">
            <p className="text-sm uppercase tracking-[0.18em] text-[#6b776c]">
              What makes it work
            </p>

            <h2 className="mt-3 max-w-2xl font-serif text-3xl leading-tight md:text-4xl">
              A local shop that connects properly to what you cook.
            </h2>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-[20px] border border-[#e5ddcf] bg-[rgba(255,255,255,0.72)] p-5">
                <p className="text-[11px] uppercase tracking-[0.15em] text-[#6b776c]">
                  Local-first
                </p>
                <p className="mt-2 leading-7 text-[#5f675c]">
                  A smaller, more thoughtful range — built around real local
                  delivery.
                </p>
              </div>

              <div className="rounded-[20px] border border-[#e5ddcf] bg-[rgba(255,255,255,0.72)] p-5">
                <p className="text-[11px] uppercase tracking-[0.15em] text-[#6b776c]">
                  Useful week to week
                </p>
                <p className="mt-2 leading-7 text-[#5f675c]">
                  It helps you plan what to cook without turning food into
                  admin.
                </p>
              </div>

              <div className="rounded-[20px] border border-[#e5ddcf] bg-[rgba(255,255,255,0.72)] p-5">
                <p className="text-[11px] uppercase tracking-[0.15em] text-[#6b776c]">
                  Ideas built in
                </p>
                <p className="mt-2 leading-7 text-[#5f675c]">
                  Recipe ideas start from what you have picked, so the shop and
                  the week stay connected.
                </p>
              </div>

              <div className="rounded-[20px] border border-[#e5ddcf] bg-[rgba(255,255,255,0.72)] p-5">
                <p className="text-[11px] uppercase tracking-[0.15em] text-[#6b776c]">
                  Curated on purpose
                </p>
                <p className="mt-2 leading-7 text-[#5f675c]">
                  A restrained range keeps things practical, easier to browse,
                  and easier to come back to each week.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[26px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.78)] p-6 backdrop-blur-md md:p-8">
            <p className="text-sm uppercase tracking-[0.18em] text-[#6b776c]">
              Getting started
            </p>

            <h2 className="mt-3 font-serif text-3xl leading-tight">
              A straightforward way in
            </h2>

            <div className="mt-5 space-y-4">
              <div className="rounded-[18px] border border-[#e5ddcf] bg-[rgba(255,255,255,0.72)] p-4">
                <p className="text-sm font-medium text-[#243328]">
                  Weekly box members
                </p>
                <p className="mt-2 text-sm leading-6 text-[#5f675c]">
                  The weekly box makes it easier to plan meals and build your
                  shop around them.
                </p>
              </div>

              <div className="rounded-[18px] border border-[#e5ddcf] bg-[rgba(255,255,255,0.72)] p-4">
                <p className="text-sm font-medium text-[#243328]">
                  Planner-only path
                </p>
                <p className="mt-2 text-sm leading-6 text-[#5f675c]">
                  Not local? You can still use the meal planner on its own.
                </p>
              </div>

              <div className="rounded-[18px] border border-[#e5ddcf] bg-[rgba(255,255,255,0.72)] p-4">
                <p className="text-sm font-medium text-[#243328]">
                  Try a few ideas first
                </p>
                <p className="mt-2 text-sm leading-6 text-[#5f675c]">
                  You can try a few recipe ideas before deciding how you want to
                  use it regularly.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/planner"
                className="rounded-full bg-[#243328] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
              >
                Explore the planner
              </Link>

              <Link
                href="/shop"
                className="rounded-full border border-[#d6cec2] bg-[rgba(255,255,255,0.82)] px-5 py-3 text-sm text-[#243328] transition hover:bg-white"
              >
                Browse the shop
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-16 md:px-10 md:pb-20">
        <div className="mx-auto max-w-4xl rounded-[28px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.78)] p-6 backdrop-blur-md md:p-10">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.2em] text-[#6b776c]">
              Delivery
            </p>

            <h2 className="mt-3 font-serif text-3xl md:text-4xl">
              Local delivery across ML11
            </h2>

            <p className="mt-4 leading-7 text-[#5f675c]">
              We deliver weekly across ML11. Everything is prepared for local
              delivery and ordered through the site.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/shop"
              className="rounded-full bg-[#243328] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Shop the pantry
            </Link>

            <Link
              href="/planner"
              className="rounded-full border border-[#d6cec2] bg-[rgba(255,255,255,0.82)] px-5 py-3 text-sm text-[#243328] transition hover:bg-white"
            >
              Plan your week
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
