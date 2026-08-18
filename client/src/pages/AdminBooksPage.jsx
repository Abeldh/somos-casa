import { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, Star, StarOff } from 'lucide-react';
import { bookService } from '../services/book.service';
import { useToast } from '../hooks/useToast';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';

export default function AdminBooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', author: '', price: '', stock: '', category: '', coverImage: '', description: '', isbn: '', pages: '', publisher: '' });
  const [saving, setSaving] = useState(false);
  const { success, error } = useToast();

  const fetchBooks = async () => { setLoading(true); try { const d = await bookService.getAllAdmin(); setBooks(d.books || []); } catch (e) { error(e.message); } finally { setLoading(false); } };
  useEffect(() => { fetchBooks(); }, []);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title || !form.author || !form.price) { error('Título, autor y precio son obligatorios'); return; }
    setSaving(true);
    try {
      await bookService.create({ ...form, price: parseFloat(form.price), stock: parseInt(form.stock) || 0, pages: form.pages ? parseInt(form.pages) : null });
      success('Libro creado');
      setForm({ title: '', author: '', price: '', stock: '', category: '', coverImage: '', description: '', isbn: '', pages: '', publisher: '' });
      fetchBooks();
    } catch (e) { error(e.message); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => { if (!confirm('¿Desactivar este libro?')) return; try { await bookService.remove(id); success('Libro desactivado'); fetchBooks(); } catch (e) { error(e.message); } };
  const handleToggleFeatured = async (id) => { try { await bookService.toggleFeatured(id); fetchBooks(); } catch (e) { error(e.message); } };

  return (
    <div>
      <div className="mb-8"><h1 className="text-2xl font-display font-bold text-gray-900">Gestión de Libros</h1><p className="text-gray-500 mt-1">Administra el catálogo de la librería.</p></div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleCreate} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 h-fit">
          <h4 className="font-semibold text-gray-900">Agregar libro</h4>
          <Input label="Título *" name="title" value={form.title} onChange={handleChange} />
          <Input label="Autor *" name="author" value={form.author} onChange={handleChange} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Precio *" name="price" type="number" step="0.01" value={form.price} onChange={handleChange} />
            <Input label="Stock" name="stock" type="number" value={form.stock} onChange={handleChange} />
          </div>
          <Input label="Categoría" name="category" value={form.category} onChange={handleChange} placeholder="Matrimonio, Fe, Liderazgo..." />
          <Input label="URL Portada" name="coverImage" value={form.coverImage} onChange={handleChange} placeholder="https://..." />
          <Input label="Editorial" name="publisher" value={form.publisher} onChange={handleChange} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Páginas" name="pages" type="number" value={form.pages} onChange={handleChange} />
            <Input label="ISBN" name="isbn" value={form.isbn} onChange={handleChange} />
          </div>
          <Textarea label="Descripción" name="description" value={form.description} onChange={handleChange} rows={3} />
          <Button type="submit" loading={saving} className="w-full flex items-center justify-center gap-2"><Plus className="w-4 h-4" />Agregar Libro</Button>
        </form>

        <div className="lg:col-span-2">
          <h4 className="font-semibold text-gray-900 mb-4">Catálogo ({books.length})</h4>
          {loading ? <Spinner /> : books.length === 0 ? <p className="text-gray-500 text-center py-8">Sin libros registrados.</p> : (
            <div className="space-y-3">
              {books.map((book) => (
                <div key={book.id} className={`bg-white rounded-xl border p-4 flex items-center gap-4 ${!book.isActive ? 'opacity-50 border-red-200' : 'border-gray-200'}`}>
                  <div className="w-12 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    {book.coverImage ? <img src={book.coverImage} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><BookOpen className="w-5 h-5 text-gray-300" /></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{book.title}</p>
                    <p className="text-xs text-gray-500">{book.author} • ${book.price.toFixed(2)} • Stock: {book.stock}</p>
                  </div>
                  {book.category && <span className="hidden sm:inline-block text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{book.category}</span>}
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleToggleFeatured(book.id)} className={`${book.isFeatured ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-500'} transition-colors`} title={book.isFeatured ? 'Quitar destacado' : 'Destacar'}>
                      {book.isFeatured ? <Star className="w-4 h-4 fill-yellow-400" /> : <StarOff className="w-4 h-4" />}
                    </button>
                    <button onClick={() => handleDelete(book.id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
