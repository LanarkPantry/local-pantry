"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useCart } from "../cart-context";

type RecipeItem = {
  title: string;
  image: string;
  recipe: string;
  ideas: string[];
};

type ProduceIdea = {
  title: string;
  text: string;
};

export default function RecipesPage() {
  const { cart } = useCart();

  const totalItems = useMemo(() => cart.length, [cart]);

  const jarRecipes: RecipeItem[] = [
    {
      title: "Sorrel & Walnut Pesto",
      image: "/pesto-recipe.jpg",
      recipe:
        "Toss through hot pasta with roasted vegetables and a splash of pasta water for an easy, vibrant supper.",
      ideas: [
        "Stir into warm potatoes",
        "Spread on toast with tomatoes",
        "Add to grain bowls",
      ],
    },
    {
      title: "Rose Harissa",
      image: "/harissa-recipe.jpg",
      recipe:
        "Roast carrots and chickpeas with rose harissa, olive oil and a touch of honey for a simple traybake.",
      ideas: [
        "Mix into yoghurt",
        "Brush onto roast veg",
        "Add to tomato sauces",
      ],
    },
    {
      title: "Salted Caramel Sauce",
      image: "/caramel-recipe.jpg",
      recipe:
        "Drizzle over porridge with banana and a pinch of sea salt for a soft, indulgent breakfast.",
      ideas: ["Pour over pancakes", "Swirl into brownies", "Serve with apples"],
    },
    {
      title: "Dark Chocolate & Hazelnut Spread",
      image: "/chocolate-recipe.jpg",
      recipe:
        "Spread onto toasted sourdough and top with sliced strawberries or banana for an easy sweet treat.",
      ideas: ["Fill crepes", "Stir into oats", "Dip fruit"],
    },
  ];

  const produceIdeas: ProduceIdea[] = [
    {
      title: "Roast Tin Supper",
      text: "Roast potatoes, carrots and onions, then finish with pesto or harissa for an easy midweek dinner.",
    },
    {
      title: "Seasonal Soup",
      text: "Blend softer vegetables with stock and herbs, then serve with toast and a swirl of pesto.",
    },
    {
      title: "Fruit Breakfasts",
      text: "Use bananas, apples, oranges and berries for smoothies, porridge toppings or quick fruit salads.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f4efe9] px-6 py-10 text-[#243328] md:px-10">
      <div className="mx-auto max-w-6xl">
        {/* HEADER */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-[#ddd4c8] pb-4">
          <Link
            href="/"
            className="text-sm tracking-[0.35em] text-[#60705f] hover:text-[#243328]"
          >
            THE LOCAL PANTRY
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm text-[#4f5e52] hover:text-[#243328]"
            >
              Home
            </Link>

            <Link
              href="/shop"
              className="text-sm text-[#4f5e52] hover:text-[#243328]"
            >
              Shop
            </Link>

            <Link
              href="/recipes"
              className="text-sm text-[#243328] underline underline-offset-4"
            >
              Recipes
            </Link>

            <Link
              href="/basket"
              className="text-sm text-[#4f5e52] hover:text-[#243328]"
            >
              Basket{totalItems > 0 ? ` (${totalItems})` : ""}
            </Link>
          </nav>
        </div>

        {/* HERO */}
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-[#6b776c]">
            Simple seasonal cooking
          </p>

          <h1 className="mt-4 font-serif text-5xl md:text-7xl">
            What to cook this week
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-[#5f675c]">
            Easy ways to make the most of your weekly box and pantry jars,
            without overthinking it.
          </p>
        </div>

        {/* RECIPES */}
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {jarRecipes.map((recipe) => (
            <div
              key={recipe.title}
              className="overflow-hidden rounded-[24px] border border-[#ddd4c8] bg-white shadow-sm"
            >
              <img
                src={recipe.image}
                alt={recipe.title}
                className="h-64 w-full object-cover"
              />

              <div className="p-6">
                <h2 className="font-serif text-3xl">{recipe.title}</h2>

                <p className="mt-4 text-[#4d5a4f]">{recipe.recipe}</p>

                <div className="mt-5 border-t border-[#ece4d8] pt-4">
                  <p className="text-sm uppercase tracking-[0.15em] text-[#6c786c]">
                    Also lovely with
                  </p>

                  <ul className="mt-3 space-y-2 text-[#4d5a4f]">
                    {recipe.ideas.map((idea) => (
                      <li key={idea}>• {idea}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SIMPLE IDEAS */}
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {produceIdeas.map((idea) => (
            <div
              key={idea.title}
              className="rounded-[24px] border border-[#ddd4c8] bg-[#f7f2eb] p-6 text-center"
            >
              <h3 className="font-serif text-2xl">{idea.title}</h3>
              <p className="mt-4 text-[#4d5a4f]">{idea.text}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-[28px] bg-[#2f4635] px-6 py-10 text-center text-white">
          <h2 className="font-serif text-3xl md:text-4xl">
            Ready to cook something good this week?
          </h2>

          <p className="mt-4 text-white/80">
            Start with a seasonal box and build from there.
          </p>

          <Link
            href="/shop"
            className="mt-6 inline-block rounded-full bg-white px-6 py-3 text-sm font-medium text-[#243328]"
          >
            Shop now
          </Link>
        </div>
      </div>
    </main>
  );
}
