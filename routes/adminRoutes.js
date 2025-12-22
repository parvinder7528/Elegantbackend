import express from "express";
import admincontroller from "../controllers/admincontroller.js";

const router = express.Router();

// Public routes only
router.post("/bookingcreate", admincontroller.createBooking);
router.get("/getalluser", admincontroller.getUserAll);

export default router;
