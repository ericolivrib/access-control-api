import z from "zod";

export const apiResponseSchema = z.object({
  message: z.string(),
  data: z.optional(z.any()),
});

export type ApiResponseSchema = z.infer<typeof apiResponseSchema>;