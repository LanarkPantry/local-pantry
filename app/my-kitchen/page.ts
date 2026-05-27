"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { supabase } from "../lib/supabaseClient";
import { recipes } from "../recipes/recipes-data";

type SavedRecipeRow = {
  id: string;
  recipe_slug: string;
  recipe_title: string;
  recipe_image: string | null;
  recipe_intro: string | null;
  recipe_time: string | null;
  recipe_meal_type: string | null;
  recipe_dietary: string[] | null;
  created_at: string;
};

type SavedWeekMealRow = {
  id: string;
  day_label: string;
  recipe_slug: string;
  position: number;
};

type SavedWeekRow = {
  id: string;
  name: string;
  planner_style: string | null;
  nights: number;
  created_at: string;
  saved_week_meals: SavedWeekMealRow[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getRecipeBySlug(slug: string) {
  return recipes.find((recipe) => recipe.slug === slug) ?? null;
}

function getRecipeTitle(slug: string) {
  return recipes.find((recipe) => recipe.slug === slug)?.title ?? slug;
}

function getRecipeImage(slug: string) {
  return recipes.find((recipe) => recipe.slug === slug)?.image ?? null;
}

function getRecipeIntro(slug: string) {
  return recipes.find((recipe) => recipe.slug === slug)?.intro ?? "";
}

function getPlannerStyleLabel(style: string | null) {
  switch (style) {
    case "mixed":
      return "Mixed week";
    case "mostly-veggie":
      return "Mostly veggie";
    case "vegan":
      return "Vegan";
    case "gluten-free":
      return "Gluten-free";
    case "quick":
      return "Quick dinners";
    case "my-regulars":
      return "Regular meals";
    default:
      return "Saved week";
  }
}

export default function MyKitchenPage() {
  const [savedWeeks, setSavedWeeks] = useState<SavedWeekRow[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [deletingWeekId, setDeletingWeekId] = useState<string | null>(null);
  const [removingRecipeId, setRemovingRecipeId] = useState<string | null>(null);

  async function loadMyKitchen() {
    setLoading(true);
    setPageError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setIsLoggedIn(false);
      setSavedWeeks([]);
      setSavedRecipes([]);
      setLoading(false);
      return;
    }

    setIsLoggedIn(true);

    const [weeksResult, recipesResult] = await Promise.all([
      supabase
        .from("saved_weeks")
        .select(
          `
          id,
          name,
          planner_style,
          nights,
          created_at,
          saved_week_meals (
            id,
            day_label,
            recipe_slug,
            position
          )
        `,
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),

      supabase
        .from("saved_recipes")
        .select(
          "id, recipe_slug, recipe_title, recipe_image, recipe_intro, recipe_time, recipe_meal_type, recipe_dietary, created_at",
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
    ]);

    if (weeksResult.error) {
      setPageError(weeksResult.error.message);
      setSavedWeeks([]);
      setSavedRecipes([]);
      setLoading(false);
      return;
    }

    if (recipesResult.error) {
      setPageError(recipesResult.error.message);
      setSavedWeeks([]);
      setSavedRecipes([]);
      setLoading(false);
      return;
    }

    const weeks = (weeksResult.data ?? []).map((week) => ({
      ...week,
      saved_week_meals: [...(week.saved_week_meals ?? [])].sort(
        (a, b) => a.position - b.position,
      ),
    })) as SavedWeekRow[];

    setSavedWeeks(weeks);
    setSavedRecipes((recipesResult.data ?? []) as SavedRecipeRow[]);
    setLoading(false);
  }

  useEffect(() => {
    void loadMyKitchen();
  }, []);

  function handleLoadWeek(week: SavedWeekRow) {
    window.localStorage.setItem(
      "local-pantry-loaded-week",
      JSON.stringify({
        id: week.id,
        name: week.name,
        meals: week.saved_week_meals.map((meal) => ({
          day: meal.day_label,
          recipeSlug: meal.recipe_slug,
          position: meal.position,
        })),
      }),
    );

    window.location.href = "/planner";
  }

  async function handleDeleteWeek(weekId: string) {
    const confirmDelete = window.confirm(
      "Delete this saved week? This cannot be undone.",
    );

    if (!confirmDelete) return;

    setDeletingWeekId(weekId);
    setPageError("");

    const { error } = await supabase
      .from("saved_weeks")
      .delete()
      .eq("id", weekId);

    setDeletingWeekId(null);

    if (error) {
      setPageError(error.message);
      return;
    }

    setSavedWeeks((current) => current.filter((week) => week.id !== weekId));
  }

  async function handleRemoveRegular(id: string) {
    const confirmRemove = window.confirm("Remove this meal from My Kitchen?");

    if (!confirmRemove) return;

    setRemovingRecipeId(id);
    setPageError("");

    const { error } = await supabase
      .from("saved_recipes")
      .delete()
      .eq("id", id);

    setRemovingRecipeId(null);

    if (error) {
      setPageError(error.message);
      return;
    }

    setSavedRecipes((current) =>
      current.filter((recipe) => recipe.id !== id),
    );
  }

  const hasSavedWeeks = savedWeeks.length > 0;
  const hasRegularMeals = savedRecipes.length > 0;
  const hasKitchenItems = hasSavedWeeks || hasRegularMeals;

  return (
    <main className="min-h-screen bg-[#f4efe9] text-[#243328]">
      <SiteHeader />

      <div className="px-4 pt-4 sm:px-6 md:hidden">
        <div className="overflow-hidden rounded-[24px] border border-[#ddd4c8] shadow-[0_10px_24px_rgba(36,51,40,0.06)]">
          <img
            src="/images/home/build-your-basket.jpg"
            alt="Fresh food and weekly planning"
            className="h-44 w-full object-cover"
          />
        </div>
      </div>

      <section className="border-b border-[rgba(230,221,210,0.86)] px-4 pb-6 pt-5 sm:px-6 md:px-10 md:pb-8 md:pt-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
            <article className="rounded-[28px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.84)] p-5 shadow-[0_12px_30px_rgba(36,51,40,0.06)] md:p-7">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#6b776c]">
                My Kitchen
              </p>

              <h1 className="mt-3 max-w-3xl font-serif text-[2rem] leading-[1.02] tracking-tight text-[#243328] md:text-[3.35rem]">
                Saved meals and food weeks that work
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#5f675c] md:text-base">
                Keep the meals you come back to, save full weekly plans, and
                make future ordering easier.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/planner"
                  className="rounded-full bg-[#243328] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
                >
                  Build a new week
                </Link>

                <Link
                  href="/shop"
                  className="rounded-full border border-[#d6cec2] bg-white/80 px-5 py-3 text-sm text-[#243328] transition hover:bg-white"
                >
                  Shop food
                </Link>
              </div>
            </article>

            <article className="rounded-[28px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.86)] p-5 shadow-[0_10px_24px_rgba(36,51,40,0.05)] md:p-7">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
                Why it helps
              </p>

              <h2 className="mt-3 font-serif text-3xl leading-tight">
                Less starting from scratch.
              </h2>

              <p className="mt-4 text-sm leading-7 text-[#667164]">
                Most households repeat patterns. My Kitchen keeps those useful
                meals and weeks in one place, so planning becomes quicker each
                time.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[22px] border border-[#ddd4c8] bg-white/70 p-4">
                  <p className="font-serif text-xl text-[#243328]">
                    Saved weeks
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#667164]">
                    Repeat a full plan that already worked.
                  </p>
                </div>

                <div className="rounded-[22px] border border-[#ddd4c8] bg-white/70 p-4">
                  <p className="font-serif text-xl text-[#243328]">
                    Regular meals
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#667164]">
                    Keep reliable dinners close by.
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 md:px-10 md:py-10">
        <div className="mx-auto max-w-7xl">
          {loading ? (
            <div className="rounded-[24px] border border-[#ddd4c8] bg-white/80 p-6 text-sm text-[#667164]">
              Loading My Kitchen...
            </div>
          ) : null}

          {!loading && !isLoggedIn ? (
            <div className="rounded-[24px] border border-[#ddd4c8] bg-white/80 p-6">
              <h2 className="font-serif text-2xl text-[#243328]">
                Sign in to view My Kitchen
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#667164]">
                Saved meals and weeks are linked to your account so you can come
                back to them later.
              </p>

              <Link
                href="/login"
                className="mt-5 inline-flex rounded-full bg-[#243328] px-5 py-2.5 text-sm text-white transition hover:opacity-90"
              >
                Sign in
              </Link>
            </div>
          ) : null}

          {pageError ? (
            <div className="mb-6 rounded-[24px] border border-[#e4d8cb] bg-[#fbf6f0] p-6 text-sm text-[#6a5c4f]">
              {pageError}
            </div>
          ) : null}

          {!loading && isLoggedIn && !hasKitchenItems ? (
            <div className="rounded-[24px] border border-[#ddd4c8] bg-white/80 p-6">
              <h2 className="font-serif text-2xl text-[#243328]">
                Nothing saved yet
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#667164]">
                Build a week in the planner, save useful weeks, or save regular
                meals you want to cook again.
              </p>

              <Link
                href="/planner"
                className="mt-5 inline-flex rounded-full bg-[#243328] px-5 py-2.5 text-sm text-white transition hover:opacity-90"
              >
                Open planner
              </Link>
            </div>
          ) : null}

          {!loading && isLoggedIn && hasKitchenItems ? (
            <div className="space-y-10">
              <section>
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-[#6b776c]">
                      Saved weeks
                    </p>

                    <h2 className="mt-2 font-serif text-3xl leading-tight text-[#243328] md:text-4xl">
                      Full weeks to repeat
                    </h2>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[#667164]">
                      These are your most useful weekly plans. Load one back
                      into the planner when you want an easier week.
                    </p>
                  </div>

                  <Link
                    href="/planner"
                    className="inline-flex w-fit rounded-full border border-[#d6cec2] bg-white/80 px-5 py-2.5 text-sm text-[#243328] transition hover:bg-white"
                  >
                    Build new week
                  </Link>
                </div>

                {hasSavedWeeks ? (
                  <div className="grid gap-5 lg:grid-cols-2">
                    {savedWeeks.map((week) => (
                      <article
                        key={week.id}
                        className="overflow-hidden rounded-[28px] border border-[#ddd4c8] bg-white/86 shadow-[0_10px_24px_rgba(36,51,40,0.05)]"
                      >
                        <div className="border-b border-[#eee5da] p-5 md:p-6">
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
                                {getPlannerStyleLabel(week.planner_style)}
                              </p>

                              <h3 className="mt-2 font-serif text-2xl leading-tight text-[#243328]">
                                {week.name}
                              </h3>

                              <p className="mt-2 text-sm text-[#667164]">
                                Saved {formatDate(week.created_at)} ·{" "}
                                {week.nights} night
                                {week.nights === 1 ? "" : "s"}
                              </p>
                            </div>

                            <div className="w-fit rounded-full border border-[#d6cec2] bg-[#f7f2eb] px-4 py-2 text-sm text-[#4f5e52]">
                              {week.saved_week_meals.length} meal
                              {week.saved_week_meals.length === 1 ? "" : "s"}
                            </div>
                          </div>

                          <div className="mt-5 flex flex-wrap gap-3">
                            <button
                              type="button"
                              onClick={() => handleLoadWeek(week)}
                              className="rounded-full bg-[#243328] px-5 py-2.5 text-sm text-white transition hover:opacity-90"
                            >
                              Load into planner
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteWeek(week.id)}
                              disabled={deletingWeekId === week.id}
                              className="rounded-full border border-[#d6cec2] bg-white/80 px-5 py-2.5 text-sm text-[#243328] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {deletingWeekId === week.id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </div>
                        </div>

                        <div className="divide-y divide-[#eee5da]">
                          {week.saved_week_meals.map((meal) => {
                            const image = getRecipeImage(meal.recipe_slug);
                            const intro = getRecipeIntro(meal.recipe_slug);
                            const title = getRecipeTitle(meal.recipe_slug);

                            return (
                              <div
                                key={meal.id}
                                className="flex gap-4 p-4 md:p-5"
                              >
                                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-[18px] border border-[#e4dbcf] bg-[#f7f2eb]">
                                  {image ? (
                                    <img
                                      src={image}
                                      alt={title}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : null}
                                </div>

                                <div className="min-w-0 flex-1">
                                  <p className="text-[11px] uppercase tracking-[0.14em] text-[#6b776c]">
                                    {meal.day_label}
                                  </p>

                                  <h4 className="mt-1 font-serif text-xl leading-tight text-[#243328]">
                                    {title}
                                  </h4>

                                  {intro ? (
                                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#667164]">
                                      {intro}
                                    </p>
                                  ) : null}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-[24px] border border-[#ddd4c8] bg-white/80 p-6">
                    <h3 className="font-serif text-2xl text-[#243328]">
                      No saved weeks yet
                    </h3>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-[#667164]">
                      Build a week in the planner, then use Save this week. Your
                      saved weeks will appear here.
                    </p>
                  </div>
                )}
              </section>

              <section>
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-[#6b776c]">
                      Regular meals
                    </p>

                    <h2 className="mt-2 font-serif text-3xl leading-tight text-[#243328] md:text-4xl">
                      Meals you come back to
                    </h2>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[#667164]">
                      Reliable meals saved from the planner. Use them as anchors
                      for future weeks.
                    </p>
                  </div>

                  <Link
                    href="/planner"
                    className="inline-flex w-fit rounded-full border border-[#d6cec2] bg-white/80 px-5 py-2.5 text-sm text-[#243328] transition hover:bg-white"
                  >
                    Open planner
                  </Link>
                </div>

                {hasRegularMeals ? (
                  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {savedRecipes.map((savedRecipe) => {
                      const recipe = getRecipeBySlug(savedRecipe.recipe_slug);

                      const title = recipe?.title ?? savedRecipe.recipe_title;
                      const image = recipe?.image ?? savedRecipe.recipe_image;
                      const intro =
                        recipe?.intro ?? savedRecipe.recipe_intro ?? "";
                      const time = recipe?.time ?? savedRecipe.recipe_time;
                      const mealType =
                        recipe?.mealType ?? savedRecipe.recipe_meal_type;
                      const dietary =
                        recipe?.dietary ?? savedRecipe.recipe_dietary ?? [];

                      return (
                        <article
                          key={savedRecipe.id}
                          className="overflow-hidden rounded-[28px] border border-[#ddd4c8] bg-white/86 shadow-[0_10px_24px_rgba(36,51,40,0.05)]"
                        >
                          <div className="h-52 overflow-hidden bg-[#f7f2eb]">
                            {image ? (
                              <img
                                src={image}
                                alt={title}
                                className="h-full w-full object-cover"
                              />
                            ) : null}
                          </div>

                          <div className="p-5 md:p-6">
                            <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
                              Saved {formatDate(savedRecipe.created_at)}
                            </p>

                            <h3 className="mt-2 font-serif text-2xl leading-tight text-[#243328]">
                              {title}
                            </h3>

                            {intro ? (
                              <p className="mt-3 text-sm leading-6 text-[#667164]">
                                {intro}
                              </p>
                            ) : null}

                            <div className="mt-4 flex flex-wrap gap-2">
                              {time ? (
                                <span className="rounded-full border border-[#ddd4c8] bg-[#f7f2eb] px-3 py-1.5 text-xs text-[#4f5e52]">
                                  {time}
                                </span>
                              ) : null}

                              {mealType ? (
                                <span className="rounded-full border border-[#ddd4c8] bg-[#f7f2eb] px-3 py-1.5 text-xs text-[#4f5e52]">
                                  {mealType.replace("-", " ")}
                                </span>
                              ) : null}

                              {dietary.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-full border border-[#ddd4c8] bg-[#f7f2eb] px-3 py-1.5 text-xs text-[#4f5e52]"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>

                            <div className="mt-5 flex flex-wrap gap-3">
                              <Link
                                href="/planner"
                                className="rounded-full bg-[#243328] px-5 py-2.5 text-sm text-white transition hover:opacity-90"
                              >
                                Use in planner
                              </Link>

                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveRegular(savedRecipe.id)
                                }
                                disabled={removingRecipeId === savedRecipe.id}
                                className="rounded-full border border-[#d6cec2] bg-white/80 px-5 py-2.5 text-sm text-[#243328] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {removingRecipeId === savedRecipe.id
                                  ? "Removing..."
                                  : "Remove"}
                              </button>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-[24px] border border-[#ddd4c8] bg-white/80 p-6">
                    <h3 className="font-serif text-2xl text-[#243328]">
                      No regular meals saved yet
                    </h3>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-[#667164]">
                      Open the planner, generate a week, then save the meals you
                      want to cook again.
                    </p>
                  </div>
                )}
              </section>
            </div>
          ) : null}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
