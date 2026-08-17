# Documentación de Archivos - Backend (Spring Boot + Java 21)

## Estructura General

El backend sigue Clean Architecture + DDD con módulos independientes.
Cada módulo tiene: controller, service, service/impl, repository, dto, entity, mapper, exception.

---

## 1. COMMON (Compartido entre todos los módulos)

### common/exception/

| Archivo | Descripción |
|---------|-------------|
| `GlobalExceptionHandler.java` | Handler centralizado con `@RestControllerAdvice`. Captura todas las excepciones y retorna respuestas estandarizadas con códigos HTTP. |
| `BusinessException.java` | Excepción base para errores de lógica de negocio (HTTP 422). |
| `ResourceNotFoundException.java` | Lanzada cuando un recurso no existe (HTTP 404). |
| `UnauthorizedException.java` | Acceso sin autenticación (HTTP 401). |
| `ForbiddenException.java` | Sin permisos suficientes (HTTP 403). |
| `BadRequestException.java` | Datos inválidos en la petición (HTTP 400). |
| `ConflictException.java` | Conflicto de estado/duplicados (HTTP 409). |
| `InternalServerException.java` | Error interno no controlado (HTTP 500). |

### common/exception/handler/

| Archivo | Descripción |
|---------|-------------|
| `BusinessExceptionHandler.java` | Maneja excepciones de negocio específicas, mapea a códigos de error internos. |
| `ValidationExceptionHandler.java` | Captura `MethodArgumentNotValidException` y `ConstraintViolationException`, formatea errores de validación campo por campo. |

### common/entity/

| Archivo | Descripción |
|---------|-------------|
| `BaseEntity.java` | Entidad abstracta con `id` (UUID), `createdAt`, `updatedAt`. Usa `@MappedSuperclass`. Todas las entidades heredan de esta. |
| `AuditableEntity.java` | Extiende `BaseEntity`. Agrega `createdBy`, `updatedBy` con `@CreatedBy`/`@LastModifiedBy` de Spring Data Auditing. |

### common/dto/

| Archivo | Descripción |
|---------|-------------|
| `ApiResponse.java` | DTO genérico de respuesta: `{ success, message, data, timestamp }`. Wrapper estándar para todas las respuestas de la API. |
| `PageResponse.java` | DTO para respuestas paginadas: `{ content, page, size, totalElements, totalPages, hasNext, hasPrevious }`. |
| `ErrorResponse.java` | DTO de error: `{ status, code, message, path, timestamp }`. Retornado por el GlobalExceptionHandler. |
| `ValidationErrorResponse.java` | Extiende ErrorResponse con lista de `fieldErrors: [{ field, message, rejectedValue }]`. |

### common/util/

| Archivo | Descripción |
|---------|-------------|
| `DateUtils.java` | Utilidades de fecha: formateo, parseo, cálculo de diferencias, zonas horarias, conversiones ISO 8601. |
| `SecurityUtils.java` | Obtener usuario autenticado actual, verificar roles, extraer ID de usuario del SecurityContext. |
| `SlugUtils.java` | Generación de slugs URL-friendly desde títulos (normalización Unicode, eliminación de caracteres especiales). |
| `FileUtils.java` | Validación de tipos de archivo, generación de nombres únicos, cálculo de tamaños, extensiones permitidas. |
| `JsonUtils.java` | Serialización/deserialización JSON con Jackson ObjectMapper. Métodos helper para conversiones seguras. |
| `EncryptionUtils.java` | Encriptación AES para datos sensibles, hash SHA-256, generación de tokens seguros con SecureRandom. |

### common/annotation/

| Archivo | Descripción |
|---------|-------------|
| `RateLimit.java` | Anotación personalizada para aplicar rate limiting a endpoints. Parámetros: `requests`, `duration`, `timeUnit`. |
| `Auditable.java` | Anotación para marcar métodos que deben generar logs de auditoría automáticamente vía AOP. |
| `RequiresPermission.java` | Anotación de seguridad a nivel de método. Define el permiso requerido (ej: `PRODUCT_CREATE`). |

### common/constant/

| Archivo | Descripción |
|---------|-------------|
| `AppConstants.java` | Constantes globales: paginación por defecto, tamaños máximos, formatos de fecha, versión de API. |
| `SecurityConstants.java` | Prefijo Bearer, header Authorization, rutas públicas, tiempo de expiración de tokens, roles predefinidos. |
| `CacheConstants.java` | Nombres de cachés Redis, TTLs por caché, prefijos de keys. |

### common/event/

| Archivo | Descripción |
|---------|-------------|
| `DomainEvent.java` | Interfaz base para eventos de dominio. Define `occurredAt()` y `eventType()`. |
| `EventPublisher.java` | Servicio wrapper sobre `ApplicationEventPublisher` de Spring. Publica eventos de dominio de forma desacoplada. |

### common/validation/

| Archivo | Descripción |
|---------|-------------|
| `ValidISBN.java` | Anotación de validación personalizada para ISBN-10 e ISBN-13. |
| `IsbnValidator.java` | Implementación de `ConstraintValidator<ValidISBN, String>`. Valida formato y dígito de control de ISBN. |

### Archivo principal

| Archivo | Descripción |
|---------|-------------|
| `SomosCasaApplication.java` | Clase principal con `@SpringBootApplication`. Punto de entrada de la aplicación. Habilita scheduling, async, caching, retry. |

---

## 2. CONFIG (Configuraciones transversales)

### config/ (raíz)

| Archivo | Descripción |
|---------|-------------|
| `ApplicationConfig.java` | `@Configuration` principal. Define beans globales: ModelMapper, ObjectMapper, PasswordEncoder (BCrypt), RestTemplate. |
| `AsyncConfig.java` | Configura `ThreadPoolTaskExecutor` para operaciones async. Pool size, queue capacity, naming. Implementa `AsyncConfigurer`. |
| `MapStructConfig.java` | Configuración global de MapStruct: `componentModel = "spring"`, unmapped target policy, null value mapping. |

### config/security/

| Archivo | Descripción |
|---------|-------------|
| `JwtConfig.java` | Propiedades JWT desde application.yml: secret, expiration, refresh-expiration, issuer. Usa `@ConfigurationProperties`. |
| `JwtTokenProvider.java` | Generación y validación de JWT. Métodos: `generateToken()`, `validateToken()`, `getUserIdFromToken()`, `getExpirationDate()`. Usa HMAC-SHA512. |
| `JwtAuthenticationFilter.java` | Filtro `OncePerRequestFilter`. Extrae token del header, valida, establece `SecurityContext`. Excluye rutas públicas. |
| `JwtAuthenticationEntryPoint.java` | Implementa `AuthenticationEntryPoint`. Retorna 401 con body JSON cuando no hay token o es inválido. |
| `OAuth2Config.java` | Configuración de proveedores OAuth2 (Google, Facebook). Client ID, secret, redirect URIs, scopes. |
| `OAuth2SuccessHandler.java` | `AuthenticationSuccessHandler` para OAuth2. Genera JWT tras login social exitoso, redirige al frontend con token. |
| `OAuth2FailureHandler.java` | `AuthenticationFailureHandler`. Redirige al frontend con código de error cuando OAuth2 falla. |
| `CustomUserDetailsService.java` | Implementa `UserDetailsService`. Carga usuario por email desde BD, construye `UserDetails` con roles y permisos. |
| `RateLimitingFilter.java` | Filtro que implementa rate limiting por IP/usuario usando Redis. Bucket4j o implementación con Lua scripts en Redis. |
| `CsrfConfig.java` | Configuración CSRF: token en cookie, exclusión para API stateless, protección para endpoints de formularios. |
| `ContentSecurityPolicyConfig.java` | Define headers CSP: script-src, style-src, img-src, font-src, connect-src. Previene XSS e inyección de contenido. |
| `SecurityHeadersConfig.java` | Headers de seguridad: X-Frame-Options, X-Content-Type-Options, Strict-Transport-Security, Referrer-Policy, Permissions-Policy. |
| `CaptchaService.java` | Validación de reCAPTCHA v3 con Google. Verifica token, evalúa score, bloquea bots. |
| `LoginAttemptService.java` | Registro de intentos de login fallidos por IP/email en Redis. Bloqueo temporal tras N intentos (configurable). |

### config/cache/

| Archivo | Descripción |
|---------|-------------|
| `CacheConfig.java` | `@EnableCaching`. Define `CacheManager` con Redis. Configura TTLs por caché, serialización JSON, prefijos. |
| `RedisConfig.java` | `RedisConnectionFactory`, `RedisTemplate`, `StringRedisTemplate`. Configuración de serializers y connection pooling (Lettuce). |

### config/elasticsearch/

| Archivo | Descripción |
|---------|-------------|
| `ElasticSearchConfig.java` | Cliente ElasticSearch REST High Level. Host, puerto, autenticación, timeouts, SSL. Configuración de índices. |

### config/redis/

| Archivo | Descripción |
|---------|-------------|
| `RedisSessionConfig.java` | `@EnableRedisHttpSession`. TTL de sesiones, namespace, serialización, flush mode. |

### config/minio/

| Archivo | Descripción |
|---------|-------------|
| `MinioConfig.java` | Bean `MinioClient`. Endpoint, access key, secret key. Creación automática de buckets al iniciar. |

### config/mail/

| Archivo | Descripción |
|---------|-------------|
| `MailConfig.java` | `JavaMailSender` con SMTP. Host, puerto, autenticación, TLS/SSL, propiedades de protocolo. Thymeleaf como template engine para emails. |

### config/swagger/

| Archivo | Descripción |
|---------|-------------|
| `SwaggerConfig.java` | Configuración OpenAPI 3.0: info, servers, security scheme (Bearer JWT), tags por módulo, grupos de API. |

### config/cors/

| Archivo | Descripción |
|---------|-------------|
| `CorsConfig.java` | `WebMvcConfigurer` con origins permitidos (dev/prod), métodos, headers, credenciales, max-age preflight. |

### config/audit/

| Archivo | Descripción |
|---------|-------------|
| `AuditConfig.java` | `@EnableJpaAuditing`. Registra el `AuditorAware` bean. Habilita `@CreatedDate`, `@LastModifiedDate`. |
| `AuditAwareImpl.java` | Implementa `AuditorAware<String>`. Extrae username del SecurityContext para campos de auditoría. |

### config/scheduler/

| Archivo | Descripción |
|---------|-------------|
| `SchedulerConfig.java` | `@EnableScheduling`. Configura `TaskScheduler` con pool dedicado. Define zona horaria para cron expressions. |

### config/retry/

| Archivo | Descripción |
|---------|-------------|
| `RetryConfig.java` | `@EnableRetry`. Configuración de reintentos: max attempts, backoff, excepciones retryable (para servicios externos). |

### config/aop/

| Archivo | Descripción |
|---------|-------------|
| `LoggingAspect.java` | `@Aspect`. Intercepta métodos de service/controller. Loguea entrada, salida, tiempo de ejecución, parámetros (sanitizados). |
| `PerformanceAspect.java` | `@Aspect`. Mide tiempos de ejecución. Alerta si supera umbral. Métricas para Prometheus/Actuator. |
| `SecurityAspect.java` | `@Aspect`. Intercepta `@RequiresPermission`. Verifica permisos del usuario. Genera log de auditoría en accesos sensibles. |

### config/firebase/

| Archivo | Descripción |
|---------|-------------|
| `FirebaseConfig.java` | Inicializa `FirebaseApp` con service account JSON. Bean `FirebaseMessaging` para push notifications. |

### config/websocket/

| Archivo | Descripción |
|---------|-------------|
| `WebSocketConfig.java` | `@EnableWebSocketMessageBroker`. STOMP sobre SockJS. Endpoints de conexión, prefijos de destino, autenticación por token. |

### config/internationalization/

| Archivo | Descripción |
|---------|-------------|
| `I18nConfig.java` | `MessageSource` con `ResourceBundleMessageSource`. `LocaleResolver` basado en header Accept-Language. Locale por defecto: es. |

---

## 3. MÓDULO AUTH (Autenticación y Autorización)

### modules/auth/controller/

| Archivo | Descripción |
|---------|-------------|
| `AuthController.java` | `@RestController` con `/api/v1/auth`. Endpoints: `POST /login`, `POST /register`, `POST /refresh-token`, `POST /logout`, `POST /forgot-password`, `POST /reset-password`, `POST /verify-email`, `POST /change-password`, `GET /me`. Rate limited en login y registro. |
| `OAuth2Controller.java` | Endpoints para login social: `GET /api/v1/auth/oauth2/{provider}` (inicia flujo), `GET /api/v1/auth/oauth2/callback/{provider}` (callback). Soporta Google y Facebook. |

### modules/auth/service/

| Archivo | Descripción |
|---------|-------------|
| `AuthService.java` | Interfaz: `login()`, `register()`, `logout()`, `refreshToken()`, `getCurrentUser()`. Define el contrato de autenticación. |
| `TokenService.java` | Interfaz: `generateAccessToken()`, `generateRefreshToken()`, `validateToken()`, `revokeToken()`, `rotateRefreshToken()`. Gestión completa de tokens JWT. |
| `SessionService.java` | Interfaz: `createSession()`, `invalidateSession()`, `getActiveSessions()`, `invalidateAllSessions()`. Control de sesiones activas por usuario. |
| `PasswordResetService.java` | Interfaz: `sendResetEmail()`, `validateResetToken()`, `resetPassword()`. Flujo completo de recuperación de contraseña con token temporal. |
| `EmailVerificationService.java` | Interfaz: `sendVerificationEmail()`, `verifyEmail()`, `resendVerification()`. Verificación de email tras registro. |
| `TwoFactorAuthService.java` | Interfaz: `enable2FA()`, `disable2FA()`, `generateQRCode()`, `verifyCode()`. Preparado para TOTP (Google Authenticator). |

### modules/auth/service/impl/

| Archivo | Descripción |
|---------|-------------|
| `AuthServiceImpl.java` | Implementación de `AuthService`. Valida credenciales con `AuthenticationManager`, verifica intentos de login, genera tokens, registra evento de login, maneja "recordarme". |
| `TokenServiceImpl.java` | Implementación de `TokenService`. Usa `JwtTokenProvider` para generar/validar. Almacena refresh tokens en BD. Implementa rotación: cada refresh genera nuevo par access+refresh e invalida el anterior. |
| `SessionServiceImpl.java` | Implementación de `SessionService`. Almacena sesiones en Redis con metadata (IP, user-agent, dispositivo). Permite cerrar sesiones remotamente. |
| `PasswordResetServiceImpl.java` | Implementación. Genera token UUID con expiración (1h). Envía email con link. Valida token, actualiza password con BCrypt, invalida token usado. |
| `EmailVerificationServiceImpl.java` | Implementación. Genera token de verificación al registrar. Envía email con link. Marca usuario como verificado. Expira en 24h. |
| `TwoFactorAuthServiceImpl.java` | Implementación. Genera secret TOTP, crea QR code (Base64), valida código de 6 dígitos con ventana de tiempo. Almacena secret encriptado en BD. |

### modules/auth/repository/

| Archivo | Descripción |
|---------|-------------|
| `UserRepository.java` | `JpaRepository<User, UUID>`. Métodos: `findByEmail()`, `existsByEmail()`, `findByEmailAndProvider()`. Queries para búsqueda de usuarios por autenticación. |
| `RoleRepository.java` | `JpaRepository<Role, UUID>`. Métodos: `findByName()`, `findAllByNameIn()`. CRUD de roles (ADMIN, EDITOR, CLIENT, GUEST). |
| `PermissionRepository.java` | `JpaRepository<Permission, UUID>`. Métodos: `findByCode()`, `findAllByRoleId()`. Gestión granular de permisos. |
| `RefreshTokenRepository.java` | `JpaRepository<RefreshToken, UUID>`. Métodos: `findByToken()`, `deleteByUserId()`, `deleteExpiredTokens()`. Almacena refresh tokens activos. |
| `SessionRepository.java` | Interface para Redis/JPA. Métodos: `findByUserId()`, `deleteById()`, `countByUserId()`. Gestión de sesiones activas. |
| `PasswordResetTokenRepository.java` | `JpaRepository`. Métodos: `findByToken()`, `findByUserAndNotExpired()`, `deleteExpiredTokens()`. Tokens de reset de password. |
| `EmailVerificationTokenRepository.java` | `JpaRepository`. Métodos: `findByToken()`, `findByUser()`, `deleteByUserId()`. Tokens de verificación de email. |

### modules/auth/dto/request/

| Archivo | Descripción |
|---------|-------------|
| `LoginRequest.java` | Campos: `email` (@Email, @NotBlank), `password` (@NotBlank, @Size min=8), `rememberMe` (boolean), `captchaToken` (String). |
| `RegisterRequest.java` | Campos: `firstName`, `lastName`, `email`, `password`, `confirmPassword`, `captchaToken`. Validación: password match, email único, formato seguro de password. |
| `PasswordResetRequest.java` | Campos: `token` (@NotBlank), `newPassword` (@Size min=8), `confirmPassword`. Validación de token válido y no expirado. |
| `ChangePasswordRequest.java` | Campos: `currentPassword`, `newPassword`, `confirmPassword`. Valida que currentPassword sea correcta antes de cambiar. |
| `RefreshTokenRequest.java` | Campos: `refreshToken` (@NotBlank). Usado para obtener nuevo access token sin re-login. |
| `VerifyEmailRequest.java` | Campos: `token` (@NotBlank). Token recibido por email para confirmar cuenta. |
| `TwoFactorRequest.java` | Campos: `code` (@NotBlank, @Size(6)), `userId`. Código TOTP de 6 dígitos para verificación 2FA. |

### modules/auth/dto/response/

| Archivo | Descripción |
|---------|-------------|
| `AuthResponse.java` | Campos: `accessToken`, `refreshToken`, `tokenType` ("Bearer"), `expiresIn` (seconds), `user` (UserInfoResponse). Retornado tras login/register exitoso. |
| `TokenResponse.java` | Campos: `accessToken`, `refreshToken`, `expiresIn`. Retornado tras refresh token exitoso. |
| `UserInfoResponse.java` | Campos: `id`, `email`, `firstName`, `lastName`, `avatar`, `roles[]`, `permissions[]`, `emailVerified`, `twoFactorEnabled`. Información del usuario autenticado. |

### modules/auth/entity/

| Archivo | Descripción |
|---------|-------------|
| `User.java` | Entidad principal. Campos: `id`, `email`, `password` (BCrypt), `firstName`, `lastName`, `avatar`, `provider` (LOCAL/GOOGLE/FACEBOOK), `providerId`, `emailVerified`, `locked`, `enabled`, `roles` (ManyToMany), `twoFactorSecret`, `twoFactorEnabled`. |
| `Role.java` | Entidad. Campos: `id`, `name` (enum: ADMIN, EDITOR, CLIENT, GUEST), `description`, `permissions` (ManyToMany). |
| `Permission.java` | Entidad. Campos: `id`, `code` (ej: "PRODUCT_CREATE"), `description`, `module` (ej: "CATALOG"). Granularidad a nivel de acción. |
| `RefreshToken.java` | Entidad. Campos: `id`, `token` (hash), `user` (ManyToOne), `expiresAt`, `revoked`, `replacedByToken`, `createdAt`, `ip`, `userAgent`. |
| `Session.java` | Entidad. Campos: `id`, `userId`, `token`, `ip`, `userAgent`, `device`, `location`, `createdAt`, `lastAccessedAt`, `expiresAt`. |
| `PasswordResetToken.java` | Entidad. Campos: `id`, `token`, `user`, `expiresAt`, `used`. TTL de 1 hora. |
| `EmailVerificationToken.java` | Entidad. Campos: `id`, `token`, `user`, `expiresAt`, `verified`. TTL de 24 horas. |
| `LoginAttempt.java` | Entidad. Campos: `id`, `email`, `ip`, `successful`, `attemptedAt`, `userAgent`. Para tracking y bloqueo por intentos. |

### modules/auth/mapper/

| Archivo | Descripción |
|---------|-------------|
| `UserMapper.java` | Interface MapStruct. Convierte `User` ↔ `UserInfoResponse`, `RegisterRequest` → `User`. Ignora password en respuestas. |
| `RoleMapper.java` | Interface MapStruct. Convierte `Role` ↔ `RoleResponse`. Mapea permisos asociados. |

### modules/auth/exception/

| Archivo | Descripción |
|---------|-------------|
| `AuthException.java` | Excepción base del módulo auth. Extiende `BusinessException`. |
| `TokenExpiredException.java` | Token JWT o de reset ha expirado. HTTP 401. Mensaje indica que debe solicitar uno nuevo. |
| `AccountLockedException.java` | Cuenta bloqueada por múltiples intentos fallidos. HTTP 423. Incluye tiempo restante de bloqueo. |
| `InvalidCredentialsException.java` | Email o password incorrectos. HTTP 401. Mensaje genérico para no revelar qué campo falló. |

### modules/auth/event/

| Archivo | Descripción |
|---------|-------------|
| `UserRegisteredEvent.java` | Evento de dominio publicado tras registro exitoso. Contiene `userId`, `email`, `registrationSource`. Dispara envío de email de bienvenida y verificación. |
| `PasswordResetEvent.java` | Evento publicado cuando se solicita reset. Contiene `userId`, `email`, `resetToken`. Dispara envío de email con link. |
| `LoginEvent.java` | Evento publicado tras login exitoso. Contiene `userId`, `ip`, `userAgent`, `timestamp`. Para auditoría y detección de anomalías. |

### modules/auth/listener/

| Archivo | Descripción |
|---------|-------------|
| `AuthEventListener.java` | `@EventListener` que escucha eventos del módulo auth. Reacciona a: registro (envía email), login (registra auditoría), password reset (envía email). Desacoplado del servicio principal. |

---

## 4. MÓDULO CATALOG (Productos, Categorías, Autores, Editoriales, Reseñas, Cupones, Descuentos)

### modules/catalog/controller/

| Archivo | Descripción |
|---------|-------------|
| `ProductController.java` | `@RestController` `/api/v1/products`. Endpoints públicos: `GET /` (listado paginado con filtros), `GET /{slug}` (detalle), `GET /featured`, `GET /new-arrivals`, `GET /best-sellers`, `GET /related/{id}`. Usa Specification para filtros dinámicos. |
| `CategoryController.java` | `/api/v1/categories`. Endpoints: `GET /` (árbol completo), `GET /{slug}` (categoría con subcategorías), `GET /{slug}/products` (productos de categoría). Caché Redis. |
| `AuthorController.java` | `/api/v1/authors`. Endpoints: `GET /` (listado paginado), `GET /{slug}` (detalle con libros), `GET /{id}/products`. |
| `PublisherController.java` | `/api/v1/publishers`. Endpoints: `GET /`, `GET /{slug}`, `GET /{id}/products`. Listado y detalle de editoriales. |
| `TagController.java` | `/api/v1/tags`. Endpoints: `GET /` (todas), `GET /popular` (más usadas), `GET /{slug}/products`. Etiquetas para filtrado. |
| `ReviewController.java` | `/api/v1/products/{productId}/reviews`. Endpoints: `GET /` (reseñas paginadas), `POST /` (crear, requiere auth + compra verificada), `PUT /{id}`, `DELETE /{id}`. Rating promedio calculado. |
| `AdminCatalogController.java` | `/api/v1/admin/catalog`. Endpoints CRUD completos para productos, categorías, autores, editoriales. Requiere rol ADMIN/EDITOR. Bulk operations: import/export CSV. |

### modules/catalog/service/

| Archivo | Descripción |
|---------|-------------|
| `ProductService.java` | Interfaz: `findAll(filter, pageable)`, `findBySlug()`, `create()`, `update()`, `delete()`, `updateStock()`, `findFeatured()`, `findRelated()`, `findByCategory()`. |
| `CategoryService.java` | Interfaz: `findAll()`, `findTree()`, `findBySlug()`, `create()`, `update()`, `delete()`, `reorder()`. Manejo de jerarquía padre-hijo. |
| `AuthorService.java` | Interfaz: `findAll()`, `findBySlug()`, `create()`, `update()`, `delete()`, `findProductsByAuthor()`. |
| `PublisherService.java` | Interfaz: `findAll()`, `findBySlug()`, `create()`, `update()`, `delete()`. CRUD de editoriales. |
| `TagService.java` | Interfaz: `findAll()`, `findPopular()`, `create()`, `delete()`, `findProductsByTag()`. |
| `ReviewService.java` | Interfaz: `findByProduct(pageable)`, `create()`, `update()`, `delete()`, `calculateAverageRating()`, `verifyPurchase()`. Solo permite reseña si compró el producto. |
| `StockService.java` | Interfaz: `getStock()`, `updateStock()`, `reserveStock()`, `releaseStock()`, `checkAvailability()`. Gestión de inventario con reserva durante checkout. |
| `DiscountService.java` | Interfaz: `findActiveDiscounts()`, `applyDiscount()`, `create()`, `update()`, `deactivate()`, `calculateDiscountedPrice()`. |
| `CouponService.java` | Interfaz: `validate()`, `apply()`, `create()`, `deactivate()`, `findByCode()`, `checkUsageLimit()`. Validación de cupones con reglas de negocio. |

### modules/catalog/service/impl/

| Archivo | Descripción |
|---------|-------------|
| `ProductServiceImpl.java` | Implementación. Usa `ProductSpecification` para filtros dinámicos, `ProductFactory` para crear según tipo (físico/digital/audio/curso). Caché de productos populares. Indexa en ElasticSearch al crear/actualizar. |
| `CategoryServiceImpl.java` | Implementación. Construye árbol jerárquico recursivo. Caché del árbol completo con invalidación al modificar. Validaciones: no eliminar categoría con productos. |
| `AuthorServiceImpl.java` | Implementación. CRUD con generación automática de slug. Asociación Many-to-Many con productos. |
| `PublisherServiceImpl.java` | Implementación. CRUD con slug. Vinculación a productos. Validación de unicidad por nombre. |
| `TagServiceImpl.java` | Implementación. Tags normalizadas (lowercase, trim). Conteo de uso. Eliminación en cascada de asociaciones. |
| `ReviewServiceImpl.java` | Implementación. Verifica compra previa via OrderRepository. Calcula rating promedio con trigger de actualización en producto. Modera contenido (flag de revisión). |
| `StockServiceImpl.java` | Implementación. Reserva optimista con `@Version`. Notifica cuando stock bajo umbral (evento). Operaciones atómicas con `@Transactional(REQUIRES_NEW)`. |
| `DiscountServiceImpl.java` | Implementación. Aplica descuento según tipo (porcentaje/fijo). Valida fechas inicio/fin. Prioridad de descuentos. Stack rules. |
| `CouponServiceImpl.java` | Implementación. Valida: código existente, no expirado, no excede uso máximo, monto mínimo de compra, productos/categorías aplicables. |

### modules/catalog/repository/

| Archivo | Descripción |
|---------|-------------|
| `ProductRepository.java` | `JpaRepository<Product, UUID>` + `JpaSpecificationExecutor`. Queries: `findBySlug()`, `findByCategoryId()`, `findByType()`, `findFeatured()`, `findTopByOrderBySoldDesc()`. |
| `CategoryRepository.java` | Queries: `findBySlug()`, `findByParentId()`, `findRoots()` (parent IS NULL), `existsBySlugAndIdNot()`. |
| `SubcategoryRepository.java` | Queries: `findByCategoryId()`, `findBySlug()`. Subcategorías dentro de una categoría. |
| `AuthorRepository.java` | Queries: `findBySlug()`, `existsByName()`, `findByNameContaining()`. |
| `PublisherRepository.java` | Queries: `findBySlug()`, `existsByName()`. |
| `TagRepository.java` | Queries: `findBySlug()`, `findByNameIn()`, `findTopNByOrderByProductCountDesc()`. |
| `ReviewRepository.java` | Queries: `findByProductId(pageable)`, `findByUserId()`, `averageRatingByProductId()`, `countByProductId()`, `existsByUserIdAndProductId()`. |
| `CouponRepository.java` | Queries: `findByCode()`, `findActiveByCode()`, `countUsagesByCode()`. |
| `DiscountRepository.java` | Queries: `findActiveByProductId()`, `findActiveByCategoryId()`, `findByDateRange()`. |
| `ProductVariantRepository.java` | Queries: `findByProductId()`, `findBySku()`. Variantes (tapa dura, blanda, etc). |

### modules/catalog/dto/request/

| Archivo | Descripción |
|---------|-------------|
| `CreateProductRequest.java` | Campos: `title`, `description`, `type` (PHYSICAL/DIGITAL/AUDIO/COURSE), `price`, `isbn`, `pages`, `language`, `categoryId`, `authorIds[]`, `publisherId`, `tagIds[]`, `images[]`, `stock`, `weight`, `dimensions`. Validaciones según tipo. |
| `UpdateProductRequest.java` | Mismo que Create pero todos los campos opcionales. Solo actualiza los campos presentes. Partial update pattern. |
| `CreateCategoryRequest.java` | Campos: `name`, `description`, `parentId` (opcional), `icon`, `order`. Validación: nombre único dentro del mismo padre. |
| `CreateAuthorRequest.java` | Campos: `name`, `bio`, `photo`, `website`, `socialLinks`. |
| `CreatePublisherRequest.java` | Campos: `name`, `description`, `logo`, `website`, `country`. |
| `CreateReviewRequest.java` | Campos: `rating` (1-5), `title`, `content`, `pros`, `cons`. Validación: usuario ha comprado el producto. |
| `CreateCouponRequest.java` | Campos: `code`, `type` (PERCENTAGE/FIXED), `value`, `minPurchase`, `maxDiscount`, `usageLimit`, `perUserLimit`, `validFrom`, `validUntil`, `applicableProducts[]`, `applicableCategories[]`. |
| `CreateDiscountRequest.java` | Campos: `name`, `type`, `value`, `startDate`, `endDate`, `productIds[]`, `categoryIds[]`, `priority`, `stackable`. |
| `ProductFilterRequest.java` | Campos: `search`, `categoryId`, `authorId`, `publisherId`, `tags[]`, `type`, `priceMin`, `priceMax`, `rating`, `inStock`, `sortBy`, `sortDirection`. Todos opcionales para filtrado dinámico. |

### modules/catalog/dto/response/

| Archivo | Descripción |
|---------|-------------|
| `ProductResponse.java` | Vista resumida para listados: `id`, `title`, `slug`, `coverImage`, `price`, `discountedPrice`, `rating`, `reviewCount`, `type`, `inStock`, `author`, `category`. |
| `ProductDetailResponse.java` | Vista completa: todos los campos + `images[]`, `variants[]`, `reviews` (primeras 5), `relatedProducts[]`, `author`, `publisher`, `tags[]`, `description` (HTML), `specifications`. |
| `ProductListResponse.java` | Wrapper paginado: `products[]` (ProductResponse), `totalElements`, `totalPages`, `filters` (filtros aplicados), `facets` (conteos por categoría/autor). |
| `CategoryResponse.java` | Campos: `id`, `name`, `slug`, `description`, `icon`, `productCount`, `parentId`. |
| `CategoryTreeResponse.java` | Campos: `id`, `name`, `slug`, `icon`, `children[]` (recursivo). Estructura de árbol completo para menú de navegación. |
| `AuthorResponse.java` | Campos: `id`, `name`, `slug`, `bio`, `photo`, `bookCount`. |
| `PublisherResponse.java` | Campos: `id`, `name`, `slug`, `description`, `logo`, `bookCount`. |
| `ReviewResponse.java` | Campos: `id`, `rating`, `title`, `content`, `pros`, `cons`, `userName`, `userAvatar`, `createdAt`, `helpful`, `verified` (compra verificada). |
| `CouponResponse.java` | Campos: `id`, `code`, `type`, `value`, `validUntil`, `usageCount`, `usageLimit`, `active`. |
| `DiscountResponse.java` | Campos: `id`, `name`, `type`, `value`, `startDate`, `endDate`, `active`, `applicableProducts`, `applicableCategories`. |

### modules/catalog/entity/

| Archivo | Descripción |
|---------|-------------|
| `Product.java` | Entidad base (herencia JOINED). Campos: `id`, `title`, `slug`, `description`, `price`, `discountedPrice`, `type` (enum), `status`, `coverImage`, `rating`, `reviewCount`, `soldCount`, `featured`, `category` (ManyToOne), `authors` (ManyToMany), `publisher` (ManyToOne), `tags` (ManyToMany), `images` (OneToMany), `variants` (OneToMany). |
| `PhysicalBook.java` | Extiende `Product`. Campos adicionales: `isbn`, `pages`, `weight`, `dimensions`, `language`, `edition`, `publicationDate`, `format` (hardcover/paperback). Requiere stock y envío. |
| `DigitalBook.java` | Extiende `Product`. Campos: `isbn`, `pages`, `fileUrl`, `fileSize`, `format` (PDF/EPUB/MOBI), `language`. Sin stock (descarga ilimitada). |
| `AudioBook.java` | Extiende `Product`. Campos: `duration`, `narrator`, `audioFileUrl`, `sampleUrl`, `chapters`, `language`, `bitrate`. Streaming o descarga. |
| `Course.java` | Extiende `Product`. Campos: `duration`, `level`, `lessonsCount`, `instructor`, `syllabus`, `prerequisites`, `certificate`. Referencia al módulo Course. |
| `Category.java` | Entidad. Campos: `id`, `name`, `slug`, `description`, `icon`, `order`, `parent` (ManyToOne self-ref), `children` (OneToMany), `active`. Jerarquía recursiva. |
| `Subcategory.java` | Entidad. Campos: `id`, `name`, `slug`, `category` (ManyToOne), `order`. Segundo nivel de categorización. |
| `Author.java` | Entidad. Campos: `id`, `name`, `slug`, `bio`, `photo`, `website`, `socialLinks` (JSON), `products` (ManyToMany). |
| `Publisher.java` | Entidad. Campos: `id`, `name`, `slug`, `description`, `logo`, `website`, `country`. |
| `Tag.java` | Entidad. Campos: `id`, `name`, `slug`, `productCount`. Tabla intermedia `product_tags`. |
| `Review.java` | Entidad. Campos: `id`, `product` (ManyToOne), `user` (ManyToOne), `rating` (1-5), `title`, `content`, `pros`, `cons`, `verified`, `approved`, `helpfulCount`, `createdAt`. |
| `Rating.java` | Entidad embeddable o calculada. `averageRating`, `totalReviews`, distribución por estrellas (count de 1-5). Actualización trigger. |
| `ProductVariant.java` | Entidad. Campos: `id`, `product` (ManyToOne), `sku`, `name` (ej: "Tapa dura"), `price`, `stock`, `attributes` (JSON). |
| `ProductImage.java` | Entidad. Campos: `id`, `product` (ManyToOne), `url`, `alt`, `order`, `primary`. Galería de imágenes. |
| `Coupon.java` | Entidad. Campos: `id`, `code` (unique), `type`, `value`, `minPurchase`, `maxDiscount`, `usageLimit`, `perUserLimit`, `usageCount`, `validFrom`, `validUntil`, `active`, `applicableProducts`, `applicableCategories`. |
| `Discount.java` | Entidad. Campos: `id`, `name`, `type`, `value`, `startDate`, `endDate`, `priority`, `stackable`, `active`, `products`, `categories`. |
| `Stock.java` | Entidad. Campos: `id`, `product` (OneToOne), `quantity`, `reserved`, `available` (computed), `lowStockThreshold`, `lastRestockedAt`. Optimistic locking con `@Version`. |

### modules/catalog/entity/enums/

| Archivo | Descripción |
|---------|-------------|
| `ProductType.java` | Enum: `PHYSICAL_BOOK`, `DIGITAL_BOOK`, `AUDIOBOOK`, `COURSE`, `PREMIUM_CONTENT`, `SUBSCRIPTION`. Discriminador de herencia. |
| `ProductStatus.java` | Enum: `DRAFT`, `ACTIVE`, `INACTIVE`, `OUT_OF_STOCK`, `DISCONTINUED`. Ciclo de vida del producto. |
| `DiscountType.java` | Enum: `PERCENTAGE`, `FIXED_AMOUNT`, `BUY_X_GET_Y`, `FREE_SHIPPING`. Tipos de descuento aplicables. |

### modules/catalog/mapper/

| Archivo | Descripción |
|---------|-------------|
| `ProductMapper.java` | Interface MapStruct. Métodos: `toResponse(Product)`, `toDetailResponse(Product)`, `toEntity(CreateProductRequest)`, `updateEntity(UpdateProductRequest, Product)`. Mapea relaciones (author, category, tags). |
| `CategoryMapper.java` | Convierte `Category` ↔ `CategoryResponse`/`CategoryTreeResponse`. Mapea hijos recursivamente para árbol. |
| `AuthorMapper.java` | Convierte `Author` ↔ `AuthorResponse`, `CreateAuthorRequest` → `Author`. |
| `PublisherMapper.java` | Convierte `Publisher` ↔ `PublisherResponse`. |
| `ReviewMapper.java` | Convierte `Review` ↔ `ReviewResponse`, `CreateReviewRequest` → `Review`. Incluye userName y avatar del usuario. |

### modules/catalog/exception/

| Archivo | Descripción |
|---------|-------------|
| `ProductNotFoundException.java` | Producto no encontrado por ID o slug. HTTP 404. |
| `CategoryNotFoundException.java` | Categoría no encontrada. HTTP 404. |
| `OutOfStockException.java` | Producto sin stock disponible. HTTP 409. Incluye stock actual y cantidad solicitada. |
| `InvalidCouponException.java` | Cupón inválido: expirado, agotado, monto insuficiente, no aplicable. HTTP 422. Incluye razón específica. |

### modules/catalog/specification/

| Archivo | Descripción |
|---------|-------------|
| `ProductSpecification.java` | Implementa `Specification<Product>` con builder pattern. Métodos estáticos encadenables: `withCategory()`, `withAuthor()`, `withPriceRange()`, `withType()`, `withRating()`, `inStock()`, `withTags()`, `withSearch()`. Filtros dinámicos combinables. |

### modules/catalog/factory/

| Archivo | Descripción |
|---------|-------------|
| `ProductFactory.java` | Factory Method pattern. Método `createProduct(type, request)` retorna la subclase correcta (PhysicalBook, DigitalBook, AudioBook, Course) según el tipo. Encapsula lógica de creación específica por tipo. |

### modules/catalog/strategy/

| Archivo | Descripción |
|---------|-------------|
| `PricingStrategy.java` | Interfaz Strategy: `calculateFinalPrice(product, user, context)`. Permite diferentes cálculos de precio. |
| `StandardPricingStrategy.java` | Precio base sin modificaciones. Aplica descuentos activos del producto. Precio = base - descuento. |
| `SubscriptionPricingStrategy.java` | Para suscriptores premium: aplica descuento adicional por membresía. Precio = base - descuento_producto - descuento_suscripción. |
| `DiscountPricingStrategy.java` | Evalúa todas las reglas de descuento aplicables (producto, categoría, cupón, promoción). Aplica la combinación más favorable para el cliente respetando reglas de stack. |

---

## 5. MÓDULO CART (Carrito de Compras y Lista de Deseos)

### modules/cart/controller/

| Archivo | Descripción |
|---------|-------------|
| `CartController.java` | `@RestController` `/api/v1/cart`. Endpoints: `GET /` (obtener carrito actual), `POST /items` (agregar item), `PUT /items/{id}` (actualizar cantidad), `DELETE /items/{id}` (eliminar item), `DELETE /` (vaciar carrito), `POST /coupon` (aplicar cupón), `DELETE /coupon` (remover cupón), `GET /summary` (resumen con totales). Asociado al usuario autenticado o session ID para invitados. |
| `WishlistController.java` | `/api/v1/wishlist`. Endpoints: `GET /` (listar favoritos), `POST /{productId}` (agregar), `DELETE /{productId}` (quitar), `POST /move-to-cart/{productId}` (mover item de wishlist a carrito). |

### modules/cart/service/

| Archivo | Descripción |
|---------|-------------|
| `CartService.java` | Interfaz: `getCart()`, `addItem()`, `updateItemQuantity()`, `removeItem()`, `clearCart()`, `applyCoupon()`, `removeCoupon()`, `getCartSummary()`, `mergeGuestCart()`. Merge combina carrito de invitado con carrito de usuario al hacer login. |
| `WishlistService.java` | Interfaz: `getWishlist()`, `addToWishlist()`, `removeFromWishlist()`, `moveToCart()`, `isInWishlist()`. |
| `TaxCalculationService.java` | Interfaz: `calculateTax(cartItems, shippingAddress)`. Calcula impuestos según país/estado/ciudad del destino. Reglas configurables. |
| `ShippingCalculationService.java` | Interfaz: `calculateShipping(cartItems, address)`, `getAvailableMethods()`. Calcula costo de envío según peso, dimensiones, zona, método seleccionado. |

### modules/cart/service/impl/

| Archivo | Descripción |
|---------|-------------|
| `CartServiceImpl.java` | Implementación. Persiste carrito en Redis (TTL 30 días) + BD. Valida stock al agregar. Recalcula totales al modificar. Aplica descuentos de cupón. Merge al login: suma cantidades si mismo producto, mantiene mayor cantidad si conflicto. |
| `WishlistServiceImpl.java` | Implementación. Persiste en BD (tabla user_wishlist). Límite configurable de items. Verifica disponibilidad al mover a carrito. |
| `TaxCalculationServiceImpl.java` | Implementación. Consulta TaxRuleRepository según dirección. Aplica tasas por categoría de producto. Exenciones configurables. Cálculo: subtotal × tasa. |
| `ShippingCalculationServiceImpl.java` | Implementación. Determina zona de envío, calcula peso volumétrico, aplica tarifas por método (estándar, express, gratuito si supera monto). |

### modules/cart/repository/

| Archivo | Descripción |
|---------|-------------|
| `CartRepository.java` | `JpaRepository<Cart, UUID>`. Queries: `findByUserId()`, `findBySessionId()`, `deleteByUserIdAndExpiredBefore()`. |
| `CartItemRepository.java` | `JpaRepository<CartItem, UUID>`. Queries: `findByCartId()`, `findByCartIdAndProductId()`, `countByCartId()`, `deleteByCartId()`. |
| `WishlistRepository.java` | `JpaRepository<Wishlist, UUID>`. Queries: `findByUserId()`, `existsByUserIdAndProductId()`, `deleteByUserIdAndProductId()`, `countByUserId()`. |

### modules/cart/dto/request/

| Archivo | Descripción |
|---------|-------------|
| `AddToCartRequest.java` | Campos: `productId` (UUID, @NotNull), `quantity` (@Min(1) @Max(99)), `variantId` (opcional). Validación de stock disponible. |
| `UpdateCartItemRequest.java` | Campos: `quantity` (@Min(1) @Max(99)). Para actualizar cantidad de un item existente. |
| `ApplyCouponRequest.java` | Campos: `code` (@NotBlank). Código del cupón a aplicar al carrito. |

### modules/cart/dto/response/

| Archivo | Descripción |
|---------|-------------|
| `CartResponse.java` | Campos: `id`, `items[]` (CartItemResponse), `itemCount`, `subtotal`, `discount`, `coupon` (código aplicado), `tax`, `shipping`, `total`, `currency`. Vista completa del carrito. |
| `CartSummaryResponse.java` | Campos: `subtotal`, `discount`, `discountDescription`, `tax`, `taxRate`, `shipping`, `shippingMethod`, `total`, `currency`, `savings`. Resumen para sidebar/checkout. |
| `WishlistResponse.java` | Campos: `items[]` (ProductResponse simplificado + addedAt), `totalItems`. Lista paginada de favoritos. |

### modules/cart/entity/

| Archivo | Descripción |
|---------|-------------|
| `Cart.java` | Entidad. Campos: `id`, `user` (ManyToOne, nullable para invitados), `sessionId` (para invitados), `items` (OneToMany), `coupon` (ManyToOne), `expiresAt`, `lastModifiedAt`. |
| `CartItem.java` | Entidad. Campos: `id`, `cart` (ManyToOne), `product` (ManyToOne), `variant` (ManyToOne, opcional), `quantity`, `unitPrice` (capturado al agregar), `addedAt`. |
| `Wishlist.java` | Entidad. Campos: `id`, `user` (ManyToOne), `items` (OneToMany). |
| `WishlistItem.java` | Entidad. Campos: `id`, `wishlist` (ManyToOne), `product` (ManyToOne), `addedAt`. |

### modules/cart/mapper/

| Archivo | Descripción |
|---------|-------------|
| `CartMapper.java` | Convierte `Cart` → `CartResponse`. Calcula subtotal, aplica descuentos, suma impuestos y envío para total. Mapea items con detalles de producto. |
| `WishlistMapper.java` | Convierte `Wishlist` → `WishlistResponse`. Incluye info resumida de cada producto. |

### modules/cart/exception/

| Archivo | Descripción |
|---------|-------------|
| `CartNotFoundException.java` | Carrito no encontrado para el usuario/sesión. HTTP 404. |
| `CartItemLimitException.java` | Excede límite máximo de items en carrito (configurable, default 50). HTTP 422. |

---

## 6. MÓDULO PAYMENT (Pagos y Transacciones)

### modules/payment/controller/

| Archivo | Descripción |
|---------|-------------|
| `PaymentController.java` | `/api/v1/payments`. Endpoints: `POST /create` (inicia pago), `POST /process` (procesa con proveedor), `GET /{id}/status` (estado), `GET /methods` (métodos disponibles), `POST /refund/{id}` (solicitar reembolso). Requiere autenticación. |
| `WebhookController.java` | `/api/v1/webhooks`. Endpoints: `POST /mercadopago`, `POST /paypal`, `POST /stripe`. Reciben notificaciones de proveedores. Sin autenticación JWT pero con verificación de firma del proveedor. |
| `AdminPaymentController.java` | `/api/v1/admin/payments`. Endpoints: `GET /` (listar transacciones), `GET /{id}` (detalle), `POST /{id}/refund` (reembolso manual), `GET /report` (reporte de ingresos). Requiere ADMIN. |

### modules/payment/service/

| Archivo | Descripción |
|---------|-------------|
| `PaymentService.java` | Interfaz: `createPayment()`, `processPayment()`, `getPaymentStatus()`, `refundPayment()`, `getAvailableMethods()`. Orquesta el flujo de pago agnóstico al proveedor. |
| `TransactionService.java` | Interfaz: `recordTransaction()`, `findByOrderId()`, `findByUserId()`, `getTransactionStatus()`, `updateStatus()`. Registro inmutable de transacciones financieras. |

### modules/payment/service/impl/

| Archivo | Descripción |
|---------|-------------|
| `PaymentServiceImpl.java` | Implementación. Usa `PaymentProviderFactory` para obtener estrategia correcta. Crea payment intent, procesa, actualiza estado. Maneja reintentos en caso de timeout del proveedor. |
| `TransactionServiceImpl.java` | Implementación. Registra cada operación financiera (cargo, reembolso, cancelación). Inmutable: nunca se actualiza, se crean nuevos registros. Conciliación con webhooks. |

### modules/payment/service/provider/

| Archivo | Descripción |
|---------|-------------|
| `MercadoPagoProvider.java` | Integración completa con API de Mercado Pago. Crea preferencia de pago, procesa checkout pro, maneja IPN (Instant Payment Notification). SDK oficial. |
| `PayPalProvider.java` | Integración con PayPal REST API v2. Crea order, capture payment, refund. Maneja redirects de aprobación. Client ID + Secret. |
| `StripeProvider.java` | Integración con Stripe API. Payment Intents, confirmación, webhooks. Preparado pero deshabilitado por defecto (feature flag). |
| `BankTransferProvider.java` | Genera instrucciones de transferencia bancaria. Datos de cuenta, referencia única. Confirmación manual por admin. Estado pending hasta confirmación. |

### modules/payment/repository/

| Archivo | Descripción |
|---------|-------------|
| `PaymentRepository.java` | `JpaRepository<Payment, UUID>`. Queries: `findByOrderId()`, `findByExternalId()`, `findByStatus()`, `findByUserIdOrderByCreatedAtDesc()`. |
| `TransactionRepository.java` | `JpaRepository<Transaction, UUID>`. Queries: `findByPaymentId()`, `findByOrderId()`, `sumAmountByDateRange()`, `countByStatusAndDateRange()`. |

### modules/payment/dto/request/

| Archivo | Descripción |
|---------|-------------|
| `CreatePaymentRequest.java` | Campos: `orderId` (UUID), `method` (enum), `provider` (enum), `returnUrl`, `cancelUrl`. Inicia flujo de pago para una orden. |
| `ProcessPaymentRequest.java` | Campos: `paymentId`, `externalToken` (token del proveedor tras autorización del usuario), `payerInfo`. Confirma el pago autorizado. |

### modules/payment/dto/response/

| Archivo | Descripción |
|---------|-------------|
| `PaymentResponse.java` | Campos: `id`, `orderId`, `amount`, `currency`, `method`, `provider`, `status`, `externalId`, `redirectUrl` (para checkout externo), `createdAt`. |
| `TransactionResponse.java` | Campos: `id`, `paymentId`, `type` (CHARGE/REFUND/CANCEL), `amount`, `status`, `externalReference`, `createdAt`, `metadata`. |
| `PaymentStatusResponse.java` | Campos: `paymentId`, `status`, `method`, `paidAt`, `amount`, `refundedAmount`, `netAmount`. Estado actual resumido. |

### modules/payment/entity/

| Archivo | Descripción |
|---------|-------------|
| `Payment.java` | Entidad. Campos: `id`, `order` (OneToOne), `user` (ManyToOne), `amount`, `currency`, `method`, `provider`, `status`, `externalId`, `externalUrl`, `metadata` (JSON), `paidAt`, `expiresAt`. |
| `Transaction.java` | Entidad inmutable. Campos: `id`, `payment` (ManyToOne), `type`, `amount`, `status`, `externalReference`, `gatewayResponse` (JSON), `ip`, `createdAt`. Cada operación genera un registro. |

### modules/payment/entity/enums/

| Archivo | Descripción |
|---------|-------------|
| `PaymentMethod.java` | Enum: `CREDIT_CARD`, `DEBIT_CARD`, `BANK_TRANSFER`, `DIGITAL_WALLET`, `CASH_ON_DELIVERY`. |
| `PaymentProvider.java` | Enum: `MERCADO_PAGO`, `PAYPAL`, `STRIPE`, `BANK_TRANSFER`. Con metadata de configuración. |
| `TransactionStatus.java` | Enum: `PENDING`, `PROCESSING`, `COMPLETED`, `FAILED`, `CANCELLED`, `REFUNDED`, `PARTIALLY_REFUNDED`, `EXPIRED`. |

### modules/payment/mapper/

| Archivo | Descripción |
|---------|-------------|
| `PaymentMapper.java` | Convierte `Payment` ↔ `PaymentResponse`. Incluye URL de redirect para checkout externo. |
| `TransactionMapper.java` | Convierte `Transaction` → `TransactionResponse`. Sanitiza datos sensibles del gateway response. |

### modules/payment/exception/

| Archivo | Descripción |
|---------|-------------|
| `PaymentFailedException.java` | Pago rechazado por proveedor. HTTP 422. Incluye razón (fondos insuficientes, tarjeta expirada, etc). |
| `PaymentNotFoundException.java` | Pago no encontrado. HTTP 404. |
| `WebhookValidationException.java` | Firma de webhook inválida. HTTP 400. Loguea intento de fraude. |

### modules/payment/webhook/

| Archivo | Descripción |
|---------|-------------|
| `MercadoPagoWebhook.java` | Procesa IPN de Mercado Pago. Verifica firma HMAC. Actualiza estado de pago/transacción. Tipos: payment.created, payment.updated. |
| `PayPalWebhook.java` | Procesa webhooks PayPal. Verifica con API de verificación de PayPal. Eventos: PAYMENT.CAPTURE.COMPLETED, PAYMENT.CAPTURE.DENIED. |
| `StripeWebhook.java` | Procesa events de Stripe. Verifica signature con webhook secret. Eventos: payment_intent.succeeded, charge.refunded. |

### modules/payment/strategy/

| Archivo | Descripción |
|---------|-------------|
| `PaymentStrategy.java` | Interfaz Strategy: `createPayment()`, `processPayment()`, `refundPayment()`, `verifyWebhook()`. Contrato común para todos los proveedores. |
| `MercadoPagoStrategy.java` | Implementación de Strategy para Mercado Pago. Crea preferencia, procesa checkout, valida IPN. |
| `PayPalStrategy.java` | Implementación para PayPal. Crea orden, captura pago, procesa reembolso. |
| `StripeStrategy.java` | Implementación para Stripe. Payment intents, confirmación, refunds. |

### modules/payment/factory/

| Archivo | Descripción |
|---------|-------------|
| `PaymentProviderFactory.java` | Factory que retorna la `PaymentStrategy` correcta según el `PaymentProvider` seleccionado. Inyecta todas las estrategias y las resuelve por tipo. |

---

## 7. MÓDULO ORDER (Pedidos, Facturas, Reembolsos, Tracking)

### modules/order/controller/

| Archivo | Descripción |
|---------|-------------|
| `OrderController.java` | `/api/v1/orders`. Endpoints: `POST /` (crear orden desde carrito), `GET /` (mis pedidos paginados), `GET /{id}` (detalle), `POST /{id}/cancel` (cancelar), `GET /{id}/invoice` (descargar PDF), `GET /{id}/tracking` (seguimiento). Requiere autenticación. |
| `AdminOrderController.java` | `/api/v1/admin/orders`. Endpoints: `GET /` (todos los pedidos con filtros), `GET /{id}`, `PUT /{id}/status` (cambiar estado), `POST /{id}/refund` (reembolso), `GET /export` (exportar Excel/CSV). Requiere ADMIN. |

### modules/order/service/

| Archivo | Descripción |
|---------|-------------|
| `OrderService.java` | Interfaz: `createOrder()`, `findById()`, `findByUser(pageable)`, `cancelOrder()`, `updateStatus()`, `findAll(filter, pageable)`. Orquesta creación: valida stock, reserva, crea orden, inicia pago. |
| `OrderTrackingService.java` | Interfaz: `getTracking()`, `addTrackingEvent()`, `updateShippingInfo()`. Historial de estados y eventos del envío. |
| `InvoiceService.java` | Interfaz: `generateInvoice()`, `getInvoicePdf()`, `sendInvoiceByEmail()`, `regenerateInvoice()`. Genera factura PDF con datos fiscales. |
| `RefundService.java` | Interfaz: `requestRefund()`, `processRefund()`, `getRefundStatus()`, `approveRefund()`, `rejectRefund()`. Flujo completo de reembolso con aprobación. |

### modules/order/service/impl/

| Archivo | Descripción |
|---------|-------------|
| `OrderServiceImpl.java` | Implementación. Flujo: valida carrito → reserva stock → calcula totales (subtotal + tax + shipping - discount) → crea orden → limpia carrito → publica OrderCreatedEvent. Transaccional. |
| `OrderTrackingServiceImpl.java` | Implementación. Registra cada cambio de estado con timestamp, nota, actor. Timeline de eventos: CREATED → PAID → PREPARING → SHIPPED → DELIVERED. |
| `InvoiceServiceImpl.java` | Implementación. Genera PDF con iText/JasperReports. Datos: empresa, cliente, items, totales, impuestos, número correlativo. Almacena en MinIO. Envía por email automáticamente. |
| `RefundServiceImpl.java` | Implementación. Valida política de reembolso (ej: dentro de 30 días). Crea solicitud pending → admin aprueba → ejecuta reembolso vía PaymentService → actualiza stock → notifica cliente. |

### modules/order/repository/

| Archivo | Descripción |
|---------|-------------|
| `OrderRepository.java` | `JpaRepository<Order, UUID>` + `JpaSpecificationExecutor`. Queries: `findByUserId(pageable)`, `findByStatus()`, `countByStatusAndDateRange()`, `sumTotalByDateRange()`. |
| `OrderItemRepository.java` | Queries: `findByOrderId()`, `findTopSellingProducts(limit, dateRange)`. |
| `InvoiceRepository.java` | Queries: `findByOrderId()`, `findByNumber()`, `getNextInvoiceNumber()`. Numeración correlativa. |
| `RefundRepository.java` | Queries: `findByOrderId()`, `findByStatus()`, `findByUserId()`. |

### modules/order/dto/request/

| Archivo | Descripción |
|---------|-------------|
| `CreateOrderRequest.java` | Campos: `shippingAddressId` (UUID), `billingAddressId` (UUID), `shippingMethod`, `paymentMethod`, `paymentProvider`, `notes` (opcional), `couponCode` (opcional). Validación: dirección pertenece al usuario. |
| `UpdateOrderStatusRequest.java` | Campos: `status` (enum), `note` (opcional), `trackingNumber` (para SHIPPED), `carrier` (para SHIPPED). Solo admin. |
| `CancelOrderRequest.java` | Campos: `reason` (@NotBlank). Validación: solo cancelable si estado es PENDING o PAID (antes de envío). |
| `RefundRequest.java` | Campos: `reason`, `amount` (parcial o total), `items[]` (IDs de items a reembolsar, opcional para parcial). |

### modules/order/dto/response/

| Archivo | Descripción |
|---------|-------------|
| `OrderResponse.java` | Vista resumida para listado: `id`, `orderNumber`, `status`, `total`, `itemCount`, `createdAt`, `paymentStatus`, `firstItemImage`. |
| `OrderDetailResponse.java` | Vista completa: `id`, `orderNumber`, `items[]`, `shippingAddress`, `billingAddress`, `subtotal`, `discount`, `tax`, `shipping`, `total`, `status`, `paymentStatus`, `paymentMethod`, `tracking`, `createdAt`, `paidAt`, `shippedAt`, `deliveredAt`. |
| `OrderListResponse.java` | Wrapper paginado de OrderResponse con filtros aplicados y totales. |
| `InvoiceResponse.java` | Campos: `id`, `number`, `orderId`, `pdfUrl`, `total`, `tax`, `issuedAt`, `dueDate`. |
| `RefundResponse.java` | Campos: `id`, `orderId`, `amount`, `reason`, `status`, `requestedAt`, `processedAt`, `refundMethod`. |
| `OrderTrackingResponse.java` | Campos: `orderId`, `status`, `trackingNumber`, `carrier`, `estimatedDelivery`, `events[]` (timestamp + status + description + location). Timeline visual. |

### modules/order/entity/

| Archivo | Descripción |
|---------|-------------|
| `Order.java` | Entidad. Campos: `id`, `orderNumber` (generated, unique), `user` (ManyToOne), `items` (OneToMany), `shippingAddress` (Embedded), `billingAddress` (Embedded), `subtotal`, `discount`, `tax`, `shippingCost`, `total`, `currency`, `status`, `paymentStatus`, `notes`, `coupon`, `createdAt`, `paidAt`, `shippedAt`, `deliveredAt`, `cancelledAt`. |
| `OrderItem.java` | Entidad. Campos: `id`, `order` (ManyToOne), `product` (ManyToOne), `variant` (ManyToOne), `productTitle` (snapshot), `productImage` (snapshot), `unitPrice`, `quantity`, `total`, `type` (PHYSICAL/DIGITAL). Snapshot de datos al momento de compra. |
| `Invoice.java` | Entidad. Campos: `id`, `order` (OneToOne), `number` (correlativo), `pdfUrl`, `subtotal`, `tax`, `total`, `issuedAt`, `companyInfo` (JSON). |
| `Refund.java` | Entidad. Campos: `id`, `order` (ManyToOne), `amount`, `reason`, `status`, `requestedBy`, `processedBy`, `requestedAt`, `processedAt`, `transactionId`. |
| `OrderTracking.java` | Entidad. Campos: `id`, `order` (ManyToOne), `status`, `description`, `location`, `trackingNumber`, `carrier`, `timestamp`. Historial de eventos. |

### modules/order/entity/enums/

| Archivo | Descripción |
|---------|-------------|
| `OrderStatus.java` | Enum: `PENDING`, `CONFIRMED`, `PAID`, `PREPARING`, `SHIPPED`, `DELIVERED`, `COMPLETED`, `CANCELLED`, `RETURNED`. Máquina de estados con transiciones válidas. |
| `PaymentStatus.java` | Enum: `PENDING`, `PAID`, `FAILED`, `REFUNDED`, `PARTIALLY_REFUNDED`. Estado del pago de la orden. |
| `ShippingStatus.java` | Enum: `PENDING`, `PROCESSING`, `SHIPPED`, `IN_TRANSIT`, `OUT_FOR_DELIVERY`, `DELIVERED`, `RETURNED`. |
| `RefundStatus.java` | Enum: `REQUESTED`, `APPROVED`, `PROCESSING`, `COMPLETED`, `REJECTED`. Flujo de aprobación de reembolso. |

### modules/order/mapper/

| Archivo | Descripción |
|---------|-------------|
| `OrderMapper.java` | Convierte `Order` ↔ `OrderResponse`/`OrderDetailResponse`. Calcula campos derivados. Mapea items con snapshots. |
| `InvoiceMapper.java` | Convierte `Invoice` → `InvoiceResponse`. Incluye URL firmada del PDF. |

### modules/order/exception/

| Archivo | Descripción |
|---------|-------------|
| `OrderNotFoundException.java` | Orden no encontrada. HTTP 404. |
| `OrderCancellationException.java` | No se puede cancelar (ya enviada o entregada). HTTP 422. Incluye estado actual. |

### modules/order/event/

| Archivo | Descripción |
|---------|-------------|
| `OrderCreatedEvent.java` | Publicado al crear orden. Contiene `orderId`, `userId`, `total`. Dispara: reserva stock, envío email confirmación, registro analytics. |
| `OrderStatusChangedEvent.java` | Publicado al cambiar estado. Contiene `orderId`, `previousStatus`, `newStatus`, `actor`. Dispara: notificación al cliente, actualización tracking. |
| `OrderCancelledEvent.java` | Publicado al cancelar. Contiene `orderId`, `reason`. Dispara: liberación stock, inicio reembolso si pagado, notificación. |

### modules/order/listener/

| Archivo | Descripción |
|---------|-------------|
| `OrderEventListener.java` | Escucha eventos de orden. Reacciones: Created → email confirmación + generar factura. StatusChanged → notificación push + email. Cancelled → reembolso + liberar stock. |

---

## 8. MÓDULO PODCAST (Episodios, Temporadas, RSS, Integraciones)

### modules/podcast/controller/

| Archivo | Descripción |
|---------|-------------|
| `PodcastController.java` | `/api/v1/podcasts`. Endpoints públicos: `GET /` (listado de shows), `GET /{slug}` (detalle de podcast con temporadas), `GET /{slug}/episodes` (episodios paginados), `GET /latest` (últimos episodios), `GET /popular` (más escuchados). |
| `EpisodeController.java` | `/api/v1/podcasts/{podcastId}/episodes`. Endpoints: `GET /{slug}` (detalle de episodio con audio/video), `GET /{id}/stream` (streaming de audio), `POST /{id}/play` (registrar reproducción para analytics). |
| `AdminPodcastController.java` | `/api/v1/admin/podcasts`. CRUD completo: crear/editar/eliminar podcasts y episodios, programar publicaciones, gestionar temporadas, subir audio/video, ver estadísticas de reproducciones. Requiere ADMIN/EDITOR. |

### modules/podcast/service/

| Archivo | Descripción |
|---------|-------------|
| `PodcastService.java` | Interfaz: `findAll()`, `findBySlug()`, `create()`, `update()`, `delete()`, `findLatestEpisodes()`, `findPopular()`. Gestión de shows/podcasts. |
| `EpisodeService.java` | Interfaz: `findByPodcast(pageable)`, `findBySlug()`, `create()`, `update()`, `delete()`, `schedule()`, `publish()`, `recordPlay()`. Ciclo de vida de episodios. |
| `SeasonService.java` | Interfaz: `findByPodcast()`, `create()`, `update()`, `delete()`, `reorder()`. Organización de episodios en temporadas. |
| `RssFeedService.java` | Interfaz: `generateFeed(podcastId)`, `validateFeed()`, `getSubscribeUrl()`. Genera RSS compatible con Apple Podcasts, Spotify, Google Podcasts. |

### modules/podcast/service/impl/

| Archivo | Descripción |
|---------|-------------|
| `PodcastServiceImpl.java` | Implementación. CRUD con slug auto-generado. Caché de podcasts populares. Cálculo de estadísticas (total episodios, total reproducciones). |
| `EpisodeServiceImpl.java` | Implementación. Sube audio a MinIO/S3. Programación con @Scheduled (publica cuando llega la fecha). Extrae duración del audio. Genera thumbnail del video si aplica. Incrementa contador de plays. |
| `SeasonServiceImpl.java` | Implementación. Numera temporadas automáticamente. Reordena episodios dentro de temporada. Valida que no queden temporadas vacías. |
| `RssFeedServiceImpl.java` | Implementación. Genera XML RSS 2.0 con namespace iTunes. Incluye: title, description, author, image, episodes con enclosure (audio URL), duration, pubDate. Compatible con validadores de Apple/Spotify. |

### modules/podcast/service/integration/

| Archivo | Descripción |
|---------|-------------|
| `SpotifyIntegrationService.java` | Integración con Spotify for Podcasters API. Publica episodios, obtiene analytics de reproducciones, sincroniza metadata. OAuth2 con Spotify. |
| `YouTubeIntegrationService.java` | Integración con YouTube Data API v3. Sube videos de episodios, crea playlists por temporada, obtiene estadísticas. OAuth2 con Google. |
| `ApplePodcastIntegrationService.java` | Integración con Apple Podcasts Connect API. Envía feed RSS, valida formato, obtiene posicionamiento. |
| `GooglePodcastIntegrationService.java` | Integración con Google Podcasts Manager API. Indexación de feed, analytics de impresiones y reproducciones. |

### modules/podcast/repository/

| Archivo | Descripción |
|---------|-------------|
| `PodcastRepository.java` | Queries: `findBySlug()`, `findAllActive()`, `findByHostId()`. Podcasts/shows. |
| `EpisodeRepository.java` | Queries: `findByPodcastId(pageable)`, `findBySlug()`, `findScheduledBeforeNow()`, `findLatest(limit)`, `findTopByPlaysDesc(limit)`, `countByPodcastId()`. |
| `SeasonRepository.java` | Queries: `findByPodcastIdOrderByNumber()`, `findMaxSeasonNumber(podcastId)`. |

### modules/podcast/dto/request/

| Archivo | Descripción |
|---------|-------------|
| `CreatePodcastRequest.java` | Campos: `title`, `description`, `coverImage`, `language`, `category`, `author`, `email`, `website`, `explicit` (boolean). |
| `CreateEpisodeRequest.java` | Campos: `title`, `description`, `seasonId`, `episodeNumber`, `audioFile` (MultipartFile), `videoUrl` (opcional), `image`, `duration`, `explicit`, `tags[]`, `showNotes` (HTML). |
| `UpdateEpisodeRequest.java` | Campos opcionales para edición parcial. Permite cambiar audio, metadata, notas. |
| `ScheduleEpisodeRequest.java` | Campos: `publishAt` (LocalDateTime, futuro). Programa publicación automática del episodio. |

### modules/podcast/dto/response/

| Archivo | Descripción |
|---------|-------------|
| `PodcastResponse.java` | Campos: `id`, `title`, `slug`, `description`, `coverImage`, `author`, `episodeCount`, `totalPlays`, `latestEpisodeDate`, `platforms` (links a Spotify, Apple, etc). |
| `EpisodeResponse.java` | Campos: `id`, `title`, `slug`, `description`, `audioUrl`, `videoUrl`, `image`, `duration`, `seasonNumber`, `episodeNumber`, `plays`, `publishedAt`, `showNotes`. |
| `EpisodeListResponse.java` | Paginado de episodios con filtro por temporada, ordenamiento por fecha/popularidad. |
| `SeasonResponse.java` | Campos: `id`, `number`, `title`, `episodeCount`, `episodes[]` (resumidos). |

### modules/podcast/entity/

| Archivo | Descripción |
|---------|-------------|
| `Podcast.java` | Entidad. Campos: `id`, `title`, `slug`, `description`, `coverImage`, `language`, `category`, `author`, `email`, `website`, `explicit`, `active`, `seasons` (OneToMany), `episodes` (OneToMany), `totalPlays`. |
| `Episode.java` | Entidad. Campos: `id`, `podcast` (ManyToOne), `season` (ManyToOne), `title`, `slug`, `description`, `audioUrl`, `videoUrl`, `image`, `duration`, `episodeNumber`, `plays`, `status`, `publishedAt`, `scheduledAt`, `showNotes`, `transcript`. |
| `Season.java` | Entidad. Campos: `id`, `podcast` (ManyToOne), `number`, `title`, `description`, `episodes` (OneToMany). |
| `PodcastCategory.java` | Entidad. Campos: `id`, `name`, `slug`, `parentId`. Categorías específicas para podcasts (compatibles con iTunes categories). |

### modules/podcast/entity/enums/

| Archivo | Descripción |
|---------|-------------|
| `EpisodeStatus.java` | Enum: `DRAFT`, `SCHEDULED`, `PUBLISHED`, `ARCHIVED`. Ciclo de vida del episodio. |
| `PodcastPlatform.java` | Enum: `SPOTIFY`, `YOUTUBE`, `APPLE_PODCASTS`, `GOOGLE_PODCASTS`, `RSS`. Plataformas de distribución. |

### modules/podcast/mapper/

| Archivo | Descripción |
|---------|-------------|
| `PodcastMapper.java` | Convierte `Podcast` ↔ `PodcastResponse`. Incluye conteos y fecha del último episodio. |
| `EpisodeMapper.java` | Convierte `Episode` ↔ `EpisodeResponse`. Genera URLs firmadas para streaming. Incluye info de temporada. |

### modules/podcast/exception/

| Archivo | Descripción |
|---------|-------------|
| `PodcastNotFoundException.java` | Podcast no encontrado. HTTP 404. |
| `EpisodeNotFoundException.java` | Episodio no encontrado. HTTP 404. |

### modules/podcast/rss/

| Archivo | Descripción |
|---------|-------------|
| `RssFeedGenerator.java` | Genera XML RSS 2.0 con namespaces: `itunes:`, `content:`, `atom:`. Estructura: channel (podcast metadata) + items (episodios con enclosure). Valida contra spec de Apple Podcasts. |
| `RssFeedController.java` | `GET /api/v1/podcasts/{slug}/feed.xml`. Retorna RSS feed con Content-Type `application/rss+xml`. Caché con ETags. Sin autenticación para acceso público por agregadores. |

---

## 9. MÓDULO BLOG (CMS, Posts, Comentarios)

### modules/blog/controller/

| Archivo | Descripción |
|---------|-------------|
| `BlogController.java` | `/api/v1/blog`. Endpoints públicos: `GET /posts` (listado paginado), `GET /posts/{slug}` (detalle con SEO), `GET /categories` (categorías blog), `GET /tags` (nube de tags), `GET /posts/popular`, `GET /posts/related/{id}`. |
| `AdminBlogController.java` | `/api/v1/admin/blog`. CRUD completo: crear/editar/eliminar/programar posts, gestionar categorías y tags del blog. Editor enriquecido (acepta HTML sanitizado). Requiere ADMIN/EDITOR. |
| `CommentController.java` | `/api/v1/blog/posts/{postId}/comments`. Endpoints: `GET /` (comentarios paginados, anidados), `POST /` (crear, requiere auth), `PUT /{id}` (editar propio), `DELETE /{id}` (eliminar propio o admin). Moderación automática. |

### modules/blog/service/

| Archivo | Descripción |
|---------|-------------|
| `BlogService.java` | Interfaz: `findAllPublished(pageable)`, `findBySlug()`, `create()`, `update()`, `delete()`, `publish()`, `schedule()`, `findByCategory()`, `findByTag()`, `findPopular()`, `findRelated()`. |
| `CommentService.java` | Interfaz: `findByPost(pageable)`, `create()`, `update()`, `delete()`, `moderate()`, `countByPost()`. Soporta respuestas anidadas (replies). |

### modules/blog/service/impl/

| Archivo | Descripción |
|---------|-------------|
| `BlogServiceImpl.java` | Implementación. Slug auto-generado. Sanitización HTML del contenido (Jsoup whitelist). Programación de publicación. Cálculo de tiempo de lectura. Indexación en ElasticSearch para búsqueda. Incremento de vistas. Caché de posts populares. |
| `CommentServiceImpl.java` | Implementación. Comentarios anidados (parent_id). Moderación: filtro de spam/palabras prohibidas. Notificación al autor del post. Límite de profundidad de anidamiento (3 niveles). |

### modules/blog/repository/

| Archivo | Descripción |
|---------|-------------|
| `PostRepository.java` | Queries: `findBySlugAndStatusPublished()`, `findAllByStatusPublished(pageable)`, `findByCategorySlug()`, `findByTagSlug()`, `findScheduledBeforeNow()`, `findTopByViewsDesc(limit)`. |
| `BlogCategoryRepository.java` | Queries: `findBySlug()`, `findAllActive()`, `countPostsByCategory()`. Categorías específicas del blog. |
| `BlogTagRepository.java` | Queries: `findBySlug()`, `findPopular(limit)`, `findByNameIn()`. |
| `CommentRepository.java` | Queries: `findByPostIdAndParentIsNull(pageable)` (top-level), `findByParentId()` (replies), `countByPostId()`, `findByUserId()`. |

### modules/blog/dto/request/

| Archivo | Descripción |
|---------|-------------|
| `CreatePostRequest.java` | Campos: `title`, `content` (HTML), `excerpt`, `coverImage`, `categoryId`, `tags[]`, `status` (DRAFT/PUBLISHED), `publishAt` (opcional para programar), `seoTitle`, `seoDescription`, `seoKeywords`. |
| `UpdatePostRequest.java` | Campos opcionales para actualización parcial. Mismo esquema que Create. |
| `CreateCommentRequest.java` | Campos: `content` (@NotBlank @Size max=2000), `parentId` (UUID opcional para reply). |

### modules/blog/dto/response/

| Archivo | Descripción |
|---------|-------------|
| `PostResponse.java` | Vista resumida para listado: `id`, `title`, `slug`, `excerpt`, `coverImage`, `author`, `category`, `tags[]`, `readingTime`, `views`, `commentCount`, `publishedAt`. |
| `PostListResponse.java` | Paginado con filtros: categoría, tag, búsqueda. Incluye metadata de paginación. |
| `PostDetailResponse.java` | Vista completa: todos los campos + `content` (HTML), `seo`, `relatedPosts[]`, `author` (bio, avatar), `comments` (primeros 10). |
| `CommentResponse.java` | Campos: `id`, `content`, `author` (name, avatar), `createdAt`, `replies[]` (anidado), `replyCount`, `edited`. |

### modules/blog/entity/

| Archivo | Descripción |
|---------|-------------|
| `Post.java` | Entidad. Campos: `id`, `title`, `slug` (unique), `content` (TEXT/LONGTEXT), `excerpt`, `coverImage`, `author` (ManyToOne User), `category` (ManyToOne), `tags` (ManyToMany), `status`, `views`, `readingTime`, `seoTitle`, `seoDescription`, `seoKeywords`, `publishedAt`, `scheduledAt`. |
| `BlogCategory.java` | Entidad. Campos: `id`, `name`, `slug`, `description`, `order`, `active`. Independiente de categorías de producto. |
| `BlogTag.java` | Entidad. Campos: `id`, `name`, `slug`, `postCount`. Tags del blog (pueden diferir de tags de producto). |
| `Comment.java` | Entidad. Campos: `id`, `post` (ManyToOne), `user` (ManyToOne), `content`, `parent` (ManyToOne self-ref), `replies` (OneToMany), `approved`, `edited`, `createdAt`, `updatedAt`. |

### modules/blog/entity/enums/

| Archivo | Descripción |
|---------|-------------|
| `PostStatus.java` | Enum: `DRAFT`, `SCHEDULED`, `PUBLISHED`, `ARCHIVED`. Ciclo de vida del post. |

### modules/blog/mapper/

| Archivo | Descripción |
|---------|-------------|
| `PostMapper.java` | Convierte `Post` ↔ `PostResponse`/`PostDetailResponse`. Calcula readingTime, incluye author info, mapea tags. |
| `CommentMapper.java` | Convierte `Comment` ↔ `CommentResponse`. Mapea replies recursivamente (hasta profundidad 3). |

### modules/blog/exception/

| Archivo | Descripción |
|---------|-------------|
| `PostNotFoundException.java` | Post no encontrado por slug o ID. HTTP 404. |

---

## 10. MÓDULO COUNSELING (Asesorías Matrimoniales)

### modules/counseling/controller/

| Archivo | Descripción |
|---------|-------------|
| `CounselingController.java` | `/api/v1/counseling`. Endpoints públicos: `GET /counselors` (listado de asesores), `GET /counselors/{id}` (perfil del asesor), `GET /availability/{counselorId}` (horarios disponibles). Endpoints auth: `POST /bookings` (reservar), `GET /my-sessions` (mis sesiones), `POST /bookings/{id}/cancel`. |
| `ScheduleController.java` | `/api/v1/counseling/schedule`. Endpoints para asesores: `GET /my-schedule`, `PUT /my-schedule` (configurar disponibilidad), `POST /block-time` (bloquear horario), `DELETE /block-time/{id}`. |
| `AdminCounselingController.java` | `/api/v1/admin/counseling`. Gestión: CRUD asesores, ver todas las reservas, estadísticas, confirmar/cancelar sesiones, asignar pagos. Requiere ADMIN. |

### modules/counseling/service/

| Archivo | Descripción |
|---------|-------------|
| `CounselingService.java` | Interfaz: `findCounselors()`, `findCounselorById()`, `getAvailability()`, `createBooking()`, `cancelBooking()`, `getMyBookings()`, `completeSession()`. |
| `ScheduleService.java` | Interfaz: `getSchedule(counselorId)`, `updateSchedule()`, `blockTimeSlot()`, `unblockTimeSlot()`, `getAvailableSlots(date)`. Gestión de horarios del asesor. |
| `BookingService.java` | Interfaz: `create()`, `confirm()`, `cancel()`, `reschedule()`, `findByUser()`, `findByCounselor()`, `findUpcoming()`. Lógica de reservas con validación de conflictos. |
| `ReminderService.java` | Interfaz: `scheduleReminder()`, `sendReminder()`, `cancelReminder()`. Envía recordatorios 24h y 1h antes de la sesión (email + push). |

### modules/counseling/service/impl/

| Archivo | Descripción |
|---------|-------------|
| `CounselingServiceImpl.java` | Implementación. Coordina flujo: verificar disponibilidad → crear booking → procesar pago previo → confirmar → generar link videollamada → enviar confirmación por email. |
| `ScheduleServiceImpl.java` | Implementación. Gestiona bloques de tiempo (ej: Lunes 9-12, 14-18). Calcula slots de 1h disponibles excluyendo bookings existentes y bloqueos manuales. Zona horaria del asesor. |
| `BookingServiceImpl.java` | Implementación. Validaciones: slot disponible, no conflicto con otra reserva, pago completado. Genera meeting link. Envía confirmación a ambas partes. Máquina de estados: PENDING_PAYMENT → CONFIRMED → IN_PROGRESS → COMPLETED. |
| `ReminderServiceImpl.java` | Implementación. Usa @Scheduled para revisar bookings próximos. Envía email + push notification. Marca reminder como enviado. No envía si sesión fue cancelada. |

### modules/counseling/service/integration/

| Archivo | Descripción |
|---------|-------------|
| `ZoomIntegrationService.java` | Integración con Zoom API. Métodos: `createMeeting()`, `getMeetingLink()`, `deleteMeeting()`. Genera reuniones con sala de espera, password, y recording habilitado. OAuth2 Server-to-Server. |
| `GoogleMeetIntegrationService.java` | Integración con Google Calendar API. Crea evento con conferencia Google Meet automática. OAuth2 con cuenta de servicio. |
| `JitsiIntegrationService.java` | Genera link de Jitsi Meet (self-hosted o público). No requiere API externa. Crea room con nombre único, configura moderador, password opcional. Fallback si Zoom/Meet no disponibles. |

### modules/counseling/repository/

| Archivo | Descripción |
|---------|-------------|
| `CounselingSessionRepository.java` | Queries: `findByBookingId()`, `findCompletedByCounselor()`, `findCompletedByUser()`. Sesiones realizadas con notas. |
| `ScheduleRepository.java` | Queries: `findByCounselorId()`, `findByCounselorIdAndDayOfWeek()`. Configuración de disponibilidad semanal. |
| `BookingRepository.java` | Queries: `findByUserId(pageable)`, `findByCounselorId(pageable)`, `findByCounselorIdAndDate()`, `findUpcomingByUserId()`, `findPendingReminders()`, `existsByCounselorIdAndTimeSlotOverlap()`. |
| `CounselorRepository.java` | Queries: `findAllActive()`, `findByUserId()`, `findBySpecialty()`. |
| `SessionNoteRepository.java` | Queries: `findByBookingId()`, `findByCounselorId()`. Notas privadas del asesor sobre la sesión. |

### modules/counseling/dto/request/

| Archivo | Descripción |
|---------|-------------|
| `CreateBookingRequest.java` | Campos: `counselorId`, `date` (LocalDate), `timeSlotId` (UUID), `sessionType` (INDIVIDUAL/COUPLE), `videoPlatform` (ZOOM/MEET/JITSI), `notes` (opcional). Validación: fecha futura, slot disponible. |
| `UpdateScheduleRequest.java` | Campos: `availability[]` (array de {dayOfWeek, startTime, endTime, active}). Define horario semanal del asesor. |
| `CreateSessionNoteRequest.java` | Campos: `bookingId`, `content` (texto privado), `mood` (opcional), `followUpRequired` (boolean). Solo accesible por el asesor. |
| `CancelBookingRequest.java` | Campos: `reason` (@NotBlank). Política: cancelación gratuita hasta 24h antes, después cobra penalización. |

### modules/counseling/dto/response/

| Archivo | Descripción |
|---------|-------------|
| `BookingResponse.java` | Campos: `id`, `counselor` (nombre, foto), `date`, `time`, `duration`, `status`, `videoPlatform`, `meetingLink` (solo si CONFIRMED y ±15min del horario), `price`, `paidAt`. |
| `ScheduleResponse.java` | Campos: `counselorId`, `availability[]` (horarios por día), `blockedDates[]`, `timezone`. |
| `AvailabilityResponse.java` | Campos: `date`, `slots[]` ({id, startTime, endTime, available}). Slots libres para un día específico. |
| `CounselorResponse.java` | Campos: `id`, `name`, `photo`, `bio`, `specialties[]`, `experience`, `rating`, `sessionsCompleted`, `price`, `availableNextDate`. |
| `SessionNoteResponse.java` | Campos: `id`, `bookingId`, `content`, `mood`, `followUpRequired`, `createdAt`. Solo visible para el asesor. |

### modules/counseling/entity/

| Archivo | Descripción |
|---------|-------------|
| `CounselingSession.java` | Entidad. Campos: `id`, `booking` (OneToOne), `startedAt`, `endedAt`, `duration`, `recording Url` (si aplica), `notes` (OneToMany). Sesión efectivamente realizada. |
| `Booking.java` | Entidad. Campos: `id`, `user` (ManyToOne), `counselor` (ManyToOne), `date`, `timeSlot` (Embedded), `status`, `sessionType`, `videoPlatform`, `meetingLink`, `meetingPassword`, `price`, `paymentId`, `notes`, `cancelReason`, `cancelledAt`, `reminderSent`. |
| `Schedule.java` | Entidad. Campos: `id`, `counselor` (ManyToOne), `dayOfWeek`, `startTime`, `endTime`, `slotDuration` (minutos), `active`. Disponibilidad recurrente semanal. |
| `Counselor.java` | Entidad. Campos: `id`, `user` (OneToOne), `bio`, `specialties` (JSON array), `experience` (años), `certifications`, `price`, `currency`, `active`, `rating`, `totalSessions`. |
| `SessionNote.java` | Entidad. Campos: `id`, `booking` (ManyToOne), `counselor` (ManyToOne), `content`, `mood`, `followUpRequired`, `createdAt`. Notas privadas y confidenciales. |
| `TimeSlot.java` | Embeddable. Campos: `startTime` (LocalTime), `endTime` (LocalTime). Representación de un bloque horario. |

### modules/counseling/entity/enums/

| Archivo | Descripción |
|---------|-------------|
| `BookingStatus.java` | Enum: `PENDING_PAYMENT`, `CONFIRMED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`, `NO_SHOW`. |
| `SessionType.java` | Enum: `INDIVIDUAL`, `COUPLE`, `FAMILY`, `GROUP`. Tipos de asesoría. |
| `VideoPlatform.java` | Enum: `ZOOM`, `GOOGLE_MEET`, `JITSI`. Plataforma para la videollamada. |

### modules/counseling/mapper/

| Archivo | Descripción |
|---------|-------------|
| `BookingMapper.java` | Convierte `Booking` ↔ `BookingResponse`. Oculta meetingLink si no está dentro de la ventana de tiempo. Incluye info resumida del asesor. |
| `ScheduleMapper.java` | Convierte `Schedule[]` → `ScheduleResponse`. Agrupa por día de semana. |
| `CounselorMapper.java` | Convierte `Counselor` ↔ `CounselorResponse`. Incluye próxima fecha disponible calculada. |

### modules/counseling/exception/

| Archivo | Descripción |
|---------|-------------|
| `BookingNotFoundException.java` | Reserva no encontrada. HTTP 404. |
| `SlotUnavailableException.java` | El horario seleccionado ya no está disponible (tomado por otro usuario). HTTP 409. |
| `BookingConflictException.java` | Conflicto de horarios (asesor ya tiene reserva en ese bloque). HTTP 409. |

### modules/counseling/scheduler/

| Archivo | Descripción |
|---------|-------------|
| `ReminderScheduler.java` | `@Scheduled(cron)`. Cada 15 minutos revisa bookings confirmados próximos. Envía recordatorio 24h antes (email) y 1h antes (push). Marca `reminderSent=true`. También detecta no-shows (pasaron 15min del inicio sin conectar). |

---

## 11. MÓDULO COURSE (Cursos, Lecciones, Inscripciones, Progreso)

### modules/course/controller/

| Archivo | Descripción |
|---------|-------------|
| `CourseController.java` | `/api/v1/courses`. Endpoints públicos: `GET /` (listado paginado con filtros: nivel, categoría, precio), `GET /{slug}` (detalle con curriculum), `GET /featured`, `GET /popular`. Endpoints auth: `POST /{id}/enroll` (inscribirse), `GET /my-courses` (mis cursos). |
| `LessonController.java` | `/api/v1/courses/{courseId}/lessons`. Endpoints auth: `GET /{id}` (ver lección, requiere inscripción), `POST /{id}/complete` (marcar completada), `GET /{id}/progress` (progreso del usuario). Verifica acceso: inscripción activa o compra. |
| `AdminCourseController.java` | `/api/v1/admin/courses`. CRUD completo: crear/editar/eliminar cursos, módulos, lecciones. Subir videos, reordenar contenido, ver inscripciones, gestionar certificados. Requiere ADMIN/EDITOR. |

### modules/course/service/

| Archivo | Descripción |
|---------|-------------|
| `CourseService.java` | Interfaz: `findAll(filter, pageable)`, `findBySlug()`, `create()`, `update()`, `delete()`, `publish()`, `findFeatured()`, `findByInstructor()`. |
| `LessonService.java` | Interfaz: `findByCourse()`, `findById()`, `create()`, `update()`, `delete()`, `reorder()`, `uploadVideo()`. Gestión de contenido de cada lección. |
| `EnrollmentService.java` | Interfaz: `enroll()`, `unenroll()`, `findByUser()`, `findByCourse()`, `isEnrolled()`, `completeLesson()`, `getCourseProgress()`, `generateCertificate()`. Inscripciones y seguimiento de progreso. |

### modules/course/service/impl/

| Archivo | Descripción |
|---------|-------------|
| `CourseServiceImpl.java` | Implementación. CRUD con slug. Agrupa lecciones en módulos. Calcula duración total, cuenta lecciones. Publica/despublica con validación (mínimo 1 módulo con 1 lección). Caché de featured. |
| `LessonServiceImpl.java` | Implementación. Sube video a MinIO/S3. Extrae duración. Genera thumbnail. Reordena con drag & drop (campo `order`). Soporta tipos: VIDEO, TEXT, QUIZ, DOWNLOAD. |
| `EnrollmentServiceImpl.java` | Implementación. Verifica pago antes de inscribir (cursos de pago). Crea registro de enrollment. Marca lecciones completadas. Calcula % progreso. Genera certificado PDF al completar 100%. Envía email de felicitación. |

### modules/course/repository/

| Archivo | Descripción |
|---------|-------------|
| `CourseRepository.java` | Queries: `findBySlug()`, `findAllPublished(pageable)`, `findByInstructorId()`, `findFeatured()`, `countEnrollmentsByCourseId()`. |
| `LessonRepository.java` | Queries: `findByCourseIdOrderByModuleOrderAscLessonOrder()`, `findById()`, `countByCourseId()`, `sumDurationByCourseId()`. |
| `EnrollmentRepository.java` | Queries: `findByUserId(pageable)`, `findByUserIdAndCourseId()`, `existsByUserIdAndCourseId()`, `countByCourseId()`, `findCompletedByUserId()`. |
| `ProgressRepository.java` | Queries: `findByEnrollmentId()`, `findByEnrollmentIdAndLessonId()`, `countCompletedByEnrollmentId()`. |

### modules/course/dto/request/

| Archivo | Descripción |
|---------|-------------|
| `CreateCourseRequest.java` | Campos: `title`, `description`, `coverImage`, `price` (0 para gratuito), `level` (BEGINNER/INTERMEDIATE/ADVANCED), `categoryId`, `tags[]`, `prerequisites`, `objectives[]`, `instructor`. |
| `CreateLessonRequest.java` | Campos: `title`, `moduleId`, `type` (VIDEO/TEXT/QUIZ/DOWNLOAD), `content` (texto o URL), `videoFile` (MultipartFile), `duration`, `order`, `freePreview` (boolean). |
| `EnrollRequest.java` | Campos: `courseId`, `paymentMethod` (si curso de pago). Valida que usuario no esté ya inscrito. |

### modules/course/dto/response/

| Archivo | Descripción |
|---------|-------------|
| `CourseResponse.java` | Campos: `id`, `title`, `slug`, `coverImage`, `price`, `level`, `instructor`, `duration`, `lessonsCount`, `enrolledCount`, `rating`, `description`, `objectives[]`. |
| `LessonResponse.java` | Campos: `id`, `title`, `type`, `duration`, `order`, `freePreview`, `completed` (para usuario actual), `videoUrl` (solo si tiene acceso), `content`. |
| `EnrollmentResponse.java` | Campos: `id`, `course` (resumido), `enrolledAt`, `progress` (%), `completedLessons`, `totalLessons`, `certificateUrl` (si completado), `lastAccessedAt`. |
| `ProgressResponse.java` | Campos: `courseId`, `progress` (%), `completedLessons[]`, `currentLesson`, `totalDuration`, `timeSpent`. |

### modules/course/entity/

| Archivo | Descripción |
|---------|-------------|
| `CourseEntity.java` | Entidad. Campos: `id`, `title`, `slug`, `description`, `coverImage`, `price`, `level`, `instructor` (ManyToOne User), `category`, `tags`, `modules` (OneToMany), `prerequisites`, `objectives` (JSON), `status`, `enrolledCount`, `rating`, `duration`, `published`, `publishedAt`. |
| `Lesson.java` | Entidad. Campos: `id`, `module` (ManyToOne), `title`, `type`, `content`, `videoUrl`, `duration`, `order`, `freePreview`. |
| `Module.java` | Entidad. Campos: `id`, `course` (ManyToOne), `title`, `order`, `lessons` (OneToMany). Agrupación lógica de lecciones. |
| `Enrollment.java` | Entidad. Campos: `id`, `user` (ManyToOne), `course` (ManyToOne), `enrolledAt`, `completedAt`, `progress`, `certificateUrl`, `status`, `lastAccessedAt`. |
| `Progress.java` | Entidad. Campos: `id`, `enrollment` (ManyToOne), `lesson` (ManyToOne), `completed`, `completedAt`, `timeSpent`. Tracking por lección. |

### modules/course/entity/enums/

| Archivo | Descripción |
|---------|-------------|
| `CourseLevel.java` | Enum: `BEGINNER`, `INTERMEDIATE`, `ADVANCED`, `ALL_LEVELS`. Nivel de dificultad. |
| `EnrollmentStatus.java` | Enum: `ACTIVE`, `COMPLETED`, `CANCELLED`, `EXPIRED`. Estado de la inscripción. |

### modules/course/mapper/

| Archivo | Descripción |
|---------|-------------|
| `CourseMapper.java` | Convierte `CourseEntity` ↔ `CourseResponse`. Calcula duración total, cuenta inscripciones. |
| `LessonMapper.java` | Convierte `Lesson` ↔ `LessonResponse`. Oculta videoUrl si usuario no tiene acceso. Incluye estado de completado para usuario actual. |

---

## 12. MÓDULO SUBSCRIPTION (Suscripciones y Planes)

### modules/subscription/controller/

| Archivo | Descripción |
|---------|-------------|
| `SubscriptionController.java` | `/api/v1/subscriptions`. Endpoints: `GET /plans` (planes disponibles), `POST /subscribe` (suscribirse a plan), `GET /my-subscription` (suscripción activa), `POST /cancel` (cancelar), `POST /change-plan` (cambiar plan), `POST /renew` (renovar manualmente). |
| `AdminSubscriptionController.java` | `/api/v1/admin/subscriptions`. Endpoints: `GET /` (todas las suscripciones), `GET /stats` (métricas: MRR, churn, LTV), `PUT /plans/{id}` (editar plan), `POST /plans` (crear plan), `POST /{id}/cancel` (cancelar suscripción de usuario). |

### modules/subscription/service/

| Archivo | Descripción |
|---------|-------------|
| `SubscriptionService.java` | Interfaz: `subscribe()`, `cancel()`, `changePlan()`, `renew()`, `getActiveSubscription()`, `checkAccess()`, `processRenewal()`, `handleExpired()`. Gestión del ciclo de vida de suscripciones. |
| `PlanService.java` | Interfaz: `findAll()`, `findById()`, `create()`, `update()`, `deactivate()`, `compare()`. CRUD de planes de suscripción. |

### modules/subscription/service/impl/

| Archivo | Descripción |
|---------|-------------|
| `SubscriptionServiceImpl.java` | Implementación. Flujo: selecciona plan → procesa pago recurrente → activa suscripción → programa renovación. @Scheduled revisa expiradas y renueva automáticamente o suspende si falla pago. Calcula prorrateo al cambiar plan. |
| `PlanServiceImpl.java` | Implementación. CRUD de planes. Validación: no eliminar plan con suscriptores activos, solo desactivar. Comparación de features entre planes. |

### modules/subscription/repository/

| Archivo | Descripción |
|---------|-------------|
| `SubscriptionRepository.java` | Queries: `findActiveByUserId()`, `findByStatus()`, `findExpiringSoon(days)`, `countByPlanId()`, `findByRenewalDateBefore()`, `sumMonthlyRevenue()`. |
| `PlanRepository.java` | Queries: `findAllActive()`, `findByCode()`, `findById()`. |

### modules/subscription/dto/request/

| Archivo | Descripción |
|---------|-------------|
| `CreateSubscriptionRequest.java` | Campos: `planId`, `paymentMethod`, `autoRenew` (boolean). |
| `CancelSubscriptionRequest.java` | Campos: `reason` (enum: TOO_EXPENSIVE, NOT_USING, FOUND_ALTERNATIVE, OTHER), `feedback` (texto libre). Cancela al final del período actual. |
| `CreatePlanRequest.java` | Campos: `name`, `code`, `description`, `price`, `currency`, `billingCycle` (MONTHLY/QUARTERLY/YEARLY), `features[]`, `limits` (JSON), `trialDays`. |

### modules/subscription/dto/response/

| Archivo | Descripción |
|---------|-------------|
| `SubscriptionResponse.java` | Campos: `id`, `plan` (PlanResponse), `status`, `startDate`, `endDate`, `nextRenewalDate`, `autoRenew`, `daysRemaining`, `cancelledAt`, `cancelReason`. |
| `PlanResponse.java` | Campos: `id`, `name`, `code`, `description`, `price`, `currency`, `billingCycle`, `features[]`, `popular` (boolean), `trialDays`, `savings` (vs mensual). |

### modules/subscription/entity/

| Archivo | Descripción |
|---------|-------------|
| `Subscription.java` | Entidad. Campos: `id`, `user` (ManyToOne), `plan` (ManyToOne), `status`, `startDate`, `endDate`, `nextRenewalDate`, `autoRenew`, `paymentMethod`, `cancelledAt`, `cancelReason`, `trialEndsAt`. |
| `Plan.java` | Entidad. Campos: `id`, `name`, `code` (unique), `description`, `price`, `currency`, `billingCycle`, `features` (JSON array), `limits` (JSON), `trialDays`, `active`, `popular`, `order`. |

### modules/subscription/entity/enums/

| Archivo | Descripción |
|---------|-------------|
| `SubscriptionStatus.java` | Enum: `TRIALING`, `ACTIVE`, `PAST_DUE`, `CANCELLED`, `EXPIRED`, `SUSPENDED`. |
| `PlanType.java` | Enum: `FREE`, `BASIC`, `PREMIUM`, `ENTERPRISE`. Niveles de plan. |

### modules/subscription/mapper/

| Archivo | Descripción |
|---------|-------------|
| `SubscriptionMapper.java` | Convierte `Subscription` ↔ `SubscriptionResponse`. Calcula daysRemaining, incluye plan completo. |
| `PlanMapper.java` | Convierte `Plan` ↔ `PlanResponse`. Calcula savings comparando con precio mensual equivalente. |

### modules/subscription/exception/

| Archivo | Descripción |
|---------|-------------|
| `SubscriptionNotFoundException.java` | No tiene suscripción activa. HTTP 404. |
| `PlanNotFoundException.java` | Plan no encontrado o inactivo. HTTP 404. |

---

## 13. MÓDULO NOTIFICATION (Email, Push, Web)

### modules/notification/controller/

| Archivo | Descripción |
|---------|-------------|
| `NotificationController.java` | `/api/v1/notifications`. Endpoints: `GET /` (mis notificaciones paginadas), `GET /unread-count` (contador badge), `PUT /{id}/read` (marcar leída), `PUT /read-all` (marcar todas leídas), `DELETE /{id}` (eliminar), `GET /preferences` (preferencias), `PUT /preferences` (actualizar preferencias de notificación). |

### modules/notification/service/

| Archivo | Descripción |
|---------|-------------|
| `NotificationService.java` | Interfaz: `send()`, `sendBulk()`, `findByUser(pageable)`, `markAsRead()`, `markAllAsRead()`, `delete()`, `getUnreadCount()`, `getPreferences()`, `updatePreferences()`. Orquestador principal. |
| `EmailNotificationService.java` | Interfaz: `sendEmail(to, template, variables)`, `sendBulkEmail()`, `validateEmail()`. Envío de emails con templates. |
| `PushNotificationService.java` | Interfaz: `sendPush(userId, title, body, data)`, `sendToTopic()`, `registerDevice()`, `unregisterDevice()`. Push notifications via Firebase Cloud Messaging. |
| `WebNotificationService.java` | Interfaz: `sendWebNotification(userId, notification)`, `broadcastToRole()`. Notificaciones en tiempo real vía WebSocket/SSE. |

### modules/notification/service/impl/

| Archivo | Descripción |
|---------|-------------|
| `NotificationServiceImpl.java` | Implementación. Resuelve canal(es) según preferencias del usuario y tipo de notificación. Persiste en BD. Envía por canales habilitados (email + push + web). Respeta Do Not Disturb. |
| `EmailNotificationServiceImpl.java` | Implementación. Usa `JavaMailSender` + Thymeleaf templates. Renderiza HTML con variables, envía async. Reintentos con @Retryable en caso de fallo SMTP. Cola de envío para bulk. |
| `PushNotificationServiceImpl.java` | Implementación. Usa Firebase Admin SDK. Envía a dispositivos registrados del usuario. Maneja tokens expirados (limpia automáticamente). Soporta data payload + notification payload. |
| `WebNotificationServiceImpl.java` | Implementación. Envía via WebSocket (STOMP) a sesiones activas del usuario. Si no está conectado, queda persistida para cuando se conecte. Usa Server-Sent Events como fallback. |

### modules/notification/service/provider/

| Archivo | Descripción |
|---------|-------------|
| `FirebaseProvider.java` | Wrapper sobre `FirebaseMessaging`. Métodos: `sendToDevice(token, message)`, `sendToTopic(topic, message)`, `subscribeToTopic()`. Manejo de errores específicos de FCM. |
| `SmtpProvider.java` | Wrapper sobre `JavaMailSender`. Configura conexión, maneja reintentos, loguea entregas/rechazos. Soporta attachments y HTML. |

### modules/notification/repository/

| Archivo | Descripción |
|---------|-------------|
| `NotificationRepository.java` | Queries: `findByUserIdOrderByCreatedAtDesc(pageable)`, `findUnreadByUserId()`, `countUnreadByUserId()`, `markAsReadByUserId()`, `deleteOlderThan(days)`. |
| `NotificationTemplateRepository.java` | Queries: `findByCode()`, `findByType()`. Templates predefinidos para cada tipo de notificación. |

### modules/notification/dto/request/

| Archivo | Descripción |
|---------|-------------|
| `SendNotificationRequest.java` | Campos: `userId` (o `userIds[]` para bulk), `type`, `channel` (EMAIL/PUSH/WEB/ALL), `title`, `body`, `data` (JSON metadata), `templateCode` (opcional). |

### modules/notification/dto/response/

| Archivo | Descripción |
|---------|-------------|
| `NotificationResponse.java` | Campos: `id`, `type`, `title`, `body`, `data` (metadata para link/acción), `read`, `createdAt`, `channel`. |

### modules/notification/entity/

| Archivo | Descripción |
|---------|-------------|
| `Notification.java` | Entidad. Campos: `id`, `user` (ManyToOne), `type`, `channel`, `title`, `body`, `data` (JSON), `read`, `readAt`, `createdAt`, `expiresAt`. |
| `NotificationTemplate.java` | Entidad. Campos: `id`, `code` (unique, ej: "ORDER_CONFIRMED"), `type`, `subject` (para email), `body` (template con placeholders), `channels[]`, `active`. |

### modules/notification/entity/enums/

| Archivo | Descripción |
|---------|-------------|
| `NotificationType.java` | Enum: `ORDER_CONFIRMED`, `ORDER_SHIPPED`, `ORDER_DELIVERED`, `PAYMENT_RECEIVED`, `BOOKING_CONFIRMED`, `BOOKING_REMINDER`, `NEW_EPISODE`, `PROMOTION`, `SYSTEM`, `CHAT_MESSAGE`. |
| `NotificationChannel.java` | Enum: `EMAIL`, `PUSH`, `WEB`, `SMS`. Canales de entrega. |
| `NotificationStatus.java` | Enum: `PENDING`, `SENT`, `DELIVERED`, `FAILED`, `READ`. Estado de entrega. |

### modules/notification/mapper/

| Archivo | Descripción |
|---------|-------------|
| `NotificationMapper.java` | Convierte `Notification` ↔ `NotificationResponse`. Formatea fechas relativas ("hace 5 min"). |

### modules/notification/template/

| Archivo | Descripción |
|---------|-------------|
| `OrderConfirmationTemplate.java` | Define estructura del email de confirmación de orden: número, items, total, dirección de envío, estimación de entrega. |
| `PasswordResetTemplate.java` | Template de email de reset: link con token, expiración, instrucciones de seguridad. |
| `WelcomeTemplate.java` | Email de bienvenida tras registro: saludo personalizado, próximos pasos, links útiles. |
| `InvoiceTemplate.java` | Template de factura por email: datos fiscales, detalle de items, totales, PDF adjunto. |

---

## 14. MÓDULO SEARCH (ElasticSearch, Autocompletado, Filtros)

### modules/search/controller/

| Archivo | Descripción |
|---------|-------------|
| `SearchController.java` | `/api/v1/search`. Endpoints: `GET /` (búsqueda global con query, filtros, paginación), `GET /autocomplete` (sugerencias mientras escribe, máx 10 resultados), `GET /products` (búsqueda enfocada en productos), `GET /blog` (búsqueda en blog), `GET /filters` (facets disponibles según contexto). |

### modules/search/service/

| Archivo | Descripción |
|---------|-------------|
| `SearchService.java` | Interfaz: `search(query, filters, pageable)`, `searchProducts()`, `searchBlog()`, `reindex()`, `reindexAll()`. Búsqueda multi-índice con relevancia. |
| `AutocompleteService.java` | Interfaz: `suggest(query, limit)`, `suggestProducts()`, `suggestCategories()`, `suggestAuthors()`. Sugerencias de búsqueda en tiempo real con tolerancia a typos. |

### modules/search/service/impl/

| Archivo | Descripción |
|---------|-------------|
| `SearchServiceImpl.java` | Implementación. Usa ElasticSearch RestHighLevelClient. Multi-match query con boosting (título ×3, descripción ×1). Filtros como aggregations. Highlight en resultados. Fuzzy matching para tolerancia a errores. Soporte multi-idioma con analyzers. |
| `AutocompleteServiceImpl.java` | Implementación. Usa completion suggester de ES. Prefix matching + fuzzy. Edge n-grams para resultados instantáneos. Combina resultados de múltiples índices con prioridad. Debounce desde frontend (300ms). |

### modules/search/repository/

| Archivo | Descripción |
|---------|-------------|
| `ProductSearchRepository.java` | `ElasticsearchRepository<ProductDocument, String>`. Queries custom con `@Query` para búsquedas complejas. |
| `BlogSearchRepository.java` | `ElasticsearchRepository<BlogDocument, String>`. Búsqueda full-text en posts del blog. |

### modules/search/dto/request/

| Archivo | Descripción |
|---------|-------------|
| `SearchRequest.java` | Campos: `query` (texto libre), `type` (PRODUCT/BLOG/ALL), `category`, `priceMin`, `priceMax`, `author`, `tags[]`, `sortBy` (RELEVANCE/PRICE/DATE/POPULARITY), `page`, `size`. |

### modules/search/dto/response/

| Archivo | Descripción |
|---------|-------------|
| `SearchResponse.java` | Campos: `results[]` (items con highlight), `totalHits`, `facets` (conteos por categoría, autor, rango de precio), `suggestions[]` (sugerencias de corrección "¿Quisiste decir...?"), `took` (ms). |
| `AutocompleteResponse.java` | Campos: `suggestions[]` ({text, type, slug, image}). Máximo 10 resultados combinando productos, categorías, autores. |

### modules/search/document/

| Archivo | Descripción |
|---------|-------------|
| `ProductDocument.java` | Documento ES `@Document(indexName = "products")`. Campos: `id`, `title`, `description`, `category`, `author`, `publisher`, `tags`, `price`, `rating`, `type`, `coverImage`, `slug`, `inStock`, `createdAt`. Analyzers: spanish + standard. |
| `BlogDocument.java` | Documento ES `@Document(indexName = "blog_posts")`. Campos: `id`, `title`, `content` (text plano, sin HTML), `excerpt`, `author`, `category`, `tags`, `slug`, `publishedAt`. |

### modules/search/indexer/

| Archivo | Descripción |
|---------|-------------|
| `ProductIndexer.java` | Servicio que sincroniza productos de PostgreSQL → ElasticSearch. Escucha eventos de creación/actualización/eliminación de productos. Reindex completo por cron (nocturno). Batch processing. |
| `BlogIndexer.java` | Sincroniza posts publicados → ES. Escucha eventos de publicación/actualización. Extrae texto plano del HTML. Reindex bajo demanda. |

---

## 15. MÓDULO MEDIA (Subida, Almacenamiento, Procesamiento de Archivos)

### modules/media/controller/

| Archivo | Descripción |
|---------|-------------|
| `MediaController.java` | `/api/v1/media`. Endpoints: `POST /upload` (subir archivo, multipart), `POST /upload/multiple` (batch), `GET /{id}` (metadata), `GET /{id}/download` (descarga con URL firmada), `DELETE /{id}` (eliminar), `GET /` (listar archivos del usuario/admin). Límites: 10MB imágenes, 500MB audio/video, 50MB PDF. |

### modules/media/service/

| Archivo | Descripción |
|---------|-------------|
| `MediaService.java` | Interfaz: `upload()`, `uploadMultiple()`, `getById()`, `delete()`, `getDownloadUrl()`, `findByUser()`. Orquesta subida + procesamiento + almacenamiento. |
| `ImageProcessingService.java` | Interfaz: `resize()`, `compress()`, `generateThumbnail()`, `convertFormat()`, `optimizeForWeb()`. Procesamiento de imágenes post-subida. |
| `StorageService.java` | Interfaz abstracta: `store(file, path)`, `delete(path)`, `getUrl(path)`, `getSignedUrl(path, expiration)`, `exists(path)`. Abstracción sobre MinIO/S3. |

### modules/media/service/impl/

| Archivo | Descripción |
|---------|-------------|
| `MediaServiceImpl.java` | Implementación. Valida tipo/tamaño → genera nombre único → procesa (si imagen: thumbnail + compresión) → almacena vía StorageService → persiste metadata en BD. Async para archivos grandes. |
| `ImageProcessingServiceImpl.java` | Implementación con Thumbnailator/ImageIO. Genera thumbnails (150×150, 300×300, 600×600). Comprime JPEG quality 80%. Convierte a WebP para web. Strip metadata EXIF. |
| `MinioStorageServiceImpl.java` | Implementación de StorageService para MinIO. Usa MinioClient SDK. Organiza en buckets por tipo (images/, audio/, video/, documents/). URLs firmadas con expiración configurable. |
| `S3StorageServiceImpl.java` | Implementación de StorageService para AWS S3. Usa AWS SDK v2. Mismo contrato que MinIO (compatibilidad S3). Configuración por feature flag para switch entre MinIO (dev) y S3 (prod). |

### modules/media/repository/

| Archivo | Descripción |
|---------|-------------|
| `MediaFileRepository.java` | Queries: `findByUserId(pageable)`, `findByType()`, `findByEntityIdAndEntityType()`, `sumSizeByUserId()` (cuota de almacenamiento), `deleteByPath()`. |

### modules/media/dto/

| Archivo | Descripción |
|---------|-------------|
| `UploadMediaRequest.java` | Campos: `file` (MultipartFile), `entityType` (PRODUCT/PODCAST/BLOG/PROFILE), `entityId` (UUID, opcional), `alt` (texto alternativo). Validación de tipo MIME y tamaño. |
| `MediaResponse.java` | Campos: `id`, `filename`, `originalName`, `url`, `thumbnailUrl`, `type`, `size`, `mimeType`, `width`, `height` (si imagen), `duration` (si audio/video), `createdAt`. |
| `UploadResponse.java` | Campos: `id`, `url`, `thumbnailUrl`, `filename`, `size`. Respuesta inmediata tras subida exitosa. |

### modules/media/entity/

| Archivo | Descripción |
|---------|-------------|
| `MediaFile.java` | Entidad. Campos: `id`, `filename`, `originalName`, `path`, `url`, `thumbnailPath`, `thumbnailUrl`, `type`, `mimeType`, `size`, `width`, `height`, `duration`, `alt`, `entityType`, `entityId`, `uploadedBy` (ManyToOne), `storageProvider`, `createdAt`. |
| `MediaType.java` (enum) | Enum: `IMAGE`, `VIDEO`, `AUDIO`, `DOCUMENT`, `OTHER`. Clasificación del archivo. |
| `StorageProvider.java` (enum) | Enum: `MINIO`, `AWS_S3`, `LOCAL`. Proveedor de almacenamiento usado. |

### modules/media/mapper/

| Archivo | Descripción |
|---------|-------------|
| `MediaMapper.java` | Convierte `MediaFile` ↔ `MediaResponse`. Genera URLs completas con base URL del storage. |

### modules/media/exception/

| Archivo | Descripción |
|---------|-------------|
| `MediaNotFoundException.java` | Archivo no encontrado. HTTP 404. |
| `FileUploadException.java` | Error durante la subida (IO error, timeout). HTTP 500. |
| `UnsupportedMediaTypeException.java` | Tipo de archivo no permitido. HTTP 415. Lista tipos aceptados. |

### modules/media/processor/

| Archivo | Descripción |
|---------|-------------|
| `ImageProcessor.java` | Interfaz para procesamiento de imágenes: `process(inputStream, options)` → `ProcessedImage`. |
| `ThumbnailGenerator.java` | Genera thumbnails en múltiples tamaños. Crop inteligente (center crop). Mantiene aspect ratio. Output: JPEG/WebP. |
| `ImageCompressor.java` | Comprime imágenes sin pérdida significativa de calidad. Target: <200KB para web. Ajusta quality hasta alcanzar target. |

---

## 16. MÓDULO CHAT (Chat en Línea y Sistema de Tickets)

### modules/chat/controller/

| Archivo | Descripción |
|---------|-------------|
| `ChatController.java` | `/api/v1/chat`. Endpoints: `GET /rooms` (mis salas), `POST /rooms` (iniciar chat con soporte), `GET /rooms/{id}/messages` (historial paginado), `POST /rooms/{id}/messages` (enviar vía REST, alternativa a WebSocket), `PUT /rooms/{id}/close` (cerrar chat). WebSocket endpoint: `/ws/chat`. |
| `TicketController.java` | `/api/v1/tickets`. Endpoints: `POST /` (crear ticket), `GET /` (mis tickets), `GET /{id}` (detalle con mensajes), `POST /{id}/messages` (agregar mensaje), `PUT /{id}/close` (cerrar). Admin: `GET /all` (todos), `PUT /{id}/assign` (asignar agente), `PUT /{id}/status`. |

### modules/chat/service/

| Archivo | Descripción |
|---------|-------------|
| `ChatService.java` | Interfaz: `createRoom()`, `sendMessage()`, `getMessages(pageable)`, `getRooms()`, `closeRoom()`, `markAsRead()`. Chat en tiempo real vía WebSocket. |
| `TicketService.java` | Interfaz: `create()`, `addMessage()`, `findByUser()`, `findAll(filter)`, `assignAgent()`, `updateStatus()`, `close()`, `getPriority()`. Sistema de soporte con prioridades. |

### modules/chat/service/impl/

| Archivo | Descripción |
|---------|-------------|
| `ChatServiceImpl.java` | Implementación. Crea sala entre usuario y agente de soporte. Envía mensajes vía WebSocket STOMP (canal `/topic/chat/{roomId}`). Persiste mensajes en BD. Notifica si el otro usuario no está conectado. Typing indicators. |
| `TicketServiceImpl.java` | Implementación. Crea ticket con número correlativo. Asignación automática round-robin o manual. Escalamiento por tiempo sin respuesta. SLA tracking. Cierre automático tras 72h de inactividad. |

### modules/chat/repository/

| Archivo | Descripción |
|---------|-------------|
| `ChatMessageRepository.java` | Queries: `findByRoomIdOrderByCreatedAtDesc(pageable)`, `countUnreadByRoomIdAndUserId()`, `markAsReadByRoomIdAndUserId()`. |
| `ChatRoomRepository.java` | Queries: `findByParticipantId(pageable)`, `findByIdAndParticipantId()`, `findOpenByUserId()`. |
| `TicketRepository.java` | Queries: `findByUserId(pageable)`, `findByStatus()`, `findByAssignedAgentId()`, `findOverdueSLA()`, `getNextTicketNumber()`. |

### modules/chat/dto/

| Archivo | Descripción |
|---------|-------------|
| `SendMessageRequest.java` | Campos: `content` (@NotBlank @Size max=5000), `attachmentId` (UUID, opcional). |
| `CreateTicketRequest.java` | Campos: `subject`, `description`, `category` (GENERAL/PAYMENT/SHIPPING/TECHNICAL), `priority` (LOW/MEDIUM/HIGH). |
| `ChatMessageResponse.java` | Campos: `id`, `content`, `sender` (name, avatar), `createdAt`, `read`, `attachment` (url si existe). |
| `ChatRoomResponse.java` | Campos: `id`, `participant` (otro usuario), `lastMessage`, `unreadCount`, `createdAt`, `status`. |
| `TicketResponse.java` | Campos: `id`, `number`, `subject`, `status`, `priority`, `category`, `assignedAgent`, `messages[]`, `createdAt`, `lastActivity`. |

### modules/chat/entity/

| Archivo | Descripción |
|---------|-------------|
| `ChatMessage.java` | Entidad. Campos: `id`, `room` (ManyToOne), `sender` (ManyToOne User), `content`, `attachment` (ManyToOne MediaFile), `read`, `readAt`, `createdAt`. |
| `ChatRoom.java` | Entidad. Campos: `id`, `participants` (ManyToMany User), `status` (OPEN/CLOSED), `createdAt`, `closedAt`, `lastMessageAt`. |
| `Ticket.java` | Entidad. Campos: `id`, `number` (correlativo), `user` (ManyToOne), `assignedAgent` (ManyToOne), `subject`, `description`, `status`, `priority`, `category`, `messages` (OneToMany), `createdAt`, `closedAt`, `slaDeadline`. |
| `TicketStatus.java` (enum) | Enum: `OPEN`, `IN_PROGRESS`, `WAITING_USER`, `WAITING_AGENT`, `RESOLVED`, `CLOSED`. |
| `TicketPriority.java` (enum) | Enum: `LOW`, `MEDIUM`, `HIGH`, `URGENT`. Afecta SLA y orden de atención. |

### modules/chat/mapper/

| Archivo | Descripción |
|---------|-------------|
| `ChatMapper.java` | Convierte entidades de chat a DTOs de respuesta. Incluye info de participantes. |
| `TicketMapper.java` | Convierte `Ticket` ↔ `TicketResponse`. Incluye mensajes y tiempo desde última actividad. |

---

## 17. MÓDULO ANALYTICS (Dashboard, Reportes, KPIs, Exportación)

### modules/analytics/controller/

| Archivo | Descripción |
|---------|-------------|
| `AnalyticsController.java` | `/api/v1/admin/analytics`. Endpoints: `GET /events` (eventos registrados), `POST /track` (registrar evento desde frontend). Requiere ADMIN para lectura. |
| `ReportController.java` | `/api/v1/admin/reports`. Endpoints: `GET /sales` (reporte ventas), `GET /users` (reporte usuarios), `GET /products` (reporte productos), `POST /generate` (generar reporte custom), `GET /export/{id}` (descargar Excel/PDF). |
| `DashboardController.java` | `/api/v1/admin/dashboard`. Endpoints: `GET /summary` (KPIs principales), `GET /sales-chart` (datos gráfica ventas), `GET /recent-orders` (últimos pedidos), `GET /top-products`, `GET /revenue` (ingresos por período). |

### modules/analytics/service/

| Archivo | Descripción |
|---------|-------------|
| `AnalyticsService.java` | Interfaz: `trackEvent()`, `getEvents(filter)`, `getPageViews()`, `getConversions()`. Registro y consulta de eventos de usuario. |
| `ReportService.java` | Interfaz: `generateSalesReport(dateRange)`, `generateUserReport()`, `generateProductReport()`, `exportToExcel()`, `exportToPdf()`, `scheduleReport()`. |
| `DashboardService.java` | Interfaz: `getSummary(period)`, `getSalesChart(period, granularity)`, `getRecentOrders(limit)`, `getTopProducts(limit)`, `getRevenue(period)`. Datos para el dashboard admin. |
| `KpiService.java` | Interfaz: `calculateKpis(period)`. KPIs: revenue, orders count, average order value, conversion rate, new users, returning users, cart abandonment rate, top categories. |

### modules/analytics/service/impl/

| Archivo | Descripción |
|---------|-------------|
| `AnalyticsServiceImpl.java` | Implementación. Registra eventos en BD (product_view, add_to_cart, purchase, page_view). Agrega datos para consulta rápida. Usa Redis para contadores en tiempo real. |
| `ReportServiceImpl.java` | Implementación. Queries complejas con aggregaciones. Genera reportes async (pueden tardar). Almacena resultado en MinIO. Notifica cuando está listo. |
| `DashboardServiceImpl.java` | Implementación. Datos cacheados en Redis (TTL 5 min). Queries optimizadas con índices. Comparación con período anterior (% de cambio). |
| `KpiServiceImpl.java` | Implementación. Calcula métricas de negocio: MRR, ARPU, LTV, churn rate, NPS. Compara con período anterior. |

### modules/analytics/repository/

| Archivo | Descripción |
|---------|-------------|
| `AnalyticsEventRepository.java` | Queries: `countByTypeAndDateRange()`, `findByUserIdAndType()`, `aggregateByDay()`, `aggregateByCategory()`. |
| `ReportRepository.java` | Queries: `findByTypeAndDateRange()`, `findLatestByType()`. Reportes generados almacenados. |

### modules/analytics/exporter/

| Archivo | Descripción |
|---------|-------------|
| `ExcelExporter.java` | Genera archivos Excel (.xlsx) con Apache POI. Múltiples hojas, formatos, gráficos embebidos. Datos tabulares de reportes. |
| `PdfExporter.java` | Genera PDFs de reportes con iText/JasperReports. Logo, tablas, gráficos, resumen ejecutivo. Formato profesional para presentaciones. |

---

## 18. MÓDULO RECOMMENDATION (Motor de Recomendaciones con IA)

### modules/recommendation/controller/

| Archivo | Descripción |
|---------|-------------|
| `RecommendationController.java` | `/api/v1/recommendations`. Endpoints: `GET /for-you` (personalizadas para usuario), `GET /similar/{productId}` (productos similares), `GET /trending` (tendencias), `GET /recently-viewed` (vistos recientemente), `GET /based-on-cart` (basado en carrito actual). |

### modules/recommendation/service/

| Archivo | Descripción |
|---------|-------------|
| `RecommendationService.java` | Interfaz: `getPersonalized(userId, limit)`, `getSimilar(productId, limit)`, `getTrending(limit)`, `getBasedOnCart(cartItems)`, `getBasedOnPurchaseHistory(userId)`. |
| `BrowsingHistoryService.java` | Interfaz: `recordView(userId, productId)`, `getRecentlyViewed(userId, limit)`, `clearHistory(userId)`. Tracking de navegación. |

### modules/recommendation/service/impl/

| Archivo | Descripción |
|---------|-------------|
| `RecommendationServiceImpl.java` | Implementación. Combina resultados de múltiples engines (collaborative + content-based). Pondera por relevancia. Excluye productos ya comprados. Caché Redis (TTL 1h). |
| `BrowsingHistoryServiceImpl.java` | Implementación. Almacena en Redis (lista ordenada por timestamp, máx 100 items). Persiste en BD async para análisis. |

### modules/recommendation/engine/

| Archivo | Descripción |
|---------|-------------|
| `RecommendationEngine.java` | Interfaz: `recommend(userId, context, limit)` → `List<ProductScore>`. Contrato base para motores de recomendación. |
| `CollaborativeFilteringEngine.java` | "Usuarios que compraron X también compraron Y". Basado en co-ocurrencia de compras. Matriz usuario-producto. Similaridad coseno entre usuarios. |
| `ContentBasedEngine.java` | Basado en atributos del producto: misma categoría, mismo autor, tags similares, rango de precio cercano. TF-IDF sobre descripciones. Peso por relevancia de atributo. |

---

## 19. MÓDULO SEO (Sitemap, Robots, Meta Tags, Structured Data)

### modules/seo/controller/

| Archivo | Descripción |
|---------|-------------|
| `SitemapController.java` | `GET /sitemap.xml` (sitemap principal con índice), `GET /sitemap-products.xml`, `GET /sitemap-blog.xml`, `GET /sitemap-categories.xml`. Generación dinámica. Content-Type XML. Cache 24h. |
| `RobotsController.java` | `GET /robots.txt`. Genera robots.txt dinámico según environment (staging: Disallow all, prod: Allow con restricciones). |
| `MetaTagController.java` | `/api/v1/seo/meta`. Endpoints: `GET /product/{slug}`, `GET /post/{slug}`, `GET /category/{slug}`. Retorna meta tags OG + Twitter Cards para SSR/prerender. |

### modules/seo/service/

| Archivo | Descripción |
|---------|-------------|
| `SitemapService.java` | Interfaz: `generateSitemap()`, `generateProductSitemap()`, `generateBlogSitemap()`. Genera XML con URLs, lastmod, changefreq, priority. |
| `MetaTagService.java` | Interfaz: `getMetaForProduct()`, `getMetaForPost()`, `getMetaForCategory()`, `getMetaForPage()`. OpenGraph + Twitter Cards metadata. |
| `StructuredDataService.java` | Interfaz: `getProductSchema()`, `getArticleSchema()`, `getOrganizationSchema()`, `getBreadcrumbSchema()`. JSON-LD Schema.org para rich snippets. |

### modules/seo/dto/

| Archivo | Descripción |
|---------|-------------|
| `MetaTagDto.java` | Campos: `title`, `description`, `ogTitle`, `ogDescription`, `ogImage`, `ogType`, `twitterCard`, `twitterTitle`, `twitterDescription`, `twitterImage`, `canonical`, `robots`. |
| `StructuredDataDto.java` | Campos: `type` (Product/Article/Organization), `jsonLd` (String JSON-LD completo listo para inyectar en HTML). Schema.org markup. |

---

## 20. MÓDULO NEWSLETTER (Suscriptores y Campañas)

### modules/newsletter/controller/

| Archivo | Descripción |
|---------|-------------|
| `NewsletterController.java` | `/api/v1/newsletter`. Endpoints públicos: `POST /subscribe` (suscribirse con email), `POST /unsubscribe` (desuscribirse con token), `POST /confirm` (confirmar suscripción double opt-in). Admin: `GET /subscribers`, `POST /campaigns` (crear), `POST /campaigns/{id}/send` (enviar). |

### modules/newsletter/service/

| Archivo | Descripción |
|---------|-------------|
| `NewsletterService.java` | Interfaz: `subscribe()`, `unsubscribe()`, `confirmSubscription()`, `getSubscribers(pageable)`, `createCampaign()`, `sendCampaign()`, `getStats()`. |

### modules/newsletter/service/impl/

| Archivo | Descripción |
|---------|-------------|
| `NewsletterServiceImpl.java` | Implementación. Double opt-in: envía email de confirmación con token. Segmentación de suscriptores. Envío bulk async con rate limiting (para no ser marcado como spam). Tracking de apertura (pixel) y clicks. Estadísticas: open rate, click rate, bounce rate. |

### modules/newsletter/repository/

| Archivo | Descripción |
|---------|-------------|
| `SubscriberRepository.java` | Queries: `findByEmail()`, `findConfirmed(pageable)`, `findBySegment()`, `countByStatus()`, `existsByEmail()`. |
| `CampaignRepository.java` | Queries: `findAll(pageable)`, `findById()`, `findSent()`, `findScheduled()`. |

### modules/newsletter/entity/

| Archivo | Descripción |
|---------|-------------|
| `Subscriber.java` | Entidad. Campos: `id`, `email`, `name`, `confirmed`, `confirmToken`, `unsubscribeToken`, `segments` (JSON), `subscribedAt`, `confirmedAt`, `unsubscribedAt`. |
| `Campaign.java` | Entidad. Campos: `id`, `subject`, `content` (HTML), `status` (DRAFT/SCHEDULED/SENDING/SENT), `sentAt`, `scheduledAt`, `segment`, `recipientCount`, `openCount`, `clickCount`, `bounceCount`. |

---

## 21. MÓDULO ADMIN (Panel Administrativo, Configuración, Banners)

### modules/admin/controller/

| Archivo | Descripción |
|---------|-------------|
| `AdminDashboardController.java` | `/api/v1/admin/dashboard`. Combina datos de todos los módulos: ventas del día, pedidos pendientes, usuarios nuevos, productos con bajo stock, tickets sin resolver. Widget principal del panel admin. |
| `AdminConfigController.java` | `/api/v1/admin/config`. Endpoints: `GET /` (toda la configuración), `PUT /` (actualizar), `GET /{section}` (sección específica: general, payment, shipping, email, seo). Configuración global de la plataforma. |
| `AdminBannerController.java` | `/api/v1/admin/banners`. CRUD: crear/editar/eliminar/reordenar banners publicitarios. Campos: imagen, link, texto, posición, fechas activo, target (home/category/etc). |
| `AdminCarouselController.java` | `/api/v1/admin/carousel`. CRUD: gestionar slides del carrusel principal del homepage. Campos: imagen desktop/mobile, título, subtítulo, CTA, link, orden, activo. |
| `AdminAuditController.java` | `/api/v1/admin/audit`. Endpoints: `GET /logs` (logs de auditoría paginados con filtros: usuario, acción, fecha, módulo), `GET /logs/{id}` (detalle con diff). Solo ADMIN. |
| `AdminLogController.java` | `/api/v1/admin/logs`. Endpoints: `GET /system` (logs del sistema), `GET /access` (logs de acceso), `GET /errors` (errores recientes). Lectura de logs estructurados. |

### modules/admin/service/

| Archivo | Descripción |
|---------|-------------|
| `AdminDashboardService.java` | Interfaz: `getDashboardSummary()`, `getQuickStats()`, `getAlerts()` (stock bajo, pagos pendientes, tickets urgentes). |
| `AdminConfigService.java` | Interfaz: `getConfig()`, `getConfigBySection()`, `updateConfig()`. Configuración key-value persistida en BD. |
| `BannerService.java` | Interfaz: `findAll()`, `findActive()`, `create()`, `update()`, `delete()`, `reorder()`. |
| `CarouselService.java` | Interfaz: `findAll()`, `findActive()`, `create()`, `update()`, `delete()`, `reorder()`. |

### modules/admin/dto/

| Archivo | Descripción |
|---------|-------------|
| `UpdateConfigRequest.java` | Campos: `section`, `settings` (Map<String, Object>). Actualización parcial de configuración. |
| `CreateBannerRequest.java` | Campos: `title`, `imageUrl`, `link`, `position`, `startDate`, `endDate`, `active`, `order`. |
| `CreateCarouselRequest.java` | Campos: `title`, `subtitle`, `desktopImage`, `mobileImage`, `ctaText`, `ctaLink`, `order`, `active`. |
| `AdminDashboardResponse.java` | Campos: `todaySales`, `todayOrders`, `pendingOrders`, `newUsers`, `lowStockProducts`, `openTickets`, `revenueChart`, `topProducts`. |
| `ConfigResponse.java` | Campos: `section`, `settings` (Map). Incluye: storeName, currency, taxRate, shippingDefaults, etc. |
| `BannerResponse.java` | Campos: `id`, `title`, `imageUrl`, `link`, `position`, `active`, `startDate`, `endDate`, `order`. |
| `CarouselResponse.java` | Campos: `id`, `title`, `subtitle`, `desktopImage`, `mobileImage`, `ctaText`, `ctaLink`, `order`, `active`. |

---

## 22. MÓDULO AUDIT (Logs de Auditoría)

### modules/audit/

| Archivo | Descripción |
|---------|-------------|
| `AuditController.java` | Endpoints de consulta de logs de auditoría (ver Admin arriba). |
| `AuditService.java` | Interfaz: `log(action, entity, entityId, userId, before, after)`, `findAll(filter, pageable)`, `findByEntityId()`, `findByUserId()`. |
| `AuditServiceImpl.java` | Implementación. Registra cada acción CUD (Create/Update/Delete) con diff JSON (before/after). Interceptado vía AOP (@Auditable). Inmutable. |
| `AuditLogRepository.java` | Queries: `findByEntityTypeAndEntityId()`, `findByUserId(pageable)`, `findByAction()`, `findByDateRange()`. |
| `AuditLog.java` | Entidad inmutable. Campos: `id`, `action` (CREATE/UPDATE/DELETE/LOGIN/LOGOUT), `entityType`, `entityId`, `userId`, `username`, `ip`, `userAgent`, `before` (JSON), `after` (JSON), `diff` (JSON), `timestamp`. |
| `AuditAction.java` (enum) | Enum: `CREATE`, `UPDATE`, `DELETE`, `LOGIN`, `LOGOUT`, `EXPORT`, `PERMISSION_CHANGE`, `CONFIG_CHANGE`. |
| `AuditLogResponse.java` | Campos: `id`, `action`, `entityType`, `entityId`, `user`, `changes` (diff humano-legible), `timestamp`, `ip`. |

---

## 23. MÓDULO PROMOTION (Promociones y Campañas)

### modules/promotion/

| Archivo | Descripción |
|---------|-------------|
| `PromotionController.java` | `/api/v1/promotions` (público: activas), `/api/v1/admin/promotions` (CRUD admin). Endpoints: `GET /active`, `GET /banner` (promo actual para banner), `POST /`, `PUT /{id}`, `DELETE /{id}`. |
| `PromotionService.java` | Interfaz: `findActive()`, `create()`, `update()`, `deactivate()`, `isApplicable(product, user)`. |
| `PromotionServiceImpl.java` | Implementación. Evalúa reglas de promoción: fecha válida, productos/categorías aplicables, monto mínimo, límite de uso, exclusiones. Prioridad entre promociones no stackable. |
| `PromotionRepository.java` | Queries: `findActiveByDateRange()`, `findByProductId()`, `findByCategoryId()`, `findApplicableForCart()`. |
| `CreatePromotionRequest.java` | Campos: `name`, `description`, `type`, `value`, `startDate`, `endDate`, `rules` (JSON: minPurchase, maxUses, applicableProducts, excludedProducts), `bannerImage`, `active`. |
| `PromotionResponse.java` | Campos: `id`, `name`, `description`, `type`, `value`, `startDate`, `endDate`, `bannerImage`, `active`. |
| `Promotion.java` | Entidad. Campos: `id`, `name`, `description`, `type`, `value`, `startDate`, `endDate`, `rules` (JSON), `bannerImage`, `usageCount`, `usageLimit`, `active`, `priority`, `stackable`. |
| `PromotionType.java` (enum) | Enum: `PERCENTAGE_OFF`, `FIXED_DISCOUNT`, `BUY_X_GET_Y`, `FREE_SHIPPING`, `BUNDLE`, `FLASH_SALE`. |

---

## 24. MÓDULO TAX (Impuestos Configurables)

### modules/tax/

| Archivo | Descripción |
|---------|-------------|
| `TaxController.java` | `/api/v1/admin/tax`. Endpoints: `GET /rules` (reglas configuradas), `POST /rules` (crear regla), `PUT /rules/{id}`, `DELETE /rules/{id}`, `POST /calculate` (calcular para un monto y destino). |
| `TaxService.java` | Interfaz: `calculate(amount, address, productType)`, `findRules()`, `createRule()`, `updateRule()`, `deleteRule()`. |
| `TaxServiceImpl.java` | Implementación. Busca regla por país → estado → ciudad (más específica gana). Aplica tasa al subtotal. Exenciones por tipo de producto (ej: libros exentos en algunos países). Redondeo a 2 decimales. |
| `TaxRuleRepository.java` | Queries: `findByCountryAndStateAndCity()`, `findByCountry()`, `findAll()`. |
| `TaxRule.java` | Entidad. Campos: `id`, `name`, `country`, `state`, `city`, `rate` (decimal), `productTypes[]` (aplica a estos tipos), `exemptions[]`, `active`, `priority`. |
| `TaxRate.java` | Entidad embeddable. Campos: `percentage`, `fixed` (monto fijo adicional, ej: timbres), `inclusive` (IVA incluido vs excluido). |
| `TaxCalculationResponse.java` | Campos: `subtotal`, `taxRate`, `taxAmount`, `total`, `ruleName`, `breakdown[]` (si hay múltiples tasas). |

---

## 25. MÓDULO SHIPPING (Envíos, Zonas, Métodos)

### modules/shipping/

| Archivo | Descripción |
|---------|-------------|
| `ShippingController.java` | `/api/v1/shipping`. Endpoints: `POST /calculate` (calcular costos para dirección), `GET /methods` (métodos disponibles). Admin: `GET /zones`, `POST /zones`, `PUT /zones/{id}`, `POST /methods`, `PUT /methods/{id}`. |
| `ShippingService.java` | Interfaz: `calculateRate(items, address)`, `getAvailableMethods(address)`, `findZones()`, `createZone()`, `updateZone()`, `createMethod()`. |
| `ShippingServiceImpl.java` | Implementación. Determina zona por dirección. Calcula peso total y volumétrico (toma el mayor). Aplica tarifa según método (estándar, express, overnight). Envío gratuito si supera umbral configurable. Estimación de días de entrega. |
| `ShippingMethodRepository.java` | Queries: `findAllActive()`, `findByZoneId()`, `findById()`. |
| `ShippingZoneRepository.java` | Queries: `findByCountryAndState()`, `findAll()`, `findById()`. |
| `ShippingMethod.java` | Entidad. Campos: `id`, `name` (Estándar, Express, Overnight), `carrier`, `estimatedDays`, `basePrice`, `pricePerKg`, `freeShippingThreshold`, `active`, `zones` (ManyToMany). |
| `ShippingZone.java` | Entidad. Campos: `id`, `name`, `countries[]`, `states[]`, `methods` (ManyToMany), `active`. |
| `ShippingRate.java` | Entidad. Campos: `id`, `zone` (ManyToOne), `method` (ManyToOne), `minWeight`, `maxWeight`, `price`, `estimatedDays`. Tarifa por rango de peso y zona. |
| `ShippingCarrier.java` (enum) | Enum: `STANDARD`, `DHL`, `FEDEX`, `UPS`, `LOCAL_COURIER`, `PICKUP`. |
| `CalculateShippingRequest.java` | Campos: `items[]` ({productId, quantity, weight}), `addressId` o `address` (inline), `method` (opcional, si no retorna todas las opciones). |
| `ShippingRateResponse.java` | Campos: `methods[]` ({name, carrier, price, estimatedDays, freeShipping}). Lista de opciones con precios. |

---

## 26. MÓDULO USER (Perfil y Direcciones)

### modules/user/controller/

| Archivo | Descripción |
|---------|-------------|
| `UserController.java` | `/api/v1/users`. Endpoints: `GET /me/profile`, `PUT /me/profile` (actualizar perfil), `GET /me/addresses`, `POST /me/addresses`, `PUT /me/addresses/{id}`, `DELETE /me/addresses/{id}`, `PUT /me/avatar` (subir avatar). |
| `AdminUserController.java` | `/api/v1/admin/users`. Endpoints: `GET /` (listado paginado con filtros), `GET /{id}`, `PUT /{id}/role` (cambiar rol), `PUT /{id}/status` (activar/desactivar), `DELETE /{id}` (soft delete), `GET /export`. |

### modules/user/service/

| Archivo | Descripción |
|---------|-------------|
| `UserService.java` | Interfaz: `findAll(filter, pageable)`, `findById()`, `updateRole()`, `toggleStatus()`, `softDelete()`, `exportUsers()`. Gestión admin de usuarios. |
| `UserProfileService.java` | Interfaz: `getProfile()`, `updateProfile()`, `uploadAvatar()`, `getAddresses()`, `addAddress()`, `updateAddress()`, `deleteAddress()`, `setDefaultAddress()`. |

### modules/user/entity/

| Archivo | Descripción |
|---------|-------------|
| `UserProfile.java` | Entidad. Campos: `id`, `user` (OneToOne), `phone`, `birthDate`, `gender`, `language`, `currency`, `timezone`, `bio`, `preferences` (JSON: newsletter, notifications). |
| `Address.java` | Entidad. Campos: `id`, `user` (ManyToOne), `label` (Casa, Trabajo), `firstName`, `lastName`, `street`, `number`, `apartment`, `city`, `state`, `country`, `zipCode`, `phone`, `isDefault`, `isShipping`, `isBilling`. |

### modules/user/dto/

| Archivo | Descripción |
|---------|-------------|
| `UpdateProfileRequest.java` | Campos: `firstName`, `lastName`, `phone`, `birthDate`, `gender`, `language`, `currency`, `bio`. Todos opcionales. |
| `UpdateAddressRequest.java` | Campos completos de dirección. Validación de formato según país. |
| `ChangeRoleRequest.java` | Campos: `roleId` (UUID). Solo admin. Validación de roles válidos. |
| `UserProfileResponse.java` | Campos: `id`, `email`, `firstName`, `lastName`, `avatar`, `phone`, `birthDate`, `language`, `currency`, `roles`, `createdAt`, `lastLoginAt`. |
| `UserListResponse.java` | Paginado de usuarios para admin. Incluye: filtros, ordenamiento, conteo por rol. |
| `AddressResponse.java` | Campos completos de dirección + `isDefault`. |

---

## BACKEND - RESOURCES (Configuración y Migraciones)

### src/main/resources/

| Archivo | Descripción |
|---------|-------------|
| `application.yml` | Configuración principal: perfil activo, nombre app, server port, datasource, JPA, Redis, ElasticSearch, MinIO, JWT, OAuth2, SMTP, Firebase, logging. |
| `application-dev.yml` | Override para desarrollo: H2/PostgreSQL local, logs DEBUG, CORS permisivo, hot reload, swagger habilitado. |
| `application-test.yml` | Override para testing: H2 in-memory, TestContainers, mocks de servicios externos, logs mínimos. |
| `application-staging.yml` | Override para staging: BD de staging, logs INFO, CORS restringido, feature flags. |
| `application-prod.yml` | Override para producción: BD prod, logs WARN, CORS estricto, cache agresivo, swagger deshabilitado, SSL, secrets desde env vars. |
| `logback-spring.xml` | Configuración de logging: JSON format (para ELK/Grafana), file rotation, colores en consola (dev), levels por paquete. |
| `banner.txt` | ASCII art mostrado al iniciar la aplicación. Logo de SomosCasa. |

### src/main/resources/db/migration/

| Archivo | Descripción |
|---------|-------------|
| `V1__init_schema.sql` | Schema inicial: extensiones UUID, funciones helper, tipos custom. |
| `V2__create_users.sql` | Tablas: users, roles, permissions, user_roles, role_permissions, refresh_tokens, sessions, login_attempts. |
| `V3__create_products.sql` | Tablas: products, categories, subcategories, authors, publishers, tags, product_tags, product_images, variants, stock, reviews, coupons, discounts. |
| `V4__create_orders.sql` | Tablas: carts, cart_items, wishlists, orders, order_items, invoices, refunds, order_tracking, payments, transactions. |
| `V5__create_podcasts.sql` | Tablas: podcasts, seasons, episodes, podcast_categories. |
| `V6__create_blog.sql` | Tablas: posts, blog_categories, blog_tags, post_tags, comments. |
| `V7__create_counseling.sql` | Tablas: counselors, schedules, bookings, counseling_sessions, session_notes, time_slots. |
| `V8__create_courses.sql` | Tablas: courses, modules, lessons, enrollments, progress. |
| `V9__create_notifications.sql` | Tablas: notifications, notification_templates, device_tokens, notification_preferences. |
| `V10__create_analytics.sql` | Tablas: analytics_events, reports, audit_logs. |
| `V11__create_chat.sql` | Tablas: chat_rooms, chat_messages, chat_participants, tickets. |
| `V12__create_subscriptions.sql` | Tablas: plans, subscriptions, subscription_history. |

### src/main/resources/db/seed/

| Archivo | Descripción |
|---------|-------------|
| `V100__seed_roles.sql` | Inserta roles: ADMIN, EDITOR, CLIENT, GUEST con descripciones. |
| `V101__seed_permissions.sql` | Inserta permisos granulares por módulo y los asigna a roles. |
| `V102__seed_categories.sql` | Categorías iniciales: Libros, Biblias, Devocionales, Matrimonio, Familia, Liderazgo, etc. con subcategorías. |
| `V103__seed_admin_user.sql` | Usuario admin inicial (password configurable por env var). |
| `V104__seed_sample_products.sql` | Productos de ejemplo para desarrollo/demo. |
| `V105__seed_tax_rules.sql` | Reglas de impuestos por país (México, Colombia, Argentina, España). |
| `V106__seed_shipping_zones.sql` | Zonas de envío: Nacional, Latinoamérica, Internacional. Con métodos y tarifas. |

### src/main/resources/templates/email/

| Archivo | Descripción |
|---------|-------------|
| `welcome.html` | Template Thymeleaf de bienvenida. Variables: userName, verifyUrl. Diseño responsive. |
| `password-reset.html` | Template de recuperación. Variables: userName, resetUrl, expirationMinutes. |
| `order-confirmation.html` | Confirmación de pedido. Variables: orderNumber, items, total, shippingAddress, estimatedDelivery. |
| `invoice.html` | Factura por email. Variables: invoiceNumber, items, taxes, total, companyInfo. |
| `booking-confirmation.html` | Confirmación de asesoría. Variables: counselorName, date, time, meetingLink, price. |
| `newsletter.html` | Template base para campañas. Variables: content (dinámico), unsubscribeUrl. |
| `email-verification.html` | Verificación de email. Variables: userName, verifyUrl, expirationHours. |

### src/main/resources/i18n/

| Archivo | Descripción |
|---------|-------------|
| `messages.properties` | Mensajes por defecto (español). Validaciones, errores, notificaciones. |
| `messages_es.properties` | Mensajes en español explícitos. |
| `messages_en.properties` | Mensajes en inglés. |
| `messages_pt.properties` | Mensajes en portugués. |

---
