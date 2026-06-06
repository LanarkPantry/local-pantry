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
          ? "border-[#243328] bg-[#243328] text-white"
          : "border-[#d6cec2] bg-white/80 text-[#243328] hover:bg-white"
      }`}
    >
      {label}
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
      return "My Kitchen week";
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
        className="h-44 w-full object-cover"
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

    return allAddOns.filter((item) => names.has(item.name)).slice(0, 6);
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

      <div className="px-4 pt-4 sm:px-6 md:hidden">
        <div className="overflow-hidden rounded-[24px] border border-[#ddd4c8] shadow-[0_10px_24px_rgba(36,51,40,0.06)]">
          <img
            src="/images/home/plan-your-week.jpg"
            alt="Fresh produce and pantry ingredients ready for the week"
            className="h-44 w-full object-cover"
          />
        </div>
      </div>

      <section className="border-b border-[rgba(230,221,210,0.86)] px-4 pb-7 pt-5 sm:px-6 md:px-10 md:pb-10 md:pt-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 lg:grid-cols-[1fr_0.95fr]">
            <article className="rounded-[30px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.88)] p-5 shadow-[0_12px_30px_rgba(36,51,40,0.06)] md:p-8">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#6b776c]">
                Free meal planner
              </p>

              <h1 className="mt-3 max-w-3xl font-serif text-[2.15rem] leading-[1.02] tracking-tight text-[#243328] md:text-[3.6rem]">
                Make your produce box easier to use.
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#5f675c] md:text-base">
                Choose how many nights you want to cook and get a simple week of
                meal ideas built around fresh produce, useful pantry staples and
                real home cooking.
              </p>

              <div className="mt-5 flex flex-wrap gap-2 text-xs text-[#4f5d50]">
                <span className="rounded-full border border-[#ddd4c8] bg-white/76 px-3 py-1.5">
                  Free to use
                </span>
                <span className="rounded-full border border-[#ddd4c8] bg-white/76 px-3 py-1.5">
                  3–7 nights
                </span>
                <span className="rounded-full border border-[#ddd4c8] bg-white/76 px-3 py-1.5">
                  Save favourites
                </span>
                <span className="rounded-full border border-[#ddd4c8] bg-white/76 px-3 py-1.5">
                  Add useful extras
                </span>
              </div>

              {!hasProduceBox ? (
                <div className="mt-6 rounded-[22px] border border-[#d8cbbd] bg-white/72 p-4">
                  <p className="text-sm font-medium text-[#243328]">
                    Start with a produce box.
                  </p>

                  <p className="mt-2 text-sm leading-6 text-[#667164]">
                    The planner works best when you have your weekly or family
                    produce box in mind. Add a box, then use this page to make
                    the week feel easier.
                  </p>
                </div>
              ) : (
                <div className="mt-6 rounded-[22px] border border-[#cbd8ca] bg-white/72 p-4">
                  <p className="text-sm font-medium text-[#243328]">
                    Produce box added.
                  </p>

                  <p className="mt-2 text-sm leading-6 text-[#667164]">
                    Now build a week around it and add any pantry extras you
                    actually need.
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
                      What suits this week?
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
                        active={eatingStyle === "my-kitchen"}
                        label="Saved favourites"
                        onClick={() => setEatingStyle("my-kitchen")}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-1">
                    <button
                      type="button"
                      onClick={handleBuildWeek}
                      disabled={!authChecked}
                      className="rounded-full bg-[#243328] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {authChecked ? "Build my week" : "Checking account..."}
                    </button>

                    <a
                      href="/shop"
                      className="rounded-full border border-[#d6cec2] bg-white/78 px-6 py-3 text-sm font-medium text-[#243328] transition hover:bg-white"
                    >
                      Shop produce boxes
                    </a>
                  </div>
                </div>
              ) : (
                <div className="mt-8 flex flex-wrap gap-3">
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
                  ) : null}
                </div>
              )}
            </article>

            <aside className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
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
            </aside>
          </div>
        </div>
      </section>

      {step === "results" ? (
        <section className="px-4 py-8 sm:px-6 md:px-10 md:py-12">
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
                Open a meal to see ingredients, quick steps and pantry matches.
                Swap anything that does not suit.
              </p>
            </div>

            {plannerInsights.insights.length > 0 ? (
              <div className="mb-6 grid gap-3 md:grid-cols-3">
                {plannerInsights.insights.slice(0, 3).map((insight) => (
                  <div
                    key={insight.label}
                    className="rounded-[20px] border border-[#ddd4c8] bg-white/72 p-4 text-sm leading-6 text-[#5f675c]"
                  >
                    <p className="font-medium text-[#243328]">
                      {insight.label}
                    </p>
                    <p className="mt-1">{insight.text}</p>
                  </div>
                ))}
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
                      className="overflow-hidden rounded-[26px] border border-[#ddd4c8] bg-white/82 shadow-[0_12px_26px_rgba(36,51,40,0.05)]"
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
                            className="h-36 w-full rounded-[20px] object-cover md:h-28"
                          />
                        ) : (
                          <div className="h-36 rounded-[20px] bg-[#e8ded1] md:h-28" />
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
                        </div>

                        <span className="rounded-full border border-[#d6cec2] px-4 py-2 text-sm font-medium text-[#243328]">
                          {isOpen ? "Close" : "Open"}
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
                                Useful pantry matches
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

                          <div className="mt-6 flex flex-wrap gap-3">
                            <button
                              type="button"
                              onClick={() => handleOpenSwapOptions(meal.id)}
                              className="rounded-full border border-[#d6cec2] bg-white px-4 py-2 text-sm font-medium text-[#243328] transition hover:bg-[#f7f2eb]"
                            >
                              Swap this meal
                            </button>

                            <button
                              type="button"
                              onClick={() => handleSaveToRegulars(meal.recipe)}
                              disabled={savingRecipeSlug === meal.recipeSlug}
                              className="rounded-full border border-[#d6cec2] bg-white px-4 py-2 text-sm font-medium text-[#243328] transition hover:bg-[#f7f2eb] disabled:opacity-60"
                            >
                              {isSaved
                                ? "Saved to My Kitchen"
                                : savingRecipeSlug === meal.recipeSlug
                                  ? "Saving..."
                                  : "Save to My Kitchen"}
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
                <div className="rounded-[26px] border border-[#ddd4c8] bg-white/82 p-5 shadow-[0_12px_26px_rgba(36,51,40,0.05)]">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#6b776c]">
                    Pantry extras
                  </p>

                  <h3 className="mt-2 font-serif text-2xl leading-tight text-[#243328]">
                    Add only what helps.
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#667164]">
                    These are the useful extras matched to this week. Skip
                    anything you already have.
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
                <div className="rounded-[28px] border border-[#ddd4c8] bg-white/82 p-5 shadow-[0_12px_26px_rgba(36,51,40,0.05)] md:p-6">
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
      ) : (
        <section className="px-4 py-8 sm:px-6 md:px-10 md:py-12">
          <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
            <div className="rounded-[26px] border border-[#ddd4c8] bg-white/76 p-5">
              <p className="font-serif text-2xl text-[#243328]">
                Start with the box.
              </p>

              <p className="mt-2 text-sm leading-6 text-[#667164]">
                The produce box is the main thing. The planner simply helps you
                turn it into dinners.
              </p>
            </div>

            <div className="rounded-[26px] border border-[#ddd4c8] bg-white/76 p-5">
              <p className="font-serif text-2xl text-[#243328]">
                Add what is useful.
              </p>

              <p className="mt-2 text-sm leading-6 text-[#667164]">
                Pantry extras are suggested only where they make sense for your
                week.
              </p>
            </div>

            <div className="rounded-[26px] border border-[#ddd4c8] bg-white/76 p-5">
              <p className="font-serif text-2xl text-[#243328]">
                Save your regulars.
              </p>

              <p className="mt-2 text-sm leading-6 text-[#667164]">
                Keep meals you actually cook, then build future weeks around
                your own favourites.
              </p>
            </div>
          </div>
        </section>
      )}

      <SiteFooter />
    </main>
  );
}
