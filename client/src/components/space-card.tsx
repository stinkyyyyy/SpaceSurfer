import { motion, PanInfo, useAnimation } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ExternalLink } from "lucide-react";
import type { Space } from "@shared/schema";
import { useEffect } from "react";

interface SpaceCardProps {
  space: Space;
  onNext: () => void;
}

export function SpaceCard({ space, onNext }: SpaceCardProps) {
  const controls = useAnimation();

  useEffect(() => {
    // Reset animation state when space changes
    controls.set({ x: 0, opacity: 0, scale: 0.8, y: 50 });
    controls.start({ x: 0, opacity: 1, scale: 1, y: 0 });
  }, [space, controls]);

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
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ 
        type: "spring",
        damping: 20,
        stiffness: 300
      }}
      className="cursor-grab active:cursor-grabbing w-full max-w-md mx-auto"
    >
      <Card className="overflow-hidden glass-panel border-0 ring-1 ring-white/10 shadow-2xl">
        <CardContent className="p-0">
          <div className="relative aspect-video group">
            {space.thumbnail ? (
              <img 
                src={space.thumbnail} 
                alt={space.title}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h2 className="text-3xl font-bold mb-1 tracking-tight">{space.title}</h2>
              <p className="text-gray-300 text-sm">by {space.author}</p>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-0">
                {space.sdkType}
              </Badge>
              <Badge variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-0">
                {space.spaceType}
              </Badge>
              {space.tags.slice(0, 3).map((tag, i) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="border-white/20 text-gray-300"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-pink-400">
                <Heart className="h-5 w-5 fill-current" />
                <span className="font-semibold">{space.likes.count}</span>
              </div>
              <Button
                variant="default"
                className="bg-white text-black hover:bg-gray-200 font-semibold"
                asChild
              >
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
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
