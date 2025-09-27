import z from "zod";

export const resourceSchema = z.object({
  id: z.number().int().positive(),
  type: z.string(),
  description: z.string(),
});

export type ResourceSchema = z.infer<typeof resourceSchema>;