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
      model: model
    }
  }));
});

ws.on('message', (data) => {
  const parsed = JSON.parse(data.toString());
  console.log('<-', JSON.stringify(parsed).slice(0, 100));
  
  if (parsed.setupComplete) {
    console.log('Sending turnComplete with NO turns array...');
    ws.send(JSON.stringify({
      clientContent: {
        turnComplete: true
      }
    }));
  }
});

ws.on('close', (code, reason) => {
  console.log(`Code: ${code}, Reason: ${reason}`);
  process.exit(0);
});
