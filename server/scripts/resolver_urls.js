const fs = require('fs');
const path = require('path');

const fuentes = require('./fuentes_senales.json');
const cache = JSON.parse(fs.readFileSync(path.join(__dirname, 'urls_cache.json'), 'utf8'));
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

const pendientes = [...new Set(Object.values(fuentes))].filter(n => !cache[n]);
console.log('Nombres sin URL:', pendientes.length);

async function resolver(nombreCommons) {
  const params = new URLSearchParams({
    action: 'query', titles: `File:${nombreCommons}`, prop: 'imageinfo', iiprop: 'url', format: 'json', origin: '*',
  });
  for (let i = 1; i <= 5; i++) {
    try {
      const r = await fetch('https://commons.wikimedia.org/w/api.php?' + params, { signal: AbortSignal.timeout(20000), headers: { 'User-Agent': UA } });
      if (r.status === 429) { await new Promise(r2 => setTimeout(r2, 30000)); continue; }
      const j = await r.json();
      const p = Object.values(j.query.pages)[0];
      if (p.missing) return null;
      return p.imageinfo?.[0]?.url ?? null;
    } catch (e) {
      await new Promise(r2 => setTimeout(r2, 15000));
    }
  }
  return 'ERROR';
}

(async () => {
  for (const n of pendientes) {
    const url = await resolver(n);
    cache[n] = url;
    console.log(n, '->', url ? url.split('/').pop() : 'NULL');
    await new Promise(r => setTimeout(r, 1500));
  }
  fs.writeFileSync(path.join(__dirname, 'urls_cache.json'), JSON.stringify(cache, null, 0));
  console.log('cache guardado');
})();
