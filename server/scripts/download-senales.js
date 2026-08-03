const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'senales');

const ALL_FILES = [
  // Priority
  'r1.svg','r2.svg','r3.svg','r4.svg','r5.svg','r6.svg',
  // Warning
  'p1.svg','p1a.svg','p1b.svg','p1c.svg','p1d.svg','p2.svg','p3.svg','p4.svg','p5.svg',
  'p6.svg','p7.svg','p9a.svg','p9b.svg','p9c.svg','p10a.svg','p10b.svg','p10c.svg',
  'p11.svg','p11a.svg',
  'p13a.svg','p13b.svg','p14a.svg','p14b.svg',
  'p15.svg','p15a.svg','p15b.svg',
  'p17.svg','p17a.svg','p17b.svg','p19.svg',
  'p23.svg','p24.svg','p25.svg','p26.svg','p27.svg','p28.svg','p29.svg','p30.svg',
  'p31.svg','p32.svg','p34.svg','p50.svg',
  // Prohibition
  'r100.svg','r101.svg','r102.svg','r103.svg','r104.svg','r105.svg','r106.svg','r107.svg',
  'r108.svg','r109.svg','r110.svg','r111.svg','r112.svg','r113.svg','r114.svg','r115.svg',
  'r116.svg','r117.svg','r118.svg','r119.svg','r120.svg',
  'r200.svg','r201.svg','r202.svg','r203.svg','r204.svg','r205.svg',
  'r300.svg','r301.svg','r302.svg','r303.svg','r304.svg','r305.svg','r306.svg',
  'r307.svg','r308.svg','r309.svg','r310.svg',
  // Mandatory
  'r400a.svg','r400b.svg','r400c.svg','r400d.svg','r400e.svg',
  'r401a.svg','r401b.svg','r401c.svg','r402.svg',
  'r403a.svg','r403b.svg','r403c.svg',
  'r500.svg','r501.svg','r502.svg','r503.svg','r504.svg',
  // Indication
  's1.svg','s1a.svg','s2.svg','s2a.svg','s3.svg','s4.svg','s5.svg',
  's7.svg','s8.svg','s11.svg','s11a.svg','s11b.svg','s12.svg',
  's14a.svg','s14b.svg','s15a.svg','s16.svg','s17.svg','s18.svg','s19.svg','s20.svg',
  's23.svg','s24.svg','s25.svg','s27.svg','s28.svg','s29.svg',
  's32.svg','s33.svg','s34.svg','s34a.svg','s35.svg','s51.svg',
  // Service
  's100.svg','s101.svg','s102.svg','s103.svg','s104.svg','s105.svg',
  's106.svg','s107.svg','s108.svg','s109.svg','s110.svg','s111.svg','s112.svg',
  's113.svg','s114.svg','s115.svg','s116.svg','s117.svg','s118.svg','s119.svg',
  's120.svg','s121.svg','s122.svg','s123.svg','s124.svg','s125.svg','s126.svg','s127.svg',
];

// Some files need special Commons filenames (these don't follow the standard pattern)
// For the vast majority, the format is just Spain_traffic_signal_{name}.svg
function commonsName(localFile) {
  const base = localFile.replace(/\.svg$/i, '');
  return `Spain_traffic_signal_${base}.svg`;
}

function md5(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

// Direct download URL using MD5 hash path
function directUrl(filename) {
  const hash = md5(filename);
  return `https://upload.wikimedia.org/wikipedia/commons/${hash[0]}/${hash.substring(0, 2)}/${encodeURIComponent(filename)}`;
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        try { fs.unlinkSync(dest); } catch (_) {}
        // Follow redirect
        const loc = res.headers.location;
        https.get(loc, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res2) => {
          if (res2.statusCode !== 200) {
            file.close();
            try { fs.unlinkSync(dest); } catch (_) {}
            reject(new Error(`HTTP ${res2.statusCode}`));
            return;
          }
          const f2 = fs.createWriteStream(dest);
          res2.pipe(f2);
          f2.on('finish', () => { f2.close(); resolve(); });
          f2.on('error', e => { f2.close(); try { fs.unlinkSync(dest); } catch(_) {} reject(e); });
        }).on('error', e => { try { fs.unlinkSync(dest); } catch(_) {} reject(e); });
      } else if (res.statusCode === 200) {
        res.pipe(file);
        file.on('finish', () => { file.close(); resolve(); });
        file.on('error', e => { file.close(); try { fs.unlinkSync(dest); } catch(_) {} reject(e); });
      } else {
        file.close();
        try { fs.unlinkSync(dest); } catch (_) {}
        reject(new Error(`HTTP ${res.statusCode}`));
      }
    }).on('error', e => {
      try { fs.unlinkSync(dest); } catch(_) {}
      reject(e);
    });
  });
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Clean up corrupted files (< 100 bytes)
  for (const f of fs.readdirSync(OUTPUT_DIR)) {
    const p = path.join(OUTPUT_DIR, f);
    if (f.endsWith('.svg') && f.includes('.') && fs.statSync(p).size <= 100) {
      fs.unlinkSync(p);
    }
  }

  let ok = 0, fail = 0, skip = 0;

  for (let i = 0; i < ALL_FILES.length; i++) {
    const f = ALL_FILES[i];
    const dest = path.join(OUTPUT_DIR, f);

    if (fs.existsSync(dest) && fs.statSync(dest).size > 100) {
      console.log(`[${i+1}/${ALL_FILES.length}] ${f} OK (exists)`);
      skip++;
      continue;
    }

    const cname = commonsName(f);
    const url = directUrl(cname);
    process.stdout.write(`[${i+1}/${ALL_FILES.length}] ${f}... `);

    try {
      await downloadFile(url, dest);
      ok++;
      console.log('OK');
    } catch (e) {
      fail++;
      console.log(`FAIL (${e.message.substring(0,40)})`);
    }

    // Longer delay to avoid rate limiting (1-2s)
    await new Promise(r => setTimeout(r, 800 + Math.random() * 1200));
  }

  console.log(`\n=== Done === OK: ${ok}, Skip: ${skip}, Fail: ${fail}`);
}

main().catch(console.error);
