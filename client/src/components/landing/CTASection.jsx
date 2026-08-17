import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
          ¿Listos para fortalecer su matrimonio?
        </h2>
        <p className="mt-4 text-lg text-primary-100 max-w-2xl mx-auto">
          Da el primer paso hoy. Agenda una sesión de asesoría y recibe orientación profesional 
          para construir una relación más fuerte y saludable.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/booking">
            <Button
              variant="secondary"
              size="lg"
              className="bg-white text-primary-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              Agendar Ahora
            </Button>
          </Link>
          <Link to="/register" className="text-white hover:text-primary-100 font-medium flex items-center gap-1 transition-colors">
            Crear una cuenta
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
