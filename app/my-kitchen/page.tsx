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

const EMPTY_STATE_RECIPE_SLUGS = [
  "harissa-butterbeans-peppers-couscous",
  "bucatini-courgette-pesto",
  "gochujang-broccoli-rice-bowls",
] as const;

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
    case "my-kitchen":
      return "My Kitchen";
    case "my-regulars":
      return "Regular meals";
    default:
      return "Saved week";
  }
}

function EmptyRecipeInspiration() {
  const featuredRecipes = EMPTY_STATE_RECIPE_SLUGS.flatMap((slug) => {
    const recipe = getRecipeBySlug(slug);

    return recipe ? [recipe] : [];
  });

  if (featuredRecipes.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <p className="text-sm font-medium text-[#243328]">
        Start by saving meals like these:
      </p>

      <div className="mt-4 flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
        {featuredRecipes.map((recipe) => (
          <article
            key={recipe.slug}
            className="min-w-[240px] overflow-hidden rounded-[24px] border border-[#ddd4c8] bg-white shadow-[0_10px_24px_rgba(36,51,40,0.06)]"
          >
            <img
              src={recipe.image}
              alt={recipe.title}
              className="h-40 w-full object-cover"
            />

            <div className="p-4">
              <h3 className="font-serif text-xl leading-tight text-[#243328]">
                {recipe.title}
              </h3>

              <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#667164]">
                {recipe.intro}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default function MyKitchenPage() {
  const [savedWeeks, setSavedWeeks] = useState<SavedWeekRow[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
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
      setIsAdmin(false);
      setSavedWeeks([]);
      setSavedRecipes([]);
      setLoading(false);
      return;
    }

    setIsLoggedIn(true);
    setIsAdmin(user.email?.toLowerCase() === "ainsleykingyoga@gmail.com");
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

    const weeks = ((weeksResult.data ?? []) as unknown as SavedWeekRow[]).map(
      (week) => ({
        ...week,
        saved_week_meals: [...(week.saved_week_meals ?? [])].sort(
          (a, b) => a.position - b.position,
        ),
      }),
    );

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

    setSavedRecipes((current) => current.filter((recipe) => recipe.id !== id));
  }

  const hasSavedWeeks = savedWeeks.length > 0;
  const hasFavouriteMeals = savedRecipes.length > 0;
  const hasKitchenItems = hasSavedWeeks || hasFavouriteMeals;

  return (
    <main className="min-h-screen bg-[#f4efe9] text-[#243328]">
      <SiteHeader />

      <section className="px-4 pb-8 pt-4 sm:px-6 md:px-10 md:pb-10 md:pt-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
            <article className="order-2 rounded-[32px] border border-[#ddd4c8] bg-[rgba(247,242,235,0.9)] p-5 shadow-[0_14px_34px_rgba(36,51,40,0.07)] md:p-8 lg:order-1">
              {" "}
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#6b776c]">
                My Kitchen
              </p>
              <h1 className="mt-3 max-w-3xl font-serif text-[2.45rem] leading-[1.02] tracking-tight text-[#243328] md:text-[4rem]">
                Your favourite dinners, saved.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#5f675c] md:text-base">
                Keep the meals you love, save useful weekly plans, and make
                future food weeks easier to build.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/planner"
                  className="rounded-full bg-[#243328] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
                >
                  Plan a week
                </Link>

                <Link
                  href="/shop"
                  className="rounded-full border border-[#d6cec2] bg-white/80 px-5 py-3 text-sm text-[#243328] transition hover:bg-white"
                >
                  Shop food
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin/orders"
                    className="rounded-full bg-[#8b5e3c] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
                  >
                    Orders Dashboard
                  </Link>
                )}
              </div>
            </article>
            <aside className="order-1 overflow-hidden rounded-[32px] border border-[#ddd4c8] bg-white shadow-[0_14px_34px_rgba(36,51,40,0.07)] lg:order-2">
              {" "}
              <img
                src="/images/home/build-your-basket.jpg"
                alt="Fresh food and weekly planning"
                className="h-auto w-full object-contain md:h-72 md:object-cover lg:h-full"
              />
            </aside>
          </div>
        </div>
      </section>

      <section className="px-4 pb-10 sm:px-6 md:px-10 md:pb-14">
        <div className="mx-auto max-w-7xl">
          {loading ? (
            <div className="rounded-[24px] border border-[#ddd4c8] bg-white/80 p-6 text-sm text-[#667164]">
              Loading My Kitchen...
            </div>
          ) : null}

          {!loading && !isLoggedIn ? (
            <div className="rounded-[28px] border border-[#ddd4c8] bg-white/86 p-6 shadow-[0_10px_24px_rgba(36,51,40,0.04)] md:p-8">
              <h2 className="font-serif text-3xl text-[#243328]">
                Save your favourite dinners.
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#667164]">
                Create a free account or sign in to save favourite meals, full
                weeks and regular dinners.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/login"
                  className="inline-flex rounded-full bg-[#243328] px-5 py-2.5 text-sm text-white transition hover:opacity-90"
                >
                  Create account or sign in
                </Link>

                <Link
                  href="/planner"
                  className="inline-flex rounded-full border border-[#d6cec2] bg-[#f7f2eb] px-5 py-2.5 text-sm text-[#243328] transition hover:bg-white"
                >
                  Try the planner
                </Link>
              </div>

              <EmptyRecipeInspiration />
            </div>
          ) : null}

          {pageError ? (
            <div className="mb-6 rounded-[24px] border border-[#e4d8cb] bg-[#fbf6f0] p-6 text-sm text-[#6a5c4f]">
              {pageError}
            </div>
          ) : null}

          {!loading && isLoggedIn && !hasKitchenItems ? (
            <div className="rounded-[28px] border border-[#ddd4c8] bg-white/86 p-6 shadow-[0_10px_24px_rgba(36,51,40,0.04)] md:p-8">
              <h2 className="font-serif text-3xl text-[#243328]">
                Your kitchen is empty for now.
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#667164]">
                Build a week in the planner, then save the dinners and weekly
                plans you want to come back to.
              </p>

              <Link
                href="/planner"
                className="mt-5 inline-flex rounded-full bg-[#243328] px-5 py-2.5 text-sm text-white transition hover:opacity-90"
              >
                Open planner
              </Link>

              <EmptyRecipeInspiration />
            </div>
          ) : null}

          {!loading && isLoggedIn && hasKitchenItems ? (
            <div className="space-y-12">
              <section>
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-[#6b776c]">
                      Favourite meals
                    </p>

                    <h2 className="mt-2 font-serif text-3xl leading-tight text-[#243328] md:text-4xl">
                      Meals you want again
                    </h2>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[#667164]">
                      Reliable dinners saved from the planner, ready to use in
                      future weeks.
                    </p>
                  </div>

                  <Link
                    href="/planner"
                    className="inline-flex w-fit rounded-full border border-[#d6cec2] bg-white/80 px-5 py-2.5 text-sm text-[#243328] transition hover:bg-white"
                  >
                    Find more meals
                  </Link>
                </div>

                {hasFavouriteMeals ? (
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

                              {dietary.slice(0, 2).map((tag) => (
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
                  <div className="rounded-[28px] border border-[#ddd4c8] bg-white/86 p-6 md:p-8">
                    <h3 className="font-serif text-2xl text-[#243328]">
                      No favourite meals saved yet.
                    </h3>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-[#667164]">
                      Open the planner, generate a week, then save the dinners
                      you want to cook again.
                    </p>

                    <Link
                      href="/planner"
                      className="mt-5 inline-flex rounded-full bg-[#243328] px-5 py-2.5 text-sm text-white transition hover:opacity-90"
                    >
                      Open planner
                    </Link>

                    <EmptyRecipeInspiration />
                  </div>
                )}
              </section>

              <section>
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-[#6b776c]">
                      Saved weeks
                    </p>

                    <h2 className="mt-2 font-serif text-3xl leading-tight text-[#243328] md:text-4xl">
                      Weeks worth repeating
                    </h2>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[#667164]">
                      Load a saved plan back into the planner when you want an
                      easier food week.
                    </p>
                  </div>

                  <Link
                    href="/planner"
                    className="inline-flex w-fit rounded-full border border-[#d6cec2] bg-white/80 px-5 py-2.5 text-sm text-[#243328] transition hover:bg-white"
                  >
                    Plan another week
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
                  <div className="rounded-[28px] border border-[#ddd4c8] bg-white/86 p-6 md:p-8">
                    <h3 className="font-serif text-2xl text-[#243328]">
                      No saved weeks yet.
                    </h3>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-[#667164]">
                      Build a week in the planner, then save the full plan. Your
                      saved weeks will appear here.
                    </p>

                    <Link
                      href="/planner"
                      className="mt-5 inline-flex rounded-full bg-[#243328] px-5 py-2.5 text-sm text-white transition hover:opacity-90"
                    >
                      Plan a week
                    </Link>
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
