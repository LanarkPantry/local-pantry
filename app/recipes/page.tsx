"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "../cart-context";
import RecipeCard from "../components/RecipeCard";
import { prompts, recipes, useItUpIdeas } from "./recipes-data";
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

const FAVOURITES_STORAGE_KEY = "tlp_saved_favourite_recipes";
const PREFERENCES_STORAGE_KEY = "tlp_recipe_preferences";

const quickStartOptions = [
  {
    id: "quick-tonight",
    label: "Quick tonight",
    description: "Fast, simple, low-fuss cooking for this evening.",
  },
  {
    id: "comforting",
    label: "Comforting",
    description: "Something warm, satisfying, and cosy.",
  },
  {
    id: "use-what-ive-got",
    label: "Use what I’ve got",
    description: "Make the most of ingredients already on hand.",
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

  const recipeSectionRef = useRef<HTMLDivElement | null>(null);

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
  const [saveMessage, setSaveMessage] = useState("");
  const [selectedQuickStart, setSelectedQuickStart] = useState<string>("");
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [basketMessage, setBasketMessage] = useState("");

  const savouryRecipes = recipes.filter(
    (recipe) => recipe.category === "savoury",
  );
  const sweetRecipes = recipes.filter((recipe) => recipe.category === "sweet");
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

  useEffect(() => {
    try {
      const storedRecipes = localStorage.getItem(FAVOURITES_STORAGE_KEY);

      if (!storedRecipes) {
        setSavedRecipes([]);
      } else {
        const parsedRecipes = JSON.parse(storedRecipes) as SavedRecipe[];
        setSavedRecipes(Array.isArray(parsedRecipes) ? parsedRecipes : []);
      }
    } catch (error) {
      console.error("Failed to load saved recipes:", error);
      setSavedRecipes([]);
    }

    try {
      const storedPreferences = localStorage.getItem(PREFERENCES_STORAGE_KEY);

      if (!storedPreferences) {
        setSelectedPreferences([]);
      } else {
        const parsedPreferences = JSON.parse(storedPreferences) as string[];
        setSelectedPreferences(
          Array.isArray(parsedPreferences) ? parsedPreferences : [],
        );
      }
    } catch (error) {
      console.error("Failed to load saved preferences:", error);
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

    const timeout = window.setTimeout(() => {
      setSaveMessage("");
    }, 2500);

    return () => window.clearTimeout(timeout);
  }, [saveMessage]);

  useEffect(() => {
    if (!basketMessage) return;

    const timeout = window.setTimeout(() => {
      setBasketMessage("");
    }, 2500);

    return () => window.clearTimeout(timeout);
  }, [basketMessage]);

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

  async function handleGenerateRecipe() {
    if (allIngredients.length === 0) {
      setAiError(
        "Type some ingredients, include your basket ingredients, or use both.",
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
      setSaveMessage("");
      setBasketMessage("");
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

  function handleSaveFavourite() {
    if (!generatedRecipe) return;

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

    const alreadySaved = savedRecipes.some(
      (recipe) =>
        recipe.title === generatedRecipe.title &&
        recipe.description === generatedRecipe.description,
    );

    if (alreadySaved) {
      setSaveMessage("This recipe is already in your favourites.");
      return;
    }

    const updatedRecipes = [recipeToSave, ...savedRecipes];
    setSavedRecipes(updatedRecipes);
    localStorage.setItem(
      FAVOURITES_STORAGE_KEY,
      JSON.stringify(updatedRecipes),
    );
    setSaveMessage("Saved to favourites.");
  }

  function handleRemoveFavourite(recipeId: string) {
    const updatedRecipes = savedRecipes.filter(
      (recipe) => recipe.id !== recipeId,
    );
    setSavedRecipes(updatedRecipes);
    localStorage.setItem(
      FAVOURITES_STORAGE_KEY,
      JSON.stringify(updatedRecipes),
    );
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
    setBasketMessage("");

    recipeSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
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
        month: "long",
        year: "numeric",
      });
    } catch {
      return "";
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

      <section className="border-b border-[#e6ddd2] px-4 py-8 sm:px-6 md:px-10 md:py-10">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.18em] text-[#6b776c]">
              Start somewhere easy
            </p>
            <h2 className="mt-2 font-serif text-2xl md:text-3xl">
              Cook this tonight
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#5f675c]">
              Choose the kind of idea you’re in the mood for. It helps the AI
              shape the recipe without making things feel complicated.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
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
                  className={`rounded-[22px] border p-5 text-left transition ${
                    isActive
                      ? "border-[#aab7a4] bg-[#e9f0e4]"
                      : "border-[#ddd4c8] bg-[#f7f2eb] hover:bg-[#f4eee6]"
                  }`}
                >
                  <p className="font-medium text-[#243328]">{option.label}</p>
                  <p className="mt-2 text-sm leading-6 text-[#5f675c]">
                    {option.description}
                  </p>
                </button>
              );
            })}
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
                What can I cook today?
              </h2>

              <p className="mt-3 text-sm leading-7 text-[#5f675c] md:text-base">
                Type your own ingredients, optionally include your basket items,
                and get a recipe idea with an image.
              </p>
            </div>

            <div className="mt-6 rounded-[22px] border border-[#e1d8cc] bg-white/70 p-5">
              <div className="mt-0">
                <label
                  htmlFor="custom-ingredients"
                  className="text-sm font-medium text-[#243328]"
                >
                  Ingredients you want to cook with
                </label>
                <p className="mt-2 text-sm leading-6 text-[#6b776c]">
                  Type ingredients separated by commas, for example: basil,
                  tofu, rice
                </p>
                <textarea
                  id="custom-ingredients"
                  value={customIngredients}
                  onChange={(e) => setCustomIngredients(e.target.value)}
                  placeholder="e.g. basil, tofu, rice"
                  rows={4}
                  className="mt-3 w-full rounded-[20px] border border-[#d6cec2] bg-white px-4 py-3 text-sm text-[#243328] outline-none placeholder:text-[#7b8478] focus:border-[#a9b2a3]"
                />
              </div>

              <div className="mt-5">
                <p className="text-sm font-medium text-[#243328]">
                  Your cooking preferences
                </p>
                <p className="mt-2 text-sm leading-6 text-[#6b776c]">
                  Save a few preferences and the AI will quietly shape ideas
                  around them.
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {preferenceOptions.map((preference) => {
                    const isSelected = selectedPreferences.includes(preference);

                    return (
                      <button
                        key={preference}
                        type="button"
                        onClick={() => togglePreference(preference)}
                        className={`rounded-full border px-4 py-2 text-sm transition ${
                          isSelected
                            ? "border-[#aab7a4] bg-[#e9f0e4] text-[#243328]"
                            : "border-[#d6cec2] bg-white text-[#4f5e52] hover:bg-[#faf7f2]"
                        }`}
                      >
                        {preference}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-5 rounded-[18px] border border-[#e6ddd2] bg-[#f9f6f1] p-4">
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
                      Add the ingredients currently in your basket to the recipe
                      idea as well.
                    </p>
                  </div>
                </label>

                {includeBasketIngredients && (
                  <div className="mt-4">
                    {basketIngredients.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
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
                      <p className="text-sm leading-6 text-[#7a8478]">
                        Your basket is empty at the moment.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {allIngredients.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm font-medium text-[#243328]">
                    Ingredients being used
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {allIngredients.map((ingredient) => (
                      <span
                        key={ingredient}
                        className="rounded-full border border-[#d6cec2] bg-[#f9f6f1] px-3 py-1.5 text-sm text-[#4f5e52]"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(selectedQuickStart || selectedPreferences.length > 0) && (
                <div className="mt-6 rounded-[18px] border border-[#e6ddd2] bg-[#f9f6f1] p-4">
                  <p className="text-sm font-medium text-[#243328]">
                    This recipe will be shaped by
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedQuickStart && (
                      <span className="rounded-full border border-[#d6cec2] bg-white px-3 py-1.5 text-sm text-[#4f5e52]">
                        {
                          quickStartOptions.find(
                            (option) => option.id === selectedQuickStart,
                          )?.label
                        }
                      </span>
                    )}

                    {selectedPreferences.map((preference) => (
                      <span
                        key={preference}
                        className="rounded-full border border-[#d6cec2] bg-white px-3 py-1.5 text-sm text-[#4f5e52]"
                      >
                        {preference}
                      </span>
                    ))}
                  </div>
                </div>
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
                    : "Generate recipe idea"}
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

                  <div className="mt-6 rounded-[22px] border border-[#ddd4c8] bg-[#f7f2eb] p-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="max-w-2xl">
                        <p className="text-xs uppercase tracking-[0.16em] text-[#6b776c]">
                          Shop this recipe
                        </p>
                        <h4 className="mt-2 font-serif text-xl md:text-2xl">
                          Turn this idea into your next basket.
                        </h4>
                        <p className="mt-2 text-sm leading-6 text-[#5f675c]">
                          We’ve matched the recipe to products already in your
                          shop where we can.
                        </p>
                      </div>

                      <div className="rounded-[18px] border border-[#ddd4c8] bg-white px-4 py-3">
                        <p className="text-xs uppercase tracking-[0.14em] text-[#6b776c]">
                          Estimated added cost
                        </p>
                        <p className="mt-1 font-serif text-2xl text-[#243328]">
                          £{matchedShopTotal.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {ingredientBreakdown.availableFromShop.length > 0 ? (
                      <>
                        <div className="mt-5 grid gap-3 md:grid-cols-2">
                          {ingredientBreakdown.availableFromShop.map((item) => (
                            <div
                              key={item.productName}
                              className="rounded-[18px] border border-[#d6cec2] bg-white p-4"
                            >
                              <p className="text-sm font-medium text-[#243328]">
                                {item.productName}
                              </p>
                              <p className="mt-1 text-sm text-[#5f675c]">
                                Matches: {item.ingredient}
                              </p>
                              <p className="mt-2 text-sm text-[#5f675c]">
                                £{item.price.toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="mt-5 flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={handleAddAvailableItemsToBasket}
                            className="rounded-full bg-[#243328] px-5 py-2 text-sm text-white transition hover:opacity-90"
                          >
                            Add available items to basket
                          </button>

                          <Link
                            href="/basket"
                            className="rounded-full border border-[#d6cec2] bg-white px-5 py-2 text-sm text-[#243328] transition hover:bg-[#f5f1ea]"
                          >
                            Review basket
                          </Link>
                        </div>
                      </>
                    ) : (
                      <div className="mt-5 rounded-[18px] border border-[#ddd4c8] bg-white p-4">
                        <p className="text-sm leading-6 text-[#5f675c]">
                          We couldn’t find direct shop matches for this recipe
                          just yet, but you can still use the ingredient list as
                          a guide for your next order.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-3">
                    <div className="rounded-[20px] border border-[#e6ddd2] bg-[#f9f6f1] p-4">
                      <p className="text-sm font-medium text-[#243328]">
                        You already have
                      </p>

                      {ingredientBreakdown.alreadyHave.length > 0 ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {ingredientBreakdown.alreadyHave.map((item) => (
                            <span
                              key={item}
                              className="rounded-full border border-[#d6cec2] bg-white px-3 py-1.5 text-sm text-[#4f5e52]"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-3 text-sm leading-6 text-[#6b776c]">
                          Nothing in this recipe appears to be in your basket
                          yet.
                        </p>
                      )}
                    </div>

                    <div className="rounded-[20px] border border-[#e6ddd2] bg-[#f9f6f1] p-4">
                      <p className="text-sm font-medium text-[#243328]">
                        Available from our shop
                      </p>

                      {ingredientBreakdown.availableFromShop.length > 0 ? (
                        <div className="mt-3 space-y-2">
                          {ingredientBreakdown.availableFromShop.map((item) => (
                            <div
                              key={item.productName}
                              className="rounded-[16px] border border-[#d6cec2] bg-white px-3 py-3"
                            >
                              <p className="text-sm font-medium text-[#243328]">
                                {item.productName}
                              </p>
                              <p className="mt-1 text-sm text-[#5f675c]">
                                Matches: {item.ingredient}
                              </p>
                              <p className="mt-1 text-sm text-[#5f675c]">
                                £{item.price.toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-3 text-sm leading-6 text-[#6b776c]">
                          We couldn’t find a direct shop match for the remaining
                          ingredients this time.
                        </p>
                      )}
                    </div>

                    <div className="rounded-[20px] border border-[#e6ddd2] bg-[#f9f6f1] p-4">
                      <p className="text-sm font-medium text-[#243328]">
                        Still need elsewhere
                      </p>

                      {ingredientBreakdown.stillNeedElsewhere.length > 0 ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {ingredientBreakdown.stillNeedElsewhere.map(
                            (item) => (
                              <span
                                key={item}
                                className="rounded-full border border-[#d6cec2] bg-white px-3 py-1.5 text-sm text-[#4f5e52]"
                              >
                                {item}
                              </span>
                            ),
                          )}
                        </div>
                      ) : (
                        <p className="mt-3 text-sm leading-6 text-[#6b776c]">
                          You’re in good shape for this one.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleGenerateRecipe}
                      disabled={isGenerating}
                      className="rounded-full border border-[#d6cec2] bg-white px-5 py-2 text-sm text-[#243328] transition hover:bg-[#f5f1ea] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isGenerating ? "Creating..." : "Try another idea"}
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveFavourite}
                      disabled={isCurrentRecipeSaved}
                      className="rounded-full bg-[#dde7d8] px-5 py-2 text-sm text-[#243328] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isCurrentRecipeSaved
                        ? "Already saved"
                        : "Save to favourites"}
                    </button>
                  </div>

                  {saveMessage && (
                    <div className="mt-4 rounded-[18px] border border-[#dbe4d5] bg-[#f4f8f1] px-4 py-3 text-sm text-[#425142]">
                      {saveMessage}
                    </div>
                  )}

                  {basketMessage && (
                    <div className="mt-4 rounded-[18px] border border-[#dbe4d5] bg-[#f4f8f1] px-4 py-3 text-sm text-[#425142]">
                      {basketMessage}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="border-b border-[#e6ddd2] px-4 py-10 sm:px-6 md:px-10 md:py-12">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.18em] text-[#6b776c]">
              Saved recipes
            </p>
            <h2 className="mt-2 font-serif text-2xl md:text-3xl">
              Your favourites, kept for later.
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#5f675c]">
              Save the ideas you love and come back to them whenever you need
              something easy, useful, or comforting.
            </p>
          </div>

          {savedRecipes.length === 0 ? (
            <div className="mt-6 rounded-[24px] border border-[#ddd4c8] bg-[#f7f2eb] p-6">
              <p className="text-sm leading-7 text-[#5f675c]">
                You haven’t saved any recipes yet. Generate one you like and tap{" "}
                <span className="font-medium text-[#243328]">
                  Save to favourites
                </span>
                .
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {savedRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="overflow-hidden rounded-[24px] border border-[#ddd4c8] bg-white"
                >
                  {recipe.imageUrl && (
                    <img
                      src={recipe.imageUrl}
                      alt={recipe.title}
                      className="h-[220px] w-full object-cover"
                    />
                  )}

                  <div className="p-5 md:p-6">
                    <p className="text-xs uppercase tracking-[0.16em] text-[#6b776c]">
                      Saved {formatSavedDate(recipe.savedAt)}
                    </p>

                    <h3 className="mt-2 font-serif text-2xl">{recipe.title}</h3>

                    <p className="mt-3 text-sm leading-7 text-[#5f675c]">
                      {recipe.description}
                    </p>

                    <div className="mt-5">
                      <p className="text-sm font-medium text-[#243328]">
                        Ingredients used
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {recipe.ingredientsUsed.map((ingredient) => (
                          <span
                            key={ingredient}
                            className="rounded-full border border-[#d6cec2] bg-[#f9f6f1] px-3 py-1.5 text-sm text-[#4f5e52]"
                          >
                            {ingredient}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => handleOpenSavedRecipe(recipe)}
                        className="rounded-full bg-[#243328] px-5 py-2 text-sm text-white transition hover:opacity-90"
                      >
                        Open recipe
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemoveFavourite(recipe.id)}
                        className="rounded-full border border-[#d6cec2] bg-white px-5 py-2 text-sm text-[#243328] transition hover:bg-[#f5f1ea]"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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
