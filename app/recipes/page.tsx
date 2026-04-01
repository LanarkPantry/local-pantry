"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";
import { useCart } from "../cart-context";

const savouryJarRecipes = [
  {
    title: "Rose Harissa Carrots & Chickpeas",
    image: "/images/recipes/rose-harissa-carrots.jpg",
    alt: "Roast carrots and chickpeas with rose harissa",
    intro:
      "A warm, easy traybake-style supper with sweetness, spice, and very little effort.",
    body: "Roast carrots until soft and catching at the edges, then add chickpeas and a spoon of rose harissa. Finish with yoghurt, herbs, or a little lemon if you have it.",
    pantryLabel: "Made with Rose Harissa",
  },
  {
    title: "Pesto Roast Potatoes",
    image: "/images/recipes/pesto-roast-potatoes.jpg",
    alt: "Crisp roast potatoes tossed with pesto",
    intro:
      "Crisp potatoes, a spoon of pesto, and dinner feels more or less sorted.",
    body: "Roast potatoes until golden, then toss with sorrel and walnut pesto while still hot. Add greens, beans, or an egg on top if you want to make it more of a meal.",
    pantryLabel: "Made with Sorrel & Walnut Pesto",
  },
];

const sweetJarRecipes = [
  {
    title: "Chocolate Yogurt Pots",
    image: "/images/recipes/chocolate-recipe.jpg",
    alt: "Yoghurt with dark chocolate and hazelnut spread",
    intro:
      "A very easy pudding or afternoon treat that feels a little special without much work.",
    body: "Spoon thick yoghurt into bowls or jars, swirl through a little dark chocolate and hazelnut spread, then finish with chopped fruit, toasted nuts, or biscuit crumbs if you have them.",
    pantryLabel: "Made with Dark Chocolate & Hazelnut Spread",
  },
  {
    title: "Salted Caramel Apple Toast",
    image: "/images/recipes/caramel-recipe.jpg",
    alt: "Toast with salted caramel sauce and sliced apple",
    intro:
      "The kind of quick sweet thing that works for breakfast, pudding, or a late snack.",
    body: "Toast good bread, spread with a little salted caramel sauce, then top with thin apple slices and a pinch of salt or cinnamon. Soft pears work well too.",
    pantryLabel: "Made with Salted Caramel Sauce",
  },
];

const useItUpIdeas = [
  {
    title: "Everything Smoothie",
    text: "Use soft fruit, yoghurt or milk, and something to thicken if needed. Frozen fruit works beautifully too.",
  },
  {
    title: "Soup from Almost Anything",
    text: "Soften veg, add stock or water, then blend if you want it smooth. A spoon of pesto or harissa helps bring it together.",
  },
  {
    title: "End-of-Week Roast Tin",
    text: "Roast whatever needs using up with oil and salt, then finish with something punchy at the end.",
  },
  {
    title: "Things on Toast",
    text: "Beans, greens, leftovers, soft tomatoes, mushrooms, eggs — if it’s warm and good on bread, it counts.",
  },
  {
    title: "Big Bowl of Bits",
    text: "Grains, leaves, roast veg, herbs, and a spoon of something useful from the fridge makes a very good lunch.",
  },
  {
    title: "Soft Fruit Compote",
    text: "If berries, plums, apples, or pears are on their way out, cook them down gently and spoon over yoghurt, porridge, or toast.",
  },
];

const prompts = [
  {
    ingredient: "Carrots",
    idea: "Roast until sweet, then add harissa, herbs, or yoghurt.",
  },
  {
    ingredient: "Potatoes",
    idea: "Roast well, then finish with pesto or a sharp dressing.",
  },
  {
    ingredient: "Tomatoes",
    idea: "Cook down gently for sauce, or roast until jammy.",
  },
  {
    ingredient: "Greens",
    idea: "Wilt into soups, beans, pasta, or eggs right at the end.",
  },
  {
    ingredient: "Soft fruit",
    idea: "Blend into smoothies, spoon over yoghurt, or cook into compote.",
  },
  {
    ingredient: "Good bread",
    idea: "Use for toast, tartines, or quick sweet things with fruit and a jar.",
  },
];

export default function RecipesPage() {
  const { cart } = useCart();
  const totalItems = useMemo(() => cart.length, [cart]);

  return (
    <main className="min-h-screen bg-[#f4efe9] text-[#243328]">
      <header className="sticky top-0 z-30 border-b border-[#e6ddd2] bg-[#f4efe9]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
          <Link
            href="/"
            className="text-sm tracking-[0.35em] text-[#60705f] hover:text-[#243328]"
          >
            THE LOCAL PANTRY
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
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

          <Link
            href="/basket"
            className="hidden rounded-full border border-[#d6cec2] bg-white px-4 py-2 text-sm text-[#243328] shadow-sm transition hover:bg-[#faf7f2] md:inline-flex"
          >
            View basket{totalItems > 0 ? ` (${totalItems})` : ""}
          </Link>
        </div>
      </header>

      <section className="border-b border-[#e6ddd2] px-6 pb-14 pt-14 md:px-10 md:pb-20 md:pt-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.25em] text-[#6b776c]">
              Simple ideas for the week
            </p>
            <h1 className="mt-4 font-serif text-4xl leading-tight tracking-tight md:text-6xl">
              Recipes to help you cook simply and use what you have.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5f675c]">
              A few calm, useful ideas built around good pantry things, flexible
              weeknight cooking, and making the most of what’s already in the
              kitchen.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-14 md:px-10 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.18em] text-[#6b776c]">
              Savoury jar ideas
            </p>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl">
              Start with something good.
            </h2>
            <p className="mt-4 leading-7 text-[#5f675c]">
              Slightly more complete ideas built around the savoury jars that
              earn their place in the cupboard.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {savouryJarRecipes.map((recipe) => (
              <article
                key={recipe.title}
                className="overflow-hidden rounded-[24px] border border-[#ddd4c8] bg-[#f7f2eb]"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#ede5da]">
                  <Image
                    src={recipe.image}
                    alt={recipe.alt}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-6 md:p-7">
                  <p className="text-sm uppercase tracking-[0.16em] text-[#6b776c]">
                    {recipe.pantryLabel}
                  </p>

                  <h3 className="mt-3 font-serif text-3xl leading-tight">
                    {recipe.title}
                  </h3>

                  <p className="mt-3 text-base leading-7 text-[#445247]">
                    {recipe.intro}
                  </p>

                  <p className="mt-4 leading-7 text-[#5f675c]">{recipe.body}</p>

                  <div className="mt-6">
                    <Link
                      href="/shop"
                      className="inline-flex rounded-full border border-[#d6cec2] bg-white px-4 py-2 text-sm text-[#243328] shadow-sm transition hover:bg-[#faf7f2]"
                    >
                      Shop pantry range
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#e6ddd2] px-6 py-14 md:px-10 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.18em] text-[#6b776c]">
              Sweet jar ideas
            </p>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl">
              A few sweeter things.
            </h2>
            <p className="mt-4 leading-7 text-[#5f675c]">
              Simple ideas for the sweeter jars too — still easy, still useful,
              and not overdone.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {sweetJarRecipes.map((recipe) => (
              <article
                key={recipe.title}
                className="overflow-hidden rounded-[24px] border border-[#ddd4c8] bg-[#f7f2eb]"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#ede5da]">
                  <Image
                    src={recipe.image}
                    alt={recipe.alt}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-6 md:p-7">
                  <p className="text-sm uppercase tracking-[0.16em] text-[#6b776c]">
                    {recipe.pantryLabel}
                  </p>

                  <h3 className="mt-3 font-serif text-3xl leading-tight">
                    {recipe.title}
                  </h3>

                  <p className="mt-3 text-base leading-7 text-[#445247]">
                    {recipe.intro}
                  </p>

                  <p className="mt-4 leading-7 text-[#5f675c]">{recipe.body}</p>

                  <div className="mt-6">
                    <Link
                      href="/shop"
                      className="inline-flex rounded-full border border-[#d6cec2] bg-white px-4 py-2 text-sm text-[#243328] shadow-sm transition hover:bg-[#faf7f2]"
                    >
                      Shop sweet jars
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#e6ddd2] px-6 py-14 md:px-10 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.18em] text-[#6b776c]">
              Use-it-up ideas
            </p>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl">
              Good ways to use what’s already there.
            </h2>
            <p className="mt-4 leading-7 text-[#5f675c]">
              These are the gentle, in-between meals — the kind that stop things
              going to waste and make dinner feel manageable.
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

      <section className="border-t border-[#e6ddd2] px-6 py-14 md:px-10 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.18em] text-[#6b776c]">
              Ingredient prompts
            </p>
            <h2 className="mt-3 font-serif text-3xl md:text-4xl">
              If you’ve got this, try this.
            </h2>
            <p className="mt-4 leading-7 text-[#5f675c]">
              A few quick prompts for the things that turn up often in a weekly
              shop.
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
