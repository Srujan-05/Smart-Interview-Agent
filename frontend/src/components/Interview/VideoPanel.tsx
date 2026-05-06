import { useEffect } from 'react'
import { Camera, CameraOff } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { formatDuration } from '@/utils/formatters'
import type { VisualScores } from '@/types'

interface VideoPanelProps {
  videoRef: React.RefObject<HTMLVideoElement | null>
  isPermitted: boolean
  questionTimer: number
  questionDuration: number
  confidenceScore: number
  visualScores?: VisualScores
}

export function VideoPanel({
  videoRef,
  isPermitted,
  questionTimer,
  questionDuration,
  confidenceScore,
  visualScores,
}: VideoPanelProps) {
  const eyeContactOk = (visualScores?.eyeContact ?? 0) >= 60

  useEffect(() => {
    if (videoRef.current && !videoRef.current.srcObject) {
      // stream will be attached by the hook
    }
  }, [videoRef])

  return (
    <div className="flex flex-col gap-4">
      {/* Video feed */}
      <div
        className={`relative overflow-hidden rounded-xl border-4 bg-gray-900 aspect-video transition-colors ${
          eyeContactOk ? 'border-green-400' : 'border-red-400'
        }`}
      >
        {isPermitted ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="h-full w-full object-cover mirror"
            style={{ transform: 'scaleX(-1)' }}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <CameraOff className="h-12 w-12 text-gray-500" />
          </div>
        )}

        {/* Eye contact indicator */}
        <div
          className={`absolute top-2 right-2 flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
            eyeContactOk
              ? 'bg-green-500/80 text-white'
              : 'bg-red-500/80 text-white'
          }`}
        >
          <Camera className="h-3 w-3" />
          {eyeContactOk ? 'Good eye contact' : 'Look at camera'}
        </div>
      </div>

      {/* Question timer */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Time elapsed</span>
          <span>
            {formatDuration(questionTimer)} / {formatDuration(questionDuration)}
          </span>
        </div>
        <Progress
          value={(questionTimer / questionDuration) * 100}
          className="h-1.5"
        />
      </div>

      {/* Confidence gauge */}
      <div className="rounded-lg border bg-white p-3 space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="font-medium text-gray-600">Confidence</span>
          <span className="font-semibold text-blue-600">{confidenceScore}%</span>
        </div>
        <Progress value={confidenceScore} className="h-2" />
      </div>
    </div>
  )
}
