import { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, Star, StarOff, Pencil, X, Save, Eye, EyeOff } from 'lucide-react';
import { bookService } from '../services/book.service';
import { useToast } from '../hooks/useToast';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import Modal from '../components/ui/Modal';
import ImageUpload from '../components/ui/ImageUpload';

export default function AdminBooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', author: '', price: '', stock: '', category: '', coverImage: '', pdfUrl: '', description: '', isbn: '', pages: '', publisher: '' });
  const [saving, setSaving] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editSaving, setEditSaving] = useState(false);
  const { success, error } = useToast();

  const fetchBooks = async () => {
    setLoading(true);
    try { const d = await bookService.getAllAdmin(); setBooks(d.books || []); }
    catch (e) { error(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBooks(); }, []);

  const ch = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const editCh = (e) => setEditForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const create = async (e) => {
    e.preventDefault();
    if (!form.title || !form.author || !form.price) { error('Título, autor y precio obligatorios'); return; }
    setSaving(true);
    try {
      await bookService.create({ ...form, price: parseFloat(form.price), stock: parseInt(form.stock) || 0, pages: form.pages ? parseInt(form.pages) : null });
      success('Libro creado');
      setForm({ title: '', author: '', price: '', stock: '', category: '', coverImage: '', pdfUrl: '', description: '', isbn: '', pages: '', publisher: '' });
      fetchBooks();
    } catch (e) { error(e.message); }
    finally { setSaving(false); }
  };

  const openEdit = (book) => {
    setEditBook(book);
    setEditForm({
      title: book.title || '',
      author: book.author || '',
      price: String(book.price || ''),
      stock: String(book.stock || ''),
      category: book.category || '',
      coverImage: book.coverImage || '',
      pdfUrl: book.pdfUrl || '',
      description: book.description || '',
      isbn: book.isbn || '',
      pages: book.pages ? String(book.pages) : '',
      publisher: book.publisher || '',
    });
  };

  const saveEdit = async () => {
    if (!editForm.title || !editForm.author || !editForm.price) { error('Título, autor y precio obligatorios'); return; }
    setEditSaving(true);
    try {
      await bookService.update(editBook.id, {
        title: editForm.title,
        author: editForm.author,
        price: parseFloat(editForm.price),
        stock: parseInt(editForm.stock) || 0,
        category: editForm.category || null,
        coverImage: editForm.coverImage || null,
        pdfUrl: editForm.pdfUrl || null,
        description: editForm.description || null,
        isbn: editForm.isbn || null,
        pages: editForm.pages ? parseInt(editForm.pages) : null,
        publisher: editForm.publisher || null,
      });
      success('Libro actualizado');
      setEditBook(null);
      fetchBooks();
    } catch (e) { error(e.message); }
    finally { setEditSaving(false); }
  };

  const del = async (id) => { try { await bookService.toggleActive(id); fetchBooks(); } catch (e) { error(e.message); } };
  const feat = async (id) => { try { await bookService.toggleFeatured(id); fetchBooks(); } catch (e) { error(e.message); } };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-gray-900">Gestión de Libros</h1>
        <p className="text-gray-500 mt-1">Administra el catálogo de la librería.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form crear */}
        <form onSubmit={create} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 h-fit">
          <h4 className="font-semibold text-gray-900">Agregar libro</h4>
          <Input label="Título *" name="title" value={form.title} onChange={ch} />
          <Input label="Autor *" name="author" value={form.author} onChange={ch} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Precio *" name="price" type="number" step="0.01" value={form.price} onChange={ch} />
            <Input label="Stock" name="stock" type="number" value={form.stock} onChange={ch} />
          </div>
          <Input label="Categoría" name="category" value={form.category} onChange={ch} placeholder="Matrimonio, Fe..." />
          <ImageUpload label="Portada" value={form.coverImage} onChange={(url) => setForm((p) => ({ ...p, coverImage: url }))} />
          <Input label="URL del PDF (Cloudinary)" name="pdfUrl" value={form.pdfUrl} onChange={ch} placeholder="https://res.cloudinary.com/.../libro.pdf" />
          <Input label="Editorial" name="publisher" value={form.publisher} onChange={ch} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Páginas" name="pages" type="number" value={form.pages} onChange={ch} />
            <Input label="ISBN" name="isbn" value={form.isbn} onChange={ch} />
          </div>
          <Textarea label="Descripción" name="description" value={form.description} onChange={ch} rows={3} />
          <Button type="submit" loading={saving} className="w-full flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" />Agregar
          </Button>
        </form>

        {/* Lista de libros */}
        <div className="lg:col-span-2">
          <h4 className="font-semibold text-gray-900 mb-4">Catálogo ({books.length})</h4>
          {loading ? <Spinner /> : books.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Sin libros registrados.</p>
          ) : (
            <div className="space-y-3">
              {books.map((b) => (
                <div key={b.id} className={`bg-white rounded-xl border p-4 flex items-center gap-4 ${!b.isActive ? 'opacity-50 border-red-200' : 'border-gray-200'}`}>
                  <div className="w-12 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    {b.coverImage ? <img src={b.coverImage} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><BookOpen className="w-5 h-5 text-gray-300" /></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{b.title}</p>
                    <p className="text-xs text-gray-500">{b.author} • ${b.price.toFixed(2)} • Stock: {b.stock}</p>
                  </div>
                  {b.category && <span className="hidden sm:inline-block text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{b.category}</span>}
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(b)} className="text-gray-400 hover:text-blue-600 transition-colors" title="Editar">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => feat(b.id)} className={`${b.isFeatured ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-500'} transition-colors`} title={b.isFeatured ? 'Quitar destacado' : 'Destacar'}>
                      {b.isFeatured ? <Star className="w-4 h-4 fill-yellow-400" /> : <StarOff className="w-4 h-4" />}
                    </button>
                    <button onClick={() => del(b.id)} className={`${b.isActive ? 'text-green-500 hover:text-red-500' : 'text-red-400 hover:text-green-500'} transition-colors`} title={b.isActive ? 'Desactivar' : 'Activar'}>
                      {b.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de edición */}
      <Modal isOpen={!!editBook} onClose={() => setEditBook(null)} title="Editar Libro">
        {editBook && (
          <div className="space-y-4">
            <Input label="Título *" name="title" value={editForm.title} onChange={editCh} />
            <Input label="Autor *" name="author" value={editForm.author} onChange={editCh} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Precio *" name="price" type="number" step="0.01" value={editForm.price} onChange={editCh} />
              <Input label="Stock" name="stock" type="number" value={editForm.stock} onChange={editCh} />
            </div>
            <Input label="Categoría" name="category" value={editForm.category} onChange={editCh} />
            <ImageUpload label="Portada" value={editForm.coverImage} onChange={(url) => setEditForm((p) => ({ ...p, coverImage: url }))} />
            <Input label="URL del PDF" name="pdfUrl" value={editForm.pdfUrl} onChange={editCh} placeholder="https://res.cloudinary.com/.../libro.pdf" />
            <Input label="Editorial" name="publisher" value={editForm.publisher} onChange={editCh} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Páginas" name="pages" type="number" value={editForm.pages} onChange={editCh} />
              <Input label="ISBN" name="isbn" value={editForm.isbn} onChange={editCh} />
            </div>
            <Textarea label="Descripción" name="description" value={editForm.description} onChange={editCh} rows={3} />
            <div className="flex gap-3 pt-4">
              <Button variant="ghost" onClick={() => setEditBook(null)} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={saveEdit} loading={editSaving} className="flex-1 flex items-center justify-center gap-2">
                <Save className="w-4 h-4" />Guardar Cambios
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
