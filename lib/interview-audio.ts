import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@/lib/prisma';
import { INTERVIEW_CONFIG } from './interview';
import WebSocket from 'ws';

// In-memory store for active Gemini Live connections
interface ActiveConnection {
  ws: WebSocket;
  sessionId: string;
  userId: string;
  lastActive: number;
}
const connections = new Map<string, ActiveConnection>();

// Cleanup inactive connections periodically
setInterval(() => {
  const now = Date.now();
  for (const [id, conn] of Array.from(connections.entries())) {
    if (now - conn.lastActive > 10 * 60 * 1000) { // 10 minutes timeout
      conn.ws.close();
      connections.delete(id);
    }
  }
}, 60 * 1000);

export function createGeminiLiveConnection(
  connectionId: string,
  sessionId: string,
  userId: string,
  systemInstruction: string,
  onData: (data: any) => void,
  onClose: () => void,
  onError: (err: any) => void
) {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) throw new Error('GOOGLE_API_KEY is missing');

  // gemini-live-2.5-flash-preview-native-audio requires the v1alpha API
  const host = 'generativelanguage.googleapis.com';
  const url = `wss://${host}/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${apiKey}`;

  const ws = new WebSocket(url);

  ws.on('open', () => {
    // 1. Send Setup Message
    const setupMsg = {
      setup: {
        model: 'models/gemini-2.5-flash', // Using standard flash for text+audio
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: "Aoede" // Example voice
              }
            }
          }
        },
        systemInstruction: {
          parts: [{ text: systemInstruction }]
        }
      }
    };
    ws.send(JSON.stringify(setupMsg));
  });

  ws.on('message', (data: WebSocket.Data) => {
    connections.get(connectionId)!.lastActive = Date.now();
    try {
      if (data instanceof Buffer) {
        onData(JSON.parse(data.toString()));
      } else if (typeof data === 'string') {
        onData(JSON.parse(data));
      }
    } catch (e) {
      console.error('Failed to parse Gemini WS message', e);
    }
  });

  ws.on('close', () => {
    connections.delete(connectionId);
    onClose();
  });

  ws.on('error', (err: Error) => {
    console.error('Gemini Live WS Error:', err);
    connections.delete(connectionId);
    onError(err);
  });

  connections.set(connectionId, { ws, sessionId, userId, lastActive: Date.now() });
  return ws;
}

export function sendAudioToGemini(connectionId: string, pcmBase64: string) {
  const conn = connections.get(connectionId);
  if (!conn || conn.ws.readyState !== WebSocket.OPEN) {
    throw new Error('Connection active not found');
  }

  conn.lastActive = Date.now();
  
  // 2. Send RealtimeInput message with Audio data
  const msg = {
    realtimeInput: {
      mediaChunks: [
        {
          mimeType: "audio/pcm;rate=16000",
          data: pcmBase64
        }
      ]
    }
  };
  
  conn.ws.send(JSON.stringify(msg));
}

export function sendClientContentMessage(connectionId: string, text: string) {
  const conn = connections.get(connectionId);
  if (!conn || conn.ws.readyState !== WebSocket.OPEN) return;

  const msg = {
    clientContent: {
      turns: [
        {
          role: "user",
          parts: [{ text }]
        }
      ],
      turnComplete: true
    }
  };
  conn.ws.send(JSON.stringify(msg));
}

export function endGeminiConnection(connectionId: string) {
  const conn = connections.get(connectionId);
  if (conn) {
    try {
      conn.ws.close();
    } catch(e) {}
    connections.delete(connectionId);
  }
}
