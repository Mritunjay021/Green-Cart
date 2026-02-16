import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function getIngredients(dish: string){
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      temperature: 0,
      topP: 1,
      maxOutputTokens: 300,
    },
  });

  const prompt = `
You are a cooking assistant.

Task:
Return the COMPLETE list of RAW ingredients required to prepare "${dish}".

Rules:
- Include ALL commonly used ingredients.
- Return ONLY a comma-separated list.
- No explanations, no numbering, no line breaks.
- Do not stop early.

Begin now.
`.trim();

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  if (!text) {
    throw new Error("Empty response from Gemini");
  }

  return text.trim();
}
