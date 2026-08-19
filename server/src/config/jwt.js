import jwt from 'jsonwebtoken';
import { env } from './env.js';

export function signToken(payload, expiresIn = null) {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: expiresIn || env.jwtExpiresIn,
    issuer: 'somos-casa',
    audience: 'somos-casa-api',
  });
}

export function verifyToken(token) {
  return jwt.verify(token, env.jwtSecret, {
    issuer: 'somos-casa',
    audience: 'somos-casa-api',
  });
}
