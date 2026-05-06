import { Navigate, Outlet } from 'react-router-dom'
import { useAppStore } from '@/store'

export function ProtectedRoute() {
  const token = useAppStore((s) => s.token)
  if (!token) return <Navigate to="/login" replace />
  return <Outlet />
}
