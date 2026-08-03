import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Inicio from './pages/Inicio'
import Temas from './pages/Estudiar/Temas'
import Tema from './pages/Estudiar/Tema'
import Senales from './pages/Estudiar/Senales'
import NuevoExamen from './pages/Examenes/NuevoExamen'
import Realizar from './pages/Examenes/Realizar'
import Resultado from './pages/Examenes/Resultado'
import Historial from './pages/Examenes/Historial'
import Dashboard from './pages/Progreso/Dashboard'
import Layout from './components/Layout'
import type { ReactNode } from 'react'

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { usuario, cargando } = useAuth()
  if (cargando) return <div className="flex items-center justify-center min-h-screen"><Cargando /></div>
  if (!usuario) return <Navigate to="/login" replace />
  return <>{children}</>
}

function Cargando() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Inicio />} />
            <Route path="estudiar" element={<Temas />} />
            <Route path="estudiar/:slug" element={<Tema />} />
            <Route path="senales" element={<Senales />} />
            <Route path="examenes/nuevo" element={<NuevoExamen />} />
            <Route path="examenes/historial" element={<Historial />} />
            <Route path="examenes/:id/realizar" element={<Realizar />} />
            <Route path="examenes/:id/resultado" element={<Resultado />} />
            <Route path="progreso" element={<Dashboard />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
