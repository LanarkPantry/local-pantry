"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useCart } from "../cart-context";
import RecipeCard from "../components/RecipeCard";
import { prompts, recipes, useItUpIdeas } from "./recipes-data";

export default function RecipesPage() {
  const { cart } = useCart();

  const totalItems = useMemo(() => cart.length, [cart]);

  const savouryRecipes = recipes.filter(
    (recipe) => recipe.category === "savoury",
  );
  const sweetRecipes = recipes.filter((recipe) => recipe.category === "sweet");
  const featuredRecipes = recipes.slice(0, 2);

  return (
    <main className="min-h-screen bg-[#f4efe9] text-[#243328]">
      <header className="sticky top-0 z-30 border-b border-[#e6ddd2] bg-[#f4efe9]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 md:px-10">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="text-sm tracking-[0.35em] text-[#60705f] hover:text-[#243328]"
            >
              THE LOCAL PANTRY
            </Link>

            <Link
              href="/basket"
              className="inline-flex shrink-0 rounded-full border border-[#d6cec2] bg-white px-4 py-2 text-sm text-[#243328] shadow-sm transition hover:bg-[#faf7f2]"
            >
              View basket{totalItems > 0 ? ` (${totalItems})` : ""}
            </Link>
          </div>

          <nav className="-mx-1 flex items-center gap-5 overflow-x-auto px-1 sm:gap-6">
            <Link
              href="/"
              className="shrink-0 text-sm text-[#4f5e52] hover:text-[#243328]"
            >
              Home
            </Link>

            <Link
              href="/shop"
              className="shrink-0 text-sm text-[#4f5e52] hover:text-[#243328]"
            >
              Shop
            </Link>

            <Link
              href="/recipes"
              className="shrink-0 text-sm text-[#243328] underline underline-offset-4"
            >
              Recipes
            </Link>

            <Link
              href="/basket"
              className="shrink-0 text-sm text-[#4f5e52] hover:text-[#243328]"
            >
              Basket{totalItems > 0 ? ` (${totalItems})` : ""}
            </Link>
          </nav>
        </div>
      </header>

      <section className="border-b border-[#e6ddd2] px-4 pb-8 pt-10 sm:px-6 md:px-10 md:pb-10 md:pt-12">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.22em] text-[#6b776c]">
              Simple ideas for the week
            </p>

            <h1 className="mt-3 font-serif text-3xl leading-tight tracking-tight md:text-5xl">
              Recipes to help you cook simply.
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-[#5f675c] md:text-base">
              Useful ideas built around good pantry things, flexible cooking,
              and making the most of what you already have.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 md:px-10 md:py-12">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.18em] text-[#6b776c]">
              Featured recipes
            </p>
            <h2 className="mt-2 font-serif text-2xl md:text-3xl">
              Start with something good.
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#5f675c]">
              A couple of easy starting points.
            </p>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {featuredRecipes.map((recipe) => (
              <RecipeCard key={recipe.slug} recipe={recipe} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#e6ddd2] px-4 py-10 sm:px-6 md:px-10 md:py-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#6b776c]">
                Savoury jar ideas
              </p>
              <h2 className="mt-2 font-serif text-2xl md:text-3xl">
                For supper and useful lunches.
              </h2>

              <div className="mt-5 space-y-3">
                {savouryRecipes.map((recipe) => (
                  <Link
                    key={recipe.slug}
                    href={`/recipes/${recipe.slug}`}
                    className="block rounded-[20px] border border-[#ddd4c8] bg-[#f7f2eb] p-4 transition hover:shadow-[0_12px_30px_rgba(36,51,40,0.06)]"
                  >
                    <p className="text-sm font-medium text-[#243328]">
                      {recipe.title}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#5f675c]">
                      {recipe.intro}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#6b776c]">
                Sweet jar ideas
              </p>
              <h2 className="mt-2 font-serif text-2xl md:text-3xl">
                A few sweeter things.
              </h2>

              <div className="mt-5 space-y-3">
                {sweetRecipes.map((recipe) => (
                  <Link
                    key={recipe.slug}
                    href={`/recipes/${recipe.slug}`}
                    className="block rounded-[20px] border border-[#ddd4c8] bg-[#f7f2eb] p-4 transition hover:shadow-[0_12px_30px_rgba(36,51,40,0.06)]"
                  >
                    <p className="text-sm font-medium text-[#243328]">
                      {recipe.title}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#5f675c]">
                      {recipe.intro}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#e6ddd2] px-4 py-10 sm:px-6 md:px-10 md:py-12">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.18em] text-[#6b776c]">
              Use-it-up ideas
            </p>
            <h2 className="mt-2 font-serif text-2xl md:text-3xl">
              Good ways to use what’s already there.
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#5f675c]">
              Useful, forgiving ideas for in-between meals.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {useItUpIdeas.map((idea) => (
              <div
                key={idea.title}
                className="rounded-[20px] border border-[#ddd4c8] bg-[#f7f2eb] p-5"
              >
                <h3 className="font-serif text-xl">{idea.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#5f675c]">
                  {idea.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#e6ddd2] px-4 py-10 sm:px-6 md:px-10 md:py-12">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.18em] text-[#6b776c]">
              Ingredient prompts
            </p>
            <h2 className="mt-2 font-serif text-2xl md:text-3xl">
              If you’ve got this, try this.
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#5f675c]">
              Quick prompts for things that turn up often in a weekly shop.
            </p>
          </div>

          <div className="mt-6 grid gap-3">
            {prompts.map((prompt) => (
              <div
                key={prompt.ingredient}
                className="rounded-[20px] border border-[#ddd4c8] bg-[#f7f2eb] px-4 py-4 md:px-5"
              >
                <p className="text-sm leading-6 text-[#243328] md:text-base">
                  <span className="font-medium">{prompt.ingredient}</span>
                  <span className="text-[#8a9488]"> → </span>
                  <span className="text-[#5f675c]">{prompt.idea}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
