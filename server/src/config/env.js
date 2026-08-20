import dotenv from 'dotenv';

// Cargar .env si existe (desarrollo local). En Railway las variables se inyectan automáticamente.
dotenv.config();

export const env = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM,
  },
};
