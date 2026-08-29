import { Link } from 'react-router-dom';
import { MessageCircle, BookOpen, Heart, ArrowRight, Check } from 'lucide-react';

export default function SolutionsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title">¿Qué necesitas en este momento?</h2>
          <p className="section-subtitle mx-auto">
            Cada relación es distinta. Elige el camino que mejor se adapte a lo que estás buscando hoy.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Asesorías */}
          <div className="flex flex-col bg-white rounded-2xl border-2 border-primary-100 p-7 hover:border-primary-300 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-xl font-display font-bold text-gray-900">Quiero orientación personalizada</h3>
            <p className="text-gray-600 text-sm mt-2 flex-1">
              Sesiones de asesoría para trabajar situaciones específicas de tu relación, con acompañamiento cercano.
            </p>
            <ul className="space-y-2 my-5">
              <li className="flex items-center gap-2 text-sm text-gray-600"><Check className="w-4 h-4 text-primary-600 flex-shrink-0" /> Atención adaptada a tu caso</li>
              <li className="flex items-center gap-2 text-sm text-gray-600"><Check className="w-4 h-4 text-primary-600 flex-shrink-0" /> Sesiones por videollamada</li>
              <li className="flex items-center gap-2 text-sm text-gray-600"><Check className="w-4 h-4 text-primary-600 flex-shrink-0" /> Objetivos y próximos pasos claros</li>
            </ul>
            <Link to="/booking" className="mt-auto">
              <span className="inline-flex w-full items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg px-5 py-3 transition-colors">
                Conocer las asesorías
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>

          {/* Libros */}
          <div className="flex flex-col bg-white rounded-2xl border-2 border-warm-100 p-7 hover:border-warm-300 hover:shadow-lg transition-all">
            <div className="w-12 h-12 rounded-xl bg-warm-100 flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-warm-600" />
            </div>
            <h3 className="text-xl font-display font-bold text-gray-900">Quiero aprender por mi cuenta</h3>
            <p className="text-gray-600 text-sm mt-2 flex-1">
              Libros y recursos para reflexionar y aplicar nuevas herramientas en tu relación, a tu propio ritmo.
            </p>
            <ul className="space-y-2 my-5">
              <li className="flex items-center gap-2 text-sm text-gray-600"><Check className="w-4 h-4 text-warm-600 flex-shrink-0" /> Formato digital descargable</li>
              <li className="flex items-center gap-2 text-sm text-gray-600"><Check className="w-4 h-4 text-warm-600 flex-shrink-0" /> Temas prácticos y aplicables</li>
              <li className="flex items-center gap-2 text-sm text-gray-600"><Check className="w-4 h-4 text-warm-600 flex-shrink-0" /> Avanza cuando quieras</li>
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
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-display font-bold">Quiero ambas cosas</h3>
            <p className="text-primary-100 text-sm mt-2 flex-1">
              Combina el aprendizaje de los libros con el acompañamiento de una asesoría para avanzar con más claridad.
            </p>
            <ul className="space-y-2 my-5">
              <li className="flex items-center gap-2 text-sm text-primary-50"><Check className="w-4 h-4 text-white flex-shrink-0" /> Lo mejor de ambos caminos</li>
              <li className="flex items-center gap-2 text-sm text-primary-50"><Check className="w-4 h-4 text-white flex-shrink-0" /> Aprende y aplica con apoyo</li>
              <li className="flex items-center gap-2 text-sm text-primary-50"><Check className="w-4 h-4 text-white flex-shrink-0" /> Un paso a la vez</li>
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
