'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface AudioControlsProps {
  sessionId: string;
  onTranscriptReceived?: (text: string, isFromUser: boolean) => void;
  onSpeakingStateChange?: (isAI: boolean) => void;
  onError?: (err: Error) => void;
}

export function AudioControls({
  sessionId,
  onTranscriptReceived,
  onSpeakingStateChange,
  onError,
}: AudioControlsProps) {
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // Refers to the AI output
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const eventSource = useRef<EventSource | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Buffer queue for playback
  const audioQueue = useRef<Float32Array[]>([]);
  const isPlaying = useRef(false);

  const cleanup = useCallback(() => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    if (eventSource.current) {
      eventSource.current.close();
    }
    if (audioContext.current && audioContext.current.state !== 'closed') {
      audioContext.current.close();
    }
    fetch(`/api/ai/interview/ws/${sessionId}/chunk`, {
      method: 'POST',
      body: JSON.stringify({ action: 'close' }),
    }).catch(console.error);

    setIsListening(false);
    setIsConnecting(false);
  }, [sessionId]);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const sendAudioChunk = async (pcmData: Float32Array) => {
    // Gemini expects 16kHz PCM 16-bit little-endian Base64
    // Convert Float32Array [-1, 1] to Int16Array [-32768, 32767]
    const pcm16 = new Int16Array(pcmData.length);
    for (let i = 0; i < pcmData.length; i++) {
        const s = Math.max(-1, Math.min(1, pcmData[i]));
        pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }

    // Convert to Base64
    const buffer = pcm16.buffer;
    const base64 = Buffer.from(buffer).toString('base64');

    try {
      await fetch(`/api/ai/interview/ws/${sessionId}/chunk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'chunk', pcmBase64: base64 }),
      });
    } catch (err: any) {
      console.error('Failed to send audio chunk', err);
    }
  };

  const playAudioQueue = async () => {
    if (isPlaying.current || audioQueue.current.length === 0 || isMuted) return;
    
    isPlaying.current = true;
    onSpeakingStateChange?.(true);

    const ctx = audioContext.current;
    if (!ctx) return;

    while (audioQueue.current.length > 0) {
      const pcmData = audioQueue.current.shift()!;
      // Gemini sends 24kHz PCM 16-bit. AudioContext might be 48kHz, so we need an AudioBuffer
      const buffer = ctx.createBuffer(1, pcmData.length, 24000);
      buffer.getChannelData(0).set(pcmData);

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start();

      await new Promise((resolve) => {
        source.onended = resolve;
      });
    }

    isPlaying.current = false;
    onSpeakingStateChange?.(false);
  };

  const startListening = async () => {
    try {
      setError(null);
      setIsConnecting(true);

      // 1. Establish SSE Downstream (receive AI voice)
      const sse = new EventSource(`/api/ai/interview/ws/${sessionId}/start`);
      eventSource.current = sse;

      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (audioContext.current.state === 'suspended') {
          await audioContext.current.resume();
      }

      let isBackendReady = false;
      sse.onopen = () => {
        isBackendReady = true;
      };

      sse.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        
        // Handle incoming Gemini ServerContent
        if (msg.serverContent) {
           const modelTurn = msg.serverContent.modelTurn;
           if (modelTurn && modelTurn.parts) {
             for (const part of modelTurn.parts) {
               // 1. Handle Text Transcripts
               if (part.text && onTranscriptReceived) {
                 onTranscriptReceived(part.text, false);
               }
               
               // 2. Handle Audio Output
               if (part.inlineData && part.inlineData.data) {
                 // Decode base64 to PCM 16-bit
                 const rawStr = window.atob(part.inlineData.data);
                 const int16 = new Int16Array(rawStr.length / 2);
                 for (let i = 0; i < int16.length; i++) {
                   int16[i] = rawStr.charCodeAt(i * 2) | (rawStr.charCodeAt(i * 2 + 1) << 8);
                 }
                 
                 // Convert Int16 to Float32 [-1, 1]
                 const float32 = new Float32Array(int16.length);
                 for (let i = 0; i < int16.length; i++) {
                   float32[i] = int16[i] / 32768;
                 }
                 
                 audioQueue.current.push(float32);
                 playAudioQueue();
               }
             }
           }
        }
      };

      sse.onerror = (err) => {
        console.warn('[AudioControls] SSE Disconnected:', err);
        cleanup();
        setError('Déconnexion du serveur AI (Vérifiez votre réseau)');
      };

      // 2. Capture Microphone Upstream (send User voice)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // We need to sample mic at 16kHz for Gemini
      const source = audioContext.current.createMediaStreamSource(stream);
      const processor = audioContext.current.createScriptProcessor(4096, 1, 1);
      
      source.connect(processor);
      processor.connect(audioContext.current.destination);

      processor.onaudioprocess = (e) => {
        if (!isBackendReady) return; 

        const inputData = e.inputBuffer.getChannelData(0); // Float32Array at browser's native rate
        
        // 1. Calculate Volume (RMS) for Voice Activity Detection
        let sum = 0;
        for (let i = 0; i < inputData.length; i++) {
          sum += inputData[i] * inputData[i];
        }
        const rms = Math.sqrt(sum / inputData.length);
        const SILENCE_THRESHOLD = 0.01; // Tune this to user mic sensitivity

        // Initialize state if not present
        if ((processor as any).lastVoiceTime === undefined) {
           (processor as any).lastVoiceTime = Date.now();
           (processor as any).isSilent = false;
        }

        if (rms >= SILENCE_THRESHOLD) {
          // User is speaking
          (processor as any).lastVoiceTime = Date.now();
          (processor as any).isSilent = false;
        } else if (Date.now() - (processor as any).lastVoiceTime > 1500) {
          // User has been silent for 1.5 seconds
          if (!(processor as any).isSilent) {
             (processor as any).isSilent = true;
             console.log('[AudioControls] Silence detected > 1.5s. Ending turn.');
             // Tell Gemini explicitly that our turn is complete!
             fetch(`/api/ai/interview/ws/${sessionId}/end-turn`, { method: 'POST' }).catch(err => console.error(err));
          }
        }

        // 2. Buffer Audio Chunks to reduce HTTP POST spam frequency
        if (!(processor as any).chunkBuffer) {
          (processor as any).chunkBuffer = [];
        }

        // Only add to buffer if speaking, OR if we are capturing the 1.5s trailing silence
        if (!(processor as any).isSilent) {
          (processor as any).chunkBuffer.push(new Float32Array(inputData));
        }

        // Send every ~250ms (3 chunks of 4096 at ~48kHz native)
        if ((processor as any).chunkBuffer.length >= 3) {
           const buffer = (processor as any).chunkBuffer;
           const totalLength = buffer.reduce((acc: number, val: Float32Array) => acc + val.length, 0);
           const merged = new Float32Array(totalLength);
           let offset = 0;
           for (const chunk of buffer) {
              merged.set(chunk, offset);
              offset += chunk.length;
           }
           
           sendAudioChunk(merged);
           (processor as any).chunkBuffer = []; // Reset buffer
        }
      };

      setIsListening(true);
      setIsConnecting(false);
    } catch (err: any) {
      cleanup();
      
      if (err.name === 'NotAllowedError' || err.message?.includes('Permission denied')) {
        console.warn('[AudioControls] Microphone access denied by user or settings.');
        setError('Accès refusé. Autorisez le micro (en haut à gauche de l\'URL) 🔒');
      } else {
        console.warn('[AudioControls] Audio setup error:', err);
        setError('Erreur d\'accès au microphone ou au serveur.');
      }
      
      if (onError && typeof onError === 'function') {
        onError(err);
      }
    }
  };

  const toggleListen = () => {
    if (isListening) {
      cleanup();
    } else {
      startListening();
    }
  };

  return (
    <div className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm w-fit">
      
      {/* Mic Toggle Button */}
      <button
        onClick={toggleListen}
        disabled={isConnecting}
        className={`relative flex items-center justify-center w-12 h-12 rounded-xl transition-all ${
          isListening 
            ? 'bg-red-100 text-red-600 hover:bg-red-200' 
            : 'bg-indigo-600 text-white hover:bg-indigo-700'
        } disabled:opacity-50`}
      >
        {isConnecting ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : isListening ? (
          <>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute inset-0 bg-red-400 opacity-20 rounded-xl"
            />
            <MicOff className="w-5 h-5 z-10" />
          </>
        ) : (
          <Mic className="w-5 h-5 z-10" />
        )}
      </button>

      {/* Speaker Toggle Button */}
      {isListening && (
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all ${
            isMuted ? 'bg-slate-200 text-slate-500 hover:bg-slate-300' : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      )}

      {/* Status indicator */}
      <div className="px-3 flex items-center justify-center min-w-[120px]">
        {error ? (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-red-600">
            <AlertCircle className="w-3.5 h-3.5" /> Erreur
          </span>
        ) : isConnecting ? (
          <span className="text-xs font-medium text-slate-500">Connexion IA...</span>
        ) : isListening ? (
          <div className="flex items-center gap-2 text-xs font-semibold text-green-600">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            À l'écoute
          </div>
        ) : (
          <span className="text-xs font-medium text-slate-500">Mode vocal inactif</span>
        )}
      </div>
    </div>
  );
}
