require('dotenv').config({ path: './.env' });
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGeminiKey() {
  const apiKey = process.env.GOOGLE_API_KEY;
  console.log('--- TEST DE LA CLÉ API ---');
  console.log('Longueur de la clé :', apiKey ? apiKey.length : 0);
  console.log('Clé commence par :', apiKey ? apiKey.substring(0, 5) : 'MISSING');
  console.log('Clé finit par :', apiKey ? apiKey.substring(apiKey.length - 4) : 'MISSING');
  console.log('--------------------------');

  if (!apiKey) {
    console.error('ERREUR : GOOGLE_API_KEY est introuvable dans le .env');
    return;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  
  // On teste d'abord avec un modèle basique ultra-stable (1.5 Flash) pour voir si c'est la CLÉ qui est rejetée
  const testModels = ['gemini-1.5-flash', 'gemini-3.1-flash-lite'];

  for (const modelName of testModels) {
    console.log(`\nTentative de requête avec le modèle : ${modelName}`);
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Dis 'Bonjour ceci est un test' et rien d'autre.");
      const response = await result.response;
      console.log(`✅ SUCCÈS avec ${modelName} ! Réponse:`, response.text());
    } catch (error) {
      console.error(`❌ ÉCHEC avec ${modelName} !`);
      if (error.message.includes('ACCESS_TOKEN_TYPE_UNSUPPORTED')) {
        console.error('⚠️ [Erreur] Google ne reconnaît pas ceci comme une clé API standard et demande un token OAuth2.');
      } else {
        console.error('⚠️ [Erreur complète] :', error.message);
      }
    }
  }
}

testGeminiKey();
