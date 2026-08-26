import { useState, useEffect } from 'react';
import { Star, Quote, MessageSquarePlus } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Modal from '../ui/Modal';
import api from '../../services/api';

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', text: '', rating: 5 });
  const [sending, setSending] = useState(false);
  const { isAuthenticated } = useAuth();
  const { success, error } = useToast();

  useEffect(() => {
    api.get('/testimonials/approved')
      .then((data) => setTestimonials(data.testimonials || []))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.text) { error('Completa todos los campos'); return; }
    setSending(true);
    try {
      await api.post('/testimonials', form);
      success('¡Testimonio enviado! Será publicado tras aprobación del administrador.');
      setShowForm(false);
      setForm({ name: '', text: '', rating: 5 });
    } catch (err) { error(err.message); }
    finally { setSending(false); }
  };

  // Fallback: si no hay testimonios en BD, mostrar los estáticos
  const displayTestimonials = testimonials.length > 0 ? testimonials : [
    { id: '1', name: 'María y Carlos', text: 'La asesoría nos ayudó a comunicarnos mejor. Después de 10 años de matrimonio, sentimos que nos conocemos de nuevo.', rating: 5 },
    { id: '2', name: 'Ana y Roberto', text: 'Los podcasts se convirtieron en nuestra rutina semanal. Nos encanta escucharlos juntos y aplicar lo que aprendemos.', rating: 5 },
    { id: '3', name: 'Laura y Miguel', text: 'Gracias a las sesiones pudimos superar una crisis que parecía imposible. Hoy estamos más unidos que nunca.', rating: 5 },
  ];

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
          {displayTestimonials.slice(0, 6).map((testimonial) => (
            <div key={testimonial.id} className="bg-warm-50 rounded-xl p-6 relative">
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

        {/* Botón para dejar testimonio */}
        {isAuthenticated && (
          <div className="text-center mt-10">
            <Button variant="outline" onClick={() => setShowForm(true)} className="flex items-center gap-2 mx-auto">
              <MessageSquarePlus className="w-4 h-4" />
              Dejar mi testimonio
            </Button>
          </div>
        )}

        {/* Modal de formulario */}
        <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Comparte tu experiencia">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Tu nombre (como pareja)"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Ej: María y Carlos"
            />
            <Textarea
              label="Tu testimonio"
              value={form.text}
              onChange={(e) => setForm((p) => ({ ...p, text: e.target.value }))}
              placeholder="Cuéntanos cómo te ha ayudado Somos Casa..."
              rows={4}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Calificación</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, rating: star }))}
                    className="focus:outline-none"
                  >
                    <Star className={`w-6 h-6 ${star <= form.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                  </button>
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-500">Tu testimonio será revisado por el administrador antes de publicarse.</p>
            <Button type="submit" loading={sending} className="w-full">
              Enviar Testimonio
            </Button>
          </form>
        </Modal>
      </div>
    </section>
  );
}
