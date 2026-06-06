"use client";

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
import SiteFooter from "../components/SiteFooter";

type PlannerStep = "choices" | "results";

type EatingStyle =
  | "mixed"
  | "mostly-veggie"
  | "vegan"
  | "gluten-free"
  | "quick"
  | "my-kitchen";

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
          ? "border-[#243328] bg-[#243328] text-white shadow-[0_8px_18px_rgba(36,51,40,0.12)]"
          : "border-[#d6cec2] bg-white/82 text-[#243328] hover:bg-white"
      }`}
    >
      {label}
    </button>
  );
}

function DayButton({
  active,
  value,
  onClick,
}: {
  active: boolean;
  value: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-12 w-12 items-center justify-center rounded-2xl border text-sm font-medium transition ${
        active
          ? "border-[#243328] bg-[#243328] text-white shadow-[0_8px_18px_rgba(36,51,40,0.12)]"
          : "border-[#d6cec2] bg-white/82 text-[#243328] hover:bg-white"
      }`}
    >
      {value}
    </button>
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
    case "my-kitchen":
      return "Saved favourites week";
    default:
      return "Weekly plan";
  }
}

function ProductPromptCard({
  item,
  eyebrow,
  onAdd,
}: {
  item: ShopDisplayItem;
  eyebrow: string;
  onAdd: () => void;
}) {
  return (
    <article className="overflow-hidden rounded-[26px] border border-[#ddd4c8] bg-white shadow-[0_14px_30px_rgba(36,51,40,0.06)]">
      <img
        src={item.image}
        alt={item.name}
        className="h-36 w-full object-cover sm:h-44"
      />

      <div className="p-5">
        <p className="text-[10px] uppercase tracking-[0.22em] text-[#7b846f]">
          {eyebrow}
        </p>

        <div className="mt-2 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl leading-tight text-[#243328]">
              {item.name}
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#667164]">
              {item.description}
            </p>
          </div>

          <p className="shrink-0 text-sm font-semibold text-[#243328]">
            £{item.price.toFixed(2)}
          </p>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="mt-5 w-full rounded-full bg-[#243328] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
        >
          Add to basket
        </button>
      </div>
    </article>
  );
}

function CompactShopCard({
  item,
  onAdd,
}: {
  item: ShopDisplayItem;
  onAdd: () => void;
}) {
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
  const [recentlyAddedItem, setRecentlyAddedItem] = useState<string | null>(
    null,
  );

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

    names.add("Vegetable Stock");

    const allAddOns = [...pantryItems, ...cupboardItems];

    return allAddOns.filter((item) => names.has(item.name)).slice(0, 4);
  }, [week]);

  async function handleBuildWeek() {
    setPlannerError("");
    setRegularsMessage("");
    setSwapMealId(null);

    const requestedNights = Math.min(Math.max(nights, 3), DAY_NAMES.length);
    const recentlyCookedSlugs = await getRecentlyCookedSlugs(14);

    let baseRecipes: Recipe[] = [];

    if (eatingStyle === "my-kitchen") {
      const regularRecipes = await getSavedRecipes();

      baseRecipes = generateRegularsWeek({
        regularRecipes,
        mealCount: requestedNights,
      });
    } else {
      baseRecipes = generateWeek(eatingStyle as PlannerStyle);
    }

    const selectedRecipes: Recipe[] = [];
    const selectedSlugs = new Set<string>();

    function addRecipe(recipe: Recipe) {
      if (selectedRecipes.length >= requestedNights) return;
      if (selectedSlugs.has(recipe.slug)) return;

      selectedRecipes.push(recipe);
      selectedSlugs.add(recipe.slug);
    }

    baseRecipes
      .filter((recipe) => !recentlyCookedSlugs.includes(recipe.slug))
      .forEach(addRecipe);

    if (selectedRecipes.length < requestedNights) {
      baseRecipes.forEach(addRecipe);
    }

    if (selectedRecipes.length < requestedNights) {
      recipes
        .filter((recipe) => !recentlyCookedSlugs.includes(recipe.slug))
        .forEach(addRecipe);
    }

    if (selectedRecipes.length < requestedNights) {
      recipes.forEach(addRecipe);
    }

    if (selectedRecipes.length === 0) {
      setPlannerError(
        "No meals matched that choice yet. Try Mixed, Mostly veggie, or Quick dinners while more recipes are being tagged.",
      );
      return;
    }

    if (selectedRecipes.length < requestedNights) {
      setRegularsMessage(
        `I found ${selectedRecipes.length} meal${
          selectedRecipes.length === 1 ? "" : "s"
        } for this choice. Add more recipes to create a fuller ${requestedNights}-night week.`,
      );
    }

    const plannedWeek: PlannedMeal[] = selectedRecipes.map((recipe, index) =>
      recipeToPlannedMeal(recipe, index),
    );

    setWeek(plannedWeek);
    setNights(plannedWeek.length);
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
        "Sign in or create an account to save meals to My Kitchen.",
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
    setRegularsMessage(`${recipe.title} saved to My Kitchen.`);
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

    showAddedFeedback(product.name);
  }

  function addDisplayItem(item: ShopDisplayItem) {
    addToCart({
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
      checkoutType: item.checkoutType,
    });

    showAddedFeedback(item.name);
  }

  function showAddedFeedback(itemName: string) {
    setRecentlyAddedItem(itemName);

    window.setTimeout(() => {
      setRecentlyAddedItem(null);
    }, 1200);
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

      {recentlyAddedItem ? (
        <div className="fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-full bg-[#243328] px-5 py-3 text-sm font-medium text-white shadow-[0_12px_30px_rgba(36,51,40,0.22)]">
          Added {recentlyAddedItem}
        </div>
      ) : null}

      <section className="px-4 pb-8 pt-4 sm:px-6 md:px-10 md:pb-12 md:pt-8">
        <div className="mx-auto max-w-7xl">
          {/* Mobile hero: simple image first, text underneath, no overlay */}
          <div className="md:hidden">
            <div className="overflow-hidden rounded-[26px] border border-[#ddd4c8] bg-[#efe6da] shadow-[0_12px_28px_rgba(36,51,40,0.08)]">
              <img
                src="/images/planner/planner-hero.jpg"
                alt="Meal planning with fresh produce, pantry jars and dry goods"
                className="h-52 w-full object-cover object-[62%_50%]"
              />
            </div>

            <div className="mt-5 px-1">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#6b776c]">
                Free meal planner
              </p>

              <h1 className="mt-2 font-serif text-4xl leading-[1.02] tracking-tight text-[#243328]">
                Turn your box into dinners.
              </h1>

              <p className="mt-3 text-sm leading-6 text-[#5f675c]">
                Choose your nights, pick your style and build a simple week of
                meals.
              </p>
            </div>
          </div>

          {/* Desktop hero: larger image with overlay card */}
          <div className="hidden overflow-hidden rounded-[32px] border border-[#ddd4c8] bg-[#efe6da] shadow-[0_16px_40px_rgba(36,51,40,0.08)] md:block">
            <div className="relative">
              <img
                src="/images/planner/planner-hero.jpg"
                alt="Meal planning with fresh produce, pantry jars and dry goods"
                className="h-[500px] w-full object-cover object-center lg:h-[540px]"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/10" />

              <div className="absolute bottom-6 left-6 max-w-xl rounded-[26px] border border-white/45 bg-[#f7f2eb]/92 p-6 shadow-[0_16px_38px_rgba(36,51,40,0.14)] backdrop-blur">
                <p className="text-[10px] uppercase tracking-[0.24em] text-[#6b776c]">
                  Free meal planner
                </p>

                <h1 className="mt-2 font-serif text-5xl leading-[1.02] tracking-tight text-[#243328]">
                  Turn your box into dinners.
                </h1>

                <p className="mt-3 text-base leading-7 text-[#5f675c]">
                  Choose your nights, pick your style and build a simple week of
                  meals around produce, pantry staples and food you will
                  actually cook.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
            <article className="rounded-[30px] border border-[#ddd4c8] bg-white/84 p-5 shadow-[0_12px_30px_rgba(36,51,40,0.06)] md:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#6b776c]">
                    Build your week
                  </p>

                  <h2 className="mt-2 font-serif text-3xl leading-tight text-[#243328]">
                    Start here
                  </h2>
                </div>

                <a
                  href="/shop"
                  className="hidden rounded-full border border-[#d6cec2] bg-[#f7f2eb] px-4 py-2 text-sm font-medium text-[#243328] transition hover:bg-white sm:inline-flex"
                >
                  Shop boxes
                </a>
              </div>

              <p className="mt-3 text-sm leading-6 text-[#667164]">
                No complicated planning. Just enough structure to make the week
                easier.
              </p>

              {!hasProduceBox ? (
                <div className="mt-5 rounded-[22px] border border-[#d8cbbd] bg-[#f7f2eb] p-4">
                  <p className="text-sm font-medium text-[#243328]">
                    Best with a produce box.
                  </p>

                  <p className="mt-2 text-sm leading-6 text-[#667164]">
                    Add a weekly or family box, then use the planner to turn it
                    into dinners and useful pantry extras.
                  </p>
                </div>
              ) : (
                <div className="mt-5 rounded-[22px] border border-[#cbd8ca] bg-[#f7f2eb] p-4">
                  <p className="text-sm font-medium text-[#243328]">
                    Produce box added.
                  </p>

                  <p className="mt-2 text-sm leading-6 text-[#667164]">
                    Now build a week around it and add only the pantry extras
                    you need.
                  </p>
                </div>
              )}

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
                <div className="mt-7 space-y-7">
                  <div>
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-[#243328]">
                        Nights to plan
                      </p>

                      <p className="text-xs text-[#7b846f]">Pick 3 to 7</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {[3, 4, 5, 6, 7].map((value) => (
                        <DayButton
                          key={value}
                          active={nights === value}
                          value={value}
                          onClick={() => setNights(value)}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-3 text-sm font-medium text-[#243328]">
                      Cooking style
                    </p>

                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
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
                        active={eatingStyle === "quick"}
                        label="Quick dinners"
                        onClick={() => setEatingStyle("quick")}
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
                        active={eatingStyle === "my-kitchen"}
                        label="Saved favourites"
                        onClick={() => setEatingStyle("my-kitchen")}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleBuildWeek}
                    disabled={!authChecked}
                    className="w-full rounded-full bg-[#243328] px-6 py-3.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {authChecked ? "Build my week" : "Checking account..."}
                  </button>

                  <a
                    href="/shop"
                    className="flex w-full justify-center rounded-full border border-[#d6cec2] bg-[#f7f2eb] px-6 py-3 text-sm font-medium text-[#243328] transition hover:bg-white sm:hidden"
                  >
                    Shop produce boxes
                  </a>
                </div>
              ) : (
                <div className="mt-7 grid gap-2 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("choices");
                      setSwapMealId(null);
                      setOpenDay(null);
                    }}
                    className="rounded-full border border-[#d6cec2] bg-white/78 px-5 py-2.5 text-sm font-medium text-[#243328] transition hover:bg-white"
                  >
                    Change choices
                  </button>

                  <button
                    type="button"
                    onClick={handleBuildWeek}
                    className="rounded-full bg-[#243328] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
                  >
                    Rebuild week
                  </button>

                  {isLoggedIn ? (
                    <button
                      type="button"
                      onClick={handleSaveWeek}
                      className="rounded-full border border-[#d6cec2] bg-white/78 px-5 py-2.5 text-sm font-medium text-[#243328] transition hover:bg-white"
                    >
                      Save week
                    </button>
                  ) : (
                    <a
                      href="/account"
                      className="rounded-full border border-[#d6cec2] bg-white/78 px-5 py-2.5 text-center text-sm font-medium text-[#243328] transition hover:bg-white"
                    >
                      Sign in to save
                    </a>
                  )}
                </div>
              )}
            </article>

            <aside className="grid gap-5">
              <div className="rounded-[30px] border border-[#ddd4c8] bg-[#243328] p-5 text-white shadow-[0_12px_30px_rgba(36,51,40,0.08)] md:p-7">
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/58">
                  What this planner is for
                </p>

                <h2 className="mt-2 font-serif text-3xl leading-tight">
                  Less staring into the fridge.
                </h2>

                <p className="mt-3 text-sm leading-7 text-white/72">
                  It helps you use the box, repeat meals you like and add pantry
                  extras only when they make the week easier.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                  <div className="rounded-[20px] border border-white/10 bg-white/8 p-4">
                    <p className="font-serif text-xl">Use the box</p>
                    <p className="mt-2 text-sm leading-6 text-white/65">
                      Meal ideas built around fresh produce.
                    </p>
                  </div>

                  <div className="rounded-[20px] border border-white/10 bg-white/8 p-4">
                    <p className="font-serif text-xl">Waste less</p>
                    <p className="mt-2 text-sm leading-6 text-white/65">
                      Overlapping ingredients make shopping work harder.
                    </p>
                  </div>

                  <div className="rounded-[20px] border border-white/10 bg-white/8 p-4">
                    <p className="font-serif text-xl">Save favourites</p>
                    <p className="mt-2 text-sm leading-6 text-white/65">
                      Build future weeks around meals you cook again.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <ProductPromptCard
                  item={weeklyProduceBox}
                  eyebrow="Best for lighter weeks"
                  onAdd={() => addDisplayItem(weeklyProduceBox)}
                />

                <ProductPromptCard
                  item={familyProduceBox}
                  eyebrow="Best for fuller kitchens"
                  onAdd={() => addDisplayItem(familyProduceBox)}
                />
              </div>
            </aside>
          </div>
        </div>
      </section>

      {step === "results" ? (
        <section className="px-4 pb-10 sm:px-6 md:px-10 md:pb-14">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#6b776c]">
                  Your week
                </p>

                <h2 className="mt-2 font-serif text-3xl leading-tight text-[#243328] md:text-4xl">
                  {getStyleLabel(eatingStyle)}
                </h2>
              </div>

              <p className="max-w-xl text-sm leading-6 text-[#667164]">
                Open a meal for ingredients, quick steps and useful pantry
                matches. Swap anything that does not suit.
              </p>
            </div>

            {plannerInsights.insights.length > 0 ? (
              <div className="mb-6 rounded-[26px] border border-[#ddd4c8] bg-[#f7f2eb] p-5 md:p-6">
                <p className="font-serif text-2xl leading-tight text-[#243328]">
                  This week is designed to make your box work harder.
                </p>

                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {plannerInsights.insights.slice(0, 3).map((insight) => (
                    <div
                      key={insight.label}
                      className="rounded-[20px] border border-[#e4dbcf] bg-white/74 p-4 text-sm leading-6 text-[#5f675c]"
                    >
                      <p className="font-medium text-[#243328]">
                        {insight.label}
                      </p>
                      <p className="mt-1">{insight.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="grid gap-4 lg:grid-cols-[1fr_0.36fr]">
              <div className="space-y-4">
                {week.map((meal) => {
                  const isOpen = openDay === meal.id;
                  const isSaved = savedRecipeSlugs.includes(meal.recipeSlug);

                  return (
                    <article
                      key={meal.id}
                      className="overflow-hidden rounded-[26px] border border-[#ddd4c8] bg-white/86 shadow-[0_12px_26px_rgba(36,51,40,0.05)]"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setOpenDay((current) =>
                            current === meal.id ? null : meal.id,
                          )
                        }
                        className="grid w-full gap-4 p-4 text-left md:grid-cols-[150px_1fr_auto] md:items-center"
                      >
                        {meal.imageUrl ? (
                          <img
                            src={meal.imageUrl}
                            alt={meal.title}
                            className="h-40 w-full rounded-[20px] object-cover md:h-28"
                          />
                        ) : (
                          <div className="h-40 rounded-[20px] bg-[#e8ded1] md:h-28" />
                        )}

                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-[#7b846f]">
                            {meal.day}
                          </p>

                          <h3 className="mt-1 font-serif text-2xl leading-tight text-[#243328]">
                            {meal.title}
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-[#667164]">
                            {meal.description}
                          </p>

                          {meal.ingredients.length > 0 ? (
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {meal.ingredients
                                .slice(0, 3)
                                .map((ingredient) => (
                                  <span
                                    key={ingredient}
                                    className="rounded-full border border-[#e4dbcf] bg-[#f7f2eb] px-2.5 py-1 text-[11px] text-[#5f675c]"
                                  >
                                    {ingredient}
                                  </span>
                                ))}
                            </div>
                          ) : null}
                        </div>

                        <span className="rounded-full border border-[#d6cec2] px-4 py-2 text-sm font-medium text-[#243328]">
                          {isOpen ? "Close" : "View"}
                        </span>
                      </button>

                      {isOpen ? (
                        <div className="border-t border-[#e4dbcf] p-5 md:p-6">
                          <div className="grid gap-6 md:grid-cols-2">
                            <div>
                              <h4 className="text-sm font-semibold text-[#243328]">
                                Ingredients
                              </h4>

                              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-[#667164]">
                                {meal.ingredients.map((ingredient) => (
                                  <li key={ingredient}>{ingredient}</li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <h4 className="text-sm font-semibold text-[#243328]">
                                Quick method
                              </h4>

                              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-[#667164]">
                                {meal.steps.slice(0, 5).map((stepText) => (
                                  <li key={stepText}>{stepText}</li>
                                ))}
                              </ol>
                            </div>
                          </div>

                          {meal.matchedProducts.length > 0 ? (
                            <div className="mt-6 rounded-[20px] border border-[#ddd4c8] bg-[#f7f2eb] p-4">
                              <p className="text-sm font-medium text-[#243328]">
                                Useful with this meal
                              </p>

                              <div className="mt-3 flex flex-wrap gap-2">
                                {meal.matchedProducts.map((productName) => (
                                  <button
                                    key={productName}
                                    type="button"
                                    onClick={() =>
                                      addProductByName(productName)
                                    }
                                    className="rounded-full border border-[#d6cec2] bg-white/82 px-3 py-1.5 text-xs font-medium text-[#243328] transition hover:bg-white"
                                  >
                                    Add {productName}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ) : null}

                          <div className="mt-6 grid gap-2 sm:grid-cols-3">
                            <button
                              type="button"
                              onClick={() => handleOpenSwapOptions(meal.id)}
                              className="rounded-full border border-[#d6cec2] bg-white px-4 py-2 text-sm font-medium text-[#243328] transition hover:bg-[#f7f2eb]"
                            >
                              Swap meal
                            </button>

                            <button
                              type="button"
                              onClick={() => handleSaveToRegulars(meal.recipe)}
                              disabled={savingRecipeSlug === meal.recipeSlug}
                              className="rounded-full border border-[#d6cec2] bg-white px-4 py-2 text-sm font-medium text-[#243328] transition hover:bg-[#f7f2eb] disabled:opacity-60"
                            >
                              {isSaved
                                ? "Saved"
                                : savingRecipeSlug === meal.recipeSlug
                                  ? "Saving..."
                                  : "Save"}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleCookedThis(meal.recipeSlug)}
                              className="rounded-full border border-[#d6cec2] bg-white px-4 py-2 text-sm font-medium text-[#243328] transition hover:bg-[#f7f2eb]"
                            >
                              Cooked this
                            </button>
                          </div>
                        </div>
                      ) : null}
                    </article>
                  );
                })}
              </div>

              <aside className="space-y-4">
                <div className="rounded-[26px] border border-[#ddd4c8] bg-white/86 p-5 shadow-[0_12px_26px_rgba(36,51,40,0.05)]">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#6b776c]">
                    Pantry extras
                  </p>

                  <h3 className="mt-2 font-serif text-2xl leading-tight text-[#243328]">
                    Useful with this week.
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#667164]">
                    Suggested extras based on the meals. Skip anything you
                    already have.
                  </p>

                  {recommendedAddOns.length > 0 ? (
                    <>
                      <div className="mt-5 space-y-3">
                        {recommendedAddOns.map((item) => (
                          <CompactShopCard
                            key={item.name}
                            item={item}
                            onAdd={() => addDisplayItem(item)}
                          />
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={addAllAddOns}
                        className="mt-5 w-full rounded-full bg-[#243328] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
                      >
                        Add suggested extras
                      </button>
                    </>
                  ) : (
                    <p className="mt-4 text-sm leading-6 text-[#667164]">
                      Build a week to see matched pantry extras.
                    </p>
                  )}
                </div>

                <div className="rounded-[26px] border border-[#ddd4c8] bg-[#f7f2eb] p-5">
                  <p className="text-sm font-medium text-[#243328]">Basket</p>

                  <p className="mt-2 text-sm leading-6 text-[#667164]">
                    {totalBasketItems === 0
                      ? "Your basket is empty."
                      : `${totalBasketItems} item${
                          totalBasketItems === 1 ? "" : "s"
                        } in your basket.`}
                  </p>

                  <a
                    href="/shop"
                    className="mt-4 inline-flex rounded-full border border-[#d6cec2] bg-white/78 px-5 py-2.5 text-sm font-medium text-[#243328] transition hover:bg-white"
                  >
                    Continue shopping
                  </a>
                </div>
              </aside>
            </div>

            {swapMealId ? (
              <section ref={swapSectionRef} className="mt-8">
                <div className="rounded-[28px] border border-[#ddd4c8] bg-white/86 p-5 shadow-[0_12px_26px_rgba(36,51,40,0.05)] md:p-6">
                  <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.22em] text-[#6b776c]">
                        Swap meal
                      </p>

                      <h3 className="mt-2 font-serif text-2xl leading-tight text-[#243328]">
                        Choose a replacement
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSwapMealId(null)}
                      className="self-start rounded-full border border-[#d6cec2] bg-white px-4 py-2 text-sm font-medium text-[#243328] transition hover:bg-[#f7f2eb]"
                    >
                      Close swaps
                    </button>
                  </div>

                  {swapOptions.length > 0 ? (
                    <div className="mt-5 grid gap-4 md:grid-cols-3">
                      {swapOptions.slice(0, 6).map((recipe) => (
                        <button
                          key={recipe.slug}
                          type="button"
                          onClick={() => handleSwapMeal(recipe)}
                          className="overflow-hidden rounded-[22px] border border-[#e4dbcf] bg-[#f7f2eb] text-left transition hover:bg-white"
                        >
                          {recipe.image ? (
                            <img
                              src={recipe.image}
                              alt={recipe.title}
                              className="h-32 w-full object-cover"
                            />
                          ) : null}

                          <div className="p-4">
                            <p className="font-serif text-xl leading-tight text-[#243328]">
                              {recipe.title}
                            </p>

                            <p className="mt-2 text-sm leading-6 text-[#667164]">
                              {recipe.intro}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-5 text-sm leading-6 text-[#667164]">
                      No close swaps found yet. Rebuild the week or choose a
                      different style.
                    </p>
                  )}
                </div>
              </section>
            ) : null}
          </div>
        </section>
      ) : null}

      <SiteFooter />
    </main>
  );
}
