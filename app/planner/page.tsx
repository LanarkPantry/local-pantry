"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "../cart-context";
import { allShopItems, type ShopDisplayItem } from "../shop/shop-data";

type DayKey =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

type WeekMood = "quick" | "balanced" | "comforting";
type LeanInto = "veg-heavy" | "low-waste" | "family-friendly" | "none";

type GeneratedRecipe = {
  title: string;
  description: string;
  ingredientsUsed: string[];
  pantryStaples: string[];
  steps: string[];
  imageUrl?: string | null;
};

type PlannerDayCard = {
  key: DayKey;
  label: string;
  short: string;
  heroImage: string;
  heroAlt: string;
  anchorOptions: string[];
  optionalOptions: string[];
  supportItems: string[];
  everydayBaseOptions: string[];
  shopBaseOptions: string[];
  shopBoostOptions: string[];
  quickStart: "quick-tonight" | "comforting" | "use-what-ive-got";
  flavourDirection: string;
  flavourNotes: string[];
};

type SuggestedProduct = {
  product: ShopDisplayItem;
  matchedDays: string[];
  reason: string;
};

type PlannerSettings = {
  nights: number;
  mood: WeekMood;
  leanInto: LeanInto;
};

const STORAGE_KEY = "tlp_weekly_planner_v11";

const DAY_CARDS: PlannerDayCard[] = [
  {
    key: "monday",
    label: "Monday",
    short: "Mon",
    heroImage: "/images/recipes/rose-harissa-carrots.jpg",
    heroAlt: "Roast carrots and chickpeas with harissa",
    anchorOptions: ["broccoli", "spinach", "green beans", "kale"],
    optionalOptions: ["courgette", "peppers", "cucumber"],
    supportItems: ["garlic"],
    everydayBaseOptions: ["rice", "potatoes"],
    shopBaseOptions: ["Short Grain Rice", "Orzo Pasta"],
    shopBoostOptions: ["Sorrel & Walnut Pesto"],
    quickStart: "use-what-ive-got",
    flavourDirection: "bright and herby",
    flavourNotes: ["lemon", "olive oil", "soft herbs"],
  },
  {
    key: "tuesday",
    label: "Tuesday",
    short: "Tue",
    heroImage: "/images/recipes/pesto-roast-potatoes.jpg",
    heroAlt: "Roast potatoes with pesto",
    anchorOptions: ["tomatoes", "courgette", "aubergine", "peppers"],
    optionalOptions: ["spinach", "mushrooms"],
    supportItems: ["garlic", "onion"],
    everydayBaseOptions: ["pasta", "rice"],
    shopBaseOptions: ["Casarecce Pasta", "Orzo Pasta"],
    shopBoostOptions: ["Sorrel & Walnut Pesto", "Rose Harissa"],
    quickStart: "quick-tonight",
    flavourDirection: "softly savoury and tomato-led",
    flavourNotes: ["basil", "garlic", "black pepper"],
  },
  {
    key: "wednesday",
    label: "Wednesday",
    short: "Wed",
    heroImage: "/images/recipes/pesto-roast-potatoes.jpg",
    heroAlt: "Potatoes and pesto on a tray",
    anchorOptions: ["potatoes", "kale", "cabbage", "spinach"],
    optionalOptions: ["mushrooms", "cauliflower"],
    supportItems: ["onion", "garlic"],
    everydayBaseOptions: ["beans", "eggs"],
    shopBaseOptions: ["Polenta", "Puy Lentils"],
    shopBoostOptions: ["Sorrel & Walnut Pesto"],
    quickStart: "comforting",
    flavourDirection: "comforting and gently savoury",
    flavourNotes: ["mustard", "herbs", "butter"],
  },
  {
    key: "thursday",
    label: "Thursday",
    short: "Thu",
    heroImage: "/images/recipes/rose-harissa-carrots.jpg",
    heroAlt: "Roasted roots with harissa",
    anchorOptions: ["carrots", "squash", "beetroot", "cauliflower"],
    optionalOptions: ["kale", "cabbage"],
    supportItems: ["onion", "garlic"],
    everydayBaseOptions: ["lentils", "beans"],
    shopBaseOptions: ["Puy Lentils", "Farro"],
    shopBoostOptions: ["Rose Harissa", "Walnuts"],
    quickStart: "comforting",
    flavourDirection: "warm and gently spiced",
    flavourNotes: ["paprika", "cumin", "thyme"],
  },
  {
    key: "friday",
    label: "Friday",
    short: "Fri",
    heroImage: "/images/recipes/chocolate-recipe.jpg",
    heroAlt: "A spoonable bowl with yoghurt and chocolate",
    anchorOptions: ["cauliflower", "peppers", "cucumber", "lettuce"],
    optionalOptions: ["tomatoes", "green beans", "carrots"],
    supportItems: ["garlic"],
    everydayBaseOptions: ["couscous", "potatoes"],
    shopBaseOptions: ["Giant Couscous", "Farro"],
    shopBoostOptions: ["Rose Harissa", "Cashews"],
    quickStart: "quick-tonight",
    flavourDirection: "bright and lightly spiced",
    flavourNotes: ["lemon", "mint", "coriander"],
  },
  {
    key: "saturday",
    label: "Saturday",
    short: "Sat",
    heroImage: "/images/recipes/caramel-recipe.jpg",
    heroAlt: "Toast with fruit and caramel",
    anchorOptions: ["mushrooms", "spinach", "kale", "tomatoes"],
    optionalOptions: ["courgette", "cabbage"],
    supportItems: ["garlic", "leek"],
    everydayBaseOptions: ["orzo", "rice"],
    shopBaseOptions: ["Orzo Pasta", "Farro"],
    shopBoostOptions: ["Sorrel & Walnut Pesto", "Walnuts"],
    quickStart: "comforting",
    flavourDirection: "earthy and softly creamy",
    flavourNotes: ["thyme", "black pepper", "stock"],
  },
  {
    key: "sunday",
    label: "Sunday",
    short: "Sun",
    heroImage: "/images/recipes/rose-harissa-carrots.jpg",
    heroAlt: "A hearty tray of roots and greens",
    anchorOptions: ["cabbage", "carrots", "beetroot", "potatoes"],
    optionalOptions: ["cauliflower", "spinach", "kale"],
    supportItems: ["onion", "garlic"],
    everydayBaseOptions: ["beans", "rice"],
    shopBaseOptions: ["Puy Lentils", "Polenta"],
    shopBoostOptions: ["Rose Harissa", "Cashews"],
    quickStart: "use-what-ive-got",
    flavourDirection: "hearty and gently spiced",
    flavourNotes: ["rosemary", "paprika", "mustard"],
  },
];

const EMPTY_WEEK: Record<DayKey, GeneratedRecipe | null> = {
  monday: null,
  tuesday: null,
  wednesday: null,
  thursday: null,
  friday: null,
  saturday: null,
  sunday: null,
};

const TOP_IMAGE_STRIP = [
  {
    src: "/images/recipes/rose-harissa-carrots.jpg",
    alt: "Roast carrots and chickpeas with harissa",
    title: "Veg-first suppers",
  },
  {
    src: "/images/recipes/pesto-roast-potatoes.jpg",
    alt: "Roast potatoes with pesto",
    title: "Flexible pantry add-ons",
  },
  {
    src: "/images/recipes/chocolate-recipe.jpg",
    alt: "A spoonable bowl with yoghurt and chocolate",
    title: "A week that feels real",
  },
  {
    src: "/images/recipes/caramel-recipe.jpg",
    alt: "Toast with fruit and caramel",
    title: "Simple enough to make",
  },
] as const;

const BUILD_STATUS_LINES = [
  "Looking at what is in season",
  "Keeping the week manageable",
  "Making sure the meals feel cookable",
  "Pulling through the useful shop bits",
] as const;

function uniqueStrings(values: string[]) {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    const trimmed = value.trim();
    if (!trimmed) continue;

    const key = trimmed.toLowerCase();
    if (seen.has(key)) continue;

    seen.add(key);
    result.push(trimmed);
  }

  return result;
}

function normalise(text: string) {
  return text.toLowerCase().trim();
}

function titleCase(text: string) {
  return text
    .split(" ")
    .map((word) =>
      word.length > 0 ? `${word[0].toUpperCase()}${word.slice(1)}` : word,
    )
    .join(" ");
}

function readStoredWeek() {
  if (typeof window === "undefined") return EMPTY_WEEK;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_WEEK;
    const parsed = JSON.parse(raw) as Record<DayKey, GeneratedRecipe | null>;

    return {
      monday: parsed.monday ?? null,
      tuesday: parsed.tuesday ?? null,
      wednesday: parsed.wednesday ?? null,
      thursday: parsed.thursday ?? null,
      friday: parsed.friday ?? null,
      saturday: parsed.saturday ?? null,
      sunday: parsed.sunday ?? null,
    };
  } catch {
    return EMPTY_WEEK;
  }
}

function writeStoredWeek(value: Record<DayKey, GeneratedRecipe | null>) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {}
}

function getSuggestedProducts(week: Record<DayKey, GeneratedRecipe | null>) {
  const suggestions = new Map<string, SuggestedProduct>();

  DAY_CARDS.forEach((day) => {
    const recipe = week[day.key];
    if (!recipe) return;

    const searchable = [
      recipe.title,
      recipe.description,
      ...recipe.ingredientsUsed,
      ...recipe.pantryStaples,
    ]
      .join(" ")
      .toLowerCase();

    [...day.shopBaseOptions, ...day.shopBoostOptions].forEach((productName) => {
      const product = allShopItems.find((item) => item.name === productName);
      if (!product) return;
      if (!searchable.includes(normalise(productName))) return;

      const existing = suggestions.get(productName);
      const reason = day.shopBoostOptions.includes(productName)
        ? "Makes the meal sing"
        : "Useful base for the week";

      if (existing) {
        if (!existing.matchedDays.includes(day.label)) {
          existing.matchedDays.push(day.label);
        }
        return;
      }

      suggestions.set(productName, {
        product,
        matchedDays: [day.label],
        reason,
      });
    });
  });

  return Array.from(suggestions.values()).slice(0, 6);
}

function getFromBoxItems(week: Record<DayKey, GeneratedRecipe | null>) {
  return uniqueStrings(
    Object.values(week)
      .filter(Boolean)
      .flatMap((recipe) => recipe!.ingredientsUsed)
      .filter((item) => {
        const lower = item.toLowerCase();
        return (
          lower.includes("broccoli") ||
          lower.includes("potato") ||
          lower.includes("spinach") ||
          lower.includes("carrot") ||
          lower.includes("kale") ||
          lower.includes("tomato") ||
          lower.includes("cabbage") ||
          lower.includes("courgette") ||
          lower.includes("garlic") ||
          lower.includes("onion") ||
          lower.includes("leek")
        );
      }),
  ).slice(0, 10);
}

function getEverydayExtras(
  week: Record<DayKey, GeneratedRecipe | null>,
  suggestedProducts: SuggestedProduct[],
) {
  const productTerms = suggestedProducts.map((item) =>
    normalise(item.product.name),
  );

  return uniqueStrings(
    Object.values(week)
      .filter(Boolean)
      .flatMap((recipe) => recipe!.ingredientsUsed)
      .filter((ingredient) => {
        const lower = ingredient.toLowerCase();
        if (
          lower.includes("onion") ||
          lower.includes("garlic") ||
          lower.includes("leek")
        ) {
          return false;
        }

        return !productTerms.some(
          (term) => lower.includes(term) || term.includes(lower),
        );
      }),
  ).slice(0, 8);
}

function buildInputsForDay(card: PlannerDayCard, settings: PlannerSettings) {
  const anchor = card.anchorOptions[0];
  const optional =
    settings.leanInto === "veg-heavy"
      ? card.optionalOptions[0]
      : settings.leanInto === "family-friendly"
        ? (card.optionalOptions[card.optionalOptions.length - 1] ??
          card.optionalOptions[0])
        : card.optionalOptions[0];

  const everydayBase =
    settings.mood === "comforting"
      ? card.everydayBaseOptions[card.everydayBaseOptions.length - 1]
      : card.everydayBaseOptions[0];

  const shopBase =
    settings.mood === "quick"
      ? card.shopBaseOptions[0]
      : (card.shopBaseOptions[card.shopBaseOptions.length - 1] ??
        card.shopBaseOptions[0]);

  const selectedBoost =
    settings.mood === "comforting" || card.quickStart === "comforting"
      ? (card.shopBoostOptions[0] ?? "")
      : "";

  return uniqueStrings([
    anchor,
    optional,
    everydayBase,
    shopBase,
    selectedBoost,
    ...card.supportItems.slice(0, 1),
  ]);
}

function getSettingsLabel(settings: PlannerSettings) {
  const moodMap: Record<WeekMood, string> = {
    quick: "Quick & easy",
    balanced: "Balanced",
    comforting: "Comforting",
  };

  const leanMap: Record<LeanInto, string> = {
    "veg-heavy": "Veg-heavy",
    "low-waste": "Low waste",
    "family-friendly": "Family-friendly",
    none: "No special lean",
  };

  return `${settings.nights} nights • ${moodMap[settings.mood]} • ${leanMap[settings.leanInto]}`;
}

export default function PlannerPage() {
  const { addToCart, cart } = useCart();
  const [week, setWeek] =
    useState<Record<DayKey, GeneratedRecipe | null>>(EMPTY_WEEK);
  const [settings, setSettings] = useState<PlannerSettings>({
    nights: 5,
    mood: "balanced",
    leanInto: "none",
  });
  const [isPlanningWeek, setIsPlanningWeek] = useState(false);
  const [planningDay, setPlanningDay] = useState<DayKey | null>(null);
  const [openDay, setOpenDay] = useState<DayKey | null>(null);
  const [buildStatusIndex, setBuildStatusIndex] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    setWeek(readStoredWeek());
  }, []);

  useEffect(() => {
    writeStoredWeek(week);
  }, [week]);

  useEffect(() => {
    if (!isPlanningWeek) {
      setBuildStatusIndex(0);
      return;
    }

    const timer = window.setInterval(() => {
      setBuildStatusIndex(
        (current) => (current + 1) % BUILD_STATUS_LINES.length,
      );
    }, 1400);

    return () => window.clearInterval(timer);
  }, [isPlanningWeek]);

  const totalBasketItems = useMemo(() => cart.length, [cart]);
  const plannedDays = useMemo(
    () => DAY_CARDS.filter((day) => Boolean(week[day.key])).length,
    [week],
  );
  const suggestedProducts = useMemo(() => getSuggestedProducts(week), [week]);
  const suggestedTotal = useMemo(
    () => suggestedProducts.reduce((sum, item) => sum + item.product.price, 0),
    [suggestedProducts],
  );
  const fromBoxItems = useMemo(() => getFromBoxItems(week), [week]);
  const everydayExtras = useMemo(
    () => getEverydayExtras(week, suggestedProducts),
    [week, suggestedProducts],
  );

  async function requestRecipeForDay(card: PlannerDayCard) {
    const previousRecipes = DAY_CARDS.filter((day) => day.key !== card.key)
      .map((day) => week[day.key])
      .filter((recipe): recipe is GeneratedRecipe => Boolean(recipe))
      .map((recipe) => ({
        title: recipe.title,
        description: recipe.description,
        ingredientsUsed: recipe.ingredientsUsed,
      }));

    const response = await fetch("/api/recipe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: buildInputsForDay(card, settings),
        quickStart:
          settings.mood === "quick"
            ? "quick-tonight"
            : settings.mood === "comforting"
              ? "comforting"
              : card.quickStart,
        preferences:
          settings.leanInto === "family-friendly"
            ? ["Family-friendly"]
            : settings.leanInto === "low-waste"
              ? ["Low waste"]
              : [],
        previousRecipes,
        plannerIntent: {
          mode: "weekly-staples",
          familyKey: card.key,
          familyLabel: card.label,
          anchorVeg: card.anchorOptions[0],
          optionalVeg: card.optionalOptions[0] ?? null,
          supportVeg: card.supportItems,
          everydayBaseOptions: card.everydayBaseOptions,
          shopBaseOptions: card.shopBaseOptions,
          shopBoostOptions:
            settings.mood === "comforting"
              ? card.shopBoostOptions.slice(0, 1)
              : [],
          flavourDirection: card.flavourDirection,
          flavourNotes: card.flavourNotes,
          avoidHeroVeg: ["onion", "leek", "garlic"],
          guidance: [
            "Keep the meal practical and genuinely weeknight-cookable.",
            "Let one anchor veg lead the day.",
            "Do not make onion, leek, or garlic the main event.",
            "A shop item can help, but should not feel mandatory.",
            "Make the description sound appetising, calm, and real.",
          ],
        },
        weekPlanContext: {
          mode: "plan-week",
          mealIndex: DAY_CARDS.findIndex((item) => item.key === card.key),
          totalMeals: settings.nights,
          previousRecipes,
          familyKey: card.key,
          familyLabel: card.label,
          anchorVeg: card.anchorOptions[0],
          optionalVeg: card.optionalOptions[0] ?? null,
          supportVeg: card.supportItems,
          intro: `${card.label} is ${card.flavourDirection}.`,
          everydayBaseOptions: card.everydayBaseOptions,
          shopBaseOptions: card.shopBaseOptions,
          shopBoostOptions:
            settings.mood === "comforting"
              ? card.shopBoostOptions.slice(0, 1)
              : [],
          flavourDirection: card.flavourDirection,
          flavourNotes: card.flavourNotes,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok || !data?.recipe) {
      throw new Error(data?.error || "Could not plan this meal just now.");
    }

    return {
      ...data.recipe,
      imageUrl: data.imageUrl ?? card.heroImage,
    } as GeneratedRecipe;
  }

  async function handleBuildWeek() {
    setError("");
    setIsPlanningWeek(true);

    try {
      let nextWeek = { ...week };
      const activeCards = DAY_CARDS.slice(0, settings.nights);

      for (const card of activeCards) {
        const recipe = await requestRecipeForDay(card);
        nextWeek = {
          ...nextWeek,
          [card.key]: recipe,
        };
        setWeek(nextWeek);
      }

      DAY_CARDS.slice(settings.nights).forEach((card) => {
        nextWeek[card.key] = null;
      });

      setWeek({ ...nextWeek });
      setOpenDay(activeCards[0]?.key ?? null);
    } catch (err) {
      console.error(err);
      setError("We couldn’t build the full week just now. Please try again.");
    } finally {
      setIsPlanningWeek(false);
    }
  }

  async function handleReplanDay(card: PlannerDayCard) {
    setError("");
    setPlanningDay(card.key);

    try {
      const recipe = await requestRecipeForDay(card);
      setWeek((current) => ({
        ...current,
        [card.key]: recipe,
      }));
      setOpenDay(card.key);
    } catch (err) {
      console.error(err);
      setError("We couldn’t replan that day just now. Please try again.");
    } finally {
      setPlanningDay(null);
    }
  }

  function handleClearWeek() {
    setWeek(EMPTY_WEEK);
    setOpenDay(null);
    setError("");
  }

  function addSuggestedItem(product: ShopDisplayItem) {
    addToCart({
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      checkoutType: product.checkoutType,
    });
  }

  function addAllSuggestions() {
    suggestedProducts.forEach((item) => addSuggestedItem(item.product));
  }

  return (
    <main className="min-h-screen bg-[#f4efe9] text-[#243328]">
      <section className="border-b border-[rgba(230,221,210,0.86)] px-4 pb-6 pt-5 sm:px-6 md:px-10 md:pb-8 md:pt-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="rounded-[28px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.84)] p-5 shadow-[0_12px_30px_rgba(36,51,40,0.06)] md:p-7">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#6b776c]">
                Weekly planner
              </p>

              <h1 className="mt-3 max-w-3xl font-serif text-[2rem] leading-[1.02] tracking-tight text-[#243328] md:text-[3.2rem]">
                Plan your week
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#5f675c] md:text-base">
                A few quick choices, then we build a week that feels real, looks
                good enough to cook, and keeps the food side easy.
              </p>

              <div className="mt-7 grid gap-4 md:grid-cols-3">
                <div className="rounded-[20px] border border-[#e6ddd2] bg-[rgba(255,255,255,0.8)] p-4">
                  <p className="text-sm font-medium text-[#243328]">
                    How many nights?
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[3, 4, 5, 6, 7].map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() =>
                          setSettings((current) => ({
                            ...current,
                            nights: count,
                          }))
                        }
                        className={`rounded-full px-3 py-1.5 text-sm transition ${
                          settings.nights === count
                            ? "bg-[#243328] text-white"
                            : "border border-[#d6cec2] bg-white text-[#243328]"
                        }`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-[20px] border border-[#e6ddd2] bg-[rgba(255,255,255,0.8)] p-4">
                  <p className="text-sm font-medium text-[#243328]">
                    What kind of week?
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[
                      { key: "quick", label: "Quick & easy" },
                      { key: "balanced", label: "Balanced" },
                      { key: "comforting", label: "Comforting" },
                    ].map((option) => (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() =>
                          setSettings((current) => ({
                            ...current,
                            mood: option.key as WeekMood,
                          }))
                        }
                        className={`rounded-full px-3 py-1.5 text-sm transition ${
                          settings.mood === option.key
                            ? "bg-[#243328] text-white"
                            : "border border-[#d6cec2] bg-white text-[#243328]"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-[20px] border border-[#e6ddd2] bg-[rgba(255,255,255,0.8)] p-4">
                  <p className="text-sm font-medium text-[#243328]">
                    Anything to lean into?
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[
                      { key: "none", label: "Nothing special" },
                      { key: "veg-heavy", label: "Veg-heavy" },
                      { key: "low-waste", label: "Low waste" },
                      { key: "family-friendly", label: "Family-friendly" },
                    ].map((option) => (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() =>
                          setSettings((current) => ({
                            ...current,
                            leanInto: option.key as LeanInto,
                          }))
                        }
                        className={`rounded-full px-3 py-1.5 text-sm transition ${
                          settings.leanInto === option.key
                            ? "bg-[#243328] text-white"
                            : "border border-[#d6cec2] bg-white text-[#243328]"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => void handleBuildWeek()}
                  disabled={isPlanningWeek || planningDay !== null}
                  className="rounded-full bg-[#243328] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPlanningWeek ? "Building your week..." : "Build my week"}
                </button>

                <Link
                  href="/shop"
                  className="rounded-full border border-[#d6cec2] bg-white/80 px-5 py-3 text-sm text-[#243328] transition hover:bg-white"
                >
                  Browse the shop
                </Link>

                <Link
                  href="/basket"
                  className="rounded-full border border-[#d6cec2] bg-white/80 px-5 py-3 text-sm text-[#243328] transition hover:bg-white"
                >
                  Basket{totalBasketItems > 0 ? ` (${totalBasketItems})` : ""}
                </Link>
              </div>

              {isPlanningWeek ? (
                <div className="mt-5 rounded-[20px] border border-[#e6ddd2] bg-[rgba(255,255,255,0.84)] p-4">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[#6b776c]">
                    Building your week
                  </p>
                  <p className="mt-2 text-base font-medium text-[#243328]">
                    {BUILD_STATUS_LINES[buildStatusIndex]}
                  </p>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#ebe3d8]">
                    <div className="h-full w-1/2 animate-pulse rounded-full bg-[#243328]" />
                  </div>
                </div>
              ) : null}

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-[#ddd4c8] bg-white/80 px-3 py-1.5 text-xs text-[#5f675c]">
                  {getSettingsLabel(settings)}
                </span>
                <span className="rounded-full border border-[#ddd4c8] bg-white/80 px-3 py-1.5 text-xs text-[#5f675c]">
                  Replan any day
                </span>
                <span className="rounded-full border border-[#ddd4c8] bg-white/80 px-3 py-1.5 text-xs text-[#5f675c]">
                  Steps tucked away until you need them
                </span>
              </div>

              {error ? (
                <div className="mt-5 rounded-[18px] border border-[#ead4d0] bg-[rgba(255,245,244,0.92)] px-4 py-3 text-sm text-[#7b4a42]">
                  {error}
                </div>
              ) : null}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {TOP_IMAGE_STRIP.map((card) => (
                <div
                  key={card.src}
                  className="overflow-hidden rounded-[22px] border border-[rgba(221,212,200,0.95)] bg-white/70 shadow-[0_10px_24px_rgba(36,51,40,0.05)]"
                >
                  <img
                    src={card.src}
                    alt={card.alt}
                    className="h-32 w-full object-cover md:h-40"
                  />
                  <div className="p-3">
                    <p className="text-xs uppercase tracking-[0.14em] text-[#6b776c]">
                      {card.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-6 sm:px-6 md:px-10 md:py-8">
        <div className="mx-auto max-w-7xl rounded-[24px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.7)] p-4 shadow-[0_10px_24px_rgba(36,51,40,0.04)] md:p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#6b776c]">
                Your week
              </p>
              <p className="mt-2 text-sm leading-6 text-[#5f675c]">
                Food-led, calm, and built to feel manageable. Open the cooking
                steps only when you are standing there ready to make it.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="rounded-full border border-[#ddd4c8] bg-white/80 px-3 py-1.5 text-sm text-[#5f675c]">
                {plannedDays}/{settings.nights} planned
              </div>

              <button
                type="button"
                onClick={handleClearWeek}
                className="rounded-full border border-[#d6cec2] bg-white/80 px-3 py-1.5 text-sm text-[#243328] transition hover:bg-white"
              >
                Clear week
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-8 sm:px-6 md:px-10 md:pb-12">
        <div className="mx-auto max-w-7xl grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {DAY_CARDS.slice(0, settings.nights).map((card) => {
            const recipe = week[card.key];
            const dayIsPlanning = planningDay === card.key;
            const imageSrc = recipe?.imageUrl || card.heroImage;
            const builtAround = recipe
              ? titleCase(recipe.ingredientsUsed[0] ?? card.anchorOptions[0])
              : titleCase(card.anchorOptions[0]);
            const worksWellWith = uniqueStrings([
              ...card.shopBaseOptions.slice(0, 1),
              ...card.everydayBaseOptions.slice(0, 1),
            ]).join(" or ");

            return (
              <article
                key={card.key}
                className="overflow-hidden rounded-[26px] border border-[rgba(221,212,200,0.95)] bg-[rgba(255,255,255,0.82)] shadow-[0_12px_30px_rgba(36,51,40,0.06)]"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={imageSrc}
                    alt={card.heroAlt}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.06)_0%,rgba(0,0,0,0.45)_100%)]" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <p className="text-xs uppercase tracking-[0.16em] text-white/82">
                      {card.label}
                    </p>
                    <h3 className="mt-1 font-serif text-2xl leading-tight">
                      {recipe
                        ? recipe.title
                        : `${titleCase(card.anchorOptions[0])} day`}
                    </h3>
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-sm leading-6 text-[#5f675c]">
                    {recipe
                      ? recipe.description
                      : `Built around ${builtAround}. Works well with ${worksWellWith}.`}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-[#ddd4c8] bg-[rgba(247,242,235,0.8)] px-3 py-1.5 text-xs text-[#5f675c]">
                      Built around {builtAround}
                    </span>
                    <span className="rounded-full border border-[#ddd4c8] bg-[rgba(247,242,235,0.8)] px-3 py-1.5 text-xs text-[#5f675c]">
                      {card.flavourDirection}
                    </span>
                    {card.shopBoostOptions[0] ? (
                      <span className="rounded-full border border-[#ddd4c8] bg-[rgba(247,242,235,0.8)] px-3 py-1.5 text-xs text-[#5f675c]">
                        Optional: {card.shopBoostOptions[0]}
                      </span>
                    ) : null}
                  </div>

                  {recipe ? (
                    <div className="mt-4 rounded-[18px] border border-[#ede6dc] bg-[rgba(250,247,242,0.85)] p-3">
                      <p className="text-[11px] uppercase tracking-[0.14em] text-[#6b776c]">
                        In this meal
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {recipe.ingredientsUsed
                          .slice(0, 5)
                          .map((ingredient) => (
                            <span
                              key={`${card.key}-${ingredient}`}
                              className="rounded-full bg-white px-2.5 py-1 text-xs text-[#5f675c]"
                            >
                              {titleCase(ingredient)}
                            </span>
                          ))}
                      </div>
                    </div>
                  ) : null}

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => void handleReplanDay(card)}
                      disabled={isPlanningWeek || dayIsPlanning}
                      className="rounded-full bg-[#243328] px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {dayIsPlanning
                        ? "Replanning..."
                        : recipe
                          ? `Swap ${card.short}`
                          : `Plan ${card.short}`}
                    </button>
                  </div>

                  {recipe ? (
                    <details
                      className="mt-5 overflow-hidden rounded-[20px] border border-[#e6ddd2] bg-[rgba(247,242,235,0.72)]"
                      open={openDay === card.key}
                      onToggle={(event) => {
                        const element = event.currentTarget;
                        setOpenDay(element.open ? card.key : null);
                      }}
                    >
                      <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-[#243328]">
                        <div className="flex items-center justify-between gap-3">
                          <span>Cooking steps</span>
                          <span className="text-xs text-[#6b776c]">
                            {openDay === card.key ? "Hide" : "Show"}
                          </span>
                        </div>
                      </summary>
                      <div className="border-t border-[#e6ddd2] px-4 pb-4 pt-3">
                        <ol className="space-y-2 text-sm leading-6 text-[#5f675c]">
                          {recipe.steps.map((step, index) => (
                            <li
                              key={`${card.key}-${index}`}
                              className="flex gap-3"
                            >
                              <span className="mt-[2px] inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-[11px] font-medium text-[#243328]">
                                {index + 1}
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </details>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="px-4 pb-8 sm:px-6 md:px-10 md:pb-12">
        <div className="mx-auto max-w-7xl grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="rounded-[28px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.82)] p-5 shadow-[0_12px_30px_rgba(36,51,40,0.05)] md:p-6">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#6b776c]">
              From your box
            </p>
            <h2 className="mt-2 font-serif text-2xl md:text-3xl">
              What the week is already using
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#5f675c]">
              This keeps the plan grounded in real produce, not a fantasy
              shopping list.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {fromBoxItems.length > 0 ? (
                fromBoxItems.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-[#ddd4c8] bg-white/80 px-3 py-1.5 text-sm text-[#5f675c]"
                  >
                    {titleCase(item)}
                  </span>
                ))
              ) : (
                <p className="text-sm leading-6 text-[#6b776c]">
                  Build the week first and this fills itself in.
                </p>
              )}
            </div>

            <div className="mt-6 rounded-[20px] border border-[#e6ddd2] bg-white/80 p-4">
              <p className="text-sm font-medium text-[#243328]">
                Everyday extras
              </p>
              <p className="mt-2 text-sm leading-6 text-[#5f675c]">
                {everydayExtras.length > 0
                  ? everydayExtras.map(titleCase).join(", ")
                  : "Once the week is built, we pull out the small extras that make it work."}
              </p>
            </div>
          </div>

          <div className="rounded-[28px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.82)] p-5 shadow-[0_12px_30px_rgba(36,51,40,0.05)] md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-[#6b776c]">
                  Your shop is ready
                </p>
                <h2 className="mt-2 font-serif text-2xl md:text-3xl">
                  Just the part of your shop that makes the week work
                </h2>
              </div>

              {suggestedProducts.length > 0 ? (
                <button
                  type="button"
                  onClick={addAllSuggestions}
                  className="rounded-full bg-[#243328] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
                >
                  Add all suggested items • £{suggestedTotal.toFixed(2)}
                </button>
              ) : null}
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {suggestedProducts.length > 0 ? (
                suggestedProducts.map((entry) => (
                  <div
                    key={entry.product.name}
                    className="rounded-[22px] border border-[#e6ddd2] bg-white/80 p-4"
                  >
                    <p className="text-sm font-medium text-[#243328]">
                      {entry.product.name}
                    </p>
                    <p className="mt-1 text-sm text-[#6b776c]">
                      £{entry.product.price.toFixed(2)}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#5f675c]">
                      {entry.reason}
                    </p>
                    <p className="mt-2 text-xs text-[#7a8478]">
                      Used in {entry.matchedDays.join(", ")}
                    </p>
                    <button
                      type="button"
                      onClick={() => addSuggestedItem(entry.product)}
                      className="mt-4 rounded-full border border-[#d6cec2] bg-[rgba(247,242,235,0.82)] px-4 py-2 text-sm text-[#243328] transition hover:bg-white"
                    >
                      Add to basket
                    </button>
                  </div>
                ))
              ) : (
                <div className="rounded-[22px] border border-[#e6ddd2] bg-white/80 p-5 text-sm leading-6 text-[#5f675c] md:col-span-2">
                  Build your week first and the useful add-ons will appear here.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
