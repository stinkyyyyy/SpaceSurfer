import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { spaceSchema, filterSchema } from "@shared/schema";
import { z } from "zod";

const HF_API_URL = "https://huggingface.co/api/spaces";

// Define mock data for development
const MOCK_SPACES = [
  {
    id: "stabilityai/stable-diffusion",
    title: "Stable Diffusion Demo",
    author: "stabilityai",
    tags: ["text-to-image", "diffusion"],
    sdk: "gradio",
    type: "model",
    thumbnail: "https://placehold.co/600x400",
    likes: 1000,
  },
  {
    id: "openai/whisper",
    title: "Whisper Speech Recognition",
    author: "openai",
    tags: ["speech", "audio"],
    sdk: "streamlit",
    type: "model",
    thumbnail: "https://placehold.co/600x400",
    likes: 800,
  }
];

export async function registerRoutes(app: Express) {
  app.get("/api/spaces/random", async (req, res) => {
    try {
      const filters = filterSchema.parse(req.query);
      const space = await storage.getRandomSpace(filters);

      if (!space) {
        let spaces;

        try {
          // Use mock data in development
          if (process.env.NODE_ENV === "development") {
            spaces = MOCK_SPACES;
          } else {
            const response = await fetch(`${HF_API_URL}?limit=100`);
            if (!response.ok) {
              throw new Error(`HF API returned ${response.status}`);
            }
            spaces = await response.json();
          }

          // Cache valid spaces
          await Promise.all(spaces.map(async (space: any) => {
            try {
              const [username, repo] = (space.id || "").split('/');
              const validSpace = spaceSchema.parse({
                spaceId: space.id,
                title: space.title || repo || space.id,
                author: username || space.author || "unknown",
                tags: Array.isArray(space.tags) ? space.tags : [],
                sdkType: space.sdk || "unknown",
                spaceType: space.type || "application",
                thumbnail: space.thumbnail,
                likes: space.likes || 0,
                metadata: space
              });

              await storage.saveSpace(validSpace);
            } catch (err) {
              console.error('Failed to parse space:', space.id, err);
            }
          }));

          const newSpace = await storage.getRandomSpace(filters);
          if (!newSpace) {
            res.status(404).json({ message: "No spaces found matching filters" });
            return;
          }
          res.json(newSpace);
        } catch (err) {
          console.error('Failed to fetch spaces:', err);
          res.status(502).json({ message: "Failed to fetch spaces from HuggingFace" });
        }
      } else {
        res.json(space);
      }
    } catch (err) {
      console.error('Error handling request:', err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/spaces/:id", async (req, res) => {
    const space = await storage.getSpaceById(req.params.id);
    if (!space) {
      res.status(404).json({ message: "Space not found" });
      return;
    }
    res.json(space);
  });

  const httpServer = createServer(app);
  return httpServer;
}