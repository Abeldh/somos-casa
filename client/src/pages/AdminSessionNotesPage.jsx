import { useState, useEffect } from 'react';
import { FileText, Plus, Edit, Trash2, Calendar, User, Search } from 'lucide-react';
import { sessionNoteService } from '../services/sessionNote.service';
import { appointmentService } from '../services/appointment.service';
import { formatDate, formatTime } from '../utils/formatDate';
import { useToast } from '../hooks/useToast';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import Modal from '../components/ui/Modal';

export default function AdminSessionNotesPage() {
  const [appointments, setAppointments] = useState([]);
  const [selectedApt, setSelectedApt] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notesLoading, setNotesLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [content, setContent] = useState('');
  const [shareWithUser, setShareWithUser] = useState(false);
  const [filter, setFilter] = useState('COMPLETED');
  const { success, error } = useToast();

  useEffect(() => { loadAppointments(); }, [filter]);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const res = await appointmentService.getAll({ status: filter || undefined });
      setAppointments(res.appointments || []);
    } catch (e) {
      console.error('Error citas:', e);
      setAppointments([]);
    }
    finally { setLoading(false); }
  };

  const loadNotes = async (appointmentId) => {
    setNotesLoading(true);
    try {
      const res = await sessionNoteService.getByAppointment(appointmentId);
      setNotes(res.notes || []);
    } catch (e) { setNotes([]); }
    finally { setNotesLoading(false); }
  };

  const handleSelectAppointment = (apt) => {
    setSelectedApt(apt);
    loadNotes(apt.id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      if (editingNote) {
        await sessionNoteService.update(editingNote.id, content, !shareWithUser);
        success('Nota actualizada');
      } else {
        await sessionNoteService.create({ appointmentId: selectedApt.id, content, isPrivate: !shareWithUser });
        success('Nota agregada');
      }
      setShowModal(false);
      setEditingNote(null);
      setContent('');
      setShareWithUser(false);
      loadNotes(selectedApt.id);
    } catch (e) { error(e.response?.data?.message || 'Error'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta nota?')) return;
    try {
      await sessionNoteService.delete(id);
      success('Nota eliminada');
      loadNotes(selectedApt.id);
    } catch (e) { error('Error al eliminar'); }
  };

  if (loading) return <Spinner className="py-20" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Notas de Sesión</h1>
        <p className="text-sm text-gray-500">Agrega notas privadas del consejero a cada sesión</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de citas */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-3 border-b border-gray-100">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2"
            >
              <option value="COMPLETED">Completadas</option>
              <option value="CONFIRMED">Confirmadas</option>
              <option value="">Todas</option>
            </select>
          </div>
          <div className="max-h-[600px] overflow-y-auto divide-y divide-gray-50">
            {appointments.map((apt) => (
              <button
                key={apt.id}
                onClick={() => handleSelectAppointment(apt)}
                className={`w-full text-left p-3 hover:bg-gray-50 transition-colors ${selectedApt?.id === apt.id ? 'bg-primary-50 border-l-2 border-primary-600' : ''}`}
              >
                <p className="text-sm font-medium text-gray-900">{apt.user?.firstName} {apt.user?.lastName}</p>
                <p className="text-xs text-gray-500">{formatDate(apt.date)} • {formatTime(apt.startTime)}</p>
                <p className="text-xs text-gray-400">Pareja: {apt.partnerName}</p>
              </button>
            ))}
            {appointments.length === 0 && <p className="p-4 text-sm text-gray-400 text-center">Sin citas</p>}
          </div>
        </div>

        {/* Notas */}
        <div className="lg:col-span-2">
          {selectedApt ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedApt.user?.firstName} {selectedApt.user?.lastName}</h3>
                  <p className="text-sm text-gray-500">{formatDate(selectedApt.date)} • {formatTime(selectedApt.startTime)} - {formatTime(selectedApt.endTime)}</p>
                </div>
                <Button size="sm" onClick={() => { setEditingNote(null); setContent(''); setShareWithUser(false); setShowModal(true); }} className="flex items-center gap-1">
                  <Plus className="w-4 h-4" /> Agregar Nota
                </Button>
              </div>

              {selectedApt.reason && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-xs text-gray-500 font-medium mb-1">Motivo de consulta:</p>
                  <p className="text-sm text-gray-700">{selectedApt.reason}</p>
                </div>
              )}

              {notesLoading ? <Spinner className="py-8" /> : (
                <div className="space-y-3">
                  {notes.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">Sin notas para esta sesión</p>
                    </div>
                  ) : notes.map((note) => (
                    <div key={note.id} className="border border-gray-100 rounded-lg p-4 group">
                      <div className="flex items-start justify-between">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap flex-1">{note.content}</p>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                          <button onClick={() => { setEditingNote(note); setContent(note.content); setShareWithUser(!note.isPrivate); setShowModal(true); }} className="p-1 hover:bg-gray-100 rounded">
                            <Edit className="w-3.5 h-3.5 text-gray-400" />
                          </button>
                          <button onClick={() => handleDelete(note.id)} className="p-1 hover:bg-red-50 rounded">
                            <Trash2 className="w-3.5 h-3.5 text-red-400" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] text-gray-400">{new Date(note.createdAt).toLocaleString('es-MX')}</span>
                        {note.isPrivate ? (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500">Privada</span>
                        ) : (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">Compartida con el usuario</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <FileText className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400">Selecciona una cita para ver o agregar notas</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)} title={editingNote ? 'Editar Nota' : 'Nueva Nota de Sesión'}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Escribe aquí las observaciones de la sesión..."
              required
            />
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={shareWithUser}
                onChange={(e) => setShareWithUser(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-xs text-gray-600">
                Compartir esta nota con el usuario.
                <span className="block text-gray-400">
                  {shareWithUser
                    ? 'El usuario verá esta nota como "Nota del consejero" en su historial de sesiones.'
                    : 'La nota permanece privada y solo será visible para administradores.'}
                </span>
              </span>
            </label>
            <div className="flex gap-3">
              <Button type="button" variant="ghost" onClick={() => setShowModal(false)} className="flex-1">Cancelar</Button>
              <Button type="submit" className="flex-1">{editingNote ? 'Guardar' : 'Agregar Nota'}</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
