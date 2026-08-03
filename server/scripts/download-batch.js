const https = require('https');
const fs = require('fs');
const path = require('path');

const urlsData = JSON.parse(
  fs.readFileSync('server/scripts/commons-urls.json', 'utf-8')
);

const progressFile = 'server/scripts/download-progress.json';
let done = {};
if (fs.existsSync(progressFile)) {
  try {
    done = JSON.parse(fs.readFileSync(progressFile, 'utf-8'));
  } catch {}
}

const senalesDir = 'server/public/senales';

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function extractCode(key) {
  // Keys are like "File:Spain traffic signal r1.svg" or "File:Spain traffic sign p1a.svg"
  const match = key.match(/[rsp]\d[a-z]?/i);
  return match ? match[0].toLowerCase() : null;
}

function downloadFile(code, url) {
  return new Promise((resolve) => {
    const outFile = path.join(senalesDir, `${code}.svg`);

    // Skip if already exists and is valid
    if (fs.existsSync(outFile)) {
      const stats = fs.statSync(outFile);
      if (stats.size > 100) {
        const buf = Buffer.alloc(8);
        const fd = fs.openSync(outFile, 'r');
        fs.readSync(fd, buf, 0, 8, 0);
        fs.closeSync(fd);
        if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) {
          console.log(`  ${code}: already exists (PNG, ${stats.size} bytes)`);
          return resolve(true);
        }
        if (buf[0] === 0x3C) {
          console.log(`  ${code}: already exists (SVG, ${stats.size} bytes)`);
          return resolve(true);
        }
      }
    }

    // Skip if already in progress
    if (done[code]) {
      return resolve(true);
    }

    const request = https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
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
  const delayMs = parseInt(process.argv[3] || '15000');

  // Build a map of code -> url from the urlsData
  const codeToUrl = {};
  for (const [key, url] of Object.entries(urlsData)) {
    const code = extractCode(key);
    if (code && code.match(/^[rps]\d/)) {
      codeToUrl[code] = url;
    }
  }

  const codes = Object.keys(codeToUrl).sort();
  console.log('Total codes in urlsData:', codes.length);

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
    const url = codeToUrl[code];

    const success = await downloadFile(code, url);
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
