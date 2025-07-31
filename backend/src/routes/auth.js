import express from "express";
import { register, login, getProfile } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/auth.js";
import { validate, schemas } from "../middleware/validation.js";

const router = express.Router();

// POST /api/auth/register - User registration
router.post("/register", validate(schemas.register), register);

// POST /api/auth/login - User login
router.post("/login", validate(schemas.login), login);

// GET /api/auth/profile - Get current user profile (protected)
router.get("/profile", authenticateToken, getProfile);

export default router;
