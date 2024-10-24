"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { MOCK_RESULTS } from "@/lib/mock-data";

export function SearchForm() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    window.dispatchEvent(new CustomEvent('searchStart'));

    // Simulate API call delay
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('searchResults', { 
        detail: MOCK_RESULTS 
      }));
      setIsSearching(false);
    }, 2000);
  };

  return (
    <form onSubmit={handleSearch} className="space-y-4">
      <Textarea
        placeholder="Describe your ideal app. For example: I need a privacy-focused note-taking app with markdown support, offline capabilities, and end-to-end encryption..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="min-h-[150px] text-base"
      />
      <Button 
        type="submit" 
        className="w-full sm:w-auto"
        disabled={isSearching}
      >
        <Search className="mr-2 h-4 w-4" />
        {isSearching ? "Searching..." : "Search Apps"}
      </Button>
    </form>
  );
}