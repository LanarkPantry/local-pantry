"use client";

import AccountNav from "../account-nav";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "../cart-context";
import {
  produceBoxes,
  pantryItems,
  cupboardItems,
  type ShopDisplayItem,
} from "../shop/shop-data";
import { getUser } from "../lib/authClient";
import { generateWeek, type PlannerStyle } from "../lib/planner";
import { getSwapOptions } from "../lib/getSwapOptions";
import { getPlannerInsights } from "../lib/getPlannerInsights";
import {
  getSavedRecipeSlugs,
  saveRecipeToRegulars,
} from "../lib/savedRegulars";
import { recipes, type Recipe } from "../recipes/recipes-data";
import { getSavedRecipes } from "../lib/getSavedRecipes";
import { generateRegularsWeek } from "../lib/generateRegularsWeek";
import { saveCookedRecipe } from "../lib/saveCookedRecipe";
import { getRecentlyCookedSlugs } from "../lib/getRecentlyCookedSlugs";
import { saveWeek } from "../lib/saveWeek";
import SiteHeader from "../components/SiteHeader";

type PlannerStep = "choices" | "results";

type EatingStyle =
  | "mixed"
  | "mostly-veggie"
  | "vegan"
  | "gluten-free"
  | "quick"
  | "my-regulars";

type PlannedMeal = {
  id: string;
  day: string;
  recipe: Recipe;
  recipeSlug: string;
  title: string;
  description: string;
  imageUrl: string | null;
  ingredients: string[];
  matchedProducts: string[];
  steps: string[];
};

type ChoiceChipProps = {
  active: boolean;
  label: string;
  onClick: () => void;
};

const DAY_NAMES = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

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
    <div className="rounded-[20px] border border-[#e4dbcf] bg-white/88 p-4 shadow-[0_8px_18px_rgba(36,51,40,0.04)]">
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

function buildCookingSteps(body: string) {
  return body
    .split(". ")
    .map((step) => step.trim())
    .filter(Boolean)
    .map((step) => (step.endsWith(".") ? step : `${step}.`));
}

function recipeToPlannedMeal(
  recipe: Recipe,
  index: number,
  existingDay?: string,
) {
  return {
    id: `${recipe.slug}-${index}`,
    day: existingDay ?? DAY_NAMES[index] ?? `Meal ${index + 1}`,
    recipe,
    recipeSlug: recipe.slug,
    title: recipe.title,
    description: recipe.intro,
    imageUrl: recipe.image,
    ingredients: recipe.mainIngredients,
    matchedProducts: recipe.pantryMatches,
    steps: buildCookingSteps(recipe.body),
  };
}

function getStyleLabel(style: EatingStyle) {
  switch (style) {
    case "mixed":
      return "Mixed week";
    case "mostly-veggie":
      return "Mostly veggie week";
    case "vegan":
      return "Vegan week";
    case "gluten-free":
      return "Gluten-free friendly week";
    case "quick":
      return "Quick dinners";
    case "my-regulars":
      return "My Regulars week";
    default:
      return "Weekly plan";
  }
}

export default function PlannerPage() {
  const { groupedCart, addToCart } = useCart();
  const swapSectionRef = useRef<HTMLElement | null>(null);

  const [step, setStep] = useState<PlannerStep>("choices");
  const [nights, setNights] = useState(5);
  const [eatingStyle, setEatingStyle] = useState<EatingStyle>("mixed");
  const [week, setWeek] = useState<PlannedMeal[]>([]);
  const [openDay, setOpenDay] = useState<string | null>(null);
  const [swapMealId, setSwapMealId] = useState<string | null>(null);
  const [plannerError, setPlannerError] = useState("");
  const [regularsMessage, setRegularsMessage] = useState("");
  const [savedRecipeSlugs, setSavedRecipeSlugs] = useState<string[]>([]);
  const [savingRecipeSlug, setSavingRecipeSlug] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    async function checkUser() {
      const user = await getUser();
      const signedIn = Boolean(user);

      setIsLoggedIn(signedIn);
      setAuthChecked(true);

      if (signedIn) {
        const { slugs } = await getSavedRecipeSlugs();
        setSavedRecipeSlugs(slugs);
      }
    }

    void checkUser();
  }, []);

  useEffect(() => {
    const savedWeekPayload = window.localStorage.getItem(
      "local-pantry-loaded-week",
    );

    if (!savedWeekPayload) {
      return;
    }

    try {
      const parsed = JSON.parse(savedWeekPayload) as {
        name?: string;
        meals?: {
          day: string;
          recipeSlug: string;
        }[];
      };

      const loadedMeals: PlannedMeal[] = (parsed.meals ?? []).flatMap(
        (meal, index) => {
          const recipe = recipes.find((item) => item.slug === meal.recipeSlug);

          if (!recipe) {
            return [];
          }

          return [recipeToPlannedMeal(recipe, index, meal.day)];
        },
      );

      if (loadedMeals.length > 0) {
        setWeek(loadedMeals);
        setNights(loadedMeals.length);
        setStep("results");
        setOpenDay(null);
        setSwapMealId(null);
        setPlannerError("");
        setRegularsMessage(
          parsed.name
            ? `${parsed.name} loaded into your planner.`
            : "Saved week loaded into your planner.",
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      window.localStorage.removeItem("local-pantry-loaded-week");
    }
  }, []);

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
    produceBoxes[0];

  const familyProduceBox =
    produceBoxes.find((item) => item.name === "Family Produce Box") ??
    produceBoxes[1];

  const currentWeekSlugs = useMemo(
    () => week.map((meal) => meal.recipeSlug),
    [week],
  );

  const selectedSwapMeal = useMemo(
    () => week.find((meal) => meal.id === swapMealId) ?? null,
    [swapMealId, week],
  );

  const swapOptions = useMemo(() => {
    if (!selectedSwapMeal) return [];

    return getSwapOptions({
      currentRecipe: selectedSwapMeal.recipe,
      allRecipes: recipes,
      currentWeekSlugs,
    });
  }, [currentWeekSlugs, selectedSwapMeal]);

  const plannerInsights = useMemo(
    () => getPlannerInsights(week.map((meal) => meal.recipe)),
    [week],
  );

  const recommendedAddOns = useMemo(() => {
    const names = new Set<string>();

    week.forEach((meal) => {
      meal.matchedProducts.forEach((productName) => names.add(productName));
    });

    const allAddOns = [...pantryItems, ...cupboardItems];

    return allAddOns.filter((item) => names.has(item.name)).slice(0, 6);
  }, [week]);

  async function handleBuildWeek() {
    setPlannerError("");
    setSwapMealId(null);

    let generatedRecipes: Recipe[] = [];
    const recentlyCookedSlugs = await getRecentlyCookedSlugs(14);

    if (eatingStyle === "my-regulars") {
      const regularRecipes = await getSavedRecipes();

      generatedRecipes = generateRegularsWeek({
        regularRecipes: regularRecipes.filter(
          (recipe) => !recentlyCookedSlugs.includes(recipe.slug),
        ),
        mealCount: nights,
      });
    } else {
      generatedRecipes = generateWeek(eatingStyle as PlannerStyle)
        .filter((recipe) => !recentlyCookedSlugs.includes(recipe.slug))
        .slice(0, nights);
    }

    if (generatedRecipes.length === 0) {
      setPlannerError(
        "No meals matched that choice yet. Try Mixed, Mostly veggie, or Quick dinners while more recipes are being tagged.",
      );
      return;
    }

    const plannedWeek: PlannedMeal[] = generatedRecipes.map((recipe, index) =>
      recipeToPlannedMeal(recipe, index),
    );

    setWeek(plannedWeek);
    setOpenDay(null);
    setStep("results");
  }

  function handleOpenSwapOptions(mealId: string) {
    setSwapMealId((current) => (current === mealId ? null : mealId));

    window.setTimeout(() => {
      swapSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
  }

  async function handleSaveToRegulars(recipe: Recipe) {
    setRegularsMessage("");

    if (!isLoggedIn) {
      setRegularsMessage(
        "Sign in or create an account to save meals to My Regulars.",
      );
      return;
    }

    setSavingRecipeSlug(recipe.slug);

    const result = await saveRecipeToRegulars(recipe);

    setSavingRecipeSlug(null);

    if (!result.success) {
      setRegularsMessage(result.error ?? "Could not save this meal yet.");
      return;
    }

    setSavedRecipeSlugs((current) =>
      current.includes(recipe.slug) ? current : [...current, recipe.slug],
    );
    setRegularsMessage(`${recipe.title} saved to My Regulars.`);
  }

  function handleSwapMeal(replacementRecipe: Recipe) {
    if (!selectedSwapMeal) return;

    setWeek((currentWeek) =>
      currentWeek.map((meal, index) => {
        if (meal.id !== selectedSwapMeal.id) {
          return meal;
        }

        return recipeToPlannedMeal(replacementRecipe, index, meal.day);
      }),
    );

    setOpenDay(null);
    setSwapMealId(null);
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

  function addDisplayItem(item: ShopDisplayItem) {
    addToCart({
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
      checkoutType: item.checkoutType,
    });
  }

  function addAllAddOns() {
    recommendedAddOns.forEach((item) => addDisplayItem(item));
  }
  async function handleCookedThis(recipeSlug: string) {
    const result = await saveCookedRecipe(recipeSlug);

    if (!result.success) {
      console.error(result.error);
      return;
    }

    alert("Saved to recently cooked.");
  }

  async function handleSaveWeek() {
    const result = await saveWeek({
      name: `${getStyleLabel(eatingStyle)} ${new Date().toLocaleDateString()}`,
      plannerStyle: eatingStyle,
      nights,
      meals: week.map((meal) => ({
        day: meal.day,
        recipeSlug: meal.recipeSlug,
      })),
    });

    if (!result.success) {
      console.error(result.error);
      return;
    }

    alert("Week saved.");
  }
  return (
    <main className="min-h-screen bg-[#f4efe9] text-[#243328]">
      <SiteHeader />
      <section className="border-b border-[rgba(230,221,210,0.86)] px-4 pb-6 pt-5 sm:px-6 md:px-10 md:pb-8 md:pt-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
            <article className="rounded-[28px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.84)] p-5 shadow-[0_12px_30px_rgba(36,51,40,0.06)] md:p-7">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#6b776c]">
                Weekly planner
              </p>

              <h1 className="mt-3 max-w-3xl font-serif text-[2rem] leading-[1.02] tracking-tight text-[#243328] md:text-[3.35rem]">
                Plan your week
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#5f675c] md:text-base">
                {isLoggedIn
                  ? "You are signed in. Preview a curated week while subscription access is being connected."
                  : "Try a curated preview week built from real recipes and seasonal produce."}
              </p>

              {plannerError ? (
                <div className="mt-5 rounded-[18px] border border-[#e4d8cb] bg-[#fbf6f0] px-4 py-3 text-sm text-[#6a5c4f]">
                  {plannerError}
                </div>
              ) : null}

              {regularsMessage ? (
                <div className="mt-5 rounded-[18px] border border-[#d8cbbd] bg-white/78 px-4 py-3 text-sm text-[#4f5e52]">
                  {regularsMessage}
                </div>
              ) : null}

              {step === "choices" ? (
                <div className="mt-8 space-y-7">
                  <div>
                    <p className="mb-3 text-sm font-medium text-[#243328]">
                      How many nights?
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {[3, 4, 5, 6, 7].map((value) => (
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
                        active={eatingStyle === "mixed"}
                        label="Mixed"
                        onClick={() => setEatingStyle("mixed")}
                      />

                      <ChoiceChip
                        active={eatingStyle === "mostly-veggie"}
                        label="Mostly veggie"
                        onClick={() => setEatingStyle("mostly-veggie")}
                      />

                      <ChoiceChip
                        active={eatingStyle === "vegan"}
                        label="Vegan"
                        onClick={() => setEatingStyle("vegan")}
                      />

                      <ChoiceChip
                        active={eatingStyle === "gluten-free"}
                        label="Gluten-free"
                        onClick={() => setEatingStyle("gluten-free")}
                      />

                      <ChoiceChip
                        active={eatingStyle === "quick"}
                        label="Quick dinners"
                        onClick={() => setEatingStyle("quick")}
                      />

                      <ChoiceChip
                        active={eatingStyle === "my-regulars"}
                        label="My regulars"
                        onClick={() => setEatingStyle("my-regulars")}
                      />
                    </div>

                    <p className="mt-3 max-w-2xl text-xs leading-5 text-[#667164]">
                      This uses your saved recipe library rather than expensive
                      live recipe generation. It keeps the planner useful,
                      predictable and affordable to run.
                    </p>
                  </div>

                  <div className="rounded-[22px] border border-[#ddd4c8] bg-white/65 p-4">
                    <p className="text-sm font-medium text-[#243328]">
                      This is a curated preview
                    </p>

                    <p className="mt-2 text-sm leading-6 text-[#667164]">
                      The full subscriber planner will include swaps, saved
                      weeks, My Regulars and basket-aware planning.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-1">
                    <button
                      type="button"
                      onClick={handleBuildWeek}
                      disabled={!authChecked}
                      className="rounded-full bg-[#243328] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {authChecked ? "Preview my week" : "Checking account..."}
                    </button>

                    <Link
                      href="/shop"
                      className="rounded-full border border-[#d6cec2] bg-white/80 px-5 py-3 text-sm text-[#243328] transition hover:bg-white"
                    >
                      Browse the shop
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("choices");
                      setSwapMealId(null);
                    }}
                    className="rounded-full bg-[#243328] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
                  >
                    Preview another week
                  </button>

                  <Link
                    href="/shop"
                    className="rounded-full border border-[#d6cec2] bg-white/80 px-5 py-3 text-sm text-[#243328] transition hover:bg-white"
                  >
                    Browse the shop
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
                      A veg box that comes with a plan: meals, pantry ideas and
                      a calmer way to organise the week.
                    </p>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {step === "results" ? (
        <section className="px-4 py-8 sm:px-6 md:px-10 md:py-10">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 rounded-[24px] border border-[#ddd4c8] bg-[rgba(255,255,255,0.86)] p-5 shadow-[0_10px_24px_rgba(36,51,40,0.05)] md:p-6">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
                Planner preview
              </p>

              <h3 className="mt-2 font-serif text-2xl text-[#243328]">
                {getStyleLabel(eatingStyle)}
              </h3>

              <p className="mt-3 max-w-3xl text-sm leading-6 text-[#5f675c]">
                {isLoggedIn
                  ? "You are signed in. This planner avoids meals you have marked as cooked in the last 14 days."
                  : "This is a curated sample week. The full adjustable planner is included with a weekly veg box subscription."}
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href="/shop"
                  className="rounded-full bg-[#243328] px-5 py-2.5 text-sm text-white transition hover:opacity-90"
                >
                  {isLoggedIn
                    ? "Choose a weekly veg box"
                    : "Start a weekly veg box"}
                </Link>

                <button
                  type="button"
                  onClick={handleSaveWeek}
                  disabled={!isLoggedIn || week.length === 0}
                  className="rounded-full border border-[#d6cec2] bg-white/80 px-5 py-2.5 text-sm text-[#243328] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Save this week
                </button>

                <Link
                  href="/saved-weeks"
                  className="rounded-full border border-[#d6cec2] bg-white/80 px-5 py-2.5 text-sm text-[#243328] transition hover:bg-white"
                >
                  View saved weeks
                </Link>

                {!isLoggedIn ? (
                  <Link
                    href="/login"
                    className="rounded-full border border-[#d6cec2] bg-white/80 px-5 py-2.5 text-sm text-[#243328] transition hover:bg-white"
                  >
                    Create account
                  </Link>
                ) : null}
              </div>
            </div>

            {!hasProduceBox ? (
              <div className="mb-6 rounded-[24px] border border-[#ddd4c8] bg-[rgba(247,242,235,0.86)] p-5 shadow-[0_10px_24px_rgba(36,51,40,0.04)] md:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
                      Start with the box
                    </p>

                    <h3 className="mt-2 font-serif text-2xl text-[#243328]">
                      Add a weekly produce box as your base
                    </h3>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[#667164]">
                      The planner works best when the produce box gives the week
                      its starting point.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {weeklyProduceBox ? (
                      <button
                        type="button"
                        onClick={() => addDisplayItem(weeklyProduceBox)}
                        className="rounded-full bg-[#243328] px-5 py-2.5 text-sm text-white transition hover:opacity-90"
                      >
                        Add weekly box
                      </button>
                    ) : null}

                    {familyProduceBox ? (
                      <button
                        type="button"
                        onClick={() => addDisplayItem(familyProduceBox)}
                        className="rounded-full border border-[#d6cec2] bg-white/80 px-5 py-2.5 text-sm text-[#243328] transition hover:bg-white"
                      >
                        Add family box
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}

            {selectedSwapMeal ? (
              <section
                ref={swapSectionRef}
                className="scroll-mt-6 mb-6 rounded-[26px] border border-[#d8cbbd] bg-[#fbf6f0] p-5 shadow-[0_12px_28px_rgba(36,51,40,0.06)] md:p-6"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
                      Swap meal
                    </p>

                    <h3 className="mt-2 font-serif text-2xl text-[#243328]">
                      Swap {selectedSwapMeal.day}: {selectedSwapMeal.title}
                    </h3>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[#667164]">
                      These options keep the same meal style, avoid duplicates,
                      stay close on effort, and move the flavour in a different
                      direction.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSwapMealId(null)}
                    className="rounded-full border border-[#d6cec2] bg-white/80 px-4 py-2 text-sm text-[#243328] transition hover:bg-white"
                  >
                    Close
                  </button>
                </div>

                {swapOptions.length > 0 ? (
                  <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {swapOptions.map((recipe) => (
                      <article
                        key={recipe.slug}
                        className="overflow-hidden rounded-[22px] border border-[#e2d8cc] bg-white/88 shadow-[0_8px_20px_rgba(36,51,40,0.04)]"
                      >
                        <img
                          src={recipe.image}
                          alt={recipe.alt}
                          className="h-36 w-full object-cover"
                        />

                        <div className="p-4">
                          <div className="flex flex-wrap gap-1.5">
                            <span className="rounded-full bg-[#f4efe9] px-2.5 py-1 text-[11px] text-[#5f675c]">
                              {recipe.time}
                            </span>

                            <span className="rounded-full bg-[#f4efe9] px-2.5 py-1 text-[11px] text-[#5f675c]">
                              {recipe.mealType.replace("-", " ")}
                            </span>
                          </div>

                          <h4 className="mt-3 font-serif text-xl leading-tight text-[#243328]">
                            {recipe.title}
                          </h4>

                          <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#667164]">
                            {recipe.intro}
                          </p>

                          <button
                            type="button"
                            onClick={() => handleSwapMeal(recipe)}
                            className="mt-4 w-full rounded-full bg-[#243328] px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
                          >
                            Choose this meal
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="mt-5 rounded-[20px] border border-[#e4d8cb] bg-white/72 p-4 text-sm leading-6 text-[#667164]">
                    No suitable swaps found yet for this meal. Add more recipes
                    with the same meal type and dietary style to improve this.
                  </div>
                )}
              </section>
            ) : null}

            <div className="grid gap-5 lg:grid-cols-2">
              {week.map((meal) => {
                const isOpen = openDay === meal.id;
                const isSwapActive = swapMealId === meal.id;

                return (
                  <article
                    key={meal.id}
                    className={`overflow-hidden rounded-[26px] border bg-[rgba(255,255,255,0.86)] shadow-[0_10px_24px_rgba(36,51,40,0.05)] ${
                      isSwapActive
                        ? "border-[#b8a58f] ring-2 ring-[#d8cbbd]"
                        : "border-[rgba(221,212,200,0.95)]"
                    }`}
                  >
                    <img
                      src={meal.imageUrl ?? ""}
                      alt={meal.title}
                      className="h-56 w-full object-cover"
                    />

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

                        <div className="flex shrink-0 flex-col gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenSwapOptions(meal.id)}
                            className="rounded-full border border-[#d6cec2] bg-[#243328] px-3.5 py-1.5 text-xs font-medium text-white transition hover:opacity-90"
                          >
                            Swap meal
                          </button>

                          <button
                            type="button"
                            onClick={() => handleSaveToRegulars(meal.recipe)}
                            disabled={
                              savingRecipeSlug === meal.recipeSlug ||
                              savedRecipeSlugs.includes(meal.recipeSlug)
                            }
                            className="rounded-full border border-[#d6cec2] bg-[rgba(247,242,235,0.84)] px-3.5 py-1.5 text-xs font-medium text-[#243328] transition hover:bg-white disabled:cursor-default disabled:opacity-70"
                          >
                            {savingRecipeSlug === meal.recipeSlug
                              ? "Saving..."
                              : savedRecipeSlugs.includes(meal.recipeSlug)
                                ? "Saved"
                                : "Save to My Regulars"}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCookedThis(meal.recipeSlug)}
                            className="rounded-full border border-[#d6cec2] bg-white/80 px-3.5 py-1.5 text-xs font-medium text-[#243328] transition hover:bg-white"
                          >
                            Cooked this
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {meal.ingredients.map((ingredient) => (
                          <span
                            key={ingredient}
                            className="rounded-full border border-[#ddd4c8] bg-[rgba(247,242,235,0.82)] px-3 py-1.5 text-xs font-medium text-[#4f5e52]"
                          >
                            {ingredient}
                          </span>
                        ))}
                      </div>

                      {meal.matchedProducts.length > 0 ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {meal.matchedProducts.map((product) => (
                            <button
                              key={product}
                              type="button"
                              onClick={() => addProductByName(product)}
                              className="rounded-full border border-[#d6cec2] bg-white/80 px-3 py-1.5 text-xs font-medium text-[#243328] transition hover:bg-white"
                            >
                              Add {product}
                            </button>
                          ))}
                        </div>
                      ) : null}

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
                                key={index}
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

            {week.length > 0 ? (
              <section className="mt-8 rounded-[26px] border border-[#ddd4c8] bg-[rgba(255,255,255,0.88)] p-5 shadow-[0_10px_24px_rgba(36,51,40,0.04)] md:p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-3xl">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
                      Planner intelligence
                    </p>

                    <h3 className="mt-2 font-serif text-2xl text-[#243328]">
                      Why this week works
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-[#667164]">
                      The planner is reading the full week, not just individual
                      recipes. It looks for ingredient reuse, pantry efficiency,
                      meal variety and effort balance.
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-[#ded3c6] bg-[#f7f2eb] p-5 text-center shadow-[0_8px_18px_rgba(36,51,40,0.04)]">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-[#6b776c]">
                      Waste efficiency
                    </p>

                    <p className="mt-2 font-serif text-4xl text-[#243328]">
                      {plannerInsights.score}%
                    </p>

                    <p className="mt-1 text-xs text-[#667164]">
                      {plannerInsights.summary}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {plannerInsights.insights.map((insight) => (
                    <article
                      key={insight.label}
                      className="rounded-[22px] border border-[#e4dbcf] bg-[#fbf8f3] p-4"
                    >
                      <p className="text-sm font-medium text-[#243328]">
                        {insight.label}
                      </p>

                      <p className="mt-2 text-sm leading-6 text-[#667164]">
                        {insight.text}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            {recommendedAddOns.length > 0 ? (
              <section className="mt-8 rounded-[26px] border border-[#ddd4c8] bg-[rgba(247,242,235,0.86)] p-5 shadow-[0_10px_24px_rgba(36,51,40,0.04)] md:p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
                      Matched pantry extras
                    </p>

                    <h3 className="mt-2 font-serif text-2xl text-[#243328]">
                      Useful add-ons for this week
                    </h3>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[#667164]">
                      These are pulled from the meals in your plan so the basket
                      starts to build around what you are actually cooking.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addAllAddOns}
                    className="rounded-full bg-[#243328] px-5 py-2.5 text-sm text-white transition hover:opacity-90"
                  >
                    Add all suggested extras
                  </button>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {recommendedAddOns.map((item) =>
                    compactCardItem(item, () => addDisplayItem(item)),
                  )}
                </div>
              </section>
            ) : null}
          </div>
        </section>
      ) : null}
    </main>
  );
}
