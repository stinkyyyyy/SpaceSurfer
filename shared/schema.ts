import { pgTable, text, serial, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
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

export const spaces = pgTable("spaces", {
  id: serial("id").primaryKey(),
  spaceId: text("space_id").notNull().unique(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  tags: text("tags").array().notNull(),
  sdkType: text("sdk_type").notNull(),
  spaceType: text("space_type").notNull(),
  category: text("category").notNull(),
  thumbnail: text("thumbnail"),
  likes: jsonb("likes").notNull(),
  metadata: jsonb("metadata").notNull()
});

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

// Make schema more lenient for API responses
export const spaceSchema = createInsertSchema(spaces).extend({
  likes: z.union([
    z.number().transform(count => ({ count })),
    z.object({ count: z.number() }).passthrough()
  ]),
  tags: z.array(z.string()).default([]),
  sdkType: z.string().default("unknown"),
  spaceType: z.string().default("application"),
  category: z.string().default("other"),
  thumbnail: z.string().nullable().default(null),
});

export type Space = typeof spaces.$inferSelect;
export type InsertSpace = z.infer<typeof spaceSchema>;

export const filterSchema = z.object({
  sdkType: z.string().optional(),
  spaceType: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional()
});

export type SpaceFilters = z.infer<typeof filterSchema>;