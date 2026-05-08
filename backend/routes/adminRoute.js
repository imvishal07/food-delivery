import express from "express";
import { getDashboardStats } from "../controllers/adminController.js";
import adminAuth from "../middleware/adminAuth.js";
import { adminLogin } from "../controllers/userController.js";

const adminRouter = express.Router();

// ✅ Login route (IMPORTANT)
adminRouter.post("/login", adminLogin);

// ✅ Protected route
adminRouter.get("/stats", adminAuth, getDashboardStats);

export default adminRouter;