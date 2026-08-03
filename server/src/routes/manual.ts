import { Router, Request, Response } from 'express';
import { getDB } from '../db/database';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  const db = getDB();
  const temas = db.prepare('SELECT slug, nombre, descripcion, orden FROM temas ORDER BY orden').all();
  res.json({ datos: temas, error: null });
});

router.get('/:slug', (req: Request, res: Response) => {
  const db = getDB();
  const contenido = db.prepare(
    'SELECT * FROM contenido_manual WHERE tema_slug = ? ORDER BY orden'
  ).all(req.params.slug);

  if (contenido.length === 0) {
    res.status(404).json({ datos: null, error: 'Tema no encontrado' });
    return;
  }

  const tema = db.prepare('SELECT nombre, slug, descripcion FROM temas WHERE slug = ?').get(req.params.slug) as
    { nombre: string; slug: string; descripcion: string | null } | undefined;

  res.json({
    datos: {
      tema: tema?.nombre || req.params.slug,
      slug: req.params.slug,
      secciones: contenido
    },
    error: null
  });
});

export default router;
