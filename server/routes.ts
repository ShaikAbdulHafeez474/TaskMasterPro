import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertProjectSchema, insertTaskSchema, insertTeamSchema, insertTeamMemberSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Teams
  app.get("/api/teams", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const teams = await storage.getTeams(req.user.id);
    res.json(teams);
  });

  app.post("/api/teams", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const parsed = insertTeamSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }
    const team = await storage.createTeam({
      ...parsed.data,
      ownerId: req.user.id,
    });

    // Add the creator as team owner
    await storage.addTeamMember({
      teamId: team.id,
      userId: req.user.id,
      role: "owner",
    });

    res.status(201).json(team);
  });

  app.post("/api/teams/:id/members", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const team = await storage.getTeam(Number(req.params.id));
    if (!team) return res.sendStatus(404);

    const members = await storage.getTeamMembers(team.id);
    const userRole = members.find(m => m.userId === req.user.id)?.role;
    if (!userRole || !["owner", "admin"].includes(userRole)) {
      return res.status(403).send("Only owners and admins can add members");
    }

    const parsed = insertTeamMemberSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }

    const member = await storage.addTeamMember({
      ...parsed.data,
      teamId: team.id,
    });
    res.status(201).json(member);
  });

  app.delete("/api/teams/:teamId/members/:userId", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const team = await storage.getTeam(Number(req.params.teamId));
    if (!team) return res.sendStatus(404);

    const members = await storage.getTeamMembers(team.id);
    const userRole = members.find(m => m.userId === req.user.id)?.role;
    if (!userRole || !["owner", "admin"].includes(userRole)) {
      return res.status(403).send("Only owners and admins can remove members");
    }

    await storage.removeTeamMember(
      Number(req.params.teamId),
      Number(req.params.userId)
    );
    res.sendStatus(200);
  });

  app.delete("/api/teams/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const team = await storage.getTeam(Number(req.params.id));
    if (!team || team.ownerId !== req.user.id) {
      return res.sendStatus(404);
    }
    await storage.deleteTeam(Number(req.params.id));
    res.sendStatus(200);
  });

  // Projects
  app.get("/api/projects", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const projects = await storage.getProjects(req.user.id);
    res.json(projects);
  });

  app.post("/api/projects", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const parsed = insertProjectSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }
    const project = await storage.createProject({
      ...parsed.data,
      userId: req.user.id,
    });
    res.status(201).json(project);
  });

  app.delete("/api/projects/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const project = await storage.getProject(Number(req.params.id));
    if (!project || project.userId !== req.user.id) {
      return res.sendStatus(404);
    }
    await storage.deleteProject(Number(req.params.id));
    res.sendStatus(200);
  });

  // Tasks
  app.get("/api/tasks", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const tasks = await storage.getTasks(req.user.id);
    res.json(tasks);
  });

  app.post("/api/tasks", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const parsed = insertTaskSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }
    const task = await storage.createTask({
      ...parsed.data,
      userId: req.user.id,
    });
    res.status(201).json(task);
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const task = await storage.getTask(Number(req.params.id));
    if (!task || task.userId !== req.user.id) {
      return res.sendStatus(404);
    }
    const updatedTask = await storage.updateTask(Number(req.params.id), req.body);
    res.json(updatedTask);
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const task = await storage.getTask(Number(req.params.id));
    if (!task || task.userId !== req.user.id) {
      return res.sendStatus(404);
    }
    await storage.deleteTask(Number(req.params.id));
    res.sendStatus(200);
  });

  const httpServer = createServer(app);
  return httpServer;
}