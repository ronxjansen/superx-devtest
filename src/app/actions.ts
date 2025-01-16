"use server";

import { searchPosts } from "@/lib/supabase";
import { generateEmbedding } from "@/lib/openai";

export async function search(
  query: string,
  searchType: "fulltext" | "semantic" | "hybrid"
) {
  const embeddings = await generateEmbedding(query);
  return await searchPosts(query, embeddings, searchType);
}
