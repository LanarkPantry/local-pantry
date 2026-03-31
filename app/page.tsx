"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useCart } from "./cart-context";
import PostcodeChecker from "./components/PostcodeChecker";

export default function HomePage() {
  const { cart } = useCart();

  const totalItems = useMemo(() => cart.length, [cart]);

  return (
    <main className="min-h-screen bg-[#f4efe9] text-[#243328]">
      <header className="sticky top-0 z-30 border-b border-[#e6ddd2] bg-[#f4efe9]/90 backdrop-blur">
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
              href="/basket"
              className="text-sm text-[#4f5e52] hover:text-[#243328]"
            >
              Basket{totalItems > 0 ? ` (${totalItems})` : ""}
            </Link>
          </nav>

          <Link
            href="/basket"
            className="hidden rounded-full border border-[#d6cec2] bg-white px-4 py-2 text-sm text-[#243328] shadow-sm transition hover:bg-[#faf7f2] md:inline-flex"
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

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[78vh] max-w-7xl items-end px-6 pb-14 pt-16 md:px-10 md:pb-20">
          <div className="max-w-3xl text-white">
            <p className="text-sm uppercase tracking-[0.25em] text-white/80">
              Carefully chosen, week to week
            </p>

            <h1 className="mt-4 font-serif text-5xl leading-none tracking-tight text-white/95 md:text-7xl">
              The fresh part of your weekly shop, done well.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/90 md:text-xl">
              Fresh produce and a small selection of pantry essentials, chosen
              carefully each week.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/shop"
                className="rounded-full bg-white px-6 py-3 text-sm font-medium text-[#243328] shadow-sm transition hover:bg-[#f5f1ea]"
              >
                Shop the range
              </Link>

              <Link
                href="/basket"
                className="rounded-full border border-white/40 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                View basket{totalItems > 0 ? ` (${totalItems})` : ""}
              </Link>
            </div>

            <p className="mt-5 text-sm text-white/75">
              Weekly delivery across selected local areas.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 pb-16 pt-16 md:px-10 md:pb-24 md:pt-20">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          <div className="rounded-[24px] border border-[#ddd4c8] bg-[#f7f2eb] p-6">
            <p className="text-sm uppercase tracking-[0.18em] text-[#6b776c]">
              Fresh produce
            </p>
            <h2 className="mt-3 font-serif text-3xl">Chosen each week</h2>
            <p className="mt-3 leading-7 text-[#5f675c]">
              Fruit and veg chosen for quality and how you actually cook.
            </p>
          </div>

          <div className="rounded-[24px] border border-[#ddd4c8] bg-[#f7f2eb] p-6">
            <p className="text-sm uppercase tracking-[0.18em] text-[#6b776c]">
              Pantry essentials
            </p>
            <h2 className="mt-3 font-serif text-3xl">Simple additions</h2>
            <p className="mt-3 leading-7 text-[#5f675c]">
              A small selection of pantry essentials and useful extras, kept
              simple and chosen well.
            </p>
          </div>

          <div className="rounded-[24px] border border-[#ddd4c8] bg-[#f7f2eb] p-6">
            <p className="text-sm uppercase tracking-[0.18em] text-[#6b776c]">
              Easy each week
            </p>
            <h2 className="mt-3 font-serif text-3xl">Delivered simply</h2>
            <p className="mt-3 leading-7 text-[#5f675c]">
              Build your basket in a few minutes and keep the weekly shop
              straightforward.
            </p>
          </div>
        </div>
      </section>

      <PostcodeChecker />
    </main>
  );
}
