import prisma from '../config/database.js';
import crypto from 'crypto';
import { notificationService } from './notification.service.js';

function generateReferralCode(firstName) {
  const prefix = firstName.substring(0, 3).toUpperCase();
  const random = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `${prefix}-${random}`;
}

export const referralService = {
  async getMyReferralCode(userId) {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { referralCode: true, firstName: true } });
    if (!user.referralCode) {
      const code = generateReferralCode(user.firstName);
      await prisma.user.update({ where: { id: userId }, data: { referralCode: code } });
      return { referralCode: code };
    }
    return { referralCode: user.referralCode };
  },

  async getMyReferrals(userId) {
    const referrals = await prisma.referral.findMany({
      where: { referrerId: userId },
      orderBy: { createdAt: 'desc' },
      include: { referred: { select: { firstName: true, lastName: true, createdAt: true } } },
    });
    const stats = {
      total: referrals.length,
      completed: referrals.filter((r) => r.status === 'COMPLETED').length,
      pending: referrals.filter((r) => r.status === 'PENDING').length,
    };
    return { referrals, stats };
  },

  async applyReferralCode(userId, code) {
    if (!code) return null;

    const referrer = await prisma.user.findFirst({ where: { referralCode: code.toUpperCase() } });
    if (!referrer || referrer.id === userId) return null;

    // Verificar que no se haya aplicado ya
    const existing = await prisma.referral.findFirst({ where: { referredId: userId } });
    if (existing) return null;

    const referral = await prisma.referral.create({
      data: { referrerId: referrer.id, referredId: userId, status: 'PENDING' },
    });

    await prisma.user.update({ where: { id: userId }, data: { referredBy: code.toUpperCase() } });

    return referral;
  },

  async completeReferral(referredUserId) {
    const referral = await prisma.referral.findFirst({
      where: { referredId: referredUserId, status: 'PENDING' },
    });
    if (!referral) return;

    await prisma.$transaction([
      prisma.referral.update({ where: { id: referral.id }, data: { status: 'COMPLETED', completedAt: new Date(), bonusGiven: true } }),
      // Bonus: 1 sesión extra para el referente
      prisma.user.update({ where: { id: referral.referrerId }, data: { sessionsRemaining: { increment: 1 }, sessionsTotal: { increment: 1 } } }),
    ]);

    // Notificar al referente
    await notificationService.create({
      userId: referral.referrerId,
      type: 'REFERRAL_BONUS',
      title: 'Bonificación por referido',
      message: 'Un amigo que referiste completó su primera sesión. Recibiste 1 sesión extra como bonificación.',
      link: '/dashboard',
    });
  },

  async getStats() {
    const [total, completed, pending] = await Promise.all([
      prisma.referral.count(),
      prisma.referral.count({ where: { status: 'COMPLETED' } }),
      prisma.referral.count({ where: { status: 'PENDING' } }),
    ]);
    return { total, completed, pending };
  },
};
