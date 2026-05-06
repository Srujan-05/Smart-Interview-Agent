import { cn } from '@/lib/utils'
import { getMatchScoreColor } from '@/utils/formatters'

interface MatchScoreBadgeProps {
  score: number
  className?: string
}

export function MatchScoreBadge({ score, className }: MatchScoreBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        getMatchScoreColor(score),
        className,
      )}
    >
      {score}% match
    </span>
  )
}
