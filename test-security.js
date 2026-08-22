const http = require('http');

async function testSecurity() {
  console.log("=== TEST DE SÉCURITÉ : API Job Board ===\n");

  // Test 1: Tentative de création d'offre sans être connecté
  console.log("[Test 1] POST /api/recruiter/jobs sans session...");
  try {
    const res = await fetch('http://localhost:3000/api/recruiter/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: 'Hacker',
        company: 'Evil Corp',
        type: 'CDI',
        description: 'Trying to bypass security',
        applyMethod: 'URL',
        applyUrlOrMail: 'http://hacker.com'
      })
    });
    
    const data = await res.json();
    console.log(`Status: ${res.status}`);
    console.log(`Réponse: ${JSON.stringify(data)}`);
    
    if (res.status === 401) {
      console.log("✅ SUCCÈS : L'API a bloqué l'accès non autorisé (401).\n");
    } else {
      console.log("❌ ÉCHEC : La sécurité a été compromise.\n");
    }
  } catch (err) {
    console.log("Erreur de connexion (le serveur tourne-t-il sur le port 3000?)");
  }
}

testSecurity();
