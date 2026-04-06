import { supabase } from "./supabaseClient";

// Save or update a user's planner data
export async function savePlanner(userId: string, plannerState: any) {
  const { error } = await supabase
    .from("planners")
    .upsert({ user_id: userId, data: plannerState, updated_at: new Date() });

  if (error) console.error("Error saving planner:", error);
}

// Load a user's planner data
export async function loadPlanner(userId: string) {
  const { data, error } = await supabase
    .from("planners")
    .select("data")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Error loading planner:", error);
    return null;
  }

  return data?.data ?? null;
}
