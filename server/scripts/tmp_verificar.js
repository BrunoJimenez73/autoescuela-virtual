const fs = require('fs');
const c = fs.readFileSync('server/src/routes/senales.ts', 'utf8');
const mal = c.match(/\/senales\/\/senales\//g);
console.log('doble prefijo:', mal ? mal.length : 0);
const ids = ['r402', 'r403', 'r400a', 'r413', 'p20a', 'r411', 'r412', 's115', 's123'];
for (const id of ids) {
  const re = new RegExp("id: '" + id + "',[\\s\\S]*?imagen: '([^']+)'");
  const m = c.match(re);
  console.log(id, '->', m ? m[1] : 'NO ENCONTRADO');
}
const archivos = [...new Set([...c.matchAll(/imagen:\s*'\/senales\/([^']+)'/g)].map(m => m[1]))];
console.log('archivos únicos referenciados:', archivos.length);
