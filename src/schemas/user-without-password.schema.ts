import z from "zod";

export const userWithoutPasswordSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
  role: z.enum(['admin', 'user']),
  active: z.boolean(),
});

export type UserWithoutPasswordSchema = z.infer<typeof userWithoutPasswordSchema>;