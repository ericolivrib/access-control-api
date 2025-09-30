import { ACCESS_STATUSES } from "@/models/accesses.model";
import { PERMISSION_TYPES } from "@/models/permissions.model";
import z from "zod";

export const revokedAccessSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  permissionType: z.enum(PERMISSION_TYPES),
  status: z.enum(ACCESS_STATUSES),
  revokedAt: z.date(),
  grantedAt: z.date()
});

export type RevokedAccessSchema = z.infer<typeof revokedAccessSchema>;
