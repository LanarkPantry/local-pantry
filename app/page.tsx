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
    note: "Fast pantry dinner with couscous, peppers and herbs.",
  },
  {
    day: "Wednesday",
    meal: "Courgette Bucatini with Pesto",
    image: "/images/recipes/bucatini-courgette-pesto.jpg",
    note: "Simple midweek pasta using pantry staples and greens.",
  },
  {
    day: "Friday",
    meal: "Hot Honey Halloumi Couscous",
    image: "/images/recipes/hot-honey-halloumi-couscous.jpg",
    note: "Flexible Friday meal with herbs, grains and vegetables.",
  },
];

const howItWorks = [
  {
    number: "1",
    title: "Choose your meals",
    text: "Choose meals for the week ahead.",
    image: "/images/home/plan-your-week.jpg",
  },
  {
    number: "2",
    title: "Build your basket",
    text: "Add ingredients, pantry staples and produce boxes to your basket.",
    image: "/images/home/build-your-basket.jpg",
  },
  {
    number: "3",
    title: "Get ingredients delivered",
    text: "Get flexible weekly or fortnightly local delivery.",
    image: "/images/home/save-your-regulars.jpg",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f4efe9] text-[#243328]">
      <SiteHeader />

      <section className="relative min-h-[82vh] overflow-hidden">
        <img
          src="/hero.jpg"
          alt="Weekly grocery planning and delivery"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.28)_52%,rgba(0,0,0,0.56)_100%)]" />

        <div className="relative z-10 mx-auto flex min-h-[82vh] max-w-7xl items-end px-4 pb-12 pt-16 sm:px-6 md:px-10 md:pb-16">
          <div className="max-w-4xl text-white">
            <a
              href="#membership"
              className="inline-flex rounded-full border border-white/35 bg-white/15 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-white backdrop-blur transition hover:bg-white/20"
            >
              LOCAL PANTRY MEMBERSHIP
            </a>

            <h1 className="mt-6 font-serif text-[2.35rem] leading-[1.02] tracking-tight md:text-[4.6rem]">
              Plan your meals.
              <br />
              Build your basket.
              <br />
              Get local delivery.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/92 md:text-lg">
              Meal planning paired with local grocery delivery for normal home
              cooking.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/planner"
                className="rounded-full bg-white px-6 py-3 text-sm font-medium text-[#243328] transition hover:bg-[#f4efe9]"
              >
                Explore the planner
              </Link>

              <Link
                href="/shop"
                className="rounded-full border border-white/45 bg-white/10 px-6 py-3 text-sm font-medium text-white backdrop-blur transition hover:bg-white/20"
              >
                Build your basket
              </Link>
            </div>

            <p className="mt-4 text-xs leading-6 text-white/70">
              Free to explore. Save meals and flexible delivery plans with Local
              Pantry membership.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 md:px-10 md:py-16">
        <div className="mx-auto max-w-7xl">
          <section className="rounded-[32px] border border-[#ddd4c8] bg-white/78 p-5 shadow-[0_10px_28px_rgba(36,51,40,0.05)] md:p-8">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
              How it works
            </p>

            <h2 className="mt-3 font-serif text-[1.8rem] leading-tight text-[#243328] md:text-[2.5rem]">
              Flexible weekly groceries built around real cooking.
            </h2>

            <div className="mt-7 grid gap-5 md:grid-cols-3">
              {howItWorks.map((step) => (
                <article
                  key={step.number}
                  className="rounded-[24px] border border-[#e5dccf] bg-[#f8f4ee]/85 p-4"
                >
                  <img
                    src={step.image}
                    alt={step.title}
                    className="h-36 w-full rounded-[18px] object-cover sm:h-40 md:h-36 lg:h-40"
                  />

                  <div className="mt-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#243328] text-sm font-medium text-white">
                    {step.number}
                  </div>

                  <h3 className="mt-4 font-serif text-[1.45rem] leading-tight text-[#243328]">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[#667164]">
                    {step.text}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
      <section className="px-4 pb-12 sm:px-6 md:px-10 md:pb-16">
        <div className="mx-auto max-w-7xl">
          <section
            id="membership"
            className="rounded-[32px] border border-[#d9d0c4] bg-[#efe7db] p-6 shadow-[0_10px_28px_rgba(36,51,40,0.05)] md:p-8"
          >
            {" "}
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
              Pantry membership
            </p>
            <h2 className="mt-3 font-serif text-[1.9rem] leading-tight text-[#243328] md:text-[2.6rem]">
              Local groceries for normal home cooking.
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#667164] md:text-base">
              Local Pantry membership lets you save meals, repeat full weeks and
              choose weekly or fortnightly grocery delivery around the way you
              actually cook.
            </p>
            <div className="mt-7 grid gap-4 md:grid-cols-3">
              <article className="rounded-[24px] border border-[#ddd4c8] bg-white/70 p-5">
                <p className="text-sm font-medium text-[#243328]">
                  Choose your frequency
                </p>

                <p className="mt-2 text-sm leading-7 text-[#667164]">
                  Pick weekly or fortnightly delivery, then build your plan
                  around the meals and ingredients you want.
                </p>
              </article>

              <article className="rounded-[24px] border border-[#ddd4c8] bg-white/70 p-5">
                <p className="text-sm font-medium text-[#243328]">
                  Save your regulars
                </p>

                <p className="mt-2 text-sm leading-7 text-[#667164]">
                  Build your own collection of saved meals and week plans.
                </p>
              </article>

              <article className="rounded-[24px] border border-[#ddd4c8] bg-white/70 p-5">
                <p className="text-sm font-medium text-[#243328]">
                  Local produce
                </p>

                <p className="mt-2 text-sm leading-7 text-[#667164]">
                  Seasonal produce boxes and practical pantry staples designed
                  for everyday home cooking.
                </p>
              </article>
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/planner"
                className="rounded-full bg-[#243328] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
              >
                Explore the planner
              </Link>

              <Link
                href="/shop"
                className="rounded-full border border-[#d3cabd] bg-white/70 px-6 py-3 text-sm text-[#243328] transition hover:bg-white"
              >
                Build your basket
              </Link>
            </div>
          </section>
        </div>
      </section>
      <section className="bg-[#243328] px-4 py-14 text-white sm:px-6 md:px-10 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-white/60">
                Sample week
              </p>

              <h2 className="mt-3 font-serif text-3xl md:text-5xl">
                A flexible week from the planner.
              </h2>

              <p className="mt-5 text-base leading-8 text-white/80">
                Example meals from the planner using practical ingredients,
                pantry staples and seasonal produce for everyday home cooking.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/planner"
                  className="rounded-full bg-white px-6 py-3 text-sm font-medium text-[#243328] transition hover:bg-[#f4efe9]"
                >
                  Create your own plan
                </Link>

                <Link
                  href="/shop"
                  className="rounded-full border border-white/25 bg-white/5 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Browse the pantry
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
          <section className="overflow-hidden rounded-[32px] border border-[#d9d0c4] bg-[#efe7db] shadow-[0_10px_28px_rgba(36,51,40,0.05)]">
            <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="p-6 md:p-10">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
                  Local delivery
                </p>

                <h2 className="mt-3 font-serif text-[2rem] leading-tight text-[#243328] md:text-[3rem]">
                  Grocery delivery currently available in Ml8 and ML11.
                </h2>

                <p className="mt-5 max-w-2xl text-sm leading-8 text-[#667164] md:text-base">
                  Seasonal produce boxes, pantry staples and practical weekly
                  groceries delivered across ML8 and ML11.
                </p>

                <div className="mt-6 rounded-[24px] border border-[#ddd4c8] bg-white/65 p-5">
                  <p className="text-sm font-medium text-[#243328]">
                    Everyday groceries
                  </p>

                  <p className="mt-2 text-sm leading-7 text-[#667164]">
                    Build weekly or fortnightly plans around practical
                    ingredients, repeat meals and calmer everyday cooking.
                  </p>
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    href="/shop"
                    className="rounded-full bg-[#243328] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
                  >
                    Browse weekly groceries
                  </Link>

                  <Link
                    href="/planner"
                    className="rounded-full border border-[#d3cabd] bg-white/70 px-6 py-3 text-sm text-[#243328] transition hover:bg-white"
                  >
                    Explore the planner
                  </Link>
                </div>
              </div>

              <div className="relative min-h-[320px] overflow-hidden">
                <img
                  src="/images/home/local-delivery.jpg"
                  alt="Local grocery delivery"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            </div>
          </section>
        </div>
      </section>

      <PostcodeChecker />

      <SiteFooter />
    </main>
  );
}
