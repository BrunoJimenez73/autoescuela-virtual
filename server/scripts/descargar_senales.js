const fs = require('fs');
const path = require('path');

const fuentes = require('./fuentes_senales.json');
const DIR = path.join(__dirname, '..', 'public', 'senales');
const CACHE = path.join(__dirname, 'urls_cache.json');
const cache = fs.existsSync(CACHE) ? JSON.parse(fs.readFileSync(CACHE, 'utf8')) : {};

const API = 'https://commons.wikimedia.org/w/api.php';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

async function resolverUrl(nombreCommons) {
  if (cache[nombreCommons]) return cache[nombreCommons];
  for (let intento = 1; intento <= 5; intento++) {
    const params = new URLSearchParams({
      action: 'query',
      titles: `File:${nombreCommons}`,
      prop: 'imageinfo',
      iiprop: 'url',
      format: 'json',
      origin: '*',
    });
    const res = await fetch(`${API}?${params}`, { signal: AbortSignal.timeout(15000), headers: { 'User-Agent': UA } });
    if (res.status === 429) {
      const espera = 3000 * intento;
      await new Promise(r => setTimeout(r, espera));
      continue;
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} para File:${nombreCommons}`);
    const data = await res.json();
    const page = Object.values(data.query.pages)[0];
    if (page.missing) { cache[nombreCommons] = null; return null; }
    cache[nombreCommons] = page.imageinfo?.[0]?.url ?? null;
    return cache[nombreCommons];
  }
  throw new Error(`Rate limit persistente para File:${nombreCommons}`);
}

async function descargar(nombreLocal, nombreCommons) {
  const destino = path.join(DIR, nombreLocal);
  if (fs.existsSync(destino)) {
    const contenido = fs.readFileSync(destino);
    if (contenido.slice(0, 4).toString() === '<svg' || contenido.slice(0, 5).toString() === '<?xml') {
      return { estado: 'existe', nombreLocal };
    }
  }
  const url = await resolverUrl(nombreCommons);
  if (!url) return { estado: 'no-encontrada', nombreLocal, nombreCommons };
  for (let intento = 1; intento <= 3; intento++) {
    let res;
    try {
      res = await fetch(url, { signal: AbortSignal.timeout(30000), headers: { 'User-Agent': UA } });
    } catch (e) {
      await new Promise(r => setTimeout(r, 3000));
      continue;
    }
    if (res.status === 429 || res.status === 403) {
      return { estado: 'rate-limit', nombreLocal, nombreCommons };
    }
    if (!res.ok) return { estado: `http-${res.status}`, nombreLocal, nombreCommons };
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(destino, buffer);
    const esSvg = buffer.slice(0, 4).toString() === '<svg' || buffer.slice(0, 5).toString() === '<?xml';
    return { estado: esSvg ? 'ok' : 'no-svg', nombreLocal, nombreCommons, bytes: buffer.length };
  }
  return { estado: 'rate-limit', nombreLocal, nombreCommons };
}

async function main() {
  fs.mkdirSync(DIR, { recursive: true });
  const entradas = Object.entries(fuentes);
  const resultados = [];
  let racha429 = 0;
  for (let i = 0; i < entradas.length; i++) {
    const [local, commons] = entradas[i];
    const r = await descargar(local, commons);
    resultados.push(r);
    if (r.estado === 'rate-limit') {
      racha429++;
      const pausa = Math.min(racha429 * 10000, 120000);
      process.stdout.write(`\n429 x${racha429} en #${i + 1}, pausa ${pausa / 1000}s\n`);
      await new Promise(r2 => setTimeout(r2, pausa));
    } else {
      racha429 = 0;
    }
    await new Promise(r2 => setTimeout(r2, 1000));
    if (i % 10 === 0) {
      fs.writeFileSync(CACHE, JSON.stringify(cache, null, 0));
      const ok = resultados.filter(r => ['ok', 'existe'].includes(r.estado)).length;
      process.stdout.write(`\r${i + 1}/${entradas.length} procesados (${ok} ok)`);
    }
  }
  fs.writeFileSync(CACHE, JSON.stringify(cache, null, 0));
  console.log('\n');
  const agrupados = {};
  resultados.forEach(r => { agrupados[r.estado] = (agrupados[r.estado] || 0) + 1; });
  console.log('Resumen:', JSON.stringify(agrupados));
  const fallos = resultados.filter(r => !['ok', 'existe'].includes(r.estado));
  if (fallos.length) {
    fs.writeFileSync(path.join(__dirname, 'descarga_fallos.json'), JSON.stringify(fallos, null, 2));
    console.log('Fallos guardados en descarga_fallos.json');
    fallos.slice(0, 30).forEach(f => console.log(`  ${f.nombreLocal} <- ${f.nombreCommons}: ${f.estado}`));
  }
}

main().catch(e => { console.error(e); process.exit(1); });
