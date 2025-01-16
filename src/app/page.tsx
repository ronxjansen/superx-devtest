// I would prefer to not use as much SSR, for now that is out of scope
"use client";

import { useState } from "react";
import { SearchBox } from "@/components/SearchBox";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Post, SearchType } from "@/lib/types";
import { search } from "@/app/actions";
import { toast } from "sonner";
import { Spinner } from "@/components/Spinner";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [isSearched, setIsSearched] = useState(false);
  const [results, setResults] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (query: string, searchType: SearchType) => {
    try {
      setIsSearched(true);
      setIsLoading(true);
      setResults([]);
      const results = await search(query, searchType);
      setResults(results?.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Error searching for tweets");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <Link href="/add" className="absolute right-0 top-0 p-2 ">
        <Button variant="outline" className="p-2">
          <PlusIcon className="h-5 w-5 text-black " />
          <span className="">Add posts</span>
        </Button>
      </Link>
      <SearchBox isExpanded={isSearched} onSearch={handleSearch} />
      {isLoading && <Spinner className="mx-auto my-8" />}
      <AnimatePresence>
        {isSearched && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto mt-8"
          >
            <div className="space-y-4">
              {!isLoading && results.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400">
                  No relevant posts found
                </p>
              )}
              {results.map((tweet) => (
                <div
                  key={tweet.id}
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-800"
                >
                  <div className="flex items-start space-x-3">
                    <Avatar>
                      <AvatarFallback>{tweet.username[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-semibold">
                            {tweet.username}
                          </span>
                          <span className="text-sm text-gray-500 ml-2">
                            {tweet.username}
                          </span>
                        </div>
                      </div>
                      <p className="mt-2 text-gray-900 dark:text-gray-100">
                        {tweet.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
