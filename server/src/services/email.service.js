import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

const transporter = nodemailer.createTransport({
  host: env.smtp.host,
  port: env.smtp.port,
  secure: false,
  auth: {
    user: env.smtp.user,
    pass: env.smtp.pass,
  },
});

export const emailService = {
  async sendAppointmentConfirmation({ to, firstName, date, time }) {
    try {
      await transporter.sendMail({
        from: env.smtp.from,
        to,
        subject: 'Cita confirmada - Somos Casa',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #cc4035;">¡Tu cita ha sido confirmada!</h2>
            <p>Hola ${firstName},</p>
            <p>Tu sesión de asesoría ha sido confirmada con los siguientes datos:</p>
            <div style="background: #fdf4f3; padding: 16px; border-radius: 8px; margin: 16px 0;">
              <p><strong>Fecha:</strong> ${date}</p>
              <p><strong>Hora:</strong> ${time}</p>
            </div>
            <p>Si necesitas reprogramar o cancelar, ingresa a tu panel de usuario.</p>
            <p style="color: #666; font-size: 14px;">— Equipo Somos Casa</p>
          </div>
        `,
      });
    } catch (error) {
      console.error('Error enviando email:', error.message);
    }
  },

  async sendAppointmentCancellation({ to, firstName, date, time }) {
    try {
      await transporter.sendMail({
        from: env.smtp.from,
        to,
        subject: 'Cita cancelada - Somos Casa',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #cc4035;">Cita cancelada</h2>
            <p>Hola ${firstName},</p>
            <p>Tu cita del <strong>${date}</strong> a las <strong>${time}</strong> ha sido cancelada.</p>
            <p>Puedes agendar una nueva cita cuando gustes desde tu panel.</p>
            <p style="color: #666; font-size: 14px;">— Equipo Somos Casa</p>
          </div>
        `,
      });
    } catch (error) {
      console.error('Error enviando email:', error.message);
    }
  },

  async sendWelcome({ to, firstName }) {
    try {
      await transporter.sendMail({
        from: env.smtp.from,
        to,
        subject: '¡Bienvenido a Somos Casa!',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #cc4035;">¡Bienvenido, ${firstName}!</h2>
            <p>Estamos felices de que te hayas unido a nuestra comunidad.</p>
            <p>En Somos Casa te acompañamos a fortalecer tu matrimonio con asesoría profesional, podcasts y contenido educativo.</p>
            <p><a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/booking" style="background: #cc4035; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Agendar mi primera cita</a></p>
            <p style="color: #666; font-size: 14px;">— Equipo Somos Casa</p>
          </div>
        `,
      });
    } catch (error) {
      console.error('Error enviando email:', error.message);
    }
  },

  async sendDownloadReady({ to, firstName, orderNumber, books }) {
    try {
      await transporter.sendMail({
        from: env.smtp.from,
        to,
        subject: '📚 ¡Tus libros están listos para descargar! - Somos Casa',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #cc4035;">¡Pago confirmado!</h2>
            <p>Hola ${firstName},</p>
            <p>Hemos verificado tu pago para la orden <strong>${orderNumber}</strong>.</p>
            <div style="background: #f0fdf4; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #22c55e;">
              <p style="margin: 0; font-weight: bold; color: #166534;">📖 Tus libros disponibles:</p>
              <p style="margin: 8px 0 0; color: #166534;">${books}</p>
            </div>
            <p>Ya puedes descargar tus libros desde tu perfil en la sección <strong>"Mis Libros"</strong>.</p>
            <p style="margin-top: 24px;">
              <a href="${process.env.CLIENT_URL || 'https://somos-casa-production.up.railway.app'}/dashboard" 
                 style="background: #cc4035; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
                Ir a Mis Libros
              </a>
            </p>
            <p style="color: #666; font-size: 14px; margin-top: 24px;">— Equipo Somos Casa</p>
          </div>
        `,
      });
    } catch (error) {
      console.error('Error enviando email de descarga:', error.message);
    }
  },

  async sendSecurityAlert({ to, subject, detail, affectedUser }) {
    try {
      await transporter.sendMail({
        from: env.smtp.from,
        to,
        subject: `🚨 Alerta de Seguridad: ${subject}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 16px; border-radius: 4px;">
              <h2 style="color: #dc2626; margin: 0 0 8px;">🚨 Alerta de Seguridad</h2>
              <p style="margin: 0; color: #991b1b;"><strong>${subject}</strong></p>
            </div>
            <div style="padding: 16px 0;">
              <p><strong>Usuario afectado:</strong> ${affectedUser}</p>
              <p><strong>Detalle:</strong> ${detail}</p>
              <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-MX')}</p>
            </div>
            <p style="color: #666; font-size: 12px;">Este es un email automático del sistema de seguridad de Somos Casa.</p>
          </div>
        `,
      });
    } catch (error) {
      console.error('Error enviando alerta:', error.message);
    }
  },

  async sendPasswordReset({ to, firstName, resetUrl, expiresIn }) {
    try {
      await transporter.sendMail({
        from: env.smtp.from,
        to,
        subject: '🔐 Recupera tu contraseña - Somos Casa',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #cc4035;">Recuperación de contraseña</h2>
            <p>Hola ${firstName},</p>
            <p>Recibimos una solicitud para restablecer tu contraseña. Si no fuiste tú, puedes ignorar este correo.</p>
            <p style="margin: 24px 0;">
              <a href="${resetUrl}" style="background: #cc4035; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                Restablecer contraseña
              </a>
            </p>
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px 16px; border-radius: 4px; margin: 16px 0;">
              <p style="margin: 0; font-size: 14px; color: #92400e;">
                ⏰ Este enlace expira en <strong>${expiresIn}</strong>.<br>
                🔒 Solo se puede usar una vez.
              </p>
            </div>
            <p style="font-size: 13px; color: #666;">Si no solicitaste este cambio, tu cuenta está segura. Nadie puede cambiar tu contraseña sin acceso a este correo.</p>
            <p style="color: #666; font-size: 14px; margin-top: 24px;">— Equipo Somos Casa</p>
          </div>
        `,
      });
    } catch (error) {
      console.error('Error enviando email de reset:', error.message);
    }
  },
};
