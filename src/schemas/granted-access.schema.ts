import z from "zod";
import { accessSchema } from "./access.schema";

export const grantedAccessSchema = accessSchema.omit({ revokedAt: true });

export type GrantedAccessSchema = z.infer<typeof grantedAccessSchema>;