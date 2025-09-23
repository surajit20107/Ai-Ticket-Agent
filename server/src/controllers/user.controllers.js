import { User } from "../models/user.model.js";
import { registerSchema, loginSchema } from "../lib/zod.lib.js";
import { inngest } from "../inngest/client.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, skills } = req.body;

    const parsed = registerSchema.safeParse({ name, email, password });

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.message,
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      skills,
    });

    const token = await user.generateToken();

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      email: user.email,
      name: user.name,
      token,
    });

    inngest
      .send({
        name: "user/register",
        data: {
          email,
          name,
        },
      })
      .catch((err) => {
        console.error("❌ Failed to send inngest event", err.message);
      });
    return;
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const parsed = loginSchema.safeParse({ email, password });

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: error,
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = await user.generateToken();

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const token =
      req.headers?.authorization?.split(" ")[1] || req.cookies?.token;

    if (!token) {
      res.clearCookie("token");
      return res.status(400).json({
        success: false,
        message: "Token not found",
      });
    }

    res.clearCookie("token");

    return res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.error(error.message);
    res.clearCookie("token");
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    const page = parseInt(req.query.page) || 1; // default to page 1
    const limit = 50;
    const skip = (page - 1) * limit;

    const [users, totalUsers] = await Promise.all([
      User.find().skip(skip).limit(limit),
      User.countDocuments(),
    ]);

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      users,
      meta: {
        totalUsers,
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        hasNextPage: page * limit < totalUsers,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user?.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateUserRole = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Forbidden",
    });
  }

  const userId = req.params.id;
  const role = req.body.role;

  if (!userId || !role) {
    return res.status(400).json({
      success: false,
      message: "Provide userId and role",
    });
  }

  try {
    const user = await User.findByIdAndUpdate(userId, {
      role,
    }, { new: true })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User role updated successfully",
      user
    })
  } catch (error) {
    console.error("Error updating user role:", error.message);
  }
};

export const updateUserSkills = async (req, res) => {
  const userId = req.params.id; // comes from /users/:id/skills
  const { skills } = req.body;

  // Validation for skills only
  if (!userId || !skills || !Array.isArray(skills) || skills.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Provide userId and at least one skill",
    });
  }

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { skills },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User skills updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating user skills:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};