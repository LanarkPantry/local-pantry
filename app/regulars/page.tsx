"use client";

import AccountNav from "../account-nav";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "../cart-context";
import {
  getSavedRegulars,
  removeRecipeFromRegulars,
  type SavedRecipeRow,
} from "../lib/savedRegulars";
import { recipes } from "../recipes/recipes-data";

type LoadState = "loading" | "ready" | "error";

function getFullRecipe(slug: string) {
  return recipes.find((recipe) => recipe.slug === slug) ?? null;
}

export default function RegularsPage() {
  const { cart } = useCart();

  const [savedRecipes, setSavedRecipes] = useState<SavedRecipeRow[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [pageMessage, setPageMessage] = useState("");
  const [removingSlug, setRemovingSlug] = useState<string | null>(null);

  const totalItems = useMemo(() => cart.length, [cart]);

  useEffect(() => {
    async function loadRegulars() {
      const result = await getSavedRegulars();

      if (result.error) {
        setPageMessage(result.error);
        setLoadState("error");
        return;
      }

      setSavedRecipes(result.savedRecipes);
      setLoadState("ready");
    }

    void loadRegulars();
  }, []);

  async function handleRemove(recipeSlug: string) {
    setPageMessage("");
    setRemovingSlug(recipeSlug);

    const result = await removeRecipeFromRegulars(recipeSlug);

    setRemovingSlug(null);

    if (!result.success) {
      setPageMessage(result.error ?? "Could not remove this meal yet.");
      return;
    }

    setSavedRecipes((current) =>
      current.filter((recipe) => recipe.recipe_slug !== recipeSlug),
    );
    setPageMessage("Meal removed from My Regulars.");
  }

  return (
    <main className="min-h-screen bg-[#f4efe9] text-[#243328]">
      <header className="border-b border-[rgba(230,221,210,0.86)] px-4 py-5 sm:px-6 md:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between border-b border-[rgba(221,212,200,0.9)] pb-4">
          <Link href="/" className="text-sm tracking-[0.35em] text-[#60705f]">
            THE LOCAL PANTRY
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/shop" className="text-sm text-[#5f675c]">
              Shop
            </Link>

            <Link href="/planner" className="text-sm text-[#5f675c]">
              Planner
            </Link>

            <Link href="/basket" className="text-sm text-[#243328]">
              Basket{totalItems > 0 ? ` (${totalItems})` : ""}
            </Link>

            <AccountNav />
          </div>
        </div>
      </header>

      <section className="px-4 py-8 sm:px-6 md:px-10 md:py-12">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-[28px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.84)] p-5 shadow-[0_12px_30px_rgba(36,51,40,0.06)] md:p-7">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#6b776c]">
              Saved meals
            </p>

            <h1 className="mt-3 max-w-3xl font-serif text-[2rem] leading-[1.02] tracking-tight text-[#243328] md:text-[3.35rem]">
              My Regulars
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#5f675c] md:text-base">
              Save the meals you actually cook again. This will become the base
              for faster weeks, repeat favourites and smarter personal planning.
            </p>

            {pageMessage ? (
              <div className="mt-5 rounded-[18px] border border-[#d8cbbd] bg-white/78 px-4 py-3 text-sm text-[#4f5e52]">
                {pageMessage}
              </div>
            ) : null}

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/planner"
                className="rounded-full bg-[#243328] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
              >
                Back to planner
              </Link>

              <Link
                href="/recipes"
                className="rounded-full border border-[#d6cec2] bg-white/80 px-5 py-3 text-sm text-[#243328] transition hover:bg-white"
              >
                Browse recipes
              </Link>
            </div>
          </div>

          {loadState === "loading" ? (
            <div className="mt-8 rounded-[24px] border border-[#ddd4c8] bg-white/80 p-6 text-sm text-[#667164]">
              Loading your regulars...
            </div>
          ) : null}

          {loadState !== "loading" && savedRecipes.length === 0 ? (
            <div className="mt-8 rounded-[24px] border border-[#ddd4c8] bg-white/80 p-6 text-sm leading-6 text-[#667164]">
              No regular meals saved yet. Open the planner and use “Save to My
              Regulars” on any meal you want to cook again.
            </div>
          ) : null}

          {savedRecipes.length > 0 ? (
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {savedRecipes.map((savedRecipe) => {
                const fullRecipe = getFullRecipe(savedRecipe.recipe_slug);
                const title = fullRecipe?.title ?? savedRecipe.recipe_title;
                const intro = fullRecipe?.intro ?? savedRecipe.recipe_intro;
                const image = fullRecipe?.image ?? savedRecipe.recipe_image;
                const time = fullRecipe?.time ?? savedRecipe.recipe_time;
                const mealType =
                  fullRecipe?.mealType ?? savedRecipe.recipe_meal_type;
                const dietary =
                  fullRecipe?.dietary ?? savedRecipe.recipe_dietary ?? [];

                return (
                  <article
                    key={savedRecipe.id}
                    className="overflow-hidden rounded-[26px] border border-[rgba(221,212,200,0.95)] bg-[rgba(255,255,255,0.86)] shadow-[0_10px_24px_rgba(36,51,40,0.05)]"
                  >
                    {image ? (
                      <img
                        src={image}
                        alt={title}
                        className="h-56 w-full object-cover"
                      />
                    ) : null}

                    <div className="p-5 md:p-6">
                      <div className="flex flex-wrap gap-2">
                        {time ? (
                          <span className="rounded-full border border-[#ddd4c8] bg-[rgba(247,242,235,0.82)] px-3 py-1.5 text-xs font-medium text-[#4f5e52]">
                            {time}
                          </span>
                        ) : null}

                        {mealType ? (
                          <span className="rounded-full border border-[#ddd4c8] bg-[rgba(247,242,235,0.82)] px-3 py-1.5 text-xs font-medium text-[#4f5e52]">
                            {mealType.replace("-", " ")}
                          </span>
                        ) : null}
                      </div>

                      <h2 className="mt-4 font-serif text-[1.55rem] leading-tight text-[#243328]">
                        {title}
                      </h2>

                      {intro ? (
                        <p className="mt-3 text-sm leading-6 text-[#667164]">
                          {intro}
                        </p>
                      ) : null}

                      {dietary.length > 0 ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {dietary.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-[#f4efe9] px-3 py-1 text-xs text-[#5f675c]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : null}

                      <div className="mt-5 flex flex-wrap gap-3">
                        {fullRecipe ? (
                          <Link
                            href={`/recipes/${fullRecipe.slug}`}
                            className="rounded-full bg-[#243328] px-4 py-2 text-sm text-white transition hover:opacity-90"
                          >
                            View recipe
                          </Link>
                        ) : null}

                        <button
                          type="button"
                          onClick={() => handleRemove(savedRecipe.recipe_slug)}
                          disabled={removingSlug === savedRecipe.recipe_slug}
                          className="rounded-full border border-[#d6cec2] bg-white/80 px-4 py-2 text-sm text-[#243328] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {removingSlug === savedRecipe.recipe_slug
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
