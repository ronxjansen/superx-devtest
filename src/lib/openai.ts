"use server";

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

export async function generateEmbedding(text: string) {
  const chatCompletion = await client.embeddings.create({
    input: text,
    model: "text-embedding-3-small",
  });
  return chatCompletion.data[0].embedding;
}

export async function generateCompletion(prompt: string) {
  const chatCompletion = await client.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-4o-mini",
  });
  return chatCompletion.choices[0].message.content;
}
