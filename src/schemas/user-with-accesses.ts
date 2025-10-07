import { PERMISSION_TYPES, PermissionType } from "@/models/permission.model";
import z from "zod";

export const userWithAccesses = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
  role: z.enum(['admin', 'user']),
  active: z.boolean(),
  accesses: z.object({
    permission: z.object({
      type: z.enum(PERMISSION_TYPES)
    }),
    grantedAt: z.date(),
    expiresAt: z.date(),
  }).array()
});

export type UserWithAccesses = z.infer<typeof userWithAccesses>;
