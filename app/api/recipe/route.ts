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

const quickStartPromptMap: Record<string, string> = {
  "quick-tonight":
    "Keep it especially quick and straightforward, ideally something that feels realistic for a weeknight and avoids unnecessary steps.",
  comforting:
    "Lean into something warm, cosy, satisfying, and comforting, while still feeling elegant and believable.",
  "use-what-ive-got":
    "Prioritise making the most of the provided ingredients and minimise extra additions or waste.",
};

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

async function generateRecipe(
  client: OpenAI,
  items: string[],
  quickStart: string,
  preferences: string[],
) {
  const quickStartInstruction = quickStartPromptMap[quickStart] ?? "";
  const preferencesInstruction =
    preferences.length > 0
      ? `Respect these user preferences where reasonably possible: ${preferences.join(", ")}.`
      : "";

  const response = await client.responses.create({
    model: "gpt-5.4-mini",
    instructions: `
You are a warm, practical recipe writer for a premium local grocery shop.

Create one simple, realistic recipe based mainly on the provided ingredients.
You may include up to 3 common pantry staples such as salt, pepper, oil, butter, flour, or water if needed.
Keep the tone elegant, calm, and helpful.
Make the recipe feel useful for a real customer, not like a chef demo.
Avoid overly complicated techniques or niche ingredients.
Prefer ideas that make sense from a few shop products being combined together, not only one ingredient.
${quickStartInstruction}
${preferencesInstruction}
    `.trim(),
    input: `
Ingredients: ${items.join(", ")}
Quick start style: ${quickStart || "none"}
Preferences: ${preferences.length > 0 ? preferences.join(", ") : "none"}
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
