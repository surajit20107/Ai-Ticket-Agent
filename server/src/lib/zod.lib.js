import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(5, "Name must be at least 5 characters long")
    .max(50, "Name should not exceed 50 characters"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(15, "Email must be at least 15 characters long")
    .max(50, "Email should not exceed 50 characters")
    .refine(
      (email) => {
        const emailRegex = /^\S+@\S+\.\S+$/;
        return emailRegex.test(email);
      },
      {
        message: "Invalid email address",
      },
    ),
  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters long")
    .max(50, "Password should not exceed 50 characters"),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(15, "Email must be at least 15 characters long")
    .max(50, "Email should not exceed 50 characters")
    .refine(
      (email) => {
        const emailRegex = /^\S+@\S+\.\S+$/;
        return emailRegex.test(email);
      },
      {
        message: "Invalid email address",
      },
    ),
  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters long")
    .max(50, "Password should not exceed 50 characters"),
});

export const ticketSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters long")
    .max(50, "Title should not exceed 50 characters"),
  description: z
    .string()
    .min(5, "Description must be at least 5 characters long")
    .max(200, "Description should not exceed 200 characters"),
});
