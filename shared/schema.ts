import { pgTable, text, serial, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const spaces = pgTable("spaces", {
  id: serial("id").primaryKey(),
  spaceId: text("space_id").notNull().unique(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  tags: text("tags").array().notNull(),
  sdkType: text("sdk_type").notNull(),
  spaceType: text("space_type").notNull(),
  thumbnail: text("thumbnail"),
  likes: jsonb("likes").notNull(),
  metadata: jsonb("metadata").notNull()
});

// Make schema more lenient for API responses
export const spaceSchema = createInsertSchema(spaces).extend({
  likes: z.union([
    z.number().transform(count => ({ count })),
    z.object({ count: z.number() }).passthrough()
  ]),
  tags: z.array(z.string()).default([]),
  sdkType: z.string().default("unknown"),
  spaceType: z.string().default("application"),
  thumbnail: z.string().nullable().default(null),
});

export type Space = typeof spaces.$inferSelect;
export type InsertSpace = z.infer<typeof spaceSchema>;

export const filterSchema = z.object({
  sdkType: z.string().optional(),
  spaceType: z.string().optional(),
  tags: z.array(z.string()).optional()
});

export type SpaceFilters = z.infer<typeof filterSchema>;