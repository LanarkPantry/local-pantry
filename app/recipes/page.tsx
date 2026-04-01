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

type FlexibleIdea = {
  title: string;
  image: string;
  intro: string;
  formula: string;
  ideas: string[];
};

type IngredientPrompt = {
  name: string;
  uses: string[];
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

  const flexibleIdeas: FlexibleIdea[] = [
    {
      title: "Everything Smoothie",
      image: "/pesto-recipe.jpg",
      intro:
        "A good home for soft fruit, spare greens, and anything that needs using soon.",
      formula:
        "Pick one fruit, one extra fruit or veg, something to make it creamy, and a splash of milk or oat milk.",
      ideas: [
        "Banana + spinach + yoghurt",
        "Apple + carrot + oat milk",
        "Pear + greens + yoghurt",
      ],
    },
    {
      title: "Soup from Almost Anything",
      image: "/harissa-recipe.jpg",
      intro:
        "Perfect for softer vegetables, half-used onions, and things that look a bit tired but are still good.",
      formula:
        "Cook onion if you have one, add chopped vegetables, cover with stock or water, simmer, then blend or leave chunky.",
      ideas: [
        "Carrot + potato + onion",
        "Leek + potato + greens",
        "Tomato + pepper + garlic",
      ],
    },
    {
      title: "End of Week Roast Tin",
      image: "/caramel-recipe.jpg",
      intro:
        "The easiest low-effort dinner when the fridge has become a mixture of odds and ends.",
      formula:
        "Chop everything, coat with oil and salt, roast until soft and golden, then finish with pesto, harissa, herbs or yoghurt.",
      ideas: [
        "Carrots + onions + potatoes",
        "Courgette + tomatoes + peppers",
        "Roots + chickpeas + rose harissa",
      ],
    },
    {
      title: "Things on Toast",
      image: "/chocolate-recipe.jpg",
      intro:
        "The quickest route from random ingredients to something that feels like a proper meal.",
      formula:
        "Toast good bread, add one warm topping or spread, then finish with something fresh, crunchy or bright.",
      ideas: [
        "Pesto + roast tomatoes",
        "Greens + egg",
        "Soft fruit + chocolate spread",
      ],
    },
  ];

  const ingredientPrompts: IngredientPrompt[] = [
    {
      name: "Carrots",
      uses: [
        "Grate into salad",
        "Roast with honey or harissa",
        "Add to smoothies or soup",
      ],
    },
    {
      name: "Potatoes",
      uses: ["Roast with onions", "Crush with pesto", "Turn into quick soup"],
    },
    {
      name: "Greens",
      uses: [
        "Wilt into pasta",
        "Blend into smoothies",
        "Stir through soup or beans",
      ],
    },
    {
      name: "Apples",
      uses: [
        "Slice into porridge",
        "Blend into smoothies",
        "Roast with cinnamon",
      ],
    },
    {
      name: "Soft tomatoes",
      uses: ["Roast for toast", "Cook into pasta sauce", "Blend into soup"],
    },
    {
      name: "Bananas",
      uses: [
        "Freeze for smoothies",
        "Mash into oats",
        "Serve with caramel sauce",
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-[#f4efe9] px-6 py-10 text-[#243328] md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-[#ddd4c8] pb-4">
          <Link
            href="/"
            className="text-sm tracking-[0.35em] text-[#60705f] transition hover:text-[#243328]"
          >
            THE LOCAL PANTRY
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm text-[#4f5e52] transition hover:text-[#243328]"
            >
              Home
            </Link>

            <Link
              href="/shop"
              className="text-sm text-[#4f5e52] transition hover:text-[#243328]"
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
              className="text-sm text-[#4f5e52] transition hover:text-[#243328]"
            >
              Basket{totalItems > 0 ? ` (${totalItems})` : ""}
            </Link>
          </nav>
        </div>

        <section className="rounded-[28px] border border-[#ddd4c8] bg-[#f7f2eb] px-6 py-10 shadow-[0_12px_30px_rgba(36,51,40,0.06)] md:px-10 md:py-12">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm uppercase tracking-[0.25em] text-[#6b776c]">
              Simple seasonal cooking
            </p>

            <h1 className="mt-4 font-serif text-5xl leading-tight md:text-7xl">
              Recipes and ideas for the week
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-[#5f675c]">
              Proper pairings for the pantry jars, plus flexible ideas for using
              up the fruit and vegetables you already have.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href="#jar-recipes"
                className="inline-flex rounded-full bg-[#2f4635] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
              >
                Explore jar recipes
              </a>

              <a
                href="#use-it-up-ideas"
                className="inline-flex rounded-full border border-[#d6cec2] bg-white px-6 py-3 text-sm font-medium text-[#243328] transition hover:bg-[#faf7f2]"
              >
                Browse use-it-up ideas
              </a>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-[24px] border border-[#ddd4c8] bg-white p-5">
            <p className="text-sm font-medium text-[#243328]">
              Pantry-led recipes
            </p>
            <p className="mt-2 text-sm leading-6 text-[#5f675c]">
              A few more polished ideas built around your gourmet jars.
            </p>
          </div>

          <div className="rounded-[24px] border border-[#ddd4c8] bg-white p-5">
            <p className="text-sm font-medium text-[#243328]">
              Flexible cooking
            </p>
            <p className="mt-2 text-sm leading-6 text-[#5f675c]">
              Useful formats for whatever fruit and vegetables need using up.
            </p>
          </div>

          <div className="rounded-[24px] border border-[#ddd4c8] bg-white p-5">
            <p className="text-sm font-medium text-[#243328]">
              Less waste, more ease
            </p>
            <p className="mt-2 text-sm leading-6 text-[#5f675c]">
              Gentle inspiration for those “what shall I make with this?” days.
            </p>
          </div>
        </section>

        <section id="jar-recipes" className="mt-14">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.18em] text-[#6b776c]">
              Jar recipes
            </p>
            <h2 className="mt-2 font-serif text-3xl md:text-5xl">
              Start with the gourmet jars
            </h2>
            <p className="mt-4 max-w-2xl text-[#5f675c]">
              Easy recipes and pairings designed to make the pantry jars feel
              useful, special and easy to reach for.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {jarRecipes.map((recipe) => (
              <article
                key={recipe.title}
                className="overflow-hidden rounded-[24px] border border-[#ddd4c8] bg-white shadow-sm"
              >
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="h-64 w-full object-cover"
                />

                <div className="p-6">
                  <p className="text-sm uppercase tracking-[0.15em] text-[#6c786c]">
                    Pantry pairing
                  </p>

                  <h2 className="mt-2 font-serif text-3xl text-[#243328]">
                    {recipe.title}
                  </h2>

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
              </article>
            ))}
          </div>
        </section>

        <section id="use-it-up-ideas" className="mt-14">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.18em] text-[#6b776c]">
              Use-it-up ideas
            </p>
            <h2 className="mt-2 font-serif text-3xl md:text-5xl">
              Cook from what’s already there
            </h2>
            <p className="mt-4 max-w-2xl text-[#5f675c]">
              A few calm, forgiving formats for all the spare veg, soft fruit,
              and odds and ends that build up through the week.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {flexibleIdeas.map((idea) => (
              <article
                key={idea.title}
                className="overflow-hidden rounded-[24px] border border-[#ddd4c8] bg-white shadow-sm"
              >
                <img
                  src={idea.image}
                  alt={idea.title}
                  className="h-64 w-full object-cover"
                />

                <div className="p-6">
                  <p className="text-sm uppercase tracking-[0.15em] text-[#6c786c]">
                    Flexible idea
                  </p>

                  <h3 className="mt-2 font-serif text-3xl text-[#243328]">
                    {idea.title}
                  </h3>

                  <p className="mt-4 text-[#4d5a4f]">{idea.intro}</p>

                  <div className="mt-5 rounded-2xl border border-[#ece4d8] bg-[#f7f2eb] p-4">
                    <p className="text-sm font-medium text-[#243328]">
                      How it works
                    </p>
                    <p className="mt-2 text-sm leading-7 text-[#4d5a4f]">
                      {idea.formula}
                    </p>
                  </div>

                  <div className="mt-5 border-t border-[#ece4d8] pt-4">
                    <p className="text-sm uppercase tracking-[0.15em] text-[#6c786c]">
                      Try it with
                    </p>

                    <ul className="mt-3 space-y-2 text-[#4d5a4f]">
                      {idea.ideas.map((entry) => (
                        <li key={entry}>• {entry}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-[28px] border border-[#ddd4c8] bg-[#f7f2eb] p-6 md:p-8">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.18em] text-[#6b776c]">
              Quick ingredient prompts
            </p>
            <h2 className="mt-2 font-serif text-3xl md:text-4xl">
              If you’ve got this, do this
            </h2>
            <p className="mt-3 text-[#5f675c]">
              Small prompts for the ingredients that tend to linger at the
              bottom of the fridge.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {ingredientPrompts.map((item) => (
              <div
                key={item.name}
                className="rounded-[22px] border border-[#ddd4c8] bg-white p-5"
              >
                <h3 className="font-serif text-2xl text-[#243328]">
                  {item.name}
                </h3>

                <ul className="mt-4 space-y-2 text-sm leading-6 text-[#4d5a4f]">
                  {item.uses.map((use) => (
                    <li key={use}>• {use}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-[28px] bg-[#2f4635] px-6 py-10 text-center text-white">
          <h2 className="font-serif text-3xl md:text-4xl">
            Ready to cook something good this week?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-white/80">
            Start with a seasonal box, add a few jars, and come back here when
            you need either a proper recipe or a quick spark of inspiration.
          </p>

          <Link
            href="/shop"
            className="mt-6 inline-block rounded-full bg-white px-6 py-3 text-sm font-medium text-[#243328] transition hover:bg-[#f6f3ee]"
          >
            Shop now
          </Link>
        </section>
      </div>
    </main>
  );
}
