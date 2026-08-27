import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.EMAIL_FROM || 'Somos Casa <onboarding@resend.dev>';
const CLIENT_URL = process.env.CLIENT_URL || 'https://somos-casa-production.up.railway.app';

// Verificar configuración al iniciar
if (process.env.RESEND_API_KEY) {
  console.log('✅ Email configurado con Resend');
} else {
  console.warn('⚠️ RESEND_API_KEY no configurada — emails deshabilitados');
}

async function send({ to, subject, html }) {
  if (!process.env.RESEND_API_KEY) {
    console.warn(`[Email] Skipped (no API key): ${subject} → ${to}`);
    return null;
  }
  try {
    const { data, error } = await resend.emails.send({ from: FROM, to, subject, html });
    if (error) {
      console.error('[Email] Error:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.error('[Email] Error:', err.message);
    return null;
  }
}

export const emailService = {
  async sendAppointmentConfirmation({ to, firstName, date, time }) {
    return send({
      to,
      subject: 'Cita confirmada - Somos Casa',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c3aed;">¡Tu cita ha sido confirmada!</h2>
          <p>Hola ${firstName},</p>
          <p>Tu sesión de asesoría ha sido confirmada:</p>
          <div style="background: #f5f3ff; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>Fecha:</strong> ${date}</p>
            <p><strong>Hora:</strong> ${time}</p>
          </div>
          <p>Si necesitas reprogramar o cancelar, ingresa a tu panel de usuario.</p>
          <p style="color: #666; font-size: 14px;">— Equipo Somos Casa</p>
        </div>
      `,
    });
  },

  async sendAppointmentCancellation({ to, firstName, date, time }) {
    return send({
      to,
      subject: 'Cita cancelada - Somos Casa',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c3aed;">Cita cancelada</h2>
          <p>Hola ${firstName},</p>
          <p>Tu cita del <strong>${date}</strong> a las <strong>${time}</strong> ha sido cancelada.</p>
          <p>Puedes agendar una nueva cita cuando gustes desde tu panel.</p>
          <p style="color: #666; font-size: 14px;">— Equipo Somos Casa</p>
        </div>
      `,
    });
  },

  async sendWelcome({ to, firstName }) {
    return send({
      to,
      subject: '¡Bienvenido a Somos Casa!',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c3aed;">¡Bienvenido, ${firstName}!</h2>
          <p>Estamos felices de que te hayas unido a nuestra comunidad.</p>
          <p>En Somos Casa te acompañamos a fortalecer tu matrimonio con asesoría profesional y recursos educativos.</p>
          <p><a href="${CLIENT_URL}/booking" style="background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Agendar mi primera cita</a></p>
          <p style="color: #666; font-size: 14px;">— Equipo Somos Casa</p>
        </div>
      `,
    });
  },

  async sendDownloadReady({ to, firstName, orderNumber, books }) {
    return send({
      to,
      subject: '¡Tus libros están listos! - Somos Casa',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c3aed;">¡Pago confirmado!</h2>
          <p>Hola ${firstName},</p>
          <p>Hemos verificado tu pago para la orden <strong>${orderNumber}</strong>.</p>
          <div style="background: #f0fdf4; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #22c55e;">
            <p style="margin: 0; font-weight: bold; color: #166534;">Tus libros disponibles:</p>
            <p style="margin: 8px 0 0; color: #166534;">${books}</p>
          </div>
          <p>Ya puedes descargarlos desde tu perfil en "Mis Libros".</p>
          <p><a href="${CLIENT_URL}/dashboard" style="background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Ir a Mis Libros</a></p>
          <p style="color: #666; font-size: 14px;">— Equipo Somos Casa</p>
        </div>
      `,
    });
  },

  async sendPasswordReset({ to, firstName, resetUrl, expiresIn }) {
    return send({
      to,
      subject: 'Recupera tu contraseña - Somos Casa',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c3aed;">Recuperación de contraseña</h2>
          <p>Hola ${firstName},</p>
          <p>Recibimos una solicitud para restablecer tu contraseña. Si no fuiste tú, ignora este correo.</p>
          <p style="margin: 24px 0;">
            <a href="${resetUrl}" style="background: #7c3aed; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
              Restablecer contraseña
            </a>
          </p>
          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px 16px; border-radius: 4px; margin: 16px 0;">
            <p style="margin: 0; font-size: 14px; color: #92400e;">
              Este enlace expira en <strong>${expiresIn}</strong>. Solo se puede usar una vez.
            </p>
          </div>
          <p style="font-size: 13px; color: #666;">Si no solicitaste este cambio, tu cuenta está segura.</p>
          <p style="color: #666; font-size: 14px;">— Equipo Somos Casa</p>
        </div>
      `,
    });
  },

  async sendSecurityAlert({ to, subject, detail, affectedUser }) {
    return send({
      to,
      subject: `Alerta de Seguridad: ${subject}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 16px; border-radius: 4px;">
            <h2 style="color: #dc2626; margin: 0 0 8px;">Alerta de Seguridad</h2>
            <p style="margin: 0; color: #991b1b;"><strong>${subject}</strong></p>
          </div>
          <div style="padding: 16px 0;">
            <p><strong>Usuario:</strong> ${affectedUser}</p>
            <p><strong>Detalle:</strong> ${detail}</p>
            <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-MX')}</p>
          </div>
          <p style="color: #666; font-size: 12px;">Email automático del sistema de seguridad de Somos Casa.</p>
        </div>
      `,
    });
  },
};
