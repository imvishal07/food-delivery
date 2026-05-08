import express from "express";
import upload from "../middleware/multer.js";
import {
  addCategory,
  listCategory,
  removeCategory,
} from "../controllers/categoryController.js";
import adminAuth from "../middleware/adminAuth.js";

const categoryRouter = express.Router();

categoryRouter.post("/add", adminAuth, upload.single("image"), addCategory);
categoryRouter.get("/list", listCategory);
categoryRouter.post("/remove", adminAuth, removeCategory);

export default categoryRouter;
