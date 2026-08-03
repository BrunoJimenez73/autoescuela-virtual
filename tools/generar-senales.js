const fs = require('fs');
const path = require('path');

const SVGS_DIR = path.join(__dirname, '..', 'server', 'public', 'senales');
fs.mkdirSync(SVGS_DIR, { recursive: true });

// Colores DGT oficiales
const ROJO = '#CE1126';
const AZUL = '#0055A4';
const AMARILLO = '#FFD100';
const BLANCO = '#FFFFFF';
const NEGRO = '#000000';

function svgCircleProhibicion(symbol) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="46" fill="${BLANCO}" stroke="${ROJO}" stroke-width="7"/>
  ${symbol || ''}
  <line x1="22" y1="78" x2="78" y2="22" stroke="${ROJO}" stroke-width="5" stroke-linecap="round"/>
</svg>`;
}

function svgCircleObligacion(symbol) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="46" fill="${AZUL}"/>
  ${symbol || ''}
</svg>`;
}

function svgTrianglePeligro(symbol) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <polygon points="50,4 96,93 4,93" fill="${BLANCO}" stroke="${ROJO}" stroke-width="7" stroke-linejoin="round"/>
  ${symbol || ''}
</svg>`;
}

function svgRectangleIndicacion(symbol) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="4" y="4" width="92" height="92" rx="6" fill="${AZUL}"/>
  ${symbol || ''}
</svg>`;
}

function svgOctagonStop() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <polygon points="50,2 86,14 98,50 86,86 50,98 14,86 2,50 14,14" fill="${ROJO}" stroke="${BLANCO}" stroke-width="3" stroke-linejoin="round"/>
  <text x="50" y="58" font-family="Arial Black,sans-serif" font-size="18" font-weight="bold" fill="${BLANCO}" text-anchor="middle" letter-spacing="2">STOP</text>
</svg>`;
}

function svgTriangleCeda() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <polygon points="50,96 4,7 96,7" fill="${BLANCO}" stroke="${ROJO}" stroke-width="7" stroke-linejoin="round"/>
  <text x="50" y="65" font-family="Arial,sans-serif" font-size="9" font-weight="bold" fill="${ROJO}" text-anchor="middle">CEDA</text>
  <text x="50" y="76" font-family="Arial,sans-serif" font-size="6" font-weight="bold" fill="${ROJO}" text-anchor="middle">EL PASO</text>
</svg>`;
}

function svgDiamond(symbol) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <polygon points="50,3 97,50 50,97 3,50" fill="${AMARILLO}" stroke="${BLANCO}" stroke-width="3" stroke-linejoin="round"/>
  ${symbol || ''}
</svg>`;
}

function svgRectangleServicio(symbol) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="4" y="4" width="92" height="92" rx="6" fill="${AZUL}"/>
  <rect x="10" y="10" width="80" height="80" rx="3" fill="${BLANCO}"/>
  ${symbol || ''}
</svg>`;
}

// Helpers for standard symbols
const FLECHA_DERECHA = `<polygon points="55,20 85,50 55,80" fill="${NEGRO}"/>
<line x1="15" y1="50" x2="80" y2="50" stroke="${NEGRO}" stroke-width="6" stroke-linecap="round"/>`;

const FLECHA_IZQUIERDA = `<polygon points="45,20 15,50 45,80" fill="${NEGRO}"/>
<line x1="85" y1="50" x2="20" y2="50" stroke="${NEGRO}" stroke-width="6" stroke-linecap="round"/>`;

const FLECHA_RECTA = `<polygon points="50,85 20,55 50,55 50,15 50,55 80,55" fill="${NEGRO}"/>`;

const FLECHA_DERECHA_BLANCA = `<polygon points="55,20 85,50 55,80" fill="${BLANCO}"/>
<line x1="15" y1="50" x2="80" y2="50" stroke="${BLANCO}" stroke-width="6" stroke-linecap="round"/>`;

const COCHE_NEGRO = `<rect x="30" y="35" width="40" height="25" rx="5" fill="${NEGRO}"/>
<rect x="25" y="40" width="50" height="15" rx="3" fill="${NEGRO}"/>
<circle cx="35" cy="65" r="6" fill="${NEGRO}"/>
<circle cx="65" cy="65" r="6" fill="${NEGRO}"/>`;

const CAMION_NEGRO = `<rect x="25" y="30" width="35" height="30" rx="3" fill="${NEGRO}"/>
<rect x="55" y="35" width="20" height="20" rx="3" fill="${NEGRO}"/>
<circle cx="32" cy="65" r="5" fill="${NEGRO}"/>
<circle cx="55" cy="65" r="5" fill="${NEGRO}"/>
<circle cx="70" cy="65" r="5" fill="${NEGRO}"/>`;

const CRUZ_NEGRA = `<line x1="30" y1="30" x2="70" y2="70" stroke="${NEGRO}" stroke-width="8" stroke-linecap="round"/>
<line x1="70" y1="30" x2="30" y2="70" stroke="${NEGRO}" stroke-width="8" stroke-linecap="round"/>`;

const CURVA_DERECHA = `<path d="M15,75 Q15,25 60,25 L85,25 M75,15 L85,25 L75,35" fill="none" stroke="${NEGRO}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`;

const CURVA_IZQUIERDA = `<path d="M85,75 Q85,25 40,25 L15,25 M25,15 L15,25 L25,35" fill="none" stroke="${NEGRO}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`;

const DOS_CURVAS_DERECHA = `<path d="M15,80 Q20,45 50,45 L85,45 M75,35 L85,45 L75,55" fill="none" stroke="${NEGRO}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M15,55 Q20,20 50,20 L85,20 M75,10 L85,20 L75,30" fill="none" stroke="${NEGRO}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;

const BAJADA = `<line x1="25" y1="20" x2="75" y2="80" stroke="${NEGRO}" stroke-width="6" stroke-linecap="round"/>
<polygon points="65,70 75,80 55,85" fill="${NEGRO}"/>
<text x="88" y="38" font-family="Arial,sans-serif" font-size="10" font-weight="bold" fill="${NEGRO}" text-anchor="middle">10%</text>`;

const SUBIDA = `<line x1="25" y1="80" x2="75" y2="20" stroke="${NEGRO}" stroke-width="6" stroke-linecap="round"/>
<polygon points="65,30 75,20 55,15" fill="${NEGRO}"/>
<text x="88" y="62" font-family="Arial,sans-serif" font-size="10" font-weight="bold" fill="${NEGRO}" text-anchor="middle">10%</text>`;

const ESTECHAMIENTO = `<line x1="20" y1="15" x2="20" y2="85" stroke="${NEGRO}" stroke-width="6" stroke-linecap="round"/>
<line x1="80" y1="15" x2="50" y2="85" stroke="${NEGRO}" stroke-width="6" stroke-linecap="round"/>`;

const ESTECHAMIENTO_DERECHA = `<line x1="20" y1="15" x2="20" y2="85" stroke="${NEGRO}" stroke-width="6" stroke-linecap="round"/>
<line x1="80" y1="15" x2="50" y2="85" stroke="${NEGRO}" stroke-width="6" stroke-linecap="round"/>
<polygon points="50,75 65,85 50,85" fill="${NEGRO}"/>`;

const ESTECHAMIENTO_IZQUIERDA = `<line x1="20" y1="15" x2="50" y2="85" stroke="${NEGRO}" stroke-width="6" stroke-linecap="round"/>
<line x1="80" y1="15" x2="80" y2="85" stroke="${NEGRO}" stroke-width="6" stroke-linecap="round"/>
<polygon points="50,75 35,85 50,85" fill="${NEGRO}"/>`;

const PAVIMENTO_DESLIZANTE = `<line x1="25" y1="30" x2="75" y2="30" stroke="${NEGRO}" stroke-width="2"/>
<line x1="25" y1="42" x2="75" y2="42" stroke="${NEGRO}" stroke-width="2"/>
<line x1="25" y1="54" x2="75" y2="54" stroke="${NEGRO}" stroke-width="2"/>
<line x1="25" y1="66" x2="75" y2="66" stroke="${NEGRO}" stroke-width="2"/>
<path d="M50,30 Q40,48 50,66 Q60,48 50,30" fill="none" stroke="${NEGRO}" stroke-width="3"/>`;

const GRAVILLA = `<circle cx="35" cy="40" r="3" fill="${NEGRO}"/>
<circle cx="50" cy="35" r="3" fill="${NEGRO}"/>
<circle cx="65" cy="42" r="3" fill="${NEGRO}"/>
<circle cx="40" cy="55" r="3" fill="${NEGRO}"/>
<circle cx="60" cy="52" r="3" fill="${NEGRO}"/>
<circle cx="30" cy="50" r="3" fill="${NEGRO}"/>
<circle cx="70" cy="55" r="3" fill="${NEGRO}"/>
<line x1="20" y1="70" x2="80" y2="70" stroke="${NEGRO}" stroke-width="3" stroke-linecap="round"/>
<line x1="20" y1="70" x2="30" y2="60" stroke="${NEGRO}" stroke-width="3" stroke-linecap="round"/>`;

const DESPRENDIMIENTO = `<circle cx="35" cy="35" r="8" fill="${NEGRO}"/>
<circle cx="55" cy="25" r="6" fill="${NEGRO}"/>
<circle cx="65" cy="38" r="5" fill="${NEGRO}"/>
<circle cx="45" cy="48" r="7" fill="${NEGRO}"/>
<circle cx="62" cy="55" r="4" fill="${NEGRO}"/>
<line x1="20" y1="75" x2="80" y2="75" stroke="${NEGRO}" stroke-width="4" stroke-linecap="round"/>`;

const SEMAFORO = `<rect x="35" y="15" width="30" height="60" rx="5" fill="${NEGRO}"/>
<circle cx="50" cy="32" r="8" fill="${NEGRO}"/>
<circle cx="50" cy="50" r="8" fill="${NEGRO}"/>
<circle cx="50" cy="50" r="8" fill="#FFD100"/>
<circle cx="50" cy="68" r="8" fill="${NEGRO}"/>
<rect x="45" y="75" width="10" height="15" fill="${NEGRO}"/>`;

const PUENTE_MOVIL = `<rect x="50" y="10" width="35" height="25" rx="3" fill="${NEGRO}"/>
<line x1="50" y1="10" x2="50" y2="35" stroke="${NEGRO}" stroke-width="100" stroke-linecap="round"/>
<circle cx="50" cy="38" r="5" fill="${NEGRO}"/>
<line x1="45" y1="65" x2="50" y2="38" stroke="${NEGRO}" stroke-width="4" stroke-linecap="round"/>
<line x1="15" y1="70" x2="85" y2="70" stroke="${NEGRO}" stroke-width="4" stroke-linecap="round"/>`;

const ANIMAL = `<ellipse cx="50" cy="55" rx="20" ry="15" fill="${NEGRO}"/>
<circle cx="50" cy="30" r="12" fill="${NEGRO}"/>
<circle cx="45" cy="28" r="3" fill="${BLANCO}"/>
<line x1="42" y1="70" x2="38" y2="88" stroke="${NEGRO}" stroke-width="4" stroke-linecap="round"/>
<line x1="58" y1="70" x2="62" y2="88" stroke="${NEGRO}" stroke-width="4" stroke-linecap="round"/>
<line x1="48" y1="55" x2="42" y2="88" stroke="${NEGRO}" stroke-width="4" stroke-linecap="round"/>
<path d="M50,18 Q58,8 65,15" fill="none" stroke="${NEGRO}" stroke-width="3" stroke-linecap="round"/>`;

const CICLISTA = `<circle cx="50" cy="22" r="7" fill="${NEGRO}"/>
<line x1="50" y1="29" x2="50" y2="50" stroke="${NEGRO}" stroke-width="4" stroke-linecap="round"/>
<line x1="50" y1="35" x2="35" y2="40" stroke="${NEGRO}" stroke-width="3" stroke-linecap="round"/>
<line x1="50" y1="50" x2="40" y2="68" stroke="${NEGRO}" stroke-width="4" stroke-linecap="round"/>
<line x1="50" y1="50" x2="60" y2="68" stroke="${NEGRO}" stroke-width="4" stroke-linecap="round"/>
<circle cx="45" cy="75" r="5" fill="${NEGRO}"/>
<circle cx="60" cy="75" r="5" fill="${NEGRO}"/>
<line x1="40" y1="68" x2="45" y2="75" stroke="${NEGRO}" stroke-width="3" stroke-linecap="round"/>
<line x1="60" y1="68" x2="60" y2="75" stroke="${NEGRO}" stroke-width="3" stroke-linecap="round"/>`;

const PEATON = `<circle cx="50" cy="18" r="8" fill="${NEGRO}"/>
<line x1="50" y1="26" x2="50" y2="55" stroke="${NEGRO}" stroke-width="5" stroke-linecap="round"/>
<line x1="50" y1="55" x2="38" y2="80" stroke="${NEGRO}" stroke-width="5" stroke-linecap="round"/>
<line x1="50" y1="55" x2="62" y2="80" stroke="${NEGRO}" stroke-width="5" stroke-linecap="round"/>
<line x1="50" y1="35" x2="35" y2="45" stroke="${NEGRO}" stroke-width="4" stroke-linecap="round"/>
<line x1="50" y1="35" x2="65" y2="45" stroke="${NEGRO}" stroke-width="4" stroke-linecap="round"/>`;

const NINO = `<circle cx="50" cy="20" r="8" fill="${NEGRO}"/>
<line x1="50" y1="28" x2="50" y2="50" stroke="${NEGRO}" stroke-width="4" stroke-linecap="round"/>
<line x1="50" y1="50" x2="38" y2="72" stroke="${NEGRO}" stroke-width="4" stroke-linecap="round"/>
<line x1="50" y1="50" x2="62" y2="72" stroke="${NEGRO}" stroke-width="4" stroke-linecap="round"/>
<line x1="50" y1="35" x2="35" y2="42" stroke="${NEGRO}" stroke-width="3" stroke-linecap="round"/>
<line x1="50" y1="35" x2="65" y2="42" stroke="${NEGRO}" stroke-width="3" stroke-linecap="round"/>`;

const OBRERO = `<circle cx="50" cy="20" r="8" fill="${NEGRO}"/>
<rect x="35" y="28" width="30" height="22" rx="2" fill="${NEGRO}"/>
<line x1="50" y1="50" x2="50" y2="70" stroke="${NEGRO}" stroke-width="5" stroke-linecap="round"/>
<line x1="50" y1="70" x2="38" y2="85" stroke="${NEGRO}" stroke-width="4" stroke-linecap="round"/>
<line x1="50" y1="70" x2="62" y2="85" stroke="${NEGRO}" stroke-width="4" stroke-linecap="round"/>
<line x1="50" y1="35" x2="35" y2="42" stroke="${NEGRO}" stroke-width="3" stroke-linecap="round"/>
<line x1="50" y1="35" x2="65" y2="42" stroke="${NEGRO}" stroke-width="3" stroke-linecap="round"/>`;

const VIENTO = `<path d="M20,35 Q40,25 60,35 Q75,42 85,35" fill="none" stroke="${NEGRO}" stroke-width="4" stroke-linecap="round"/>
<path d="M15,50 Q35,40 55,50 Q70,57 80,50" fill="none" stroke="${NEGRO}" stroke-width="4" stroke-linecap="round"/>
<path d="M25,65 Q40,55 55,65" fill="none" stroke="${NEGRO}" stroke-width="3" stroke-linecap="round"/>
<circle cx="50" cy="45" r="12" fill="${NEGRO}"/>`;

const HIELO = `<path d="M30,25 L70,25" stroke="${NEGRO}" stroke-width="2"/>
<path d="M25,40 L75,40" stroke="${NEGRO}" stroke-width="2"/>
<path d="M30,55 L70,55" stroke="${NEGRO}" stroke-width="2"/>
<path d="M25,70 L75,70" stroke="${NEGRO}" stroke-width="2"/>
<path d="M50,25 L25,70" stroke="${NEGRO}" stroke-width="3"/>
<path d="M50,25 L75,70" stroke="${NEGRO}" stroke-width="3"/>
<circle cx="50" cy="48" r="6" fill="${BLANCO}" stroke="${NEGRO}" stroke-width="2"/>`;

const PEATONES_PASO = `<line x1="20" y1="75" x2="80" y2="75" stroke="${NEGRO}" stroke-width="3"/>
<line x1="20" y1="75" x2="80" y2="75" stroke="${BLANCO}" stroke-width="2"/>
<rect x="35" y="30" width="12" height="25" rx="2" fill="${NEGRO}"/>
<rect x="53" y="30" width="12" height="25" rx="2" fill="${NEGRO}"/>
<circle cx="41" cy="22" r="6" fill="${NEGRO}"/>
<circle cx="59" cy="22" r="6" fill="${NEGRO}"/>
<line x1="41" y1="55" x2="36" y2="75" stroke="${NEGRO}" stroke-width="3"/>
<line x1="59" y1="55" x2="64" y2="75" stroke="${NEGRO}" stroke-width="3"/>`;

const BIFURCACION = `<line x1="50" y1="15" x2="50" y2="55" stroke="${NEGRO}" stroke-width="6" stroke-linecap="round"/>
<line x1="50" y1="55" x2="25" y2="85" stroke="${NEGRO}" stroke-width="6" stroke-linecap="round"/>
<line x1="50" y1="55" x2="75" y2="85" stroke="${NEGRO}" stroke-width="6" stroke-linecap="round"/>`;

const VIA_MAL_ESTADO = `<line x1="25" y1="25" x2="75" y2="25" stroke="${NEGRO}" stroke-width="3"/>
<line x1="20" y1="45" x2="40" y2="45" stroke="${NEGRO}" stroke-width="3"/>
<line x1="50" y1="45" x2="80" y2="45" stroke="${NEGRO}" stroke-width="3"/>
<line x1="30" y1="65" x2="70" y2="65" stroke="${NEGRO}" stroke-width="3"/>
<circle cx="50" cy="35" r="4" fill="${NEGRO}"/>`;

// Prohibición symbols in white for diagonal overlay
const COCHE_NEGRO_SIN = `<rect x="30" y="35" width="40" height="25" rx="5" fill="${NEGRO}"/>
<rect x="25" y="40" width="50" height="15" rx="3" fill="${NEGRO}"/>
<circle cx="35" cy="65" r="6" fill="${NEGRO}"/>
<circle cx="65" cy="65" r="6" fill="${NEGRO}"/>`;

const PROHIBIDO_ESTACIONAR = `<text x="50" y="58" font-family="Arial,sans-serif" font-size="32" font-weight="bold" fill="${NEGRO}" text-anchor="middle">E</text>`;
const PROHIBIDO_DETENER = `<line x1="25" y1="35" x2="75" y2="35" stroke="${NEGRO}" stroke-width="6" stroke-linecap="round"/>
<line x1="25" y1="65" x2="75" y2="65" stroke="${NEGRO}" stroke-width="6" stroke-linecap="round"/>`;

const signs = [
  // ===== REGLAMENTACIÓN (R) =====
  { id: 'stop', codigo: 'R-1', nombre: 'STOP', categoria: 'Reglamentación',
    descripcion: 'Señal octogonal de color rojo con borde blanco y la inscripción STOP.',
    significado: 'Obligación de detenerse antes de la línea de detención. Señal utilizada en pasos a nivel sin barreras, salida de vía prioritaria y fin de autopista.',
    svg: svgOctagonStop() },

  { id: 'ceda-paso', codigo: 'R-2', nombre: 'Ceda el paso', categoria: 'Reglamentación',
    descripcion: 'Triángulo equilátero invertido con borde rojo y centro blanco, con la inscripción "CEDA EL PASO".',
    significado: 'Obligación de ceder el paso a los vehículos que circulan por la vía preferente, deteniéndose si es necesario.',
    svg: svgTriangleCeda() },

  { id: 'carretera-prioritaria', codigo: 'R-3', nombre: 'Carretera prioritaria', categoria: 'Prioridad',
    descripcion: 'Rombo de color amarillo con borde blanco.',
    significado: 'Indica que la vía por la que se circula es prioritaria. Los vehículos que se aproximen por otras vías deben ceder el paso.',
    svg: svgDiamond() },

  // ===== PELIGRO (P) =====
  { id: 'curva-peligrosa', codigo: 'P-1', nombre: 'Curva peligrosa hacia la derecha', categoria: 'Peligro',
    descripcion: 'Señal triangular con borde rojo, fondo blanco y un símbolo de curva en negro.',
    significado: 'Advierte de una curva peligrosa hacia la derecha. Extremar la precaución, reducir la velocidad.',
    svg: svgTrianglePeligro(CURVA_DERECHA) },

  { id: 'curva-peligrosa-izquierda', codigo: 'P-1a', nombre: 'Curva peligrosa hacia la izquierda', categoria: 'Peligro',
    descripcion: 'Señal triangular con borde rojo, fondo blanco y un símbolo de curva hacia la izquierda en negro.',
    significado: 'Advierte de una curva peligrosa hacia la izquierda. Extremar la precaución, reducir la velocidad.',
    svg: svgTrianglePeligro(CURVA_IZQUIERDA) },

  { id: 'stop-adelante', codigo: 'P-1b', nombre: 'STOP (pre-señalización)', categoria: 'Peligro',
    descripcion: 'Señal triangular con borde rojo, fondo blanco, que contiene una señal de STOP en miniatura.',
    significado: 'Advierte de la proximidad de una señal de STOP más adelante. Prepararse para detenerse.',
    svg: svgTrianglePeligro(`<polygon points="50,20 80,65 20,65" fill="${ROJO}" stroke="${BLANCO}" stroke-width="2" stroke-linejoin="round"/>
<text x="50" y="53" font-family="Arial Black,sans-serif" font-size="9" font-weight="bold" fill="${BLANCO}" text-anchor="middle" letter-spacing="1">STOP</text>`) },

  { id: 'interseccion-prioridad', codigo: 'P-2', nombre: 'Intersección con prioridad', categoria: 'Peligro',
    descripcion: 'Señal triangular con borde rojo, fondo blanco y una cruz negra en el centro.',
    significado: 'Advierte de una intersección donde el conductor tiene prioridad sobre los vehículos que se incorporan desde otras vías.',
    svg: svgTrianglePeligro(CRUZ_NEGRA) },

  { id: 'semaforo', codigo: 'P-3', nombre: 'Semáforo', categoria: 'Peligro',
    descripcion: 'Señal triangular con borde rojo, fondo blanco y un semáforo en negro.',
    significado: 'Advierte de la proximidad de un semáforo. Extremar la precaución y prepararse para detenerse.',
    svg: svgTrianglePeligro(SEMAFORO) },

  { id: 'prioridad-derecha', codigo: 'P-4', nombre: 'Intersección con prioridad derecha', categoria: 'Peligro',
    descripcion: 'Señal triangular con borde rojo, fondo blanco y una cruz delgada en negro.',
    significado: 'Advierte de una intersección donde se aplica la regla general de prioridad de paso por la derecha.',
    svg: svgTrianglePeligro(CRUZ_NEGRA) },

  { id: 'curvas-derecha', codigo: 'P-5', nombre: 'Curvas peligrosas (primera a la derecha)', categoria: 'Peligro',
    descripcion: 'Señal triangular con borde rojo, fondo blanco y un símbolo de curvas en negro.',
    significado: 'Advierte de una serie de curvas peligrosas, siendo la primera hacia la derecha.',
    svg: svgTrianglePeligro(DOS_CURVAS_DERECHA) },

  { id: 'bajada-pendiente', codigo: 'P-8', nombre: 'Bajada con fuerte pendiente', categoria: 'Peligro',
    descripcion: 'Señal triangular con borde rojo, fondo blanco, flecha inclinada hacia abajo y un porcentaje.',
    significado: 'Advierte de un tramo de vía con fuerte pendiente descendente. Utilizar el freno motor y reducir la velocidad.',
    svg: svgTrianglePeligro(BAJADA) },

  { id: 'subida-pendiente', codigo: 'P-9', nombre: 'Subida con fuerte pendiente', categoria: 'Peligro',
    descripcion: 'Señal triangular con borde rojo, fondo blanco, flecha inclinada hacia arriba y un porcentaje.',
    significado: 'Advierte de un tramo de vía con fuerte pendiente ascendente. Adecuar la marcha y prepararse para cambios de velocidad.',
    svg: svgTrianglePeligro(SUBIDA) },

  { id: 'estrechamiento', codigo: 'P-10', nombre: 'Estrechamiento de calzada', categoria: 'Peligro',
    descripcion: 'Señal triangular con borde rojo, fondo blanco y dos líneas verticales que se estrechan.',
    significado: 'Advierte de un estrechamiento de la calzada por ambos lados. Extremar la precaución y reducir la velocidad.',
    svg: svgTrianglePeligro(ESTECHAMIENTO) },

  { id: 'estrechamiento-derecha', codigo: 'P-10a', nombre: 'Estrechamiento de calzada por la derecha', categoria: 'Peligro',
    descripcion: 'Señal triangular con borde rojo, fondo blanco y dos líneas que se estrechan por el lado derecho.',
    significado: 'Advierte de un estrechamiento de la calzada por el lado derecho.',
    svg: svgTrianglePeligro(ESTECHAMIENTO_DERECHA) },

  { id: 'estrechamiento-izquierda', codigo: 'P-11', nombre: 'Estrechamiento de calzada por la izquierda', categoria: 'Peligro',
    descripcion: 'Señal triangular con borde rojo, fondo blanco y dos líneas que se estrechan por el lado izquierdo.',
    significado: 'Advierte de un estrechamiento de la calzada por el lado izquierdo.',
    svg: svgTrianglePeligro(ESTECHAMIENTO_IZQUIERDA) },

  { id: 'pavimento-deslizante', codigo: 'P-13', nombre: 'Pavimento deslizante', categoria: 'Peligro',
    descripcion: 'Señal triangular con borde rojo, fondo blanco y un símbolo de pavimento mojado o deslizante.',
    significado: 'Advierte de que el pavimento puede resultar especialmente deslizante por lluvia, barro o aceite. Reducir la velocidad y aumentar la distancia de seguridad.',
    svg: svgTrianglePeligro(PAVIMENTO_DESLIZANTE) },

  { id: 'gravilla', codigo: 'P-14', nombre: 'Proyección de gravilla', categoria: 'Peligro',
    descripcion: 'Señal triangular con borde rojo, fondo blanco y un símbolo de gravilla en negro.',
    significado: 'Advierte de la posible proyección de gravilla por la circulación de vehículos. Reducir la velocidad y aumentar la distancia de seguridad.',
    svg: svgTrianglePeligro(GRAVILLA) },

  { id: 'desprendimiento', codigo: 'P-15', nombre: 'Desprendimiento', categoria: 'Peligro',
    descripcion: 'Señal triangular con borde rojo, fondo blanco y piedras cayendo en negro.',
    significado: 'Advierte de un tramo con riesgo de desprendimiento de piedras o materiales de la ladera.',
    svg: svgTrianglePeligro(DESPRENDIMIENTO) },

  { id: 'puente-movil', codigo: 'P-16', nombre: 'Puente móvil', categoria: 'Peligro',
    descripcion: 'Señal triangular con borde rojo, fondo blanco y un puente levadizo en negro.',
    significado: 'Advierte de la proximidad de un puente móvil o levadizo.',
    svg: svgTrianglePeligro(PUENTE_MOVIL) },

  { id: 'paso-peatones', codigo: 'P-20', nombre: 'Paso de peatones', categoria: 'Peligro',
    descripcion: 'Señal triangular con borde rojo, fondo blanco y la silueta de un peatón cruzando en negro.',
    significado: 'Advierte de la proximidad de un paso de peatones señalizado.',
    svg: svgTrianglePeligro(PEATON) },

  { id: 'ciclistas', codigo: 'P-21', nombre: 'Ciclistas', categoria: 'Peligro',
    descripcion: 'Señal triangular con borde rojo, fondo blanco y la silueta de un ciclista en negro.',
    significado: 'Advierte de la proximidad de un paso para ciclistas o de un tramo donde los ciclistas tienen prioridad.',
    svg: svgTrianglePeligro(CICLISTA) },

  { id: 'ninos', codigo: 'P-23', nombre: 'Niños', categoria: 'Peligro',
    descripcion: 'Señal triangular con borde rojo, fondo blanco y la silueta de dos niños corriendo en negro.',
    significado: 'Advierte de la proximidad de un lugar frecuentado por niños, como escuelas, parques o zonas residenciales.',
    svg: svgTrianglePeligro(NINO) },

  { id: 'animales-libres', codigo: 'P-24', nombre: 'Animales en libertad', categoria: 'Peligro',
    descripcion: 'Señal triangular con borde rojo, fondo blanco y la silueta de un animal en negro.',
    significado: 'Advierte de la posible presencia de animales en libertad en la vía. Extremar la precaución, especialmente en zonas de pastoreo o montaña.',
    svg: svgTrianglePeligro(ANIMAL) },

  { id: 'senal-obra', codigo: 'P-50', nombre: 'Obras', categoria: 'Peligro',
    descripcion: 'Señal triangular con borde rojo, fondo blanco y un obrero trabajando en negro.',
    significado: 'Advierte de la proximidad de obras o trabajos en la vía. Reducir la velocidad y prestar atención a la señalización temporal.',
    svg: svgTrianglePeligro(OBRERO) },

  { id: 'viento-transversal', codigo: 'P-30', nombre: 'Viento transversal', categoria: 'Peligro',
    descripcion: 'Señal triangular con borde rojo, fondo blanco y un símbolo de viento en negro.',
    significado: 'Advierte de un tramo con fuertes rachas de viento transversal. Reducir la velocidad y sujetar firmemente el volante.',
    svg: svgTrianglePeligro(VIENTO) },

  { id: 'hielo-nieve', codigo: 'P-28', nombre: 'Hielo o nieve', categoria: 'Peligro',
    descripcion: 'Señal triangular con borde rojo, fondo blanco y un copo de nieve en negro.',
    significado: 'Advierte de la posibilidad de encontrar hielo o nieve en la calzada. Extremar la precaución, reducir la velocidad y evitar frenazos bruscos.',
    svg: svgTrianglePeligro(HIELO) },

  // ===== PROHIBICIÓN (R-1xx, R-3xx) =====
  { id: 'prohibido-paso', codigo: 'R-100', nombre: 'Circulación prohibida', categoria: 'Prohibición',
    descripcion: 'Señal circular de fondo rojo con una franja horizontal blanca en el centro.',
    significado: 'Prohibición de acceso a toda clase de vehículos en ambos sentidos. Prohíbe la circulación en la vía señalizada.',
    svg: svgCircleProhibicion(`<rect x="10" y="43" width="80" height="14" fill="${BLANCO}"/>`) },

  { id: 'senal-prohibido-camiones', codigo: 'R-106', nombre: 'Prohibición camiones', categoria: 'Prohibición',
    descripcion: 'Señal circular blanca con borde rojo y un camión en negro.',
    significado: 'Prohibición de circulación de camiones con masa máxima autorizada superior a la indicada en la señal.',
    svg: svgCircleProhibicion(CAMION_NEGRO) },

  { id: 'velocidad-maxima', codigo: 'R-301', nombre: 'Velocidad máxima', categoria: 'Prohibición',
    descripcion: 'Señal circular blanca con borde rojo y un número en negro que indica los km/h máximos.',
    significado: 'Prohibición de superar la velocidad máxima indicada en km/h. Rige desde la señal hasta que se indique lo contrario.',
    svg: svgCircleProhibicion(`<text x="50" y="58" font-family="Arial Black,sans-serif" font-size="28" font-weight="bold" fill="${NEGRO}" text-anchor="middle">50</text>`) },

  { id: 'prohibido-adelantar', codigo: 'R-302', nombre: 'Prohibido adelantar', categoria: 'Prohibición',
    descripcion: 'Señal circular blanca con borde rojo y dos coches en negro y rojo.',
    significado: 'Prohibición de adelantar a cualquier vehículo que circule por la calzada, salvo motocicletas de dos ruedas.',
    svg: svgCircleProhibicion(COCHE_NEGRO_SIN) },

  { id: 'prohibido-estacionar', codigo: 'R-308', nombre: 'Prohibido estacionar', categoria: 'Prohibición',
    descripcion: 'Señal circular blanca con borde rojo, una letra E mayúscula tachada por una diagonal roja.',
    significado: 'Prohíbe el estacionamiento en el tramo de vía señalizado. No afecta a la parada o detención.',
    svg: svgCircleProhibicion(PROHIBIDO_ESTACIONAR) },

  { id: 'prohibido-detener', codigo: 'R-307', nombre: 'Prohibido detenerse', categoria: 'Prohibición',
    descripcion: 'Señal circular blanca con borde rojo y dos barras cruzadas en diagonal de color rojo.',
    significado: 'Prohíbe detenerse y estacionar en el tramo de vía señalizado.',
    svg: svgCircleProhibicion(PROHIBIDO_DETENER) },

  { id: 'prohibido-motos', codigo: 'R-102', nombre: 'Entrada prohibida a motocicletas', categoria: 'Prohibición',
    descripcion: 'Señal circular blanca con borde rojo y la silueta de una motocicleta en negro.',
    significado: 'Prohíbe el acceso a motocicletas de dos o tres ruedas.',
    svg: svgCircleProhibicion(`<circle cx="50" cy="42" r="8" fill="${NEGRO}"/>
<line x1="50" y1="50" x2="50" y2="65" stroke="${NEGRO}" stroke-width="4" stroke-linecap="round"/>
<line x1="50" y1="65" x2="40" y2="80" stroke="${NEGRO}" stroke-width="4" stroke-linecap="round"/>
<line x1="50" y1="65" x2="60" y2="80" stroke="${NEGRO}" stroke-width="4" stroke-linecap="round"/>
<circle cx="40" cy="80" r="4" fill="${NEGRO}"/>
<circle cx="60" cy="80" r="4" fill="${NEGRO}"/>`) },

  { id: 'prohibido-bicicletas', codigo: 'R-104', nombre: 'Entrada prohibida a bicicletas', categoria: 'Prohibición',
    descripcion: 'Señal circular blanca con borde rojo y la silueta de una bicicleta en negro.',
    significado: 'Prohíbe el acceso a bicicletas y ciclomotores de dos ruedas.',
    svg: svgCircleProhibicion(CICLISTA) },

  { id: 'prohibido-peatones', codigo: 'R-107', nombre: 'Entrada prohibida a peatones', categoria: 'Prohibición',
    descripcion: 'Señal circular blanca con borde rojo y la silueta de un peatón en negro.',
    significado: 'Prohíbe el acceso a peatones.',
    svg: svgCircleProhibicion(PEATON) },

  { id: 'prohibido-girar-derecha', codigo: 'R-119', nombre: 'Prohibido girar a la derecha', categoria: 'Prohibición',
    descripcion: 'Señal circular blanca con borde rojo y una flecha negra curvada hacia la derecha tachada.',
    significado: 'Prohíbe cambiar de dirección hacia la derecha en la próxima intersección.',
    svg: svgCircleProhibicion(`<path d="M20,65 Q20,30 60,30 L85,30 M75,18 L85,30 L75,42" fill="none" stroke="${NEGRO}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`) },

  { id: 'prohibido-girar-izquierda', codigo: 'R-120', nombre: 'Prohibido girar a la izquierda', categoria: 'Prohibición',
    descripcion: 'Señal circular blanca con borde rojo y una flecha negra curvada hacia la izquierda tachada.',
    significado: 'Prohíbe cambiar de dirección hacia la izquierda en la próxima intersección.',
    svg: svgCircleProhibicion(`<path d="M80,65 Q80,30 40,30 L15,30 M25,18 L15,30 L25,42" fill="none" stroke="${NEGRO}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`) },

  { id: 'limitacion-altura', codigo: 'R-115', nombre: 'Limitación de altura', categoria: 'Prohibición',
    descripcion: 'Señal circular blanca con borde rojo y un número que indica la altura máxima en metros.',
    significado: 'Prohíbe la circulación de vehículos con altura superior a la indicada.',
    svg: svgCircleProhibicion(`<text x="50" y="48" font-family="Arial Black,sans-serif" font-size="24" font-weight="bold" fill="${NEGRO}" text-anchor="middle">3,5</text>
<text x="50" y="62" font-family="Arial,sans-serif" font-size="10" fill="${NEGRO}" text-anchor="middle">m</text>`) },

  { id: 'limitacion-anchura', codigo: 'R-116', nombre: 'Limitación de anchura', categoria: 'Prohibición',
    descripcion: 'Señal circular blanca con borde rojo y un número que indica la anchura máxima en metros.',
    significado: 'Prohíbe la circulación de vehículos con anchura superior a la indicada.',
    svg: svgCircleProhibicion(`<text x="50" y="52" font-family="Arial Black,sans-serif" font-size="26" font-weight="bold" fill="${NEGRO}" text-anchor="middle">2,5</text>`) },

  { id: 'limitacion-masa', codigo: 'R-114', nombre: 'Limitación de masa', categoria: 'Prohibición',
    descripcion: 'Señal circular blanca con borde rojo y un número que indica la masa máxima en toneladas.',
    significado: 'Prohíbe la circulación de vehículos con masa superior a la indicada.',
    svg: svgCircleProhibicion(`<text x="50" y="48" font-family="Arial Black,sans-serif" font-size="24" font-weight="bold" fill="${NEGRO}" text-anchor="middle">10</text>
<text x="50" y="62" font-family="Arial,sans-serif" font-size="10" fill="${NEGRO}" text-anchor="middle">t</text>`) },

  { id: 'limitacion-longitud', codigo: 'R-117', nombre: 'Limitación de longitud', categoria: 'Prohibición',
    descripcion: 'Señal circular blanca con borde rojo y un número que indica la longitud máxima en metros.',
    significado: 'Prohíbe la circulación de vehículos o conjuntos de vehículos con longitud superior a la indicada.',
    svg: svgCircleProhibicion(`<text x="50" y="48" font-family="Arial Black,sans-serif" font-size="24" font-weight="bold" fill="${NEGRO}" text-anchor="middle">12</text>
<text x="50" y="62" font-family="Arial,sans-serif" font-size="10" fill="${NEGRO}" text-anchor="middle">m</text>`) },

  { id: 'prohibido-senal-acustica', codigo: 'R-200', nombre: 'Prohibido señales acústicas', categoria: 'Prohibición',
    descripcion: 'Señal circular blanca con borde rojo y una bocina tachada en negro.',
    significado: 'Prohíbe el uso del claxon o señales acústicas, salvo en caso de peligro inminente.',
    svg: svgCircleProhibicion(`<path d="M35,35 L35,65 L50,65 L65,78 L65,22 L50,35 Z" fill="none" stroke="${NEGRO}" stroke-width="4" stroke-linejoin="round"/>
<path d="M70,30 Q80,50 70,70" fill="none" stroke="${NEGRO}" stroke-width="3" stroke-linecap="round"/>`) },

  // ===== OBLIGACIÓN (R-4xx) =====
  { id: 'direccion-obligatoria', codigo: 'R-400', nombre: 'Dirección obligatoria', categoria: 'Obligación',
    descripcion: 'Señal circular azul con una flecha blanca indicando la dirección.',
    significado: 'Obligación de seguir la dirección indicada por la flecha. Puede indicar una o varias direcciones.',
    svg: svgCircleObligacion(FLECHA_DERECHA_BLANCA) },

  { id: 'velocidad-minima', codigo: 'R-412', nombre: 'Velocidad mínima', categoria: 'Obligación',
    descripcion: 'Señal circular azul con un número blanco indicando la velocidad en km/h.',
    significado: 'Obligación de circular al menos a la velocidad indicada, sin superar la velocidad máxima genérica.',
    svg: svgCircleObligacion(`<text x="50" y="58" font-family="Arial Black,sans-serif" font-size="28" font-weight="bold" fill="${BLANCO}" text-anchor="middle">30</text>`) },

  { id: 'circulacion-giratoria', codigo: 'R-413', nombre: 'Circulación giratoria obligatoria', categoria: 'Obligación',
    descripcion: 'Señal circular azul con tres flechas blancas formando un círculo en el sentido de las agujas del reloj.',
    significado: 'Obliga a circular en el sentido indicado por las flechas. Indica una glorieta o sentido giratorio obligatorio.',
    svg: svgCircleObligacion(`<path d="M50,25 A25,25 0 1,1 30,65" fill="none" stroke="${BLANCO}" stroke-width="5" stroke-linecap="round"/>
<polygon points="30,65 22,50 30,55" fill="${BLANCO}"/>
<path d="M30,65 A25,25 0 1,1 65,40" fill="none" stroke="${BLANCO}" stroke-width="5" stroke-linecap="round"/>
<polygon points="65,40 50,35 60,42" fill="${BLANCO}"/>
<path d="M65,40 A25,25 0 1,1 50,25" fill="none" stroke="${BLANCO}" stroke-width="5" stroke-linecap="round"/>
<polygon points="50,25 60,33 50,35" fill="${BLANCO}"/>`) },

  { id: 'pasar-izquierda', codigo: 'R-401', nombre: 'Pasar por la izquierda', categoria: 'Obligación',
    descripcion: 'Señal circular azul con una flecha blanca oblicua hacia la izquierda.',
    significado: 'Obligación de pasar por el lado izquierdo del obstáculo o de la isleta.',
    svg: svgCircleObligacion(FLECHA_IZQUIERDA.replace(/fill="black"/g, 'fill="white"').replace(/#000000/g, '#FFFFFF')) },

  { id: 'pasar-derecha', codigo: 'R-402', nombre: 'Pasar por la derecha', categoria: 'Obligación',
    descripcion: 'Señal circular azul con una flecha blanca oblicua hacia la derecha.',
    significado: 'Obligación de pasar por el lado derecho del obstáculo o de la isleta.',
    svg: svgCircleObligacion(FLECHA_DERECHA_BLANCA) },

  { id: 'interseccion-giratoria', codigo: 'R-403', nombre: 'Intersección de sentido giratorio', categoria: 'Obligación',
    descripcion: 'Señal circular azul con tres flechas blancas formando un círculo.',
    significado: 'Obliga a circular en el sentido indicado por las flechas alrededor de una plaza o glorieta.',
    svg: svgCircleObligacion(`<path d="M50,25 A25,25 0 1,1 30,65" fill="none" stroke="${BLANCO}" stroke-width="5" stroke-linecap="round"/>
<polygon points="30,65 22,50 30,55" fill="${BLANCO}"/>`) },

  { id: 'calzada-sentido-unico', codigo: 'R-404', nombre: 'Calzada de sentido único', categoria: 'Obligación',
    descripcion: 'Señal circular azul con una flecha blanca vertical hacia arriba.',
    significado: 'Obligación de circular en el sentido indicado por la flecha. Vía de sentido único.',
    svg: svgCircleObligacion(FLECHA_RECTA.replace(/fill="black"/g, 'fill="white"').replace(/#000000/g, '#FFFFFF')) },

  // ===== INDICACIÓN (S) =====
  { id: 'autopista', codigo: 'S-1', nombre: 'Autopista', categoria: 'Indicación',
    descripcion: 'Señal rectangular azul con el símbolo de un puente y dos carriles en blanco.',
    significado: 'Indica el inicio de una autopista. Aplican las normas específicas de circulación por autopista.',
    svg: svgRectangleIndicacion(`<rect x="25" y="30" width="50" height="30" rx="3" fill="${BLANCO}"/>
<line x1="15" y1="45" x2="85" y2="45" stroke="${BLANCO}" stroke-width="3"/>
<line x1="15" y1="45" x2="85" y2="25" stroke="${BLANCO}" stroke-width="4"/>`) },

  { id: 'autovia', codigo: 'S-2', nombre: 'Autovía', categoria: 'Indicación',
    descripcion: 'Señal rectangular azul con el símbolo de un puente y dos carriles en blanco, similar a autopista.',
    significado: 'Indica el inicio de una autovía. Aplican las normas específicas de circulación por autovía.',
    svg: svgRectangleIndicacion(`<rect x="25" y="30" width="50" height="30" rx="3" fill="${BLANCO}"/>
<line x1="15" y1="45" x2="85" y2="45" stroke="${BLANCO}" stroke-width="3"/>`) },

  { id: 'tunel', codigo: 'S-5', nombre: 'Túnel', categoria: 'Indicación',
    descripcion: 'Señal rectangular azul con el símbolo de un túnel en blanco.',
    significado: 'Indica la proximidad o el inicio de un túnel. Extremar la precaución, encender las luces de cruce.',
    svg: svgRectangleIndicacion(`<path d="M20,65 Q20,25 50,25 Q80,25 80,65" fill="none" stroke="${BLANCO}" stroke-width="5" stroke-linecap="round"/>
<line x1="35" y1="65" x2="35" y2="45" stroke="${BLANCO}" stroke-width="3"/>
<line x1="50" y1="65" x2="50" y2="40" stroke="${BLANCO}" stroke-width="3"/>
<line x1="65" y1="65" x2="65" y2="45" stroke="${BLANCO}" stroke-width="3"/>`) },

  { id: 'calle-sin-salida', codigo: 'S-13', nombre: 'Calle sin salida', categoria: 'Indicación',
    descripcion: 'Señal rectangular azul con un rectángulo blanco en su interior y una barra roja transversal.',
    significado: 'Indica que la vía a la que se aproxima no tiene salida.',
    svg: svgRectangleIndicacion(`<rect x="25" y="25" width="50" height="50" fill="${BLANCO}"/>
<line x1="25" y1="75" x2="75" y2="25" stroke="${ROJO}" stroke-width="5" stroke-linecap="round"/>`) },

  { id: 'gasolinera', codigo: 'S-11', nombre: 'Gasolinera', categoria: 'Servicio',
    descripcion: 'Señal rectangular azul con un símbolo blanco de un surtidor de combustible.',
    significado: 'Indica la proximidad de una estación de servicio o gasolinera.',
    svg: svgRectangleServicio(`<rect x="35" y="30" width="30" height="35" rx="3" fill="${AZUL}"/>
<line x1="50" y1="65" x2="50" y2="80" stroke="${AZUL}" stroke-width="4" stroke-linecap="round"/>
<rect x="38" y="38" width="24" height="10" rx="2" fill="${BLANCO}"/>
<path d="M65,35 Q75,35 75,45 Q75,55 65,55" fill="none" stroke="${AZUL}" stroke-width="3"/>`) },

  { id: 'aparcamiento', codigo: 'S-25', nombre: 'Aparcamiento', categoria: 'Servicio',
    descripcion: 'Señal rectangular azul con una letra P mayúscula blanca.',
    significado: 'Indica la ubicación de un aparcamiento público.',
    svg: svgRectangleServicio(`<text x="50" y="62" font-family="Arial Black,sans-serif" font-size="36" font-weight="bold" fill="${AZUL}" text-anchor="middle">P</text>`) },

  { id: 'hospital', codigo: 'S-7', nombre: 'Hospital', categoria: 'Servicio',
    descripcion: 'Señal rectangular azul con una H mayúscula blanca y una cruz blanca.',
    significado: 'Indica la proximidad de un hospital o centro sanitario.',
    svg: svgRectangleServicio(`<text x="50" y="55" font-family="Arial Black,sans-serif" font-size="30" font-weight="bold" fill="${AZUL}" text-anchor="middle">H</text>
<line x1="38" y1="70" x2="62" y2="70" stroke="${ROJO}" stroke-width="3" stroke-linecap="round"/>
<line x1="50" y1="62" x2="50" y2="78" stroke="${ROJO}" stroke-width="3" stroke-linecap="round"/>`) },

  { id: 'taller', codigo: 'S-9', nombre: 'Taller de reparación', categoria: 'Servicio',
    descripcion: 'Señal rectangular azul con una llave inglesa blanca.',
    significado: 'Indica la proximidad de un taller de reparación de vehículos.',
    svg: svgRectangleServicio(`<line x1="35" y1="75" x2="70" y2="40" stroke="${AZUL}" stroke-width="4" stroke-linecap="round"/>
<circle cx="70" cy="40" r="10" fill="none" stroke="${AZUL}" stroke-width="4"/>
<line x1="35" y1="75" x2="25" y2="85" stroke="${AZUL}" stroke-width="3" stroke-linecap="round"/>`) },

  { id: 'telefono-socorro', codigo: 'S-10', nombre: 'Teléfono de socorro', categoria: 'Servicio',
    descripcion: 'Señal rectangular azul con un teléfono blanco.',
    significado: 'Indica la ubicación de un teléfono de emergencia o socorro.',
    svg: svgRectangleServicio(`<rect x="38" y="25" width="24" height="35" rx="12" fill="${AZUL}"/>
<line x1="50" y1="60" x2="50" y2="80" stroke="${AZUL}" stroke-width="4"/>
<rect x="42" y="35" width="16" height="12" rx="2" fill="${BLANCO}"/>`) },

  { id: 'camping', codigo: 'S-15', nombre: 'Camping', categoria: 'Servicio',
    descripcion: 'Señal rectangular azul con un símbolo de tienda de campaña blanca.',
    significado: 'Indica la ubicación de un camping o zona de acampada.',
    svg: svgRectangleServicio(`<polygon points="50,25 25,70 75,70" fill="none" stroke="${AZUL}" stroke-width="4" stroke-linejoin="round"/>
<line x1="50" y1="70" x2="50" y2="85" stroke="${AZUL}" stroke-width="3"/>`) },

  { id: 'area-descanso', codigo: 'S-14', nombre: 'Área de descanso', categoria: 'Servicio',
    descripcion: 'Señal rectangular azul con un banco y un árbol blancos.',
    significado: 'Indica la ubicación de un área de descanso o recreo.',
    svg: svgRectangleServicio(`<rect x="35" y="55" width="30" height="12" rx="2" fill="${AZUL}"/>
<line x1="60" y1="55" x2="60" y2="25" stroke="${AZUL}" stroke-width="4" stroke-linecap="round"/>
<circle cx="60" cy="22" r="10" fill="${AZUL}"/>
<line x1="60" y1="25" x2="50" y2="40" stroke="${AZUL}" stroke-width="3" stroke-linecap="round"/>`) },

  { id: 'taxi', codigo: 'S-24', nombre: 'Taxi', categoria: 'Servicio',
    descripcion: 'Señal rectangular azul con la palabra TAXI en blanco.',
    significado: 'Indica la ubicación de una parada de taxis.',
    svg: svgRectangleServicio(`<text x="50" y="60" font-family="Arial Black,sans-serif" font-size="22" font-weight="bold" fill="${AZUL}" text-anchor="middle">TAXI</text>`) },

  { id: 'calle-residencial', codigo: 'S-29', nombre: 'Calle residencial', categoria: 'Indicación',
    descripcion: 'Señal rectangular azul con una casa, un niño y un balón blancos.',
    significado: 'Indica una zona de circulación residencial donde los peatones tienen prioridad y la velocidad máxima es de 20 km/h.',
    svg: svgRectangleIndicacion(`<rect x="30" y="25" width="25" height="30" rx="2" fill="${BLANCO}"/>
<polygon points="30,25 42,15 55,25" fill="${BLANCO}"/>
<circle cx="50" cy="55" r="10" fill="${BLANCO}"/>
<line x1="50" y1="55" x2="50" y2="72" stroke="${BLANCO}" stroke-width="3"/>
<line x1="50" y1="72" x2="42" y2="85" stroke="${BLANCO}" stroke-width="3"/>
<line x1="50" y1="72" x2="58" y2="85" stroke="${BLANCO}" stroke-width="3"/>
<circle cx="70" cy="55" r="6" fill="${BLANCO}"/>`) },

  { id: 'zona-peatonal', codigo: 'S-30', nombre: 'Zona peatonal', categoria: 'Indicación',
    descripcion: 'Señal rectangular azul con un peatón y un niño blancos.',
    significado: 'Indica una zona peatonal de circulación prohibida para vehículos.',
    svg: svgRectangleIndicacion(`<circle cx="42" cy="30" r="8" fill="${BLANCO}"/>
<line x1="42" y1="38" x2="42" y2="58" stroke="${BLANCO}" stroke-width="4"/>
<line x1="42" y1="58" x2="35" y2="80" stroke="${BLANCO}" stroke-width="4"/>
<line x1="42" y1="58" x2="49" y2="80" stroke="${BLANCO}" stroke-width="4"/>
<line x1="42" y1="44" x2="32" y2="52" stroke="${BLANCO}" stroke-width="3"/>
<line x1="42" y1="44" x2="52" y2="52" stroke="${BLANCO}" stroke-width="3"/>
<circle cx="68" cy="30" r="8" fill="${BLANCO}"/>
<line x1="68" y1="38" x2="68" y2="50" stroke="${BLANCO}" stroke-width="4"/>
<line x1="68" y1="50" x2="60" y2="72" stroke="${BLANCO}" stroke-width="4"/>
<line x1="68" y1="50" x2="76" y2="72" stroke="${BLANCO}" stroke-width="4"/>
<line x1="68" y1="44" x2="58" y2="48" stroke="${BLANCO}" stroke-width="3"/>
<line x1="68" y1="44" x2="78" y2="48" stroke="${BLANCO}" stroke-width="3"/>`) },

  { id: 'carril-bici', codigo: 'S-32', nombre: 'Carril bici', categoria: 'Indicación',
    descripcion: 'Señal rectangular azul con una bicicleta blanca.',
    significado: 'Indica un carril reservado para bicicletas.',
    svg: svgRectangleIndicacion(CICLISTA) },

  { id: 'inicio-autopista', codigo: 'S-4', nombre: 'Vía reservada para turismos', categoria: 'Indicación',
    descripcion: 'Señal rectangular azul con un coche blanco visto desde arriba.',
    significado: 'Indica una vía reservada exclusivamente para turismos y motocicletas.',
    svg: svgRectangleIndicacion(`<ellipse cx="50" cy="50" rx="25" ry="15" fill="${BLANCO}"/>
<rect x="30" y="38" width="40" height="12" rx="4" fill="${BLANCO}"/>
<rect x="35" y="45" width="30" height="8" rx="3" fill="${BLANCO}"/>`) },
];

// Generate SVG files and output the data
let allData = [];

signs.forEach(s => {
  const filename = s.id + '.svg';
  const filepath = path.join(SVGS_DIR, filename);
  fs.writeFileSync(filepath, s.svg);
  allData.push({
    id: s.id,
    codigo: s.codigo,
    nombre: s.nombre,
    categoria: s.categoria,
    descripcion: s.descripcion,
    significado: s.significado,
    imagen: `/senales/${filename}`
  });
});

console.log(`✅ ${signs.length} SVG files generated in ${SVGS_DIR}`);
console.log('\n--- Data array for senales.ts ---\n');
console.log(JSON.stringify(allData, null, 2));
