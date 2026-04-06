"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { getUser } from "../lib/authClient";
import { loadPlanner, savePlanner } from "../lib/plannerApi";

type MealSlot = {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  category?: string;
  cookTime?: string;
  wow?: boolean;
  ingredients?: string[];
  notes?: string;
  sourceUrl?: string;
};

type DayPlan = {
  day: string;
  meal: MealSlot | null;
};

type PlannerState = {
  weekOf: string;
  plans: DayPlan[];
  notes: string;
};

const DAY_NAMES = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const STARTER_MEALS: MealSlot[] = [
  {
    id: "1",
    title: "Roast Chicken with Herb Butter",
    subtitle: "Golden, comforting, and dinner-party worthy",
    image:
      "https://images.unsplash.com/photo-1518492104633-130d0cc84637?auto=format&fit=crop&w=1200&q=80",
    category: "Family favourite",
    cookTime: "1 hr 10 mins",
    wow: true,
    ingredients: ["Chicken", "Potatoes", "Carrots", "Butter", "Herbs"],
  },
  {
    id: "2",
    title: "Creamy Tuscan Salmon",
    subtitle: "Fast midweek dinner with a little theatre",
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=80",
    category: "Midweek wow",
    cookTime: "25 mins",
    wow: true,
    ingredients: ["Salmon", "Spinach", "Cream", "Garlic", "Lemon"],
  },
  {
    id: "3",
    title: "Veggie Gnocchi Traybake",
    subtitle: "Minimal washing up, maximum colour",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
    category: "Easy prep",
    cookTime: "30 mins",
    ingredients: ["Gnocchi", "Peppers", "Tomatoes", "Mozzarella"],
  },
  {
    id: "4",
    title: "Steak Fajita Board",
    subtitle: "Big flavours and a fun table moment",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
    category: "Weekend crowd-pleaser",
    cookTime: "35 mins",
    wow: true,
    ingredients: ["Steak", "Peppers", "Onions", "Wraps", "Lime"],
  },
  {
    id: "5",
    title: "Tomato Basil Rigatoni",
    subtitle: "Simple, glossy, and always welcome",
    image:
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=1200&q=80",
    category: "Comfort bowl",
    cookTime: "20 mins",
    ingredients: ["Rigatoni", "Tomatoes", "Basil", "Parmesan"],
  },
  {
    id: "6",
    title: "Sticky Halloumi Grain Bowl",
    subtitle: "Fresh, bright, and packed with texture",
    image:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80",
    category: "Lighter pick",
    cookTime: "20 mins",
    ingredients: ["Halloumi", "Couscous", "Cucumber", "Mint", "Pomegranate"],
  },
];

function createDefaultPlanner(): PlannerState {
  const today = new Date();
  const monday = new Date(today);
  const day = monday.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  monday.setDate(monday.getDate() + diff);

  return {
    weekOf: monday.toISOString(),
    plans: DAY_NAMES.map((dayName) => ({ day: dayName, meal: null })),
    notes: "",
  };
}

function formatWeekLabel(isoDate: string) {
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function plannerCompletion(plans: DayPlan[]) {
  const completed = plans.filter((plan) => plan.meal).length;
  return {
    completed,
    total: plans.length,
    percent: Math.round((completed / plans.length) * 100),
  };
}

export default function PlannerDevPage() {
  const [planner, setPlanner] = useState<PlannerState>(createDefaultPlanner());
  const [selectedDay, setSelectedDay] = useState<string>(DAY_NAMES[0]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string>("");
  const [search, setSearch] = useState("");
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function initialisePlanner() {
      try {
        const user = await getUser();

        if (!user?.id) {
          if (!cancelled) {
            setLoading(false);
            setCurrentUserId(null);
          }
          return;
        }

        const loaded = await loadPlanner(user.id);

        if (!cancelled) {
          setCurrentUserId(user.id);
          setPlanner(loaded && loaded.plans ? loaded : createDefaultPlanner());
        }
      } catch (error) {
        console.error("Failed to load planner", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void initialisePlanner();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!currentUserId || loading) return;
    if (saveTimeout.current) clearTimeout(saveTimeout.current);

    saveTimeout.current = setTimeout(async () => {
      try {
        setSaving(true);
        await savePlanner(currentUserId, planner);
        setSaveMessage("Saved");
      } catch (error) {
        console.error("Failed to save planner", error);
        setSaveMessage("Save failed");
      } finally {
        setSaving(false);
        setTimeout(() => setSaveMessage(""), 1800);
      }
    }, 500);

    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, [planner, currentUserId, loading]);

  const selectedPlan = useMemo(
    () =>
      planner.plans.find((plan) => plan.day === selectedDay) ??
      planner.plans[0],
    [planner.plans, selectedDay],
  );

  const filteredMeals = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return STARTER_MEALS;
    return STARTER_MEALS.filter((meal) => {
      const haystack = [
        meal.title,
        meal.subtitle,
        meal.category,
        ...(meal.ingredients ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [search]);

  const stats = plannerCompletion(planner.plans);
  const wowMeals = planner.plans.filter((plan) => plan.meal?.wow).length;

  function assignMeal(day: string, meal: MealSlot) {
    setPlanner((current) => ({
      ...current,
      plans: current.plans.map((plan) =>
        plan.day === day ? { ...plan, meal } : plan,
      ),
    }));
  }

  function clearMeal(day: string) {
    setPlanner((current) => ({
      ...current,
      plans: current.plans.map((plan) =>
        plan.day === day ? { ...plan, meal: null } : plan,
      ),
    }));
  }

  function autofillWeek() {
    setPlanner((current) => ({
      ...current,
      plans: current.plans.map((plan, index) => ({
        ...plan,
        meal: STARTER_MEALS[index % STARTER_MEALS.length],
      })),
    }));
  }

  function updateNotes(value: string) {
    setPlanner((current) => ({ ...current, notes: value }));
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-stone-50 px-4 py-10 text-stone-900">
        <div className="mx-auto max-w-6xl animate-pulse space-y-6">
          <div className="h-48 rounded-[28px] bg-white shadow-sm" />
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <div className="h-[640px] rounded-[28px] bg-white shadow-sm" />
            <div className="h-[640px] rounded-[28px] bg-white shadow-sm" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-stretch">
          <div className="relative overflow-hidden rounded-[32px] bg-stone-900 p-8 text-white">
            <div className="absolute inset-0 opacity-25">
              <img
                src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1600&q=80"
                alt="Fresh ingredients arranged on a kitchen table"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="relative z-10 flex h-full flex-col justify-between gap-8">
              <div className="space-y-4">
                <span className="inline-flex w-fit rounded-full bg-white/15 px-3 py-1 text-sm font-medium backdrop-blur">
                  Local Pantry planner
                </span>
                <div className="space-y-3">
                  <h1 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-5xl">
                    Your weekly meal plan, with a little wow built in.
                  </h1>
                  <p className="max-w-xl text-base leading-7 text-stone-200 sm:text-lg">
                    Plan the week, keep the useful links close, and make every
                    day feel more visual, delicious, and on-brand.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                  <p className="text-sm text-stone-200">Week of</p>
                  <p className="mt-1 text-lg font-semibold">
                    {formatWeekLabel(planner.weekOf)}
                  </p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                  <p className="text-sm text-stone-200">Meals planned</p>
                  <p className="mt-1 text-lg font-semibold">
                    {stats.completed}/{stats.total}
                  </p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                  <p className="text-sm text-stone-200">Wow nights</p>
                  <p className="mt-1 text-lg font-semibold">{wowMeals}</p>
                </div>
              </div>
            </div>
          </div>

          <aside className="flex flex-col justify-between rounded-[32px] bg-[#efe7dc] p-6 shadow-sm">
            <div className="space-y-5">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-stone-500">
                  Quick actions
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900">
                  Keep the useful links. Lose the empty space.
                </h2>
              </div>

              <div className="grid gap-3">
                <button
                  type="button"
                  onClick={autofillWeek}
                  className="inline-flex items-center justify-center rounded-2xl bg-stone-900 px-4 py-3 text-sm font-medium text-white transition hover:opacity-90"
                >
                  Auto-fill a starter week
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/shop"
                    className="rounded-2xl bg-white px-4 py-3 text-center text-sm font-medium text-stone-900 shadow-sm transition hover:-translate-y-0.5"
                  >
                    Shop ingredients
                  </Link>
                  <Link
                    href="/basket"
                    className="rounded-2xl bg-white px-4 py-3 text-center text-sm font-medium text-stone-900 shadow-sm transition hover:-translate-y-0.5"
                  >
                    View basket
                  </Link>
                </div>

                <Link
                  href="/boxes"
                  className="rounded-2xl bg-white px-4 py-3 text-center text-sm font-medium text-stone-900 shadow-sm transition hover:-translate-y-0.5"
                >
                  Browse weekly boxes
                </Link>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-stone-600">
                  Save status
                </p>
                <span className="text-sm text-stone-500">
                  {saving ? "Saving…" : saveMessage || "Up to date"}
                </span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-stone-200">
                <div
                  className="h-full rounded-full bg-stone-900 transition-all"
                  style={{ width: `${stats.percent}%` }}
                />
              </div>
              <p className="mt-3 text-sm text-stone-600">
                {stats.completed === 0
                  ? "Start by choosing a meal for the first day."
                  : `${stats.completed} day${stats.completed === 1 ? "" : "s"} planned so far.`}
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-[28px] bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-stone-500">
                  Weekly planner
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                  A tighter weekly view with less dead space
                </h2>
              </div>
              <div className="text-sm text-stone-500">Tap a day to edit it</div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {planner.plans.map((plan) => {
                const active = plan.day === selectedDay;
                const meal = plan.meal;

                return (
                  <button
                    key={plan.day}
                    type="button"
                    onClick={() => setSelectedDay(plan.day)}
                    className={`overflow-hidden rounded-[24px] border text-left transition ${
                      active
                        ? "border-stone-900 shadow-md"
                        : "border-stone-200 shadow-sm hover:-translate-y-0.5 hover:shadow-md"
                    }`}
                  >
                    <div className="relative h-40 bg-stone-100">
                      {meal ? (
                        <img
                          src={meal.image}
                          alt={meal.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#f1e7da] to-[#ddd3c8] px-6 text-center">
                          <div>
                            <p className="text-sm font-medium uppercase tracking-[0.18em] text-stone-500">
                              {plan.day}
                            </p>
                            <p className="mt-2 text-lg font-semibold text-stone-800">
                              Add a meal with some visual pull
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-stone-900 backdrop-blur">
                        {plan.day}
                      </div>

                      {meal?.wow ? (
                        <div className="absolute right-3 top-3 rounded-full bg-amber-300 px-3 py-1 text-xs font-semibold text-stone-900">
                          Wow factor
                        </div>
                      ) : null}
                    </div>

                    <div className="space-y-2 p-4">
                      {meal ? (
                        <>
                          <h3 className="text-lg font-semibold leading-tight text-stone-900">
                            {meal.title}
                          </h3>
                          {meal.subtitle ? (
                            <p className="line-clamp-2 text-sm text-stone-600">
                              {meal.subtitle}
                            </p>
                          ) : null}
                          <div className="flex flex-wrap gap-2 pt-1">
                            {meal.category ? (
                              <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700">
                                {meal.category}
                              </span>
                            ) : null}
                            {meal.cookTime ? (
                              <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700">
                                {meal.cookTime}
                              </span>
                            ) : null}
                          </div>
                        </>
                      ) : (
                        <p className="text-sm text-stone-600">
                          No meal chosen yet. Pick one from the inspiration
                          list.
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-[28px] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-stone-500">
                  Planner notes
                </p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight">
                  Keep the extra details tucked in
                </h2>
              </div>
            </div>
            <textarea
              value={planner.notes}
              onChange={(event) => updateNotes(event.target.value)}
              placeholder="Add delivery notes, prep reminders, or anything you want to remember this week..."
              className="min-h-[140px] w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none ring-0 placeholder:text-stone-400 focus:border-stone-400"
            />
          </div>
        </div>

        <aside className="space-y-6">
          <div className="overflow-hidden rounded-[28px] bg-white shadow-sm">
            <div className="relative h-56">
              <img
                src={
                  selectedPlan.meal?.image ||
                  "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=1200&q=80"
                }
                alt={
                  selectedPlan.meal?.title ||
                  `${selectedPlan.day} placeholder meal image`
                }
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-stone-200">
                  Selected day
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                  {selectedPlan.day}
                </h2>
                <p className="mt-1 text-sm text-stone-200">
                  {selectedPlan.meal?.title ||
                    "Choose a meal to bring this day to life."}
                </p>
              </div>
            </div>

            <div className="space-y-4 p-5">
              {selectedPlan.meal ? (
                <>
                  <div>
                    <p className="text-sm font-medium text-stone-500">Meal</p>
                    <h3 className="mt-1 text-xl font-semibold text-stone-900">
                      {selectedPlan.meal.title}
                    </h3>
                    {selectedPlan.meal.subtitle ? (
                      <p className="mt-2 text-sm leading-6 text-stone-600">
                        {selectedPlan.meal.subtitle}
                      </p>
                    ) : null}
                  </div>

                  {selectedPlan.meal.ingredients?.length ? (
                    <div>
                      <p className="text-sm font-medium text-stone-500">
                        Main ingredients
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedPlan.meal.ingredients.map((ingredient) => (
                          <span
                            key={ingredient}
                            className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700"
                          >
                            {ingredient}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href="/shop"
                      className="rounded-2xl bg-stone-900 px-4 py-3 text-center text-sm font-medium text-white transition hover:opacity-90"
                    >
                      Shop this meal
                    </Link>
                    <button
                      type="button"
                      onClick={() => clearMeal(selectedPlan.day)}
                      className="rounded-2xl border border-stone-200 px-4 py-3 text-sm font-medium text-stone-900 transition hover:bg-stone-50"
                    >
                      Clear day
                    </button>
                  </div>
                </>
              ) : (
                <div className="rounded-2xl bg-stone-50 p-4 text-sm leading-6 text-stone-600">
                  Pick a meal from the inspiration list below to remove the
                  empty state and make this day feel finished.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[28px] bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-col gap-3">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-stone-500">
                  Inspiration
                </p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight">
                  More imagery, less friction
                </h2>
              </div>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search meals, ingredients, or mood"
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none placeholder:text-stone-400 focus:border-stone-400"
              />
            </div>

            <div className="space-y-3">
              {filteredMeals.map((meal) => (
                <div
                  key={meal.id}
                  className="grid grid-cols-[88px_1fr] gap-3 rounded-2xl border border-stone-200 p-3"
                >
                  <img
                    src={meal.image}
                    alt={meal.title}
                    className="h-[88px] w-[88px] rounded-xl object-cover"
                  />

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-semibold text-stone-900">
                          {meal.title}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-sm text-stone-600">
                          {meal.subtitle}
                        </p>
                      </div>
                      {meal.wow ? (
                        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-900">
                          Wow
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {meal.cookTime ? (
                        <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-medium text-stone-700">
                          {meal.cookTime}
                        </span>
                      ) : null}
                      {meal.category ? (
                        <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-medium text-stone-700">
                          {meal.category}
                        </span>
                      ) : null}
                    </div>

                    <button
                      type="button"
                      onClick={() => assignMeal(selectedPlan.day, meal)}
                      className="mt-3 inline-flex rounded-xl bg-stone-900 px-3 py-2 text-xs font-medium text-white transition hover:opacity-90"
                    >
                      Add to {selectedPlan.day}
                    </button>
                  </div>
                </div>
              ))}

              {filteredMeals.length === 0 ? (
                <div className="rounded-2xl bg-stone-50 p-4 text-sm text-stone-600">
                  No meals matched that search. Try “salmon”, “quick”, or “wow”.
                </div>
              ) : null}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
