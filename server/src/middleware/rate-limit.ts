import { Request, Response, NextFunction } from 'express';

interface Contador {
  n: number;
  reset: number;
}

// Limitador en memoria por IP (suficiente para una app de estudio;
// si se despliega en multi-instancia, usar un store compartido)
const contadores = new Map<string, Contador>();

export function limitar(ventanaMs: number, max: number) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip || req.socket.remoteAddress || 'desconocida';
    const ahora = Date.now();
    let c = contadores.get(ip);

    if (!c || c.reset < ahora) {
      c = { n: 0, reset: ahora + ventanaMs };
      contadores.set(ip, c);
    }

    c.n += 1;
    if (c.n > max) {
      res.status(429).json({ datos: null, error: 'Demasiados intentos. Inténtalo de nuevo en unos minutos.' });
      return;
    }

    next();
  };
}

// Limpieza periódica de entradas vencidas para no acumular memoria
setInterval(() => {
  const ahora = Date.now();
  for (const [ip, c] of contadores) {
    if (c.reset < ahora) contadores.delete(ip);
  }
}, 60 * 60 * 1000).unref();
