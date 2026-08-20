# Documentación de Arquitectura — Frontend

**Stack:** Vite + React 18 + Tailwind CSS + Lucide Icons  
**Auth:** JWT en cookies httpOnly con auto-refresh  
**Imágenes:** Cloudinary (upload directo desde frontend)  
**Estado:** Context API (Auth, Toast) + Custom Hooks

---

## Estructura de Archivos

```
client/
├── public/
│   └── favicon.ico
├── src/
│   ├── main.jsx                       # Entry point (BrowserRouter, Providers)
│   ├── App.jsx                        # Router principal con todas las rutas
│   ├── index.css                      # Tailwind + clases utilitarias custom
│   ├── components/
│   │   ├── admin/                     # Componentes del panel admin
│   │   │   ├── AdminStats.jsx         # Cards de estadísticas
│   │   │   ├── AppointmentsTable.jsx  # Tabla/cards de citas (responsive)
│   │   │   ├── AvailabilityCalendar.jsx # Calendario admin
│   │   │   ├── AvailabilityForm.jsx   # Form agregar horario
│   │   │   ├── MediaForm.jsx          # Form agregar Spotify/YouTube
│   │   │   └── MediaList.jsx          # Lista de multimedia con delete
│   │   ├── booking/                   # Sistema de agendamiento
│   │   │   ├── BookingForm.jsx        # Orquestador de 3 pasos
│   │   │   ├── BookingSteps.jsx       # Stepper visual
│   │   │   ├── CalendarPicker.jsx     # Calendario con días disponibles
│   │   │   ├── StepConfirmation.jsx   # Paso 4: éxito
│   │   │   ├── StepCoupleInfo.jsx     # Paso 2: datos de pareja
│   │   │   ├── StepReason.jsx         # Paso 3: confirmar + checkbox T&C
│   │   │   └── TimeSlotGrid.jsx       # Grid de horarios disponibles
│   │   ├── common/
│   │   │   └── CookieBanner.jsx       # Banner de consentimiento de cookies
│   │   ├── dashboard/                 # Panel del usuario
│   │   │   ├── AppointmentCard.jsx    # Card de cita con cancel
│   │   │   ├── AppointmentList.jsx    # Lista de citas
│   │   │   ├── MyBooks.jsx            # Libros comprados con descarga
│   │   │   └── UserStats.jsx          # Estadísticas del usuario
│   │   ├── landing/                   # Secciones del homepage
│   │   │   ├── CTASection.jsx         # Call to action
│   │   │   ├── HeroSection.jsx        # Hero con stats y CTA
│   │   │   ├── SpotifyCard.jsx        # Card con embed de Spotify
│   │   │   ├── SpotifySection.jsx     # Sección de podcasts
│   │   │   ├── TestimonialsSection.jsx # Testimonios
│   │   │   ├── YouTubeCard.jsx        # Card con player YouTube
│   │   │   └── YouTubeSection.jsx     # Sección de videos con filtros
│   │   ├── layout/                    # Estructura de la app
│   │   │   ├── AdminLayout.jsx        # Layout admin con sidebar responsive
│   │   │   ├── AdminRoute.jsx         # Guard: requiere rol ADMIN
│   │   │   ├── Footer.jsx             # Footer con links legales
│   │   │   ├── Header.jsx             # Header con nav + carrito badge + avatar
│   │   │   ├── MainLayout.jsx         # Layout público (Header + Outlet + Footer)
│   │   │   └── ProtectedRoute.jsx     # Guard: requiere autenticación
│   │   ├── store/
│   │   │   └── BookCard.jsx           # Card de libro (portada, precio, add to cart)
│   │   └── ui/                        # Componentes reutilizables
│   │       ├── Badge.jsx              # Badge de estado con colores
│   │       ├── Button.jsx             # Botón con variantes y loading
│   │       ├── Card.jsx               # Card con Header/Body/Footer
│   │       ├── ImageUpload.jsx        # Upload drag&drop a Cloudinary (imágenes)
│   │       ├── Input.jsx              # Input con label y error
│   │       ├── Logo.jsx               # Logo SVG de Somos Casa
│   │       ├── Modal.jsx              # Modal con overlay y animación
│   │       ├── PdfUpload.jsx          # Upload drag&drop a Cloudinary (PDF)
│   │       ├── Select.jsx             # Select con opciones
│   │       ├── Spinner.jsx            # Loading spinner
│   │       ├── TermsCheckbox.jsx      # Checkbox T&C + Privacidad (obligatorio)
│   │       ├── Textarea.jsx           # Textarea con label y error
│   │       └── Toast.jsx              # Notificaciones flotantes
│   ├── context/
│   │   ├── AuthContext.jsx            # Estado auth: user, login, logout, refresh
│   │   └── ToastContext.jsx           # Estado toasts: success, error, warning, info
│   ├── hooks/
│   │   ├── useAppointments.js         # CRUD citas del usuario
│   │   ├── useAuth.js                 # Hook del AuthContext
│   │   ├── useAvailability.js         # Fetch disponibilidad por fecha/mes
│   │   ├── useBooks.js                # Listado + detalle de libros
│   │   ├── useCalendar.js             # Navegación de calendario (mes/año)
│   │   ├── useCart.js                 # Carrito reactivo con sync global
│   │   ├── useMedia.js               # Fetch multimedia activa
│   │   ├── useOrders.js              # Pedidos del usuario + admin
│   │   └── useToast.js               # Hook del ToastContext
│   ├── pages/
│   │   ├── AdminAppointmentsPage.jsx  # Admin: gestión de citas
│   │   ├── AdminAvailabilityPage.jsx  # Admin: configurar horarios
│   │   ├── AdminBooksPage.jsx         # Admin: CRUD libros + upload portada/PDF
│   │   ├── AdminDashboardPage.jsx     # Admin: dashboard con stats
│   │   ├── AdminMediaPage.jsx         # Admin: gestión multimedia
│   │   ├── AdminOrdersPage.jsx        # Admin: pedidos + confirmar pago
│   │   ├── AdminSettingsPage.jsx      # Admin: cambio de contraseña + MFA
│   │   ├── AdminUsersPage.jsx         # Admin: usuarios + actividad
│   │   ├── BookDetailPage.jsx         # Detalle de libro + selector cantidad
│   │   ├── BookingPage.jsx            # Agendar asesoría
│   │   ├── CartPage.jsx               # Carrito de compras
│   │   ├── CheckoutPage.jsx           # Checkout (transferencia/PayPal)
│   │   ├── CookiePolicyPage.jsx       # Política de cookies
│   │   ├── HomePage.jsx               # Landing page
│   │   ├── LegalNoticePage.jsx        # Aviso legal
│   │   ├── LoginPage.jsx              # Iniciar sesión
│   │   ├── NotFoundPage.jsx           # 404
│   │   ├── PrivacyPolicyPage.jsx      # Aviso de privacidad
│   │   ├── RegisterPage.jsx           # Registro
│   │   ├── StorePage.jsx              # Catálogo de libros
│   │   ├── TermsPage.jsx             # Términos y condiciones
│   │   └── UserDashboardPage.jsx      # Dashboard usuario (libros + citas)
│   ├── services/
│   │   ├── api.js                     # Axios instance + interceptors + auto-refresh
│   │   ├── appointment.service.js     # API de citas
│   │   ├── auth.service.js            # API de autenticación + MFA
│   │   ├── availability.service.js    # API de disponibilidad
│   │   ├── book.service.js            # API de libros
│   │   ├── cart.service.js            # API del carrito
│   │   ├── media.service.js           # API de multimedia
│   │   └── order.service.js           # API de pedidos
│   └── utils/
│       ├── constants.js               # Enums, labels, colores de estados
│       ├── formatDate.js              # Formateo de fechas y horas
│       └── helpers.js                 # classNames, getInitials, extractIDs
├── index.html                         # HTML entry con fonts + meta SEO
├── package.json                       # Dependencias (react, axios, lucide, tailwind)
├── tailwind.config.js                 # Tema custom (colores primary/warm, fonts)
├── vite.config.js                     # Vite + proxy a backend
└── postcss.config.js
```

---

## Rutas del Frontend

### Públicas
| Ruta | Página | Descripción |
|------|--------|-------------|
| `/` | HomePage | Landing: Hero + Spotify + YouTube + Testimonios + CTA |
| `/store` | StorePage | Catálogo de libros con búsqueda y filtros |
| `/store/:slug` | BookDetailPage | Detalle de libro + agregar al carrito |
| `/login` | LoginPage | Inicio de sesión |
| `/register` | RegisterPage | Registro de cuenta |
| `/privacy` | PrivacyPolicyPage | Aviso de privacidad (LFPDPPP/RGPD) |
| `/terms` | TermsPage | Términos y condiciones |
| `/legal` | LegalNoticePage | Aviso legal (titular) |
| `/cookies` | CookiePolicyPage | Política de cookies |

### Protegidas (requieren login)
| Ruta | Página | Descripción |
|------|--------|-------------|
| `/booking` | BookingPage | Agendar asesoría (3 pasos + T&C) |
| `/cart` | CartPage | Carrito de compras |
| `/checkout` | CheckoutPage | Confirmar pedido + datos pago |
| `/dashboard` | UserDashboardPage | Mis libros + mis citas |

### Admin (requieren rol ADMIN)
| Ruta | Página | Descripción |
|------|--------|-------------|
| `/admin` | AdminDashboardPage | Dashboard con KPIs |
| `/admin/appointments` | AdminAppointmentsPage | Gestión de citas |
| `/admin/availability` | AdminAvailabilityPage | Configurar horarios |
| `/admin/media` | AdminMediaPage | Gestión Spotify/YouTube |
| `/admin/books` | AdminBooksPage | CRUD libros + upload portada/PDF |
| `/admin/orders` | AdminOrdersPage | Pedidos + confirmar pago |
| `/admin/users` | AdminUsersPage | Usuarios + actividad |
| `/admin/settings` | AdminSettingsPage | Cambio contraseña + seguridad |

---

## Flujos Principales

### Compra de libro digital
```
/store → Elegir libro → /store/:slug → Agregar al carrito (con cantidad)
→ /cart → Proceder al pago → /checkout → Confirmar pedido
→ Mostrar datos bancarios/PayPal → Usuario hace transferencia
→ Admin confirma pago → Email al usuario → /dashboard → Descargar PDF
```

### Agendamiento de asesoría
```
/booking → Paso 1: Elegir fecha + horario → Paso 2: Datos de pareja + motivo
→ Paso 3: Confirmar + aceptar T&C → Cita creada (PENDING)
→ Admin confirma → Email al usuario → /dashboard → Ver citas
```

---

## Seguridad Frontend

| Medida | Implementación |
|--------|---------------|
| XSS | React escapa por defecto + CSP del servidor |
| Auth | Tokens en cookies httpOnly (no localStorage) |
| Auto-refresh | Interceptor 401 → refresh automático → retry |
| CSRF | Cookies SameSite=Strict |
| Validación | Zod-style en formularios antes de enviar |
| Términos | Checkbox obligatorio (no pre-marcado) en checkout y booking |
| Cookies | Banner de consentimiento con opt-in |
| Uploads | Cloudinary directo (imágenes + PDFs) |
