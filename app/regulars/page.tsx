"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import SiteHeader from "../components/SiteHeader";
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

export default function RegularsPage() {
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  async function loadRegulars() {
    setLoading(true);
    setPageError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setIsLoggedIn(false);
      setSavedRecipes([]);
      setLoading(false);
      return;
    }

    setIsLoggedIn(true);

    const { data, error } = await supabase
      .from("saved_recipes")
      .select(
        "id, recipe_slug, recipe_title, recipe_image, recipe_intro, recipe_time, recipe_meal_type, recipe_dietary, created_at",
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      setPageError(error.message);
      setSavedRecipes([]);
      setLoading(false);
      return;
    }

    setSavedRecipes((data ?? []) as SavedRecipeRow[]);
    setLoading(false);
  }

  useEffect(() => {
    void loadRegulars();
  }, []);

  async function handleRemove(id: string) {
    const confirmRemove = window.confirm("Remove this meal from My Kitchen?");

    if (!confirmRemove) return;

    setRemovingId(id);
    setPageError("");

    const { error } = await supabase
      .from("saved_recipes")
      .delete()
      .eq("id", id);

    setRemovingId(null);

    if (error) {
      setPageError(error.message);
      return;
    }

    setSavedRecipes((current) => current.filter((recipe) => recipe.id !== id));
  }

  return (
    <main className="min-h-screen bg-[#f4efe9] text-[#243328]">
      <SiteHeader />
      <div className="px-4 pt-4 sm:px-6 md:hidden">
        <div className="overflow-hidden rounded-[24px] border border-[#ddd4c8] shadow-[0_10px_24px_rgba(36,51,40,0.06)]">
          <img
            src="/images/home/save-your-regulars.jpg"
            alt="Regular meals"
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
                Meals you come back to
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#5f675c] md:text-base">
                Save reliable meals from the planner, then build future weeks
                around the food you already know works.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/planner"
                  className="rounded-full bg-[#243328] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
                >
                  Build from My Kitchen
                </Link>

                <Link
                  href="/saved-weeks"
                  className="rounded-full border border-[#d6cec2] bg-white/80 px-5 py-3 text-sm text-[#243328] transition hover:bg-white"
                >
                  View Saved Weeks
                </Link>
              </div>
            </article>

            <article className="rounded-[28px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.86)] p-5 shadow-[0_10px_24px_rgba(36,51,40,0.05)] md:p-7">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
                Why it matters
              </p>

              <h2 className="mt-3 font-serif text-3xl leading-tight">
                Regular meals make planning easier.
              </h2>

              <p className="mt-4 text-sm leading-7 text-[#667164]">
                Most households repeat meals. My Kitchen turns that natural
                rhythm into a useful planning system.
              </p>
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
                Saved meals are linked to your account so they are available
                whenever you plan your week.
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

          {!loading && isLoggedIn && savedRecipes.length === 0 ? (
            <div className="rounded-[24px] border border-[#ddd4c8] bg-white/80 p-6">
              <h2 className="font-serif text-2xl text-[#243328]">
                No regulars saved yet
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#667164]">
                Open the planner, generate a week, then use Save to My Kitchen
                on meals you want to cook again.
              </p>

              <Link
                href="/planner"
                className="mt-5 inline-flex rounded-full bg-[#243328] px-5 py-2.5 text-sm text-white transition hover:opacity-90"
              >
                Open planner
              </Link>
            </div>
          ) : null}

          {savedRecipes.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {savedRecipes.map((savedRecipe) => {
                const recipe = getRecipeBySlug(savedRecipe.recipe_slug);

                const title = recipe?.title ?? savedRecipe.recipe_title;
                const image = recipe?.image ?? savedRecipe.recipe_image;
                const intro = recipe?.intro ?? savedRecipe.recipe_intro ?? "";
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

                      <h2 className="mt-2 font-serif text-2xl leading-tight text-[#243328]">
                        {title}
                      </h2>

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
                          onClick={() => handleRemove(savedRecipe.id)}
                          disabled={removingId === savedRecipe.id}
                          className="rounded-full border border-[#d6cec2] bg-white/80 px-5 py-2.5 text-sm text-[#243328] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {removingId === savedRecipe.id
                            ? "Removing..."
                            : "Remove"}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
