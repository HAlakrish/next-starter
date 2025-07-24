import z, { object } from "zod";

// Define available roles (removed guest)
export const UserRole = z.enum(["admin", "manager", "user"]);

export const signInSchema = object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

// User schema with role
export const userSchema = object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
  role: UserRole,
});

export type UserRole = z.infer<typeof UserRole>;
export type User = z.infer<typeof userSchema>;
