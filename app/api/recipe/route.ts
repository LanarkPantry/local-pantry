import OpenAI from "openai";
import { NextResponse } from "next/server";

type GeneratedRecipe = {
  title: string;
  description: string;
  ingredientsUsed: string[];
  pantryStaples: string[];
  steps: string[];
};

type RecipeApiSuccess = {
  recipe: GeneratedRecipe;
  imageUrl: string | null;
};

type PreviousRecipe = {
  title: string;
  description: string;
  ingredientsUsed: string[];
};

type MealDirection = {
  key: string;
  label: string;
  instruction: string;
};

const quickStartPromptMap: Record<string, string> = {
  "quick-tonight":
    "Keep it especially quick and straightforward. Aim for something realistic for a weeknight, with minimal prep, a short ingredient list, and no unnecessary steps. Favour one-pan, one-pot, quick roast, quick boil, or quick assembly approaches.",
  comforting:
    "Lean into something warm, satisfying, and comforting. Favour softer textures, deeper warmth, and meals that feel generous and cooked through rather than sharp or austere.",
  "use-what-ive-got":
    "Prioritise making the most of the provided ingredients. Keep it flexible, forgiving, and practical, with as little waste and as few extra additions as possible.",
};

const MEAL_DIRECTIONS: MealDirection[] = [
  {
    key: "roast-plate",
    label: "roast plate",
    instruction:
      "Take it in the direction of a roasted plate or tray-led supper with strong contrast and a clear finishing touch.",
  },
  {
    key: "warm-bowl",
    label: "warm bowl",
    instruction:
      "Take it in the direction of a warm bowl with a clear base, a topping, and a spoonable or dolloped finish.",
  },
  {
    key: "soup-stew",
    label: "soup or brothy pot",
    instruction:
      "Take it in the direction of a soup, brothy pot, or light stew that still feels substantial enough for a meal.",
  },
  {
    key: "pasta-grain",
    label: "pasta or grain-led meal",
    instruction:
      "Take it in the direction of a pasta, orzo, couscous, rice, farro, or lentil-led meal with a strong sense of structure.",
  },
  {
    key: "toast-tartine",
    label: "toast or tartine supper",
    instruction:
      "Take it in the direction of a toast, tartine, or open-faced supper with something piled on top and a good contrast in texture.",
  },
  {
    key: "bake-gratin",
    label: "bake or gratin",
    instruction:
      "Take it in the direction of a simple bake, gratin, or oven-finished dish that feels a little special but still realistic.",
  },
];

function normaliseList(value: unknown, maxItems: number) {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => String(item).trim())
    .filter((item) => item.length > 0)
    .slice(0, maxItems);
}

function safeParseRecipe(outputText: string): GeneratedRecipe | null {
  try {
    const parsed = JSON.parse(outputText) as Partial<GeneratedRecipe>;

    if (
      !parsed ||
      typeof parsed.title !== "string" ||
      typeof parsed.description !== "string" ||
      !Array.isArray(parsed.ingredientsUsed) ||
      !Array.isArray(parsed.pantryStaples) ||
      !Array.isArray(parsed.steps)
    ) {
      return null;
    }

    return {
      title: parsed.title.trim(),
      description: parsed.description.trim(),
      ingredientsUsed: parsed.ingredientsUsed
        .map((item) => String(item).trim())
        .filter(Boolean),
      pantryStaples: parsed.pantryStaples
        .map((item) => String(item).trim())
        .filter(Boolean),
      steps: parsed.steps.map((item) => String(item).trim()).filter(Boolean),
    };
  } catch {
    return null;
  }
}

function inferPreviousDirection(previousRecipe?: PreviousRecipe | null) {
  if (!previousRecipe) return null;

  const text = [
    previousRecipe.title,
    previousRecipe.description,
    ...(previousRecipe.ingredientsUsed ?? []),
  ]
    .join(" ")
    .toLowerCase();

  if (
    text.includes("soup") ||
    text.includes("broth") ||
    text.includes("stew")
  ) {
    return "soup-stew";
  }

  if (
    text.includes("toast") ||
    text.includes("tartine") ||
    text.includes("open sandwich")
  ) {
    return "toast-tartine";
  }

  if (
    text.includes("bake") ||
    text.includes("gratin") ||
    text.includes("crumb")
  ) {
    return "bake-gratin";
  }

  if (
    text.includes("pasta") ||
    text.includes("orzo") ||
    text.includes("rice") ||
    text.includes("farro") ||
    text.includes("couscous") ||
    text.includes("lentil")
  ) {
    return "pasta-grain";
  }

  if (
    text.includes("bowl") ||
    text.includes("yoghurt") ||
    text.includes("beans") ||
    text.includes("warm salad")
  ) {
    return "warm-bowl";
  }

  if (
    text.includes("roast") ||
    text.includes("tray") ||
    text.includes("crispy")
  ) {
    return "roast-plate";
  }

  return null;
}

function pickMealDirection(
  items: string[],
  quickStart: string,
  previousRecipe?: PreviousRecipe | null,
) {
  const previousDirection = inferPreviousDirection(previousRecipe);

  const availableDirections = MEAL_DIRECTIONS.filter(
    (direction) => direction.key !== previousDirection,
  );

  const pool =
    availableDirections.length > 0 ? availableDirections : MEAL_DIRECTIONS;

  const seedSource = `${items.join("|")}::${quickStart}::${Date.now()}`;
  let seed = 0;

  for (const char of seedSource) {
    seed += char.charCodeAt(0);
  }

  const selected = pool[seed % pool.length];
  return selected;
}

async function generateRecipe(
  client: OpenAI,
  items: string[],
  quickStart: string,
  preferences: string[],
  previousRecipe?: PreviousRecipe | null,
) {
  const quickStartInstruction = quickStartPromptMap[quickStart] ?? "";
  const preferencesInstruction =
    preferences.length > 0
      ? `Respect these user preferences where reasonably possible: ${preferences.join(", ")}.`
      : "";

  const mealDirection = pickMealDirection(items, quickStart, previousRecipe);

  const previousRecipeInstruction = previousRecipe
    ? `
The user has already seen a previous idea.
Previous idea title: ${previousRecipe.title}
Previous idea description: ${previousRecipe.description}
Previous idea ingredients: ${previousRecipe.ingredientsUsed.join(", ")}

This new idea must feel clearly different from that previous one.
Do not return a near-match.
Change the format, structure, and cooking method.
Avoid repeating the same meal shape, title pattern, or main finishing idea.
`
    : "";

  const response = await client.responses.create({
    model: "gpt-5.4-mini",
    instructions: `
You are a warm, practical recipe writer for a premium local grocery shop.

Create one simple, realistic recipe based mainly on the provided ingredients.
You may include up to 3 common pantry staples such as salt, pepper, oil, butter, flour, or water if needed.
Keep the tone grounded, useful, and quietly confident.
Make the recipe feel like a genuinely good local food idea, not a chef demo and not an AI gimmick.
Avoid overly complicated techniques or niche ingredients.
Prefer ideas that make sense from a few shop products being combined together, not only one ingredient.

Aim for a little surprise and contrast in the idea while keeping it fully cookable on a normal weeknight.
The title should feel specific and appetising, not generic.
The description should explain what makes the meal good and why the combination works.

Use this meal direction:
${mealDirection.instruction}

Avoid defaulting to generic fallback ideas unless they are truly the best fit.
Do not drift into the same obvious pasta, traybake, or bowl every time.
${quickStartInstruction}
${preferencesInstruction}
${previousRecipeInstruction}

Return valid JSON only.
    `.trim(),
    input: `
Ingredients: ${items.join(", ")}
Quick start style: ${quickStart || "none"}
Preferences: ${preferences.length > 0 ? preferences.join(", ") : "none"}
Meal direction: ${mealDirection.label}
    `.trim(),
    text: {
      format: {
        type: "json_schema",
        name: "pantry_recipe",
        strict: true,
        schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            ingredientsUsed: {
              type: "array",
              items: { type: "string" },
            },
            pantryStaples: {
              type: "array",
              items: { type: "string" },
            },
            steps: {
              type: "array",
              items: { type: "string" },
            },
          },
          required: [
            "title",
            "description",
            "ingredientsUsed",
            "pantryStaples",
            "steps",
          ],
        },
      },
    },
  });

  const recipe = safeParseRecipe(response.output_text);

  if (!recipe) {
    throw new Error("Recipe output could not be parsed.");
  }

  return recipe;
}

async function generateRecipeImage(client: OpenAI, recipeTitle: string) {
  try {
    const imagePrompt = `A beautiful, realistic food photograph of ${recipeTitle}. Styled like premium editorial food photography. Natural light, elegant plating, warm inviting tones, appetising and believable. No text, no labels, no collage, no split screen.`;

    const imageResponse = await client.images.generate({
      model: "gpt-image-1.5",
      prompt: imagePrompt,
      size: "1024x1024",
      quality: "medium",
      output_format: "png",
    });

    const imageBase64 = imageResponse.data?.[0]?.b64_json ?? null;

    return imageBase64 ? `data:image/png;base64,${imageBase64}` : null;
  } catch (error) {
    console.error("Recipe image generation failed:", error);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "OPENAI_API_KEY is missing. Add it in your Vercel project environment variables.",
        },
        { status: 500 },
      );
    }

    const client = new OpenAI({ apiKey });

    const body = await request.json();

    const cleanedItems = Array.from(
      new Set(normaliseList(body.items, 20)),
    ).slice(0, 20);

    const quickStart =
      typeof body.quickStart === "string" ? body.quickStart : "";

    const preferences = normaliseList(body.preferences, 8);

    const previousRecipe =
      body.previousRecipe &&
      typeof body.previousRecipe === "object" &&
      typeof body.previousRecipe.title === "string" &&
      typeof body.previousRecipe.description === "string"
        ? {
            title: body.previousRecipe.title.trim(),
            description: body.previousRecipe.description.trim(),
            ingredientsUsed: normaliseList(
              body.previousRecipe.ingredientsUsed,
              12,
            ),
          }
        : null;

    if (cleanedItems.length === 0) {
      return NextResponse.json(
        { error: "No ingredients were provided." },
        { status: 400 },
      );
    }

    const recipe = await generateRecipe(
      client,
      cleanedItems,
      quickStart,
      preferences,
      previousRecipe,
    );

    const imageUrl = await generateRecipeImage(client, recipe.title);

    const payload: RecipeApiSuccess = {
      recipe,
      imageUrl,
    };

    return NextResponse.json(payload);
  } catch (error: any) {
    console.error("Recipe generation failed:", error);

    if (error?.status === 429 || error?.code === "insufficient_quota") {
      return NextResponse.json(
        {
          error:
            "Your AI recipe feature is connected, but your OpenAI API account does not currently have available quota or billing set up yet.",
        },
        { status: 429 },
      );
    }

    if (error?.status === 401) {
      return NextResponse.json(
        {
          error:
            "Your OpenAI API key was rejected. Check that the key is correct in your Vercel environment variables.",
        },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { error: "Something went wrong while generating the recipe." },
      { status: 500 },
    );
  }
}
