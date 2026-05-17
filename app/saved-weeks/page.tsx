"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { recipes } from "../recipes/recipes-data";
import SiteHeader from "../components/SiteHeader";

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
      return "My Regulars";
    default:
      return "Saved week";
  }
}

export default function SavedWeeksPage() {
  const [savedWeeks, setSavedWeeks] = useState<SavedWeekRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [deletingWeekId, setDeletingWeekId] = useState<string | null>(null);

  async function loadSavedWeeks() {
    setLoading(true);
    setPageError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setIsLoggedIn(false);
      setSavedWeeks([]);
      setLoading(false);
      return;
    }

    setIsLoggedIn(true);

    const { data, error } = await supabase
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
      .order("created_at", { ascending: false });

    if (error) {
      setPageError(error.message);
      setSavedWeeks([]);
      setLoading(false);
      return;
    }

    const weeks = (data ?? []).map((week) => ({
      ...week,
      saved_week_meals: [...(week.saved_week_meals ?? [])].sort(
        (a, b) => a.position - b.position,
      ),
    })) as SavedWeekRow[];

    setSavedWeeks(weeks);
    setLoading(false);
  }

  useEffect(() => {
    void loadSavedWeeks();
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

    if (!confirmDelete) {
      return;
    }

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

  return (
    <main className="min-h-screen bg-[#f4efe9] text-[#243328]">
      <SiteHeader />

      <section className="border-b border-[rgba(230,221,210,0.86)] px-4 pb-6 pt-5 sm:px-6 md:px-10 md:pb-8 md:pt-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
            <article className="rounded-[28px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.84)] p-5 shadow-[0_12px_30px_rgba(36,51,40,0.06)] md:p-7">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#6b776c]">
                Saved weeks
              </p>

              <h1 className="mt-3 max-w-3xl font-serif text-[2rem] leading-[1.02] tracking-tight text-[#243328] md:text-[3.35rem]">
                Your saved food weeks
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#5f675c] md:text-base">
                Save useful weekly plans, repeat them later, and build a library
                of weeks that work for real life.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/planner"
                  className="rounded-full bg-[#243328] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
                >
                  Build a new week
                </Link>

                <Link
                  href="/regulars"
                  className="rounded-full border border-[#d6cec2] bg-white/80 px-5 py-3 text-sm text-[#243328] transition hover:bg-white"
                >
                  View My Regulars
                </Link>
              </div>
            </article>

            <article className="rounded-[28px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.86)] p-5 shadow-[0_10px_24px_rgba(36,51,40,0.05)] md:p-7">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
                Why save weeks?
              </p>

              <h2 className="mt-3 font-serif text-3xl leading-tight">
                Meals are useful. Whole weeks are powerful.
              </h2>

              <p className="mt-4 text-sm leading-7 text-[#667164]">
                Saved weeks let you repeat patterns that already worked: busy
                weeks, budget weeks, veg-heavy weeks, family favourites and
                lower-waste plans.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 md:px-10 md:py-10">
        <div className="mx-auto max-w-7xl">
          {loading ? (
            <div className="rounded-[24px] border border-[#ddd4c8] bg-white/80 p-6 text-sm text-[#667164]">
              Loading saved weeks...
            </div>
          ) : null}

          {!loading && !isLoggedIn ? (
            <div className="rounded-[24px] border border-[#ddd4c8] bg-white/80 p-6">
              <h2 className="font-serif text-2xl text-[#243328]">
                Sign in to view saved weeks
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#667164]">
                Saved weeks are linked to your account so you can come back to
                them later.
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

          {!loading && isLoggedIn && savedWeeks.length === 0 ? (
            <div className="rounded-[24px] border border-[#ddd4c8] bg-white/80 p-6">
              <h2 className="font-serif text-2xl text-[#243328]">
                No saved weeks yet
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#667164]">
                Build a week in the planner, then use Save this week. Your saved
                weeks will appear here.
              </p>

              <Link
                href="/planner"
                className="mt-5 inline-flex rounded-full bg-[#243328] px-5 py-2.5 text-sm text-white transition hover:opacity-90"
              >
                Open planner
              </Link>
            </div>
          ) : null}

          {savedWeeks.length > 0 ? (
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

                        <h2 className="mt-2 font-serif text-2xl leading-tight text-[#243328]">
                          {week.name}
                        </h2>

                        <p className="mt-2 text-sm text-[#667164]">
                          Saved {formatDate(week.created_at)} · {week.nights}{" "}
                          night{week.nights === 1 ? "" : "s"}
                        </p>
                      </div>

                      <div className="rounded-full border border-[#d6cec2] bg-[#f7f2eb] px-4 py-2 text-sm text-[#4f5e52]">
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
                        {deletingWeekId === week.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>

                  <div className="divide-y divide-[#eee5da]">
                    {week.saved_week_meals.map((meal) => {
                      const image = getRecipeImage(meal.recipe_slug);
                      const intro = getRecipeIntro(meal.recipe_slug);

                      return (
                        <div key={meal.id} className="flex gap-4 p-4 md:p-5">
                          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-[18px] border border-[#e4dbcf] bg-[#f7f2eb]">
                            {image ? (
                              <img
                                src={image}
                                alt={getRecipeTitle(meal.recipe_slug)}
                                className="h-full w-full object-cover"
                              />
                            ) : null}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] uppercase tracking-[0.14em] text-[#6b776c]">
                              {meal.day_label}
                            </p>

                            <h3 className="mt-1 font-serif text-xl leading-tight text-[#243328]">
                              {getRecipeTitle(meal.recipe_slug)}
                            </h3>

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
          ) : null}
        </div>
      </section>
    </main>
  );
}
