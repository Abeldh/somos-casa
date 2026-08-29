import { Link } from 'react-router-dom';
import { HeartHandshake, BookOpen, Cross, ArrowRight, Check } from 'lucide-react';

export default function SolutionsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title">¿Cómo podemos caminar contigo?</h2>
          <p className="section-subtitle mx-auto">
            Cada matrimonio es distinto. Elige el camino que hoy pone tu hogar en las manos de Dios.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Consejería pastoral */}
          <div className="flex flex-col bg-white rounded-2xl border-2 border-primary-100 p-7 hover:border-primary-300 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mb-4">
              <HeartHandshake className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-xl font-display font-bold text-gray-900">Consejería pastoral</h3>
            <p className="text-gray-600 text-sm mt-2 flex-1">
              Sesiones de acompañamiento con fundamento en la Palabra de Dios, para trabajar tu relación
              con oración, sabiduría y amor.
            </p>
            <ul className="space-y-2 my-5">
              <li className="flex items-center gap-2 text-sm text-gray-600"><Check className="w-4 h-4 text-primary-600 flex-shrink-0" /> Consejería bíblica personalizada</li>
              <li className="flex items-center gap-2 text-sm text-gray-600"><Check className="w-4 h-4 text-primary-600 flex-shrink-0" /> Sesiones por videollamada</li>
              <li className="flex items-center gap-2 text-sm text-gray-600"><Check className="w-4 h-4 text-primary-600 flex-shrink-0" /> Oración y seguimiento</li>
            </ul>
            <Link to="/booking" className="mt-auto">
              <span className="inline-flex w-full items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg px-5 py-3 transition-colors">
                Agendar consejería
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>

          {/* Recursos / Libros */}
          <div className="flex flex-col bg-white rounded-2xl border-2 border-warm-100 p-7 hover:border-warm-300 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-xl bg-warm-100 flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-warm-600" />
            </div>
            <h3 className="text-xl font-display font-bold text-gray-900">Recursos y libros</h3>
            <p className="text-gray-600 text-sm mt-2 flex-1">
              Libros y materiales cristianos para crecer en pareja, aplicar principios bíblicos y
              fortalecer tu hogar a tu propio ritmo.
            </p>
            <ul className="space-y-2 my-5">
              <li className="flex items-center gap-2 text-sm text-gray-600"><Check className="w-4 h-4 text-warm-600 flex-shrink-0" /> Contenido con base bíblica</li>
              <li className="flex items-center gap-2 text-sm text-gray-600"><Check className="w-4 h-4 text-warm-600 flex-shrink-0" /> Formato digital descargable</li>
              <li className="flex items-center gap-2 text-sm text-gray-600"><Check className="w-4 h-4 text-warm-600 flex-shrink-0" /> Para leer juntos o en devocional</li>
            </ul>
            <Link to="/store" className="mt-auto">
              <span className="inline-flex w-full items-center justify-center gap-2 bg-warm-500 hover:bg-warm-600 text-white font-medium rounded-lg px-5 py-3 transition-colors">
                Ver libros
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>

          {/* Ambos */}
          <div className="flex flex-col bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-7 text-white hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center mb-4">
              <Cross className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-display font-bold">Camina de la mano de Dios</h3>
            <p className="text-primary-100 text-sm mt-2 flex-1">
              Combina la consejería pastoral con los recursos bíblicos para edificar tu matrimonio
              sobre la Roca que es Cristo.
            </p>
            <ul className="space-y-2 my-5">
              <li className="flex items-center gap-2 text-sm text-primary-50"><Check className="w-4 h-4 text-white flex-shrink-0" /> Aprende y aplica con apoyo</li>
              <li className="flex items-center gap-2 text-sm text-primary-50"><Check className="w-4 h-4 text-white flex-shrink-0" /> Acompañamiento en fe</li>
              <li className="flex items-center gap-2 text-sm text-primary-50"><Check className="w-4 h-4 text-white flex-shrink-0" /> Un paso a la vez, con Dios</li>
            </ul>
            <Link to="/store" className="mt-auto">
              <span className="inline-flex w-full items-center justify-center gap-2 bg-white text-primary-700 hover:bg-primary-50 font-medium rounded-lg px-5 py-3 transition-colors">
                Explorar recursos
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
