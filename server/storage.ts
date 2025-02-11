import { type InsertUser, type User, type Project, type InsertProject, type Task, type InsertTask, type Team, type InsertTeam, type TeamMember, type InsertTeamMember } from "@shared/schema";
import session from "express-session";
import { users, projects, tasks, teams, teamMembers } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Team operations
  createTeam(team: InsertTeam & { ownerId: number }): Promise<Team>;
  getTeams(userId: number): Promise<Team[]>;
  getTeam(id: number): Promise<Team | undefined>;
  deleteTeam(id: number): Promise<void>;
  addTeamMember(member: InsertTeamMember): Promise<TeamMember>;
  removeTeamMember(teamId: number, userId: number): Promise<void>;
  getTeamMembers(teamId: number): Promise<TeamMember[]>;

  // Project operations
  createProject(project: InsertProject & { userId: number }): Promise<Project>;
  getProjects(userId: number): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  deleteProject(id: number): Promise<void>;

  // Task operations
  createTask(task: InsertTask & { userId: number }): Promise<Task>;
  getTasks(userId: number): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  updateTask(id: number, task: Partial<Task>): Promise<Task>;
  deleteTask(id: number): Promise<void>;

  sessionStore: session.SessionStore;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createTeam(team: InsertTeam & { ownerId: number }): Promise<Team> {
    const [newTeam] = await db.insert(teams).values(team).returning();
    return newTeam;
  }

  async getTeams(userId: number): Promise<Team[]> {
    const memberTeams = await db
      .select()
      .from(teams)
      .innerJoin(teamMembers, eq(teams.id, teamMembers.teamId))
      .where(eq(teamMembers.userId, userId));
    return memberTeams.map(({ teams }) => teams);
  }

  async getTeam(id: number): Promise<Team | undefined> {
    const [team] = await db.select().from(teams).where(eq(teams.id, id));
    return team;
  }

  async deleteTeam(id: number): Promise<void> {
    await db.delete(teams).where(eq(teams.id, id));
  }

  async addTeamMember(member: InsertTeamMember): Promise<TeamMember> {
    const [newMember] = await db
      .insert(teamMembers)
      .values(member)
      .returning();
    return newMember;
  }

  async removeTeamMember(teamId: number, userId: number): Promise<void> {
    await db
      .delete(teamMembers)
      .where(eq(teamMembers.teamId, teamId))
      .where(eq(teamMembers.userId, userId));
  }

  async getTeamMembers(teamId: number): Promise<TeamMember[]> {
    return db
      .select()
      .from(teamMembers)
      .where(eq(teamMembers.teamId, teamId));
  }

  async createProject(project: InsertProject & { userId: number }): Promise<Project> {
    const [newProject] = await db.insert(projects).values(project).returning();
    return newProject;
  }

  async getProjects(userId: number): Promise<Project[]> {
    return db.select().from(projects).where(eq(projects.userId, userId));
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async deleteProject(id: number): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  async createTask(task: InsertTask & { userId: number }): Promise<Task> {
    const [newTask] = await db.insert(tasks).values({
      ...task,
      completed: false,
    }).returning();
    return newTask;
  }

  async getTasks(userId: number): Promise<Task[]> {
    return db.select().from(tasks).where(eq(tasks.userId, userId));
  }

  async getTask(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task;
  }

  async updateTask(id: number, updates: Partial<Task>): Promise<Task> {
    const [updatedTask] = await db
      .update(tasks)
      .set(updates)
      .where(eq(tasks.id, id))
      .returning();
    if (!updatedTask) throw new Error("Task not found");
    return updatedTask;
  }

  async deleteTask(id: number): Promise<void> {
    await db.delete(tasks).where(eq(tasks.id, id));
  }
}

export const storage = new DatabaseStorage();