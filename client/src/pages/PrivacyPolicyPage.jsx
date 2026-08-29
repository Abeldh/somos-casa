import { Shield, Lock, Eye, Database, Trash2, Mail, Globe, UserCheck } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 rounded-full px-4 py-2 text-sm font-medium mb-4">
          <Shield className="w-4 h-4" />
          Privacidad y Seguridad
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900">
          Política de Protección de Datos
        </h1>
        <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
          En Somos Casa protegemos tu información personal. Conoce cómo recopilamos, usamos y resguardamos tus datos.
        </p>
        <p className="text-sm text-gray-400 mt-4">Última actualización: Agosto 2026</p>
      </div>

      {/* Content */}
      <div className="space-y-10">
        {/* 1. Responsable */}
        <Section
          icon={UserCheck}
          title="1. Responsable del Tratamiento de Datos"
        >
          <p>
            <strong>Somos Casa</strong> es el responsable del tratamiento de los datos personales que nos proporcionas a través de esta plataforma web.
          </p>
          <ul className="list-disc list-inside space-y-1 mt-3">
            <li><strong>Razón social:</strong> Somos Casa Asesoría Matrimonial — Angélica Armenta Barajas</li>
            <li><strong>Correo de contacto:</strong> somoscasatoluca@gmail.com</li>
            <li><strong>WhatsApp:</strong> +52 722 414 8552</li>
            <li><strong>Ubicación:</strong> Toluca, Estado de México, México</li>
          </ul>
        </Section>

        {/* 2. Datos que recopilamos */}
        <Section
          icon={Database}
          title="2. Datos Personales que Recopilamos"
        >
          <p>Recopilamos los siguientes datos cuando te registras o utilizas nuestros servicios:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <DataCard title="Datos de registro" items={[
              'Nombre completo',
              'Correo electrónico',
              'Número de teléfono (opcional)',
              'Contraseña (almacenada de forma encriptada)',
            ]} />
            <DataCard title="Datos de asesoría" items={[
              'Nombre de tu pareja',
              'Motivo de la consulta',
              'Notas adicionales proporcionadas',
              'Historial de citas agendadas',
            ]} />
          </div>
        </Section>

        {/* 3. Finalidad */}
        <Section
          icon={Eye}
          title="3. Finalidad del Tratamiento"
        >
          <p>Utilizamos tus datos personales exclusivamente para:</p>
          <ul className="list-disc list-inside space-y-2 mt-3">
            <li>Crear y gestionar tu cuenta de usuario en la plataforma.</li>
            <li>Agendar, confirmar y administrar sesiones de asesoría matrimonial.</li>
            <li>Enviarte comunicaciones relacionadas con tus citas (confirmaciones, recordatorios, cancelaciones).</li>
            <li>Mejorar nuestros servicios y la experiencia del usuario.</li>
            <li>Cumplir con obligaciones legales aplicables.</li>
          </ul>
          <p className="mt-4 text-sm text-gray-500 bg-warm-50 p-4 rounded-lg">
            <strong>Nota:</strong> No vendemos, alquilamos ni compartimos tus datos personales con terceros con fines comerciales o publicitarios.
          </p>
        </Section>

        {/* 4. Seguridad */}
        <Section
          icon={Lock}
          title="4. Medidas de Seguridad"
        >
          <p>Implementamos las siguientes medidas para proteger tus datos:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            <SecurityItem text="Contraseñas encriptadas con BCrypt (hash de 12 rondas)" />
            <SecurityItem text="Comunicación cifrada mediante HTTPS/TLS" />
            <SecurityItem text="Autenticación mediante tokens JWT con expiración" />
            <SecurityItem text="Cabeceras de seguridad HTTP (CSP, HSTS, X-Frame-Options)" />
            <SecurityItem text="Acceso restringido por roles (Cliente / Administrador)" />
            <SecurityItem text="Base de datos con acceso limitado y respaldada" />
          </div>
        </Section>

        {/* 5. Derechos */}
        <Section
          icon={UserCheck}
          title="5. Tus Derechos (ARCO)"
        >
          <p>Como titular de tus datos personales, tienes derecho a:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            <RightCard letter="A" title="Acceso" description="Conocer qué datos tenemos sobre ti y cómo los usamos." />
            <RightCard letter="R" title="Rectificación" description="Solicitar la corrección de datos inexactos o incompletos." />
            <RightCard letter="C" title="Cancelación" description="Solicitar la eliminación de tus datos cuando ya no sean necesarios." />
            <RightCard letter="O" title="Oposición" description="Oponerte al tratamiento de tus datos para fines específicos." />
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Para ejercer cualquiera de estos derechos, envía un correo a{' '}
            <a href="mailto:somoscasatoluca@gmail.com" className="text-primary-600 font-medium hover:underline">
              somoscasatoluca@gmail.com
            </a>{' '}
            con el asunto "Derechos ARCO" incluyendo tu nombre completo y correo registrado.
          </p>
        </Section>

        {/* 6. Cookies */}
        <Section
          icon={Globe}
          title="6. Cookies y Almacenamiento Local"
        >
          <p>Esta plataforma utiliza:</p>
          <ul className="list-disc list-inside space-y-2 mt-3">
            <li><strong>LocalStorage:</strong> Para almacenar tu token de sesión (JWT) y mantener tu sesión activa.</li>
            <li><strong>Google Analytics:</strong> Para medir de forma anónima y agregada el uso de la página (visitas, páginas más vistas, origen del tráfico). No identifica a personas individuales.</li>
            <li><strong>Cookies de terceros:</strong> Los reproductores embebidos de Spotify y YouTube pueden usar cookies propias según sus políticas de privacidad.</li>
          </ul>
          <p className="mt-3 text-sm text-gray-500">
            No utilizamos cookies con fines publicitarios ni de retargeting comercial. Los datos de analítica se usan únicamente para mejorar el ministerio.
          </p>
        </Section>

        {/* 7. Retención */}
        <Section
          icon={Trash2}
          title="7. Retención y Eliminación de Datos"
        >
          <ul className="list-disc list-inside space-y-2">
            <li>Tus datos se conservan mientras tu cuenta esté activa.</li>
            <li>El historial de citas se mantiene por un máximo de 2 años con fines de seguimiento de tu proceso.</li>
            <li>Puedes solicitar la eliminación total de tu cuenta y datos en cualquier momento.</li>
            <li>Una vez eliminados, los datos no podrán ser recuperados.</li>
          </ul>
        </Section>

        {/* 8. Contacto */}
        <Section
          icon={Mail}
          title="8. Contacto"
        >
          <p>Si tienes preguntas o inquietudes sobre esta política o el manejo de tus datos:</p>
          <div className="mt-4 bg-white border border-gray-200 rounded-xl p-6">
            <ul className="space-y-2 text-sm">
              <li><strong>Email:</strong> somoscasatoluca@gmail.com</li>
              <li><strong>WhatsApp:</strong> +52 722 414 8552</li>
              <li><strong>Asunto sugerido:</strong> "Protección de Datos - [Tu consulta]"</li>
              <li><strong>Tiempo de respuesta:</strong> Máximo 10 días hábiles</li>
            </ul>
          </div>
        </Section>

        {/* 9. Cambios */}
        <Section
          icon={Shield}
          title="9. Cambios en esta Política"
        >
          <p>
            Nos reservamos el derecho de actualizar esta política. Cualquier cambio será publicado en esta misma página con la fecha de actualización correspondiente. Te recomendamos revisarla periódicamente.
          </p>
        </Section>
      </div>

      {/* Footer note */}
      <div className="mt-16 text-center border-t border-gray-200 pt-8">
        <p className="text-sm text-gray-500">
          Al registrarte y utilizar nuestros servicios, aceptas los términos descritos en esta política de protección de datos.
        </p>
      </div>
    </div>
  );
}

// Sub-components
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

function DataCard({ title, items }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h4 className="font-medium text-gray-800 text-sm mb-2">{title}</h4>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-primary-400 rounded-full mt-1.5 flex-shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SecurityItem({ text }) {
  return (
    <div className="flex items-start gap-2 bg-green-50 rounded-lg p-3">
      <Lock className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
      <span className="text-sm text-green-800">{text}</span>
    </div>
  );
}

function RightCard({ letter, title, description }) {
  return (
    <div className="flex items-start gap-3 bg-warm-50 rounded-lg p-4">
      <div className="w-8 h-8 bg-primary-600 text-white rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">
        {letter}
      </div>
      <div>
        <p className="font-medium text-gray-900 text-sm">{title}</p>
        <p className="text-xs text-gray-600 mt-0.5">{description}</p>
      </div>
    </div>
  );
}
