import { useState, useEffect } from 'react';
import { Download, BookOpen, CheckCircle } from 'lucide-react';
import { orderService } from '../../services/order.service';
import Spinner from '../ui/Spinner';

export default function MyBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getMyBooks()
      .then((data) => setBooks(data.books || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner className="py-8" />;

  if (books.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
        <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-3" />
        <h4 className="font-medium text-gray-900 mb-1">Sin libros disponibles</h4>
        <p className="text-sm text-gray-500">Tus libros aparecerán aquí una vez que se confirme tu pago.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {books.map((book) => (
        <div key={book.id} className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 flex gap-4 items-center">
          {/* Cover */}
          <div className="w-14 h-20 sm:w-16 sm:h-22 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            {book.coverImage ? (
              <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary-50">
                <BookOpen className="w-6 h-6 text-primary-200" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{book.title}</h4>
            <p className="text-xs text-gray-500 mt-0.5">{book.author}</p>
            <div className="flex items-center gap-1 mt-2">
              <CheckCircle className="w-3.5 h-3.5 text-green-500" />
              <span className="text-xs text-green-700">Pago confirmado</span>
            </div>
          </div>

          {/* Download button */}
          {book.pdfUrl ? (
            <a
              href={book.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Descargar</span>
            </a>
          ) : (
            <span className="text-xs text-gray-400 bg-gray-50 px-3 py-2 rounded-lg">Preparando...</span>
          )}
        </div>
      ))}
    </div>
  );
}
