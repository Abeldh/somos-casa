import prisma from '../config/database.js';
import { hashPassword, comparePassword } from '../utils/hashPassword.js';
import { generateToken } from '../utils/generateToken.js';

export const authService = {
  async register({ firstName, lastName, email, phone, password }) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      const error = new Error('El email ya está registrado');
      error.statusCode = 409;
      throw error;
    }

    const hashed = await hashPassword(password);
    const user = await prisma.user.create({
      data: { firstName, lastName, email, phone, password: hashed },
      select: { id: true, email: true, firstName: true, lastName: true, role: true },
    });

    const token = generateToken(user);
    return { user, token };
  },

  async login({ email, password }) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) {
      const error = new Error('Credenciales incorrectas');
      error.statusCode = 401;
      throw error;
    }

    const valid = await comparePassword(password, user.password);
    if (!valid) {
      const error = new Error('Credenciales incorrectas');
      error.statusCode = 401;
      throw error;
    }

    const token = generateToken(user);
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  },

  async getMe(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, firstName: true, lastName: true, phone: true, role: true, createdAt: true },
    });

    if (!user) {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    }

    return { user };
  },
};
