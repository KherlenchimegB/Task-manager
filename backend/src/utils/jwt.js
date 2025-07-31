import jwt from "jsonwebtoken";

// Generate JWT token for user authentication
export const generateToken = (userId) => {
  return jwt.sign(
    { userId }, // Payload - user information
    process.env.JWT_SECRET, // Secret key
    { expiresIn: "7d" } // Token expires in 7 days
  );
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid token");
  }
};
