import { useLocation, Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import type { Examen, RespuestaDetalle } from '../../types'

interface ResultadoData {
  id: number
  aciertos: number
  total: number
  nota: number
  duracion_seg: number
  respuestas: RespuestaDetalle[]
}

export default function Resultado() {
  const location = useLocation()
  const { id } = useParams()
  const [resultado, setResultado] = useState<ResultadoData | null>(
    (location.state?.resultado as ResultadoData | undefined) || null
  )
  const [cargando, setCargando] = useState(!resultado)
  const [fallosVisibles, setFallosVisibles] = useState(false)

  useEffect(() => {
    if (!resultado && id) {
      api.examenes.get(Number(id)).then(res => {
        if (res.datos) {
          const ex = res.datos as Examen & { respuestas: RespuestaDetalle[] }
          setResultado({
            id: ex.id,
            aciertos: ex.aciertos,
            total: ex.total_preguntas,
            nota: ex.total_preguntas > 0 ? Math.round((ex.aciertos / ex.total_preguntas) * 100) : 0,
            duracion_seg: ex.duracion_seg,
            respuestas: ex.respuestas ?? [],
          })
        }
        setCargando(false)
      })
    }
  }, [id, resultado])

  if (cargando) return <div className="animate-pulse">Cargando resultados...</div>
  if (!resultado) return <p className="text-red-500">Resultado no encontrado</p>

  const apto = resultado.nota >= 90
  const fallos = resultado.respuestas.filter(r => !r.correcta)

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Cabecera */}
      <div className={`p-8 rounded-2xl text-center text-white ${
        apto ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-red-500 to-red-600'
      }`}>
        <div className="text-6xl mb-4">{apto ? '🎉' : '😞'}</div>
        <h1 className="text-3xl font-bold mb-2">
          {apto ? '¡APTO!' : 'NO APTO'}
        </h1>
        <p className="text-white/80 text-lg">
          {resultado.aciertos} / {resultado.total} aciertos
        </p>
        <div className="mt-4 text-5xl font-bold">{resultado.nota}%</div>
        <p className="text-white/80 mt-2">
          Tiempo: {Math.floor(resultado.duracion_seg / 60)}m {resultado.duracion_seg % 60}s
        </p>
        {!apto && (
          <p className="mt-4 text-white/90 bg-white/20 rounded-lg p-3 inline-block">
            Necesitas un <strong>90%</strong> para aprobar ({(resultado.total * 0.9).toFixed(0)}/{resultado.total})
          </p>
        )}
      </div>

      {/* Acciones */}
      <div className="flex gap-3">
        <Link to="/examenes/nuevo"
          className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium text-center hover:bg-blue-700 transition-colors">
          Otro examen
        </Link>
        {fallos.length > 0 && (
          <button
            onClick={() => setFallosVisibles(!fallosVisibles)}
            className="px-6 py-3 bg-orange-100 text-orange-700 rounded-xl font-medium hover:bg-orange-200 transition-colors"
          >
            Revisar {fallos.length} fallos
          </button>
        )}
      </div>

      {/* Fallos */}
      {fallosVisibles && fallos.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">❌ Fallos</h2>
          {fallos.map((r: RespuestaDetalle, i: number) => (
            <div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-red-200">
              <div className="text-xs text-gray-400 mb-1">{r.tema}</div>
              {r.imagen && (
                <div className="mb-3 flex justify-center">
                  <img src={r.imagen} alt="Señal" className="max-h-32 object-contain rounded-lg" />
                </div>
              )}
              <p className="font-medium mb-3">{r.texto}</p>

              <div className="space-y-2 mb-3">
                {r.opciones.map((op: string, j: number) => (
                  <div
                    key={j}
                    className={`p-3 rounded-lg text-sm border ${
                      j === r.indice_correcta
                        ? 'border-green-500 bg-green-50 text-green-800'
                        : j === r.opcion_elegida
                          ? 'border-red-500 bg-red-50 text-red-800'
                          : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    <span className="font-medium mr-2">{String.fromCharCode(65 + j)}.</span>
                    {op}
                    {j === r.indice_correcta && ' ✅'}
                    {j === r.opcion_elegida && j !== r.indice_correcta && ' ❌'}
                  </div>
                ))}
              </div>

              {r.explicacion && (
                <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
                  💡 {r.explicacion}
                </div>
              )}

              {r.referencia_manual && (
                <Link
                  to={`/estudiar/${r.referencia_manual?.split('#')[0]}`}
                  className="inline-block mt-2 text-sm text-blue-600 hover:underline"
                >
                  📖 Leer más sobre este tema
                </Link>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Aciertos */}
      {fallosVisibles && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">✅ Aciertos ({resultado.aciertos})</h2>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-green-200">
            <p className="text-gray-600">
              ¡Buen trabajo! Revisa los fallos para entender tus errores.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
