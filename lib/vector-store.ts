import { PineconeClient } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

const pinecone = new PineconeClient();

export async function initVectorStore() {
  await pinecone.init({
    environment: process.env.PINECONE_ENVIRONMENT!,
    apiKey: process.env.PINECONE_API_KEY!,
  });
  return pinecone;
}

export async function storeEmbeddings(data: any[], indexName: string) {
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  });
  
  const index = pinecone.Index(indexName);
  
  // Convert data to vectors and store in Pinecone
  for (const item of data) {
    const vector = await embeddings.embedQuery(
      `${item.title} ${item.description}`
    );
    
    await index.upsert({
      vectors: [{
        id: item.id,
        values: vector,
        metadata: item,
      }],
    });
  }
}

export async function searchSimilar(query: string, indexName: string, topK: number = 10) {
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  });
  
  const index = pinecone.Index(indexName);
  const queryVector = await embeddings.embedQuery(query);
  
  const results = await index.query({
    vector: queryVector,
    topK,
    includeMetadata: true,
  });
  
  return results.matches;
}