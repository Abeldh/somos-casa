// Orígenes permitidos en producción. Se puede sobrescribir/extender con la
// variable de entorno CORS_ORIGINS (lista separada por comas).
const productionOrigins = [
  'https://somos-casa-production.up.railway.app',
  'https://somoscasa.com',
  'https://www.somoscasa.com',
  ...(process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim()) : []),
];

export const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? productionOrigins
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
