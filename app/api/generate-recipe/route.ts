import OpenAI from "openai";

import { NextResponse } from "next/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
  const { ingredients } = await request.json();

  try {
    const prompt = `Generate a detailed recipe using the following ingredients: ${ingredients}. Include the recipe name, ingredients, and step-by-step instructions.
        If you think recipe can not be generated because user has given invalid input simply ask user to clarify.
        For each main ingredient, provide:
        1. Blinkit purchase link (format exactly as "Blinkit: [http://blinkit.com/s/?q=tomato]")
        You can also provide amazon, flipkart purchase link
        Place links after the recipe instructions, under a "Purchase Links:" heading.`;
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
