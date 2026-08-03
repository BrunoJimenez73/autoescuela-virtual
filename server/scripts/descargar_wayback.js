const fs = require('fs');
const path = require('path');

const cache = JSON.parse(fs.readFileSync(path.join(__dirname, 'urls_cache.json'), 'utf8'));
const fuentes = require('./fuentes_senales.json');
const DIR = path.join(__dirname, '..', 'public', 'senales');

const entradas = Object.entries(fuentes).filter(([local]) => {
  const destino = path.join(DIR, local);
  if (!fs.existsSync(destino)) return true;
  const c = fs.readFileSync(destino);
  const esSvg = c.slice(0, 4).toString() === '<svg' || c.slice(0, 5).toString() === '<?xml';
  return !esSvg;
});

function urlPara(local) {
  const commons = fuentes[local];
  return cache[commons] || null;
}

async function descargarWayback(local, url) {
  const destino = path.join(DIR, local);
  const anios = ['2025', '2026', '2024', '2023', '2022'];
  for (const anio of anios) {
    const wb = 'https://web.archive.org/web/' + anio + 'id_/' + url;
    for (let intento = 1; intento <= 2; intento++) {
      try {
        const res = await fetch(wb, { signal: AbortSignal.timeout(60000), redirect: 'follow' });
        if (res.status === 404) break;
        if (res.status === 429) { await new Promise(r => setTimeout(r, 10000)); continue; }
        if (!res.ok) break;
        const buffer = Buffer.from(await res.arrayBuffer());
        const esSvg = buffer.slice(0, 4).toString() === '<svg' || buffer.slice(0, 5).toString() === '<?xml';
        if (!esSvg) return { local, estado: 'no-svg', bytes: buffer.length };
        fs.writeFileSync(destino, buffer);
        return { local, estado: 'ok', bytes: buffer.length };
      } catch (e) {
        break;
      }
    }
  }
  return { local, estado: 'no-archivada' };
}

async function main() {
  fs.mkdirSync(DIR, { recursive: true });
  const sinUrl = entradas.filter(([, c]) => !cache[c]).map(([l]) => l);
  console.log('Pendientes:', entradas.length, '| sin URL en cache:', sinUrl.length);
  const resultados = [];
  const CONC = 3;
  for (let i = 0; i < entradas.length; i += CONC) {
    const lote = entradas.slice(i, i + CONC);
    const parcial = await Promise.all(
      lote.map(async ([local]) => {
        const url = urlPara(local);
        if (!url) return { local, estado: 'sin-url' };
        return descargarWayback(local, url);
      })
    );
    resultados.push(...parcial);
    const ok = resultados.filter(r => r.estado === 'ok').length;
    process.stdout.write(`\r${resultados.length}/${entradas.length} (${ok} ok)`);
  }
  console.log('\n');
  const agrupados = {};
  resultados.forEach(r => { agrupados[r.estado] = (agrupados[r.estado] || 0) + 1; });
  console.log('Resumen:', JSON.stringify(agrupados));
  const fallos = resultados.filter(r => r.estado !== 'ok');
  if (fallos.length) {
    fs.writeFileSync(path.join(__dirname, 'wayback_fallos.json'), JSON.stringify(fallos, null, 2));
    console.log('Fallos guardados en wayback_fallos.json');
  }
}

main().catch(e => { console.error(e); process.exit(1); });
