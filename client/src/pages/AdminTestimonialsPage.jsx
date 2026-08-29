import { useState, useEffect } from 'react';
import { MessageSquare, Check, X, Star, Eye, EyeOff, Trash2 } from 'lucide-react';
import { useToast } from '../hooks/useToast';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import Pagination from '../components/ui/Pagination';
import api from '../services/api';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const { success, error } = useToast();

  const fetch = async () => {
    setLoading(true);
    try {
      const data = await api.get('/testimonials', { params: { page, limit } });
      setTestimonials(data.testimonials || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    }
    catch (e) { error(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [page, limit]);
  const changeLimit = (l) => { setLimit(l); setPage(1); };

  const handleToggle = async (id) => {
    try { await api.patch(`/testimonials/${id}/toggle`); success('Estado actualizado'); fetch(); }
    catch (e) { error(e.message); }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este testimonio?')) return;
    try { await api.delete(`/testimonials/${id}`); success('Eliminado'); fetch(); }
    catch (e) { error(e.message); }
  };

  const approved = testimonials.filter((t) => t.isApproved);
  const pending = testimonials.filter((t) => !t.isApproved);

  const formatDate = (d) => new Date(d).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-gray-900">Testimonios</h1>
        <p className="text-gray-500 mt-1">Aprueba o rechaza testimonios de usuarios para la página principal.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{total}</p>
          <p className="text-xs text-gray-500">Total</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">{pending.length}</p>
          <p className="text-xs text-gray-500">Pendientes (página)</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{approved.length}</p>
          <p className="text-xs text-gray-500">Publicados (página)</p>
        </div>
      </div>

      {loading ? <Spinner className="py-12" /> : testimonials.length === 0 ? (
        <p className="text-center text-gray-500 py-12">No hay testimonios aún.</p>
      ) : (
        <>
          <div className="space-y-3">
            {testimonials.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} onToggle={handleToggle} onDelete={handleDelete} />
            ))}
          </div>

          <Pagination page={page} totalPages={totalPages} total={total} limit={limit} onPageChange={setPage} onLimitChange={changeLimit} />
        </>
      )}
    </div>
  );
}

function TestimonialCard({ testimonial: t, onToggle, onDelete }) {
  return (
    <div className={`bg-white rounded-xl border p-5 ${t.isApproved ? 'border-green-200' : 'border-yellow-200'}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
            <div className="flex gap-0.5">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${t.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {t.isApproved ? 'Publicado' : 'Pendiente'}
            </span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">"{t.text}"</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
            {t.user && <span>{t.user.firstName} {t.user.lastName} ({t.user.email})</span>}
            <span>{new Date(t.createdAt).toLocaleDateString('es-MX')}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => onToggle(t.id)}
            className={`p-2 rounded-lg transition-colors ${t.isApproved ? 'bg-green-50 text-green-600 hover:bg-yellow-50 hover:text-yellow-600' : 'bg-yellow-50 text-yellow-600 hover:bg-green-50 hover:text-green-600'}`}
            title={t.isApproved ? 'Ocultar de la página' : 'Aprobar y publicar'}
          >
            {t.isApproved ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button onClick={() => onDelete(t.id)} className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors" title="Eliminar">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
