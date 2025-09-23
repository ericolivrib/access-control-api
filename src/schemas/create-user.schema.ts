import z from "zod";

export const createUserSchema = z.object({
  name: z.string().min(3).max(50),
  email: z.string().min(10).max(100),
  password: z.string().min(8).max(100),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;