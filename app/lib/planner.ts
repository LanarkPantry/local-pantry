import { recipes, type MealType, type Recipe } from "../recipes/recipes-data";

export type PlannerStyle =
  | "mixed"
  | "mostly-veggie"
  | "vegan"
  | "gluten-free"
  | "quick";

const MEAL_TYPE_ROTATION: MealType[] = [
  "pasta",
  "rice-bowl",
  "grain-bowl",
  "traybake",
  "soup",
  "salad",
  "beans",
  "quick-pan",
  "one-pot",
];

function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

function uniqueBySlug(recipeList: Recipe[]): Recipe[] {
  const seen = new Set<string>();

  return recipeList.filter((recipe) => {
    if (seen.has(recipe.slug)) {
      return false;
    }

    seen.add(recipe.slug);
    return true;
  });
}

function filterByStyle(recipeList: Recipe[], style: PlannerStyle): Recipe[] {
  let filteredRecipes = recipeList.filter(
    (recipe) => recipe.category === "savoury",
  );

  if (style === "mostly-veggie") {
    filteredRecipes = filteredRecipes.filter(
      (recipe) =>
        recipe.dietary.includes("veggie") || recipe.dietary.includes("vegan"),
    );
  }

  if (style === "vegan") {
    filteredRecipes = filteredRecipes.filter((recipe) =>
      recipe.dietary.includes("vegan"),
    );
  }

  if (style === "gluten-free") {
    filteredRecipes = filteredRecipes.filter((recipe) =>
      recipe.dietary.includes("gluten-free"),
    );
  }

  if (style === "quick") {
    filteredRecipes = filteredRecipes.filter((recipe) => recipe.isQuick);
  }

  return uniqueBySlug(filteredRecipes);
}

function getUnusedCandidates({
  filteredRecipes,
  selectedSlugs,
  mealType,
}: {
  filteredRecipes: Recipe[];
  selectedSlugs: Set<string>;
  mealType: MealType;
}) {
  return filteredRecipes.filter(
    (recipe) => recipe.mealType === mealType && !selectedSlugs.has(recipe.slug),
  );
}

export function generateWeek(style: PlannerStyle, mealCount = 5): Recipe[] {
  const targetMealCount = Math.min(Math.max(mealCount, 1), 7);
  const filteredRecipes = filterByStyle(recipes, style);

  const week: Recipe[] = [];
  const selectedSlugs = new Set<string>();

  function addRecipe(recipe: Recipe | undefined) {
    if (!recipe) return;
    if (week.length >= targetMealCount) return;
    if (selectedSlugs.has(recipe.slug)) return;

    week.push(recipe);
    selectedSlugs.add(recipe.slug);
  }

  const shuffledMealTypes = shuffleArray(MEAL_TYPE_ROTATION);

  for (const mealType of shuffledMealTypes) {
    if (week.length >= targetMealCount) {
      break;
    }

    const candidates = getUnusedCandidates({
      filteredRecipes,
      selectedSlugs,
      mealType,
    });

    addRecipe(shuffleArray(candidates)[0]);
  }

  const fillers = shuffleArray(filteredRecipes).filter(
    (recipe) => !selectedSlugs.has(recipe.slug),
  );

  for (const recipe of fillers) {
    if (week.length >= targetMealCount) {
      break;
    }

    addRecipe(recipe);
  }

  return week.slice(0, targetMealCount);
}
