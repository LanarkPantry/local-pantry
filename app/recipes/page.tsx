"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { useCart } from "../cart-context";
import RecipeCard from "../components/RecipeCard";
import { prompts, recipes, useItUpIdeas } from "./recipes-data";

type GeneratedRecipe = {
  title: string;
  description: string;
  ingredientsUsed: string[];
  pantryStaples: string[];
  steps: string[];
};

export default function RecipesPage() {
  const { cart } = useCart();

  const totalItems = useMemo(() => cart.length, [cart]);

  const basketIngredients = useMemo(() => {
    return Array.from(new Set(cart.map((item) => item.name)));
  }, [cart]);

  const recipeSectionRef = useRef<HTMLDivElement | null>(null);

  const [generatedRecipe, setGeneratedRecipe] =
    useState<GeneratedRecipe | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(
    null,
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState("");

  const savouryRecipes = recipes.filter(
    (recipe) => recipe.category === "savoury",
  );
  const sweetRecipes = recipes.filter((recipe) => recipe.category === "sweet");
  const featuredRecipes = recipes.slice(0, 2);

  async function handleGenerateRecipe() {
    if (basketIngredients.length === 0) {
      setAiError(
        "Your basket is empty. Add a few items first, then try again.",
      );
      setGeneratedRecipe(null);
      setGeneratedImageUrl(null);
      return;
    }

    recipeSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    try {
      setIsGenerating(true);
      setAiError("");
      setGeneratedRecipe(null);
      setGeneratedImageUrl(null);

      const response = await fetch("/api/recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: basketIngredients,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate recipe.");
      }

      setGeneratedRecipe(data.recipe);
      setGeneratedImageUrl(data.imageUrl ?? null);

      recipeSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } catch (error) {
      console.error(error);
      setAiError(
        "We couldn’t generate a recipe just now. Please try again in a moment.",
      );
    } finally {
      setIsGenerating(false);
    }
  }

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

      <section
        ref={recipeSectionRef}
        className="border-b border-[#e6ddd2] px-4 py-10 sm:px-6 md:px-10 md:py-12"
      >
        <div className="mx-auto max-w-6xl">
          <div className="rounded-[28px] border border-[#ddd4c8] bg-[#f7f2eb] p-6 md:p-8">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.18em] text-[#6b776c]">
                AI recipe suggestion
              </p>

              <h2 className="mt-2 font-serif text-2xl md:text-3xl">
                What can I cook from my basket?
              </h2>

              <p className="mt-3 text-sm leading-7 text-[#5f675c] md:text-base">
                We’ll use the items currently in your basket to suggest one
                simple recipe idea and an image to go with it.
              </p>
            </div>

            <div className="mt-6 rounded-[22px] border border-[#e1d8cc] bg-white/70 p-5">
              <p className="text-sm font-medium text-[#243328]">
                Basket ingredients
              </p>

              {basketIngredients.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {basketIngredients.map((ingredient) => (
                    <span
                      key={ingredient}
                      className="rounded-full border border-[#d6cec2] bg-white px-3 py-1.5 text-sm text-[#4f5e52]"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm leading-6 text-[#7a8478]">
                  Your basket is empty at the moment.
                </p>
              )}

              <div className="mt-5">
                <button
                  type="button"
                  onClick={handleGenerateRecipe}
                  disabled={isGenerating}
                  className="rounded-full bg-[#243328] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isGenerating
                    ? "Creating a fresh idea..."
                    : "Generate recipe from my basket"}
                </button>
              </div>

              {aiError && (
                <div className="mt-4 rounded-[18px] border border-[#e4d8cb] bg-[#fbf6f0] px-4 py-3 text-sm text-[#6a5c4f]">
                  {aiError}
                </div>
              )}
            </div>

            {generatedRecipe && (
              <div className="mt-6 overflow-hidden rounded-[24px] border border-[#d8d0c4] bg-white">
                {generatedImageUrl && (
                  <img
                    src={generatedImageUrl}
                    alt={generatedRecipe.title}
                    className="h-[280px] w-full object-cover md:h-[380px]"
                  />
                )}

                <div className="p-6 md:p-8">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#6b776c]">
                    Your recipe
                  </p>

                  <h3 className="mt-2 font-serif text-2xl md:text-3xl">
                    {generatedRecipe.title}
                  </h3>

                  <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5f675c] md:text-base">
                    {generatedRecipe.description}
                  </p>

                  <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <div>
                      <h4 className="text-sm font-medium uppercase tracking-[0.14em] text-[#6b776c]">
                        Ingredients used
                      </h4>
                      <ul className="mt-3 space-y-2 text-sm leading-6 text-[#243328]">
                        {generatedRecipe.ingredientsUsed.map((item) => (
                          <li key={item}>• {item}</li>
                        ))}
                      </ul>

                      {generatedRecipe.pantryStaples.length > 0 && (
                        <>
                          <h4 className="mt-5 text-sm font-medium uppercase tracking-[0.14em] text-[#6b776c]">
                            Pantry staples
                          </h4>
                          <ul className="mt-3 space-y-2 text-sm leading-6 text-[#243328]">
                            {generatedRecipe.pantryStaples.map((item) => (
                              <li key={item}>• {item}</li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-medium uppercase tracking-[0.14em] text-[#6b776c]">
                        Method
                      </h4>
                      <ol className="mt-3 space-y-3 text-sm leading-6 text-[#243328]">
                        {generatedRecipe.steps.map((step, index) => (
                          <li key={`${index}-${step}`} className="flex gap-3">
                            <span className="mt-[2px] inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#d6cec2] text-xs">
                              {index + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      type="button"
                      onClick={handleGenerateRecipe}
                      disabled={isGenerating}
                      className="rounded-full border border-[#d6cec2] bg-white px-5 py-2 text-sm text-[#243328] transition hover:bg-[#f5f1ea] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isGenerating ? "Creating..." : "Try another idea"}
                    </button>
                  </div>
                </div>
              </div>
            )}
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
