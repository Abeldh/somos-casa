import { useState, useEffect } from 'react';
import { History, Star, FileText, MessageSquarePlus, CheckCircle } from 'lucide-react';
import { appointmentService } from '../../services/appointment.service';
import { useToast } from '../../hooks/useToast';
import { formatDate, formatTime } from '../../utils/formatDate';
import Button from '../ui/Button';
import Textarea from '../ui/Textarea';
import Modal from '../ui/Modal';
import Spinner from '../ui/Spinner';
import Pagination from '../ui/Pagination';

export default function SessionHistory() {
  const { success, error } = useToast();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [rating, setRating] = useState(null); // cita seleccionada para calificar
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState('');
  const [sending, setSending] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await appointmentService.getMyHistory({ page, limit });
      setSessions(res.appointments || []);
      setTotalPages(res.totalPages || 1);
      setTotal(res.total || 0);
    } catch (e) { /* silencioso */ }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [page, limit]);
  const changeLimit = (l) => { setLimit(l); setPage(1); };

  const openRating = (session) => {
    setRating(session);
    setStars(session.rating || 0);
    setComment(session.ratingComment || '');
  };

  const submitRating = async () => {
    if (stars < 1) { error('Selecciona una calificación de 1 a 5 estrellas.'); return; }
    setSending(true);
    try {
      await appointmentService.rate(rating.id, { rating: stars, comment });
      success('¡Gracias por tu calificación!');
      setRating(null);
      load();
    } catch (e) { error(e.message); }
    finally { setSending(false); }
  };

  if (loading) return <Spinner className="py-8" />;

  if (total === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
        <History className="w-10 h-10 text-gray-200 mx-auto mb-2" />
        <p className="text-sm text-gray-500">Aún no tienes sesiones completadas en tu historial.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sessions.map((s) => (
        <div key={s.id} className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="font-medium text-gray-900">{formatDate(s.date)} · {formatTime(s.startTime)} - {formatTime(s.endTime)}</p>
              <p className="text-sm text-gray-500 mt-0.5">Sesión con {s.partnerName}</p>
            </div>
            <div className="flex items-center gap-2">
              {s.rating ? (
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < s.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                  ))}
                </div>
              ) : (
                <Button variant="outline" size="sm" onClick={() => openRating(s)} className="flex items-center gap-1.5">
                  <MessageSquarePlus className="w-4 h-4" /> Calificar
                </Button>
              )}
            </div>
          </div>

          {/* Notas públicas del consejero */}
          {s.sessionNotes && s.sessionNotes.length > 0 && (
            <div className="mt-4 space-y-2">
              {s.sessionNotes.map((n) => (
                <div key={n.id} className="bg-primary-50 border border-primary-100 rounded-lg p-3">
                  <p className="text-xs font-medium text-primary-700 flex items-center gap-1.5 mb-1">
                    <FileText className="w-3.5 h-3.5" /> Nota del consejero
                  </p>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{n.content}</p>
                </div>
              ))}
            </div>
          )}

          {s.rating && s.ratingComment && (
            <p className="text-xs text-gray-500 italic mt-3 flex items-start gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
              Tu comentario: "{s.ratingComment}"
            </p>
          )}
        </div>
      ))}

      <Pagination page={page} totalPages={totalPages} total={total} limit={limit} onPageChange={setPage} onLimitChange={changeLimit} />

      {/* Modal de calificación */}
      <Modal isOpen={!!rating} onClose={() => setRating(null)} title="Califica tu sesión">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">¿Cómo fue tu experiencia en esta sesión de consejería?</p>
          <div className="flex items-center justify-center gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <button key={i} type="button" onClick={() => setStars(i + 1)} className="transition-transform hover:scale-110">
                <Star className={`w-9 h-9 ${i < stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
              </button>
            ))}
          </div>
          <Textarea
            label="Comentario (opcional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Comparte cómo Dios te ministró en esta sesión..."
            rows={3}
          />
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setRating(null)} className="flex-1">Cancelar</Button>
            <Button onClick={submitRating} loading={sending} className="flex-1">Enviar calificación</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
