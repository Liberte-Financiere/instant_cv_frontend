import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, Check, ZoomIn, ZoomOut, Sparkles, Loader2 } from 'lucide-react';
import getCroppedImg from '@/lib/cropImage';
import { toast } from 'sonner';

interface CropModalProps {
  imageSrc: string;
  imageFile: File;
  onCropComplete: (croppedFile: File) => void;
  onClose: () => void;
}

export function CropModal({ imageSrc: initialImageSrc, imageFile, onCropComplete, onClose }: CropModalProps) {
  const [currentImageSrc, setCurrentImageSrc] = useState(initialImageSrc);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRemovingBg, setIsRemovingBg] = useState(false);

  const onCropCompleteCallback = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    try {
      setIsProcessing(true);
      const croppedFile = await getCroppedImg(currentImageSrc, croppedAreaPixels);
      if (croppedFile) {
        onCropComplete(croppedFile);
      }
    } catch (e) {
      console.error(e);
      alert("Erreur lors du rognage de l'image.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveBg = async () => {
    try {
      setIsRemovingBg(true);

      const formData = new FormData();
      formData.append('file', imageFile);

      const res = await fetch('/api/ai/remove-bg', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error || 'Erreur lors du détourage');
      }

      // Read the raw PNG image returned by the server
      const newBlob = await res.blob();
      const newImageUrl = URL.createObjectURL(newBlob);
      setCurrentImageSrc(newImageUrl);
      toast.success('Détourage réussi ! (-1 crédit)');
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Échec du détourage.");
    } finally {
      setIsRemovingBg(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-900">Ajuster la photo</h3>
          <button 
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cropper Area */}
        <div className="relative w-full h-[400px] bg-slate-900 bg-[url('https://transparenttextures.com/patterns/cubes.png')]">
          <Cropper
            image={currentImageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onCropComplete={onCropCompleteCallback}
            onZoomChange={setZoom}
          />
        </div>

        {/* Controls */}
        <div className="p-6 bg-white space-y-6">
          <div className="flex items-center gap-4">
            <ZoomOut className="w-5 h-5 text-slate-400" />
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <ZoomIn className="w-5 h-5 text-slate-400" />
          </div>

          <button
            type="button"
            onClick={handleRemoveBg}
            disabled={isRemovingBg || isProcessing}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors disabled:opacity-50"
          >
            {isRemovingBg ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Magie en cours...</>
            ) : (
              <><Sparkles className="w-5 h-5" /> Enlever l'arrière plan (1 crédit)</>
            )}
          </button>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing || isRemovingBg}
              className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isProcessing || isRemovingBg}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-50"
            >
              {isProcessing ? 'Traitement...' : (
                <>
                  <Check className="w-5 h-5" /> Valider
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
