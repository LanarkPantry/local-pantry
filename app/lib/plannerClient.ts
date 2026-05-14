import { supabase } from "./supabaseClient";

export async function savePlanner(userId: string, plannerState: unknown) {
  const { error } = await supabase.from("planners").upsert({
    user_id: userId,
    data: plannerState,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Error saving planner:", error);
    return { success: false, error };
  }

  return { success: true, error: null };
}

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
