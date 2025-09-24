import { environment } from "@/schemas/env.schema";
import pino from "pino";

export default pino({
  level: environment.LOG_LEVEL,
});