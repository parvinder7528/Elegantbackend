import { verifyToken } from "../utils/jwt.js";

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer token

  if (!token) return res.status(401).json({ success: false, message: "No token provided" });

  const decoded = verifyToken(token);
  if (!decoded) return res.status(401).json({ success: false, message: "Invalid or expired token" });

  req.user = decoded; // attach user info to request
  next();
};
