import logger from "@/utils/logger";
import z from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test'], 'Ambiente desconhecido').default('development'),
  SERVER_HOST: z.string().default('localhost'),
  SERVER_PORT: z.coerce.number().default(3000),
  SERVER_URL: z.url()
    .refine((url) => url.startsWith('http://') || url.startsWith('https://'), 'URL do servidor deve começar com http:// ou https://')
    .default('http://localhost:3000'),
  DATABASE_URL: z.string('URL da base de dados deve ser informada').min(1, "URL da base de dados é obrigatória"),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  JWT_SECRET: z.string('Chave secreta do JWT deve ser informada').min(1, "Chave secreta do JWT é obrigatória"),
  JWT_EXPIRES_IN: z.string()
    .regex(/^(\d+)([smhd])$/, "Tempo de expiração do JWT deve estar no formato <número><s|m|h|d> (ex: 1h, 30m)")
    .default('1h'),
  JWT_ISSUER: z.string('Emissor do JWT deve ser informado').min(1, "Emissor do JWT é obrigatório"),
  SEEDER_ADMIN_PASSWORD: z.string().min(8, "Senha do administrador deve ter no mínimo 8 caracteres").optional(),
  SEEDER_ADMIN_EMAIL: z.email("E-mail do administrador válido").optional(),
});

type EnvSchema = z.infer<typeof envSchema>;

export const environment: EnvSchema = (() => {
  const parsedEnv = envSchema.safeParse(process.env);
  if (!parsedEnv.success) {
    const { fieldErrors } = z.flattenError(parsedEnv.error);
    logger.fatal(fieldErrors, 'Erros na validação das variáveis de ambiente');
    process.exit(1);
  }
  return parsedEnv.data;
})();
