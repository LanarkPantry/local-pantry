"use client";

import Link from "next/link";
import SiteHeader from "./components/SiteHeader";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f4efe9] text-[#243328]">
      <SiteHeader />

      <section className="px-4 pb-10 pt-8 sm:px-6 md:px-10 md:pb-16 md:pt-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
            <article className="rounded-[34px] border border-[#ddd4c8] bg-[#f7f2eb]/88 p-6 shadow-[0_12px_32px_rgba(36,51,40,0.06)] md:p-10">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#6b776c]">
                Weekly produce boxes + meal planning
              </p>

              <h1 className="mt-5 max-w-4xl font-serif text-[2.7rem] leading-[0.98] tracking-tight text-[#243328] md:text-[5.3rem]">
                Plan your week.
                <br />
                Build your basket.
                <br />
                Cook more easily.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-[#667164] md:text-lg">
                The Local Pantry combines weekly produce boxes, pantry staples
                and intelligent meal planning to help you decide what to cook —
                then build the basket around it.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/planner"
                  className="rounded-full bg-[#243328] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
                >
                  Start planning your week
                </Link>

                <Link
                  href="/shop"
                  className="rounded-full border border-[#d6cec2] bg-white/85 px-6 py-3 text-sm text-[#243328] transition hover:bg-white"
                >
                  Browse produce boxes
                </Link>
              </div>
            </article>

            <article className="overflow-hidden rounded-[34px] border border-[#ddd4c8] bg-white/80 shadow-[0_12px_32px_rgba(36,51,40,0.05)]">
              <img
                src="/hero.jpg"
                alt="The Local Pantry weekly food planning"
                className="h-full min-h-[360px] w-full object-cover"
              />
            </article>
          </div>

          <section className="mt-12 rounded-[32px] border border-[#ddd4c8] bg-white/78 p-6 shadow-[0_10px_28px_rgba(36,51,40,0.05)] md:p-8">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
              How it works
            </p>

            <h2 className="mt-3 font-serif text-[2.1rem] leading-tight text-[#243328] md:text-[3rem]">
              A calmer weekly food system.
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {[
                {
                  number: "1",
                  title: "Plan your week",
                  text: "Generate a flexible weekly meal plan built around practical pantry cooking.",
                },
                {
                  number: "2",
                  title: "Build your basket",
                  text: "Add produce boxes, pantry staples and suggested extras directly from your planner.",
                },
                {
                  number: "3",
                  title: "Save your regulars",
                  text: "Save favourite weeks, repeat meals and build a more useful weekly routine over time.",
                },
              ].map((step) => (
                <article
                  key={step.number}
                  className="rounded-[26px] border border-[#e5dccf] bg-[#f8f4ee]/85 p-5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#243328] text-sm font-medium text-white">
                    {step.number}
                  </div>

                  <h3 className="mt-5 font-serif text-[1.5rem] text-[#243328]">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[#667164]">
                    {step.text}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-12 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <article className="rounded-[30px] border border-[#ddd4c8] bg-white/78 p-6 shadow-[0_10px_28px_rgba(36,51,40,0.05)] md:p-8">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
                Free planner access
              </p>

              <h2 className="mt-3 font-serif text-[2rem] leading-tight text-[#243328] md:text-[2.6rem]">
                Use the planner freely.
              </h2>

              <p className="mt-4 text-sm leading-7 text-[#667164] md:text-base">
                Anyone can explore the planner and build baskets. Create a free
                account to save weeks, regular meals and pantry habits over
                time.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/planner"
                  className="rounded-full bg-[#243328] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
                >
                  Open planner
                </Link>

                <Link
                  href="/saved-weeks"
                  className="rounded-full border border-[#d6cec2] bg-[#f7f2eb] px-5 py-3 text-sm text-[#243328] transition hover:bg-white"
                >
                  Saved weeks
                </Link>
              </div>
            </article>

            <article className="rounded-[30px] border border-[#ddd4c8] bg-[#f7f2eb]/84 p-6 shadow-[0_10px_28px_rgba(36,51,40,0.05)] md:p-8">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
                Weekly produce delivery
              </p>

              <h2 className="mt-3 font-serif text-[2rem] leading-tight text-[#243328] md:text-[2.6rem]">
                Weekly produce boxes.
              </h2>

              <p className="mt-4 text-sm leading-7 text-[#667164] md:text-base">
                Choose a smaller or larger weekly box, then build flexible meals
                around seasonal ingredients and pantry staples.
              </p>

              <div className="mt-7">
                <Link
                  href="/shop"
                  className="rounded-full bg-[#243328] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
                >
                  Browse the shop
                </Link>
              </div>
            </article>
          </section>
        </div>
      </section>
    </main>
  );
}
