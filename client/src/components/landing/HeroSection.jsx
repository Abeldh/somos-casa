import { Link } from 'react-router-dom';
import { Cross, Calendar, BookOpen, HeartHandshake, Users } from 'lucide-react';
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
            <Cross className="w-4 h-4" />
            Ministerio de Restauración Matrimonial
          </div>

          <h1 className="text-4xl md:text-6xl font-display font-bold text-gray-900 leading-tight">
            Lo que Dios unió,{' '}
            <span className="text-primary-600">Él lo puede restaurar</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            En Cristo hay esperanza para tu matrimonio. A través de la Palabra de Dios, la oración
            y el acompañamiento pastoral, te ayudamos a edificar una relación sobre el fundamento
            firme que es Jesucristo.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/booking">
              <Button size="lg" className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Quiero restaurar mi matrimonio
              </Button>
            </Link>
            <Link to="/store">
              <Button variant="outline" size="lg" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Conocer los libros
              </Button>
            </Link>
          </div>

          <p className="mt-6 text-sm text-gray-500 italic max-w-lg mx-auto">
            "Si Jehová no edificare la casa, en vano trabajan los que la edifican." — Salmo 127:1
          </p>

          {/* Pilares del ministerio */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="w-11 h-11 rounded-full bg-primary-100 flex items-center justify-center mb-3">
                <HeartHandshake className="w-5 h-5 text-primary-600" />
              </div>
              <p className="text-sm font-semibold text-gray-900">Consejería pastoral</p>
              <p className="text-xs text-gray-500 mt-1">Acompañamiento con fundamento bíblico</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-11 h-11 rounded-full bg-primary-100 flex items-center justify-center mb-3">
                <BookOpen className="w-5 h-5 text-primary-600" />
              </div>
              <p className="text-sm font-semibold text-gray-900">Recursos según la Palabra</p>
              <p className="text-xs text-gray-500 mt-1">Libros y contenido para tu hogar</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-11 h-11 rounded-full bg-primary-100 flex items-center justify-center mb-3">
                <Users className="w-5 h-5 text-primary-600" />
              </div>
              <p className="text-sm font-semibold text-gray-900">Caminamos contigo</p>
              <p className="text-xs text-gray-500 mt-1">Una familia en la fe que te apoya</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
