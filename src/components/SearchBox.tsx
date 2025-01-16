import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBoxProps {
  isExpanded: boolean;
  onSearch: (
    query: string,
    searchType: "fulltext" | "semantic" | "hybrid"
  ) => void;
}

export function SearchBox({ isExpanded, onSearch }: SearchBoxProps) {
  const [query, setQuery] = useState("");

  return (
    <motion.div
      initial={false}
      animate={{
        y: isExpanded ? 0 : "40vh",
      }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="w-full max-w-2xl mx-auto"
    >
      <form
        className="flex flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          onSearch(query, "hybrid");
        }}
      >
        <Input
          type="text"
          placeholder="Search posts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
        />
        <div className="flex gap-2 flex-row justify-center">
          <Button type="button" onClick={() => onSearch(query, "fulltext")}>
            Exact search
          </Button>
          <Button type="button" onClick={() => onSearch(query, "semantic")}>
            Smart search
          </Button>
          <Button type="button" onClick={() => onSearch(query, "hybrid")}>
            I Don&apos;t Know
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
