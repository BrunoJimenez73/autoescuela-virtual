const fs = require('fs');
const content = fs.readFileSync('server/src/routes/senales.ts', 'utf8');

// Match each entry block and extract fields
const entryRegex = /\{\s*\n?\s*id:\s*'([^']+)',\s*codigo:\s*'([^']+)',\s*nombre:\s*'([^']+)',\s*categoria:\s*'([^']+)',\s*descripcion:\s*'[^']*',\s*significado:\s*'[^']*',\s*imagen:\s*'([^']+)'\s*\}/g;

let m;
const entries = [];
while ((m = entryRegex.exec(content)) !== null) {
  entries.push({
    id: m[1],
    codigo: m[2],
    nombre: m[3],
    categoria: m[4],
    imagen: m[5]
  });
}

console.log('Total entries:', entries.length);
entries.forEach(e => {
  console.log(e.imagen.replace('/senales/', '') + ' | ' + e.codigo + ' | ' + e.nombre + ' | ' + e.categoria + ' | ' + e.id);
});