import type {
  ApiResponse,
  Examen,
  ExamenDetalle,
  Pregunta,
  ProgresoGeneral,
  ProgresoTema,
  RespuestaDetalle,
  Senal,
  TemaData,
  TemaInfo,
  Usuario,
} from '../types'

// Relativa: en dev Vite la proxya a :3001; en producción la sirve el mismo server
const API_URL = import.meta.env.VITE_API_URL || '/api'

let token: string | null = localStorage.getItem('token')

let unauthorizedHandler: (() => void) | null = null

export function setUnauthorizedHandler(handler: (() => void) | null) {
  unauthorizedHandler = handler
}

export function setToken(t: string | null) {
  token = t
  if (t) localStorage.setItem('token', t)
  else localStorage.removeItem('token')
}

export function getToken(): string | null {
  return token
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    })
    // Sesión expirada: limpiar token y notificar al contexto de auth
    if (res.status === 401 && token) {
      setToken(null)
      unauthorizedHandler?.()
    }
    const data = await res.json()
    return data as ApiResponse<T>
  } catch {
    return { datos: null, error: 'Error de conexión con el servidor' }
  }
}

export interface AuthResponse {
  token: string
  usuario: Usuario
}

export interface ExamenCreado {
  id: number
  total_preguntas: number
}

export const api = {
  auth: {
    register: (email: string, nombre: string, password: string) =>
      request<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, nombre, password }),
      }),
    login: (email: string, password: string) =>
      request<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    me: () => request<Usuario>('/auth/me'),
  },
  preguntas: {
    list: (params?: { tema?: string; dificultad?: string }) => {
      const qs = new URLSearchParams(params ?? {}).toString()
      return request<Pregunta[]>(`/preguntas${qs ? `?${qs}` : ''}`)
    },
    aleatorias: (n = 30) => request<Pregunta[]>(`/preguntas/aleatorias?n=${n}`),
    adaptativas: (n = 30) => request<Pregunta[]>(`/preguntas/adaptativas?n=${n}`),
    get: (id: number) => request<Pregunta>(`/preguntas/${id}`),
  },
  examenes: {
    crear: (totalPreguntas = 30, modalidad: 'normal' | 'adaptativo' = 'normal') =>
      request<ExamenCreado>('/examenes', {
        method: 'POST',
        body: JSON.stringify({ total_preguntas: totalPreguntas, modalidad }),
      }),
    responder: (examenId: number, preguntaId: number, opcionElegida: number) =>
      request<{ correcta: boolean }>(`/examenes/${examenId}/responder`, {
        method: 'POST',
        body: JSON.stringify({ pregunta_id: preguntaId, opcion_elegida: opcionElegida }),
      }),
    corregir: (
      examenId: number,
      duracionSeg: number,
      respuestas?: { pregunta_id: number; opcion_elegida: number }[]
    ) =>
      request<ExamenDetalle>(`/examenes/${examenId}/corregir`, {
        method: 'POST',
        body: JSON.stringify({
          duracion_seg: duracionSeg,
          ...(respuestas ? { respuestas } : {}),
        }),
      }),
    list: () => request<Examen[]>('/examenes'),
    get: (id: number) => request<Examen & { respuestas: RespuestaDetalle[] }>(`/examenes/${id}`),
    preguntas: (id: number) => request<Pregunta[]>(`/examenes/${id}/preguntas`),
  },
  progreso: {
    general: () => request<ProgresoGeneral>('/progreso'),
    temas: () => request<ProgresoTema[]>('/progreso/temas'),
    debiles: () => request<ProgresoTema[]>('/progreso/debiles'),
  },
  manual: {
    index: () => request<TemaInfo[]>('/manual'),
    get: (slug: string) => request<TemaData>(`/manual/${slug}`),
  },
  senales: {
    list: () => request<Senal[]>('/senales'),
    get: (id: string) => request<Senal>(`/senales/${id}`),
  },
}
