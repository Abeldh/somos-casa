import { Building2, Mail, Globe } from 'lucide-react';

export default function LegalNoticePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900">Aviso Legal</h1>
        <p className="text-gray-500 mt-3">Identificación del titular del sitio web</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm space-y-6">
        <div className="flex items-start gap-3">
          <Building2 className="w-5 h-5 text-primary-600 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-900">Titular</h3>
            <p className="text-gray-600 mt-1">Somos Casa Asesoría Matrimonial — Angélica Armenta Barajas</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Globe className="w-5 h-5 text-primary-600 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-900">Actividad</h3>
            <p className="text-gray-600 mt-1">Asesoría y orientación matrimonial, venta de libros digitales, producción de contenido educativo (podcasts y videos).</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Building2 className="w-5 h-5 text-primary-600 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-900">Domicilio</h3>
            <p className="text-gray-600 mt-1">Toluca, Estado de México, México</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 text-primary-600 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-900">Contacto</h3>
            <p className="text-gray-600 mt-1">somoscasatoluca@gmail.com · WhatsApp +52 722 414 8552</p>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6 mt-6">
          <p className="text-sm text-gray-500">
            Este sitio web cumple con la legislación mexicana vigente en materia de comercio electrónico, protección de datos personales (LFPDPPP) y prestación de servicios de la sociedad de la información.
          </p>
        </div>
      </div>
    </div>
  );
}
