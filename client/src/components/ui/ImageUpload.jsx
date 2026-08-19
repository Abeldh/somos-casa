import { useState, useRef } from 'react';
import { Upload, X, Image, Loader2 } from 'lucide-react';
import { classNames } from '../../utils/helpers';

const CLOUD_NAME = 'nydmdxao';
const UPLOAD_PRESET = 'ml_default';

export default function ImageUpload({ value, onChange, label = 'Portada' }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  const uploadToCloudinary = async (file) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);
      formData.append('folder', 'somos-casa');

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.secure_url) {
        onChange(data.secure_url);
      } else {
        console.error('Upload failed:', data);
      }
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    if (file.size > 10 * 1024 * 1024) { alert('Máximo 10MB'); return; }
    uploadToCloudinary(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleRemove = () => {
    onChange('');
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {value ? (
        <div className="relative inline-block">
          <img src={value} alt="Portada" className="w-24 h-32 object-cover rounded-lg border border-gray-200 shadow-sm" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={classNames(
            'border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all',
            dragOver ? 'border-primary-400 bg-primary-50' : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50',
            uploading && 'pointer-events-none opacity-60'
          )}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
              <p className="text-sm text-gray-500">Subiendo imagen...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Upload className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600 font-medium">Click o arrastra una imagen</p>
              <p className="text-xs text-gray-400">JPG, PNG, WebP • Máx 10MB</p>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />
    </div>
  );
}
