import OpenAI from "openai";

import { NextResponse } from "next/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
  const { ingredients } = await request.json();

  try {
    const prompt = `Generate a detailed recipe using the following ingredients: ${ingredients}. Include the recipe name, ingredients, and step-by-step instructions.`;
        // For each ingredient, provide an Amazon purchase link and a Flipkart purchase link. 
    // Format the response as follows:
    // - Recipe: [generated recipe steps]
    // - Purchase Links:
    //   - [Ingredient 1]: Amazon - [link], Flipkart - [link]
    //   - [Ingredient 2]: Amazon - [link], Flipkart - [link]
    //   - ...`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
    });

    const recipe = response.choices[0].message.content;
    return NextResponse.json({ recipe });
  } catch (error) {
    console.error("Error generating recipe:", error);
    return NextResponse.json(
      { error: "Failed to generate recipe" },
      { status: 500 }
    );
  }
}
