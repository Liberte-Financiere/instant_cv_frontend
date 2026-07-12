require('dotenv').config();
const WebSocket = require('ws');

const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
  console.error('GOOGLE_API_KEY is not set');
  process.exit(1);
}

const host = 'generativelanguage.googleapis.com';
const url = `wss://${host}/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${apiKey}`;

const ws = new WebSocket(url);

ws.on('open', () => {
  const mySetupMsg = {
    setup: {
      model: "models/gemini-2.0-flash-exp", 
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
      },
      outputAudioTranscription: {},
      inputAudioTranscription: {},
    }
  };
  console.log("Sending mySetupMsg:", JSON.stringify(mySetupMsg));
  ws.send(JSON.stringify(mySetupMsg));
});

ws.on('message', (data) => {
  console.log("Received:", data.toString());
  ws.close();
});

ws.on('close', (code, reason) => {
  console.log("Closed", code, reason.toString());
});

ws.on('error', (err) => {
  console.error("Error", err);
});
