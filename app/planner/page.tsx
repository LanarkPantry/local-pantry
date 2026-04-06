"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useCart } from "../cart-context";

type DayKey =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

type GeneratedRecipe = {
  title: string;
  description: string;
  ingredientsUsed: string[];
  pantryStaples: string[];
  steps: string[];
};

type RecipeApiResponse = {
  recipe: GeneratedRecipe;
  imageUrl: string | null;
  error?: string;
};

type PlannedMeal = GeneratedRecipe & {
  imageUrl: string | null;
  sourceItems: string[];
  dayTheme: string;
};

const DAYS: { key: DayKey; label: string; short: string }[] = [
  { key: "monday", label: "Monday", short: "Mon" },
  { key: "tuesday", label: "Tuesday", short: "Tue" },
  { key: "wednesday", label: "Wednesday", short: "Wed" },
  { key: "thursday", label: "Thursday", short: "Thu" },
  { key: "friday", label: "Friday", short: "Fri" },
  { key: "saturday", label: "Saturday", short: "Sat" },
  { key: "sunday", label: "Sunday", short: "Sun" },
];

const BOX_HERO_IMAGE = "/family-harvest-box.png";

const BOX_DISPLAY_CONTENTS = [
  "Carrots",
  "Potatoes",
  "Broccoli",
  "Spinach",
  "Peppers",
  "Tomatoes",
  "Cucumber",
  "Lettuce",
  "Apples",
  "Oranges",
  "Grapes",
  "Fresh herbs",
];

const BOX_COPY_GROUPS = [
  {
    title: "Roots & staples",
    text: "Carrots, potatoes, onions and the everyday bits that make a week of cooking work.",
  },
  {
    title: "Greens & colour",
    text: "Broccoli, spinach, leaves, tomatoes, peppers and other useful veg through the week.",
  },
  {
    title: "Fruit & fresh extras",
    text: "Apples, oranges, grapes and other seasonal fruit, herbs and useful finishing bits.",
  },
];

const WEEK_STRUCTURES = [
  {
    label: "Roast plate night",
    quickStart: "use-what-ive-got",
    supports: ["lentils", "yoghurt", "fresh herbs"],
  },
  {
    label: "Pasta or orzo night",
    quickStart: "quick-tonight",
    supports: ["pasta", "orzo", "parmesan"],
  },
  {
    label: "Rice or grain bowl",
    quickStart: "quick-tonight",
    supports: ["rice", "beans", "lime"],
  },
  {
    label: "Soup or brothy pot",
    quickStart: "comforting",
    supports: ["stock", "beans", "bread"],
  },
  {
    label: "Traybake or roast tin",
    quickStart: "use-what-ive-got",
    supports: ["couscous", "harissa", "herbs"],
  },
  {
    label: "Comforting weekend dish",
    quickStart: "comforting",
    supports: ["eggs", "cheese", "cream"],
  },
  {
    label: "Use-up meal",
    quickStart: "use-what-ive-got",
    supports: ["farro", "lentils", "yoghurt"],
  },
];

const WIDE_VEG_POOL = [
  "carrots",
  "potatoes",
  "broccoli",
  "spinach",
  "peppers",
  "tomatoes",
  "courgette",
  "greens",
  "cucumber",
  "lettuce",
  "onions",
  "garlic",
  "apples",
  "oranges",
  "grapes",
  "fresh herbs",
  "kale",
  "leeks",
  "spring onions",
  "beans",
];

function uniqueTrimmed(values: string[]) {
  return Array.from(new Set(values.map((item) => item.trim()).filter(Boolean)));
}

function rotateList(values: string[], index: number) {
  return [...values.slice(index), ...values.slice(0, index)];
}

function buildDayItems(dayIndex: number, customIngredients: string[]) {
  const rotatedVeg = rotateList(WIDE_VEG_POOL, dayIndex * 2);
  const structure = WEEK_STRUCTURES[dayIndex % WEEK_STRUCTURES.length];

  const heroVeg = rotatedVeg.slice(0, 4);
  const secondaryVeg = rotatedVeg.slice(4, 7);

  return uniqueTrimmed([
    ...heroVeg,
    ...secondaryVeg,
    ...structure.supports,
    ...customIngredients,
  ]).slice(0, 12);
}

export default function PlannerPage() {
  const { cart, addManyToCart } = useCart();

  const [customIngredients, setCustomIngredients] = useState("");
  const [includeBasketItems, setIncludeBasketItems] = useState(true);
  const [weekPlan, setWeekPlan] = useState<Record<DayKey, PlannedMeal | null>>({
    monday: null,
    tuesday: null,
    wednesday: null,
    thursday: null,
    friday: null,
    saturday: null,
    sunday: null,
  });
  const [loading, setLoading] = useState(false);
  const [loadingLabel, setLoadingLabel] = useState("");
  const [error, setError] = useState("");
  const [activeDay, setActiveDay] = useState<DayKey>("monday");
  const [basketMessage, setBasketMessage] = useState("");

  const totalItems = useMemo(() => cart.length, [cart]);

  const basketIngredients = useMemo(() => {
    return Array.from(new Set(cart.map((item) => item.name)));
  }, [cart]);

  const typedIngredients = useMemo(() => {
    return customIngredients
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }, [customIngredients]);

  const plannerBaseIngredients = useMemo(() => {
    return uniqueTrimmed([
      ...BOX_DISPLAY_CONTENTS,
      ...(includeBasketItems ? basketIngredients : []),
      ...typedIngredients,
    ]);
  }, [basketIngredients, includeBasketItems, typedIngredients]);

  const activeMeal = weekPlan[activeDay];

  const weeklyExtras = useMemo(() => {
    const suggestions = new Set<string>();

    Object.values(weekPlan).forEach((meal) => {
      if (!meal) return;

      meal.ingredientsUsed.forEach((ingredient) => {
        const lower = ingredient.toLowerCase();

        const alreadyCovered = plannerBaseIngredients.some(
          (item) =>
            lower.includes(item.toLowerCase()) ||
            item.toLowerCase().includes(lower),
        );

        if (!alreadyCovered) {
          suggestions.add(ingredient);
        }
      });
    });

    return Array.from(suggestions).slice(0, 16);
  }, [plannerBaseIngredients, weekPlan]);

  async function generateWeekPlan() {
    setLoading(true);
    setError("");
    setBasketMessage("");

    const nextWeek: Record<DayKey, PlannedMeal | null> = {
      monday: null,
      tuesday: null,
      wednesday: null,
      thursday: null,
      friday: null,
      saturday: null,
      sunday: null,
    };

    const previousRecipes: Array<{
      title: string;
      description: string;
      ingredientsUsed: string[];
    }> = [];

    try {
      for (const [index, day] of DAYS.entries()) {
        const structure = WEEK_STRUCTURES[index % WEEK_STRUCTURES.length];
        const items = buildDayItems(index, typedIngredients);

        setLoadingLabel(`${day.label}: ${structure.label}`);

        const response = await fetch("/api/recipe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: includeBasketItems
              ? uniqueTrimmed([...items, ...basketIngredients]).slice(0, 16)
              : items,
            quickStart: structure.quickStart,
            preferences: [],
            previousRecipes,
            weekPlanContext: {
              mode: "plan-week",
              mealIndex: index,
              totalMeals: DAYS.length,
              includeMeatIdeas: false,
            },
          }),
        });

        const data = (await response.json()) as RecipeApiResponse;

        if (!response.ok || !data.recipe) {
          throw new Error(data.error || "We couldn't build the week just now.");
        }

        const plannedMeal: PlannedMeal = {
          ...data.recipe,
          imageUrl: data.imageUrl ?? null,
          sourceItems: items,
          dayTheme: structure.label,
        };

        nextWeek[day.key] = plannedMeal;
        previousRecipes.push({
          title: data.recipe.title,
          description: data.recipe.description,
          ingredientsUsed: data.recipe.ingredientsUsed,
        });
      }

      setWeekPlan(nextWeek);
      setActiveDay("monday");
    } catch (err) {
      console.error(err);
      setError("We couldn’t plan the full week just now. Please try again.");
    } finally {
      setLoading(false);
      setLoadingLabel("");
    }
  }

  function addWeeklyExtrasToBasket() {
    if (weeklyExtras.length === 0) {
      setBasketMessage(
        "This week is already mostly covered by your box and basket.",
      );
      return;
    }

    addManyToCart(
      weeklyExtras.map((item) => ({
        name: item,
        price: 1,
        image: "",
        category: "extras" as const,
        checkoutType: "one-off" as const,
      })),
    );

    setBasketMessage("Suggested extras added to your basket.");
  }

  return (
    <main className="min-h-screen bg-[#f4efe9] text-[#243328]">
      <header className="sticky top-0 z-30 border-b border-[rgba(230,221,210,0.92)] bg-[rgba(244,239,233,0.88)] backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 md:px-10">
          <Link
            href="/"
            className="text-[11px] tracking-[0.28em] text-[#60705f] hover:text-[#243328] sm:text-sm"
          >
            THE LOCAL PANTRY
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/recipes"
              className="hidden rounded-full border border-[#d6cec2] bg-white/80 px-4 py-2 text-sm text-[#243328] transition hover:bg-white md:inline-flex"
            >
              Browse recipes
            </Link>

            <Link
              href="/basket"
              className="inline-flex rounded-full border border-[#d6cec2] bg-[rgba(255,255,255,0.88)] px-4 py-2 text-sm text-[#243328] shadow-sm transition hover:bg-white"
            >
              Basket{totalItems > 0 ? ` (${totalItems})` : ""}
            </Link>
          </div>
        </div>
      </header>

      <section className="border-b border-[rgba(230,221,210,0.86)] px-4 pb-8 pt-10 sm:px-6 md:px-10 md:pb-10 md:pt-12">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.22em] text-[#6b776c]">
              Weekly planner
            </p>

            <h1 className="mt-3 font-serif text-3xl leading-tight tracking-tight md:text-5xl">
              Plan your week around what you’ve got
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-[#5f675c] md:text-base">
              Built for local weekly food shopping, this planner helps you turn
              what you’ve got into a week of realistic meals. Use the box as a
              base, get inspired, follow the recipe cards, and build your basket
              as you go.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={generateWeekPlan}
                disabled={loading}
                className="rounded-full bg-[#243328] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Planning your week..." : "Plan my week"}
              </button>

              <Link
                href="/shop"
                className="rounded-full border border-[#d6cec2] bg-white px-6 py-3 text-sm text-[#243328] transition hover:bg-[#f5f1ea]"
              >
                See the shop
              </Link>
            </div>

            {loadingLabel ? (
              <p className="mt-4 text-sm text-[#5f675c]">{loadingLabel}</p>
            ) : null}

            {error ? (
              <div className="mt-5 rounded-[18px] border border-[#e4d8cb] bg-[#fbf6f0] px-4 py-3 text-sm text-[#6a5c4f]">
                {error}
              </div>
            ) : null}
          </div>

          <div className="rounded-[28px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.84)] p-4 shadow-[0_12px_30px_rgba(36,51,40,0.05)] backdrop-blur-md md:p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
                  Use the weekly box as your base
                </p>
                <h2 className="mt-2 font-serif text-2xl leading-tight">
                  A more vibrant start to the week
                </h2>
              </div>

              <Link
                href="/shop"
                className="text-sm text-[#5f675c] underline underline-offset-4"
              >
                View boxes
              </Link>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-[160px_1fr] md:items-start">
              <div className="overflow-hidden rounded-[22px] border border-[#e3dacd] bg-[rgba(255,255,255,0.8)] p-3">
                <img
                  src={BOX_HERO_IMAGE}
                  alt="Family harvest box"
                  className="h-32 w-full object-contain md:h-36"
                />
              </div>

              <div>
                <p className="text-sm leading-6 text-[#5f675c]">
                  Think beyond five basics. The box should feel abundant,
                  colourful, and genuinely useful for a proper week of food.
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {BOX_DISPLAY_CONTENTS.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-[#d6cec2] bg-[rgba(255,255,255,0.9)] px-3 py-1.5 text-sm text-[#4f5e52]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {BOX_COPY_GROUPS.map((group) => (
                <div
                  key={group.title}
                  className="rounded-[18px] border border-[#e5ddcf] bg-white/80 p-4"
                >
                  <p className="text-sm font-medium text-[#243328]">
                    {group.title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#5f675c]">
                    {group.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <label className="inline-flex items-center gap-3 text-sm text-[#243328]">
                <input
                  type="checkbox"
                  checked={includeBasketItems}
                  onChange={(e) => setIncludeBasketItems(e.target.checked)}
                  className="h-4 w-4 rounded border-[#cfc6b9]"
                />
                Use basket ingredients too
              </label>

              <span className="text-sm text-[#6b776c]">
                Plus other seasonal fruit, leaves, herbs, and useful weekly
                staples.
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[24px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.8)] p-5 backdrop-blur-md md:p-6">
            <div className="grid gap-6 lg:grid-cols-[0.86fr_1.14fr]">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[#6b776c]">
                  Start with what you’ve got
                </p>

                <h2 className="mt-2 font-serif text-2xl md:text-3xl">
                  Shape the week from real ingredients
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-7 text-[#5f675c] md:text-base">
                  Add a few extra ingredients if you like. The planner will use
                  the box, your basket, and a wider mix of useful vegetables to
                  build a week with better variety across the days.
                </p>

                <label
                  htmlFor="planner-ingredients"
                  className="mt-5 block text-sm font-medium text-[#243328]"
                >
                  Extra ingredients to work in
                </label>

                <textarea
                  id="planner-ingredients"
                  value={customIngredients}
                  onChange={(e) => setCustomIngredients(e.target.value)}
                  placeholder="e.g. feta, chickpeas, lemons, basil"
                  rows={4}
                  className="mt-3 w-full rounded-[20px] border border-[#d6cec2] bg-white/90 px-4 py-3 text-sm text-[#243328] outline-none placeholder:text-[#7b8478] focus:border-[#a9b2a3]"
                />

                {plannerBaseIngredients.length > 0 ? (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-[#243328]">
                      What the planner is building from
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {plannerBaseIngredients.slice(0, 18).map((ingredient) => (
                        <span
                          key={ingredient}
                          className="rounded-full border border-[#d6cec2] bg-white/90 px-3 py-1.5 text-sm text-[#4f5e52]"
                        >
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              <div>
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[#6b776c]">
                      Your week at a glance
                    </p>
                    <h2 className="mt-2 font-serif text-2xl md:text-3xl">
                      A better week of meals
                    </h2>
                  </div>

                  <p className="hidden text-sm text-[#5f675c] md:block">
                    Follow the recipe cards, swap anything that doesn’t fit, and
                    build the basket as you go.
                  </p>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {DAYS.map((day) => {
                    const meal = weekPlan[day.key];
                    const isActive = activeDay === day.key;

                    return (
                      <button
                        key={day.key}
                        type="button"
                        onClick={() => setActiveDay(day.key)}
                        className={`rounded-[20px] border p-4 text-left transition ${
                          isActive
                            ? "border-[#243328] bg-white shadow-[0_10px_24px_rgba(36,51,40,0.08)]"
                            : "border-[#ddd4c8] bg-[rgba(255,255,255,0.74)] hover:bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-medium text-[#243328]">
                            {day.label}
                          </p>
                          <span className="text-xs uppercase tracking-[0.12em] text-[#7a8478]">
                            {meal ? "Recipe card" : "Waiting"}
                          </span>
                        </div>

                        {meal ? (
                          <>
                            <p className="mt-3 font-serif text-lg leading-tight text-[#243328]">
                              {meal.title}
                            </p>
                            <p className="mt-2 text-sm leading-6 text-[#5f675c]">
                              {meal.dayTheme}
                            </p>

                            <div className="mt-3 flex flex-wrap gap-2">
                              {meal.ingredientsUsed.slice(0, 3).map((item) => (
                                <span
                                  key={item}
                                  className="rounded-full border border-[#e6ddd2] bg-[rgba(249,246,241,0.82)] px-2.5 py-1 text-xs text-[#5f675c]"
                                >
                                  {item}
                                </span>
                              ))}
                            </div>
                          </>
                        ) : (
                          <p className="mt-3 text-sm leading-6 text-[#6b776c]">
                            Plan your week to fill this day.
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-10 sm:px-6 md:px-10 md:pb-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
            <div className="overflow-hidden rounded-[24px] border border-[rgba(221,212,200,0.95)] bg-[rgba(255,255,255,0.82)] backdrop-blur-md">
              {activeMeal?.imageUrl ? (
                <img
                  src={activeMeal.imageUrl}
                  alt={activeMeal.title}
                  className="h-[260px] w-full object-cover"
                />
              ) : (
                <div className="flex h-[260px] items-center justify-center bg-[rgba(247,242,235,0.9)] px-6 text-center">
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-[#6b776c]">
                      Follow the recipe cards
                    </p>
                    <p className="mt-3 font-serif text-2xl text-[#243328]">
                      The week will fill out here
                    </p>
                    <p className="mt-3 text-sm leading-6 text-[#5f675c]">
                      Build the week first, then open each day to see what
                      you’ll cook and what it needs.
                    </p>
                  </div>
                </div>
              )}

              <div className="p-5 md:p-6">
                <p className="text-xs uppercase tracking-[0.16em] text-[#6b776c]">
                  {DAYS.find((item) => item.key === activeDay)?.label ?? "Day"}{" "}
                  recipe
                </p>

                <h3 className="mt-2 font-serif text-2xl md:text-3xl">
                  {activeMeal?.title ?? "A proper week starts from the box"}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#5f675c] md:text-base">
                  {activeMeal?.description ??
                    "Use the weekly produce box as your base, shape the meals with a few useful supports, and let the week build in a way that feels realistic."}
                </p>

                {activeMeal ? (
                  <>
                    <div className="mt-5">
                      <p className="text-sm font-medium text-[#243328]">
                        Built from
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {activeMeal.sourceItems.slice(0, 8).map((item) => (
                          <span
                            key={item}
                            className="rounded-full border border-[#d6cec2] bg-[rgba(249,246,241,0.82)] px-3 py-1.5 text-sm text-[#4f5e52]"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5">
                      <p className="text-sm font-medium text-[#243328]">
                        Method
                      </p>
                      <ol className="mt-3 space-y-3 text-sm leading-6 text-[#243328]">
                        {activeMeal.steps.slice(0, 4).map((step, index) => (
                          <li key={`${index}-${step}`} className="flex gap-3">
                            <span className="mt-[2px] inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#d6cec2] text-xs">
                              {index + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </>
                ) : null}
              </div>
            </div>

            <div className="rounded-[24px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.84)] p-5 backdrop-blur-md md:p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-[#6b776c]">
                Turn the plan into your next order
              </p>
              <h2 className="mt-2 font-serif text-2xl md:text-3xl">
                Add the useful bits
              </h2>

              <p className="mt-3 text-sm leading-7 text-[#5f675c] md:text-base">
                The box should do a lot of the work. These are the extra bits
                that help make the week feel complete.
              </p>

              {weeklyExtras.length > 0 ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {weeklyExtras.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-[#d6cec2] bg-white/90 px-3 py-1.5 text-sm text-[#4f5e52]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-[18px] border border-[#ddd4c8] bg-white/80 p-4">
                  <p className="text-sm leading-6 text-[#5f675c]">
                    Once the week is planned, the suggested extras will gather
                    here.
                  </p>
                </div>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={addWeeklyExtrasToBasket}
                  className="rounded-full bg-[#243328] px-5 py-3 text-sm text-white transition hover:opacity-90"
                >
                  Add suggested extras
                </button>

                <Link
                  href="/basket"
                  className="rounded-full border border-[#d6cec2] bg-white px-5 py-3 text-sm text-[#243328] transition hover:bg-[#f5f1ea]"
                >
                  Review basket
                </Link>
              </div>

              {basketMessage ? (
                <div className="mt-4 rounded-[18px] border border-[#dbe4d5] bg-[#f4f8f1] px-4 py-3 text-sm text-[#425142]">
                  {basketMessage}
                </div>
              ) : null}

              <div className="mt-6 grid gap-3">
                <div className="rounded-[18px] border border-[#e5ddcf] bg-white/80 p-4">
                  <p className="text-sm font-medium text-[#243328]">
                    Better variety across the week
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#5f675c]">
                    The planner rotates ingredients, changes the meal shape, and
                    avoids repeating the same obvious idea day after day.
                  </p>
                </div>

                <div className="rounded-[18px] border border-[#e5ddcf] bg-white/80 p-4">
                  <p className="text-sm font-medium text-[#243328]">
                    Built from a wider box
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#5f675c]">
                    The week is shaped from a broader mix of vegetables, fruit,
                    herbs, and useful pantry supports - not just a short list of
                    basics.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
