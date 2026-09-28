import { RefreshCcw, CalendarX, Clock, Wallet, BookX, AlertTriangle, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';

const CONTACT_EMAIL = 'somoscasatoluca@gmail.com';
const WHATSAPP = '+52 722 414 8552';

export default function CancellationPolicyPage() {
  usePageMeta(
    'Política de Cancelaciones y Reembolsos',
    'Condiciones para cancelar sesiones de asesoría y pedidos, plazos y casos en que procede un reembolso.',
    { path: '/cancelaciones-reembolsos' }
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 rounded-full px-4 py-2 text-sm font-medium mb-4">
          <RefreshCcw className="w-4 h-4" />
          Cancelaciones y Reembolsos
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900">Política de Cancelaciones y Reembolsos</h1>
        <p className="text-gray-500 mt-3">Última actualización: Agosto 2026</p>
      </div>

      <div className="space-y-8">
        {/* Sesiones de asesoría */}
        <Section icon={CalendarX} title="1. Cancelación de sesiones de asesoría">
          <p>Puedes cancelar o reprogramar una sesión de asesoría matrimonial bajo las siguientes condiciones:</p>
          <ul className="list-disc list-inside space-y-1.5 mt-3">
            <li>Cancelación o reprogramación con un mínimo de <strong>24 horas de anticipación</strong>, sin costo ni pérdida de la sesión.</li>
            <li>Cancelaciones con <strong>menos de 24 horas</strong> de anticipación podrán considerarse como sesión utilizada.</li>
            <li>Si no te conectas dentro de los primeros <strong>15 minutos</strong> de la hora agendada (inasistencia / no-show), la sesión se considerará utilizada.</li>
            <li>Las cancelaciones reiteradas sin justificación pueden derivar en la suspensión del servicio.</li>
          </ul>
        </Section>

        {/* Cómo cancelar */}
        <Section icon={Clock} title="2. ¿Cómo solicitar una cancelación?">
          <p>Tienes dos formas de cancelar o reprogramar tu sesión:</p>
          <ul className="list-disc list-inside space-y-1.5 mt-3">
            <li>Desde tu panel, en la sección <strong>"Mis Citas"</strong>, usando la opción de cancelar la cita.</li>
            <li>Escribiéndonos por correo a <strong>{CONTACT_EMAIL}</strong> o por WhatsApp al <strong>{WHATSAPP}</strong>, indicando la fecha y hora de tu cita.</li>
          </ul>
          <p className="mt-3 text-sm text-gray-500 bg-warm-50 p-4 rounded-lg">
            La opción de cancelar está siempre disponible en tu panel mientras la cita esté pendiente o confirmada.
            No ocultamos ni dificultamos la cancelación.
          </p>
        </Section>

        {/* Reembolsos de paquetes de sesiones */}
        <Section icon={Wallet} title="3. Reembolsos de paquetes de asesoría">
          <p>
            El paquete de asesoría (4 sesiones al mes) se libera tras la verificación de tu pago. Respecto a los reembolsos:
          </p>
          <ul className="list-disc list-inside space-y-1.5 mt-3">
            <li>Puedes solicitar el reembolso de las <strong>sesiones no utilizadas</strong> de tu paquete si aún no las has agendado ni consumido.</li>
            <li>Las sesiones ya realizadas, o consideradas utilizadas por cancelación tardía o inasistencia, no son reembolsables.</li>
            <li>El reembolso se realiza por el <strong>mismo medio de pago</strong> con el que se hizo la compra (transferencia bancaria o PayPal), a la cuenta que nos indiques.</li>
            <li>Una vez aprobado, el reembolso se procesa en un plazo aproximado de <strong>5 a 10 días hábiles</strong>, sujeto a los tiempos del banco o de PayPal.</li>
          </ul>
        </Section>

        {/* Libros digitales */}
        <Section icon={BookX} title="4. Compra de libros digitales">
          <p>
            Los libros que se venden en la plataforma son <strong>productos digitales (PDF)</strong>. Por su naturaleza:
          </p>
          <ul className="list-disc list-inside space-y-1.5 mt-3">
            <li>Una vez que el archivo ha sido <strong>liberado para descarga</strong>, no se realizan devoluciones ni reembolsos.</li>
            <li>Si tu pago aún no ha sido confirmado y el libro no se ha liberado, puedes solicitar la cancelación del pedido.</li>
            <li>Si el archivo presenta <strong>problemas técnicos de descarga</strong>, contáctanos y te brindaremos asistencia o el reemplazo del archivo.</li>
          </ul>
          <p className="mt-3 text-xs text-gray-500">
            Esta condición se informa antes de completar la compra, conforme a la naturaleza del producto digital.
          </p>
        </Section>

        {/* Excepciones */}
        <Section icon={AlertTriangle} title="5. Excepciones y casos especiales">
          <p>
            Evaluaremos de forma individual y de buena fe los casos de fuerza mayor, emergencias o errores
            atribuibles a la plataforma (por ejemplo, un cobro duplicado o un pago verificado por error). En estos
            supuestos podremos aplicar reembolsos o soluciones aunque no encajen en los apartados anteriores.
          </p>
        </Section>

        {/* Contacto */}
        <Section icon={Mail} title="6. Contacto para cancelaciones y reembolsos">
          <p>Para cualquier solicitud relacionada con cancelaciones o reembolsos, contáctanos:</p>
          <div className="mt-4 bg-white border border-gray-200 rounded-xl p-5">
            <ul className="space-y-2 text-sm">
              <li><strong>Correo:</strong> {CONTACT_EMAIL}</li>
              <li><strong>WhatsApp:</strong> {WHATSAPP}</li>
              <li><strong>Asunto sugerido:</strong> "Cancelación / Reembolso - [tu número de orden o fecha de cita]"</li>
            </ul>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Consulta también nuestros{' '}
            <Link to="/terms" className="text-primary-600 hover:underline font-medium">Términos y Condiciones</Link>.
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
        <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary-600" />
        </div>
        {title}
      </h2>
      <div className="text-gray-600 leading-relaxed">{children}</div>
    </div>
  );
}
