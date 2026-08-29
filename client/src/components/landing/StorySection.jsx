import { Link } from 'react-router-dom';
import { Cross, ArrowRight } from 'lucide-react';

export default function StorySection() {
  return (
    <section className="py-20 bg-warm-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Imagen / espacio para foto de los pastores */}
          <div className="order-2 lg:order-1">
            <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary-100 to-warm-100 flex items-center justify-center overflow-hidden border border-primary-100">
              {/* TODO: Reemplazar por la foto real de los pastores.
                  Ejemplo: <img src="/pastores.jpg" alt="Pastores de Somos Casa" className="w-full h-full object-cover" /> */}
              <div className="text-center p-8">
                <Cross className="w-12 h-12 text-primary-400 mx-auto mb-3" />
                <p className="text-sm text-primary-700 font-medium">Foto de los pastores</p>
                <p className="text-xs text-gray-500 mt-1">(agregar imagen real)</p>
              </div>
            </div>
          </div>

          {/* Texto */}
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 rounded-full px-4 py-2 text-sm font-medium mb-4">
              <Cross className="w-4 h-4" />
              Nuestra Historia
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 leading-tight">
              Un ministerio que nació de la gracia de Dios
            </h2>
            <p className="text-gray-600 mt-4 leading-relaxed">
              {/* TODO: Reemplazar por la historia real de Somos Casa y sus pastores. */}
              Somos Casa nace del llamado de Dios para servir a los matrimonios y las familias. Creemos
              con todo el corazón que Jesucristo transforma vidas y que ningún hogar está fuera del
              alcance de su amor.
            </p>
            <p className="text-gray-600 mt-4 leading-relaxed">
              Nuestros pastores han caminado, orado y acompañado a muchas parejas, con la convicción de
              que Dios es quien restaura, sana y edifica. Todo lo que hacemos tiene un solo centro:
              Cristo y su Palabra.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-1.5 text-primary-600 font-medium mt-6 hover:gap-2.5 transition-all"
            >
              Conoce nuestra historia completa
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
