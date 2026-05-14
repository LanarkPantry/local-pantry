"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "../cart-context";
import RecipeCard from "../components/RecipeCard";
import { recipes } from "./recipes-data";
import { allShopItems } from "../shop/shop-data";

type GeneratedRecipe = {
  title: string;
  description: string;
  ingredientsUsed: string[];
  pantryStaples: string[];
  steps: string[];
};

type SavedRecipe = {
  id: string;
  title: string;
  description: string;
  ingredientsUsed: string[];
  pantryStaples: string[];
  steps: string[];
  imageUrl: string | null;
  savedAt: string;
};

type PlannerRecipe = {
  id: string;
  title: string;
  description: string;
  ingredientsUsed: string[];
  imageUrl: string | null;
  savedAt: string;
  addedToPlannerAt: string;
};

const FAVOURITES_STORAGE_KEY = "tlp_saved_favourite_recipes";
const PREFERENCES_STORAGE_KEY = "tlp_recipe_preferences";
const PLANNER_RECIPES_STORAGE_KEY = "tlp_planner_recipes";
const PLANNER_ACCESS_KEY = "tlp_planner_access";
const FREE_RECIPE_USAGE_KEY = "tlp_free_recipe_usage";
const FREE_RECIPE_LIMIT = 3;

const quickStartOptions = [
  {
    id: "quick-tonight",
    label: "Quick tonight",
  },
  {
    id: "comforting",
    label: "Comforting",
  },
  {
    id: "use-what-ive-got",
    label: "Use what I’ve got",
  },
] as const;

const preferenceOptions = [
  "Quick meals",
  "Vegetarian",
  "High protein",
  "Family-friendly",
  "Low waste",
  "No dairy",
  "No nuts",
] as const;

function normaliseIngredient(value: string) {
  return value
    .toLowerCase()
    .replace(/[0-9]/g, "")
    .replace(/[^\w\s]/g, " ")
    .replace(
      /\b(clove|cloves|tbsp|tsp|g|kg|ml|l|cup|cups|large|small|medium)\b/g,
      "",
    )
    .replace(/\s+/g, " ")
    .trim()
    .replace(/ies\b/g, "y")
    .replace(/s\b/g, "");
}

export default function RecipesPage() {
  const { cart, addManyToCart } = useCart();

  const totalItems = useMemo(() => cart.length, [cart]);

  const basketIngredients = useMemo(() => {
    return Array.from(new Set(cart.map((item) => item.name)));
  }, [cart]);

  const generatorRef = useRef<HTMLDivElement | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);

  const [customIngredients, setCustomIngredients] = useState("");
  const [includeBasketIngredients, setIncludeBasketIngredients] =
    useState(false);
  const [generatedRecipe, setGeneratedRecipe] =
    useState<GeneratedRecipe | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(
    null,
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState("");
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
  const [plannerRecipes, setPlannerRecipes] = useState<PlannerRecipe[]>([]);
  const [saveMessage, setSaveMessage] = useState("");
  const [plannerMessage, setPlannerMessage] = useState("");
  const [basketMessage, setBasketMessage] = useState("");
  const [selectedQuickStart, setSelectedQuickStart] = useState<string>("");
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [hasPlannerAccess, setHasPlannerAccess] = useState(false);
  const [freeRecipeUsage, setFreeRecipeUsage] = useState(0);
  const [paywallMessage, setPaywallMessage] = useState("");

  const featuredRecipes = recipes.slice(0, 2);

  const typedIngredients = useMemo(() => {
    return customIngredients
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }, [customIngredients]);

  const allIngredients = useMemo(() => {
    const combined = includeBasketIngredients
      ? [...typedIngredients, ...basketIngredients]
      : [...typedIngredients];

    return Array.from(new Set(combined));
  }, [typedIngredients, basketIngredients, includeBasketIngredients]);

  const remainingFreeRecipes = Math.max(0, FREE_RECIPE_LIMIT - freeRecipeUsage);
  const hasFreeRecipeAccess = hasPlannerAccess || remainingFreeRecipes > 0;

  const savedRecipesPreview = savedRecipes.slice(0, 3);

  useEffect(() => {
    try {
      setHasPlannerAccess(localStorage.getItem(PLANNER_ACCESS_KEY) === "true");
    } catch {
      setHasPlannerAccess(false);
    }

    try {
      const storedUsage = localStorage.getItem(FREE_RECIPE_USAGE_KEY);
      const parsedUsage = storedUsage ? JSON.parse(storedUsage) : 0;
      setFreeRecipeUsage(typeof parsedUsage === "number" ? parsedUsage : 0);
    } catch {
      setFreeRecipeUsage(0);
    }

    try {
      const storedRecipes = localStorage.getItem(FAVOURITES_STORAGE_KEY);
      const parsedRecipes = storedRecipes ? JSON.parse(storedRecipes) : [];
      setSavedRecipes(Array.isArray(parsedRecipes) ? parsedRecipes : []);
    } catch {
      setSavedRecipes([]);
    }

    try {
      const storedPlannerRecipes = localStorage.getItem(
        PLANNER_RECIPES_STORAGE_KEY,
      );
      const parsedPlannerRecipes = storedPlannerRecipes
        ? JSON.parse(storedPlannerRecipes)
        : [];
      setPlannerRecipes(
        Array.isArray(parsedPlannerRecipes) ? parsedPlannerRecipes : [],
      );
    } catch {
      setPlannerRecipes([]);
    }

    try {
      const storedPreferences = localStorage.getItem(PREFERENCES_STORAGE_KEY);
      const parsedPreferences = storedPreferences
        ? JSON.parse(storedPreferences)
        : [];
      setSelectedPreferences(
        Array.isArray(parsedPreferences) ? parsedPreferences : [],
      );
    } catch {
      setSelectedPreferences([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      PREFERENCES_STORAGE_KEY,
      JSON.stringify(selectedPreferences),
    );
  }, [selectedPreferences]);

  useEffect(() => {
    if (!saveMessage) return;
    const timeout = window.setTimeout(() => setSaveMessage(""), 2500);
    return () => window.clearTimeout(timeout);
  }, [saveMessage]);

  useEffect(() => {
    if (!plannerMessage) return;
    const timeout = window.setTimeout(() => setPlannerMessage(""), 2500);
    return () => window.clearTimeout(timeout);
  }, [plannerMessage]);

  useEffect(() => {
    if (!basketMessage) return;
    const timeout = window.setTimeout(() => setBasketMessage(""), 2500);
    return () => window.clearTimeout(timeout);
  }, [basketMessage]);

  useEffect(() => {
    if (!paywallMessage) return;
    const timeout = window.setTimeout(() => setPaywallMessage(""), 4000);
    return () => window.clearTimeout(timeout);
  }, [paywallMessage]);

  useEffect(() => {
    if (!generatedRecipe && !aiError && !paywallMessage) return;

    const timeout = window.setTimeout(() => {
      resultRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 150);

    return () => window.clearTimeout(timeout);
  }, [generatedRecipe, aiError, paywallMessage]);

  const isCurrentRecipeSaved = useMemo(() => {
    if (!generatedRecipe) return false;

    return savedRecipes.some(
      (recipe) =>
        recipe.title === generatedRecipe.title &&
        recipe.description === generatedRecipe.description,
    );
  }, [generatedRecipe, savedRecipes]);

  const basketNormalised = useMemo(() => {
    return basketIngredients.map((item) => ({
      original: item,
      normalised: normaliseIngredient(item),
    }));
  }, [basketIngredients]);

  const ingredientBreakdown = useMemo(() => {
    if (!generatedRecipe) {
      return {
        alreadyHave: [] as string[],
        availableFromShop: [] as {
          ingredient: string;
          productName: string;
          price: number;
        }[],
        stillNeedElsewhere: [] as string[],
      };
    }

    const alreadyHave: string[] = [];
    const availableFromShop: {
      ingredient: string;
      productName: string;
      price: number;
    }[] = [];
    const stillNeedElsewhere: string[] = [];

    generatedRecipe.ingredientsUsed.forEach((ingredient) => {
      const normalisedRecipeIngredient = normaliseIngredient(ingredient);

      const basketMatch = basketNormalised.some(
        (basketItem) =>
          basketItem.normalised &&
          normalisedRecipeIngredient &&
          (basketItem.normalised.includes(normalisedRecipeIngredient) ||
            normalisedRecipeIngredient.includes(basketItem.normalised)),
      );

      if (basketMatch) {
        alreadyHave.push(ingredient);
        return;
      }

      const matchedShopItem = allShopItems.find((shopItem) => {
        const searchableText = [
          shopItem.name,
          shopItem.description,
          shopItem.details ?? "",
          ...(shopItem.weeklyIncludes ?? []),
        ]
          .join(" ")
          .toLowerCase();

        const normalisedShopText = normaliseIngredient(searchableText);

        return (
          normalisedRecipeIngredient.length > 0 &&
          (normalisedShopText.includes(normalisedRecipeIngredient) ||
            normalisedRecipeIngredient.includes(
              normaliseIngredient(shopItem.name),
            ))
        );
      });

      if (matchedShopItem) {
        const alreadyListed = availableFromShop.some(
          (entry) => entry.productName === matchedShopItem.name,
        );

        if (!alreadyListed) {
          availableFromShop.push({
            ingredient,
            productName: matchedShopItem.name,
            price: matchedShopItem.price,
          });
        }
      } else {
        stillNeedElsewhere.push(ingredient);
      }
    });

    return {
      alreadyHave,
      availableFromShop,
      stillNeedElsewhere,
    };
  }, [generatedRecipe, basketNormalised]);

  const matchedShopTotal = useMemo(() => {
    return ingredientBreakdown.availableFromShop.reduce(
      (sum, item) => sum + item.price,
      0,
    );
  }, [ingredientBreakdown.availableFromShop]);

  function persistPlannerRecipes(updatedPlannerRecipes: PlannerRecipe[]) {
    try {
      localStorage.setItem(
        PLANNER_RECIPES_STORAGE_KEY,
        JSON.stringify(updatedPlannerRecipes),
      );
      return true;
    } catch {
      setPlannerMessage(
        "We couldn’t save that to your planner right now. Please remove a few older planner items or favourites and try again.",
      );
      return false;
    }
  }

  async function handleGenerateRecipe() {
    if (!hasPlannerAccess && freeRecipeUsage >= FREE_RECIPE_LIMIT) {
      setAiError("");
      setGeneratedRecipe(null);
      setGeneratedImageUrl(null);
      setPaywallMessage(
        "You’ve used your free recipe ideas. Unlock unlimited recipes and the full planner, or get it included with a weekly produce box.",
      );
      return;
    }

    if (allIngredients.length === 0) {
      setAiError(
        "Type some ingredients, include your basket ingredients, or use both.",
      );
      setGeneratedRecipe(null);
      setGeneratedImageUrl(null);
      return;
    }

    generatorRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    try {
      setIsGenerating(true);
      setAiError("");
      setSaveMessage("");
      setPlannerMessage("");
      setBasketMessage("");
      setPaywallMessage("");
      setGeneratedRecipe(null);
      setGeneratedImageUrl(null);

      const response = await fetch("/api/recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: allIngredients,
          quickStart: selectedQuickStart,
          preferences: selectedPreferences,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate recipe.");
      }

      setGeneratedRecipe(data.recipe);
      setGeneratedImageUrl(data.imageUrl ?? null);

      if (!hasPlannerAccess) {
        const nextUsage = freeRecipeUsage + 1;
        setFreeRecipeUsage(nextUsage);
        localStorage.setItem(FREE_RECIPE_USAGE_KEY, JSON.stringify(nextUsage));
      }
    } catch {
      setAiError(
        "We couldn’t generate a recipe just now. Please try again in a moment.",
      );
    } finally {
      setIsGenerating(false);
    }
  }

  function handleSaveFavourite() {
    if (!hasPlannerAccess) {
      setSaveMessage(
        "Saving favourites is included with the planner, or free with any weekly produce box.",
      );
      return;
    }

    if (!generatedRecipe) return;

    const alreadySaved = savedRecipes.some(
      (recipe) =>
        recipe.title === generatedRecipe.title &&
        recipe.description === generatedRecipe.description,
    );

    if (alreadySaved) {
      setSaveMessage("This recipe is already in your favourites.");
      return;
    }

    const recipeToSave: SavedRecipe = {
      id: `${generatedRecipe.title}-${Date.now()}`,
      title: generatedRecipe.title,
      description: generatedRecipe.description,
      ingredientsUsed: generatedRecipe.ingredientsUsed,
      pantryStaples: generatedRecipe.pantryStaples,
      steps: generatedRecipe.steps,
      imageUrl: generatedImageUrl,
      savedAt: new Date().toISOString(),
    };

    const updatedRecipes = [recipeToSave, ...savedRecipes];
    setSavedRecipes(updatedRecipes);
    localStorage.setItem(
      FAVOURITES_STORAGE_KEY,
      JSON.stringify(updatedRecipes),
    );
    setSaveMessage("Saved to favourites.");
  }

  function handleOpenSavedRecipe(recipe: SavedRecipe) {
    setGeneratedRecipe({
      title: recipe.title,
      description: recipe.description,
      ingredientsUsed: recipe.ingredientsUsed,
      pantryStaples: recipe.pantryStaples,
      steps: recipe.steps,
    });
    setGeneratedImageUrl(recipe.imageUrl);
    setAiError("");
    setSaveMessage("");
    setPlannerMessage("");
    setBasketMessage("");
    setPaywallMessage("");
  }

  function handleAddSavedRecipeToPlanner(recipe: SavedRecipe) {
    if (!hasPlannerAccess) {
      setPlannerMessage(
        "The weekly planner is included with the planner subscription, or free with any weekly produce box.",
      );
      return;
    }

    const alreadyAdded = plannerRecipes.some((item) => item.id === recipe.id);

    if (alreadyAdded) {
      setPlannerMessage("That recipe is already in your planner.");
      return;
    }

    const plannerRecipe: PlannerRecipe = {
      id: recipe.id,
      title: recipe.title,
      description: recipe.description,
      ingredientsUsed: recipe.ingredientsUsed,
      imageUrl: recipe.imageUrl,
      savedAt: recipe.savedAt,
      addedToPlannerAt: new Date().toISOString(),
    };

    const updatedPlannerRecipes = [plannerRecipe, ...plannerRecipes];
    setPlannerRecipes(updatedPlannerRecipes);

    if (persistPlannerRecipes(updatedPlannerRecipes)) {
      setPlannerMessage("Added to planner.");
    } else {
      setPlannerRecipes(plannerRecipes);
    }
  }

  function isRecipeInPlanner(recipeId: string) {
    return plannerRecipes.some((recipe) => recipe.id === recipeId);
  }

  function togglePreference(preference: string) {
    setSelectedPreferences((current) => {
      if (current.includes(preference)) {
        return current.filter((item) => item !== preference);
      }

      return [...current, preference];
    });
  }

  function handleAddAvailableItemsToBasket() {
    const itemsToAdd = ingredientBreakdown.availableFromShop
      .map((entry) =>
        allShopItems.find((shopItem) => shopItem.name === entry.productName),
      )
      .filter(Boolean)
      .map((item) => ({
        name: item!.name,
        price: item!.price,
        image: item!.image,
        category: item!.category,
        checkoutType: item!.checkoutType,
      }));

    if (itemsToAdd.length === 0) {
      setBasketMessage("There weren’t any matching shop items to add.");
      return;
    }

    addManyToCart(itemsToAdd);
    setBasketMessage("Available ingredients have been added to your basket.");
  }

  function formatSavedDate(savedAt: string) {
    try {
      return new Date(savedAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      });
    } catch {
      return "";
    }
  }

  return (
    <main className="min-h-screen text-[#243328]">
      <header className="sticky top-0 z-30 border-b border-[rgba(230,221,210,0.9)] bg-[rgba(244,239,233,0.78)] backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 md:px-10">
          <Link
            href="/"
            className="text-sm tracking-[0.35em] text-[#60705f] hover:text-[#243328]"
          >
            THE LOCAL PANTRY
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
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
              href="/planner"
              className="text-sm text-[#4f5e52] hover:text-[#243328]"
            >
              Planner
            </Link>
          </nav>

          <Link
            href="/basket"
            className="inline-flex shrink-0 rounded-full border border-[#d6cec2] bg-[rgba(255,255,255,0.86)] px-4 py-2 text-sm text-[#243328] shadow-sm transition hover:bg-white"
          >
            Basket{totalItems > 0 ? ` (${totalItems})` : ""}
          </Link>
        </div>
      </header>

      <section className="px-4 pb-8 pt-10 sm:px-6 md:px-10 md:pb-12 md:pt-14">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[#6b776c]">
              Simple ideas for the week
            </p>

            <h1 className="mt-3 max-w-2xl font-serif text-4xl leading-tight tracking-tight md:text-6xl">
              Cook from what you already have.
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-[#5f675c] md:text-base">
              Type a few ingredients, choose a direction, and get a practical
              recipe idea you can cook, save, or turn into a basket.
            </p>
          </div>

          <div className="rounded-[28px] border border-[#ddd4c8] bg-[rgba(247,242,235,0.76)] p-5 backdrop-blur-md md:p-6">
            <p className="font-serif text-2xl">Start here.</p>
            <p className="mt-2 text-sm leading-6 text-[#5f675c]">
              No long browsing. No overcomplicated recipe wall. Just one useful
              meal idea at a time.
            </p>

            <button
              type="button"
              onClick={() =>
                generatorRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                })
              }
              className="mt-5 rounded-full bg-[#243328] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Make a recipe idea
            </button>
          </div>
        </div>
      </section>

      <section
        ref={generatorRef}
        className="border-y border-[rgba(230,221,210,0.86)] px-4 py-8 sm:px-6 md:px-10 md:py-12"
      >
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[28px] border border-[#ddd4c8] bg-[rgba(247,242,235,0.8)] p-5 backdrop-blur-md md:p-7">
              <p className="text-xs uppercase tracking-[0.18em] text-[#6b776c]">
                Recipe generator
              </p>

              <h2 className="mt-2 font-serif text-2xl md:text-3xl">
                What have you got?
              </h2>

              <p className="mt-3 text-sm leading-7 text-[#5f675c]">
                Add ingredients separated by commas. Keep it simple: courgette,
                beans, pasta, peppers.
              </p>

              <textarea
                value={customIngredients}
                onChange={(e) => setCustomIngredients(e.target.value)}
                placeholder="e.g. basil, tofu, rice"
                rows={5}
                className="mt-5 w-full rounded-[22px] border border-[#d6cec2] bg-[rgba(255,255,255,0.9)] px-4 py-3 text-sm text-[#243328] outline-none placeholder:text-[#7b8478] focus:border-[#a9b2a3]"
              />

              <div className="mt-4 flex flex-wrap gap-2">
                {quickStartOptions.map((option) => {
                  const isActive = selectedQuickStart === option.id;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() =>
                        setSelectedQuickStart((current) =>
                          current === option.id ? "" : option.id,
                        )
                      }
                      className={`rounded-full border px-4 py-2 text-sm transition ${
                        isActive
                          ? "border-[#aab7a4] bg-[#e9f0e4] text-[#243328]"
                          : "border-[#d6cec2] bg-[rgba(255,255,255,0.86)] text-[#4f5e52] hover:bg-white"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 rounded-[20px] border border-[#e6ddd2] bg-[rgba(255,255,255,0.52)] p-4">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={includeBasketIngredients}
                    onChange={(e) =>
                      setIncludeBasketIngredients(e.target.checked)
                    }
                    className="mt-1 h-4 w-4 rounded border-[#cfc6ba] text-[#243328] focus:ring-[#a9b2a3]"
                  />

                  <div>
                    <p className="text-sm font-medium text-[#243328]">
                      Include basket ingredients
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[#6b776c]">
                      Use anything already sitting in your basket.
                    </p>
                  </div>
                </label>

                {includeBasketIngredients && basketIngredients.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {basketIngredients.map((ingredient) => (
                      <span
                        key={ingredient}
                        className="rounded-full border border-[#d6cec2] bg-white px-3 py-1.5 text-sm text-[#4f5e52]"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setShowMoreOptions((current) => !current)}
                className="mt-4 text-sm text-[#4f5e52] underline underline-offset-4 hover:text-[#243328]"
              >
                {showMoreOptions ? "Hide options" : "More options"}
              </button>

              {showMoreOptions && (
                <div className="mt-4 rounded-[20px] border border-[#e6ddd2] bg-[rgba(255,255,255,0.52)] p-4">
                  <p className="text-sm font-medium text-[#243328]">
                    Preferences
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {preferenceOptions.map((preference) => {
                      const isSelected =
                        selectedPreferences.includes(preference);

                      return (
                        <button
                          key={preference}
                          type="button"
                          onClick={() => togglePreference(preference)}
                          className={`rounded-full border px-4 py-2 text-sm transition ${
                            isSelected
                              ? "border-[#aab7a4] bg-[#e9f0e4] text-[#243328]"
                              : "border-[#d6cec2] bg-white text-[#4f5e52] hover:bg-white"
                          }`}
                        >
                          {preference}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {allIngredients.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {allIngredients.map((ingredient) => (
                    <span
                      key={ingredient}
                      className="rounded-full border border-[#d6cec2] bg-[rgba(255,255,255,0.86)] px-3 py-1.5 text-sm text-[#4f5e52]"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              )}

              {!hasPlannerAccess && (
                <p className="mt-5 text-sm leading-6 text-[#6b776c]">
                  Free recipe ideas remaining:{" "}
                  <span className="font-medium text-[#243328]">
                    {remainingFreeRecipes}
                  </span>
                </p>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleGenerateRecipe}
                  disabled={isGenerating || !hasFreeRecipeAccess}
                  className="rounded-full bg-[#243328] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isGenerating
                    ? "Creating..."
                    : hasFreeRecipeAccess
                      ? "Generate recipe"
                      : "Unlock recipes"}
                </button>

                <Link
                  href="/planner"
                  className="rounded-full border border-[#d6cec2] bg-[rgba(255,255,255,0.86)] px-6 py-3 text-sm text-[#243328] transition hover:bg-white"
                >
                  Open planner
                </Link>
              </div>

              {aiError && (
                <div className="mt-5 rounded-[18px] border border-[#e4d8cb] bg-[#fbf6f0] px-4 py-3 text-sm text-[#6a5c4f]">
                  {aiError}
                </div>
              )}

              {paywallMessage && (
                <div className="mt-5 rounded-[18px] border border-[#ddd4c8] bg-[rgba(255,255,255,0.7)] px-4 py-4 text-sm text-[#5f675c]">
                  <p>{paywallMessage}</p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                      href="/pricing"
                      className="rounded-full bg-[#243328] px-5 py-2 text-sm text-white transition hover:opacity-90"
                    >
                      Unlock planner
                    </Link>

                    <Link
                      href="/shop"
                      className="rounded-full border border-[#d6cec2] bg-white px-5 py-2 text-sm text-[#243328] transition hover:bg-white"
                    >
                      See weekly boxes
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div ref={resultRef} className="scroll-mt-24">
              {isGenerating ? (
                <div className="overflow-hidden rounded-[28px] border border-[#d8d0c4] bg-[rgba(255,255,255,0.78)] backdrop-blur-md">
                  <div className="flex h-[320px] items-center justify-center bg-[rgba(248,244,238,0.78)]">
                    <div className="text-center">
                      <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#d6cec2] border-t-[#243328]" />
                      <p className="mt-4 font-medium text-[#243328]">
                        Creating your recipe
                      </p>
                      <p className="mt-2 text-sm text-[#667164]">
                        Pulling together something useful.
                      </p>
                    </div>
                  </div>
                </div>
              ) : generatedRecipe ? (
                <div className="overflow-hidden rounded-[28px] border border-[#d8d0c4] bg-[rgba(255,255,255,0.82)] backdrop-blur-md">
                  {generatedImageUrl && (
                    <img
                      src={generatedImageUrl}
                      alt={generatedRecipe.title}
                      className="h-[280px] w-full object-cover md:h-[360px]"
                    />
                  )}

                  <div className="p-6 md:p-8">
                    <p className="text-xs uppercase tracking-[0.18em] text-[#6b776c]">
                      Your recipe
                    </p>

                    <h3 className="mt-2 font-serif text-3xl">
                      {generatedRecipe.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-[#5f675c] md:text-base">
                      {generatedRecipe.description}
                    </p>

                    <div className="mt-6 grid gap-6 md:grid-cols-2">
                      <div>
                        <h4 className="text-sm font-medium uppercase tracking-[0.14em] text-[#6b776c]">
                          Ingredients
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

                    <div className="mt-7 rounded-[24px] border border-[#ddd4c8] bg-[rgba(247,242,235,0.76)] p-5">
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.16em] text-[#6b776c]">
                            Shop this recipe
                          </p>

                          <h4 className="mt-2 font-serif text-2xl">
                            Add what you need.
                          </h4>

                          <p className="mt-2 text-sm leading-6 text-[#5f675c]">
                            Estimated matched shop cost:{" "}
                            <span className="font-medium text-[#243328]">
                              £{matchedShopTotal.toFixed(2)}
                            </span>
                          </p>
                        </div>

                        {ingredientBreakdown.availableFromShop.length > 0 && (
                          <button
                            type="button"
                            onClick={handleAddAvailableItemsToBasket}
                            className="rounded-full bg-[#243328] px-5 py-2 text-sm text-white transition hover:opacity-90"
                          >
                            Add matched items
                          </button>
                        )}
                      </div>

                      <div className="mt-5 grid gap-4 md:grid-cols-3">
                        <div>
                          <p className="text-sm font-medium text-[#243328]">
                            Already have
                          </p>

                          <p className="mt-2 text-sm leading-6 text-[#5f675c]">
                            {ingredientBreakdown.alreadyHave.length > 0
                              ? ingredientBreakdown.alreadyHave.join(", ")
                              : "Nothing matched from your basket yet."}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-[#243328]">
                            From shop
                          </p>

                          <p className="mt-2 text-sm leading-6 text-[#5f675c]">
                            {ingredientBreakdown.availableFromShop.length > 0
                              ? ingredientBreakdown.availableFromShop
                                  .map((item) => item.productName)
                                  .join(", ")
                              : "No direct shop matches this time."}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-[#243328]">
                            Still need
                          </p>

                          <p className="mt-2 text-sm leading-6 text-[#5f675c]">
                            {ingredientBreakdown.stillNeedElsewhere.length > 0
                              ? ingredientBreakdown.stillNeedElsewhere.join(
                                  ", ",
                                )
                              : "You’re in good shape."}
                          </p>
                        </div>
                      </div>

                      {basketMessage && (
                        <div className="mt-4 rounded-[18px] border border-[#dbe4d5] bg-[#f4f8f1] px-4 py-3 text-sm text-[#425142]">
                          {basketMessage}
                        </div>
                      )}
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={handleGenerateRecipe}
                        disabled={isGenerating || !hasFreeRecipeAccess}
                        className="rounded-full border border-[#d6cec2] bg-[rgba(255,255,255,0.86)] px-5 py-2 text-sm text-[#243328] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Try another
                      </button>

                      <button
                        type="button"
                        onClick={handleSaveFavourite}
                        disabled={hasPlannerAccess && isCurrentRecipeSaved}
                        className="rounded-full bg-[#dde7d8] px-5 py-2 text-sm text-[#243328] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {hasPlannerAccess
                          ? isCurrentRecipeSaved
                            ? "Already saved"
                            : "Save recipe"
                          : "Save with planner"}
                      </button>

                      <Link
                        href="/planner"
                        className="rounded-full border border-[#d6cec2] bg-[rgba(255,255,255,0.86)] px-5 py-2 text-sm text-[#243328] transition hover:bg-white"
                      >
                        Plan week
                      </Link>
                    </div>

                    {saveMessage && (
                      <div className="mt-4 rounded-[18px] border border-[#dbe4d5] bg-[#f4f8f1] px-4 py-3 text-sm text-[#425142]">
                        {saveMessage}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="rounded-[28px] border border-[#ddd4c8] bg-[rgba(255,255,255,0.72)] p-6 backdrop-blur-md md:p-8">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#6b776c]">
                    What you’ll get
                  </p>

                  <h3 className="mt-2 font-serif text-2xl md:text-3xl">
                    One useful meal idea.
                  </h3>

                  <p className="mt-3 max-w-2xl text-sm leading-7 text-[#5f675c] md:text-base">
                    The result will appear here with ingredients, method, and a
                    simple shop match if anything fits your store.
                  </p>

                  <div className="mt-6 grid gap-3 md:grid-cols-3">
                    <div className="rounded-[18px] border border-[#e6ddd2] bg-[rgba(249,246,241,0.78)] p-4">
                      <p className="text-sm font-medium text-[#243328]">
                        Ingredients
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[#5f675c]">
                        Clear, usable, not fussy.
                      </p>
                    </div>

                    <div className="rounded-[18px] border border-[#e6ddd2] bg-[rgba(249,246,241,0.78)] p-4">
                      <p className="text-sm font-medium text-[#243328]">
                        Method
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[#5f675c]">
                        Steps you can actually follow.
                      </p>
                    </div>

                    <div className="rounded-[18px] border border-[#e6ddd2] bg-[rgba(249,246,241,0.78)] p-4">
                      <p className="text-sm font-medium text-[#243328]">
                        Basket match
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[#5f675c]">
                        Add available shop items quickly.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 md:px-10 md:py-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.18em] text-[#6b776c]">
                Featured recipes
              </p>

              <h2 className="mt-2 font-serif text-2xl md:text-3xl">
                Start with something good.
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#5f675c]">
                A couple of simple recipes to browse without crowding the page.
              </p>
            </div>

            <Link
              href="/recipes"
              className="text-sm text-[#4f5e52] underline underline-offset-4 hover:text-[#243328]"
            >
              View all recipes
            </Link>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {featuredRecipes.map((recipe) => (
              <RecipeCard key={recipe.slug} recipe={recipe} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[rgba(230,221,210,0.86)] px-4 py-10 sm:px-6 md:px-10 md:py-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.18em] text-[#6b776c]">
                Saved recipes
              </p>

              <h2 className="mt-2 font-serif text-2xl md:text-3xl">
                Favourites kept simple.
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#5f675c]">
                Your most recent saved recipes appear here.
              </p>
            </div>

            <Link
              href="/planner"
              className="text-sm text-[#4f5e52] underline underline-offset-4 hover:text-[#243328]"
            >
              Open planner
            </Link>
          </div>

          {savedRecipesPreview.length === 0 ? (
            <div className="mt-6 rounded-[24px] border border-[#ddd4c8] bg-[rgba(247,242,235,0.76)] p-6 backdrop-blur-md">
              <p className="text-sm leading-7 text-[#5f675c]">
                No saved recipes yet. Generate one you like and save it.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {savedRecipesPreview.map((recipe) => (
                <div
                  key={recipe.id}
                  className="overflow-hidden rounded-[24px] border border-[#ddd4c8] bg-[rgba(255,255,255,0.8)] backdrop-blur-md"
                >
                  {recipe.imageUrl && (
                    <img
                      src={recipe.imageUrl}
                      alt={recipe.title}
                      className="h-[180px] w-full object-cover"
                    />
                  )}

                  <div className="p-5">
                    <p className="text-xs uppercase tracking-[0.16em] text-[#6b776c]">
                      Saved {formatSavedDate(recipe.savedAt)}
                    </p>

                    <h3 className="mt-2 font-serif text-xl">{recipe.title}</h3>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#5f675c]">
                      {recipe.description}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenSavedRecipe(recipe)}
                        className="rounded-full bg-[#243328] px-4 py-2 text-sm text-white transition hover:opacity-90"
                      >
                        Open
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAddSavedRecipeToPlanner(recipe)}
                        disabled={
                          !hasPlannerAccess || isRecipeInPlanner(recipe.id)
                        }
                        className="rounded-full border border-[#d6cec2] bg-white px-4 py-2 text-sm text-[#243328] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {!hasPlannerAccess
                          ? "Planner"
                          : isRecipeInPlanner(recipe.id)
                            ? "Planned"
                            : "Plan"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {plannerMessage && (
            <div className="mt-6 rounded-[18px] border border-[#dbe4d5] bg-[#f4f8f1] px-4 py-3 text-sm text-[#425142]">
              {plannerMessage}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
