import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { getDB } from '../db/database';
import { generarToken, verificarToken, AuthRequest } from '../middleware/auth';
import { limitar } from '../middleware/rate-limit';
import { RATE_LIMIT } from '../config';
import type { UsuarioDB } from '../db/types';

const router = Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const limiteLogin = limitar(RATE_LIMIT.VENTANA_LOGIN_MS, RATE_LIMIT.MAX_INTENTOS_LOGIN);

router.post('/register', limiteLogin, async (req: AuthRequest, res: Response) => {
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const nombre = typeof req.body.nombre === 'string' ? req.body.nombre.trim() : '';
  const password = typeof req.body.password === 'string' ? req.body.password : '';

  if (!email || !nombre || !password) {
    res.status(400).json({ datos: null, error: 'Email, nombre y password son requeridos' });
    return;
  }

  if (!EMAIL_REGEX.test(email)) {
    res.status(400).json({ datos: null, error: 'El email no tiene un formato válido' });
    return;
  }

  if (email.length > 254) {
    res.status(400).json({ datos: null, error: 'El email no puede superar 254 caracteres' });
    return;
  }

  if (nombre.length > 80) {
    res.status(400).json({ datos: null, error: 'El nombre no puede superar 80 caracteres' });
    return;
  }

  if (password.length < 8) {
    res.status(400).json({ datos: null, error: 'La password debe tener al menos 8 caracteres' });
    return;
  }

  const db = getDB();
  const existe = db.prepare('SELECT id FROM usuarios WHERE email = ?').get(email);
  if (existe) {
    res.status(409).json({ datos: null, error: 'El email ya está registrado' });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const result = db.prepare('INSERT INTO usuarios (email, nombre, password_hash) VALUES (?, ?, ?)').run(email, nombre, passwordHash);
  const token = generarToken(result.lastInsertRowid as number);

  res.status(201).json({
    datos: {
      token,
      usuario: { id: result.lastInsertRowid, email, nombre }
    },
    error: null
  });
});

router.post('/login', limiteLogin, async (req: AuthRequest, res: Response) => {
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = typeof req.body.password === 'string' ? req.body.password : '';

  if (!email || !password) {
    res.status(400).json({ datos: null, error: 'Email y password son requeridos' });
    return;
  }

  const db = getDB();
  const usuario = db.prepare('SELECT id, email, nombre, password_hash FROM usuarios WHERE email = ?').get(email) as UsuarioDB | undefined;
  if (!usuario) {
    res.status(401).json({ datos: null, error: 'Credenciales inválidas' });
    return;
  }

  const coincide = await bcrypt.compare(password, usuario.password_hash);
  if (!coincide) {
    res.status(401).json({ datos: null, error: 'Credenciales inválidas' });
    return;
  }

  const token = generarToken(usuario.id);
  res.json({
    datos: {
      token,
      usuario: { id: usuario.id, email: usuario.email, nombre: usuario.nombre }
    },
    error: null
  });
});

router.get('/me', verificarToken, (req: AuthRequest, res: Response) => {
  const db = getDB();
  const usuario = db.prepare('SELECT id, email, nombre, creado_en FROM usuarios WHERE id = ?').get(req.usuarioId) as Omit<UsuarioDB, 'password_hash'> | undefined;
  if (!usuario) {
    res.status(404).json({ datos: null, error: 'Usuario no encontrado' });
    return;
  }
  res.json({ datos: usuario, error: null });
});

export default router;
