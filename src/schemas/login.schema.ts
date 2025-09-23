import z from "zod";

export const loginSchema = z.object({
  email: z.email('Formato de e-mail inválido').nonempty('E-mail não pode estar vazio'),
  password: z.string().nonempty('Senha não pode estar vazia')
});

export type LoginSchema = z.infer<typeof loginSchema>;