"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "../cart-context";
import { allShopItems, type ShopDisplayItem } from "./shop-data";

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

type ProductGroup = {
  key: string;
  title: string;
  items: ShopDisplayItem[];
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

const NUT_KEYWORDS = [
  "nut",
  "nuts",
  "almond",
  "almonds",
  "cashew",
  "cashews",
  "walnut",
  "walnuts",
  "pecan",
  "pecans",
  "hazelnut",
  "hazelnuts",
  "pistachio",
  "pistachios",
  "peanut",
  "peanuts",
  "mixed nuts",
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

function looksLikeNutItem(item: ShopDisplayItem) {
  const searchableText = [
    item.name,
    item.description,
    item.details ?? "",
    ...(item.weeklyIncludes ?? []),
  ]
    .join(" ")
    .toLowerCase();

  return NUT_KEYWORDS.some((keyword) => searchableText.includes(keyword));
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

function getProductTypeLabel(item: ShopDisplayItem) {
  if (item.category === "boxes") return "Produce box";
  if (item.category === "pantry") return "Gourmet jar";
  if (item.category === "cupboard") return "Pantry staple";
  if (looksLikeNutItem(item)) return "Nuts";
  return "Extra";
}

function getProductGroupTitle(item: ShopDisplayItem) {
  if (item.category === "boxes") return "Weekly Fruit & Veg Boxes";
  if (item.category === "pantry") return "Gourmet Jars";
  if (looksLikeNutItem(item)) return "Nuts";
  if (item.category === "cupboard") return "Pantry Staples";
  return "Extras";
}

function getWorksWellWith(item: ShopDisplayItem) {
  if (item.category === "pantry") {
    return ["toast", "crackers", "roast veg"];
  }

  if (looksLikeNutItem(item)) {
    return ["porridge", "yoghurt", "snacking"];
  }

  if (item.category === "cupboard") {
    return ["pasta", "soups", "traybakes"];
  }

  return ["simple meals", "weekly planning", "easy top-ups"];
}

export default function ShopRecipeCard(props: ShopRecipeCardProps) {
  const { starterBox, onStartWeeklyBox } = props;
  const { groupedCart, addToCart } = useCart();

  const basketItemNames = useMemo(
    () => groupedCart.map((entry) => entry.item.name),
    [groupedCart],
  );

  const starterBoxFromShop = useMemo(() => {
    if (!starterBox) return null;
    return allShopItems.find((item) => item.name === starterBox.name) ?? null;
  }, [starterBox]);

  const spotlightProducts = useMemo(() => {
    const oneOffItems = allShopItems.filter(
      (item) => item.checkoutType === "one-off",
    );

    if (starterBoxFromShop) {
      return [starterBoxFromShop, ...oneOffItems];
    }

    return oneOffItems;
  }, [starterBoxFromShop]);

  const productGroups = useMemo<ProductGroup[]>(() => {
    const orderedGroups = [
      "Weekly Fruit & Veg Boxes",
      "Gourmet Jars",
      "Pantry Staples",
      "Nuts",
      "Extras",
    ];

    const grouped = spotlightProducts.reduce<Record<string, ShopDisplayItem[]>>(
      (acc, item) => {
        const title = getProductGroupTitle(item);

        if (!acc[title]) {
          acc[title] = [];
        }

        acc[title].push(item);
        return acc;
      },
      {},
    );

    return orderedGroups
      .filter((title) => grouped[title]?.length)
      .map((title) => ({
        key: title.toLowerCase().replace(/[^\w]+/g, "-"),
        title,
        items: grouped[title],
      }));
  }, [spotlightProducts]);

  const defaultSelectedProduct = useMemo(() => {
    const pantryFirst =
      spotlightProducts.find((item) => item.category === "pantry") ??
      spotlightProducts.find((item) => item.category === "cupboard") ??
      spotlightProducts[0] ??
      null;

    return pantryFirst;
  }, [spotlightProducts]);

  const [selectedProductName, setSelectedProductName] = useState("");
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
  const [productMessage, setProductMessage] = useState("");
  const [showMethod, setShowMethod] = useState(false);

  useEffect(() => {
    if (!selectedProductName && defaultSelectedProduct) {
      setSelectedProductName(defaultSelectedProduct.name);
    }
  }, [defaultSelectedProduct, selectedProductName]);

  const selectedProduct = useMemo(() => {
    return (
      spotlightProducts.find((item) => item.name === selectedProductName) ??
      defaultSelectedProduct
    );
  }, [spotlightProducts, selectedProductName, defaultSelectedProduct]);

  const selectedProductInBasket = useMemo(() => {
    if (!selectedProduct) return false;
    return basketItemNames.includes(selectedProduct.name);
  }, [basketItemNames, selectedProduct]);

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

  const parsedItems = useMemo(
    () =>
      input
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    [input],
  );

  const selectedProductAnchorItems = useMemo(() => {
    if (!selectedProduct) return [];

    if (selectedProduct.category === "boxes") {
      return starterBoxIngredients.slice(0, 10);
    }

    return [selectedProduct.name];
  }, [selectedProduct, starterBoxIngredients]);

  const selectedProductWorksWellWith = useMemo(() => {
    if (!selectedProduct || selectedProduct.category === "boxes") return [];
    return getWorksWellWith(selectedProduct);
  }, [selectedProduct]);

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
    if (!productMessage) return;
    const timeout = window.setTimeout(() => setProductMessage(""), 2500);
    return () => window.clearTimeout(timeout);
  }, [productMessage]);

  useEffect(() => {
    setResult(null);
    setError("");
    setSaveMessage("");
    setPlannerMessage("");
    setBasketMessage("");
    setShowMethod(false);
  }, [selectedProductName]);

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

  const helperSummary = useMemo(() => {
    if (!selectedProduct) return "";

    const typedCount = parsedItems.length;
    const basketCount = useBasketItems ? basketItemNames.length : 0;

    if (selectedProduct.category === "boxes") {
      return `${starterBoxIngredients.slice(0, 8).length} likely box ingredients locked in${
        typedCount > 0
          ? ` + ${typedCount} extra item${typedCount === 1 ? "" : "s"}`
          : ""
      }${basketCount > 0 ? ` + ${basketCount} basket item${basketCount === 1 ? "" : "s"}` : ""}`;
    }

    return `${selectedProduct.name} locked in${
      typedCount > 0
        ? ` + ${typedCount} extra item${typedCount === 1 ? "" : "s"}`
        : ""
    }${basketCount > 0 ? ` + ${basketCount} basket item${basketCount === 1 ? "" : "s"}` : ""}`;
  }, [
    basketItemNames.length,
    parsedItems.length,
    selectedProduct,
    starterBoxIngredients,
    useBasketItems,
  ]);

  async function generateRecipeFromItems(itemsToUse: string[]) {
    setLoading(true);
    setError("");
    setResult(null);
    setSaveMessage("");
    setPlannerMessage("");
    setBasketMessage("");
    setShowMethod(false);

    const uniqueItems = Array.from(new Set(itemsToUse.filter(Boolean))).slice(
      0,
      16,
    );

    if (uniqueItems.length === 0) {
      setLoading(false);
      setError("Choose a product or add a few ingredients to get started.");
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

  function buildAnchoredItems(extraItems: string[] = []) {
    return [
      ...selectedProductAnchorItems,
      ...extraItems,
      ...(useBasketItems ? basketItemNames : []),
    ];
  }

  async function handleGenerate() {
    await generateRecipeFromItems(buildAnchoredItems(parsedItems));
  }

  async function handleTryAnother() {
    await generateRecipeFromItems(buildAnchoredItems(parsedItems));
  }

  async function handlePlanWithBoxIntent(intent: "veg" | "fruit" | "easy-box") {
    let itemsToUse: string[] = [];
    let quickStartValue = quickStart;

    if (intent === "veg") {
      itemsToUse =
        vegIngredients.length > 0 ? vegIngredients : starterBoxIngredients;
      quickStartValue = "use-what-ive-got";
    }

    if (intent === "fruit") {
      itemsToUse =
        fruitIngredients.length > 0 ? fruitIngredients : starterBoxIngredients;
      quickStartValue = "quick-tonight";
    }

    if (intent === "easy-box") {
      itemsToUse = starterBoxIngredients;
      quickStartValue = "comforting";
    }

    setQuickStart(quickStartValue);
    setUseBasketItems(true);
    setInput(itemsToUse.join(", "));

    await generateRecipeFromItems([
      ...itemsToUse,
      ...basketItemNames,
      ...selectedProductAnchorItems,
    ]);
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
      setPlannerMessage("Planned for later.");
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

    setBasketMessage("Matched items added to your basket.");
  }

  function handleAddSelectedProduct() {
    if (!selectedProduct) return;

    if (selectedProduct.category === "boxes" && onStartWeeklyBox) {
      onStartWeeklyBox();
      setProductMessage(`${selectedProduct.name} added to your basket.`);
      return;
    }

    addToCart({
      name: selectedProduct.name,
      price: selectedProduct.price,
      image: selectedProduct.image,
      category: selectedProduct.category,
      checkoutType: selectedProduct.checkoutType,
    });

    setProductMessage(`${selectedProduct.name} added to your basket.`);
  }

  return (
    <section
      id="shop-recipe-card"
      className="rounded-[22px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.78)] p-4 shadow-[0_10px_24px_rgba(36,51,40,0.05)] backdrop-blur-md md:rounded-[28px] md:p-5"
    >
      <div className="max-w-2xl">
        <p className="text-[10px] uppercase tracking-[0.18em] text-[#6b776c]">
          Shop ideas
        </p>

        <h2 className="mt-2 font-serif text-xl leading-tight md:text-3xl">
          Pick a product, then get an idea.
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#667164]">
          Choose one thing to anchor the meal, then shape the idea around it.
        </p>
      </div>

      <div className="mt-4 rounded-[18px] border border-[#ddd4c8] bg-[rgba(255,255,255,0.76)] p-3 md:rounded-[22px] md:p-4">
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-[#6b776c]">
              Choose a product
            </p>

            <div className="mt-2.5 space-y-2">
              {productGroups.map((group) => (
                <div key={group.key}>
                  <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#7a8478]">
                    {group.title}
                  </p>

                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {group.items.map((item) => {
                      const isActive = selectedProduct?.name === item.name;

                      return (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() => setSelectedProductName(item.name)}
                          className={`rounded-full border px-2.5 py-1 text-[11px] leading-4 transition sm:px-3 sm:py-1.5 sm:text-[12px] ${
                            isActive
                              ? "border-[#243328] bg-[#243328] font-semibold text-white shadow-[0_3px_8px_rgba(36,51,40,0.12)]"
                              : "border-[#ddd4c8] bg-[rgba(255,255,255,0.92)] font-medium text-[#4f5c50] hover:border-[#cfc4b6] hover:bg-white hover:text-[#243328]"
                          }`}
                        >
                          {item.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedProduct ? (
            <div className="overflow-hidden rounded-[16px] border border-[#e5ddcf] bg-[rgba(251,250,248,0.82)] md:rounded-[20px]">
              <div className="flex items-center gap-3 p-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[12px] border border-[#e9dfd2] bg-[rgba(255,255,255,0.78)] p-2 md:h-16 md:w-16">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-[#6b776c]">
                    {getProductTypeLabel(selectedProduct)}
                  </p>

                  <h3 className="mt-1 font-serif text-base leading-tight text-[#243328] md:text-lg">
                    {selectedProduct.name}
                  </h3>

                  {selectedProduct.category === "boxes" ? (
                    <p className="mt-1 text-[11px] leading-5 text-[#7a8478]">
                      Box ingredients stay locked in.
                    </p>
                  ) : selectedProductWorksWellWith.length > 0 ? (
                    <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] leading-5 text-[#7a8478]">
                      <span>Works well with</span>
                      {selectedProductWorksWellWith.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-[#e5ddcf] bg-[rgba(255,255,255,0.8)] px-2 py-0.5 text-[10px] text-[#5f675c]"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>

              {selectedProduct.category === "boxes" ? (
                <div className="border-t border-[#e9dfd2] px-3 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-[#6b776c]">
                      Usually includes
                    </p>
                    <p className="text-[10px] text-[#7a8478]">
                      {boxPreviewIngredients.length} shown
                    </p>
                  </div>

                  <div className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                    {boxPreviewIngredients.map((item) => (
                      <div
                        key={item}
                        className="flex h-7 items-center rounded-[10px] border border-[#e5ddcf] bg-[rgba(255,255,255,0.86)] px-2.5 text-[10px] text-[#5f675c] sm:h-8 sm:text-[11px]"
                        title={item}
                      >
                        <span className="block truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="border-t border-[#e9dfd2] px-3 py-3">
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-full border border-[#d6cec2] bg-[rgba(255,255,255,0.92)] px-4 py-2.5 text-sm font-medium text-[#243328] transition hover:bg-white disabled:opacity-60"
                >
                  {loading
                    ? "Getting an idea..."
                    : "What could I make with this?"}
                </button>

                {productMessage ? (
                  <div className="mt-3 rounded-[16px] border border-[#dbe4d5] bg-[#f4f8f1] px-3 py-2.5 text-sm text-[#425142]">
                    {productMessage}
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {selectedProduct?.category === "boxes" ? (
        <div className="mt-4 rounded-[18px] border border-[#ddd4c8] bg-[rgba(255,255,255,0.76)] p-3 md:rounded-[22px] md:p-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
            <div className="max-w-2xl">
              <p className="text-[10px] uppercase tracking-[0.14em] text-[#6b776c]">
                Quick box starts
              </p>
              <p className="mt-1.5 text-sm font-medium text-[#243328] md:text-base">
                Start from the box and nudge the idea in a useful direction.
              </p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handlePlanWithBoxIntent("veg")}
              disabled={loading}
              className="rounded-full border border-[#d6cec2] bg-[rgba(255,255,255,0.92)] px-3.5 py-2 text-sm font-medium text-[#243328] transition hover:bg-white disabled:opacity-60"
            >
              Use up the veg
            </button>

            <button
              type="button"
              onClick={() => handlePlanWithBoxIntent("fruit")}
              disabled={loading}
              className="rounded-full border border-[#d6cec2] bg-[rgba(255,255,255,0.92)] px-3.5 py-2 text-sm font-medium text-[#243328] transition hover:bg-white disabled:opacity-60"
            >
              Fruit-based idea
            </button>

            <button
              type="button"
              onClick={() => handlePlanWithBoxIntent("easy-box")}
              disabled={loading}
              className="rounded-full border border-[#d6cec2] bg-[rgba(255,255,255,0.92)] px-3.5 py-2 text-sm font-medium text-[#243328] transition hover:bg-white disabled:opacity-60"
            >
              Easy box meal
            </button>
          </div>
        </div>
      ) : null}

      <div className="mt-4 grid gap-4">
        <div className="rounded-[18px] border border-[#ddd4c8] bg-[rgba(255,255,255,0.76)] p-3 md:rounded-[22px] md:p-4">
          <div className="flex items-center justify-between gap-3">
            <label
              htmlFor="shop-recipe-input"
              className="block text-sm font-medium text-[#243328]"
            >
              Add a few extras if you like
            </label>

            <div className="hidden md:block h-px flex-1 bg-[#ece3d7]" />
          </div>

          <p className="mt-1 text-sm leading-6 text-[#667164]">
            The product stays fixed. These just shape the idea.
          </p>

          <input
            id="shop-recipe-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tomatoes, chickpeas, pasta, spinach"
            className="mt-3 w-full rounded-[18px] border border-[#d6cec2] bg-[rgba(255,255,255,0.88)] px-4 py-3 text-sm text-[#243328] outline-none placeholder:text-[#7b8478] focus:border-[#a9b2a3]"
          />

          <div className="mt-3 flex flex-col gap-2.5 md:flex-row md:items-center md:justify-between">
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

          <div className="mt-3 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading || !selectedProduct}
              className="inline-flex items-center justify-center rounded-full bg-[#2f4635] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
            >
              {loading
                ? "Getting an idea..."
                : selectedProduct
                  ? `Get an idea with ${selectedProduct.name}`
                  : "Get an idea"}
            </button>

            {helperSummary ? (
              <p className="text-xs leading-6 text-[#7a8478]">
                {helperSummary}
              </p>
            ) : null}
          </div>

          {error ? (
            <div className="mt-4 rounded-[18px] border border-[#e4d8cb] bg-[#fbf6f0] px-4 py-3 text-sm text-[#6a5c4f]">
              {error}
            </div>
          ) : null}
        </div>

        {result?.recipe ? (
          <div className="overflow-hidden rounded-[20px] border border-[#ddd4c8] bg-[rgba(255,255,255,0.76)] md:rounded-[24px]">
            {result.imageUrl ? (
              <div className="border-b border-[#e9dfd2] bg-[rgba(238,231,220,0.64)] p-3 md:p-4">
                <div className="overflow-hidden rounded-[18px] bg-[rgba(248,244,238,0.82)] md:rounded-[20px]">
                  <img
                    src={result.imageUrl}
                    alt={result.recipe.title}
                    className="h-44 w-full object-cover md:h-52"
                  />
                </div>
              </div>
            ) : null}

            <div className="p-4 md:p-5">
              <p className="text-[10px] uppercase tracking-[0.16em] text-[#6b776c]">
                What you could make with this
              </p>

              <h3 className="mt-2 font-serif text-xl leading-tight text-[#243328] md:text-2xl">
                {result.recipe.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-[#667164]">
                {result.recipe.description}
              </p>

              {result.recipe.ingredientsUsed.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {result.recipe.ingredientsUsed.slice(0, 10).map((item) => (
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
                  {isCurrentRecipeInPlanner ? "Already planned" : "Plan this"}
                </button>

                <button
                  type="button"
                  onClick={handleSaveFavourite}
                  disabled={isCurrentRecipeSaved}
                  className="rounded-full border border-[#d6cec2] bg-[rgba(255,255,255,0.88)] px-5 py-3 text-sm font-medium text-[#243328] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isCurrentRecipeSaved ? "Already saved" : "Save"}
                </button>

                <button
                  type="button"
                  onClick={handleTryAnother}
                  disabled={loading}
                  className="text-sm text-[#5f675c] underline underline-offset-4 transition hover:text-[#243328] disabled:opacity-60"
                >
                  Try another idea
                </button>
              </div>

              {result.recipe.steps.length > 0 ? (
                <div className="mt-5">
                  <button
                    type="button"
                    onClick={() => setShowMethod((current) => !current)}
                    className="text-sm text-[#5f675c] underline underline-offset-4 transition hover:text-[#243328]"
                  >
                    {showMethod ? "Hide method" : "Show method"}
                  </button>

                  {showMethod ? (
                    <ol className="mt-4 space-y-3 text-sm leading-6 text-[#243328]">
                      {result.recipe.steps.map((step, index) => (
                        <li key={`${index}-${step}`} className="flex gap-3">
                          <span className="mt-[2px] inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#d6cec2] text-[10px]">
                            {index + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  ) : null}
                </div>
              ) : null}

              {saveMessage ? (
                <div className="mt-4 rounded-[16px] border border-[#dbe4d5] bg-[#f4f8f1] px-4 py-3 text-sm text-[#425142]">
                  {saveMessage}
                </div>
              ) : null}

              {plannerMessage ? (
                <div className="mt-4 rounded-[16px] border border-[#dbe4d5] bg-[#f4f8f1] px-4 py-3 text-sm text-[#425142]">
                  {plannerMessage}
                </div>
              ) : null}

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <button
                  type="button"
                  onClick={handleAddSelectedProduct}
                  className="inline-flex items-center justify-center rounded-full bg-[#2f4635] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
                >
                  {selectedProduct?.category === "boxes"
                    ? starterBoxAlreadyInBasket
                      ? "Add weekly box again"
                      : "Add weekly box"
                    : selectedProductInBasket
                      ? `Add another ${selectedProduct?.name}`
                      : `Add ${selectedProduct?.name} to basket`}
                </button>

                {productMessage ? (
                  <p className="text-sm text-[#5f675c]">{productMessage}</p>
                ) : null}
              </div>

              <div className="mt-6 rounded-[18px] border border-[#ddd4c8] bg-[rgba(247,242,235,0.76)] p-4 md:rounded-[22px] md:p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="max-w-2xl">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-[#6b776c]">
                      Build the basket around it
                    </p>
                    <h4 className="mt-2 font-serif text-lg md:text-2xl">
                      Turn this into your next order.
                    </h4>
                    <p className="mt-2 text-sm leading-6 text-[#5f675c]">
                      We’ve matched the recipe to products already in the shop
                      where we can. The highlighted product stays at the centre,
                      then you can top up around it.
                    </p>
                  </div>

                  <div className="rounded-[16px] border border-[#ddd4c8] bg-[rgba(255,255,255,0.82)] px-4 py-3">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-[#6b776c]">
                      Matched extras
                    </p>
                    <p className="mt-1 font-serif text-xl text-[#243328] md:text-2xl">
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
                          className="rounded-[16px] border border-[#d6cec2] bg-[rgba(255,255,255,0.84)] p-4"
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
                  <div className="mt-5 rounded-[16px] border border-[#ddd4c8] bg-[rgba(255,255,255,0.82)] p-4">
                    <p className="text-sm leading-6 text-[#5f675c]">
                      We couldn’t find direct shop matches for this one yet, but
                      the idea still gives you a useful way to build around{" "}
                      {selectedProduct?.name}.
                    </p>
                  </div>
                )}

                {basketMessage ? (
                  <div className="mt-4 rounded-[16px] border border-[#dbe4d5] bg-[#f4f8f1] px-4 py-3 text-sm text-[#425142]">
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
