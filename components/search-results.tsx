"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExternalLink, Search, Sparkles, User, ChevronDown, ChevronUp, Percent } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SparklesCore } from "@/components/ui/sparkles";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { format } from "date-fns";
import { MOCK_RESULTS } from "@/lib/mock-data";

interface Review {
  author: string;
  rating: number;
  date: string;
  text: string;
}

interface Creator {
  name: string;
  description: string;
  location: string;
}

interface Pricing {
  type: "free" | "freemium" | "subscription";
  free: boolean;
  price?: number;
  period?: string;
  details: string;
}

interface SearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail?: string;
  launchDate: string;
  matchScore: number;
  matchReasons: string[];
  pricing: Pricing;
  creator: Creator;
  reviews: Review[];
}

export function SearchResults() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const handleSearchResults = (event: CustomEvent<SearchResult[]>) => {
      setIsSearching(false);
      setResults(event.detail);
      setIsVisible(true);
    };

    const handleSearchStart = () => {
      setIsSearching(true);
      setIsVisible(true);
      setResults([]);
    };

    window.addEventListener('searchStart', handleSearchStart as EventListener);
    window.addEventListener('searchResults', handleSearchResults as EventListener);

    // For demo purposes, simulate search results after 2 seconds
    const demoTimeout = setTimeout(() => {
      if (isSearching) {
        setResults(MOCK_RESULTS);
        setIsSearching(false);
      }
    }, 2000);

    return () => {
      window.removeEventListener('searchStart', handleSearchStart as EventListener);
      window.removeEventListener('searchResults', handleSearchResults as EventListener);
      clearTimeout(demoTimeout);
    };
  }, [isSearching]);

  const closeModal = () => {
    setIsVisible(false);
    setResults([]);
    setExpandedReviews({});
  };

  const toggleReviews = (id: string) => {
    setExpandedReviews(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const formatPrice = (pricing: Pricing) => {
    if (pricing.free && pricing.type === "free") return "Free";
    if (pricing.free && pricing.type === "freemium") return `Free, ${pricing.price}/${pricing.period?.charAt(0)} Pro`;
    return `$${pricing.price}/${pricing.period?.charAt(0)}`;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <>
          {/* Backdrop with Sparkles */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
            onClick={closeModal}
          >
            <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />
            <SparklesCore
              id="search-sparkles"
              background="transparent"
              minSize={0.4}
              maxSize={1}
              particleDensity={100}
              className="w-full h-full absolute inset-0"
              particleColor="#2563eb"
            />
          </motion.div>

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-x-4 top-20 bottom-4 z-50 mx-auto max-w-4xl bg-background/70 backdrop-blur-md rounded-xl shadow-lg border"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b bg-background/50">
              <h2 className="text-2xl font-semibold">
                {isSearching ? "Searching Apps..." : "Search Results"}
              </h2>
              <Button
                onClick={closeModal}
                variant="outline"
                className="gap-2"
              >
                <Search className="h-4 w-4" />
                Search Again
              </Button>
            </div>

            {/* Modal Content */}
            <ScrollArea className="h-[calc(100%-5rem)] rounded-b-xl">
              <div className="p-6 space-y-6">
                {isSearching ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-12 space-y-6"
                  >
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 360]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    >
                      <Sparkles className="w-12 h-12 text-blue-500" />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center space-y-2"
                    >
                      <h3 className="text-xl font-semibold">AI is analyzing your request</h3>
                      <p className="text-muted-foreground">Finding the perfect apps that match your needs...</p>
                    </motion.div>
                  </motion.div>
                ) : (
                  results.map((result, index) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="p-6 hover:shadow-lg transition-shadow bg-background/80 backdrop-blur-sm relative">
                        {/* Match Score Badge */}
                        <div className="absolute -top-3 -right-3 bg-blue-500 text-white rounded-full p-3 shadow-lg flex items-center gap-1">
                          <span className="text-lg font-bold">{Math.round(result.matchScore * 100)}</span>
                          <Percent className="h-4 w-4" />
                        </div>

                        <div className="space-y-6">
                          <div className="flex items-start gap-4">
                            {result.thumbnail && (
                              <div className="flex-shrink-0">
                                <Image
                                  src={result.thumbnail}
                                  alt={result.title}
                                  width={80}
                                  height={80}
                                  className="rounded-lg object-cover"
                                  priority={index < 2}
                                />
                              </div>
                            )}
                            <div className="flex-1 space-y-4">
                              <div>
                                <div className="flex items-start justify-between mb-2">
                                  <div className="space-y-1">
                                    <h3 className="text-xl font-semibold">
                                      {result.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                      Launched {format(new Date(result.launchDate), 'MMMM d, yyyy')}
                                    </p>
                                    <p className="text-muted-foreground">{result.description}</p>
                                  </div>
                                  <Badge 
                                    className="text-lg px-3 py-1 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
                                  >
                                    {formatPrice(result.pricing)}
                                  </Badge>
                                </div>
                                
                                <div className="flex items-center">
                                  <a
                                    href={result.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-sm hover:text-foreground transition-colors text-muted-foreground"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                    Visit Website
                                  </a>
                                </div>
                              </div>

                              <div className="pt-2">
                                <h4 className="text-sm font-medium mb-1">Why this matches:</h4>
                                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                  {result.matchReasons.map((reason, index) => (
                                    <li key={index}>{reason}</li>
                                  ))}
                                </ul>
                              </div>

                              <div className="border-t pt-4">
                                <div className="flex items-start gap-3">
                                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                                  <div className="space-y-1">
                                    <h4 className="text-sm font-medium">Created by {result.creator.name}</h4>
                                    <p className="text-sm text-muted-foreground">{result.creator.description}</p>
                                    <p className="text-sm text-muted-foreground">📍 {result.creator.location}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Reviews Section */}
                          <div className="border-t pt-4">
                            <Button
                              variant="ghost"
                              className="w-full justify-between"
                              onClick={() => toggleReviews(result.id)}
                            >
                              <span className="font-medium">
                                User Reviews ({result.reviews.length})
                              </span>
                              {expandedReviews[result.id] ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                            
                            <AnimatePresence>
                              {expandedReviews[result.id] && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <div className="space-y-4 pt-4">
                                    {result.reviews.map((review, idx) => (
                                      <div key={idx} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                            <span className="font-medium">{review.author}</span>
                                            <div className="flex">
                                              {renderStars(review.rating)}
                                            </div>
                                          </div>
                                          <span className="text-sm text-muted-foreground">
                                            {format(new Date(review.date), 'MMM d, yyyy')}
                                          </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                          {review.text}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>
            </ScrollArea>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}