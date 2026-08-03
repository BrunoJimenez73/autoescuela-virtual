import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import request from 'supertest';
import type { Express } from 'express';

// BD temporal aislada: se fija ANTES de importar la app (el seed corre al importar)
const dirTest = fs.mkdtempSync(path.join(os.tmpdir(), 'autoescuela-test-'));
process.env.DB_PATH = path.join(dirTest, 'test.db');

let app: Express;

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

async function registrarUsuario(email?: string): Promise<{ token: string; email: string }> {
  const mail = email || `test${Math.floor(Math.random() * 1e9)}@test.com`;
  const res = await request(app)
    .post('/api/auth/register')
    .send({ email: mail, nombre: 'Test', password: 'clave123' });
  expect(res.status).toBe(201);
  return { token: res.body.datos.token, email: mail };
}

describe('Endpoints públicos', () => {
  it('GET /api/manual devuelve los temas', async () => {
    const res = await request(app).get('/api/manual');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.datos)).toBe(true);
    expect(res.body.datos.length).toBeGreaterThanOrEqual(8);
    expect(res.body.datos[0]).toHaveProperty('slug');
    expect(res.body.datos[0]).toHaveProperty('nombre');
  });

  it('GET /api/senales devuelve el catálogo', async () => {
    const res = await request(app).get('/api/senales');
    expect(res.status).toBe(200);
    expect(res.body.datos.length).toBeGreaterThan(100);
  });

  it('GET /api/preguntas NO expone indice_correcta (vector de trampa cerrado)', async () => {
    const res = await request(app).get('/api/preguntas?n=5');
    expect(res.status).toBe(200);
    expect(res.body.datos.length).toBeGreaterThan(0);
    for (const p of res.body.datos) {
      expect(p.indice_correcta).toBe(-1);
      expect(Array.isArray(p.opciones)).toBe(true);
    }
  });

  it('GET /api/inexistente devuelve 404 JSON (no index.html)', async () => {
    const res = await request(app).get('/api/no-existe');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});

describe('Autenticación', () => {
  it('registro con email inválido -> 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'no-es-email', nombre: 'Test', password: 'clave123' });
    expect(res.status).toBe(400);
  });

  it('registro con password corta -> 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'ok@test.com', nombre: 'Test', password: 'abc' });
    expect(res.status).toBe(400);
  });

  it('registro válido -> token + usuario', async () => {
    const { token } = await registrarUsuario();
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(20);
  });

  it('login incorrecto -> 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nadie@test.com', password: 'incorrecta' });
    expect(res.status).toBe(401);
  });

  it('login correcto -> token', async () => {
    const { email } = await registrarUsuario();
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email, password: 'clave123' });
    expect(res.status).toBe(200);
    expect(res.body.datos.token).toBeDefined();
  });

  it('/api/auth/me sin token -> 401', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});

describe('Flujo de examen (regresión del 500)', () => {
  it('crear examen normal -> responder -> corregir sin 500', async () => {
    const { token } = await registrarUsuario();

    const creado = await request(app)
      .post('/api/examenes')
      .set('Authorization', `Bearer ${token}`)
      .send({ total_preguntas: 5 });
    expect(creado.status).toBe(201);
    const examenId = creado.body.datos.id;
    expect(examenId).toBeGreaterThan(0);
    expect(creado.body.datos.total_preguntas).toBe(5);

    const preguntas = await request(app)
      .get(`/api/examenes/${examenId}/preguntas`)
      .set('Authorization', `Bearer ${token}`);
    expect(preguntas.status).toBe(200);
    expect(preguntas.body.datos.length).toBe(5);
    for (const p of preguntas.body.datos) {
      expect(p.indice_correcta).toBe(-1); // no se filtra la respuesta durante el examen
    }

    // Responder la primera con opción válida (0) y una inválida en otro endpoint
    const responder = await request(app)
      .post(`/api/examenes/${examenId}/responder`)
      .set('Authorization', `Bearer ${token}`)
      .send({ pregunta_id: preguntas.body.datos[0].id, opcion_elegida: 0 });
    expect(responder.status).toBe(200);
    expect(responder.body.datos).toHaveProperty('correcta');

    // Opción fuera de rango -> 400
    const invalida = await request(app)
      .post(`/api/examenes/${examenId}/responder`)
      .set('Authorization', `Bearer ${token}`)
      .send({ pregunta_id: preguntas.body.datos[0].id, opcion_elegida: 99 });
    expect(invalida.status).toBe(400);

    // BUG CRÍTICO: antes daba 500 "Too few parameter values" / NOT NULL racha_fallos
    const corregir = await request(app)
      .post(`/api/examenes/${examenId}/corregir`)
      .set('Authorization', `Bearer ${token}`)
      .send({ duracion_seg: 90 });
    expect(corregir.status).toBe(200);
    expect(corregir.body.datos).toHaveProperty('aciertos');
    expect(corregir.body.datos).toHaveProperty('total');
    expect(corregir.body.datos).toHaveProperty('nota');
    expect(Array.isArray(corregir.body.datos.respuestas)).toBe(true);
    expect(corregir.body.datos.respuestas[0]).toHaveProperty('explicacion');
  });

  it('crear examen adaptativo -> responde y corrige', async () => {
    const { token } = await registrarUsuario();

    const creado = await request(app)
      .post('/api/examenes')
      .set('Authorization', `Bearer ${token}`)
      .send({ total_preguntas: 10, modalidad: 'adaptativo' });
    expect(creado.status).toBe(201);

    const preguntas = await request(app)
      .get(`/api/examenes/${creado.body.datos.id}/preguntas`)
      .set('Authorization', `Bearer ${token}`);
    expect(preguntas.status).toBe(200);
    expect(preguntas.body.datos.length).toBe(10);
  });

  it('GET /api/preguntas/adaptativas requiere token y funciona con él', async () => {
    const sinToken = await request(app).get('/api/preguntas/adaptativas?n=5');
    expect(sinToken.status).toBe(401);

    const { token } = await registrarUsuario();
    const conToken = await request(app)
      .get('/api/preguntas/adaptativas?n=5')
      .set('Authorization', `Bearer ${token}`);
    expect(conToken.status).toBe(200);
    expect(conToken.body.datos.length).toBeGreaterThan(0);
    expect(conToken.body.datos[0]).toHaveProperty('texto');
  });

  it('el progreso queda actualizado tras corregir (upsert OK)', async () => {
    const { token } = await registrarUsuario();
    const creado = await request(app)
      .post('/api/examenes')
      .set('Authorization', `Bearer ${token}`)
      .send({ total_preguntas: 3 });
    const examenId = creado.body.datos.id;
    const preguntas = await request(app)
      .get(`/api/examenes/${examenId}/preguntas`)
      .set('Authorization', `Bearer ${token}`);

    for (const p of preguntas.body.datos) {
      await request(app)
        .post(`/api/examenes/${examenId}/responder`)
        .set('Authorization', `Bearer ${token}`)
        .send({ pregunta_id: p.id, opcion_elegida: 0 });
    }
    await request(app)
      .post(`/api/examenes/${examenId}/corregir`)
      .set('Authorization', `Bearer ${token}`)
      .send({ duracion_seg: 30 });

    const temas = await request(app)
      .get('/api/progreso/temas')
      .set('Authorization', `Bearer ${token}`);
    expect(temas.status).toBe(200);
    const conDatos = temas.body.datos.filter((t: any) => t.intentadas > 0);
    expect(conDatos.length).toBeGreaterThan(0);
  });
});
