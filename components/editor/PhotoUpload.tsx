import Image from "next/image";
import { useState, useRef } from 'react';
import { Camera, X, Upload, Loader2, Edit2 } from 'lucide-react';
import { CropModal } from '@/components/editor/CropModal';

interface PhotoUploadProps {
  currentUrl?: string;
  onPhotoChange: (url: string) => void;
  onRemove: () => void;
}

export function PhotoUpload({ currentUrl, onPhotoChange, onRemove }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [fileToCrop, setFileToCrop] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image');
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('L\'image doit faire moins de 5MB');
      return;
    }

    // Pass image to cropper instead of uploading directly
    const imageUrl = URL.createObjectURL(file);
    setImageToCrop(imageUrl);
    setFileToCrop(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEditExisting = async () => {
    if (!preview) return;
    try {
      setIsUploading(true);
      // We use our local proxy to bypass CORS issues from Cloudinary or external hosts
      const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(preview)}`;
      const res = await fetch(proxyUrl);
      if (!res.ok) throw new Error('Network response was not ok');
      const blob = await res.blob();
      const file = new File([blob], 'photo.jpg', { type: blob.type });
      
      const imageUrl = URL.createObjectURL(file);
      setImageToCrop(imageUrl);
      setFileToCrop(file);
    } catch (error) {
      console.error(error);
      alert("Impossible de charger l'image pour l'édition.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCropComplete = async (croppedFile: File) => {
    setImageToCrop(null);
    setFileToCrop(null);
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', croppedFile);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      setPreview(data.url);
      onPhotoChange(data.url);
    } catch (error) {
      console.error(error);
      alert('Erreur lors de l\'upload de l\'image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemove = () => {
    setPreview(null);
    onRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
        className="hidden"
      />

      {preview ? (
        <div className="relative group cursor-pointer" onClick={handleEditExisting}>
          <Image
            src={preview}
            alt="Photo de profil"
            width={112}
            height={112}
            className="w-28 h-28 rounded-full object-cover border-4 border-slate-100 shadow-lg group-hover:opacity-75 transition-opacity"
          />
          {/* Icône d'édition centrale au survol */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            {isUploading ? (
              <Loader2 className="w-6 h-6 text-slate-700 animate-spin" />
            ) : (
              <Edit2 className="w-8 h-8 text-white drop-shadow-md" />
            )}
          </div>
          
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); handleRemove(); }}
            className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
            title="Supprimer la photo"
          >
            <X className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
            className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors"
            title="Changer la photo"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`w-28 h-28 rounded-full border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
          }`}
        >
          <Upload className="w-6 h-6 text-slate-400 mb-1" />
          <span className="text-xs text-slate-500 text-center px-2">
            {isUploading ? 'Envoi...' : 'Photo'}
          </span>
        </div>
      )}

      <p className="text-xs text-slate-400 text-center">
        JPG, PNG • Max 5MB
      </p>

      {/* Rendu conditionnel du Modal de Rognage */}
      {imageToCrop && fileToCrop && (
        <CropModal
          imageSrc={imageToCrop}
          imageFile={fileToCrop}
          onCropComplete={handleCropComplete}
          onClose={() => {
            setImageToCrop(null);
            setFileToCrop(null);
          }}
        />
      )}
    </div>
  );
}
