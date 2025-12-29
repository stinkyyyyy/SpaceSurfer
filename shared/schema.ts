import { z } from "zod";

export const spaceCategories = {
  'image-generation': '🎨 Image Generation',
  'voice-clone': '🎤 Voice Cloning',
  'text-to-speech': '🗣️ Text to Speech',
  'chat': '💬 Chat & Assistants',
  'mobile': '📱 Mobile Friendly',
  '3d': '🎮 3D Generation',
  'video': '🎥 Video Generation',
  'audio': '🎵 Audio & Music',
  'vision': '👁️ Computer Vision',
  'other': '🔮 Other'
} as const;

// Zod schema to replace Drizzle schema
export const spaceSchema = z.object({
  id: z.number().optional(), // In-memory/File ID
  spaceId: z.string(),
  title: z.string(),
  author: z.string(),
  tags: z.array(z.string()).default([]),
  sdkType: z.string().default("unknown"),
  spaceType: z.string().default("application"),
  category: z.string().default("other"),
  thumbnail: z.string().nullable().default(null),
  likes: z.union([
    z.number().transform(count => ({ count })),
    z.object({ count: z.number() }).passthrough()
  ]),
  metadata: z.record(z.any())
});

export type Space = z.infer<typeof spaceSchema>;
export type InsertSpace = z.infer<typeof spaceSchema>;

// Common tags to categories mapping
export const tagToCategory = new Map([
  ['text-to-image', 'image-generation'],
  ['stable-diffusion', 'image-generation'],
  ['voice-conversion', 'voice-clone'],
  ['text-to-speech', 'text-to-speech'],
  ['chatbot', 'chat'],
  ['mobile', 'mobile'],
  ['3d', '3d'],
  ['video', 'video'],
  ['audio', 'audio'],
  ['computer-vision', 'vision']
]);

export const filterSchema = z.object({
  sdkType: z.string().optional(),
  spaceType: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional()
});

export type SpaceFilters = z.infer<typeof filterSchema>;
