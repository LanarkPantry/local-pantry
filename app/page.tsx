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
              Start planning your week
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

      {/* HERO */}

      <section className="relative overflow-hidden">
        <img
          src="/hero.jpg"
          alt="The Local Pantry interior"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.22)_0%,rgba(0,0,0,0.38)_40%,rgba(0,0,0,0.6)_100%)]" />

        <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-7xl items-end px-4 pb-8 pt-10 sm:px-6 md:min-h-[76vh] md:px-10 md:pb-14 md:pt-16">
          <div className="w-full max-w-3xl text-white">
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/82 sm:text-sm">
              Weekly food delivery for Lanark and surrounding ML11 areas
            </p>

            <h1 className="mt-3 max-w-2xl font-serif text-[2.35rem] leading-[0.95] tracking-tight text-white/95 sm:text-5xl md:mt-4 md:text-7xl">
              A local pantry that helps you plan what to cook.
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-white/90 md:mt-5 md:text-xl md:leading-8">
              Plan your meals, build your basket, and get everything delivered
              locally for the week ahead.
            </p>

            <p className="mt-4 text-sm text-white/84 md:text-base">
              Built from a real local kitchen and delivery service.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/planner"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 text-sm font-medium text-[#243328] shadow-sm transition hover:bg-[#f5f1ea]"
              >
                Start planning your week
              </Link>

              <Link
                href="/shop"
                className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/10 px-6 py-3.5 text-sm font-medium text-white transition hover:bg-white/16"
              >
                Browse the shop
              </Link>
            </div>

            <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm text-white/78">
              <span>ML11 only</span>
              <span className="hidden sm:inline">•</span>
              <span>Weekly delivery</span>
              <span className="hidden sm:inline">•</span>
              <span>New nearby areas opening</span>
            </div>
          </div>
        </div>
      </section>

      {/* CORE LOOP */}

      <section className="px-4 py-8 sm:px-6 md:px-10 md:py-10">
        <div className="mx-auto max-w-7xl rounded-[22px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.84)] p-4 md:p-5">
          <p className="text-center text-sm font-medium text-[#4f5e52] md:text-base">
            Plan your meals → build your basket → get it delivered locally
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}

      <section className="px-4 pb-10 sm:px-6 md:px-10 md:pb-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-[18px] border border-[#e5ddcf] bg-white/80 p-4">
              <h3 className="font-serif text-xl">Start with a meal</h3>
              <p className="mt-2 text-sm text-[#5f675c]">
                Get a simple idea for what to cook.
              </p>
            </div>

            <div className="rounded-[18px] border border-[#e5ddcf] bg-white/80 p-4">
              <h3 className="font-serif text-xl">Build your week</h3>
              <p className="mt-2 text-sm text-[#5f675c]">
                Add meals day by day as you go.
              </p>
            </div>

            <div className="rounded-[18px] border border-[#e5ddcf] bg-white/80 p-4">
              <h3 className="font-serif text-xl">Get what you need</h3>
              <p className="mt-2 text-sm text-[#5f675c]">
                Use your basket or a weekly box and get it delivered.
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/planner"
              className="inline-flex items-center justify-center rounded-full bg-[#243328] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Start planning your week
            </Link>

            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-full border border-[#d6cec2] bg-white px-5 py-3 text-sm text-[#243328] transition hover:bg-[#f5f1ea]"
            >
              Browse the shop
            </Link>
          </div>
        </div>
      </section>

      {/* LOCAL + PRODUCT */}

      <section className="px-4 pb-14 sm:px-6 md:px-10 md:pb-16">
        <div className="mx-auto max-w-7xl rounded-[22px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.84)] p-5 md:p-6">
          <h2 className="font-serif text-2xl md:text-3xl">
            Local weekly food for your meals
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5f675c] md:text-base">
            Weekly veg boxes, fruit, and simple extras to help cover your week.
            Build your basket around what you plan to cook, and get it delivered
            across Lanark and surrounding ML11 areas.
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/planner"
              className="inline-flex items-center justify-center rounded-full bg-[#243328] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Start your week
            </Link>

            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-full border border-[#d6cec2] bg-white px-5 py-3 text-sm text-[#243328] transition hover:bg-[#f5f1ea]"
            >
              Browse the shop
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
