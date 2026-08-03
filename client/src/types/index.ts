export interface Usuario {
  id: number
  email: string
  nombre: string
  creado_en?: string
}

export interface Pregunta {
  id: number
  texto: string
  opciones: string[]
  indice_correcta: number
  tema_id: number
  dificultad: number
  referencia_manual?: string
  explicacion?: string
  imagen?: string
  tema_nombre?: string
  tema_slug?: string
}

export interface Examen {
  id: number
  fecha: string
  aciertos: number
  total_preguntas: number
  duracion_seg: number
  completado: number
}

export interface ExamenDetalle extends Examen {
  respuestas: RespuestaDetalle[]
}

export interface RespuestaDetalle {
  pregunta_id: number
  texto: string
  opciones: string[]
  indice_correcta: number
  opcion_elegida: number
  correcta: boolean
  explicacion?: string
  referencia_manual?: string
  imagen?: string
  tema?: string
}

export interface ProgresoGeneral {
  examenesCompletados: number
  totalAciertos: number
  totalIntentadas: number
  porcentajeGlobal: number
  examenesRecientes: { fecha: string; aciertos: number; total_preguntas: number }[]
  progresoTemas: ProgresoTema[]
}

export interface ProgresoTema {
  nombre: string
  slug: string
  intentadas: number
  acertadas: number
  racha_fallos: number | null
  porcentaje_acierto?: number
}

export interface SeccionManual {
  id: number
  tema_slug: string
  titulo: string
  contenido: string
  orden: number
}

export interface TemaInfo {
  slug: string
  nombre: string
  descripcion: string
  orden: number
}

export interface TemaData {
  tema: string
  slug: string
  secciones: SeccionManual[]
}

export interface Senal {
  id: string
  codigo: string
  nombre: string
  categoria: string
  descripcion: string
  significado: string
  imagen: string
}

export interface ApiResponse<T> {
  datos: T | null
  error: string | null
}
