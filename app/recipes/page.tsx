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
  const featuredRecipes = recipes.slice(0, 4);

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

      <section className="border-b border-[#e6ddd2] px-4 pb-12 pt-14 sm:px-6 md:px-10 md:pb-16 md:pt-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.25em] text-[#6b776c]">
              Simple ideas for the week
            </p>

            <h1 className="mt-4 font-serif text-4xl leading-tight tracking-tight md:text-6xl">
              Recipes to help you cook simply and use what you have.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-[#5f675c] md:text-lg">
              A smaller, more useful recipe space built around calm weeknight
              cooking, good pantry things, and flexible ideas you can actually
              use.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 md:px-10 md:py-18">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.18em] text-[#6b776c]">
                Featured recipes
              </p>
              <h2 className="mt-3 font-serif text-3xl md:text-4xl">
                Start with something good.
              </h2>
              <p className="mt-4 leading-7 text-[#5f675c]">
                Shorter to browse, easier to click into, and less of a long
                scroll.
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-2">
            {featuredRecipes.map((recipe) => (
              <RecipeCard key={recipe.slug} recipe={recipe} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#e6ddd2] px-4 py-14 sm:px-6 md:px-10 md:py-18">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-[#6b776c]">
                Savoury jar ideas
              </p>
              <h2 className="mt-3 font-serif text-3xl md:text-4xl">
                For supper and useful lunches.
              </h2>

              <div className="mt-6 space-y-4">
                {savouryRecipes.map((recipe) => (
                  <Link
                    key={recipe.slug}
                    href={`/recipes/${recipe.slug}`}
                    className="block rounded-[24px] border border-[#ddd4c8] bg-[#f7f2eb] p-5 transition hover:shadow-[0_12px_30px_rgba(36,51,40,0.06)]"
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
              <p className="text-sm uppercase tracking-[0.18em] text-[#6b776c]">
                Sweet jar ideas
              </p>
              <h2 className="mt-3 font-serif text-3xl md:text-4xl">
                A few sweeter things.
              </h2>

              <div className="mt-6 space-y-4">
                {sweetRecipes.map((recipe) => (
                  <Link
                    key={recipe.slug}
                    href={`/recipes/${recipe.slug}`}
                    className="block rounded-[24px] border border-[#ddd4c8] bg-[#f7f2eb] p-5 transition hover:shadow-[0_12px_30px_rgba(36,51,40,0.06)]"
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

      <section className="border-t border-[#e6ddd2] px-4 py-14 sm:px-6 md:px-10 md:py-18">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.18em] text-[#6b776c]">
              Use-it-up ideas
            </p>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl">
              Good ways to use what’s already there.
            </h2>
            <p className="mt-4 leading-7 text-[#5f675c]">
              The in-between meals. Useful, forgiving, and good for reducing
              waste.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {useItUpIdeas.map((idea) => (
              <div
                key={idea.title}
                className="rounded-[24px] border border-[#ddd4c8] bg-[#f7f2eb] p-6"
              >
                <h3 className="font-serif text-2xl">{idea.title}</h3>
                <p className="mt-3 leading-7 text-[#5f675c]">{idea.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#e6ddd2] px-4 py-14 sm:px-6 md:px-10 md:py-18">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.18em] text-[#6b776c]">
              Ingredient prompts
            </p>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl">
              If you’ve got this, try this.
            </h2>
            <p className="mt-4 leading-7 text-[#5f675c]">
              Quick prompts for the things that turn up often in a weekly shop.
            </p>
          </div>

          <div className="mt-10 grid gap-4">
            {prompts.map((prompt) => (
              <div
                key={prompt.ingredient}
                className="rounded-[24px] border border-[#ddd4c8] bg-[#f7f2eb] px-5 py-5 md:px-6"
              >
                <p className="text-base leading-7 text-[#243328]">
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
