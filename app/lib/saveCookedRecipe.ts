import { supabase } from "./supabaseClient";

export async function saveCookedRecipe(recipeSlug: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: "No logged in user",
    };
  }

  const { error } = await supabase.from("cooked_recipes").insert({
    user_id: user.id,
    recipe_slug: recipeSlug,
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: true,
  };
}
