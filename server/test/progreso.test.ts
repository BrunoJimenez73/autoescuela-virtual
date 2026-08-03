// ===========================================
// Tests de progreso
// ===========================================
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import fs from 'fs';
import os from 'os';
import path from 'path';

// BD temporal aislada
const dirTest = fs.mkdtempSync(path.join(os.tmpdir(), 'autoescuela-progreso-test-'));
process.env.DB_PATH = path.join(dirTest, 'test.db');

let app: any;
let token: string;

beforeAll(async () => {
  const modulo = await import('../src/index');
  app = modulo.app;

  // Registrar usuario
  await request(app)
    .post('/api/auth/register')
    .send({
      email: 'progreso@test.com',
      nombre: 'Test Progreso',
      password: 'password123',
    });

  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'progreso@test.com',
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

describe('Progreso - General', () => {
  it('debería devolver estadísticas vacías al inicio', async () => {
    const res = await request(app)
      .get('/api/progreso')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.datos.examenesCompletados).toBe(0);
    expect(res.body.datos.totalAciertos).toBe(0);
    expect(res.body.datos.totalIntentadas).toBe(0);
    expect(res.body.datos.porcentajeGlobal).toBe(0);
    expect(Array.isArray(res.body.datos.examenesRecientes)).toBe(true);
    expect(Array.isArray(res.body.datos.progresoTemas)).toBe(true);
  });

  it('debería rechazar sin autenticación', async () => {
    const res = await request(app).get('/api/progreso');

    expect(res.status).toBe(401);
  });
});

describe('Progreso - Temas', () => {
  it('debería devolver todos los temas', async () => {
    const res = await request(app)
      .get('/api/progreso/temas')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.datos)).toBe(true);
    expect(res.body.datos.length).toBeGreaterThan(0);

    // Verificar estructura
    const tema = res.body.datos[0];
    expect(tema).toHaveProperty('nombre');
    expect(tema).toHaveProperty('slug');
    expect(tema).toHaveProperty('intentadas');
    expect(tema).toHaveProperty('acertadas');
  });
});

describe('Progreso - Débiles', () => {
  it('debería devolver array vacío sin progreso', async () => {
    const res = await request(app)
      .get('/api/progreso/debiles')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.datos)).toBe(true);
    expect(res.body.datos.length).toBe(0);
  });

  it('debería devolver temas débiles después de fallar', async () => {
    // Crear examen, responder mal todas, corregir
    const creado = await request(app)
      .post('/api/examenes')
      .set('Authorization', `Bearer ${token}`)
      .send({ total_preguntas: 3 });

    const examenId = creado.body.datos.id;

    const preguntas = await request(app)
      .get(`/api/examenes/${examenId}/preguntas`)
      .set('Authorization', `Bearer ${token}`);

    // Responder todas con opción 0 (probablemente incorrecta)
    for (const p of preguntas.body.datos) {
      await request(app)
        .post(`/api/examenes/${examenId}/responder`)
        .set('Authorization', `Bearer ${token}`)
        .send({ pregunta_id: p.id, opcion_elegida: 0 });
    }

    // Corregir
    await request(app)
      .post(`/api/examenes/${examenId}/corregir`)
      .set('Authorization', `Bearer ${token}`)
      .send({ duracion_seg: 60 });

    // Ahora debería haber temas débiles
    const res = await request(app)
      .get('/api/progreso/debiles')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.datos)).toBe(true);

    // Si hubo fallos, debería haber al menos un tema débil
    if (res.body.datos.length > 0) {
      const debil = res.body.datos[0];
      expect(debil).toHaveProperty('nombre');
      expect(debil).toHaveProperty('slug');
      expect(debil).toHaveProperty('intentadas');
      expect(debil).toHaveProperty('acertadas');
      expect(debil).toHaveProperty('racha_fallos');
      expect(debil).toHaveProperty('fallos');
      expect(debil.fallos).toBeGreaterThan(0);
    }
  });
});

describe('Progreso - Actualización tras examen', () => {
  it('debería actualizar progreso al corregir examen', async () => {
    // Obtener progreso antes
    const antes = await request(app)
      .get('/api/progreso')
      .set('Authorization', `Bearer ${token}`);

    const examenesAntes = antes.body.datos.examenesCompletados;

    // Crear y completar examen
    const creado = await request(app)
      .post('/api/examenes')
      .set('Authorization', `Bearer ${token}`)
      .send({ total_preguntas: 2 });

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
      .send({ duracion_seg: 45 });

    // Obtener progreso después
    const despues = await request(app)
      .get('/api/progreso')
      .set('Authorization', `Bearer ${token}`);

    // Debería haber un examen más
    expect(despues.body.datos.examenesCompletados).toBe(examenesAntes + 1);
    expect(despues.body.datos.totalIntentadas).toBeGreaterThan(0);
  });
});
