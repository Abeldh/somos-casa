import { Link } from 'react-router-dom';
import { Calendar, BookOpen } from 'lucide-react';
import Button from '../ui/Button';

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
          El primer paso para fortalecer tu relación puede comenzar hoy
        </h2>
        <p className="mt-4 text-lg text-primary-100 max-w-2xl mx-auto">
          No necesitas resolverlo todo de una vez. Comienza con una herramienta, una conversación
          o una decisión. A tu propio ritmo.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/booking">
            <Button
              variant="secondary"
              size="lg"
              className="bg-white text-primary-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              Conocer asesorías
            </Button>
          </Link>
          <Link
            to="/store"
            className="inline-flex items-center gap-2 border-2 border-white text-white hover:bg-white/10 font-medium py-4 px-8 text-lg rounded-lg transition-all duration-200"
          >
            <BookOpen className="w-5 h-5" />
            Ver libros
          </Link>
        </div>
        <p className="mt-6 text-sm text-primary-200">
          Proceso sencillo y seguro. Recibirás la confirmación de inmediato.
        </p>
      </div>
    </section>
  );
}
