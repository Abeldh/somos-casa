import { useState, useEffect } from 'react';
import { BookOpen, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { blogService } from '../services/blog.service';
import { useToast } from '../hooks/useToast';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import ImageUpload from '../components/ui/ImageUpload';
import Modal from '../components/ui/Modal';
import Spinner from '../components/ui/Spinner';

const empty = { title: '', excerpt: '', content: '', coverImage: '', author: 'Somos Casa', category: '', isPublished: false };

export default function AdminBlogPage() {
  const { success, error } = useToast();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await blogService.getAll();
      setPosts(res.posts || []);
    } catch (e) { error(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(empty); setShowModal(true); };
  const openEdit = (p) => {
    setEditing(p);
    setForm({
      title: p.title, excerpt: p.excerpt || '', content: p.content, coverImage: p.coverImage || '',
      author: p.author, category: p.category || '', isPublished: p.isPublished,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content) { error('Título y contenido son requeridos.'); return; }
    setSaving(true);
    try {
      if (editing) {
        await blogService.update(editing.id, form);
        success('Artículo actualizado');
      } else {
        await blogService.create(form);
        success('Artículo creado');
      }
      setShowModal(false);
      load();
    } catch (err) { error(err.message); }
    finally { setSaving(false); }
  };

  const togglePublish = async (p) => {
    try { await blogService.update(p.id, { isPublished: !p.isPublished }); success('Estado actualizado'); load(); }
    catch (e) { error(e.message); }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este artículo?')) return;
    try { await blogService.remove(id); success('Artículo eliminado'); load(); }
    catch (e) { error(e.message); }
  };

  const published = posts.filter((p) => p.isPublished);
  const drafts = posts.filter((p) => !p.isPublished);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog</h1>
          <p className="text-sm text-gray-500">Publica artículos cristianos para tu comunidad.</p>
        </div>
        <Button onClick={openNew} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nuevo Artículo
        </Button>
      </div>

      {loading ? <Spinner className="py-12" /> : posts.length === 0 ? (
        <p className="text-center text-gray-500 py-12">Aún no hay artículos. Crea el primero.</p>
      ) : (
        <div className="space-y-8">
          {drafts.length > 0 && (
            <Section title={`Borradores (${drafts.length})`}>
              {drafts.map((p) => <PostRow key={p.id} post={p} onEdit={openEdit} onToggle={togglePublish} onDelete={handleDelete} />)}
            </Section>
          )}
          {published.length > 0 && (
            <Section title={`Publicados (${published.length})`}>
              {published.map((p) => <PostRow key={p.id} post={p} onEdit={openEdit} onToggle={togglePublish} onDelete={handleDelete} />)}
            </Section>
          )}
        </div>
      )}

      {showModal && (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Editar artículo' : 'Nuevo artículo'}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="El perdón en el matrimonio" />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Autor" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
              <Input label="Categoría" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Comunicación" />
            </div>
            <Textarea label="Resumen (opcional)" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} placeholder="Breve descripción que aparece en la lista..." />
            <ImageUpload label="Imagen de portada" value={form.coverImage} onChange={(url) => setForm({ ...form, coverImage: url })} />
            <Textarea label="Contenido" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={10} placeholder="Escribe el artículo aquí. Los saltos de línea se respetan." />
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
              Publicar de inmediato
            </label>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={() => setShowModal(false)} className="flex-1">Cancelar</Button>
              <Button type="submit" loading={saving} className="flex-1">{editing ? 'Guardar' : 'Crear'}</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h3 className="font-semibold text-gray-900 mb-3">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function PostRow({ post: p, onEdit, onToggle, onDelete }) {
  return (
    <div className={`bg-white rounded-xl border p-4 flex items-center gap-4 ${p.isPublished ? 'border-green-200' : 'border-gray-200'}`}>
      <div className="w-16 h-12 rounded-lg bg-warm-100 overflow-hidden flex-shrink-0">
        {p.coverImage ? <img src={p.coverImage} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><BookOpen className="w-4 h-4 text-primary-200" /></div>}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 text-sm truncate">{p.title}</p>
        <p className="text-xs text-gray-400">{p.category || 'Sin categoría'} · {p.author}</p>
      </div>
      <span className={`hidden sm:inline text-xs px-2 py-0.5 rounded-full font-medium ${p.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
        {p.isPublished ? 'Publicado' : 'Borrador'}
      </span>
      <div className="flex items-center gap-1 flex-shrink-0">
        <button onClick={() => onToggle(p)} className="p-2 rounded-lg hover:bg-gray-100" title={p.isPublished ? 'Despublicar' : 'Publicar'}>
          {p.isPublished ? <EyeOff className="w-4 h-4 text-gray-500" /> : <Eye className="w-4 h-4 text-green-600" />}
        </button>
        <button onClick={() => onEdit(p)} className="p-2 rounded-lg hover:bg-gray-100" title="Editar"><Edit className="w-4 h-4 text-gray-500" /></button>
        <button onClick={() => onDelete(p.id)} className="p-2 rounded-lg hover:bg-red-50" title="Eliminar"><Trash2 className="w-4 h-4 text-red-400" /></button>
      </div>
    </div>
  );
}
