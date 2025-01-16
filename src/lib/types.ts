export type Post = {
  id?: number;
  tweet_id: number;
  message: string;
  username: string;
  embedding: number[];
};

export type Tweet = {
  id: number;
  author_url: string;
  author_name: string;
  html: string;
};

export type SearchType = "fulltext" | "semantic" | "hybrid";
