"use server";

import { createPost } from "@/lib/supabase";
import { Tweet } from "@/lib/types";
import { generateEmbedding } from "@/lib/openai";

async function fetchTweet(tweetUrl: string): Promise<Tweet> {
  // We expect the tweet url to be in the format of https://twitter.com/username/status/tweet_id - validation is out of scope for this project
  const response = await fetch(
    `https://publish.twitter.com/oembed?url=${tweetUrl}`
  );
  const data = await response.json();

  // parse the data.html so we can extract only the text
  const html = data.html;
  const text = html.replace(/<[^>]*>?/gm, "");

  const tweet_id = tweetUrl.split("/").pop();
  const id = Number(tweet_id);

  if (!tweet_id || isNaN(id)) {
    throw new Error("Invalid tweet URL: Could not extract valid tweet ID");
  }
  // We need to clean up the extract tweet, as it includes a bunch of html that we don't need - which would save tokens and db storage
  return {
    id,
    author_url: data.author_url,
    author_name: data.author_name,
    html: text, // this includes the author name, date and body
  };
}

export async function create(tweetUrl: string) {
  const tweet = await fetchTweet(tweetUrl);
  const embedding = await generateEmbedding(tweet.html);
  return await createPost({
    tweet_id: tweet.id,
    message: tweet.html,
    username: tweet.author_name,
    embedding,
  });
}
