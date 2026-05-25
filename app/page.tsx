"use client";

import Link from "next/link";
import SiteHeader from "./components/SiteHeader";
import PostcodeChecker from "./components/PostcodeChecker";
import SiteFooter from "./components/SiteFooter";

const sampleWeek = [
  {
    day: "Monday",
    meal: "Harissa Butter Beans & Couscous",
    image: "/images/recipes/harissa-butterbeans-peppers-couscous.jpg",
    note: "Fast pantry dinner using optional add-ons like beans, couscous and harissa.",
  },
  {
    day: "Wednesday",
    meal: "Courgette Bucatini with Pesto",
    image: "/images/recipes/bucatini-courgette-pesto.jpg",
    note: "A quick pasta built around fresh veg and a useful pantry jar.",
  },
  {
    day: "Friday",
    meal: "Hot Honey Halloumi Couscous",
    image: "/images/recipes/hot-honey-halloumi-couscous.jpg",
    note: "Flexible Friday food using grains, herbs, veg and something punchy.",
  },
];

const benefits = [
  "Less reliance on supermarket trips",
  "Fresh fruit and veg delivered weekly or fortnightly",
  "Useful pantry extras you will not always find locally",
  "Quick meal inspiration for busy weeknights",
  "Pause or cancel your box easily",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f4efe9] text-[#243328]">
      <SiteHeader />

      <section className="bg-[#f4efe9] px-4 pb-10 pt-4 sm:px-6 md:px-10 lg:pb-16 lg:pt-10">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div className="order-1 overflow-hidden rounded-[30px] border border-[#d8cfbf] bg-white shadow-[0_18px_42px_rgba(36,51,40,0.09)] lg:order-2">
            <img
              src="/images/home/hero-image.png"
              alt="The Local Pantry fruit and veg box with pantry extras"
              className="h-[300px] w-full object-cover sm:h-[420px] lg:h-[650px]"
            />
          </div>

          <div className="order-2 max-w-xl lg:order-1">
            <p className="inline-flex rounded-full border border-[#d8cfbf] bg-white/70 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
              Local fruit & veg delivery
            </p>

            <h1 className="mt-5 font-serif text-[2.65rem] leading-[0.98] tracking-tight text-[#243328] sm:text-[3.4rem] md:text-[4.7rem]">
              Make everyday cooking easier.
            </h1>

            <p className="mt-5 max-w-lg text-base leading-8 text-[#5f675c] md:text-lg">
              Weekly fruit and veg delivery with optional pantry extras and
              quick meal inspiration for the week ahead.
            </p>

            <div className="mt-6 rounded-[24px] border border-[#ddd4c8] bg-white/72 p-4">
              <p className="text-sm leading-7 text-[#5f675c]">
                Delivered every Tuesday and Wednesday across Lanark, Carluke and
                surrounding areas.
              </p>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/shop"
                className="rounded-full bg-[#243328] px-7 py-3 text-center text-sm font-medium text-white transition hover:opacity-90"
              >
                Choose your box
              </Link>

              <Link
                href="/shop#pantry"
                className="rounded-full border border-[#d3cabd] bg-white/75 px-7 py-3 text-center text-sm font-medium text-[#243328] transition hover:bg-white"
              >
                Browse pantry extras
              </Link>
            </div>

            <p className="mt-4 text-xs leading-6 text-[#7a8478]">
              Choose weekly or fortnightly. Pause or cancel easily.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 md:px-10 md:py-16">
        <div className="mx-auto max-w-7xl">
          <section className="rounded-[32px] border border-[#ddd4c8] bg-white/78 p-6 shadow-[0_10px_28px_rgba(36,51,40,0.05)] md:p-8">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
              How orders work
            </p>

            <h2 className="mt-3 max-w-3xl font-serif text-[1.9rem] leading-tight text-[#243328] md:text-[2.7rem]">
              Subscribe to fruit and veg. Add pantry extras only when you want
              them.
            </h2>

            <div className="mt-7 grid gap-4 md:grid-cols-3">
              <article className="rounded-[24px] border border-[#e5dccf] bg-[#f8f4ee]/85 p-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#243328] text-sm font-medium text-white">
                  1
                </div>

                <h3 className="mt-4 font-serif text-[1.45rem] leading-tight">
                  Choose your produce box
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#667164]">
                  Pick a weekly or fortnightly box as your regular base for the
                  week ahead.
                </p>
              </article>

              <article className="rounded-[24px] border border-[#e5dccf] bg-[#f8f4ee]/85 p-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#243328] text-sm font-medium text-white">
                  2
                </div>

                <h3 className="mt-4 font-serif text-[1.45rem] leading-tight">
                  Add optional pantry extras
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#667164]">
                  Add jars, beans, pasta, grains and cupboard staples whenever
                  they are useful.
                </p>
              </article>

              <article className="rounded-[24px] border border-[#e5dccf] bg-[#f8f4ee]/85 p-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#243328] text-sm font-medium text-white">
                  3
                </div>

                <h3 className="mt-4 font-serif text-[1.45rem] leading-tight">
                  Cook more easily all week
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#667164]">
                  Use the optional planner for quick, healthy meal ideas built
                  around your box.
                </p>
              </article>
            </div>
          </section>
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-6 md:px-10 md:pb-16">
        <div className="mx-auto max-w-7xl">
          <section className="rounded-[32px] border border-[#d9d0c4] bg-[#efe7db] p-6 shadow-[0_10px_28px_rgba(36,51,40,0.05)] md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
                  Choose your box
                </p>

                <h2 className="mt-3 max-w-3xl font-serif text-[1.9rem] leading-tight text-[#243328] md:text-[2.7rem]">
                  Fruit and veg for the way you cook.
                </h2>
              </div>

              <Link
                href="/shop"
                className="rounded-full bg-[#243328] px-6 py-3 text-center text-sm font-medium text-white transition hover:opacity-90"
              >
                View boxes
              </Link>
            </div>

            <div className="mt-7 grid gap-4 md:grid-cols-2">
              <article className="rounded-[28px] border border-[#ddd4c8] bg-white/72 p-6">
                <p className="inline-flex rounded-full bg-[#243328] px-3 py-1 text-xs text-white">
                  £20
                </p>

                <h3 className="mt-5 font-serif text-3xl text-[#243328]">
                  Weekly Produce Box
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#667164] md:text-base">
                  Fruit and veg for 1–2 people or lighter weekly cooking.
                </p>

                <p className="mt-5 text-sm font-medium text-[#243328]">
                  Best for:
                </p>

                <p className="mt-2 text-sm leading-7 text-[#667164]">
                  Smaller households, solo cooking, couples, or anyone wanting a
                  useful regular produce base.
                </p>
              </article>

              <article className="rounded-[28px] border border-[#ddd4c8] bg-white/72 p-6">
                <p className="inline-flex rounded-full bg-[#243328] px-3 py-1 text-xs text-white">
                  Larger box
                </p>

                <h3 className="mt-5 font-serif text-3xl text-[#243328]">
                  Family Produce Box
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#667164] md:text-base">
                  A fuller fruit and veg box for households cooking regularly
                  throughout the week.
                </p>

                <p className="mt-5 text-sm font-medium text-[#243328]">
                  Best for:
                </p>

                <p className="mt-2 text-sm leading-7 text-[#667164]">
                  Families, shared homes, and people who cook most nights.
                </p>
              </article>
            </div>

            <div className="mt-6 rounded-[24px] border border-[#ddd4c8] bg-white/60 p-5">
              <p className="text-sm leading-7 text-[#667164]">
                Both boxes can be weekly or fortnightly. You can pause or cancel
                easily, and cupboard staples can be added as one-off extras.
              </p>
            </div>
          </section>
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-6 md:px-10 md:pb-16">
        <div className="mx-auto max-w-7xl">
          <section className="grid gap-6 rounded-[32px] border border-[#d9d0c4] bg-white/78 p-6 shadow-[0_10px_28px_rgba(36,51,40,0.05)] md:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
                Why people use it
              </p>

              <h2 className="mt-3 font-serif text-[1.9rem] leading-tight text-[#243328] md:text-[2.7rem]">
                Less supermarket reliance. More useful food at home.
              </h2>

              <p className="mt-5 max-w-2xl text-sm leading-8 text-[#667164] md:text-base">
                The Local Pantry is for people who want better everyday food
                without needing to plan everything from scratch after a busy
                day.
              </p>
            </div>

            <div className="grid gap-3">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="rounded-2xl border border-[#e5dccf] bg-[#f8f4ee]/85 px-4 py-3 text-sm leading-6 text-[#5f675c]"
                >
                  {benefit}
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-6 md:px-10 md:pb-16">
        <div className="mx-auto max-w-7xl">
          <section className="overflow-hidden rounded-[32px] border border-[#d9d0c4] bg-[#efe7db] shadow-[0_10px_28px_rgba(36,51,40,0.05)]">
            <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="p-6 md:p-10">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
                  Pantry extras
                </p>

                <h2 className="mt-3 font-serif text-[2rem] leading-tight text-[#243328] md:text-[3rem]">
                  Add the useful extras when you need them.
                </h2>

                <p className="mt-5 max-w-2xl text-sm leading-8 text-[#667164] md:text-base">
                  Pantry add-ons are there to make cooking easier: sauces,
                  pastes, beans, grains, pasta and harder-to-find cupboard
                  staples.
                </p>

                <div className="mt-6 rounded-[24px] border border-[#ddd4c8] bg-white/65 p-5">
                  <p className="text-sm font-medium text-[#243328]">
                    Only the box repeats.
                  </p>

                  <p className="mt-2 text-sm leading-7 text-[#667164]">
                    Pantry extras are one-off unless you add them again.
                  </p>
                </div>

                <div className="mt-7">
                  <Link
                    href="/shop"
                    className="rounded-full bg-[#243328] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
                  >
                    Browse pantry extras
                  </Link>
                </div>
              </div>

              <div className="relative min-h-[320px] overflow-hidden">
                <img
                  src="/images/home/hero-image.png"
                  alt="Pantry extras with fresh produce"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            </div>
          </section>
        </div>
      </section>

      <section className="bg-[#243328] px-4 py-14 text-white sm:px-6 md:px-10 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-white/60">
                Meal inspiration
              </p>

              <h2 className="mt-3 font-serif text-3xl md:text-5xl">
                Quick ideas for the week ahead.
              </h2>

              <p className="mt-5 text-base leading-8 text-white/80">
                The planner is there when you want inspiration. It suggests
                practical meals using seasonal produce and useful pantry extras,
                without turning dinner into a project.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/planner"
                  className="rounded-full bg-white px-6 py-3 text-sm font-medium text-[#243328] transition hover:bg-[#f4efe9]"
                >
                  Explore the planner
                </Link>

                <Link
                  href="/shop"
                  className="rounded-full border border-white/25 bg-white/5 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Choose your box
                </Link>
              </div>
            </div>

            <div className="grid gap-4">
              {sampleWeek.map((item) => (
                <article
                  key={item.day}
                  className="flex items-center gap-4 rounded-[24px] border border-white/10 bg-white/5 p-4 backdrop-blur transition hover:bg-white/[0.07]"
                >
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-[18px] border border-white/10 bg-white/5">
                    <img
                      src={item.image}
                      alt={item.meal}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm uppercase tracking-[0.12em] text-white/50">
                      {item.day}
                    </p>

                    <h3 className="mt-1 font-serif text-2xl leading-tight text-white">
                      {item.meal}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-white/65">
                      {item.note}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 md:px-10 md:py-16">
        <div className="mx-auto max-w-7xl">
          <section className="rounded-[32px] border border-[#d9d0c4] bg-white/78 p-6 text-center shadow-[0_10px_28px_rgba(36,51,40,0.05)] md:p-10">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
              Local delivery
            </p>

            <h2 className="mx-auto mt-3 max-w-3xl font-serif text-[2rem] leading-tight text-[#243328] md:text-[3rem]">
              Delivered Tuesday and Wednesday across Lanark, Carluke and
              surrounding areas.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-[#667164] md:text-base">
              More areas will be added as demand grows. Check your postcode or
              register interest if you are just outside the current delivery
              area.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/shop"
                className="rounded-full bg-[#243328] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
              >
                Choose your box
              </Link>

              <a
                href="#postcode-checker"
                className="rounded-full border border-[#d3cabd] bg-white/70 px-6 py-3 text-sm font-medium text-[#243328] transition hover:bg-white"
              >
                Check delivery area
              </a>
            </div>
          </section>
        </div>
      </section>

      <PostcodeChecker />

      <SiteFooter />
    </main>
  );
}
