import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react'
import { authApi } from '@/utils/api'
import { useAppStore } from '@/store'
import type { LoginRequest, RegisterRequest } from '@/types'

interface AuthContextValue {
  login: (data: LoginRequest) => Promise<void>
  logout: () => void
  register: (data: RegisterRequest) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000

export function AuthProvider({ children }: { children: ReactNode }) {
  const { setAuth, clearAuth } = useAppStore()
  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const resetTimer = () => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current)
    inactivityTimer.current = setTimeout(() => {
      clearAuth()
      window.location.href = '/login'
    }, INACTIVITY_TIMEOUT_MS)
  }

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click', 'scroll']
    events.forEach((e) => window.addEventListener(e, resetTimer))
    resetTimer()
    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer))
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current)
    }
  }, [])

  const login = async (data: LoginRequest) => {
    try {
      const res = await authApi.login(data)
      const { accessToken, user } = res.data
      localStorage.setItem('token', accessToken)
      setAuth(accessToken, user)
    } catch (error: unknown) {
      console.error('[Login Error]', error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    clearAuth()
  }

  const register = async (data: RegisterRequest) => {
    try {
      const res = await authApi.register(data)
      const { accessToken, user } = res.data
      localStorage.setItem('token', accessToken)
      setAuth(accessToken, user)
    } catch (error: unknown) {
      console.error('[Register Error]', error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider')
  return ctx
}
