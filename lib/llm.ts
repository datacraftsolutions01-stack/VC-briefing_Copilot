import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function summarizeWithGemini(deckText: string): Promise<string[]> {
  const model = gemini.getGenerativeModel({ model: "gemini-pro" });
  const prompt = `Summarize this startup pitch as 5 key bullet points:\n\n${deckText}`;
  const result = await model.generateContent(prompt);
  const text = result.response.text().replace(/^- /g, "").trim();
  return text.split("\n").map(line => line.replace(/^- /, "")).filter(Boolean);
}

export async function briefWithOpenAI(deckText: string, persona: string): Promise<string> {
  const chat = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: `You are a VC investor at ${persona}. Write a concise internal investment summary for the following pitch:` },
      { role: "user", content: deckText }
    ],
    max_tokens: 384,
    temperature: 0.4
  });
  return chat.choices[0].message.content || "";
}