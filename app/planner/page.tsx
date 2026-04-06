"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "../cart-context";
import { getUser } from "../lib/authClient";
import { loadPlanner, savePlanner } from "../lib/plannerApi";

type DayKey =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

type ShopDisplayItem = {
  name: string;
  price: number;
  image: string;
  description: string;
  details?: string;
  category: "boxes" | "pantry" | "cupboard" | "extras";
  checkoutType: "subscription" | "one-off";
  buttonLabel?: string;
  weeklyIncludes?: string[];
  bestFor?: string;
  note?: string;
  weight?: string;
};

type BasketMatch = {
  id?: string;
  name?: string;
  title?: string;
  quantity?: number;
};

type PlannerMeal = {
  id: string;
  title: string;
  description: string;
  image: string;
  ingredientsUsed: string[];
  pantryStaples: string[];
  steps: string[];
  tags: string[];
  productNames: string[];
  basketMatches: BasketMatch[];
};

type PlannerState = Record<DayKey, PlannerMeal | null>;

type UserLike = {
  id: string;
};

type RecipeApiResponse = {
  recipe?: {
    title?: string;
    description?: string;
    ingredientsUsed?: string[];
    pantryStaples?: string[];
    steps?: string[];
  };
  imageUrl?: string | null;
  error?: string;
};

const DAYS: Array<{ key: DayKey; label: string; short: string }> = [
  { key: "monday", label: "Monday", short: "Mon" },
  { key: "tuesday", label: "Tuesday", short: "Tue" },
  { key: "wednesday", label: "Wednesday", short: "Wed" },
  { key: "thursday", label: "Thursday", short: "Thu" },
  { key: "friday", label: "Friday", short: "Fri" },
  { key: "saturday", label: "Saturday", short: "Sat" },
  { key: "sunday", label: "Sunday", short: "Sun" },
];

const EMPTY_PLANNER: PlannerState = {
  monday: null,
  tuesday: null,
  wednesday: null,
  thursday: null,
  friday: null,
  saturday: null,
  sunday: null,
};

const produceBoxes: ShopDisplayItem[] = [
  {
    name: "Weekly Produce Box",
    price: 20,
    image: "/weekly-harvest-box.png",
    category: "boxes",
    checkoutType: "subscription",
    buttonLabel: "Add weekly box",
    description:
      "A smaller produce box with a useful mix of everyday fruit and veg.",
    details:
      "Best suited to weekly delivery. Contents change week to week depending on availability, so the mix is not fixed.",
    weeklyIncludes: ["Carrots", "Potatoes", "Leeks", "Apples", "Onions"],
    bestFor: "Best for 1–2 people or lighter weekly cooking",
    note: "Best as a weekly subscription",
  },
  {
    name: "Family Produce Box",
    price: 30,
    image: "/family-harvest-box.png",
    category: "boxes",
    checkoutType: "subscription",
    buttonLabel: "Add family box",
    description:
      "A larger produce box for households that cook regularly through the week.",
    details:
      "Designed as a fuller weekly box, with contents changing depending on what is available.",
    weeklyIncludes: ["Carrots", "Potatoes", "Tomatoes", "Apples", "Greens"],
    bestFor: "Best for families or households cooking most nights",
    note: "Best as a weekly subscription",
  },
];

const pantryItems: ShopDisplayItem[] = [
  {
    name: "Sorrel & Walnut Pesto",
    price: 4.5,
    image: "/sorrel-walnut-pesto.png",
    category: "pantry",
    checkoutType: "one-off",
    description: "A fresh, savoury jar for pasta or roasted vegetables.",
    details:
      "A useful one-off add-on to include with your weekly box or order.",
    note: "Usually added as a one-off",
  },
  {
    name: "Rose Harissa",
    price: 5.25,
    image: "/rose-harissa.png",
    category: "pantry",
    checkoutType: "one-off",
    description: "A gently spiced pantry extra for roasting or dressing.",
    details: "Easy to add when you want a little more flavour in the week.",
    note: "Usually added as a one-off",
  },
  {
    name: "Salted Caramel Sauce",
    price: 5,
    image: "/salted-caramel.png",
    category: "pantry",
    checkoutType: "one-off",
    description: "A rich sauce for desserts or simple extras.",
    details: "A simple one-off extra rather than part of a weekly base order.",
    note: "Usually added as a one-off",
  },
  {
    name: "Dark Chocolate & Hazelnut Spread",
    price: 5,
    image: "/dark-chocolate.png",
    category: "pantry",
    checkoutType: "one-off",
    description: "A simple chocolate spread for toast or baking.",
    details: "A good add-on when you want something sweet in the cupboard.",
    note: "Usually added as a one-off",
  },
];

const cupboardItems: ShopDisplayItem[] = [
  {
    name: "Casarecce Pasta",
    price: 4.95,
    image: "/images/cupboard/casarecce.jpg",
    category: "cupboard",
    checkoutType: "one-off",
    weight: "500g",
    description:
      "A slightly more special pasta shape that still feels easy to cook with.",
    details:
      "Good with pesto, harissa, greens, roasted vegetables, or whatever needs using up.",
  },
  {
    name: "Orzo Pasta",
    price: 4.5,
    image: "/images/cupboard/orzo.jpg",
    category: "cupboard",
    checkoutType: "one-off",
    weight: "500g",
    description:
      "A very flexible pasta for quick bowls, soups, traybakes, and easy midweek cooking.",
    details:
      "Especially useful when you want something fast, simple, and not too heavy.",
  },
  {
    name: "Giant Couscous",
    price: 4.75,
    image: "/images/cupboard/giant-couscous.jpg",
    category: "cupboard",
    checkoutType: "one-off",
    weight: "500g",
    description: "A useful grain-like cupboard staple that works warm or cold.",
    details:
      "Good with roast vegetables, herbs, dressings, and spoonfuls of something punchy from the fridge.",
  },
  {
    name: "Puy Lentils",
    price: 4.95,
    image: "/images/cupboard/puy-lentils.jpg",
    category: "cupboard",
    checkoutType: "one-off",
    weight: "500g",
    description:
      "A pantry staple with a little more structure, good for warm salads and batch cooking.",
    details:
      "Useful to cook ahead and keep in the fridge for easy lunches, bowls, and simple dinners.",
  },
];

const extraItems: ShopDisplayItem[] = [
  {
    name: "Almonds",
    price: 4.95,
    image: "/images/extras/almonds.jpg",
    category: "extras",
    checkoutType: "one-off",
    weight: "500g",
    description:
      "An everyday nut to keep on hand for baking, breakfast, salads, and simple cooking.",
  },
  {
    name: "Walnuts",
    price: 5.5,
    image: "/images/extras/walnuts.jpg",
    category: "extras",
    checkoutType: "one-off",
    weight: "500g",
    description:
      "A savoury-leaning extra that works beautifully with grains, leaves, roast veg, and cheese.",
  },
  {
    name: "Hazelnuts",
    price: 5.95,
    image: "/images/extras/hazelnuts.jpg",
    category: "extras",
    checkoutType: "one-off",
    weight: "500g",
    description:
      "A slightly more special nut that works especially well with sweet things and darker flavours.",
  },
];

const allShopItems: ShopDisplayItem[] = [
  ...produceBoxes,
  ...pantryItems,
  ...cupboardItems,
  ...extraItems,
];

const QUICK_STARTS = [
  { value: "use-what-ive-got", label: "Use what I've got" },
  { value: "quick-tonight", label: "Quick tonight" },
  { value: "comforting", label: "Comforting" },
] as const;

const PREFERENCES = [
  "Quick meals",
  "Vegetarian",
  "High protein",
  "Family-friendly",
  "Low waste",
] as const;

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1200&q=80",
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

function dedupeStrings(values: string[]) {
  const seen = new Set<string>();
  const result: string[] = [];

  values.forEach((value) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    const key = normaliseIngredient(trimmed);
    if (!key || seen.has(key)) return;
    seen.add(key);
    result.push(trimmed);
  });

  return result;
}

function createFallbackMeal(
  dayIndex: number,
  productNames: string[],
  items: string[],
): PlannerMeal {
  const leadItem =
    items[dayIndex % Math.max(items.length, 1)] ?? "seasonal veg";
  const leadProduct =
    productNames[dayIndex % Math.max(productNames.length, 1)] ??
    "Weekly Produce Box";

  return {
    id: `fallback-${dayIndex}-${Date.now()}`,
    title: `${leadItem} supper idea`,
    description: `A simple meal shaped around ${leadItem.toLowerCase()} and your selected products.`,
    image: FALLBACK_IMAGES[dayIndex % FALLBACK_IMAGES.length],
    ingredientsUsed: dedupeStrings([leadItem, ...items.slice(0, 5)]).slice(
      0,
      6,
    ),
    pantryStaples: ["Olive oil", "Salt", "Pepper"],
    steps: [
      "Prep the vegetables and any extras you want to use up.",
      `Cook everything simply and build flavour with ${leadProduct}.`,
      "Finish with herbs, seasoning, and serve while warm.",
    ],
    tags: ["generated", "veg-first"],
    productNames: productNames.slice(0, 3),
    basketMatches: dedupeStrings([leadProduct, ...items.slice(0, 3)]).map(
      (name) => ({ name, quantity: 1 }),
    ),
  };
}

function normaliseLoadedPlanner(input: unknown): PlannerState {
  if (!input || typeof input !== "object") return EMPTY_PLANNER;

  const source = input as Record<string, unknown>;
  const next: PlannerState = { ...EMPTY_PLANNER };

  DAYS.forEach((day, index) => {
    const value = source[day.key];
    if (!value || typeof value !== "object") return;

    const meal = value as Record<string, unknown>;
    next[day.key] = {
      id: typeof meal.id === "string" ? meal.id : `${day.key}-${Date.now()}`,
      title: typeof meal.title === "string" ? meal.title : "Generated meal",
      description: typeof meal.description === "string" ? meal.description : "",
      image:
        typeof meal.image === "string" ? meal.image : FALLBACK_IMAGES[index],
      ingredientsUsed: Array.isArray(meal.ingredientsUsed)
        ? meal.ingredientsUsed.filter(
            (item): item is string => typeof item === "string",
          )
        : [],
      pantryStaples: Array.isArray(meal.pantryStaples)
        ? meal.pantryStaples.filter(
            (item): item is string => typeof item === "string",
          )
        : [],
      steps: Array.isArray(meal.steps)
        ? meal.steps.filter((item): item is string => typeof item === "string")
        : [],
      tags: Array.isArray(meal.tags)
        ? meal.tags.filter((item): item is string => typeof item === "string")
        : [],
      productNames: Array.isArray(meal.productNames)
        ? meal.productNames.filter(
            (item): item is string => typeof item === "string",
          )
        : [],
      basketMatches: Array.isArray(meal.basketMatches)
        ? meal.basketMatches.filter(
            (item): item is BasketMatch => !!item && typeof item === "object",
          )
        : [],
    };
  });

  return next;
}

function buildBasketCandidates(meal: PlannerMeal): string[] {
  return dedupeStrings([
    ...meal.productNames,
    ...meal.ingredientsUsed,
    ...meal.pantryStaples,
    ...meal.basketMatches
      .map((item) => item.name ?? item.title ?? item.id ?? "")
      .filter(Boolean),
  ]);
}

export default function PlannerPage() {
  const { cart, addManyToCart } = useCart();

  const [planner, setPlanner] = useState<PlannerState>(EMPTY_PLANNER);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState<DayKey>("monday");
  const [selectedBoxName, setSelectedBoxName] = useState<string>(
    produceBoxes[0]?.name ?? "Weekly Produce Box",
  );
  const [selectedProductNames, setSelectedProductNames] = useState<string[]>([
    produceBoxes[0]?.name ?? "Weekly Produce Box",
    pantryItems[0]?.name ?? "Sorrel & Walnut Pesto",
  ]);
  const [customIngredients, setCustomIngredients] = useState("");
  const [includeBasketItems, setIncludeBasketItems] = useState(true);
  const [quickStart, setQuickStart] = useState<string>("use-what-ive-got");
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([
    "Low waste",
  ]);
  const [isGeneratingWeek, setIsGeneratingWeek] = useState(false);
  const [basketMessage, setBasketMessage] = useState("");

  const totalItems = useMemo(() => cart.length, [cart]);

  const basketItemNames = useMemo(() => cart.map((item) => item.name), [cart]);

  const selectedBox = useMemo(
    () =>
      produceBoxes.find((item) => item.name === selectedBoxName) ??
      produceBoxes[0],
    [selectedBoxName],
  );

  const selectedProducts = useMemo(() => {
    const lookup = new Map(allShopItems.map((item) => [item.name, item]));
    return selectedProductNames
      .map((name) => lookup.get(name))
      .filter((item): item is ShopDisplayItem => Boolean(item));
  }, [selectedProductNames]);

  const typedIngredients = useMemo(
    () =>
      customIngredients
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    [customIngredients],
  );

  const starterIngredients = useMemo(
    () =>
      selectedBox?.weeklyIncludes?.filter(Boolean) ?? [
        "Carrots",
        "Potatoes",
        "Leeks",
        "Apples",
        "Onions",
      ],
    [selectedBox],
  );

  const selectedProductAnchorItems = useMemo(() => {
    const anchored = selectedProducts.flatMap((item) => {
      if (item.category === "boxes") {
        return item.weeklyIncludes ?? starterIngredients;
      }
      return [item.name];
    });
    return dedupeStrings(anchored);
  }, [selectedProducts, starterIngredients]);

  const generationItems = useMemo(() => {
    const values = [
      ...starterIngredients,
      ...selectedProductAnchorItems,
      ...typedIngredients,
      ...(includeBasketItems ? basketItemNames : []),
    ];
    return dedupeStrings(values).slice(0, 20);
  }, [
    starterIngredients,
    selectedProductAnchorItems,
    typedIngredients,
    includeBasketItems,
    basketItemNames,
  ]);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        setLoading(true);
        setError(null);
        const user = (await getUser()) as UserLike | null;

        if (!user?.id) {
          if (!cancelled) {
            setCurrentUserId(null);
            setPlanner(EMPTY_PLANNER);
            setLoading(false);
          }
          return;
        }

        const loaded = await loadPlanner(user.id);
        if (!cancelled) {
          setCurrentUserId(user.id);
          setPlanner(normaliseLoadedPlanner(loaded));
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("Could not load your planner yet.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!basketMessage) return;
    const timer = window.setTimeout(() => setBasketMessage(""), 2500);
    return () => window.clearTimeout(timer);
  }, [basketMessage]);

  async function persistPlanner(nextState: PlannerState) {
    if (!currentUserId) return;
    try {
      setSaving(true);
      await savePlanner(currentUserId, nextState);
    } catch (err) {
      console.error(err);
      setError("Your planner could not be saved right now.");
    } finally {
      setSaving(false);
    }
  }

  function updateDay(day: DayKey, meal: PlannerMeal | null) {
    const nextState = { ...planner, [day]: meal };
    setPlanner(nextState);
    void persistPlanner(nextState);
  }

  function togglePreference(preference: string) {
    setSelectedPreferences((current) =>
      current.includes(preference)
        ? current.filter((item) => item !== preference)
        : [...current, preference],
    );
  }

  function toggleProduct(productName: string) {
    setSelectedProductNames((current) => {
      const exists = current.includes(productName);
      if (exists) {
        const next = current.filter((item) => item !== productName);
        return next.length > 0 ? next : current;
      }
      return [...current, productName];
    });
  }

  async function generateMealForDay(dayIndex: number): Promise<PlannerMeal> {
    try {
      const response = await fetch("/api/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: generationItems,
          quickStart,
          preferences: selectedPreferences,
          day: DAYS[dayIndex].label,
        }),
      });

      const data = (await response.json()) as RecipeApiResponse;

      if (!response.ok || !data.recipe) {
        throw new Error(data.error || "Failed to generate recipe");
      }

      return {
        id: `${DAYS[dayIndex].key}-${Date.now()}-${dayIndex}`,
        title: data.recipe.title ?? `${DAYS[dayIndex].label} meal`,
        description:
          data.recipe.description ??
          `A simple ${DAYS[dayIndex].label.toLowerCase()} idea built around your selected box and products.`,
        image:
          data.imageUrl ?? FALLBACK_IMAGES[dayIndex % FALLBACK_IMAGES.length],
        ingredientsUsed: Array.isArray(data.recipe.ingredientsUsed)
          ? data.recipe.ingredientsUsed
          : generationItems.slice(0, 6),
        pantryStaples: Array.isArray(data.recipe.pantryStaples)
          ? data.recipe.pantryStaples
          : ["Olive oil", "Salt", "Pepper"],
        steps: Array.isArray(data.recipe.steps) ? data.recipe.steps : [],
        tags: [quickStart, ...selectedPreferences].slice(0, 4),
        productNames: selectedProducts.map((item) => item.name).slice(0, 4),
        basketMatches: dedupeStrings([
          ...selectedProducts.map((item) => item.name),
          ...generationItems.slice(0, 4),
        ]).map((name) => ({ name, quantity: 1 })),
      };
    } catch (err) {
      console.warn("Falling back to local planner meal", err);
      return createFallbackMeal(
        dayIndex,
        selectedProducts.map((item) => item.name),
        generationItems,
      );
    }
  }

  async function handleGenerateWeek() {
    setIsGeneratingWeek(true);
    setError(null);

    try {
      const meals = await Promise.all(
        DAYS.map((_, index) => generateMealForDay(index)),
      );
      const nextState = DAYS.reduce<PlannerState>(
        (acc, day, index) => {
          acc[day.key] = meals[index];
          return acc;
        },
        { ...EMPTY_PLANNER },
      );

      setPlanner(nextState);
      setActiveDay("monday");
      await persistPlanner(nextState);
    } catch (err) {
      console.error(err);
      setError("We could not generate your week right now.");
    } finally {
      setIsGeneratingWeek(false);
    }
  }

  function handleClearWeek() {
    setPlanner(EMPTY_PLANNER);
    void persistPlanner(EMPTY_PLANNER);
  }

  const filledDays = useMemo(
    () => Object.values(planner).filter(Boolean).length,
    [planner],
  );

  const activeMeal = planner[activeDay];

  const weekSuggestions = useMemo(() => {
    const suggestionMap = new Map<
      string,
      { item: ShopDisplayItem; quantity: number; matchedMeals: string[] }
    >();

    Object.values(planner).forEach((meal) => {
      if (!meal) return;
      const candidates = buildBasketCandidates(meal);

      candidates.forEach((candidate) => {
        const candidateKey = normaliseIngredient(candidate);
        const found = allShopItems.find((item) => {
          const searchable = [
            item.name,
            item.description,
            item.details ?? "",
            ...(item.weeklyIncludes ?? []),
          ].join(" ");
          const itemKey = normaliseIngredient(searchable);
          return (
            itemKey.includes(candidateKey) ||
            candidateKey.includes(normaliseIngredient(item.name))
          );
        });

        if (!found) return;
        const existing = suggestionMap.get(found.name);
        if (existing) {
          existing.quantity += 1;
          if (!existing.matchedMeals.includes(meal.title))
            existing.matchedMeals.push(meal.title);
        } else {
          suggestionMap.set(found.name, {
            item: found,
            quantity: 1,
            matchedMeals: [meal.title],
          });
        }
      });
    });

    return Array.from(suggestionMap.values()).sort((a, b) =>
      a.item.name.localeCompare(b.item.name),
    );
  }, [planner]);

  const weeklyMatchedTotal = useMemo(
    () =>
      weekSuggestions.reduce(
        (sum, entry) => sum + entry.item.price * entry.quantity,
        0,
      ),
    [weekSuggestions],
  );

  function handleAddWeekToBasket() {
    const itemsToAdd = weekSuggestions.flatMap((entry) =>
      Array.from({ length: entry.quantity }, () => ({
        name: entry.item.name,
        price: entry.item.price,
        image: entry.item.image,
        category: entry.item.category,
        checkoutType: entry.item.checkoutType,
      })),
    );

    if (itemsToAdd.length === 0) {
      setBasketMessage("There were no matched shop items to add yet.");
      return;
    }

    addManyToCart(itemsToAdd);
    setBasketMessage("Suggested week items added to your basket.");
  }

  return (
    <main className="min-h-screen bg-[#f4efe9] text-[#243328]">
      <header className="sticky top-0 z-30 border-b border-[rgba(230,221,210,0.92)] bg-[rgba(244,239,233,0.86)] backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 md:px-10">
          <Link
            href="/"
            className="text-[11px] tracking-[0.28em] text-[#60705f] hover:text-[#243328] sm:text-sm"
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
              href="/planner"
              className="text-sm text-[#243328] underline underline-offset-4"
            >
              Planner
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
            className="inline-flex rounded-full border border-[#d6cec2] bg-[rgba(255,255,255,0.88)] px-4 py-2 text-sm text-[#243328] shadow-sm transition hover:bg-white"
          >
            Basket{totalItems > 0 ? ` (${totalItems})` : ""}
          </Link>
        </div>
      </header>

      <section className="border-b border-[rgba(230,221,210,0.86)] px-4 py-8 sm:px-6 md:px-10 md:py-10">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[28px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.84)] p-5 md:p-8">
            <p className="text-xs uppercase tracking-[0.22em] text-[#6b776c]">
              Weekly planner
            </p>
            <h1 className="mt-3 font-serif text-3xl leading-tight tracking-tight md:text-5xl">
              Plan your week around your veg box.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#5f675c] md:text-base">
              Use the same AI recipe logic you already have, but apply it across
              the full week. Your produce box leads, your selected products
              shape the meals, and the basket suggestions are built from the
              plan.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => void handleGenerateWeek()}
                disabled={loading || isGeneratingWeek}
                className="inline-flex items-center justify-center rounded-full bg-[#243328] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
              >
                {isGeneratingWeek
                  ? "Planning your week..."
                  : "Generate my week"}
              </button>
              <button
                type="button"
                onClick={handleClearWeek}
                className="inline-flex items-center justify-center rounded-full border border-[#d6cec2] bg-white px-5 py-3 text-sm text-[#243328] transition hover:bg-[#f5f1ea]"
              >
                Clear week
              </button>
              <Link
                href="/recipes"
                className="inline-flex items-center justify-center rounded-full border border-[#d6cec2] bg-white px-5 py-3 text-sm text-[#243328] transition hover:bg-[#f5f1ea]"
              >
                Browse recipes
              </Link>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[20px] border border-[#e5ddcf] bg-white/80 p-4">
                <p className="text-[11px] uppercase tracking-[0.14em] text-[#6b776c]">
                  Filled days
                </p>
                <p className="mt-2 text-2xl font-semibold">{filledDays}/7</p>
              </div>
              <div className="rounded-[20px] border border-[#e5ddcf] bg-white/80 p-4">
                <p className="text-[11px] uppercase tracking-[0.14em] text-[#6b776c]">
                  Planner status
                </p>
                <p className="mt-2 text-lg font-semibold">
                  {loading ? "Loading" : saving ? "Saving" : "Ready"}
                </p>
              </div>
              <div className="rounded-[20px] border border-[#e5ddcf] bg-white/80 p-4">
                <p className="text-[11px] uppercase tracking-[0.14em] text-[#6b776c]">
                  Week style
                </p>
                <p className="mt-2 text-lg font-semibold">
                  {QUICK_STARTS.find((item) => item.value === quickStart)
                    ?.label ?? "Flexible"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.84)] p-5 md:p-8">
            <p className="text-xs uppercase tracking-[0.18em] text-[#6b776c]">
              Set the week up
            </p>

            <div className="mt-4 space-y-5">
              <div>
                <label className="text-sm font-medium text-[#243328]">
                  Produce box
                </label>
                <select
                  value={selectedBoxName}
                  onChange={(event) => {
                    const nextName = event.target.value;
                    setSelectedBoxName(nextName);
                    setSelectedProductNames((current) => {
                      const withoutBoxes = current.filter(
                        (name) =>
                          !produceBoxes.some((box) => box.name === name),
                      );
                      return [nextName, ...withoutBoxes];
                    });
                  }}
                  className="mt-2 w-full rounded-[18px] border border-[#d6cec2] bg-white px-4 py-3 text-sm text-[#243328] outline-none"
                >
                  {produceBoxes.map((box) => (
                    <option key={box.name} value={box.name}>
                      {box.name}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-sm leading-6 text-[#667164]">
                  {selectedBox?.description}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-[#243328]">
                  Selected products
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {allShopItems.slice(0, 10).map((item) => {
                    const isActive = selectedProductNames.includes(item.name);
                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => toggleProduct(item.name)}
                        className={`rounded-full border px-4 py-2 text-sm transition ${
                          isActive
                            ? "border-[#243328] bg-[#243328] text-white"
                            : "border-[#d6cec2] bg-white text-[#4f5e52] hover:bg-[#f8f4ee]"
                        }`}
                      >
                        {item.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-[#243328]">
                  Extra ingredients
                </label>
                <textarea
                  value={customIngredients}
                  onChange={(event) => setCustomIngredients(event.target.value)}
                  rows={3}
                  placeholder="Spinach, chickpeas, pasta"
                  className="mt-2 w-full rounded-[18px] border border-[#d6cec2] bg-white px-4 py-3 text-sm text-[#243328] outline-none placeholder:text-[#7b8478]"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-[#243328]">
                    Week style
                  </label>
                  <select
                    value={quickStart}
                    onChange={(event) => setQuickStart(event.target.value)}
                    className="mt-2 w-full rounded-[18px] border border-[#d6cec2] bg-white px-4 py-3 text-sm text-[#243328] outline-none"
                  >
                    {QUICK_STARTS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <label className="mt-7 inline-flex items-center gap-3 text-sm text-[#243328]">
                  <input
                    type="checkbox"
                    checked={includeBasketItems}
                    onChange={(event) =>
                      setIncludeBasketItems(event.target.checked)
                    }
                    className="h-4 w-4 rounded border-[#cfc6b9]"
                  />
                  Include basket items too
                </label>
              </div>

              <div>
                <p className="text-sm font-medium text-[#243328]">
                  Preferences
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {PREFERENCES.map((preference) => {
                    const isSelected = selectedPreferences.includes(preference);
                    return (
                      <button
                        key={preference}
                        type="button"
                        onClick={() => togglePreference(preference)}
                        className={`rounded-full border px-4 py-2 text-sm transition ${
                          isSelected
                            ? "border-[#aab7a4] bg-[rgba(233,240,228,0.82)] text-[#243328]"
                            : "border-[#d6cec2] bg-white text-[#4f5e52] hover:bg-[#f8f4ee]"
                        }`}
                      >
                        {preference}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 md:px-10 md:py-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#6b776c]">
                This week
              </p>
              <h2 className="mt-2 font-serif text-2xl md:text-3xl">
                A fuller weekly board
              </h2>
            </div>
            {error ? <p className="text-sm text-[#8a574d]">{error}</p> : null}
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {DAYS.map((day, index) => {
              const meal = planner[day.key];
              const isActive = activeDay === day.key;

              return (
                <button
                  key={day.key}
                  type="button"
                  onClick={() => setActiveDay(day.key)}
                  className={`overflow-hidden rounded-[22px] border text-left transition ${
                    isActive
                      ? "border-[#243328] bg-white shadow-[0_12px_24px_rgba(36,51,40,0.08)]"
                      : "border-[#e5ddcf] bg-[rgba(247,242,235,0.8)] hover:bg-white"
                  }`}
                >
                  <div className="aspect-[16/10] bg-[#e9dfd2]">
                    <img
                      src={meal?.image ?? FALLBACK_IMAGES[index]}
                      alt={meal?.title ?? `${day.label} meal`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[11px] uppercase tracking-[0.14em] text-[#6b776c]">
                        {day.label}
                      </p>
                      <span className="rounded-full border border-[#e5ddcf] bg-[rgba(247,242,235,0.82)] px-2.5 py-1 text-[11px] text-[#5f675c]">
                        {meal ? "Planned" : "Waiting"}
                      </span>
                    </div>
                    <h3 className="mt-2 font-serif text-xl leading-tight text-[#243328]">
                      {meal?.title ?? "Generate your week to fill this day"}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[#667164]">
                      {meal?.description ??
                        "The weekly generator will use your veg box, selected products, and basket items to shape this meal."}
                    </p>
                    {meal?.ingredientsUsed?.length ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {meal.ingredientsUsed.slice(0, 3).map((item) => (
                          <span
                            key={`${day.key}-${item}`}
                            className="rounded-full border border-[#e5ddcf] bg-[rgba(251,250,248,0.82)] px-3 py-1 text-xs text-[#5f675c]"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 pb-8 sm:px-6 md:px-10 md:pb-10">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-[28px] border border-[rgba(221,212,200,0.95)] bg-white/80 p-5 md:p-8">
            <p className="text-xs uppercase tracking-[0.18em] text-[#6b776c]">
              Selected day
            </p>
            <h2 className="mt-2 font-serif text-2xl md:text-3xl">
              {DAYS.find((day) => day.key === activeDay)?.label}
            </h2>

            {activeMeal ? (
              <>
                <p className="mt-3 text-sm leading-7 text-[#5f675c]">
                  {activeMeal.description}
                </p>

                {activeMeal.steps.length > 0 ? (
                  <ol className="mt-5 space-y-3 text-sm leading-6 text-[#243328]">
                    {activeMeal.steps.slice(0, 5).map((step, index) => (
                      <li
                        key={`${activeMeal.id}-${index}`}
                        className="flex gap-3"
                      >
                        <span className="mt-[2px] inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#d6cec2] text-[10px]">
                          {index + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                ) : null}

                {activeMeal.productNames.length > 0 ? (
                  <div className="mt-5">
                    <p className="text-sm font-medium text-[#243328]">
                      Built around
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {activeMeal.productNames.map((name) => (
                        <span
                          key={name}
                          className="rounded-full border border-[#d6cec2] bg-[rgba(247,242,235,0.82)] px-3 py-1.5 text-sm text-[#4f5e52]"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </>
            ) : (
              <p className="mt-3 text-sm leading-7 text-[#5f675c]">
                Generate the week to fill in the details for this day.
              </p>
            )}
          </div>

          <div className="rounded-[28px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.84)] p-5 md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[#6b776c]">
                  Build the basket around it
                </p>
                <h2 className="mt-2 font-serif text-2xl md:text-3xl">
                  Suggested weekly top-ups
                </h2>
              </div>
              <div className="rounded-[16px] border border-[#ddd4c8] bg-white px-4 py-3 text-right">
                <p className="text-[10px] uppercase tracking-[0.14em] text-[#6b776c]">
                  Matched total
                </p>
                <p className="mt-1 font-serif text-xl text-[#243328]">
                  £{weeklyMatchedTotal.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {weekSuggestions.length > 0 ? (
                weekSuggestions.slice(0, 8).map((entry) => (
                  <div
                    key={entry.item.name}
                    className="rounded-[18px] border border-[#ddd4c8] bg-white/80 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[12px] border border-[#e6ddd0] bg-[rgba(247,242,235,0.9)] p-1.5">
                        <img
                          src={entry.item.image}
                          alt={entry.item.name}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#243328]">
                          {entry.item.name}
                        </p>
                        <p className="mt-1 text-sm text-[#5f675c]">
                          {entry.matchedMeals.slice(0, 2).join(" • ")}
                        </p>
                        <p className="mt-1 text-sm text-[#5f675c]">
                          {entry.quantity} × £{entry.item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[18px] border border-[#ddd4c8] bg-white/80 p-4">
                  <p className="text-sm leading-6 text-[#5f675c]">
                    Generate your week first and the planner will pull together
                    useful shop matches here.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleAddWeekToBasket}
                className="rounded-full bg-[#243328] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
              >
                Add week to basket
              </button>
              <Link
                href="/basket"
                className="rounded-full border border-[#d6cec2] bg-white px-5 py-3 text-sm text-[#243328] transition hover:bg-[#f5f1ea]"
              >
                Review basket
              </Link>
            </div>

            {basketMessage ? (
              <div className="mt-4 rounded-[16px] border border-[#dbe4d5] bg-[#f4f8f1] px-4 py-3 text-sm text-[#425142]">
                {basketMessage}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
