import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const isLoggedin = async (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1] || req.cookies?.token;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in isLoggedin middleware:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
