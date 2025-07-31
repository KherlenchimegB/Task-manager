import express from "express";
import {
  getTasks,
  createTask,
  updateTask,
  toggleTask,
  deleteTask,
  getDashboardStats,
} from "../controllers/taskController.js";
import { authenticateToken } from "../middleware/auth.js";
import { validate, schemas } from "../middleware/validation.js";

const router = express.Router();

// All task routes require authentication
router.use(authenticateToken);

// GET /api/tasks/dashboard - Get dashboard statistics
router.get("/dashboard", getDashboardStats);

// GET /api/tasks/project/:projectId - Get all tasks for a project
router.get("/project/:projectId", getTasks);

// POST /api/tasks/project/:projectId - Create new task in project
router.post("/project/:projectId", validate(schemas.task), createTask);

// PUT /api/tasks/:id - Update task
router.put("/:id", validate(schemas.task), updateTask);

// PATCH /api/tasks/:id/toggle - Toggle task completion
router.patch("/:id/toggle", toggleTask);

// DELETE /api/tasks/:id - Delete task
router.delete("/:id", deleteTask);

export default router;
