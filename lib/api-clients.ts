import axios from "axios";

// Hacker News API client
export const hnClient = axios.create({
  baseURL: "https://hacker-news.firebaseio.com/v0",
});

export async function fetchHNPosts(days: number = 7) {
  const topStories = await hnClient.get("/topstories.json");
  const stories = await Promise.all(
    topStories.data
      .slice(0, 100)
      .map((id: number) => hnClient.get(`/item/${id}.json`))
  );
  return stories.map((s) => s.data);
}