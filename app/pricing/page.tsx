"use client";

import Link from "next/link";
import { useState } from "react";

const plannerFeatures = [
  "Unlimited recipe ideas",
  "Save favourite recipes",
  "Build your week in the planner",
  "Add recipes to your plan in one tap",
  "Turn your plan into a simple shopping list",
  "Use what you already have at home",
];

export default function PricingPage() {
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    try {
      setLoading(true);

      const res = await fetch("/api/planner-checkout", {
        method: "POST",
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Something went wrong starting checkout.");
      }
    } catch (err) {
      console.error(err);
      alert("Unable to start checkout.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen px-4 py-8 text-[#243328] sm:px-6 md:px-10 md:py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between border-b border-[rgba(221,212,200,0.9)] pb-4">
          <Link href="/" className="text-sm tracking-[0.35em] text-[#60705f]">
            THE LOCAL PANTRY
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/recipes"
              className="text-sm text-[#5f675c] hover:text-[#243328]"
            >
              Recipes
            </Link>
            <Link
              href="/planner"
              className="text-sm text-[#5f675c] hover:text-[#243328]"
            >
              Planner
            </Link>
          </div>
        </div>

        <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          {/* LEFT */}
          <div className="rounded-[30px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.78)] p-6 shadow-[0_12px_30px_rgba(36,51,40,0.05)] backdrop-blur-md md:p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-[#6b776c]">
              The Local Pantry Planner
            </p>

            <h1 className="mt-3 font-serif text-4xl leading-tight text-[#243328] md:text-5xl">
              Plan your week without overthinking food.
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-8 text-[#5f675c]">
              Get unlimited recipe ideas, save the ones you love, build your
              week in the planner, and turn it into a simple shopping list.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="rounded-full border px-4 py-2 text-sm">
                Useful week after week
              </div>
              <div className="rounded-full border px-4 py-2 text-sm">
                Simple weekly rhythm
              </div>
              <div className="rounded-full border px-4 py-2 text-sm">
                Built for real cooking
              </div>
            </div>

            <div className="mt-8 rounded-[24px] border bg-white/80 p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-[#6b776c]">
                What’s included
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {plannerFeatures.map((feature) => (
                  <div
                    key={feature}
                    className="rounded-[18px] border px-4 py-3 text-sm"
                  >
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="rounded-[30px] border bg-[rgba(247,242,235,0.82)] p-6 shadow-[0_12px_30px_rgba(36,51,40,0.05)] backdrop-blur-md md:p-8">
            <p className="text-xs uppercase tracking-[0.18em] text-[#6b776c]">
              Monthly plan
            </p>

            <div className="mt-4 rounded-[24px] border bg-white/80 p-5">
              <div className="flex items-end gap-2">
                <span className="font-serif text-5xl">£9.99</span>
                <span className="pb-1 text-sm text-[#5f675c]">/ month</span>
              </div>

              <p className="mt-3 text-sm text-[#5f675c]">
                A simple monthly plan for the recipe generator and weekly meal
                planner.
              </p>

              <div className="mt-5 flex flex-col gap-3">
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-full bg-[#2f4635] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
                >
                  {loading ? "Redirecting..." : "Start planning your week"}
                </button>

                <Link
                  href="/planner"
                  className="inline-flex items-center justify-center rounded-full border px-5 py-3 text-sm"
                >
                  View planner
                </Link>
              </div>
            </div>

            <div className="mt-5 rounded-[24px] border bg-white/70 p-5">
              <p className="text-sm font-medium">Good fit if you want to:</p>

              <ul className="mt-3 space-y-3 text-sm text-[#5f675c]">
                <li>Know what you’re cooking this week</li>
                <li>Save good ideas instead of starting from scratch</li>
                <li>Use what you already have more often</li>
                <li>Make food shopping feel simpler</li>
              </ul>
            </div>

            <p className="mt-5 text-sm text-[#667164]">
              You can keep using the shop as normal. This plan is for the
              digital recipe and planning side of The Local Pantry.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
