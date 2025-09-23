import z from "zod";

export const accessTokenSchema = z.object({
  token: z.string(),
  expiresAt: z.date()
});

export type AccessTokenSchema = z.infer<typeof accessTokenSchema>;