import { Link } from 'react-router-dom';
import { MessageCircleHeart, RefreshCw, Users, Clock, Sprout, ArrowRight } from 'lucide-react';

const situations = [
  {
    icon: RefreshCw,
    text: 'Discutimos por las mismas cosas una y otra vez.',
  },
  {
    icon: MessageCircleHeart,
    text: 'Siento que la comunicación y la cercanía se han enfriado.',
  },
  {
    icon: Users,
    text: 'Anhelamos volver a caminar juntos, tomados de la mano de Dios.',
  },
  {
    icon: Clock,
    text: 'No queremos esperar a que la crisis crezca; queremos actuar hoy.',
  },
  {
    icon: Sprout,
    text: 'Deseamos edificar nuestro hogar sobre el fundamento de Cristo.',
  },
];

export default function IdentifySection() {
  return (
    <section className="py-20 bg-warm-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title">¿Te identificas con alguna de estas situaciones?</h2>
          <p className="section-subtitle mx-auto">
            Reconocer dónde estás es el primer paso. Y en Cristo, ningún matrimonio está fuera del alcance de su gracia.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {situations.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={i}
                className="flex items-start gap-4 bg-white rounded-xl border border-gray-100 p-5 hover:border-primary-200 hover:shadow-sm transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary-600" />
                </div>
                <p className="text-gray-700 leading-relaxed pt-1.5">"{s.text}"</p>
              </div>
            );
          })}

          {/* Tarjeta de transición emocional / esperanza en Dios */}
          <div className="flex flex-col justify-center bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl p-6 text-white">
            <p className="text-lg font-display font-semibold leading-snug">
              Para Dios no hay imposibles.
            </p>
            <p className="text-primary-100 text-sm mt-2">
              Él restaura corazones, sana heridas y renueva el amor. A veces el camino comienza con
              una oración y una decisión de buscar ayuda.
            </p>
            <Link
              to="/booking"
              className="inline-flex items-center gap-1.5 text-white font-medium text-sm mt-4 hover:gap-2.5 transition-all"
            >
              Quiero dar el primer paso
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 italic mt-8 max-w-xl mx-auto">
          "Todo lo puedo en Cristo que me fortalece." — Filipenses 4:13
        </p>
      </div>
    </section>
  );
}
