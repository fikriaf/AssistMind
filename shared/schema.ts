import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const chatSessions = pgTable("chat_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull().references(() => chatSessions.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  role: text("role").notNull(), // 'user' or 'assistant'
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  metadata: json("metadata").$type<Record<string, any>>(),
});

export const uploadedFiles = pgTable("uploaded_files", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull().references(() => chatSessions.id, { onDelete: "cascade" }),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: varchar("size").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

export const promptTemplates = pgTable("prompt_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const insertChatSessionSchema = createInsertSchema(chatSessions).pick({
  title: true,
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  sessionId: true,
  content: true,
  role: true,
});

export const insertFileSchema = createInsertSchema(uploadedFiles).pick({
  sessionId: true,
  filename: true,
  originalName: true,
  mimeType: true,
  size: true,
});

export const insertPromptTemplateSchema = createInsertSchema(promptTemplates).pick({
  title: true,
  description: true,
  content: true,
  category: true,
});

export type ChatSession = typeof chatSessions.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type UploadedFile = typeof uploadedFiles.$inferSelect;
export type PromptTemplate = typeof promptTemplates.$inferSelect;

export type InsertChatSession = z.infer<typeof insertChatSessionSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type InsertFile = z.infer<typeof insertFileSchema>;
export type InsertPromptTemplate = z.infer<typeof insertPromptTemplateSchema>;
