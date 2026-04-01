"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";
import { useCart } from "../cart-context";

type RecipeProduct = {
  name: string;
  price: number;
  image: string;
};

type RecipeCard = {
  title: string;
  image: string;
  alt: string;
  intro: string;
  body: string;
  pantryLabel: string;
  product: RecipeProduct;
  companionItems: RecipeProduct[];
  shopAnchor: string;
  shopLabel: string;
};

const savouryJarRecipes: RecipeCard[] = [
  {
    title: "Rose Harissa Carrots & Chickpeas",
    image: "/images/recipes/rose-harissa-carrots.jpg",
    alt: "Roast carrots and chickpeas with rose harissa",
    intro:
      "A warm, easy traybake-style supper with sweetness, spice, and very little effort.",
    body: "Roast carrots until soft and catching at the edges, then add chickpeas and a spoon of rose harissa. Finish with yoghurt, herbs, or a little lemon if you have it.",
    pantryLabel: "Made with Rose Harissa",
    product: {
      name: "Rose Harissa",
      price: 5.25,
      image: "/rose-harissa.png",
    },
    companionItems: [
      {
        name: "Giant Couscous",
        price: 4.75,
        image: "/images/cupboard/giant-couscous.jpg",
      },
      {
        name: "Puy Lentils",
        price: 4.95,
        image: "/images/cupboard/puy-lentils.jpg",
      },
    ],
    shopAnchor: "/shop#pantry-additions",
    shopLabel: "Shop pantry range",
  },
  {
    title: "Pesto Roast Potatoes",
    image: "/images/recipes/pesto-roast-potatoes.jpg",
    alt: "Crisp roast potatoes tossed with pesto",
    intro:
      "Crisp potatoes, a spoon of pesto, and dinner feels more or less sorted.",
    body: "Roast potatoes until golden, then toss with sorrel and walnut pesto while still hot. Add greens, beans, or an egg on top if you want to make it more of a meal.",
    pantryLabel: "Made with Sorrel & Walnut Pesto",
    product: {
      name: "Sorrel & Walnut Pesto",
      price: 4.5,
      image: "/sorrel-walnut-pesto.png",
    },
    companionItems: [
      {
        name: "Casarecce Pasta",
        price: 4.95,
        image: "/images/cupboard/casarecce.jpg",
      },
      {
        name: "Walnuts",
        price: 5.5,
        image: "/images/extras/walnuts.jpg",
      },
    ],
    shopAnchor: "/shop#pantry-additions",
    shopLabel: "Shop pantry range",
  },
];

const sweetJarRecipes: RecipeCard[] = [
  {
    title: "Chocolate Yogurt Pots",
    image: "/images/recipes/chocolate-recipe.jpg",
    alt: "Yoghurt with dark chocolate and hazelnut spread",
    intro:
      "A very easy pudding or afternoon treat that feels a little special without much work.",
    body: "Spoon thick yoghurt into bowls or jars, swirl through a little dark chocolate and hazelnut spread, then finish with chopped fruit, toasted nuts, or biscuit crumbs if you have them.",
    pantryLabel: "Made with Dark Chocolate & Hazelnut Spread",
    product: {
      name: "Dark Chocolate & Hazelnut Spread",
      price: 5.0,
      image: "/dark-chocolate.png",
    },
    companionItems: [
      {
        name: "Hazelnuts",
        price: 5.95,
        image: "/images/extras/hazelnuts.jpg",
      },
    ],
    shopAnchor: "/shop#pantry-additions",
    shopLabel: "Shop sweet jars",
  },
  {
    title: "Salted Caramel Apple Toast",
    image: "/images/recipes/caramel-recipe.jpg",
    alt: "Toast with salted caramel sauce and sliced apple",
    intro:
      "The kind of quick sweet thing that works for breakfast, pudding, or a late snack.",
    body: "Toast good bread, spread with a little salted caramel sauce, then top with thin apple slices and a pinch of salt or cinnamon. Soft pears work well too.",
    pantryLabel: "Made with Salted Caramel Sauce",
    product: {
      name: "Salted Caramel Sauce",
      price: 5.0,
      image: "/salted-caramel.png",
    },
    companionItems: [
      {
        name: "Almonds",
        price: 4.95,
        image: "/images/extras/almonds.jpg",
      },
    ],
    shopAnchor: "/shop#pantry-additions",
    shopLabel: "Shop sweet jars",
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
  const { cart, groupedCart, addToCart, addManyToCart, removeOneFromCart } =
    useCart();

  const totalItems = useMemo(() => cart.length, [cart]);

  const quantityByName = useMemo(() => {
    return groupedCart.reduce<Record<string, number>>((acc, entry) => {
      acc[entry.item.name] = entry.quantity;
      return acc;
    }, {});
  }, [groupedCart]);

  const getQuantity = (itemName: string) => quantityByName[itemName] ?? 0;

  const addRecipeProductToCart = (product: RecipeProduct) => {
    addToCart({
      name: product.name,
      price: product.price,
      image: product.image,
    });
  };

  const addRecipeBundleToCart = (recipe: RecipeCard) => {
    const bundleItems = [recipe.product, ...recipe.companionItems];

    addManyToCart(
      bundleItems.map((item) => ({
        name: item.name,
        price: item.price,
        image: item.image,
      })),
    );
  };

  const getBundleItems = (recipe: RecipeCard) => {
    return [recipe.product, ...recipe.companionItems];
  };

  const getBundleItemCountInCart = (recipe: RecipeCard) => {
    return getBundleItems(recipe).filter((item) => getQuantity(item.name) > 0)
      .length;
  };

  const renderRecipeAddControls = (product: RecipeProduct) => {
    const quantity = getQuantity(product.name);

    if (quantity === 0) {
      return (
        <button
          type="button"
          onClick={() => addRecipeProductToCart(product)}
          className="inline-flex items-center justify-center rounded-full bg-[#2f4635] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
        >
          Add {product.name}
        </button>
      );
    }

    return (
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="inline-flex items-center self-start rounded-full border border-[#d8d0c4] bg-white">
          <button
            type="button"
            onClick={() => removeOneFromCart(product.name)}
            aria-label={`Decrease quantity of ${product.name}`}
            className="px-4 py-2 text-lg text-[#243328] transition hover:bg-[#f4efe9]"
          >
            −
          </button>

          <span className="min-w-[2.2rem] text-center text-sm font-medium text-[#243328]">
            {quantity}
          </span>

          <button
            type="button"
            onClick={() => addRecipeProductToCart(product)}
            aria-label={`Increase quantity of ${product.name}`}
            className="px-4 py-2 text-lg text-[#243328] transition hover:bg-[#f4efe9]"
          >
            +
          </button>
        </div>

        <span className="text-sm text-[#5f675c]">Already in your basket</span>
      </div>
    );
  };

  const renderRecipeCard = (recipe: RecipeCard) => {
    const quantity = getQuantity(recipe.product.name);
    const bundleItems = getBundleItems(recipe);
    const bundleItemCountInCart = getBundleItemCountInCart(recipe);
    const allBundleItemsAlreadyAdded =
      bundleItemCountInCart === bundleItems.length && bundleItems.length > 0;

    return (
      <article
        key={recipe.title}
        className="overflow-hidden rounded-[24px] border border-[#ddd4c8] bg-[#f7f2eb]"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#ede5da]">
          <Image
            src={recipe.image}
            alt={recipe.alt}
            fill
            sizes="(max-width: 767px) 100vw, 50vw"
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

          <div className="mt-6 rounded-2xl border border-[#ddd4c8] bg-white p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-[#6b776c]">
              Pantry item used here
            </p>

            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-base font-medium text-[#243328]">
                  {recipe.product.name}
                </p>
                <p className="mt-1 text-sm text-[#5f675c]">
                  £{recipe.product.price.toFixed(2)}
                </p>
              </div>

              <Link
                href={recipe.shopAnchor}
                className="text-sm text-[#5f675c] underline underline-offset-4 transition hover:text-[#243328]"
              >
                View in shop
              </Link>
            </div>

            <div className="mt-4 flex flex-col gap-3">
              {renderRecipeAddControls(recipe.product)}

              {quantity > 0 && (
                <Link
                  href="/basket"
                  className="text-sm text-[#5f675c] underline underline-offset-4 transition hover:text-[#243328]"
                >
                  Review in basket
                </Link>
              )}
            </div>
          </div>

          {recipe.companionItems.length > 0 && (
            <div className="mt-4 rounded-2xl border border-[#ddd4c8] bg-[#f3ede4] p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-[#6b776c]">
                Works well with
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {bundleItems.map((item) => {
                  const quantityInCart = getQuantity(item.name);

                  return (
                    <span
                      key={item.name}
                      className="rounded-full border border-[#ddd4c8] bg-white px-3 py-1 text-sm text-[#5f675c]"
                    >
                      {item.name}
                      {quantityInCart > 0
                        ? ` (${quantityInCart} in basket)`
                        : ""}
                    </span>
                  );
                })}
              </div>

              <div className="mt-4 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => addRecipeBundleToCart(recipe)}
                  className="inline-flex items-center justify-center self-start rounded-full border border-[#d6cec2] bg-white px-5 py-3 text-sm font-medium text-[#243328] transition hover:bg-[#faf7f2]"
                >
                  Add all ingredients
                </button>

                {allBundleItemsAlreadyAdded ? (
                  <p className="text-sm leading-6 text-[#5f675c]">
                    You already have each of these in your basket.
                  </p>
                ) : bundleItemCountInCart > 0 ? (
                  <p className="text-sm leading-6 text-[#5f675c]">
                    You already have {bundleItemCountInCart} of{" "}
                    {bundleItems.length} suggested item
                    {bundleItems.length === 1 ? "" : "s"} in your basket.
                  </p>
                ) : (
                  <p className="text-sm leading-6 text-[#5f675c]">
                    A simple bundle if you want to build the meal out a little.
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="mt-6">
            <Link
              href={recipe.shopAnchor}
              className="inline-flex rounded-full border border-[#d6cec2] bg-white px-4 py-2 text-sm text-[#243328] shadow-sm transition hover:bg-[#faf7f2]"
            >
              {recipe.shopLabel}
            </Link>
          </div>
        </div>
      </article>
    );
  };

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

      <section className="border-b border-[#e6ddd2] px-4 pb-14 pt-14 sm:px-6 md:px-10 md:pb-20 md:pt-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.25em] text-[#6b776c]">
              Simple ideas for the week
            </p>
            <h1 className="mt-4 font-serif text-4xl leading-tight tracking-tight md:text-6xl">
              Recipes to help you cook simply and use what you have.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#5f675c] md:text-lg">
              A few calm, useful ideas built around good pantry things, flexible
              weeknight cooking, and making the most of what’s already in the
              kitchen.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 md:px-10 md:py-20">
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
            {savouryJarRecipes.map((recipe) => renderRecipeCard(recipe))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#e6ddd2] px-4 py-14 sm:px-6 md:px-10 md:py-20">
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
            {sweetJarRecipes.map((recipe) => renderRecipeCard(recipe))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#e6ddd2] px-4 py-14 sm:px-6 md:px-10 md:py-20">
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

      <section className="border-t border-[#e6ddd2] px-4 py-14 sm:px-6 md:px-10 md:py-20">
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
