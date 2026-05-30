const fs = require('fs');
const path = require('path');

// Simulate backend validation logic
function validateUploadedFile(file) {
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB in bytes

  console.log(`[TEST] Analyse du fichier : "${file.name}"`);
  console.log(`[TEST] Taille détectée : ${(file.size / (1024 * 1024)).toFixed(2)} Mo (${file.size} octets)`);

  // 1. Validation de la taille
  if (file.size > MAX_SIZE) {
    return {
      status: 400,
      error: 'Le fichier est trop volumineux (max 5MB)',
      passed: false
    };
  }

  // 2. Validation du format (MIME Type / Extension)
  const allowedExtensions = ['.pdf', '.txt'];
  const ext = path.extname(file.name).toLowerCase();
  
  if (!allowedExtensions.includes(ext)) {
    return {
      status: 400,
      error: 'Unsupported file type. Please upload PDF or TXT.',
      passed: false
    };
  }

  return {
    status: 200,
    message: 'Fichier valide ! Prêt pour extraction de texte et envoi à Gemini.',
    passed: true
  };
}

// --- RUN TESTS ---

console.log('=== DÉBUT DES TESTS DE SÉCURITÉ UPLOAD ===\n');

// Test 1: Fichier trop volumineux (Simulé à 6.2 Mo)
const largeFile = {
  name: 'mon_gros_cv.pdf',
  size: 6.2 * 1024 * 1024 // 6.2 MB
};
const result1 = validateUploadedFile(largeFile);
console.log('Résultat Test 1 :', result1.passed ? '❌ ÉCHOUÉ (devrait être bloqué)' : `✅ RÉUSSI (Bloqué avec erreur : "${result1.error}")`);
console.log('----------------------------------------');

// Test 2: Fichier de taille correcte (Simulé à 1.5 Mo)
const validFile = {
  name: 'cv_developpeur.pdf',
  size: 1.5 * 1024 * 1024 // 1.5 MB
};
const result2 = validateUploadedFile(validFile);
console.log('Résultat Test 2 :', result2.passed ? '✅ RÉUSSI (Accepté pour traitement)' : `❌ ÉCHOUÉ (a été bloqué indûment : "${result2.error}")`);
console.log('----------------------------------------');

// Test 3: Type de fichier interdit (.exe déguisé)
const maliciousFile = {
  name: 'cv_pirate.exe',
  size: 1 * 1024 * 1024 // 1 MB
};
const result3 = validateUploadedFile(maliciousFile);
console.log('Résultat Test 3 :', result3.passed ? '❌ ÉCHOUÉ (devrait être bloqué)' : `✅ RÉUSSI (Bloqué avec erreur : "${result3.error}")`);

console.log('\n=== FIN DES TESTS ===');
