import { Space, InsertSpace, SpaceFilters } from "@shared/schema";

export interface IStorage {
  getSpaces(): Promise<Space[]>;
  getSpaceById(id: string): Promise<Space | undefined>;
  saveSpace(space: InsertSpace): Promise<Space>;
  getRandomSpace(filters?: SpaceFilters): Promise<Space | undefined>;
}

export class MemStorage implements IStorage {
  private spaces: Map<string, Space>;
  private currentId: number;

  constructor() {
    this.spaces = new Map();
    this.currentId = 1;
  }

  async getSpaces(): Promise<Space[]> {
    return Array.from(this.spaces.values());
  }

  async getSpaceById(id: string): Promise<Space | undefined> {
    return this.spaces.get(id);
  }

  async saveSpace(space: InsertSpace): Promise<Space> {
    const id = this.currentId++;
    const newSpace = { ...space, id };
    this.spaces.set(space.spaceId, newSpace);
    return newSpace;
  }

  async getRandomSpace(filters?: SpaceFilters): Promise<Space | undefined> {
    let spaces = Array.from(this.spaces.values());
    
    if (filters) {
      spaces = spaces.filter(space => {
        if (filters.sdkType && space.sdkType !== filters.sdkType) return false;
        if (filters.spaceType && space.spaceType !== filters.spaceType) return false;
        if (filters.tags && !filters.tags.some(tag => space.tags.includes(tag))) return false;
        return true;
      });
    }

    if (spaces.length === 0) return undefined;
    return spaces[Math.floor(Math.random() * spaces.length)];
  }
}

export const storage = new MemStorage();
