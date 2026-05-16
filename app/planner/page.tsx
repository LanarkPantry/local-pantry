"use client";

import AccountNav from "../account-nav";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "../cart-context";
import {
  produceBoxes,
  pantryItems,
  cupboardItems,
  type ShopDisplayItem,
} from "../shop/shop-data";
import { getUser } from "../lib/authClient";
import { generateWeek, type PlannerStyle } from "../lib/planner";

type PlannerStep = "choices" | "results";

type EatingStyle =
  | "mixed"
  | "mostly-veggie"
  | "vegan"
  | "gluten-free"
  | "quick";

type PlannedMeal = {
  id: string;
  day: string;
  title: string;
  description: string;
  imageUrl: string | null;
  ingredients: string[];
  matchedProducts: string[];
  steps: string[];
};

type ChoiceChipProps = {
  active: boolean;
  label: string;
  onClick: () => void;
};

const DAY_NAMES = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

function ChoiceChip({ active, label, onClick }: ChoiceChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm transition ${
        active
          ? "border-[#243328] bg-[#243328] text-white"
          : "border-[#d6cec2] bg-white/80 text-[#243328] hover:bg-white"
      }`}
    >
      {label}
    </button>
  );
}

function compactCardItem(item: ShopDisplayItem, onAdd: () => void) {
  return (
    <div className="rounded-[20px] border border-[#e4dbcf] bg-white/88 p-4 shadow-[0_8px_18px_rgba(36,51,40,0.04)]">
      <div className="flex items-start gap-3">
        <img
          src={item.image}
          alt={item.name}
          className="h-16 w-16 rounded-[14px] object-cover"
        />

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-[#243328]">{item.name}</p>

          <p className="mt-1 text-sm leading-6 text-[#667164]">
            {item.description}
          </p>

          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-[#243328]">
              £{item.price.toFixed(2)}
            </span>

            <button
              type="button"
              onClick={onAdd}
              className="rounded-full border border-[#d6cec2] bg-[rgba(247,242,235,0.88)] px-3 py-1.5 text-xs font-medium text-[#243328] transition hover:bg-white"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function buildCookingSteps(body: string) {
  return body
    .split(". ")
    .map((step) => step.trim())
    .filter(Boolean)
    .map((step) => (step.endsWith(".") ? step : `${step}.`));
}

function getStyleLabel(style: EatingStyle) {
  switch (style) {
    case "mixed":
      return "Mixed week";
    case "mostly-veggie":
      return "Mostly veggie week";
    case "vegan":
      return "Vegan week";
    case "gluten-free":
      return "Gluten-free friendly week";
    case "quick":
      return "Quick dinners";
    default:
      return "Weekly plan";
  }
}

export default function PlannerPage() {
  const { groupedCart, addToCart } = useCart();

  const [step, setStep] = useState<PlannerStep>("choices");
  const [nights, setNights] = useState(5);
  const [eatingStyle, setEatingStyle] = useState<EatingStyle>("mixed");
  const [week, setWeek] = useState<PlannedMeal[]>([]);
  const [openDay, setOpenDay] = useState<string | null>(null);
  const [plannerError, setPlannerError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    async function checkUser() {
      const user = await getUser();
      setIsLoggedIn(Boolean(user));
      setAuthChecked(true);
    }

    void checkUser();
  }, []);

  const totalBasketItems = useMemo(
    () => groupedCart.reduce((sum, entry) => sum + entry.quantity, 0),
    [groupedCart],
  );

  const basketNames = useMemo(
    () => groupedCart.map((entry) => entry.item.name),
    [groupedCart],
  );

  const hasProduceBox = useMemo(
    () =>
      basketNames.some((name) => name.toLowerCase().includes("produce box")),
    [basketNames],
  );

  const weeklyProduceBox =
    produceBoxes.find((item) => item.name === "Weekly Produce Box") ??
    produceBoxes[0];

  const familyProduceBox =
    produceBoxes.find((item) => item.name === "Family Produce Box") ??
    produceBoxes[1];

  const recommendedAddOns = useMemo(() => {
    const names = new Set<string>();

    week.forEach((meal) => {
      meal.matchedProducts.forEach((productName) => names.add(productName));
    });

    const allAddOns = [...pantryItems, ...cupboardItems];

    return allAddOns.filter((item) => names.has(item.name)).slice(0, 6);
  }, [week]);

  function handleBuildWeek() {
    setPlannerError("");

    const generatedRecipes = generateWeek(eatingStyle as PlannerStyle).slice(
      0,
      nights,
    );

    if (generatedRecipes.length === 0) {
      setPlannerError(
        "No meals matched that choice yet. Try Mixed, Mostly veggie, or Quick dinners while more recipes are being tagged.",
      );
      return;
    }

    const plannedWeek: PlannedMeal[] = generatedRecipes.map(
      (recipe, index) => ({
        id: `${recipe.slug}-${index}`,
        day: DAY_NAMES[index] ?? `Meal ${index + 1}`,
        title: recipe.title,
        description: recipe.intro,
        imageUrl: recipe.image,
        ingredients: recipe.mainIngredients,
        matchedProducts: recipe.pantryMatches,
        steps: buildCookingSteps(recipe.body),
      }),
    );

    setWeek(plannedWeek);
    setOpenDay(null);
    setStep("results");
  }

  function addProductByName(productName: string) {
    const product = [...produceBoxes, ...pantryItems, ...cupboardItems].find(
      (item) => item.name === productName,
    );

    if (!product) return;

    addToCart({
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      checkoutType: product.checkoutType,
    });
  }

  function addDisplayItem(item: ShopDisplayItem) {
    addToCart({
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
      checkoutType: item.checkoutType,
    });
  }

  function addAllAddOns() {
    recommendedAddOns.forEach((item) => addDisplayItem(item));
  }

  return (
    <main className="min-h-screen bg-[#f4efe9] text-[#243328]">
      <section className="border-b border-[rgba(230,221,210,0.86)] px-4 pb-6 pt-5 sm:px-6 md:px-10 md:pb-8 md:pt-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 flex items-center justify-between border-b border-[rgba(221,212,200,0.9)] pb-4">
            <Link href="/" className="text-sm tracking-[0.35em] text-[#60705f]">
              THE LOCAL PANTRY
            </Link>

            <div className="flex items-center gap-3">
              <Link href="/shop" className="text-sm text-[#5f675c]">
                Shop
              </Link>

              <Link href="/basket" className="text-sm text-[#243328]">
                Basket
                {totalBasketItems > 0 ? ` (${totalBasketItems})` : ""}
              </Link>

              <AccountNav />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
            <article className="rounded-[28px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.84)] p-5 shadow-[0_12px_30px_rgba(36,51,40,0.06)] md:p-7">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#6b776c]">
                Weekly planner
              </p>

              <h1 className="mt-3 max-w-3xl font-serif text-[2rem] leading-[1.02] tracking-tight text-[#243328] md:text-[3.35rem]">
                Plan your week
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#5f675c] md:text-base">
                {isLoggedIn
                  ? "You are signed in. Preview a curated week while subscription access is being connected."
                  : "Try a curated preview week built from real recipes and seasonal produce."}
              </p>

              {plannerError ? (
                <div className="mt-5 rounded-[18px] border border-[#e4d8cb] bg-[#fbf6f0] px-4 py-3 text-sm text-[#6a5c4f]">
                  {plannerError}
                </div>
              ) : null}

              {step === "choices" ? (
                <div className="mt-8 space-y-7">
                  <div>
                    <p className="mb-3 text-sm font-medium text-[#243328]">
                      How many nights?
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {[3, 4, 5, 6, 7].map((value) => (
                        <ChoiceChip
                          key={value}
                          active={nights === value}
                          label={`${value} nights`}
                          onClick={() => setNights(value)}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-3 text-sm font-medium text-[#243328]">
                      What kind of week?
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <ChoiceChip
                        active={eatingStyle === "mixed"}
                        label="Mixed"
                        onClick={() => setEatingStyle("mixed")}
                      />

                      <ChoiceChip
                        active={eatingStyle === "mostly-veggie"}
                        label="Mostly veggie"
                        onClick={() => setEatingStyle("mostly-veggie")}
                      />

                      <ChoiceChip
                        active={eatingStyle === "vegan"}
                        label="Vegan"
                        onClick={() => setEatingStyle("vegan")}
                      />

                      <ChoiceChip
                        active={eatingStyle === "gluten-free"}
                        label="Gluten-free"
                        onClick={() => setEatingStyle("gluten-free")}
                      />

                      <ChoiceChip
                        active={eatingStyle === "quick"}
                        label="Quick dinners"
                        onClick={() => setEatingStyle("quick")}
                      />
                    </div>

                    <p className="mt-3 max-w-2xl text-xs leading-5 text-[#667164]">
                      This uses your saved recipe library rather than expensive
                      live recipe generation. It keeps the planner useful,
                      predictable and affordable to run.
                    </p>
                  </div>

                  <div className="rounded-[22px] border border-[#ddd4c8] bg-white/65 p-4">
                    <p className="text-sm font-medium text-[#243328]">
                      This is a curated preview
                    </p>

                    <p className="mt-2 text-sm leading-6 text-[#667164]">
                      The full subscriber planner will include swaps, saved
                      weeks, My Regulars and basket-aware planning.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-1">
                    <button
                      type="button"
                      onClick={handleBuildWeek}
                      disabled={!authChecked}
                      className="rounded-full bg-[#243328] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {authChecked ? "Preview my week" : "Checking account..."}
                    </button>

                    <Link
                      href="/shop"
                      className="rounded-full border border-[#d6cec2] bg-white/80 px-5 py-3 text-sm text-[#243328] transition hover:bg-white"
                    >
                      Browse the shop
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setStep("choices")}
                    className="rounded-full bg-[#243328] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
                  >
                    Preview another week
                  </button>

                  <Link
                    href="/shop"
                    className="rounded-full border border-[#d6cec2] bg-white/80 px-5 py-3 text-sm text-[#243328] transition hover:bg-white"
                  >
                    Browse the shop
                  </Link>
                </div>
              )}
            </article>

            <article className="overflow-hidden rounded-[28px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.86)] shadow-[0_10px_24px_rgba(36,51,40,0.05)]">
              <div className="relative min-h-[280px]">
                <img
                  src="/hero.jpg"
                  alt="The Local Pantry planner"
                  className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.28)_52%,rgba(0,0,0,0.42)_100%)]" />

                <div className="relative z-10 flex min-h-[280px] items-end p-6 text-white md:p-7">
                  <div className="max-w-md">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/80">
                      Food first
                    </p>

                    <h2 className="mt-2 font-serif text-[1.9rem] leading-tight md:text-[2.35rem]">
                      A full week that still feels good to cook
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-white/86">
                      A veg box that comes with a plan: meals, pantry ideas and
                      a calmer way to organise the week.
                    </p>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {step === "results" ? (
        <section className="px-4 py-8 sm:px-6 md:px-10 md:py-10">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 rounded-[24px] border border-[#ddd4c8] bg-[rgba(255,255,255,0.86)] p-5 shadow-[0_10px_24px_rgba(36,51,40,0.05)] md:p-6">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
                Planner preview
              </p>

              <h3 className="mt-2 font-serif text-2xl text-[#243328]">
                {getStyleLabel(eatingStyle)}
              </h3>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-[#5f675c]">
                {isLoggedIn
                  ? "You are signed in. This is still the preview planner. The next step is connecting active weekly box subscription access."
                  : "This is a curated sample week. The full adjustable planner is included with a weekly veg box subscription."}
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href="/shop"
                  className="rounded-full bg-[#243328] px-5 py-2.5 text-sm text-white transition hover:opacity-90"
                >
                  {isLoggedIn
                    ? "Choose a weekly veg box"
                    : "Start a weekly veg box"}
                </Link>

                {!isLoggedIn ? (
                  <Link
                    href="/login"
                    className="rounded-full border border-[#d6cec2] bg-white/80 px-5 py-2.5 text-sm text-[#243328] transition hover:bg-white"
                  >
                    Create account
                  </Link>
                ) : null}
              </div>
            </div>

            {!hasProduceBox ? (
              <div className="mb-6 rounded-[24px] border border-[#ddd4c8] bg-[rgba(247,242,235,0.86)] p-5 shadow-[0_10px_24px_rgba(36,51,40,0.04)] md:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
                      Start with the box
                    </p>

                    <h3 className="mt-2 font-serif text-2xl text-[#243328]">
                      Add a weekly produce box as your base
                    </h3>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[#667164]">
                      The planner works best when the produce box gives the week
                      its starting point.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {weeklyProduceBox ? (
                      <button
                        type="button"
                        onClick={() => addDisplayItem(weeklyProduceBox)}
                        className="rounded-full bg-[#243328] px-5 py-2.5 text-sm text-white transition hover:opacity-90"
                      >
                        Add weekly box
                      </button>
                    ) : null}

                    {familyProduceBox ? (
                      <button
                        type="button"
                        onClick={() => addDisplayItem(familyProduceBox)}
                        className="rounded-full border border-[#d6cec2] bg-white/80 px-5 py-2.5 text-sm text-[#243328] transition hover:bg-white"
                      >
                        Add family box
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}

            <div className="grid gap-5 lg:grid-cols-2">
              {week.map((meal) => {
                const isOpen = openDay === meal.id;

                return (
                  <article
                    key={meal.id}
                    className="overflow-hidden rounded-[26px] border border-[rgba(221,212,200,0.95)] bg-[rgba(255,255,255,0.86)] shadow-[0_10px_24px_rgba(36,51,40,0.05)]"
                  >
                    <img
                      src={meal.imageUrl ?? ""}
                      alt={meal.title}
                      className="h-56 w-full object-cover"
                    />

                    <div className="p-5 md:p-6">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] uppercase tracking-[0.16em] text-[#6b776c]">
                            {meal.day}
                          </p>

                          <h3 className="mt-1 font-serif text-[1.55rem] leading-tight text-[#243328]">
                            {meal.title}
                          </h3>

                          <p className="mt-3 text-sm leading-6 text-[#667164]">
                            {meal.description}
                          </p>
                        </div>

                        <button
                          type="button"
                          className="rounded-full border border-[#d6cec2] bg-[rgba(247,242,235,0.84)] px-3.5 py-1.5 text-xs font-medium text-[#243328]"
                        >
                          Save to My Regulars
                        </button>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {meal.ingredients.map((ingredient) => (
                          <span
                            key={ingredient}
                            className="rounded-full border border-[#ddd4c8] bg-[rgba(247,242,235,0.82)] px-3 py-1.5 text-xs font-medium text-[#4f5e52]"
                          >
                            {ingredient}
                          </span>
                        ))}
                      </div>

                      {meal.matchedProducts.length > 0 ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {meal.matchedProducts.map((product) => (
                            <button
                              key={product}
                              type="button"
                              onClick={() => addProductByName(product)}
                              className="rounded-full border border-[#d6cec2] bg-white/80 px-3 py-1.5 text-xs font-medium text-[#243328] transition hover:bg-white"
                            >
                              Add {product}
                            </button>
                          ))}
                        </div>
                      ) : null}

                      <div className="mt-5 rounded-[20px] border border-[#e6ddd2] bg-[rgba(249,246,241,0.78)] p-4">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenDay((current) =>
                              current === meal.id ? null : meal.id,
                            )
                          }
                          className="flex w-full items-center justify-between gap-4 text-left"
                        >
                          <span className="text-sm font-medium text-[#243328]">
                            Cooking steps
                          </span>

                          <span className="text-xs text-[#5f675c]">
                            {isOpen ? "Hide" : "Show"}
                          </span>
                        </button>

                        {isOpen ? (
                          <ol className="mt-4 space-y-2.5 text-sm leading-6 text-[#5f675c]">
                            {meal.steps.map((stepText, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-3"
                              >
                                <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#d6cec2] text-[10px] text-[#243328]">
                                  {index + 1}
                                </span>

                                <span>{stepText}</span>
                              </li>
                            ))}
                          </ol>
                        ) : null}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {recommendedAddOns.length > 0 ? (
              <section className="mt-8 rounded-[26px] border border-[#ddd4c8] bg-[rgba(247,242,235,0.86)] p-5 shadow-[0_10px_24px_rgba(36,51,40,0.04)] md:p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
                      Matched pantry extras
                    </p>

                    <h3 className="mt-2 font-serif text-2xl text-[#243328]">
                      Useful add-ons for this week
                    </h3>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[#667164]">
                      These are pulled from the meals in your plan so the basket
                      starts to build around what you are actually cooking.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addAllAddOns}
                    className="rounded-full bg-[#243328] px-5 py-2.5 text-sm text-white transition hover:opacity-90"
                  >
                    Add all suggested extras
                  </button>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {recommendedAddOns.map((item) =>
                    compactCardItem(item, () => addDisplayItem(item)),
                  )}
                </div>
              </section>
            ) : null}
          </div>
        </section>
      ) : null}
    </main>
  );
}
