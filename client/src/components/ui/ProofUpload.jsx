import { useState, useRef } from 'react';
import { Upload, CheckCircle, X, Loader2, Receipt } from 'lucide-react';
import { classNames } from '../../utils/helpers';

const CLOUD_NAME = 'nydmdxao';
const UPLOAD_PRESET = 'ml_default';

export default function ProofUpload({ value, onChange, label = 'Comprobante de pago' }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  const upload = async (file) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);
      formData.append('folder', 'somos-casa/comprobantes');

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
      const data = await res.json();
      if (data.secure_url) onChange(data.secure_url);
    } catch (err) { console.error('Upload error:', err); }
    finally { setUploading(false); }
  };

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') { alert('Solo imágenes o PDF'); return; }
    if (file.size > 10 * 1024 * 1024) { alert('Máximo 10MB'); return; }
    upload(file);
  };

  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); };

  if (value) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-green-800">Comprobante enviado</p>
            <a href={value} target="_blank" rel="noopener noreferrer" className="text-xs text-green-600 hover:underline">Ver comprobante ↗</a>
          </div>
          <button type="button" onClick={() => onChange('')} className="w-6 h-6 bg-red-100 text-red-500 rounded-full flex items-center justify-center hover:bg-red-200">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={classNames(
          'border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all',
          dragOver ? 'border-green-400 bg-green-50' : 'border-gray-200 hover:border-green-300 hover:bg-gray-50',
          uploading && 'pointer-events-none opacity-60'
        )}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-7 h-7 text-green-500 animate-spin" />
            <p className="text-sm text-gray-500">Subiendo comprobante...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Receipt className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-sm text-gray-600 font-medium">Click o arrastra tu comprobante</p>
            <p className="text-xs text-gray-400">Imagen o PDF • Máx 10MB</p>
          </div>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
    </div>
  );
}
