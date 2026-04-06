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

type QuickStart = "quick-tonight" | "comforting" | "use-what-ive-got";

type GeneratedRecipe = {
  title: string;
  description: string;
  ingredientsUsed: string[];
  pantryStaples: string[];
  steps: string[];
  imageUrl?: string | null;
};

type StoredRecipe = {
  title: string;
  description: string;
  ingredientsUsed: string[];
};

type DayFamily = {
  key: string;
  label: string;
  intro: string;
  anchorVegCandidates: string[];
  optionalVegCandidates: string[];
  supportItems: string[];
  everydayBaseOptions: string[];
  shopBaseOptions: string[];
  shopBoostOptions: string[];
  quickStart: QuickStart;
};

type DayPlanSeed = {
  familyKey: string;
  familyLabel: string;
  intro: string;
  anchorVeg: string;
  optionalVeg: string | null;
  supportVeg: string[];
  everydayBaseOptions: string[];
  shopBaseOptions: string[];
  shopBoostOptions: string[];
  quickStart: QuickStart;
};

type SuggestedProduct = {
  product: ShopDisplayItem;
  matchedDays: string[];
  role: "base" | "boost";
  score: number;
};

const STORAGE_KEY = "tlp_weekly_planner_v9";

const DAYS: { key: DayKey; label: string; short: string }[] = [
  { key: "monday", label: "Monday", short: "Mon" },
  { key: "tuesday", label: "Tuesday", short: "Tue" },
  { key: "wednesday", label: "Wednesday", short: "Wed" },
  { key: "thursday", label: "Thursday", short: "Thu" },
  { key: "friday", label: "Friday", short: "Fri" },
  { key: "saturday", label: "Saturday", short: "Sat" },
  { key: "sunday", label: "Sunday", short: "Sun" },
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

const HERO_VEG_POOL = [
  "broccoli",
  "peppers",
  "tomatoes",
  "courgette",
  "spinach",
  "kale",
  "cucumber",
  "lettuce",
  "carrots",
  "potatoes",
  "green beans",
  "cauliflower",
  "beetroot",
  "squash",
  "aubergine",
  "sweetcorn",
  "mushrooms",
  "cabbage",
] as const;

const SUPPORT_VEG_POOL = ["onion", "leek", "garlic"] as const;

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

const DAY_FAMILIES: DayFamily[] = [
  {
    key: "green-bowl",
    label: "Greens with a flexible bowl base",
    intro:
      "A fresher start to the week built around green veg, with something simple underneath to make it a proper meal.",
    anchorVegCandidates: ["broccoli", "spinach", "green beans", "kale"],
    optionalVegCandidates: ["peppers", "courgette", "cucumber"],
    supportItems: ["garlic"],
    everydayBaseOptions: ["rice", "potatoes"],
    shopBaseOptions: ["Short Grain Rice", "Orzo Pasta"],
    shopBoostOptions: ["Sorrel & Walnut Pesto"],
    quickStart: "use-what-ive-got",
  },
  {
    key: "tomato-pan",
    label: "A softer tomato-led supper",
    intro:
      "A more saucy, pan-led day that still feels easy and midweek-friendly rather than heavy.",
    anchorVegCandidates: ["tomatoes", "courgette", "aubergine", "peppers"],
    optionalVegCandidates: ["mushrooms", "spinach"],
    supportItems: ["garlic", "onion"],
    everydayBaseOptions: ["pasta", "rice"],
    shopBaseOptions: ["Casarecce Pasta", "Orzo Pasta"],
    shopBoostOptions: ["Sorrel & Walnut Pesto", "Rose Harissa"],
    quickStart: "quick-tonight",
  },
  {
    key: "potato-comfort",
    label: "A comforting potato night",
    intro:
      "A more grounding day with potatoes at the centre and enough flexibility to swing towards eggs, beans, or greens.",
    anchorVegCandidates: ["potatoes", "kale", "cabbage", "spinach"],
    optionalVegCandidates: ["mushrooms", "cauliflower"],
    supportItems: ["onion", "garlic"],
    everydayBaseOptions: ["eggs", "beans"],
    shopBaseOptions: ["Polenta", "Puy Lentils"],
    shopBoostOptions: ["Sorrel & Walnut Pesto"],
    quickStart: "comforting",
  },
  {
    key: "lentil-roast",
    label: "A roast-and-lentil kind of day",
    intro:
      "A slower-feeling supper built around roots or squash, with lentils or a sturdy base to carry it.",
    anchorVegCandidates: ["squash", "carrots", "beetroot", "cauliflower"],
    optionalVegCandidates: ["kale", "cabbage"],
    supportItems: ["onion", "garlic"],
    everydayBaseOptions: ["lentils", "beans"],
    shopBaseOptions: ["Puy Lentils", "Farro"],
    shopBoostOptions: ["Rose Harissa", "Walnuts"],
    quickStart: "comforting",
  },
  {
    key: "bright-plate",
    label: "A brighter plate with crunch",
    intro:
      "A lighter-feeling day with a cleaner finish, built around one veg anchor and a couple of easy ways to make it feel complete.",
    anchorVegCandidates: ["cauliflower", "peppers", "cucumber", "lettuce"],
    optionalVegCandidates: ["tomatoes", "green beans", "carrots"],
    supportItems: ["garlic"],
    everydayBaseOptions: ["couscous", "potatoes"],
    shopBaseOptions: ["Giant Couscous", "Farro"],
    shopBoostOptions: ["Rose Harissa", "Cashews"],
    quickStart: "quick-tonight",
  },
  {
    key: "mushroom-weekend",
    label: "A softer mushroom-led supper",
    intro:
      "A looser weekend sort of meal that can swing towards grains, pasta, or a softer bowl without boxing the user in.",
    anchorVegCandidates: ["mushrooms", "spinach", "kale", "tomatoes"],
    optionalVegCandidates: ["courgette", "cabbage"],
    supportItems: ["garlic", "leek"],
    everydayBaseOptions: ["orzo", "rice"],
    shopBaseOptions: ["Orzo Pasta", "Farro"],
    shopBoostOptions: ["Sorrel & Walnut Pesto", "Walnuts"],
    quickStart: "comforting",
  },
  {
    key: "hearty-end",
    label: "A hearty end-of-week supper",
    intro:
      "A sturdier final day built around roots or brassicas, with beans, grains, or something from the cupboard doing the supporting work.",
    anchorVegCandidates: ["cabbage", "carrots", "beetroot", "potatoes"],
    optionalVegCandidates: ["cauliflower", "spinach", "kale"],
    supportItems: ["onion", "garlic"],
    everydayBaseOptions: ["beans", "rice"],
    shopBaseOptions: ["Puy Lentils", "Polenta"],
    shopBoostOptions: ["Rose Harissa", "Cashews"],
    quickStart: "use-what-ive-got",
  },
];

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

function tinyDescription(text: string) {
  if (text.length <= 132) return text;
  return `${text.slice(0, 129).trim()}...`;
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

function isSupportVeg(item: string) {
  const lower = item.toLowerCase();
  return (
    lower.includes("onion") ||
    lower.includes("leek") ||
    lower.includes("garlic")
  );
}

function toPreviousRecipes(
  week: Record<DayKey, GeneratedRecipe | null>,
  excludeDay?: DayKey,
) {
  const recipes: StoredRecipe[] = [];

  for (const day of DAYS) {
    if (excludeDay && day.key === excludeDay) continue;
    const recipe = week[day.key];
    if (!recipe) continue;

    recipes.push({
      title: recipe.title,
      description: recipe.description,
      ingredientsUsed: recipe.ingredientsUsed,
    });
  }

  return recipes;
}

function countHeroVegUsage(
  week: Record<DayKey, GeneratedRecipe | null>,
  excludeDay?: DayKey,
) {
  const counts: Record<string, number> = {};

  for (const day of DAYS) {
    if (excludeDay && day.key === excludeDay) continue;

    const recipe = week[day.key];
    if (!recipe) continue;

    const nonSupport = recipe.ingredientsUsed
      .map((item) => item.toLowerCase())
      .filter((item) => !isSupportVeg(item))
      .slice(0, 2);

    for (const ingredient of nonSupport) {
      counts[ingredient] = (counts[ingredient] ?? 0) + 1;
    }
  }

  return counts;
}

function pickAnchorVegForFamily(
  family: DayFamily,
  usageCounts: Record<string, number>,
) {
  const ranked = [...family.anchorVegCandidates].sort((a, b) => {
    const aCount = usageCounts[a] ?? 0;
    const bCount = usageCounts[b] ?? 0;

    if (aCount !== bCount) return aCount - bCount;
    return a.localeCompare(b);
  });

  const picked =
    ranked.find((veg) => (usageCounts[veg] ?? 0) < 2) ??
    HERO_VEG_POOL.find((veg) => (usageCounts[veg] ?? 0) < 2) ??
    family.anchorVegCandidates[0];

  usageCounts[picked] = (usageCounts[picked] ?? 0) + 1;

  return picked;
}

function pickOptionalVegForFamily(
  family: DayFamily,
  usageCounts: Record<string, number>,
  anchorVeg: string,
) {
  const ranked = [...family.optionalVegCandidates].sort((a, b) => {
    const aCount = usageCounts[a] ?? 0;
    const bCount = usageCounts[b] ?? 0;

    if (aCount !== bCount) return aCount - bCount;
    return a.localeCompare(b);
  });

  const picked = ranked.find(
    (veg) => veg !== anchorVeg && (usageCounts[veg] ?? 0) < 2,
  );

  if (!picked) return null;

  usageCounts[picked] = (usageCounts[picked] ?? 0) + 1;
  return picked;
}

function pickSupportVeg(dayIndex: number, family: DayFamily) {
  const supportFromFamily = family.supportItems.filter((item) =>
    isSupportVeg(item),
  );
  const rotatingSupport = SUPPORT_VEG_POOL[dayIndex % SUPPORT_VEG_POOL.length];

  return uniqueStrings([...supportFromFamily, rotatingSupport]).slice(0, 1);
}

function buildDaySeed(
  dayIndex: number,
  week: Record<DayKey, GeneratedRecipe | null>,
  targetDay?: DayKey,
): DayPlanSeed {
  const family = DAY_FAMILIES[dayIndex % DAY_FAMILIES.length];
  const usageCounts = countHeroVegUsage(week, targetDay);
  const anchorVeg = pickAnchorVegForFamily(family, usageCounts);
  const optionalVeg = pickOptionalVegForFamily(family, usageCounts, anchorVeg);
  const supportVeg = pickSupportVeg(dayIndex, family);

  return {
    familyKey: family.key,
    familyLabel: family.label,
    intro: family.intro,
    anchorVeg,
    optionalVeg,
    supportVeg,
    everydayBaseOptions: family.everydayBaseOptions,
    shopBaseOptions: family.shopBaseOptions,
    shopBoostOptions: family.shopBoostOptions,
    quickStart: family.quickStart,
  };
}

function getDayInputs(seed: DayPlanSeed) {
  return uniqueStrings([
    seed.anchorVeg,
    seed.optionalVeg ?? "",
    ...seed.everydayBaseOptions.slice(0, 1),
    ...seed.shopBaseOptions.slice(0, 1),
    ...seed.shopBoostOptions.slice(0, 1),
    ...seed.supportVeg,
  ]);
}

function getShopItemByName(name: string) {
  return allShopItems.find((item) => item.name === name) ?? null;
}

function getSuggestedProducts(
  week: Record<DayKey, GeneratedRecipe | null>,
): SuggestedProduct[] {
  const map = new Map<string, SuggestedProduct>();

  for (const [dayIndex, day] of DAYS.entries()) {
    const recipe = week[day.key];
    if (!recipe) continue;

    const family = DAY_FAMILIES[dayIndex];
    const productNames = [
      ...family.shopBaseOptions.map((name) => ({
        name,
        role: "base" as const,
      })),
      ...family.shopBoostOptions.map((name) => ({
        name,
        role: "boost" as const,
      })),
    ];

    productNames.forEach((entry, productIndex) => {
      const product = getShopItemByName(entry.name);
      if (!product) return;

      const existing = map.get(product.name);

      if (existing) {
        if (!existing.matchedDays.includes(day.label)) {
          existing.matchedDays.push(day.label);
        }
        existing.score += entry.role === "base" ? 2 : 1;
        return;
      }

      map.set(product.name, {
        product,
        matchedDays: [day.label],
        role: entry.role,
        score: entry.role === "base" ? 3 - productIndex : 1,
      });
    });
  }

  return Array.from(map.values())
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.product.name.localeCompare(b.product.name);
    })
    .slice(0, 6);
}

function getFromBoxItems(week: Record<DayKey, GeneratedRecipe | null>) {
  const ingredients = Object.values(week)
    .filter(Boolean)
    .flatMap((recipe) => recipe!.ingredientsUsed.map(normalise));

  const fromBox = ingredients.filter(
    (ingredient) =>
      HERO_VEG_POOL.some(
        (veg) =>
          ingredient.includes(veg) ||
          veg.includes(ingredient as (typeof HERO_VEG_POOL)[number]),
      ) || isSupportVeg(ingredient),
  );

  return uniqueStrings(fromBox).slice(0, 10);
}

function getEverydayExtras(
  week: Record<DayKey, GeneratedRecipe | null>,
  suggestions: SuggestedProduct[],
) {
  const suggestionTerms = suggestions.map((entry) =>
    normalise(entry.product.name),
  );

  const ingredients = Object.values(week)
    .filter(Boolean)
    .flatMap((recipe) => recipe!.ingredientsUsed.map(normalise));

  return uniqueStrings(
    ingredients.filter(
      (ingredient) =>
        !isSupportVeg(ingredient) &&
        !HERO_VEG_POOL.some(
          (veg) =>
            ingredient.includes(veg) ||
            veg.includes(ingredient as (typeof HERO_VEG_POOL)[number]),
        ) &&
        !suggestionTerms.some(
          (term) => ingredient.includes(term) || term.includes(ingredient),
        ),
    ),
  ).slice(0, 8);
}

function getBuiltAroundText(seed: DayPlanSeed, recipe: GeneratedRecipe | null) {
  if (!recipe) return titleCase(seed.anchorVeg);

  const nonSupport = recipe.ingredientsUsed
    .filter((item) => !isSupportVeg(item))
    .slice(0, 2);

  if (nonSupport.length > 0) {
    return titleCase(nonSupport[0]);
  }

  return titleCase(seed.anchorVeg);
}

function formatNaturalList(values: string[]) {
  if (values.length === 0) return "";
  if (values.length === 1) return values[0];
  if (values.length === 2) return `${values[0]} or ${values[1]}`;

  const start = values.slice(0, -1).join(", ");
  return `${start}, or ${values[values.length - 1]}`;
}

function getWorksWellWithText(seed: DayPlanSeed) {
  const preferred = uniqueStrings([
    ...seed.shopBaseOptions.slice(0, 2),
    ...seed.everydayBaseOptions.slice(0, 2),
  ]);

  return formatNaturalList(preferred);
}

function getOptionalBoostText(seed: DayPlanSeed) {
  const boosts = uniqueStrings(seed.shopBoostOptions.slice(0, 2));
  return boosts.length > 0 ? formatNaturalList(boosts) : "";
}

export default function PlannerPage() {
  const { addToCart, cart } = useCart();
  const [week, setWeek] =
    useState<Record<DayKey, GeneratedRecipe | null>>(EMPTY_WEEK);
  const [isPlanningWeek, setIsPlanningWeek] = useState(false);
  const [planningDay, setPlanningDay] = useState<DayKey | null>(null);
  const [openDay, setOpenDay] = useState<DayKey | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setWeek(readStoredWeek());
  }, []);

  useEffect(() => {
    writeStoredWeek(week);
  }, [week]);

  const filledDays = useMemo(
    () => Object.values(week).filter(Boolean).length,
    [week],
  );
  const totalBasketItems = useMemo(() => cart.length, [cart]);
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

  async function requestRecipeForDay(
    dayIndex: number,
    existingWeek: Record<DayKey, GeneratedRecipe | null>,
    targetDay: DayKey,
  ) {
    const seed = buildDaySeed(dayIndex, existingWeek, targetDay);
    const previousRecipes = toPreviousRecipes(existingWeek, targetDay);

    const response = await fetch("/api/recipe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: getDayInputs(seed),
        quickStart: seed.quickStart,
        preferences: [],
        previousRecipes,
        plannerIntent: {
          mode: "weekly-staples",
          familyKey: seed.familyKey,
          familyLabel: seed.familyLabel,
          anchorVeg: seed.anchorVeg,
          optionalVeg: seed.optionalVeg,
          supportVeg: seed.supportVeg,
          everydayBaseOptions: seed.everydayBaseOptions,
          shopBaseOptions: seed.shopBaseOptions,
          shopBoostOptions: seed.shopBoostOptions,
          avoidHeroVeg: ["onion", "leek", "garlic"],
          guidance: [
            "Do not make onion, leek, or garlic the lead ingredient.",
            "Use one anchor veg and optionally one second veg, not a crowded ingredient pile.",
            "Let bases stay flexible. A shop base can fit naturally, but do not force it.",
            "Shop products should feel like useful options, not mandatory ingredients.",
            "Avoid tartines or toast-led ideas unless they are clearly the best fit.",
            "Keep the meal practical, direct, and realistic for everyday cooking.",
          ],
        },
        weekPlanContext: {
          mode: "plan-week",
          mealIndex: dayIndex,
          totalMeals: 7,
          previousRecipes,
          familyKey: seed.familyKey,
          familyLabel: seed.familyLabel,
          anchorVeg: seed.anchorVeg,
          optionalVeg: seed.optionalVeg,
          supportVeg: seed.supportVeg,
          intro: seed.intro,
          everydayBaseOptions: seed.everydayBaseOptions,
          shopBaseOptions: seed.shopBaseOptions,
          shopBoostOptions: seed.shopBoostOptions,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok || !data?.recipe) {
      throw new Error(data?.error || "Could not plan this meal just now.");
    }

    return {
      ...data.recipe,
      imageUrl: data.imageUrl ?? null,
    } as GeneratedRecipe;
  }

  async function handlePlanFullWeek() {
    setError("");
    setIsPlanningWeek(true);

    try {
      let nextWeek = { ...week };

      for (let i = 0; i < DAYS.length; i++) {
        const day = DAYS[i];
        const recipe = await requestRecipeForDay(i, nextWeek, day.key);

        nextWeek = {
          ...nextWeek,
          [day.key]: recipe,
        };

        setWeek(nextWeek);
      }
    } catch (err) {
      console.error(err);
      setError("We couldn’t build the full week just now. Please try again.");
    } finally {
      setIsPlanningWeek(false);
    }
  }

  async function handlePlanSingleDay(day: DayKey) {
    setError("");
    setPlanningDay(day);

    try {
      const dayIndex = DAYS.findIndex((item) => item.key === day);
      const recipe = await requestRecipeForDay(dayIndex, week, day);

      setWeek((current) => ({
        ...current,
        [day]: recipe,
      }));

      setOpenDay(day);
    } catch (err) {
      console.error(err);
      setError("We couldn’t plan that day just now. Please try again.");
    } finally {
      setPlanningDay(null);
    }
  }

  function handleClearWeek() {
    setWeek(EMPTY_WEEK);
    setOpenDay(null);
    setError("");
  }

  function addSuggestedItem(productName: string) {
    const product = getShopItemByName(productName);
    if (!product) return;

    addToCart({
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      checkoutType: product.checkoutType,
    });
  }

  function addAllSuggestions() {
    suggestedProducts.forEach((entry) => {
      addToCart({
        name: entry.product.name,
        price: entry.product.price,
        image: entry.product.image,
        category: entry.product.category,
        checkoutType: entry.product.checkoutType,
      });
    });
  }

  return (
    <main className="min-h-screen bg-[#f4efe9] text-[#243328]">
      <section className="border-b border-[rgba(230,221,210,0.86)] px-4 pb-6 pt-5 sm:px-6 md:px-10 md:pb-8 md:pt-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 lg:grid-cols-[1.12fr_0.88fr]">
            <div className="rounded-[28px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.84)] p-5 shadow-[0_12px_30px_rgba(36,51,40,0.06)] md:p-7">
              <div className="flex items-center gap-2">
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#6b776c]">
                  Weekly planner
                </p>

                <div
                  className="relative"
                  onMouseEnter={() => setShowInfo(true)}
                  onMouseLeave={() => setShowInfo(false)}
                >
                  <button
                    type="button"
                    onClick={() => setShowInfo((current) => !current)}
                    className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#d8d0c4] text-[11px] text-[#5f675c]"
                    aria-label="About this planner"
                  >
                    i
                  </button>

                  {showInfo ? (
                    <div className="absolute left-0 top-7 z-20 w-[320px] rounded-[16px] border border-[#ddd4c8] bg-[rgba(255,255,255,0.98)] p-3 text-sm leading-6 text-[#5f675c] shadow-[0_14px_28px_rgba(36,51,40,0.10)]">
                      Build a whole week or plan day by day. Each day starts
                      from one anchor veg, one optional supporting veg, and a
                      few flexible base ideas so the plan feels useful rather
                      than boxed in.
                    </div>
                  ) : null}
                </div>
              </div>

              <h1 className="mt-3 max-w-3xl font-serif text-[2rem] leading-[1.02] tracking-tight text-[#243328] md:text-[3.4rem]">
                Plan what to cook around weekly staples from our produce boxes
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#5f675c] md:text-base">
                Plan your week around what you already get in your produce box.
                Each day starts with one clear veg anchor, then opens into a few
                flexible ways to make it work.
              </p>

              <p className="mt-3 text-sm text-[#5f675c]">
                Built from a real local kitchen and delivery service.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => void handlePlanFullWeek()}
                  disabled={isPlanningWeek || planningDay !== null}
                  className="rounded-full bg-[#243328] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPlanningWeek
                    ? "Planning your week..."
                    : "Start planning your week"}
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

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-[#ddd4c8] bg-white/80 px-3 py-1.5 text-xs text-[#5f675c]">
                  1 anchor veg + 1 optional veg
                </span>
                <span className="rounded-full border border-[#ddd4c8] bg-white/80 px-3 py-1.5 text-xs text-[#5f675c]">
                  Flexible base options
                </span>
                <span className="rounded-full border border-[#ddd4c8] bg-white/80 px-3 py-1.5 text-xs text-[#5f675c]">
                  Replan any day
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
                Your week, built from your box
              </p>
              <p className="mt-2 text-sm leading-6 text-[#5f675c]">
                Each day starts from a different veg identity, but the bases
                stay flexible so the plan feels helpful, not rigid.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="rounded-full border border-[#ddd4c8] bg-white/80 px-3 py-1.5 text-sm text-[#5f675c]">
                {filledDays}/7 planned
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

      <section className="px-4 pb-8 sm:px-6 md:px-10 md:pb-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {DAYS.map((day, dayIndex) => {
              const recipe = week[day.key];
              const isBusy = planningDay === day.key;
              const isOpen = openDay === day.key;
              const seed = buildDaySeed(dayIndex, week, day.key);
              const builtAround = getBuiltAroundText(seed, recipe);
              const worksWellWith = getWorksWellWithText(seed);
              const optionalBoost = getOptionalBoostText(seed);

              return (
                <article
                  key={day.key}
                  className="overflow-hidden rounded-[24px] border border-[rgba(221,212,200,0.95)] bg-[rgba(255,255,255,0.82)] shadow-[0_10px_24px_rgba(36,51,40,0.05)]"
                >
                  {recipe?.imageUrl ? (
                    <img
                      src={recipe.imageUrl}
                      alt={recipe.title}
                      className="h-36 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-36 items-end bg-[linear-gradient(180deg,rgba(228,221,211,0.9),rgba(245,240,233,0.85))] p-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-[#6b776c]">
                          {day.label}
                        </p>
                        <p className="mt-1 max-w-[14rem] text-sm leading-6 text-[#5f675c]">
                          {seed.intro}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-medium text-[#243328]">
                        {day.label}
                      </h3>

                      <button
                        type="button"
                        onClick={() => void handlePlanSingleDay(day.key)}
                        disabled={isBusy || isPlanningWeek}
                        className="rounded-full border border-[#d6cec2] bg-white/80 px-3 py-1.5 text-xs text-[#243328] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isBusy
                          ? "Planning..."
                          : recipe
                            ? "Try a different idea"
                            : "Plan day"}
                      </button>
                    </div>

                    <div className="mt-3 rounded-[18px] border border-[#e8dfd3] bg-[rgba(249,246,241,0.76)] p-3">
                      <p className="text-[11px] uppercase tracking-[0.14em] text-[#6b776c]">
                        Built around
                      </p>
                      <p className="mt-1 text-sm font-medium text-[#243328]">
                        {builtAround}
                      </p>

                      <p className="mt-3 text-[11px] uppercase tracking-[0.14em] text-[#6b776c]">
                        Works well with
                      </p>
                      <p className="mt-1 text-sm leading-6 text-[#5f675c]">
                        {worksWellWith}
                      </p>

                      {optionalBoost ? (
                        <>
                          <p className="mt-3 text-[11px] uppercase tracking-[0.14em] text-[#6b776c]">
                            Optional from the shop
                          </p>
                          <p className="mt-1 text-sm leading-6 text-[#5f675c]">
                            {optionalBoost}
                          </p>
                        </>
                      ) : null}
                    </div>

                    {recipe ? (
                      <>
                        <p className="mt-4 font-serif text-[1.18rem] leading-tight text-[#243328]">
                          {recipe.title}
                        </p>

                        <p className="mt-2 text-sm leading-6 text-[#5f675c]">
                          {tinyDescription(recipe.description)}
                        </p>

                        <p className="mt-2 text-xs text-[#6b776c]">
                          Same ingredients, new direction.
                        </p>

                        <div className="mt-4 flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setOpenDay(isOpen ? null : day.key)}
                            className="text-sm text-[#5f675c] underline underline-offset-4"
                          >
                            {isOpen ? "Hide recipe card" : "Follow recipe"}
                          </button>
                        </div>

                        {isOpen ? (
                          <div className="mt-4 rounded-[18px] border border-[#e6ddd2] bg-[rgba(249,246,241,0.78)] p-4">
                            <p className="text-[10px] uppercase tracking-[0.14em] text-[#6b776c]">
                              A simple idea using what you’ve got
                            </p>

                            <ol className="mt-3 space-y-3 text-sm leading-6 text-[#243328]">
                              {recipe.steps.map((step, index) => (
                                <li
                                  key={`${day.key}-${index}`}
                                  className="flex gap-3"
                                >
                                  <span className="mt-[2px] inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#d6cec2] text-[10px]">
                                    {index + 1}
                                  </span>
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        ) : null}
                      </>
                    ) : (
                      <>
                        <p className="mt-4 text-sm leading-6 text-[#5f675c]">
                          Start with your box and we’ll build you a simple meal
                          idea for this day.
                        </p>
                      </>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {filledDays > 0 ? (
        <section className="border-t border-[rgba(230,221,210,0.86)] px-4 py-6 sm:px-6 md:px-10 md:py-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-4 lg:grid-cols-[0.98fr_1.02fr]">
              <article className="rounded-[24px] border border-[rgba(221,212,200,0.95)] bg-[rgba(255,255,255,0.82)] p-5 shadow-[0_10px_24px_rgba(36,51,40,0.05)]">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#6b776c]">
                  Finish your week
                </p>
                <h2 className="mt-1 font-serif text-[1.45rem] leading-tight text-[#243328]">
                  Add a few good things to make the whole week work smoothly
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#5f675c]">
                  The produce box still does the heavy lifting. These are the
                  pantry adds that fit the plan best, plus any normal extras you
                  may want on hand.
                </p>

                <div className="mt-5 space-y-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.14em] text-[#6b776c]">
                      From your box
                    </p>

                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {fromBoxItems.length > 0 ? (
                        fromBoxItems.map((item) => (
                          <span
                            key={`box-${item}`}
                            className="rounded-full border border-[#ddd4c8] bg-[rgba(247,242,235,0.82)] px-2.5 py-1 text-[11px] text-[#4f5e52]"
                          >
                            {titleCase(item)}
                          </span>
                        ))
                      ) : (
                        <p className="text-sm text-[#5f675c]">
                          Plan a few days and your box staples will start to
                          show here.
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[11px] uppercase tracking-[0.14em] text-[#6b776c]">
                        Add from your pantry
                      </p>

                      {suggestedProducts.length > 0 ? (
                        <div className="rounded-full border border-[#ddd4c8] bg-white/75 px-3 py-1.5 text-xs text-[#4f5e52]">
                          £{suggestedTotal.toFixed(2)}
                        </div>
                      ) : null}
                    </div>

                    {suggestedProducts.length > 0 ? (
                      <div className="mt-3 space-y-3">
                        {suggestedProducts.map((entry) => (
                          <div
                            key={entry.product.name}
                            className="flex items-center gap-3 rounded-[18px] border border-[#e6ddd2] bg-[rgba(249,246,241,0.88)] p-3"
                          >
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-white p-2">
                              <img
                                src={entry.product.image}
                                alt={entry.product.name}
                                className="h-full w-full object-contain"
                              />
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-[#243328]">
                                {entry.product.name}
                              </p>
                              <p className="mt-1 text-sm text-[#5f675c]">
                                {entry.role === "base"
                                  ? "Works as a flexible base in this plan"
                                  : "Good as an optional flavour boost"}
                              </p>
                              <p className="mt-1 text-xs text-[#6b776c]">
                                Used across{" "}
                                {formatNaturalList(entry.matchedDays)}
                              </p>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                              <p className="text-sm text-[#5f675c]">
                                £{entry.product.price.toFixed(2)}
                              </p>

                              <button
                                type="button"
                                onClick={() =>
                                  addSuggestedItem(entry.product.name)
                                }
                                className="rounded-full border border-[#d6cec2] bg-white/80 px-3 py-2 text-sm text-[#243328] transition hover:bg-white"
                              >
                                Add
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-2 text-sm text-[#5f675c]">
                        As soon as the plan lines up with one of your pantry
                        products, it will show here.
                      </p>
                    )}
                  </div>

                  {everydayExtras.length > 0 ? (
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.14em] text-[#6b776c]">
                        Everyday extras
                      </p>

                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {everydayExtras.map((item) => (
                          <span
                            key={`extra-${item}`}
                            className="rounded-full border border-[#ddd4c8] bg-white px-2.5 py-1 text-[11px] text-[#4f5e52]"
                          >
                            {titleCase(item)}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  {suggestedProducts.length > 0 ? (
                    <button
                      type="button"
                      onClick={addAllSuggestions}
                      className="rounded-full bg-[#243328] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                    >
                      Add everything I need
                    </button>
                  ) : null}

                  <Link
                    href="/shop"
                    className="rounded-full border border-[#d6cec2] bg-white/80 px-4 py-2 text-sm text-[#243328] transition hover:bg-white"
                  >
                    Browse the shop
                  </Link>

                  <Link
                    href="/basket"
                    className="rounded-full border border-[#d6cec2] bg-white/80 px-4 py-2 text-sm text-[#243328] transition hover:bg-white"
                  >
                    Basket{totalBasketItems > 0 ? ` (${totalBasketItems})` : ""}
                  </Link>
                </div>
              </article>

              <article className="rounded-[24px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.86)] p-5 shadow-[0_10px_24px_rgba(36,51,40,0.05)]">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#6b776c]">
                  How this planner is working
                </p>
                <h2 className="mt-1 font-serif text-[1.45rem] leading-tight text-[#243328]">
                  Flexible enough to feel real, commercial enough to support the
                  week
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#5f675c]">
                  The plan can point towards your shop where it helps, without
                  pretending every meal only works with products you stock.
                </p>

                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  <div className="rounded-[18px] border border-[#e6ddd2] bg-white/85 p-4">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-[#6b776c]">
                      1
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#243328]">
                      One clear anchor veg gives the day a direction.
                    </p>
                  </div>

                  <div className="rounded-[18px] border border-[#e6ddd2] bg-white/85 p-4">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-[#6b776c]">
                      2
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#243328]">
                      A shop base or boost can fit naturally, but never has to.
                    </p>
                  </div>

                  <div className="rounded-[18px] border border-[#e6ddd2] bg-white/85 p-4">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-[#6b776c]">
                      3
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#243328]">
                      Replanning keeps the same spirit while giving the user a
                      fresh way through the week.
                    </p>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
