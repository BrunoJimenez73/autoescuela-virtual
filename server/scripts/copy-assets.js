// Copia assets no-TypeScript a dist/ tras compilar (schema.sql, etc.)
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const ASSETS = [
  { origen: path.join(ROOT, 'src', 'db', 'schema.sql'), destino: path.join(ROOT, 'dist', 'db', 'schema.sql') },
];

let copiados = 0;
for (const asset of ASSETS) {
  if (!fs.existsSync(asset.origen)) {
    console.error(`⚠️  No existe ${asset.origen}`);
    process.exitCode = 1;
    continue;
  }
  fs.mkdirSync(path.dirname(asset.destino), { recursive: true });
  fs.copyFileSync(asset.origen, asset.destino);
  copiados++;
}

console.log(`✅ ${copiados} asset(s) copiado(s) a dist/`);
