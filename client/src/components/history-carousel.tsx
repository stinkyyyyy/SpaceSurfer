import { useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import type { Space } from "@shared/schema";

interface HistoryCarouselProps {
  spaces: Space[];
}

export function HistoryCarousel({ spaces }: HistoryCarouselProps) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <ScrollArea>
      <div ref={ref} className="flex gap-4 pb-4">
        {spaces.map((space, i) => (
          <motion.div
            key={space.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex-shrink-0 w-[280px]"
          >
            <Card>
              <CardContent className="p-4">
                <h3 className="font-bold truncate">{space.title}</h3>
                <p className="text-sm text-muted-foreground truncate">
                  by {space.author}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
