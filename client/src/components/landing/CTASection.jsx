import { Link } from 'react-router-dom';
import { Calendar, BookOpen } from 'lucide-react';
import Button from '../ui/Button';

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
          Dios quiere restaurar tu matrimonio
        </h2>
        <p className="mt-4 text-lg text-primary-100 max-w-2xl mx-auto">
          No necesitas tenerlo todo resuelto para acercarte. Comienza con una oración, una decisión
          y el primer paso. Él hace nuevas todas las cosas.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/booking">
            <Button
              variant="secondary"
              size="lg"
              className="bg-white text-primary-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              Agendar consejería
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
        <p className="mt-8 text-sm text-primary-200 italic">
          "He aquí, yo hago nuevas todas las cosas." — Apocalipsis 21:5
        </p>
      </div>
    </section>
  );
}
