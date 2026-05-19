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
  },
  {
    day: "Tuesday",
    meal: "Sticky Miso Greens & Rice",
    image: "/images/recipes/sticky-miso-chicken-tenderstem-rice.jpg",
  },
  {
    day: "Wednesday",
    meal: "Hot Honey Halloumi Couscous",
    image: "/images/recipes/hot-honey-halloumi-couscous.jpg",
  },
  {
    day: "Thursday",
    meal: "Courgette Bucatini with Pesto",
    image: "/images/recipes/bucatini-courgette-pesto.jpg",
  },
  {
    day: "Friday",
    meal: "Tomato Chickpeas & Soft Herbs",
    image: "/images/recipes/citrus-herb-halloumi-couscous-salad.jpg",
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
            <p className="inline-flex rounded-full border border-white/35 bg-white/15 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-white backdrop-blur">
              Weekly grocery delivery + meal planning
            </p>

            <h1 className="mt-6 font-serif text-[2.35rem] leading-[1.02] tracking-tight md:text-[4.6rem]">
              Plan your meals.
              <br />
              Build your basket.
              <br />
              Get local delivery.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/92 md:text-lg">
              Flexible meal planning paired with local grocery delivery. Build
              weekly or fortnightly baskets around the way you actually cook.
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
          <section className="rounded-[32px] border border-[#d9d0c4] bg-[#efe7db] p-6 shadow-[0_10px_28px_rgba(36,51,40,0.05)] md:p-8">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
              Pantry membership
            </p>

            <h2 className="mt-3 font-serif text-[1.9rem] leading-tight text-[#243328] md:text-[2.6rem]">
              A flexible food rhythm, not a recipe box.
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#667164] md:text-base">
              Local Pantry membership lets you save meals, repeat favourite
              baskets and choose weekly or fortnightly grocery delivery around
              the way you actually cook.
            </p>

            <div className="mt-7 grid gap-4 md:grid-cols-3">
              <article className="rounded-[24px] border border-[#ddd4c8] bg-white/70 p-5">
                <p className="text-sm font-medium text-[#243328]">
                  Choose your rhythm
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
                  Keep favourite meals, pantry staples and repeat baskets in one
                  place so future weeks are easier.
                </p>
              </article>

              <article className="rounded-[24px] border border-[#ddd4c8] bg-white/70 p-5">
                <p className="text-sm font-medium text-[#243328]">
                  Local delivery
                </p>

                <p className="mt-2 text-sm leading-7 text-[#667164]">
                  Starting with a small local rollout keeps delivery practical,
                  personal and easier to manage well.
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
                Build your own weekly rhythm around practical meals, pantry
                staples and seasonal produce — then save favourite weeks and
                repeat them easily.
              </p>

              <div className="mt-7 rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-sm font-medium text-white">
                  Designed for normal home cooking
                </p>

                <p className="mt-2 text-sm leading-7 text-white/70">
                  Flexible meals, repeat ingredients and practical pantry
                  staples help reduce food waste and decision fatigue through
                  the week.
                </p>
              </div>

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
                      Example planner meal — swap, save and repeat your own
                      versions.
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
                  Grocery delivery currently available in ML11.
                </h2>

                <p className="mt-5 max-w-2xl text-sm leading-8 text-[#667164] md:text-base">
                  The Local Pantry is currently testing local weekly delivery of
                  produce boxes and pantry staples across ML11 and nearby areas
                  while the service grows carefully.
                </p>

                <div className="mt-6 rounded-[24px] border border-[#ddd4c8] bg-white/65 p-5">
                  <p className="text-sm font-medium text-[#243328]">
                    Small local rollout
                  </p>

                  <p className="mt-2 text-sm leading-7 text-[#667164]">
                    Starting locally keeps deliveries practical, flexible and
                    personal while the planner and subscription system continue
                    to evolve.
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

      <section className="px-4 pb-12 sm:px-6 md:px-10 md:pb-16">
        <div className="mx-auto max-w-7xl">
          <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <article className="rounded-[30px] border border-[#ddd4c8] bg-white/78 p-6 shadow-[0_10px_28px_rgba(36,51,40,0.05)] md:p-8">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
                Planner access
              </p>

              <h2 className="mt-3 font-serif text-[2rem] leading-tight text-[#243328] md:text-[2.6rem]">
                Explore the planner freely.
              </h2>

              <p className="mt-4 text-sm leading-7 text-[#667164] md:text-base">
                Try meal planning, browse pantry staples and build baskets
                freely. Save weeks, regular meals and subscription tools unlock
                with weekly delivery membership.
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
                Flexible groceries
              </p>

              <h2 className="mt-3 font-serif text-[2rem] leading-tight text-[#243328] md:text-[2.6rem]">
                Pantry staples + produce boxes.
              </h2>

              <p className="mt-4 text-sm leading-7 text-[#667164] md:text-base">
                Build your own weekly basket around practical ingredients,
                repeat meals and calmer everyday cooking.
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
      <SiteFooter />
    </main>
  );
}
