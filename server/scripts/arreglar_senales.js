const fs = require('fs');
const path = 'server/src/routes/senales.ts';
let content = fs.readFileSync(path, 'utf8');

// Nuevo archivo de imagen por id (solo entradas conflictivas que cambian)
// Regla: el filename se queda con la señal cuyo código coincide con la RGC actual;
// las demás señales pasan a su archivo correcto de la RGC actual.
const renombres = {
  'curvas-derecha': 'curvas-derecha.svg',            // P-14a actual -> ya existe como curvas-derecha.svg
  'bajada-pendiente': 'bajada-pendiente.svg',        // P-16a actual -> ya existe
  'estrechamiento-derecha': 'estrechamiento-derecha.svg', // P-17a actual -> ya existe
  'estrechamiento-izquierda': 'estrechamiento-izquierda.svg', // P-17b actual -> ya existe
  'desprendimiento': 'p20a.svg',                     // P-20a actual (desprendimiento)
  'animales-domesticos': 'p25.svg',                  // P-25 actual (animales domésticos)
  'viento-transversal': 'p29.svg',                   // P-29 actual (viento transversal)
  'prohibido-motos': 'r104.svg',                     // R-104 actual (motocicletas)
  'prohibido-bicicletas': 'r114.svg',                // R-114 actual (ciclos/bicicletas)
  'prohibido-peatones': 'r116.svg',                  // R-116 actual (peatones)
  'limitacion-masa': 'r201.svg',                     // R-201 actual (limitación masa)
  'limitacion-altura': 'r205.svg',                   // R-205 actual (limitación altura)
  'limitacion-anchura': 'r204.svg',                  // R-204 actual (limitación anchura)
  'limitacion-longitud': 'r203.svg',                 // R-203 actual (limitación longitud)
  'prohibido-girar-derecha': 'r302.svg',             // R-302 actual (giro derecha prohibido)
  'prohibido-girar-izquierda': 'r303.svg',           // R-303 actual (giro izquierda prohibido)
  'prohibido-adelantar': 'r305.svg',                 // R-305 actual (adelantamiento prohibido)
  'prohibido-senal-acustica': 'r310.svg',            // R-310 actual (señales acústicas prohibidas)
  'direccion-obligatoria': 'r400a.svg',              // R-400a actual (sentido obligatorio)
  'pasar-izquierda': 'r401a.svg',                    // R-401a actual (pasar por la izquierda)
  'pasar-derecha': 'r401b.svg',                      // R-401b actual (pasar por la derecha)
  'circulacion-giratoria': 'r402.svg',               // R-402 actual (rotonda)
  'interseccion-giratoria': 'r402.svg',              // R-402 actual (rotonda)
  'interseccion-glorieta': 'p1e.svg',                // P-1e actual (intersección con glorieta)
  'rotonda-obligatoria': 'r402.svg',                 // R-402 actual (rotonda)
  'velocidad-minima': 'r411.svg',                    // R-411 actual (velocidad mínima)
  'autovia': 's1a.svg',                              // S-1a actual (autovía)
  'hospital': 's23.svg',                             // S-23 actual (hospital)
  'taller': 's103.svg',                              // S-103 actual (taller)
  'taller-servicio': 's103.svg',                     // S-103 actual (taller)
  'telefono-socorro': 's104.svg',                    // S-104 actual (teléfono)
  'telefono-emergencia': 's104.svg',                 // S-104 actual (teléfono)
  'gasolinera': 's105.svg',                          // S-105 actual (surtidor carburante)
  'surtidor-carburante': 's105.svg',                 // S-105 actual (surtidor carburante)
  'calle-sin-salida': 's15a.svg',                    // S-15a actual (calzada sin salida)
  'area-descanso': 's123.svg',                       // S-123 actual (área de descanso)
  'area-descanso-s123': 's123.svg',                  // S-123 actual (área de descanso)
  'camping': 's107.svg',                             // S-107 actual (campamento)
  'campamento': 's107.svg',                          // S-107 actual (campamento)
  'taxi': 's18.svg',                                 // S-18 actual (taxis)
  'aparcamiento': 's17.svg',                         // S-17 actual (estacionamiento)
  'estacionamiento-s17': 's17.svg',                  // S-17 actual (estacionamiento)
  'calle-residencial': 's28.svg',                    // S-28 actual (zona de estancia y juego)
  'zona-peatonal': 's30a.svg',                       // S-30a actual (zona peatonal)
  'carril-bici': 's35.svg',                          // S-35 actual (vía reservada para ciclos)
  'via-obligatoria-ciclos': 'r407a.svg',             // R-407a actual (vía obligatoria ciclos)
  'via-ciclos': 's35.svg',                           // S-35 actual (vía reservada para ciclos)
};

// Regex que captura el bloque completo de cada entrada
const blockRegex = /\{\s*\n?\s*id:\s*'([^']+)',[\s\S]*?imagen:\s*'([^']+)'\s*\}/g;

const usados = new Set();
let cambios = 0;
content = content.replace(blockRegex, (bloque, id, imagen) => {
  const nombreArchivo = imagen.replace(/^\/senales\//, '');
  const nuevo = renombres[id];
  if (nuevo) {
    cambios++;
    usados.add(nuevo);
    return bloque.replace(`imagen: '${imagen}'`, `imagen: '/senales/${nuevo}'`);
  }
  usados.add(nombreArchivo);
  return bloque;
});

fs.writeFileSync(path, content);
console.log('Cambios aplicados:', cambios);
console.log('Archivos referenciados tras el cambio:', usados.size);

// Fuentes Wikimedia Commons: filename del proyecto -> filename en Commons
const fuentes = {
  // === Reemplazo de existentes (PNG disfrazados) ===
  'stop.svg': 'Spain_traffic_signal_r2,_2023_set.svg',
  'r1.svg': 'Spain_traffic_signal_r1.svg',
  'r2.svg': 'Spain_traffic_signal_r2,_2023_set.svg',
  'r3.svg': 'Spain_traffic_signal_r3.svg',
  'r4.svg': 'Spain_traffic_signal_r4.svg',
  'r5.svg': 'Spain_traffic_signal_r5.svg',
  'r6.svg': 'Spain_traffic_signal_r6.svg',
  'p1.svg': 'Spain_traffic_signal_p13a.svg',
  'p1a.svg': 'Spain_traffic_signal_p13b.svg',
  'p2.svg': 'Spain_traffic_signal_p1.svg',
  'p3.svg': 'Spain_traffic_signal_p3.svg',
  // === Peligro ===
  'p1b.svg': 'Spain_traffic_signal_-_stop_ahead.svg',
  'p1c.svg': 'Spain_traffic_signal_p1c.svg',
  'p1d.svg': 'Spain_traffic_signal_p1d.svg',
  'p1e.svg': 'Spain_traffic_signal_p1e.svg',
  'p4.svg': 'Spain_traffic_signal_p2.svg',
  'p5.svg': 'Spain_traffic_signal_p5.svg',
  'p6.svg': 'Spain_traffic_signal_TR-501.svg',
  'p7.svg': 'Spain_traffic_signal_p7.svg',
  'p8.svg': 'Spain_traffic_signal_p8.svg',
  'p9.svg': 'Spain_traffic_signal_p16b.svg',
  'p9a.svg': 'Spain_traffic_signal_p9a.svg',
  'p9b.svg': 'Spain_traffic_signal_p9b.svg',
  'p9c.svg': 'Spain_traffic_signal_p9c.svg',
  'p10.svg': 'Spain_traffic_signal_p17.svg',
  'p10a.svg': 'Spain_traffic_signal_p10a.svg',
  'p10b.svg': 'Spain_traffic_signal_p10b.svg',
  'p10c.svg': 'Spain_traffic_signal_p10c.svg',
  'p11.svg': 'Spain_traffic_signal_p11.svg',
  'p11a.svg': 'Spain_traffic_signal_p11a.svg',
  'p12a.svg': 'Spain_traffic_signal_p12_new.svg',
  'p13.svg': 'Spain_traffic_signal_p18.svg',
  'p14.svg': 'Spain_traffic_signal_p19.svg',
  'p15.svg': 'Spain_traffic_signal_p15.svg',
  'p15a.svg': 'Spain_traffic_signal_p15a.svg',
  'p15b.svg': 'Spain_traffic_signal_p15b.svg',
  'p16.svg': 'Spain_traffic_signal_p5.svg',
  'p20.svg': 'Spain_traffic_signal_p21-a,_2023_set.svg',
  'p20a.svg': 'Spain_traffic_signal_p20a.svg',
  'p21.svg': 'Spain_traffic_signal_p22.svg',
  'p21b.svg': 'Spain_traffic_signal_p21-b,_2023_set.svg',
  'p23.svg': 'Spain_traffic_signal_p23.svg',
  'p24.svg': 'Spain_traffic_signal_p24.svg',
  'p25.svg': 'Spain_traffic_signal_p25.svg',
  'p27.svg': 'Spain_traffic_signal_p27.svg',
  'p28.svg': 'Spain_traffic_signal_p34.svg',
  'p29.svg': 'Spain_traffic_signal_p29.svg',
  'p30.svg': 'Spain_traffic_signal_p30.svg',
  'p31.svg': 'Spain_traffic_signal_p31.svg',
  'p32.svg': 'Spain_traffic_signal_p32.svg',
  'p50.svg': 'Spain_traffic_signal_p33,_2023_set.svg',
  // === Prohibición / restricción ===
  'r100.svg': 'Spain_traffic_signal_r100.svg',
  'r101.svg': 'Spain_traffic_signal_r101.svg',
  'r102.svg': 'Spain_traffic_signal_r102.svg',
  'r103.svg': 'Spain_traffic_signal_r103.svg',
  'r104.svg': 'Spain_traffic_signal_r104.svg',
  'r105.svg': 'Spain_traffic_signal_r105.svg',
  'r106.svg': 'Spain_traffic_signal_r106.svg',
  'r107.svg': 'Spain_traffic_signal_r107.svg',
  'r108.svg': 'Spain_traffic_signal_r108.svg',
  'r109.svg': 'Spain_traffic_signal_r109.svg',
  'r110.svg': 'Spain_traffic_signal_r110.svg',
  'r111.svg': 'Spain_traffic_signal_r111.svg',
  'r112.svg': 'Spain_traffic_signal_r112.svg',
  'r113.svg': 'Spain_traffic_signal_r113.svg',
  'r114.svg': 'Spain_traffic_signal_r114.svg',
  'r115.svg': 'Spain_traffic_signal_r115.svg',
  'r116.svg': 'Spain_traffic_signal_r116.svg',
  'r117.svg': 'Spain_traffic_signal_r117.svg',
  'r118.svg': 'Spain_traffic_signal_r118.svg',
  'r119.svg': 'Spain_traffic_signal_r119.svg',
  'r120.svg': 'Spain_traffic_signal_r120.svg',
  'r201.svg': 'Spain_traffic_signal_r201.svg',
  'r202.svg': 'Spain_traffic_signal_r202.svg',
  'r203.svg': 'Spain_traffic_signal_r203.svg',
  'r204.svg': 'Spain_traffic_signal_r204.svg',
  'r205.svg': 'Spain_traffic_signal_r205.svg',
  'r300.svg': 'Spain_traffic_signal_r300.svg',
  'r301.svg': 'Spain_traffic_signal_r301.svg',
  'r302.svg': 'Spain_traffic_signal_r302.svg',
  'r303.svg': 'Spain_traffic_signal_r303.svg',
  'r305.svg': 'Spain_traffic_signal_r305.svg',
  'r306.svg': 'Spain_traffic_signal_r306.svg',
  'r307.svg': 'Spain_traffic_signal_r307.svg',
  'r308.svg': 'Spain_traffic_signal_r308.svg',
  'r309.svg': 'Spain_traffic_signal_r309.svg',
  'r310.svg': 'Spain_traffic_signal_r310.svg',
  // === Obligación ===
  'r400a.svg': 'Spain_traffic_signal_r400a.svg',
  'r400b.svg': 'Spain_traffic_signal_r400b.svg',
  'r400c.svg': 'Spain_traffic_signal_r400c.svg',
  'r400d.svg': 'Spain_traffic_signal_r400d.svg',
  'r400e.svg': 'Spain_traffic_signal_r400e.svg',
  'r401a.svg': 'Spain_traffic_signal_r401a.svg',
  'r401b.svg': 'Spain_traffic_signal_r401b.svg',
  'r401c.svg': 'Spain_traffic_signal_r401c.svg',
  'r402.svg': 'Spain_traffic_signal_r402.svg',
  'r403a.svg': 'Spain_traffic_signal_r403a.svg',
  'r403b.svg': 'Spain_traffic_signal_r403b.svg',
  'r403c.svg': 'Spain_traffic_signal_r403c.svg',
  'r404.svg': 'Spain_traffic_signal_r404.svg',
  'r405.svg': 'Spain_traffic_signal_r405.svg',
  'r406.svg': 'Spain_traffic_signal_r406.svg',
  'r407a.svg': 'Spain_traffic_signal_R-407a.svg',
  'r411.svg': 'Spain_traffic_signal_r411.svg',
  'r412.svg': 'Spain_traffic_signal_r412.svg',
  'r413.svg': 'Spain_traffic_signal_r413.svg',
  // === Fin de prohibición ===
  'r500.svg': 'Spain_traffic_signal_r500.svg',
  'r501.svg': 'Spain_traffic_signal_r501.svg',
  'r502.svg': 'Spain_traffic_signal_r502.svg',
  // === Indicación ===
  's1.svg': 'Spain_traffic_signal_s1.svg',
  's1a.svg': 'Spain_traffic_signal_s1a.svg',
  's2.svg': 'Spain_traffic_signal_s2.svg',
  's2a.svg': 'Spain_traffic_signal_s2a.svg',
  's3.svg': 'Spain_traffic_signal_s3.svg',
  's4.svg': 'Spain_traffic_signal_s4.svg',
  's5.svg': 'Spain_traffic_signal_s5.svg',
  's7.svg': 'Spain_traffic_signal_s7.svg',
  's8.svg': 'Spain_traffic_signal_s8.svg',
  's11.svg': 'Spain_traffic_signal_s11.svg',
  's11a.svg': 'Spain_traffic_signal_s11a.svg',
  's11b.svg': 'Spain_traffic_signal_s11b.svg',
  's12.svg': 'Spain_traffic_signal_s12.svg',
  's14a.svg': 'Spain_traffic_signal_s14a.svg',
  's14b.svg': 'Spain_traffic_signal_s14b.svg',
  's15a.svg': 'Spain_traffic_signal_s15a.svg',
  's16.svg': 'Spain_traffic_signal_s16.svg',
  's17.svg': 'Spain_traffic_signal_s17.svg',
  's18.svg': 'Spain_traffic_signal_s18.svg',
  's19.svg': 'Spain_traffic_signal_s19.svg',
  's20.svg': 'Spain_traffic_signal_s20.svg',
  's23.svg': 'Spain_traffic_signal_s23.svg',
  's24.svg': 'Spain_traffic_signal_s24.svg',
  's25.svg': 'Spain_traffic_signal_s25.svg',
  's28.svg': 'Spain_traffic_signal_s28.svg',
  's29.svg': 'Spain_traffic_signal_s29.svg',
  's30a.svg': 'Spain_traffic_signal_s30.svg',
  's32.svg': 'Spain_traffic_signal_s32.svg',
  's33.svg': 'Spain_traffic_signal_s33.svg',
  's34.svg': 'Spain_traffic_signal_s34.svg',
  's34a.svg': 'Spain_traffic_signal_s34a.svg',
  's35.svg': 'Spain_traffic_signal_s35.svg',
  // === Servicio ===
  's100.svg': 'Spain_traffic_signal_s100.svg',
  's101.svg': 'Spain_traffic_signal_s101.svg',
  's102.svg': 'Spain_traffic_signal_s102.svg',
  's103.svg': 'Spain_traffic_signal_s103.svg',
  's104.svg': 'Spain_traffic_signal_s104.svg',
  's105.svg': 'Spain_traffic_signal_s105.svg',
  's106.svg': 'Spain_traffic_signal_s106.svg',
  's107.svg': 'Spain_traffic_signal_s107.svg',
  's108.svg': 'Spain_traffic_signal_s108.svg',
  's109.svg': 'Spain_traffic_signal_s109.svg',
  's110.svg': 'Spain_traffic_signal_s110.svg',
  's111.svg': 'Spain_traffic_signal_s111.svg',
  's112.svg': 'Spain_traffic_signal_s112.svg',
  's113.svg': 'Spain_traffic_signal_s113.svg',
  's114.svg': 'Spain_traffic_signal_s114.svg',
  's115.svg': 'Spain_traffic_signal_s115.svg',
  's116.svg': 'Spain_traffic_signal_s116.svg',
  's117.svg': 'Spain_traffic_signal_s117.svg',
  's118.svg': 'Spain_traffic_signal_s118.svg',
  's120.svg': 'Spain_traffic_signal_s120.svg',
  's121.svg': 'Spain_traffic_signal_s121.svg',
  's122.svg': 'Spain_traffic_signal_s122.svg',
  's123.svg': 'Spain_traffic_signal_s123.svg',
};

// Comprobar que todos los archivos referenciados tienen fuente o ya existen
const existentes = new Set(fs.readdirSync('server/public/senales'));const sinFuente = [...usados].filter(f => !fuentes[f] && !existentes.has(f));
console.log('Referenciados sin fuente y no existentes:', sinFuente.length ? sinFuente : 'ninguno');

fs.writeFileSync('server/scripts/fuentes_senales.json', JSON.stringify(fuentes, null, 2));
fs.writeFileSync('server/scripts/senales_usados.json', JSON.stringify([...usados].sort(), null, 2));
console.log('OK - fuentes_senales.json y senales_usados.json generados');
