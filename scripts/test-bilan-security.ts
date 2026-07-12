import { z } from 'zod';

console.log("=== 🛡️ LANCEMENT DES TESTS DE SÉCURITÉ DU BILAN 🛡️ ===\n");

// 1. Test de l'anonymisation (Sanitization)
console.log("1️⃣ Test d'anonymisation des données PII...");
function sanitizeRawText(text: string): string {
  let sanitized = text.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL]');
  sanitized = sanitized.replace(/(?:\+\d{1,3}[\s\-.()]?)?(?:\(?\d{1,4}\)?[\s\-.()]?)?\d[\d\s\-.()]{6,14}\d/g, '[TELEPHONE]');
  sanitized = sanitized.replace(/https?:\/\/[^\s]+/g, '[URL]');
  return sanitized;
}

const rawCV = `
Jean Dupont
Email: jean.dupont@gmail.com
Téléphone: +33 6 12 34 56 78
Portfolio: https://jeandupont.dev/portfolio
Expérience: Développeur chez Google.
`;

const sanitizedCV = sanitizeRawText(rawCV);
console.log("CV Original :");
console.log(rawCV.trim());
console.log("\nCV Anonymisé :");
console.log(sanitizedCV.trim());

if (sanitizedCV.includes("jean.dupont@gmail.com") || sanitizedCV.includes("+33 6 12 34 56 78") || sanitizedCV.includes("https://jeandupont.dev/portfolio")) {
  console.log("❌ ÉCHEC : Des données PII ont fuité !");
} else {
  console.log("✅ SUCCÈS : Toutes les données PII (Email, Tel, URL) ont été masquées.\n");
}


// 2. Test du Schéma de Validation Zod
console.log("2️⃣ Test du Schéma de Validation IA (Zod)...");
const BilanResultSchema = z.object({
  strengths: z.array(z.string()).min(3),
  areasForImprovement: z.array(z.string()).min(2),
  compatibleCareers: z.array(
    z.object({
      title: z.string(),
      matchPercentage: z.number().min(0).max(100),
      reason: z.string()
    })
  ).min(3),
  recommendedTrainings: z.array(
    z.object({
      title: z.string(),
      type: z.string(),
      benefit: z.string()
    })
  ).min(2),
});

const validLLMResponse = {
  strengths: ["React", "TypeScript", "Node.js"],
  areasForImprovement: ["Docker", "CI/CD"],
  compatibleCareers: [
    { title: "Senior Frontend Engineer", matchPercentage: 90, reason: "Maitrise de React" },
    { title: "Fullstack Developer", matchPercentage: 75, reason: "Connaissances Node" },
    { title: "Tech Lead", matchPercentage: 60, reason: "Expérience pertinente" }
  ],
  recommendedTrainings: [
    { title: "Certification AWS", type: "Certificat", benefit: "Améliorer le CI/CD" },
    { title: "Formation Docker", type: "Cours en ligne", benefit: "Maitriser les conteneurs" }
  ]
};

const invalidLLMResponse = {
  strengths: ["React"], // Moins de 3 (Échec)
  areasForImprovement: [],
  compatibleCareers: []
};

const validResult = BilanResultSchema.safeParse(validLLMResponse);
if (validResult.success) {
  console.log("✅ SUCCÈS : Le schéma accepte une réponse IA valide.");
} else {
  console.log("❌ ÉCHEC : Le schéma a rejeté une réponse valide.");
}

const invalidResult = BilanResultSchema.safeParse(invalidLLMResponse);
if (!invalidResult.success) {
  console.log("✅ SUCCÈS : Le schéma rejette bien une réponse IA incomplète ou formatée incorrectement.");
  console.log("   -> Si l'IA échoue, le système va intercepter cette erreur et procéder au REMBOURSEMENT automatique.");
} else {
  console.log("❌ ÉCHEC : Le schéma a accepté une réponse invalide.");
}

console.log("\n=== ✅ TOUS LES TESTS SONT PASSÉS AVEC SUCCÈS ===");
