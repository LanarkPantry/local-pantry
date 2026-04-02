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
    // Fail silently for beginner-safe behaviour.
  }
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

function buildEmptyWeek(): WeeklyMeals {
  return DAYS.reduce((acc, day) => {
    acc[day] = null;
    return acc;
  }, {} as WeeklyMeals);
}

function truncate(text: string, limit: number) {
  if (!text) return "";
  if (text.length <= limit) return text;
  return `${text.slice(0, limit).trim()}…`;
}

export default function PlannerPage() {
  const [savedRecipes, setSavedRecipes] = useState<RecipeLike[]>([]);
  const [plannerRecipes, setPlannerRecipes] = useState<RecipeLike[]>([]);
  const [weeklyMeals, setWeeklyMeals] = useState<WeeklyMeals>(buildEmptyWeek());
  const [selectedByDay, setSelectedByDay] = useState<Record<string, string>>(
    {},
  );
  const [statusMessage, setStatusMessage] = useState("");

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

  const plannerIds = useMemo(
    () => new Set(plannerRecipes.map((recipe) => recipe.id)),
    [plannerRecipes],
  );

  const plannedCount = useMemo(() => {
    return DAYS.filter((day) => Boolean(weeklyMeals[day])).length;
  }, [weeklyMeals]);

  const unplannedDays = DAYS.filter((day) => !weeklyMeals[day]);

  const weekRecipes = useMemo(() => {
    const ids = DAYS.map((day) => weeklyMeals[day]).filter(
      (value): value is string => Boolean(value),
    );

    const uniqueIds = Array.from(new Set(ids));

    return uniqueIds
      .map((id) => recipesById.get(id))
      .filter((recipe): recipe is RecipeLike => Boolean(recipe));
  }, [weeklyMeals, recipesById]);

  function persistPlannerRecipes(next: RecipeLike[]) {
    setPlannerRecipes(next);
    safeWrite(PLANNER_RECIPES_KEY, next);
  }

  function persistWeeklyMeals(next: WeeklyMeals) {
    setWeeklyMeals(next);
    safeWrite(WEEKLY_MEALS_KEY, next);
  }

  function addRecipeToPlanner(recipe: RecipeLike) {
    if (plannerIds.has(recipe.id)) {
      setStatusMessage("Already in planner recipes");
      return;
    }

    const next = [recipe, ...plannerRecipes];
    persistPlannerRecipes(next);
    setStatusMessage("Added to planner");
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

  function assignRecipeToDay(day: string) {
    const chosenId = selectedByDay[day];
    if (!chosenId) return;

    const next = {
      ...weeklyMeals,
      [day]: chosenId,
    };

    persistWeeklyMeals(next);
    setStatusMessage(`Saved for ${day}`);
  }

  function clearDay(day: string) {
    const next = {
      ...weeklyMeals,
      [day]: null,
    };

    persistWeeklyMeals(next);
    setStatusMessage(`${day} cleared`);
  }

  function clearWholeWeek() {
    persistWeeklyMeals(buildEmptyWeek());
    setStatusMessage("Week cleared");
  }

  return (
    <main className="min-h-screen bg-[#f7f4ec] pb-28 text-[#213128]">
      <div className="mx-auto flex w-full max-w-6xl flex-col px-4 pb-10 pt-5 sm:px-6 sm:pt-8">
        <div className="mb-5">
          <p className="mb-2 text-[11px] uppercase tracking-[0.22em] text-[#6a7b70]">
            Plan your week
          </p>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl font-semibold tracking-[-0.02em] text-[#1f2b24] sm:text-4xl">
                Weekly planner
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#55645b] sm:text-base">
                Keep the week feeling calm. Choose a few meals you actually want
                to cook, place them where they fit, and keep your next shop in
                sight.
              </p>
            </div>

            {statusMessage ? (
              <div className="hidden rounded-full border border-[#d8dfd3] bg-white px-3 py-1.5 text-xs text-[#536257] sm:block">
                {statusMessage}
              </div>
            ) : null}
          </div>

          {statusMessage ? (
            <div className="mt-3 inline-flex rounded-full border border-[#d8dfd3] bg-white px-3 py-1.5 text-xs text-[#536257] sm:hidden">
              {statusMessage}
            </div>
          ) : null}
        </div>

        <section className="mb-5 rounded-3xl border border-[#dde4d8] bg-white/90 p-4 shadow-[0_8px_30px_rgba(31,43,36,0.04)] sm:p-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-[#f6f8f3] p-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#738276]">
                This week
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-[#213128]">
                {plannedCount}/7
              </p>
              <p className="mt-1 text-sm text-[#5c6b62]">
                meals placed into the week
              </p>
            </div>

            <div className="rounded-2xl bg-[#f6f8f3] p-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#738276]">
                Planner recipes
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-[#213128]">
                {plannerRecipes.length}
              </p>
              <p className="mt-1 text-sm text-[#5c6b62]">
                ready to drop into a day
              </p>
            </div>

            <div className="rounded-2xl bg-[#f6f8f3] p-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#738276]">
                Still open
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-[#213128]">
                {unplannedDays.length}
              </p>
              <p className="mt-1 text-sm text-[#5c6b62]">days left flexible</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/recipes"
              className="inline-flex items-center rounded-full bg-[#213128] px-4 py-2 text-sm font-medium text-white transition hover:opacity-95"
            >
              Browse recipes
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center rounded-full border border-[#cfd8c9] bg-white px-4 py-2 text-sm font-medium text-[#213128] transition hover:bg-[#f7f8f4]"
            >
              Browse shop
            </Link>
            <button
              type="button"
              onClick={clearWholeWeek}
              className="inline-flex items-center rounded-full border border-transparent px-4 py-2 text-sm font-medium text-[#66766b] transition hover:bg-[#f3f5f1]"
            >
              Clear week
            </button>
          </div>
        </section>

        <section className="mb-5 rounded-3xl border border-[#dde4d8] bg-white/90 p-4 shadow-[0_8px_30px_rgba(31,43,36,0.04)] sm:p-5">
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#738276]">
                Quick start
              </p>
              <h2 className="mt-1 text-xl font-semibold tracking-[-0.02em] text-[#1f2b24]">
                Add favourites into the planner
              </h2>
            </div>
            {savedRecipes.length > 0 ? (
              <span className="text-xs text-[#66766b]">
                {savedRecipes.length} saved
              </span>
            ) : null}
          </div>

          {savedRecipes.length === 0 ? (
            <div className="rounded-2xl bg-[#f7f8f4] p-4">
              <p className="text-sm leading-6 text-[#59685f]">
                You have no saved favourites yet. Start in Recipes, save a few
                ideas you love, then they will show up here ready for the week.
              </p>
              <Link
                href="/recipes"
                className="mt-3 inline-flex items-center rounded-full bg-[#213128] px-4 py-2 text-sm font-medium text-white"
              >
                Go to recipes
              </Link>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {savedRecipes.slice(0, 6).map((recipe) => {
                const alreadyAdded = plannerIds.has(recipe.id);

                return (
                  <article
                    key={recipe.id}
                    className="rounded-2xl border border-[#e3e8df] bg-[#fcfcfa] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-medium leading-6 text-[#213128]">
                          {recipe.title}
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-[#627168]">
                          {recipe.description
                            ? truncate(recipe.description, 92)
                            : "A saved idea ready to use this week."}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => addRecipeToPlanner(recipe)}
                        disabled={alreadyAdded}
                        className={`inline-flex items-center rounded-full px-3 py-2 text-sm font-medium transition ${
                          alreadyAdded
                            ? "cursor-default bg-[#eef2eb] text-[#6a786f]"
                            : "bg-[#213128] text-white hover:opacity-95"
                        }`}
                      >
                        {alreadyAdded ? "In planner" : "Add to planner"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="mb-5 rounded-3xl border border-[#dde4d8] bg-white/90 p-4 shadow-[0_8px_30px_rgba(31,43,36,0.04)] sm:p-5">
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#738276]">
                Ready for planning
              </p>
              <h2 className="mt-1 text-xl font-semibold tracking-[-0.02em] text-[#1f2b24]">
                Planner recipes
              </h2>
            </div>
            <span className="text-xs text-[#66766b]">
              {plannerRecipes.length} available
            </span>
          </div>

          {plannerRecipes.length === 0 ? (
            <div className="rounded-2xl bg-[#f7f8f4] p-4">
              <p className="text-sm leading-6 text-[#59685f]">
                Nothing in your planner yet. Add a few saved favourites above,
                then place them into the week below.
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {plannerRecipes.map((recipe) => (
                <article
                  key={recipe.id}
                  className="rounded-2xl border border-[#e3e8df] bg-[#fcfcfa] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-medium leading-6 text-[#213128]">
                        {recipe.title}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-[#627168]">
                        {recipe.description
                          ? truncate(recipe.description, 96)
                          : "Kept here so you can drop it into the week whenever it fits."}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeRecipeFromPlanner(recipe.id)}
                      className="shrink-0 rounded-full border border-[#d9dfd5] px-3 py-1.5 text-xs font-medium text-[#66756c] transition hover:bg-[#f5f7f3]"
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-[#dde4d8] bg-white/90 p-4 shadow-[0_8px_30px_rgba(31,43,36,0.04)] sm:p-5">
          <div className="mb-4">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#738276]">
              This week
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-[-0.02em] text-[#1f2b24]">
              Your plan
            </h2>
            <p className="mt-1 text-sm leading-6 text-[#5c6b62]">
              Keep it realistic. Two or three dinners is already a good week.
            </p>
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            {DAYS.map((day) => {
              const assignedId = weeklyMeals[day];
              const assignedRecipe = assignedId
                ? recipesById.get(assignedId)
                : null;

              return (
                <article
                  key={day}
                  className="rounded-2xl border border-[#e3e8df] bg-[#fcfcfa] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold text-[#213128]">
                        {day}
                      </h3>
                      <p className="mt-1 text-sm text-[#627168]">
                        {assignedRecipe
                          ? assignedRecipe.title
                          : "Nothing planned yet."}
                      </p>
                    </div>

                    {assignedRecipe ? (
                      <button
                        type="button"
                        onClick={() => clearDay(day)}
                        className="rounded-full border border-[#d9dfd5] px-3 py-1.5 text-xs font-medium text-[#66756c] transition hover:bg-[#f5f7f3]"
                      >
                        Clear
                      </button>
                    ) : null}
                  </div>

                  <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <select
                      value={selectedByDay[day] || ""}
                      onChange={(e) =>
                        setSelectedByDay((prev) => ({
                          ...prev,
                          [day]: e.target.value,
                        }))
                      }
                      className="min-h-[44px] w-full rounded-2xl border border-[#d6ddd1] bg-white px-3 text-sm text-[#213128] outline-none transition focus:border-[#9eaf9f]"
                    >
                      <option value="">Choose a planner recipe</option>
                      {plannerRecipes.map((recipe) => (
                        <option key={recipe.id} value={recipe.id}>
                          {recipe.title}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => assignRecipeToDay(day)}
                      disabled={!selectedByDay[day]}
                      className={`min-h-[44px] rounded-2xl px-4 text-sm font-medium transition ${
                        selectedByDay[day]
                          ? "bg-[#213128] text-white hover:opacity-95"
                          : "bg-[#eef2eb] text-[#86938a]"
                      }`}
                    >
                      Save
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-5 rounded-2xl bg-[#f6f8f3] p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-[#738276]">
                  Week at a glance
                </p>
                <h3 className="mt-1 text-lg font-semibold tracking-[-0.02em] text-[#1f2b24]">
                  Keep the next step visible
                </h3>
                <p className="mt-1 text-sm leading-6 text-[#5c6b62]">
                  {plannedCount === 0
                    ? "No meals planned yet. Start with two or three simple dinners."
                    : `${plannedCount} meal${
                        plannedCount === 1 ? "" : "s"
                      } planned for the week.`}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  href="/recipes"
                  className="inline-flex items-center rounded-full border border-[#cfd8c9] bg-white px-4 py-2 text-sm font-medium text-[#213128] transition hover:bg-[#f9faf7]"
                >
                  Add more ideas
                </Link>
                <Link
                  href="/shop"
                  className="inline-flex items-center rounded-full bg-[#213128] px-4 py-2 text-sm font-medium text-white transition hover:opacity-95"
                >
                  Browse shop for the week
                </Link>
              </div>
            </div>

            {weekRecipes.length > 0 ? (
              <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {weekRecipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="rounded-2xl border border-[#dfe6da] bg-white px-4 py-3"
                  >
                    <p className="text-sm font-medium text-[#213128]">
                      {recipe.title}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[#66756c]">
                      {recipe.description
                        ? truncate(recipe.description, 70)
                        : "Added to this week."}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
