import { verifyToken } from '../config/jwt.js';
import prisma from '../config/database.js';

/**
 * Middleware de autenticación opcional.
 * Si hay un token válido, adjunta req.user. Si no, continúa sin bloquear.
 * Útil para endpoints públicos que quieren asociar al usuario cuando esté logueado.
 */
export async function optionalAuthMiddleware(req, res, next) {
  try {
    let token = req.cookies?.access_token;
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }
    if (token) {
      const decoded = verifyToken(token);
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, firstName: true, lastName: true, role: true, isActive: true },
      });
      if (user && user.isActive) req.user = user;
    }
  } catch (e) {
    // Token inválido: continuar como anónimo
  }
  next();
}
