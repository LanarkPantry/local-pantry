"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useCart } from "../cart-context";
import {
  produceBoxes,
  pantryItems,
  cupboardItems,
  type ShopDisplayItem,
} from "../shop/shop-data";

type WeekMood = "quick" | "balanced" | "comforting";
type WeekFocus = "veg-heavy" | "low-waste" | "family-friendly";
type PlannerStep = "choices" | "building" | "results";

type GeneratedRecipe = {
  title: string;
  description: string;
  ingredientsUsed: string[];
  pantryStaples: string[];
  steps: string[];
};

type RecipeResponse = {
  recipe?: GeneratedRecipe;
  imageUrl?: string | null;
  error?: string;
  debug?: {
    imageGenerated?: boolean;
    imageError?: string | null;
    apiVersion?: string;
  };
};

type PlannedMeal = {
  id: string;
  day: string;
  title: string;
  description: string;
  imageUrl: string | null;
  imageError?: string | null;
  ingredients: string[];
  matchedProducts: string[];
  steps: string[];
};

type ChoiceChipProps = {
  active: boolean;
  label: string;
  onClick: () => void;
};

type PlannerIntent = {
  familyKey: string;
  familyLabel: string;
  anchorVeg: string;
  optionalVeg: string | null;
  supportVeg: string[];
  everydayBaseOptions: string[];
  shopBaseOptions: string[];
  shopBoostOptions: string[];
  avoidHeroVeg: string[];
  flavourDirection: string;
  flavourNotes: string[];
  guidance: string[];
};

const LOADING_MESSAGES = [
  "Looking at what’s in season",
  "Building meals for the week ahead",
  "Keeping the week flexible",
  "Matching your basket",
  "Finishing your plan",
] as const;

const DAY_NAMES = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

const FALLBACK_IMAGE = "/hero.jpg";

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

const SHOP_BASES = [
  "Casarecce Pasta",
  "Bucatini",
  "Orzo",
  "Giant Couscous",
  "Farro",
  "Polenta",
  "Risotto Rice",
  "Puy Lentils",
  "Butter Beans",
  "Cannellini Beans",
  "Chickpeas",
  "Premium Whole Tomatoes",
];

const SHOP_BOOSTS = [
  "Rose Harissa",
  "Sorrel & Walnut Pesto",
  "Signature Gochujang",
  "Vegetable Stock Concentrate",
  "Tahini",
  "White Miso",
  "Salted Caramel Sauce",
  "Dark Chocolate & Hazelnut Spread",
];

const QUICK_ANCHORS = [
  "spinach",
  "tomatoes",
  "broccoli",
  "peppers",
  "potatoes",
  "cucumber",
];

const BALANCED_ANCHORS = [
  "potatoes",
  "tomatoes",
  "greens",
  "broccoli",
  "peppers",
  "carrots",
];

const COMFORTING_ANCHORS = [
  "potatoes",
  "mushrooms",
  "roots",
  "greens",
  "tomatoes",
  "carrots",
];

function ChoiceChip({ active, label, onClick }: ChoiceChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm transition ${
        active
          ? "border-[#243328] bg-[#243328] text-white"
          : "border-[#d6cec2] bg-white/80 text-[#243328] hover:bg-white"
      }`}
    >
      {label}
    </button>
  );
}

function compactCardItem(item: ShopDisplayItem, onAdd: () => void) {
  return (
    <div
      key={item.name}
      className="rounded-[20px] border border-[#e4dbcf] bg-white/88 p-4 shadow-[0_8px_18px_rgba(36,51,40,0.04)]"
    >
      <div className="flex items-start gap-3">
        <img
          src={item.image}
          alt={item.name}
          className="h-16 w-16 rounded-[14px] object-cover"
        />

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-[#243328]">{item.name}</p>
          <p className="mt-1 text-sm leading-6 text-[#667164]">
            {item.description}
          </p>
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-[#243328]">
              £{item.price.toFixed(2)}
            </span>
            <button
              type="button"
              onClick={onAdd}
              className="rounded-full border border-[#d6cec2] bg-[rgba(247,242,235,0.88)] px-3 py-1.5 text-xs font-medium text-[#243328] transition hover:bg-white"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function normalise(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function dedupeStrings(values: string[]) {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    const trimmed = value.trim();
    if (!trimmed) continue;

    const key = normalise(trimmed);
    if (!key || seen.has(key)) continue;

    seen.add(key);
    result.push(trimmed);
  }

  return result;
}

function getBoxIngredients() {
  const firstBox = produceBoxes[0];

  if (firstBox?.weeklyIncludes && firstBox.weeklyIncludes.length > 0) {
    return firstBox.weeklyIncludes.map((item) => item.trim()).filter(Boolean);
  }

  return DEFAULT_BOX_INGREDIENTS;
}

function pickFromList(values: string[], index: number) {
  if (values.length === 0) return "";
  return values[index % values.length];
}

function buildMealIntent(
  mood: WeekMood,
  focus: WeekFocus | null,
  mealIndex: number,
  totalMeals: number,
  boxIngredients: string[],
): PlannerIntent {
  const anchors =
    mood === "quick"
      ? QUICK_ANCHORS
      : mood === "comforting"
        ? COMFORTING_ANCHORS
        : BALANCED_ANCHORS;

  const boxMatches = anchors.filter((anchor) =>
    boxIngredients.some((item) => normalise(item).includes(normalise(anchor))),
  );

  const anchorPool = boxMatches.length > 0 ? boxMatches : anchors;
  const anchorVeg = pickFromList(anchorPool, mealIndex);

  const optionalVeg = pickFromList(
    boxIngredients.filter(
      (item) => !normalise(item).includes(normalise(anchorVeg)),
    ),
    mealIndex + 2,
  );

  const shopBaseOptions = [
    pickFromList(SHOP_BASES, mealIndex),
    pickFromList(SHOP_BASES, mealIndex + 3),
  ].filter(Boolean);

  const shopBoostOptions =
    mealIndex % 2 === 0
      ? [pickFromList(SHOP_BOOSTS, mealIndex)]
      : [pickFromList(SHOP_BOOSTS, mealIndex + 2)];

  const focusGuidance =
    focus === "family-friendly"
      ? ["Keep this especially easy to serve and not too polarising."]
      : focus === "low-waste"
        ? ["Use ingredients flexibly and avoid creating lots of leftovers."]
        : focus === "veg-heavy"
          ? ["Let vegetables be the lead, not just a side."]
          : [];

  const moodDirection =
    mood === "quick"
      ? "quick, bright, practical and weeknight-friendly"
      : mood === "comforting"
        ? "warm, generous, soft-edged and comforting"
        : "balanced, colourful, useful and varied";

  return {
    familyKey: mood,
    familyLabel:
      mood === "quick"
        ? "Quick and easy"
        : mood === "comforting"
          ? "Comforting"
          : "Balanced",
    anchorVeg,
    optionalVeg: optionalVeg || null,
    supportVeg: boxIngredients.slice(mealIndex, mealIndex + 4),
    everydayBaseOptions: ["rice", "bread", "eggs", "yoghurt", "lemon", "herbs"],
    shopBaseOptions,
    shopBoostOptions,
    avoidHeroVeg:
      mealIndex > 0 ? [pickFromList(anchorPool, mealIndex - 1)] : [],
    flavourDirection: moodDirection,
    flavourNotes:
      mood === "quick"
        ? ["bright", "simple", "minimal prep"]
        : mood === "comforting"
          ? ["warm", "soft", "savoury"]
          : ["fresh", "colourful", "varied"],
    guidance: focusGuidance,
  };
}

function getQuickStartForMood(mood: WeekMood) {
  if (mood === "quick") return "quick-tonight";
  if (mood === "comforting") return "comforting";
  return "use-what-ive-got";
}

function matchedProductsForRecipe(recipe: GeneratedRecipe) {
  const text = [
    recipe.title,
    recipe.description,
    ...recipe.ingredientsUsed,
    ...recipe.pantryStaples,
  ]
    .join(" ")
    .toLowerCase();

  return [...pantryItems, ...cupboardItems]
    .filter((item) => text.includes(item.name.toLowerCase()))
    .map((item) => item.name);
}

function fallbackMeal(day: string, index: number): PlannedMeal {
  return {
    id: `fallback-${index}-${Date.now()}`,
    day,
    title: "Simple veg box supper",
    description:
      "A flexible meal built from the week’s produce with pantry support.",
    imageUrl: null,
    imageError: "Recipe API did not return a generated image.",
    ingredients: ["Seasonal vegetables", "Pantry base", "Herbs", "Lemon"],
    matchedProducts: ["Giant Couscous", "Rose Harissa"],
    steps: [
      "Cook the vegetables simply until tender.",
      "Prepare a pantry base such as grains, pasta, beans or rice.",
      "Bring everything together with oil, herbs, lemon or a jarred boost.",
      "Taste, season, and serve warm.",
    ],
  };
}

async function generatePlannerMeal(args: {
  mood: WeekMood;
  focus: WeekFocus | null;
  mealIndex: number;
  totalMeals: number;
  basketNames: string[];
  previousMeals: PlannedMeal[];
}) {
  const { mood, focus, mealIndex, totalMeals, basketNames, previousMeals } =
    args;
  const day = DAY_NAMES[mealIndex] ?? `Meal ${mealIndex + 1}`;
  const boxIngredients = getBoxIngredients();
  const intent = buildMealIntent(
    mood,
    focus,
    mealIndex,
    totalMeals,
    boxIngredients,
  );

  const items = dedupeStrings([
    "Weekly Produce Box",
    intent.anchorVeg,
    ...(intent.optionalVeg ? [intent.optionalVeg] : []),
    ...intent.supportVeg,
    ...intent.shopBaseOptions,
    ...intent.shopBoostOptions,
    ...basketNames,
  ]).slice(0, 20);

  const previousRecipes = previousMeals.map((meal) => ({
    title: meal.title,
    description: meal.description,
    ingredientsUsed: meal.ingredients,
  }));

  const response = await fetch("/api/recipe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      items,
      quickStart: getQuickStartForMood(mood),
      preferences: [],
      previousRecipes,
      weekPlanContext: {
        mode: "plan-week",
        mealIndex,
        totalMeals,
        includeMeatIdeas: false,
        previousRecipes,
        familyKey: intent.familyKey,
        familyLabel: intent.familyLabel,
        anchorVeg: intent.anchorVeg,
        optionalVeg: intent.optionalVeg,
        supportVeg: intent.supportVeg,
        everydayBaseOptions: intent.everydayBaseOptions,
        shopBaseOptions: intent.shopBaseOptions,
        shopBoostOptions: intent.shopBoostOptions,
        flavourDirection: intent.flavourDirection,
        flavourNotes: intent.flavourNotes,
      },
      plannerIntent: intent,
    }),
  });

  const data = (await response.json()) as RecipeResponse;

  if (!response.ok || !data.recipe) {
    return fallbackMeal(day, mealIndex);
  }

  return {
    id: `${day}-${data.recipe.title}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`,
    day,
    title: data.recipe.title,
    description: data.recipe.description,
    imageUrl: data.imageUrl ?? null,
    imageError: data.debug?.imageError ?? null,
    ingredients: data.recipe.ingredientsUsed,
    matchedProducts: matchedProductsForRecipe(data.recipe),
    steps: data.recipe.steps,
  } satisfies PlannedMeal;
}

export default function PlannerPage() {
  const { groupedCart, addToCart } = useCart();

  const [step, setStep] = useState<PlannerStep>("choices");
  const [nights, setNights] = useState(4);
  const [mood, setMood] = useState<WeekMood>("balanced");
  const [focus, setFocus] = useState<WeekFocus | null>(null);
  const [loadingIndex, setLoadingIndex] = useState(0);
  const [week, setWeek] = useState<PlannedMeal[]>([]);
  const [openDay, setOpenDay] = useState<string | null>(null);
  const [plannerError, setPlannerError] = useState("");

  const totalBasketItems = useMemo(
    () => groupedCart.reduce((sum, entry) => sum + entry.quantity, 0),
    [groupedCart],
  );

  const basketNames = useMemo(
    () => groupedCart.map((entry) => entry.item.name),
    [groupedCart],
  );

  const hasProduceBox = useMemo(
    () =>
      basketNames.some((name) => name.toLowerCase().includes("produce box")),
    [basketNames],
  );

  const weeklyProduceBox =
    produceBoxes.find((item) => item.name === "Weekly Produce Box") ??
    produceBoxes[0] ??
    null;

  const familyProduceBox =
    produceBoxes.find((item) => item.name === "Family Produce Box") ??
    produceBoxes.find((item) => item.name !== weeklyProduceBox?.name) ??
    null;

  const recommendedAddOns = useMemo(() => {
    const names = new Set<string>();

    week.forEach((meal) => {
      meal.matchedProducts.forEach((productName) => names.add(productName));
    });

    const allAddOns = [...pantryItems, ...cupboardItems];
    return allAddOns.filter((item) => names.has(item.name)).slice(0, 6);
  }, [week]);

  const fromBoxIngredients = useMemo(() => {
    const ingredientSet = new Set<string>();
    week.forEach((meal) => {
      meal.ingredients.forEach((ingredient) => {
        const lower = ingredient.toLowerCase();
        if (
          [
            "carrots",
            "potatoes",
            "greens",
            "tomatoes",
            "peppers",
            "courgette",
            "mushrooms",
            "roots",
            "squash",
            "cauliflower",
            "beetroot",
            "broccoli",
            "spinach",
          ].includes(lower)
        ) {
          ingredientSet.add(ingredient);
        }
      });
    });
    return Array.from(ingredientSet);
  }, [week]);

  async function buildAiWeek() {
    setStep("building");
    setLoadingIndex(0);
    setPlannerError("");
    setWeek([]);

    const loadingTimer = window.setInterval(() => {
      setLoadingIndex((current) => {
        if (current >= LOADING_MESSAGES.length - 1) return current;
        return current + 1;
      });
    }, 1800);

    try {
      const builtMeals: PlannedMeal[] = [];

      for (let index = 0; index < nights; index += 1) {
        setLoadingIndex(Math.min(index, LOADING_MESSAGES.length - 1));

        const meal = await generatePlannerMeal({
          mood,
          focus,
          mealIndex: index,
          totalMeals: nights,
          basketNames,
          previousMeals: builtMeals,
        });

        builtMeals.push(meal);
        setWeek([...builtMeals]);
      }

      setOpenDay(builtMeals[0]?.id ?? null);
      setStep("results");
    } catch {
      setPlannerError("Something went wrong while building your week.");
      setStep("choices");
    } finally {
      window.clearInterval(loadingTimer);
    }
  }

  function handleBuildWeek() {
    void buildAiWeek();
  }

  async function handleSwapDay(dayId: string) {
    const mealIndex = week.findIndex((meal) => meal.id === dayId);
    if (mealIndex < 0) return;

    const previousMeals = week.filter((meal) => meal.id !== dayId);
    const replacement = await generatePlannerMeal({
      mood,
      focus,
      mealIndex,
      totalMeals: nights,
      basketNames,
      previousMeals,
    });

    setWeek((current) =>
      current.map((meal) => (meal.id === dayId ? replacement : meal)),
    );
    setOpenDay(replacement.id);
  }

  function addProductByName(productName: string) {
    const product = [...produceBoxes, ...pantryItems, ...cupboardItems].find(
      (item) => item.name === productName,
    );

    if (!product) return;

    addToCart({
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      checkoutType: product.checkoutType,
    });
  }

  function addAllAddOns() {
    recommendedAddOns.forEach((item) => {
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
      <section className="border-b border-[rgba(230,221,210,0.86)] px-4 pb-6 pt-5 sm:px-6 md:px-10 md:pb-8 md:pt-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 flex items-center justify-between border-b border-[rgba(221,212,200,0.9)] pb-4">
            <Link href="/" className="text-sm tracking-[0.35em] text-[#60705f]">
              THE LOCAL PANTRY
            </Link>

            <div className="flex items-center gap-3">
              <Link href="/shop" className="text-sm text-[#5f675c]">
                Shop
              </Link>
              <Link href="/basket" className="text-sm text-[#243328]">
                Basket{totalBasketItems > 0 ? ` (${totalBasketItems})` : ""}
              </Link>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
            <article className="rounded-[28px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.84)] p-5 shadow-[0_12px_30px_rgba(36,51,40,0.06)] md:p-7">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#6b776c]">
                Weekly planner
              </p>

              <h1 className="mt-3 max-w-3xl font-serif text-[2rem] leading-[1.02] tracking-tight text-[#243328] md:text-[3.35rem]">
                Plan your week
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#5f675c] md:text-base">
                A few quick choices, then we’ll build your meals for the week
                ahead using the AI recipe generator.
              </p>

              {plannerError ? (
                <div className="mt-5 rounded-[18px] border border-[#e4d8cb] bg-[#fbf6f0] px-4 py-3 text-sm text-[#6a5c4f]">
                  {plannerError}
                </div>
              ) : null}

              {step === "choices" ? (
                <div className="mt-8 space-y-7">
                  <div>
                    <p className="mb-3 text-sm font-medium text-[#243328]">
                      How many nights?
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[3, 4, 5, 6].map((value) => (
                        <ChoiceChip
                          key={value}
                          active={nights === value}
                          label={`${value} nights`}
                          onClick={() => setNights(value)}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-3 text-sm font-medium text-[#243328]">
                      What kind of week?
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <ChoiceChip
                        active={mood === "quick"}
                        label="Quick & easy"
                        onClick={() => setMood("quick")}
                      />
                      <ChoiceChip
                        active={mood === "balanced"}
                        label="Balanced"
                        onClick={() => setMood("balanced")}
                      />
                      <ChoiceChip
                        active={mood === "comforting"}
                        label="Comforting"
                        onClick={() => setMood("comforting")}
                      />
                    </div>
                  </div>

                  <div>
                    <p className="mb-3 text-sm font-medium text-[#243328]">
                      Anything to lean into?
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <ChoiceChip
                        active={focus === "veg-heavy"}
                        label="Veg-heavy"
                        onClick={() =>
                          setFocus((current) =>
                            current === "veg-heavy" ? null : "veg-heavy",
                          )
                        }
                      />
                      <ChoiceChip
                        active={focus === "low-waste"}
                        label="Low waste"
                        onClick={() =>
                          setFocus((current) =>
                            current === "low-waste" ? null : "low-waste",
                          )
                        }
                      />
                      <ChoiceChip
                        active={focus === "family-friendly"}
                        label="Family-friendly"
                        onClick={() =>
                          setFocus((current) =>
                            current === "family-friendly"
                              ? null
                              : "family-friendly",
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-1">
                    <button
                      type="button"
                      onClick={handleBuildWeek}
                      className="rounded-full bg-[#243328] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
                    >
                      Build my week
                    </button>

                    <Link
                      href="/shop"
                      className="rounded-full border border-[#d6cec2] bg-white/80 px-5 py-3 text-sm text-[#243328] transition hover:bg-white"
                    >
                      Browse the shop
                    </Link>
                  </div>
                </div>
              ) : step === "building" ? (
                <div className="mt-8 rounded-[22px] border border-[#e1d8cc] bg-white/72 p-6">
                  <p className="text-sm uppercase tracking-[0.18em] text-[#6b776c]">
                    Building your week
                  </p>

                  <h2 className="mt-2 font-serif text-[1.6rem] leading-tight text-[#243328]">
                    {LOADING_MESSAGES[loadingIndex]}
                  </h2>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-[#667164]">
                    This planner now calls the recipe API for each meal, so the
                    images come from the same generator as the shop page.
                  </p>

                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-[rgba(221,212,200,0.95)]">
                    <div
                      className="h-full rounded-full bg-[#243328] transition-all duration-700"
                      style={{
                        width: `${((loadingIndex + 1) / LOADING_MESSAGES.length) * 100}%`,
                      }}
                    />
                  </div>

                  {week.length > 0 ? (
                    <p className="mt-4 text-sm text-[#667164]">
                      Built {week.length} of {nights} meals.
                    </p>
                  ) : null}
                </div>
              ) : (
                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setStep("choices")}
                    className="rounded-full bg-[#243328] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
                  >
                    Plan another week
                  </button>
                  <Link
                    href="/basket"
                    className="rounded-full border border-[#d6cec2] bg-white/80 px-5 py-3 text-sm text-[#243328] transition hover:bg-white"
                  >
                    Review basket
                  </Link>
                </div>
              )}
            </article>

            <article className="overflow-hidden rounded-[28px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.86)] shadow-[0_10px_24px_rgba(36,51,40,0.05)]">
              <div className="relative min-h-[280px]">
                <img
                  src="/hero.jpg"
                  alt="The Local Pantry planner"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.28)_52%,rgba(0,0,0,0.42)_100%)]" />
                <div className="relative z-10 flex min-h-[280px] items-end p-6 text-white md:p-7">
                  <div className="max-w-md">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/80">
                      Food first
                    </p>
                    <h2 className="mt-2 font-serif text-[1.9rem] leading-tight md:text-[2.35rem]">
                      A full week that still feels good to cook
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-white/86">
                      The planner should look useful before you cook, and become
                      more useful once you are actually in the kitchen.
                    </p>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {step === "results" ? (
        <>
          <section className="px-4 py-8 sm:px-6 md:px-10 md:py-10">
            <div className="mx-auto max-w-7xl">
              <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
                    Your week
                  </p>
                  <h2 className="mt-1 font-serif text-[2rem] leading-tight text-[#243328] md:text-[2.8rem]">
                    Your meals, already mapped out
                  </h2>
                </div>

                <p className="max-w-xl text-sm leading-6 text-[#667164]">
                  Open the steps when you need them. Leave them closed when you
                  just want to see the week at a glance.
                </p>
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                {week.map((meal) => {
                  const isOpen = openDay === meal.id;

                  return (
                    <article
                      key={meal.id}
                      className="overflow-hidden rounded-[26px] border border-[rgba(221,212,200,0.95)] bg-[rgba(255,255,255,0.86)] shadow-[0_10px_24px_rgba(36,51,40,0.05)]"
                    >
                      {meal.imageUrl ? (
                        <img
                          key={`${meal.id}-${meal.imageUrl.slice(0, 80)}`}
                          src={meal.imageUrl}
                          alt={meal.title}
                          className="h-56 w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-56 w-full items-center justify-center bg-[rgba(238,231,220,0.82)] p-5 text-center">
                          <div>
                            <p className="text-sm font-medium text-[#243328]">
                              Image did not generate
                            </p>
                            {meal.imageError ? (
                              <p className="mt-2 max-w-md break-words text-xs leading-5 text-[#6a5c4f]">
                                {meal.imageError}
                              </p>
                            ) : (
                              <p className="mt-2 text-xs leading-5 text-[#6a5c4f]">
                                The meal was generated, but the image API did
                                not return a usable image.
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="p-5 md:p-6">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] uppercase tracking-[0.16em] text-[#6b776c]">
                              {meal.day}
                            </p>
                            <h3 className="mt-1 font-serif text-[1.55rem] leading-tight text-[#243328]">
                              {meal.title}
                            </h3>
                            <p className="mt-3 text-sm leading-6 text-[#667164]">
                              {meal.description}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => void handleSwapDay(meal.id)}
                            className="rounded-full border border-[#d6cec2] bg-[rgba(247,242,235,0.84)] px-3.5 py-1.5 text-xs font-medium text-[#243328] transition hover:bg-white"
                          >
                            Swap
                          </button>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {meal.ingredients.map((ingredient) => (
                            <span
                              key={`${meal.id}-${ingredient}`}
                              className="rounded-full border border-[#ddd4c8] bg-[rgba(247,242,235,0.82)] px-3 py-1.5 text-xs font-medium text-[#4f5e52]"
                            >
                              {ingredient}
                            </span>
                          ))}
                        </div>

                        <div className="mt-5 rounded-[20px] border border-[#e6ddd2] bg-[rgba(249,246,241,0.78)] p-4">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenDay((current) =>
                                current === meal.id ? null : meal.id,
                              )
                            }
                            className="flex w-full items-center justify-between gap-4 text-left"
                          >
                            <span className="text-sm font-medium text-[#243328]">
                              Cooking steps
                            </span>
                            <span className="text-xs text-[#5f675c]">
                              {isOpen ? "Hide" : "Show"}
                            </span>
                          </button>

                          {isOpen ? (
                            <ol className="mt-4 space-y-2.5 text-sm leading-6 text-[#5f675c]">
                              {meal.steps.map((stepText, index) => (
                                <li
                                  key={`${meal.id}-step-${index}`}
                                  className="flex items-start gap-3"
                                >
                                  <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#d6cec2] text-[10px] text-[#243328]">
                                    {index + 1}
                                  </span>
                                  <span>{stepText}</span>
                                </li>
                              ))}
                            </ol>
                          ) : null}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="border-t border-[rgba(230,221,210,0.86)] px-4 py-8 sm:px-6 md:px-10 md:py-10">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-4 lg:grid-cols-[0.96fr_1.04fr]">
                <article className="rounded-[24px] border border-[rgba(221,212,200,0.95)] bg-[rgba(255,255,255,0.84)] p-5 shadow-[0_10px_24px_rgba(36,51,40,0.05)] md:p-6">
                  {!hasProduceBox ? (
                    <>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-[#6b776c]">
                        Start your week
                      </p>
                      <h2 className="mt-1 font-serif text-[1.65rem] leading-tight text-[#243328]">
                        Add a veg box to make the week work
                      </h2>
                      <p className="mt-3 text-sm leading-6 text-[#5f675c]">
                        The produce box gives the week its base. Then the rest
                        of the plan can sit on top of it naturally.
                      </p>

                      <div className="mt-5 grid gap-4">
                        {weeklyProduceBox
                          ? compactCardItem(weeklyProduceBox, () =>
                              addProductByName(weeklyProduceBox.name),
                            )
                          : null}

                        {familyProduceBox
                          ? compactCardItem(familyProduceBox, () =>
                              addProductByName(familyProduceBox.name),
                            )
                          : null}
                      </div>

                      <p className="mt-5 text-sm text-[#667164]">
                        Then add the rest of this week to your basket.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-[#6b776c]">
                        Your shop is ready
                      </p>
                      <h2 className="mt-1 font-serif text-[1.65rem] leading-tight text-[#243328]">
                        Add the rest of this week to your basket
                      </h2>
                      <p className="mt-3 text-sm leading-6 text-[#5f675c]">
                        Your produce box is already doing the base work. These
                        are the pantry adds that fit the plan best.
                      </p>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {fromBoxIngredients.map((item) => (
                          <span
                            key={`from-box-${item}`}
                            className="rounded-full border border-[#ddd4c8] bg-[rgba(247,242,235,0.82)] px-3 py-1.5 text-xs font-medium text-[#4f5e52]"
                          >
                            {item}
                          </span>
                        ))}
                      </div>

                      <div className="mt-6 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={addAllAddOns}
                          className="rounded-full bg-[#243328] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
                        >
                          Add this week to my basket
                        </button>

                        <Link
                          href="/basket"
                          className="rounded-full border border-[#d6cec2] bg-[rgba(247,242,235,0.88)] px-5 py-3 text-sm text-[#243328] transition hover:bg-white"
                        >
                          Review basket
                        </Link>
                      </div>
                    </>
                  )}
                </article>

                <article className="rounded-[24px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.84)] p-5 shadow-[0_10px_24px_rgba(36,51,40,0.05)] md:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-[#6b776c]">
                        Pantry adds
                      </p>
                      <h2 className="mt-1 font-serif text-[1.65rem] leading-tight text-[#243328]">
                        A few good things that fit this plan
                      </h2>
                    </div>

                    {recommendedAddOns.length > 0 ? (
                      <div className="rounded-full border border-[#ddd4c8] bg-white/75 px-3 py-1.5 text-xs text-[#4f5e52]">
                        {recommendedAddOns.length} picks
                      </div>
                    ) : null}
                  </div>

                  <p className="mt-3 text-sm leading-6 text-[#5f675c]">
                    Useful pantry pieces to help the week land properly, without
                    pretending the shop needs to be huge.
                  </p>

                  {recommendedAddOns.length > 0 ? (
                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      {recommendedAddOns.map((item) =>
                        compactCardItem(item, () =>
                          addProductByName(item.name),
                        ),
                      )}
                    </div>
                  ) : (
                    <p className="mt-5 text-sm text-[#667164]">
                      As you swap days and shape the week, the best matching
                      pantry pieces will show up here.
                    </p>
                  )}
                </article>
              </div>
            </div>
          </section>
        </>
      ) : null}
    </main>
  );
}
