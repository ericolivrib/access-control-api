import { ACCESS_STATUSES } from "@/models/access.model";
import { PERMISSION_TYPES } from "@/models/permission.model";
import z from "zod";

export const accessSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  permission: z.object({
    type: z.enum(PERMISSION_TYPES)
  }),
  status: z.enum(ACCESS_STATUSES),
  expiresAt: z.date().nullable(),
  grantedAt: z.date(),
  revokedAt: z.date().nullable()
});

export type AccessSchema = z.infer<typeof accessSchema>;