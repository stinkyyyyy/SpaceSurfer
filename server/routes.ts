import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { spaceSchema, filterSchema, tagToCategory } from "@shared/schema";
import { fetchSpaces } from "./api";
import { z } from "zod";

const CACHE_TTL = 1000 * 60 * 15; // 15 minutes
let lastFetch = 0;

export async function registerRoutes(app: Express) {
  app.get("/api/spaces/random", async (req, res) => {
    try {
      const filters = filterSchema.parse(req.query);
      const space = await storage.getRandomSpace(filters);

      // Check if we need to refresh cache
      const shouldRefreshCache = Date.now() - lastFetch > CACHE_TTL;

      if (!space || shouldRefreshCache) {
        try {
          const spaces = await fetchSpaces();

          // Cache valid spaces
          await Promise.all(spaces.map(async (space) => {
            try {
              const [username, repo] = (space.id || "").split('/');

              // Determine category based on tags
              let category = 'other';
              if (space.tags) {
                for (const tag of space.tags) {
                  const mappedCategory = tagToCategory.get(tag.toLowerCase());
                  if (mappedCategory) {
                    category = mappedCategory;
                    break;
                  }
                }
              }

              const validSpace = spaceSchema.parse({
                spaceId: space.id,
                title: space.title || repo || space.id,
                author: username || space.author || "unknown",
                tags: Array.isArray(space.tags) ? space.tags : [],
                sdkType: space.sdk || "unknown",
                spaceType: space.cardData?.type || "application",
                category,
                thumbnail: space.cardData?.thumbnail || null,
                likes: space.likes || 0,
                metadata: space
              });

              await storage.saveSpace(validSpace);
            } catch (err) {
              console.error('Failed to parse space:', space.id, err);
            }
          }));

          lastFetch = Date.now();

          if (!space) {
            // If we didn't have a space before, try to get one now
            const newSpace = await storage.getRandomSpace(filters);
            if (!newSpace) {
              res.status(404).json({ message: "No spaces found matching filters" });
              return;
            }
            res.json(newSpace);
          } else {
            // We had a space but refreshed cache, return original space
            res.json(space);
          }
        } catch (err) {
          console.error('Failed to fetch spaces:', err);
          if (space) {
            // If we have a cached space, return it despite fetch error
            res.json(space);
          } else {
            res.status(502).json({ message: "Failed to fetch spaces from HuggingFace" });
          }
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