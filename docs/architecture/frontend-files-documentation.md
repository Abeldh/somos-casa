# Documentación de Arquitectura — Frontend

**Stack:** Vite + React 18 + Tailwind CSS + Lucide Icons  
**Auth:** JWT en cookies httpOnly con auto-refresh  
**Imágenes/PDFs:** Cloudinary (upload directo)  
**Estado:** Context API (Auth, Toast) + Custom Hooks  
**Deploy:** Railway (servido como static files desde Express)

---

## Estructura de Archivos

```
client/
├── public/favicon.ico
├── src/
│   ├── main.jsx                       # Entry point (BrowserRouter, Providers)
│   ├── App.jsx                        # Router completo + auto-logout por inactividad
│   ├── index.css                      # Tailwind + clases custom + animaciones
│   ├── components/
│   │   ├── admin/                     # Componentes panel admin
│   │   │   ├── AdminStats.jsx         # Cards estadísticas dashboard
│   │   │   ├── AppointmentsTable.jsx  # Tabla/cards citas (responsive + zoom btn)
│   │   │   ├── AvailabilityCalendar.jsx # Calendario admin
│   │   │   ├── AvailabilityForm.jsx   # Form agregar horario
│   │   │   ├── MediaForm.jsx          # Form agregar Spotify/YouTube
│   │   │   └── MediaList.jsx          # Lista multimedia con delete
│   │   ├── booking/                   # Sistema agendamiento (3 pasos)
│   │   │   ├── BookingForm.jsx        # Orquestador pasos + validación sesiones
│   │   │   ├── BookingSteps.jsx       # Stepper visual
│   │   │   ├── CalendarPicker.jsx     # Calendario días disponibles
│   │   │   ├── StepConfirmation.jsx   # Paso 4: éxito
│   │   │   ├── StepCoupleInfo.jsx     # Paso 2: datos pareja + validación
│   │   │   ├── StepReason.jsx         # Paso 3: confirmar + checkbox T&C
│   │   │   └── TimeSlotGrid.jsx       # Grid horarios disponibles
│   │   ├── common/
│   │   │   └── CookieBanner.jsx       # Banner consentimiento cookies (opt-in)
│   │   ├── dashboard/                 # Panel usuario
│   │   │   ├── AppointmentCard.jsx    # Card cita + link Zoom + cancel
│   │   │   ├── AppointmentList.jsx    # Lista citas
│   │   │   ├── MyBooks.jsx            # Libros comprados + botón descarga
│   │   │   └── UserStats.jsx          # Estadísticas usuario
│   │   ├── landing/                   # Secciones homepage
│   │   │   ├── CTASection.jsx         # Call to action
│   │   │   ├── HeroSection.jsx        # Hero con stats y CTA
│   │   │   ├── SpotifyCard.jsx        # Card embed Spotify
│   │   │   ├── SpotifySection.jsx     # Sección podcasts
│   │   │   ├── TestimonialsSection.jsx # Testimonios dinámicos + form "Dejar testimonio"
│   │   │   ├── YouTubeCard.jsx        # Card player YouTube
│   │   │   └── YouTubeSection.jsx     # Sección videos con filtros
│   │   ├── layout/                    # Estructura app
│   │   │   ├── AdminLayout.jsx        # Sidebar responsive (10 items) + mobile menu
│   │   │   ├── AdminRoute.jsx         # Guard: rol ADMIN
│   │   │   ├── Footer.jsx             # Footer con 5 links legales
│   │   │   ├── Header.jsx             # Nav + carrito badge + avatar
│   │   │   ├── MainLayout.jsx         # Header + Outlet + Footer
│   │   │   └── ProtectedRoute.jsx     # Guard: autenticación
│   │   ├── store/
│   │   │   └── BookCard.jsx           # Card libro (portada, precio, add to cart)
│   │   └── ui/                        # Componentes reutilizables (16)
│   │       ├── Badge.jsx              # Badge estado con colores
│   │       ├── Button.jsx             # Botón variantes + loading
│   │       ├── Card.jsx               # Card Header/Body/Footer
│   │       ├── ImageUpload.jsx        # Upload drag&drop Cloudinary (imágenes)
│   │       ├── Input.jsx              # Input label + error
│   │       ├── Logo.jsx               # Logo SVG Somos Casa
│   │       ├── Modal.jsx              # Modal overlay animado
│   │       ├── PdfUpload.jsx          # Upload drag&drop Cloudinary (PDF)
│   │       ├── ProofUpload.jsx        # Upload comprobante de pago
│   │       ├── Select.jsx             # Select opciones
│   │       ├── Spinner.jsx            # Loading spinner
│   │       ├── TermsCheckbox.jsx      # Checkbox T&C obligatorio
│   │       ├── Textarea.jsx           # Textarea label + error
│   │       └── Toast.jsx              # Notificaciones flotantes
│   ├── context/
│   │   ├── AuthContext.jsx            # Auth: user, login, logout, refresh, MFA support
│   │   └── ToastContext.jsx           # Toasts: success, error, warning, info
│   ├── hooks/ (10)
│   │   ├── useAppointments.js         # Citas + sesiones restantes
│   │   ├── useAuth.js                 # Hook AuthContext
│   │   ├── useAvailability.js         # Disponibilidad por fecha/mes
│   │   ├── useBooks.js                # Listado + detalle libros
│   │   ├── useCalendar.js             # Navegación calendario
│   │   ├── useCart.js                 # Carrito reactivo + sync global entre componentes
│   │   ├── useInactivityLogout.js     # Auto-logout 1h sin interacción
│   │   ├── useMedia.js               # Multimedia activa
│   │   ├── useOrders.js              # Pedidos usuario + admin
│   │   └── useToast.js               # Hook ToastContext
│   ├── pages/ (22)
│   │   ├── AdminAppointmentsPage.jsx  # Citas + liberar sesiones + zoom URL
│   │   ├── AdminAuditPage.jsx         # Auditoría con filtros + export Excel
│   │   ├── AdminAvailabilityPage.jsx  # Configurar horarios
│   │   ├── AdminBooksPage.jsx         # CRUD libros + upload portada/PDF + edit modal
│   │   ├── AdminDashboardPage.jsx     # Dashboard KPIs
│   │   ├── AdminMediaPage.jsx         # Gestión Spotify/YouTube
│   │   ├── AdminOrdersPage.jsx        # Pedidos + confirmar pago + ver comprobante
│   │   ├── AdminSettingsPage.jsx      # Cambio contraseña + strength meter
│   │   ├── AdminTestimonialsPage.jsx  # Aprobar/rechazar testimonios
│   │   ├── AdminUsersPage.jsx         # Usuarios + actividad completa (modal)
│   │   ├── BookDetailPage.jsx         # Detalle libro + selector cantidad
│   │   ├── BookingPage.jsx            # Agendar asesoría
│   │   ├── CartPage.jsx               # Carrito (sin envío — digital)
│   │   ├── CheckoutPage.jsx           # Checkout: transferencia/PayPal + comprobante upload
│   │   ├── CookiePolicyPage.jsx       # Política cookies
│   │   ├── HomePage.jsx               # Landing completa
│   │   ├── LegalNoticePage.jsx        # Aviso legal
│   │   ├── LoginPage.jsx              # Login
│   │   ├── NotFoundPage.jsx           # 404
│   │   ├── PrivacyPolicyPage.jsx      # Aviso privacidad
│   │   ├── RegisterPage.jsx           # Registro
│   │   ├── StorePage.jsx              # Catálogo libros
│   │   ├── TermsPage.jsx             # Términos y condiciones
│   │   └── UserDashboardPage.jsx      # Dashboard: libros + citas + sesiones + comprobante
│   ├── services/ (8)
│   │   ├── api.js                     # Axios + withCredentials + auto-refresh 401 + interceptors
│   │   ├── appointment.service.js     # API citas + zoom + release + proof
│   │   ├── auth.service.js            # API auth + MFA
│   │   ├── availability.service.js    # API disponibilidad
│   │   ├── book.service.js            # API libros
│   │   ├── cart.service.js            # API carrito
│   │   ├── media.service.js           # API multimedia
│   │   └── order.service.js           # API pedidos + proof upload
│   └── utils/
│       ├── constants.js               # Enums, labels, colores estados
│       ├── formatDate.js              # Formateo fechas/horas
│       └── helpers.js                 # classNames, getInitials, extractIDs
├── index.html                         # HTML entry + fonts + meta SEO
├── package.json                       # react, axios, lucide-react, tailwindcss
├── tailwind.config.js                 # Tema custom (primary/warm)
├── vite.config.js                     # Vite + proxy backend
└── postcss.config.js
```

---

## Rutas (35 total)

### Públicas (8)
| Ruta | Página | Descripción |
|------|--------|-------------|
| `/` | HomePage | Landing: Hero + Spotify + YouTube + Testimonios + CTA |
| `/store` | StorePage | Catálogo libros |
| `/store/:slug` | BookDetailPage | Detalle libro + cantidad + add cart |
| `/login` | LoginPage | Inicio sesión |
| `/register` | RegisterPage | Registro |
| `/privacy` | PrivacyPolicyPage | Aviso privacidad |
| `/terms` | TermsPage | Términos y condiciones |
| `/legal` | LegalNoticePage | Aviso legal |
| `/cookies` | CookiePolicyPage | Política cookies |

### Protegidas (4)
| Ruta | Página | Descripción |
|------|--------|-------------|
| `/booking` | BookingPage | Agendar asesoría (3 pasos + T&C) |
| `/cart` | CartPage | Carrito |
| `/checkout` | CheckoutPage | Confirmar pedido + pago + comprobante |
| `/dashboard` | UserDashboardPage | Mis libros + citas + sesiones + proof |

### Admin (10)
| Ruta | Página | Descripción |
|------|--------|-------------|
| `/admin` | AdminDashboardPage | Dashboard KPIs |
| `/admin/appointments` | AdminAppointmentsPage | Citas + sesiones + zoom |
| `/admin/availability` | AdminAvailabilityPage | Horarios |
| `/admin/media` | AdminMediaPage | Spotify/YouTube |
| `/admin/books` | AdminBooksPage | CRUD libros + portada/PDF |
| `/admin/orders` | AdminOrdersPage | Pedidos + confirmar pago |
| `/admin/users` | AdminUsersPage | Usuarios + actividad |
| `/admin/audit` | AdminAuditPage | Auditoría + export Excel |
| `/admin/testimonials` | AdminTestimonialsPage | Aprobar testimonios |
| `/admin/settings` | AdminSettingsPage | Cambio contraseña |

---

## Funcionalidades del Admin (sidebar)

1. **Dashboard** — KPIs: citas, pendientes, confirmadas, completadas
2. **Citas** — Gestión + liberar sesiones ($500/4) + URL Zoom + comprobante
3. **Disponibilidad** — Calendario + agregar/eliminar slots
4. **Multimedia** — Agregar/eliminar Spotify y YouTube
5. **Libros** — CRUD + portada (Cloudinary) + PDF + edit modal + toggle active/featured
6. **Pedidos** — Confirmar pago → liberar descarga + email + ver comprobante
7. **Usuarios** — Lista + actividad completa (compras, citas, audit, sesiones)
8. **Auditoría** — Logs IP/device/browser/OS + filtros + export CSV/Excel
9. **Testimonios** — Aprobar/rechazar/eliminar testimonios de usuarios
10. **Configuración** — Cambio contraseña + indicador fortaleza

---

## Seguridad Frontend

| Medida | Implementación |
|--------|---------------|
| Auth | Tokens en cookies httpOnly (no accesibles desde JS) |
| Auto-refresh | Interceptor 401 → refresh automático → retry |
| Inactividad | Auto-logout tras 1 hora sin interacción |
| CSRF | Cookies SameSite=Strict |
| Términos | Checkbox obligatorio (no pre-marcado) en checkout + booking |
| Cookies | Banner opt-in |
| Uploads | Cloudinary directo (imágenes, PDFs, comprobantes) |
| XSS | React escapa por defecto + CSP del servidor |
| Cart sync | Event-based entre componentes (badge se actualiza en tiempo real) |
