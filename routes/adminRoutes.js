import express from "express";
import admincontroller from "../controllers/admincontroller.js";
import { authMiddleware } from "../middlewear/authMiddleware.js";
const router = express.Router();

// Public routes only
router.post("/bookingcreate", admincontroller.createBooking);
router.get("/getalluser", admincontroller.getUserAll);
router.get("/getUserById/:id", admincontroller.getUserById);

router.delete("/user/:id", admincontroller.deleteUser);

// Get bookings by user ID
router.get("/bookings/:userId", admincontroller.getBookingsByUser);
router.post("/login",admincontroller.login)
export default router;
