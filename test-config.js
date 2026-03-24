import WebSocket from 'ws';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const apiKey = process.env.GOOGLE_API_KEY;
const host = 'generativelanguage.googleapis.com';
const model = 'models/gemini-2.5-flash-native-audio-preview-12-2025';

const url = `wss://${host}/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${apiKey}`;
const ws = new WebSocket(url);

ws.on('open', () => {
  ws.send(JSON.stringify({
    setup: {
      model: model,
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: "Aoede" }
          }
        }
      },
      systemInstruction: { parts: [{ text: "Hello" }] },
      inputAudioConfig: {
        audioEncoding: "LINEAR16",
        sampleRateHertz: 16000
      }
    }
  }));
});

ws.on('message', (data) => {
  console.log('<-', data.toString());
});

ws.on('close', (code, reason) => {
  console.log(`Code: ${code}, Reason: ${reason}`);
  process.exit(0);
});
