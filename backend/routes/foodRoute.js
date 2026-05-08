import express from "express";
import { addFood, listFood, removeFood } from "../controllers/foodController.js";
import multer from "multer";
import adminAuth from "../middleware/adminAuth.js";

const foodRouter = express.Router();

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`);
  },
});

const upload = multer({ storage });

foodRouter.get("/list", listFood);
foodRouter.post("/add", adminAuth, upload.single("image"), addFood);
foodRouter.post("/remove", adminAuth, removeFood);

export default foodRouter;
