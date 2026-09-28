# Cumplimiento Legal — Somos Casa (México)

Documento interno de referencia para el responsable del tratamiento de datos.
Cubre LFPDPPP, LFPC, cookies y buenas prácticas de seguridad.

**Responsable:** Angélica Armenta Barajas (Somos Casa Asesoría Matrimonial)
**Domicilio:** Aeropuerto Miguel Alemán 445, Nueva San Pedro, C.P. 50225, San Francisco Totoltepec, Estado de México, México
**Correo de privacidad:** somoscasatoluca@gmail.com · **WhatsApp:** +52 722 414 8552
**Dominio actual:** somos-casa-production.up.railway.app (Railway)
**Versión de Aviso de Privacidad / Términos vigente:** 2026-08-1

> ⚠️ Este documento describe qué está implementado técnicamente y qué requiere acción o
> revisión jurídica. **No constituye asesoría legal.** No afirma que el sitio esté "100% legal"
> ni libre de sanciones. Antes de publicar, se recomienda una revisión por un abogado
> especialista en protección de datos y comercio electrónico en México.

---

## 10. Registro de proveedores / terceros que participan en el tratamiento

| Proveedor | Función | Datos que trata | Ubicación de datos |
|---|---|---|---|
| Railway | Hosting del sitio, servidor y base de datos PostgreSQL | Todos los datos de la plataforma | Fuera de México (revisar región) |
| Cloudinary | Almacenamiento/entrega de imágenes y archivos | Portadas, fotos de álbum, comprobantes de pago | Fuera de México |
| Resend | Envío de correos transaccionales | Correo, nombre del destinatario | Fuera de México |
| PayPal | Procesamiento de pagos (opcional) | Datos del pago del usuario | Según PayPal |
| Google Analytics | Analítica de uso (sujeta a consentimiento) | Datos de navegación anonimizados | Google |

**Pendiente / acción del responsable:**
- [ ] Confirmar y documentar las regiones de almacenamiento de cada proveedor.
- [ ] Verificar que existan cláusulas o términos de encargado de tratamiento (DPA) con cada proveedor. **REQUIERE INFORMACIÓN DEL RESPONSABLE.**
- [ ] No asumir que un proveedor cumple automáticamente con las obligaciones legales.

---

## 16. Política de retención y eliminación de datos

| Dato | Finalidad | Retención | Quién accede |
|---|---|---|---|
| Cuenta de usuario (nombre, correo, teléfono) | Prestación del servicio | Mientras la cuenta esté activa | Usuario, admin |
| Historial de citas y notas de asesoría | Seguimiento del proceso | Hasta 2 años (o mientras la cuenta esté activa) | Equipo pastoral |
| Pedidos y pagos | Obligaciones fiscales/comerciales | Según obligación legal aplicable | Admin |
| Registros de consentimiento (ConsentRecord) | Evidencia de consentimiento | Mientras exista relación + plazo legal | Admin |
| Logs de auditoría (AuditLog) | Seguridad | Definir plazo (recomendado 12-24 meses) | Admin |

**Reglas:**
- No conservar datos personales indefinidamente sin finalidad justificada.
- El usuario puede solicitar la eliminación de su cuenta y datos (derecho de Cancelación ARCO).
- Conservar solo lo que exija una obligación legal (p. ej. facturación) tras la eliminación.

**Pendiente / acción del responsable:**
- [ ] Definir el plazo exacto de retención de logs de auditoría.
- [ ] Definir el plazo de conservación fiscal de pedidos/pagos. **REQUIERE INFORMACIÓN DEL RESPONSABLE / CONTADOR.**

---

## 17. Procedimiento de atención de incidentes de seguridad

En caso de una posible vulneración de datos personales:

1. **Detección** — identificar el incidente (alerta de seguridad, reporte, comportamiento anómalo).
2. **Registro** — documentar fecha, hora, sistemas y datos potencialmente afectados.
3. **Contención** — limitar el alcance (revocar tokens, cerrar sesiones, aislar el sistema afectado).
4. **Investigación** — determinar causa raíz y alcance real.
5. **Evaluación de impacto** — qué datos, cuántos titulares, nivel de riesgo.
6. **Acciones correctivas** — parchar la vulnerabilidad, restaurar desde respaldo si aplica.
7. **Comunicación** — cuando corresponda conforme a la LFPDPPP, notificar a los titulares afectados de forma inmediata para que tomen medidas.
8. **Documentación** — registrar el incidente y las lecciones aprendidas.

**Herramientas ya disponibles en la plataforma:**
- Logs de auditoría (AuditLog) con eventos de seguridad, IP, dispositivo.
- Detección de reutilización de tokens (rotación de refresh tokens).
- Panel de "Salud del Sistema" para monitoreo.

**Pendiente / acción del responsable:**
- [ ] Designar un responsable de atención de incidentes.
- [ ] Verificar la periodicidad de respaldos de la base de datos en Railway.

---

## 18. Checklist de cumplimiento antes de publicar

| Requisito | Estado | Observaciones |
|---|---|---|
| Aviso de Privacidad | Completo | `/privacy` con responsable, datos, finalidades primarias/secundarias, ARCO, transferencias, revocación, menores, retención, cambios, versión |
| Derechos ARCO | Completo | Página dedicada `/derechos-arco` con mecanismo de solicitud y plazos |
| Consentimientos | Completo | Casillas separadas (privacidad+términos obligatoria / marketing opcional) en registro; en Booking y Checkout |
| Evidencia de consentimiento | Completo | Modelo `ConsentRecord` (fecha, versión, finalidad, marketing, IP, user agent) persistido en registro |
| Términos y Condiciones | Completo | `/terms` — uso, compras, pagos, PI, jurisdicción |
| Cookies | Completo | `/cookies` + banner opt-in real; GA no carga sin consentimiento analítico |
| Cancelaciones | Completo | `/cancelaciones-reembolsos` |
| Reembolsos | Completo | `/cancelaciones-reembolsos` (sesiones y libros digitales) |
| Seguridad HTTPS | Completo | Railway (Let's Encrypt) + HSTS |
| Control de accesos | Completo | Roles CLIENT/ADMIN, rutas protegidas, MFA (TOTP) disponible |
| Protección de formularios | Completo | Validación, sanitización, rate limiting, límite de body |
| Proveedores externos | Parcial | Documentados; falta confirmar DPAs y regiones — REQUIERE INFORMACIÓN DEL RESPONSABLE |
| Pagos | Completo | Manual (transferencia/PayPal); NO se almacenan tarjetas ni CVV |
| Datos sensibles | Requiere revisión | "Motivo de consulta" puede ser dato sensible — **REQUIERE REVISIÓN LEGAL ESPECÍFICA** |
| Menores | Completo | Plataforma solo para mayores de edad; declarado en registro y aviso |
| Política de conservación | Parcial | Definida arriba; faltan plazos exactos — REQUIERE INFORMACIÓN DEL RESPONSABLE |

---

## Puntos que REQUIEREN REVISIÓN LEGAL o INFORMACIÓN DEL RESPONSABLE

1. **Datos sensibles:** el "motivo de la consulta" matrimonial y las notas de asesoría podrían clasificarse como datos personales sensibles bajo la LFPDPPP. Un abogado debe determinar si se requiere consentimiento **expreso y por escrito** para su tratamiento y si el aviso necesita una cláusula específica. **REQUIERE REVISIÓN LEGAL ESPECÍFICA.**
2. **Acuerdos de encargado (DPA)** con Railway, Cloudinary, Resend, PayPal y Google. **REQUIERE INFORMACIÓN DEL RESPONSABLE.**
3. **Teléfono fijo formal** de contacto (además del WhatsApp), si se desea incluir. **REQUIERE INFORMACIÓN DEL RESPONSABLE.**
4. **Plazos exactos** de retención fiscal y de logs. **REQUIERE INFORMACIÓN DEL RESPONSABLE.**
5. **Registro ante el INAI** y designación de encargado de datos, si aplica al tamaño de la operación.
