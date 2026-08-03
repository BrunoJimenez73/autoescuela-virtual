import { Router, Response } from 'express';
import type Database from 'better-sqlite3';
import { getDB } from '../db/database';
import { verificarToken, AuthRequest } from '../middleware/auth';
import { seleccionarAdaptativas } from './preguntas';
import { LIMITES_PREGUNTAS, EXAMENES } from '../config';
import type { ExamenDB, PreguntaConTemaDB, RespuestaConPreguntaDB } from '../db/types';

const router = Router();

/** Validar y normalizar número de preguntas para exámenes */
function validarNumPreguntasExamen(valor: unknown): number {
  const n = parseInt(String(valor)) || LIMITES_PREGUNTAS.DEFAULT;
  return Math.min(Math.max(n, LIMITES_PREGUNTAS.MIN), LIMITES_PREGUNTAS.MAX_POR_EXAMEN);
}

/** Guardar una respuesta validando pertenencia al examen y rango de opción */
function guardarRespuesta(
  db: Database.Database,
  examenId: string,
  usuarioId: number,
  preguntaId: unknown,
  opcionElegida: unknown
): { error?: string; status?: number; correcta?: boolean } {
  const respuesta = db.prepare(`
    SELECT r.id, p.indice_correcta, p.opciones
    FROM respuestas r
    JOIN preguntas p ON r.pregunta_id = p.id
    WHERE r.examen_id = ? AND r.pregunta_id = ? AND r.examen_id IN (
      SELECT id FROM examenes WHERE usuario_id = ? AND completado = 0
    )
  `).get(examenId, preguntaId, usuarioId) as { id: number; indice_correcta: number; opciones: string } | undefined;

  if (!respuesta) {
    return { status: 404, error: 'Respuesta no encontrada o examen ya completado' };
  }

  const numOpciones = (JSON.parse(respuesta.opciones) as string[]).length;
  if (!Number.isInteger(opcionElegida) || (opcionElegida as number) < 0 || (opcionElegida as number) >= numOpciones) {
    return { status: 400, error: 'Opción elegida inválida' };
  }

  const correcta = respuesta.indice_correcta === opcionElegida ? 1 : 0;
  db.prepare('UPDATE respuestas SET opcion_elegida = ?, correcta = ? WHERE id = ?')
    .run(opcionElegida, correcta, respuesta.id);

  return { correcta: correcta === 1 };
}

router.post('/', verificarToken, (req: AuthRequest, res: Response) => {
  const { total_preguntas, modalidad } = req.body;
  const n = validarNumPreguntasExamen(total_preguntas);
  const db = getDB();

  const esAdaptativo = modalidad === 'adaptativo';
  const preguntas = esAdaptativo
    ? seleccionarAdaptativas(db, req.usuarioId as number, n)
    : db.prepare('SELECT id FROM preguntas ORDER BY RANDOM() LIMIT ?').all(n) as { id: number }[];

  if (preguntas.length === 0) {
    res.status(400).json({ datos: null, error: 'No hay preguntas disponibles' });
    return;
  }

  const result = db.prepare(
    'INSERT INTO examenes (usuario_id, total_preguntas, duracion_seg) VALUES (?, ?, 0)'
  ).run(req.usuarioId, preguntas.length);

  const examenId = result.lastInsertRowid;
  const insertRespuesta = db.prepare(
    'INSERT INTO respuestas (examen_id, pregunta_id) VALUES (?, ?)'
  );

  for (const p of preguntas) {
    insertRespuesta.run(examenId, p.id);
  }

  res.status(201).json({ datos: { id: examenId, total_preguntas: preguntas.length }, error: null });
});

router.post('/:id/responder', verificarToken, (req: AuthRequest, res: Response) => {
  const result = guardarRespuesta(
    getDB(), req.params.id, req.usuarioId as number,
    req.body.pregunta_id, req.body.opcion_elegida
  );

  if (result.error) {
    res.status(result.status as number).json({ datos: null, error: result.error });
    return;
  }

  res.json({ datos: { correcta: result.correcta as boolean }, error: null });
});

router.post('/:id/corregir', verificarToken, (req: AuthRequest, res: Response) => {
  const db = getDB();
  const examen = db.prepare(
    'SELECT id, usuario_id, total_preguntas FROM examenes WHERE id = ? AND usuario_id = ? AND completado = 0'
  ).get(req.params.id, req.usuarioId) as { id: number; usuario_id: number; total_preguntas: number } | undefined;

  if (!examen) {
    res.status(404).json({ datos: null, error: 'Examen no encontrado o ya corregido' });
    return;
  }

  // Respuestas opcionales en lote (el client puede enviarlas todas de una vez)
  if (Array.isArray(req.body.respuestas)) {
    for (const r of req.body.respuestas) {
      const result = guardarRespuesta(
        db, req.params.id, req.usuarioId as number,
        r?.pregunta_id, r?.opcion_elegida
      );
      if (result.error) {
        res.status(result.status as number).json({ datos: null, error: result.error });
        return;
      }
    }
  }

  const respuestas = db.prepare(`
    SELECT r.pregunta_id, r.opcion_elegida, r.correcta, p.indice_correcta, p.texto, p.opciones,
           p.explicacion, p.referencia_manual, p.imagen, p.tema_id, t.nombre as tema_nombre, t.slug as tema_slug
    FROM respuestas r
    JOIN preguntas p ON r.pregunta_id = p.id
    JOIN temas t ON p.tema_id = t.id
    WHERE r.examen_id = ?
  `).all(examen.id) as (RespuestaConPreguntaDB & { tema_id: number })[];

  const aciertos = respuestas.filter(r => r.correcta).length;
  const duracionRaw = req.body.duracion_seg;
  const duracion = Number.isFinite(duracionRaw) && duracionRaw >= 0
    ? Math.min(Math.floor(duracionRaw), EXAMENES.DURACION_MAX_SEG)
    : 0;

  db.prepare('UPDATE examenes SET aciertos = ?, duracion_seg = ?, completado = 1 WHERE id = ?')
    .run(aciertos, duracion, examen.id);

  // Actualizar progreso por tema
  const upsertProgreso = db.prepare(`
    INSERT INTO progreso_usuario_tema (usuario_id, tema_id, intentadas, acertadas, racha_fallos, ultimo_fallo)
    VALUES (?, ?, 1, ?, ?, ?)
    ON CONFLICT(usuario_id, tema_id) DO UPDATE SET
      intentadas = intentadas + 1,
      acertadas = acertadas + ?,
      racha_fallos = CASE WHEN ? = 0 THEN racha_fallos + 1 ELSE 0 END,
      ultimo_fallo = CASE WHEN ? = 0 THEN datetime('now') ELSE ultimo_fallo END
  `);

  for (const r of respuestas) {
    const acerto = r.correcta ? 1 : 0;
    upsertProgreso.run(
      req.usuarioId, r.tema_id,
      acerto,                                   // acertadas (INSERT)
      acerto ? 0 : 1,                           // racha_fallos (INSERT, NOT NULL)
      acerto ? null : new Date().toISOString(), // ultimo_fallo (INSERT)
      acerto,                                   // acertadas = acertadas + ? (UPDATE)
      acerto,                                   // si acertó (?=1) => racha se reinicia a 0
      acerto                                    // si acertó (?=1) => ultimo_fallo se mantiene
    );
  }

  const result = respuestas.map(r => ({
    pregunta_id: r.pregunta_id,
    texto: r.texto,
    opciones: JSON.parse(r.opciones),
    indice_correcta: r.indice_correcta,
    opcion_elegida: r.opcion_elegida,
    correcta: r.correcta === 1,
    explicacion: r.explicacion,
    referencia_manual: r.referencia_manual,
    imagen: r.imagen,
    tema: r.tema_nombre,
  }));

  res.json({
    datos: {
      id: examen.id,
      aciertos,
      total: examen.total_preguntas,
      nota: Math.round((aciertos / examen.total_preguntas) * 100),
      duracion_seg: duracion,
      respuestas: result,
    },
    error: null,
  });
});

router.get('/', verificarToken, (req: AuthRequest, res: Response) => {
  const db = getDB();
  const examenes = db.prepare(`
    SELECT id, fecha, aciertos, total_preguntas, duracion_seg, completado
    FROM examenes WHERE usuario_id = ?
    ORDER BY fecha DESC LIMIT ?
  `).all(req.usuarioId, EXAMENES.MAX_HISTORIAL);

  res.json({ datos: examenes, error: null });
});

router.get('/:id/preguntas', verificarToken, (req: AuthRequest, res: Response) => {
  const db = getDB();
  const examen = db.prepare(`
    SELECT id, usuario_id FROM examenes WHERE id = ? AND usuario_id = ? AND completado = 0
  `).get(req.params.id, req.usuarioId) as { id: number; usuario_id: number } | undefined;

  if (!examen) {
    res.status(404).json({ datos: null, error: 'Examen no encontrado o ya completado' });
    return;
  }

  const preguntas = db.prepare(`
    SELECT p.id, p.texto, p.opciones, p.tema_id, p.dificultad,
           p.referencia_manual, p.explicacion, p.imagen, t.nombre as tema_nombre, t.slug as tema_slug
    FROM respuestas r
    JOIN preguntas p ON r.pregunta_id = p.id
    JOIN temas t ON p.tema_id = t.id
    WHERE r.examen_id = ?
  `).all(examen.id) as PreguntaConTemaDB[];

  const result = preguntas.map(p => ({
    ...p,
    opciones: JSON.parse(p.opciones),
    indice_correcta: -1,
  }));

  res.json({ datos: result, error: null });
});

router.get('/:id', verificarToken, (req: AuthRequest, res: Response) => {
  const db = getDB();
  const examen = db.prepare(`
    SELECT e.* FROM examenes e WHERE e.id = ? AND e.usuario_id = ?
  `).get(req.params.id, req.usuarioId) as ExamenDB | undefined;

  if (!examen) {
    res.status(404).json({ datos: null, error: 'Examen no encontrado' });
    return;
  }

  const respuestas = db.prepare(`
    SELECT r.pregunta_id, r.opcion_elegida, r.correcta, p.texto, p.opciones,
           p.indice_correcta, p.explicacion, p.referencia_manual, p.imagen
    FROM respuestas r JOIN preguntas p ON r.pregunta_id = p.id
    WHERE r.examen_id = ?
  `).all(examen.id) as RespuestaConPreguntaDB[];

  const examenConRespuestas = {
    ...examen,
    respuestas: respuestas.map(r => ({
      ...r,
      opciones: JSON.parse(r.opciones),
    })),
  };

  res.json({ datos: examenConRespuestas, error: null });
});

export default router;
