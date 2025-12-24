import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import adminRoutes from "./routes/adminRoutes.js";
import cors from "cors";



// Create app
const app = express();

// CORS setup (allow frontend)
// Simple CORS setup - no credentials needed
// app.use(cors({
//   origin: [
//     "http://localhost:8080",
//     "https://elegant1-we27.vercel.app",
//     "https://elegant1-backend.vercel.app",
//     "http://localhost:5000"
//   ],
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//    credentials: true
// }));

// // Add this BEFORE your routes - handles preflight requests
// // app.options('*', cors());
// app.use(cors({
//   origin: [
//     "https://elegant1-we27.vercel.app",
//     "http://localhost:8080",
//   ],
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true
// }));

/* ✅ VERY IMPORTANT FOR VERCEL */
// Load env variables
dotenv.config();

// Connect database
connectDB();
app.use( cors());
// app.use(cors({
//   origin: [
//     "http://localhost:5000",
//     "http://localhost:3000",
//     "https://elegant1-we27.vercel.app" // your live frontend
//   ],
//   credentials: true,
// }));
// Parse JSON body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", adminRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Backend running 🚀" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
