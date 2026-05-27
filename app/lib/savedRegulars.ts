import { createClient } from "@supabase/supabase-js";
import { Recipe } from "../recipes/recipes-data";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables.");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type SavedRecipeRow = {
  id: string;
  user_id: string;
  recipe_slug: string;
  recipe_title: string;
  recipe_image: string | null;
  recipe_intro: string | null;
  recipe_time: string | null;
  recipe_meal_type: string | null;
  recipe_dietary: string[] | null;
  created_at: string;
  updated_at: string;
};

export async function getSavedRegulars() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      savedRecipes: [] as SavedRecipeRow[],
      error: "You need to be signed in to view My Kitchen.",
    };
  }

  const { data, error } = await supabase
    .from("saved_recipes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return {
      savedRecipes: [] as SavedRecipeRow[],
      error: error.message,
    };
  }

  return {
    savedRecipes: (data ?? []) as SavedRecipeRow[],
    error: null,
  };
}

export async function getSavedRecipeSlugs() {
  const { savedRecipes, error } = await getSavedRegulars();

  if (error) {
    return {
      slugs: [] as string[],
      error,
    };
  }

  return {
    slugs: savedRecipes.map((recipe) => recipe.recipe_slug),
    error: null,
  };
}

export async function saveRecipeToRegulars(recipe: Recipe) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      success: false,
      error: "You need to be signed in to save meals to My Kitchen.",
    };
  }

  const { error } = await supabase.from("saved_recipes").upsert(
    {
      user_id: user.id,
      recipe_slug: recipe.slug,
      recipe_title: recipe.title,
      recipe_image: recipe.image,
      recipe_intro: recipe.intro,
      recipe_time: recipe.time,
      recipe_meal_type: recipe.mealType,
      recipe_dietary: recipe.dietary,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "user_id,recipe_slug",
    },
  );

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: true,
    error: null,
  };
}

export async function removeRecipeFromRegulars(recipeSlug: string) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      success: false,
      error: "You need to be signed in to remove meals from My Kitchen.",
    };
  }

  const { error } = await supabase
    .from("saved_recipes")
    .delete()
    .eq("user_id", user.id)
    .eq("recipe_slug", recipeSlug);

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: true,
    error: null,
  };
}
