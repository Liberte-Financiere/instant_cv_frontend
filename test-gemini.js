require('dotenv').config({ path: '.env.local' });
const WebSocket = require('ws');

const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) throw new Error("No API Key");

const host = 'generativelanguage.googleapis.com';
const url = `wss://${host}/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${apiKey}`;

console.log("Connecting...");
const ws = new WebSocket(url);

ws.on('open', () => {
    console.log("Connected. Sending Setup...");
    const setupMsg = {
      setup: {
        model: 'models/gemini-2.5-flash-native-audio-preview-12-2025',
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: "Aoede"
              }
            }
          }
        },
        systemInstruction: {
          parts: [{ text: "Hello" }]
        }
      }
    };
    ws.send(JSON.stringify(setupMsg));
});

ws.on('message', (data) => {
    const dec = data instanceof Buffer ? data.toString() : data;
    console.log('MESSAGE:', dec);
    process.exit(0);
});

ws.on('close', (code, reason) => {
    console.log('CLOSED:', code, reason.toString());
    process.exit(1);
});

ws.on('error', (err) => {
    console.log('ERROR:', err);
});
