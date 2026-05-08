import express from "express";
import {
  loginUser,
  registerUser,
  adminLogin,
  listUsers,
  deleteUser,
  blockUser,
} from "../controllers/userController.js";

const router = express.Router();

// USER AUTH
router.post("/register", registerUser);
router.post("/login", loginUser);

// ADMIN AUTH
router.post("/adminlogin", adminLogin);

// 🔥 NEW ADMIN USER MANAGEMENT ROUTES
router.get("/list", listUsers);        // ✅ FIXES YOUR 404
router.post("/delete", deleteUser);
router.post("/block", blockUser);

export default router;