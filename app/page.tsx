"use client";

import Link from "next/link";
import SiteHeader from "./components/SiteHeader";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f4efe9] text-[#243328]">
      <SiteHeader />

      <section className="relative min-h-[82vh] overflow-hidden">
        <img
          src="/hero.jpg"
          alt="The Local Pantry weekly food planning"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.22)_0%,rgba(0,0,0,0.42)_55%,rgba(0,0,0,0.68)_100%)]" />

        <div className="relative z-10 mx-auto flex min-h-[82vh] max-w-7xl items-end px-4 pb-12 pt-16 sm:px-6 md:px-10 md:pb-16">
          <div className="max-w-4xl text-white">
            <p className="inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-white/90 backdrop-blur">
              Weekly produce boxes + meal planning
            </p>

            <h1 className="mt-6 font-serif text-[3rem] leading-[0.98] tracking-tight md:text-[6rem]">
              Plan your week.
              <br />
              Build your basket.
              <br />
              Cook more easily.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/88 md:text-lg">
              The Local Pantry combines weekly produce boxes, pantry staples and
              intelligent meal planning to help you decide what to cook — then
              build the basket around it.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/planner"
                className="rounded-full bg-white px-6 py-3 text-sm font-medium text-[#243328] transition hover:bg-[#f4efe9]"
              >
                Start planning your week
              </Link>

              <Link
                href="/shop"
                className="rounded-full border border-white/45 bg-white/10 px-6 py-3 text-sm font-medium text-white backdrop-blur transition hover:bg-white/20"
              >
                Browse produce boxes
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 md:px-10 md:py-16">
        <div className="mx-auto max-w-7xl">
          <section className="rounded-[32px] border border-[#ddd4c8] bg-white/78 p-6 shadow-[0_10px_28px_rgba(36,51,40,0.05)] md:p-8">
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
