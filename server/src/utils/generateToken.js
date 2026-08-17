import { signToken } from '../config/jwt.js';

export function generateToken(user) {
  return signToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });
}
