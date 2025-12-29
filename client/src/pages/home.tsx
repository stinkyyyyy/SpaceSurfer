import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SpaceCard } from "@/components/space-card";
import { FilterAccordion } from "@/components/filter-accordion";
import { HistoryCarousel } from "@/components/history-carousel";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSpaceFilters } from "@/hooks/use-space-filters";
import { RefreshCw, Filter } from "lucide-react";
import type { Space } from "@shared/schema";
import { Background3D } from "@/components/background-3d";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Home() {
  const [history, setHistory] = useState<Space[]>([]);
  const { filters, setFilters } = useSpaceFilters();

  const { data: space, isLoading, refetch } = useQuery({
    queryKey: ["/api/spaces/random", filters],
    refetchOnWindowFocus: false
  });

  const handleNext = async () => {
    if (space) {
      setHistory(prev => [space, ...prev]);
    }
    await refetch();
  };

  return (
    <div className="min-h-screen text-foreground relative overflow-hidden flex flex-col">
      <Background3D />

      {/* Header */}
      <header className="p-4 flex justify-between items-center z-10 glass-panel border-b border-white/5 bg-black/20">
        <div className="flex items-center gap-2">
           <span className="text-2xl">🏄</span>
           <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
             Space Surfer
           </h1>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
              <Filter className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent className="glass-panel border-l border-white/10 text-white">
            <h2 className="text-xl font-bold mb-4">Filters</h2>
            <FilterAccordion filters={filters} onChange={setFilters} />
          </SheetContent>
        </Sheet>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 flex flex-col items-center justify-center py-8 z-10">
        <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-12 items-center">

          {/* Card Section */}
          <div className="order-2 lg:order-1 flex justify-center w-full">
            {isLoading ? (
              <Skeleton className="h-[500px] w-full max-w-md rounded-xl bg-white/5" />
            ) : space ? (
              <SpaceCard space={space} onNext={handleNext} />
            ) : (
              <div className="text-center glass-panel p-8 rounded-xl">
                <p className="text-muted-foreground mb-4">No spaces found matching your criteria</p>
                <Button onClick={() => refetch()} variant="outline" className="border-white/20 hover:bg-white/10">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
              </div>
            )}
          </div>

          {/* Intro / History Section (Desktop) */}
          <div className="order-1 lg:order-2 text-center lg:text-left space-y-8">
             <div>
               <h2 className="text-4xl lg:text-6xl font-bold mb-4 text-white tracking-tighter">
                 Discover the <br />
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                   Next Big Thing
                 </span>
               </h2>
               <p className="text-lg text-gray-400 max-w-md mx-auto lg:mx-0">
                 Swipe through thousands of AI demos, apps, and models hosted on Hugging Face.
               </p>
             </div>

             {history.length > 0 && (
              <div className="hidden lg:block glass-panel p-4 rounded-xl border border-white/5">
                <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Recently Surfed</h3>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {history.slice(0, 5).map(h => (
                    <a
                      key={h.spaceId}
                      href={`https://huggingface.co/spaces/${h.spaceId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-white/10 hover:border-white/50 transition-colors"
                    >
                       {h.thumbnail ? (
                         <img src={h.thumbnail} alt={h.title} className="w-full h-full object-cover" />
                       ) : (
                         <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-xs">
                           {h.title[0]}
                         </div>
                       )}
                    </a>
                  ))}
                </div>
              </div>
             )}
          </div>
        </div>
      </main>

      {/* Mobile History */}
      {history.length > 0 && (
        <div className="lg:hidden p-4 z-10">
           <HistoryCarousel spaces={history} />
        </div>
      )}
    </div>
  );
}
