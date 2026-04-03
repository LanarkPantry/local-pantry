"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "../cart-context";

type GeneratedRecipe = {
  title: string;
  description: string;
  ingredientsUsed: string[];
  pantryStaples: string[];
  steps: string[];
};

type RecipeResponse = {
  recipe: GeneratedRecipe;
  imageUrl: string | null;
  error?: string;
};

type StarterBox = {
  name: string;
  description: string;
  weeklyIncludes?: string[];
};

type ShopRecipeCardProps = {
  starterBox?: StarterBox | null;
  onStartWeeklyBox?: () => void;
};

const DEFAULT_BOX_INGREDIENTS = [
  "carrots",
  "potatoes",
  "leeks",
  "apples",
  "onions",
];

export default function ShopRecipeCard({
  starterBox,
  onStartWeeklyBox,
}: ShopRecipeCardProps) {
  const { groupedCart } = useCart();

  const basketItemNames = useMemo(
    () => groupedCart.map((entry) => entry.item.name),
    [groupedCart],
  );

  const starterBoxAlreadyInBasket = useMemo(() => {
    if (!starterBox) return false;
    return basketItemNames.includes(starterBox.name);
  }, [basketItemNames, starterBox]);

  const starterBoxIngredients = useMemo(() => {
    if (starterBox?.weeklyIncludes && starterBox.weeklyIncludes.length > 0) {
      return starterBox.weeklyIncludes
        .map((item) => item.trim())
        .filter(Boolean);
    }

    return DEFAULT_BOX_INGREDIENTS;
  }, [starterBox]);

  const [input, setInput] = useState("");
  const [useBasketItems, setUseBasketItems] = useState(true);
  const [quickStart, setQuickStart] = useState("quick-tonight");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<RecipeResponse | null>(null);

  const parsedItems = useMemo(
    () =>
      input
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    [input],
  );

  useEffect(() => {
    if (!starterBoxAlreadyInBasket) return;
    setUseBasketItems(true);
  }, [starterBoxAlreadyInBasket]);

  async function generateRecipeFromItems(itemsToUse: string[]) {
    setLoading(true);
    setError("");
    setResult(null);

    const uniqueItems = Array.from(new Set(itemsToUse.filter(Boolean))).slice(
      0,
      16,
    );

    if (uniqueItems.length === 0) {
      setLoading(false);
      setError("Add a few ingredients to get started.");
      return;
    }

    try {
      const response = await fetch("/api/recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: uniqueItems,
          quickStart,
          preferences: [],
        }),
      });

      const data = (await response.json()) as RecipeResponse;

      if (!response.ok) {
        setError(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }

      setResult(data);
    } catch {
      setError("Something went wrong while generating the recipe.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerate() {
    const items = [...parsedItems, ...(useBasketItems ? basketItemNames : [])];

    await generateRecipeFromItems(items);
  }

  async function handlePlanMealsWithBox() {
    setInput(starterBoxIngredients.join(", "));
    setUseBasketItems(true);

    await generateRecipeFromItems([
      ...starterBoxIngredients,
      ...basketItemNames,
    ]);
  }

  const helperSummary =
    parsedItems.length > 0 || basketItemNames.length > 0
      ? `${parsedItems.length > 0 ? `Using ${parsedItems.length} typed item${parsedItems.length === 1 ? "" : "s"}` : "No typed ingredients yet"}${
          useBasketItems && basketItemNames.length > 0
            ? ` + ${basketItemNames.length} basket item${basketItemNames.length === 1 ? "" : "s"}`
            : ""
        }`
      : "";

  return (
    <section
      id="shop-recipe-card"
      className="rounded-[28px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.78)] p-5 shadow-[0_12px_30px_rgba(36,51,40,0.06)] backdrop-blur-md md:p-6"
    >
      <div className="max-w-2xl">
        <p className="text-sm uppercase tracking-[0.18em] text-[#6b776c]">
          Meals for the week
        </p>

        <h2 className="mt-2 font-serif text-2xl leading-tight md:text-3xl">
          Plan meals around your box
        </h2>

        <p className="mt-3 text-sm leading-7 text-[#667164]">
          Start with your weekly veg box, or add a few ingredients and we’ll
          suggest something simple and useful.
        </p>
      </div>

      <div className="mt-5 rounded-[24px] border border-[#ddd4c8] bg-[rgba(255,255,255,0.72)] p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            onClick={onStartWeeklyBox}
            className="inline-flex items-center justify-center rounded-full bg-[#2f4635] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            {starterBoxAlreadyInBasket
              ? "Weekly box added"
              : "Start your weekly box"}
          </button>

          <button
            type="button"
            onClick={handlePlanMealsWithBox}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-full border border-[#d6cec2] bg-[rgba(255,255,255,0.92)] px-5 py-3 text-sm font-medium text-[#243328] transition hover:bg-white disabled:opacity-60"
          >
            Plan meals with this box
          </button>
        </div>

        <p className="mt-3 text-sm text-[#5f675c]">
          We’ll use this week’s box contents as a starting point, then you can
          top up with a few extras.
        </p>

        {starterBoxIngredients.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {starterBoxIngredients.map((item) => (
              <span
                key={item}
                className="rounded-full border border-[#e5ddcf] bg-[rgba(251,250,248,0.82)] px-3 py-1 text-sm text-[#5f675c]"
              >
                {item}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-5 grid gap-4">
        <div>
          <label
            htmlFor="shop-recipe-input"
            className="mb-2 block text-sm font-medium text-[#243328]"
          >
            Or start with a few ingredients
          </label>

          <input
            id="shop-recipe-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tomatoes, chickpeas, pasta, spinach"
            className="w-full rounded-[20px] border border-[#d6cec2] bg-[rgba(255,255,255,0.88)] px-4 py-3 text-sm text-[#243328] outline-none placeholder:text-[#7b8478] focus:border-[#a9b2a3]"
          />
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <label className="inline-flex items-center gap-3 text-sm text-[#243328]">
            <input
              type="checkbox"
              checked={useBasketItems}
              onChange={(e) => setUseBasketItems(e.target.checked)}
              className="h-4 w-4 rounded border-[#cfc6b9]"
            />
            Use basket items too
          </label>

          <select
            value={quickStart}
            onChange={(e) => setQuickStart(e.target.value)}
            className="rounded-full border border-[#d6cec2] bg-[rgba(255,255,255,0.88)] px-4 py-2 text-sm text-[#243328] outline-none"
          >
            <option value="quick-tonight">Quick tonight</option>
            <option value="comforting">Comforting</option>
            <option value="use-what-ive-got">Use what I’ve got</option>
          </select>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-full bg-[#2f4635] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Generating..." : "Generate recipe"}
          </button>

          {helperSummary ? (
            <p className="text-xs leading-6 text-[#7a8478]">{helperSummary}</p>
          ) : null}
        </div>

        {error ? (
          <div className="rounded-[20px] border border-[#e4d8cb] bg-[#fbf6f0] px-4 py-3 text-sm text-[#6a5c4f]">
            {error}
          </div>
        ) : null}

        {result?.recipe ? (
          <div className="mt-2 overflow-hidden rounded-[24px] border border-[#ddd4c8] bg-[rgba(255,255,255,0.76)]">
            {result.imageUrl ? (
              <div className="border-b border-[#e9dfd2] bg-[rgba(238,231,220,0.64)] p-4">
                <div className="overflow-hidden rounded-[20px] bg-[rgba(248,244,238,0.82)]">
                  <img
                    src={result.imageUrl}
                    alt={result.recipe.title}
                    className="h-56 w-full object-cover"
                  />
                </div>
              </div>
            ) : null}

            <div className="p-5">
              <p className="text-sm uppercase tracking-[0.16em] text-[#6b776c]">
                Recipe idea
              </p>

              <h3 className="mt-2 font-serif text-2xl leading-tight text-[#243328]">
                {result.recipe.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-[#667164]">
                {result.recipe.description}
              </p>

              {result.recipe.ingredientsUsed.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {result.recipe.ingredientsUsed.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-[#e5ddcf] bg-[rgba(251,250,248,0.82)] px-3 py-1 text-sm text-[#5f675c]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button
                  type="button"
                  className="rounded-full bg-[#2f4635] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
                >
                  Save to favourites
                </button>

                <button
                  type="button"
                  className="rounded-full border border-[#d6cec2] bg-[rgba(255,255,255,0.88)] px-5 py-3 text-sm font-medium text-[#243328] transition hover:bg-white"
                >
                  Add to planner
                </button>

                <button
                  type="button"
                  className="rounded-full border border-[#d6cec2] bg-[rgba(255,255,255,0.88)] px-5 py-3 text-sm font-medium text-[#243328] transition hover:bg-white"
                >
                  Add matched items
                </button>

                <Link
                  href="/basket"
                  className="rounded-full border border-[#d6cec2] bg-[rgba(255,255,255,0.88)] px-5 py-3 text-sm font-medium text-[#243328] transition hover:bg-white"
                >
                  Review basket
                </Link>

                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={loading}
                  className="text-sm text-[#5f675c] underline underline-offset-4 transition hover:text-[#243328] disabled:opacity-60"
                >
                  Try another idea
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
