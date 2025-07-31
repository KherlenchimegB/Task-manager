import bcrypt from "bcryptjs";
import { prisma } from "../server.js";
import { generateToken } from "../utils/jwt.js";

// User registration
export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        error: "Registration failed",
        message: "User with this email already exists",
      });
    }

    // Hash password for security
    const saltRounds = 12; // Higher number = more secure but slower
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    // Generate JWT token
    const token = generateToken(user.id);

    res.status(201).json({
      message: "User registered successfully",
      user,
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      error: "Registration failed",
      message: "Unable to create user account",
    });
  }
};

// User login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        error: "Login failed",
        message: "Invalid email or password",
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Login failed",
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = generateToken(user.id);

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: "Login successful",
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Login failed",
      message: "Unable to process login request",
    });
  }
};

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    // req.user is set by authentication middleware
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        _count: {
          select: {
            projects: true,
          },
        },
      },
    });

    res.json({ user });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({
      error: "Profile fetch failed",
      message: "Unable to fetch user profile",
    });
  }
};
