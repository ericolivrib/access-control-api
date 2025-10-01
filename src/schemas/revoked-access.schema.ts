import { ACCESS_STATUSES } from "@/models/accesses.model";
import { PERMISSION_TYPES } from "@/models/permissions.model";
import z from "zod";
import { accessSchema } from "./access.schema";

export const revokedAccessSchema = accessSchema.omit({
  expiresAt: true
});

export type RevokedAccessSchema = z.infer<typeof revokedAccessSchema>;
