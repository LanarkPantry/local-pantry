import { supabase } from "./supabaseClient";

type SaveWeekMeal = {
  day: string;
  recipeSlug: string;
};

export async function saveWeek({
  name,
  plannerStyle,
  nights,
  meals,
}: {
  name: string;
  plannerStyle: string;
  nights: number;
  meals: SaveWeekMeal[];
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: "No logged in user",
    };
  }

  const { data: savedWeek, error: weekError } = await supabase
    .from("saved_weeks")
    .insert({
      user_id: user.id,
      name,
      planner_style: plannerStyle,
      nights,
    })
    .select()
    .single();

  if (weekError || !savedWeek) {
    return {
      success: false,
      error: weekError?.message ?? "Could not create saved week",
    };
  }

  const mealRows = meals.map((meal, index) => ({
    saved_week_id: savedWeek.id,
    user_id: user.id,
    day_label: meal.day,
    recipe_slug: meal.recipeSlug,
    position: index,
  }));

  const { error: mealsError } = await supabase
    .from("saved_week_meals")
    .insert(mealRows);

  if (mealsError) {
    return {
      success: false,
      error: mealsError.message,
    };
  }

  return {
    success: true,
    savedWeekId: savedWeek.id,
  };
}
