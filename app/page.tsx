"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useCart } from "./cart-context";

export default function HomePage() {
  const { cart } = useCart();

  const [postcode, setPostcode] = useState("");
  const [postcodeValid, setPostcodeValid] = useState<boolean | null>(null);

  const totalItems = useMemo(() => cart.length, [cart]);

  const checkPostcode = () => {
    if (postcode.trim().toLowerCase().startsWith("g")) {
      setPostcodeValid(true);
    } else {
      setPostcodeValid(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4efe9] text-[#243328]">
      {/* HEADER */}
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

      {/* HERO */}
      <section className="px-6 pb-16 pt-10 md:px-10 md:pb-24 md:pt-16">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-[#6b776c]">
              Seasonal groceries from local farms
            </p>

            <h1 className="mt-4 font-serif text-5xl leading-none tracking-tight md:text-7xl">
              A more thoughtful way to shop each week.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5f675c] md:text-xl">
              Fresh fruit, vegetables and pantry favourites, chosen with care
              and delivered to your door. Seasonal, local, and designed to feel
              like a small weekly luxury.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/shop"
                className="rounded-full bg-[#2f4635] px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-[#243328]"
              >
                Shop the harvest
              </Link>

              <Link
                href="/basket"
                className="rounded-full border border-[#d6cec2] bg-white px-6 py-3 text-sm font-medium text-[#243328] shadow-sm transition hover:bg-[#faf7f2]"
              >
                View basket{totalItems > 0 ? ` (${totalItems})` : ""}
              </Link>
            </div>
          </div>

          {/* HERO IMAGE */}
          <div className="overflow-hidden rounded-[32px] border border-[#ddd4c8] bg-white shadow-[0_16px_40px_rgba(36,51,40,0.08)]">
            <img
              src="/weekly-harvest-box.png"
              alt="Seasonal harvest box"
              className="h-[360px] w-full bg-[#f8f5ef] p-6 object-contain md:h-[520px]"
            />
          </div>
        </div>
      </section>

      {/* BRAND VALUES */}
      <section className="px-6 pb-16 md:px-10 md:pb-24">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          <div className="rounded-[24px] border border-[#ddd4c8] bg-[#f7f2eb] p-6">
            <p className="text-sm uppercase tracking-[0.18em] text-[#6b776c]">
              Local first
            </p>
            <h2 className="mt-3 font-serif text-3xl">Sourced with care</h2>
            <p className="mt-3 text-[#5f675c] leading-7">
              We work with local farms and small producers to bring you food
              that feels fresher, more thoughtful and more connected to place.
            </p>
          </div>

          <div className="rounded-[24px] border border-[#ddd4c8] bg-[#f7f2eb] p-6">
            <p className="text-sm uppercase tracking-[0.18em] text-[#6b776c]">
              Seasonal rhythm
            </p>
            <h2 className="mt-3 font-serif text-3xl">Chosen for the week</h2>
            <p className="mt-3 text-[#5f675c] leading-7">
              Boxes change with what’s growing and tasting best, so your weekly
              shop always feels varied, abundant and in season.
            </p>
          </div>

          <div className="rounded-[24px] border border-[#ddd4c8] bg-[#f7f2eb] p-6">
            <p className="text-sm uppercase tracking-[0.18em] text-[#6b776c]">
              Delivered simply
            </p>
            <h2 className="mt-3 font-serif text-3xl">
              Easy to fit around life
            </h2>
            <p className="mt-3 text-[#5f675c] leading-7">
              Order once or build a weekly habit, with simple delivery and
              flexible options that work around your routine.
            </p>
          </div>
        </div>
      </section>

      {/* POSTCODE */}
      <section className="px-6 pb-16 md:px-10 md:pb-24">
        <div className="mx-auto max-w-4xl rounded-[30px] border border-[#ddd4c8] bg-[#f7f2eb] p-6 text-center shadow-[0_12px_30px_rgba(36,51,40,0.06)] md:p-8">
          <h2 className="font-serif text-4xl md:text-5xl">
            Check your postcode
          </h2>

          <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              placeholder="Enter postcode"
              className="flex-1 rounded-full border border-[#d6cec2] bg-white px-5 py-3 text-sm outline-none"
            />
            <button
              onClick={checkPostcode}
              className="rounded-full bg-[#2f4635] px-6 py-3 text-sm font-medium text-white"
            >
              Check
            </button>
          </div>

          {postcodeValid === true && (
            <div className="mt-6 text-green-700">We deliver to your area</div>
          )}

          {postcodeValid === false && (
            <div className="mt-6 text-red-600">Not available yet</div>
          )}
        </div>
      </section>
    </main>
  );
}
