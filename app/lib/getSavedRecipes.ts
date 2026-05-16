import { supabase } from "./supabaseClient";
import { recipes } from "../recipes/recipes-data";

export async function getSavedRecipes() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("saved_recipes")
    .select("recipe_slug")
    .eq("user_id", user.id);

  if (error || !data) {
    return [];
  }

  const slugSet = new Set(data.map((item) => item.recipe_slug));

  return recipes.filter((recipe) => slugSet.has(recipe.slug));
}
