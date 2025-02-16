import { z } from "zod";

const HF_API_URL = "https://huggingface.co/api/spaces";

// API response schema
const hfSpaceSchema = z.object({
  id: z.string(),
  author: z.string().optional(),
  title: z.string().optional(),
  sdk: z.string().optional(),
  tags: z.array(z.string()).optional(),
  likes: z.number().optional(),
  downloads: z.number().optional(),
  cardData: z.any().optional(),
}).passthrough();

export type HFSpace = z.infer<typeof hfSpaceSchema>;

async function fetchWithRetry(url: string, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
      if (response.status === 429) {
        // Rate limited, wait longer
        await new Promise(resolve => setTimeout(resolve, (i + 1) * 1000));
        continue;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    } catch (error) {
      if (i === retries - 1) throw error;
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  throw new Error('Failed to fetch after retries');
}

export async function fetchSpaces(limit = 100): Promise<HFSpace[]> {
  try {
    const response = await fetchWithRetry(`${HF_API_URL}?limit=${limit}`);
    const data = await response.json();
    return z.array(hfSpaceSchema).parse(data);
  } catch (error) {
    console.error('Error fetching spaces:', error);
    throw error;
  }
}
