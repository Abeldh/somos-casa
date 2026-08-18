import { useState, useEffect } from 'react';
import { Search, BookOpen } from 'lucide-react';
import { useBooks } from '../hooks/useBooks';
import { bookService } from '../services/book.service';
import BookCard from '../components/store/BookCard';
import Spinner from '../components/ui/Spinner';

export default function StorePage() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const { books, loading, total, pages, fetchBooks } = useBooks();

  useEffect(() => { bookService.getCategories().then((d) => setCategories(d.categories || [])).catch(() => {}); }, []);
  useEffect(() => { fetchBooks({ search, category, page }); }, [search, category, page]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 rounded-full px-4 py-2 text-sm font-medium mb-4">
          <BookOpen className="w-4 h-4" />
          Librería
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900">Nuestra Librería</h1>
        <p className="text-gray-500 mt-2 max-w-lg mx-auto">Recursos para fortalecer tu matrimonio y caminar en fe.</p>
      </div>

      <div className="mb-8 space-y-4">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Buscar por título o autor..." className="input-field pl-10" />
        </div>
        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2">
            <button onClick={() => { setCategory(''); setPage(1); }} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!category ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Todos</button>
            {categories.map((cat) => (
              <button key={cat} onClick={() => { setCategory(cat === category ? '' : cat); setPage(1); }} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${category === cat ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{cat}</button>
            ))}
          </div>
        )}
      </div>

      {loading ? <Spinner className="py-20" /> : books.length === 0 ? (
        <div className="text-center py-20"><BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">No se encontraron libros.</p></div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-6">{total} libro{total !== 1 ? 's' : ''}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {books.map((book) => <BookCard key={book.id} book={book} />)}
          </div>
          {pages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)} className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${page === p ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{p}</button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
