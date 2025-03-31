import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
  const { imageUrl } = await request?.json();
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Generate a detailed recipe based on this image. Include the recipe name, ingredients, and step-by-step instructions.' },
            { type: 'image_url', image_url: { url: imageUrl } },
          ],
        },
      ],
      max_tokens: 1000,
    });

    const recipe = response.choices[0].message.content;
    return NextResponse.json({ recipe });
  } catch (error) {
    console.error('Error generating recipe from image:', error);
    return NextResponse.json({ error: 'Failed to generate recipe' }, { status: 500 });
  }
}