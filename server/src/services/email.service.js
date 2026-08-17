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
};
