export const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://somoscasa.com']
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
