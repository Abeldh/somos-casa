# Documentación de Arquitectura — Backend

**Stack:** Node.js + Express.js + Prisma ORM + PostgreSQL  
**Autenticación:** JWT (access + refresh tokens en cookies httpOnly)  
**Seguridad:** bcrypt, rate limiting, CSP, HSTS, sanitización, MFA (TOTP)

---

## Estructura de Archivos

```
server/
├── prisma/
│   ├── schema.prisma          # Modelos de base de datos
│   ├── migrations/            # Migraciones SQL
│   └── seed/index.js          # Datos iniciales (admin, demo)
├── src/
│   ├── index.js               # Entry point (arranque, validación env, graceful shutdown)
│   ├── app.js                 # Express app (middleware, rutas, static files)
│   ├── config/
│   │   ├── cors.js            # Configuración CORS por entorno
│   │   ├── database.js        # Prisma Client singleton
│   │   ├── env.js             # Variables de entorno centralizadas
│   │   └── jwt.js             # Firma y verificación JWT (issuer, audience)
│   ├── controllers/
│   │   ├── auth.controller.js         # Login, register, refresh, logout, MFA, changePassword
│   │   ├── appointment.controller.js  # CRUD citas (usuario + admin)
│   │   ├── availability.controller.js # Gestión disponibilidad (admin)
│   │   ├── book.controller.js         # CRUD libros + toggle featured/active
│   │   ├── cart.controller.js         # Carrito: add, update, remove, clear
│   │   ├── media.controller.js        # CRUD multimedia (Spotify/YouTube)
│   │   ├── order.controller.js        # Crear orden, confirmar pago, mis libros
│   │   └── user.controller.js         # Admin: listar usuarios, actividad, roles
│   ├── middleware/
│   │   ├── admin.middleware.js        # Verifica rol ADMIN
│   │   ├── auth.middleware.js         # Verifica JWT (cookie o header)
│   │   ├── errorHandler.middleware.js # Manejo centralizado de errores
│   │   ├── rateLimiter.middleware.js  # Rate limiting (API general + auth)
│   │   ├── sanitize.middleware.js     # XSS escape, NoSQL injection, prototype pollution
│   │   ├── security.middleware.js     # CSP, HSTS, X-Frame, Referrer-Policy, Permissions
│   │   └── validate.middleware.js     # Validación de schemas (required, min/max, email, etc)
│   ├── routes/
│   │   ├── index.js                   # Router principal + health check
│   │   ├── auth.routes.js             # /api/auth/* (login, register, refresh, MFA)
│   │   ├── appointment.routes.js      # /api/appointments/*
│   │   ├── availability.routes.js     # /api/availability/*
│   │   ├── book.routes.js             # /api/books/*
│   │   ├── cart.routes.js             # /api/cart/*
│   │   ├── media.routes.js            # /api/media/*
│   │   ├── order.routes.js            # /api/orders/*
│   │   └── user.routes.js             # /api/users/* (admin)
│   ├── services/
│   │   ├── auth.service.js            # Registro, login, refresh, logout, cambio password
│   │   ├── appointment.service.js     # Lógica de citas + validación de slots
│   │   ├── availability.service.js    # Gestión de horarios disponibles
│   │   ├── book.service.js            # CRUD libros + caché in-memory
│   │   ├── cart.service.js            # Carrito con validación de stock
│   │   ├── email.service.js           # Envío emails (welcome, booking, descarga)
│   │   ├── media.service.js           # CRUD multimedia + caché
│   │   ├── mfa.service.js             # TOTP MFA (Google Authenticator)
│   │   ├── order.service.js           # Crear orden, confirmar pago, libros del usuario
│   │   ├── token.service.js           # Refresh tokens con rotación + detección reutilización
│   │   └── user.service.js            # Usuarios + actividad completa
│   ├── utils/
│   │   ├── apiResponse.js            # Helpers de respuesta (success, error, created)
│   │   ├── auditLog.js               # Sistema de auditoría (eventos de seguridad)
│   │   ├── cache.js                   # Caché in-memory con TTL
│   │   ├── formatDate.js             # Utilidades de fecha
│   │   ├── generateToken.js          # Genera access token
│   │   └── hashPassword.js           # bcrypt hash + compare (12 rounds)
│   └── validators/
│       ├── appointment.validator.js   # Schema validación citas
│       ├── auth.validator.js          # Schema validación auth (min 8 chars)
│       └── media.validator.js         # Schema validación multimedia
└── package.json
```

---

## Modelos de Base de Datos (schema.prisma)

| Modelo | Descripción |
|--------|-------------|
| **User** | Usuarios con roles CLIENT/ADMIN, soft-delete (isActive) |
| **Appointment** | Citas de asesoría con status (PENDING/CONFIRMED/CANCELLED/COMPLETED) |
| **Availability** | Slots de tiempo del asesor (fecha + hora inicio/fin + isBooked) |
| **Media** | Links de Spotify/YouTube con tipo, categoría y orden |
| **Book** | Libros digitales con portada, PDF, precio, stock, slug, featured |
| **CartItem** | Items del carrito (unique por userId+bookId) |
| **Order** | Pedidos con número de orden, total, status, datos de envío |
| **OrderItem** | Items de una orden (snapshot de título y precio) |
| **RefreshToken** | Tokens de refresco con familia, rotación y revocación |
| **MfaSecret** | Secrets TOTP para autenticación de 2 factores |
| **AuditLog** | Logs de seguridad (login, logout, cambios, etc) |

---

## API Endpoints

### Auth (`/api/auth`)
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/register` | — | Registro + set cookies |
| POST | `/login` | — | Login + MFA + set cookies |
| POST | `/refresh` | — | Renovar tokens (rotación) |
| POST | `/logout` | ✓ | Revocar tokens + clear cookies |
| GET | `/me` | ✓ | Datos del usuario actual |
| POST | `/change-password` | ✓ | Cambiar contraseña |
| GET | `/mfa/status` | ✓ | Estado de MFA |
| POST | `/mfa/setup` | ✓ | Generar QR para MFA |
| POST | `/mfa/verify` | ✓ | Activar MFA |
| POST | `/mfa/disable` | ✓ | Desactivar MFA |

### Books (`/api/books`)
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/` | — | Listado con filtros, búsqueda, paginación |
| GET | `/categories` | — | Categorías únicas |
| GET | `/featured` | — | Libros destacados |
| GET | `/:slug` | — | Detalle de libro |
| GET | `/admin/all` | Admin | Todos (incluso inactivos) |
| POST | `/` | Admin | Crear libro |
| PUT | `/:id` | Admin | Actualizar libro |
| DELETE | `/:id` | Admin | Soft-delete |
| PATCH | `/:id/active` | Admin | Toggle activo/inactivo |
| PATCH | `/:id/featured` | Admin | Toggle destacado |

### Cart (`/api/cart`)
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/` | ✓ | Ver carrito |
| POST | `/items` | ✓ | Agregar item |
| PATCH | `/items/:id` | ✓ | Actualizar cantidad |
| DELETE | `/items/:id` | ✓ | Eliminar item |
| DELETE | `/` | ✓ | Vaciar carrito |

### Orders (`/api/orders`)
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/` | ✓ | Crear pedido |
| GET | `/me` | ✓ | Mis pedidos |
| GET | `/my-books` | ✓ | Libros disponibles para descarga |
| GET | `/:id` | ✓ | Detalle de pedido |
| GET | `/` | Admin | Todos los pedidos |
| PATCH | `/:id/status` | Admin | Cambiar estado |
| POST | `/:id/confirm-payment` | Admin | Confirmar pago → liberar descarga |

### Users (`/api/users`) — Solo Admin
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/` | Admin | Listar usuarios |
| GET | `/:id` | Admin | Detalle usuario |
| GET | `/:id/activity` | Admin | Actividad completa |
| PATCH | `/:id/role` | Admin | Cambiar rol |
| PATCH | `/:id/toggle-active` | Admin | Activar/desactivar |

---

## Seguridad Implementada

| Capa | Medida |
|------|--------|
| Passwords | bcrypt 12 rounds, min 8 chars |
| Tokens | JWT 15min access + 7d refresh con rotación |
| Cookies | httpOnly, Secure, SameSite=Strict |
| Headers | CSP, HSTS, X-Frame-Options, Permissions-Policy |
| Input | Sanitización XSS, NoSQL injection, prototype pollution, maxLength |
| Rate Limit | 200 req/15min API, 7 intentos/15min auth |
| MFA | TOTP compatible con Google Authenticator |
| Auditoría | Logs de login, logout, cambios, pagos |
| Caché | In-memory con TTL + invalidación por patrón |
