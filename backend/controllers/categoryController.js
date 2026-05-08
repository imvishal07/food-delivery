import fs from "fs";
import categoryModel from "../models/categoryModel.js";

export const addCategory = async (req, res) => {
  try {
    const name = req.body.name.toLowerCase().trim();

    const existing = await categoryModel.findOne({ name });

    if (existing) {
      return res.json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = new categoryModel({
      name,
      image: req.file.filename,
    });

    await category.save();

    res.json({
      success: true,
      message: "Category Added",
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.json({
        success: false,
        message: "Category already exists",
      });
    }

    console.log(error);

    res.json({
      success: false,
      message: "Error adding category",
    });
  }
};

const listCategory = async (req, res) => {
  try {
    const categories = await categoryModel.find({});
    res.json({ success: true, data: categories });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching categories" });
  }
};

const removeCategory = async (req, res) => {
  try {
    const category = await categoryModel.findById(req.body.id);

    if (!category) {
      return res.json({ success: false, message: "Category not found" });
    }

    fs.unlink(`uploads/${category.image}`, () => {});
    await categoryModel.findByIdAndDelete(req.body.id);

    res.json({ success: true, message: "Category Removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error removing category" });
  }
};

export { listCategory, removeCategory };
