import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// En producción el secret DEBE estar definido (lanza error si falta)
const esProduccion = process.env.NODE_ENV === 'production';
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  if (esProduccion) {
    throw new Error(
      'FATAL: JWT_SECRET no está definido en variables de entorno. ' +
      'Esto es un riesgo de seguridad. Define JWT_SECRET en tu .env'
    );
  }
  console.warn('⚠️  JWT_SECRET no definido. Usando valor por defecto (solo para desarrollo)');
}

// Fallback solo en desarrollo; en producción ya habría lanzado error
const SECRET_FINAL = JWT_SECRET || 'autoescuela_secret_dev_2026';

export interface AuthRequest extends Request {
  usuarioId?: number;
}

export function generarToken(usuarioId: number): string {
  return jwt.sign({ usuarioId }, SECRET_FINAL, { expiresIn: '7d' });
}

export function verificarToken(req: AuthRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ datos: null, error: 'Token requerido' });
    return;
  }

  const token = header.slice(7);
  try {
    const decoded = jwt.verify(token, SECRET_FINAL) as { usuarioId: number };
    req.usuarioId = decoded.usuarioId;
    next();
  } catch {
    res.status(401).json({ datos: null, error: 'Token inválido o expirado' });
  }
}
