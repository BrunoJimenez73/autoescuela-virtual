import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'
import type { ProgresoGeneral, ProgresoTema } from '../../types'

export default function Dashboard() {
  const [progreso, setProgreso] = useState<ProgresoGeneral | null>(null)
  const [temas, setTemas] = useState<ProgresoTema[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    Promise.all([
      api.progreso.general(),
      api.progreso.temas(),
    ]).then(([pRes, tRes]) => {
      if (pRes.datos) setProgreso(pRes.datos)
      if (tRes.datos) setTemas(tRes.datos)
      setCargando(false)
    })
  }, [])

  if (cargando) return <div className="animate-pulse">Cargando progreso...</div>
  if (!progreso) return <p className="text-red-500">Error al cargar progreso</p>

  const temasOrdenados = [...temas].sort((a, b) => (a.porcentaje_acierto || 100) - (b.porcentaje_acierto || 100))

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">📊 Mi Progreso</h1>

      {/* Resumen */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 text-center">
          <div className="text-3xl font-bold text-blue-600">{progreso.examenesCompletados}</div>
          <div className="text-sm text-gray-500 mt-1">Exámenes</div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 text-center">
          <div className="text-3xl font-bold text-green-600">{progreso.porcentajeGlobal}%</div>
          <div className="text-sm text-gray-500 mt-1">Aciertos total</div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 text-center">
          <div className="text-3xl font-bold text-indigo-600">{progreso.totalAciertos}</div>
          <div className="text-sm text-gray-500 mt-1">Acertadas</div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 text-center">
          <div className="text-3xl font-bold text-orange-600">{progreso.totalIntentadas - progreso.totalAciertos}</div>
          <div className="text-sm text-gray-500 mt-1">Falladas</div>
        </div>
      </div>

      {/* Últimos exámenes */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="font-semibold text-lg mb-3">Últimos exámenes</h2>
        {progreso.examenesRecientes.length === 0 ? (
          <p className="text-gray-400">Aún no has realizado ningún examen.</p>
        ) : (
          <div className="space-y-2">
            {progreso.examenesRecientes.map((e, i: number) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="text-sm text-gray-500">
                  {new Date(e.fecha).toLocaleDateString('es-ES', {
                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${(e.aciertos / e.total_preguntas) >= 0.9 ? 'bg-green-500' : 'bg-red-500'}`}
                      style={{ width: `${(e.aciertos / e.total_preguntas) * 100}%` }}
                    />
                  </div>
                  <span className={`text-sm font-medium ${(e.aciertos / e.total_preguntas) >= 0.9 ? 'text-green-600' : 'text-red-600'}`}>
                    {e.aciertos}/{e.total_preguntas}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Progreso por temas */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="font-semibold text-lg mb-3">📚 Progreso por temas</h2>
        {temas.length === 0 ? (
          <p className="text-gray-400">Aún no hay datos de progreso.</p>
        ) : (
          <div className="space-y-3">
            {temasOrdenados.map((tema: ProgresoTema) => (
              <div key={tema.slug} className="flex items-center gap-4">
                <Link to={`/estudiar/${tema.slug}`} className="text-sm font-medium text-blue-600 hover:underline w-40 truncate flex-shrink-0">
                  {tema.nombre}
                </Link>
                <div className="flex-1">
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${tema.porcentaje_acierto || 0}%`,
                        backgroundColor: (tema.porcentaje_acierto || 0) >= 90 ? '#22c55e' : (tema.porcentaje_acierto || 0) >= 70 ? '#eab308' : '#ef4444'
                      }}
                    />
                  </div>
                </div>
                <div className="text-sm text-gray-500 w-20 text-right flex-shrink-0">
                  {tema.acertadas}/{tema.intentadas}
                  {tema.porcentaje_acierto !== null && (
                    <span className="ml-1 font-medium">({tema.porcentaje_acierto}%)</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Puntos débiles */}
      {temasOrdenados.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 p-6 rounded-xl">
          <h2 className="font-semibold text-lg text-orange-800 mb-3">🎯 Enfoque recomendado</h2>
          <p className="text-orange-700 text-sm mb-3">
            Estos son los temas donde tienes más margen de mejora. Te recomendamos repasarlos:
          </p>
          <div className="space-y-2">
            {temasOrdenados.slice(0, 3).map((tema: ProgresoTema) => (
              <Link
                key={tema.slug}
                to={`/estudiar/${tema.slug}`}
                className="block bg-white p-3 rounded-lg border border-orange-200 hover:shadow-sm transition-shadow"
              >
                <span className="font-medium text-orange-700">{tema.nombre}</span>
                <span className="text-sm text-gray-500 ml-2">
                  — {tema.intentadas > 0 ? `${tema.porcentaje_acierto}% aciertos` : 'sin practicar'}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
