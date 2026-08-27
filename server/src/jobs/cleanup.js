import prisma from '../config/database.js';

/**
 * Job de limpieza de datos expirados/obsoletos.
 * Se ejecuta periódicamente para mantener la DB limpia.
 * 
 * - Refresh tokens expirados o revocados (> 7 días)
 * - Password reset tokens expirados o usados (> 24h)
 * - Audit logs antiguos (> 90 días)
 * - Notificaciones leídas antiguas (> 60 días)
 */

const RETENTION = {
  refreshTokens: 7 * 24 * 60 * 60 * 1000,      // 7 días
  passwordResetTokens: 24 * 60 * 60 * 1000,     // 24 horas
  auditLogs: 90 * 24 * 60 * 60 * 1000,          // 90 días
  readNotifications: 60 * 24 * 60 * 60 * 1000,  // 60 días
};

export async function runCleanup() {
  const now = new Date();
  const results = {};

  try {
    // 1. Limpiar refresh tokens expirados o revocados
    const tokenCutoff = new Date(now.getTime() - RETENTION.refreshTokens);
    const deletedTokens = await prisma.refreshToken.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: now } },
          { isRevoked: true, createdAt: { lt: tokenCutoff } },
        ],
      },
    });
    results.refreshTokens = deletedTokens.count;

    // 2. Limpiar password reset tokens expirados o usados
    const resetCutoff = new Date(now.getTime() - RETENTION.passwordResetTokens);
    const deletedResets = await prisma.passwordResetToken.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: now } },
          { usedAt: { not: null }, createdAt: { lt: resetCutoff } },
        ],
      },
    });
    results.passwordResetTokens = deletedResets.count;

    // 3. Limpiar audit logs antiguos (> 90 días)
    const auditCutoff = new Date(now.getTime() - RETENTION.auditLogs);
    const deletedLogs = await prisma.auditLog.deleteMany({
      where: { createdAt: { lt: auditCutoff } },
    });
    results.auditLogs = deletedLogs.count;

    // 4. Limpiar notificaciones leídas antiguas (> 60 días)
    const notifCutoff = new Date(now.getTime() - RETENTION.readNotifications);
    const deletedNotifs = await prisma.notification.deleteMany({
      where: { isRead: true, createdAt: { lt: notifCutoff } },
    });
    results.readNotifications = deletedNotifs.count;

    const totalCleaned = Object.values(results).reduce((sum, n) => sum + n, 0);
    if (totalCleaned > 0) {
      console.log(`[Cleanup] Eliminados: ${JSON.stringify(results)}`);
    }

    return results;
  } catch (error) {
    console.error('[Cleanup] Error:', error.message);
    return null;
  }
}

/**
 * Inicia el job de limpieza con intervalo configurable.
 * Por defecto cada 6 horas.
 */
export function startCleanupJob(intervalMs = 6 * 60 * 60 * 1000) {
  // Ejecutar una vez al iniciar (con delay de 30s para no bloquear el startup)
  setTimeout(() => runCleanup(), 30000);

  // Ejecutar periódicamente
  setInterval(() => runCleanup(), intervalMs);

  console.log(`[Cleanup] Job programado cada ${Math.round(intervalMs / 3600000)}h`);
}
