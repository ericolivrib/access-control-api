import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

export function hashPassword(raw: string): string {
  const salt = bcrypt.genSaltSync(SALT_ROUNDS);
  return bcrypt.hashSync(raw, salt);
}