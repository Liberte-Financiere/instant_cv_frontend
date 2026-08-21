const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, '../sw-template.js');
const outputPath = path.join(__dirname, '../public/sw.js');

try {
  // Read the template file
  let templateContent = fs.readFileSync(templatePath, 'utf8');
  
  // Generate a unique version based on the current timestamp
  const version = `v-${Date.now()}`;
  
  // Replace the placeholder with the unique version
  const finalContent = templateContent.replace('{{VERSION}}', version);
  
  // Write the output file
  fs.writeFileSync(outputPath, finalContent, 'utf8');
  console.log(`✅ Service Worker generated successfully with version: ${version}`);
} catch (error) {
  console.error('❌ Error generating Service Worker:', error);
  process.exit(1);
}
