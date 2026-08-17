# Documentación de Archivos - Frontend (React 19 + Vite + TypeScript)

## Estructura General

El frontend sigue Feature-Based Architecture con separación clara:
- `src/features/` → Páginas y componentes por módulo funcional
- `src/components/` → Componentes reutilizables (UI, layout, common, forms)
- `src/services/` → Llamadas a la API
- `src/hooks/` → Custom hooks
- `src/store/` → Estado global (Redux Toolkit)
- `src/types/` → Tipos TypeScript
- `src/schemas/` → Validación con Zod

---

## 1. ARCHIVOS RAÍZ DEL FRONTEND

| Archivo | Descripción |
|---------|-------------|
| `package.json` | Dependencias del proyecto: react 19, vite, typescript, react-router, redux toolkit, tanstack query, axios, tailwindcss, shadcn/ui, framer-motion, react-hook-form, zod, i18next, vitest, cypress, playwright. Scripts: dev, build, preview, test, lint, format. |
| `tsconfig.json` | Configuración TypeScript: strict mode, path aliases (@/components, @/features, @/hooks, etc), target ESNext, moduleResolution bundler, jsx react-jsx. |
| `tsconfig.node.json` | Configuración TS para archivos de configuración de Node (vite.config.ts). |
| `vite.config.ts` | Configuración Vite: plugins (react, PWA, compression), aliases de paths, proxy dev hacia backend (/api → localhost:8080), build optimization, chunk splitting por feature, env variables. |
| `tailwind.config.ts` | Configuración TailwindCSS: content paths, tema extendido (colores brand, tipografía, breakpoints custom), dark mode 'class', plugins (typography, forms, container-queries, animate). |
| `postcss.config.js` | Plugins PostCSS: tailwindcss, autoprefixer. |
| `index.html` | Entry HTML de Vite. Meta tags SEO base, preconnect fonts, div#root, script module main.tsx, manifest PWA link. |
| `.eslintrc.cjs` | ESLint: extends recommended + typescript + react + prettier. Rules: no-unused-vars warn, react/prop-types off, import order. |
| `.prettierrc` | Prettier: semi true, singleQuote true, tabWidth 2, trailingComma all, printWidth 100. |
| `.env.example` | Variables de entorno template: VITE_API_URL, VITE_GOOGLE_CLIENT_ID, VITE_FACEBOOK_APP_ID, VITE_MERCADOPAGO_PUBLIC_KEY, VITE_PAYPAL_CLIENT_ID, VITE_FIREBASE_CONFIG, VITE_ANALYTICS_ID. |
| `.env.development` | Variables para desarrollo local: API apuntando a localhost:8080. |
| `.env.production` | Variables para producción: API URL real, keys de producción. |
| `.env.staging` | Variables para staging: API de staging. |
| `.gitignore` | Ignora: node_modules, dist, .env (no .example), coverage, .vscode. |
| `Dockerfile` | Multi-stage: Node para build → Nginx para servir. Copia dist a /usr/share/nginx/html. Expone 80. |
| `Dockerfile.prod` | Optimizado para producción: build con --mode production, nginx con compresión gzip, headers seguridad. |
| `nginx.conf` | Configuración Nginx: SPA fallback (try_files), gzip, cache de assets estáticos, headers seguridad, proxy pass /api. |
| `vitest.config.ts` | Configuración Vitest: environment jsdom, setup file, coverage (istanbul, threshold 85%), globals true. |
| `playwright.config.ts` | Configuración Playwright E2E: browsers (chromium, firefox, webkit), baseURL, screenshots on failure, video on retry. |
| `cypress.config.ts` | Configuración Cypress E2E: baseUrl, viewport, video false, screenshotOnRunFailure true. |
| `components.json` | Configuración de Shadcn/UI: style default, rsc false, tsx true, tailwind config path, aliases de componentes. |

---

## 2. src/ - ARCHIVOS CORE

| Archivo | Descripción |
|---------|-------------|
| `src/main.tsx` | Entry point React. Renderiza `<App />` dentro de `<StrictMode>`. Importa CSS global. Registra Service Worker para PWA. |
| `src/App.tsx` | Componente raíz. Envuelve la app con todos los providers (Auth, Theme, Query, I18n, Redux Store, Router). Lazy loading de rutas principales. |
| `src/vite-env.d.ts` | Tipos de Vite: referencia a vite/client. Declara tipos para env variables (ImportMetaEnv). |
| `src/index.css` | CSS base: importa Tailwind (base, components, utilities). Variables CSS custom para colores de tema claro/oscuro. Font imports. |

### src/app/

| Archivo | Descripción |
|---------|-------------|
| `routes.tsx` | Definición de todas las rutas con React Router v6. Lazy loading por feature. Layout routes (MainLayout, AdminLayout, AuthLayout). Rutas protegidas por rol. Redirect para 404. |
| `providers.tsx` | Composición de todos los providers en orden correcto: ReduxProvider → QueryProvider → AuthProvider → ThemeProvider → I18nProvider → ToastProvider. Evita provider hell con composición limpia. |

### src/config/

| Archivo | Descripción |
|---------|-------------|
| `api.config.ts` | Configuración de API: baseURL desde env vars, timeout, headers default, interceptores. Exporta instancia configurada. |
| `app.config.ts` | Constantes de app: nombre, versión, description, defaultLanguage, defaultCurrency, supportedLanguages, supportedCurrencies, pagination defaults. |
| `auth.config.ts` | Configuración de autenticación: Google Client ID, Facebook App ID, redirect URIs, token storage key, refresh threshold. |
| `i18n.config.ts` | Configuración de i18next: idioma por defecto (es), fallback (en), namespaces, backend (JSON files), detection (localStorage → navigator). |
| `query.config.ts` | Configuración de TanStack Query: staleTime, cacheTime, retry, refetchOnWindowFocus, defaultOptions para queries y mutations. |
| `theme.config.ts` | Definición de tema: colores primarios, secundarios, neutral. Tokens para light/dark mode. Breakpoints, spacing, typography scales. |

### src/constants/

| Archivo | Descripción |
|---------|-------------|
| `app.constants.ts` | Constantes globales: MAX_CART_ITEMS, PAGINATION_SIZE, IMAGE_MAX_SIZE, ACCEPTED_IMAGE_TYPES, PASSWORD_MIN_LENGTH, DEBOUNCE_DELAY. |
| `api.constants.ts` | Endpoints de la API como constantes: AUTH.LOGIN, AUTH.REGISTER, PRODUCTS.LIST, ORDERS.CREATE, etc. Evita strings mágicos. |
| `routes.constants.ts` | Paths de las rutas: HOME, CATALOG, PRODUCT_DETAIL(slug), CART, CHECKOUT, PROFILE, ADMIN.DASHBOARD, etc. Tipados y reutilizables. |
| `query-keys.constants.ts` | Keys para TanStack Query: ['products', filters], ['product', id], ['cart'], ['orders', page], etc. Factory pattern para keys consistentes. |

### src/lib/

| Archivo | Descripción |
|---------|-------------|
| `axios.ts` | Instancia de Axios configurada: baseURL, timeout 30s, interceptor de request (agrega Bearer token), interceptor de response (maneja 401 → refresh token, 403 → redirect, 500 → toast error). |
| `query-client.ts` | Instancia de QueryClient con defaults: staleTime 5min, gcTime 30min, retry 1 vez, refetchOnWindowFocus false. Mutation defaults con onError global. |
| `utils.ts` | Utilidades generales: formatPrice(), formatDate(), truncateText(), debounce(), throttle(), classNames(), sleep(). |
| `cn.ts` | Función `cn()` que combina clsx + tailwind-merge para merging inteligente de clases Tailwind sin conflictos. Utility fundamental para componentes. |

### src/providers/

| Archivo | Descripción |
|---------|-------------|
| `AppProvider.tsx` | Provider raíz que compone todos los demás providers en el orden correcto. Simplifica el árbol en App.tsx. |
| `AuthProvider.tsx` | Context Provider de autenticación. Provee: user, isAuthenticated, login(), logout(), refreshToken(). Verifica token al montar. Auto-refresh antes de expiración. |
| `ThemeProvider.tsx` | Context Provider de tema. Provee: theme (light/dark/system), setTheme(). Persiste en localStorage. Aplica clase dark al HTML element. Respeta preferencia del sistema. |
| `I18nProvider.tsx` | Wrapper de i18next Provider. Inicializa i18n con configuración, carga traducciones lazy por namespace. Suspense durante carga. |
| `QueryProvider.tsx` | Wrapper de QueryClientProvider de TanStack Query. Provee queryClient configurado. Incluye ReactQueryDevtools en desarrollo. |

### src/router/

| Archivo | Descripción |
|---------|-------------|
| `index.tsx` | Router principal con createBrowserRouter. Define estructura de rutas con layouts anidados. Usa `<Outlet />` para composición. |
| `ProtectedRoute.tsx` | HOC/wrapper que verifica autenticación. Si no autenticado → redirect a login con returnUrl. Si autenticado pero sin rol requerido → redirect a 403. |
| `AdminRoute.tsx` | Extiende ProtectedRoute. Verifica rol ADMIN o EDITOR. Redirect a home si no tiene permisos. |
| `PublicRoute.tsx` | Wrapper para rutas que solo deben verse sin autenticación (login, register). Si ya autenticado → redirect a home/dashboard. |
| `LazyRoutes.tsx` | Definición de componentes lazy con React.lazy() y Suspense. Code splitting por feature: cada página se carga bajo demanda. Loading fallback con Skeleton. |

### src/store/

| Archivo | Descripción |
|---------|-------------|
| `index.ts` | Re-exporta store, hooks tipados (useAppDispatch, useAppSelector), tipos (RootState, AppDispatch). |
| `store.ts` | Configuración de Redux store con configureStore. Combina reducers de slices. Middleware: serializable check + custom middleware. Redux DevTools en dev. |

### src/store/slices/

| Archivo | Descripción |
|---------|-------------|
| `authSlice.ts` | Estado: user, token, isAuthenticated, isLoading. Actions: setCredentials, logout, setUser. Reducers para login/logout. Extra reducers para thunks async. |
| `cartSlice.ts` | Estado: items[], total, itemCount, coupon, shipping, tax. Actions: addItem, removeItem, updateQuantity, clearCart, applyCoupon, setShipping. Cálculos automáticos de totales. |
| `uiSlice.ts` | Estado: sidebarOpen, mobileMenuOpen, theme, language, currency, toasts[]. Actions para toggles de UI y preferencias globales. |
| `searchSlice.ts` | Estado: query, results, filters, suggestions, isSearching, recentSearches. Actions: setQuery, setFilters, clearSearch. Almacena búsquedas recientes en localStorage. |
| `notificationSlice.ts` | Estado: notifications[], unreadCount, isLoading. Actions: addNotification, markAsRead, markAllAsRead, removeNotification. WebSocket updates. |

### src/store/middleware/

| Archivo | Descripción |
|---------|-------------|
| `authMiddleware.ts` | Middleware que intercepta acciones de logout: limpia localStorage, invalida queries, resetea state de otros slices. |
| `cartPersistMiddleware.ts` | Middleware que persiste el carrito en localStorage en cada cambio. Al iniciar, rehidrata desde localStorage. Sync entre tabs con storage event. |

---

### src/styles/

| Archivo | Descripción |
|---------|-------------|
| `globals.css` | Estilos globales: reset adicional, custom scrollbar, selection color, focus-visible outline, smooth scroll, font-face declarations. |
| `animations.css` | Animaciones CSS custom: fadeIn, slideUp, slideDown, scaleIn, shimmer (skeleton loading), pulse, bounce. Usadas como clase de Tailwind vía plugin. |

### src/i18n/

| Archivo | Descripción |
|---------|-------------|
| `index.ts` | Inicialización de i18next: configura instancia, registra plugins (LanguageDetector, initReactI18next), carga recursos, exporta instancia y hook useTranslation. |
| `locales/es.json` | Traducciones español: todas las cadenas de UI (botones, labels, mensajes, validaciones, navegación, admin). Namespace plano o anidado por módulo. |
| `locales/en.json` | Traducciones inglés. Misma estructura que es.json. |
| `locales/pt.json` | Traducciones portugués. Misma estructura. |

### public/

| Archivo | Descripción |
|---------|-------------|
| `manifest.json` | PWA manifest: name, short_name, description, start_url, display standalone, theme_color, background_color, icons (192×192, 512×512). |
| `sw.js` | Service Worker para PWA: estrategia cache-first para assets estáticos, network-first para API. Offline fallback page. Push notifications handler. |
| `robots.txt` | Permite indexación completa. Disallow: /admin, /api, /checkout. Sitemap URL. |
| `sitemap.xml` | Sitemap estático base (se genera dinámicamente por backend, pero fallback estático para SPA). |
| `favicon.ico` | Favicon de la aplicación. |

---

## 3. COMPONENTS - UI (Componentes Reutilizables Shadcn/UI + Custom)

### src/components/ui/

| Archivo | Descripción |
|---------|-------------|
| `Button.tsx` | Componente botón con variantes: primary, secondary, outline, ghost, destructive, link. Tamaños: sm, md, lg. Soporta loading state (spinner), disabled, icono izq/der. Usa cva (class-variance-authority). |
| `Input.tsx` | Input de texto con label flotante, error message, helper text, icono prefijo/sufijo. Integración con react-hook-form via forwardRef. Variantes: default, error, success. |
| `Select.tsx` | Componente select con dropdown custom (no nativo). Búsqueda dentro de opciones, multi-select, grupos, clear button. Integración con react-hook-form. |
| `Textarea.tsx` | Textarea con auto-resize, contador de caracteres, max length visual, label, error state. |
| `Card.tsx` | Contenedor card con subcomponentes: Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter. Variantes de sombra y borde. |
| `Dialog.tsx` | Modal/dialog accesible (Radix UI base). Overlay, animación enter/exit con Framer Motion. Cerrar con Escape y click fuera. Focus trap. |
| `Drawer.tsx` | Panel lateral deslizante (mobile-first). Posiciones: left, right, bottom. Gesture swipe to close en mobile. Overlay backdrop. |
| `Dropdown.tsx` | Menú desplegable con items, separadores, submenús. Keyboard navigation (flechas, Enter, Escape). Posicionamiento automático (Floating UI). |
| `Badge.tsx` | Badge/chip para estados y etiquetas. Variantes de color: success, warning, error, info, neutral. Tamaños: sm, md. Opcional con ícono o dismiss button. |
| `Avatar.tsx` | Imagen de avatar circular con fallback (iniciales del nombre, ícono genérico). Tamaños: xs, sm, md, lg, xl. Indicador de estado online/offline. |
| `Tabs.tsx` | Componente tabs accesible. Variantes: underline, pill, boxed. Keyboard navigation. Lazy rendering del contenido. Controlled y uncontrolled. |
| `Table.tsx` | Tabla responsive con subcomponentes: Table, TableHeader, TableBody, TableRow, TableHead, TableCell. Sorting headers, selección de filas, responsive (horizontal scroll o stack en mobile). |
| `Pagination.tsx` | Paginación con: botones prev/next, números de página, ellipsis, go-to-page input, items-per-page selector. Props: totalPages, currentPage, onPageChange. |
| `Skeleton.tsx` | Componente skeleton loading con animación shimmer. Variantes: text (líneas), circle (avatar), card, table row. Configurable width/height. |
| `Spinner.tsx` | Indicador de carga circular. Tamaños: sm, md, lg. Colores: primary, white, muted. Overlay full-screen option. |
| `Toast.tsx` | Notificación toast posicionada (top-right). Tipos: success, error, warning, info. Auto-dismiss configurable. Action button opcional. Stack de múltiples toasts. Usa sonner o custom. |
| `Tooltip.tsx` | Tooltip informativo en hover/focus. Posición auto (top, bottom, left, right). Delay configurable. Rich content (HTML). |
| `Breadcrumb.tsx` | Navegación breadcrumb con separadores. Auto-genera desde ruta actual o items explícitos. Schema.org BreadcrumbList para SEO. Responsive: collapse en mobile. |
| `Progress.tsx` | Barra de progreso horizontal. Variantes: determinate (%), indeterminate (animación continua). Colores por estado. Label con porcentaje. |
| `Accordion.tsx` | Acordeón expandible/colapsable. Single o multiple items abiertos. Animación smooth height. Icono rotación. Accesible con keyboard. |
| `Alert.tsx` | Alerta/banner informativo. Tipos: info, success, warning, error. Con ícono, título, descripción, acción. Dismissible. |

| `Checkbox.tsx` | Checkbox accesible con label. Estados: checked, unchecked, indeterminate. Integración react-hook-form. Custom styling con Tailwind. |
| `RadioGroup.tsx` | Grupo de radio buttons. Orientación: vertical, horizontal. Label, description por opción. Keyboard navigation. |
| `Switch.tsx` | Toggle switch on/off. Label izquierda/derecha. Tamaños: sm, md. Animación de transición. Accesible (role=switch). |
| `Slider.tsx` | Slider de rango. Single value o dual (min-max range). Step configurable. Tooltip con valor actual. Para filtros de precio. |
| `Calendar.tsx` | Calendario mensual para selección de fecha. Navegación mes/año. Fechas deshabilitadas. Range selection. Integración con date-fns. Localización. |
| `DatePicker.tsx` | Popover con Calendar dentro. Input de fecha formateado. Clearable. Min/max date. Integración con react-hook-form. Formato según locale. |
| `TimePicker.tsx` | Selector de hora. Formato 12h/24h. Steps de 15/30/60 min. Integración con bookings (asesorías). |
| `FileUpload.tsx` | Componente de subida de archivos. Drag & drop zone. Preview de imágenes. Progress bar de upload. Validación de tipo/tamaño. Multiple files. |
| `RichTextEditor.tsx` | Editor WYSIWYG (basado en TipTap o Quill). Toolbar: bold, italic, headings, links, images, listas, blockquote. Output HTML sanitizado. Para blog y descripciones. |
| `StarRating.tsx` | Rating con estrellas interactivo (click/hover) o readonly (display). Medias estrellas. Tamaño configurable. Accesible. |
| `ImageGallery.tsx` | Galería de imágenes con thumbnail strip, zoom, lightbox fullscreen, navegación con flechas/swipe. Lazy load. Para detalle de producto. |
| `VideoPlayer.tsx` | Player de video responsive. Controles custom (play, pause, volume, fullscreen, progress). Soporta YouTube embed y self-hosted. Lazy load. |
| `AudioPlayer.tsx` | Player de audio con: play/pause, progress bar, duration, volume, velocidad (0.5x-2x). Para podcast episodes y audiolibros. Persistent mini-player. |
| `Modal.tsx` | Alias/wrapper simplificado de Dialog. Props: isOpen, onClose, title, children, size (sm, md, lg, xl, full). |
| `Sheet.tsx` | Panel lateral overlay (similar a Drawer pero semántica de hoja). Para filtros mobile, carrito quick view, navegación. |
| `Command.tsx` | Paleta de comandos estilo Cmd+K. Búsqueda fuzzy, categorías, atajos de teclado, acciones rápidas. Para power users y admin. |
| `Popover.tsx` | Contenedor popover posicionado junto a trigger. Para menús contextuales, filtros inline, tooltips ricos. Floating UI positioning. |
| `HoverCard.tsx` | Card que aparece al hover sobre un trigger. Para preview de productos, perfiles de usuario. Delay enter/leave configurable. |
| `Separator.tsx` | Línea divisora horizontal o vertical. Con texto central opcional ("o", "sección"). Variants: solid, dashed. |
| `ScrollArea.tsx` | Contenedor con scrollbar custom estilizado (thin, auto-hide). Para listas largas, sidebars, código. Cross-browser consistent. |

---

## 4. COMPONENTS - LAYOUT

### src/components/layout/

| Archivo | Descripción |
|---------|-------------|
| `MainLayout.tsx` | Layout principal del sitio público. Estructura: TopBar → Header (con search) → Navbar (categorías) → `<Outlet />` (contenido) → Footer. Responsive. Sticky header. |
| `AdminLayout.tsx` | Layout del panel admin. Estructura: AdminHeader → AdminSidebar (colapsable) → Main content `<Outlet />`. Sidebar con navegación por módulos. Theme separado. |
| `AuthLayout.tsx` | Layout para páginas de autenticación (login, register, reset). Estructura: split screen (imagen decorativa + formulario) o centered card. Minimal, sin header/footer. |
| `Header.tsx` | Header del sitio público. Contiene: Logo, SearchBar, CartIcon (badge), UserMenu (avatar + dropdown), LanguageSelector, ThemeToggle. Responsive: hamburger en mobile. |
| `Footer.tsx` | Footer del sitio. Columnas: Sobre nosotros, Categorías, Atención al cliente, Contacto, Redes sociales. Newsletter subscribe form. Copyright. Links legales. |
| `Sidebar.tsx` | Sidebar genérico reutilizable. Props: items[], collapsed, onToggle. Para filtros del catálogo. Sticky positioning. |
| `AdminSidebar.tsx` | Sidebar específico del admin. Navegación: Dashboard, Usuarios, Productos, Pedidos, Podcasts, Cursos, Blog, Categorías, Cupones, Analytics, Configuración, Auditoría. Iconos, badges (pedidos pendientes), colapsable. |
| `AdminHeader.tsx` | Header del admin. Contiene: toggle sidebar, breadcrumb, search admin, notifications dropdown, user menu con role badge. |
| `MobileNav.tsx` | Navegación mobile (bottom tab bar). Items: Home, Catálogo, Carrito (badge), Podcasts, Perfil. Fixed bottom. Slide up animation. |
| `TopBar.tsx` | Barra superior thin con info: envío gratis desde X, teléfono de contacto, links rápidos, selector de idioma/moneda. Dismissible. |
| `Navbar.tsx` | Barra de navegación de categorías bajo el header. Mega menu en hover (desktop). Dropdown list (mobile). Categorías principales + "Ver todo". |

---

## 5. COMPONENTS - COMMON (Componentes Compartidos de Alto Nivel)

### src/components/common/

| Archivo | Descripción |
|---------|-------------|
| `Logo.tsx` | Logo de la marca SomosCasa. Props: variant (full, icon-only, white), size (sm, md, lg). SVG inline para control de colores. Link a home. |
| `SearchBar.tsx` | Barra de búsqueda global. Input con ícono, debounce 300ms, dropdown de autocomplete con sugerencias (productos, categorías, autores). Cierra con Escape. Submit navega a /search?q=. |
| `CartIcon.tsx` | Ícono de carrito con badge numérico (cantidad de items). Animación de bounce al agregar producto. Link a /cart. |
| `UserMenu.tsx` | Dropdown del usuario autenticado: avatar + nombre → menú: Mi perfil, Mis pedidos, Mi biblioteca, Mis cursos, Mis sesiones, Configuración, Cerrar sesión. Si no autenticado: botones Login/Register. |
| `LanguageSelector.tsx` | Dropdown para cambiar idioma. Banderas + nombre. Persiste en localStorage. Recarga traducciones sin reload de página. |
| `ThemeToggle.tsx` | Botón toggle light/dark mode. Icono sol/luna con animación de rotación. Respeta preferencia del sistema como default. |
| `CurrencySelector.tsx` | Dropdown para cambiar moneda de visualización. Opciones: USD, MXN, COP, ARS, EUR. Conversión en frontend con tasas cacheadas. |
| `SocialLinks.tsx` | Conjunto de iconos de redes sociales con links: Facebook, Instagram, YouTube, Spotify (podcast), Twitter/X. Target _blank. |
| `NewsletterForm.tsx` | Formulario inline de suscripción a newsletter. Input email + botón. Validación con Zod. Feedback success/error. Usado en footer y landing. |
| `BackToTop.tsx` | Botón flotante "volver arriba" que aparece al hacer scroll >500px. Smooth scroll to top. Animación fade in/out. |
| `EmptyState.tsx` | Componente para estados vacíos. Props: icon, title, description, actionLabel, actionHref. Ej: "Tu carrito está vacío", "No hay resultados". Ilustración + CTA. |
| `ErrorBoundary.tsx` | React Error Boundary. Captura errores de render. Muestra UI fallback amigable con botón "Reintentar". Reporta error a servicio de logging. |
| `Loading.tsx` | Componente de carga full-page. Spinner central + mensaje opcional. Usado como Suspense fallback para lazy loading. |
| `NotFound.tsx` | Página 404. Ilustración, mensaje "Página no encontrada", botón volver al inicio, sugerencias de navegación. |
| `SEOHead.tsx` | Componente que inyecta meta tags dinámicos usando react-helmet-async. Props: title, description, ogImage, canonical, noindex. Prefija título con "SomosCasa | ". |
| `ShareButtons.tsx` | Botones para compartir en redes sociales: Facebook, Twitter, WhatsApp, Email, Copy link. Props: url, title, description. Web Share API cuando disponible. |
| `Breadcrumbs.tsx` | Wrapper sobre Breadcrumb UI que auto-genera breadcrumbs desde la ruta actual (useLocation + route config). Override manual con props. |
| `ConfirmDialog.tsx` | Dialog de confirmación reutilizable. Props: isOpen, title, message, confirmLabel, cancelLabel, onConfirm, onCancel, variant (danger/warning/info). |
| `InfiniteScrollContainer.tsx` | Container con IntersectionObserver que detecta cuando el usuario llega al final y dispara fetch de siguiente página. Integrado con useInfiniteQuery. |
| `LazyImage.tsx` | Componente imagen con: lazy loading nativo (loading="lazy"), placeholder blur/skeleton mientras carga, error fallback, srcSet para responsive. Optimización de rendimiento. |

---

## 6. COMPONENTS - FORMS (Formularios Reutilizables)

### src/components/forms/

| Archivo | Descripción |
|---------|-------------|
| `LoginForm.tsx` | Formulario de login: email, password, remember me, captcha. Validación Zod. react-hook-form. Submit → authService.login(). Botones OAuth2 (Google, Facebook). Link a registro y forgot password. |
| `RegisterForm.tsx` | Formulario de registro: firstName, lastName, email, password, confirmPassword, términos checkbox. Validación: email formato, password strength indicator, passwords match. Submit → authService.register(). |
| `ForgotPasswordForm.tsx` | Input email + botón enviar. Validación email. Submit → authService.forgotPassword(). Mensaje de éxito: "Revisa tu email". |
| `ResetPasswordForm.tsx` | Inputs: newPassword, confirmPassword. Token desde URL params. Validación: strength, match. Submit → authService.resetPassword(token, password). |
| `ChangePasswordForm.tsx` | Inputs: currentPassword, newPassword, confirmPassword. Validación. Submit → userService.changePassword(). En página de seguridad del perfil. |
| `ProfileForm.tsx` | Formulario de edición de perfil: firstName, lastName, phone, birthDate, gender, bio, language, currency. Prefilled con datos actuales. Submit parcial (solo campos modificados). |
| `AddressForm.tsx` | Formulario de dirección: label, firstName, lastName, street, number, apartment, city, state, country (select), zipCode, phone, isDefault. Validación por país. Reusado en perfil y checkout. |
| `CheckoutForm.tsx` | Formulario multi-step del checkout. Steps: dirección envío → dirección facturación (checkbox "misma") → método envío → método pago → review. Progress indicator. Persistencia entre steps. |
| `ReviewForm.tsx` | Formulario de reseña: star rating (click), title, content (textarea), pros, cons. Validación: rating obligatorio, content min 20 chars. Submit → reviewService.create(). |
| `ContactForm.tsx` | Formulario de contacto: nombre, email, asunto (select), mensaje. Captcha. Submit → contactService.send(). Confirmación visual. |
| `BookingForm.tsx` | Formulario de reserva de asesoría: seleccionar asesor, fecha (calendar), horario (time slots disponibles), tipo de sesión, plataforma video, notas. Validación de disponibilidad en tiempo real. |
| `NewsletterSubscribeForm.tsx` | Formulario simple: email + submit. Inline (footer/banner). Validación email. Double opt-in info. |
| `CouponForm.tsx` | Input de código de cupón + botón "Aplicar". Validación server-side. Muestra descuento aplicado o error (expirado, inválido, etc). |
| `SearchForm.tsx` | Formulario de búsqueda avanzada: query input, filtros desplegables (categoría, autor, rango precio, rating, tipo producto). Clear all. Submit construye query params y navega. |

---

## 7. FEATURES - PÁGINAS PÚBLICAS

### src/features/landing/

| Archivo | Descripción |
|---------|-------------|
| `LandingPage.tsx` | Página de aterrizaje principal (marketing). Composición de secciones: Hero → FeaturedProducts → Categories → LatestPodcasts → Testimonials → CallToAction → Newsletter. SEO optimizado. Animaciones de entrada con Framer Motion. |
| `components/Hero.tsx` | Sección hero full-width. Carrusel de slides con imagen de fondo, título, subtítulo, CTA button. Autoplay con pausa en hover. Responsive: distintas imágenes mobile/desktop. Overlay gradient. |
| `components/FeaturedProducts.tsx` | Grid de productos destacados (4-8 items). Fetch con useQuery. Carrusel en mobile. Título de sección + link "Ver todo". Cards con hover animation. |
| `components/Testimonials.tsx` | Carrusel de testimonios de clientes. Cada slide: foto, nombre, rating (estrellas), texto del testimonio. Autoplay. Dots de navegación. |
| `components/Categories.tsx` | Grid visual de categorías principales con icono/imagen y nombre. Click navega a /catalog?category=slug. Animación hover scale. |
| `components/Newsletter.tsx` | Sección CTA para suscripción a newsletter. Background decorativo. Input email + botón. Beneficios listados (descuentos, novedades). |
| `components/LatestPodcasts.tsx` | Últimos 3 episodios de podcast. Mini player inline. Link a página completa de podcasts. Card con imagen, título, duración. |
| `components/CallToAction.tsx` | Banner CTA para asesorías matrimoniales. Imagen + texto persuasivo + botón "Reservar sesión". Background gradient o imagen. |

### src/features/auth/

| Archivo | Descripción |
|---------|-------------|
| `LoginPage.tsx` | Página de login. AuthLayout. Contiene LoginForm + OAuth2Buttons + links (registro, forgot). SEO: title "Iniciar Sesión". Redirect si ya autenticado. |
| `RegisterPage.tsx` | Página de registro. AuthLayout. Contiene RegisterForm + OAuth2Buttons + link a login. Password strength meter. Términos y condiciones link. |
| `ForgotPasswordPage.tsx` | Página "Olvidé mi contraseña". Input email. Envía link de reset. Feedback visual: email enviado. Link volver a login. |
| `ResetPasswordPage.tsx` | Página para establecer nueva contraseña. Token desde URL params. Valida token al montar (redirect si expirado). Inputs: new password + confirm. |
| `VerifyEmailPage.tsx` | Página de verificación de email. Token desde URL params. Llama API automáticamente al montar. Muestra éxito/error. CTA: "Ir al inicio". |
| `components/OAuth2Buttons.tsx` | Botones de login social: Google (branded button) + Facebook. Inician flujo OAuth2 redirect. Separados por "o continuar con". |
| `components/AuthCard.tsx` | Card wrapper para formularios de auth. Logo en top, título, descripción, children (form). Consistent styling en todas las páginas de auth. |

### src/features/home/

| Archivo | Descripción |
|---------|-------------|
| `HomePage.tsx` | Página de inicio para usuarios (post-landing o default). Carrusel principal → Banners → NewArrivals → BestSellers → RecommendedProducts → PromotionBanner. Personalizado si autenticado. |
| `components/Carousel.tsx` | Carrusel hero del homepage. Slides configurados desde admin (API). Autoplay 5s. Controles prev/next. Dots. Touch swipe. |
| `components/Banners.tsx` | Grid de banners promocionales (2-3 columnas). Imágenes con link. Configurados desde admin. Responsive layout. |
| `components/NewArrivals.tsx` | Sección "Recién llegados". Últimos productos agregados. Carrusel horizontal. ProductCard con badge "Nuevo". |
| `components/BestSellers.tsx` | Sección "Más vendidos". Productos con más ventas. Grid o carrusel. ProductCard con badge de posición (#1, #2...). |
| `components/RecommendedProducts.tsx` | "Recomendado para ti". Solo para usuarios autenticados. Basado en historial y preferencias. Fallback a "populares" si no hay data. |
| `components/PromotionBanner.tsx` | Banner de promoción activa. Countdown timer si tiene fecha fin. CTA con link. Dismissible. Background colorido/imagen. |

### src/features/catalog/

| Archivo | Descripción |
|---------|-------------|
| `pages/CatalogPage.tsx` | Página principal del catálogo. Layout: FilterSidebar (desktop) + ProductGrid + SortDropdown + Pagination. Mobile: filtros en Sheet. URL params para filtros persistentes (?category=&price=&sort=). Infinite scroll opción. |
| `pages/CategoryPage.tsx` | Página de categoría específica. Muestra breadcrumb, descripción de categoría, subcategorías, productos filtrados. SEO con meta tags de categoría. |
| `components/ProductGrid.tsx` | Grid responsive de ProductCards. Columnas: 2 (mobile), 3 (tablet), 4 (desktop). Loading state con Skeletons. Empty state si no hay resultados. |
| `components/ProductCard.tsx` | Card de producto para listados. Imagen (lazy, hover zoom), título, autor, precio (original + descuento), rating (estrellas), badge (nuevo/descuento/agotado), botón agregar al carrito (quick add), ícono wishlist. |
| `components/FilterSidebar.tsx` | Panel lateral de filtros. Secciones: Categorías (tree), Precio (range slider), Rating (estrellas), Tipo (checkboxes), Autor, Editorial, Tags. "Aplicar" y "Limpiar todo". Sticky en desktop. |
| `components/SortDropdown.tsx` | Dropdown de ordenamiento: Relevancia, Precio asc/desc, Más nuevos, Más vendidos, Mejor calificados. Actualiza URL params. |
| `components/PriceRangeFilter.tsx` | Dual slider para filtro de precio min-max. Inputs numéricos vinculados. Muestra rango seleccionado formateado con moneda. |
| `components/CategoryTree.tsx` | Árbol de categorías expandible/colapsable. Niveles: categoría → subcategoría. Conteo de productos por categoría. Active state en seleccionada. |

### src/features/product/

| Archivo | Descripción |
|---------|-------------|
| `ProductDetailPage.tsx` | Página de detalle de producto. Fetch por slug. Layout: Gallery + Info side-by-side (desktop), stacked (mobile). Tabs debajo: Descripción, Especificaciones, Reseñas. RelatedProducts al final. SEO + Structured Data (Schema.org Product). |
| `components/ProductGallery.tsx` | Galería del producto. Imagen principal grande + thumbnails strip debajo. Click para ampliar (lightbox). Zoom en hover (desktop). Swipe (mobile). Badge de descuento sobre imagen. |
| `components/ProductInfo.tsx` | Panel derecho info: título, autor (link), rating + review count, precio (original tachado + precio actual si descuento), disponibilidad, tipo (físico/digital/audio), VariantSelector, QuantitySelector, AddToCartButton, wishlist button. |
| `components/ProductTabs.tsx` | Tabs de contenido: "Descripción" (HTML renderizado), "Detalles" (tabla key-value: ISBN, páginas, editorial, idioma, dimensiones), "Reseñas" (ReviewList + ReviewForm). Lazy load del tab activo. |
| `components/ReviewList.tsx` | Lista de reseñas paginadas. Cada review: avatar, nombre, rating, fecha, título, contenido, pros/cons, badge "compra verificada", botón "útil". Filtro por rating. Ordenar por reciente/útil. |
| `components/RelatedProducts.tsx` | Carrusel horizontal de productos relacionados (misma categoría, mismo autor). 4-6 items. ProductCard simplificada. "Quizás te interese". |
| `components/AddToCartButton.tsx` | Botón "Agregar al carrito". States: idle, loading (spinner), success (check + "Agregado!"). Disabled si out of stock. Animación al agregar. Dispatch a cartSlice + mutation a API. |
| `components/QuantitySelector.tsx` | Selector de cantidad: botones -/+ con input numérico al centro. Min 1, max stock disponible. Disabled en extremos. |
| `components/VariantSelector.tsx` | Selector de variantes del producto (ej: Tapa dura / Tapa blanda). Chips/buttons seleccionables. Actualiza precio y stock al cambiar. |

### src/features/cart/

| Archivo | Descripción |
|---------|-------------|
| `CartPage.tsx` | Página del carrito de compras. Layout: CartItemList + CartSummary sidebar. EmptyCart si vacío. Link "Seguir comprando". Botón "Ir a pagar". |
| `components/CartItemList.tsx` | Lista de items en el carrito. Cada CartItem con controles. "Eliminar todos" button. |
| `components/CartItem.tsx` | Fila de item: imagen (thumbnail), título, variante, precio unitario, QuantitySelector, subtotal, botón eliminar (trash icon), botón mover a wishlist. |
| `components/CartSummary.tsx` | Resumen lateral: subtotal, descuento (si cupón), impuestos estimados, envío estimado, total. CouponInput. Botón "Proceder al pago". Iconos de métodos de pago aceptados. |
| `components/CouponInput.tsx` | Input + botón "Aplicar cupón". Loading state. Si válido: muestra código + descuento aplicado + botón remover. Si inválido: error message. |
| `components/EmptyCart.tsx` | Estado vacío del carrito. Ilustración, texto "Tu carrito está vacío", botón "Explorar catálogo". Productos sugeridos debajo (recomendaciones). |

### src/features/checkout/

| Archivo | Descripción |
|---------|-------------|
| `pages/CheckoutPage.tsx` | Página de checkout multi-step. Stepper visual: Envío → Pago → Revisión. Progreso persistido en state. ProtectedRoute (requiere auth). OrderSummary sidebar fijo. Validación por step antes de avanzar. |
| `pages/PaymentSuccessPage.tsx` | Página post-pago exitoso. Confetti animation. Icono check. Número de orden. Resumen breve. Botones: "Ver pedido", "Seguir comprando". Email de confirmación enviado. |
| `pages/PaymentFailurePage.tsx` | Página post-pago fallido. Icono error. Mensaje explicativo. Botones: "Reintentar", "Elegir otro método", "Contactar soporte". No pierde datos del checkout. |
| `components/ShippingStep.tsx` | Step 1: seleccionar/agregar dirección de envío. Lista de direcciones guardadas (radio). Formulario inline para nueva dirección. Selector de método de envío (estándar, express). Cálculo de costo en tiempo real. |
| `components/PaymentStep.tsx` | Step 2: seleccionar método de pago. PaymentMethodSelector. Información del proveedor. Redirect notice para checkout externo (MercadoPago/PayPal). |
| `components/ReviewStep.tsx` | Step 3: revisión final. Muestra: items, dirección, método envío, método pago, totales desglosados. Checkbox "Acepto términos". Botón "Confirmar y Pagar". Editar cada sección. |
| `components/OrderSummary.tsx` | Sidebar sticky con resumen: items (colapsable), subtotal, envío, descuento, impuestos, total. Siempre visible durante checkout. |
| `components/PaymentMethodSelector.tsx` | Selección de proveedor/método: MercadoPago (icono + descripción), PayPal, Transferencia bancaria. Radio buttons con info. Badge "Recomendado" en preferido. |

### src/features/orders/

| Archivo | Descripción |
|---------|-------------|
| `pages/OrdersPage.tsx` | "Mis Pedidos". Lista paginada de órdenes del usuario. Filtros: estado, fecha. Cada orden como OrderCard. Empty state si no hay pedidos. |
| `pages/OrderDetailPage.tsx` | Detalle de un pedido. Secciones: estado actual (timeline), items comprados, dirección, pago, factura (download), acciones (cancelar si aplica). |
| `components/OrderCard.tsx` | Card resumen de orden: número, fecha, estado (badge color), total, miniatura del primer producto, cantidad de items, botón "Ver detalle". |
| `components/OrderTimeline.tsx` | Timeline vertical del pedido: Confirmado → Pagado → Preparando → Enviado → Entregado. Cada step con fecha/hora, ícono, estado (completado/actual/pendiente). Tracking number si enviado. |
| `components/InvoiceDownload.tsx` | Botón "Descargar factura" que obtiene PDF del backend (URL firmada). Loading state durante generación. Icono PDF. |

### src/features/profile/

| Archivo | Descripción |
|---------|-------------|
| `pages/ProfilePage.tsx` | Página de perfil con ProfileSidebar + contenido principal. Tabs/rutas anidadas: Datos personales, Direcciones, Seguridad, Preferencias. |
| `pages/AddressesPage.tsx` | Gestión de direcciones. Lista de direcciones guardadas (cards). Botón "Agregar nueva". Editar/Eliminar cada una. Marcar como default. |
| `pages/SecurityPage.tsx` | Cambio de contraseña (ChangePasswordForm). Sesiones activas (lista con device, IP, fecha). Botón "Cerrar otras sesiones". 2FA toggle (preparado). |
| `pages/PreferencesPage.tsx` | Preferencias: idioma, moneda, tema (light/dark/auto), notificaciones (email, push, newsletter). Switches para cada tipo de notificación. |
| `components/ProfileSidebar.tsx` | Sidebar de navegación del perfil: avatar editable, nombre, email, links a secciones (Perfil, Direcciones, Seguridad, Preferencias, Pedidos, Biblioteca). |
| `components/AvatarUpload.tsx` | Componente de subida de avatar. Click para abrir file picker. Preview circular. Crop dialog. Upload a API. Loading/success feedback. |

### src/features/library/

| Archivo | Descripción |
|---------|-------------|
| `pages/LibraryPage.tsx` | "Mi Biblioteca Digital". Grid de contenido comprado/suscrito: ebooks, audiolibros, cursos. Filtros por tipo. Progreso de lectura/escucha. Search dentro de biblioteca. |
| `pages/EbookReaderPage.tsx` | Lector de ebooks in-app. Renderiza PDF o EPUB. Controles: zoom, página anterior/siguiente, bookmarks, modo nocturno, font size. Progress tracking. Fullscreen option. |
| `pages/AudiobookPlayerPage.tsx` | Player de audiolibro fullscreen. Portada grande, controles de audio (play, seek, velocidad, 15s back/forward), capítulos, sleep timer, bookmark. |
| `components/LibraryGrid.tsx` | Grid de items de biblioteca. Cada item: portada, título, tipo (badge), progreso (bar), botón "Continuar" o "Descargar". |
| `components/DownloadButton.tsx` | Botón para descargar contenido digital. Verifica acceso (compra/suscripción). Progress de descarga. Manejo de error (token expirado → re-auth). |

### src/features/podcast/

| Archivo | Descripción |
|---------|-------------|
| `pages/PodcastListPage.tsx` | Página de podcasts. Lista de shows/podcasts disponibles. Filtros por categoría. Último episodio destacado. Links a plataformas (Spotify, Apple). |
| `pages/PodcastDetailPage.tsx` | Detalle de un podcast. Portada, descripción, host. Lista de temporadas con episodios. Botón suscribirse (RSS). Platform links. |
| `pages/EpisodePage.tsx` | Detalle de episodio. Player de audio/video prominente. Show notes (HTML). Transcripción (expandible). Episodios anteriores/siguientes. Share buttons. |
| `components/PodcastCard.tsx` | Card de podcast: portada, título, descripción corta, episode count, último episodio fecha. Click navega a detalle. |
| `components/EpisodeList.tsx` | Lista de episodios con: número, título, fecha, duración, botón play inline. Agrupados por temporada (accordion). |
| `components/PodcastPlayer.tsx` | Player de audio persistente (mini-player bottom bar). Play/pause, progress, duration, título del episodio. Click expand para player completo. Persiste entre navegaciones. |
| `components/PlatformLinks.tsx` | Botones/links a plataformas externas: "Escuchar en Spotify", "Apple Podcasts", "YouTube", "Google Podcasts", "RSS". Iconos de cada plataforma. |

### src/features/blog/

| Archivo | Descripción |
|---------|-------------|
| `pages/BlogListPage.tsx` | Listado del blog. Post destacado (hero grande) + grid de posts recientes. Sidebar: categorías, tags populares, posts populares. Paginación. |
| `pages/BlogPostPage.tsx` | Artículo completo. Contenido HTML renderizado. Autor (bio card), fecha, readingTime, categoría, tags. Share buttons. Comentarios (CommentSection). Artículos relacionados. SEO: OG tags, structured data Article. |
| `components/PostCard.tsx` | Card de post: imagen cover, categoría badge, título, excerpt (2 líneas), autor avatar+nombre, fecha, readingTime. Hover: scale image. |
| `components/PostContent.tsx` | Renderiza contenido HTML del post de forma segura (sanitizado). Styles para headings, listas, blockquotes, imágenes, código. Table of Contents auto-generado. |
| `components/CommentSection.tsx` | Sección de comentarios. Lista de comentarios (anidados con replies). Formulario para nuevo comentario (requiere auth). Paginación "cargar más". |
| `components/BlogSidebar.tsx` | Sidebar del blog: search, categorías (con count), tags cloud, posts populares (mini cards), newsletter subscribe. Sticky en desktop. |
| `components/TagCloud.tsx` | Nube de tags con tamaños proporcionales a popularidad. Click filtra posts por tag. Colores variados. |

### src/features/counseling/

| Archivo | Descripción |
|---------|-------------|
| `pages/CounselingPage.tsx` | Página de asesorías matrimoniales. Hero + descripción del servicio + asesores disponibles (CounselorCards) + testimonios + FAQ + CTA. |
| `pages/BookingPage.tsx` | Página de reserva. Steps: elegir asesor → elegir fecha (CalendarView) → elegir horario (TimeSlotPicker) → confirmar + pagar. Protected route. |
| `pages/MySessionsPage.tsx` | "Mis sesiones". Lista de bookings: próximos (con link a videollamada si ±15min), pasados (historial). Filtros por estado. |
| `components/CalendarView.tsx` | Calendario mensual para seleccionar fecha. Días disponibles resaltados (verde). Días sin disponibilidad deshabilitados. Navegación mes a mes. |
| `components/TimeSlotPicker.tsx` | Grid de horarios disponibles para la fecha seleccionada. Slots de 1h. Click selecciona. Muestra zona horaria. Loading al cambiar fecha. |
| `components/CounselorCard.tsx` | Card del asesor: foto, nombre, especialidades (badges), experiencia, rating, precio, botón "Reservar". |
| `components/BookingConfirmation.tsx` | Resumen de la reserva antes de confirmar: asesor, fecha, hora, plataforma, precio. Botones: "Confirmar y Pagar", "Cancelar". |

### src/features/courses/

| Archivo | Descripción |
|---------|-------------|
| `pages/CoursesPage.tsx` | Catálogo de cursos. Grid de CourseCards con filtros (nivel, categoría, precio, gratuito). Sort por popularidad, precio, recientes. |
| `pages/CourseDetailPage.tsx` | Detalle de curso. Hero: título, instructor, rating, precio, CTA "Inscribirme". Secciones: qué aprenderás (objectives), curriculum (CurriculumList), instructor bio, reseñas, cursos relacionados. |
| `pages/LessonPage.tsx` | Vista de lección individual. Video/contenido principal. Sidebar: curriculum con progreso (checkmarks). Botón "Marcar como completada". Navegación prev/next lesson. |
| `pages/MyCoursesPage.tsx` | "Mis cursos". Grid de cursos inscritos con ProgressBar. Filtros: en progreso, completados. Botón "Continuar" al último lesson visto. Certificado si completado. |
| `components/CourseCard.tsx` | Card de curso: portada, título, instructor, nivel badge, rating, precio (o "Gratis"), duración, lecciones count. CTA hover. |
| `components/CurriculumList.tsx` | Lista del contenido del curso. Módulos (accordion) → Lecciones (items). Cada lección: ícono (video/text/quiz), título, duración, lock icon si no tiene acceso, check si completada. Preview label si es gratuita. |
| `components/ProgressBar.tsx` | Barra de progreso del curso. Porcentaje + visual bar. Color: gris (0%), azul (parcial), verde (completado). Label "X de Y lecciones". |
| `components/VideoLesson.tsx` | Player de video para lecciones. Controles standard. Marca punto de continuación. Auto-mark complete al terminar. Picture-in-Picture. |

### src/features/contact/

| Archivo | Descripción |
|---------|-------------|
| `ContactPage.tsx` | Página de contacto. Formulario (ContactForm) + info de contacto (ContactInfo) + mapa (MapEmbed). Layout: 2 columnas desktop, stacked mobile. |
| `components/ContactInfo.tsx` | Información: email, teléfono, dirección, horarios de atención, redes sociales. Iconos + click-to-call/email. |
| `components/MapEmbed.tsx` | Mapa embebido (Google Maps o Leaflet). Marker en ubicación de la librería. Responsive. Lazy loaded. |

### src/features/faq/

| Archivo | Descripción |
|---------|-------------|
| `FaqPage.tsx` | Página de preguntas frecuentes. Categorías de FAQ + Accordion con preguntas/respuestas. Barra de búsqueda dentro del FAQ. CTA "¿No encontraste respuesta? Contáctanos". |
| `components/FaqAccordion.tsx` | Accordion de FAQ agrupado por categoría: Compras, Envíos, Devoluciones, Cuenta, Suscripciones, Asesorías. Cada pregunta expandible con respuesta formatted. |

### src/features/policies/

| Archivo | Descripción |
|---------|-------------|
| `pages/PrivacyPolicyPage.tsx` | Política de privacidad. Contenido legal: recopilación de datos, uso, almacenamiento, derechos del usuario, cookies, terceros. Formatted con headings para navegación. |
| `pages/TermsPage.tsx` | Términos y condiciones. Contenido legal: uso de la plataforma, compras, devoluciones, propiedad intelectual, limitaciones. |
| `pages/RefundPolicyPage.tsx` | Política de reembolso. Plazos, condiciones, proceso, excepciones (productos digitales), contacto para reclamos. |
| `pages/CookiePolicyPage.tsx` | Política de cookies. Tipos de cookies usadas, propósito, cómo desactivar, terceros (analytics, ads). Tabla de cookies. |

### src/features/subscription/

| Archivo | Descripción |
|---------|-------------|
| `pages/PricingPage.tsx` | Página de planes y precios. PricingCards lado a lado (3 planes). PlanComparison table debajo. Toggle mensual/anual (ahorro). CTA por plan. FAQ de suscripciones. |
| `pages/SubscriptionManagePage.tsx` | Gestión de suscripción activa. Plan actual, próxima facturación, historial de pagos, botones: cambiar plan, cancelar, actualizar método de pago. Protected route. |
| `components/PricingCard.tsx` | Card de plan: nombre, precio, billing cycle, features list (checkmarks), CTA button. Variant "popular" (highlighted, badge). |
| `components/PlanComparison.tsx` | Tabla comparativa de planes. Rows: features. Columns: planes (Free, Basic, Premium). Check/cross por celda. Sticky header. |

### src/features/chat/

| Archivo | Descripción |
|---------|-------------|
| `ChatWidget.tsx` | Widget flotante de chat (bottom-right). Botón circular que abre ChatWindow. Badge con mensajes sin leer. Persiste entre páginas. |
| `components/ChatBubble.tsx` | Burbuja de mensaje individual. Variantes: sent (derecha, color), received (izquierda, gris). Timestamp, read status (ticks). Attachment preview. |
| `components/ChatWindow.tsx` | Ventana de chat expandida. Header (agente info), mensajes scrollable, input abajo. WebSocket connection. Typing indicator. Auto-scroll a último mensaje. |
| `components/MessageInput.tsx` | Input de mensaje: textarea auto-resize, botón enviar, botón adjuntar archivo. Enter para enviar, Shift+Enter para nueva línea. |

### src/features/notifications/

| Archivo | Descripción |
|---------|-------------|
| `NotificationsPage.tsx` | Página completa de notificaciones. Lista paginada. Filtros: todas, no leídas, tipo. "Marcar todas como leídas". Click navega según tipo (orden → detalle orden). |
| `components/NotificationItem.tsx` | Item de notificación: ícono (por tipo), título, descripción, tiempo relativo ("hace 2h"), dot azul si no leída. Click marca como leída + navega. |
| `components/NotificationDropdown.tsx` | Dropdown desde el bell icon del header. Últimas 5 notificaciones. Link "Ver todas". Badge con unread count. Real-time updates via WebSocket. |

### src/features/search/

| Archivo | Descripción |
|---------|-------------|
| `SearchResultsPage.tsx` | Página de resultados de búsqueda. Query desde URL params. Tabs: Todos, Productos, Blog. Filtros laterales. Resultados con highlight de término. "¿Quisiste decir...?" sugerencias. |
| `components/SearchFilters.tsx` | Filtros contextuales para resultados: tipo, categoría, rango precio, rating. Actualiza URL params. Counts por facet. |
| `components/SearchResults.tsx` | Lista de resultados renderizada. Cada resultado: imagen, título (highlighted), excerpt (highlighted), tipo badge, metadata (precio/fecha). |
| `components/Autocomplete.tsx` | Dropdown de autocompletado bajo el SearchBar. Muestra mientras escribe (debounce 300ms). Categorías: Productos, Categorías, Autores. Max 10 sugerencias. Keyboard navigation. |

---

## 8. FEATURES - ADMIN PANEL

### src/features/admin/dashboard/

| Archivo | Descripción |
|---------|-------------|
| `AdminDashboardPage.tsx` | Dashboard principal del admin. Grid de widgets: KpiCards (fila superior) + SalesChart + RecentOrders + TopProducts + UsersWidget + OrdersWidget. Selector de período (hoy, 7 días, 30 días, año). Refresh automático cada 5 min. AdminLayout. |
| `components/SalesChart.tsx` | Gráfica de ventas (line/bar chart con Recharts o Chart.js). Ejes: tiempo vs ingresos. Toggle: diario/semanal/mensual. Tooltip con detalles. Comparación con período anterior (línea punteada). |
| `components/RevenueWidget.tsx` | Widget de ingresos: monto total del período, porcentaje de cambio vs anterior (flecha verde/roja), mini sparkline chart. |
| `components/OrdersWidget.tsx` | Widget de pedidos: total del período, desglose por estado (pending, processing, shipped, delivered). Mini donut chart. Link "Ver todos". |
| `components/UsersWidget.tsx` | Widget de usuarios: nuevos registros del período, total activos, crecimiento %. Mini area chart. |
| `components/KpiCards.tsx` | Fila de 4-6 cards KPI: Ingresos, Pedidos, Usuarios nuevos, Productos vendidos, Tasa de conversión, Ticket promedio. Cada uno con valor, cambio %, ícono, color. |
| `components/RecentOrders.tsx` | Tabla compacta de últimos 5-10 pedidos. Columnas: #, cliente, total, estado (badge), fecha. Link a detalle. |
| `components/TopProducts.tsx` | Lista de top 5 productos más vendidos del período. Imagen, nombre, unidades vendidas, revenue. |

### src/features/admin/users/

| Archivo | Descripción |
|---------|-------------|
| `AdminUsersPage.tsx` | Gestión de usuarios. UserTable con búsqueda, filtros (rol, estado, fecha registro), paginación. Acciones: ver, editar rol, activar/desactivar, eliminar. Export button. |
| `components/UserTable.tsx` | Tabla de usuarios. Columnas: avatar, nombre, email, rol (badge), estado (activo/inactivo), fecha registro, last login, acciones. Sorting por columna. Checkbox multi-select para bulk actions. |
| `components/UserForm.tsx` | Formulario para editar usuario (admin): cambiar rol, activar/desactivar, notas internas. No edita datos personales del usuario. |
| `components/RoleManager.tsx` | Componente para asignar/cambiar rol de un usuario. Select de roles disponibles + confirmación. Muestra permisos asociados al rol seleccionado. |

### src/features/admin/products/

| Archivo | Descripción |
|---------|-------------|
| `AdminProductsPage.tsx` | Gestión de productos. ProductTable + búsqueda + filtros (categoría, tipo, estado, stock). Botón "Crear producto". Bulk actions: activar, desactivar, eliminar. |
| `AdminProductFormPage.tsx` | Formulario de creación/edición de producto. Tabs: General (título, tipo, descripción RichText), Pricing (precio, descuento), Media (galería upload), Inventory (stock, SKU), SEO (meta tags), Relations (categoría, autor, editorial, tags). Validación completa. |
| `components/ProductTable.tsx` | Tabla de productos. Columnas: imagen, título, tipo (badge), categoría, precio, stock, estado, rating, acciones (editar, duplicar, eliminar). |
| `components/ProductForm.tsx` | Formulario reutilizable de producto con todos los campos organizados en secciones/tabs. Integra: FileUpload para imágenes, RichTextEditor para descripción, Select para categoría/autor/editorial, TagInput para tags. |
| `components/StockManager.tsx` | Widget de gestión de inventario: stock actual, umbral bajo, historial de movimientos, botón "Agregar stock", alertas de bajo stock. |
| `components/VariantManager.tsx` | Gestión de variantes del producto. Tabla editable: nombre variante, SKU, precio diferencial, stock. Botón agregar variante. Drag to reorder. |

### src/features/admin/orders/

| Archivo | Descripción |
|---------|-------------|
| `AdminOrdersPage.tsx` | Gestión de pedidos. OrderTable + filtros (estado, fecha, cliente, método pago). Stats bar (total pendientes, en proceso, completados hoy). Export CSV/Excel. |
| `AdminOrderDetailPage.tsx` | Detalle de orden admin: items, cliente info, direcciones, timeline, pagos, acciones (cambiar estado, agregar tracking, emitir reembolso, reenviar factura, agregar nota). |
| `components/OrderTable.tsx` | Tabla de órdenes. Columnas: #, cliente, items count, total, estado (badge color), pago status, fecha, acciones. Multi-select para bulk status update. |
| `components/OrderStatusManager.tsx` | Widget para cambiar estado de una orden. Select de estados válidos (según transiciones permitidas). Input tracking number (si SHIPPED). Nota interna. Botón confirmar. Envía notificación al cliente. |

### src/features/admin/podcasts/

| Archivo | Descripción |
|---------|-------------|
| `AdminPodcastsPage.tsx` | Gestión de podcasts y episodios. EpisodeTable + filtros (podcast, temporada, estado). Botón "Nuevo episodio". Stats: total episodios, total reproducciones. |
| `AdminEpisodeFormPage.tsx` | Formulario crear/editar episodio. Campos: título, podcast (select), temporada, número, descripción, show notes (RichText), audio upload (progress), video URL, imagen, programar fecha, tags. |
| `components/EpisodeTable.tsx` | Tabla de episodios. Columnas: #, título, podcast, temporada, duración, plays, estado (badge), fecha pub, acciones. Sorting. |
| `components/EpisodeForm.tsx` | Formulario reutilizable. File upload para audio con progress bar y preview player. Integración con MediaService. |

### src/features/admin/courses/

| Archivo | Descripción |
|---------|-------------|
| `AdminCoursesPage.tsx` | Gestión de cursos. CourseTable + filtros. Botón "Nuevo curso". Stats: total cursos, inscripciones, revenue por cursos. |
| `AdminCourseFormPage.tsx` | Formulario crear/editar curso. Tabs: Info general, Curriculum (LessonManager), Pricing, Settings. Drag & drop para reordenar módulos y lecciones. |
| `components/CourseTable.tsx` | Tabla de cursos. Columnas: portada, título, instructor, nivel, precio, inscripciones, rating, estado, acciones. |
| `components/CourseForm.tsx` | Formulario con campos: título, descripción, portada, categoría, nivel, precio, objetivos (list input), prerequisites. |
| `components/LessonManager.tsx` | Gestor visual de curriculum. Árbol: Módulos → Lecciones. Drag to reorder. Inline edit título. Botones: agregar módulo, agregar lección. Upload video por lección. Preview flag. |

### src/features/admin/blog/

| Archivo | Descripción |
|---------|-------------|
| `AdminBlogPage.tsx` | Gestión de posts del blog. PostTable + filtros (estado, categoría, autor). Botón "Nuevo post". Stats: total posts, vistas totales, comentarios pendientes. |
| `AdminPostFormPage.tsx` | Editor de post completo. RichTextEditor full-featured (imágenes, videos, headings, links). Sidebar: categoría, tags, SEO fields, featured image, excerpt, programar publicación. Preview mode. |
| `components/PostTable.tsx` | Tabla de posts. Columnas: título, autor, categoría, estado, vistas, comentarios, fecha pub, acciones (editar, preview, duplicar, eliminar). |
| `components/PostForm.tsx` | Formulario de post con RichTextEditor, campos de metadata, SEO panel (title, description, keywords), scheduling. |

### src/features/admin/categories/

| Archivo | Descripción |
|---------|-------------|
| `AdminCategoriesPage.tsx` | Gestión de categorías. Vista árbol jerárquico (tree view) o tabla. CRUD: crear, editar inline, reordenar (drag), eliminar (valida no tenga productos). |
| `components/CategoryTable.tsx` | Tabla de categorías con indentación visual para jerarquía. Columnas: ícono, nombre, slug, productos count, orden, acciones. Drag to reorder. |
| `components/CategoryForm.tsx` | Formulario crear/editar categoría: nombre, descripción, padre (select tree), ícono, orden. Validación: nombre único en mismo nivel. |

### src/features/admin/coupons/

| Archivo | Descripción |
|---------|-------------|
| `AdminCouponsPage.tsx` | Gestión de cupones. CouponTable + filtros (estado, tipo, vigencia). Botón "Crear cupón". Stats: cupones activos, usos totales, ahorro generado. |
| `components/CouponTable.tsx` | Tabla de cupones. Columnas: código, tipo (badge), valor, uso/límite, vigencia, estado, acciones (editar, desactivar, copiar código). |
| `components/CouponForm.tsx` | Formulario crear/editar cupón: código (auto-generate option), tipo (% / fijo), valor, monto mínimo, límite usos, por usuario, fechas vigencia, productos/categorías aplicables. |

### src/features/admin/settings/

| Archivo | Descripción |
|---------|-------------|
| `AdminSettingsPage.tsx` | Configuración global de la plataforma. Tabs/secciones de settings. Cada sección auto-save o botón guardar. |
| `components/GeneralSettings.tsx` | Nombre de la tienda, logo, descripción, moneda default, idioma default, zona horaria, contacto. |
| `components/PaymentSettings.tsx` | Configuración de proveedores de pago: MercadoPago (keys), PayPal (client ID/secret), Stripe (keys), transferencia bancaria (datos cuenta). Toggle habilitar/deshabilitar cada uno. |
| `components/ShippingSettings.tsx` | Configuración de envíos: métodos activos, tarifas por defecto, umbral envío gratis, zonas, carriers. |
| `components/EmailSettings.tsx` | SMTP: host, port, user, password, from address, from name. Test email button. Templates preview. |
| `components/SeoSettings.tsx` | SEO global: site title template, meta description default, OG image default, Google Analytics ID, scripts header/footer. |

### src/features/admin/analytics/

| Archivo | Descripción |
|---------|-------------|
| `AdminAnalyticsPage.tsx` | Página de reportes y analytics. Tabs: Ventas, Usuarios, Productos. Selector de rango de fechas (DateRangePicker). Exportar botón (Excel/PDF). Gráficas interactivas. |
| `components/SalesReport.tsx` | Reporte de ventas: gráfica de ingresos por período, desglose por método de pago, por categoría de producto. Tabla resumen. Comparación con período anterior. |
| `components/UserReport.tsx` | Reporte de usuarios: registros por día (gráfica), desglose por fuente (directo, Google, Facebook), retención, usuarios activos vs registrados. |
| `components/ProductReport.tsx` | Reporte de productos: más vendidos, menos vendidos, por categoría, revenue por producto, stock rotación. |
| `components/ExportButton.tsx` | Botón con dropdown: "Exportar como Excel", "Exportar como PDF". Llama a API de generación. Loading state. Descarga automática al terminar. |

### src/features/admin/banners/

| Archivo | Descripción |
|---------|-------------|
| `AdminBannersPage.tsx` | Gestión de banners y carrusel del homepage. BannerTable + preview. Drag to reorder. Active/inactive toggle. |
| `components/BannerForm.tsx` | Formulario: imagen (upload con preview), título, subtítulo, link/CTA, posición, fechas activo, target page. Preview en tiempo real. |
| `components/BannerTable.tsx` | Tabla/grid de banners. Preview thumbnail, título, posición, estado, fechas, acciones. Sortable por drag. |

### src/features/admin/audit/

| Archivo | Descripción |
|---------|-------------|
| `AdminAuditPage.tsx` | Página de auditoría. AuditTable con filtros completos. Timeline view alternativo. Detalle expandible con diff. |
| `components/AuditTable.tsx` | Tabla de logs de auditoría. Columnas: timestamp, usuario, acción (badge), entidad, ID, IP. Expandir fila para ver before/after diff (highlighted). Filtros: usuario, acción, módulo, fecha. |
| `components/AuditFilters.tsx` | Panel de filtros avanzados: usuario (autocomplete), tipo de acción (multiselect), módulo, rango de fechas, IP. Botones aplicar/limpiar. |

### src/features/admin/payments/

| Archivo | Descripción |
|---------|-------------|
| `AdminPaymentsPage.tsx` | Gestión de pagos y transacciones. TransactionTable + stats (total cobrado, reembolsos, pendientes). Filtros por proveedor, estado, fecha. |
| `components/TransactionTable.tsx` | Tabla de transacciones. Columnas: ID, orden, monto, proveedor (ícono), método, estado (badge), fecha. Click para detalle con response del gateway. |
| `components/RefundManager.tsx` | Widget para procesar reembolso: monto (total o parcial), razón, método de devolución. Confirmación. Llama a PaymentService. Actualiza estado de orden. |

### src/features/admin/newsletter/

| Archivo | Descripción |
|---------|-------------|
| `AdminNewsletterPage.tsx` | Gestión de newsletter. Tabs: Suscriptores (tabla), Campañas (lista). Botón "Nueva campaña". Stats: total suscriptores, open rate promedio. |
| `components/SubscriberTable.tsx` | Tabla de suscriptores: email, nombre, fecha suscripción, estado (confirmed/unsubscribed), segmento. Export. |
| `components/CampaignForm.tsx` | Formulario de campaña: subject, contenido (RichTextEditor), segmento target, programar envío o enviar ahora. Preview email. Test send (a un email). |

---

## 9. SERVICES (Capa de Comunicación con la API)

### src/services/

| Archivo | Descripción |
|---------|-------------|
| `auth.service.ts` | Métodos: `login(credentials)`, `register(data)`, `logout()`, `refreshToken()`, `forgotPassword(email)`, `resetPassword(token, password)`, `verifyEmail(token)`, `changePassword(data)`, `getMe()`, `loginWithGoogle()`, `loginWithFacebook()`. Usa axios instance. Maneja tokens en localStorage. |
| `user.service.ts` | Métodos: `getProfile()`, `updateProfile(data)`, `uploadAvatar(file)`, `getAddresses()`, `createAddress(data)`, `updateAddress(id, data)`, `deleteAddress(id)`, `setDefaultAddress(id)`, `getPreferences()`, `updatePreferences(data)`. |
| `product.service.ts` | Métodos: `getProducts(params)`, `getProductBySlug(slug)`, `getFeatured()`, `getNewArrivals()`, `getBestSellers()`, `getRelated(id)`, `getByCategory(slug, params)`, `getByAuthor(slug, params)`, `createReview(productId, data)`. Params tipados con filtros. |
| `cart.service.ts` | Métodos: `getCart()`, `addItem(productId, quantity, variantId?)`, `updateQuantity(itemId, quantity)`, `removeItem(itemId)`, `clearCart()`, `applyCoupon(code)`, `removeCoupon()`, `getSummary()`, `mergeGuestCart(sessionId)`. |
| `order.service.ts` | Métodos: `createOrder(data)`, `getMyOrders(params)`, `getOrderById(id)`, `cancelOrder(id, reason)`, `getInvoice(id)`, `getTracking(id)`. Params incluye paginación y filtros. |
| `payment.service.ts` | Métodos: `createPayment(orderId, method, provider)`, `processPayment(paymentId, token)`, `getPaymentStatus(id)`, `getAvailableMethods()`. Maneja redirects de checkout externo. |
| `podcast.service.ts` | Métodos: `getPodcasts()`, `getPodcastBySlug(slug)`, `getEpisodes(podcastId, params)`, `getEpisodeBySlug(slug)`, `getLatestEpisodes()`, `recordPlay(episodeId)`, `getRssFeedUrl(slug)`. |
| `blog.service.ts` | Métodos: `getPosts(params)`, `getPostBySlug(slug)`, `getCategories()`, `getTags()`, `getPopular()`, `getComments(postId, params)`, `createComment(postId, data)`, `deleteComment(id)`. |
| `counseling.service.ts` | Métodos: `getCounselors()`, `getCounselorById(id)`, `getAvailability(counselorId, date)`, `createBooking(data)`, `getMyBookings(params)`, `cancelBooking(id, reason)`, `getMeetingLink(bookingId)`. |
| `course.service.ts` | Métodos: `getCourses(params)`, `getCourseBySlug(slug)`, `enroll(courseId)`, `getMyCourses()`, `getLesson(courseId, lessonId)`, `completeLesson(courseId, lessonId)`, `getProgress(courseId)`. |
| `notification.service.ts` | Métodos: `getNotifications(params)`, `getUnreadCount()`, `markAsRead(id)`, `markAllAsRead()`, `deleteNotification(id)`, `getPreferences()`, `updatePreferences(data)`, `registerDevice(token)`. |
| `search.service.ts` | Métodos: `search(query, filters, page)`, `autocomplete(query)`, `getFilters(query)`. Debounce integrado en autocomplete. |
| `media.service.ts` | Métodos: `upload(file, entityType?, entityId?)`, `uploadMultiple(files)`, `getById(id)`, `delete(id)`, `getDownloadUrl(id)`. Usa FormData para multipart. Progress callback para uploads. |
| `newsletter.service.ts` | Métodos: `subscribe(email, name?)`, `unsubscribe(token)`, `confirmSubscription(token)`. Endpoints públicos sin auth. |
| `chat.service.ts` | Métodos: `getRooms()`, `createRoom()`, `getMessages(roomId, params)`, `sendMessage(roomId, content, attachment?)`, `closeRoom(roomId)`, `connectWebSocket()`, `disconnectWebSocket()`. Gestión de WebSocket STOMP client. |
| `admin.service.ts` | Métodos: `getDashboard(period)`, `getConfig()`, `updateConfig(section, data)`, `getBanners()`, `createBanner(data)`, `getAuditLogs(params)`, `exportReport(type, params)`. Requiere rol ADMIN. |
| `analytics.service.ts` | Métodos: `trackEvent(type, data)`, `getDashboardStats(period)`, `getSalesReport(dateRange)`, `getUserReport(dateRange)`, `getProductReport(dateRange)`, `exportToExcel(reportId)`, `exportToPdf(reportId)`. |
| `recommendation.service.ts` | Métodos: `getForYou(limit)`, `getSimilar(productId, limit)`, `getTrending(limit)`, `getRecentlyViewed(limit)`, `getBasedOnCart()`, `recordView(productId)`. |
| `subscription.service.ts` | Métodos: `getPlans()`, `subscribe(planId, paymentMethod)`, `getMySubscription()`, `cancelSubscription(reason)`, `changePlan(newPlanId)`, `renewSubscription()`. |

---

## 10. HOOKS (Custom Hooks Reutilizables)

### src/hooks/

| Archivo | Descripción |
|---------|-------------|
| `useAuth.ts` | Hook de autenticación. Retorna: `user`, `isAuthenticated`, `isLoading`, `login()`, `logout()`, `register()`, `hasRole(role)`, `hasPermission(perm)`. Combina Redux state + AuthProvider context. |
| `useCart.ts` | Hook del carrito. Retorna: `items`, `itemCount`, `total`, `addItem()`, `removeItem()`, `updateQuantity()`, `clearCart()`, `applyCoupon()`, `isInCart(productId)`. Dispatches a Redux + mutations a API. |
| `useProducts.ts` | Hook con useQuery para productos. Retorna: `products`, `isLoading`, `error`, `filters`, `setFilters()`, `pagination`. Maneja query keys + params URL. Prefetch al hover. |
| `useOrders.ts` | Hook para órdenes del usuario. Retorna: `orders`, `isLoading`, `createOrder()`, `cancelOrder()`, `pagination`. useQuery + useMutation combinados. |
| `useSearch.ts` | Hook de búsqueda. Retorna: `query`, `setQuery()`, `results`, `suggestions`, `isSearching`, `filters`, `setFilters()`. Debounce interno. Autocomplete separado. |
| `usePodcasts.ts` | Hook para podcasts. Retorna: `podcasts`, `episodes`, `isLoading`, `currentEpisode`, `playEpisode()`, `isPlaying`. Integra con audio player state. |
| `useBlog.ts` | Hook para blog. Retorna: `posts`, `isLoading`, `categories`, `tags`, `pagination`. Filtros por categoría y tag. |
| `useCounseling.ts` | Hook para asesorías. Retorna: `counselors`, `availability`, `bookings`, `createBooking()`, `cancelBooking()`, `isLoading`. Maneja flujo de reserva. |
| `useCourses.ts` | Hook para cursos. Retorna: `courses`, `myCourses`, `enroll()`, `completeLesson()`, `progress`, `isLoading`. |
| `useNotifications.ts` | Hook de notificaciones. Retorna: `notifications`, `unreadCount`, `markAsRead()`, `markAllAsRead()`. Escucha WebSocket para real-time. |
| `useTheme.ts` | Hook de tema. Retorna: `theme` (light/dark/system), `setTheme()`, `isDark` (computed). Lee de ThemeProvider context. |
| `useDebounce.ts` | Hook genérico. `useDebounce(value, delay)` → retorna valor debounced. Para inputs de búsqueda. Limpia timeout al unmount. |
| `useInfiniteScroll.ts` | Hook con IntersectionObserver. Props: `callback`, `options`. Retorna `ref` (para el sentinel element). Dispara callback al entrar en viewport. Para infinite loading. |
| `useLocalStorage.ts` | Hook genérico. `useLocalStorage<T>(key, initialValue)` → `[value, setValue]`. Sincroniza state con localStorage. Parseo JSON. Type-safe. Cross-tab sync via storage event. |
| `useMediaQuery.ts` | Hook para responsive. `useMediaQuery(query)` → `boolean`. Ej: `useMediaQuery('(min-width: 768px)')`. Para lógica condicional por breakpoint. |
| `useClickOutside.ts` | Hook que detecta click fuera de un ref. `useClickOutside(ref, callback)`. Para cerrar dropdowns, modals, popovers. |
| `usePagination.ts` | Hook de paginación. Props: `totalItems`, `itemsPerPage`. Retorna: `currentPage`, `totalPages`, `setPage()`, `nextPage()`, `prevPage()`, `pageItems`. |
| `useToast.ts` | Hook para mostrar toasts. Retorna: `toast({ type, title, message, duration })`, `dismiss(id)`. Conecta con ToastProvider/store. |
| `useModal.ts` | Hook genérico para controlar modals. Retorna: `isOpen`, `open()`, `close()`, `toggle()`, `data` (payload asociado al modal). |
| `useWebSocket.ts` | Hook para conexión WebSocket STOMP. Props: `url`, `topics[]`. Retorna: `isConnected`, `messages`, `send()`, `subscribe()`, `disconnect()`. Reconnect automático. Auth token en headers. |
| `useAnalytics.ts` | Hook para tracking de eventos. Retorna: `trackPageView()`, `trackEvent(name, data)`, `trackPurchase(order)`. Envía a backend + Google Analytics. |

---

## 11. TYPES (Tipos TypeScript)

### src/types/

| Archivo | Descripción |
|---------|-------------|
| `index.ts` | Re-exporta todos los tipos para imports simplificados: `import { User, Product, Order } from '@/types'`. |
| `auth.types.ts` | Tipos: `User`, `Role`, `Permission`, `LoginRequest`, `RegisterRequest`, `AuthResponse`, `TokenResponse`, `PasswordResetRequest`, `Session`. |
| `user.types.ts` | Tipos: `UserProfile`, `Address`, `UpdateProfileRequest`, `UserPreferences`, `UserListItem` (admin). |
| `product.types.ts` | Tipos: `Product`, `ProductDetail`, `ProductListItem`, `Category`, `CategoryTree`, `Author`, `Publisher`, `Tag`, `Review`, `ProductVariant`, `ProductFilter`, `ProductType` (enum), `Coupon`, `Discount`. |
| `cart.types.ts` | Tipos: `Cart`, `CartItem`, `CartSummary`, `WishlistItem`, `AddToCartPayload`, `ApplyCouponPayload`. |
| `order.types.ts` | Tipos: `Order`, `OrderDetail`, `OrderItem`, `OrderStatus` (enum), `Invoice`, `Refund`, `OrderTracking`, `TrackingEvent`, `CreateOrderPayload`. |
| `payment.types.ts` | Tipos: `Payment`, `Transaction`, `PaymentMethod` (enum), `PaymentProvider` (enum), `PaymentStatus` (enum), `CreatePaymentPayload`. |
| `podcast.types.ts` | Tipos: `Podcast`, `Episode`, `Season`, `EpisodeStatus` (enum), `PodcastPlatform` (enum). |
| `blog.types.ts` | Tipos: `Post`, `PostDetail`, `BlogCategory`, `BlogTag`, `Comment`, `PostStatus` (enum), `CreatePostPayload`. |
| `counseling.types.ts` | Tipos: `Counselor`, `Booking`, `Schedule`, `TimeSlot`, `Availability`, `BookingStatus` (enum), `SessionType` (enum), `VideoPlatform` (enum), `CreateBookingPayload`. |
| `course.types.ts` | Tipos: `Course`, `CourseDetail`, `Module`, `Lesson`, `Enrollment`, `Progress`, `CourseLevel` (enum), `LessonType` (enum). |
| `notification.types.ts` | Tipos: `Notification`, `NotificationType` (enum), `NotificationChannel` (enum), `NotificationPreferences`. |
| `admin.types.ts` | Tipos: `DashboardSummary`, `KpiData`, `ChartData`, `SalesReport`, `AuditLog`, `AuditAction` (enum), `Banner`, `CarouselSlide`, `AppConfig`. |
| `api.types.ts` | Tipos genéricos de API: `ApiResponse<T>`, `PageResponse<T>`, `ErrorResponse`, `ValidationError`, `PaginationParams`, `SortParams`, `DateRange`. |
| `common.types.ts` | Tipos utilitarios: `Nullable<T>`, `Optional<T>`, `ID` (string UUID), `Timestamp`, `Money` ({amount, currency}), `FileUpload`, `SelectOption`, `BreadcrumbItem`. |

---

## 12. UTILS (Funciones Utilitarias)

### src/utils/

| Archivo | Descripción |
|---------|-------------|
| `format.utils.ts` | Funciones: `formatPrice(amount, currency, locale)` → "$1,299.00", `formatNumber(n)` → "1.2K", `formatPercentage(n)`, `formatPhoneNumber(phone, country)`, `pluralize(count, singular, plural)`. |
| `date.utils.ts` | Funciones: `formatDate(date, format)`, `formatRelative(date)` → "hace 2 horas", `formatDateRange(start, end)`, `isToday()`, `isPast()`, `isFuture()`, `addDays()`, `differenceInDays()`. Usa date-fns con locale. |
| `storage.utils.ts` | Funciones: `getItem<T>(key)`, `setItem<T>(key, value)`, `removeItem(key)`, `clearAll()`. Wrapper tipado sobre localStorage con JSON parse/stringify y error handling. Prefijo namespace "sc_". |
| `validation.utils.ts` | Funciones: `isValidEmail(email)`, `isStrongPassword(password)` → {score, feedback}, `isValidPhone(phone, country)`, `isValidISBN(isbn)`, `sanitizeHtml(html)`, `sanitizeInput(input)`. |
| `seo.utils.ts` | Funciones: `generateMetaTags(page, data)`, `generateStructuredData(type, data)`, `generateCanonicalUrl(path)`, `generateBreadcrumbSchema(items)`. Helpers para SEOHead component. |
| `currency.utils.ts` | Funciones: `convertCurrency(amount, from, to, rates)`, `getCurrencySymbol(code)`, `getExchangeRates()` (cached), `formatMoney(money)`. Soporte: USD, MXN, COP, ARS, EUR. |
| `image.utils.ts` | Funciones: `getOptimizedUrl(url, width, quality)`, `generateSrcSet(url, sizes[])`, `getPlaceholderUrl(width, height)`, `isValidImageType(file)`, `compressImage(file, maxSize)`. Para lazy images y upload. |

---

## 13. SCHEMAS (Validación con Zod)

### src/schemas/

| Archivo | Descripción |
|---------|-------------|
| `auth.schema.ts` | Schemas: `loginSchema` (email + password min 8), `registerSchema` (+ confirmPassword match, name required), `forgotPasswordSchema` (email), `resetPasswordSchema` (password + confirm + token), `changePasswordSchema` (current + new + confirm). Exporta tipos inferidos. |
| `product.schema.ts` | Schemas: `createProductSchema` (título, precio, tipo, categoría requeridos), `productFilterSchema` (todos opcionales), `reviewSchema` (rating 1-5, content min 20). Para admin forms. |
| `checkout.schema.ts` | Schemas: `shippingAddressSchema` (todos los campos de dirección requeridos), `paymentSchema` (método + proveedor), `orderSchema` (combina shipping + payment). Validación por step del checkout. |
| `profile.schema.ts` | Schemas: `updateProfileSchema` (firstName, lastName required, phone optional con formato), `addressSchema` (validación completa de dirección por país). |
| `contact.schema.ts` | Schemas: `contactSchema` (name, email, subject, message min 20 max 2000). Para formulario de contacto. |
| `blog.schema.ts` | Schemas: `createPostSchema` (title, content required, seo fields optional), `commentSchema` (content min 5 max 2000). Para admin blog y comentarios. |
| `counseling.schema.ts` | Schemas: `bookingSchema` (counselorId, date future, timeSlotId, sessionType required), `cancelBookingSchema` (reason required min 10). |

---

## 14. TESTS

### src/__tests__/

| Archivo | Descripción |
|---------|-------------|
| `setup.ts` | Setup de Vitest: configura jsdom, mocks globales (localStorage, matchMedia, IntersectionObserver, fetch), react-testing-library cleanup, MSW server setup. |
| `components/Button.test.tsx` | Tests del Button: renderiza correctamente, variantes visuales, loading state muestra spinner, disabled no responde a clicks, onClick se ejecuta. |
| `components/Input.test.tsx` | Tests del Input: renderiza con label, muestra error message, integración con react-hook-form, focus/blur events. |
| `components/Card.test.tsx` | Tests del Card: renderiza subcomponentes, acepta className custom, snapshot test. |
| `features/auth.test.tsx` | Tests de flujo auth: login form valida campos, submit llama al service, error muestra toast, redirect tras éxito. |
| `features/cart.test.tsx` | Tests del carrito: agregar item actualiza state, actualizar cantidad recalcula total, eliminar item, aplicar cupón. |
| `features/catalog.test.tsx` | Tests del catálogo: renderiza grid de productos, filtros actualizan query params, paginación funciona. |
| `features/checkout.test.tsx` | Tests del checkout: navega entre steps, valida antes de avanzar, submit crea orden. |
| `hooks/useAuth.test.ts` | Tests del hook: retorna user cuando autenticado, null cuando no, login actualiza state, logout limpia todo. |
| `hooks/useCart.test.ts` | Tests: addItem agrega al state, removeItem elimina, updateQuantity actualiza, total se recalcula. |
| `hooks/useProducts.test.ts` | Tests: fetch products on mount, loading state, error handling, refetch on filter change. |
| `services/auth.service.test.ts` | Tests: login envía POST correcto, maneja 401, register envía datos, refresh usa refresh token. Mock de axios. |
| `services/product.service.test.ts` | Tests: getProducts con params, getBySlug, error handling, response mapping. |
| `store/authSlice.test.ts` | Tests de reducer: setCredentials actualiza state, logout limpia state, initial state correcto. |
| `store/cartSlice.test.ts` | Tests de reducer: addItem, removeItem, updateQuantity, clearCart, cálculo de totales. |
| `utils/format.test.ts` | Tests: formatPrice con diferentes monedas/locales, formatNumber para K/M, edge cases (0, negative, null). |
| `utils/date.test.ts` | Tests: formatRelative (segundos, minutos, horas, días), formatDate con formatos, timezone handling. |

### cypress/e2e/ (E2E Tests)

| Archivo | Descripción |
|---------|-------------|
| `auth.cy.ts` | E2E login: visita /login, llena formulario, submit, verifica redirect a home, verifica header muestra usuario. Test registro. Test logout. |
| `cart.cy.ts` | E2E carrito: navega a producto, agrega al carrito, verifica badge, va al carrito, actualiza cantidad, elimina item. |
| `checkout.cy.ts` | E2E checkout: con carrito lleno, navega steps, llena dirección, selecciona pago, confirma orden. Verifica página éxito. |
| `catalog.cy.ts` | E2E catálogo: navega a /catalog, aplica filtros, verifica productos se filtran, sort cambia orden, paginación funciona. |
| `admin.cy.ts` | E2E admin: login como admin, navega dashboard, crea producto, edita, verifica en listado. |

### e2e/ (Playwright Tests)

| Archivo | Descripción |
|---------|-------------|
| `auth.spec.ts` | Playwright: login flow, registro, forgot password, verificación de sesión persistente, logout. Cross-browser. |
| `cart.spec.ts` | Playwright: agregar/eliminar items, persistencia tras reload, merge de guest cart al login. |
| `checkout.spec.ts` | Playwright: flujo completo compra e2e incluyendo mock de payment gateway. |
| `catalog.spec.ts` | Playwright: búsqueda, filtros, navegación de categorías, infinite scroll. Performance metrics. |
| `admin.spec.ts` | Playwright: CRUD productos, gestión pedidos, cambio de estado. Role-based access verification. |

---
