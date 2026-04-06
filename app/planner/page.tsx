"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "../cart-context";

type DayKey =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

type PlannerRecipe = {
  id: string;
  title: string;
  description: string;
  ingredientsUsed: string[];
  pantryStaples: string[];
  steps: string[];
  imageUrl: string | null;
  dayLabel: string;
  mealStyle: string;
  sourceItems: string[];
  matchedProducts: string[];
};

type WeekState = Record<DayKey, PlannerRecipe | null>;

type ShopLiteItem = {
  name: string;
  price: number;
  image: string;
  category: "boxes" | "pantry" | "cupboard" | "extras";
  checkoutType: "subscription" | "one-off";
  description: string;
  weeklyIncludes?: string[];
};

type SavedWeek = {
  generatedAt: string;
  meals: WeekState;
};

const STORAGE_KEY = "tlp_weekly_planner_meals_v2";
const PREFERENCES_KEY = "tlp_weekly_planner_preferences_v2";

const DAYS: { key: DayKey; label: string; short: string }[] = [
  { key: "monday", label: "Monday", short: "Mon" },
  { key: "tuesday", label: "Tuesday", short: "Tue" },
  { key: "wednesday", label: "Wednesday", short: "Wed" },
  { key: "thursday", label: "Thursday", short: "Thu" },
  { key: "friday", label: "Friday", short: "Fri" },
  { key: "saturday", label: "Saturday", short: "Sat" },
  { key: "sunday", label: "Sunday", short: "Sun" },
];

const EMPTY_WEEK: WeekState = {
  monday: null,
  tuesday: null,
  wednesday: null,
  thursday: null,
  friday: null,
  saturday: null,
  sunday: null,
};

const produceBoxes: ShopLiteItem[] = [
  {
    name: "Weekly Produce Box",
    price: 20,
    image: "/weekly-harvest-box.png",
    category: "boxes",
    checkoutType: "subscription",
    description:
      "A useful weekly mix of fruit and veg for one to two people or lighter cooking weeks.",
    weeklyIncludes: ["Carrots", "Potatoes", "Leeks", "Apples", "Onions"],
  },
  {
    name: "Family Produce Box",
    price: 30,
    image: "/family-harvest-box.png",
    category: "boxes",
    checkoutType: "subscription",
    description:
      "A fuller weekly box for households cooking most nights and wanting a broader base for the week.",
    weeklyIncludes: ["Carrots", "Potatoes", "Tomatoes", "Apples", "Greens"],
  },
];

const pantryProducts: ShopLiteItem[] = [
  {
    name: "Sorrel & Walnut Pesto",
    price: 4.5,
    image: "/sorrel-walnut-pesto.png",
    category: "pantry",
    checkoutType: "one-off",
    description:
      "Fresh, savoury and especially good with roast veg, pasta and greens.",
  },
  {
    name: "Rose Harissa",
    price: 5.25,
    image: "/rose-harissa.png",
    category: "pantry",
    checkoutType: "one-off",
    description: "Warm, gently spiced and good for traybakes, bowls and beans.",
  },
  {
    name: "Casarecce Pasta",
    price: 4.95,
    image: "/images/cupboard/casarecce.jpg",
    category: "cupboard",
    checkoutType: "one-off",
    description:
      "A useful pasta for midweek suppers built around greens, roast veg or a jar.",
  },
  {
    name: "Orzo Pasta",
    price: 4.5,
    image: "/images/cupboard/orzo.jpg",
    category: "cupboard",
    checkoutType: "one-off",
    description:
      "A flexible pantry support for soups, bowls and lighter suppers.",
  },
  {
    name: "Giant Couscous",
    price: 4.75,
    image: "/images/cupboard/giant-couscous.jpg",
    category: "cupboard",
    checkoutType: "one-off",
    description:
      "A good base for warm bowls, roast vegetables and spoonable dressings.",
  },
  {
    name: "Puy Lentils",
    price: 4.95,
    image: "/images/cupboard/puy-lentils.jpg",
    category: "cupboard",
    checkoutType: "one-off",
    description:
      "Useful for hearty bowls, brothy pots and meals that stretch the veg further.",
  },
  {
    name: "Short Grain Rice",
    price: 4.75,
    image: "/images/cupboard/short-grain-rice.jpg",
    category: "cupboard",
    checkoutType: "one-off",
    description:
      "A dependable base for rice dishes, softer bowls and oven-led meals.",
  },
];

const allShopItems = [...produceBoxes, ...pantryProducts];

const preferenceOptions = [
  "Quick meals",
  "Vegetarian",
  "Family-friendly",
  "Low waste",
  "Comforting",
  "Veg-led",
] as const;

const mealFrames = [
  {
    label: "veg-led roast",
    quickStart: "use-what-ive-got",
    supports: ["lentils", "olive oil", "yoghurt", "herbs"],
  },
  {
    label: "pasta night",
    quickStart: "quick-tonight",
    supports: ["pasta", "garlic", "lemon", "greens"],
  },
  {
    label: "brothy pot",
    quickStart: "comforting",
    supports: ["stock", "beans", "orzo", "herbs"],
  },
  {
    label: "rice bowl",
    quickStart: "use-what-ive-got",
    supports: ["rice", "eggs", "greens", "lime"],
  },
  {
    label: "traybake",
    quickStart: "quick-tonight",
    supports: ["couscous", "yoghurt", "spices", "herbs"],
  },
  {
    label: "weekend bake",
    quickStart: "comforting",
    supports: ["cheese", "cream", "breadcrumbs", "greens"],
  },
  {
    label: "use-up supper",
    quickStart: "use-what-ive-got",
    supports: ["beans", "toast", "eggs", "herbs"],
  },
] as const;

const widerVegPool = [
  "carrots",
  "potatoes",
  "leeks",
  "onions",
  "apples",
  "broccoli",
  "spinach",
  "peppers",
  "tomatoes",
  "courgette",
  "kale",
  "cucumber",
  "lettuce",
  "coriander",
  "basil",
  "rosemary",
  "thyme",
  "oranges",
  "melon",
  "strawberries",
];

function normaliseIngredient(value: string) {
  return value
    .toLowerCase()
    .replace(/[0-9]/g, "")
    .replace(/[^\w\s]/g, " ")
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
    const key = normaliseIngredient(trimmed);

    if (!trimmed || !key || seen.has(key)) return;

    seen.add(key);
    result.push(trimmed);
  });

  return result;
}

function pickImageForMeal(meal: PlannerRecipe | null) {
  if (!meal) return "";

  if (meal.imageUrl) return meal.imageUrl;

  const title = meal.title.toLowerCase();
  if (title.includes("soup") || title.includes("broth")) {
    return "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80";
  }
  if (title.includes("pasta") || title.includes("orzo")) {
    return "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=1200&q=80";
  }
  if (title.includes("tray") || title.includes("roast")) {
    return "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80";
  }
  return "https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=1200&q=80";
}

function getBoxByName(name: string) {
  return produceBoxes.find((box) => box.name === name) ?? produceBoxes[0];
}

function buildWiderBoxIngredients(selectedBoxName: string) {
  const selectedBox = getBoxByName(selectedBoxName);
  const boxIncludes = selectedBox.weeklyIncludes ?? [];

  return dedupeStrings([...boxIncludes, ...widerVegPool]);
}

function buildDayItems({
  dayIndex,
  baseIngredients,
  selectedProducts,
  basketIngredients,
}: {
  dayIndex: number;
  baseIngredients: string[];
  selectedProducts: ShopLiteItem[];
  basketIngredients: string[];
}) {
  const frame = mealFrames[dayIndex % mealFrames.length];
  const rotatedBase = [
    ...baseIngredients.slice(dayIndex),
    ...baseIngredients.slice(0, dayIndex),
  ];

  const primaryVeg = rotatedBase.slice(0, 3);
  const secondaryVeg = rotatedBase.slice(3, 5);

  const selectedProductNames = selectedProducts.map((item) => item.name);
  const productAnchors = selectedProducts.flatMap((product) => {
    if (product.category === "boxes") {
      return product.weeklyIncludes ?? [];
    }

    return [product.name];
  });

  const basketRotation = basketIngredients.slice(
    dayIndex % Math.max(1, basketIngredients.length),
    (dayIndex % Math.max(1, basketIngredients.length)) + 2,
  );

  const items = dedupeStrings([
    ...primaryVeg,
    ...secondaryVeg,
    ...frame.supports,
    ...productAnchors,
    ...basketRotation,
    ...selectedProductNames,
  ]).slice(0, 14);

  return {
    frame,
    items,
  };
}

function inferMatchedProducts(
  recipe: PlannerRecipe,
  selectedProducts: ShopLiteItem[],
) {
  const searchText = [
    recipe.title,
    recipe.description,
    ...recipe.ingredientsUsed,
    ...recipe.sourceItems,
  ]
    .join(" ")
    .toLowerCase();

  return selectedProducts
    .filter((item) => {
      const itemText = [
        item.name,
        item.description,
        ...(item.weeklyIncludes ?? []),
      ]
        .join(" ")
        .toLowerCase();

      return (
        searchText.includes(normaliseIngredient(item.name)) ||
        itemText
          .split(" ")
          .some((word) => word.length > 4 && searchText.includes(word))
      );
    })
    .map((item) => item.name)
    .slice(0, 3);
}

function inferWeekSuggestions(week: WeekState) {
  const ingredientMap = new Map<
    string,
    { item: ShopLiteItem; uses: number; ingredients: string[] }
  >();

  const meals = Object.values(week).filter(Boolean) as PlannerRecipe[];

  meals.forEach((meal) => {
    meal.ingredientsUsed.forEach((ingredient) => {
      const normalisedIngredient = normaliseIngredient(ingredient);

      const matched = allShopItems.find((item) => {
        const searchText = [
          item.name,
          item.description,
          ...(item.weeklyIncludes ?? []),
        ]
          .join(" ")
          .toLowerCase();
        const normalisedText = normaliseIngredient(searchText);

        return (
          normalisedText.includes(normalisedIngredient) ||
          normalisedIngredient.includes(normaliseIngredient(item.name))
        );
      });

      if (!matched) return;

      const existing = ingredientMap.get(matched.name);
      if (existing) {
        existing.uses += 1;
        if (!existing.ingredients.includes(ingredient)) {
          existing.ingredients.push(ingredient);
        }
        return;
      }

      ingredientMap.set(matched.name, {
        item: matched,
        uses: 1,
        ingredients: [ingredient],
      });
    });
  });

  return Array.from(ingredientMap.values()).sort((a, b) => b.uses - a.uses);
}

export default function PlannerPage() {
  const { cart, addManyToCart } = useCart();

  const [selectedBoxName, setSelectedBoxName] = useState("Weekly Produce Box");
  const [selectedProductNames, setSelectedProductNames] = useState<string[]>([
    "Weekly Produce Box",
    "Sorrel & Walnut Pesto",
  ]);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([
    "Veg-led",
  ]);
  const [includeBasketIngredients, setIncludeBasketIngredients] =
    useState(true);
  const [week, setWeek] = useState<WeekState>(EMPTY_WEEK);
  const [loading, setLoading] = useState(false);
  const [activeDay, setActiveDay] = useState<DayKey>("monday");
  const [statusMessage, setStatusMessage] = useState("");
  const [generatorNote, setGeneratorNote] = useState(
    "Use the box as your base, shape the week from a wider mix of vegetables, and let the recipe cards do the rest.",
  );

  const basketIngredients = useMemo(() => {
    return dedupeStrings(cart.map((item) => item.name));
  }, [cart]);

  const selectedProducts = useMemo(() => {
    const map = new Map(allShopItems.map((item) => [item.name, item]));
    return selectedProductNames
      .map((name) => map.get(name))
      .filter((item): item is ShopLiteItem => Boolean(item));
  }, [selectedProductNames]);

  const activeMeal = week[activeDay];

  const generatedMeals = useMemo(() => {
    return DAYS.map((day) => ({
      ...day,
      meal: week[day.key],
    }));
  }, [week]);

  const filledCount = useMemo(() => {
    return Object.values(week).filter(Boolean).length;
  }, [week]);

  const weeklySuggestions = useMemo(() => inferWeekSuggestions(week), [week]);

  const weeklyItemsToAdd = useMemo(() => {
    return weeklySuggestions.flatMap((entry) => ({
      name: entry.item.name,
      price: entry.item.price,
      image: entry.item.image,
      category: entry.item.category,
      checkoutType: entry.item.checkoutType,
    }));
  }, [weeklySuggestions]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw) as SavedWeek;
      if (!parsed?.meals) return;

      setWeek(parsed.meals);
    } catch {
      // ignore local read issue
    }

    try {
      const rawPrefs = localStorage.getItem(PREFERENCES_KEY);
      if (!rawPrefs) return;

      const parsedPrefs = JSON.parse(rawPrefs) as string[];
      if (Array.isArray(parsedPrefs)) {
        setSelectedPreferences(parsedPrefs);
      }
    } catch {
      // ignore local read issue
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(selectedPreferences));
  }, [selectedPreferences]);

  function persistWeek(nextWeek: WeekState) {
    const payload: SavedWeek = {
      generatedAt: new Date().toISOString(),
      meals: nextWeek,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }

  function togglePreference(preference: string) {
    setSelectedPreferences((current) => {
      if (current.includes(preference)) {
        return current.filter((item) => item !== preference);
      }

      return [...current, preference];
    });
  }

  function toggleProduct(name: string) {
    setSelectedProductNames((current) => {
      if (current.includes(name)) {
        if (name === selectedBoxName) return current;
        return current.filter((item) => item !== name);
      }

      return [...current, name];
    });
  }

  function selectBox(name: string) {
    setSelectedBoxName(name);
    setSelectedProductNames((current) => {
      const withoutBoxes = current.filter(
        (item) => !produceBoxes.some((box) => box.name === item),
      );
      return dedupeStrings([name, ...withoutBoxes]);
    });
  }

  async function generateWeekPlan() {
    setLoading(true);
    setStatusMessage("");
    setGeneratorNote(
      "Building a more varied week from a wider produce mix, a few useful supports, and the products you’ve chosen.",
    );

    try {
      const nextWeek: WeekState = { ...EMPTY_WEEK };
      const previousRecipes: Array<{
        title: string;
        description: string;
        ingredientsUsed: string[];
      }> = [];

      const baseIngredients = buildWiderBoxIngredients(selectedBoxName);
      const usableBasket = includeBasketIngredients ? basketIngredients : [];

      for (const [index, day] of DAYS.entries()) {
        const { frame, items } = buildDayItems({
          dayIndex: index,
          baseIngredients,
          selectedProducts,
          basketIngredients: usableBasket,
        });

        const response = await fetch("/api/recipe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items,
            quickStart: frame.quickStart,
            preferences: selectedPreferences,
            previousRecipes,
            weekPlanContext: {
              mode: "plan-week",
              mealIndex: index,
              totalMeals: DAYS.length,
              includeMeatIdeas: false,
            },
          }),
        });

        const data = await response.json();

        if (!response.ok || !data?.recipe) {
          throw new Error(data?.error || `Could not generate ${day.label}.`);
        }

        const recipe: PlannerRecipe = {
          id: `${day.key}-${Date.now()}-${index}`,
          title: String(data.recipe.title ?? `${day.label} meal`),
          description: String(
            data.recipe.description ??
              "A simple meal shaped around the week’s ingredients.",
          ),
          ingredientsUsed: Array.isArray(data.recipe.ingredientsUsed)
            ? data.recipe.ingredientsUsed.map(String)
            : [],
          pantryStaples: Array.isArray(data.recipe.pantryStaples)
            ? data.recipe.pantryStaples.map(String)
            : [],
          steps: Array.isArray(data.recipe.steps)
            ? data.recipe.steps.map(String)
            : [],
          imageUrl: typeof data.imageUrl === "string" ? data.imageUrl : null,
          dayLabel: day.label,
          mealStyle: frame.label,
          sourceItems: items,
          matchedProducts: [],
        };

        recipe.matchedProducts = inferMatchedProducts(recipe, selectedProducts);
        nextWeek[day.key] = recipe;

        previousRecipes.push({
          title: recipe.title,
          description: recipe.description,
          ingredientsUsed: recipe.ingredientsUsed,
        });
      }

      setWeek(nextWeek);
      persistWeek(nextWeek);
      setActiveDay("monday");
      setStatusMessage(
        "Your week is ready. It should feel broader, more varied, and more useful across the whole week.",
      );
      setGeneratorNote(
        "This week shifts in shape as it goes - roast-led meals, softer bowls, brothy pots, pasta nights and use-up ideas - so it feels like a proper week of food rather than the same plate repeated.",
      );
    } catch (error) {
      console.error(error);
      setStatusMessage(
        "Something went wrong while planning the week. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  function clearWeek() {
    setWeek(EMPTY_WEEK);
    persistWeek(EMPTY_WEEK);
    setStatusMessage("The week has been cleared.");
    setGeneratorNote(
      "Use the box as your base, shape the week from a wider mix of vegetables, and let the recipe cards do the rest.",
    );
  }

  function addSuggestedWeekToBasket() {
    if (weeklyItemsToAdd.length === 0) {
      setStatusMessage(
        "There weren’t any useful weekly extras to add this time.",
      );
      return;
    }

    addManyToCart(weeklyItemsToAdd);
    setStatusMessage("Suggested extras have been added to your basket.");
  }

  const nextEmptyLabel =
    DAYS.find((day) => !week[day.key])?.label ?? "Week complete";

  return (
    <main className="min-h-screen bg-[#f4efe9] text-[#243328]">
      <header className="sticky top-0 z-30 border-b border-[rgba(230,221,210,0.92)] bg-[rgba(244,239,233,0.88)] backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 md:px-10">
          <Link
            href="/"
            className="text-[11px] tracking-[0.28em] text-[#60705f] hover:text-[#243328] sm:text-sm"
          >
            THE LOCAL PANTRY
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/recipes"
              className="hidden text-sm text-[#4f5e52] hover:text-[#243328] md:inline-flex"
            >
              Recipes
            </Link>

            <Link
              href="/basket"
              className="inline-flex rounded-full border border-[#d6cec2] bg-[rgba(255,255,255,0.9)] px-4 py-2 text-sm text-[#243328] shadow-sm transition hover:bg-white"
            >
              View basket{cart.length > 0 ? ` (${cart.length})` : ""}
            </Link>
          </div>
        </div>
      </header>

      <section className="border-b border-[rgba(230,221,210,0.86)] px-4 pb-8 pt-10 sm:px-6 md:px-10 md:pb-10 md:pt-12">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[#6b776c]">
              Weekly planner
            </p>

            <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-tight tracking-tight md:text-6xl">
              Plan your week around what you’ve got.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-[#5f675c] md:text-lg">
              Built for local weekly food shopping, this planner helps you turn
              what you’ve got into a week of realistic meals. Use the box as a
              base, get inspired, and build your basket as you go.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => void generateWeekPlan()}
                disabled={loading}
                className="rounded-full bg-[#243328] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Planning your week..." : "Plan my week"}
              </button>

              <Link
                href="/recipes"
                className="rounded-full border border-[#d6cec2] bg-white px-6 py-3 text-sm text-[#243328] transition hover:bg-[#f7f3ee]"
              >
                Browse recipes
              </Link>

              <button
                type="button"
                onClick={clearWeek}
                className="rounded-full border border-[#d6cec2] bg-[rgba(255,255,255,0.72)] px-6 py-3 text-sm text-[#243328] transition hover:bg-white"
              >
                Clear week
              </button>
            </div>
          </div>

          <div className="rounded-[28px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.82)] p-5 backdrop-blur-md md:p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-[#6b776c]">
              Week summary
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-[22px] border border-[#e5ddcf] bg-white/80 p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-[#6b776c]">
                  Filled days
                </p>
                <p className="mt-2 font-serif text-3xl">{filledCount}/7</p>
              </div>

              <div className="rounded-[22px] border border-[#e5ddcf] bg-white/80 p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-[#6b776c]">
                  Next to fill
                </p>
                <p className="mt-2 text-sm font-medium text-[#243328]">
                  {nextEmptyLabel}
                </p>
              </div>

              <div className="rounded-[22px] border border-[#e5ddcf] bg-white/80 p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-[#6b776c]">
                  Foundation
                </p>
                <p className="mt-2 text-sm font-medium text-[#243328]">
                  {selectedBoxName}
                </p>
              </div>

              <div className="rounded-[22px] border border-[#e5ddcf] bg-white/80 p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-[#6b776c]">
                  Basket items
                </p>
                <p className="mt-2 text-sm font-medium text-[#243328]">
                  {includeBasketIngredients ? basketIngredients.length : 0}
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-7 text-[#5f675c]">
              {generatorNote}
            </p>

            {statusMessage ? (
              <div className="mt-4 rounded-[18px] border border-[#dbe4d5] bg-[#f4f8f1] px-4 py-3 text-sm text-[#425142]">
                {statusMessage}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 md:px-10 md:py-10">
        <div className="mx-auto max-w-7xl rounded-[28px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.84)] p-5 md:p-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#6b776c]">
                Start with what you’ve got
              </p>
              <h2 className="mt-2 font-serif text-2xl md:text-3xl">
                Use the box as your base.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#5f675c] md:text-base">
                Start from the weekly box, bring in anything already in your
                basket, and let the planner shape a stronger, broader week of
                meals from there.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {produceBoxes.map((box) => {
                  const isActive = selectedBoxName === box.name;

                  return (
                    <button
                      key={box.name}
                      type="button"
                      onClick={() => selectBox(box.name)}
                      className={`rounded-[22px] border p-4 text-left transition ${
                        isActive
                          ? "border-[#243328] bg-white shadow-[0_12px_28px_rgba(36,51,40,0.08)]"
                          : "border-[#e5ddcf] bg-[rgba(255,255,255,0.72)] hover:bg-white"
                      }`}
                    >
                      <p className="font-medium text-[#243328]">{box.name}</p>
                      <p className="mt-2 text-sm leading-6 text-[#5f675c]">
                        {box.description}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(box.weeklyIncludes ?? []).map((item) => (
                          <span
                            key={item}
                            className="rounded-full border border-[#ddd4c8] bg-[rgba(247,242,235,0.8)] px-3 py-1 text-xs text-[#5f675c]"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#6b776c]">
                Useful extras
              </p>
              <h2 className="mt-2 font-serif text-2xl md:text-3xl">
                Shape the week a little.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#5f675c] md:text-base">
                Choose a few products and preferences to guide the week. The aim
                is a better week of food, not seven versions of the same plate.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {pantryProducts.map((product) => {
                  const isActive = selectedProductNames.includes(product.name);

                  return (
                    <button
                      key={product.name}
                      type="button"
                      onClick={() => toggleProduct(product.name)}
                      className={`rounded-full border px-4 py-2 text-sm transition ${
                        isActive
                          ? "border-[#243328] bg-[#243328] text-white"
                          : "border-[#d6cec2] bg-white text-[#243328] hover:bg-[#f7f3ee]"
                      }`}
                    >
                      {product.name}
                    </button>
                  );
                })}
              </div>

              <div className="mt-5">
                <p className="text-sm font-medium text-[#243328]">
                  Keep these in mind
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {preferenceOptions.map((preference) => {
                    const isActive = selectedPreferences.includes(preference);

                    return (
                      <button
                        key={preference}
                        type="button"
                        onClick={() => togglePreference(preference)}
                        className={`rounded-full border px-4 py-2 text-sm transition ${
                          isActive
                            ? "border-[#aab7a4] bg-[rgba(233,240,228,0.82)] text-[#243328]"
                            : "border-[#d6cec2] bg-[rgba(255,255,255,0.86)] text-[#4f5e52] hover:bg-white"
                        }`}
                      >
                        {preference}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-5 rounded-[20px] border border-[#e5ddcf] bg-white/80 p-4">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={includeBasketIngredients}
                    onChange={(e) =>
                      setIncludeBasketIngredients(e.target.checked)
                    }
                    className="mt-1 h-4 w-4 rounded border-[#cfc6ba]"
                  />
                  <div>
                    <p className="text-sm font-medium text-[#243328]">
                      Include basket ingredients
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[#5f675c]">
                      Bring in anything already in your basket so the week feels
                      connected to what you’re already buying.
                    </p>
                  </div>
                </label>

                {includeBasketIngredients && basketIngredients.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {basketIngredients.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-[#ddd4c8] bg-[rgba(247,242,235,0.8)] px-3 py-1 text-xs text-[#5f675c]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-10 sm:px-6 md:px-10 md:pb-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#6b776c]">
                Your week at a glance
              </p>
              <h2 className="mt-2 font-serif text-2xl md:text-3xl">
                A proper week of meals.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#5f675c] md:text-base">
                Follow the recipe cards, swap anything that doesn’t fit, and use
                the week to shape a more useful order.
              </p>
            </div>

            <div className="text-sm text-[#5f675c]">
              {filledCount === 0
                ? "Plan the week to fill the cards."
                : "The cards below should move through different meal shapes and ingredients as the week goes on."}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[0.98fr_1.02fr]">
            <div className="grid gap-4 sm:grid-cols-2">
              {generatedMeals.map((entry) => {
                const isActive = activeDay === entry.key;
                const imageUrl = pickImageForMeal(entry.meal);

                return (
                  <button
                    key={entry.key}
                    type="button"
                    onClick={() => setActiveDay(entry.key)}
                    className={`overflow-hidden rounded-[24px] border text-left transition ${
                      isActive
                        ? "border-[#243328] bg-white shadow-[0_16px_34px_rgba(36,51,40,0.08)]"
                        : "border-[#e5ddcf] bg-[rgba(255,255,255,0.78)] hover:bg-white"
                    }`}
                  >
                    {entry.meal ? (
                      <>
                        <div
                          className="h-40 w-full bg-cover bg-center"
                          style={{
                            backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.3)), url("${imageUrl}")`,
                          }}
                        >
                          <div className="flex h-full items-start justify-between p-4 text-white">
                            <div>
                              <p className="text-[11px] uppercase tracking-[0.14em] text-white/85">
                                {entry.label}
                              </p>
                              <p className="mt-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.14em]">
                                {entry.meal.mealStyle}
                              </p>
                            </div>

                            <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px]">
                              Recipe card
                            </div>
                          </div>
                        </div>

                        <div className="p-4">
                          <h3 className="font-serif text-xl leading-tight text-[#243328]">
                            {entry.meal.title}
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-[#5f675c]">
                            {entry.meal.description}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-2">
                            {entry.meal.ingredientsUsed
                              .slice(0, 4)
                              .map((item) => (
                                <span
                                  key={item}
                                  className="rounded-full border border-[#ddd4c8] bg-[rgba(247,242,235,0.9)] px-3 py-1 text-xs text-[#5f675c]"
                                >
                                  {item}
                                </span>
                              ))}
                          </div>

                          {entry.meal.matchedProducts.length > 0 ? (
                            <div className="mt-3 text-xs uppercase tracking-[0.14em] text-[#7a8478]">
                              Works with {entry.meal.matchedProducts.join(", ")}
                            </div>
                          ) : null}
                        </div>
                      </>
                    ) : (
                      <div className="flex h-full min-h-[260px] flex-col justify-between p-5">
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.14em] text-[#6b776c]">
                            {entry.label}
                          </p>
                          <h3 className="mt-3 font-serif text-2xl text-[#243328]">
                            Plan your week to fill this day.
                          </h3>
                          <p className="mt-3 text-sm leading-7 text-[#5f675c]">
                            Start from the box, shape the week with a few useful
                            extras, and let the recipes build from there.
                          </p>
                        </div>

                        <div className="mt-5 text-sm font-medium text-[#243328]">
                          Waiting for this week’s plan
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="rounded-[28px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.84)] p-5 backdrop-blur-md md:p-6">
              {activeMeal ? (
                <>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#6b776c]">
                    {activeMeal.dayLabel} recipe card
                  </p>

                  <h2 className="mt-2 font-serif text-3xl leading-tight">
                    {activeMeal.title}
                  </h2>

                  <p className="mt-4 text-sm leading-7 text-[#5f675c] md:text-base">
                    {activeMeal.description}
                  </p>

                  <div className="mt-5 grid gap-5 md:grid-cols-2">
                    <div>
                      <h3 className="text-sm font-medium uppercase tracking-[0.14em] text-[#6b776c]">
                        Built from
                      </h3>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {activeMeal.ingredientsUsed.map((item) => (
                          <span
                            key={item}
                            className="rounded-full border border-[#ddd4c8] bg-white px-3 py-1.5 text-sm text-[#243328]"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium uppercase tracking-[0.14em] text-[#6b776c]">
                        Pantry staples
                      </h3>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {activeMeal.pantryStaples.length > 0 ? (
                          activeMeal.pantryStaples.map((item) => (
                            <span
                              key={item}
                              className="rounded-full border border-[#ddd4c8] bg-white px-3 py-1.5 text-sm text-[#243328]"
                            >
                              {item}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-[#5f675c]">
                            No extra staples listed for this one.
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-sm font-medium uppercase tracking-[0.14em] text-[#6b776c]">
                      Follow the recipe
                    </h3>

                    <ol className="mt-4 space-y-3">
                      {activeMeal.steps.map((step, index) => (
                        <li
                          key={`${index}-${step}`}
                          className="flex gap-3 text-sm leading-7 text-[#243328]"
                        >
                          <span className="mt-[2px] inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#d6cec2] text-xs">
                            {index + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {activeMeal.matchedProducts.length > 0 ? (
                    <div className="mt-6 rounded-[22px] border border-[#ddd4c8] bg-white/80 p-4">
                      <p className="text-sm font-medium text-[#243328]">
                        Useful extras from the shop
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {activeMeal.matchedProducts.map((name) => (
                          <span
                            key={name}
                            className="rounded-full border border-[#d6cec2] bg-[rgba(247,242,235,0.9)] px-3 py-1.5 text-sm text-[#4f5e52]"
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </>
              ) : (
                <>
                  <p className="text-xs uppercase tracking-[0.18em] text-[#6b776c]">
                    What this is for
                  </p>
                  <h2 className="mt-2 font-serif text-3xl leading-tight">
                    Better ideas for a good week of food.
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-[#5f675c] md:text-base">
                    The planner is here to help you use what you’ve got, build a
                    stronger week of meals, and turn those ideas into a more
                    useful local order.
                  </p>

                  <div className="mt-6 grid gap-3">
                    <div className="rounded-[20px] border border-[#e5ddcf] bg-white/80 p-4">
                      <p className="text-sm font-medium text-[#243328]">
                        Start from the box
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[#5f675c]">
                        Let the week begin with the produce you already mean to
                        use.
                      </p>
                    </div>

                    <div className="rounded-[20px] border border-[#e5ddcf] bg-white/80 p-4">
                      <p className="text-sm font-medium text-[#243328]">
                        Get more variety
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[#5f675c]">
                        The planner shifts meal shape, supports and hero
                        ingredients across the week so it feels more believable.
                      </p>
                    </div>

                    <div className="rounded-[20px] border border-[#e5ddcf] bg-white/80 p-4">
                      <p className="text-sm font-medium text-[#243328]">
                        Build the basket as you go
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[#5f675c]">
                        Once the week is working, add the useful bits and turn
                        it into your next order.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[rgba(230,221,210,0.86)] px-4 py-10 sm:px-6 md:px-10 md:py-12">
        <div className="mx-auto max-w-7xl rounded-[28px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.84)] p-5 backdrop-blur-md md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.18em] text-[#6b776c]">
                Turn the plan into your next order
              </p>
              <h2 className="mt-2 font-serif text-3xl leading-tight">
                Add the useful bits.
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#5f675c] md:text-base">
                We’ve highlighted the extras that help make the week work. Add
                what you need to your basket and keep the rest simple.
              </p>
            </div>

            <button
              type="button"
              onClick={addSuggestedWeekToBasket}
              className="rounded-full bg-[#243328] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Add suggested extras
            </button>
          </div>

          {weeklySuggestions.length > 0 ? (
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {weeklySuggestions.map((entry) => (
                <div
                  key={entry.item.name}
                  className="rounded-[22px] border border-[#e5ddcf] bg-white/80 p-4"
                >
                  <p className="font-medium text-[#243328]">
                    {entry.item.name}
                  </p>
                  <p className="mt-1 text-sm text-[#5f675c]">
                    £{entry.item.price.toFixed(2)}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#5f675c]">
                    Helps with {entry.ingredients.slice(0, 3).join(", ")}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-[0.14em] text-[#7a8478]">
                    Used across {entry.uses} meal{entry.uses === 1 ? "" : "s"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-[22px] border border-[#e5ddcf] bg-white/80 p-5">
              <p className="text-sm leading-7 text-[#5f675c]">
                Plan the week first, then this section will pull together the
                useful extras that support the meals.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
