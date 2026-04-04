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

const PRODUCE_BOX_REFERENCE = {
  staples: [
    "potatoes",
    "carrots",
    "garlic",
    "onion",
    "broccoli",
    "peppers",
    "cucumber",
    "lettuce",
    "spinach",
    "banana",
    "grapes",
    "apple",
    "oranges",
    "kale",
    "pineapple",
    "melon",
    "strawberry",
    "raspberry",
    "basil",
    "coriander",
    "thyme",
    "rosemary",
  ],
  seasonal: [
    "jerusalem artichoke",
    "dragon fruit",
    "pear",
    "kiwi",
    "lemons",
    "lime",
  ],
};

const COMMON_SUPPORT_INGREDIENTS = [
  "salt",
  "pepper",
  "oil",
  "butter",
  "water",
  "flour",
  "bread",
  "toast",
  "pasta",
  "rice",
  "orzo",
  "couscous",
  "lentils",
  "beans",
  "stock",
  "yoghurt",
  "cream",
  "cheese",
  "eggs",
  "lemon",
  "lime",
  "herbs",
];

const OVERUSED_BOX_DEFAULTS = ["apple", "carrot", "leek", "leeks", "onion"];

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

  return pool[seed % pool.length];
}

function buildProduceBoxInstruction(items: string[]) {
  const lowerItems = items.map((item) => item.toLowerCase());

  const produceBoxSignals = [
    "veg box",
    "vegetable box",
    "produce box",
    "fruit and veg box",
    "fruit box",
    "weekly box",
    "mixed box",
    "local box",
  ];

  const matchedKnownProduceCount = PRODUCE_BOX_REFERENCE.staples
    .concat(PRODUCE_BOX_REFERENCE.seasonal)
    .filter((ingredient) =>
      lowerItems.some((item) => item.includes(ingredient.toLowerCase())),
    ).length;

  const mentionsProduceBox = lowerItems.some((item) =>
    produceBoxSignals.some((signal) => item.includes(signal)),
  );

  const looksLikeMixedProduceSelection =
    matchedKnownProduceCount >= 4 || lowerItems.length >= 6;

  if (!mentionsProduceBox && !looksLikeMixedProduceSelection) {
    return "";
  }

  return `
If the ingredients suggest a weekly veg box, produce box, or mixed fruit and veg selection, treat it as a varied local weekly box rather than a narrow set of just a few defaults.

In the background, assume that a typical box can include a broad rotating mix such as:
${PRODUCE_BOX_REFERENCE.staples.join(", ")}.

Seasonal produce may also appear, such as:
${PRODUCE_BOX_REFERENCE.seasonal.join(", ")}.

Use that wider produce context quietly in the recipe logic, without mentioning any box logic or long ingredient lists in the output.

Important:
- Do not over-default to apple, carrot, leek, or onion-led recipes.
- Onion and garlic can support a dish, but they should not keep becoming the main idea unless clearly warranted.
- Apple, carrot, and leek should usually be supporting players unless the user clearly selected them.
- Vary the hero ingredients across recipes.
- Sometimes let greens, roots, broccoli, peppers, herbs, cucumber, lettuce, or fruit shape the direction.
- Seasonal produce should feel normal when relevant, not token or novelty-led.
- If the box size is larger, think in terms of more quantity, not a different style of ingredients.
- Keep recipes practical, appealing, and realistic for a normal week.
`.trim();
}

function buildIngredientPriorityInstruction(items: string[], isRetry: boolean) {
  const lowerItems = items.map((item) => item.toLowerCase());
  const userIncludedOverusedDefaults = OVERUSED_BOX_DEFAULTS.filter(
    (ingredient) => lowerItems.some((item) => item.includes(ingredient)),
  );

  const guardedDefaults =
    userIncludedOverusedDefaults.length > 0
      ? ""
      : `
Very important:
- Do not introduce apple, carrot, leek, or onion as the lead idea when they were not provided.
- Do not let apple, carrot, or leek hijack the recipe just because they are common in a produce box.
`;

  return `
The provided ingredients are the anchor for this recipe: ${items.join(", ")}.

Very important:
- Centre the recipe on the ingredients the user actually provided.
- The main idea must come from those provided ingredients, not from substitute produce.
- Do not swap in unrelated fruit or vegetables just because they are common in a weekly box.
- If the user gives fruit, nuts, dairy, herbs, or sweeter ingredients, follow that lead rather than forcing a savoury veg-box idea.
- Ingredients used should mostly come directly from the provided items, with only a small number of sensible supporting additions if needed.
- Never replace obvious hero ingredients with unrelated produce.
- The title and description should reflect the actual ingredients given.
${guardedDefaults}
${
  isRetry
    ? `Your previous attempt drifted away from the provided ingredients or overused common veg-box defaults. This retry must stay much closer to the supplied ingredients and avoid falling back to apple, carrot, leek, or onion unless they were explicitly provided and truly central.`
    : ""
}
`.trim();
}

function isIngredientMatch(usedIngredient: string, providedItems: string[]) {
  const used = usedIngredient.toLowerCase().trim();

  return providedItems.some((item) => {
    const provided = item.toLowerCase().trim();
    return provided.includes(used) || used.includes(provided);
  });
}

function isCommonSupportIngredient(usedIngredient: string) {
  const used = usedIngredient.toLowerCase().trim();

  return COMMON_SUPPORT_INGREDIENTS.some(
    (support) => support.includes(used) || used.includes(support),
  );
}

function recipeOverusesDefaults(recipe: GeneratedRecipe, items: string[]) {
  const providedItems = items.map((item) => item.toLowerCase());
  const overusedNotProvided = recipe.ingredientsUsed.filter((ingredient) => {
    const lowerIngredient = ingredient.toLowerCase();

    const isOverusedDefault = OVERUSED_BOX_DEFAULTS.some(
      (defaultItem) =>
        lowerIngredient.includes(defaultItem) ||
        defaultItem.includes(lowerIngredient),
    );

    if (!isOverusedDefault) {
      return false;
    }

    const wasProvided = providedItems.some(
      (item) =>
        item.includes(lowerIngredient) || lowerIngredient.includes(item),
    );

    return !wasProvided;
  });

  const titleAndDescription =
    `${recipe.title} ${recipe.description}`.toLowerCase();

  const titleLeadsWithDefault = OVERUSED_BOX_DEFAULTS.some((ingredient) =>
    titleAndDescription.includes(ingredient),
  );

  return overusedNotProvided.length >= 2 || titleLeadsWithDefault;
}

function isRecipeGroundedInItems(recipe: GeneratedRecipe, items: string[]) {
  const providedItems = items.map((item) => item.toLowerCase());
  const recipeIngredients = recipe.ingredientsUsed.map((item) =>
    item.toLowerCase(),
  );

  let directMatches = 0;
  let unsupportedIngredients = 0;

  for (const usedIngredient of recipeIngredients) {
    if (isIngredientMatch(usedIngredient, providedItems)) {
      directMatches += 1;
      continue;
    }

    if (!isCommonSupportIngredient(usedIngredient)) {
      unsupportedIngredients += 1;
    }
  }

  const titleAndDescription =
    `${recipe.title} ${recipe.description}`.toLowerCase();

  const mentionsProvidedIngredient = providedItems.some(
    (item) => item.length > 2 && titleAndDescription.includes(item),
  );

  if (recipeOverusesDefaults(recipe, items)) {
    return false;
  }

  if (providedItems.length <= 4) {
    return (
      directMatches >= 2 &&
      unsupportedIngredients <= 1 &&
      mentionsProvidedIngredient
    );
  }

  return directMatches >= 3 && unsupportedIngredients <= 2;
}

async function requestRecipe(
  client: OpenAI,
  items: string[],
  quickStart: string,
  preferences: string[],
  previousRecipe: PreviousRecipe | null | undefined,
  isRetry: boolean,
) {
  const quickStartInstruction = quickStartPromptMap[quickStart] ?? "";
  const preferencesInstruction =
    preferences.length > 0
      ? `Respect these user preferences where reasonably possible: ${preferences.join(", ")}.`
      : "";

  const mealDirection = pickMealDirection(items, quickStart, previousRecipe);
  const produceBoxInstruction = buildProduceBoxInstruction(items);
  const ingredientPriorityInstruction = buildIngredientPriorityInstruction(
    items,
    isRetry,
  );

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
${produceBoxInstruction}
${ingredientPriorityInstruction}
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

async function generateRecipe(
  client: OpenAI,
  items: string[],
  quickStart: string,
  preferences: string[],
  previousRecipe?: PreviousRecipe | null,
) {
  const firstRecipe = await requestRecipe(
    client,
    items,
    quickStart,
    preferences,
    previousRecipe,
    false,
  );

  if (isRecipeGroundedInItems(firstRecipe, items)) {
    return firstRecipe;
  }

  const retryRecipe = await requestRecipe(
    client,
    items,
    quickStart,
    preferences,
    previousRecipe,
    true,
  );

  if (isRecipeGroundedInItems(retryRecipe, items)) {
    return retryRecipe;
  }

  return retryRecipe;
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
