// ===========================================
// Tipos de modelos de base de datos
// ===========================================

export interface UsuarioDB {
  id: number;
  email: string;
  nombre: string;
  password_hash: string;
  creado_en: string;
}

export interface TemaDB {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string | null;
  orden: number;
}

export interface PreguntaDB {
  id: number;
  texto: string;
  opciones: string; // JSON string
  indice_correcta: number;
  tema_id: number;
  dificultad: number;
  referencia_manual: string | null;
  explicacion: string | null;
  imagen: string | null;
}

export interface PreguntaConTemaDB extends PreguntaDB {
  tema_nombre: string;
  tema_slug: string;
}

export interface ExamenDB {
  id: number;
  usuario_id: number;
  fecha: string;
  aciertos: number;
  total_preguntas: number;
  duracion_seg: number;
  completado: number; // 0 o 1 (SQLite boolean)
}

export interface RespuestaExamenDB {
  id: number;
  examen_id: number;
  pregunta_id: number;
  opcion_elegida: number | null;
  correcta: number; // 0 o 1
}

export interface RespuestaConPreguntaDB extends RespuestaExamenDB {
  texto: string;
  opciones: string; // JSON string
  indice_correcta: number;
  explicacion: string | null;
  referencia_manual: string | null;
  imagen: string | null;
  tema_nombre?: string;
  tema_slug?: string;
}

export interface ProgresoUsuarioTemaDB {
  id: number;
  usuario_id: number;
  tema_id: number;
  intentadas: number;
  acertadas: number;
  racha_fallos: number;
  ultimo_fallo: string | null;
}

export interface ProgresoConTemaDB {
  nombre: string;
  slug: string;
  intentadas: number;
  acertadas: number;
  racha_fallos: number | null;
  porcentaje_acierto?: number;
}

export interface SeccionManualDB {
  id: number;
  tema_slug: string;
  titulo: string;
  contenido: string;
  orden: number;
}

export interface SeedMetaDB {
  marca: string;
  ejecutado_en: string;
}
