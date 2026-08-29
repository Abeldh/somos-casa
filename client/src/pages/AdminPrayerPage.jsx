import { useState, useEffect } from 'react';
import { HandHeart, Check, Archive, Trash2, Clock, Lock, Globe, CheckCircle } from 'lucide-react';
import { prayerService } from '../services/prayer.service';
import { useToast } from '../hooks/useToast';
import Spinner from '../components/ui/Spinner';
import Pagination from '../components/ui/Pagination';

const FILTERS = [
  { value: '', label: 'Todas' },
  { value: 'PENDING', label: 'Pendientes' },
  { value: 'PRAYED', label: 'Oradas' },
  { value: 'ARCHIVED', label: 'Archivadas' },
];

export default function AdminPrayerPage() {
  const { success, error } = useToast();
  const [prayers, setPrayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const load = async () => {
    setLoading(true);
    try {
      const res = await prayerService.getAll(filter || undefined, page, limit);
      setPrayers(res.prayers || []);
      setTotalPages(res.totalPages || 1);
      setTotal(res.total || 0);
    } catch (e) { error(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [filter, page, limit]);

  // Al cambiar filtro o tamaño, volver a la página 1
  const changeFilter = (v) => { setFilter(v); setPage(1); };
  const changeLimit = (l) => { setLimit(l); setPage(1); };

  const handlePrayed = async (id) => {
    try { await prayerService.markPrayed(id); success('Marcada como orada'); load(); }
    catch (e) { error(e.message); }
  };

  const handleArchive = async (id) => {
    try { await prayerService.archive(id); success('Petición archivada'); load(); }
    catch (e) { error(e.message); }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta petición de oración?')) return;
    try { await prayerService.remove(id); success('Petición eliminada'); load(); }
    catch (e) { error(e.message); }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Peticiones de Oración</h1>
        <p className="text-sm text-gray-500">Acompaña en oración a quienes confían en el ministerio.</p>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => changeFilter(f.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === f.value ? 'bg-primary-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? <Spinner className="py-12" /> : prayers.length === 0 ? (
        <div className="text-center py-12">
          <HandHeart className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500">No hay peticiones en esta categoría.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {prayers.map((p) => (
            <div key={p.id} className={`bg-white rounded-xl border p-5 ${p.status === 'PENDING' ? 'border-amber-200' : 'border-gray-200'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="font-semibold text-gray-900 text-sm">{p.name}</p>
                    <StatusBadge status={p.status} />
                    <span className="inline-flex items-center gap-1 text-[11px] text-gray-400">
                      {p.isPrivate ? <><Lock className="w-3 h-3" /> Privada</> : <><Globe className="w-3 h-3" /> Pública</>}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{p.request}</p>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-400">
                    {p.user && <span>{p.user.firstName} {p.user.lastName} · {p.user.email}</span>}
                    {!p.user && <span>Invitado (sin cuenta)</span>}
                    <span>{new Date(p.createdAt).toLocaleString('es-MX')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {p.status !== 'PRAYED' && (
                    <button onClick={() => handlePrayed(p.id)} className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors" title="Marcar como orada">
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  {p.status !== 'ARCHIVED' && (
                    <button onClick={() => handleArchive(p.id)} className="p-2 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors" title="Archivar">
                      <Archive className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors" title="Eliminar">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && prayers.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          total={total}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={changeLimit}
        />
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  if (status === 'PRAYED') return <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700"><CheckCircle className="w-3 h-3" /> Orada</span>;
  if (status === 'ARCHIVED') return <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500"><Archive className="w-3 h-3" /> Archivada</span>;
  return <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700"><Clock className="w-3 h-3" /> Pendiente</span>;
}
