import z from "zod";

export const resourceSchema = z.object({
  id: z.number().int().positive(),
  label: z.string(),
  description: z.string(),
});

export type ResourceSchema = z.infer<typeof resourceSchema>;