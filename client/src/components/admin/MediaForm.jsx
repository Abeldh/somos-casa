import { useState } from 'react';
import { Plus } from 'lucide-react';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { useToast } from '../../hooks/useToast';
import { mediaService } from '../../services/media.service';

const typeOptions = [
  { value: 'SPOTIFY', label: 'Spotify (Podcast)' },
  { value: 'YOUTUBE', label: 'YouTube (Video)' },
];

export default function MediaForm({ onCreated }) {
  const [form, setForm] = useState({ type: 'SPOTIFY', title: '', url: '', description: '', category: '' });
  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.url) {
      error('Título y URL son obligatorios');
      return;
    }

    setLoading(true);
    try {
      await mediaService.create(form);
      success('Contenido agregado');
      setForm({ type: 'SPOTIFY', title: '', url: '', description: '', category: '' });
      onCreated?.();
    } catch (err) {
      error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <h4 className="font-semibold text-gray-900">Agregar contenido</h4>

      <Select
        label="Tipo"
        name="type"
        value={form.type}
        onChange={handleChange}
        options={typeOptions}
      />

      <Input
        label="Título"
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Nombre del episodio o video"
      />

      <Input
        label="URL"
        name="url"
        value={form.url}
        onChange={handleChange}
        placeholder={form.type === 'SPOTIFY' ? 'https://open.spotify.com/episode/...' : 'https://youtube.com/watch?v=...'}
      />

      <Input
        label="Categoría (opcional)"
        name="category"
        value={form.category}
        onChange={handleChange}
        placeholder="Ej: Comunicación, Finanzas, Intimidad"
      />

      <Textarea
        label="Descripción (opcional)"
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Breve descripción del contenido..."
        rows={3}
      />

      <Button type="submit" loading={loading} className="w-full flex items-center justify-center gap-2">
        <Plus className="w-4 h-4" />
        Agregar
      </Button>
    </form>
  );
}
