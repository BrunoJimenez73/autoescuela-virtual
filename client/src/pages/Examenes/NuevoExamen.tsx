import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api/client'

export default function NuevoExamen() {
  const navigate = useNavigate()
  const [numPreguntas, setNumPreguntas] = useState(30)
  const [modalidad, setModalidad] = useState<'normal' | 'adaptativo'>('normal')
  const [creando, setCreando] = useState(false)

  async function handleStart() {
    setCreando(true)
    const res = await api.examenes.crear(numPreguntas, modalidad)
    setCreando(false)

    if (res.datos) {
      navigate(`/examenes/${res.datos.id}/realizar`)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">📝 Nuevo Simulacro</h1>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número de preguntas
          </label>
          <div className="flex gap-2">
            {[10, 20, 30, 50].map(n => (
              <button
                key={n}
                onClick={() => setNumPreguntas(n)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  numPreguntas === n
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Modalidad</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setModalidad('normal')}
              className={`p-4 rounded-xl border-2 text-left transition-colors ${
                modalidad === 'normal'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-semibold">🎲 Normal</div>
              <p className="text-sm text-gray-500 mt-1">Preguntas aleatorias de todos los temas</p>
            </button>
            <button
              onClick={() => setModalidad('adaptativo')}
              className={`p-4 rounded-xl border-2 text-left transition-colors ${
                modalidad === 'adaptativo'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-semibold">🎯 Adaptativo</div>
              <p className="text-sm text-gray-500 mt-1">Enfocado en tus puntos débiles</p>
            </button>
          </div>
        </div>

        <button
          onClick={handleStart} disabled={creando}
          className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors text-lg"
        >
          {creando ? 'Preparando examen...' : 'Comenzar Examen'}
        </button>
      </div>

      {modalidad === 'adaptativo' && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl text-sm text-yellow-800">
          💡 El modo adaptativo selecciona preguntas de los temas donde has fallado más,
          priorizando las que llevas más tiempo sin practicar.
        </div>
      )}
    </div>
  )
}
