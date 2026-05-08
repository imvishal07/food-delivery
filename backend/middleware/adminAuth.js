import jwt from "jsonwebtoken";

const adminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || "";

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    req.userId = decoded.id;
    req.userRole = decoded.role;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

export default adminAuth;