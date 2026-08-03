import { Router, Request, Response } from 'express';
import type Database from 'better-sqlite3';
import { getDB } from '../db/database';
import { verificarToken, AuthRequest } from '../middleware/auth';
import { LIMITES_PREGUNTAS } from '../config';
import type { PreguntaConTemaDB } from '../db/types';

const router = Router();

const SELECT_PREGUNTA = `
  SELECT p.id, p.texto, p.opciones, p.tema_id, p.dificultad,
         p.referencia_manual, p.explicacion, p.imagen, t.nombre as tema_nombre, t.slug as tema_slug
  FROM preguntas p JOIN temas t ON p.tema_id = t.id
`;

/** Respuesta API sin la respuesta correcta (seguridad) */
interface PreguntaSegura {
  id: number;
  texto: string;
  opciones: string[];
  tema_id: number;
  dificultad: number;
  referencia_manual: string | null;
  explicacion: string | null;
  imagen: string | null;
  tema_nombre: string;
  tema_slug: string;
  indice_correcta: -1; // Siempre oculto
}

// Las respuestas correctas nunca se exponen fuera de la corrección de un examen
function ocultarCorrecta(preguntas: PreguntaConTemaDB[]): PreguntaSegura[] {
  return preguntas.map(p => ({
    ...p,
    opciones: JSON.parse(p.opciones),
    indice_correcta: -1 as const,
  }));
}

/** Validar y normalizar número de preguntas */
function validarNumPreguntas(valor: string | undefined, max: number): number {
  const n = parseInt(valor || '') || LIMITES_PREGUNTAS.DEFAULT;
  return Math.min(Math.max(n, LIMITES_PREGUNTAS.MIN), max);
}

/**
 * Selecciona preguntas ponderando por debilidad del usuario en cada tema:
 * más fallos relativos y racha de fallos reciente => mayor peso => más probable
 * que salga esa pregunta. Sin progreso previo, todas pesan 1 (aleatorio puro).
 * Se usa en /adaptativas y en la creación de exámenes con modalidad 'adaptativo'.
 */
export function seleccionarAdaptativas(db: Database.Database, usuarioId: number, n: number): { id: number }[] {
  const preguntas = db.prepare(`
    SELECT p.id,
           (CASE
             WHEN COALESCE(put.intentadas, 0) > 0
               THEN (COALESCE(put.intentadas, 0) - COALESCE(put.acertadas, 0)) * 1.0 / COALESCE(put.intentadas, 0) * 4
             ELSE 0
           END + COALESCE(put.racha_fallos, 0) * 2 + 1) as peso
    FROM preguntas p
    LEFT JOIN progreso_usuario_tema put ON put.tema_id = p.tema_id AND put.usuario_id = ?
  `).all(usuarioId) as { id: number; peso: number }[];

  // Muestreo aleatorio ponderado sin reemplazo (variedad + foco en lo débil)
  const seleccionadas: { id: number }[] = [];
  const pool = [...preguntas];
  while (seleccionadas.length < n && pool.length > 0) {
    const pesoTotal = pool.reduce((s, p) => s + p.peso, 0);
    let r = Math.random() * pesoTotal;
    let idx = pool.length - 1;
    for (let i = 0; i < pool.length; i++) {
      r -= pool[i].peso;
      if (r <= 0) {
        idx = i;
        break;
      }
    }
    seleccionadas.push({ id: pool[idx].id });
    pool.splice(idx, 1);
  }
  return seleccionadas;
}

router.get('/', (req: Request, res: Response) => {
  const db = getDB();
  const temaSlug = req.query.tema as string;
  const dificultad = req.query.dificultad as string;

  let sql = `${SELECT_PREGUNTA} WHERE 1=1`;
  const params: (string | number)[] = [];

  if (temaSlug) {
    sql += ' AND t.slug = ?';
    params.push(temaSlug);
  }
  if (dificultad) {
    sql += ' AND p.dificultad = ?';
    params.push(parseInt(dificultad));
  }

  sql += ' ORDER BY t.orden, p.id';
  const preguntas = db.prepare(sql).all(...params) as PreguntaConTemaDB[];
  res.json({ datos: ocultarCorrecta(preguntas), error: null });
});

router.get('/aleatorias', (req: Request, res: Response) => {
  const db = getDB();
  const n = validarNumPreguntas(req.query.n as string, LIMITES_PREGUNTAS.MAX_ALEATORIAS);

  const preguntas = db.prepare(`
    ${SELECT_PREGUNTA}
    ORDER BY RANDOM() LIMIT ?
  `).all(n) as PreguntaConTemaDB[];

  res.json({ datos: ocultarCorrecta(preguntas), error: null });
});

router.get('/adaptativas', verificarToken, (req: AuthRequest, res: Response) => {
  const db = getDB();
  const n = validarNumPreguntas(req.query.n as string, LIMITES_PREGUNTAS.MAX_ALEATORIAS);

  const ids = seleccionarAdaptativas(db, req.usuarioId as number, n);
  const placeholders = ids.map(() => '?').join(',');
  const preguntas = placeholders
    ? db.prepare(`${SELECT_PREGUNTA} WHERE p.id IN (${placeholders})`).all(...ids.map(i => i.id)) as PreguntaConTemaDB[]
    : [];

  res.json({ datos: ocultarCorrecta(preguntas), error: null });
});

router.get('/:id', (req: Request, res: Response) => {
  const db = getDB();
  const pregunta = db.prepare(`
    ${SELECT_PREGUNTA}
    WHERE p.id = ?
  `).get(req.params.id) as PreguntaConTemaDB | undefined;

  if (!pregunta) {
    res.status(404).json({ datos: null, error: 'Pregunta no encontrada' });
    return;
  }

  res.json({ datos: ocultarCorrecta([pregunta])[0], error: null });
});

export default router;
