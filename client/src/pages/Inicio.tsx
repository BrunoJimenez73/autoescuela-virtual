import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Inicio() {
  const { usuario } = useAuth()

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Bienvenido, {usuario?.nombre}!</h1>
        <p className="text-blue-100 text-lg">
          Prepárate para el examen teórico de conducir. Estudia, practica y mejora.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/estudiar"
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="text-3xl mb-3">📖</div>
          <h2 className="font-semibold text-lg">Manual de Estudio</h2>
          <p className="text-gray-500 text-sm mt-1">Normas, señales, velocidades y más</p>
        </Link>

        <Link to="/senales"
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="text-3xl mb-3">🛑</div>
          <h2 className="font-semibold text-lg">Señales de Tráfico</h2>
          <p className="text-gray-500 text-sm mt-1">Catálogo completo con imágenes SVG</p>
        </Link>

        <Link to="/examenes/nuevo"
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="text-3xl mb-3">📝</div>
          <h2 className="font-semibold text-lg">Simulacro de Examen</h2>
          <p className="text-gray-500 text-sm mt-1">Ponte a prueba con preguntas reales</p>
        </Link>

        <Link to="/progreso"
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="text-3xl mb-3">📊</div>
          <h2 className="font-semibold text-lg">Mi Progreso</h2>
          <p className="text-gray-500 text-sm mt-1">Evolución, aciertos y puntos débiles</p>
        </Link>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="font-semibold text-lg mb-3">🏁 Empieza aquí</h2>
        <div className="space-y-3">
          <p className="text-gray-600">
            Si eres nuevo, te recomendamos empezar por el <Link to="/estudiar" className="text-blue-600 hover:underline">manual de estudio</Link>
            , luego repasar las <Link to="/senales" className="text-blue-600 hover:underline">señales</Link>,
            y finalmente hacer <Link to="/examenes/nuevo" className="text-blue-600 hover:underline">simulacros de examen</Link>.
          </p>
          <p className="text-gray-600">
            El sistema adaptativo detectará tus puntos débiles y generará tests personalizados para que mejores.
          </p>
        </div>
      </div>
    </div>
  )
}
