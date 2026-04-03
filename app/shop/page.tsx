"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "../cart-context";
import ShopRecipeCard from "./shop-recipe-card";
import {
  type ShopDisplayItem,
  cupboardItems,
  extraItems,
  pantryItems,
  produceBoxes,
} from "./shop-data";

const INSTALL_PROMPT_DISMISSED_KEY = "tlp_home_screen_prompt_dismissed";

const SAVED_FAVOURITES_KEY = "tlp_saved_favourite_recipes";
const PLANNER_RECIPES_KEY = "tlp_planner_recipes";
const WEEKLY_MEALS_KEY = "tlp_weekly_planner_meals";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

type BasketMatchLike = {
  id?: string;
  name?: string;
  title?: string;
  quantity?: number;
};

type RecipeLike = {
  id: string;
  title: string;
  basketMatches?: BasketMatchLike[];
};

type WeeklyMeals = Record<string, string | null>;

type PlannedSuggestion = {
  item: ShopDisplayItem;
  quantity: number;
  matchedMeals: string[];
  matchSource: string;
};

function safeRead<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function toId(value: unknown, fallback: string) {
  if (typeof value === "string" && value.trim()) return value;
  return fallback;
}

function toTitle(recipe: any, index: number) {
  const title =
    recipe?.title ||
    recipe?.name ||
    recipe?.recipeTitle ||
    recipe?.label ||
    recipe?.prompt;

  if (typeof title === "string" && title.trim()) return title.trim();
  return `Saved recipe ${index + 1}`;
}

function normalizeRecipe(recipe: any, index: number): RecipeLike {
  const title = toTitle(recipe, index);

  return {
    ...recipe,
    id: toId(recipe?.id, `${title}-${index}`),
    title,
    basketMatches: Array.isArray(recipe?.basketMatches)
      ? recipe.basketMatches
      : [],
  };
}

function normaliseText(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ");
}

function buildSearchCandidates(match: BasketMatchLike) {
  const values = [match.name, match.title, match.id]
    .filter(
      (value): value is string => typeof value === "string" && !!value.trim(),
    )
    .map((value) => value.trim());

  return Array.from(new Set(values));
}

function findMatchingShopItem(
  match: BasketMatchLike,
  allShopItems: ShopDisplayItem[],
) {
  const candidates = buildSearchCandidates(match);

  if (candidates.length === 0) return null;

  for (const candidate of candidates) {
    const normalisedCandidate = normaliseText(candidate);

    const exact = allShopItems.find(
      (item) => normaliseText(item.name) === normalisedCandidate,
    );

    if (exact) return { item: exact, source: candidate };
  }

  for (const candidate of candidates) {
    const normalisedCandidate = normaliseText(candidate);

    const contains = allShopItems.find((item) => {
      const itemName = normaliseText(item.name);
      return (
        itemName.includes(normalisedCandidate) ||
        normalisedCandidate.includes(itemName)
      );
    });

    if (contains) return { item: contains, source: candidate };
  }

  return null;
}

export default function ShopPage() {
  const { cart, groupedCart, addToCart, addManyToCart, removeOneFromCart } =
    useCart();

  const [showInstallCard, setShowInstallCard] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [plannerRecipes, setPlannerRecipes] = useState<RecipeLike[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<RecipeLike[]>([]);
  const [weeklyMeals, setWeeklyMeals] = useState<WeeklyMeals>({});
  const [plannerBridgeMessage, setPlannerBridgeMessage] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const dismissed =
      localStorage.getItem(INSTALL_PROMPT_DISMISSED_KEY) === "1";

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-expect-error - iOS Safari standalone property
      window.navigator.standalone === true;

    setIsStandalone(standalone);

    if (!dismissed && !standalone) {
      setShowInstallCard(true);
    }
  }, []);

  useEffect(() => {
    const rawSaved = safeRead<any[]>(SAVED_FAVOURITES_KEY, []);
    const rawPlanner = safeRead<any[]>(PLANNER_RECIPES_KEY, []);
    const rawWeekly = safeRead<WeeklyMeals>(WEEKLY_MEALS_KEY, {});

    const normalisedSaved = Array.isArray(rawSaved)
      ? rawSaved.map((item, index) => normalizeRecipe(item, index))
      : [];

    const normalisedPlanner = Array.isArray(rawPlanner)
      ? rawPlanner.map((item, index) => normalizeRecipe(item, index))
      : [];

    setSavedRecipes(normalisedSaved);
    setPlannerRecipes(normalisedPlanner);
    setWeeklyMeals(rawWeekly && typeof rawWeekly === "object" ? rawWeekly : {});
  }, []);

  useEffect(() => {
    if (!plannerBridgeMessage) return;

    const timer = window.setTimeout(() => {
      setPlannerBridgeMessage("");
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [plannerBridgeMessage]);

  const dismissInstallCard = () => {
    setShowInstallCard(false);
    if (typeof window !== "undefined") {
      localStorage.setItem(INSTALL_PROMPT_DISMISSED_KEY, "1");
    }
  };

  const totalItems = useMemo(() => cart.length, [cart]);

  const quantityByName = useMemo(() => {
    return groupedCart.reduce<Record<string, number>>((acc, entry) => {
      acc[entry.item.name] = entry.quantity;
      return acc;
    }, {});
  }, [groupedCart]);

  const weeklyProduceBox = useMemo(() => {
    return (
      produceBoxes.find((item) => item.name === "Weekly Produce Box") ??
      produceBoxes[0] ??
      null
    );
  }, []);

  const familyProduceBox = useMemo(() => {
    return (
      produceBoxes.find((item) => item.name === "Family Produce Box") ??
      produceBoxes.find((item) => item.name !== weeklyProduceBox?.name) ??
      null
    );
  }, [weeklyProduceBox]);

  const featuredProduceBox = weeklyProduceBox;

  const allShopItems = useMemo(() => {
    return [...produceBoxes, ...pantryItems, ...cupboardItems, ...extraItems];
  }, []);

  const recipesById = useMemo(() => {
    const map = new Map<string, RecipeLike>();

    for (const recipe of savedRecipes) {
      map.set(recipe.id, recipe);
    }

    for (const recipe of plannerRecipes) {
      map.set(recipe.id, recipe);
    }

    return map;
  }, [savedRecipes, plannerRecipes]);

  const plannedMeals = useMemo(() => {
    return DAYS.map((day) => {
      const recipeId = weeklyMeals?.[day];
      if (!recipeId) return null;

      const recipe = recipesById.get(recipeId);
      if (!recipe) return null;

      return { day, recipe };
    }).filter((entry): entry is { day: string; recipe: RecipeLike } =>
      Boolean(entry),
    );
  }, [weeklyMeals, recipesById]);

  const plannedSuggestions = useMemo(() => {
    const suggestionMap = new Map<string, PlannedSuggestion>();

    for (const meal of plannedMeals) {
      const matches = Array.isArray(meal.recipe.basketMatches)
        ? meal.recipe.basketMatches
        : [];

      for (const match of matches) {
        const found = findMatchingShopItem(match, allShopItems);
        if (!found) continue;

        const quantity =
          typeof match.quantity === "number" && match.quantity > 0
            ? match.quantity
            : 1;

        const existing = suggestionMap.get(found.item.name);

        if (existing) {
          existing.quantity += quantity;
          if (!existing.matchedMeals.includes(meal.recipe.title)) {
            existing.matchedMeals.push(meal.recipe.title);
          }
        } else {
          suggestionMap.set(found.item.name, {
            item: found.item,
            quantity,
            matchedMeals: [meal.recipe.title],
            matchSource: found.source,
          });
        }
      }
    }

    return Array.from(suggestionMap.values()).sort((a, b) => {
      if (b.quantity !== a.quantity) return b.quantity - a.quantity;
      return a.item.name.localeCompare(b.item.name);
    });
  }, [plannedMeals, allShopItems]);

  const plannedItemsToAdd = useMemo(() => {
    return plannedSuggestions.flatMap((suggestion) =>
      Array.from({ length: suggestion.quantity }, () => ({
        name: suggestion.item.name,
        price: suggestion.item.price,
        image: suggestion.item.image,
        category: suggestion.item.category,
        checkoutType: suggestion.item.checkoutType,
      })),
    );
  }, [plannedSuggestions]);

  const plannedSuggestionsCount = plannedSuggestions.length;
  const plannedMealsCount = plannedMeals.length;

  const getQuantity = (itemName: string) => quantityByName[itemName] ?? 0;

  const addDisplayItemToCart = (item: ShopDisplayItem) => {
    addToCart({
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
      checkoutType: item.checkoutType,
    });
  };

  const addPlannedSuggestion = (suggestion: PlannedSuggestion) => {
    const items = Array.from({ length: suggestion.quantity }, () => ({
      name: suggestion.item.name,
      price: suggestion.item.price,
      image: suggestion.item.image,
      category: suggestion.item.category,
      checkoutType: suggestion.item.checkoutType,
    }));

    addManyToCart(items);
    setPlannerBridgeMessage(`${suggestion.item.name} added from your plan`);
  };

  const addAllPlannedSuggestions = () => {
    if (plannedItemsToAdd.length === 0) return;
    addManyToCart(plannedItemsToAdd);
    setPlannerBridgeMessage("Suggested items added from your plan");
  };

  const handleStartWeeklyBox = () => {
    if (!featuredProduceBox) return;
    addDisplayItemToCart(featuredProduceBox);
  };

  const renderOrderBadge = (item: ShopDisplayItem) => {
    if (item.checkoutType === "subscription") {
      return (
        <div className="inline-flex rounded-full border border-[#d9d1c5] bg-[rgba(255,255,255,0.86)] px-3 py-1 text-xs font-medium uppercase tracking-[0.08em] text-[#5f675c]">
          Weekly starter
        </div>
      );
    }

    return (
      <div className="inline-flex rounded-full border border-[#d9d1c5] bg-[rgba(255,255,255,0.86)] px-3 py-1 text-xs font-medium uppercase tracking-[0.08em] text-[#5f675c]">
        One-off add-on
      </div>
    );
  };

  const renderAddControls = (item: ShopDisplayItem) => {
    const quantity = getQuantity(item.name);

    if (quantity === 0) {
      return (
        <button
          type="button"
          onClick={() => addDisplayItemToCart(item)}
          className="inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-[#2f4635] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 sm:w-auto"
        >
          {item.buttonLabel ?? "Add to basket"}
        </button>
      );
    }

    return (
      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
        <div className="inline-flex items-center self-start rounded-full border border-[#d8d0c4] bg-[rgba(255,255,255,0.88)]">
          <button
            type="button"
            onClick={() => removeOneFromCart(item.name)}
            className="cursor-pointer px-4 py-2 text-lg text-[#243328] transition hover:bg-[#f4efe9]"
          >
            −
          </button>

          <span className="min-w-[2.2rem] text-center text-sm font-medium text-[#243328]">
            {quantity}
          </span>

          <button
            type="button"
            onClick={() => addDisplayItemToCart(item)}
            className="cursor-pointer px-4 py-2 text-lg text-[#243328] transition hover:bg-[#f4efe9]"
          >
            +
          </button>
        </div>

        <span className="text-sm text-[#5f675c]">
          {quantity} added to basket
        </span>
      </div>
    );
  };

  const renderCompactCard = (
    item: ShopDisplayItem,
    label: string,
    helperText?: string,
  ) => {
    return (
      <article
        key={item.name}
        className="overflow-hidden rounded-[24px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.74)] shadow-[0_10px_24px_rgba(36,51,40,0.05)] backdrop-blur-md"
      >
        <div className="flex flex-col sm:flex-row">
          <div className="border-b border-[#e9dfd2] bg-[rgba(238,231,220,0.72)] p-4 sm:w-[190px] sm:shrink-0 sm:border-b-0 sm:border-r md:w-[220px]">
            <div className="flex h-full items-center justify-center rounded-[20px] bg-[rgba(248,244,238,0.82)] p-4">
              <img
                src={item.image}
                alt={item.name}
                className="h-28 w-full object-contain sm:h-36"
              />
            </div>
          </div>

          <div className="flex flex-1 flex-col justify-between p-5 md:p-6">
            <div>
              <p className="text-sm uppercase tracking-[0.14em] text-[#6b776c]">
                {label}
              </p>

              <h3 className="mt-2 font-serif text-[1.75rem] text-[#243328]">
                {item.name}
              </h3>

              <div className="mt-3 rounded-full border border-[#ddd4c8] bg-[rgba(255,255,255,0.88)] px-4 py-2 text-sm">
                £{item.price.toFixed(2)}
              </div>

              <div className="mt-4">{renderOrderBadge(item)}</div>

              <p className="mt-4 text-sm text-[#667164]">{item.description}</p>

              {helperText ? (
                <p className="mt-3 text-sm text-[#5f675c]">{helperText}</p>
              ) : null}

              {item.bestFor ? (
                <p className="mt-3 text-sm text-[#5f675c]">{item.bestFor}</p>
              ) : null}

              {item.note ? (
                <p className="mt-2 text-sm text-[#5f675c]">{item.note}</p>
              ) : null}
            </div>

            <div className="mt-6">{renderAddControls(item)}</div>
          </div>
        </div>
      </article>
    );
  };

  const renderSection = (
    title: string,
    id: string,
    items: ShopDisplayItem[],
    label: string,
  ) => {
    if (items.length === 0) return null;

    return (
      <section id={id} className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl text-[#243328]">{title}</h2>
            <p className="mt-2 text-sm text-[#667164]">
              Useful additions for the week ahead.
            </p>
          </div>

          <Link
            href="/basket"
            className="hidden cursor-pointer text-sm text-[#5f675c] underline md:block"
          >
            Review basket
          </Link>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {items.map((item) => renderCompactCard(item, label))}
        </div>
      </section>
    );
  };

  return (
    <main className="min-h-screen px-4 py-5 text-[#243328] sm:px-5 md:px-10 md:py-8">
      <div className="mx-auto max-w-6xl pb-32 md:pb-12">
        <div className="mb-5 flex items-center justify-between border-b border-[rgba(221,212,200,0.9)] pb-4">
          <Link
            href="/"
            className="cursor-pointer text-sm tracking-[0.35em] text-[#60705f]"
          >
            THE LOCAL PANTRY
          </Link>

          <Link
            href="/basket"
            className="cursor-pointer text-sm text-[#243328]"
          >
            Basket{totalItems > 0 ? ` (${totalItems})` : ""}
          </Link>
        </div>

        <section className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="rounded-[28px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.78)] p-5 shadow-[0_12px_30px_rgba(36,51,40,0.05)] backdrop-blur-md md:p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-[#6b776c]">
              Shop
            </p>

            <h1 className="mt-3 font-serif text-[2rem] leading-tight md:text-[2.5rem]">
              Start with your weekly veg box
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-7 text-[#667164]">
              Choose the size that suits your week, then build around it with a
              few useful extras.
            </p>

            <div className="mt-4 inline-flex rounded-full border border-[#d9d1c5] bg-[rgba(255,255,255,0.82)] px-3 py-1 text-xs font-medium text-[#5f675c]">
              Most people start here
            </div>

            {plannerBridgeMessage ? (
              <div className="mt-4 inline-flex rounded-full border border-[#d9d1c5] bg-[rgba(255,255,255,0.82)] px-3 py-1.5 text-xs font-medium text-[#5f675c]">
                {plannerBridgeMessage}
              </div>
            ) : null}

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {weeklyProduceBox ? (
                <div className="rounded-[24px] border border-[#ddd4c8] bg-[rgba(255,255,255,0.74)] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.14em] text-[#6b776c]">
                        Smaller box
                      </p>
                      <h2 className="mt-2 font-serif text-xl text-[#243328]">
                        {weeklyProduceBox.name}
                      </h2>
                    </div>

                    <div className="rounded-full border border-[#ddd4c8] bg-[rgba(255,255,255,0.88)] px-3 py-1.5 text-sm text-[#243328]">
                      £{weeklyProduceBox.price.toFixed(2)}
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-[#667164]">
                    {weeklyProduceBox.description}
                  </p>

                  {weeklyProduceBox.bestFor ? (
                    <p className="mt-3 text-sm text-[#5f675c]">
                      {weeklyProduceBox.bestFor}
                    </p>
                  ) : null}

                  <div className="mt-4">
                    {renderAddControls(weeklyProduceBox)}
                  </div>
                </div>
              ) : null}

              {familyProduceBox ? (
                <div className="rounded-[24px] border border-[#ddd4c8] bg-[rgba(255,255,255,0.74)] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.14em] text-[#6b776c]">
                        Larger box
                      </p>
                      <h2 className="mt-2 font-serif text-xl text-[#243328]">
                        {familyProduceBox.name}
                      </h2>
                    </div>

                    <div className="rounded-full border border-[#ddd4c8] bg-[rgba(255,255,255,0.88)] px-3 py-1.5 text-sm text-[#243328]">
                      £{familyProduceBox.price.toFixed(2)}
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-[#667164]">
                    {familyProduceBox.description}
                  </p>

                  {familyProduceBox.bestFor ? (
                    <p className="mt-3 text-sm text-[#5f675c]">
                      {familyProduceBox.bestFor}
                    </p>
                  ) : null}

                  <div className="mt-4">
                    {renderAddControls(familyProduceBox)}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="mt-5 rounded-[22px] border border-[#ddd4c8] bg-[rgba(255,255,255,0.76)] p-4">
              <p className="text-sm text-[#5f675c]">Your basket</p>
              <p className="mt-2 text-2xl font-serif text-[#243328]">
                {totalItems > 0
                  ? `${totalItems} item${totalItems === 1 ? "" : "s"}`
                  : "Empty"}
              </p>
              <Link
                href="/basket"
                className="mt-3 inline-block cursor-pointer text-sm underline"
              >
                Review basket
              </Link>
            </div>
          </div>

          <ShopRecipeCard
            starterBox={featuredProduceBox}
            onStartWeeklyBox={handleStartWeeklyBox}
          />
        </section>

        <section className="mt-8 rounded-[28px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.76)] p-5 shadow-[0_12px_30px_rgba(36,51,40,0.05)] backdrop-blur-md md:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-[#6b776c]">
                Build from your plan
              </p>
              <h2 className="mt-2 font-serif text-[1.8rem] leading-tight text-[#243328] md:text-[2.2rem]">
                Use your planned meals to shape the weekly shop
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[#667164]">
                We’ve picked out items that match the meals you’ve already added
                to your planner. Review them here, add what you need, then carry
                on shopping as usual.
              </p>
            </div>

            {plannedSuggestionsCount > 0 ? (
              <button
                type="button"
                onClick={addAllPlannedSuggestions}
                className="inline-flex items-center justify-center rounded-full bg-[#2f4635] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
              >
                Add suggested items
              </button>
            ) : null}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <div className="inline-flex rounded-full border border-[#d9d1c5] bg-[rgba(255,255,255,0.82)] px-3 py-1 text-xs font-medium text-[#5f675c]">
              {plannedMealsCount} planned meal
              {plannedMealsCount === 1 ? "" : "s"}
            </div>

            <div className="inline-flex rounded-full border border-[#d9d1c5] bg-[rgba(255,255,255,0.82)] px-3 py-1 text-xs font-medium text-[#5f675c]">
              {plannedSuggestionsCount} matched shop item
              {plannedSuggestionsCount === 1 ? "" : "s"}
            </div>
          </div>

          {plannedSuggestionsCount === 0 ? (
            <div className="mt-5 rounded-[24px] border border-dashed border-[#ddd4c8] bg-[rgba(255,255,255,0.76)] p-5">
              <p className="text-base font-medium text-[#243328]">
                No suggested items yet
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#667164]">
                Plan a few meals first, and matched ingredients or extras will
                show up here to help you build the weekly basket more quickly.
              </p>

              <div className="mt-4">
                <Link
                  href="/planner"
                  className="inline-flex rounded-full border border-[#d6cec2] bg-[rgba(255,255,255,0.86)] px-5 py-3 text-sm font-medium text-[#243328] transition hover:bg-white"
                >
                  Open planner
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {plannedSuggestions.map((suggestion) => {
                const quantityInCart = getQuantity(suggestion.item.name);

                return (
                  <article
                    key={suggestion.item.name}
                    className="overflow-hidden rounded-[24px] border border-[#ddd4c8] bg-[rgba(255,255,255,0.78)]"
                  >
                    <div className="border-b border-[#e9dfd2] bg-[rgba(238,231,220,0.62)] p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[18px] bg-[rgba(248,244,238,0.82)] p-3">
                          <img
                            src={suggestion.item.image}
                            alt={suggestion.item.name}
                            className="h-full w-full object-contain"
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs uppercase tracking-[0.14em] text-[#6b776c]">
                            Suggested from planner
                          </p>
                          <h3 className="mt-1 font-serif text-xl text-[#243328]">
                            {suggestion.item.name}
                          </h3>
                          <p className="mt-2 text-sm text-[#5f675c]">
                            £{suggestion.item.price.toFixed(2)} each
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex flex-wrap gap-2">
                        <div className="inline-flex rounded-full border border-[#d9d1c5] bg-[rgba(251,250,248,0.86)] px-3 py-1 text-xs font-medium text-[#5f675c]">
                          Suggested qty: {suggestion.quantity}
                        </div>

                        {quantityInCart > 0 ? (
                          <div className="inline-flex rounded-full border border-[#d9d1c5] bg-[rgba(251,250,248,0.86)] px-3 py-1 text-xs font-medium text-[#5f675c]">
                            In basket: {quantityInCart}
                          </div>
                        ) : null}
                      </div>

                      <p className="mt-3 text-sm leading-6 text-[#667164]">
                        Matched from {suggestion.matchedMeals.join(", ")}.
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => addPlannedSuggestion(suggestion)}
                          className="inline-flex items-center justify-center rounded-full bg-[#2f4635] px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
                        >
                          Add suggested amount
                        </button>

                        <button
                          type="button"
                          onClick={() => addDisplayItemToCart(suggestion.item)}
                          className="inline-flex items-center justify-center rounded-full border border-[#d6cec2] bg-[rgba(255,255,255,0.86)] px-4 py-2.5 text-sm font-medium text-[#243328] transition hover:bg-white"
                        >
                          Add one
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section id="produce-boxes" className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl text-[#243328]">
                Produce boxes
              </h2>
              <p className="mt-2 text-sm text-[#667164]">
                Start with a weekly box, then top up with a few extras.
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {produceBoxes.map((item) =>
              renderCompactCard(
                item,
                item.checkoutType === "subscription"
                  ? "Weekly starter"
                  : "Produce box",
                item.checkoutType === "subscription"
                  ? "A simple base for the week."
                  : undefined,
              ),
            )}
          </div>
        </section>

        {renderSection(
          "Pantry additions",
          "pantry-additions",
          pantryItems,
          "Pantry",
        )}
        {renderSection(
          "Cupboard essentials",
          "cupboard-essentials",
          cupboardItems,
          "Cupboard",
        )}
        {renderSection("Extras", "extras", extraItems, "Extra")}

        <div className="mt-10 rounded-[24px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.7)] p-5">
          <p className="text-sm uppercase tracking-[0.18em] text-[#6b776c]">
            Planning loop
          </p>
          <h2 className="mt-2 font-serif text-2xl text-[#243328]">
            Plan meals, then build the basket around them
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#667164]">
            Use the planner to shape the week ahead, then come back here to turn
            those meals into a practical local order.
          </p>
          <div className="mt-4">
            <Link
              href="/planner"
              className="inline-flex rounded-full border border-[#d6cec2] bg-[rgba(255,255,255,0.86)] px-5 py-3 text-sm font-medium text-[#243328] transition hover:bg-white"
            >
              Go to planner
            </Link>
          </div>
        </div>
      </div>

      {showInstallCard && !isStandalone && totalItems > 0 ? (
        <div className="fixed bottom-20 left-0 right-0 z-40 px-4">
          <div className="mx-auto max-w-md rounded-[18px] border border-[rgba(221,212,200,0.9)] bg-[rgba(247,242,235,0.92)] px-4 py-3 shadow-[0_10px_25px_rgba(36,51,40,0.08)] backdrop-blur-md">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs text-[#6b776c]">Add to home screen</p>
                <p className="mt-0.5 text-sm text-[#243328]">
                  Makes it easier to come back each week
                </p>
                <p className="mt-1 text-xs text-[#5f675c]">
                  Use your browser menu to choose “Add to Home screen”.
                </p>
              </div>

              <button
                type="button"
                onClick={dismissInstallCard}
                className="shrink-0 text-sm text-[#5f675c]"
                aria-label="Dismiss"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
