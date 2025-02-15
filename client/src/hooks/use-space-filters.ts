import { useState, useCallback } from "react";
import type { SpaceFilters } from "@shared/schema";

const STORAGE_KEY = "space-filters";

export function useSpaceFilters() {
  const [filters, setFiltersState] = useState<SpaceFilters>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  });

  const setFilters = useCallback((newFilters: SpaceFilters) => {
    setFiltersState(newFilters);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newFilters));
  }, []);

  return { filters, setFilters };
}
