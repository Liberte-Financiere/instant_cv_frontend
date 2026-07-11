const fs = require('fs');
const glob = require('glob');

const files = glob.sync('components/templates/*.tsx');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replacements for different dash types
  content = content.replace(/\{edu\.startDate\}\s*—\s*\{edu\.endDate\}/g, "{edu.startDate}{edu.startDate && edu.endDate && ' — '}{edu.endDate}");
  content = content.replace(/\{edu\.startDate\}\s*-\s*\{edu\.endDate\}/g, "{edu.startDate}{edu.startDate && edu.endDate && ' - '}{edu.endDate}");
  content = content.replace(/\{edu\.startDate\}\s*–\s*\{edu\.endDate\}/g, "{edu.startDate}{edu.startDate && edu.endDate && ' – '}{edu.endDate}");
  content = content.replace(/\{edu\.startDate\}–\{edu\.endDate\}/g, "{edu.startDate}{edu.startDate && edu.endDate && '–'}{edu.endDate}");

  fs.writeFileSync(file, content);
});

console.log('Done!');
