import { useState } from 'react';
import { Cookie, Shield, Settings, Check } from 'lucide-react';
import { getConsent, acceptAll, acceptNecessaryOnly } from '../utils/cookieConsent';

export default function CookiePolicyPage() {
  const [consent, setConsent] = useState(() => getConsent());

  const enableAnalytics = () => setConsent(acceptAll());
  const disableAnalytics = () => setConsent(acceptNecessaryOnly());

  const analyticsOn = !!(consent && consent.analytics);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900">Política de Cookies</h1>
        <p className="text-gray-500 mt-3">Última actualización: Agosto 2026</p>
      </div>

      <div className="space-y-8">
        <Section icon={Cookie} title="¿Qué son las cookies?">
          <p>Las cookies son pequeños archivos de texto almacenados en tu dispositivo que permiten recordar preferencias y mantener sesiones activas.</p>
        </Section>

        <Section icon={Shield} title="Cookies que utilizamos">
          <div className="mt-4 space-y-3">
            <CookieRow name="access_token" type="Técnica (Necesaria)" purpose="Mantiene tu sesión activa" duration="15 minutos" />
            <CookieRow name="refresh_token" type="Técnica (Necesaria)" purpose="Permite renovar tu sesión sin re-login" duration="7 días" />
            <CookieRow name="cookie_consent" type="Preferencia" purpose="Recuerda tu elección sobre cookies" duration="1 año" />
            <CookieRow name="Google Analytics (_ga)" type="Analítica (Terceros)" purpose="Medir visitas y uso de la página de forma anónima y agregada" duration="Hasta 2 años" />
            <CookieRow name="Spotify Embed" type="Terceros" purpose="Reproductor de podcast embebido" duration="Según Spotify" />
            <CookieRow name="YouTube Embed" type="Terceros" purpose="Reproductor de video embebido" duration="Según Google" />
          </div>

          <div className="mt-4 bg-blue-50 rounded-lg p-4 text-sm text-blue-800">
            <strong>Analítica:</strong> Utilizamos Google Analytics para entender de forma anónima y agregada cómo se usa nuestra página (número de visitas, páginas más vistas, origen del tráfico). Estos datos no identifican a personas individuales y nos ayudan a mejorar el ministerio.
          </div>
          <div className="mt-3 bg-green-50 rounded-lg p-4 text-sm text-green-800">
            <strong>✓ Lo que NO usamos:</strong> No utilizamos píxeles de publicidad, cookies de retargeting comercial ni venta de datos a terceros.
          </div>
        </Section>

        <Section icon={Settings} title="Gestionar preferencias">
          <p>Puedes activar o desactivar las cookies analíticas en cualquier momento. Las cookies necesarias no pueden desactivarse porque son imprescindibles para el funcionamiento del sitio.</p>

          <div className="mt-4 space-y-3">
            {/* Necesarias: siempre activas */}
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
              <div>
                <p className="text-sm font-medium text-gray-800">Cookies necesarias</p>
                <p className="text-xs text-gray-500">Sesión y seguridad. Siempre activas.</p>
              </div>
              <span className="text-xs font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Activas
              </span>
            </div>

            {/* Analíticas: opt-in */}
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
              <div>
                <p className="text-sm font-medium text-gray-800">Cookies analíticas (Google Analytics)</p>
                <p className="text-xs text-gray-500">
                  Estado actual: {analyticsOn ? 'Activadas' : 'Desactivadas'}
                  {consent?.date && <span className="text-gray-400"> · Última decisión: {new Date(consent.date).toLocaleDateString('es-MX')}</span>}
                </p>
              </div>
              {analyticsOn ? (
                <button onClick={disableAnalytics} className="text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors">
                  Desactivar
                </button>
              ) : (
                <button onClick={enableAnalytics} className="text-xs font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition-colors">
                  Activar
                </button>
              )}
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            Si desactivas las cookies analíticas, dejaremos de cargar Google Analytics en tus próximas visitas.
            Tu preferencia se guarda con fecha y versión para respetar tu decisión.
          </p>
        </Section>
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 md:p-8 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-3 mb-4">
        <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center"><Icon className="w-5 h-5 text-amber-600" /></div>
        {title}
      </h2>
      <div className="text-gray-600 leading-relaxed">{children}</div>
    </div>
  );
}

function CookieRow({ name, type, purpose, duration }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-gray-50 last:border-0 gap-1">
      <div><p className="text-sm font-medium text-gray-800 font-mono">{name}</p><p className="text-xs text-gray-500">{purpose}</p></div>
      <div className="flex items-center gap-3"><span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{type}</span><span className="text-xs text-gray-400">{duration}</span></div>
    </div>
  );
}
