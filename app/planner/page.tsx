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

type ShopSuggestion = {
  name: string;
  price: number;
  image: string;
  category: "boxes" | "pantry" | "cupboard" | "extras";
  checkoutType: "subscription" | "one-off";
  matches: string[];
};

type DayFamily = {
  key: string;
  label: string;
  intro: string;
  baseItems: string[];
  heroVegCandidates: string[];
  supportItems: string[];
  quickStart: "quick-tonight" | "comforting" | "use-what-ive-got";
};

type DayPlanSeed = {
  familyKey: string;
  familyLabel: string;
  intro: string;
  heroVeg: string[];
  supportVeg: string[];
  baseItems: string[];
  quickStart: DayFamily["quickStart"];
};

const STORAGE_KEY = "tlp_weekly_planner_v7";

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

const DAY_FAMILIES: DayFamily[] = [
  {
    key: "rice-bowl",
    label: "Broccoli, peppers + rice",
    intro: "A bowl-led start with crisp veg and a rice base.",
    baseItems: ["rice", "lemon", "herbs"],
    heroVegCandidates: ["broccoli", "peppers", "green beans", "spinach"],
    supportItems: ["garlic", "stock"],
    quickStart: "use-what-ive-got",
  },
  {
    key: "pasta-night",
    label: "Courgette, tomatoes + pasta",
    intro: "A softer, saucier pasta-shaped day.",
    baseItems: ["pasta", "basil", "cheese"],
    heroVegCandidates: ["courgette", "tomatoes", "aubergine", "mushrooms"],
    supportItems: ["garlic", "onion"],
    quickStart: "quick-tonight",
  },
  {
    key: "potato-pan",
    label: "Potatoes, kale + eggs",
    intro: "A comforting potato-led supper with greens.",
    baseItems: ["potatoes", "eggs", "yoghurt"],
    heroVegCandidates: ["potatoes", "kale", "spinach", "cabbage"],
    supportItems: ["onion", "garlic"],
    quickStart: "comforting",
  },
  {
    key: "lentil-pot",
    label: "Squash + lentils",
    intro: "A lentil and herb day with depth rather than speed.",
    baseItems: ["lentils", "thyme", "stock"],
    heroVegCandidates: ["squash", "carrots", "beetroot", "cauliflower"],
    supportItems: ["onion", "garlic"],
    quickStart: "comforting",
  },
  {
    key: "couscous-plate",
    label: "Cauliflower + couscous",
    intro: "A bright, spiced plate with enough softness to carry the week.",
    baseItems: ["couscous", "mint", "yoghurt"],
    heroVegCandidates: ["cauliflower", "peppers", "cucumber", "lettuce"],
    supportItems: ["garlic"],
    quickStart: "quick-tonight",
  },
  {
    key: "orzo-pan",
    label: "Mushrooms + greens + orzo",
    intro: "A softer pan-led meal that still feels distinct.",
    baseItems: ["orzo", "lemon", "cheese"],
    heroVegCandidates: ["mushrooms", "spinach", "kale", "tomatoes"],
    supportItems: ["garlic", "leek"],
    quickStart: "comforting",
  },
  {
    key: "bean-supper",
    label: "Carrots, cabbage + beans",
    intro: "A hearty end-of-week bean supper with robust veg.",
    baseItems: ["beans", "rosemary", "stock"],
    heroVegCandidates: ["carrots", "cabbage", "beetroot", "potatoes"],
    supportItems: ["onion", "garlic"],
    quickStart: "use-what-ive-got",
  },
];

const SHOP_SUGGESTIONS: ShopSuggestion[] = [
  {
    name: "Weekly Produce Box",
    price: 20,
    image: "/weekly-harvest-box.png",
    category: "boxes",
    checkoutType: "subscription",
    matches: [
      "broccoli",
      "pepper",
      "tomato",
      "courgette",
      "spinach",
      "kale",
      "carrot",
      "potato",
      "cucumber",
      "lettuce",
      "cauliflower",
      "cabbage",
      "mushroom",
      "squash",
    ],
  },
  {
    name: "Sorrel & Walnut Pesto",
    price: 4.5,
    image: "/sorrel-walnut-pesto.png",
    category: "pantry",
    checkoutType: "one-off",
    matches: ["pasta", "orzo", "potato", "greens", "courgette", "broccoli"],
  },
  {
    name: "Rose Harissa",
    price: 5.25,
    image: "/rose-harissa.png",
    category: "pantry",
    checkoutType: "one-off",
    matches: ["couscous", "cauliflower", "carrot", "squash", "pepper"],
  },
  {
    name: "Orzo Pasta",
    price: 4.5,
    image: "/images/cupboard/orzo.jpg",
    category: "cupboard",
    checkoutType: "one-off",
    matches: ["orzo", "mushroom", "greens", "lemon", "spinach"],
  },
  {
    name: "Giant Couscous",
    price: 4.75,
    image: "/images/cupboard/giant-couscous.jpg",
    category: "cupboard",
    checkoutType: "one-off",
    matches: ["couscous", "harissa", "cauliflower", "pepper", "herbs"],
  },
  {
    name: "Puy Lentils",
    price: 4.95,
    image: "/images/cupboard/puy-lentils.jpg",
    category: "cupboard",
    checkoutType: "one-off",
    matches: ["lentils", "squash", "carrot", "beetroot", "herbs"],
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

function tinyDescription(text: string) {
  if (text.length <= 110) return text;
  return `${text.slice(0, 107).trim()}...`;
}

function normalise(text: string) {
  return text.toLowerCase().trim();
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

    recipe.ingredientsUsed.forEach((ingredient) => {
      const key = normalise(ingredient);

      if (
        key.includes("onion") ||
        key.includes("leek") ||
        key.includes("garlic")
      ) {
        return;
      }

      HERO_VEG_POOL.forEach((heroVeg) => {
        if (
          key.includes(heroVeg) ||
          heroVeg.includes(key as (typeof HERO_VEG_POOL)[number])
        ) {
          counts[heroVeg] = (counts[heroVeg] ?? 0) + 1;
        }
      });
    });
  }

  return counts;
}

function uniqueStrings(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function pickSupportVeg(dayIndex: number, family: DayFamily) {
  const baseSupport = uniqueStrings(
    family.supportItems.filter(
      (item) => item === "onion" || item === "leek" || item === "garlic",
    ),
  );

  const rotatingSupport = SUPPORT_VEG_POOL[dayIndex % SUPPORT_VEG_POOL.length];
  return uniqueStrings([...baseSupport, rotatingSupport]).slice(0, 1);
}

function pickHeroVegForFamily(
  family: DayFamily,
  usageCounts: Record<string, number>,
) {
  const rankedCandidates = [...family.heroVegCandidates].sort((a, b) => {
    const aCount = usageCounts[a] ?? 0;
    const bCount = usageCounts[b] ?? 0;
    if (aCount !== bCount) return aCount - bCount;
    return a.localeCompare(b);
  });

  const selected: string[] = [];

  for (const veg of rankedCandidates) {
    if ((usageCounts[veg] ?? 0) >= 2) continue;
    selected.push(veg);
    usageCounts[veg] = (usageCounts[veg] ?? 0) + 1;
    if (selected.length === 2) break;
  }

  if (selected.length < 2) {
    const backupCandidates = HERO_VEG_POOL.filter(
      (veg) =>
        family.heroVegCandidates.includes(veg) === false &&
        (usageCounts[veg] ?? 0) < 2,
    );

    for (const veg of backupCandidates) {
      selected.push(veg);
      usageCounts[veg] = (usageCounts[veg] ?? 0) + 1;
      if (selected.length === 2) break;
    }
  }

  return selected.slice(0, 2);
}

function buildDaySeed(
  dayIndex: number,
  week: Record<DayKey, GeneratedRecipe | null>,
  targetDay?: DayKey,
): DayPlanSeed {
  const family = DAY_FAMILIES[dayIndex % DAY_FAMILIES.length];
  const usageCounts = countHeroVegUsage(week, targetDay);
  const heroVeg = pickHeroVegForFamily(family, usageCounts);
  const supportVeg = pickSupportVeg(dayIndex, family);

  return {
    familyKey: family.key,
    familyLabel: family.label,
    intro: family.intro,
    heroVeg,
    supportVeg,
    baseItems: family.baseItems,
    quickStart: family.quickStart,
  };
}

function getDayInputs(seed: DayPlanSeed) {
  return uniqueStrings([
    ...seed.heroVeg,
    ...seed.baseItems,
    ...seed.supportVeg,
  ]);
}

function getMatchedSuggestions(week: Record<DayKey, GeneratedRecipe | null>) {
  const used = Object.values(week)
    .filter(Boolean)
    .flatMap((recipe) => recipe!.ingredientsUsed.map(normalise));

  return SHOP_SUGGESTIONS.filter((product) =>
    product.matches.some((match) =>
      used.some(
        (ingredient) =>
          ingredient.includes(match) || match.includes(ingredient),
      ),
    ),
  ).slice(0, 4);
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

  const matchedSuggestions = useMemo(() => getMatchedSuggestions(week), [week]);

  const matchedTotal = useMemo(
    () => matchedSuggestions.reduce((sum, item) => sum + item.price, 0),
    [matchedSuggestions],
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
          heroVeg: seed.heroVeg,
          supportVeg: seed.supportVeg,
          baseItems: seed.baseItems,
          avoidHeroVeg: ["onion", "leek", "garlic"],
          guidance: [
            "Do not make onion, leek, or garlic the lead ingredient.",
            "Treat onion, leek, and garlic only as background support.",
            "Keep the meal identity clearly centered around the selected hero veg and base.",
            "Avoid repeating the same weeknight identity as previous recipes when possible.",
          ],
        },
        weekPlanContext: {
          mode: "plan-week",
          mealIndex: dayIndex,
          totalMeals: 7,
          previousRecipes,
          familyKey: seed.familyKey,
          familyLabel: seed.familyLabel,
          heroVeg: seed.heroVeg,
          supportVeg: seed.supportVeg,
          intro: seed.intro,
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

  function addSuggestedItem(name: string) {
    const item = SHOP_SUGGESTIONS.find((product) => product.name === name);
    if (!item) return;

    addToCart({
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
      checkoutType: item.checkoutType,
    });
  }

  function addAllSuggestions() {
    matchedSuggestions.forEach((item) => {
      addToCart({
        name: item.name,
        price: item.price,
        image: item.image,
        category: item.category,
        checkoutType: item.checkoutType,
      });
    });
  }

  return (
    <main className="min-h-screen bg-[#f4efe9] text-[#243328]">
      <section className="border-b border-[rgba(230,221,210,0.86)] px-4 pb-5 pt-5 sm:px-6 md:px-10 md:pb-7 md:pt-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-start gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
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
                    <div className="absolute left-0 top-7 z-20 w-[290px] rounded-[16px] border border-[#ddd4c8] bg-[rgba(255,255,255,0.98)] p-3 text-sm leading-6 text-[#5f675c] shadow-[0_14px_28px_rgba(36,51,40,0.10)]">
                      Built for local weekly food shopping, this planner uses a
                      stronger hero veg system so each day feels distinct before
                      the recipe API even starts shaping the meal.
                    </div>
                  ) : null}
                </div>
              </div>

              <h1 className="mt-2 max-w-4xl font-serif text-[2rem] leading-[0.96] tracking-tight md:text-[3rem]">
                Plan what to cook around weekly staples from our produce boxes
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5f675c] md:text-base">
                Distinct day families, stronger veg-led variation, and recipe
                cards that feel more usable across the full week.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => void handlePlanFullWeek()}
                  disabled={isPlanningWeek}
                  className="inline-flex items-center justify-center rounded-full bg-[#243328] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPlanningWeek ? "Planning..." : "Plan your week"}
                </button>

                <Link
                  href="/recipes"
                  className="inline-flex items-center justify-center rounded-full border border-[#d6cec2] bg-white/80 px-4 py-2 text-sm text-[#243328] transition hover:bg-white"
                >
                  Browse recipes
                </Link>

                <button
                  type="button"
                  onClick={handleClearWeek}
                  className="inline-flex items-center justify-center rounded-full border border-transparent px-3 py-2 text-xs text-[#6b776c] transition hover:border-[#ddd4c8] hover:bg-white/50"
                >
                  Clear week
                </button>

                <div className="inline-flex items-center gap-2 rounded-full border border-[#ddd4c8] bg-white/70 px-3 py-2 text-xs text-[#4f5e52]">
                  <span className="font-medium text-[#243328]">
                    {filledDays}/7
                  </span>
                  <span>filled days</span>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.86)] p-4 shadow-[0_12px_26px_rgba(36,51,40,0.05)] backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div className="flex h-[92px] w-[104px] shrink-0 items-center justify-center rounded-[18px] bg-[rgba(255,255,255,0.84)] p-2">
                  <img
                    src="/family-harvest-box.png"
                    alt="Weekly produce box"
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-[#6b776c]">
                    Stronger planner logic
                  </p>
                  <h2 className="mt-1 font-serif text-[1.45rem] leading-tight text-[#243328]">
                    A clearer week before the AI starts
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[#5f675c]">
                    Onion, leek, and garlic stay in support. The planner now
                    builds each day from a separate veg family and base.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {error ? (
            <div className="mt-4 rounded-[18px] border border-[#e4d8cb] bg-[#fbf6f0] px-4 py-3 text-sm text-[#6a5c4f]">
              {error}
            </div>
          ) : null}
        </div>
      </section>

      <section className="px-4 py-6 sm:px-6 md:px-10 md:py-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#6b776c]">
                The actual planner
              </p>
              <h2 className="mt-1 font-serif text-[1.7rem] leading-tight md:text-[2rem]">
                Seven day families, not just rotated ingredients
              </h2>
            </div>

            <p className="hidden max-w-md text-right text-sm leading-6 text-[#5f675c] md:block">
              Plan the full week at once, or build one day at a time with the
              same hero veg rules and repeat suppression.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {DAYS.map((day, dayIndex) => {
              const recipe = week[day.key];
              const isBusy = planningDay === day.key;
              const isOpen = openDay === day.key;
              const family = DAY_FAMILIES[dayIndex];

              return (
                <article
                  key={day.key}
                  className="overflow-hidden rounded-[22px] border border-[rgba(221,212,200,0.95)] bg-[rgba(255,255,255,0.82)] shadow-[0_10px_24px_rgba(36,51,40,0.05)]"
                >
                  {recipe?.imageUrl ? (
                    <img
                      src={recipe.imageUrl}
                      alt={recipe.title}
                      className="h-32 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-32 items-end bg-[linear-gradient(180deg,rgba(228,221,211,0.9),rgba(245,240,233,0.85))] p-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-[#6b776c]">
                          {family.label}
                        </p>
                        <p className="mt-1 text-sm text-[#5f675c]">
                          {family.intro}
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
                            ? "Replan day"
                            : "Plan day"}
                      </button>
                    </div>

                    <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-[#6b776c]">
                      {family.label}
                    </p>

                    {recipe ? (
                      <>
                        <p className="mt-3 font-serif text-[1.15rem] leading-tight text-[#243328]">
                          {recipe.title}
                        </p>

                        <p className="mt-2 text-sm leading-6 text-[#5f675c]">
                          {tinyDescription(recipe.description)}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {recipe.ingredientsUsed.slice(0, 5).map((item) => (
                            <span
                              key={`${day.key}-${item}`}
                              className="rounded-full border border-[#ddd4c8] bg-[rgba(247,242,235,0.82)] px-2.5 py-1 text-[11px] text-[#4f5e52]"
                            >
                              {item}
                            </span>
                          ))}
                        </div>

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
                              Recipe card
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
                      <p className="mt-3 text-sm leading-6 text-[#5f675c]">
                        {family.intro}
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {matchedSuggestions.length > 0 ? (
        <section className="border-t border-[rgba(230,221,210,0.86)] px-4 py-6 sm:px-6 md:px-10 md:py-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#6b776c]">
                  Basket bridge
                </p>
                <h2 className="mt-1 font-serif text-[1.6rem] leading-tight md:text-[1.9rem]">
                  Add the useful bits
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5f675c]">
                  A compact set of extras to help the planned week work without
                  pushing the basket too far.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-full border border-[#ddd4c8] bg-white/75 px-3 py-2 text-sm text-[#4f5e52]">
                  £{matchedTotal.toFixed(2)}
                </div>

                <button
                  type="button"
                  onClick={addAllSuggestions}
                  className="rounded-full bg-[#243328] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                >
                  Add suggested extras
                </button>

                <Link
                  href="/basket"
                  className="rounded-full border border-[#d6cec2] bg-white/80 px-4 py-2 text-sm text-[#243328] transition hover:bg-white"
                >
                  Basket{totalBasketItems > 0 ? ` (${totalBasketItems})` : ""}
                </Link>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {matchedSuggestions.map((item) => (
                <article
                  key={item.name}
                  className="rounded-[20px] border border-[rgba(221,212,200,0.95)] bg-[rgba(255,255,255,0.82)] p-4 shadow-[0_10px_24px_rgba(36,51,40,0.05)]"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[14px] bg-[rgba(247,242,235,0.9)] p-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-contain"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-[#243328]">{item.name}</p>
                      <p className="mt-1 text-sm text-[#5f675c]">
                        £{item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {item.matches.slice(0, 3).map((match) => (
                      <span
                        key={`${item.name}-${match}`}
                        className="rounded-full border border-[#ddd4c8] bg-[rgba(247,242,235,0.82)] px-2.5 py-1 text-[11px] text-[#4f5e52]"
                      >
                        {match}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => addSuggestedItem(item.name)}
                    className="mt-4 rounded-full border border-[#d6cec2] bg-white/80 px-4 py-2 text-sm text-[#243328] transition hover:bg-white"
                  >
                    Add to basket
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
