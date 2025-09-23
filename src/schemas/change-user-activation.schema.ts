import z from "zod";

export const changeUserActivationSchema = z.object({
  active: z.boolean()
});

export type ChangeUserActivationSchema = z.infer<typeof changeUserActivationSchema>;