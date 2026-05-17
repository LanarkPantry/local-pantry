import { supabase } from "./supabaseClient";

export async function getRecentlyCookedSlugs(days = 14) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const cutoffDate = new Date();

  cutoffDate.setDate(cutoffDate.getDate() - days);

  const { data, error } = await supabase
    .from("cooked_recipes")
    .select("recipe_slug, cooked_at")
    .eq("user_id", user.id)
    .gte("cooked_at", cutoffDate.toISOString())
    .order("cooked_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return [...new Set(data.map((item) => item.recipe_slug))];
}
