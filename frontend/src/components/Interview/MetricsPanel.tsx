import { Badge } from '@/components/ui/badge'
import { formatDuration } from '@/utils/formatters'
import type { SessionMetrics } from '@/types'

interface MetricsPanelProps {
  metrics: SessionMetrics | null
  sessionElapsed: number
}

export function MetricsPanel({ metrics, sessionElapsed }: MetricsPanelProps) {
  const visual = metrics?.visualScores
  const audio = metrics?.audioScores

  const postureColor = {
    Good: 'bg-green-100 text-green-700',
    Fair: 'bg-yellow-100 text-yellow-700',
    Poor: 'bg-red-100 text-red-700',
  }

  const toneColor = {
    Confident: 'bg-green-100 text-green-700',
    Neutral: 'bg-gray-100 text-gray-700',
    Hesitant: 'bg-orange-100 text-orange-700',
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Session timer */}
      <div className="rounded-lg border bg-gray-900 p-3 text-center">
        <p className="text-xs text-gray-400">Session Time</p>
        <p className="text-2xl font-mono font-bold text-white">
          {formatDuration(sessionElapsed)}
        </p>
      </div>

      {/* Visual metrics */}
      <div className="rounded-xl border bg-white p-4 space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Visual Metrics
        </h3>

        <MetricRow
          label="Eye Contact"
          value={`${visual?.eyeContact ?? 0}%`}
          progress={visual?.eyeContact ?? 0}
        />

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Posture</span>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              postureColor[visual?.posture ?? 'Fair']
            }`}
          >
            {visual?.posture ?? '—'}
          </span>
        </div>

        <MetricRow
          label="Engagement"
          value={`${visual?.engagementLevel ?? 0}%`}
          progress={visual?.engagementLevel ?? 0}
        />

        <MetricRow
          label="Stress Level"
          value={`${visual?.stressLevel ?? 0}%`}
          progress={visual?.stressLevel ?? 0}
          invert
        />
      </div>

      {/* Audio metrics */}
      <div className="rounded-xl border bg-white p-4 space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Audio Metrics
        </h3>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Tone</span>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              toneColor[audio?.tone ?? 'Neutral']
            }`}
          >
            {audio?.tone ?? '—'}
          </span>
        </div>

        <MetricRow
          label="Speech Clarity"
          value={`${audio?.speechClarity ?? 0}%`}
          progress={audio?.speechClarity ?? 0}
        />

        <MetricRow
          label="Pitch Variation"
          value={`${audio?.pitchVariation ?? 0}%`}
          progress={audio?.pitchVariation ?? 0}
        />

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Speaking Pace</span>
          <Badge variant="outline" className="text-xs">
            {audio?.speakingPace ?? 0} wpm
          </Badge>
        </div>
      </div>
    </div>
  )
}

function MetricRow({
  label,
  value,
  progress,
  invert = false,
}: {
  label: string
  value: string
  progress: number
  invert?: boolean
}) {
  const color = invert
    ? progress < 40
      ? 'bg-green-500'
      : progress < 70
        ? 'bg-yellow-500'
        : 'bg-red-500'
    : progress >= 70
      ? 'bg-green-500'
      : progress >= 40
        ? 'bg-yellow-500'
        : 'bg-red-500'

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium text-gray-800">{value}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
