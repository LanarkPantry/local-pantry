"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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

type WeekMeal = GeneratedRecipe & {
  imageUrl?: string | null;
  dayLabel: string;
  dayKey: DayKey;
  mealStyle: string;
};

type WeekPlanState = Record<DayKey, WeekMeal | null>;

type DayTheme = {
  label: string;
  quickStart: "quick-tonight" | "comforting" | "use-what-ive-got";
  supports: string[];
  highlight: string;
};

const PLANNER_STORAGE_KEY = "tlp_weekly_planner_v4";

const DAYS: { key: DayKey; label: string; short: string }[] = [
  { key: "monday", label: "Monday", short: "Mon" },
  { key: "tuesday", label: "Tuesday", short: "Tue" },
  { key: "wednesday", label: "Wednesday", short: "Wed" },
  { key: "thursday", label: "Thursday", short: "Thu" },
  { key: "friday", label: "Friday", short: "Fri" },
  { key: "saturday", label: "Saturday", short: "Sat" },
  { key: "sunday", label: "Sunday", short: "Sun" },
];

const EMPTY_WEEK: WeekPlanState = {
  monday: null,
  tuesday: null,
  wednesday: null,
  thursday: null,
  friday: null,
  saturday: null,
  sunday: null,
};

const BOX_HERO_ITEMS = [
  "Carrots",
  "Potatoes",
  "Broccoli",
  "Spinach",
  "Peppers",
  "Tomatoes",
  "Cucumber",
  "Apples",
  "Oranges",
  "Grapes",
  "Fresh herbs",
];

const VEG_POOL = [
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
  "kale",
  "herbs",
  "garlic",
  "onions",
  "leeks",
  "apples",
  "oranges",
  "grapes",
];

const DAY_THEMES: DayTheme[] = [
  {
    label: "roots and pulses",
    quickStart: "use-what-ive-got",
    supports: ["lentils", "beans", "lemon"],
    highlight: "A strong start built around useful veg and pantry depth.",
  },
  {
    label: "greens and pasta",
    quickStart: "quick-tonight",
    supports: ["pasta", "orzo", "parmesan"],
    highlight: "Something quick, bright, and easy to get on the table.",
  },
  {
    label: "midweek rice bowl",
    quickStart: "quick-tonight",
    supports: ["rice", "yoghurt", "herbs"],
    highlight: "A faster midweek shape with contrast and texture.",
  },
  {
    label: "brothy or spoonable supper",
    quickStart: "comforting",
    supports: ["stock", "potatoes", "butter beans"],
    highlight: "A softer, warmer meal that still makes good use of the box.",
  },
  {
    label: "traybake or roast plate",
    quickStart: "use-what-ive-got",
    supports: ["couscous", "feta", "olive oil"],
    highlight: "A good point in the week for roasted edges and bigger flavour.",
  },
  {
    label: "weekend comfort",
    quickStart: "comforting",
    supports: ["rice", "cheese", "cream"],
    highlight: "A slightly more generous meal for the weekend.",
  },
  {
    label: "use-it-up finish",
    quickStart: "use-what-ive-got",
    supports: ["eggs", "bread", "herbs"],
    highlight: "A flexible end-of-week idea built to use what is left well.",
  },
];

function safeReadStoredWeek(): WeekPlanState {
  if (typeof window === "undefined") return EMPTY_WEEK;

  try {
    const raw = window.localStorage.getItem(PLANNER_STORAGE_KEY);
    if (!raw) return EMPTY_WEEK;

    const parsed = JSON.parse(raw) as WeekPlanState;
    if (!parsed || typeof parsed !== "object") return EMPTY_WEEK;

    return {
      monday: parsed.monday ?? null,
      tuesday: parsed.tuesday ?? null,
      wednesday: parsed.wednesday ?? null,
      thursday: parsed.thursday ?? null,
      friday: parsed.friday ?? null,
      saturday: parsed.saturday ?? null,
      sunday: parsed.sunday ?? null,
    };
  } catch {
    return EMPTY_WEEK;
  }
}

function saveStoredWeek(value: WeekPlanState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PLANNER_STORAGE_KEY, JSON.stringify(value));
}

function uniqueList(items: string[]) {
  return Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));
}

function buildDayItems(dayIndex: number) {
  const rotatedVeg = [
    ...VEG_POOL.slice(dayIndex * 2),
    ...VEG_POOL.slice(0, dayIndex * 2),
  ];

  const vegSelection = rotatedVeg.slice(0, 5);
  const theme = DAY_THEMES[dayIndex % DAY_THEMES.length];

  return uniqueList([...vegSelection, ...theme.supports]).slice(0, 9);
}

function prettyCount(count: number, single: string, plural: string) {
  return `${count} ${count === 1 ? single : plural}`;
}

export default function PlannerPage() {
  const [planner, setPlanner] = useState<WeekPlanState>(EMPTY_WEEK);
  const [activeDay, setActiveDay] = useState<DayKey>("monday");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [helperOpen, setHelperOpen] = useState(false);

  useEffect(() => {
    setPlanner(safeReadStoredWeek());
  }, []);

  useEffect(() => {
    saveStoredWeek(planner);
  }, [planner]);

  const filledCount = useMemo(
    () => Object.values(planner).filter(Boolean).length,
    [planner],
  );

  const activeMeal = planner[activeDay];

  const plannerIngredients = useMemo(() => {
    const items = Object.values(planner)
      .filter(Boolean)
      .flatMap((meal) => meal!.ingredientsUsed);
    return uniqueList(items);
  }, [planner]);

  const shoppingHighlights = useMemo(() => {
    return plannerIngredients
      .filter(
        (item) =>
          !["salt", "pepper", "oil", "water", "butter", "stock"].includes(
            item.toLowerCase(),
          ),
      )
      .slice(0, 12);
  }, [plannerIngredients]);

  async function generateWeek() {
    setIsGenerating(true);
    setError("");

    const nextPlanner: WeekPlanState = { ...EMPTY_WEEK };
    const previousRecipes: Array<{
      title: string;
      description: string;
      ingredientsUsed: string[];
    }> = [];

    try {
      for (let index = 0; index < DAYS.length; index += 1) {
        const day = DAYS[index];
        const theme = DAY_THEMES[index];
        const items = buildDayItems(index);

        const response = await fetch("/api/recipe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items,
            quickStart: theme.quickStart,
            preferences: [],
            previousRecipes,
            weekPlanContext: {
              mode: "plan-week",
              mealIndex: index,
              totalMeals: DAYS.length,
              previousRecipes,
            },
          }),
        });

        const data = await response.json();

        if (!response.ok || !data?.recipe) {
          throw new Error(data?.error || "Could not generate the week.");
        }

        const recipe = data.recipe as GeneratedRecipe;

        const meal: WeekMeal = {
          ...recipe,
          imageUrl: data.imageUrl ?? null,
          dayLabel: day.label,
          dayKey: day.key,
          mealStyle: theme.label,
        };

        nextPlanner[day.key] = meal;
        previousRecipes.push({
          title: meal.title,
          description: meal.description,
          ingredientsUsed: meal.ingredientsUsed,
        });

        setPlanner({ ...nextPlanner });
        setActiveDay(day.key);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while planning the week.",
      );
    } finally {
      setIsGenerating(false);
    }
  }

  function clearWeek() {
    setPlanner(EMPTY_WEEK);
    setActiveDay("monday");
    setError("");
  }

  return (
    <main className="min-h-screen bg-[#f4efe9] text-[#243328]">
      <section className="border-b border-[rgba(221,212,200,0.9)] px-4 py-5 sm:px-6 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-start gap-5 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[24px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.86)] p-5 shadow-[0_10px_28px_rgba(36,51,40,0.05)] backdrop-blur-md md:p-6">
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-[11px] uppercase tracking-[0.22em] text-[#6b776c]">
                  Weekly planner
                </p>

                <div className="relative">
                  <button
                    type="button"
                    onMouseEnter={() => setHelperOpen(true)}
                    onMouseLeave={() => setHelperOpen(false)}
                    onFocus={() => setHelperOpen(true)}
                    onBlur={() => setHelperOpen(false)}
                    onClick={() => setHelperOpen((current) => !current)}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#d6cec2] bg-white/80 text-sm text-[#5f675c]"
                    aria-label="What this planner does"
                  >
                    i
                  </button>

                  {helperOpen ? (
                    <div className="absolute left-0 top-10 z-20 w-[280px] rounded-[18px] border border-[#ddd4c8] bg-white px-4 py-3 text-sm leading-6 text-[#5f675c] shadow-[0_16px_36px_rgba(36,51,40,0.12)]">
                      Built for local weekly food shopping, this planner helps
                      you turn what you&apos;ve got into a week of realistic
                      meals. Use the box as a base, get inspired, and build your
                      basket as you go.
                    </div>
                  ) : null}
                </div>
              </div>

              <h1 className="mt-3 max-w-2xl font-serif text-[2rem] leading-[1.02] tracking-tight sm:text-[2.3rem] md:text-[2.9rem]">
                Plan your week around what you&apos;ve got
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-[#5f675c] md:text-base">
                Use the box, shape the week, follow the recipe cards, and build
                a better basket as you go.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={generateWeek}
                  disabled={isGenerating}
                  className="rounded-full bg-[#243328] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isGenerating ? "Planning your week..." : "Plan my week"}
                </button>

                <Link
                  href="/recipes"
                  className="rounded-full border border-[#d6cec2] bg-white/84 px-5 py-3 text-sm text-[#243328] transition hover:bg-white"
                >
                  Browse recipes
                </Link>

                <button
                  type="button"
                  onClick={clearWeek}
                  className="rounded-full border border-[#d6cec2] bg-transparent px-5 py-3 text-sm text-[#5f675c] transition hover:bg-white/55"
                >
                  Clear week
                </button>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="rounded-[18px] border border-[#e2d8cb] bg-white/70 px-4 py-3">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-[#7a8478]">
                    Filled days
                  </p>
                  <p className="mt-1 text-xl font-semibold text-[#243328]">
                    {filledCount}/7
                  </p>
                </div>
                <div className="rounded-[18px] border border-[#e2d8cb] bg-white/70 px-4 py-3">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-[#7a8478]">
                    Week style
                  </p>
                  <p className="mt-1 text-sm font-medium text-[#243328]">
                    Varied, veg-led, useful
                  </p>
                </div>
                <div className="rounded-[18px] border border-[#e2d8cb] bg-white/70 px-4 py-3">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-[#7a8478]">
                    Built from
                  </p>
                  <p className="mt-1 text-sm font-medium text-[#243328]">
                    The weekly box
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[24px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.84)] shadow-[0_12px_30px_rgba(36,51,40,0.06)] backdrop-blur-md">
              <div className="grid gap-0 md:grid-cols-[180px_1fr]">
                <div className="flex items-center justify-center border-b border-[#e8dfd3] bg-[rgba(238,231,220,0.76)] p-4 md:border-b-0 md:border-r">
                  <img
                    src="/family-harvest-box.png"
                    alt="Weekly produce box"
                    className="h-32 w-full object-contain md:h-40"
                  />
                </div>

                <div className="p-5">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
                    Use the weekly box as your base
                  </p>

                  <h2 className="mt-2 font-serif text-xl leading-tight md:text-2xl">
                    A stronger start for the week ahead
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-[#5f675c]">
                    A useful mix of veg, fruit, leaves, herbs, and weekly
                    staples - enough to shape the week properly.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {BOX_HERO_ITEMS.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-[#d6cec2] bg-white/86 px-3 py-1.5 text-[12px] text-[#4f5e52]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <p className="mt-3 text-xs leading-5 text-[#7a8478]">
                    Plus other seasonal extras through the week.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {error ? (
            <div className="mt-4 rounded-[18px] border border-[#e4d8cb] bg-[#fbf6f0] px-4 py-3 text-sm text-[#6a5c4f]">
              {error}
            </div>
          ) : null}
        </div>
      </section>

      <section className="px-4 py-5 sm:px-6 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-3 flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
                Your week at a glance
              </p>
              <h2 className="mt-1 font-serif text-[1.6rem] leading-tight md:text-[2rem]">
                The planner comes first
              </h2>
            </div>

            <p className="hidden max-w-md text-sm leading-6 text-[#5f675c] md:block">
              Follow the recipe cards, swap around if needed, and use the week
              to shape a more useful order.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-4 xl:grid-cols-7">
            {DAYS.map((day, index) => {
              const meal = planner[day.key];
              const isActive = activeDay === day.key;

              return (
                <button
                  key={day.key}
                  type="button"
                  onClick={() => setActiveDay(day.key)}
                  className={`rounded-[20px] border p-4 text-left transition ${
                    isActive
                      ? "border-[#243328] bg-white shadow-[0_10px_24px_rgba(36,51,40,0.09)]"
                      : "border-[#ddd4c8] bg-[rgba(247,242,235,0.76)] hover:bg-white/80"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.16em] text-[#7a8478]">
                        {day.short}
                      </p>
                      <h3 className="mt-1 font-medium text-[#243328]">
                        {day.label}
                      </h3>
                    </div>

                    <span className="rounded-full border border-[#e1d8cc] bg-[rgba(249,246,241,0.88)] px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-[#6b776c]">
                      {DAY_THEMES[index].label}
                    </span>
                  </div>

                  {meal ? (
                    <>
                      <p className="mt-3 line-clamp-2 font-medium leading-5 text-[#243328]">
                        {meal.title}
                      </p>
                      <p className="mt-2 text-xs leading-5 text-[#5f675c]">
                        {meal.ingredientsUsed.slice(0, 3).join(", ")}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="mt-3 text-sm font-medium text-[#243328]">
                        Plan your week to fill this day
                      </p>
                      <p className="mt-2 text-xs leading-5 text-[#7a8478]">
                        {DAY_THEMES[index].highlight}
                      </p>
                    </>
                  )}
                </button>
              );
            })}
          </div>

          {activeMeal ? (
            <div className="mt-5 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="overflow-hidden rounded-[24px] border border-[#ddd4c8] bg-white shadow-[0_10px_28px_rgba(36,51,40,0.06)]">
                {activeMeal.imageUrl ? (
                  <img
                    src={activeMeal.imageUrl}
                    alt={activeMeal.title}
                    className="h-[240px] w-full object-cover"
                  />
                ) : null}

                <div className="p-5 md:p-6">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
                    {activeMeal.dayLabel} recipe card
                  </p>

                  <h3 className="mt-2 font-serif text-[1.7rem] leading-tight md:text-[2.1rem]">
                    {activeMeal.title}
                  </h3>

                  <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5f675c] md:text-base">
                    {activeMeal.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {activeMeal.ingredientsUsed.slice(0, 8).map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-[#d6cec2] bg-[rgba(249,246,241,0.86)] px-3 py-1.5 text-sm text-[#4f5e52]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-[#6b776c]">
                      Follow the recipe card
                    </p>
                    <ol className="mt-3 space-y-3 text-sm leading-6 text-[#243328]">
                      {activeMeal.steps.map((step, index) => (
                        <li key={`${index}-${step}`} className="flex gap-3">
                          <span className="mt-[2px] inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#d6cec2] text-[10px]">
                            {index + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-[24px] border border-[#ddd4c8] bg-[rgba(247,242,235,0.76)] p-5 shadow-[0_10px_24px_rgba(36,51,40,0.05)]">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
                    This week is building from
                  </p>
                  <h3 className="mt-2 font-serif text-[1.5rem] leading-tight">
                    A more useful order
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#5f675c]">
                    The week is shaped from a broader produce mix, with enough
                    variation to feel like a proper run of meals rather than the
                    same idea repeated.
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-[18px] border border-[#e2d8cb] bg-white/70 px-4 py-3">
                      <p className="text-[10px] uppercase tracking-[0.14em] text-[#7a8478]">
                        Ingredients in play
                      </p>
                      <p className="mt-1 text-lg font-semibold text-[#243328]">
                        {plannerIngredients.length}
                      </p>
                    </div>
                    <div className="rounded-[18px] border border-[#e2d8cb] bg-white/70 px-4 py-3">
                      <p className="text-[10px] uppercase tracking-[0.14em] text-[#7a8478]">
                        Meals planned
                      </p>
                      <p className="mt-1 text-lg font-semibold text-[#243328]">
                        {filledCount}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-[#ddd4c8] bg-white p-5 shadow-[0_10px_24px_rgba(36,51,40,0.05)]">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
                    Suggested for your order
                  </p>
                  <h3 className="mt-2 font-serif text-[1.5rem] leading-tight">
                    Add the useful bits
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#5f675c]">
                    Use the week to shape what you buy next, rather than working
                    it out afterwards.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {shoppingHighlights.length > 0 ? (
                      shoppingHighlights.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-[#d6cec2] bg-[rgba(249,246,241,0.86)] px-3 py-1.5 text-sm text-[#4f5e52]"
                        >
                          {item}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-[#7a8478]">
                        Plan the week to see the useful ingredients stack up.
                      </span>
                    )}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                      href="/shop"
                      className="rounded-full bg-[#243328] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
                    >
                      Build from the shop
                    </Link>
                    <Link
                      href="/basket"
                      className="rounded-full border border-[#d6cec2] bg-white/86 px-5 py-3 text-sm text-[#243328] transition hover:bg-white"
                    >
                      View basket
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {!activeMeal && !isGenerating ? (
            <div className="mt-5 rounded-[24px] border border-[#ddd4c8] bg-[rgba(247,242,235,0.76)] p-6 text-sm leading-7 text-[#5f675c] shadow-[0_10px_24px_rgba(36,51,40,0.05)]">
              Click{" "}
              <span className="font-medium text-[#243328]">Plan my week</span>{" "}
              to generate a fuller, more varied week of meals from the box.
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
