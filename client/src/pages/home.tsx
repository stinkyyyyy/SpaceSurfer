import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SpaceCard } from "@/components/space-card";
import { FilterAccordion } from "@/components/filter-accordion";
import { HistoryCarousel } from "@/components/history-carousel";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSpaceFilters } from "@/hooks/use-space-filters";
import { RefreshCw } from "lucide-react";
import type { Space } from "@shared/schema";

export default function Home() {
  const [history, setHistory] = useState<Space[]>([]);
  const { filters, setFilters } = useSpaceFilters();
  
  const { data: space, isLoading, refetch } = useQuery({
    queryKey: ["/api/spaces/random", filters],
    refetchOnWindowFocus: false
  });

  const handleNext = async () => {
    if (space) {
      setHistory(prev => [...prev, space]);
    }
    await refetch();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8 mx-auto max-w-md">
        <h1 className="text-4xl font-bold text-center mb-8 font-comic">
          HuggingFace Space Explorer
        </h1>

        <FilterAccordion filters={filters} onChange={setFilters} />
        
        <div className="mt-8">
          {isLoading ? (
            <Skeleton className="h-[400px] w-full rounded-xl" />
          ) : space ? (
            <SpaceCard space={space} onNext={handleNext} />
          ) : (
            <div className="text-center">
              <p className="text-muted-foreground mb-4">No spaces found</p>
              <Button onClick={() => refetch()}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          )}
        </div>

        {history.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">History</h2>
            <HistoryCarousel spaces={history} />
          </div>
        )}
      </div>
    </div>
  );
}
