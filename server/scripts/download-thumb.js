const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const senalesDir = 'server/public/senales';
const progressFile = 'server/scripts/download-progress.json';

let done = {};
if (fs.existsSync(progressFile)) {
  try { done = JSON.parse(fs.readFileSync(progressFile, 'utf-8')); } catch {}
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getThumbUrl(filename) {
  // filename is like "Spain_traffic_sign_p1.svg"
  const md5 = crypto.createHash('md5').update(filename).digest('hex');
  const firstChar = md5[0];
  const firstTwo = md5.substring(0, 2);
  return `https://upload.wikimedia.org/wikipedia/commons/thumb/${firstChar}/${firstTwo}/${filename}/1280px-${filename}.png`;
}

function getCandidates(code) {
  const prefix = code[0];
  const num = code.substring(1);
  if (prefix === 'r') {
    return [
      `Spain_traffic_signal_r${code}.svg`,
      `Spain traffic signal r${code}.svg`,
      `Spain_traffic_signal_R-${num}.svg`,
    ];
  } else if (prefix === 'p') {
    return [
      `Spain_traffic_sign_p${code}.svg`,
      `Spain traffic sign p${code}.svg`,
      `Spain_traffic_signal_p${code}.svg`,
      `Spain traffic signal p${code}.svg`,
      `Spain_traffic_sign_P-${num}.svg`,
      `Spain_traffic_signal_P-${num}.svg`,
    ];
  } else if (prefix === 's') {
    return [
      `Spain_traffic_signal_s${code}.svg`,
      `Spain traffic signal s${code}.svg`,
      `Spain_traffic_signal_S-${num}.svg`,
    ];
  }
  return [];
}

function downloadFile(code, url) {
  const outFile = path.join(senalesDir, `${code}.svg`);
  
  return new Promise((resolve) => {
    // Skip if already exists and is valid
    if (fs.existsSync(outFile)) {
      const stats = fs.statSync(outFile);
      if (stats.size > 100) {
        const buf = Buffer.alloc(8);
        const fd = fs.openSync(outFile, 'r');
        fs.readSync(fd, buf, 0, 8, 0);
        fs.closeSync(fd);
        if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) {
          return resolve(true);
        }
        if (buf[0] === 0x3C) {
          return resolve(true);
        }
      }
    }

    const request = https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Accept': 'image/*' },
      timeout: 30000,
    }, (response) => {
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => {
        const buf = Buffer.concat(chunks);

        if (response.statusCode === 429) {
          console.log(`  ${code}: 429 rate limited`);
          return resolve(false);
        }

        if (response.statusCode === 404) {
          return resolve(false);
        }

        if (response.statusCode !== 200) {
          console.log(`  ${code}: HTTP ${response.statusCode}`);
          return resolve(false);
        }

        // Check if it's a valid PNG
        if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) {
          fs.writeFileSync(outFile, buf);
          console.log(`  ${code}: OK (PNG, ${buf.length} bytes)`);
          done[code] = true;
          return resolve(true);
        }

        // Check if it's a valid SVG
        if (buf[0] === 0x3C) {
          fs.writeFileSync(outFile, buf);
          console.log(`  ${code}: OK (SVG, ${buf.length} bytes)`);
          done[code] = true;
          return resolve(true);
        }

        // Check for 429 error page
        const text = buf.toString('utf-8').substring(0, 200);
        if (text.includes('429') || text.includes('Too many') || text.includes('Wikimedia Error')) {
          console.log(`  ${code}: 429 rate limited`);
          return resolve(false);
        }

        console.log(`  ${code}: Unknown format (${buf.length} bytes)`);
        resolve(false);
      });
    });

    request.on('error', (err) => {
      console.log(`  ${code}: ERROR ${err.message}`);
      resolve(false);
    });

    request.on('timeout', () => {
      request.destroy();
      console.log(`  ${code}: Timeout`);
      resolve(false);
    });
  });
}

async function main() {
  const batchSize = parseInt(process.argv[2] || '10');
  const delayMs = parseInt(process.argv[3] || '10000');

  // Read senales.ts to find needed codes
  const content = fs.readFileSync('server/src/routes/senales.ts', 'utf-8');
  const neededCodes = new Set();
  const regex = /imagen: '\/senales\/([a-z0-9]+)\.svg'/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const code = match[1];
    if (code.match(/^[rps]\d/)) {
      neededCodes.add(code);
    }
  }

  const codes = [...neededCodes].sort();
  const toDownload = codes.filter(code => {
    const outFile = path.join(senalesDir, `${code}.svg`);
    if (fs.existsSync(outFile)) {
      const stats = fs.statSync(outFile);
      if (stats.size > 100) {
        const buf = Buffer.alloc(8);
        const fd = fs.openSync(outFile, 'r');
        fs.readSync(fd, buf, 0, 8, 0);
        fs.closeSync(fd);
        if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) return false;
        if (buf[0] === 0x3C) return false;
      }
    }
    return !done[code];
  });

  console.log(`Need to download: ${toDownload.length} files`);
  console.log(`Batch size: ${batchSize}, Delay: ${delayMs}ms`);

  let downloaded = 0;
  let rateLimited = false;

  for (let i = 0; i < toDownload.length && downloaded < batchSize; i++) {
    const code = toDownload[i];
    const candidates = getCandidates(code);
    
    let success = false;
    for (const candidate of candidates) {
      const filename = candidate.replace(/ /g, '_');
      const url = getThumbUrl(filename);
      success = await downloadFile(code, url);
      if (success) break;
    }
    
    if (success) {
      downloaded++;
    } else {
      rateLimited = true;
    }

    if (i < toDownload.length - 1 && !rateLimited) {
      await delay(delayMs);
    }
  }

  fs.writeFileSync(progressFile, JSON.stringify(done, null, 2));
  console.log(`\nDownloaded ${downloaded} files. Progress saved.`);
}

main().catch(console.error);
