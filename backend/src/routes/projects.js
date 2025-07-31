import express from "express";
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";
import { authenticateToken } from "../middleware/auth.js";
import { validate, schemas } from "../middleware/validation.js";

const router = express.Router();

// All project routes require authentication
router.use(authenticateToken);

// GET /api/projects - Get all user's projects
router.get("/", getProjects);

// GET /api/projects/:id - Get single project with tasks
router.get("/:id", getProject);

// POST /api/projects - Create new project
router.post("/", validate(schemas.project), createProject);

// PUT /api/projects/:id - Update project
router.put("/:id", validate(schemas.project), updateProject);

// DELETE /api/projects/:id - Delete project
router.delete("/:id", deleteProject);

export default router;
