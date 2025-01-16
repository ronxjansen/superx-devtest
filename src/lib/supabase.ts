"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Post } from "./types";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

export async function createPost(post: Post) {
  const supabase = await createClient();
  const res = await supabase.from("posts").insert(post);
  return res;
}

export async function searchPosts(
  query: string,
  embedding: number[],
  searchType: "fulltext" | "semantic" | "hybrid"
) {
  const supabase = await createClient();
  console.log("searchType", searchType);
  if (searchType === "fulltext") {
    return await supabase
      .from("posts")
      .select("*")
      .textSearch("message", query);
  } else if (searchType === "semantic") {
    return await supabase.rpc("semantic_search", {
      query_embedding: embedding,
      match_count: 10,
      match_threshold: 0.2,
    });
  } else if (searchType === "hybrid") {
    return await supabase.rpc("hybrid_search", {
      query_text: query,
      query_embedding: embedding,
      match_count: 20,
      full_text_weight: 2,
      semantic_weight: 1,
    });
  }
}
