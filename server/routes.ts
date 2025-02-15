import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { spaceSchema, filterSchema } from "@shared/schema";

const HF_API_URL = "https://huggingface.co/api/spaces";

export async function registerRoutes(app: Express) {
  app.get("/api/spaces/random", async (req, res) => {
    try {
      const filters = filterSchema.parse(req.query);
      const space = await storage.getRandomSpace(filters);
      if (!space) {
        // Fetch from HF API if not in cache
        const response = await fetch(`${HF_API_URL}?limit=100`);
        const spaces = await response.json();

        // Cache valid spaces
        await Promise.all(spaces.map(async (space: any) => {
          try {
            const validSpace = spaceSchema.parse({
              spaceId: space.id,
              title: space.title || space.id.split('/')[1], // Fallback to id
              author: space.id.split('/')[0], // Author is first part of id
              tags: Array.isArray(space.tags) ? space.tags : [],
              sdkType: space.sdk || 'unknown',
              spaceType: space.type || 'application',
              thumbnail: space.thumbnail || null,
              likes: space.likes || { count: 0 },
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