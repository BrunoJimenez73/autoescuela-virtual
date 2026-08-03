import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import type { Senal } from '../../types'

const coloresCategoria: Record<string, { bg: string; text: string; dot: string }> = {
  'Reglamentación': { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  'Prohibición': { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  'Obligación': { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  'Peligro': { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  'Indicación': { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
  'Prioridad': { bg: 'bg-yellow-50', text: 'text-yellow-700', dot: 'bg-yellow-500' },
  'Servicio': { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
}

function SenalImg({ imagen }: { imagen: string }) {
  const [rota, setRota] = useState(false)
  if (rota || !imagen) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-300" title="Imagen no disponible">
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    )
  }
  return <img src={imagen} alt="" className="w-full h-full object-contain" onError={() => setRota(true)} />
}

export default function Senales() {
  const [senales, setSenales] = useState<Senal[]>([])
  const [cargando, setCargando] = useState(true)
  const [categoria, setCategoria] = useState('Todas')
  const [busqueda, setBusqueda] = useState('')
  const [senalSeleccionada, setSenalSeleccionada] = useState<Senal | null>(null)

  useEffect(() => {
    api.senales.list().then(res => {
      if (res.datos) setSenales(res.datos)
      setCargando(false)
    })
  }, [])

  const categorias = ['Todas', ...Array.from(new Set(senales.map(s => s.categoria)))]
  const filtradas = senales.filter(s => {
    if (categoria !== 'Todas' && s.categoria !== categoria) return false
    if (busqueda && !s.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
        !s.significado.toLowerCase().includes(busqueda.toLowerCase())) return false
    return true
  })

  if (cargando) {
    return (
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Señales de Tráfico
        </h1>
        <p className="text-gray-500 text-lg">
          Catálogo completo de señales verticales. {senales.length} señales disponibles.
        </p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text" value={busqueda} onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar señal..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm
                       placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                       shadow-sm hover:shadow-md transition-shadow"
          />
        </div>
      </div>

      {/* Category chips */}
      <div className="flex gap-2 flex-wrap">
        {categorias.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoria(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              categoria === cat
                ? 'bg-gray-900 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:shadow-sm'
            }`}
          >
            {cat}
            {cat !== 'Todas' && (
              <span className="ml-1.5 text-xs opacity-60">
                ({senales.filter(s => s.categoria === cat).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtradas.map((senal: Senal) => {
          const colores = coloresCategoria[senal.categoria] || { bg: 'bg-gray-50', text: 'text-gray-700', dot: 'bg-gray-400' }

          return (
            <button
              key={senal.id}
              onClick={() => setSenalSeleccionada(senal)}
              className="group bg-white rounded-2xl border border-gray-200/70 p-5 text-left
                         hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0
                         transition-all duration-200 overflow-hidden relative"
            >
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 flex-shrink-0 bg-gray-50 rounded-xl p-1.5 group-hover:bg-gray-100 transition-colors">
                  <SenalImg imagen={senal.imagen} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full ${colores.dot} flex-shrink-0`} />
                    <span className={`text-xs font-medium ${colores.text}`}>{senal.categoria}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {senal.nombre}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                    {senal.significado}
                  </p>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {filtradas.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-400">No se encontraron señales.</p>
        </div>
      )}

      {/* Modal de detalle */}
      {senalSeleccionada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSenalSeleccionada(null)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 lg:p-8
                       animate-[fadeIn_0.2s_ease-out]"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSenalSeleccionada(null)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full
                         bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex items-start gap-5">
              <div className="w-28 h-28 flex-shrink-0 bg-gray-50 rounded-xl p-2">
                <SenalImg imagen={senalSeleccionada.imagen} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-2.5 h-2.5 rounded-full ${coloresCategoria[senalSeleccionada.categoria]?.dot || 'bg-gray-400'}`} />
                  <span className={`text-xs font-medium ${coloresCategoria[senalSeleccionada.categoria]?.text || 'text-gray-600'}`}>
                    {senalSeleccionada.categoria}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900">{senalSeleccionada.nombre}</h2>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Descripción</h4>
                <p className="text-gray-700">{senalSeleccionada.descripcion}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Significado</h4>
                <p className="text-gray-900 font-medium">{senalSeleccionada.significado}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
