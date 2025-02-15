import { motion, PanInfo } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ExternalLink } from "lucide-react";
import type { Space } from "@shared/schema";

interface SpaceCardProps {
  space: Space;
  onNext: () => void;
}

export function SpaceCard({ space, onNext }: SpaceCardProps) {
  const handleDragEnd = (_: any, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 100) {
      onNext();
    }
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 0.98 }}
      animate={{ scale: 1, opacity: 1 }}
      initial={{ scale: 0.8, opacity: 0 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className="cursor-grab active:cursor-grabbing"
    >
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          {space.thumbnail && (
            <div className="relative aspect-video mb-4 rounded-lg overflow-hidden">
              <img 
                src={space.thumbnail} 
                alt={space.title}
                className="object-cover w-full h-full"
              />
            </div>
          )}

          <h2 className="text-2xl font-bold mb-2">{space.title}</h2>
          <p className="text-muted-foreground mb-4">by {space.author}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary">{space.sdkType}</Badge>
            <Badge variant="secondary">{space.spaceType}</Badge>
            {space.tags.map(tag => (
              <Badge key={tag} variant="outline">{tag}</Badge>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              <span>{space.likes.count}</span>
            </div>
            <Button variant="outline" asChild>
              <a 
                href={`https://huggingface.co/spaces/${space.spaceId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit Space
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
