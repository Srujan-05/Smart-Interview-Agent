import { useAuthContext } from '@/context/AuthContext'
import { useAppStore } from '@/store'

export function useAuth() {
  const { login, logout, register } = useAuthContext()
  const user = useAppStore((s) => s.user)
  const token = useAppStore((s) => s.token)

  return { user, token, isAuthenticated: !!token, login, logout, register }
}
