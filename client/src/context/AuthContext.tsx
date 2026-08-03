import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { api, setToken, getToken, setUnauthorizedHandler } from '../api/client'
import type { Usuario } from '../types'

interface AuthContextType {
  usuario: Usuario | null
  cargando: boolean
  login: (email: string, password: string) => Promise<string | null>
  register: (email: string, nombre: string, password: string) => Promise<string | null>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    // Sesión expirada (401 en cualquier llamada): cerrar sesión
    setUnauthorizedHandler(() => setUsuario(null))

    const token = getToken()
    if (token) {
      api.auth.me().then((res) => {
        if (res.datos) {
          setUsuario(res.datos)
        } else {
          setToken(null)
        }
        setCargando(false)
      })
    } else {
      setCargando(false)
    }
    return () => setUnauthorizedHandler(null)
  }, [])

  async function login(email: string, password: string): Promise<string | null> {
    const res = await api.auth.login(email, password)
    if (res.datos) {
      setToken(res.datos.token)
      setUsuario(res.datos.usuario)
      return null
    }
    return res.error
  }

  async function register(email: string, nombre: string, password: string): Promise<string | null> {
    const res = await api.auth.register(email, nombre, password)
    if (res.datos) {
      setToken(res.datos.token)
      setUsuario(res.datos.usuario)
      return null
    }
    return res.error
  }

  function logout() {
    setToken(null)
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, cargando, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
