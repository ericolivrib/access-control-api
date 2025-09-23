import z from "zod";

export const createUserSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(50, 'Nome deve ter no máximo 50 caracteres'),
  email: z.string().min(10, 'E-mail deve ter no mínimo 10 caracteres').max(100, 'E-mail deve ter no máximo 100 caracteres'),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;