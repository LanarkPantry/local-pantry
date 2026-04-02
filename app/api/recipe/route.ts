import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const items = Array.isArray(body.items) ? body.items : [];

    if (items.length === 0) {
      return NextResponse.json(
        { error: "No basket items were provided." },
        { status: 400 },
      );
    }

    const cleanedItems = items
      .map((item) => String(item).trim())
      .filter(Boolean)
      .slice(0, 12);

    const response = await client.responses.create({
      model: "gpt-5",
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
              title: {
                type: "string",
              },
              description: {
                type: "string",
              },
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

    const recipe = JSON.parse(response.output_text);

    return NextResponse.json({ recipe });
  } catch (error) {
    console.error("Recipe generation failed:", error);

    return NextResponse.json(
      { error: "Something went wrong while generating the recipe." },
      { status: 500 },
    );
  }
}
