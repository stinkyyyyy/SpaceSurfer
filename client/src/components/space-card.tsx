import { motion, PanInfo, useAnimation } from "framer-motion";
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
  const controls = useAnimation();

  const handleDragEnd = async (_: any, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 100) {
      await controls.start({ x: info.offset.x * 2, opacity: 0 });
      onNext();
    } else {
      controls.start({ x: 0, opacity: 1 });
    }
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={controls}
      whileTap={{ scale: 0.98 }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring",
        damping: 15,
        stiffness: 200
      }}
      className="cursor-grab active:cursor-grabbing will-change-transform"
    >
      <Card className="overflow-hidden bg-gradient-to-br from-background to-secondary/10 border-2 hover:border-primary/50 transition-colors">
        <CardContent className="p-6">
          {space.thumbnail && (
            <div className="relative aspect-video mb-6 rounded-lg overflow-hidden group">
              <img 
                src={space.thumbnail} 
                alt={space.title}
                className="object-cover w-full h-full transform transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            </div>
          )}

          <h2 className="text-2xl font-bold mb-2 font-comic">{space.title}</h2>
          <p className="text-muted-foreground mb-4">by {space.author}</p>

          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant="secondary" className="animate-in fade-in-10 slide-in-from-bottom-1">
              {space.sdkType}
            </Badge>
            <Badge variant="secondary" className="animate-in fade-in-20 slide-in-from-bottom-2">
              {space.spaceType}
            </Badge>
            {space.tags.map((tag, i) => (
              <Badge 
                key={tag} 
                variant="outline"
                className={`animate-in fade-in-30 slide-in-from-bottom-${i + 3}`}
              >
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart className="h-5 w-5 text-red-500" />
              <span>{space.likes.count}</span>
            </motion.div>
            <Button 
              variant="outline" 
              className="group"
              asChild
            >
              <a 
                href={`https://huggingface.co/spaces/${space.spaceId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-primary"
              >
                <ExternalLink className="h-4 w-4 mr-2 group-hover:rotate-45 transition-transform" />
                Visit Space
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}