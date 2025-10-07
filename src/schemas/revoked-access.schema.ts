import { ACCESS_STATUSES } from "@/models/access.model";
import { PERMISSION_TYPES } from "@/models/permission.model";
import z from "zod";
import { accessSchema } from "./access.schema";

export const revokedAccessSchema = accessSchema.omit({
  expiresAt: true
});

export type RevokedAccessSchema = z.infer<typeof revokedAccessSchema>;
