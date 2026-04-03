"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type RecipeLike = {
  id: string;
  title: string;
  description?: string;
  image?: string;
  imageUrl?: string;
  prompt?: string;
  ingredients?: string[];
  basketMatches?: Array<{
    id?: string;
    name?: string;
    title?: string;
    quantity?: number;
  }>;
};

type WeeklyMeals = Record<string, string | null>;

const SAVED_FAVOURITES_KEY = "tlp_saved_favourite_recipes";
const PLANNER_RECIPES_KEY = "tlp_planner_recipes";
const WEEKLY_MEALS_KEY = "tlp_weekly_planner_meals";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function safeRead<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeWrite<T>(key: string, value: T) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // silent on purpose
  }
}

function buildEmptyWeek(): WeeklyMeals {
  return DAYS.reduce((acc, day) => {
    acc[day] = null;
    return acc;
  }, {} as WeeklyMeals);
}

function toId(value: unknown, fallback: string) {
  if (typeof value === "string" && value.trim()) return value;
  return fallback;
}

function toTitle(recipe: any, index: number) {
  const title =
    recipe?.title ||
    recipe?.name ||
    recipe?.recipeTitle ||
    recipe?.label ||
    recipe?.prompt;

  if (typeof title === "string" && title.trim()) return title.trim();
  return `Saved recipe ${index + 1}`;
}

function toDescription(recipe: any) {
  const description =
    recipe?.description || recipe?.summary || recipe?.excerpt || recipe?.notes;

  if (typeof description === "string" && description.trim()) {
    return description.trim();
  }

  return "";
}

function normalizeRecipe(recipe: any, index: number): RecipeLike {
  const title = toTitle(recipe, index);

  return {
    ...recipe,
    id: toId(recipe?.id, `${title}-${index}`),
    title,
    description: toDescription(recipe),
    image:
      typeof recipe?.image === "string"
        ? recipe.image
        : typeof recipe?.imageUrl === "string"
          ? recipe.imageUrl
          : undefined,
    imageUrl:
      typeof recipe?.imageUrl === "string"
        ? recipe.imageUrl
        : typeof recipe?.image === "string"
          ? recipe.image
          : undefined,
    ingredients: Array.isArray(recipe?.ingredients)
      ? recipe.ingredients.filter((item: unknown) => typeof item === "string")
      : [],
    basketMatches: Array.isArray(recipe?.basketMatches)
      ? recipe.basketMatches
      : [],
  };
}

function truncate(text: string, limit: number) {
  if (!text) return "";
  if (text.length <= limit) return text;
  return `${text.slice(0, limit).trim()}…`;
}

function getRecipeImage(recipe?: RecipeLike | null) {
  if (!recipe) return "";
  return recipe.imageUrl || recipe.image || "";
}

function getInitials(title: string) {
  const words = title.split(" ").filter(Boolean);
  return words
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() || "")
    .join("");
}

function normaliseLabel(value: string) {
  return value.trim().toLowerCase();
}

function RecipeImage({
  recipe,
  compact = false,
}: {
  recipe?: RecipeLike | null;
  compact?: boolean;
}) {
  const image = getRecipeImage(recipe);

  if (image) {
    return (
      <div
        className={`overflow-hidden rounded-2xl bg-[#e8eee5] ${
          compact ? "h-14 w-14" : "h-28 w-full"
        }`}
      >
        <img
          src={image}
          alt={recipe?.title || "Recipe"}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-2xl bg-[#dde6d8] text-[#516254] ${
        compact
          ? "h-14 w-14 text-sm font-semibold"
          : "h-28 w-full text-lg font-semibold"
      }`}
    >
      {recipe?.title ? getInitials(recipe.title) : "TLP"}
    </div>
  );
}

export default function PlannerPage() {
  const [savedRecipes, setSavedRecipes] = useState<RecipeLike[]>([]);
  const [plannerRecipes, setPlannerRecipes] = useState<RecipeLike[]>([]);
  const [weeklyMeals, setWeeklyMeals] = useState<WeeklyMeals>(buildEmptyWeek());
  const [selectedDay, setSelectedDay] = useState<string>("Monday");
  const [showSaved, setShowSaved] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const rawSaved = safeRead<any[]>(SAVED_FAVOURITES_KEY, []);
    const rawPlanner = safeRead<any[]>(PLANNER_RECIPES_KEY, []);
    const rawWeekly = safeRead<WeeklyMeals>(WEEKLY_MEALS_KEY, buildEmptyWeek());

    const normalisedSaved = Array.isArray(rawSaved)
      ? rawSaved.map((item, index) => normalizeRecipe(item, index))
      : [];

    const normalisedPlanner = Array.isArray(rawPlanner)
      ? rawPlanner.map((item, index) => normalizeRecipe(item, index))
      : [];

    const cleanedWeek = buildEmptyWeek();
    for (const day of DAYS) {
      cleanedWeek[day] =
        typeof rawWeekly?.[day] === "string" ? rawWeekly[day] : null;
    }

    setSavedRecipes(normalisedSaved);
    setPlannerRecipes(normalisedPlanner);
    setWeeklyMeals(cleanedWeek);

    const firstUnplanned = DAYS.find((day) => !cleanedWeek[day]);
    if (firstUnplanned) {
      setSelectedDay(firstUnplanned);
    }

    setHasLoaded(true);
  }, []);

  useEffect(() => {
    if (!statusMessage) return;
    const timer = window.setTimeout(() => setStatusMessage(""), 1800);
    return () => window.clearTimeout(timer);
  }, [statusMessage]);

  const recipesById = useMemo(() => {
    const map = new Map<string, RecipeLike>();

    for (const recipe of savedRecipes) {
      map.set(recipe.id, recipe);
    }

    for (const recipe of plannerRecipes) {
      map.set(recipe.id, recipe);
    }

    return map;
  }, [savedRecipes, plannerRecipes]);

  const plannerRecipeIds = useMemo(
    () => new Set(plannerRecipes.map((recipe) => recipe.id)),
    [plannerRecipes],
  );

  const plannedCount = useMemo(() => {
    return DAYS.filter((day) => Boolean(weeklyMeals[day])).length;
  }, [weeklyMeals]);

  const activeRecipe = weeklyMeals[selectedDay]
    ? recipesById.get(weeklyMeals[selectedDay] as string) || null
    : null;

  const visibleRecipes = showSaved ? savedRecipes : plannerRecipes;

  const filteredRecipes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return visibleRecipes;

    return visibleRecipes.filter((recipe) => {
      const text = [
        recipe.title,
        recipe.description || "",
        ...(recipe.ingredients || []),
        ...(recipe.basketMatches || []).map(
          (item) => item?.title || item?.name || "",
        ),
      ]
        .join(" ")
        .toLowerCase();

      return text.includes(query);
    });
  }, [searchQuery, visibleRecipes]);

  const weekSummary = useMemo(() => {
    const counts = new Map<
      string,
      { label: string; count: number; days: string[] }
    >();

    for (const day of DAYS) {
      const recipeId = weeklyMeals[day];
      if (!recipeId) continue;

      const recipe = recipesById.get(recipeId);
      if (!recipe) continue;

      const sources = [
        ...(Array.isArray(recipe.ingredients) ? recipe.ingredients : []),
        ...(Array.isArray(recipe.basketMatches)
          ? recipe.basketMatches.map((item) => item?.title || item?.name || "")
          : []),
      ];

      for (const rawItem of sources) {
        if (typeof rawItem !== "string") continue;
        const label = rawItem.trim();
        if (!label) continue;

        const key = normaliseLabel(label);
        const existing = counts.get(key);

        if (existing) {
          existing.count += 1;
          if (!existing.days.includes(day)) {
            existing.days.push(day);
          }
        } else {
          counts.set(key, {
            label,
            count: 1,
            days: [day],
          });
        }
      }
    }

    return Array.from(counts.values())
      .sort((a, b) => {
        if (b.count !== a.count) return b.count - a.count;
        return a.label.localeCompare(b.label);
      })
      .slice(0, 18);
  }, [weeklyMeals, recipesById]);

  const firstOpenDay = useMemo(() => {
    return DAYS.find((day) => !weeklyMeals[day]) || null;
  }, [weeklyMeals]);

  const canClearWeek = plannedCount > 0;

  function persistPlannerRecipes(next: RecipeLike[]) {
    setPlannerRecipes(next);
    safeWrite(PLANNER_RECIPES_KEY, next);
  }

  function persistWeeklyMeals(next: WeeklyMeals) {
    setWeeklyMeals(next);
    safeWrite(WEEKLY_MEALS_KEY, next);
  }

  function addRecipeToPlanner(recipe: RecipeLike) {
    if (plannerRecipeIds.has(recipe.id)) {
      setStatusMessage("Already in planner");
      return;
    }

    const next = [recipe, ...plannerRecipes];
    persistPlannerRecipes(next);
    setShowSaved(false);
    setStatusMessage("Added to planner");
  }

  function assignRecipeToSelectedDay(recipe: RecipeLike) {
    const next = {
      ...weeklyMeals,
      [selectedDay]: recipe.id,
    };

    persistWeeklyMeals(next);

    const nextOpenDay = DAYS.find((day) => day !== selectedDay && !next[day]);

    if (nextOpenDay) {
      setSelectedDay(nextOpenDay);
    }

    setStatusMessage(`${recipe.title} added to ${selectedDay}`);
  }

  function clearSelectedDay() {
    const next = {
      ...weeklyMeals,
      [selectedDay]: null,
    };

    persistWeeklyMeals(next);
    setStatusMessage(`${selectedDay} cleared`);
  }

  function clearWeek() {
    persistWeeklyMeals(buildEmptyWeek());
    setSelectedDay("Monday");
    setStatusMessage("Week cleared");
  }

  function removeRecipeFromPlanner(recipeId: string) {
    const nextPlannerRecipes = plannerRecipes.filter(
      (recipe) => recipe.id !== recipeId,
    );
    persistPlannerRecipes(nextPlannerRecipes);

    const nextMeals = { ...weeklyMeals };
    for (const day of DAYS) {
      if (nextMeals[day] === recipeId) {
        nextMeals[day] = null;
      }
    }
    persistWeeklyMeals(nextMeals);

    setStatusMessage("Removed from planner");
  }

  return (
    <main className="min-h-screen overflow-x-clip text-[#213128]">
      <div className="mx-auto w-full max-w-6xl px-4 pb-10 pt-4 sm:px-6 sm:pt-8">
        <section className="rounded-[28px] border border-[rgba(223,230,218,0.95)] bg-[rgba(255,255,255,0.78)] p-4 shadow-[0_10px_30px_rgba(31,43,36,0.05)] backdrop-blur-md sm:p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-[#758278]">
                  Weekly planner
                </p>
                <h1 className="mt-1 text-3xl font-semibold tracking-[-0.03em] text-[#1f2b24] sm:text-4xl">
                  Plan meals for the week ahead
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5d6b62] sm:text-base">
                  Planning works wherever you are. Ordering is available in
                  Lanark and nearby for now, with delivery areas expanding over
                  time.{" "}
                  <Link
                    href="/#postcode-checker"
                    className="font-medium text-[#213128] underline decoration-[rgba(33,49,40,0.28)] underline-offset-4 transition hover:decoration-[rgba(33,49,40,0.58)]"
                  >
                    Check your postcode
                  </Link>
                  .
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  href="/recipes"
                  className="inline-flex min-h-[42px] items-center rounded-full border border-[#d5ddd1] bg-[rgba(255,255,255,0.86)] px-4 text-sm font-medium text-[#213128] transition hover:bg-white"
                >
                  Browse recipes
                </Link>
                <Link
                  href="/shop"
                  className="inline-flex min-h-[42px] items-center rounded-full bg-[#213128] px-4 text-sm font-medium text-white transition hover:opacity-95"
                >
                  Go to shop
                </Link>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex rounded-full border border-[#dbe2d7] bg-[rgba(251,252,250,0.88)] px-3 py-1.5 text-sm text-[#58675e] backdrop-blur-sm">
                {plannedCount} of 7 days planned
              </div>

              {statusMessage ? (
                <div className="inline-flex rounded-full border border-[#dbe2d7] bg-[rgba(251,252,250,0.88)] px-3 py-1.5 text-xs text-[#58675e] backdrop-blur-sm">
                  {statusMessage}
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-[28px] border border-[rgba(223,230,218,0.95)] bg-[rgba(255,255,255,0.78)] p-4 shadow-[0_10px_30px_rgba(31,43,36,0.05)] backdrop-blur-md sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#758278]">
                This week
              </p>
              <h2 className="mt-1 text-xl font-semibold tracking-[-0.02em] text-[#1f2b24]">
                Choose a day
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={clearSelectedDay}
                disabled={!activeRecipe}
                className={`inline-flex min-h-[40px] items-center rounded-full px-4 text-sm font-medium transition ${
                  activeRecipe
                    ? "border border-[#d4dcd0] bg-[rgba(255,255,255,0.82)] text-[#59685f] hover:bg-white"
                    : "bg-[#eef2eb] text-[#8a968e]"
                }`}
              >
                Clear {selectedDay}
              </button>

              <button
                type="button"
                onClick={clearWeek}
                disabled={!canClearWeek}
                className={`inline-flex min-h-[40px] items-center rounded-full px-4 text-sm font-medium transition ${
                  canClearWeek
                    ? "border border-[#d4dcd0] bg-[rgba(255,255,255,0.82)] text-[#59685f] hover:bg-white"
                    : "bg-[#eef2eb] text-[#8a968e]"
                }`}
              >
                Clear week
              </button>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto pb-1">
            <div className="flex min-w-max gap-2">
              {DAYS.map((day) => {
                const recipeId = weeklyMeals[day];
                const recipe = recipeId
                  ? recipesById.get(recipeId) || null
                  : null;
                const isActive = selectedDay === day;

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    className={`w-[124px] shrink-0 rounded-2xl border px-3 py-3 text-left transition ${
                      isActive
                        ? "border-[#213128] bg-[#213128] text-white"
                        : "border-[#dde4d8] bg-[rgba(251,252,250,0.8)] text-[#213128] hover:bg-[rgba(255,255,255,0.92)]"
                    }`}
                  >
                    <p
                      className={`text-xs uppercase tracking-[0.16em] ${
                        isActive ? "text-white/75" : "text-[#7b877d]"
                      }`}
                    >
                      {day.slice(0, 3)}
                    </p>
                    <p className="mt-2 text-sm font-medium leading-5">
                      {recipe ? truncate(recipe.title, 28) : "Open"}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1.02fr_1.38fr]">
            <div className="rounded-3xl bg-[rgba(246,248,243,0.84)] p-4 backdrop-blur-sm">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#78867c]">
                Selected day
              </p>
              <div className="mt-1 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-2xl font-semibold tracking-[-0.02em] text-[#1f2b24]">
                    {selectedDay}
                  </h3>
                  {!activeRecipe && firstOpenDay === selectedDay ? (
                    <p className="mt-1 text-sm text-[#6b786e]">
                      A good place to start this week.
                    </p>
                  ) : null}
                </div>
              </div>

              {activeRecipe ? (
                <div className="mt-4 space-y-3">
                  <RecipeImage recipe={activeRecipe} />
                  <div>
                    <p className="text-lg font-medium text-[#213128]">
                      {activeRecipe.title}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[#617067]">
                      {activeRecipe.description
                        ? truncate(activeRecipe.description, 130)
                        : "Placed into your week and ready when you are."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-4 rounded-3xl border border-dashed border-[#d8dfd3] bg-[rgba(255,255,255,0.74)] px-4 py-6 backdrop-blur-sm">
                  <p className="text-base font-medium text-[#213128]">
                    Nothing planned yet
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[#617067]">
                    Pick something below and it will drop straight into{" "}
                    {selectedDay}. Keeping a small set of go-to meals here makes
                    weekly planning much faster.
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-3xl bg-[rgba(252,252,250,0.82)] p-4 backdrop-blur-sm">
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-[#78867c]">
                      Add into {selectedDay}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold tracking-[-0.02em] text-[#1f2b24]">
                      Choose from your recipes
                    </h3>
                  </div>

                  <div className="flex rounded-full bg-[rgba(238,242,235,0.9)] p-1">
                    <button
                      type="button"
                      onClick={() => setShowSaved(false)}
                      className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                        !showSaved
                          ? "bg-white text-[#213128] shadow-sm"
                          : "text-[#68776d]"
                      }`}
                    >
                      Planner
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowSaved(true)}
                      className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                        showSaved
                          ? "bg-white text-[#213128] shadow-sm"
                          : "text-[#68776d]"
                      }`}
                    >
                      Saved
                    </button>
                  </div>
                </div>

                {(visibleRecipes.length > 0 || showSaved) && (
                  <div>
                    <label htmlFor="planner-search" className="sr-only">
                      Search recipes
                    </label>
                    <input
                      id="planner-search"
                      type="text"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder={
                        showSaved
                          ? "Search saved recipes"
                          : "Search planner recipes"
                      }
                      className="w-full rounded-2xl border border-[#d8dfd3] bg-[rgba(255,255,255,0.84)] px-4 py-3 text-sm text-[#213128] outline-none transition placeholder:text-[#839085] focus:border-[#b8c5b4] focus:bg-white"
                    />
                  </div>
                )}
              </div>

              {visibleRecipes.length === 0 ? (
                <div className="mt-4 rounded-3xl border border-dashed border-[#d8dfd3] bg-[rgba(255,255,255,0.74)] px-4 py-6 backdrop-blur-sm">
                  <p className="text-base font-medium text-[#213128]">
                    {showSaved
                      ? "No saved favourites yet"
                      : "No planner recipes yet"}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[#617067]">
                    {showSaved
                      ? "Save a few recipes first, then they will appear here."
                      : "Use your saved recipes to build a small weekly collection you can come back to."}
                  </p>

                  <div className="mt-4">
                    <Link
                      href="/recipes"
                      className="inline-flex min-h-[42px] items-center rounded-full border border-[#d5ddd1] bg-[rgba(255,255,255,0.86)] px-4 text-sm font-medium text-[#213128] transition hover:bg-white"
                    >
                      Go to recipes
                    </Link>
                  </div>
                </div>
              ) : filteredRecipes.length === 0 ? (
                <div className="mt-4 rounded-3xl border border-dashed border-[#d8dfd3] bg-[rgba(255,255,255,0.74)] px-4 py-6 backdrop-blur-sm">
                  <p className="text-base font-medium text-[#213128]">
                    No matching recipes
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[#617067]">
                    Try a different search, or switch between planner and saved
                    recipes.
                  </p>
                </div>
              ) : (
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {filteredRecipes.map((recipe) => {
                    const inPlanner = plannerRecipeIds.has(recipe.id);
                    const image = getRecipeImage(recipe);
                    const isAssignedToSelectedDay =
                      weeklyMeals[selectedDay] === recipe.id;

                    return (
                      <article
                        key={recipe.id}
                        className="overflow-hidden rounded-3xl border border-[#e2e8de] bg-[rgba(255,255,255,0.86)] backdrop-blur-sm"
                      >
                        <div className="relative">
                          {image ? (
                            <img
                              src={image}
                              alt={recipe.title}
                              className="h-36 w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-36 w-full items-center justify-center bg-[#dde6d8] text-lg font-semibold text-[#536458]">
                              {getInitials(recipe.title)}
                            </div>
                          )}

                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(31,43,36,0.35)] to-transparent" />
                          <div className="absolute bottom-3 left-3 right-3">
                            <p className="text-base font-semibold text-white">
                              {recipe.title}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3 p-4">
                          <p className="text-sm leading-6 text-[#617067]">
                            {recipe.description
                              ? truncate(recipe.description, 86)
                              : "A calm, useful meal idea ready for the week."}
                          </p>

                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => assignRecipeToSelectedDay(recipe)}
                              className="inline-flex min-h-[42px] items-center rounded-full bg-[#213128] px-4 text-sm font-medium text-white transition hover:opacity-95"
                            >
                              {isAssignedToSelectedDay
                                ? `In ${selectedDay}`
                                : `Add to ${selectedDay}`}
                            </button>

                            {showSaved ? (
                              <button
                                type="button"
                                onClick={() => addRecipeToPlanner(recipe)}
                                disabled={inPlanner}
                                className={`inline-flex min-h-[42px] items-center rounded-full px-4 text-sm font-medium transition ${
                                  inPlanner
                                    ? "bg-[#eef2eb] text-[#7d897f]"
                                    : "border border-[#d5ddd1] bg-[rgba(255,255,255,0.86)] text-[#213128] hover:bg-white"
                                }`}
                              >
                                {inPlanner ? "In planner" : "Keep in planner"}
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() =>
                                  removeRecipeFromPlanner(recipe.id)
                                }
                                className="inline-flex min-h-[42px] items-center rounded-full border border-[#d5ddd1] bg-[rgba(255,255,255,0.86)] px-4 text-sm font-medium text-[#213128] transition hover:bg-white"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-[28px] border border-[rgba(223,230,218,0.95)] bg-[rgba(255,255,255,0.78)] p-4 shadow-[0_10px_30px_rgba(31,43,36,0.05)] backdrop-blur-md sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#758278]">
                Week view
              </p>
              <h2 className="mt-1 text-xl font-semibold tracking-[-0.02em] text-[#1f2b24]">
                Your meals at a glance
              </h2>
            </div>

            <Link
              href="/shop"
              className="inline-flex min-h-[42px] items-center rounded-full bg-[#213128] px-4 text-sm font-medium text-white transition hover:opacity-95"
            >
              Build the weekly shop
            </Link>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {DAYS.map((day) => {
              const recipeId = weeklyMeals[day];
              const recipe = recipeId
                ? recipesById.get(recipeId) || null
                : null;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition ${
                    selectedDay === day
                      ? "border-[#213128] bg-[rgba(247,250,246,0.88)]"
                      : "border-[#e1e7dd] bg-[rgba(252,252,250,0.82)] hover:bg-[rgba(255,255,255,0.92)]"
                  }`}
                >
                  <RecipeImage recipe={recipe} compact />
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.16em] text-[#7c887e]">
                      {day}
                    </p>
                    <p className="mt-1 truncate text-sm font-medium text-[#213128]">
                      {recipe ? recipe.title : "Nothing planned"}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-4 rounded-[28px] border border-[rgba(223,230,218,0.95)] bg-[rgba(255,255,255,0.78)] p-4 shadow-[0_10px_30px_rgba(31,43,36,0.05)] backdrop-blur-md sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#758278]">
                Weekly basket guide
              </p>
              <h2 className="mt-1 text-xl font-semibold tracking-[-0.02em] text-[#1f2b24]">
                Ingredients showing up this week
              </h2>
            </div>
          </div>

          {weekSummary.length === 0 ? (
            <div className="mt-4 rounded-3xl border border-dashed border-[#d8dfd3] bg-[rgba(255,255,255,0.74)] px-4 py-6 backdrop-blur-sm">
              <p className="text-base font-medium text-[#213128]">
                Nothing to summarise yet
              </p>
              <p className="mt-1 text-sm leading-6 text-[#617067]">
                Once you add a few meals, this becomes a simple prompt for what
                you may want to buy this week.
              </p>
            </div>
          ) : (
            <>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-[#617067]">
                A quick view of ingredients appearing across your planned meals.
                Useful whether you are building a local order or just shopping
                more deliberately.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {weekSummary.map((item) => (
                  <div
                    key={`${item.label}-${item.days.join("-")}`}
                    className="rounded-2xl border border-[#e1e7dd] bg-[rgba(252,252,250,0.82)] px-3 py-2"
                  >
                    <p className="text-sm font-medium text-[#213128]">
                      {item.label}
                    </p>
                    <p className="mt-1 text-xs text-[#718076]">
                      {item.count > 1 ? `${item.count} matches` : "1 match"} ·{" "}
                      {item.days.map((day) => day.slice(0, 3)).join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        {!hasLoaded ? (
          <div className="mt-4 text-sm text-[#66756b]">Loading planner…</div>
        ) : null}
      </div>
    </main>
  );
}
