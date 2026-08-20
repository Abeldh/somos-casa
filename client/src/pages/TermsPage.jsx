import { FileText, Calendar, BookOpen, Shield, Scale, AlertTriangle } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900">Términos y Condiciones</h1>
        <p className="text-gray-500 mt-3">Última actualización: Agosto 2026</p>
      </div>

      <div className="space-y-8 text-gray-600 leading-relaxed">
        <Section icon={FileText} title="1. Objeto">
          <p>Los presentes Términos regulan el uso de la plataforma <strong>Somos Casa</strong>, que ofrece servicios de asesoría matrimonial y venta de libros digitales.</p>
        </Section>

        <Section icon={Calendar} title="2. Servicio de Asesoría Matrimonial">
          <h4 className="font-medium text-gray-800 mt-3">2.1 Agendamiento</h4>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Las citas se agendan a través de la plataforma según la disponibilidad del asesor.</li>
            <li>La cita queda en estado "Pendiente" hasta ser confirmada por el equipo de Somos Casa.</li>
            <li>Se envía una notificación por correo electrónico al confirmar la cita.</li>
          </ul>

          <h4 className="font-medium text-gray-800 mt-4">2.2 Cancelación y Reprogramación</h4>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>El usuario puede cancelar o reprogramar su cita con un mínimo de <strong>24 horas de anticipación</strong>.</li>
            <li>Cancelaciones con menos de 24 horas de anticipación podrán ser consideradas como sesión utilizada.</li>
            <li>Cancelaciones reiteradas sin justificación pueden resultar en la suspensión del servicio.</li>
          </ul>

          <h4 className="font-medium text-gray-800 mt-4">2.3 Inasistencia (No-Show)</h4>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Si el cliente no se conecta a la sesión dentro de los primeros 15 minutos, se considerará como sesión utilizada.</li>
            <li>No se realizarán reembolsos por inasistencia sin previo aviso.</li>
          </ul>

          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span><strong>Deslinde de responsabilidad:</strong> La asesoría matrimonial proporcionada por Somos Casa tiene carácter <strong>orientativo y educativo</strong>. No constituye ni sustituye un tratamiento médico, psicológico, psiquiátrico o legal profesional. Si usted o su pareja atraviesan una crisis emocional severa, violencia doméstica o problemas de salud mental, le recomendamos acudir a un profesional de la salud calificado.</span>
            </p>
          </div>
        </Section>

        <Section icon={BookOpen} title="3. Venta de Libros Digitales">
          <h4 className="font-medium text-gray-800 mt-3">3.1 Formato y Entrega</h4>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Los libros ofrecidos en la plataforma son en formato <strong>digital (PDF)</strong>.</li>
            <li>No se realizan envíos físicos.</li>
            <li>Una vez confirmado el pago por parte del administrador, el libro estará disponible para descarga desde el perfil del usuario.</li>
          </ul>

          <h4 className="font-medium text-gray-800 mt-4">3.2 Proceso de Pago</h4>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>El pago se realiza mediante transferencia bancaria o PayPal.</li>
            <li>El usuario debe incluir su número de orden como concepto/referencia del pago.</li>
            <li>La liberación de la descarga se realiza una vez que el equipo de Somos Casa verifica el depósito.</li>
          </ul>

          <h4 className="font-medium text-gray-800 mt-4">3.3 Política de Devolución</h4>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Debido a la naturaleza digital del producto, <strong>no se realizan devoluciones ni reembolsos</strong> una vez que el archivo ha sido liberado para descarga.</li>
            <li>Si el archivo presenta problemas técnicos de descarga, contacte a soporte para asistencia.</li>
          </ul>
        </Section>

        <Section icon={Shield} title="4. Uso Aceptable">
          <ul className="list-disc list-inside space-y-1">
            <li>Proporcionar información veraz al registrarse y agendar citas.</li>
            <li>No compartir ni redistribuir los libros digitales adquiridos.</li>
            <li>No utilizar la plataforma con fines ilegales o fraudulentos.</li>
            <li>No intentar acceder a cuentas de otros usuarios.</li>
          </ul>
        </Section>

        <Section icon={Scale} title="5. Propiedad Intelectual">
          <p>Todo el contenido de la plataforma (textos, diseños, logotipos, podcasts, videos, libros digitales) es propiedad de Somos Casa o de sus respectivos autores. Queda prohibida su reproducción, distribución o modificación sin autorización expresa.</p>
        </Section>

        <Section icon={Scale} title="6. Jurisdicción">
          <p>Estos Términos se rigen por las leyes de los Estados Unidos Mexicanos. Cualquier controversia se someterá a los tribunales competentes de la Ciudad de México.</p>
        </Section>

        <Section icon={FileText} title="7. Modificaciones">
          <p>Somos Casa se reserva el derecho de modificar estos Términos. Los cambios entrarán en vigor tras su publicación en esta página. Se notificará a los usuarios registrados cuando se realicen cambios sustanciales.</p>
        </Section>

        <Section icon={FileText} title="8. Contacto">
          <p>Para consultas sobre estos Términos: <strong>contacto@somoscasa.com</strong></p>
        </Section>
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 md:p-8 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-3 mb-4">
        <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center"><Icon className="w-5 h-5 text-primary-600" /></div>
        {title}
      </h2>
      <div className="text-gray-600 leading-relaxed">{children}</div>
    </div>
  );
}
