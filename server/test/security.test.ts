// ===========================================
// Tests de seguridad (JWT_SECRET, CORS)
// ===========================================
import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import request from 'supertest';
import fs from 'fs';
import os from 'os';
import path from 'path';

describe('JWT_SECRET - Validación en producción', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('debería lanzar error si JWT_SECRET no está en producción', async () => {
    // Simular entorno de producción sin JWT_SECRET
    process.env.NODE_ENV = 'production';
    process.env.DB_PATH = path.join(os.tmpdir(), `test-jwt-${Date.now()}.db`);
    delete process.env.JWT_SECRET;

    // Intentar importar el módulo de auth debería lanzar error
    await expect(async () => {
      await import('../src/middleware/auth');
    }).rejects.toThrow('FATAL: JWT_SECRET no está definido');
  });

  it('debería funcionar con JWT_SECRET definido en producción', async () => {
    process.env.NODE_ENV = 'production';
    process.env.JWT_SECRET = 'secreto-seguro-para-produccion';
    process.env.DB_PATH = path.join(os.tmpdir(), `test-jwt-ok-${Date.now()}.db`);

    // No debería lanzar error
    const auth = await import('../src/middleware/auth');
    expect(auth.generarToken).toBeDefined();
    expect(auth.verificarToken).toBeDefined();
  });

  it('debería funcionar sin JWT_SECRET en desarrollo (con warning)', async () => {
    process.env.NODE_ENV = 'development';
    process.env.DB_PATH = path.join(os.tmpdir(), `test-jwt-dev-${Date.now()}.db`);
    delete process.env.JWT_SECRET;

    // No debería lanzar error en desarrollo
    const auth = await import('../src/middleware/auth');
    expect(auth.generarToken).toBeDefined();
  });
});

describe('CORS - Configuración', () => {
  const dirTest = fs.mkdtempSync(path.join(os.tmpdir(), 'autoescuela-cors-test-'));
  let app: any;

  beforeAll(async () => {
    process.env.DB_PATH = path.join(dirTest, 'test.db');
    process.env.CORS_ORIGIN = 'http://localhost:5173,https://example.com';

    const modulo = await import('../src/index');
    app = modulo.app;
  });

  afterAll(() => {
    try {
      fs.rmSync(dirTest, { recursive: true, force: true });
    } catch {
      // ignorar
    }
  });

  it('debería permitir requests de origins permitidos', async () => {
    const res = await request(app)
      .get('/api/manual')
      .set('Origin', 'http://localhost:5173');

    expect(res.status).toBe(200);
    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:5173');
  });

  it('debería permitir segundo origin configurado', async () => {
    const res = await request(app)
      .get('/api/manual')
      .set('Origin', 'https://example.com');

    expect(res.status).toBe(200);
    expect(res.headers['access-control-allow-origin']).toBe('https://example.com');
  });

  it('debería bloquear origins no permitidos', async () => {
    const res = await request(app)
      .get('/api/manual')
      .set('Origin', 'https://malicious-site.com');

    // CORS rejection puede devolver 200 pero sin header, o error
    // La implementación actual lanza error que Express convierte a 500 o CORS lo bloquea
    expect(res.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('debería permitir requests sin origin (CLI, same-origin)', async () => {
    const res = await request(app)
      .get('/api/manual');

    expect(res.status).toBe(200);
  });
});

describe('Headers de seguridad', () => {
  const dirTest = fs.mkdtempSync(path.join(os.tmpdir(), 'autoescuela-headers-test-'));
  let app: any;

  beforeAll(async () => {
    process.env.DB_PATH = path.join(dirTest, 'test.db');

    const modulo = await import('../src/index');
    app = modulo.app;
  });

  afterAll(() => {
    try {
      fs.rmSync(dirTest, { recursive: true, force: true });
    } catch {
      // ignorar
    }
  });

  it('debería devolver Content-Type JSON en APIs', async () => {
    const res = await request(app).get('/api/manual');

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('application/json');
  });

  it('debería manejar OPTIONS (preflight)', async () => {
    const res = await request(app)
      .options('/api/manual')
      .set('Origin', 'http://localhost:5173')
      .set('Access-Control-Request-Method', 'GET');

    // CORS preflight debería ser exitoso
    expect(res.status).toBe(204);
  });
});
