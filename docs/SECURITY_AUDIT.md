# AUDITORÍA DE SEGURIDAD — SOMOS CASA
## Plataforma de Venta de Libros + Asesoría Matrimonial

**Fecha:** Agosto 2026  
**Versión:** 1.0  
**Clasificación:** Confidencial  

---

## 1. RESUMEN EJECUTIVO

### Nivel de Seguridad Actual: MEDIO-BAJO (5.5/10)

La plataforma tiene fundamentos correctos (bcrypt, JWT, roles, rate limiting) pero carece de capas críticas de defensa que la dejan expuesta a ataques comunes.

### 🚨 VULNERABILIDADES CRÍTICAS ENCONTRADAS

| # | Vulnerabilidad | Impacto | Estado |
|---|---------------|---------|--------|
| 1 | Token JWT en localStorage — vulnerable a XSS | Robo de sesión | ❌ Sin mitigar |
| 2 | Sin Content-Security-Policy (CSP) | XSS persistente | ❌ Sin mitigar |
| 3 | Sin HSTS | Downgrade attacks | ❌ Sin mitigar |
| 4 | JWT sin revocación ni refresh token | Token robado válido 7 días | ❌ Sin mitigar |
| 5 | Sin sanitización de inputs (stored XSS) | Inyección de scripts | ❌ Sin mitigar |
| 6 | Sin validación de JWT_SECRET al arrancar | Crash silencioso | ❌ Sin mitigar |
| 7 | Sin maxLength en validaciones | DoS por payload grande | ❌ Sin mitigar |
| 8 | Precios no re-validados en checkout | Manipulación de precios | ⚠️ Parcial |
| 9 | Sin auditoría/logging de seguridad | Sin detección de intrusión | ❌ Sin mitigar |
| 10 | Sin MFA para administradores | Compromiso total con 1 password | ❌ Sin mitigar |

---

## 2. ARQUITECTURA DE SEGURIDAD PROPUESTA

```
Internet
   │
   ▼
Cloudflare (CDN + WAF + DDoS + HSTS)
   │
   ▼
Railway (Reverse Proxy + TLS termination)
   │
   ▼
Express.js (Security Headers + Rate Limiting + CORS)
   │
   ├── /api/* → Backend API (Auth + Authz + Validation + Business Logic)
   │              │
   │              ▼
   │          PostgreSQL (Prisma ORM — Parameterized queries)
   │
   └── /* → Frontend SPA (React — CSP protegido)
```

### Principios Aplicados:
- **Zero Trust**: Nunca confiar en datos del cliente
- **Defense in Depth**: Múltiples capas de protección
- **Least Privilege**: Mínimos permisos necesarios
- **Secure by Default**: Seguridad habilitada sin configuración extra

---

## 3. MODELO DE AMENAZAS

### Activos Críticos
| Activo | Clasificación | Impacto de compromiso |
|--------|--------------|----------------------|
| Credenciales de usuarios | Crítico | Robo de identidad |
| Datos de pago/órdenes | Crítico | Fraude financiero |
| Token JWT | Crítico | Suplantación de identidad |
| Panel admin | Crítico | Control total del sistema |
| Base de datos | Crítico | Exposición masiva de datos |
| Información de asesorías | Confidencial | Violación de privacidad |
| Inventario/precios | Interno | Manipulación financiera |

### Amenazas Principales
| Amenaza | Vector | Probabilidad | Impacto |
|---------|--------|-------------|---------|
| XSS → Robo de JWT | Input no sanitizado | Alta | Crítico |
| Fuerza bruta en login | Requests automatizados | Media | Alto |
| IDOR en órdenes/citas | Cambio de UUID en URL | Media | Alto |
| Manipulación de precios | Interceptar request de checkout | Media | Crítico |
| Credential stuffing | Credenciales filtradas de otros sitios | Alta | Alto |
| Escalación de privilegios | Manipulación de rol en JWT | Baja | Crítico |
| SQL Injection | Input malicioso | Baja (Prisma protege) | Crítico |
| DoS por payload | Request body enorme | Media | Medio |

---

## 4. SEGURIDAD FRONTEND — ESTADO Y MEJORAS

### Estado Actual
- ✅ No expone secretos en código público
- ✅ Proxy de API vía Vite (desarrollo)
- ❌ Token en localStorage (vulnerable a XSS)
- ❌ Sin CSP configurado
- ❌ Sin sanitización de outputs

### Mejoras Requeridas

**Token Storage**: Migrar de localStorage a cookie HttpOnly (o mantener en memory con refresh token corto):
```
RIESGO: Un ataque XSS puede leer localStorage y robar el JWT
MITIGACIÓN: Almacenar JWT en cookie HttpOnly + SameSite=Strict
ALTERNATIVA: Mantener en variable de memoria con refresh token en cookie HttpOnly
```

**Content Security Policy**: El frontend debe configurar CSP meta tag como fallback:
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' https: data:; connect-src 'self' https://api.cloudinary.com; frame-src https://open.spotify.com https://www.youtube.com;">
```

**Output Encoding**: Todo dato dinámico renderizado debe escaparse. React lo hace por defecto EXCEPTO con `dangerouslySetInnerHTML`.

---

## 5. SEGURIDAD BACKEND — ESTADO Y MEJORAS

### Estado Actual
- ✅ bcrypt 12 rounds para passwords
- ✅ JWT con verificación en BD (usuario activo)
- ✅ Rate limiting (in-memory)
- ✅ Body size limit (5MB)
- ✅ CORS restrictivo
- ✅ Error handler que no expone internals
- ⚠️ Security headers parciales (faltan CSP, HSTS)
- ❌ Sin sanitización de inputs
- ❌ Sin audit logging
- ❌ Sin refresh tokens
- ❌ Sin validación de env vars críticas al boot

### Headers de Seguridad Completos (Implementación)
```javascript
// Content-Security-Policy completo
res.setHeader('Content-Security-Policy', [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' https: data: blob:",
  "connect-src 'self' https://api.cloudinary.com",
  "frame-src https://open.spotify.com https://www.youtube.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join('; '));

// HSTS (solo en producción)
if (process.env.NODE_ENV === 'production') {
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
}
```

### Validación de Variables Críticas
```javascript
// Al inicio de index.js
const required = ['JWT_SECRET', 'DATABASE_URL'];
for (const key of required) {
  if (!process.env[key]) {
    console.error(`FATAL: Variable ${key} no definida`);
    process.exit(1);
  }
}
if (process.env.JWT_SECRET.length < 32) {
  console.error('FATAL: JWT_SECRET debe tener mínimo 32 caracteres');
  process.exit(1);
}
```

---

## 6. SEGURIDAD API — ESTADO Y MEJORAS

### Estado Actual
- ✅ Autenticación via JWT Bearer
- ✅ Autorización por roles (CLIENT/ADMIN)
- ✅ Rate limiting global + auth-specific
- ✅ Validación básica de inputs
- ✅ CORS configurado
- ✅ Respuestas estandarizadas
- ❌ Sin validación de maxLength
- ❌ Sin paginación limitada
- ❌ Sin protección contra enumeración de usuarios

### Protección contra Enumeración
```javascript
// auth.service.js - Login
// ACTUAL (permite enumeración):
// Si usuario no existe → "Credenciales incorrectas"
// Si password mala → "Credenciales incorrectas"
// ✅ CORRECTO: mismo mensaje para ambos casos (ya implementado)

// PERO: el registro revela si un email existe
// "El email ya está registrado" → permite enumeración
// MITIGACIÓN: Usar respuesta genérica con email de verificación
```

### Validación Completa de Inputs (Mejora)
```javascript
// Agregar al validate.middleware.js:
// maxLength, min/max numérico, sanitización HTML
if (value && rules.maxLength && value.length > rules.maxLength) {
  errors.push({ field, message: `${field} excede el máximo de ${rules.maxLength} caracteres` });
}
if (rules.isInteger && !Number.isInteger(Number(value))) {
  errors.push({ field, message: `${field} debe ser un número entero` });
}
if (rules.min !== undefined && Number(value) < rules.min) {
  errors.push({ field, message: `${field} debe ser mínimo ${rules.min}` });
}
```

---

## 7. SEGURIDAD BASE DE DATOS

### Estado Actual
- ✅ Prisma ORM (queries parametrizadas — previene SQLi)
- ✅ UUIDs como PKs (no enumerable)
- ✅ Constraints de unicidad (email, slug, isbn)
- ✅ Relaciones con cascade
- ✅ Soft-delete para usuarios
- ⚠️ Sin usuario separado para la app
- ⚠️ CASCADE en orders borra historial
- ❌ Sin auditoría a nivel de BD

### Mejoras Recomendadas
```sql
-- Crear usuario con mínimo privilegio para la aplicación
CREATE ROLE somoscasa_app WITH LOGIN PASSWORD 'strong_password';
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO somoscasa_app;
REVOKE DELETE ON orders, order_items FROM somoscasa_app;
-- Las órdenes no deben poder eliminarse directamente

-- Cambiar CASCADE a SET NULL para órdenes (preservar historial)
-- En schema.prisma: onDelete: SetNull (en lugar de Cascade para orders)
```

---

## 8. AUTENTICACIÓN — FLUJO COMPLETO RECOMENDADO

### Flujo Actual vs Recomendado

| Paso | Actual | Recomendado |
|------|--------|-------------|
| Registro | Email + password (min 6) → Token | + Verificación de email + min 8 chars + check breached passwords |
| Login | Email + password → Token 7d | + Refresh token en httpOnly cookie + Access token 15min |
| Logout | Frontend borra localStorage | + Invalidar refresh token en BD |
| Recovery | No implementado | Token temporal 1h + link por email |
| Admin | Mismo flujo que usuario | + MFA obligatorio (TOTP) |

### Implementación de Refresh Tokens
```
Access Token: 15 minutos, en memoria (variable JS)
Refresh Token: 7 días, en cookie HttpOnly Secure SameSite=Strict
Rotación: Cada refresh genera nuevo par de tokens
Detección: Si un refresh token se reutiliza → revocar toda la familia
```

---

## 9. AUTORIZACIÓN — ROLES Y PERMISOS

### Estado Actual
| Rol | Permisos |
|-----|----------|
| CLIENT | Ver libros, carrito, crear órdenes, agendar citas, ver mis datos |
| ADMIN | Todo lo de CLIENT + gestión de libros, citas, media, disponibilidad, ver órdenes/usuarios |

### Mejoras: Object-Level Authorization
```javascript
// IDOR Protection - Verificar propiedad del recurso
// En appointment.controller.js (cancel):
async cancel(req, res, next) {
  const appointment = await prisma.appointment.findUnique({ where: { id: req.params.id } });
  
  // ✅ Verificar que la cita pertenece al usuario
  if (appointment.userId !== req.user.id && req.user.role !== 'ADMIN') {
    return errorResponse(res, 'No autorizado', 403);
  }
  // ... proceder con cancelación
}
```

### Protección IDOR/BOLA Existente
- ✅ `order.service.js` → `getById()` filtra por `{ id, userId }` — correcto
- ✅ `appointment.service.js` → `cancel()` verifica `userId` — correcto
- ✅ `cart.service.js` → filtra por `userId` en todas las operaciones — correcto

---

## 10. CIFRADO

### Qué se HASHEA (irreversible):
- Contraseñas → bcrypt 12 rounds

### Qué se CIFRA (necesita recuperarse):
- Datos en tránsito → TLS (manejado por Railway/Cloudflare)
- Backups → deben cifrarse con AES-256-GCM

### Qué NO debe almacenarse:
- CVV de tarjetas
- Passwords en texto plano
- Tokens en logs
- Secrets en código

### Estado Actual:
- ✅ Passwords hasheados con bcrypt (12 rounds) — CORRECTO
- ✅ TLS en producción (Railway/Cloudflare)
- ⚠️ bcrypt es aceptable pero Argon2id sería preferible para nuevos proyectos
- ❌ Sin cifrado de datos sensibles en BD (motivo de consulta en asesorías)

---

## 11. SEGURIDAD DE PAGOS

### Estado Actual
La plataforma NO procesa pagos electrónicos actualmente (pago contra entrega/transferencia). Si se integra un procesador de pagos:

### Recomendaciones
- **NUNCA** almacenar datos de tarjeta (PAN, CVV, fecha)
- Usar **Stripe Elements** o **MercadoPago Checkout** (tokenización del lado del cliente)
- El backend solo recibe un `paymentIntentId` o `preferenceId` — nunca datos de tarjeta
- Verificar monto en servidor antes de confirmar (el frontend NO define el precio)
- Implementar webhooks para confirmación asíncrona del pago
- Idempotency keys para prevenir cobros duplicados

---

## 12. SEGURIDAD DE ARCHIVOS (Cloudinary)

### Estado Actual
- Imágenes de portadas se suben a Cloudinary desde el frontend (unsigned upload preset)

### Riesgos
- Upload preset `unsigned` permite que cualquiera suba archivos a tu cuenta de Cloudinary
- Sin validación de tipo de archivo en el servidor
- Sin límite de tamaño en servidor (solo frontend)

### Mitigaciones
```javascript
// En el frontend ImageUpload.jsx - ya validado:
// - Solo acepta image/* 
// - Máximo 10MB
// Pero un atacante puede bypass esto con curl/Postman

// RECOMENDACIÓN: Cambiar a signed uploads vía backend
// 1. Frontend pide firma al backend
// 2. Backend genera firma con timestamp + expira en 60s
// 3. Frontend sube a Cloudinary con la firma
// Esto previene abuso sin autenticación
```

---

## 13. LOGS Y AUDITORÍA

### Estado Actual: ❌ NO IMPLEMENTADO

Solo hay `console.log/console.error` básico. No hay:
- Registro de login/logout
- Registro de acciones admin
- Registro de errores de seguridad
- Correlación de requests (requestId)

### Implementación Mínima Recomendada
```javascript
// server/src/utils/auditLog.js
export function auditLog(event, userId, details = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    event,
    userId,
    ip: details.ip,
    userAgent: details.userAgent,
    ...details,
  };
  // En producción: enviar a servicio de logs (Datadog, Logtail, etc.)
  console.log(JSON.stringify({ type: 'AUDIT', ...entry }));
}

// Eventos a registrar:
// LOGIN_SUCCESS, LOGIN_FAILED, LOGOUT
// PASSWORD_CHANGED, ACCOUNT_LOCKED
// ADMIN_ACTION, ROLE_CHANGED
// ORDER_CREATED, ORDER_STATUS_CHANGED
// BOOK_CREATED, BOOK_DELETED, PRICE_CHANGED
// APPOINTMENT_CANCELLED
```

---

## 14. BACKUPS

### Estado Actual
Railway gestiona backups automáticos de PostgreSQL (dependiendo del plan).

### Recomendaciones
- Configurar backup diario de la BD
- Retención mínima: 30 días
- Probar restauración mensualmente
- Backups cifrados antes de transferir fuera del proveedor
- No almacenar backups en el mismo servidor/región

---

## 15. CI/CD SEGURO

### Pipeline Recomendado (GitHub Actions)
```yaml
# .github/workflows/security.yml
name: Security Checks
on: [push, pull_request]
jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: npm audit (SCA)
        run: cd server && npm audit --audit-level=high
      - name: Secret scanning
        uses: trufflesecurity/trufflehog@main
      - name: Lint security patterns
        run: |
          # Buscar passwords hardcodeados, console.log de datos sensibles
          grep -rn "password.*=" --include="*.js" | grep -v node_modules | grep -v ".test."
```

---

## 16. PLAN DE PENTESTING

### Scope
| Área | Tests |
|------|-------|
| Autenticación | Fuerza bruta, credential stuffing, bypass de rate limit |
| Autorización | IDOR en /api/orders/:id, /api/appointments/:id, escalación de rol |
| XSS | Stored XSS en campos de texto (título libros, motivo cita, nombre) |
| Inyección | SQLi en búsquedas, filtros, parámetros de URL |
| CSRF | Operaciones críticas sin token CSRF |
| Business logic | Manipulación de precios, stock negativo, doble reserva |
| API abuse | Enumeración de endpoints, rate limit bypass |
| Session | Token reuse, session fixation, logout incompleto |

---

## 17. MATRIZ DE RIESGOS COMPLETA

| Vulnerabilidad | Probabilidad | Impacto | Riesgo | Mitigación | Prioridad |
|---------------|-------------|---------|--------|-----------|-----------|
| XSS → Robo JWT (localStorage) | Alta | Crítico | Crítico | CSP + httpOnly cookie + sanitización | P0 |
| Sin CSP header | Alta | Alto | Crítico | Implementar CSP restrictivo | P0 |
| JWT sin revocación (7 días) | Media | Crítico | Alto | Refresh tokens + blacklist | P1 |
| Sin HSTS | Alta | Medio | Alto | Header HSTS en producción | P1 |
| Sin sanitización inputs | Media | Alto | Alto | Escapar HTML + maxLength | P1 |
| Sin audit logging | Alta | Medio | Alto | Implementar audit trail | P1 |
| Sin MFA para admin | Media | Crítico | Alto | TOTP obligatorio para ADMIN | P1 |
| Enumeración de emails | Media | Medio | Medio | Respuesta genérica en registro | P2 |
| Password mín 6 chars | Alta | Bajo | Medio | Subir a 8 + check breached | P2 |
| Race condition en stock | Baja | Medio | Bajo | Lock optimista o SELECT FOR UPDATE | P3 |
| CASCADE borra historial | Baja | Medio | Bajo | Cambiar a SET NULL en órdenes | P3 |

---

## 18. CHECKLIST FINAL

### ✅ Ya Implementado
- [x] Passwords con bcrypt (12 rounds)
- [x] JWT con verificación en BD
- [x] RBAC (CLIENT/ADMIN)
- [x] Rate limiting (auth + API general)
- [x] CORS restrictivo
- [x] Body size limits
- [x] UUIDs (no enumerables)
- [x] Prisma ORM (previene SQLi)
- [x] Object-level auth en órdenes/citas/carrito
- [x] Error handler que no expone internals
- [x] x-powered-by deshabilitado
- [x] Trust proxy configurado
- [x] Graceful shutdown
- [x] Soft-delete de usuarios
- [x] Transacciones en checkout

### ❌ Pendiente (Ordenado por Prioridad)
- [ ] P0: Content-Security-Policy
- [ ] P0: HSTS header
- [ ] P0: Migrar token de localStorage a httpOnly cookie
- [ ] P1: Sanitización de inputs (maxLength + escape HTML)
- [ ] P1: Refresh tokens con rotación
- [ ] P1: Audit logging
- [ ] P1: MFA para administradores
- [ ] P1: Validación de env vars al boot
- [ ] P2: Password min 8 + check breached (Have I Been Pwned API)
- [ ] P2: Signed uploads en Cloudinary
- [ ] P2: Respuesta genérica en registro (anti-enumeración)
- [ ] P3: Lock optimista para stock
- [ ] P3: Cambiar CASCADE a SET NULL en órdenes
- [ ] P3: CI/CD con security scanning

---

## CONCLUSIÓN

La plataforma tiene una base razonable de seguridad para un MVP:
- La autenticación usa bcrypt correctamente
- Prisma previene SQL injection por diseño
- El control de acceso a nivel de objeto es correcto
- El rate limiting protege contra abuso básico

**Sin embargo**, las vulnerabilidades P0 (CSP ausente, token en localStorage) representan un riesgo real de compromiso de cuentas. Un atacante que logre inyectar un script (stored XSS en título de libro, por ejemplo) podría robar sesiones de cualquier usuario incluyendo administradores.

**Recomendación inmediata**: Implementar CSP + HSTS. Esto solo requiere agregar 2 headers al servidor y reduce drásticamente la superficie de ataque XSS.
