(async () => {
  const UA = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36' };
  const params = new URLSearchParams({ action: 'parse', page: 'Anexo:Señales de tráfico de reglamentación de España', prop: 'wikitext', format: 'json', origin: '*' });
  const r = await fetch('https://es.wikipedia.org/w/api.php?' + params, { signal: AbortSignal.timeout(30000), headers: UA });
  const j = await r.json();
  const txt = j.parse.wikitext['*'];
  const i = txt.toLowerCase().indexOf('velocidad mínima');
  if (i > -1) console.log('contexto:', txt.slice(i - 300, i + 700).replace(/\n+/g, '\n'));
  else console.log('no encontrado');
})();
