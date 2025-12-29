import { Space, InsertSpace, SpaceFilters } from "@shared/schema";
import fs from 'fs';
import path from 'path';

export interface IStorage {
  getSpaces(): Promise<Space[]>;
  getSpaceById(id: string): Promise<Space | undefined>;
  saveSpace(space: InsertSpace): Promise<Space>;
  getRandomSpace(filters?: SpaceFilters): Promise<Space | undefined>;
}

export class FileStorage implements IStorage {
  private spaces: Map<string, Space>;
  private currentId: number;
  private dataDir: string;
  private dataFile: string;

  constructor() {
    this.spaces = new Map();
    this.currentId = 1;
    this.dataDir = path.resolve("data");
    this.dataFile = path.join(this.dataDir, "storage.json");

    // Initialize storage
    this.init();
  }

  private init() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }

    if (fs.existsSync(this.dataFile)) {
      try {
        const data = fs.readFileSync(this.dataFile, 'utf-8');
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          parsed.forEach((s: Space) => {
             this.spaces.set(s.spaceId, s);
             if (s.id && s.id >= this.currentId) {
               this.currentId = s.id + 1;
             }
          });
          console.log(`Loaded ${this.spaces.size} spaces from storage.`);
        }
      } catch (err) {
        console.error("Failed to load storage:", err);
      }
    }
  }

  private persist() {
    try {
      const data = Array.from(this.spaces.values());
      fs.writeFileSync(this.dataFile, JSON.stringify(data, null, 2));
    } catch (err) {
      console.error("Failed to save storage:", err);
    }
  }

  async getSpaces(): Promise<Space[]> {
    return Array.from(this.spaces.values());
  }

  async getSpaceById(id: string): Promise<Space | undefined> {
    return this.spaces.get(id);
  }

  async saveSpace(space: InsertSpace): Promise<Space> {
    const existing = this.spaces.get(space.spaceId);
    if (existing) {
      // Update existing
      const updated = { ...existing, ...space };
      this.spaces.set(space.spaceId, updated);
      this.persist();
      return updated;
    }

    const id = this.currentId++;
    const newSpace: Space = { ...space, id };
    this.spaces.set(space.spaceId, newSpace);
    this.persist();
    return newSpace;
  }

  async getRandomSpace(filters?: SpaceFilters): Promise<Space | undefined> {
    let spaces = Array.from(this.spaces.values());
    
    if (filters) {
      spaces = spaces.filter(space => {
        if (filters.sdkType && space.sdkType !== filters.sdkType) return false;
        if (filters.spaceType && space.spaceType !== filters.spaceType) return false;
        if (filters.category && space.category !== filters.category) return false;
        if (filters.tags && !filters.tags.some(tag => space.tags.includes(tag))) return false;
        return true;
      });
    }

    if (spaces.length === 0) return undefined;
    return spaces[Math.floor(Math.random() * spaces.length)];
  }
}

export const storage = new FileStorage();
