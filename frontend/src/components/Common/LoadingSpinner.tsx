import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  label?: string
  className?: string
}

export function LoadingSpinner({ label, className }: LoadingSpinnerProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      {label && <p className="text-sm text-gray-500">{label}</p>}
    </div>
  )
}
