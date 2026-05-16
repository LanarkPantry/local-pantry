import { Recipe } from "../recipes/recipes-data";

export type PlannerInsight = {
  label: string;
  text: string;
};

export type PlannerInsightsResult = {
  score: number;
  summary: string;
  insights: PlannerInsight[];
  repeatedIngredients: string[];
  repeatedPantryItems: string[];
  quickMealCount: number;
  veggieMealCount: number;
  totalMeals: number;
  pantryAdditionCount: number;
};

type IngredientCount = {
  name: string;
  count: number;
};

function titleCase(value: string) {
  return value
    .split(" ")
    .map((word) => {
      if (!word) return word;
      return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
    })
    .join(" ");
}

function normalise(value: string) {
  return value.trim().toLowerCase();
}

function countItems(items: string[]) {
  const counts = new Map<string, IngredientCount>();

  items.forEach((item) => {
    const key = normalise(item);

    if (!key) return;

    const existing = counts.get(key);

    if (existing) {
      counts.set(key, {
        name: existing.name,
        count: existing.count + 1,
      });
    } else {
      counts.set(key, {
        name: item.trim(),
        count: 1,
      });
    }
  });

  return Array.from(counts.values()).sort((a, b) => b.count - a.count);
}

function getRepeatedItems(items: string[]) {
  return countItems(items)
    .filter((item) => item.count > 1)
    .map((item) => item.name);
}

function getTopRepeatedItem(items: string[]) {
  return countItems(items).find((item) => item.count > 1) ?? null;
}

function getUniqueCount(items: string[]) {
  return new Set(items.map(normalise).filter(Boolean)).size;
}

function calculateScore({
  repeatedIngredientCount,
  repeatedPantryCount,
  quickMealCount,
  veggieMealCount,
  totalMeals,
  pantryAdditionCount,
}: {
  repeatedIngredientCount: number;
  repeatedPantryCount: number;
  quickMealCount: number;
  veggieMealCount: number;
  totalMeals: number;
  pantryAdditionCount: number;
}) {
  if (totalMeals === 0) return 0;

  let score = 58;

  score += Math.min(repeatedIngredientCount * 6, 18);
  score += Math.min(repeatedPantryCount * 7, 18);
  score += Math.min(quickMealCount * 4, 14);
  score += Math.min(veggieMealCount * 3, 12);

  if (pantryAdditionCount <= 4) {
    score += 10;
  } else if (pantryAdditionCount <= 6) {
    score += 6;
  } else if (pantryAdditionCount <= 8) {
    score += 3;
  }

  return Math.max(0, Math.min(score, 96));
}

export function getPlannerInsights(
  weekRecipes: Recipe[],
): PlannerInsightsResult {
  const totalMeals = weekRecipes.length;

  const allMainIngredients = weekRecipes.flatMap(
    (recipe) => recipe.mainIngredients ?? [],
  );

  const allPantryMatches = weekRecipes.flatMap(
    (recipe) => recipe.pantryMatches ?? [],
  );

  const allMealTypes = weekRecipes.map((recipe) => recipe.mealType);
  const allFlavours = weekRecipes.flatMap(
    (recipe) => recipe.flavourProfile ?? [],
  );

  const repeatedIngredients = getRepeatedItems(allMainIngredients);
  const repeatedPantryItems = getRepeatedItems(allPantryMatches);

  const topRepeatedIngredient = getTopRepeatedItem(allMainIngredients);
  const topRepeatedPantryItem = getTopRepeatedItem(allPantryMatches);

  const quickMealCount = weekRecipes.filter(
    (recipe) => recipe.isQuick || recipe.cookingMinutes <= 30,
  ).length;

  const veggieMealCount = weekRecipes.filter((recipe) =>
    recipe.dietary.includes("veggie"),
  ).length;

  const veganMealCount = weekRecipes.filter((recipe) =>
    recipe.dietary.includes("vegan"),
  ).length;

  const glutenFreeMealCount = weekRecipes.filter((recipe) =>
    recipe.dietary.includes("gluten-free"),
  ).length;

  const uniqueMealTypeCount = getUniqueCount(allMealTypes);
  const uniqueFlavourCount = getUniqueCount(allFlavours);
  const pantryAdditionCount = getUniqueCount(allPantryMatches);

  const score = calculateScore({
    repeatedIngredientCount: repeatedIngredients.length,
    repeatedPantryCount: repeatedPantryItems.length,
    quickMealCount,
    veggieMealCount,
    totalMeals,
    pantryAdditionCount,
  });

  const insights: PlannerInsight[] = [];

  if (topRepeatedIngredient) {
    insights.push({
      label: "Ingredient reuse",
      text: `${titleCase(topRepeatedIngredient.name)} appears in ${topRepeatedIngredient.count} meals, helping the week feel joined up rather than random.`,
    });
  } else if (allMainIngredients.length > 0) {
    insights.push({
      label: "Ingredient spread",
      text: "This week uses a broad mix of ingredients, which keeps the meals varied.",
    });
  }

  if (topRepeatedPantryItem) {
    insights.push({
      label: "Pantry efficiency",
      text: `${topRepeatedPantryItem.name} works across ${topRepeatedPantryItem.count} meals, so one pantry item earns its place.`,
    });
  } else if (pantryAdditionCount > 0) {
    insights.push({
      label: "Pantry focus",
      text: `This plan only needs ${pantryAdditionCount} matched pantry addition${pantryAdditionCount === 1 ? "" : "s"}.`,
    });
  }

  if (quickMealCount > 0) {
    insights.push({
      label: "Effort balance",
      text: `${quickMealCount} of ${totalMeals} meal${quickMealCount === 1 ? " is" : "s are"} quick enough for busier nights.`,
    });
  }

  if (uniqueMealTypeCount > 1) {
    insights.push({
      label: "Meal variety",
      text: `The week includes ${uniqueMealTypeCount} meal styles, so it avoids feeling repetitive.`,
    });
  }

  if (uniqueFlavourCount > 2) {
    insights.push({
      label: "Flavour variety",
      text: `There are ${uniqueFlavourCount} flavour directions across the week, giving the plan more contrast.`,
    });
  }

  if (veggieMealCount > 0) {
    insights.push({
      label: "Veg-led cooking",
      text: `${veggieMealCount} meal${veggieMealCount === 1 ? " is" : "s are"} veggie-friendly, with ${veganMealCount} vegan-friendly and ${glutenFreeMealCount} gluten-free-friendly option${glutenFreeMealCount === 1 ? "" : "s"}.`,
    });
  }

  const limitedInsights = insights.slice(0, 5);

  const summary =
    score >= 85
      ? "Strong low-waste week"
      : score >= 72
        ? "Well-balanced week"
        : score >= 60
          ? "Good practical week"
          : "Useful starter week";

  return {
    score,
    summary,
    insights: limitedInsights,
    repeatedIngredients,
    repeatedPantryItems,
    quickMealCount,
    veggieMealCount,
    totalMeals,
    pantryAdditionCount,
  };
}
