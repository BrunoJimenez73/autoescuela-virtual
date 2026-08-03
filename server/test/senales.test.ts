// ===========================================
// Tests de señales
// ===========================================
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import fs from 'fs';
import os from 'os';
import path from 'path';

// BD temporal aislada
const dirTest = fs.mkdtempSync(path.join(os.tmpdir(), 'autoescuela-senales-test-'));
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

describe('Señales - Lista', () => {
  it('debería devolver todas las señales', async () => {
    const res = await request(app).get('/api/senales');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.datos)).toBe(true);
    expect(res.body.datos.length).toBeGreaterThan(50);

    // Verificar estructura de una señal
    const senal = res.body.datos[0];
    expect(senal).toHaveProperty('id');
    expect(senal).toHaveProperty('codigo');
    expect(senal).toHaveProperty('nombre');
    expect(senal).toHaveProperty('categoria');
    expect(senal).toHaveProperty('descripcion');
    expect(senal).toHaveProperty('significado');
    expect(senal).toHaveProperty('imagen');
  });

  it('debería filtrar por categoría', async () => {
    const res = await request(app).get('/api/senales?categoria=Peligro');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.datos)).toBe(true);
    expect(res.body.datos.length).toBeGreaterThan(0);

    // Todas deben ser de categoría Peligro
    for (const senal of res.body.datos) {
      expect(senal.categoria).toBe('Peligro');
    }
  });

  it('debería devolver array vacío para categoría inexistente', async () => {
    const res = await request(app).get('/api/senales?categoria=Inexistente');

    expect(res.status).toBe(200);
    expect(res.body.datos).toEqual([]);
  });
});

describe('Señales - Detalle', () => {
  it('debería devolver una señal por ID', async () => {
    const res = await request(app).get('/api/senales/stop');

    expect(res.status).toBe(200);
    expect(res.body.datos).toBeDefined();
    expect(res.body.datos.id).toBe('stop');
    expect(res.body.datos.codigo).toBe('R-1');
    expect(res.body.datos.nombre).toBe('STOP');
    expect(res.body.datos.categoria).toBe('Reglamentación');
    expect(res.body.datos.descripcion).toContain('octogonal');
    expect(res.body.datos.significado).toContain('detenerse');
    expect(res.body.datos.imagen).toBe('/senales/stop.svg');
  });

  it('debería devolver otra señal conocida', async () => {
    const res = await request(app).get('/api/senales/ceda-paso');

    expect(res.status).toBe(200);
    expect(res.body.datos.id).toBe('ceda-paso');
    expect(res.body.datos.codigo).toBe('R-2');
    expect(res.body.datos.nombre).toBe('Ceda el paso');
  });

  it('debería devolver 404 para señal inexistente', async () => {
    const res = await request(app).get('/api/senales/noexiste');

    expect(res.status).toBe(404);
    expect(res.body.error).toContain('no encontrada');
  });

  it('debería tener todas las categorías representadas', async () => {
    const res = await request(app).get('/api/senales');
    const categorias = new Set(res.body.datos.map((s: any) => s.categoria));

    expect(categorias.has('Peligro')).toBe(true);
    expect(categorias.has('Prohibición')).toBe(true);
    expect(categorias.has('Obligación')).toBe(true);
    expect(categorias.has('Reglamentación')).toBe(true);
    expect(categorias.has('Prioridad')).toBe(true);
    expect(categorias.has('Indicación')).toBe(true);
  });
});
