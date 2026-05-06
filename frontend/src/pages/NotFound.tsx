import { useNavigate } from 'react-router-dom'
import { Brain } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-center p-4">
      <Brain className="mb-4 h-16 w-16 text-blue-200" />
      <h1 className="text-6xl font-bold text-gray-200">404</h1>
      <p className="mt-2 text-lg font-semibold text-gray-700">Page not found</p>
      <p className="mt-1 text-sm text-gray-500">
        The page you're looking for doesn't exist.
      </p>
      <Button
        className="mt-6 bg-blue-500 hover:bg-blue-600 text-white"
        onClick={() => navigate('/')}
      >
        Back to Dashboard
      </Button>
    </div>
  )
}
