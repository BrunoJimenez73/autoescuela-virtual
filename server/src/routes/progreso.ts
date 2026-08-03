import { Router, Response } from 'express';
import { getDB } from '../db/database';
import { verificarToken, AuthRequest } from '../middleware/auth';
import { EXAMENES, PROGRESO } from '../config';
import type { ProgresoConTemaDB } from '../db/types';

const router = Router();

interface EstadisticasGenerales {
  total: number;
  aciertos: number;
  intentadas: number;
}

interface ExamenReciente {
  fecha: string;
  aciertos: number;
  total_preguntas: number;
}

router.get('/', verificarToken, (req: AuthRequest, res: Response) => {
  const db = getDB();

  const total = db.prepare(`
    SELECT COUNT(*) as total, COALESCE(SUM(aciertos), 0) as aciertos,
           COALESCE(SUM(total_preguntas), 0) as intentadas
    FROM examenes WHERE usuario_id = ? AND completado = 1
  `).get(req.usuarioId) as EstadisticasGenerales;

  const examenesRecientes = db.prepare(`
    SELECT fecha, aciertos, total_preguntas
    FROM examenes WHERE usuario_id = ? AND completado = 1
    ORDER BY fecha DESC LIMIT ?
  `).all(req.usuarioId, EXAMENES.MAX_EXAMENES_RECIENTES) as ExamenReciente[];

  const progresoTemas = db.prepare(`
    SELECT t.nombre, t.slug, put.intentadas, put.acertadas, put.racha_fallos
    FROM progreso_usuario_tema put
    JOIN temas t ON put.tema_id = t.id
    WHERE put.usuario_id = ?
    ORDER BY (put.intentadas - put.acertadas) DESC
  `).all(req.usuarioId) as ProgresoConTemaDB[];

  res.json({
    datos: {
      examenesCompletados: total.total,
      totalAciertos: total.aciertos,
      totalIntentadas: total.intentadas,
      porcentajeGlobal: total.intentadas > 0
        ? Math.round((total.aciertos / total.intentadas) * 100)
        : 0,
      examenesRecientes,
      progresoTemas,
    },
    error: null,
  });
});

router.get('/temas', verificarToken, (req: AuthRequest, res: Response) => {
  const db = getDB();

  const temas = db.prepare(`
    SELECT t.id, t.nombre, t.slug,
           COALESCE(put.intentadas, 0) as intentadas,
           COALESCE(put.acertadas, 0) as acertadas,
           put.racha_fallos,
           CASE WHEN COALESCE(put.intentadas, 0) > 0
             THEN ROUND(CAST(COALESCE(put.acertadas, 0) AS REAL) / put.intentadas * 100)
             ELSE NULL
           END as porcentaje_acierto
    FROM temas t
    LEFT JOIN progreso_usuario_tema put ON put.tema_id = t.id AND put.usuario_id = ?
    ORDER BY t.orden
  `).all(req.usuarioId);

  res.json({ datos: temas, error: null });
});

router.get('/debiles', verificarToken, (req: AuthRequest, res: Response) => {
  const db = getDB();

  const debiles = db.prepare(`
    SELECT t.nombre, t.slug, put.intentadas, put.acertadas, put.racha_fallos,
           (put.intentadas - put.acertadas) as fallos
    FROM progreso_usuario_tema put
    JOIN temas t ON put.tema_id = t.id
    WHERE put.usuario_id = ? AND (put.intentadas - put.acertadas) > 0
    ORDER BY fallos DESC, put.racha_fallos DESC
    LIMIT ?
  `).all(req.usuarioId, PROGRESO.MAX_DEBILES);

  res.json({ datos: debiles, error: null });
});

export default router;
