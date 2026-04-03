"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "../cart-context";
import { allShopItems } from "./shop-data";

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

type ShopRecipeCardProps = {
  starterBox?: StarterBox | null;
  onStartWeeklyBox?: () => void;
};

const FAVOURITES_STORAGE_KEY = "tlp_saved_favourite_recipes";
const PLANNER_RECIPES_STORAGE_KEY = "tlp_planner_recipes";

const DEFAULT_BOX_INGREDIENTS = [
  "potatoes",
  "onions",
  "garlic",
  "carrots",
  "celery",
  "sweet potato",
  "peppers",
  "courgette",
  "ginger",
  "leeks",
  "lettuce",
  "cucumber",
  "tomatoes",
  "spinach",
  "basil",
  "rosemary",
  "thyme",
  "coriander",
  "avocado",
  "broccoli",
  "bananas",
  "apples",
  "oranges",
  "strawberries",
  "grapes",
  "melon",
  "seasonal extras",
  "occasional specials like lychees, dragon fruit, Jerusalem artichokes or pineapple",
];

const FRUIT_KEYWORDS = [
  "apple",
  "banana",
  "orange",
  "strawberry",
  "grape",
  "melon",
  "pineapple",
  "lychee",
  "dragon fruit",
  "avocado",
];

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

function looksLikeFruit(value: string) {
  const normalised = normaliseIngredient(value);
  return FRUIT_KEYWORDS.some((keyword) => normalised.includes(keyword));
}

function normalisePlannerRecipe(value: unknown, index: number): PlannerRecipe {
  const recipe = (value ?? {}) as Record<string, unknown>;

  const title =
    typeof recipe.title === "string" && recipe.title.trim()
      ? recipe.title.trim()
      : `Saved recipe ${index + 1}`;

  const description =
    typeof recipe.description === "string" ? recipe.description : "";

  const ingredientsUsed = Array.isArray(recipe.ingredientsUsed)
    ? recipe.ingredientsUsed.filter(
        (item): item is string =>
          typeof item === "string" && item.trim().length > 0,
      )
    : Array.isArray(recipe.ingredients)
      ? recipe.ingredients.filter(
          (item): item is string =>
            typeof item === "string" && item.trim().length > 0,
        )
      : [];

  return {
    id:
      typeof recipe.id === "string" && recipe.id.trim()
        ? recipe.id
        : `${title}-${index}`,
    title,
    description,
    ingredientsUsed,
    imageUrl: typeof recipe.imageUrl === "string" ? recipe.imageUrl : null,
    savedAt:
      typeof recipe.savedAt === "string"
        ? recipe.savedAt
        : new Date().toISOString(),
    addedToPlannerAt:
      typeof recipe.addedToPlannerAt === "string"
        ? recipe.addedToPlannerAt
        : new Date().toISOString(),
  };
}

function readPlannerRecipes(): PlannerRecipe[] {
  try {
    const raw = localStorage.getItem(PLANNER_RECIPES_STORAGE_KEY);

    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;

    if (!Array.isArray(parsed)) return [];

    return parsed.map((item, index) => normalisePlannerRecipe(item, index));
  } catch {
    return [];
  }
}

function writePlannerRecipes(value: PlannerRecipe[]) {
  localStorage.setItem(PLANNER_RECIPES_STORAGE_KEY, JSON.stringify(value));
}

export default function ShopRecipeCard({
  starterBox,
  onStartWeeklyBox,
}: ShopRecipeCardProps) {
  const { groupedCart, addToCart } = useCart();

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

  const fruitIngredients = useMemo(() => {
    return starterBoxIngredients.filter(looksLikeFruit);
  }, [starterBoxIngredients]);

  const vegIngredients = useMemo(() => {
    return starterBoxIngredients.filter((item) => !looksLikeFruit(item));
  }, [starterBoxIngredients]);

  const boxPreviewIngredients = useMemo(() => {
    const preferredPreview = [
      "potatoes",
      "onions",
      "carrots",
      "leeks",
      "tomatoes",
      "spinach",
      "broccoli",
      "apples",
      "bananas",
      "oranges",
    ];

    const available = preferredPreview.filter((item) =>
      starterBoxIngredients.some(
        (ingredient) =>
          normaliseIngredient(ingredient) === normaliseIngredient(item),
      ),
    );

    if (available.length >= 6) {
      return available.slice(0, 6);
    }

    return starterBoxIngredients.slice(0, 6);
  }, [starterBoxIngredients]);

  const [input, setInput] = useState("");
  const [useBasketItems, setUseBasketItems] = useState(true);
  const [quickStart, setQuickStart] = useState("quick-tonight");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<RecipeResponse | null>(null);

  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
  const [plannerRecipes, setPlannerRecipes] = useState<PlannerRecipe[]>([]);
  const [saveMessage, setSaveMessage] = useState("");
  const [plannerMessage, setPlannerMessage] = useState("");
  const [basketMessage, setBasketMessage] = useState("");
  const [boxPlanMessage, setBoxPlanMessage] = useState("");

  const parsedItems = useMemo(
    () =>
      input
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    [input],
  );

  useEffect(() => {
    try {
      const storedRecipes = localStorage.getItem(FAVOURITES_STORAGE_KEY);

      if (!storedRecipes) {
        setSavedRecipes([]);
      } else {
        const parsedRecipes = JSON.parse(storedRecipes) as SavedRecipe[];
        setSavedRecipes(Array.isArray(parsedRecipes) ? parsedRecipes : []);
      }
    } catch {
      setSavedRecipes([]);
    }

    try {
      const normalisedPlannerRecipes = readPlannerRecipes();
      setPlannerRecipes(normalisedPlannerRecipes);
      writePlannerRecipes(normalisedPlannerRecipes);
    } catch {
      setPlannerRecipes([]);
    }
  }, []);

  useEffect(() => {
    if (!starterBoxAlreadyInBasket) return;
    setUseBasketItems(true);
  }, [starterBoxAlreadyInBasket]);

  useEffect(() => {
    if (!saveMessage) return;
    const timeout = window.setTimeout(() => setSaveMessage(""), 2500);
    return () => window.clearTimeout(timeout);
  }, [saveMessage]);

  useEffect(() => {
    if (!plannerMessage) return;
    const timeout = window.setTimeout(() => setPlannerMessage(""), 3000);
    return () => window.clearTimeout(timeout);
  }, [plannerMessage]);

  useEffect(() => {
    if (!basketMessage) return;
    const timeout = window.setTimeout(() => setBasketMessage(""), 2500);
    return () => window.clearTimeout(timeout);
  }, [basketMessage]);

  useEffect(() => {
    if (!boxPlanMessage) return;
    const timeout = window.setTimeout(() => setBoxPlanMessage(""), 2500);
    return () => window.clearTimeout(timeout);
  }, [boxPlanMessage]);

  const isCurrentRecipeSaved = useMemo(() => {
    if (!result?.recipe) return false;

    return savedRecipes.some(
      (recipe) =>
        recipe.title === result.recipe.title &&
        recipe.description === result.recipe.description,
    );
  }, [result, savedRecipes]);

  const currentRecipePlannerId = useMemo(() => {
    if (!result?.recipe) return null;

    const savedMatch = savedRecipes.find(
      (recipe) =>
        recipe.title === result.recipe.title &&
        recipe.description === result.recipe.description,
    );

    if (savedMatch) return savedMatch.id;

    return `${result.recipe.title}::${result.recipe.description}`;
  }, [result, savedRecipes]);

  const isCurrentRecipeInPlanner = useMemo(() => {
    if (!currentRecipePlannerId) return false;

    return plannerRecipes.some(
      (recipe) => recipe.id === currentRecipePlannerId,
    );
  }, [plannerRecipes, currentRecipePlannerId]);

  const basketNormalised = useMemo(() => {
    return basketItemNames.map((item) => ({
      original: item,
      normalised: normaliseIngredient(item),
    }));
  }, [basketItemNames]);

  const ingredientBreakdown = useMemo(() => {
    if (!result?.recipe) {
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

    result.recipe.ingredientsUsed.forEach((ingredient) => {
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
  }, [result, basketNormalised]);

  const matchedShopTotal = useMemo(() => {
    return ingredientBreakdown.availableFromShop.reduce(
      (sum, item) => sum + item.price,
      0,
    );
  }, [ingredientBreakdown.availableFromShop]);

  async function generateRecipeFromItems(itemsToUse: string[]) {
    setLoading(true);
    setError("");
    setResult(null);
    setSaveMessage("");
    setPlannerMessage("");
    setBasketMessage("");

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

  async function handlePlanWithBoxIntent(intent: "veg" | "fruit" | "easy-box") {
    let itemsToUse: string[] = [];
    let quickStartValue = quickStart;
    let message = "";

    if (intent === "veg") {
      itemsToUse =
        vegIngredients.length > 0 ? vegIngredients : starterBoxIngredients;
      quickStartValue = "use-what-ive-got";
      message =
        vegIngredients.length > 0
          ? "Planning around the veg in this week’s box."
          : "Planning around this week’s box.";
    }

    if (intent === "fruit") {
      itemsToUse =
        fruitIngredients.length > 0 ? fruitIngredients : starterBoxIngredients;
      quickStartValue = "quick-tonight";
      message =
        fruitIngredients.length > 0
          ? "Looking at ideas that make use of the fruit in this week’s box."
          : "Using what’s in the box as a starting point.";
    }

    if (intent === "easy-box") {
      itemsToUse = starterBoxIngredients;
      quickStartValue = "quick-tonight";
      message = "Building an easy meal around this week’s box.";
    }

    setQuickStart(quickStartValue);
    setUseBasketItems(true);
    setInput(itemsToUse.join(", "));
    setBoxPlanMessage(message);

    setLoading(true);
    setError("");
    setResult(null);
    setSaveMessage("");
    setPlannerMessage("");
    setBasketMessage("");

    const uniqueItems = Array.from(
      new Set([...itemsToUse, ...basketItemNames].filter(Boolean)),
    ).slice(0, 16);

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
          quickStart: quickStartValue,
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

  function handleSaveFavourite() {
    if (!result?.recipe) return;

    const alreadySaved = savedRecipes.some(
      (recipe) =>
        recipe.title === result.recipe.title &&
        recipe.description === result.recipe.description,
    );

    if (alreadySaved) {
      setSaveMessage("This recipe is already in your favourites.");
      return;
    }

    const recipeToSave: SavedRecipe = {
      id: `${result.recipe.title}-${Date.now()}`,
      title: result.recipe.title,
      description: result.recipe.description,
      ingredientsUsed: result.recipe.ingredientsUsed,
      pantryStaples: result.recipe.pantryStaples,
      steps: result.recipe.steps,
      imageUrl: result.imageUrl,
      savedAt: new Date().toISOString(),
    };

    const updatedRecipes = [recipeToSave, ...savedRecipes];
    setSavedRecipes(updatedRecipes);

    try {
      localStorage.setItem(
        FAVOURITES_STORAGE_KEY,
        JSON.stringify(updatedRecipes),
      );
      setSaveMessage("Saved to favourites.");
    } catch {
      setSavedRecipes(savedRecipes);
      setSaveMessage(
        "We couldn’t save that just now because your browser storage is full.",
      );
    }
  }

  function handleAddToPlanner() {
    if (!result?.recipe) return;

    const savedMatch = savedRecipes.find(
      (recipe) =>
        recipe.title === result.recipe.title &&
        recipe.description === result.recipe.description,
    );

    const baseId =
      savedMatch?.id ?? `${result.recipe.title}::${result.recipe.description}`;

    const alreadyAdded = plannerRecipes.some((item) => item.id === baseId);

    if (alreadyAdded) {
      setPlannerMessage("That recipe is already ready in your planner.");
      return;
    }

    const plannerRecipe: PlannerRecipe = {
      id: baseId,
      title: result.recipe.title,
      description: result.recipe.description,
      ingredientsUsed: result.recipe.ingredientsUsed,
      imageUrl: result.imageUrl,
      savedAt: savedMatch?.savedAt ?? new Date().toISOString(),
      addedToPlannerAt: new Date().toISOString(),
    };

    const updatedPlannerRecipes = [plannerRecipe, ...plannerRecipes];

    try {
      writePlannerRecipes(updatedPlannerRecipes);
      setPlannerRecipes(updatedPlannerRecipes);
      setPlannerMessage("Added to planner.");
    } catch {
      setPlannerMessage(
        "Your planner is full in this browser. Remove a few older planner items and try again.",
      );
    }
  }

  function handleAddAvailableItemsToBasket() {
    const itemsToAdd = ingredientBreakdown.availableFromShop
      .map((entry) =>
        allShopItems.find((shopItem) => shopItem.name === entry.productName),
      )
      .filter(Boolean);

    if (itemsToAdd.length === 0) {
      setBasketMessage("There weren’t any matching shop items to add.");
      return;
    }

    itemsToAdd.forEach((item) => {
      addToCart({
        name: item!.name,
        price: item!.price,
        image: item!.image,
        category: item!.category,
        checkoutType: item!.checkoutType,
      });
    });

    setBasketMessage("Available ingredients have been added to your basket.");
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
      <div className="flex flex-col gap-4">
        <div className="max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
            Meal generator
          </p>

          <h2 className="mt-2 font-serif text-2xl leading-tight md:text-3xl">
            Start with what you’ve got, then decide what to shop.
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#667164]">
            This works as a planning tool wherever you are. And if you’re in our
            delivery area, we can help turn the recipe into your next basket.
          </p>
        </div>

        <div className="rounded-[22px] border border-[#ddd4c8] bg-[rgba(255,255,255,0.76)] p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="max-w-2xl">
              <p className="text-[11px] uppercase tracking-[0.14em] text-[#6b776c]">
                Plan from your box
              </p>
              <p className="mt-2 text-base font-medium text-[#243328]">
                Use the week’s fruit and veg as your starting point, then build
                a meal around what arrives.
              </p>
              <p className="mt-2 text-sm leading-6 text-[#5f675c]">
                The contents shift through the week, so think of this as a
                useful guide rather than a fixed list.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                onClick={onStartWeeklyBox}
                className="inline-flex items-center justify-center rounded-full bg-[#2f4635] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
              >
                {starterBoxAlreadyInBasket
                  ? "Weekly box added"
                  : "Add weekly box"}
              </button>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handlePlanWithBoxIntent("veg")}
              disabled={loading}
              className="rounded-full border border-[#d6cec2] bg-[rgba(255,255,255,0.92)] px-4 py-2 text-sm font-medium text-[#243328] transition hover:bg-white disabled:opacity-60"
            >
              Use up the veg
            </button>

            <button
              type="button"
              onClick={() => handlePlanWithBoxIntent("fruit")}
              disabled={loading}
              className="rounded-full border border-[#d6cec2] bg-[rgba(255,255,255,0.92)] px-4 py-2 text-sm font-medium text-[#243328] transition hover:bg-white disabled:opacity-60"
            >
              Use up the fruit
            </button>

            <button
              type="button"
              onClick={() => handlePlanWithBoxIntent("easy-box")}
              disabled={loading}
              className="rounded-full border border-[#d6cec2] bg-[rgba(255,255,255,0.92)] px-4 py-2 text-sm font-medium text-[#243328] transition hover:bg-white disabled:opacity-60"
            >
              Easy box meal
            </button>
          </div>

          {boxPlanMessage ? (
            <div className="mt-4 rounded-[18px] border border-[#dbe4d5] bg-[#f4f8f1] px-4 py-3 text-sm text-[#425142]">
              {boxPlanMessage}
            </div>
          ) : null}

          <div className="mt-4 rounded-[18px] border border-[#e5ddcf] bg-[rgba(251,250,248,0.82)] p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-[#6b776c]">
              Usually includes things like
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              {boxPreviewIngredients.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[#e5ddcf] bg-[rgba(255,255,255,0.86)] px-3 py-1 text-sm text-[#5f675c]"
                >
                  {item}
                </span>
              ))}
            </div>

            <p className="mt-3 text-sm leading-6 text-[#5f675c]">
              Alongside herbs, fruit, and changing seasonal extras.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4">
        <div>
          <label
            htmlFor="shop-recipe-input"
            className="mb-2 block text-sm font-medium text-[#243328]"
          >
            Add a few ingredients
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
            {loading ? "Generating..." : "Generate meal idea"}
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
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#6b776c]">
                Meal idea
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
                  onClick={handleAddToPlanner}
                  disabled={isCurrentRecipeInPlanner}
                  className="rounded-full bg-[#2f4635] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isCurrentRecipeInPlanner ? "In planner" : "Add to planner"}
                </button>

                <button
                  type="button"
                  onClick={handleSaveFavourite}
                  disabled={isCurrentRecipeSaved}
                  className="rounded-full border border-[#d6cec2] bg-[rgba(255,255,255,0.88)] px-5 py-3 text-sm font-medium text-[#243328] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isCurrentRecipeSaved
                    ? "Already saved"
                    : "Save to favourites"}
                </button>

                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={loading}
                  className="text-sm text-[#5f675c] underline underline-offset-4 transition hover:text-[#243328] disabled:opacity-60"
                >
                  Try another idea
                </button>
              </div>

              {saveMessage ? (
                <div className="mt-4 rounded-[18px] border border-[#dbe4d5] bg-[#f4f8f1] px-4 py-3 text-sm text-[#425142]">
                  {saveMessage}
                </div>
              ) : null}

              {plannerMessage ? (
                <div className="mt-4 rounded-[18px] border border-[#dbe4d5] bg-[#f4f8f1] px-4 py-3 text-sm text-[#425142]">
                  {plannerMessage}
                </div>
              ) : null}

              <div className="mt-6 rounded-[22px] border border-[#ddd4c8] bg-[rgba(247,242,235,0.76)] p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="max-w-2xl">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-[#6b776c]">
                      If you’re in our delivery area
                    </p>
                    <h4 className="mt-2 font-serif text-xl md:text-2xl">
                      Turn this into your next basket.
                    </h4>
                    <p className="mt-2 text-sm leading-6 text-[#5f675c]">
                      We’ve matched the recipe to products already in the shop
                      where we can. If you’re not local, you can still use this
                      as a useful shopping guide.
                    </p>
                  </div>

                  <div className="rounded-[18px] border border-[#ddd4c8] bg-[rgba(255,255,255,0.82)] px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-[#6b776c]">
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
                          className="rounded-[18px] border border-[#d6cec2] bg-[rgba(255,255,255,0.84)] p-4"
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
                        Add matched items
                      </button>

                      <Link
                        href="/basket"
                        className="rounded-full border border-[#d6cec2] bg-[rgba(255,255,255,0.86)] px-5 py-2 text-sm text-[#243328] transition hover:bg-white"
                      >
                        Review basket
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="mt-5 rounded-[18px] border border-[#ddd4c8] bg-[rgba(255,255,255,0.82)] p-4">
                    <p className="text-sm leading-6 text-[#5f675c]">
                      We couldn’t find direct shop matches for this one yet, but
                      the ingredient list still gives you a useful plan for the
                      week.
                    </p>
                  </div>
                )}

                {basketMessage ? (
                  <div className="mt-4 rounded-[18px] border border-[#dbe4d5] bg-[#f4f8f1] px-4 py-3 text-sm text-[#425142]">
                    {basketMessage}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
