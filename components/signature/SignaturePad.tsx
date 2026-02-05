'use client';

import { useRef, useState, useEffect } from 'react';
import { Eraser, Type, PenTool, Upload, RefreshCw, Check, Download, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface SignaturePadProps {
  onSave: (signatureData: string) => void;
  initialData?: string | null;
}

export function SignaturePad({ onSave, initialData }: SignaturePadProps) {
  const [mode, setMode] = useState<'draw' | 'type' | 'upload'>('draw');
  const [typedName, setTypedName] = useState('');
  const [selectedFont, setSelectedFont] = useState('font-signature-1');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  // Initialize canvas
  useEffect(() => {
    if (mode === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000000';
      }
      
      // Load initial data if present and drawing mode
      // (Complex to restore paths, easier to just show image below)
    }
  }, [mode]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault(); // Prevent scrolling on touch
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    setIsDrawing(true);
    setHasSignature(true);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('clientX' in e ? e.clientX : e.touches[0].clientX) - rect.left;
    const y = ('clientY' in e ? e.clientY : e.touches[0].clientY) - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('clientX' in e ? e.clientX : e.touches[0].clientX) - rect.left;
    const y = ('clientY' in e ? e.clientY : e.touches[0].clientY) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
       // Optional: trim or optimize
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      setHasSignature(false);
    }
  };

  const handleSave = () => {
    if (mode === 'draw') {
      const canvas = canvasRef.current;
      if (canvas && hasSignature) {
        const dataUrl = canvas.toDataURL('image/png');
        onSave(dataUrl);
      } else {
        toast.error('Veuillez dessiner une signature d\'abord.');
      }
    } else if (mode === 'type') {
      if (!typedName) {
        toast.error('Veuillez saisir votre nom.');
        return;
      }
      // Convert text to image via a temporary canvas
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = 600;
      tempCanvas.height = 200;
      const ctx = tempCanvas.getContext('2d');
      if (ctx) {
        let fontStyle = 'cursive';
        if (selectedFont === 'font-signature-1') fontStyle = 'ephesis, cursive'; // Mapping needed
        
        // Simulating different fonts with basic fallbacks if custom fonts aren't loaded
        // For production, ensure fonts are loaded in layout or globals.css
        const fontFamily = selectedFont === 'font-signature-1' ? 'Great Vibes, cursive' : 'Dancing Script, cursive';
        
        ctx.font = `60px ${fontFamily}`;
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(typedName, 300, 100);
        
        onSave(tempCanvas.toDataURL('image/png'));
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          onSave(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden max-w-2xl mx-auto">
      {/* Tabs */}
      <div className="flex border-b border-slate-100 bg-slate-50/50 p-1">
        <button
          onClick={() => setMode('draw')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all",
            mode === 'draw' ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:bg-slate-100"
          )}
        >
          <PenTool className="w-4 h-4" />
          Dessiner
        </button>
        <button
          onClick={() => setMode('type')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all",
            mode === 'type' ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:bg-slate-100"
          )}
        >
          <Type className="w-4 h-4" />
          Saisir
        </button>
        <button
          onClick={() => setMode('upload')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all",
            mode === 'upload' ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:bg-slate-100"
          )}
        >
          <Upload className="w-4 h-4" />
          Importer
        </button>
      </div>

      <div className="p-6">
        {mode === 'draw' && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 touch-none">
              <canvas
                ref={canvasRef}
                width={600}
                height={200}
                className="w-full h-48 cursor-crosshair rounded-xl"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
            </div>
            <div className="flex justify-between">
              <button 
                onClick={clearCanvas}
                className="text-sm text-slate-500 hover:text-red-500 flex items-center gap-1 transition-colors"
                type="button"
              >
                <Eraser className="w-4 h-4" />
                Effacer
              </button>
            </div>
          </div>
        )}

        {mode === 'type' && (
          <div className="space-y-6 py-4">
            <div>
              <input
                type="text"
                placeholder="Votre nom complet"
                className="w-full px-4 py-3 text-lg border-b-2 border-slate-200 focus:border-blue-600 outline-none bg-transparent transition-colors text-center"
                value={typedName}
                onChange={(e) => setTypedName(e.target.value)}
              />
            </div>
            
            {/* Font Selection */}
            {typedName && (
              <div className="grid grid-cols-2 gap-4">
                 {[1, 2].map((num) => (
                   <div 
                     key={num}
                     onClick={() => setSelectedFont(`font-signature-${num}`)}
                     className={cn(
                       "p-4 rounded-xl border-2 cursor-pointer transition-all hover:bg-slate-50 text-center",
                       selectedFont === `font-signature-${num}` 
                         ? "border-blue-600 bg-blue-50/50" 
                         : "border-slate-100"
                     )}
                   >
                     <p className="text-3xl" style={{ fontFamily: num === 1 ? 'Great Vibes, cursive' : 'Dancing Script, cursive' }}>
                       {typedName}
                     </p>
                   </div>
                 ))}
              </div>
            )}
          </div>
        )}

        {mode === 'upload' && (
          <div className="py-8 text-center border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 transition-colors hover:bg-slate-100 hover:border-slate-400">
             <input
               type="file"
               id="sig-upload"
               accept="image/png, image/jpeg"
               className="hidden"
               onChange={handleFileUpload}
             />
             <label htmlFor="sig-upload" className="cursor-pointer flex flex-col items-center gap-3">
               <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                 <Upload className="w-6 h-6 text-blue-600" />
               </div>
               <div>
                  <p className="font-medium text-slate-900">Cliquez pour importer</p>
                  <p className="text-xs text-slate-500">PNG ou JPG (Fond transparent recommandé)</p>
               </div>
             </label>
          </div>
        )}

        {/* Action Footer */}
        <div className="pt-6 mt-6 border-t border-slate-100 flex justify-end gap-3">
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#2463eb] hover:bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
          >
            <Check className="w-4 h-4" />
            Enregistrer ma signature
          </button>
        </div>
      </div>
    </div>
  );
}
