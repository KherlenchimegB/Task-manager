import { verifyToken } from "../utils/jwt.js";
import { prisma } from "../server.js";

// Middleware to protect routes that require authentication
export const authenticateToken = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Format: "Bearer TOKEN"

    if (!token) {
      return res.status(401).json({
        error: "Access denied",
        message: "No token provided",
      });
    }

    // Verify token and extract user ID
    const decoded = verifyToken(token);

    // Check if user still exists in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true }, // Don't include password
    });

    if (!user) {
      return res.status(401).json({
        error: "Access denied",
        message: "User not found",
      });
    }

    // Add user information to request object
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(403).json({
      error: "Access denied",
      message: "Invalid token",
    });
  }
};
