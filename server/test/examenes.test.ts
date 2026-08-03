// ===========================================
// Tests de exámenes
// ===========================================
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import fs from 'fs';
import os from 'os';
import path from 'path';

// BD temporal aislada
const dirTest = fs.mkdtempSync(path.join(os.tmpdir(), 'autoescuela-examenes-test-'));
process.env.DB_PATH = path.join(dirTest, 'test.db');

let app: any;
let token: string;
let examenId: number;

beforeAll(async () => {
  const modulo = await import('../src/index');
  app = modulo.app;

  // Registrar usuario y obtener token
  await request(app)
    .post('/api/auth/register')
    .send({
      email: 'examen-test@example.com',
      nombre: 'Test Examen',
      password: 'password123',
    });

  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'examen-test@example.com',
      password: 'password123',
    });
  token = loginRes.body.datos.token;
});

afterAll(() => {
  try {
    fs.rmSync(dirTest, { recursive: true, force: true });
  } catch {
    // ignorar
  }
});

describe('Exámenes - Crear', () => {
  it('debería crear un examen nuevo', async () => {
    const res = await request(app)
      .post('/api/examenes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        total_preguntas: 2,
        modalidad: 'normal',
      });

    expect(res.status).toBe(201);
    expect(res.body.datos.id).toBeDefined();
    expect(res.body.datos.total_preguntas).toBe(2);
    examenId = res.body.datos.id;
  });

  it('debería crear examen adaptativo', async () => {
    const res = await request(app)
      .post('/api/examenes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        total_preguntas: 3,
        modalidad: 'adaptativo',
      });

    expect(res.status).toBe(201);
    expect(res.body.datos.total_preguntas).toBe(3);
  });

  it('debería rechazar sin autenticación', async () => {
    const res = await request(app)
      .post('/api/examenes')
      .send({
        total_preguntas: 30,
        modalidad: 'normal',
      });

    expect(res.status).toBe(401);
  });
});

describe('Exámenes - Preguntas', () => {
  it('debería devolver preguntas del examen', async () => {
    const res = await request(app)
      .get(`/api/examenes/${examenId}/preguntas`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.datos)).toBe(true);
    expect(res.body.datos.length).toBeGreaterThan(0);

    // Verificar que NO se expone la respuesta correcta
    const pregunta = res.body.datos[0];
    expect(pregunta.indice_correcta).toBe(-1);
    expect(Array.isArray(pregunta.opciones)).toBe(true);
  });

  it('debería rechazar examen inexistente', async () => {
    const res = await request(app)
      .get('/api/examenes/99999/preguntas')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});

describe('Exámenes - Responder', () => {
  let preguntaId: number;

  beforeAll(async () => {
    // Obtener primera pregunta del examen
    const preguntasRes = await request(app)
      .get(`/api/examenes/${examenId}/preguntas`)
      .set('Authorization', `Bearer ${token}`);
    preguntaId = preguntasRes.body.datos[0].id;
  });

  it('debería registrar una respuesta', async () => {
    const res = await request(app)
      .post(`/api/examenes/${examenId}/responder`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        pregunta_id: preguntaId,
        opcion_elegida: 0,
      });

    expect(res.status).toBe(200);
    expect(res.body.datos.correcta).toBeDefined();
    expect(typeof res.body.datos.correcta).toBe('boolean');
  });

  it('debería rechazar opción inválida', async () => {
    const res = await request(app)
      .post(`/api/examenes/${examenId}/responder`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        pregunta_id: preguntaId,
        opcion_elegida: 99,
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('inválida');
  });
});

describe('Exámenes - Corregir en lote', () => {
  it('debería corregir con respuestas en una sola petición', async () => {
    const creado = await request(app)
      .post('/api/examenes')
      .set('Authorization', `Bearer ${token}`)
      .send({ total_preguntas: 2, modalidad: 'normal' });
    const id = creado.body.datos.id;

    const preguntas = await request(app)
      .get(`/api/examenes/${id}/preguntas`)
      .set('Authorization', `Bearer ${token}`);

    const respuestas = preguntas.body.datos.map((p: { id: number }) => ({
      pregunta_id: p.id,
      opcion_elegida: 0,
    }));

    const res = await request(app)
      .post(`/api/examenes/${id}/corregir`)
      .set('Authorization', `Bearer ${token}`)
      .send({ duracion_seg: 90, respuestas });

    expect(res.status).toBe(200);
    expect(res.body.datos.total).toBe(2);
    expect(res.body.datos.respuestas.length).toBe(2);
    expect(res.body.datos.duracion_seg).toBe(90);
  });

  it('debería rechazar opción inválida dentro del lote', async () => {
    const creado = await request(app)
      .post('/api/examenes')
      .set('Authorization', `Bearer ${token}`)
      .send({ total_preguntas: 1, modalidad: 'normal' });
    const id = creado.body.datos.id;

    const res = await request(app)
      .post(`/api/examenes/${id}/corregir`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        duracion_seg: 60,
        respuestas: [{ pregunta_id: 99999, opcion_elegida: 0 }],
      });

    expect(res.status).toBe(404);
  });

  it('debería limitar la duración declarada al máximo permitido', async () => {
    const creado = await request(app)
      .post('/api/examenes')
      .set('Authorization', `Bearer ${token}`)
      .send({ total_preguntas: 1, modalidad: 'normal' });
    const id = creado.body.datos.id;

    const preguntas = await request(app)
      .get(`/api/examenes/${id}/preguntas`)
      .set('Authorization', `Bearer ${token}`);

    const respuestas = preguntas.body.datos.map((p: { id: number }) => ({
      pregunta_id: p.id,
      opcion_elegida: 0,
    }));

    const res = await request(app)
      .post(`/api/examenes/${id}/corregir`)
      .set('Authorization', `Bearer ${token}`)
      .send({ duracion_seg: 999999, respuestas });

    expect(res.status).toBe(200);
    expect(res.body.datos.duracion_seg).toBe(3 * 3600);
  });
});

describe('Exámenes - Corregir', () => {
  it('debería corregir el examen', async () => {
    const res = await request(app)
      .post(`/api/examenes/${examenId}/corregir`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        duracion_seg: 120,
      });

    expect(res.status).toBe(200);
    expect(res.body.datos.id).toBe(examenId);
    expect(res.body.datos.aciertos).toBeDefined();
    expect(res.body.datos.total).toBeDefined();
    expect(res.body.datos.nota).toBeDefined();
    expect(res.body.datos.nota).toBeGreaterThanOrEqual(0);
    expect(res.body.datos.nota).toBeLessThanOrEqual(100);
    expect(Array.isArray(res.body.datos.respuestas)).toBe(true);
  });

  it('debería rechazar corregir examen ya corregido', async () => {
    const res = await request(app)
      .post(`/api/examenes/${examenId}/corregir`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        duracion_seg: 60,
      });

    expect(res.status).toBe(404);
    expect(res.body.error).toContain('ya corregido');
  });
});

describe('Exámenes - Historial', () => {
  it('debería devolver historial del usuario', async () => {
    const res = await request(app)
      .get('/api/examenes')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.datos)).toBe(true);
    expect(res.body.datos.length).toBeGreaterThan(0);

    const examen = res.body.datos[0];
    expect(examen.id).toBeDefined();
    expect(examen.fecha).toBeDefined();
    expect(examen.completado).toBe(1);
  });
});

describe('Exámenes - Detalle', () => {
  it('debería devolver detalle del examen con respuestas', async () => {
    const res = await request(app)
      .get(`/api/examenes/${examenId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.datos.id).toBe(examenId);
    expect(res.body.datos.respuestas).toBeDefined();
    expect(Array.isArray(res.body.datos.respuestas)).toBe(true);

    // Verificar que las respuestas tienen la información esperada
    const respuesta = res.body.datos.respuestas[0];
    expect(respuesta.pregunta_id).toBeDefined();
    expect(respuesta.texto).toBeDefined();
    expect(Array.isArray(respuesta.opciones)).toBe(true);
    expect(respuesta.indice_correcta).toBeDefined();
  });
});
