import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import fs from 'fs';
import { getDB } from './db/database';
import { ejecutarSeed } from './db/seed';
import { seedPreguntasExtra } from './db/seed-preguntas-extra';
import { seedPreguntasReales } from './db/seed-preguntas-reales';
import { seedPreguntasNuevas } from './db/seed-preguntas-nuevas';
import { seedPreguntasFinal } from './db/seed-preguntas-final';
import { seedManual } from './db/seed-manual';
import authRoutes from './routes/auth';
import preguntasRoutes from './routes/preguntas';
import examenesRoutes from './routes/examenes';
import progresoRoutes from './routes/progreso';
import manualRoutes from './routes/manual';
import senalesRoutes from './routes/senales';

interface HttpError extends Error {
  status?: number;
}

const app = express();
const PORT = process.env.PORT || 3001;

// Headers de seguridad (CSP, X-Content-Type-Options, etc.)
app.use(helmet());

// CORS: permitir solo origins configurados
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
const allowedOrigins = CORS_ORIGIN.split(',').map(o => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Permitir requests sin origin (CLI, Postman, same-origin en producción)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      const err = new Error(`Origen no permitido: ${origin}`) as HttpError;
      err.status = 403;
      callback(err);
    }
  },
  credentials: true,
}));
app.use(express.json());

// Health check para el proveedor de hosting y monitoreo
app.get('/health', (_req: Request, res: Response) => {
  try {
    getDB().prepare('SELECT 1').get();
    res.status(200).json({ datos: { estado: 'ok', baseDeDatos: true }, error: null });
  } catch (err) {
    console.error('Health check fallido:', err);
    res.status(500).json({ datos: null, error: 'Base de datos no disponible' });
  }
});

// Inicializar base de datos
getDB();
ejecutarSeed();
seedPreguntasExtra();
seedPreguntasReales();
seedPreguntasNuevas();
seedPreguntasFinal();
seedManual();

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/preguntas', preguntasRoutes);
app.use('/api/examenes', examenesRoutes);
app.use('/api/progreso', progresoRoutes);
app.use('/api/manual', manualRoutes);
// Serve señal files with correct MIME type detection
// Some downloaded files are PNGs saved with .svg extension
app.use('/senales', (req: Request, res: Response, next: NextFunction) => {
  if (req.path.includes('..') || req.path.includes('%2e') || req.path.includes('%2E')) {
    res.status(403).json({ datos: null, error: 'Acceso denegado' });
    return;
  }
  const dirSenales = path.resolve(__dirname, '..', 'public', 'senales');
  const rutaRelativa = req.path.replace(/^\/+/, '');
  const filePath = path.resolve(dirSenales, rutaRelativa);
  if (filePath !== dirSenales && !filePath.startsWith(dirSenales + path.sep)) {
    res.status(403).json({ datos: null, error: 'Acceso denegado' });
    return;
  }
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const fd = fs.openSync(filePath, 'r');
    const buffer = Buffer.alloc(8);
    fs.readSync(fd, buffer, 0, 8, 0);
    fs.closeSync(fd);
    // Check if file is actually a PNG (magic bytes: 89 50 4E 47)
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
      res.type('image/png');
      res.sendFile(filePath);
      return;
    }
  }
  next();
});
app.use('/senales', express.static(path.join(__dirname, '..', 'public', 'senales')));
app.use('/api/senales', senalesRoutes);

// Servir frontend en producción
const clientPath = path.join(__dirname, '..', '..', 'client', 'dist');
app.use(express.static(clientPath));

// 404 JSON para rutas /api desconocidas (antes del catch-all de la SPA)
app.use('/api', (_req, res) => {
  res.status(404).json({ datos: null, error: 'Ruta no encontrada' });
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

// Error handler JSON: cualquier error termina aquí con formato { datos, error }
app.use((err: HttpError, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status ?? 500;
  if (status >= 500) console.error(err);
  res.status(status).json({
    datos: null,
    error: status >= 500 ? 'Error interno del servidor' : err.message,
  });
});

// Solo arranca el servidor cuando se ejecuta directamente (no al importarlo en tests)
const esEjecucionDirecta = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename);
if (esEjecucionDirecta) {
  const server = app.listen(PORT, () => {
    console.log(`Autoescuela API corriendo en http://localhost:${PORT}`);
  });

  // Cierre limpio: checkpoint del WAL (evita perder datos si se copia solo el .db) y cierre de la BD
  function cerrarGracefulmente(): void {
    try {
      getDB().pragma('wal_checkpoint(TRUNCATE)');
      getDB().close();
    } catch {
      // si la BD ya estaba cerrada o falló el checkpoint, ignorar
    }
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 2000).unref();
  }
  process.on('SIGINT', cerrarGracefulmente);
  process.on('SIGTERM', cerrarGracefulmente);
}

export { app };
