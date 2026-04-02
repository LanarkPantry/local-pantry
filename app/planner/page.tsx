"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type SavedRecipe = {
  id: string;
  title: string;
  description: string;
  ingredientsUsed: string[];
  pantryStaples: string[];
  steps: string[];
  imageUrl: string | null;
  savedAt: string;
};

type PlannerRecipe = {
  id: string;
  title: string;
  description: string;
  ingredientsUsed: string[];
  pantryStaples: string[];
  steps: string[];
  imageUrl: string | null;
  savedAt: string;
  addedToPlannerAt: string;
};

type PlannedMeal = {
  day: string;
  recipeId: string;
  title: string;
  description: string;
  imageUrl: string | null;
};

const FAVOURITES_STORAGE_KEY = "tlp_saved_favourite_recipes";
const PLANNER_RECIPES_STORAGE_KEY = "tlp_planner_recipes";
const WEEKLY_PLANNER_STORAGE_KEY = "tlp_weekly_planner_meals";

const WEEK_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function PlannerPage() {
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
  const [plannerRecipes, setPlannerRecipes] = useState<PlannerRecipe[]>([]);
  const [plannedMeals, setPlannedMeals] = useState<PlannedMeal[]>([]);
  const [selectedRecipeByDay, setSelectedRecipeByDay] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    try {
      const storedRecipes = localStorage.getItem(FAVOURITES_STORAGE_KEY);

      if (!storedRecipes) {
        setSavedRecipes([]);
      } else {
        const parsedRecipes = JSON.parse(storedRecipes) as SavedRecipe[];
        setSavedRecipes(Array.isArray(parsedRecipes) ? parsedRecipes : []);
      }
    } catch (error) {
      console.error("Failed to load saved recipes for planner:", error);
      setSavedRecipes([]);
    }

    try {
      const storedPlannerRecipes = localStorage.getItem(
        PLANNER_RECIPES_STORAGE_KEY,
      );

      if (!storedPlannerRecipes) {
        setPlannerRecipes([]);
      } else {
        const parsedPlannerRecipes = JSON.parse(
          storedPlannerRecipes,
        ) as PlannerRecipe[];
        setPlannerRecipes(
          Array.isArray(parsedPlannerRecipes) ? parsedPlannerRecipes : [],
        );
      }
    } catch (error) {
      console.error("Failed to load planner-ready recipes:", error);
      setPlannerRecipes([]);
    }

    try {
      const storedPlannerMeals = localStorage.getItem(
        WEEKLY_PLANNER_STORAGE_KEY,
      );

      if (!storedPlannerMeals) {
        setPlannedMeals([]);
      } else {
        const parsedPlannerMeals = JSON.parse(
          storedPlannerMeals,
        ) as PlannedMeal[];
        setPlannedMeals(
          Array.isArray(parsedPlannerMeals) ? parsedPlannerMeals : [],
        );
      }
    } catch (error) {
      console.error("Failed to load weekly planner meals:", error);
      setPlannedMeals([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      WEEKLY_PLANNER_STORAGE_KEY,
      JSON.stringify(plannedMeals),
    );
  }, [plannedMeals]);

  const plannerChoices = useMemo(() => {
    if (plannerRecipes.length > 0) {
      return plannerRecipes;
    }

    return savedRecipes.map((recipe) => ({
      ...recipe,
      addedToPlannerAt: recipe.savedAt,
    }));
  }, [plannerRecipes, savedRecipes]);

  const plannedCount = plannedMeals.length;

  const mealsByDay = useMemo(() => {
    return WEEK_DAYS.map((day) => ({
      day,
      meal: plannedMeals.find((item) => item.day === day) || null,
    }));
  }, [plannedMeals]);

  function addMealToDay(day: string) {
    const selectedRecipeId = selectedRecipeByDay[day];

    if (!selectedRecipeId) return;

    const recipe = plannerChoices.find((item) => item.id === selectedRecipeId);

    if (!recipe) return;

    const updatedMeals = [
      ...plannedMeals.filter((item) => item.day !== day),
      {
        day,
        recipeId: recipe.id,
        title: recipe.title,
        description: recipe.description,
        imageUrl: recipe.imageUrl,
      },
    ];

    const sortedMeals = WEEK_DAYS.map((weekDay) =>
      updatedMeals.find((item) => item.day === weekDay),
    ).filter(Boolean) as PlannedMeal[];

    setPlannedMeals(sortedMeals);
  }

  function removeMealFromDay(day: string) {
    const updatedMeals = plannedMeals.filter((item) => item.day !== day);
    setPlannedMeals(updatedMeals);
  }

  function removePlannerRecipe(recipeId: string) {
    const updatedPlannerRecipes = plannerRecipes.filter(
      (recipe) => recipe.id !== recipeId,
    );
    setPlannerRecipes(updatedPlannerRecipes);
    localStorage.setItem(
      PLANNER_RECIPES_STORAGE_KEY,
      JSON.stringify(updatedPlannerRecipes),
    );

    const updatedMeals = plannedMeals.filter(
      (meal) => meal.recipeId !== recipeId,
    );
    setPlannedMeals(updatedMeals);
  }

  function clearPlan() {
    setPlannedMeals([]);
    localStorage.removeItem(WEEKLY_PLANNER_STORAGE_KEY);
  }

  return (
    <main className="min-h-screen bg-[#f4efe9] px-4 py-6 text-[#243328] sm:px-5 md:px-8 md:py-10">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-6 border-b border-[#ddd4c8] pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/"
              className="text-sm tracking-[0.28em] text-[#60705f] transition hover:text-[#243328]"
            >
              THE LOCAL PANTRY
            </Link>

            <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <Link
                href="/"
                className="text-sm text-[#4f5e52] transition hover:text-[#243328]"
              >
                Home
              </Link>

              <Link
                href="/shop"
                className="text-sm text-[#4f5e52] transition hover:text-[#243328]"
              >
                Shop
              </Link>

              <Link
                href="/recipes"
                className="text-sm text-[#4f5e52] transition hover:text-[#243328]"
              >
                Recipes
              </Link>

              <Link
                href="/planner"
                className="text-sm text-[#243328] underline underline-offset-4"
              >
                Planner
              </Link>

              <Link
                href="/basket"
                className="text-sm text-[#4f5e52] transition hover:text-[#243328]"
              >
                Basket
              </Link>
            </nav>
          </div>
        </header>

        <div className="mb-8 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.2em] text-[#6b776c]">
            Plan your week
          </p>
          <h1 className="mt-2 font-serif text-4xl md:text-6xl">
            Weekly planner
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#667164] md:text-base">
            Bring together the recipes you want to cook this week, then shape
            them into a calm, realistic meal plan.
          </p>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <section className="space-y-6">
            <div className="rounded-[28px] border border-[#ddd4c8] bg-[#f7f2eb] p-4 shadow-[0_12px_30px_rgba(36,51,40,0.06)] md:p-6">
              <div className="rounded-2xl border border-[#e5ddcf] bg-white p-4 md:p-6">
                <p className="text-xs uppercase tracking-[0.18em] text-[#6b776c]">
                  Ready for planning
                </p>
                <h2 className="mt-2 font-serif text-3xl">Planner recipes</h2>
                <p className="mt-3 text-sm leading-6 text-[#667164]">
                  Add favourites from the recipes page, then use them here to
                  shape your week more easily.
                </p>

                {plannerChoices.length === 0 ? (
                  <div className="mt-5 rounded-2xl border border-[#ddd4c8] bg-[#fbfaf8] p-5">
                    <p className="text-sm font-medium text-[#243328]">
                      Nothing in your planner yet
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#667164]">
                      Go to recipes, save a few ideas you like, and add them to
                      your planner.
                    </p>

                    <Link
                      href="/recipes"
                      className="mt-4 inline-flex rounded-full bg-[#2f4635] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
                    >
                      Go to recipes
                    </Link>
                  </div>
                ) : (
                  <div className="mt-5 space-y-4">
                    {plannerChoices.map((recipe) => {
                      const isExplicitPlannerRecipe = plannerRecipes.some(
                        (item) => item.id === recipe.id,
                      );

                      return (
                        <div
                          key={recipe.id}
                          className="rounded-2xl border border-[#e7dfd3] bg-[#fbfaf8] p-4"
                        >
                          <div className="flex items-start gap-4">
                            {recipe.imageUrl ? (
                              <img
                                src={recipe.imageUrl}
                                alt={recipe.title}
                                className="h-20 w-20 rounded-2xl object-cover"
                              />
                            ) : (
                              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-[#ddd4c8] bg-white text-2xl">
                                🍽️
                              </div>
                            )}

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-base font-medium text-[#243328]">
                                  {recipe.title}
                                </h3>

                                {isExplicitPlannerRecipe && (
                                  <span className="rounded-full border border-[#ddd4c8] bg-white px-3 py-1 text-[11px] text-[#5f675c]">
                                    Added from recipes
                                  </span>
                                )}
                              </div>

                              <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#667164]">
                                {recipe.description}
                              </p>

                              {isExplicitPlannerRecipe && (
                                <div className="mt-3">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removePlannerRecipe(recipe.id)
                                    }
                                    className="text-sm text-[#5f675c] underline underline-offset-4 transition hover:text-[#243328]"
                                  >
                                    Remove from planner list
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="rounded-[28px] border border-[#ddd4c8] bg-[#f7f2eb] p-4 shadow-[0_12px_30px_rgba(36,51,40,0.06)] md:p-6">
              <div className="rounded-2xl border border-[#e5ddcf] bg-white p-4 md:p-6">
                <div className="flex flex-col gap-4 border-b border-[#ece4d8] pb-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[#6b776c]">
                      This week
                    </p>
                    <h2 className="mt-2 font-serif text-3xl">Your plan</h2>
                    <p className="mt-3 text-sm leading-6 text-[#667164]">
                      Add a meal to any day. Keep it light, flexible, and easy
                      to adjust.
                    </p>
                  </div>

                  {plannedCount > 0 && (
                    <button
                      type="button"
                      onClick={clearPlan}
                      className="text-sm text-[#5f675c] underline underline-offset-4 transition hover:text-[#243328]"
                    >
                      Clear whole plan
                    </button>
                  )}
                </div>

                <div className="mt-5 space-y-4">
                  {mealsByDay.map(({ day, meal }) => (
                    <div
                      key={day}
                      className="rounded-2xl border border-[#e7dfd3] bg-[#fbfaf8] p-4"
                    >
                      <div className="flex flex-col gap-4">
                        <div>
                          <p className="text-sm font-medium text-[#243328]">
                            {day}
                          </p>

                          {meal ? (
                            <div className="mt-3 flex items-start gap-3">
                              {meal.imageUrl ? (
                                <img
                                  src={meal.imageUrl}
                                  alt={meal.title}
                                  className="h-14 w-14 rounded-xl object-cover"
                                />
                              ) : (
                                <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-[#ddd4c8] bg-white text-lg">
                                  🍲
                                </div>
                              )}

                              <div className="min-w-0">
                                <p className="text-sm font-medium text-[#243328]">
                                  {meal.title}
                                </p>
                                <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#667164]">
                                  {meal.description}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <p className="mt-2 text-sm text-[#667164]">
                              Nothing planned yet.
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col gap-3 md:flex-row">
                          <select
                            value={selectedRecipeByDay[day] || ""}
                            onChange={(e) =>
                              setSelectedRecipeByDay((current) => ({
                                ...current,
                                [day]: e.target.value,
                              }))
                            }
                            className="w-full rounded-2xl border border-[#ddd4c8] bg-white px-4 py-3 text-sm text-[#243328] outline-none transition focus:border-[#314534]"
                          >
                            <option value="">Choose a planner recipe</option>
                            {plannerChoices.map((recipe) => (
                              <option key={recipe.id} value={recipe.id}>
                                {recipe.title}
                              </option>
                            ))}
                          </select>

                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() => addMealToDay(day)}
                              disabled={!selectedRecipeByDay[day]}
                              className="rounded-full bg-[#2f4635] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {meal ? "Update" : "Add"}
                            </button>

                            {meal && (
                              <button
                                type="button"
                                onClick={() => removeMealFromDay(day)}
                                className="rounded-full border border-[#d6cec2] bg-white px-5 py-3 text-sm font-medium text-[#243328] transition hover:bg-[#faf7f2]"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl border border-[#ddd4c8] bg-[#fbfaf8] p-4">
                  <p className="text-sm font-medium text-[#243328]">
                    Week at a glance
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#667164]">
                    {plannedCount === 0 &&
                      "No meals planned yet. Start with two or three simple dinners."}
                    {plannedCount === 1 &&
                      "1 meal planned so far. A calm start."}
                    {plannedCount > 1 &&
                      `${plannedCount} meals planned so far. Your week is taking shape nicely.`}
                  </p>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/recipes"
                    className="inline-flex justify-center rounded-full border border-[#d6cec2] bg-white px-5 py-3 text-sm font-medium text-[#243328] transition hover:bg-[#faf7f2]"
                  >
                    Browse recipes
                  </Link>

                  <button
                    type="button"
                    disabled
                    className="inline-flex cursor-not-allowed justify-center rounded-full bg-gradient-to-r from-[#334e39] to-[#5a5326] px-5 py-3 text-sm font-medium text-white opacity-60"
                  >
                    Build my weekly shop soon
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
