import jwt from 'jsonwebtoken';

export function getJwtExpiration(accessToken: string): Date {
  const { exp } = jwt.decode(accessToken) as jwt.JwtPayload;
  return new Date(exp! * 1000);
}