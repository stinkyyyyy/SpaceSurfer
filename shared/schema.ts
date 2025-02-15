import { pgTable, text, serial, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define likes object schema
const likesSchema = z.object({
  count: z.number().default(0),
}).passthrough();

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

// Include likes schema in space schema
export const spaceSchema = createInsertSchema(spaces).extend({
  likes: likesSchema,
});

export type Space = typeof spaces.$inferSelect & {
  likes: z.infer<typeof likesSchema>;
};
export type InsertSpace = z.infer<typeof spaceSchema>;

export const filterSchema = z.object({
  sdkType: z.string().optional(),
  spaceType: z.string().optional(),
  tags: z.array(z.string()).optional()
});

export type SpaceFilters = z.infer<typeof filterSchema>;