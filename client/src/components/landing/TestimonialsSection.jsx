import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'María y Carlos',
    text: 'La asesoría nos ayudó a comunicarnos mejor. Después de 10 años de matrimonio, sentimos que nos conocemos de nuevo.',
    rating: 5,
  },
  {
    name: 'Ana y Roberto',
    text: 'Los podcasts se convirtieron en nuestra rutina semanal. Nos encanta escucharlos juntos y aplicar lo que aprendemos.',
    rating: 5,
  },
  {
    name: 'Laura y Miguel',
    text: 'Gracias a las sesiones pudimos superar una crisis que parecía imposible. Hoy estamos más unidos que nunca.',
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title">Lo que dicen las parejas</h2>
          <p className="section-subtitle mx-auto">
            Historias reales de matrimonios que han encontrado un nuevo camino juntos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="bg-warm-50 rounded-xl p-6 relative">
              <Quote className="w-8 h-8 text-primary-200 absolute top-4 right-4" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">"{testimonial.text}"</p>
              <p className="font-semibold text-gray-900 text-sm">{testimonial.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
