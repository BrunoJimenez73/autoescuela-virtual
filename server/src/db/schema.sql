CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  creado_en TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS temas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  descripcion TEXT,
  orden INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS preguntas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  texto TEXT NOT NULL,
  opciones TEXT NOT NULL,
  indice_correcta INTEGER NOT NULL,
  tema_id INTEGER NOT NULL REFERENCES temas(id),
  dificultad INTEGER NOT NULL DEFAULT 1,
  referencia_manual TEXT,
  explicacion TEXT,
  imagen TEXT
);

CREATE TABLE IF NOT EXISTS examenes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
  fecha TEXT NOT NULL DEFAULT (datetime('now')),
  aciertos INTEGER NOT NULL DEFAULT 0,
  total_preguntas INTEGER NOT NULL,
  duracion_seg INTEGER NOT NULL DEFAULT 0,
  completado INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS respuestas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  examen_id INTEGER NOT NULL REFERENCES examenes(id),
  pregunta_id INTEGER NOT NULL REFERENCES preguntas(id),
  opcion_elegida INTEGER,
  correcta INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS progreso_usuario_tema (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
  tema_id INTEGER NOT NULL REFERENCES temas(id),
  intentadas INTEGER NOT NULL DEFAULT 0,
  acertadas INTEGER NOT NULL DEFAULT 0,
  racha_fallos INTEGER NOT NULL DEFAULT 0,
  ultimo_fallo TEXT,
  UNIQUE(usuario_id, tema_id)
);

CREATE TABLE IF NOT EXISTS contenido_manual (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tema_slug TEXT NOT NULL,
  titulo TEXT NOT NULL,
  contenido TEXT NOT NULL,
  orden INTEGER NOT NULL DEFAULT 0
);

-- Marcas de seeds ejecutados (idempotencia de seeds de datos)
CREATE TABLE IF NOT EXISTS seed_meta (
  marca TEXT PRIMARY KEY,
  ejecutado_en TEXT NOT NULL DEFAULT (datetime('now'))
);
