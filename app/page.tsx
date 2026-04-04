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

          <div className="flex items-center gap-2">
            <Link
              href="/planner"
              className="hidden rounded-full bg-[#243328] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 md:inline-flex"
            >
              Plan this week
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

      <section className="relative overflow-hidden">
        <img
          src="/hero.jpg"
          alt="The Local Pantry interior"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.2)_0%,rgba(0,0,0,0.34)_38%,rgba(0,0,0,0.56)_100%)]" />

        <div className="relative z-10 mx-auto flex min-h-[72vh] max-w-7xl items-end px-4 pb-8 pt-10 sm:px-6 md:min-h-[78vh] md:px-10 md:pb-16 md:pt-16">
          <div className="w-full max-w-3xl text-white">
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/80 sm:text-sm">
              Weekly delivery for Lanark and surrounding ML11 areas
            </p>

            <h1 className="mt-3 max-w-2xl font-serif text-[2.35rem] leading-[0.95] tracking-tight text-white/95 sm:text-5xl md:mt-4 md:text-7xl">
              A local pantry that helps you plan what to cook.
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-white/90 md:mt-5 md:text-xl md:leading-8">
              Weekly produce, useful extras, and meal ideas that help you work
              out the week, cook from real ingredients, and build the basket
              around what you&apos;ll actually make.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/planner"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 text-sm font-medium text-[#243328] shadow-sm transition hover:bg-[#f5f1ea]"
              >
                Plan this week
              </Link>

              <Link
                href="/shop"
                className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/10 px-6 py-3.5 text-sm font-medium text-white transition hover:bg-white/16"
              >
                Browse this week&apos;s food
              </Link>
            </div>

            <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm text-white/78">
              <span>
                Built from a real local kitchen and weekly delivery service
              </span>
              <span className="hidden sm:inline">•</span>
              <span>New nearby areas open as demand grows</span>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 md:px-10 md:py-14">
        <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[24px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.84)] p-5 backdrop-blur-md md:p-7">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c] sm:text-sm">
              Start here
            </p>

            <h2 className="mt-2 max-w-2xl font-serif text-3xl leading-tight md:mt-3 md:text-4xl">
              Start with the week, then build the basket around it.
            </h2>

            <p className="mt-3 max-w-2xl leading-7 text-[#5f675c]">
              The quickest way in is to choose the next meal, add it to a day,
              then keep shaping the week from there.
            </p>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <div className="rounded-[18px] border border-[#e5ddcf] bg-[rgba(255,255,255,0.78)] p-4">
                <p className="text-[11px] uppercase tracking-[0.15em] text-[#6b776c]">
                  1
                </p>
                <h3 className="mt-2 font-serif text-xl">Choose a day</h3>
                <p className="mt-2 text-sm leading-6 text-[#5f675c]">
                  Start where you need a meal first.
                </p>
              </div>

              <div className="rounded-[18px] border border-[#e5ddcf] bg-[rgba(255,255,255,0.78)] p-4">
                <p className="text-[11px] uppercase tracking-[0.15em] text-[#6b776c]">
                  2
                </p>
                <h3 className="mt-2 font-serif text-xl">Get an idea</h3>
                <p className="mt-2 text-sm leading-6 text-[#5f675c]">
                  Use what looks good this week to work out what to cook.
                </p>
              </div>

              <div className="rounded-[18px] border border-[#e5ddcf] bg-[rgba(255,255,255,0.78)] p-4">
                <p className="text-[11px] uppercase tracking-[0.15em] text-[#6b776c]">
                  3
                </p>
                <h3 className="mt-2 font-serif text-xl">Add what you need</h3>
                <p className="mt-2 text-sm leading-6 text-[#5f675c]">
                  Build the basket from the meals taking shape.
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/planner"
                className="inline-flex items-center justify-center rounded-full bg-[#243328] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
              >
                Open the planner
              </Link>

              <Link
                href="/recipes"
                className="inline-flex items-center justify-center rounded-full border border-[#d6cec2] bg-[rgba(255,255,255,0.82)] px-5 py-3 text-sm text-[#243328] transition hover:bg-white"
              >
                Get a meal idea
              </Link>
            </div>
          </div>

          <div className="rounded-[24px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.84)] p-5 backdrop-blur-md md:p-7">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c] sm:text-sm">
              Good to know
            </p>

            <h2 className="mt-2 font-serif text-3xl leading-tight md:mt-3">
              Local, weekly, and built around real cooking.
            </h2>

            <div className="mt-5 space-y-3">
              <div className="rounded-[18px] border border-[#e5ddcf] bg-[rgba(255,255,255,0.78)] p-4">
                <p className="text-sm font-medium text-[#243328]">
                  Lanark and ML11 delivery
                </p>
                <p className="mt-2 text-sm leading-6 text-[#5f675c]">
                  Everything is prepared for weekly delivery across Lanark and
                  surrounding ML11 areas.
                </p>
              </div>

              <div className="rounded-[18px] border border-[#e5ddcf] bg-[rgba(255,255,255,0.78)] p-4">
                <p className="text-sm font-medium text-[#243328]">
                  New nearby areas by demand
                </p>
                <p className="mt-2 text-sm leading-6 text-[#5f675c]">
                  We&apos;re opening nearby delivery areas as more local
                  households join.
                </p>
              </div>

              <div className="rounded-[18px] border border-[#e5ddcf] bg-[rgba(255,255,255,0.78)] p-4">
                <p className="text-sm font-medium text-[#243328]">
                  Planner-only is still there
                </p>
                <p className="mt-2 text-sm leading-6 text-[#5f675c]">
                  Not local? You can still use the planner on its own.
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center rounded-full bg-[#243328] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
              >
                Shop the pantry
              </Link>

              <Link
                href="/planner"
                className="inline-flex items-center justify-center rounded-full border border-[#d6cec2] bg-[rgba(255,255,255,0.82)] px-5 py-3 text-sm text-[#243328] transition hover:bg-white"
              >
                Plan your week
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-14 sm:px-6 md:px-10 md:pb-18">
        <div className="mx-auto max-w-7xl rounded-[24px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.84)] p-5 backdrop-blur-md md:p-7">
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
            <div className="max-w-2xl">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c] sm:text-sm">
                This week
              </p>

              <h2 className="mt-2 font-serif text-3xl leading-tight md:mt-3 md:text-4xl">
                A weekly local food service that helps you work out dinner.
              </h2>

              <p className="mt-3 leading-7 text-[#5f675c]">
                Start with the planner if you want to shape the week. Start with
                the shop if you already know what you need for your next few
                meals.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/planner"
                className="inline-flex items-center justify-center rounded-full bg-[#243328] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
              >
                Plan this week
              </Link>

              <Link
                href="/shop"
                className="inline-flex items-center justify-center rounded-full border border-[#d6cec2] bg-[rgba(255,255,255,0.82)] px-5 py-3 text-sm text-[#243328] transition hover:bg-white"
              >
                Browse the shop
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
