import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Paginación reutilizable.
 * Props:
 *  - page: página actual (1-indexed)
 *  - totalPages: total de páginas
 *  - total: total de registros (opcional, para mostrar "X resultados")
 *  - limit: tamaño de página actual
 *  - onPageChange(nextPage)
 *  - onLimitChange(nextLimit)  -> opcional; si se pasa, muestra el selector
 *  - pageSizes: opciones del selector (default [10, 25, 50])
 */
export default function Pagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  onLimitChange,
  pageSizes = [10, 25, 50],
}) {
  if (!totalPages || totalPages < 1) return null;

  // Construir el rango de números de página visible (máx ~5)
  const pages = [];
  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
  const end = Math.min(totalPages, start + 4);
  for (let i = start; i <= end; i++) pages.push(i);

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6">
      {/* Info + selector de tamaño */}
      <div className="flex items-center gap-3 text-sm text-gray-500">
        {typeof total === 'number' && (
          <span>{total} {total === 1 ? 'registro' : 'registros'}</span>
        )}
        {onLimitChange && (
          <label className="flex items-center gap-1.5">
            <span className="hidden sm:inline">Por página:</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="border border-gray-200 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {pageSizes.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>
        )}
      </div>

      {/* Controles */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <button
            onClick={() => canPrev && onPageChange(page - 1)}
            disabled={!canPrev}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Página anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {start > 1 && (
            <>
              <PageBtn n={1} active={page === 1} onClick={onPageChange} />
              {start > 2 && <span className="px-1 text-gray-400">…</span>}
            </>
          )}

          {pages.map((n) => (
            <PageBtn key={n} n={n} active={n === page} onClick={onPageChange} />
          ))}

          {end < totalPages && (
            <>
              {end < totalPages - 1 && <span className="px-1 text-gray-400">…</span>}
              <PageBtn n={totalPages} active={page === totalPages} onClick={onPageChange} />
            </>
          )}

          <button
            onClick={() => canNext && onPageChange(page + 1)}
            disabled={!canNext}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Página siguiente"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

function PageBtn({ n, active, onClick }) {
  return (
    <button
      onClick={() => onClick(n)}
      className={`min-w-[36px] h-9 px-2 rounded-lg text-sm font-medium transition-colors ${
        active ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {n}
    </button>
  );
}
