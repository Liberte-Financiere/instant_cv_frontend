'use client';

import { useState, useRef, useEffect } from 'react';
import { X, PenTool, Image as ImageIcon, Type, Eraser, Check, Upload, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Great_Vibes } from 'next/font/google';

// Load cursive font
const greatVibes = Great_Vibes({ 
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (signatureUrl: string) => void;
  currentSignature?: string;
}

type Tab = 'draw' | 'upload' | 'type';

export function SignatureModal({ isOpen, onClose, onSave, currentSignature }: SignatureModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('draw');
  const [typedName, setTypedName] = useState('');
  
  // Draw State
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawing, setHasDrawing] = useState(false);

  // Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Saved Signature State
  const [savedSignature, setSavedSignature] = useState<string | null>(null);

  // Load saved signature
  useEffect(() => {
    const saved = localStorage.getItem('user_signature');
    if (saved) {
      setSavedSignature(saved);
    }
  }, []);

  // Initialize canvas
  useEffect(() => {
    if (isOpen && activeTab === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        // Load existing signature if it's a drawing? 
        // For now, let's start fresh or maybe show previous one if possible.
        // It's hard to load image back to editable canvas without hassle.
      }
    }
  }, [isOpen, activeTab]);

  // Handle Drawing
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    setIsDrawing(true);
    setHasDrawing(true);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { offsetX, offsetY } = getCoordinates(e, canvas);
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { offsetX, offsetY } = getCoordinates(e, canvas);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const rect = canvas.getBoundingClientRect();
    return {
      offsetX: clientX - rect.left,
      offsetY: clientY - rect.top
    };
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasDrawing(false);
    }
  };

  // Handle Upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image');
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setUploadedImage(data.url);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'upload");
    } finally {
      setIsUploading(false);
    }
  };

  // Convert text to image
  const convertTextToImage = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    canvas.width = 400;
    canvas.height = 100;

    // Font setting needs to match loaded font
    ctx.font = `48px ${greatVibes.style.fontFamily}, cursive`;
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    ctx.fillText(typedName, canvas.width / 2, canvas.height / 2);
    
    return canvas.toDataURL('image/png');
  };

  // Save changes
  const handleSave = () => {
    if (activeTab === 'draw' && canvasRef.current) {
      if (!hasDrawing) {
        onClose(); // Just close if nothing drawn
        return;
      }
      const dataUrl = canvasRef.current.toDataURL('image/png');
      onSave(dataUrl);
    } else if (activeTab === 'upload' && uploadedImage) {
      onSave(uploadedImage);
    } else if (activeTab === 'type' && typedName.trim()) {
      const dataUrl = convertTextToImage();
      if (dataUrl) onSave(dataUrl);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
      >
        <div 
          className="fixed inset-0"
          onClick={onClose}
        />
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white w-full max-w-lg rounded-2xl shadow-xl z-10 relative overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-100">
            <h3 className="font-bold text-lg text-slate-800">Ajouter une signature</h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex bg-slate-50 p-1 border-b border-slate-100">
            {[
              { id: 'draw', icon: PenTool, label: 'Dessiner' },
              { id: 'upload', icon: ImageIcon, label: 'Image' },
              { id: 'type', icon: Type, label: 'Texte' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'draw' && (
              <div className="space-y-4">
                <div className="relative border-2 border-dashed border-slate-200 rounded-xl bg-white touch-none">
                  <canvas
                    ref={canvasRef}
                    width={460}
                    height={200}
                    className="w-full h-[200px] cursor-crosshair rounded-xl"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                  />
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={clearCanvas}
                      className="p-2 bg-white/80 hover:bg-white text-slate-500 rounded-lg shadow-sm border border-slate-200 transition-colors"
                      title="Effacer"
                    >
                      <Eraser className="w-4 h-4" />
                    </button>
                  </div>
                  {!hasDrawing && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-300">
                      <span className="text-xl font-medium">Signez ici</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-400 text-center">
                  Utilisez votre souris ou votre doigt pour signer
                </p>
              </div>
            )}

            {activeTab === 'upload' && (
              <div className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-slate-50 transition-all min-h-[200px]"
                >
                  {isUploading ? (
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
                  ) : uploadedImage ? (
                    <img 
                      src={uploadedImage} 
                      alt="Signature uploadée" 
                      className="max-h-[140px] w-auto object-contain mb-3"
                    />
                  ) : (
                    <Upload className="w-10 h-10 text-slate-300 mb-3" />
                  )}
                  
                  <p className="text-sm font-medium text-slate-700">
                    {isUploading ? 'Envoi en cours...' : uploadedImage ? 'Cliquer pour changer' : 'Cliquer pour choisir une image'}
                  </p>
                  {!uploadedImage && (
                    <p className="text-xs text-slate-400 mt-1">PNG, JPG (fond transparent recommandé)</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'type' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tapez votre nom
                  </label>
                  <Input
                    placeholder="Votre Nom"
                    value={typedName}
                    onChange={(e) => setTypedName(e.target.value)}
                    className="text-lg"
                  />
                </div>
                
                <div className="h-[120px] flex items-center justify-center border border-slate-200 bg-slate-50 rounded-xl p-4 overflow-hidden">
                  {typedName ? (
                    <span className={`${greatVibes.className} text-5xl text-slate-900`}>
                      {typedName}
                    </span>
                  ) : (
                    <span className="text-slate-300 italic">Aperçu de la signature</span>
                  )}
                </div>
              </div>
            )}

            {savedSignature && (
              <div className="mt-6 pt-6 border-t border-slate-100">
                <button
                  onClick={() => onSave(savedSignature)}
                  className="w-full flex items-center justify-center gap-2 p-3 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-colors text-sm font-medium border border-purple-100"
                >
                  <PenTool className="w-4 h-4" />
                  Utiliser ma signature sauvegardée
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-slate-600 hover:bg-slate-200"
            >
              Annuler
            </Button>
            <Button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
              disabled={
                (activeTab === 'draw' && !hasDrawing) ||
                (activeTab === 'upload' && !uploadedImage) ||
                (activeTab === 'type' && !typedName.trim())
              }
            >
              <Check className="w-4 h-4" />
              Valider la signature
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
