import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";

// 🔐 TOKEN
const createToken = (id, role = "user") => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// 🔥 LOGIN USER
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    // ❌ BLOCK CHECK (IMPORTANT FEATURE)
    if (user.blocked) {
      return res.json({
        success: false,
        message: "User is blocked by admin",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = createToken(user._id.toString());

    res.json({
      success: true,
      token,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// 🔥 REGISTER USER
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const exists = await userModel.findOne({ email });

    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    if (!validator.isEmail(email || "")) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    if (!password || password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = createToken(user._id.toString());

    res.json({
      success: true,
      token,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// 🔥 ADMIN LOGIN
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      return res.status(500).json({
        success: false,
        message: "Admin credentials not configured",
      });
    }

    if (email === adminEmail && password === adminPassword) {
      return res.json({
        success: true,
        token: createToken("admin", "admin"),
      });
    }

    res.json({
      success: false,
      message: "Invalid admin credentials",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};


// =============================
// 🔥 NEW ADMIN FEATURES
// =============================

// 📌 GET ALL USERS
const listUsers = async (req, res) => {
  try {
    const users = await userModel.find({}).select("-password");
    res.json({ success: true, data: users });
  } catch (error) {
    res.json({ success: false, message: "Error fetching users" });
  }
};

// 📌 DELETE USER
const deleteUser = async (req, res) => {
  try {
    await userModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "User deleted" });
  } catch (error) {
    res.json({ success: false, message: "Error deleting user" });
  }
};

// 📌 BLOCK / UNBLOCK USER
const blockUser = async (req, res) => {
  try {
    await userModel.findByIdAndUpdate(req.body.id, {
      blocked: req.body.blocked,
    });
    res.json({ success: true, message: "User updated" });
  } catch (error) {
    res.json({ success: false, message: "Error updating user" });
  }
};

export {
  loginUser,
  registerUser,
  adminLogin,
  listUsers,
  deleteUser,
  blockUser,
};