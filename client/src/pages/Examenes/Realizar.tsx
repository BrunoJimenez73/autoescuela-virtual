import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../../api/client'
import type { Pregunta } from '../../types'

export default function Realizar() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [preguntas, setPreguntas] = useState<Pregunta[]>([])
  const [indice, setIndice] = useState(0)
  const [respuestas, setRespuestas] = useState<Record<number, number>>({})
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tiempo, setTiempo] = useState(0)
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    if (!id) return
    api.examenes.preguntas(Number(id)).then(res => {
      if (res.datos) {
        setPreguntas(res.datos)
      } else {
        setError(res.error || 'Error al cargar las preguntas del examen')
      }
      setCargando(false)
    })
  }, [id])

  useEffect(() => {
    const interval = setInterval(() => setTiempo(t => t + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  const pregunta = preguntas[indice]
  const respondidas = Object.keys(respuestas).length
  const isLast = indice >= preguntas.length - 1

  function seleccionar(opcion: number) {
    setRespuestas(prev => ({ ...prev, [pregunta.id]: opcion }))
  }

  async function finalizar() {
    setEnviando(true)
    // Enviar todas las respuestas en una sola petición
    const respuestasArray = Object.entries(respuestas).map(([pregId, opcion]) => ({
      pregunta_id: Number(pregId),
      opcion_elegida: opcion,
    }))
    const res = await api.examenes.corregir(Number(id), tiempo, respuestasArray)
    setEnviando(false)
    if (res.datos) {
      navigate(`/examenes/${id}/resultado`, { state: { resultado: res.datos } })
    }
  }

  if (cargando) return <div className="animate-pulse">Preparando examen...</div>
  if (error) return <p className="text-red-500 text-center p-8">{error}</p>
  if (!pregunta) return <p className="text-red-500 text-center p-8">Error al cargar preguntas</p>

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Barra de progreso */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-600">
            {indice + 1} / {preguntas.length}
          </span>
          <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all"
              style={{ width: `${(respondidas / preguntas.length) * 100}%` }}
            />
          </div>
        </div>
        <div className="text-sm font-mono text-gray-500">
          {Math.floor(tiempo / 60)}:{(tiempo % 60).toString().padStart(2, '0')}
        </div>
      </div>

      {/* Pregunta */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="text-xs text-gray-400 mb-2">{pregunta.tema_nombre}</div>
        {pregunta.imagen && (
          <div className="mb-4 flex justify-center">
            <img src={pregunta.imagen} alt="Señal" className="max-h-40 object-contain rounded-lg" />
          </div>
        )}
        <h2 className="text-lg font-medium mb-6">{pregunta.texto}</h2>

        <div className="space-y-3">
          {pregunta.opciones.map((op, i) => (
            <button
              key={i}
              onClick={() => seleccionar(i)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                respuestas[pregunta.id] === i
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="font-medium text-gray-600 mr-3">
                {String.fromCharCode(65 + i)}.
              </span>
              {op}
            </button>
          ))}
        </div>

        {respuestas[pregunta.id] !== undefined && (
          <div className="mt-6 flex justify-between">
            {!isLast && (
              <button
                onClick={() => setIndice(i => i + 1)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Siguiente →
              </button>
            )}
            {isLast && (
              <button
                onClick={finalizar} disabled={enviando}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors ml-auto"
              >
                {enviando ? 'Corrigiendo...' : 'Finalizar y Corregir'}
              </button>
            )}
          </div>
        )}

        {/* Navegación rápida */}
        <div className="mt-6 flex gap-1.5 flex-wrap">
          {preguntas.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndice(i)}
              className={`w-8 h-8 rounded text-xs font-medium transition-colors ${
                i === indice
                  ? 'bg-blue-600 text-white'
                  : respuestas[preguntas[i].id] !== undefined
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
