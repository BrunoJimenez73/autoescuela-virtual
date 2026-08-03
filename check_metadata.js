const fs = require('fs');
const files = fs.readdirSync('server/public/senales').sort();
files.forEach(f => {
  const content = fs.readFileSync('server/public/senales/' + f, 'utf8');
  const match = content.match(/docname="([^"]+)"/);
  const wikimediaMatch = content.match(/wikimedia\.org|upload\.wikimedia|commons\.wikimedia/i);
  if (match) console.log(f + ' -> ' + match[1]);
  else if (content.startsWith('<?xml')) console.log(f + ' -> has xml but no docname');
  else if (content.startsWith('PNG') || content.charCodeAt(0) === 0x89) console.log(f + ' -> PNG file');
  else console.log(f + ' -> unknown format');
});