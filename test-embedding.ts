import { embed } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import * as dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

async function main() {
    console.log('🤖 Test de génération de Vecteur (Embedding) avec Google Gemini...');
    
    const apiKey = process.env.MY_GEMINI_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        console.error('❌ ERREUR : Clé MY_GEMINI_KEY introuvable dans le fichier .env');
        process.exit(1);
    }

    // Instanciation du client Google avec ta clé
    const google = createGoogleGenerativeAI({ apiKey });

    // Utilisation du modèle d'embedding officiel de Gemini
    const model = google.textEmbeddingModel('gemini-embedding-001');

    // Le "CV Optimisé" qu'on veut transformer en vecteur
    const sampleText = "Titre: Développeur React. Résumé: Expert en création d'interfaces. Compétences: React, TypeScript, Node.js. Expériences: 5 ans Lead Frontend chez StartupX.";
    
    console.log(`\nTexte envoyé à l'IA :\n"${sampleText}"`);
    console.log('\n⏳ Calcul mathématique en cours...');

    try {
        const startTime = Date.now();
        const { embedding } = await embed({
            model: model,
            value: sampleText,
        });
        const duration = Date.now() - startTime;

        console.log(`\n✅ SUCCÈS ! Vecteur généré en ${duration} ms.`);
        console.log(`📏 Taille du vecteur : ${embedding.length} dimensions.`);
        console.log(`🔢 Aperçu du vecteur (les 5 premiers chiffres sur 768) :`);
        console.log(`   [${embedding.slice(0, 5).map(n => n.toFixed(5)).join(', ')}, ...]`);
        
    } catch (error) {
        console.error('\n❌ Erreur lors de la génération du vecteur :', error);
    }
}

main();
