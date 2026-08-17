import { verifyToken } from '../config/jwt.js';
import prisma from '../config/database.js';
import { errorResponse } from '../utils/apiResponse.js';

export async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Token no proporcionado', 401);
    }

    const token = authHeader.split(' ')[1];
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
