import express from "express";
import { isLoggedin } from "../middlewares/auth.middleware.js";
import {
  getUsers,
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
  updateUserRole,
  updateUserSkills,
} from "../controllers/user.controllers.js";

const router = express.Router();

router.get("/users", isLoggedin, getUsers); // admin only
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", isLoggedin, logoutUser);
router.get("/me", isLoggedin, currentUser);
router.patch("/:id/role", isLoggedin, updateUserRole);
router.patch("/:id/skills", isLoggedin, updateUserSkills);

export default router;