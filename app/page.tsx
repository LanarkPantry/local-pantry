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

        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/20 to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[78vh] max-w-7xl items-end px-6 pb-14 pt-16 md:px-10 md:pb-20">
          <div className="max-w-3xl text-white">
            <p className="text-sm uppercase tracking-[0.25em] text-white/80">
              Local delivery, thoughtful planning
            </p>

            <h1 className="mt-4 font-serif text-5xl leading-none tracking-tight text-white/95 md:text-7xl">
              Plan the week, then shop the good bits well.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/90 md:text-xl">
              A planning-led local pantry with weekly fruit and veg boxes,
              useful extras, and recipe ideas that help turn what you pick into
              real meals.
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

            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/78">
              <span>ML11 delivery</span>
              <span>•</span>
              <span>Delivery only</span>
              <span>•</span>
              <span>Planner-first</span>
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
              Start with the week, then build the basket around it.
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-[#5f675c]">
              The Local Pantry is built to make weekly food planning feel
              lighter. Choose a box or a few useful things, get an idea for what
              to make, then save it for later or add to your basket.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-[22px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.74)] p-5 backdrop-blur-md">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#6b776c]">
                1. Pick well
              </p>
              <h3 className="mt-2 font-serif text-2xl">Choose the anchor</h3>
              <p className="mt-3 leading-7 text-[#5f675c]">
                Start with a weekly fruit and veg box or a few carefully chosen
                pantry items.
              </p>
            </div>

            <div className="rounded-[22px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.74)] p-5 backdrop-blur-md">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#6b776c]">
                2. Get an idea
              </p>
              <h3 className="mt-2 font-serif text-2xl">Turn it into meals</h3>
              <p className="mt-3 leading-7 text-[#5f675c]">
                Use the planner and recipe ideas to shape what you already want
                to buy into something useful for the week.
              </p>
            </div>

            <div className="rounded-[22px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.74)] p-5 backdrop-blur-md">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#6b776c]">
                3. Keep it simple
              </p>
              <h3 className="mt-2 font-serif text-2xl">Build the basket</h3>
              <p className="mt-3 leading-7 text-[#5f675c]">
                Save what you want to cook, top up around it, and keep the
                weekly shop clear and manageable.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-14 md:px-10 md:pb-18">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[26px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.78)] p-6 backdrop-blur-md md:p-8">
            <p className="text-sm uppercase tracking-[0.18em] text-[#6b776c]">
              Why it feels different
            </p>

            <h2 className="mt-3 max-w-2xl font-serif text-3xl leading-tight md:text-4xl">
              Not a supermarket. Not just a recipe app.
            </h2>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-[20px] border border-[#e5ddcf] bg-[rgba(255,255,255,0.72)] p-5">
                <p className="text-[11px] uppercase tracking-[0.15em] text-[#6b776c]">
                  Local-first
                </p>
                <p className="mt-2 leading-7 text-[#5f675c]">
                  A smaller, more thoughtful range built around real local
                  delivery rather than endless choice.
                </p>
              </div>

              <div className="rounded-[20px] border border-[#e5ddcf] bg-[rgba(255,255,255,0.72)] p-5">
                <p className="text-[11px] uppercase tracking-[0.15em] text-[#6b776c]">
                  Planner-led
                </p>
                <p className="mt-2 leading-7 text-[#5f675c]">
                  The planning side is there to help you decide what to cook,
                  not to make food feel like admin.
                </p>
              </div>

              <div className="rounded-[20px] border border-[#e5ddcf] bg-[rgba(255,255,255,0.72)] p-5">
                <p className="text-[11px] uppercase tracking-[0.15em] text-[#6b776c]">
                  Useful ideas
                </p>
                <p className="mt-2 leading-7 text-[#5f675c]">
                  Recipe ideas start from the products, so the shop and the
                  week’s meals feel naturally connected.
                </p>
              </div>

              <div className="rounded-[20px] border border-[#e5ddcf] bg-[rgba(255,255,255,0.72)] p-5">
                <p className="text-[11px] uppercase tracking-[0.15em] text-[#6b776c]">
                  Curated on purpose
                </p>
                <p className="mt-2 leading-7 text-[#5f675c]">
                  A restrained range keeps things practical, calmer to browse,
                  and easier to repeat week after week.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[26px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.78)] p-6 backdrop-blur-md md:p-8">
            <p className="text-sm uppercase tracking-[0.18em] text-[#6b776c]">
              Access
            </p>

            <h2 className="mt-3 font-serif text-3xl leading-tight">
              A simple way in
            </h2>

            <div className="mt-5 space-y-4">
              <div className="rounded-[18px] border border-[#e5ddcf] bg-[rgba(255,255,255,0.72)] p-4">
                <p className="text-sm font-medium text-[#243328]">
                  Weekly box members
                </p>
                <p className="mt-2 text-sm leading-6 text-[#5f675c]">
                  Full planner and recipe support sits naturally alongside the
                  produce box.
                </p>
              </div>

              <div className="rounded-[18px] border border-[#e5ddcf] bg-[rgba(255,255,255,0.72)] p-4">
                <p className="text-sm font-medium text-[#243328]">
                  Planner-only path
                </p>
                <p className="mt-2 text-sm leading-6 text-[#5f675c]">
                  Not local? You can still use the planner without needing local
                  delivery.
                </p>
              </div>

              <div className="rounded-[18px] border border-[#e5ddcf] bg-[rgba(255,255,255,0.72)] p-4">
                <p className="text-sm font-medium text-[#243328]">
                  A light way to try it
                </p>
                <p className="mt-2 text-sm leading-6 text-[#5f675c]">
                  New visitors can try a few recipe ideas before committing.
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
        <div className="mx-auto max-w-5xl rounded-[28px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.78)] p-6 backdrop-blur-md md:p-10">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.2em] text-[#6b776c]">
                Delivery checker
              </p>

              <h2 className="mt-3 font-serif text-3xl md:text-4xl">
                Check if we deliver to your area
              </h2>

              <p className="mt-4 leading-7 text-[#5f675c]">
                We currently deliver in ML11. Enter your postcode below to
                check.
              </p>
            </div>

            <p className="text-sm text-[#6b776c]">Delivery only • ML11</p>
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
