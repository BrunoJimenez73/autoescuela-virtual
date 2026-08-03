import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api/client'
import type { ProgresoTema, TemaInfo } from '../../types'

const iconos: Record<string, string> = {
  'normas-generales': '⚖️',
  senales: '🛑',
  velocidad: '🏎️',
  adelantamientos: '⏩',
  prioridad: '🚦',
  luces: '💡',
  alcohol: '🍷',
  seguridad: '🛡️',
}

const colores: Record<string, string> = {
  'normas-generales': 'from-blue-50 to-blue-100 border-blue-200',
  senales: 'from-red-50 to-red-100 border-red-200',
  velocidad: 'from-orange-50 to-orange-100 border-orange-200',
  adelantamientos: 'from-yellow-50 to-yellow-100 border-yellow-200',
  prioridad: 'from-green-50 to-green-100 border-green-200',
  luces: 'from-cyan-50 to-cyan-100 border-cyan-200',
  alcohol: 'from-purple-50 to-purple-100 border-purple-200',
  seguridad: 'from-indigo-50 to-indigo-100 border-indigo-200',
}

const acentos: Record<string, string> = {
  'normas-generales': 'text-blue-700 bg-blue-100',
  senales: 'text-red-700 bg-red-100',
  velocidad: 'text-orange-700 bg-orange-100',
  adelantamientos: 'text-yellow-700 bg-yellow-100',
  prioridad: 'text-green-700 bg-green-100',
  luces: 'text-cyan-700 bg-cyan-100',
  alcohol: 'text-purple-700 bg-purple-100',
  seguridad: 'text-indigo-700 bg-indigo-100',
}

export default function Temas() {
  const [temas, setTemas] = useState<TemaInfo[]>([])
  const [progreso, setProgreso] = useState<ProgresoTema[]>([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    Promise.all([
      api.manual.index(),
      api.progreso.temas().catch(() => []),
    ]).then(([tRes, pRes]) => {
      if (tRes.datos) setTemas(tRes.datos)
      if (Array.isArray(pRes)) setProgreso(pRes)
      else if (pRes.datos) setProgreso(pRes.datos)
      setCargando(false)
    })
  }, [])

  type TemaConProgreso = TemaInfo & Partial<ProgresoTema>
  const temasConProgreso: TemaConProgreso[] = temas.map(t => {
    const prog = progreso.find((p: ProgresoTema) => p.slug === t.slug)
    return { ...t, ...prog }
  })

  const filtrados = temasConProgreso.filter(t =>
    t.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  if (cargando) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Manual de Estudio
        </h1>
        <p className="text-gray-500 text-lg">
          Domina el código de circulación con contenido completo y claro.
        </p>
      </div>

      {/* Buscador */}
      <div className="relative">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text" value={busqueda} onChange={e => setBusqueda(e.target.value)}
          placeholder="Buscar tema..."
          className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm
                     placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                     transition-shadow shadow-sm hover:shadow-md"
        />
      </div>

      {/* Grid de temas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtrados.map((tema: TemaConProgreso) => {
          const intentadas = tema.intentadas ?? 0
          const acertadas = tema.acertadas ?? 0
          const pct = intentadas > 0
            ? Math.round((acertadas / intentadas) * 100)
            : null
          const grad = colores[tema.slug] || 'from-gray-50 to-gray-100 border-gray-200'
          const acento = acentos[tema.slug] || 'text-gray-700 bg-gray-100'
          const icono = iconos[tema.slug] || '📖'

          return (
            <Link
              key={tema.slug}
              to={`/estudiar/${tema.slug}`}
              className={`group relative bg-gradient-to-br ${grad} border rounded-2xl p-6
                         hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0
                         transition-all duration-200 overflow-hidden`}
            >
              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                              bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />

              <div className="flex items-start gap-4 relative">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${acento} flex-shrink-0`}>
                  {icono}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                    {tema.nombre}
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{tema.descripcion}</p>

                  {pct !== null && (
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-gray-200/70 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            pct >= 90 ? 'bg-emerald-500' : pct >= 70 ? 'bg-amber-500' : 'bg-red-400'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className={`text-xs font-medium flex-shrink-0 ${
                        pct >= 90 ? 'text-emerald-600' : pct >= 70 ? 'text-amber-600' : 'text-red-500'
                      }`}>
                        {pct}%
                      </span>
                    </div>
                  )}
                  {pct === null && intentadas === 0 && (
                    <div className="mt-3">
                      <span className="text-xs text-gray-400 bg-white/60 px-2 py-1 rounded-full">
                        Sin empezar
                      </span>
                    </div>
                  )}
                </div>
                <svg className="w-5 h-5 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          )
        })}
      </div>

      {filtrados.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-400">No se encontraron temas con ese nombre.</p>
        </div>
      )}
    </div>
  )
}
