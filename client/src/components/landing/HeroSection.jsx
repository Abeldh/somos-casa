import { Link } from 'react-router-dom';
import { Heart, ArrowRight, Calendar } from 'lucide-react';
import Button from '../ui/Button';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-warm-50 via-white to-primary-50">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-300 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-warm-300 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 rounded-full px-4 py-2 text-sm font-medium mb-6">
            <Heart className="w-4 h-4 fill-primary-500" />
            Asesoría Matrimonial Profesional
          </div>

          <h1 className="text-4xl md:text-6xl font-display font-bold text-gray-900 leading-tight">
            Tu matrimonio merece{' '}
            <span className="text-primary-600">atención profesional</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Somos un equipo dedicado a fortalecer la relación de pareja. A través de asesoría personalizada, 
            podcasts y contenido educativo, te acompañamos en cada etapa de tu matrimonio.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/booking">
              <Button size="lg" className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Agendar Asesoría
              </Button>
            </Link>
            <a href="#spotify-section">
              <Button variant="outline" size="lg" className="flex items-center gap-2">
                Explorar Contenido
                <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary-600">500+</p>
              <p className="text-sm text-gray-500 mt-1">Parejas asesoradas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary-600">50+</p>
              <p className="text-sm text-gray-500 mt-1">Episodios</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary-600">98%</p>
              <p className="text-sm text-gray-500 mt-1">Satisfacción</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
