import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../../api/client'
import type { TemaData, TemaInfo } from '../../types'

function extraerTitulos(html: string): { texto: string; nivel: number; id: string }[] {
  const titulos: { texto: string; nivel: number; id: string }[] = []
  const regex = /<h([2-3])(?:\s[^>]*)?>(.*?)<\/h[2-3]>/gi
  let match
  while ((match = regex.exec(html)) !== null) {
    const texto = match[2].replace(/<[^>]+>/g, '').trim()
    const id = texto.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    titulos.push({ texto, nivel: parseInt(match[1]), id })
  }
  return titulos
}

function asignarIdsContenido(html: string): string {
  return html.replace(/<h([2-3])([^>]*)>(.*?)<\/h[2-3]>/gi, (_, nivel, attrs, texto) => {
    const limpio = texto.replace(/<[^>]+>/g, '').trim()
    const id = limpio.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    return `<h${nivel}${attrs} id="${id}">${texto}</h${nivel}>`
  })
}

export default function Tema() {
  const { slug } = useParams()
  const [data, setData] = useState<TemaData | null>(null)
  const [todosTemas, setTodosTemas] = useState<TemaInfo[]>([])
  const [cargando, setCargando] = useState(true)
  const [progresoLectura, setProgresoLectura] = useState(0)
  const [tocAbierto, setTocAbierto] = useState(false)
  const [tituloActivo, setTituloActivo] = useState('')
  const contentRef = useRef<HTMLDivElement>(null)
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!slug) return
    setCargando(true)
    setProgresoLectura(0)
    setTituloActivo('')

    Promise.all([
      api.manual.get(slug),
      api.manual.index(),
    ]).then(([res, idxRes]) => {
      if (res.datos) setData(res.datos)
      if (idxRes.datos) setTodosTemas(idxRes.datos)
      setCargando(false)
    })
  }, [slug])

  // Reading progress
  useEffect(() => {
    const handleScroll = () => {
      if (!mainRef.current) return
      const { top, height } = mainRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const total = height - windowHeight
      const current = -top
      const pct = total > 0 ? Math.min(Math.round((current / total) * 100), 100) : 100
      setProgresoLectura(pct)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Active heading tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setTituloActivo(entry.target.id)
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    )

    if (contentRef.current) {
      contentRef.current.querySelectorAll('h2[id], h3[id]').forEach(el => observer.observe(el))
    }

    return () => observer.disconnect()
  }, [data])

  const titulos = data?.secciones.flatMap(s => extraerTitulos(s.contenido)) || []

  const scrollToHeading = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setTocAbierto(false)
    }
  }, [])

  const indiceActual = todosTemas.findIndex(t => t.slug === slug)
  const temaAnterior = indiceActual > 0 ? todosTemas[indiceActual - 1] : null
  const temaSiguiente = indiceActual < todosTemas.length - 1 ? todosTemas[indiceActual + 1] : null

  if (cargando) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 w-3/4 bg-gray-200 rounded animate-pulse" />
        <div className="space-y-3">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-4 bg-gray-100 rounded animate-pulse" style={{ width: `${60 + Math.random() * 40}%` }} />
          ))}
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <p className="text-gray-400">Tema no encontrado</p>
        <Link to="/estudiar" className="text-blue-600 hover:underline mt-2 inline-block">
          Volver al manual
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-gray-100">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-150"
          style={{ width: `${progresoLectura}%` }}
        />
      </div>

      {/* Mobile TOC toggle */}
      <button
        onClick={() => setTocAbierto(!tocAbierto)}
        className="lg:hidden fixed bottom-6 right-6 z-40 w-14 h-14 bg-white border border-gray-200
                   rounded-full shadow-lg flex items-center justify-center text-gray-700
                   hover:shadow-xl active:scale-95 transition-all"
      >
        {tocAbierto ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Mobile TOC overlay */}
      {tocAbierto && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/20" onClick={() => setTocAbierto(false)} />
      )}

      {/* Mobile TOC drawer */}
      <div className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white rounded-t-2xl shadow-2xl
                       max-h-[60vh] overflow-auto transition-transform duration-300 ${
        tocAbierto ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between">
          <span className="font-semibold text-sm text-gray-900">Contenido</span>
          <button onClick={() => setTocAbierto(false)} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-5 space-y-1">
          {titulos.map((t, i) => (
            <button
              key={i}
              onClick={() => scrollToHeading(t.id)}
              className={`block w-full text-left text-sm py-2 px-3 rounded-lg transition-colors ${
                t.nivel === 2 ? 'font-medium' : 'ml-4 text-gray-500'
              } ${tituloActivo === t.id ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-gray-50'}`}
            >
              {t.texto}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-8 lg:gap-12 relative">
        {/* Desktop TOC sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0 relative">
          <div className="sticky top-24 space-y-6" style={{ maxHeight: 'calc(100vh - 8rem)', overflowY: 'auto' }}>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Link to="/estudiar" className="hover:text-blue-600 transition-colors">Manual</Link>
              <span>/</span>
              <span className="text-gray-700 font-medium truncate">{data.tema}</span>
            </div>

            {/* TOC */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
                En esta página
              </h3>
              <nav className="space-y-0.5">
                {titulos.map((t, i) => (
                  <button
                    key={`${t.id}-${i}`}
                    onClick={() => scrollToHeading(t.id)}
                    className={`block w-full text-left text-sm py-1.5 px-3 rounded-lg transition-all duration-150 ${
                      t.nivel === 2 ? 'font-medium' : 'ml-4 text-gray-500 text-xs'
                    } ${
                      tituloActivo === t.id
                        ? 'bg-blue-50 text-blue-700 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {t.texto}
                  </button>
                ))}
              </nav>
            </div>

            {/* Progress in topic */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-xs text-gray-400 mb-2">Progreso de lectura</div>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-150"
                  style={{ width: `${progresoLectura}%` }}
                />
              </div>
              <div className="text-xs text-gray-400 mt-1.5 text-right">{progresoLectura}%</div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div ref={mainRef} className="flex-1 min-w-0">
          {/* Title */}
          <div className="mb-8">
            <div className="lg:hidden flex items-center gap-2 text-sm text-gray-400 mb-4">
              <Link to="/estudiar" className="hover:text-blue-600 transition-colors">Manual</Link>
              <span>/</span>
              <span className="text-gray-700 font-medium">{data.tema}</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
              {data.tema}
            </h1>
          </div>

          {/* Sections */}
          <div ref={contentRef} className="space-y-6">
            {data.secciones.map((s) => (
              <article
                key={s.id}
                className="bg-white rounded-2xl border border-gray-200/70 p-6 lg:p-8 shadow-sm
                           hover:shadow-md transition-shadow duration-200"
              >
                <div
                  className="prose-estudio max-w-none"
                  dangerouslySetInnerHTML={{ __html: asignarIdsContenido(s.contenido) }}
                />
              </article>
            ))}
          </div>

          {/* Previous/Next navigation */}
          <div className="mt-10 mb-8 flex gap-4">
            {temaAnterior ? (
              <Link
                to={`/estudiar/${temaAnterior.slug}`}
                className="flex-1 group bg-white border border-gray-200 rounded-2xl p-5
                           hover:shadow-md hover:border-gray-300 transition-all"
              >
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Anterior</span>
                <span className="block mt-1 font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                  ← {temaAnterior.nombre}
                </span>
              </Link>
            ) : <div className="flex-1" />}

            {temaSiguiente ? (
              <Link
                to={`/estudiar/${temaSiguiente.slug}`}
                className="flex-1 group bg-white border border-gray-200 rounded-2xl p-5 text-right
                           hover:shadow-md hover:border-gray-300 transition-all"
              >
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Siguiente</span>
                <span className="block mt-1 font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                  {temaSiguiente.nombre} →
                </span>
              </Link>
            ) : <div className="flex-1" />}
          </div>
        </div>
      </div>
    </div>
  )
}
