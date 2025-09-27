import z from "zod";

export const permissionSchema = z.object({
  id: z.number().int().positive(),
  type: z.string(),
  description: z.string(),
});

export type PermissionSchema = z.infer<typeof permissionSchema>;