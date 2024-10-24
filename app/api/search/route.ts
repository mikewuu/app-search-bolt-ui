import { NextResponse } from "next/server";
import { searchSimilar } from "@/lib/vector-store";
import { OpenAI } from "langchain/llms/openai";

const model = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  temperature: 0.3,
});

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    
    // Search both Product Hunt and HN indices
    const [phResults, hnResults] = await Promise.all([
      searchSimilar(query, "producthunt-apps"),
      searchSimilar(query, "hackernews-apps"),
    ]);
    
    // Combine and sort results
    const allResults = [...phResults, ...hnResults].sort(
      (a, b) => b.score - a.score
    );
    
    // Generate match reasons for each result
    const resultsWithReasons = await Promise.all(
      allResults.map(async (result) => {
        const matchReasons = await model.call(
          `Given the user query "${query}" and the app "${result.metadata.title}", 
           list 3 specific reasons why this app matches the user's needs. 
           Format as a JSON array of strings.`
        );
        
        return {
          ...result.metadata,
          matchScore: result.score,
          matchReasons: JSON.parse(matchReasons),
        };
      })
    );
    
    return NextResponse.json(resultsWithReasons);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}