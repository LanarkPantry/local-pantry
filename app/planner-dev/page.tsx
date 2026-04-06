"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getUser } from "../lib/authClient";
import { loadPlanner, savePlanner } from "../lib/plannerApi";

type DayKey =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

type PlannerMeal = {
  id: string;
  title: string;
  description?: string;
  image?: string;
  tags?: string[];
  ingredientsHint?: string;
};

type PlannerState = Record<DayKey, PlannerMeal | null>;

type UserLike = {
  id: string;
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

const EMPTY_PLANNER: PlannerState = {
  monday: null,
  tuesday: null,
  wednesday: null,
  thursday: null,
  friday: null,
  saturday: null,
  sunday: null,
};

const IMAGE_FALLBACKS = [
  "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1400&q=80",
];

const SAMPLE_MEALS: PlannerMeal[] = [
  {
    id: "lp-1",
    title: "Creamy Tuscan Chicken Pasta",
    description:
      "Big flavour, simple midweek comfort, and easy to build a basket around.",
    image: IMAGE_FALLBACKS[0],
    tags: ["wow", "midweek", "family"],
    ingredientsHint: "Chicken, cream, pasta, spinach, garlic",
  },
  {
    id: "lp-2",
    title: "Roast Veg & Halloumi Traybake",
    description:
      "Colourful, easy, and perfect for a Local Pantry veg-first week.",
    image: IMAGE_FALLBACKS[1],
    tags: ["veg", "easy", "colourful"],
    ingredientsHint: "Peppers, courgette, red onion, halloumi, herbs",
  },
  {
    id: "lp-3",
    title: "Sticky Ginger Beef Noodles",
    description:
      "Fast, glossy, and feels like a Friday meal without much effort.",
    image: IMAGE_FALLBACKS[2],
    tags: ["fast", "friday", "takeaway"],
    ingredientsHint: "Beef strips, noodles, soy, ginger, spring onion",
  },
  {
    id: "lp-4",
    title: "Loaded Baked Potato Night",
    description: "Cosy, low-lift, and easy to personalise for everyone.",
    image: IMAGE_FALLBACKS[3],
    tags: ["budget", "comfort", "easy"],
    ingredientsHint: "Potatoes, cheese, salad, beans, toppings",
  },
  {
    id: "lp-5",
    title: "Herby Lemon Salmon with Greens",
    description: "Light, fresh, and gives the planner a premium feel.",
    image: IMAGE_FALLBACKS[4],
    tags: ["fresh", "premium", "healthy"],
    ingredientsHint: "Salmon, lemon, greens, potatoes",
  },
  {
    id: "lp-6",
    title: "Slow Cooker Chilli with Rice",
    description: "A practical crowd-pleaser that still feels generous.",
    image: IMAGE_FALLBACKS[5],
    tags: ["batch", "comfort", "easy"],
    ingredientsHint: "Mince, beans, tomatoes, rice, spices",
  },
  {
    id: "lp-7",
    title: "Crispy Chicken Tacos",
    description: "Crunchy, bright, and much more fun than a plain text slot.",
    image: IMAGE_FALLBACKS[6],
    tags: ["fun", "weekend", "shareable"],
    ingredientsHint: "Chicken, tortillas, slaw, salsa, lime",
  },
];

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normaliseLoadedPlanner(input: unknown): PlannerState {
  if (!input || typeof input !== "object") return EMPTY_PLANNER;

  const source = input as Record<string, unknown>;
  const next: PlannerState = { ...EMPTY_PLANNER };

  for (const day of DAYS) {
    const value = source[day.key];
    if (value && typeof value === "object") {
      const meal = value as Record<string, unknown>;
      next[day.key] = {
        id: String(meal.id ?? `${day.key}-saved`),
        title: String(meal.title ?? "Untitled meal"),
        description:
          typeof meal.description === "string" ? meal.description : "",
        image:
          typeof meal.image === "string"
            ? meal.image
            : IMAGE_FALLBACKS[DAYS.findIndex((d) => d.key === day.key)],
        tags: Array.isArray(meal.tags)
          ? meal.tags.filter((tag): tag is string => typeof tag === "string")
          : [],
        ingredientsHint:
          typeof meal.ingredientsHint === "string"
            ? meal.ingredientsHint
            : "Ingredients list to follow",
      };
    }
  }

  return next;
}

function pickMealForDay(dayIndex: number, usedIds: Set<string>): PlannerMeal {
  const orderedPool = [
    ...SAMPLE_MEALS.slice(dayIndex),
    ...SAMPLE_MEALS.slice(0, dayIndex),
  ];
  const fresh =
    orderedPool.find((meal) => !usedIds.has(meal.id)) ?? orderedPool[0];

  return {
    ...fresh,
    id: `${fresh.id}-${Date.now()}-${dayIndex}`,
  };
}

function getPreviewImage(meal: PlannerMeal | null, index: number) {
  return meal?.image ?? IMAGE_FALLBACKS[index];
}

export default function PlannerDevPagePolished() {
  const [planner, setPlanner] = useState<PlannerState>(EMPTY_PLANNER);
  const [activeDay, setActiveDay] = useState<DayKey>("monday");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingWeek, setIsGeneratingWeek] = useState(false);
  const [generatingDay, setGeneratingDay] = useState<DayKey | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        setLoading(true);
        setError(null);

        const user = (await getUser()) as UserLike | null;

        if (!user?.id) {
          if (!cancelled) {
            setCurrentUserId(null);
            setPlanner(EMPTY_PLANNER);
            setLoading(false);
          }
          return;
        }

        const loaded = await loadPlanner(user.id);

        if (!cancelled) {
          setCurrentUserId(user.id);
          setPlanner(normaliseLoadedPlanner(loaded));
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError("Could not load your planner yet.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  async function saveAll(nextState: PlannerState) {
    if (!currentUserId) return;

    try {
      setSaving(true);
      await savePlanner(currentUserId, nextState);
    } catch (err) {
      console.error(err);
      setError("Your latest change could not be saved.");
    } finally {
      setSaving(false);
    }
  }

  function updateDay(day: DayKey, meal: PlannerMeal | null) {
    const nextState = {
      ...planner,
      [day]: meal,
    };

    setPlanner(nextState);
    void saveAll(nextState);
  }

  async function generateForDay(day: DayKey, options?: { quiet?: boolean }) {
    if (!options?.quiet) setGeneratingDay(day);
    setError(null);

    try {
      const response = await fetch("/api/generate-meal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ day }),
      });

      if (response.ok) {
        const generated = (await response.json()) as Partial<PlannerMeal>;
        const index = DAYS.findIndex((d) => d.key === day);
        const meal: PlannerMeal = {
          id: String(generated.id ?? `generated-${day}-${Date.now()}`),
          title: String(generated.title ?? "Chef's pick"),
          description:
            typeof generated.description === "string"
              ? generated.description
              : "A generated meal idea ready to tweak.",
          image:
            typeof generated.image === "string"
              ? generated.image
              : IMAGE_FALLBACKS[index],
          tags: Array.isArray(generated.tags)
            ? generated.tags.filter(
                (tag): tag is string => typeof tag === "string",
              )
            : ["generated"],
          ingredientsHint:
            typeof generated.ingredientsHint === "string"
              ? generated.ingredientsHint
              : "Tap through to add ingredients to basket",
        };

        updateDay(day, meal);
        return;
      }
    } catch (err) {
      console.warn("Falling back to local sample meal", err);
    } finally {
      if (!options?.quiet) setGeneratingDay(null);
    }

    const usedIds = new Set(
      Object.values(planner)
        .filter(Boolean)
        .map((meal) => meal!.id.split("-").slice(0, 2).join("-")),
    );

    const index = DAYS.findIndex((d) => d.key === day);
    const fallbackMeal = pickMealForDay(index, usedIds);
    updateDay(day, fallbackMeal);
  }

  async function generateWholeWeek() {
    setIsGeneratingWeek(true);
    setError(null);

    try {
      for (const [index, day] of DAYS.entries()) {
        setActiveDay(day.key);
        setGeneratingDay(day.key);
        // eslint-disable-next-line no-await-in-loop
        await generateForDay(day.key, { quiet: true });
        // eslint-disable-next-line no-await-in-loop
        await wait(index === 0 ? 120 : 170);
      }
    } finally {
      setGeneratingDay(null);
      setIsGeneratingWeek(false);
    }
  }

  function clearWeek() {
    setPlanner(EMPTY_PLANNER);
    void saveAll(EMPTY_PLANNER);
  }

  const filledCount = useMemo(
    () => Object.values(planner).filter(Boolean).length,
    [planner],
  );
  const activeMeal = planner[activeDay];
  const nextEmptyDay = useMemo(
    () => DAYS.find((day) => !planner[day.key])?.label ?? "All set",
    [planner],
  );
  const weekLooksGood = filledCount >= 5;

  return (
    <main className="min-h-screen bg-[#f7f2ea] text-stone-900">
      <section className="relative overflow-hidden border-b border-[#d9d0c3] bg-[#14382a] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(240,196,25,0.22),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_34%)]" />
        <div className="absolute right-[-8rem] top-[-6rem] h-72 w-72 rounded-full bg-[#f0c419]/15 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-6 px-4 py-7 sm:px-6 lg:grid-cols-[1.12fr_0.88fr] lg:px-8 lg:py-10">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2.5 text-sm text-white/75">
              <span className="rounded-full border border-white/20 px-3 py-1">
                Weekly planner
              </span>
              <span>{saving ? "Saving changes…" : "Saved to your plan"}</span>
              <span>ML11 delivery</span>
            </div>

            <div className="space-y-3">
              <h1 className="max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
                Your week, with more flavour and less dead space.
              </h1>
              <p className="max-w-2xl text-base text-white/80 sm:text-lg">
                A more visual planner page with image-led day cards, a proper
                weekly preview, and fast actions that still keep your useful
                links close by.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => void generateWholeWeek()}
                disabled={loading || isGeneratingWeek}
                className="rounded-full bg-[#f0c419] px-5 py-3 text-sm font-semibold text-stone-950 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isGeneratingWeek ? "Planning your week…" : "Generate my week"}
              </button>
              <Link
                href="/recipes"
                className="rounded-full border border-white/18 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Browse recipes
              </Link>
              <Link
                href="/basket"
                className="rounded-full border border-white/18 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                View basket
              </Link>
            </div>

            <div className="grid max-w-3xl grid-cols-2 gap-3 pt-1 sm:grid-cols-4">
              <div className="rounded-[24px] bg-white/10 p-4 backdrop-blur-sm">
                <div className="text-[11px] uppercase tracking-[0.18em] text-white/60">
                  Filled days
                </div>
                <div className="mt-2 text-3xl font-semibold">
                  {filledCount}/7
                </div>
              </div>
              <div className="rounded-[24px] bg-white/10 p-4 backdrop-blur-sm">
                <div className="text-[11px] uppercase tracking-[0.18em] text-white/60">
                  Next to fill
                </div>
                <div className="mt-2 text-lg font-semibold">{nextEmptyDay}</div>
              </div>
              <div className="rounded-[24px] bg-white/10 p-4 backdrop-blur-sm">
                <div className="text-[11px] uppercase tracking-[0.18em] text-white/60">
                  Mood
                </div>
                <div className="mt-2 text-lg font-semibold">
                  {weekLooksGood ? "Looking delicious" : "Building nicely"}
                </div>
              </div>
              <div className="rounded-[24px] bg-white/10 p-4 backdrop-blur-sm">
                <div className="text-[11px] uppercase tracking-[0.18em] text-white/60">
                  Planner
                </div>
                <div className="mt-2 text-lg font-semibold">
                  {loading ? "Loading" : "Ready"}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-white/10 p-4 shadow-2xl shadow-black/15 backdrop-blur-md">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-white/70">This week at a glance</p>
                <h2 className="text-xl font-semibold">Preview strip</h2>
              </div>
              <button
                type="button"
                onClick={clearWeek}
                className="text-sm text-white/75 underline decoration-white/30 underline-offset-4 hover:text-white"
              >
                Clear week
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {DAYS.map((day, index) => {
                const meal = planner[day.key];
                const isActive = activeDay === day.key;
                const isBusy = generatingDay === day.key;

                return (
                  <button
                    key={day.key}
                    type="button"
                    onClick={() => setActiveDay(day.key)}
                    className={`overflow-hidden rounded-[20px] border text-left transition duration-300 ${
                      isActive
                        ? "border-[#f0c419] shadow-lg shadow-black/20"
                        : "border-white/10 hover:border-white/25"
                    }`}
                  >
                    <div className="relative aspect-[3/4] bg-stone-900">
                      <img
                        src={getPreviewImage(meal, index)}
                        alt={meal?.title ?? `${day.label} preview`}
                        className={`h-full w-full object-cover transition duration-500 ${
                          meal ? "opacity-100" : "opacity-45"
                        } ${isBusy ? "scale-105 saturate-125" : ""}`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                      {isBusy ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/28 text-xs font-semibold text-white backdrop-blur-[1px]">
                          Generating…
                        </div>
                      ) : null}
                    </div>
                    <div className="bg-stone-950/70 p-2">
                      <div className="text-[11px] font-semibold uppercase tracking-wide text-white/70">
                        {day.short}
                      </div>
                      <div className="mt-1 line-clamp-2 text-xs text-white">
                        {meal?.title ?? "Add meal"}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-[#14382a]">Planner grid</p>
            <h2 className="text-2xl font-semibold tracking-tight">
              Each day should feel like a food card, not an empty box
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/recipes"
              className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium hover:border-stone-400"
            >
              Recipes
            </Link>
            <Link
              href="/shop"
              className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium hover:border-stone-400"
            >
              Shop
            </Link>
            <Link
              href="/basket"
              className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium hover:border-stone-400"
            >
              Basket
            </Link>
          </div>
        </div>

        {error ? (
          <div className="mb-5 rounded-[20px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-7">
          {DAYS.map((day, index) => {
            const meal = planner[day.key];
            const isActive = activeDay === day.key;
            const isBusy = generatingDay === day.key;

            return (
              <article
                key={day.key}
                className={`group overflow-hidden rounded-[28px] border bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  isActive
                    ? "border-[#14382a] ring-2 ring-[#14382a]/10"
                    : "border-stone-200"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setActiveDay(day.key)}
                  className="block w-full text-left"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
                    <img
                      src={getPreviewImage(meal, index)}
                      alt={meal?.title ?? `${day.label} placeholder image`}
                      className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${
                        meal ? "opacity-100" : "opacity-35"
                      } ${isBusy ? "scale-105 saturate-125" : ""}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                    <div className="absolute left-4 top-4 flex items-center gap-2">
                      <span className="rounded-full bg-white/92 px-3 py-1 text-xs font-semibold text-stone-900">
                        {day.label}
                      </span>
                      {isBusy ? (
                        <span className="rounded-full bg-[#f0c419] px-2.5 py-1 text-[11px] font-semibold text-stone-950">
                          Generating
                        </span>
                      ) : null}
                    </div>

                    {!meal ? (
                      <div className="absolute bottom-4 left-4 right-4 rounded-[22px] border border-dashed border-white/45 bg-white/10 p-3.5 text-white backdrop-blur-sm">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="text-sm font-semibold">
                              Give {day.label.toLowerCase()} something good
                            </div>
                            <div className="mt-1 text-xs text-white/80">
                              Generate a meal or swap in a favourite.
                            </div>
                          </div>
                          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-xl">
                            +
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <div className="text-lg font-semibold leading-tight">
                          {meal.title}
                        </div>
                        <div className="mt-1 line-clamp-2 text-sm text-white/85">
                          {meal.description}
                        </div>
                      </div>
                    )}
                  </div>
                </button>

                <div className="space-y-3 p-4">
                  <div className="min-h-[3rem]">
                    {meal?.tags?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {meal.tags.slice(0, 3).map((tag) => (
                          <span
                            key={`${day.key}-${tag}`}
                            className="rounded-full bg-[#f3efe8] px-2.5 py-1 text-xs font-medium text-stone-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-stone-500">
                        Designed empty state so the week still feels full and
                        intentional.
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <button
                      type="button"
                      onClick={() => void generateForDay(day.key)}
                      disabled={isBusy || isGeneratingWeek}
                      className="rounded-full bg-[#14382a] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#102d22] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isBusy
                        ? "Generating…"
                        : meal
                          ? "Regenerate meal"
                          : "Generate meal"}
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveDay(day.key)}
                        className="rounded-full border border-stone-300 px-4 py-2.5 text-sm font-medium text-stone-800 hover:border-stone-400"
                      >
                        Focus
                      </button>
                      <button
                        type="button"
                        onClick={() => updateDay(day.key, null)}
                        className="rounded-full border border-stone-300 px-4 py-2.5 text-sm font-medium text-stone-800 hover:border-stone-400"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-9 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="rounded-[32px] border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-[#14382a]">
                  Focused day
                </p>
                <h3 className="mt-1 text-2xl font-semibold">
                  {DAYS.find((d) => d.key === activeDay)?.label}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => void generateForDay(activeDay)}
                disabled={Boolean(generatingDay) || isGeneratingWeek}
                className="rounded-full bg-[#f0c419] px-4 py-2 text-sm font-semibold text-stone-950 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {generatingDay === activeDay
                  ? "Generating…"
                  : "Generate for this day"}
              </button>
            </div>

            <div className="mt-5 overflow-hidden rounded-[28px] bg-stone-100">
              <div className="relative aspect-[16/8]">
                <img
                  src={getPreviewImage(
                    activeMeal,
                    DAYS.findIndex((d) => d.key === activeDay),
                  )}
                  alt={activeMeal?.title ?? `${activeDay} preview image`}
                  className={`h-full w-full object-cover ${activeMeal ? "opacity-100" : "opacity-45"}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white sm:p-6">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-white/70">
                    Selected day
                  </div>
                  <div className="mt-2 text-3xl font-semibold">
                    {activeMeal?.title ?? "No meal chosen yet"}
                  </div>
                  <div className="mt-2 max-w-2xl text-sm text-white/85">
                    {activeMeal?.description ??
                      "Use the button above to add a meal with more colour, appetite appeal, and less empty space."}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] bg-[#f7f2ea] p-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">
                  Basket hint
                </div>
                <p className="mt-2 text-sm text-stone-700">
                  {activeMeal?.ingredientsHint ??
                    "No ingredients yet. Generate or assign a meal first."}
                </p>
              </div>
              <div className="rounded-[24px] bg-[#f7f2ea] p-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">
                  Useful links
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    href="/recipes"
                    className="rounded-full border border-stone-300 px-3 py-2 text-sm font-medium"
                  >
                    Recipes
                  </Link>
                  <Link
                    href="/shop"
                    className="rounded-full border border-stone-300 px-3 py-2 text-sm font-medium"
                  >
                    Shop
                  </Link>
                  <Link
                    href="/basket"
                    className="rounded-full border border-stone-300 px-3 py-2 text-sm font-medium"
                  >
                    Basket
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-5">
            <div className="rounded-[32px] border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
              <p className="text-sm font-medium text-[#14382a]">
                Quick actions
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                <button
                  type="button"
                  onClick={() => void generateWholeWeek()}
                  disabled={loading || isGeneratingWeek}
                  className="rounded-[24px] bg-[#14382a] px-4 py-4 text-left text-white disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <div className="text-sm font-semibold">
                    {isGeneratingWeek
                      ? "Planning your week…"
                      : "Generate my week"}
                  </div>
                  <div className="mt-1 text-sm text-white/75">
                    Fill the full planner fast with image-led cards.
                  </div>
                </button>
                <Link
                  href="/recipes"
                  className="rounded-[24px] border border-stone-200 px-4 py-4 text-left hover:border-stone-300"
                >
                  <div className="text-sm font-semibold text-stone-900">
                    Browse recipes
                  </div>
                  <div className="mt-1 text-sm text-stone-500">
                    Keep favourites and hand-picked ideas close.
                  </div>
                </Link>
                <Link
                  href="/basket"
                  className="rounded-[24px] border border-stone-200 px-4 py-4 text-left hover:border-stone-300"
                >
                  <div className="text-sm font-semibold text-stone-900">
                    Open basket
                  </div>
                  <div className="mt-1 text-sm text-stone-500">
                    Build your shop around the week you just planned.
                  </div>
                </Link>
              </div>
            </div>

            <div className="rounded-[32px] border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-[#14382a]">
                    Starter inspiration
                  </p>
                  <h4 className="mt-1 text-xl font-semibold">
                    Looks good from the start
                  </h4>
                </div>
                <span className="rounded-full bg-[#f7f2ea] px-3 py-1 text-xs font-semibold text-stone-700">
                  Visual picks
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {SAMPLE_MEALS.slice(0, 4).map((meal) => (
                  <div
                    key={meal.id}
                    className="flex items-center gap-3 rounded-[24px] bg-[#f7f2ea] p-3"
                  >
                    <img
                      src={meal.image}
                      alt={meal.title}
                      className="h-16 w-16 rounded-[18px] object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold text-stone-900">
                        {meal.title}
                      </div>
                      <div className="line-clamp-2 text-sm text-stone-500">
                        {meal.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
