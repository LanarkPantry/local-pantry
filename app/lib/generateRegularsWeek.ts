import { Recipe, recipes } from "../recipes/recipes-data";

function shuffle<T>(array: T[]) {
  return [...array].sort(() => Math.random() - 0.5);
}

function matchesMealStyle(base: Recipe, candidate: Recipe) {
  if (base.slug === candidate.slug) {
    return false;
  }

  if (base.mealType !== candidate.mealType) {
    return false;
  }

  const dietaryOverlap = base.dietary.some((tag) =>
    candidate.dietary.includes(tag),
  );

  return dietaryOverlap;
}

export function generateRegularsWeek({
  regularRecipes,
  mealCount,
}: {
  regularRecipes: Recipe[];
  mealCount: number;
}) {
  const chosen: Recipe[] = [];

  const shuffledRegulars = shuffle(regularRecipes);

  for (const recipe of shuffledRegulars) {
    if (chosen.length >= mealCount) {
      break;
    }

    const alreadyIncluded = chosen.some((item) => item.slug === recipe.slug);

    if (!alreadyIncluded) {
      chosen.push(recipe);
    }
  }

  while (chosen.length < mealCount && chosen.length > 0) {
    const anchorRecipe = chosen[Math.floor(Math.random() * chosen.length)];

    const candidates = recipes.filter((candidate) => {
      const alreadyIncluded = chosen.some(
        (item) => item.slug === candidate.slug,
      );

      if (alreadyIncluded) {
        return false;
      }

      return matchesMealStyle(anchorRecipe, candidate);
    });

    if (candidates.length === 0) {
      break;
    }

    const selected = candidates[Math.floor(Math.random() * candidates.length)];

    chosen.push(selected);
  }

  return shuffle(chosen).slice(0, mealCount);
}
