import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'
import type { Examen } from '../../types'

export default function Historial() {
  const [examenes, setExamenes] = useState<Examen[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    api.examenes.list().then(res => {
      if (res.datos) setExamenes(res.datos.filter(e => e.completado))
      setCargando(false)
    })
  }, [])

  if (cargando) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        {[1,2,3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)}
      </div>
    )
  }

  if (examenes.length === 0) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <p className="text-gray-400 text-lg mb-4">No tienes exámenes completados</p>
        <Link to="/examenes/nuevo" className="text-blue-600 hover:underline font-medium">
          Comienza un simulacro →
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">📋 Historial de exámenes</h1>
        <Link to="/examenes/nuevo"
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
          Nuevo examen
        </Link>
      </div>

      <div className="space-y-3">
        {examenes.map(ex => {
          const pct = Math.round((ex.aciertos / ex.total_preguntas) * 100)
          const apto = pct >= 90
          const fecha = new Date(ex.fecha + 'Z').toLocaleDateString('es-ES', {
            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
          })

          return (
            <Link
              key={ex.id}
              to={`/examenes/${ex.id}/resultado`}
              className="block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${
                    apto ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {apto ? 'A' : 'NO'}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {ex.aciertos}/{ex.total_preguntas} aciertos
                    </div>
                    <div className="text-sm text-gray-500">{fecha}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className={`text-lg font-bold ${apto ? 'text-green-600' : 'text-red-600'}`}>
                      {pct}%
                    </div>
                    <div className="text-xs text-gray-400">
                      {Math.floor(ex.duracion_seg / 60)}m {ex.duracion_seg % 60}s
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
