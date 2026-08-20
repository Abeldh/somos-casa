# AUDITORÍA DE SEGURIDAD — SOMOS CASA
## Plataforma de Asesoría Matrimonial + Venta de Libros Digitales

**Fecha:** Agosto 2026  
**Versión:** 2.0  
**Stack:** Node.js + Express + Prisma + PostgreSQL | React + Vite + Tailwind  
**Deploy:** Railway (PostgreSQL + Node.js)

---

## 1. RESUMEN EJECUTIVO

### Nivel de Seguridad Actual: 8.5/10

La plataforma implementa defensa en profundidad con múltiples capas de seguridad. Las vulnerabilidades críticas (P0) han sido mitigadas.

### ✅ MEDIDAS IMPLEMENTADAS

| # | Medida | Estado |
|---|--------|--------|
| 1 | Content-Security-Policy (CSP) | ✅ Implementado |
| 2 | Strict-Transport-Security (HSTS) | ✅ Implementado |
| 3 | Cookies httpOnly para tokens | ✅ Implementado |
| 4 | Refresh tokens con rotación | ✅ Implementado |
| 5 | Detección de reutilización de tokens | ✅ Implementado |
| 6 | Sanitización de inputs (XSS, NoSQL, Prototype Pollution) | ✅ Implementado |
| 7 | Rate limiting (API + Auth) | ✅ Implementado |
| 8 | MFA/2FA (TOTP — Google Authenticator) | ✅ Implementado |
| 9 | Audit logging (eventos de seguridad) | ✅ Implementado |
| 10 | Validación env vars al boot | ✅ Implementado |
| 11 | Password min 8 chars + bcrypt 12 rounds | ✅ Implementado |
| 12 | maxLength en todos los validators | ✅ Implementado |
| 13 | Caché in-memory con TTL + invalidación | ✅ Implementado |
| 14 | Security headers completos | ✅ Implementado |
| 15 | CORS restrictivo por entorno | ✅ Implementado |
| 16 | Body size limit (1MB) | ✅ Implementado |
| 17 | Graceful shutdown con timeout | ✅ Implementado |
| 18 | JWT con issuer + audience validation | ✅ Implementado |
| 19 | Prisma ORM (previene SQL Injection) | ✅ Por diseño |
| 20 | UUIDs como IDs (no enumerables) | ✅ Por diseño |
| 21 | Object-level authorization (IDOR protegido) | ✅ Implementado |
| 22 | Soft-delete de usuarios | ✅ Implementado |
| 23 | Transacciones atómicas en checkout | ✅ Implementado |
| 24 | Checkbox obligatorio T&C (no pre-marcado) | ✅ Implementado |
| 25 | Banner de cookies con opt-in | ✅ Implementado |

---

## 2. ARQUITECTURA DE SEGURIDAD

```
Internet (Usuario)
       │
       ▼
Railway (TLS termination + HTTPS)
       │
       ▼
Express.js
  ├── Security Headers (CSP, HSTS, X-Frame, Referrer-Policy, Permissions)
  ├── Cookie Parser (httpOnly tokens)
  ├── CORS (origins restrictivos)
  ├── Body Limit (1MB)
  ├── Sanitization (XSS, NoSQL, Prototype Pollution)
  ├── Rate Limiting (200 req/15min API, 7/15min auth)
  ├── Compression (gzip >1KB)
  │
  ├── /api/auth → JWT Validation (cookie o header)
  │                 → Refresh Token Rotation
  │                 → MFA (TOTP)
  │                 → Rate Limit (strict)
  │
  ├── /api/* → Auth Middleware → Role Check
  │              → Validate Middleware
  │              → Controller → Service → Prisma (parameterized)
  │
  └── /* → Static Files (cache 1y assets, no-cache HTML)
              → SPA Fallback (index.html)
       │
       ▼
PostgreSQL (Railway — solo conexión interna/pública autenticada)
```

---

## 3. AUTENTICACIÓN

### Flujo Implementado

```
REGISTRO:
  Client → POST /api/auth/register (name, email, password min 8)
  Server → bcrypt hash (12 rounds) → Create user
         → Generate access token (15min) + refresh token (7 días)
         → Set cookies httpOnly (access_token + refresh_token)
         → Response: { user, accessToken }

LOGIN:
  Client → POST /api/auth/login (email, password, [mfaCode])
  Server → Verify password → Check MFA
         → If MFA required: return { requireMfa: true }
         → If OK: Generate token pair → Set cookies
         → Audit log: LOGIN_SUCCESS

REFRESH:
  Client (auto, on 401) → POST /api/auth/refresh
  Server → Read refresh_token from cookie
         → Verify not revoked, not expired
         → If REUSED → Revoke ENTIRE family (theft detection)
         → Rotate: new access + new refresh → Set new cookies
         → Audit log: TOKEN_REFRESH

LOGOUT:
  Client → POST /api/auth/logout
  Server → Revoke all refresh tokens for user
         → Clear cookies
         → Audit log: LOGOUT
```

### Cookies

| Cookie | httpOnly | Secure | SameSite | Path | MaxAge |
|--------|----------|--------|----------|------|--------|
| `access_token` | ✅ | ✅ (prod) | Strict | `/` | 15min |
| `refresh_token` | ✅ | ✅ (prod) | Strict | `/api/auth` | 7 días |

### MFA (TOTP)

- Implementación nativa con `crypto` (sin dependencias externas)
- Compatible con: Google Authenticator, Authy, 1Password, Microsoft Authenticator
- Ventana de tolerancia: ±30 segundos
- Comparación timing-safe para prevenir timing attacks
- Secret almacenado en base32 en tabla `mfa_secrets`

---

## 4. AUTORIZACIÓN

### Roles
| Rol | Permisos |
|-----|----------|
| CLIENT | Ver libros, carrito, comprar, agendar citas, ver mis datos |
| ADMIN | Todo + gestión de libros/citas/media/usuarios/pedidos/config |

### Object-Level Authorization
- Órdenes: `getById` filtra por `{ id, userId }` — un usuario solo ve sus órdenes
- Citas: `cancel` verifica `appointment.userId === req.user.id`
- Carrito: todas las operaciones filtran por `userId`
- Mis libros: solo muestra libros de órdenes con status `PAID`

### Protección IDOR
Un atacante NO puede:
- `GET /api/orders/uuid-de-otro-usuario` → 404
- `PATCH /api/appointments/uuid-ajeno/cancel` → 403
- `GET /api/cart` → solo ve SU carrito

---

## 5. PROTECCIÓN CONTRA ATAQUES

### SQL Injection → Protegido por Prisma ORM
Prisma usa queries parametrizadas internamente. No hay SQL raw en la aplicación.

### XSS → Protegido por CSP + Sanitización + React
- `sanitize.middleware.js` escapa `< > " ' &` en todos los inputs
- CSP bloquea scripts no autorizados
- React escapa HTML por defecto en el render

### NoSQL Injection → Protegido por sanitización
- Bloquea keys que empiezan con `$` (operadores Mongo)
- Bloquea keys con `__proto__`, `constructor`, `prototype`

### Brute Force → Rate Limiting
- 7 intentos de login/registro por IP cada 15 minutos
- 200 requests generales por IP cada 15 minutos
- Response 429 con header `Retry-After`

### Token Theft → Detección de reutilización
- Si un refresh token ya revocado se usa → toda la familia se revoca
- Audit log: `TOKEN_REUSE_DETECTED`
- El usuario legítimo deberá re-autenticarse

### Clickjacking → X-Frame-Options + CSP frame-ancestors
- `X-Frame-Options: SAMEORIGIN`
- `frame-ancestors 'self'` en CSP

### MIME Sniffing → X-Content-Type-Options
- `nosniff` previene que el browser interprete archivos como scripts

### Protocol Downgrade → HSTS
- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- Solo en producción

---

## 6. VALIDACIÓN DE INPUTS

### Middleware de validación (`validate.middleware.js`)
Soporta: `required`, `minLength`, `maxLength`, `isEmail`, `isUrl`, `enum`, `isNumber`, `min`, `max`, `isInteger`

### Límites por campo
| Campo | Max Length |
|-------|-----------|
| Email | 254 |
| Nombre/Apellido | 100 |
| Password | 128 |
| URL | 2000 |
| Título | 500 |
| Descripción/Motivo | 2000 |
| Hora (startTime/endTime) | 10 |
| Nombre de pareja | 200 |

### Body global
- Máximo 1MB por request (previene DoS por payload)
- Arrays truncados a 100 items máximo (sanitize.middleware)
- Strings truncados a 5000 chars máximo (sanitize.middleware)

---

## 7. AUDIT LOGGING

### Eventos Registrados
| Evento | Cuándo |
|--------|--------|
| LOGIN_SUCCESS | Login exitoso |
| LOGIN_FAILED | Credenciales incorrectas |
| REGISTER | Nuevo usuario |
| LOGOUT | Cierre de sesión |
| TOKEN_REFRESH | Renovación de token |
| TOKEN_REUSE_DETECTED | 🚨 Posible robo de sesión |
| MFA_ENABLED | MFA activado |
| MFA_VERIFIED | Código MFA correcto en login |
| MFA_FAILED | Código MFA incorrecto |
| ORDER_STATUS_CHANGED | Pago confirmado / estado cambiado |

### Datos por entrada
- `timestamp`, `event`, `userId`, `detail`, `ip`, `userAgent`
- Nunca se registran: passwords, tokens completos, datos sensibles

---

## 8. CACHÉ Y RENDIMIENTO

### In-Memory Cache
| Dato | TTL | Invalidación |
|------|-----|-------------|
| Listado de libros (por categoría/página) | 60s | Al crear/editar/borrar libro |
| Libro por slug | 120s | Al editar libro |
| Categorías de libros | 300s | Al crear/editar libro |
| Libros featured | 120s | Al toggle featured |
| Media activa (Spotify/YouTube) | 300s | Al crear/editar/borrar media |

### Headers de Cache (Assets)
- JS/CSS con hash: `max-age=31536000, immutable` (1 año)
- HTML: `no-cache, no-store, must-revalidate`
- Imágenes: via Cloudinary CDN

### Capacidad estimada
| Métrica | Valor |
|---------|-------|
| Usuarios simultáneos | ~300-500 |
| Requests/segundo | ~150-200 |
| Usuarios mensuales | ~30,000-50,000 |

---

## 9. PAGOS

### Modelo actual
- Pago manual (transferencia bancaria o PayPal)
- Admin confirma depósito → libera descarga
- No se almacenan datos de tarjeta (no aplica PCI DSS)

### Protecciones
- El precio se lee de la BD al crear la orden (no se confía en el frontend)
- Stock validado en transacción atómica
- Idempotencia por constraint unique en `orderNumber`
- Solo admin puede confirmar pago (requiere autenticación + rol)

---

## 10. CUMPLIMIENTO LEGAL

| Requisito | Estado | Ruta |
|-----------|--------|------|
| Términos y Condiciones | ✅ | `/terms` |
| Aviso de Privacidad (LFPDPPP/RGPD) | ✅ | `/privacy` |
| Política de Cookies | ✅ | `/cookies` |
| Aviso Legal | ✅ | `/legal` |
| Banner de cookies (opt-in) | ✅ | CookieBanner.jsx |
| Checkbox T&C en checkout | ✅ | No pre-marcado, obligatorio |
| Checkbox T&C en booking | ✅ | No pre-marcado, obligatorio |
| Deslinde terapéutico | ✅ | En Términos sección 2.3 |
| Datos mínimos recopilados | ✅ | Solo nombre, email, teléfono |
| Derechos ARCO | ✅ | En Aviso de Privacidad |

---

## 11. CHECKLIST FINAL

### ✅ Implementado
- [x] HTTPS obligatorio (Railway TLS)
- [x] Passwords con bcrypt 12 rounds
- [x] Tokens en cookies httpOnly
- [x] Refresh tokens con rotación
- [x] Detección de token theft
- [x] MFA para administradores (TOTP)
- [x] Rate limiting (API + Auth)
- [x] RBAC (CLIENT/ADMIN)
- [x] Object-level authorization (IDOR protegido)
- [x] Prisma ORM (SQL injection protegido)
- [x] Input sanitization (XSS, NoSQL, Prototype Pollution)
- [x] maxLength en todos los campos
- [x] CSP header
- [x] HSTS header
- [x] X-Frame-Options + frame-ancestors
- [x] X-Content-Type-Options nosniff
- [x] Referrer-Policy
- [x] Permissions-Policy
- [x] CORS restrictivo
- [x] Body size limit (1MB)
- [x] Caché con invalidación
- [x] Audit logging
- [x] Validación de env vars al boot
- [x] JWT con issuer + audience
- [x] Graceful shutdown
- [x] Error handler que no expone internals
- [x] UUIDs (no enumerables)
- [x] Transacciones atómicas (checkout)
- [x] Checkbox T&C obligatorio
- [x] Banner de cookies
- [x] Documentos legales completos

### ⬜ Pendiente (P2/P3 — Mejoras futuras)
- [ ] Password breach checking (Have I Been Pwned API)
- [ ] Signed uploads en Cloudinary (prevenir abuso sin auth)
- [ ] Lock optimista para stock (SELECT FOR UPDATE)
- [ ] CI/CD con security scanning (SAST, SCA)
- [ ] WAF externo (Cloudflare)
- [ ] Backup automatizado con pruebas de restauración
- [ ] Alertas por email al admin en TOKEN_REUSE_DETECTED

---

## 12. CONTACTO DE SEGURIDAD

Para reportar vulnerabilidades de forma responsable:
- **Email:** seguridad@somoscasa.com
- **Tiempo de respuesta:** 72 horas hábiles
- **Política:** Responsible disclosure

---

*Este documento debe actualizarse cuando se implemente una nueva funcionalidad o medida de seguridad.*
