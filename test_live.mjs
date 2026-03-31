import WebSocket from 'ws';
import 'dotenv/config';

const apiKey = process.env.GOOGLE_API_KEY;
const host = 'generativelanguage.googleapis.com';
const url = `wss://${host}/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${apiKey}`;

const ws = new WebSocket(url);

ws.on('open', () => {
    console.log("WS Open");
    ws.send(JSON.stringify({
      setup: {
        model: "models/gemini-2.5-flash-native-audio-preview-12-2025",
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
          parts: [{ text: "Tu es un recruteur professionnel. Commence TOUJOURS par te présenter." }]
        }
      }
    }));
});

ws.on('message', (data) => {
    const raw = data.toString();
    const parsed = JSON.parse(raw);
    if(parsed.setupComplete) console.log("SETUP COMPLETE");
    if(parsed.serverContent) {
        console.log("RECEIVED SERVER CONTENT, parts:", parsed.serverContent.modelTurn ? parsed.serverContent.modelTurn.parts.length : 0);
    }

    if (parsed.setupComplete) {
        console.log("Sending initial message in 500ms...");
        setTimeout(() => {
            ws.send(JSON.stringify({
                clientContent: {
                    turns: [
                        { role: "user", parts: [{ text: "Bonjour, commence." }] }
                    ],
                    turnComplete: true
                }
            }));
        }, 500);
    }
});
