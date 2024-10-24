import { NextResponse } from "next/server";
import { scrapeProductHunt } from "@/lib/scraping-service";
import { fetchHNPosts } from "@/lib/api-clients";
import { storeEmbeddings } from "@/lib/vector-store";
import { Client } from "@trigger.dev/sdk";

const client = new Client({
  id: process.env.TRIGGER_API_ID!,
  apiKey: process.env.TRIGGER_API_KEY!,
});

// Sync job that runs daily
client.defineJob({
  id: "sync-apps-data",
  name: "Sync Apps Data",
  version: "1.0.0",
  trigger: client.scheduleTrigger({
    cron: "0 0 * * *", // Run daily at midnight
  }),
  run: async () => {
    try {
      // Fetch new data
      const [phPosts, hnPosts] = await Promise.all([
        scrapeProductHunt(),
        fetchHNPosts(1),
      ]);
      
      // Store embeddings
      await Promise.all([
        storeEmbeddings(phPosts, "producthunt-apps"),
        storeEmbeddings(hnPosts, "hackernews-apps"),
      ]);
      
      return { success: true };
    } catch (error) {
      console.error("Sync error:", error);
      throw error;
    }
  },
});

export async function GET() {
  return NextResponse.json({ status: "Job scheduled" });
}