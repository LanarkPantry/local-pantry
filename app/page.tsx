"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useCart } from "./cart-context";

export default function HomePage() {
  const { cart } = useCart();
  const totalItems = useMemo(() => cart.length, [cart]);

  const [postcode, setPostcode] = useState("");
  const [message, setMessage] = useState("");
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  function handlePostcodeCheck(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const cleaned = postcode.replace(/\s+/g, "").toUpperCase();

    if (!cleaned) {
      setIsAvailable(false);
      setMessage("Please enter your postcode.");
      return;
    }

    if (cleaned.startsWith("ML11")) {
      setIsAvailable(true);
      setMessage("Good news — we deliver to your area.");
      return;
    }

    setIsAvailable(false);
    setMessage("We’re not delivering to your area just yet.");
  }

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
                href="/planner"
                className="rounded-full border border-white/40 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Plan your week
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
          <div className="rounded-[24px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.74)] p-6 backdrop-blur-md">
            <p className="text-sm uppercase tracking-[0.18em] text-[#6b776c]">
              Fresh produce
            </p>
            <h2 className="mt-3 font-serif text-3xl">Chosen each week</h2>
            <p className="mt-3 leading-7 text-[#5f675c]">
              Fruit and veg chosen for quality and how you actually cook.
            </p>
          </div>

          <div className="rounded-[24px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.74)] p-6 backdrop-blur-md">
            <p className="text-sm uppercase tracking-[0.18em] text-[#6b776c]">
              Pantry essentials
            </p>
            <h2 className="mt-3 font-serif text-3xl">Simple additions</h2>
            <p className="mt-3 leading-7 text-[#5f675c]">
              A small selection of pantry essentials and useful extras, kept
              simple and chosen well.
            </p>
          </div>

          <div className="rounded-[24px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.74)] p-6 backdrop-blur-md">
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

      <section className="px-6 pb-20 md:px-10 md:pb-24">
        <div className="mx-auto max-w-4xl rounded-[28px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.78)] p-6 backdrop-blur-md md:p-10">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.2em] text-[#6b776c]">
              Delivery checker
            </p>

            <h2 className="mt-3 font-serif text-3xl md:text-4xl">
              Check if we deliver to your area
            </h2>

            <p className="mt-4 leading-7 text-[#5f675c]">
              Enter your postcode below to see if we’re currently delivering in
              your area.
            </p>
          </div>

          <form
            onSubmit={handlePostcodeCheck}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="text"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              placeholder="Enter your postcode"
              className="w-full rounded-full border border-[#d6cec2] bg-[rgba(255,255,255,0.88)] px-5 py-3 text-sm text-[#243328] outline-none placeholder:text-[#7b8478] focus:border-[#a9b2a3]"
            />

            <button
              type="submit"
              className="rounded-full bg-[#243328] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Check postcode
            </button>
          </form>

          {message && (
            <div
              className={`mt-5 rounded-[20px] px-5 py-4 text-sm leading-6 ${
                isAvailable
                  ? "border border-[#bfd3bf] bg-[#edf6ed] text-[#243328]"
                  : "border border-[#e4d8cb] bg-[#fbf6f0] text-[#6a5c4f]"
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
