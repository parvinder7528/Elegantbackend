import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "1234567890987654321234";

// Create token
export const generateToken = (payload, expiresIn = "1d") => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

// Verify token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null; // invalid or expired token
  }
};
