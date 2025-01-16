"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { create } from "./actions";
import { toast } from "sonner";

export default function AddTweet() {
  const [tweetUrl, setTweetUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Basic URL validation
      if (!tweetUrl.includes("twitter.com") && !tweetUrl.includes("x.com")) {
        toast.error("Invalid tweet URL");
        return;
      }

      const result = await create(tweetUrl);

      if (result.error) {
        if (
          result.error.message.includes(
            "duplicate key value violates unique constraint"
          )
        ) {
          toast.error("Post already exists");
        } else {
          toast.error(result.error.message);
        }
      } else {
        toast.success("Post scraped and stored");
        setTweetUrl(""); // Clear the input on success
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Error processing tweet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container h-screen mx-auto max-w-2xl py-8 mt-24">
      <h1 className="text-2xl font-bold mb-6">Add a post</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="tweetUrl" className="text-sm font-medium">
            Tweet URL
          </label>
          <Input
            id="tweetUrl"
            placeholder="https://twitter.com/username/status/123456789"
            value={tweetUrl}
            onChange={(e) => setTweetUrl(e.target.value)}
            required
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Processing..." : "Add post"}
        </Button>
      </form>
    </div>
  );
}
