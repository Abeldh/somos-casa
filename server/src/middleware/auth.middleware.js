import { verifyToken } from '../config/jwt.js';
import prisma from '../config/database.js';
import { errorResponse } from '../utils/apiResponse.js';

export async function authMiddleware(req, res, next) {
  try {
    // Leer token de: 1) Cookie httpOnly, 2) Header Authorization (compatibilidad)
    let token = req.cookies?.access_token;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    if (!token) {
      return errorResponse(res, 'Token no proporcionado', 401);
    }

    const decoded = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      return errorResponse(res, 'Usuario no autorizado', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    return errorResponse(res, 'Token inválido o expirado', 401);
  }
}
