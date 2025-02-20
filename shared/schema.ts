import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  ownerId: integer("owner_id").notNull(),
});

export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").notNull(),
  userId: integer("user_id").notNull(),
  role: text("role").notNull().default("member"), // owner, admin, member
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  userId: integer("user_id").notNull(),
  teamId: integer("team_id"),
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: timestamp("due_date"),
  completed: boolean("completed").default(false),
  priority: text("priority").default("medium"),
  userId: integer("user_id").notNull(),
  projectId: integer("project_id"),
  teamId: integer("team_id"),
  assignedTo: integer("assigned_to"),
});

// User schema
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Team schemas
export const insertTeamSchema = createInsertSchema(teams).pick({
  name: true,
  description: true,
});

export const insertTeamMemberSchema = createInsertSchema(teamMembers).pick({
  teamId: true,
  userId: true,
  role: true,
}).extend({
  role: z.enum(["owner", "admin", "member"]),
});

// Project schema
export const insertProjectSchema = createInsertSchema(projects).pick({
  name: true,
  description: true,
  teamId: true,
});

// Task schema
export const insertTaskSchema = createInsertSchema(tasks).pick({
  title: true,
  description: true,
  dueDate:true,
  priority: true,
  projectId: true,
  teamId: true,
  assignedTo: true,
}).extend({
  dueDate: z.preprocess((val) => new Date(val as string), z.date()), // Converts string to Date
  priority: z.enum(["low", "medium", "high"]),
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Team = typeof teams.$inferSelect;
export type TeamMember = typeof teamMembers.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type InsertTask = z.infer<typeof insertTaskSchema>;