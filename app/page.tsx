"use client";

import Link from "next/link";
import SiteHeader from "./components/SiteHeader";

const weeklyMeals = [
  {
    day: "Monday",
    meal: "Harissa Butter Beans & Couscous",
    image: "/images/recipes/harissa-butterbeans-peppers-couscous.jpg",
  },
  {
    day: "Tuesday",
    meal: "Sticky Miso Chicken & Tenderstem Rice",
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
    meal: "Citrus Herb Halloumi Couscous Salad",
    image: "/images/recipes/citrus-herb-halloumi-couscous-salad.jpg",
  },
];

const steps = [
  {
    title: "Choose your weekly box",
    text: "Seasonal fruit and veg designed around realistic home cooking.",
  },
  {
    title: "Get meal ideas for the week",
    text: "Flexible dinners matched around what’s already arriving.",
  },
  {
    title: "Add pantry extras only when needed",
    text: "Beans, grains, pesto, sauces and cupboard staples matched to the meals.",
  },
  {
    title: "Build your regulars",
    text: "Save meals you actually enjoy cooking and bring them back anytime.",
  },
];

const benefits = [
  "Less food waste",
  "Fewer food decisions",
  "Useful weeknight meals",
  "Flexible ingredients",
  "Pantry-led cooking",
  "Meals that work together",
];

const includedGroups = [
  {
    title: "Weekly Produce",
    text: "Seasonal vegetables and fruit chosen around practical home cooking.",
  },
  {
    title: "Pantry Jars",
    text: "Rose harissa, pesto, miso, sauces and flavour foundations.",
  },
  {
    title: "Cupboard Staples",
    text: "Beans, pasta, grains and useful extras that support the week.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f4efe9] text-[#243328]">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <img
          src="/hero.jpg"
          alt="The Local Pantry"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.18)_0%,rgba(0,0,0,0.42)_60%,rgba(0,0,0,0.6)_100%)]" />

        <div className="relative z-10 mx-auto flex min-h-[78vh] max-w-7xl items-end px-4 pb-12 sm:px-6 md:px-10">
          <div className="max-w-3xl text-white">
            <div className="inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/90 backdrop-blur">
              A veg box that comes with a plan
            </div>

            <h1 className="mt-6 font-serif text-4xl leading-tight md:text-6xl">
              Your weekly box, already matched to meals you’ll actually want to
              cook.
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/90">
              Seasonal produce, useful pantry staples and flexible meal ideas
              designed to make weeknight cooking feel calmer and easier.
            </p>

            <p className="mt-4 max-w-2xl text-base leading-7 text-white/80">
              So dinner is already halfway figured out before the week starts.
            </p>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75">
              Save meals to My Regulars, build your own library of reliable
              dinners, and add ingredients straight to your basket.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/planner"
                className="rounded-full bg-white px-6 py-3 text-sm font-medium text-[#243328]"
              >
                Start your weekly plan
              </Link>

              <Link
                href="/planner"
                className="rounded-full border border-white/40 px-6 py-3 text-sm text-white"
              >
                Explore meal plans
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm uppercase tracking-[0.18em] text-[#6b776c]">
            Why it works
          </p>

          <h2 className="mt-3 font-serif text-3xl md:text-5xl">
            Most people don’t need more recipes.
          </h2>

          <p className="mt-5 text-base leading-8 text-[#5f675c] md:text-lg">
            They need fewer decisions, less waste, meals that work together, and
            a simpler way to organise food for the week.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => (
            <div
              key={benefit}
              className="rounded-[24px] border border-[#ddd4c8] bg-white/70 p-5 text-center shadow-[0_10px_24px_rgba(36,51,40,0.04)]"
            >
              <p className="text-sm font-medium text-[#243328]">{benefit}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#ede5da] px-4 py-16 sm:px-6 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.18em] text-[#6b776c]">
              What arrives with the week
            </p>

            <h2 className="mt-3 font-serif text-3xl md:text-5xl">
              Ingredients designed to work together.
            </h2>

            <p className="mt-5 text-base leading-8 text-[#5f675c]">
              Built to work with normal cupboards and flexible cooking — not
              rigid meal kits or complicated recipes.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {includedGroups.map((group) => (
              <article
                key={group.title}
                className="rounded-[28px] border border-[#d9d1c5] bg-[#f7f2eb]/90 p-7 shadow-[0_12px_30px_rgba(36,51,40,0.05)]"
              >
                <h3 className="font-serif text-2xl text-[#243328]">
                  {group.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-[#667164]">
                  {group.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-[#6b776c]">
              How it works
            </p>

            <h2 className="mt-3 font-serif text-3xl md:text-5xl">
              A weekly food rhythm, not just a delivery.
            </h2>

            <p className="mt-5 text-base leading-8 text-[#5f675c]">
              The produce box gives the week a starting point. The planner turns
              it into meals. Your saved regulars make it easier every time you
              come back.
            </p>

            <Link
              href="/planner"
              className="mt-7 inline-flex rounded-full bg-[#243328] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Open the planner
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {steps.map((step, index) => (
              <article
                key={step.title}
                className="rounded-[28px] border border-[#ddd4c8] bg-white/70 p-6 shadow-[0_12px_28px_rgba(36,51,40,0.04)]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#243328] text-sm text-white">
                  {index + 1}
                </div>

                <h3 className="mt-5 font-serif text-2xl">{step.title}</h3>

                <p className="mt-3 text-sm leading-7 text-[#667164]">
                  {step.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#243328] px-4 py-16 text-white sm:px-6 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-white/60">
                Example week
              </p>

              <h2 className="mt-3 font-serif text-3xl md:text-5xl">
                This week’s meals.
              </h2>

              <p className="mt-5 text-base leading-8 text-white/80">
                Flexible meal ideas built around seasonal ingredients, pantry
                staples and normal weeknight cooking.
              </p>

              <div className="mt-7 rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-sm font-medium text-white">
                  Save meals to My Regulars
                </p>

                <p className="mt-2 text-sm leading-7 text-white/70">
                  Build your own collection of trusted dinners you can bring
                  back anytime.
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              {weeklyMeals.map((item) => (
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

                  <div className="flex-1 min-w-0">
                    <p className="text-sm uppercase tracking-[0.12em] text-white/50">
                      {item.day}
                    </p>

                    <h3 className="mt-1 font-serif text-2xl leading-tight text-white">
                      {item.meal}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-white/65">
                      Simple weeknight cooking built around the week’s
                      ingredients.
                    </p>
                  </div>

                  <button className="shrink-0 rounded-full border border-white/20 px-4 py-2 text-sm text-white transition hover:bg-white/10">
                    Save
                  </button>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 md:py-20">
        <p className="text-sm uppercase tracking-[0.18em] text-[#6b776c]">
          Starting local
        </p>

        <h2 className="mt-3 font-serif text-3xl md:text-5xl">
          Weekly food planning for ML11.
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#5f675c]">
          Limited weekly deliveries built around useful produce, pantry staples
          and practical meal ideas for real life.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/shop"
            className="rounded-full bg-[#243328] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            Start with a weekly box
          </Link>

          <Link
            href="/planner"
            className="rounded-full border border-[#d7cec2] px-6 py-3 text-sm text-[#243328]"
          >
            Preview the planner
          </Link>
        </div>
      </section>
    </main>
  );
}
