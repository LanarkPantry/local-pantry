import { Recipe } from "../recipes/recipes-data";

type SwapArgs = {
  currentRecipe: Recipe;
  allRecipes: Recipe[];
  currentWeekSlugs: string[];
};

type ScoredRecipe = {
  recipe: Recipe;
  score: number;
};

function normaliseList(value: string[] | undefined) {
  return Array.isArray(value) ? value : [];
}

function getOverlapCount(
  first: string[] | undefined,
  second: string[] | undefined,
) {
  const firstList = normaliseList(first);
  const secondSet = new Set(normaliseList(second));

  return firstList.filter((item) => secondSet.has(item)).length;
}

function sharesDietaryStyle(currentRecipe: Recipe, candidate: Recipe) {
  const currentDietary = normaliseList(currentRecipe.dietary);
  const candidateDietary = normaliseList(candidate.dietary);

  if (currentDietary.length === 0) {
    return true;
  }

  return currentDietary.some((tag) => candidateDietary.includes(tag));
}

function hasDifferentFlavourDirection(
  currentRecipe: Recipe,
  candidate: Recipe,
) {
  const currentFlavours = normaliseList(currentRecipe.flavourProfile);
  const candidateFlavours = normaliseList(candidate.flavourProfile);

  if (currentFlavours.length === 0 || candidateFlavours.length === 0) {
    return true;
  }

  const overlap = getOverlapCount(currentFlavours, candidateFlavours);

  /*
    This stops the swap list feeling like four versions of the same dinner.
    One shared flavour is fine. Two or more starts to feel too similar.
  */
  return overlap < 2;
}

function hasSimilarEffortLevel(currentRecipe: Recipe, candidate: Recipe) {
  const currentMinutes = currentRecipe.cookingMinutes;
  const candidateMinutes = candidate.cookingMinutes;

  if (
    typeof currentMinutes !== "number" ||
    typeof candidateMinutes !== "number"
  ) {
    return true;
  }

  return Math.abs(currentMinutes - candidateMinutes) <= 15;
}

function scoreSwap(currentRecipe: Recipe, candidate: Recipe) {
  let score = 0;

  const dietaryOverlap = getOverlapCount(
    currentRecipe.dietary,
    candidate.dietary,
  );

  const flavourOverlap = getOverlapCount(
    currentRecipe.flavourProfile,
    candidate.flavourProfile,
  );

  const currentMinutes = currentRecipe.cookingMinutes;
  const candidateMinutes = candidate.cookingMinutes;

  score += dietaryOverlap * 8;

  if (currentRecipe.mealType === candidate.mealType) {
    score += 30;
  }

  if (
    typeof currentMinutes === "number" &&
    typeof candidateMinutes === "number"
  ) {
    const timeDifference = Math.abs(currentMinutes - candidateMinutes);

    if (timeDifference <= 5) {
      score += 12;
    } else if (timeDifference <= 10) {
      score += 8;
    } else if (timeDifference <= 15) {
      score += 4;
    }
  }

  /*
    Reward some difference. A swap should feel fresh, not identical.
  */
  if (flavourOverlap === 0) {
    score += 12;
  } else if (flavourOverlap === 1) {
    score += 8;
  }

  return score;
}

export function getSwapOptions({
  currentRecipe,
  allRecipes,
  currentWeekSlugs,
}: SwapArgs): Recipe[] {
  const currentWeekSlugSet = new Set(currentWeekSlugs);

  const strictMatches: ScoredRecipe[] = allRecipes
    .filter((candidate) => {
      if (candidate.slug === currentRecipe.slug) {
        return false;
      }

      if (currentWeekSlugSet.has(candidate.slug)) {
        return false;
      }

      if (candidate.mealType !== currentRecipe.mealType) {
        return false;
      }

      if (!sharesDietaryStyle(currentRecipe, candidate)) {
        return false;
      }

      if (!hasSimilarEffortLevel(currentRecipe, candidate)) {
        return false;
      }

      if (!hasDifferentFlavourDirection(currentRecipe, candidate)) {
        return false;
      }

      return true;
    })
    .map((recipe) => ({
      recipe,
      score: scoreSwap(currentRecipe, recipe),
    }))
    .sort((a, b) => b.score - a.score);

  if (strictMatches.length >= 4) {
    return strictMatches.slice(0, 4).map((match) => match.recipe);
  }

  /*
    Fallback:
    If the recipe bank is still small, we loosen the rules slightly so the UI
    does not show an empty swap drawer. We still keep:
    - not the same recipe
    - not already in the current week
    - same meal category
    - similar dietary style
  */
  const fallbackMatches: ScoredRecipe[] = allRecipes
    .filter((candidate) => {
      if (candidate.slug === currentRecipe.slug) {
        return false;
      }

      if (currentWeekSlugSet.has(candidate.slug)) {
        return false;
      }

      if (candidate.mealType !== currentRecipe.mealType) {
        return false;
      }

      if (!sharesDietaryStyle(currentRecipe, candidate)) {
        return false;
      }

      const alreadyIncluded = strictMatches.some(
        (match) => match.recipe.slug === candidate.slug,
      );

      return !alreadyIncluded;
    })
    .map((recipe) => ({
      recipe,
      score: scoreSwap(currentRecipe, recipe) - 10,
    }))
    .sort((a, b) => b.score - a.score);

  return [...strictMatches, ...fallbackMatches]
    .slice(0, 4)
    .map((match) => match.recipe);
}
