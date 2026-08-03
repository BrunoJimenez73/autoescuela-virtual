// ===========================================
// Tests de autenticación
// ===========================================
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import request from 'supertest';
import fs from 'fs';
import os from 'os';
import path from 'path';

// BD temporal aislada
const dirTest = fs.mkdtempSync(path.join(os.tmpdir(), 'autoescuela-auth-test-'));
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

describe('Auth - Register', () => {
  it('debería registrar un usuario nuevo', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        nombre: 'Usuario Test',
        password: 'password123',
      });

    expect(res.status).toBe(201);
    expect(res.body.datos).toBeDefined();
    expect(res.body.datos.token).toBeDefined();
    expect(res.body.datos.usuario.email).toBe('test@example.com');
    expect(res.body.datos.usuario.nombre).toBe('Usuario Test');
    expect(res.body.error).toBeNull();
  });

  it('debería rechazar email duplicado', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        nombre: 'Otro Usuario',
        password: 'password123',
      });

    expect(res.status).toBe(409);
    expect(res.body.error).toContain('ya está registrado');
  });

  it('debería rechazar email inválido', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'email-invalido',
        nombre: 'Test',
        password: 'password123',
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('formato válido');
  });

  it('debería rechazar password corta', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'nuevo@example.com',
        nombre: 'Test',
        password: '12345',
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('8 caracteres');
  });

  it('debería rechazar campos requeridos', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: '',
        nombre: '',
        password: '',
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('requeridos');
  });
});

describe('Auth - Login', () => {
  it('debería hacer login con credenciales correctas', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    expect(res.status).toBe(200);
    expect(res.body.datos.token).toBeDefined();
    expect(res.body.datos.usuario.email).toBe('test@example.com');
  });

  it('debería rechazar contraseña incorrecta', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

    expect(res.status).toBe(401);
    expect(res.body.error).toContain('Credenciales inválidas');
  });

  it('debería rechazar email inexistente', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'noexiste@example.com',
        password: 'password123',
      });

    expect(res.status).toBe(401);
    expect(res.body.error).toContain('Credenciales inválidas');
  });
});

describe('Auth - Me', () => {
  let token: string;

  beforeAll(async () => {
    // Registrar usuario para obtener token
    await request(app)
      .post('/api/auth/register')
      .send({
        email: 'me-test@example.com',
        nombre: 'Me Test',
        password: 'password123',
      });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'me-test@example.com',
        password: 'password123',
      });
    token = res.body.datos.token;
  });

  it('debería devolver usuario con token válido', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.datos.email).toBe('me-test@example.com');
    expect(res.body.datos.nombre).toBe('Me Test');
    expect(res.body.datos.password_hash).toBeUndefined();
  });

  it('debería rechazar sin token', async () => {
    const res = await request(app)
      .get('/api/auth/me');

    expect(res.status).toBe(401);
    expect(res.body.error).toContain('Token requerido');
  });

  it('debería rechazar token inválido', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalid-token');

    expect(res.status).toBe(401);
    expect(res.body.error).toContain('Token inválido');
  });
});
