import z from "zod";

export const changeUserActivationSchema = z.object({
  active: z.boolean('O campo deve conter um valor booleano')
});

export type ChangeUserActivationSchema = z.infer<typeof changeUserActivationSchema>;