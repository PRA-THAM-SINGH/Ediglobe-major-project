/**
 * Input Validation Schemas
 * 
 * Security Note: All user inputs MUST be validated to prevent:
 * - SQL Injection (prevented by parameterized queries + validation)
 * - XSS (prevented by React's auto-escaping + validation)
 * - Data integrity issues
 */

import { z } from "zod";

/**
 * Password validation with security requirements
 * - Minimum 8 characters for reasonable security
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

/**
 * Username validation
 * - Only alphanumeric and underscores (prevents injection attacks)
 * - Length constraints for database compatibility
 */
export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username must not exceed 30 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
  .trim();

/**
 * Email validation with sanitization
 */
export const emailSchema = z
  .string()
  .email("Invalid email address")
  .max(255, "Email must not exceed 255 characters")
  .trim()
  .toLowerCase();

/**
 * Signup form validation schema
 * Ensures all required fields are present and valid
 */
export const signupSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

/**
 * Login form validation schema
 * Simpler validation for login (detailed validation happens at signup)
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

/**
 * Type exports for TypeScript
 */
export type SignupFormData = z.infer<typeof signupSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
