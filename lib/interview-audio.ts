import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@/lib/prisma';
import { INTERVIEW_CONFIG } from './interview';
import { APP_CONFIG } from '@/lib/config';
import WebSocket from 'ws';

// In-memory store for active Gemini Live connections
interface ActiveConnection {
  ws: WebSocket;
  sessionId: string;
  userId: string;
  lastActive: number;
  // Invoked by endGeminiConnection to stop the billing interval in the SSE handler
  terminateBilling?: () => void;
}
const globalForGemini = globalThis as unknown as {
  geminiConnections: Map<string, ActiveConnection> | undefined;
};

export const connections = globalForGemini.geminiConnections ?? new Map<string, ActiveConnection>();
if (process.env.NODE_ENV !== 'production') globalForGemini.geminiConnections = connections;

// Cleanup inactive connections periodically
setInterval(() => {
  const now = Date.now();
  for (const [id, conn] of Array.from(connections.entries())) {
    if (now - conn.lastActive > 10 * 60 * 1000) { // 10 minutes timeout
      conn.terminateBilling?.();
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

  // Live API requires v1beta and the correct model string prefix
  const host = 'generativelanguage.googleapis.com';
  const url = `wss://${host}/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${apiKey}`;

  const ws = new WebSocket(url);
  console.log(`[Gemini WS] Initializing connection for connectionId: ${connectionId}`);

  ws.on('open', () => {
    console.log(`[Gemini WS] WebSocket OPEN. Sending Setup to Google...`);
    // 1. Send Setup Message
    const setupMsg = {
      setup: {
        model: APP_CONFIG.ai.models.audioLive,
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
    const connInfo = connections.get(connectionId);
    if (connInfo) connInfo.lastActive = Date.now();
    
    try {
      if (data instanceof Buffer) {
        onData(JSON.parse(data.toString()));
      } else if (typeof data === 'string') {
        const parsed = JSON.parse(data);
        if (parsed.setupComplete) {
            console.log(`[Gemini WS] SETUP COMPLETE for ${connectionId}`);
            
            // Force the AI to speak the first question out loud right after connecting
            const firstPromptMsg = {
              clientContent: {
                turns: [
                  {
                    role: "user",
                    parts: [{ text: "Bonjour. Tu as la parole, commence l'entretien en m'accueillant et pose-moi la première question." }]
                  }
                ],
                turnComplete: true
              }
            };
            ws.send(JSON.stringify(firstPromptMsg));
        }
        onData(parsed);
      }
    } catch (e) {
      console.error('[Gemini WS] Failed to parse message', e);
    }
  });

  ws.on('close', (code, reason) => {
    console.warn(`[Gemini WS] Closed with code: ${code}, reason: ${reason.toString()}`);
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
  if (!conn) {
    console.error(`[Gemini WS API] Connection NOT FOUND in global Map for id: ${connectionId}. Map size: ${connections.size}`);
    throw new Error('Connection active not found');
  }
  if (conn.ws.readyState !== WebSocket.OPEN) {
    console.error(`[Gemini WS API] WebSocket closed or connecting. State: ${conn.ws.readyState}`);
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
    // Stop the billing interval before closing the WebSocket
    conn.terminateBilling?.();
    try {
      conn.ws.close();
    } catch(e) {}
    connections.delete(connectionId);
  }
}
