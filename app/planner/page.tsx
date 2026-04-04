"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "../cart-context";
import {
  allShopItems,
  produceBoxes,
  type ShopDisplayItem,
} from "../shop/shop-data";

type RecipeLike = {
  id: string;
  title: string;
  description?: string;
  image?: string;
  imageUrl?: string;
  prompt?: string;
  ingredients?: string[];
  ingredientsUsed?: string[];
  pantryStaples?: string[];
  steps?: string[];
  basketMatches?: Array<{
    id?: string;
    name?: string;
    title?: string;
    quantity?: number;
  }>;
  savedAt?: string;
  addedToPlannerAt?: string;
};

type WeeklyMeals = Record<string, string | null>;

type GeneratedRecipe = {
  title: string;
  description: string;
  ingredientsUsed: string[];
  pantryStaples: string[];
  steps: string[];
};

type PlannerPanelMode = "idea" | "recipes" | null;

type WeekPlanPreviewItem = {
  day: string;
  recipe: RecipeLike;
};

const SAVED_FAVOURITES_KEY = "tlp_saved_favourite_recipes";
const PLANNER_RECIPES_KEY = "tlp_planner_recipes";
const WEEKLY_MEALS_KEY = "tlp_weekly_planner_meals";
const PLANNER_ACCESS_KEY = "tlp_planner_access";
const FREE_RECIPE_USAGE_KEY = "tlp_free_recipe_usage";
const FREE_RECIPE_LIMIT = 3;

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const quickStartOptions = [
  {
    id: "easy-dinner",
    label: "Easy dinner",
  },
  {
    id: "hearty",
    label: "Hearty",
  },
  {
    id: "use-what-ive-got",
    label: "Use up the veg",
  },
] as const;

const preferenceOptions = [
  "Quick meals",
  "Vegan",
  "High protein",
  "Family-friendly",
  "Low waste",
  "No dairy",
  "No nuts",
] as const;

const WEEK_PLAN_SEED_SETS = [
  ["potatoes", "broccoli", "garlic", "lentils"],
  ["courgette", "tomatoes", "basil", "pasta"],
  ["carrots", "spinach", "couscous", "chickpeas"],
  ["peppers", "rice", "beans", "coriander"],
  ["cauliflower", "orzo", "lemon", "thyme"],
  ["sweet potato", "kale", "lentils", "lime"],
  ["mushrooms", "spinach", "rice", "garlic"],
  ["broccoli", "potatoes", "rosemary", "beans"],
  ["aubergine", "tomatoes", "couscous", "mint"],
  ["carrots", "red onion", "farro", "parsley"],
];

const WEEK_PLAN_UPGRADE_SETS = [
  ["harissa"],
  ["pesto"],
  ["walnuts"],
  ["almonds"],
  ["pumpkin seeds"],
];

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

function safeWrite<T>(key: string, value: T) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // silent on purpose
  }
}

function buildEmptyWeek(): WeeklyMeals {
  return DAYS.reduce((acc, day) => {
    acc[day] = null;
    return acc;
  }, {} as WeeklyMeals);
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

function toDescription(recipe: any) {
  const description =
    recipe?.description || recipe?.summary || recipe?.excerpt || recipe?.notes;

  if (typeof description === "string" && description.trim()) {
    return description.trim();
  }

  return "";
}

function normalizeRecipe(recipe: any, index: number): RecipeLike {
  const title = toTitle(recipe, index);

  const normalizedIngredients = Array.isArray(recipe?.ingredients)
    ? recipe.ingredients.filter((item: unknown) => typeof item === "string")
    : Array.isArray(recipe?.ingredientsUsed)
      ? recipe.ingredientsUsed.filter(
          (item: unknown) => typeof item === "string",
        )
      : [];

  return {
    ...recipe,
    id: toId(recipe?.id, `${title}-${index}`),
    title,
    description: toDescription(recipe),
    image:
      typeof recipe?.image === "string"
        ? recipe.image
        : typeof recipe?.imageUrl === "string"
          ? recipe.imageUrl
          : undefined,
    imageUrl:
      typeof recipe?.imageUrl === "string"
        ? recipe.imageUrl
        : typeof recipe?.image === "string"
          ? recipe.image
          : undefined,
    ingredients: normalizedIngredients,
    ingredientsUsed: Array.isArray(recipe?.ingredientsUsed)
      ? recipe.ingredientsUsed.filter(
          (item: unknown) => typeof item === "string",
        )
      : normalizedIngredients,
    pantryStaples: Array.isArray(recipe?.pantryStaples)
      ? recipe.pantryStaples.filter((item: unknown) => typeof item === "string")
      : [],
    steps: Array.isArray(recipe?.steps)
      ? recipe.steps.filter((item: unknown) => typeof item === "string")
      : [],
    basketMatches: Array.isArray(recipe?.basketMatches)
      ? recipe.basketMatches
      : [],
  };
}

function truncate(text: string, limit: number) {
  if (!text) return "";
  if (text.length <= limit) return text;
  return `${text.slice(0, limit).trim()}…`;
}

function getRecipeImage(recipe?: RecipeLike | null) {
  if (!recipe) return "";
  return recipe.imageUrl || recipe.image || "";
}

function getInitials(title: string) {
  const words = title.split(" ").filter(Boolean);
  return words
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() || "")
    .join("");
}

function normaliseLabel(value: string) {
  return value.trim().toLowerCase();
}

function dedupeList(items: string[]) {
  return Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));
}

function RecipeImage({
  recipe,
  compact = false,
}: {
  recipe?: RecipeLike | null;
  compact?: boolean;
}) {
  const image = getRecipeImage(recipe);

  if (image) {
    return (
      <div
        className={`overflow-hidden rounded-2xl bg-[#e8eee5] ${
          compact ? "h-10 w-10 sm:h-12 sm:w-12" : "h-16 w-full sm:h-24"
        }`}
      >
        <img
          src={image}
          alt={recipe?.title || "Recipe"}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-2xl bg-[#dde6d8] text-[#516254] ${
        compact
          ? "h-10 w-10 text-[11px] font-semibold sm:h-12 sm:w-12 sm:text-xs"
          : "h-16 w-full text-sm font-semibold sm:h-24 sm:text-base"
      }`}
    >
      {recipe?.title ? getInitials(recipe.title) : "TLP"}
    </div>
  );
}

function buildWeekPlanSeedIngredients({
  mealIndex,
  totalMeals,
  basketIngredients,
  typedIngredients,
  includeBasketIngredients,
  selectedPreferences,
}: {
  mealIndex: number;
  totalMeals: number;
  basketIngredients: string[];
  typedIngredients: string[];
  includeBasketIngredients: boolean;
  selectedPreferences: string[];
}) {
  const base = WEEK_PLAN_SEED_SETS[mealIndex % WEEK_PLAN_SEED_SETS.length] ?? [
    "potatoes",
    "greens",
    "beans",
    "garlic",
  ];

  const selectedSet = [...base];

  const shouldAddUpgrade =
    totalMeals >= 4 &&
    (mealIndex === Math.max(1, totalMeals - 2) || mealIndex === totalMeals - 1);

  if (shouldAddUpgrade) {
    const veganSelected = selectedPreferences.includes("Vegan");
    const noNutsSelected = selectedPreferences.includes("No nuts");

    const upgradePool = WEEK_PLAN_UPGRADE_SETS.filter((set) => {
      if (noNutsSelected) {
        return !set.includes("walnuts") && !set.includes("almonds");
      }

      return true;
    });

    if (upgradePool.length > 0) {
      const upgrade =
        upgradePool[mealIndex % upgradePool.length] ?? upgradePool[0];

      if (veganSelected && upgrade.includes("pesto")) {
        selectedSet.push("herbs");
      } else {
        selectedSet.push(...upgrade);
      }
    }
  }

  if (typedIngredients.length > 0) {
    const start = mealIndex % typedIngredients.length;
    selectedSet.push(typedIngredients[start]);

    if (typedIngredients.length > 1) {
      selectedSet.push(typedIngredients[(start + 1) % typedIngredients.length]);
    }
  }

  if (includeBasketIngredients && basketIngredients.length > 0) {
    selectedSet.push(basketIngredients[mealIndex % basketIngredients.length]);
  }

  return dedupeList(selectedSet).slice(0, 6);
}

function ingredientSignalsFromRecipes(recipes: RecipeLike[]) {
  return recipes.flatMap((recipe) => [
    ...(recipe.ingredientsUsed || []),
    ...(recipe.ingredients || []),
  ]);
}

function includesAny(text: string, matches: string[]) {
  return matches.some((match) => text.includes(match));
}

function getBasketSuggestionsFromRecipes(
  recipes: RecipeLike[],
  plannedCount: number,
) {
  const ingredientText = ingredientSignalsFromRecipes(recipes)
    .map((item) => item.toLowerCase())
    .join(" ");

  const suggestions: ShopDisplayItem[] = [];

  const recommendedBox = plannedCount >= 4 ? produceBoxes[1] : produceBoxes[0];

  if (recommendedBox) {
    suggestions.push(recommendedBox);
  }

  const cupboardMatchers: Array<{ itemName: string; matches: string[] }> = [
    { itemName: "Casarecce Pasta", matches: ["casarecce", "pasta"] },
    { itemName: "Orzo Pasta", matches: ["orzo"] },
    {
      itemName: "Giant Couscous",
      matches: ["giant couscous", "couscous"],
    },
    { itemName: "Polenta", matches: ["polenta"] },
    {
      itemName: "Puy Lentils",
      matches: ["puy lentils", "lentils", "lentil"],
    },
    {
      itemName: "Short Grain Rice",
      matches: ["short grain rice", "rice", "risotto"],
    },
    { itemName: "Farro", matches: ["farro"] },
  ];

  const pantryMatchers: Array<{ itemName: string; matches: string[] }> = [
    {
      itemName: "Sorrel & Walnut Pesto",
      matches: ["pesto", "walnut pesto", "sorrel pesto"],
    },
    {
      itemName: "Rose Harissa",
      matches: ["harissa", "rose harissa"],
    },
    {
      itemName: "Salted Caramel Sauce",
      matches: ["salted caramel", "caramel sauce", "caramel"],
    },
    {
      itemName: "Dark Chocolate & Hazelnut Spread",
      matches: ["chocolate spread", "hazelnut spread", "cocoa spread"],
    },
  ];

  const extraMatchers: Array<{ itemName: string; matches: string[] }> = [
    { itemName: "Almonds", matches: ["almond", "almonds"] },
    { itemName: "Walnuts", matches: ["walnut", "walnuts"] },
    { itemName: "Hazelnuts", matches: ["hazelnut", "hazelnuts"] },
    { itemName: "Cashews", matches: ["cashew", "cashews"] },
  ];

  for (const group of [cupboardMatchers, pantryMatchers, extraMatchers]) {
    for (const matcher of group) {
      if (!includesAny(ingredientText, matcher.matches)) continue;

      const product = allShopItems.find(
        (item) => item.name === matcher.itemName,
      );
      if (product) {
        suggestions.push(product);
      }
    }
  }

  return suggestions.filter(
    (item, index, array) =>
      array.findIndex((candidate) => candidate.name === item.name) === index,
  );
}

export default function PlannerPage() {
  const { cart, addManyToCart } = useCart();

  const [savedRecipes, setSavedRecipes] = useState<RecipeLike[]>([]);
  const [plannerRecipes, setPlannerRecipes] = useState<RecipeLike[]>([]);
  const [weeklyMeals, setWeeklyMeals] = useState<WeeklyMeals>(buildEmptyWeek());
  const [selectedDay, setSelectedDay] = useState<string>("Monday");
  const [showSaved, setShowSaved] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [hasLoaded, setHasLoaded] = useState(false);

  const [customIngredients, setCustomIngredients] = useState("");
  const [includeBasketIngredients, setIncludeBasketIngredients] =
    useState(false);
  const [includeMeatIdeas, setIncludeMeatIdeas] = useState(false);
  const [selectedQuickStart, setSelectedQuickStart] = useState<string>("");
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [generatedRecipe, setGeneratedRecipe] =
    useState<GeneratedRecipe | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(
    null,
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatorError, setGeneratorError] = useState("");
  const [generatorMessage, setGeneratorMessage] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [hasPlannerAccess, setHasPlannerAccess] = useState(false);
  const [freeRecipeUsage, setFreeRecipeUsage] = useState(0);
  const [paywallMessage, setPaywallMessage] = useState("");

  const [panelMode, setPanelMode] = useState<PlannerPanelMode>(null);
  const [showPreferences, setShowPreferences] = useState(false);
  const [showMethod, setShowMethod] = useState(false);

  const [isPlanningWeek, setIsPlanningWeek] = useState(false);
  const [weekPlanError, setWeekPlanError] = useState("");
  const [weekPlanMessage, setWeekPlanMessage] = useState("");
  const [weekPlanPreview, setWeekPlanPreview] = useState<
    WeekPlanPreviewItem[] | null
  >(null);
  const [basketSuggestionMessage, setBasketSuggestionMessage] = useState("");

  const ideaPanelRef = useRef<HTMLDivElement | null>(null);
  const recipeLibraryRef = useRef<HTMLDivElement | null>(null);
  const generatedRecipeRef = useRef<HTMLDivElement | null>(null);
  const weekPlanPreviewRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const rawSaved = safeRead<any[]>(SAVED_FAVOURITES_KEY, []);
      const rawPlanner = safeRead<any[]>(PLANNER_RECIPES_KEY, []);
      const rawWeekly = safeRead<WeeklyMeals>(
        WEEKLY_MEALS_KEY,
        buildEmptyWeek(),
      );

      const normalisedSaved = Array.isArray(rawSaved)
        ? rawSaved.map((item, index) => normalizeRecipe(item, index))
        : [];

      const normalisedPlanner = Array.isArray(rawPlanner)
        ? rawPlanner.map((item, index) => normalizeRecipe(item, index))
        : [];

      const cleanedWeek = buildEmptyWeek();
      for (const day of DAYS) {
        cleanedWeek[day] =
          typeof rawWeekly?.[day] === "string" ? rawWeekly[day] : null;
      }

      setSavedRecipes(normalisedSaved);
      setPlannerRecipes(normalisedPlanner);
      setWeeklyMeals(cleanedWeek);

      const firstUnplanned = DAYS.find((day) => !cleanedWeek[day]);
      if (firstUnplanned) {
        setSelectedDay(firstUnplanned);
      }

      const storedAccess = safeRead<string | null>(PLANNER_ACCESS_KEY, null);
      setHasPlannerAccess(storedAccess === "true");

      const storedUsage = safeRead<number>(FREE_RECIPE_USAGE_KEY, 0);
      setFreeRecipeUsage(typeof storedUsage === "number" ? storedUsage : 0);
    } finally {
      setHasLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!statusMessage) return;
    const timer = window.setTimeout(() => setStatusMessage(""), 1800);
    return () => window.clearTimeout(timer);
  }, [statusMessage]);

  useEffect(() => {
    if (!generatorMessage) return;
    const timer = window.setTimeout(() => setGeneratorMessage(""), 2200);
    return () => window.clearTimeout(timer);
  }, [generatorMessage]);

  useEffect(() => {
    if (!saveMessage) return;
    const timer = window.setTimeout(() => setSaveMessage(""), 2200);
    return () => window.clearTimeout(timer);
  }, [saveMessage]);

  useEffect(() => {
    if (!paywallMessage) return;
    const timer = window.setTimeout(() => setPaywallMessage(""), 4000);
    return () => window.clearTimeout(timer);
  }, [paywallMessage]);

  useEffect(() => {
    if (!weekPlanMessage) return;
    const timer = window.setTimeout(() => setWeekPlanMessage(""), 2800);
    return () => window.clearTimeout(timer);
  }, [weekPlanMessage]);

  useEffect(() => {
    if (!basketSuggestionMessage) return;
    const timer = window.setTimeout(() => setBasketSuggestionMessage(""), 2400);
    return () => window.clearTimeout(timer);
  }, [basketSuggestionMessage]);

  useEffect(() => {
    if (selectedPreferences.includes("Vegan")) {
      setIncludeMeatIdeas(false);
    }
  }, [selectedPreferences]);

  const basketIngredients = useMemo(() => {
    return Array.from(new Set(cart.map((item) => item.name)));
  }, [cart]);

  const typedIngredients = useMemo(() => {
    return customIngredients
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }, [customIngredients]);

  const allPlanningIngredients = useMemo(() => {
    const combined = includeBasketIngredients
      ? [...typedIngredients, ...basketIngredients]
      : [...typedIngredients];

    return Array.from(new Set(combined));
  }, [typedIngredients, basketIngredients, includeBasketIngredients]);

  const remainingFreeRecipes = Math.max(0, FREE_RECIPE_LIMIT - freeRecipeUsage);
  const hasFreeRecipeAccess = hasPlannerAccess || remainingFreeRecipes > 0;

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

  const plannerRecipeIds = useMemo(
    () => new Set(plannerRecipes.map((recipe) => recipe.id)),
    [plannerRecipes],
  );

  const plannedCount = useMemo(() => {
    return DAYS.filter((day) => Boolean(weeklyMeals[day])).length;
  }, [weeklyMeals]);

  const activeRecipe = weeklyMeals[selectedDay]
    ? recipesById.get(weeklyMeals[selectedDay] as string) || null
    : null;

  useEffect(() => {
    setPanelMode(activeRecipe ? null : "idea");
  }, [selectedDay, activeRecipe]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth >= 768) return;

    if (generatedRecipe && generatedRecipeRef.current) {
      const timer = window.setTimeout(() => {
        generatedRecipeRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 120);

      return () => window.clearTimeout(timer);
    }
  }, [generatedRecipe]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth >= 768) return;

    if (weekPlanPreview && weekPlanPreviewRef.current) {
      const timer = window.setTimeout(() => {
        weekPlanPreviewRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 120);

      return () => window.clearTimeout(timer);
    }
  }, [weekPlanPreview]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth >= 768) return;

    const target =
      panelMode === "recipes"
        ? recipeLibraryRef.current
        : panelMode === "idea"
          ? ideaPanelRef.current
          : null;

    if (!target) return;

    const timer = window.setTimeout(() => {
      const rect = target.getBoundingClientRect();
      const alreadyVisible =
        rect.top >= 0 && rect.bottom <= window.innerHeight + 80;

      if (!alreadyVisible) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 80);

    return () => window.clearTimeout(timer);
  }, [panelMode, selectedDay]);

  const visibleRecipes = showSaved ? savedRecipes : plannerRecipes;

  const filteredRecipes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return visibleRecipes;

    return visibleRecipes.filter((recipe) => {
      const text = [
        recipe.title,
        recipe.description || "",
        ...(recipe.ingredients || []),
        ...(recipe.ingredientsUsed || []),
        ...(recipe.basketMatches || []).map(
          (item) => item?.title || item?.name || "",
        ),
      ]
        .join(" ")
        .toLowerCase();

      return text.includes(query);
    });
  }, [searchQuery, visibleRecipes]);

  const weekSummary = useMemo(() => {
    const counts = new Map<
      string,
      { label: string; count: number; days: string[] }
    >();

    for (const day of DAYS) {
      const recipeId = weeklyMeals[day];
      if (!recipeId) continue;

      const recipe = recipesById.get(recipeId);
      if (!recipe) continue;

      const sources = [
        ...(Array.isArray(recipe.ingredients) ? recipe.ingredients : []),
        ...(Array.isArray(recipe.ingredientsUsed)
          ? recipe.ingredientsUsed
          : []),
        ...(Array.isArray(recipe.basketMatches)
          ? recipe.basketMatches.map((item) => item?.title || item?.name || "")
          : []),
      ];

      for (const rawItem of sources) {
        if (typeof rawItem !== "string") continue;
        const label = rawItem.trim();
        if (!label) continue;

        const key = normaliseLabel(label);
        const existing = counts.get(key);

        if (existing) {
          existing.count += 1;
          if (!existing.days.includes(day)) {
            existing.days.push(day);
          }
        } else {
          counts.set(key, {
            label,
            count: 1,
            days: [day],
          });
        }
      }
    }

    return Array.from(counts.values())
      .sort((a, b) => {
        if (b.count !== a.count) return b.count - a.count;
        return a.label.localeCompare(b.label);
      })
      .slice(0, 12);
  }, [weeklyMeals, recipesById]);

  const firstOpenDay = useMemo(() => {
    return DAYS.find((day) => !weeklyMeals[day]) || null;
  }, [weeklyMeals]);

  const emptyDays = useMemo(() => {
    return DAYS.filter((day) => !weeklyMeals[day]);
  }, [weeklyMeals]);

  const filledDays = useMemo(() => {
    return DAYS.filter((day) => Boolean(weeklyMeals[day]));
  }, [weeklyMeals]);

  const canClearWeek = plannedCount > 0;
  const shouldShowBasketGuide = plannedCount >= 2;
  const shouldPromoteShop = plannedCount >= 3;
  const hasBasketIngredients = basketIngredients.length > 0;
  const weekProgressLabel =
    plannedCount === 0
      ? "Nothing planned yet"
      : plannedCount === 1
        ? "1 meal sorted"
        : `${plannedCount} meals sorted`;
  const weekProgressText =
    plannedCount >= 3
      ? "Your week is taking shape. Build the basket around what you’re actually cooking."
      : plannedCount >= 2
        ? "Your week is starting to take shape."
        : "Start with one day, then keep going.";
  const veganSelected = selectedPreferences.includes("Vegan");
  const weekPlanningButtonLabel =
    plannedCount <= 1 ? "Plan my week for me" : "Plan the rest of my week";

  const basketSuggestions = useMemo(() => {
    const previewRecipes = weekPlanPreview
      ? weekPlanPreview.map((item) => item.recipe)
      : [];

    return getBasketSuggestionsFromRecipes(
      previewRecipes,
      plannedCount + previewRecipes.length,
    );
  }, [weekPlanPreview, plannedCount]);

  const plannedNowCount = weekPlanPreview?.length ?? 0;
  const totalIfApplied = plannedCount + plannedNowCount;
  const recommendedBoxName =
    totalIfApplied >= 4 ? "Family Produce Box" : "Weekly Produce Box";

  function persistPlannerRecipes(next: RecipeLike[]) {
    setPlannerRecipes(next);
    safeWrite(PLANNER_RECIPES_KEY, next);
  }

  function persistWeeklyMeals(next: WeeklyMeals) {
    setWeeklyMeals(next);
    safeWrite(WEEKLY_MEALS_KEY, next);
  }

  function addRecipeToPlanner(recipe: RecipeLike) {
    if (plannerRecipeIds.has(recipe.id)) {
      setStatusMessage("Already saved for later");
      return;
    }

    const next = [recipe, ...plannerRecipes];
    persistPlannerRecipes(next);
    setShowSaved(false);
    setStatusMessage("Saved for later");
  }

  function assignRecipeToSelectedDay(recipe: RecipeLike) {
    const dayBeingAssigned = selectedDay;

    const next = {
      ...weeklyMeals,
      [dayBeingAssigned]: recipe.id,
    };

    persistWeeklyMeals(next);

    const nextOpenDay = DAYS.find(
      (day) => day !== dayBeingAssigned && !next[day],
    );

    if (nextOpenDay) {
      setSelectedDay(nextOpenDay);
    }

    setPanelMode(null);
    setStatusMessage(`${dayBeingAssigned} sorted`);
  }

  function clearSelectedDay() {
    const next = {
      ...weeklyMeals,
      [selectedDay]: null,
    };

    persistWeeklyMeals(next);
    setGeneratedRecipe(null);
    setGeneratedImageUrl(null);
    setStatusMessage(`${selectedDay} cleared`);
  }

  function clearWeek() {
    persistWeeklyMeals(buildEmptyWeek());
    setSelectedDay("Monday");
    setGeneratedRecipe(null);
    setGeneratedImageUrl(null);
    setWeekPlanPreview(null);
    setStatusMessage("Week cleared");
  }

  function removeRecipeFromPlanner(recipeId: string) {
    const nextPlannerRecipes = plannerRecipes.filter(
      (recipe) => recipe.id !== recipeId,
    );
    persistPlannerRecipes(nextPlannerRecipes);

    const nextMeals = { ...weeklyMeals };
    for (const day of DAYS) {
      if (nextMeals[day] === recipeId) {
        nextMeals[day] = null;
      }
    }
    persistWeeklyMeals(nextMeals);

    setStatusMessage("Removed from planner");
  }

  function togglePreference(preference: string) {
    setSelectedPreferences((current) => {
      if (current.includes(preference)) {
        return current.filter((item) => item !== preference);
      }

      return [...current, preference];
    });
  }

  function chooseNextOpenDay() {
    if (firstOpenDay) {
      setSelectedDay(firstOpenDay);
      setStatusMessage(`${firstOpenDay} selected`);
    }
  }

  async function handleGetRecipeIdea() {
    if (!hasPlannerAccess && freeRecipeUsage >= FREE_RECIPE_LIMIT) {
      setGeneratorError("");
      setGeneratedRecipe(null);
      setGeneratedImageUrl(null);
      setPaywallMessage(
        "You’ve used your free recipe ideas. Unlock unlimited recipes and the full planner, or get it included with a weekly produce box.",
      );
      return;
    }

    if (allPlanningIngredients.length === 0) {
      setGeneratorError(
        `Add a few ingredients for ${selectedDay.toLowerCase()}, or include your basket items.`,
      );
      setGeneratedRecipe(null);
      setGeneratedImageUrl(null);
      return;
    }

    try {
      setIsGenerating(true);
      setGeneratorError("");
      setGeneratorMessage("");
      setSaveMessage("");
      setPaywallMessage("");
      setGeneratedRecipe(null);
      setGeneratedImageUrl(null);
      setShowMethod(false);

      const response = await fetch("/api/recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: allPlanningIngredients,
          quickStart: selectedQuickStart,
          preferences: selectedPreferences,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get recipe idea.");
      }

      setGeneratedRecipe(data.recipe);
      setGeneratedImageUrl(data.imageUrl ?? null);

      if (!hasPlannerAccess) {
        const nextUsage = freeRecipeUsage + 1;
        setFreeRecipeUsage(nextUsage);
        safeWrite(FREE_RECIPE_USAGE_KEY, nextUsage);
      }
    } catch (error) {
      console.error(error);
      setGeneratorError(
        "We couldn’t get an idea just now. Please try again in a moment.",
      );
    } finally {
      setIsGenerating(false);
    }
  }

  async function handlePlanWeekPreview() {
    if (emptyDays.length === 0) {
      setWeekPlanError("Your week is already full.");
      return;
    }

    try {
      setIsPlanningWeek(true);
      setWeekPlanError("");
      setWeekPlanMessage("");
      setPaywallMessage("");
      setWeekPlanPreview(null);

      const previewItems: WeekPlanPreviewItem[] = [];
      const previousRecipesForWeek: Array<{
        title: string;
        description: string;
        ingredientsUsed: string[];
      }> = [];

      for (let index = 0; index < emptyDays.length; index += 1) {
        const day = emptyDays[index];
        const items = buildWeekPlanSeedIngredients({
          mealIndex: index,
          totalMeals: emptyDays.length,
          basketIngredients,
          typedIngredients,
          includeBasketIngredients,
          selectedPreferences,
        });

        const response = await fetch("/api/recipe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items,
            quickStart: selectedQuickStart,
            preferences: selectedPreferences,
            previousRecipe:
              previousRecipesForWeek.length > 0
                ? previousRecipesForWeek[previousRecipesForWeek.length - 1]
                : null,
            previousRecipes: previousRecipesForWeek,
            weekPlanContext: {
              mode: "plan-week",
              mealIndex: index,
              totalMeals: emptyDays.length,
              includeMeatIdeas,
            },
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Could not plan the week.");
        }

        const recipeLike: RecipeLike = {
          id: `${data.recipe.title}-${day}-${Date.now()}-${index}`,
          title: data.recipe.title,
          description: data.recipe.description,
          imageUrl: data.imageUrl ?? undefined,
          ingredients: data.recipe.ingredientsUsed,
          ingredientsUsed: data.recipe.ingredientsUsed,
          pantryStaples: data.recipe.pantryStaples,
          steps: data.recipe.steps,
          basketMatches: data.recipe.ingredientsUsed.map((item: string) => ({
            title: item,
            quantity: 1,
          })),
          savedAt: new Date().toISOString(),
          addedToPlannerAt: new Date().toISOString(),
        };

        previewItems.push({
          day,
          recipe: recipeLike,
        });

        previousRecipesForWeek.push({
          title: data.recipe.title,
          description: data.recipe.description,
          ingredientsUsed: data.recipe.ingredientsUsed,
        });
      }

      setWeekPlanPreview(previewItems);
      setWeekPlanMessage(
        `${previewItems.length} ${
          previewItems.length === 1 ? "meal" : "meals"
        } planned for the week`,
      );
    } catch (error) {
      console.error(error);
      setWeekPlanError(
        "We couldn’t plan the week just now. Please try again in a moment.",
      );
    } finally {
      setIsPlanningWeek(false);
    }
  }

  function handleAddSuggestedBasket() {
    if (basketSuggestions.length === 0) return;
    addManyToCart(
      basketSuggestions.map((item) => ({
        name: item.name,
        price: item.price,
        image: item.image,
        category: item.category,
        checkoutType: item.checkoutType,
      })),
    );
    setBasketSuggestionMessage("Added to basket");
  }

  function handleAddWeekPreviewToPlanner() {
    if (!weekPlanPreview || weekPlanPreview.length === 0) return;

    const nextMeals = { ...weeklyMeals };
    const recipesToAdd: RecipeLike[] = [];

    for (const item of weekPlanPreview) {
      const existing = plannerRecipes.find(
        (recipe) =>
          recipe.title === item.recipe.title &&
          recipe.description === item.recipe.description,
      );

      const recipeToUse = existing || item.recipe;
      nextMeals[item.day] = recipeToUse.id;

      if (!existing) {
        recipesToAdd.push(recipeToUse);
      }
    }

    if (recipesToAdd.length > 0) {
      persistPlannerRecipes([...recipesToAdd, ...plannerRecipes]);
    }

    persistWeeklyMeals(nextMeals);
    setWeekPlanPreview(null);
    setPanelMode(null);
    setWeekPlanMessage("Week planned");

    const nextOpenDay = DAYS.find((day) => !nextMeals[day]);
    if (nextOpenDay) {
      setSelectedDay(nextOpenDay);
    }
  }

  function buildGeneratedRecipeLike(): RecipeLike | null {
    if (!generatedRecipe) return null;

    return {
      id: `${generatedRecipe.title}-${Date.now()}`,
      title: generatedRecipe.title,
      description: generatedRecipe.description,
      imageUrl: generatedImageUrl ?? undefined,
      ingredients: generatedRecipe.ingredientsUsed,
      ingredientsUsed: generatedRecipe.ingredientsUsed,
      pantryStaples: generatedRecipe.pantryStaples,
      steps: generatedRecipe.steps,
      basketMatches: generatedRecipe.ingredientsUsed.map((item) => ({
        title: item,
        quantity: 1,
      })),
      savedAt: new Date().toISOString(),
      addedToPlannerAt: new Date().toISOString(),
    };
  }

  function handleKeepGeneratedInPlanner() {
    const recipe = buildGeneratedRecipeLike();
    if (!recipe) return;

    const duplicate = plannerRecipes.some(
      (item) =>
        item.title === recipe.title && item.description === recipe.description,
    );

    if (duplicate) {
      setGeneratorMessage("Already saved for later");
      return;
    }

    const next = [recipe, ...plannerRecipes];
    persistPlannerRecipes(next);
    setPanelMode("recipes");
    setShowSaved(false);
    setGeneratorMessage("Saved for later");
  }

  function handleAddGeneratedToDay() {
    const dayBeingAssigned = selectedDay;
    const recipe = buildGeneratedRecipeLike();
    if (!recipe) return;

    const existing = plannerRecipes.find(
      (item) =>
        item.title === recipe.title && item.description === recipe.description,
    );

    const recipeToUse = existing || recipe;

    if (!existing) {
      persistPlannerRecipes([recipeToUse, ...plannerRecipes]);
    }

    const next = {
      ...weeklyMeals,
      [dayBeingAssigned]: recipeToUse.id,
    };

    persistWeeklyMeals(next);
    setGeneratorMessage(`${dayBeingAssigned} sorted`);
    setPanelMode(null);

    const nextOpenDay = DAYS.find(
      (day) => day !== dayBeingAssigned && !next[day],
    );

    if (nextOpenDay) {
      setSelectedDay(nextOpenDay);
    }
  }

  function handleSaveGeneratedToFavourites() {
    const recipe = buildGeneratedRecipeLike();
    if (!recipe) return;

    const duplicate = savedRecipes.some(
      (item) =>
        item.title === recipe.title && item.description === recipe.description,
    );

    if (duplicate) {
      setSaveMessage("Already in favourites");
      return;
    }

    const next = [recipe, ...savedRecipes];
    setSavedRecipes(next);
    safeWrite(SAVED_FAVOURITES_KEY, next);
    setSaveMessage("Saved to favourites");
  }

  return (
    <main className="min-h-screen overflow-x-clip text-[#213128]">
      <div className="mx-auto w-full max-w-6xl px-3 pb-5 pt-1.5 sm:px-6 sm:pb-8 sm:pt-5">
        <section className="rounded-[20px] border border-[rgba(223,230,218,0.95)] bg-[rgba(255,255,255,0.78)] p-3 shadow-[0_8px_24px_rgba(31,43,36,0.05)] backdrop-blur-md sm:rounded-[22px] sm:p-4.5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-3xl">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#758278]">
                Weekly planner
              </p>
              <h1 className="mt-1 text-base font-semibold tracking-[-0.03em] text-[#1f2b24] sm:text-4xl">
                Work out what to cook this week
              </h1>
              <p className="mt-1 max-w-2xl text-[11px] leading-5 text-[#5d6b62] sm:text-sm sm:leading-6">
                Pick a day, get an idea, then build the basket around the meals
                you’ll actually cook.
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              <Link
                href="/shop"
                className="inline-flex h-8 items-center rounded-full bg-[#213128] px-3 text-xs font-medium text-white transition hover:opacity-95 sm:h-10 sm:px-4 sm:text-sm"
              >
                Shop weekly boxes
              </Link>
              <Link
                href="/basket"
                className="inline-flex h-8 items-center rounded-full border border-[#d5ddd1] bg-[rgba(255,255,255,0.86)] px-3 text-xs font-medium text-[#213128] transition hover:bg-white sm:h-10 sm:px-4 sm:text-sm"
              >
                Basket
              </Link>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="inline-flex w-fit rounded-full border border-[#dbe2d7] bg-[rgba(251,252,250,0.88)] px-3 py-1.5 text-[11px] text-[#58675e] sm:text-sm">
              {weekProgressLabel}
            </span>

            {firstOpenDay ? (
              <span className="inline-flex w-fit rounded-full border border-[#e1e7dd] bg-[rgba(246,248,243,0.9)] px-3 py-1.5 text-[11px] text-[#617067] sm:text-sm">
                Next up: {firstOpenDay}
              </span>
            ) : null}

            {veganSelected ? (
              <span className="inline-flex w-fit rounded-full border border-[#dbe2d7] bg-[rgba(233,240,228,0.82)] px-3 py-1.5 text-[11px] text-[#213128] sm:text-sm">
                Vegan
              </span>
            ) : null}

            <span className="inline-flex w-fit rounded-full border border-[#e1e7dd] bg-[rgba(251,252,250,0.88)] px-3 py-1.5 text-[11px] text-[#617067] sm:text-sm">
              ML11 weekly delivery
            </span>
          </div>

          <p className="mt-2 text-[11px] leading-5 text-[#617067] sm:text-sm sm:leading-6">
            {weekProgressText}
          </p>

          {statusMessage ? (
            <div className="mt-2 inline-flex w-fit rounded-full border border-[#dbe2d7] bg-[rgba(251,252,250,0.88)] px-3 py-1.5 text-[11px] text-[#58675e] sm:text-sm">
              {statusMessage}
            </div>
          ) : null}
        </section>

        <section className="mt-2.5 rounded-[20px] border border-[rgba(223,230,218,0.95)] bg-[rgba(255,255,255,0.78)] p-3 shadow-[0_8px_24px_rgba(31,43,36,0.05)] backdrop-blur-md sm:mt-3 sm:rounded-[22px] sm:p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#758278]">
                This week
              </p>
              <h2 className="mt-1 text-sm font-semibold tracking-[-0.02em] text-[#1f2b24] sm:text-lg">
                Choose the next meal
              </h2>
            </div>

            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={clearSelectedDay}
                disabled={!activeRecipe}
                className={`inline-flex h-8 items-center rounded-full px-3 text-[11px] font-medium transition sm:h-10 sm:px-4 sm:text-sm ${
                  activeRecipe
                    ? "border border-[#d4dcd0] bg-[rgba(255,255,255,0.82)] text-[#59685f] hover:bg-white"
                    : "bg-[#eef2eb] text-[#8a968e]"
                }`}
              >
                Clear {selectedDay}
              </button>

              <button
                type="button"
                onClick={clearWeek}
                disabled={!canClearWeek}
                className={`inline-flex h-8 items-center rounded-full px-3 text-[11px] font-medium transition sm:h-10 sm:px-4 sm:text-sm ${
                  canClearWeek
                    ? "border border-[#d4dcd0] bg-[rgba(255,255,255,0.82)] text-[#59685f] hover:bg-white"
                    : "bg-[#eef2eb] text-[#8a968e]"
                }`}
              >
                Clear week
              </button>
            </div>
          </div>

          <div className="mt-2.5 overflow-x-auto pb-1">
            <div className="flex min-w-max gap-1.5 sm:gap-2">
              {DAYS.map((day) => {
                const recipeId = weeklyMeals[day];
                const recipe = recipeId
                  ? recipesById.get(recipeId) || null
                  : null;
                const isActive = selectedDay === day;
                const isComplete = Boolean(recipe);

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    className={`w-[98px] shrink-0 rounded-[18px] border px-2.5 py-2 text-left transition sm:w-[122px] sm:rounded-2xl sm:px-3 sm:py-2.5 ${
                      isActive
                        ? "border-[#213128] bg-[#213128] text-white shadow-[0_8px_20px_rgba(33,49,40,0.16)]"
                        : isComplete
                          ? "border-[#d5ddd1] bg-[rgba(244,248,241,0.95)] text-[#213128] hover:bg-[rgba(255,255,255,0.92)]"
                          : "border-[#dde4d8] bg-[rgba(251,252,250,0.8)] text-[#213128] hover:bg-[rgba(255,255,255,0.92)]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={`text-[10px] uppercase tracking-[0.14em] ${
                          isActive ? "text-white/75" : "text-[#7b877d]"
                        }`}
                      >
                        {day.slice(0, 3)}
                      </p>

                      {isComplete ? (
                        <span
                          className={`inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[10px] font-semibold ${
                            isActive
                              ? "bg-white text-[#213128]"
                              : "bg-[#dce7d8] text-[#213128]"
                          }`}
                        >
                          ✓
                        </span>
                      ) : null}
                    </div>

                    <p className="mt-1 text-[13px] font-medium leading-4.5 sm:text-sm sm:leading-5">
                      {recipe ? truncate(recipe.title, 18) : "No meal yet"}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {firstOpenDay ? (
            <div className="mt-2.5 rounded-[20px] border border-[#dbe2d7] bg-[rgba(246,248,243,0.92)] p-3 sm:mt-3 sm:rounded-[22px] sm:p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#78867c]">
                    Plan my week
                  </p>
                  <h3 className="mt-1 text-base font-semibold tracking-[-0.02em] text-[#1f2b24] sm:text-xl">
                    Here’s a simple week you could cook
                  </h3>
                  <p className="mt-1 text-[11px] leading-5 text-[#617067] sm:text-sm sm:leading-6">
                    Fill the rest of the week with veg-first meals, practical
                    pantry support, and a clear basket path.
                  </p>

                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className="inline-flex rounded-full border border-[#d8dfd3] bg-white px-3 py-1.5 text-[11px] text-[#58675e] sm:text-sm">
                      {plannedCount} sorted
                    </span>
                    <span className="inline-flex rounded-full border border-[#d8dfd3] bg-white px-3 py-1.5 text-[11px] text-[#58675e] sm:text-sm">
                      {emptyDays.length} to fill
                    </span>
                    <span className="inline-flex rounded-full border border-[#d8dfd3] bg-white px-3 py-1.5 text-[11px] text-[#58675e] sm:text-sm">
                      Box first
                    </span>
                  </div>
                </div>

                <div className="flex w-full flex-col gap-2 lg:w-auto lg:min-w-[260px]">
                  <button
                    type="button"
                    onClick={handlePlanWeekPreview}
                    disabled={isPlanningWeek}
                    className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-[#213128] px-4 text-sm font-medium text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isPlanningWeek
                      ? "Planning your week..."
                      : weekPlanningButtonLabel}
                  </button>

                  {shouldPromoteShop ? (
                    <Link
                      href="/shop"
                      className="inline-flex h-10 w-full items-center justify-center rounded-xl border border-[#d5ddd1] bg-white px-4 text-sm font-medium text-[#213128] transition hover:bg-[rgba(255,255,255,0.94)]"
                    >
                      Shop for the week
                    </Link>
                  ) : null}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setIncludeMeatIdeas((current) => !current)}
                  disabled={veganSelected}
                  className={`rounded-full border px-3 py-1.5 text-[11px] font-medium transition sm:text-sm ${
                    includeMeatIdeas && !veganSelected
                      ? "border-[#213128] bg-[#213128] text-white"
                      : veganSelected
                        ? "border-[#dde4d8] bg-[#eef2eb] text-[#8a968e]"
                        : "border-[#d5ddd1] bg-white text-[#213128] hover:bg-[rgba(255,255,255,0.94)]"
                  }`}
                >
                  {veganSelected
                    ? "Vegan week"
                    : includeMeatIdeas
                      ? "Including meat ideas"
                      : "Include meat ideas"}
                </button>

                {hasBasketIngredients ? (
                  <button
                    type="button"
                    onClick={() =>
                      setIncludeBasketIngredients((current) => !current)
                    }
                    className={`rounded-full border px-3 py-1.5 text-[11px] font-medium transition sm:text-sm ${
                      includeBasketIngredients
                        ? "border-[#213128] bg-[rgba(233,240,228,0.92)] text-[#213128]"
                        : "border-[#d5ddd1] bg-white text-[#213128] hover:bg-[rgba(255,255,255,0.94)]"
                    }`}
                  >
                    {includeBasketIngredients
                      ? "Using what's in your basket"
                      : "Use what's in your basket"}
                  </button>
                ) : null}

                <span className="inline-flex items-center rounded-full border border-[#e1e7dd] bg-white px-3 py-1.5 text-[11px] text-[#617067] sm:text-sm">
                  Veg boxes first, grains and jars in support
                </span>
              </div>

              {includeBasketIngredients && hasBasketIngredients ? (
                <div className="mt-2 rounded-[14px] border border-[#dbe2d7] bg-white px-3 py-2">
                  <p className="text-[11px] text-[#617067] sm:text-xs">
                    Using {basketIngredients.length} basket
                    {basketIngredients.length === 1
                      ? " ingredient"
                      : " ingredients"}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {basketIngredients.slice(0, 5).map((ingredient) => (
                      <span
                        key={ingredient}
                        className="rounded-full border border-[#d8dfd3] bg-[rgba(251,252,250,0.88)] px-2 py-0.5 text-[10px] text-[#58675e] sm:text-[11px]"
                      >
                        {ingredient}
                      </span>
                    ))}
                    {basketIngredients.length > 5 ? (
                      <span className="rounded-full border border-[#d8dfd3] bg-[rgba(251,252,250,0.88)] px-2 py-0.5 text-[10px] text-[#58675e] sm:text-[11px]">
                        +{basketIngredients.length - 5} more
                      </span>
                    ) : null}
                  </div>
                </div>
              ) : null}

              {weekPlanMessage ? (
                <div className="mt-3 inline-flex w-fit rounded-full border border-[#dbe4d5] bg-[#f4f8f1] px-3 py-1.5 text-[11px] text-[#425142] sm:text-sm">
                  {weekPlanMessage}
                </div>
              ) : null}

              {weekPlanError ? (
                <div className="mt-3 rounded-[16px] border border-[#e4d8cb] bg-[#fbf6f0] px-3 py-2 text-sm text-[#6a5c4f]">
                  {weekPlanError}
                </div>
              ) : null}
            </div>
          ) : null}

          {weekPlanPreview ? (
            <div
              ref={weekPlanPreviewRef}
              className="mt-2.5 rounded-[18px] border border-[#dbe2d7] bg-[rgba(246,248,243,0.92)] p-3 sm:mt-3 sm:rounded-[20px] sm:p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#78867c]">
                    Week preview
                  </p>
                  <h2 className="mt-1 text-base font-semibold tracking-[-0.02em] text-[#1f2b24] sm:text-xl">
                    Here’s a week you could cook
                  </h2>
                  <p className="mt-1 text-[11px] leading-5 text-[#617067] sm:text-sm sm:leading-6">
                    {filledDays.length > 0
                      ? `${filledDays.length} day${
                          filledDays.length === 1 ? "" : "s"
                        } already sorted · ${plannedNowCount} planned now`
                      : `${plannedNowCount} meals planned for the week`}{" "}
                    · Built around a {recommendedBoxName}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleAddWeekPreviewToPlanner}
                    className="inline-flex h-9 items-center justify-center rounded-full bg-[#213128] px-4 text-sm font-medium text-white transition hover:opacity-95"
                  >
                    Add this week to my planner
                  </button>

                  <button
                    type="button"
                    onClick={handlePlanWeekPreview}
                    disabled={isPlanningWeek}
                    className="inline-flex h-9 items-center justify-center rounded-full border border-[#d5ddd1] bg-white px-4 text-sm font-medium text-[#213128] transition hover:bg-[rgba(255,255,255,0.94)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Try another week
                  </button>
                </div>
              </div>

              {(filledDays.length > 0 || weekPlanPreview.length > 0) && (
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <div className="rounded-[14px] border border-[#dbe2d7] bg-white px-3 py-2.5">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-[#78867c]">
                      Already sorted
                    </p>
                    <p className="mt-1 text-lg font-semibold text-[#213128]">
                      {filledDays.length}
                    </p>
                  </div>

                  <div className="rounded-[14px] border border-[#dbe2d7] bg-white px-3 py-2.5">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-[#78867c]">
                      Planned now
                    </p>
                    <p className="mt-1 text-lg font-semibold text-[#213128]">
                      {plannedNowCount}
                    </p>
                  </div>

                  <div className="rounded-[14px] border border-[#dbe2d7] bg-white px-3 py-2.5">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-[#78867c]">
                      Week total
                    </p>
                    <p className="mt-1 text-lg font-semibold text-[#213128]">
                      {totalIfApplied}
                    </p>
                  </div>

                  <div className="rounded-[14px] border border-[#dbe2d7] bg-white px-3 py-2.5">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-[#78867c]">
                      Box to start with
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#213128]">
                      {recommendedBoxName}
                    </p>
                  </div>
                </div>
              )}

              {filledDays.length > 0 ? (
                <div className="mt-3 rounded-[16px] border border-[#dbe2d7] bg-white p-3">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#78867c]">
                    Already in your week
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {filledDays.map((day) => {
                      const recipeId = weeklyMeals[day];
                      const recipe = recipeId
                        ? recipesById.get(recipeId)
                        : null;

                      return (
                        <div
                          key={`planned-${day}`}
                          className="rounded-full border border-[#d8dfd3] bg-[rgba(251,252,250,0.88)] px-3 py-1.5 text-[11px] text-[#58675e] sm:text-sm"
                        >
                          {day}:{" "}
                          {recipe ? truncate(recipe.title, 24) : "Sorted"}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {weekPlanPreview.map((item) => (
                  <article
                    key={`${item.day}-${item.recipe.id}`}
                    className="rounded-[16px] border border-[#dbe2d7] bg-white p-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-[#78867c]">
                        {item.day}
                      </p>
                      <span className="inline-flex rounded-full border border-[#d8dfd3] bg-[rgba(233,240,228,0.82)] px-2 py-0.5 text-[10px] text-[#213128]">
                        Planned now
                      </span>
                    </div>

                    <div className="mt-2 flex items-start gap-2.5">
                      <div className="w-12 shrink-0">
                        <RecipeImage recipe={item.recipe} compact />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-[#213128]">
                          {item.recipe.title}
                        </p>
                        <p className="mt-0.5 text-[11px] leading-4.5 text-[#617067]">
                          {item.recipe.description
                            ? truncate(item.recipe.description, 84)
                            : "A meal idea for the week."}
                        </p>
                      </div>
                    </div>

                    {item.recipe.ingredientsUsed &&
                    item.recipe.ingredientsUsed.length > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {item.recipe.ingredientsUsed.slice(0, 4).map((chip) => (
                          <span
                            key={`${item.day}-${chip}`}
                            className="rounded-full border border-[#d8dfd3] bg-[rgba(251,252,250,0.88)] px-2 py-0.5 text-[10px] text-[#58675e]"
                          >
                            {chip}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>

              {basketSuggestions.length > 0 ? (
                <div className="mt-3 rounded-[16px] border border-[#dbe2d7] bg-[rgba(255,255,255,0.88)] p-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-[#78867c]">
                        Build your basket from this week
                      </p>
                      <p className="mt-1 text-sm font-medium text-[#213128]">
                        Start with a box, then add a few useful extras
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddSuggestedBasket}
                      className="inline-flex h-9 items-center justify-center rounded-full bg-[#213128] px-4 text-sm font-medium text-white transition hover:opacity-95"
                    >
                      Add these to basket
                    </button>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {basketSuggestions.map((item, index) => (
                      <div
                        key={item.name}
                        className={`rounded-[14px] border p-2.5 ${
                          index === 0
                            ? "border-[#cbd8c5] bg-[rgba(233,240,228,0.7)]"
                            : "border-[#e1e7dd] bg-[rgba(252,252,250,0.82)]"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-[#213128]">
                              {item.name}
                            </p>
                            <p className="mt-0.5 text-[11px] text-[#617067]">
                              £{item.price.toFixed(2)}
                            </p>
                          </div>

                          <span
                            className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] ${
                              item.category === "boxes"
                                ? "border border-[#dbe2d7] bg-white text-[#213128]"
                                : "border border-[#e1e7dd] bg-white text-[#58675e]"
                            }`}
                          >
                            {item.category === "boxes"
                              ? "Recommended box"
                              : "Add-on"}
                          </span>
                        </div>

                        <p className="mt-1.5 text-[11px] leading-5 text-[#617067]">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>

                  {basketSuggestionMessage ? (
                    <div className="mt-3 rounded-[14px] border border-[#dbe4d5] bg-[#f4f8f1] px-3 py-2 text-sm text-[#425142]">
                      {basketSuggestionMessage}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="mt-2.5 grid gap-2.5 sm:mt-3 sm:gap-3 lg:grid-cols-[1.04fr_0.96fr]">
            <div className="rounded-[20px] border border-[#dbe2d7] bg-[rgba(246,248,243,0.9)] p-2.5 sm:rounded-[22px] sm:p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[#78867c]">
                    Working on
                  </p>
                  <h3 className="mt-1 text-[16px] font-semibold tracking-[-0.02em] text-[#1f2b24] sm:text-xl">
                    {selectedDay}
                  </h3>

                  {!activeRecipe ? (
                    <p className="mt-0.5 text-[11px] text-[#6b786e] sm:mt-1 sm:text-sm">
                      No meal in yet.
                    </p>
                  ) : (
                    <p className="mt-0.5 text-[11px] text-[#6b786e] sm:mt-1 sm:text-sm">
                      {selectedDay}&rsquo;s sorted.
                    </p>
                  )}
                </div>

                {activeRecipe && firstOpenDay ? (
                  <button
                    type="button"
                    onClick={chooseNextOpenDay}
                    className="inline-flex h-8.5 items-center rounded-full border border-[#d5ddd1] bg-white px-3.5 text-sm font-medium text-[#213128] transition hover:bg-[rgba(255,255,255,0.94)] sm:h-9"
                  >
                    Choose {firstOpenDay}
                  </button>
                ) : null}
              </div>

              {plannedCount >= 2 ? (
                <div className="mt-2 rounded-[16px] border border-[#dbe2d7] bg-[rgba(255,255,255,0.8)] px-3 py-2.5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-[#78867c]">
                        Week taking shape
                      </p>
                      <p className="mt-1 text-sm font-medium text-[#213128]">
                        {weekProgressLabel}
                      </p>
                    </div>

                    {shouldPromoteShop ? (
                      <Link
                        href="/shop"
                        className="inline-flex h-9 items-center justify-center rounded-full bg-[#213128] px-3.5 text-sm font-medium text-white transition hover:opacity-95"
                      >
                        Build your basket
                      </Link>
                    ) : null}
                  </div>

                  <p className="mt-1.5 text-[11px] leading-5 text-[#617067] sm:text-sm sm:leading-6">
                    {shouldPromoteShop
                      ? "You’ve got enough shape to start building the basket around your meals."
                      : "Keep going day by day and the basket guide will start to help."}
                  </p>
                </div>
              ) : null}

              {activeRecipe ? (
                <div className="mt-2 rounded-[18px] border border-[#dbe2d7] bg-white p-2.5 sm:mt-3 sm:p-3">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="w-14 shrink-0 sm:w-20">
                      <RecipeImage recipe={activeRecipe} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-[#213128] sm:text-base">
                        {activeRecipe.title}
                      </p>
                      <p className="mt-0.5 text-[11px] leading-4.5 text-[#617067] sm:mt-1 sm:text-sm sm:leading-6">
                        {activeRecipe.description
                          ? truncate(activeRecipe.description, 100)
                          : "Ready for the week."}
                      </p>

                      {activeRecipe.ingredientsUsed &&
                      activeRecipe.ingredientsUsed.length > 0 ? (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {activeRecipe.ingredientsUsed
                            .slice(0, 6)
                            .map((item) => (
                              <span
                                key={item}
                                className="rounded-full border border-[#d8dfd3] bg-[rgba(251,252,250,0.88)] px-2 py-0.5 text-[10px] text-[#58675e] sm:text-[11px]"
                              >
                                {item}
                              </span>
                            ))}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-2.5 grid grid-cols-1 gap-2 sm:flex sm:flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        setPanelMode("recipes");
                        setShowSaved(false);
                      }}
                      className="inline-flex h-9 w-full items-center justify-center rounded-xl border border-[#d5ddd1] bg-white px-3.5 text-sm font-medium text-[#213128] transition hover:bg-[rgba(255,255,255,0.94)] sm:h-9 sm:w-auto"
                    >
                      Change meal
                    </button>

                    {shouldPromoteShop ? (
                      <Link
                        href="/shop"
                        className="inline-flex h-9 w-full items-center justify-center rounded-xl bg-[#213128] px-3.5 text-sm font-medium text-white transition hover:opacity-95 sm:h-9 sm:w-auto"
                      >
                        Build your basket
                      </Link>
                    ) : null}
                  </div>
                </div>
              ) : (
                <div className="mt-2 space-y-2 rounded-[18px] border border-[#dbe2d7] bg-white p-3 sm:mt-3 sm:space-y-2.5 sm:p-3.5">
                  <div>
                    <p className="text-sm font-medium text-[#213128]">
                      Choose the next meal
                    </p>
                    <p className="mt-0.5 text-[11px] leading-4.5 text-[#617067] sm:mt-1 sm:text-sm">
                      Start with an idea, or use a favourite.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => {
                        setPanelMode("idea");
                        setShowSaved(false);
                      }}
                      className={`inline-flex h-10 w-full items-center justify-center rounded-xl border px-3 text-sm font-medium leading-none transition ${
                        panelMode === "idea"
                          ? "border-[#213128] bg-[#213128] text-white"
                          : "border-[#d5ddd1] bg-white text-[#213128] hover:bg-[rgba(255,255,255,0.94)]"
                      }`}
                    >
                      Choose the next meal
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setPanelMode("recipes");
                        setShowSaved(true);
                      }}
                      className={`inline-flex h-10 w-full items-center justify-center rounded-xl border px-3 text-sm font-medium leading-none transition ${
                        panelMode === "recipes" && showSaved
                          ? "border-[#213128] bg-[#213128] text-white"
                          : "border-[#d5ddd1] bg-white text-[#213128] hover:bg-[rgba(255,255,255,0.94)]"
                      }`}
                    >
                      Use a favourite
                    </button>
                  </div>

                  {hasBasketIngredients ? (
                    <div className="space-y-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setPanelMode("idea");
                          setShowSaved(false);
                          setIncludeBasketIngredients((current) => !current);
                        }}
                        className={`inline-flex h-10 w-full items-center justify-center rounded-xl border px-3 text-sm font-medium transition ${
                          includeBasketIngredients
                            ? "border-[#213128] bg-[rgba(233,240,228,0.92)] text-[#213128]"
                            : "border-[#d5ddd1] bg-[rgba(251,252,250,0.92)] text-[#213128] hover:bg-white"
                        }`}
                      >
                        {includeBasketIngredients
                          ? "Using what's in your basket"
                          : "Use what's in your basket"}
                      </button>

                      {includeBasketIngredients ? (
                        <div className="rounded-[14px] border border-[#dbe2d7] bg-[rgba(246,248,243,0.9)] px-3 py-2">
                          <p className="text-[11px] text-[#617067] sm:text-xs">
                            Using {basketIngredients.length} basket
                            {basketIngredients.length === 1
                              ? " ingredient"
                              : " ingredients"}
                          </p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {basketIngredients.slice(0, 4).map((ingredient) => (
                              <span
                                key={ingredient}
                                className="rounded-full border border-[#d8dfd3] bg-white px-2 py-0.5 text-[10px] text-[#58675e] sm:text-[11px]"
                              >
                                {ingredient}
                              </span>
                            ))}
                            {basketIngredients.length > 4 ? (
                              <span className="rounded-full border border-[#d8dfd3] bg-white px-2 py-0.5 text-[10px] text-[#58675e] sm:text-[11px]">
                                +{basketIngredients.length - 4} more
                              </span>
                            ) : null}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              )}

              {!activeRecipe && panelMode === "idea" ? (
                <div
                  ref={ideaPanelRef}
                  className="mt-2 space-y-2 rounded-[18px] border border-[#dbe2d7] bg-[rgba(255,255,255,0.82)] p-2.5 sm:mt-2.5 sm:space-y-2.5 sm:rounded-[20px] sm:p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-[#213128]">
                      Get an idea for {selectedDay.toLowerCase()}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-4.5 text-[#617067] sm:mt-1 sm:text-xs sm:leading-5">
                      Add a few ingredients, or pull in what&apos;s already in
                      your basket.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
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
                          className={`rounded-full border px-2.5 py-1 text-[11px] transition sm:px-3 sm:py-1.5 sm:text-sm ${
                            isActive
                              ? "border-[#b9c8b5] bg-[rgba(233,240,228,0.82)] text-[#213128]"
                              : "border-[#d8dfd3] bg-[rgba(255,255,255,0.88)] text-[#5d6b62] hover:bg-white"
                          }`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>

                  <div>
                    <label
                      htmlFor="planner-generator-ingredients"
                      className="text-[13px] font-medium text-[#213128] sm:text-sm"
                    >
                      Ingredients
                    </label>
                    <textarea
                      id="planner-generator-ingredients"
                      value={customIngredients}
                      onChange={(event) =>
                        setCustomIngredients(event.target.value)
                      }
                      placeholder="e.g. courgette, tomatoes, basil, pasta"
                      rows={2}
                      className="mt-1 w-full rounded-[16px] border border-[#d8dfd3] bg-[rgba(255,255,255,0.9)] px-3 py-2 text-sm text-[#213128] outline-none transition placeholder:text-[#839085] focus:border-[#b8c5b4] focus:bg-white sm:mt-1.5 sm:rounded-[18px]"
                    />
                  </div>

                  {allPlanningIngredients.length > 0 ? (
                    <div className="rounded-[16px] border border-[#e1e7dd] bg-[rgba(251,252,250,0.84)] p-2.5">
                      <p className="text-[11px] font-medium text-[#213128] sm:text-xs">
                        Using these ingredients
                      </p>
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {allPlanningIngredients.map((item) => (
                          <span
                            key={item}
                            className="rounded-full border border-[#d8dfd3] bg-white px-2 py-0.5 text-[10px] text-[#58675e] sm:text-[11px]"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <div>
                    <button
                      type="button"
                      onClick={() => setShowPreferences((current) => !current)}
                      className="text-[11px] font-medium text-[#213128] underline decoration-[rgba(33,49,40,0.2)] underline-offset-4"
                    >
                      {showPreferences
                        ? "Hide preferences"
                        : "Add a few preferences"}
                    </button>

                    {showPreferences ? (
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {preferenceOptions.map((preference) => {
                          const isSelected =
                            selectedPreferences.includes(preference);

                          return (
                            <button
                              key={preference}
                              type="button"
                              onClick={() => togglePreference(preference)}
                              className={`rounded-full border px-2.5 py-1 text-[11px] transition sm:px-3 sm:py-1.5 sm:text-sm ${
                                isSelected
                                  ? "border-[#b8c5b4] bg-[rgba(233,240,228,0.82)] text-[#213128]"
                                  : "border-[#d8dfd3] bg-[rgba(255,255,255,0.88)] text-[#5d6b62] hover:bg-white"
                              }`}
                            >
                              {preference}
                            </button>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>

                  <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:gap-2">
                    <button
                      type="button"
                      onClick={handleGetRecipeIdea}
                      disabled={isGenerating || !hasFreeRecipeAccess}
                      className="inline-flex h-10 w-full items-center justify-center rounded-xl bg-[#213128] px-3.5 text-sm font-medium text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 sm:h-9"
                    >
                      {isGenerating
                        ? "Getting an idea..."
                        : hasFreeRecipeAccess
                          ? `Get an idea for ${selectedDay}`
                          : "Unlock unlimited recipes"}
                    </button>

                    <Link
                      href="/recipes"
                      className="inline-flex h-9 items-center justify-center rounded-xl border border-[#d5ddd1] bg-[rgba(255,255,255,0.86)] px-3 text-[13px] font-medium text-[#213128] transition hover:bg-white sm:h-9 sm:px-3.5 sm:text-sm"
                    >
                      Browse recipes
                    </Link>
                  </div>

                  {generatorError ? (
                    <div className="rounded-[16px] border border-[#e4d8cb] bg-[#fbf6f0] px-3 py-2 text-sm text-[#6a5c4f]">
                      {generatorError}
                    </div>
                  ) : null}

                  {paywallMessage ? (
                    <div className="rounded-[16px] border border-[#ddd4c8] bg-[rgba(247,242,235,0.86)] px-3 py-2 text-sm text-[#5f675c] sm:rounded-[18px] sm:py-2.5">
                      <p>{paywallMessage}</p>

                      <div className="mt-2 flex flex-wrap gap-2">
                        <Link
                          href="/pricing"
                          className="inline-flex h-8.5 items-center rounded-full bg-[#213128] px-3.5 text-sm text-white transition hover:opacity-90 sm:h-9"
                        >
                          Unlock the planner
                        </Link>

                        <Link
                          href="/shop"
                          className="inline-flex h-8.5 items-center rounded-full border border-[#d6cec2] bg-[rgba(255,255,255,0.86)] px-3.5 text-sm text-[#213128] transition hover:bg-white sm:h-9"
                        >
                          See weekly boxes
                        </Link>
                      </div>
                    </div>
                  ) : null}

                  {isGenerating ? (
                    <div className="rounded-[16px] border border-[#d8dfd3] bg-[rgba(255,255,255,0.86)] p-2.5 sm:rounded-[18px] sm:p-3">
                      <p className="text-sm font-medium text-[#213128]">
                        Getting an idea for {selectedDay.toLowerCase()}
                      </p>
                      <p className="mt-0.5 text-sm text-[#66756b] sm:mt-1">
                        Just a moment.
                      </p>
                    </div>
                  ) : null}

                  {generatedRecipe ? (
                    <div
                      ref={generatedRecipeRef}
                      className="overflow-hidden rounded-[18px] border border-[#d8dfd3] bg-[rgba(255,255,255,0.9)] sm:rounded-[20px]"
                    >
                      {generatedImageUrl ? (
                        <img
                          src={generatedImageUrl}
                          alt={generatedRecipe.title}
                          className="h-[96px] w-full object-cover sm:h-[150px]"
                        />
                      ) : null}

                      <div className="p-2.5 sm:p-3">
                        <p className="text-[10px] uppercase tracking-[0.18em] text-[#78867c]">
                          Fresh idea
                        </p>
                        <h4 className="mt-1 text-sm font-semibold tracking-[-0.02em] text-[#1f2b24] sm:text-lg">
                          {generatedRecipe.title}
                        </h4>
                        <p className="mt-1 text-[11px] leading-4.5 text-[#617067] sm:text-sm sm:leading-5">
                          {truncate(generatedRecipe.description, 120)}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-1">
                          {generatedRecipe.ingredientsUsed
                            .slice(0, 6)
                            .map((item) => (
                              <span
                                key={item}
                                className="rounded-full border border-[#d8dfd3] bg-[rgba(251,252,250,0.88)] px-2 py-0.5 text-[10px] text-[#58675e] sm:text-[11px]"
                              >
                                {item}
                              </span>
                            ))}
                        </div>

                        <div className="mt-2 grid grid-cols-1 gap-2 sm:mt-2.5 sm:flex sm:flex-wrap">
                          <button
                            type="button"
                            onClick={handleAddGeneratedToDay}
                            className="inline-flex h-10 w-full items-center justify-center rounded-xl bg-[#213128] px-3.5 text-sm font-medium text-white transition hover:opacity-95 sm:h-9 sm:w-auto"
                          >
                            Add to {selectedDay}
                          </button>

                          <button
                            type="button"
                            onClick={handleKeepGeneratedInPlanner}
                            className="inline-flex h-9 items-center justify-center rounded-xl border border-[#d5ddd1] bg-[rgba(255,255,255,0.86)] px-3.5 text-sm font-medium text-[#213128] transition hover:bg-white sm:h-9"
                          >
                            Keep for later
                          </button>

                          <button
                            type="button"
                            onClick={handleSaveGeneratedToFavourites}
                            className="inline-flex h-9 items-center justify-center rounded-xl border border-[#d5ddd1] bg-[rgba(255,255,255,0.86)] px-3.5 text-sm font-medium text-[#213128] transition hover:bg-white sm:h-9"
                          >
                            Save to favourites
                          </button>
                        </div>

                        {generatedRecipe.steps.length > 0 ? (
                          <div className="mt-2">
                            <button
                              type="button"
                              onClick={() =>
                                setShowMethod((current) => !current)
                              }
                              className="text-[11px] font-medium text-[#213128] underline decoration-[rgba(33,49,40,0.2)] underline-offset-4"
                            >
                              {showMethod ? "Hide method" : "Show method"}
                            </button>

                            {showMethod ? (
                              <ol className="mt-2 space-y-2 text-sm leading-5 text-[#213128]">
                                {generatedRecipe.steps.map((step, index) => (
                                  <li
                                    key={`${index}-${step}`}
                                    className="flex gap-2.5"
                                  >
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

                        {generatorMessage ? (
                          <div className="mt-2 rounded-[16px] border border-[#dbe4d5] bg-[#f4f8f1] px-3 py-2 text-sm text-[#425142] sm:mt-2.5 sm:rounded-[18px]">
                            {generatorMessage}
                          </div>
                        ) : null}

                        {saveMessage ? (
                          <div className="mt-2 rounded-[16px] border border-[#dbe4d5] bg-[#f4f8f1] px-3 py-2 text-sm text-[#425142] sm:mt-2.5 sm:rounded-[18px]">
                            {saveMessage}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {shouldShowBasketGuide ? (
                <div className="mt-2 rounded-[18px] border border-[#dbe2d7] bg-[rgba(255,255,255,0.78)] p-2.5 sm:mt-2.5 sm:p-3 md:hidden">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-[#78867c]">
                        Basket guide
                      </p>
                      <p className="mt-1 text-sm font-medium text-[#213128]">
                        What shows up this week
                      </p>
                    </div>

                    {shouldPromoteShop ? (
                      <Link
                        href="/shop"
                        className="inline-flex h-8 items-center rounded-full bg-[#213128] px-3 text-[11px] font-medium text-white"
                      >
                        Shop
                      </Link>
                    ) : null}
                  </div>

                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {weekSummary.slice(0, 6).map((item) => (
                      <div
                        key={`${item.label}-${item.days.join("-")}`}
                        className="rounded-full border border-[#e1e7dd] bg-[rgba(252,252,250,0.82)] px-2.5 py-1 text-[11px] text-[#58675e]"
                      >
                        {item.label} · {item.count}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <div
              ref={recipeLibraryRef}
              className={`rounded-[20px] bg-[rgba(252,252,250,0.82)] p-2.5 sm:rounded-[22px] sm:p-4 ${
                panelMode === "recipes" ? "block" : "hidden md:block"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#78867c]">
                    Recipe library
                  </p>
                  <h3 className="mt-1 text-sm font-semibold tracking-[-0.02em] text-[#1f2b24] sm:text-base">
                    {activeRecipe
                      ? `Change ${selectedDay.toLowerCase()}`
                      : `Meals for ${selectedDay.toLowerCase()}`}
                  </h3>
                </div>

                <div className="flex rounded-full bg-[rgba(238,242,235,0.9)] p-1">
                  <button
                    type="button"
                    onClick={() => setShowSaved(false)}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition sm:px-3 sm:py-1.5 sm:text-sm ${
                      !showSaved
                        ? "bg-white text-[#213128] shadow-sm"
                        : "text-[#68776d]"
                    }`}
                  >
                    Planner
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSaved(true)}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition sm:px-3 sm:py-1.5 sm:text-sm ${
                      showSaved
                        ? "bg-white text-[#213128] shadow-sm"
                        : "text-[#68776d]"
                    }`}
                  >
                    Favourites
                  </button>
                </div>
              </div>

              {(panelMode === "recipes" || panelMode === null) && (
                <>
                  {(visibleRecipes.length > 0 || showSaved) && (
                    <div className="mt-2.5 sm:mt-3">
                      <label htmlFor="planner-search" className="sr-only">
                        Search recipes
                      </label>
                      <input
                        id="planner-search"
                        type="text"
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder={
                          showSaved
                            ? "Search favourites"
                            : "Search planner meals"
                        }
                        className="w-full rounded-[16px] border border-[#d8dfd3] bg-[rgba(255,255,255,0.84)] px-3 py-2 text-sm text-[#213128] outline-none transition placeholder:text-[#839085] focus:border-[#b8c5b4] focus:bg-white sm:rounded-[18px]"
                      />
                    </div>
                  )}

                  {visibleRecipes.length === 0 ? (
                    <div className="mt-2.5 rounded-[16px] border border-dashed border-[#d8dfd3] bg-[rgba(255,255,255,0.74)] px-3 py-3 sm:mt-3 sm:rounded-[18px]">
                      <p className="text-sm font-medium text-[#213128]">
                        {showSaved
                          ? "No favourites yet"
                          : "No meals saved for later"}
                      </p>
                      <p className="mt-0.5 text-[11px] leading-4.5 text-[#617067] sm:mt-1 sm:text-sm">
                        {showSaved
                          ? "Save a meal you’d use again and it will show here."
                          : "Get an idea, then add it to a day."}
                      </p>
                    </div>
                  ) : filteredRecipes.length === 0 ? (
                    <div className="mt-2.5 rounded-[16px] border border-dashed border-[#d8dfd3] bg-[rgba(255,255,255,0.74)] px-3 py-3 sm:mt-3 sm:rounded-[18px]">
                      <p className="text-sm font-medium text-[#213128]">
                        No matching recipes
                      </p>
                    </div>
                  ) : (
                    <div className="mt-2.5 grid grid-cols-1 gap-1.5 sm:mt-3 sm:gap-2">
                      {filteredRecipes.map((recipe) => {
                        const inPlanner = plannerRecipeIds.has(recipe.id);
                        const image = getRecipeImage(recipe);
                        const isAssignedToSelectedDay =
                          weeklyMeals[selectedDay] === recipe.id;

                        return (
                          <article
                            key={recipe.id}
                            className="overflow-hidden rounded-[16px] border border-[#e2e8de] bg-[rgba(255,255,255,0.86)] transition hover:bg-white sm:rounded-[18px]"
                          >
                            <div className="flex gap-2 p-2 sm:gap-2.5 sm:p-2.5">
                              <div className="w-10 shrink-0 sm:w-12">
                                {image ? (
                                  <img
                                    src={image}
                                    alt={recipe.title}
                                    className="h-10 w-10 rounded-[12px] object-cover sm:h-12 sm:w-12 sm:rounded-[14px]"
                                  />
                                ) : (
                                  <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#dde6d8] text-[11px] font-semibold text-[#536458] sm:h-12 sm:w-12 sm:rounded-[14px] sm:text-xs">
                                    {getInitials(recipe.title)}
                                  </div>
                                )}
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-[#213128]">
                                  {recipe.title}
                                </p>
                                <p className="mt-0.5 text-[11px] leading-4 text-[#617067] sm:text-xs sm:leading-5">
                                  {recipe.description
                                    ? truncate(recipe.description, 64)
                                    : "A meal idea ready for the week."}
                                </p>

                                {recipe.ingredientsUsed?.length ||
                                recipe.ingredients?.length ? (
                                  <div className="mt-1 flex flex-wrap gap-1">
                                    {(recipe.ingredientsUsed?.length
                                      ? recipe.ingredientsUsed
                                      : recipe.ingredients || []
                                    )
                                      .slice(0, 4)
                                      .map((item) => (
                                        <span
                                          key={item}
                                          className="rounded-full border border-[#d8dfd3] bg-[rgba(251,252,250,0.88)] px-2 py-0.5 text-[10px] text-[#58675e]"
                                        >
                                          {item}
                                        </span>
                                      ))}
                                  </div>
                                ) : null}

                                <div className="mt-1.5 grid grid-cols-1 gap-1.5 sm:mt-2 sm:flex sm:flex-wrap">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      assignRecipeToSelectedDay(recipe)
                                    }
                                    className="inline-flex h-9 w-full items-center justify-center rounded-xl bg-[#213128] px-3 text-[11px] font-medium text-white transition hover:opacity-95 sm:h-8.5 sm:w-auto sm:text-sm"
                                  >
                                    {isAssignedToSelectedDay
                                      ? `${selectedDay} sorted`
                                      : `Add to ${selectedDay}`}
                                  </button>

                                  {showSaved ? (
                                    <button
                                      type="button"
                                      onClick={() => addRecipeToPlanner(recipe)}
                                      disabled={inPlanner}
                                      className={`inline-flex h-9 w-full items-center justify-center rounded-xl px-3 text-[11px] font-medium transition sm:h-8.5 sm:w-auto sm:text-sm ${
                                        inPlanner
                                          ? "bg-[#eef2eb] text-[#7d897f]"
                                          : "border border-[#d5ddd1] bg-[rgba(255,255,255,0.86)] text-[#213128] hover:bg-white"
                                      }`}
                                    >
                                      {inPlanner
                                        ? "Saved for later"
                                        : "Keep for later"}
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeRecipeFromPlanner(recipe.id)
                                      }
                                      className="inline-flex h-9 w-full items-center justify-center rounded-xl border border-[#d5ddd1] bg-[rgba(255,255,255,0.86)] px-3 text-[11px] font-medium text-[#213128] transition hover:bg-white sm:h-8.5 sm:w-auto sm:text-sm"
                                    >
                                      Remove
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </section>

        {shouldShowBasketGuide ? (
          <section className="mt-3 hidden rounded-[24px] border border-[rgba(223,230,218,0.95)] bg-[rgba(255,255,255,0.78)] p-4 shadow-[0_8px_24px_rgba(31,43,36,0.05)] backdrop-blur-md sm:p-5 md:block">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#758278]">
                  Weekly basket guide
                </p>
                <h2 className="mt-1 text-lg font-semibold tracking-[-0.02em] text-[#1f2b24]">
                  Ingredients showing up this week
                </h2>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-[#617067]">
                  Use this to spot what you’ll need more than once.
                </p>
              </div>

              {shouldPromoteShop ? (
                <Link
                  href="/shop"
                  className="inline-flex min-h-[40px] items-center rounded-full bg-[#213128] px-4 text-sm font-medium text-white transition hover:opacity-95"
                >
                  Build your basket
                </Link>
              ) : null}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {weekSummary.map((item) => (
                <div
                  key={`${item.label}-${item.days.join("-")}`}
                  className="rounded-2xl border border-[#e1e7dd] bg-[rgba(252,252,250,0.82)] px-3 py-2"
                >
                  <p className="text-sm font-medium text-[#213128]">
                    {item.label}
                  </p>
                  <p className="mt-1 text-[11px] text-[#718076]">
                    {item.count > 1 ? `${item.count} matches` : "1 match"} ·{" "}
                    {item.days.map((day) => day.slice(0, 3)).join(", ")}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {!hasLoaded ? (
          <div className="mt-4 text-sm text-[#66756b]">Loading planner…</div>
        ) : null}
      </div>
    </main>
  );
}
