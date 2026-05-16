import { recipes, Recipe } from "../recipes/recipes-data";

export type PlannerStyle =
  | "mixed"
  | "mostly-veggie"
  | "vegan"
  | "gluten-free"
  | "quick";

function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

function uniqueBySlug(recipes: Recipe[]) {
  const seen = new Set();

  return recipes.filter((recipe) => {
    if (seen.has(recipe.slug)) {
      return false;
    }

    seen.add(recipe.slug);
    return true;
  });
}

export function generateWeek(style: PlannerStyle): Recipe[] {
  let filteredRecipes = [...recipes];

  // FILTER BY STYLE

  if (style === "mostly-veggie") {
    filteredRecipes = filteredRecipes.filter((recipe) =>
      recipe.dietary.includes("veggie"),
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

  // REMOVE SWEETS

  filteredRecipes = filteredRecipes.filter(
    (recipe) => recipe.category === "savoury",
  );

  // CREATE GROUPS

  const quickMeals = filteredRecipes.filter((recipe) => recipe.isQuick);

  const pastaMeals = filteredRecipes.filter(
    (recipe) => recipe.mealType === "pasta",
  );

  const grainBowls = filteredRecipes.filter(
    (recipe) => recipe.mealType === "grain-bowl",
  );

  const traybakes = filteredRecipes.filter(
    (recipe) => recipe.mealType === "traybake",
  );

  const onePots = filteredRecipes.filter(
    (recipe) => recipe.mealType === "one-pot",
  );

  // BUILD WEEK

  let week: Recipe[] = [];

  if (quickMeals.length > 0) {
    week.push(shuffleArray(quickMeals)[0]);
  }

  if (grainBowls.length > 0) {
    week.push(shuffleArray(grainBowls)[0]);
  }

  if (pastaMeals.length > 0) {
    week.push(shuffleArray(pastaMeals)[0]);
  }

  if (traybakes.length > 0) {
    week.push(shuffleArray(traybakes)[0]);
  }

  if (onePots.length > 0) {
    week.push(shuffleArray(onePots)[0]);
  }

  // REMOVE DUPLICATES

  week = uniqueBySlug(week);

  // FILL TO 5 IF NEEDED

  const shuffled = shuffleArray(filteredRecipes);

  for (const recipe of shuffled) {
    if (week.length >= 5) {
      break;
    }

    const alreadyIncluded = week.find((item) => item.slug === recipe.slug);

    if (!alreadyIncluded) {
      week.push(recipe);
    }
  }

  return week.slice(0, 5);
}
