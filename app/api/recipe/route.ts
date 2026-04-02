import OpenAI from "openai";
import { NextResponse } from "next/server";

type GeneratedRecipe = {
  title: string;
  description: string;
  ingredientsUsed: string[];
  pantryStaples: string[];
  steps: string[];
};

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
    const items = Array.isArray(body.items) ? body.items : [];

    if (items.length === 0) {
      return NextResponse.json(
        { error: "No basket items were provided." },
        { status: 400 },
      );
    }

    const cleanedItems = (items as unknown[])
      .map((item: unknown) => String(item).trim())
      .filter((item): item is string => item.length > 0)
      .slice(0, 12);

    const recipeResponse = await client.responses.create({
      model: "gpt-5.4",
      instructions:
        "You are a warm, practical recipe writer for a premium local grocery shop. Create one simple, realistic recipe based mainly on the provided basket items. You may include up to 3 common pantry staples such as salt, pepper, oil, butter, flour, or water if needed. Keep the tone elegant and helpful.",
      input: `Basket items: ${cleanedItems.join(", ")}`,
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

    const recipe = JSON.parse(recipeResponse.output_text) as GeneratedRecipe;

    const imagePrompt = `A beautiful, realistic food photograph of ${recipe.title}. 
Styled like premium editorial food photography. 
Natural light, elegant plating, warm inviting tones, appetising and believable. 
No text, no labels, no collage, no split screen.`;

    const imageResponse = await client.images.generate({
      model: "gpt-image-1.5",
      prompt: imagePrompt,
      size: "1024x1024",
      quality: "medium",
      output_format: "png",
    });

    const imageBase64 = imageResponse.data?.[0]?.b64_json ?? null;
    const imageUrl = imageBase64
      ? `data:image/png;base64,${imageBase64}`
      : null;

    return NextResponse.json({
      recipe,
      imageUrl,
    });
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

    return NextResponse.json(
      { error: "Something went wrong while generating the recipe." },
      { status: 500 },
    );
  }
}
