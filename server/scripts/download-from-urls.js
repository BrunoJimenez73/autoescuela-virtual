const https = require('https');
const fs = require('fs');
const path = require('path');

const URL_FILE = path.join(__dirname, 'commons-urls.json');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'senales');
const PROGRESS_FILE = path.join(__dirname, 'download-progress.json');
const DELAY = 3000; // 3 seconds between downloads

const TARGETS = [
  'r1','r2','r3','r4','r5','r6',
  'p1','p1a','p1b','p1c','p1d','p2','p3','p4','p5',
  'p6','p7','p8','p9a','p9b','p9c','p10a','p10b','p10c',
  'p11','p11a','p12a','p13a','p13b','p14a','p14b',
  'p15','p15a','p15b','p16a','p16b',
  'p17','p17a','p17b','p19',
  'p20a','p21b','p22b','p23','p24','p25','p26','p27','p28','p29','p30',
  'p31','p32','p34','p50',
  'r100','r101','r102','r103','r104','r105','r106','r107','r108','r109','r110',
  'r111','r112','r113','r114','r115','r116','r117','r118','r119','r120',
  'r200','r201','r202','r203','r204','r205',
  'r300','r301','r302','r303','r304','r305','r306','r307','r308','r309','r310',
  'r400a','r400b','r400c','r400d','r400e',
  'r401a','r401b','r401c','r402','r403a','r403b','r403c',
  'r404','r405','r406','r407a',
  'r411','r412','r413',
  'r500','r501','r502','r503','r504',
  's1','s1a','s2','s2a','s3','s4','s5','s7','s8',
  's11','s11a','s11b','s12','s13','s14a','s14b','s15a','s16','s17','s18','s19','s20',
  's23','s24','s25','s27','s28','s29','s32','s33','s34','s34a','s35','s51',
  's100','s101','s102','s103','s104','s105','s106','s107','s108','s109','s110',
  's111','s112','s113','s114','s115','s116','s117','s118','s119','s120',
  's121','s122','s123','s124','s125','s126','s127',
];

// Manual URL map (key -> original SVG URL)
const MANUAL = {
  'r1': 'https://upload.wikimedia.org/wikipedia/commons/7/79/Spain_traffic_signal_r1.svg',
  'r2': 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Spain_traffic_signal_r2.svg',
  'r3': 'https://upload.wikimedia.org/wikipedia/commons/7/73/Spain_traffic_signal_r3.svg',
  'r4': 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Spain_traffic_signal_r4.svg',
  'r5': 'https://upload.wikimedia.org/wikipedia/commons/5/52/Spain_traffic_signal_r5.svg',
  'r6': 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Spain_traffic_signal_r6.svg',
  'p1': 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Spain_traffic_signal_p1_2023.svg',
  'p1a': 'https://upload.wikimedia.org/wikipedia/commons/5/57/Spain_traffic_sign_p1a.svg',
  'p1b': 'https://upload.wikimedia.org/wikipedia/commons/0/0a/Spain_traffic_sign_p1b.svg',
  'p1c': 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Spain_traffic_signal_p1c.svg',
  'p1d': 'https://upload.wikimedia.org/wikipedia/commons/0/02/Spain_traffic_signal_p1d.svg',
  'p2': 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Spain_traffic_signal_p2_2023.svg',
  'p3': 'https://upload.wikimedia.org/wikipedia/commons/6/60/Spain_traffic_signal_p3_2023.svg',
  'p4': 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Spain_traffic_signal_p4.svg',
  'p5': 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Spain_traffic_signal_p5.svg',
  'p6': 'https://upload.wikimedia.org/wikipedia/commons/6/64/Spain_traffic_sign_p6.svg',
  'p7': 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Spain_traffic_sign_p7.svg',
  'p8': 'https://upload.wikimedia.org/wikipedia/commons/9/98/Spain_traffic_sign_p8.svg',
  'p9a': 'https://upload.wikimedia.org/wikipedia/commons/4/46/Spain_traffic_signal_p9a.svg',
  'p9b': 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Spain_traffic_signal_p9b.svg',
  'p9c': 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Spain_traffic_signal_p9c.svg',
  'p10a': 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Spain_traffic_signal_p10a.svg',
  'p10b': 'https://upload.wikimedia.org/wikipedia/commons/8/85/Spain_traffic_signal_p10b.svg',
  'p10c': 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Spain_traffic_signal_p10c.svg',
  'p11': 'https://upload.wikimedia.org/wikipedia/commons/6/68/Spain_traffic_sign_silbato.svg',
  'p11a': 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Spain_traffic_sign_p11a.svg',
  'p12a': 'https://upload.wikimedia.org/wikipedia/commons/0/06/Spain_traffic_signal_p12_2023.svg',
  'p13a': 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Spain_traffic_signal_p13a.svg',
  'p13b': 'https://upload.wikimedia.org/wikipedia/commons/5/56/Spain_traffic_signal_p13b.svg',
  'p14a': 'https://upload.wikimedia.org/wikipedia/commons/7/71/Spain_traffic_signal_p14a.svg',
  'p14b': 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Spain_traffic_signal_p14b.svg',
  'p15': 'https://upload.wikimedia.org/wikipedia/commons/4/45/Spain_traffic_signal_p15_2023.svg',
  'p15a': 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Spain_traffic_signal_p15a_2023.svg',
  'p15b': 'https://upload.wikimedia.org/wikipedia/commons/9/90/Spain_traffic_signal_p15b_2023.svg',
  'p16a': 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Spain_traffic_signal_P-16a_%282022%29.svg',
  'p16b': 'https://upload.wikimedia.org/wikipedia/commons/3/32/Spain_traffic_signal_P-16b_%282022%29.svg',
  'p17': 'https://upload.wikimedia.org/wikipedia/commons/3/37/Spain_traffic_signal_p17.svg',
  'p17a': 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Spain_traffic_signal_p17a.svg',
  'p17b': 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Spain_traffic_signal_p17b.svg',
  'p19': 'https://upload.wikimedia.org/wikipedia/commons/1/15/Spain_traffic_signal_p19.svg',
  'p20a': 'https://upload.wikimedia.org/wikipedia/commons/8/82/Spain_traffic_signal_P-20a.svg',
  'p21b': 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Spain_traffic_signal_P-20b_%282023%29.svg',
  'p22b': 'https://upload.wikimedia.org/wikipedia/commons/6/60/Spain_traffic_signal_P-22b_%282023%29.svg',
  'p23': 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Spain_traffic_signal_p23.svg',
  'p24': 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Spain_traffic_signal_p24.svg',
  'p25': 'https://upload.wikimedia.org/wikipedia/commons/2/24/Spain_traffic_signal_p25.svg',
  'p26': 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Spain_traffic_signal_p26.svg',
  'p27': 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Spain_traffic_signal_p27.svg',
  'p28': 'https://upload.wikimedia.org/wikipedia/commons/4/44/Spain_traffic_signal_p28.svg',
  'p29': 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Spain_traffic_signal_p29.svg',
  'p30': 'https://upload.wikimedia.org/wikipedia/commons/3/34/Spain_traffic_signal_p30.svg',
  'p31': 'https://upload.wikimedia.org/wikipedia/commons/9/98/Spain_traffic_signal_p31.svg',
  'p32': 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Spain_traffic_signal_p32.svg',
  'p34': 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Spain_traffic_signal_p34.svg',
  'p50': 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Spain_traffic_signal_p50.svg',
  'r100': 'https://upload.wikimedia.org/wikipedia/commons/1/15/Spain_traffic_signal_r100.svg',
  'r101': 'https://upload.wikimedia.org/wikipedia/commons/3/38/Spain_traffic_signal_r101.svg',
  'r102': 'https://upload.wikimedia.org/wikipedia/commons/7/70/Spain_traffic_signal_r102.svg',
  'r103': 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Spain_traffic_signal_r103.svg',
  'r104': 'https://upload.wikimedia.org/wikipedia/commons/5/59/Spain_traffic_signal_r104.svg',
  'r105': 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Spain_traffic_signal_r105.svg',
  'r106': 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Spain_traffic_signal_r106.svg',
  'r107': 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Spain_traffic_signal_r107.svg',
  'r108': 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Spain_traffic_signal_r108.svg',
  'r109': 'https://upload.wikimedia.org/wikipedia/commons/a/a7/Spain_traffic_signal_r109.svg',
  'r110': 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Spain_traffic_signal_r110.svg',
  'r111': 'https://upload.wikimedia.org/wikipedia/commons/1/16/Spain_traffic_signal_r111.svg',
  'r112': 'https://upload.wikimedia.org/wikipedia/commons/8/84/Spain_traffic_signal_r112.svg',
  'r113': 'https://upload.wikimedia.org/wikipedia/commons/9/94/Spain_traffic_signal_r113.svg',
  'r114': 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Spain_traffic_signal_r114.svg',
  'r115': 'https://upload.wikimedia.org/wikipedia/commons/4/44/Spain_traffic_signal_r115.svg',
  'r116': 'https://upload.wikimedia.org/wikipedia/commons/2/27/Spain_traffic_signal_r116.svg',
  'r117': 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Spain_traffic_signal_r117.svg',
  'r118': 'https://upload.wikimedia.org/wikipedia/commons/5/54/Spain_traffic_signal_r118.svg',
  'r119': 'https://upload.wikimedia.org/wikipedia/commons/8/82/Spain_traffic_signal_r119.svg',
  'r120': 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Spain_traffic_signal_r120.svg',
  'r200': 'https://upload.wikimedia.org/wikipedia/commons/7/76/Spain_traffic_signal_r200.svg',
  'r201': 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Spain_traffic_signal_r201.svg',
  'r202': 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Spain_traffic_signal_r202.svg',
  'r203': 'https://upload.wikimedia.org/wikipedia/commons/5/52/Spain_traffic_signal_r203.svg',
  'r204': 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Spain_traffic_signal_r204.svg',
  'r205': 'https://upload.wikimedia.org/wikipedia/commons/1/14/Spain_traffic_signal_r205.svg',
  'r300': 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Spain_traffic_signal_r300.svg',
  'r301': 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Spain_traffic_signal_r301-50.svg',
  'r302': 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Spain_traffic_signal_r302.svg',
  'r303': 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Spain_traffic_signal_r303.svg',
  'r304': 'https://upload.wikimedia.org/wikipedia/commons/5/52/Spain_traffic_signal_r304.svg',
  'r305': 'https://upload.wikimedia.org/wikipedia/commons/4/46/Spain_traffic_signal_r305.svg',
  'r306': 'https://upload.wikimedia.org/wikipedia/commons/0/04/Spain_traffic_signal_r306.svg',
  'r307': 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Spain_traffic_signal_r307.svg',
  'r308': 'https://upload.wikimedia.org/wikipedia/commons/4/47/Spain_traffic_signal_r308.svg',
  'r309': 'https://upload.wikimedia.org/wikipedia/commons/7/7f/Spain_traffic_signal_r309.svg',
  'r310': 'https://upload.wikimedia.org/wikipedia/commons/8/86/Spain_traffic_signal_r310.svg',
  'r400a': 'https://upload.wikimedia.org/wikipedia/commons/8/80/Spain_traffic_signal_r400a.svg',
  'r400b': 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Spain_traffic_signal_r400b.svg',
  'r400c': 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Spain_traffic_signal_r400c.svg',
  'r400d': 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Spain_traffic_signal_r400d.svg',
  'r400e': 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Spain_traffic_signal_r400e.svg',
  'r401a': 'https://upload.wikimedia.org/wikipedia/commons/a/a1/Spain_traffic_signal_r401a.svg',
  'r401b': 'https://upload.wikimedia.org/wikipedia/commons/5/51/Spain_traffic_signal_r401b.svg',
  'r401c': 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Spain_traffic_signal_r401c.svg',
  'r402': 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Spain_traffic_signal_r402.svg',
  'r403a': 'https://upload.wikimedia.org/wikipedia/commons/7/70/Spain_traffic_signal_r403a.svg',
  'r403b': 'https://upload.wikimedia.org/wikipedia/commons/4/44/Spain_traffic_signal_r403b.svg',
  'r403c': 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Spain_traffic_signal_r403c.svg',
  'r404': 'https://upload.wikimedia.org/wikipedia/commons/3/32/Se%C3%B1al_r404_automoviles.svg',
  'r405': 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Se%C3%B1al_r405_motocicletas.svg',
  'r406': 'https://upload.wikimedia.org/wikipedia/commons/9/95/Spain_traffic_signal_r406.svg',
  'r407a': 'https://upload.wikimedia.org/wikipedia/commons/d/db/Spain_traffic_signal_R-407a.svg',
  'r411': 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Se%C3%B1al_r411_velocidad_m%C3%ADnima.svg',
  'r412': 'https://upload.wikimedia.org/wikipedia/commons/7/7f/Se%C3%B1al_r412_nieve.svg',
  'r413': 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Se%C3%B1al_luces_obligatorias_r-413.svg',
  'r500': 'https://upload.wikimedia.org/wikipedia/commons/3/33/Spain_traffic_signal_r500.svg',
  'r501': 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Spain_traffic_signal_r501.svg',
  'r502': 'https://upload.wikimedia.org/wikipedia/commons/8/85/Spain_traffic_signal_r502.svg',
  'r503': 'https://upload.wikimedia.org/wikipedia/commons/4/42/Spain_traffic_signal_r503.svg',
  'r504': 'https://upload.wikimedia.org/wikipedia/commons/1/12/Spain_traffic_signal_r504.svg',
  's1': 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spain_traffic_signal_s1.svg',
  's1a': 'https://upload.wikimedia.org/wikipedia/commons/2/2d/Spain_traffic_signal_s1a.svg',
  's2': 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Spain_traffic_signal_s2.svg',
  's2a': 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Spain_traffic_signal_s2a.svg',
  's3': 'https://upload.wikimedia.org/wikipedia/commons/6/60/Spain_traffic_signal_s3.svg',
  's4': 'https://upload.wikimedia.org/wikipedia/commons/d/da/Spain_traffic_signal_s4.svg',
  's5': 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Spain_traffic_signal_s5.svg',
  's7': 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Spain_traffic_signal_s7.svg',
  's8': 'https://upload.wikimedia.org/wikipedia/commons/3/30/Spain_traffic_signal_s8.svg',
  's11': 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Spain_traffic_signal_s11.svg',
  's11a': 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Spain_traffic_signal_s11a.svg',
  's11b': 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Spain_traffic_signal_s11b.svg',
  's12': 'https://upload.wikimedia.org/wikipedia/commons/8/85/Spain_traffic_signal_s12.svg',
  's13': 'https://upload.wikimedia.org/wikipedia/commons/2/27/Spain_traffic_signal_s13.svg',
  's14a': 'https://upload.wikimedia.org/wikipedia/commons/3/33/Spain_traffic_signal_s14a.svg',
  's14b': 'https://upload.wikimedia.org/wikipedia/commons/2/27/Spain_traffic_signal_s14b.svg',
  's15a': 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Spain_traffic_signal_s15a.svg',
  's16': 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Spain_traffic_signal_s16.svg',
  's17': 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Spain_traffic_signal_s17.svg',
  's18': 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Spain_traffic_signal_s18.svg',
  's19': 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Spain_traffic_signal_s19.svg',
  's20': 'https://upload.wikimedia.org/wikipedia/commons/1/10/Spain_traffic_signal_s20.svg',
  's23': 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Spain_traffic_signal_s23.svg',
  's24': 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Spain_traffic_signal_s24.svg',
  's25': 'https://upload.wikimedia.org/wikipedia/commons/4/40/Spain_traffic_signal_s25.svg',
  's27': 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Spain_traffic_signal_s27.svg',
  's28': 'https://upload.wikimedia.org/wikipedia/commons/8/80/Spain_traffic_signal_s28.svg',
  's29': 'https://upload.wikimedia.org/wikipedia/commons/1/10/Spain_traffic_signal_s29.svg',
  's32': 'https://upload.wikimedia.org/wikipedia/commons/5/58/Spain_traffic_signal_s32.svg',
  's33': 'https://upload.wikimedia.org/wikipedia/commons/8/84/Spain_traffic_signal_s33.svg',
  's34': 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Spain_traffic_signal_s34.svg',
  's34a': 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Spain_traffic_signal_s34a.svg',
  's35': 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Spain_traffic_signal_s35.svg',
  's51': 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Spain_traffic_signal_s51.svg',
  's100': 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Spain_traffic_signal_s100.svg',
  's101': 'https://upload.wikimedia.org/wikipedia/commons/7/79/Spain_traffic_signal_s101.svg',
  's102': 'https://upload.wikimedia.org/wikipedia/commons/d/de/Spain_traffic_signal_s102.svg',
  's103': 'https://upload.wikimedia.org/wikipedia/commons/7/79/Spain_traffic_signal_s103.svg',
  's104': 'https://upload.wikimedia.org/wikipedia/commons/8/89/Spain_traffic_signal_s104.svg',
  's105': 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Spain_traffic_signal_s105.svg',
  's106': 'https://upload.wikimedia.org/wikipedia/commons/2/20/Spain_traffic_signal_s106.svg',
  's107': 'https://upload.wikimedia.org/wikipedia/commons/1/11/Spain_traffic_signal_s107.svg',
  's108': 'https://upload.wikimedia.org/wikipedia/commons/3/37/Spain_traffic_signal_s108.svg',
  's109': 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Spain_traffic_signal_s109.svg',
  's110': 'https://upload.wikimedia.org/wikipedia/commons/1/16/Spain_traffic_signal_s110.svg',
  's111': 'https://upload.wikimedia.org/wikipedia/commons/6/66/Spain_traffic_signal_s111.svg',
  's112': 'https://upload.wikimedia.org/wikipedia/commons/8/89/Spain_traffic_signal_s112.svg',
  's113': 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Spain_traffic_signal_s113.svg',
  's114': 'https://upload.wikimedia.org/wikipedia/commons/c/c6/Spain_traffic_signal_s114.svg',
  's115': 'https://upload.wikimedia.org/wikipedia/commons/7/71/Spain_traffic_signal_s115.svg',
  's116': 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Spain_traffic_signal_s116.svg',
  's117': 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Spain_traffic_signal_s117.svg',
  's118': 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Spain_traffic_signal_s118.svg',
  's119': 'https://upload.wikimedia.org/wikipedia/commons/8/84/Spain_traffic_signal_s119.svg',
  's120': 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Spain_traffic_signal_s120.svg',
  's121': 'https://upload.wikimedia.org/wikipedia/commons/e/ee/Spain_traffic_signal_s121.svg',
  's122': 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Spain_traffic_signal_s122.svg',
  's123': 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Spain_traffic_signal_s123.svg',
  's124': 'https://upload.wikimedia.org/wikipedia/commons/7/7f/Spain_traffic_signal_s124.svg',
  's125': 'https://upload.wikimedia.org/wikipedia/commons/7/74/Spain_traffic_signal_s125.svg',
  's126': 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Spain_traffic_signal_s126.svg',
  's127': 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Spain_traffic_signal_s127.svg',
};

function getThumbUrl(originalUrl) {
  const prefix = 'https://upload.wikimedia.org/wikipedia/commons/';
  const rel = originalUrl.slice(prefix.length);
  const name = path.basename(rel, '.svg');
  return `https://upload.wikimedia.org/wikipedia/commons/thumb/${rel}/1280px-${name}.svg.png`;
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      timeout: 30000,
    }, (res) => {
      if (res.statusCode === 429) { res.resume(); reject(new Error('429')); return; }
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        download(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) { res.resume(); reject(new Error('' + res.statusCode)); return; }
      const f = fs.createWriteStream(dest);
      res.pipe(f);
      f.on('finish', () => { f.close(); resolve(); });
      f.on('error', e => { f.close(); try { fs.unlinkSync(dest); } catch(_) {} reject(e); });
    });
    req.on('error', e => { try { fs.unlinkSync(dest); } catch(_) {} reject(e); });
  });
}
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  try { fs.mkdirSync(OUTPUT_DIR, { recursive: true }); } catch(_) {}
  let progress = {};
  try { progress = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8')); } catch(_) {}

  // Clean corrupted files
  for (const f of fs.readdirSync(OUTPUT_DIR)) {
    const p = path.join(OUTPUT_DIR, f);
    if (f.endsWith('.svg') && fs.statSync(p).size <= 100) fs.unlinkSync(p);
  }

  const todo = TARGETS.filter(f => {
    const p = path.join(OUTPUT_DIR, f + '.svg');
    if (fs.existsSync(p) && fs.statSync(p).size > 100) return false;
    if (progress[f] === 'ok') return false;
    return true;
  });

  if (todo.length === 0) { console.log('All done!'); return; }
  console.log(`Missing: ${todo.length}`);

  let ok = 0, fail = 0;
  for (let i = 0; i < todo.length; i++) {
    const f = todo[i];
    const orig = MANUAL[f];
    if (!orig) { console.log(`[${i+1}/${todo.length}] ${f} SKIP (no URL)`); continue; }
    const dest = path.join(OUTPUT_DIR, f + '.svg');
    const thumb = getThumbUrl(orig);

    process.stdout.write(`[${i+1}/${todo.length}] ${f}.svg... `);

    try {
      await download(thumb, dest);
      if (fs.existsSync(dest) && fs.statSync(dest).size > 100) {
        ok++;
        progress[f] = 'ok';
        fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
        console.log(`OK (${fs.statSync(dest).size} bytes)`);
        if (i < todo.length - 1) {
          console.log(`  waiting ${DELAY/1000}s...`);
          await sleep(DELAY + Math.random() * 2000);
        }
      } else {
        fail++;
        console.log('FAIL (small)');
      }
    } catch (e) {
      if (e.message === '429') {
        console.log('429! Waiting 2min...');
        await sleep(120000);
        console.log('  retrying...');
        try {
          await download(thumb, dest);
          if (fs.existsSync(dest) && fs.statSync(dest).size > 100) {
            ok++;
            progress[f] = 'ok';
            fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
            console.log(`  OK (${fs.statSync(dest).size} bytes)`);
            if (i < todo.length - 1) {
              console.log(`  waiting ${DELAY/1000}s...`);
              await sleep(DELAY + Math.random() * 2000);
            }
          } else {
            fail++;
            console.log('  FAIL (small)');
          }
        } catch(e2) {
          fail++;
          console.log(`  429 again, stopping.`);
          break;
        }
      } else {
        fail++;
        console.log(`FAIL: ${e.message.substring(0,40)}`);
        if (i < todo.length - 1) {
          console.log(`  waiting ${DELAY/1000}s...`);
          await sleep(DELAY + Math.random() * 2000);
        }
      }
    }
  }

  const remaining = todo.length - ok;
  console.log(`\nSession: OK=${ok}  Fail=${fail}  Remaining=${remaining}`);
}

main().catch(console.error);
