// ===========================================
// Tests de rate limiting
// ===========================================
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import fs from 'fs';
import os from 'os';
import path from 'path';

// BD temporal aislada
const dirTest = fs.mkdtempSync(path.join(os.tmpdir(), 'autoescuela-ratelimit-test-'));
process.env.DB_PATH = path.join(dirTest, 'test.db');

let app: any;

beforeAll(async () => {
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

describe('Rate Limiting - Login', () => {
  it('debería permitir los primeros intentos', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'noexiste@test.com',
        password: 'wrongpassword',
      });

    // Primer intento: 401 (credenciales inválidas, no rate limit)
    expect(res.status).toBe(401);
    expect(res.body.error).toContain('Credenciales inválidas');
  });

  it('debería bloquear después de múltiples intentos fallidos', async () => {
    // Hacer 10 intentos fallidos (el límite es 10)
    for (let i = 0; i < 10; i++) {
      await request(app)
        .post('/api/auth/login')
        .send({
          email: 'noexiste@test.com',
          password: 'wrongpassword',
        });
    }

    // El 11º intento debería ser rate limited
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'noexiste@test.com',
        password: 'wrongpassword',
      });

    expect(res.status).toBe(429);
    expect(res.body.error).toContain('Demasiados intentos');
  });

  it('debería bloquear registro también', async () => {
    // El rate limit comparte ventana para login y register
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'otro@test.com',
        nombre: 'Test',
        password: 'password123',
      });

    expect(res.status).toBe(429);
    expect(res.body.error).toContain('Demasiados intentos');
  });
});
