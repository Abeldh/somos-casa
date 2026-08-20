# Guía de Seguridad en Despliegue

## WAF — Cloudflare (Recomendado)

### Configuración
1. Registrarse en [cloudflare.com](https://cloudflare.com) (plan Free)
2. Agregar tu dominio personalizado (ej: somoscasa.com)
3. Cambiar nameservers en tu registrador de dominio
4. Activar proxy (nube naranja) en el DNS record

### Reglas recomendadas
- **Bot Fight Mode:** ON
- **Security Level:** Medium
- **Challenge Passage:** 30 min
- **Browser Integrity Check:** ON
- **Under Attack Mode:** Solo si hay ataque activo

### WAF Rules (Free tier)
- Bloquear países que no son target (si aplica)
- Rate limiting: 100 req/min por IP
- Challenge en /api/auth/* si hay >10 requests en 1 min

### Ventajas
- CDN global (frontend carga más rápido)
- SSL automático
- DDoS protection incluida
- Analytics de tráfico
- Caching de assets estáticos

---

## Backups — Railway PostgreSQL

### Backup automático (Railway Pro)
Railway en plan Pro incluye backups automáticos diarios con retención de 7 días.

### Backup manual (plan actual)
Ejecutar periódicamente desde la consola de Railway:

```bash
# Dentro del servicio somos-casa (Console)
pg_dump $DATABASE_URL > /tmp/backup_$(date +%Y%m%d).sql
```

### Backup externo (recomendado para producción)
1. Crear un cron job en otro servidor o GitHub Action
2. Conectar a la BD con la URL pública de PostgreSQL
3. Hacer dump y subir a almacenamiento cifrado (S3, GCS, etc.)

```yaml
# .github/workflows/backup.yml (ejemplo)
name: Database Backup
on:
  schedule:
    - cron: '0 6 * * *'  # Diario a las 6AM UTC
jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - name: Dump database
        run: |
          pg_dump ${{ secrets.DATABASE_URL }} | gzip > backup.sql.gz
      - name: Upload to storage
        # Subir a S3, GCS, o cualquier almacenamiento cifrado
        run: echo "Upload backup to secure storage"
```

### Pruebas de restauración
- Mensualmente: restaurar backup en BD de prueba
- Verificar integridad de datos
- Documentar tiempo de restauración (RTO)

---

## Variables de Entorno en Producción

### Requeridas
```
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=<mínimo 32 caracteres, aleatorio>
JWT_EXPIRES_IN=15m
```

### Opcionales (mejoras)
```
CLOUDINARY_CLOUD_NAME=nydmdxao
CLOUDINARY_API_KEY=<tu api key>
CLOUDINARY_API_SECRET=<tu api secret>
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<email>
SMTP_PASS=<app password>
SMTP_FROM="Somos Casa <noreply@somoscasa.com>"
```

### Rotación de secretos
- JWT_SECRET: rotar cada 6 meses (invalida todas las sesiones)
- DATABASE_URL password: rotar cada 3 meses
- SMTP_PASS: rotar si se sospecha compromiso
- CLOUDINARY_API_SECRET: rotar si se expone

---

## Monitoreo

### Health Check
```
GET /api/health
→ { status, timestamp, uptime, memory, cache }
```

### Métricas a monitorear
- Response time promedio
- Error rate (5xx)
- Memory usage
- CPU usage (Railway dashboard)
- Rate limit hits (logs)
- Failed login attempts (audit_logs table)
- Token reuse events (audit_logs con evento TOKEN_REUSE_DETECTED)

### Alertas sugeridas
- 5xx rate > 5% → Investigar
- Memory > 400MB → Posible memory leak
- Token reuse detected → Posible compromiso de sesión
- >50 failed logins en 1 hora → Posible ataque de fuerza bruta
