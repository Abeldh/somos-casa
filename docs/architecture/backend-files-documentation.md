# Documentación de Arquitectura — Backend

**Stack:** Node.js + Express.js + Prisma ORM + PostgreSQL  
**Autenticación:** JWT (access + refresh tokens en cookies httpOnly)  
**Seguridad:** bcrypt, rate limiting, CSP, HSTS, sanitización, MFA (TOTP), HIBP password check  
**Deploy:** Railway

---

## Estructura de Archivos

```
server/
├── prisma/
│   ├── schema.prisma              # Modelos de base de datos
│   ├── migrations/                # Migraciones SQL
│   └── seed/index.js              # Datos iniciales (admin, demo)
├── src/
│   ├── index.js                   # Entry point (validación env, arranque, graceful shutdown, cleanup tokens)
│   ├── app.js                     # Express app (security headers, cookies, cors, sanitize, routes, static)
│   ├── config/
│   │   ├── cors.js                # CORS restrictivo por entorno
│   │   ├── database.js            # Prisma Client singleton
│   │   ├── env.js                 # Variables de entorno centralizadas (dotenv)
│   │   └── jwt.js                 # Firma/verificación JWT (issuer, audience)
│   ├── controllers/
│   │   ├── appointment.controller.js  # Citas + zoom URL + liberar sesiones + comprobante
│   │   ├── audit.controller.js        # Logs de auditoría + export CSV/Excel
│   │   ├── auth.controller.js         # Login, register, refresh, logout, MFA, changePassword + cookies
│   │   ├── availability.controller.js # Gestión disponibilidad horarios
│   │   ├── book.controller.js         # CRUD libros + toggle featured/active
│   │   ├── cart.controller.js         # Carrito: add, update, remove, clear
│   │   ├── media.controller.js        # CRUD multimedia (Spotify/YouTube)
│   │   ├── order.controller.js        # Crear orden, confirmar pago, upload comprobante, mis libros
│   │   ├── testimonial.controller.js  # Testimonios: crear, aprobar, toggle, eliminar
│   │   ├── upload.controller.js       # Firma para Cloudinary signed uploads
│   │   └── user.controller.js         # Admin: listar usuarios, actividad completa, roles
│   ├── middleware/
│   │   ├── admin.middleware.js        # Verifica rol ADMIN
│   │   ├── auth.middleware.js         # Verifica JWT (cookie httpOnly o header Bearer)
│   │   ├── errorHandler.middleware.js # Manejo centralizado de errores (no expone internals)
│   │   ├── rateLimiter.middleware.js  # Rate limiting in-memory (15 auth / 200 API por 15min)
│   │   ├── sanitize.middleware.js     # XSS escape, NoSQL injection, prototype pollution, maxLength
│   │   ├── security.middleware.js     # CSP, HSTS, X-Frame, Referrer-Policy, Permissions-Policy, CORP
│   │   └── validate.middleware.js     # Validación schemas (required, min/max, email, url, enum, integer)
│   ├── routes/
│   │   ├── index.js                   # Router principal + health check con métricas
│   │   ├── appointment.routes.js      # /api/appointments/* + release-sessions + zoom + proof
│   │   ├── audit.routes.js            # /api/audit/* + /export (CSV)
│   │   ├── auth.routes.js             # /api/auth/* (login, register, refresh, MFA, change-password)
│   │   ├── availability.routes.js     # /api/availability/*
│   │   ├── book.routes.js             # /api/books/* + admin CRUD
│   │   ├── cart.routes.js             # /api/cart/*
│   │   ├── media.routes.js            # /api/media/*
│   │   ├── order.routes.js            # /api/orders/* + confirm-payment + proof upload
│   │   ├── testimonial.routes.js      # /api/testimonials/* + approve/toggle
│   │   ├── upload.routes.js           # /api/upload/signature (signed Cloudinary)
│   │   └── user.routes.js             # /api/users/* (admin)
│   ├── services/
│   │   ├── appointment.service.js     # Citas + validación sesiones + liberar + zoom + cancelar (devuelve sesión)
│   │   ├── auth.service.js            # Registro (HIBP check), login (MFA), refresh, logout, change password
│   │   ├── availability.service.js    # Gestión horarios disponibles
│   │   ├── book.service.js            # CRUD libros + caché in-memory con invalidación
│   │   ├── cart.service.js            # Carrito con validación de stock
│   │   ├── email.service.js           # Emails: welcome, booking, descarga ready, security alerts
│   │   ├── media.service.js           # CRUD multimedia + caché
│   │   ├── mfa.service.js            # TOTP MFA nativo (Google Authenticator compatible)
│   │   ├── order.service.js           # Crear orden (lock optimista stock), confirmar pago, mis libros
│   │   ├── testimonial.service.js     # Testimonios: crear, aprobar, toggle, eliminar + caché
│   │   ├── token.service.js           # Refresh tokens: rotación, detección reutilización, alertas admin
│   │   └── user.service.js            # Usuarios + actividad completa (órdenes, citas, audit, sesiones)
│   ├── utils/
│   │   ├── apiResponse.js            # Helpers respuesta (success, error, created)
│   │   ├── auditLog.js               # Sistema auditoría + device detection (IP, browser, OS, mobile/desktop)
│   │   ├── cache.js                   # Caché in-memory con TTL + invalidación por patrón
│   │   ├── deviceParser.js            # Parser User-Agent → tipo dispositivo, browser, OS
│   │   ├── formatDate.js             # Utilidades de fecha (ISO, rangos, start/end of day)
│   │   ├── generateToken.js          # Genera access token JWT
│   │   ├── hashPassword.js           # bcrypt hash + compare (12 rounds)
│   │   └── passwordCheck.js          # Have I Been Pwned API (k-anonymity, breach detection)
│   └── validators/
│       ├── appointment.validator.js   # Schema: fecha, horas, pareja, motivo (maxLength)
│       ├── auth.validator.js          # Schema: email, password min 8, nombres (maxLength 100)
│       └── media.validator.js         # Schema: tipo enum, título, URL (maxLength)
└── package.json                       # Dependencies: express, prisma, bcryptjs, jsonwebtoken, nodemailer, cookie-parser
```

---

## Modelos de Base de Datos

| Modelo | Descripción |
|--------|-------------|
| **User** | Roles CLIENT/ADMIN, sesiones restantes, proof URL, soft-delete |
| **Appointment** | Citas con status, zoom URL, relación User |
| **Availability** | Slots horarios del asesor |
| **Media** | Links Spotify/YouTube con orden |
| **Book** | Libros digitales: portada, PDF, precio, stock, slug, featured |
| **CartItem** | Items carrito (unique userId+bookId) |
| **Order** | Pedidos con status, total, proof URL |
| **OrderItem** | Items de orden (snapshot título/precio) |
| **RefreshToken** | Tokens refresco: familia, rotación, revocación |
| **MfaSecret** | Secrets TOTP para 2FA |
| **AuditLog** | Logs seguridad: event, IP, device, browser, OS |
| **Testimonial** | Testimonios: texto, rating, aprobación admin |

---

## API Endpoints

### Auth (`/api/auth`)
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/register` | — | Registro + HIBP check + cookies |
| POST | `/login` | — | Login + MFA + cookies |
| POST | `/refresh` | — | Renovar tokens (rotación) |
| POST | `/logout` | ✓ | Revocar tokens + clear cookies |
| GET | `/me` | ✓ | Datos usuario + mfaEnabled |
| POST | `/change-password` | ✓ | Cambiar contraseña (HIBP check) |
| GET | `/mfa/status` | ✓ | Estado MFA |
| POST | `/mfa/setup` | ✓ | Generar QR |
| POST | `/mfa/verify` | ✓ | Activar MFA |
| POST | `/mfa/disable` | ✓ | Desactivar MFA |

### Appointments (`/api/appointments`)
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/` | ✓ | Crear cita (valida sesiones disponibles) |
| GET | `/me` | ✓ | Mis citas + sesiones restantes |
| PATCH | `/:id/cancel` | ✓ | Cancelar (devuelve sesión) |
| PATCH | `/session-proof` | ✓ | Subir comprobante de pago mensual |
| GET | `/` | Admin | Todas las citas |
| PATCH | `/:id/status` | Admin | Cambiar estado |
| PATCH | `/:id/zoom` | Admin | Agregar URL Zoom |
| POST | `/release-sessions` | Admin | Liberar sesiones tras pago |

### Books (`/api/books`)
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/` | — | Listado paginado con filtros/búsqueda |
| GET | `/categories` | — | Categorías |
| GET | `/featured` | — | Destacados |
| GET | `/:slug` | — | Detalle |
| GET | `/admin/all` | Admin | Todos (incluso inactivos) |
| POST | `/` | Admin | Crear |
| PUT | `/:id` | Admin | Actualizar |
| DELETE | `/:id` | Admin | Soft-delete |
| PATCH | `/:id/active` | Admin | Toggle activo |
| PATCH | `/:id/featured` | Admin | Toggle destacado |

### Orders (`/api/orders`)
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/` | ✓ | Crear pedido (lock optimista stock) |
| GET | `/me` | ✓ | Mis pedidos |
| GET | `/my-books` | ✓ | Libros para descarga (solo PAID) |
| PATCH | `/:id/proof` | ✓ | Subir comprobante de pago |
| GET | `/:id` | ✓ | Detalle pedido |
| GET | `/` | Admin | Todos los pedidos |
| PATCH | `/:id/status` | Admin | Cambiar estado |
| POST | `/:id/confirm-payment` | Admin | Confirmar pago → liberar descarga + email |

### Testimonials (`/api/testimonials`)
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/approved` | — | Testimonios aprobados (landing) |
| POST | `/` | ✓ | Enviar testimonio (pendiente) |
| GET | `/` | Admin | Todos (pendientes + aprobados) |
| PATCH | `/:id/approve` | Admin | Aprobar |
| PATCH | `/:id/toggle` | Admin | Toggle aprobación |
| DELETE | `/:id` | Admin | Eliminar |

### Otros
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/audit` | Admin | Logs de auditoría con filtros |
| GET | `/api/audit/export` | Admin | Exportar CSV/Excel |
| GET | `/api/upload/signature` | Admin | Firma Cloudinary |
| GET | `/api/users` | Admin | Listar usuarios |
| GET | `/api/users/:id/activity` | Admin | Actividad completa |
| GET | `/api/health` | — | Health check + métricas |

---

## Seguridad Implementada

| Capa | Medida |
|------|--------|
| Passwords | bcrypt 12 rounds + HIBP breach check |
| Tokens | JWT 15min access + 7d refresh con rotación + detección robo |
| Cookies | httpOnly, Secure (prod), SameSite=Strict |
| Headers | CSP, HSTS, X-Frame-Options, Permissions-Policy, CORP |
| Input | Sanitización XSS/NoSQL/prototype pollution + maxLength |
| Rate Limit | 15 req auth / 200 req API por 15min por IP |
| MFA | TOTP nativo (Google Authenticator) |
| Auditoría | Logs con IP, device type, browser, OS + export Excel |
| Alertas | Email a admins en TOKEN_REUSE_DETECTED |
| Stock | Lock optimista (updateMany WHERE stock >= qty) |
| Inactividad | Auto-logout 1 hora sin interacción |
| CI/CD | GitHub Actions: npm audit, secret scan, SAST |
