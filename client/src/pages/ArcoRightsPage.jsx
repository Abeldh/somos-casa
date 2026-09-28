import { UserCheck, Eye, Pencil, Trash2, Ban, Mail, Clock, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePageMeta } from '../hooks/usePageMeta';

const PRIVACY_EMAIL = 'somoscasatoluca@gmail.com';
const WHATSAPP = '+52 722 414 8552';

export default function ArcoRightsPage() {
  usePageMeta(
    'Derechos ARCO',
    'Ejerce tus derechos de Acceso, Rectificación, Cancelación y Oposición sobre tus datos personales conforme a la LFPDPPP.',
    { path: '/derechos-arco' }
  );

  const mailtoSubject = encodeURIComponent('Solicitud de Derechos ARCO');
  const mailtoBody = encodeURIComponent(
    'Nombre completo (tal como aparece en mi cuenta):\n' +
    'Correo con el que me registré:\n\n' +
    'Derecho que deseo ejercer (Acceso / Rectificación / Cancelación / Oposición):\n\n' +
    'Descripción de mi solicitud:\n'
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 rounded-full px-4 py-2 text-sm font-medium mb-4">
          <UserCheck className="w-4 h-4" />
          Protección de Datos
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900">Derechos ARCO</h1>
        <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
          Como titular de tus datos personales, la Ley Federal de Protección de Datos Personales en Posesión
          de los Particulares (LFPDPPP) te reconoce cuatro derechos que puedes ejercer en cualquier momento y
          de forma gratuita.
        </p>
      </div>

      <div className="space-y-8">
        {/* Los 4 derechos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RightCard
            icon={Eye}
            letter="A"
            title="Acceso"
            description="Conocer qué datos personales tenemos sobre ti, para qué los usamos y las condiciones de su tratamiento."
          />
          <RightCard
            icon={Pencil}
            letter="R"
            title="Rectificación"
            description="Solicitar la corrección de tus datos personales cuando sean inexactos, estén desactualizados o incompletos."
          />
          <RightCard
            icon={Trash2}
            letter="C"
            title="Cancelación"
            description="Solicitar que eliminemos tus datos de nuestros registros cuando consideres que no se están utilizando conforme a los principios y deberes de la ley."
          />
          <RightCard
            icon={Ban}
            letter="O"
            title="Oposición"
            description="Oponerte al tratamiento de tus datos para fines específicos, o pedir que dejemos de usarlos."
          />
        </div>

        {/* Cómo ejercerlos */}
        <Section icon={Mail} title="¿Cómo ejercer tus derechos?">
          <p>
            Para ejercer cualquiera de tus derechos ARCO, envíanos una solicitud a nuestro correo de privacidad.
            Para poder atenderte, solo necesitamos la información mínima indispensable para identificarte y
            entender tu petición:
          </p>
          <ul className="list-disc list-inside space-y-1.5 mt-3">
            <li>Tu nombre completo (el registrado en tu cuenta).</li>
            <li>El correo electrónico con el que te registraste.</li>
            <li>El derecho que deseas ejercer (Acceso, Rectificación, Cancelación u Oposición).</li>
            <li>Una descripción clara de tu solicitud.</li>
          </ul>
          <p className="mt-3 text-sm text-gray-500 bg-warm-50 p-4 rounded-lg">
            No te pediremos información adicional que no sea necesaria para atender tu solicitud. En caso de
            rectificación, podríamos pedirte el dato correcto y, cuando aplique, algún documento que acredite el cambio.
          </p>

          <div className="flex flex-wrap gap-3 mt-5">
            <a
              href={`mailto:${PRIVACY_EMAIL}?subject=${mailtoSubject}&body=${mailtoBody}`}
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              <Mail className="w-4 h-4" />
              Enviar solicitud por correo
            </a>
            <a
              href={`https://wa.me/${WHATSAPP.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              Solicitar por WhatsApp
            </a>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Correo de privacidad: <strong>{PRIVACY_EMAIL}</strong> · WhatsApp: <strong>{WHATSAPP}</strong>
          </p>
        </Section>

        {/* Plazos */}
        <Section icon={Clock} title="Plazos de respuesta">
          <p>
            Daremos respuesta a tu solicitud en un plazo máximo de <strong>20 días hábiles</strong> contados desde
            que la recibamos, e informaremos si es procedente. De serlo, se hará efectiva dentro de los
            <strong> 15 días hábiles</strong> siguientes. Estos plazos podrán ampliarse conforme lo permita la ley,
            notificándote la justificación.
          </p>
        </Section>

        {/* Revocación del consentimiento */}
        <Section icon={ShieldCheck} title="Revocación del consentimiento">
          <p>
            También puedes revocar en cualquier momento el consentimiento que nos otorgaste para el tratamiento
            de tus datos. Ten en cuenta que, en ciertos casos, la revocación podría implicar que no podamos
            seguir prestándote el servicio. Igualmente, puedes limitar el uso o divulgación de tus datos, o
            desactivar las comunicaciones comerciales que hayas aceptado.
          </p>
          <p className="mt-3 text-sm text-gray-600">
            Consulta también nuestro{' '}
            <Link to="/privacy" className="text-primary-600 hover:underline font-medium">Aviso de Privacidad</Link>
            {' '}para conocer el detalle del tratamiento de tus datos.
          </p>
        </Section>

        {/* Nota legal */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 text-sm text-blue-800">
          Si consideras que tu derecho a la protección de datos personales ha sido vulnerado, puedes acudir ante
          el Instituto Nacional de Transparencia, Acceso a la Información y Protección de Datos Personales (INAI)
          o la autoridad que corresponda conforme a la legislación vigente.
        </div>
      </div>
    </div>
  );
}

function RightCard({ icon: Icon, letter, title, description }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex gap-4">
      <div className="flex flex-col items-center gap-2 flex-shrink-0">
        <div className="w-10 h-10 bg-primary-600 text-white rounded-lg flex items-center justify-center text-lg font-bold">
          {letter}
        </div>
        <Icon className="w-4 h-4 text-primary-400" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600 mt-1 leading-relaxed">{description}</p>
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
