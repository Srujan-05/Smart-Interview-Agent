import { useState, useEffect } from 'react'
import { Square, Lightbulb, SkipForward } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { InterviewQuestion } from '@/types'

interface QuestionPanelProps {
  question: InterviewQuestion
  questionNumber: number
  totalQuestions: number
  transcription: string
  isRecording: boolean
  hintsUsed: number
  maxHints: number
  thinkTimeLeft: number
  onStartRecording: () => void
  onStopRecording: () => void
  onSkip: () => void
  onHint: () => void
}

const DIFFICULTY_COLORS = {
  Easy: 'bg-green-100 text-green-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Hard: 'bg-red-100 text-red-700',
  Adaptive: 'bg-purple-100 text-purple-700',
}

const TYPE_COLORS = {
  Technical: 'bg-blue-100 text-blue-700',
  Behavioral: 'bg-orange-100 text-orange-700',
  Situational: 'bg-teal-100 text-teal-700',
}

export function QuestionPanel({
  question,
  questionNumber,
  totalQuestions,
  transcription,
  isRecording,
  hintsUsed,
  maxHints,
  thinkTimeLeft,
  onStartRecording,
  onStopRecording,
  onSkip,
  onHint,
}: QuestionPanelProps) {
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    setShowHint(false)
  }, [question.id])

  const handleHint = () => {
    if (hintsUsed < maxHints && question.hint) {
      setShowHint(true)
      onHint()
    }
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          Question {questionNumber} of {totalQuestions}
        </span>
        <div className="flex gap-2">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${TYPE_COLORS[question.type]}`}
          >
            {question.type}
          </span>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${DIFFICULTY_COLORS[question.difficulty]}`}
          >
            {question.difficulty}
          </span>
        </div>
      </div>

      {/* Think time countdown */}
      {thinkTimeLeft > 0 && !isRecording && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-center">
          <p className="text-xs text-amber-600 font-medium">Think time</p>
          <p className="text-2xl font-bold text-amber-700">{thinkTimeLeft}s</p>
        </div>
      )}

      {/* Question */}
      <div className="flex-1 rounded-xl border bg-white p-5 shadow-sm">
        <p className="text-lg font-semibold leading-relaxed text-gray-900">
          {question.text}
        </p>
      </div>

      {/* Hint */}
      {showHint && question.hint && (
        <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
          <p className="text-xs font-semibold text-blue-700 mb-1">Hint</p>
          <p className="text-sm text-blue-600">{question.hint}</p>
        </div>
      )}

      {/* Live transcription */}
      {isRecording && (
        <div className="rounded-lg border bg-gray-50 p-3 min-h-[80px]">
          <p className="text-xs text-gray-400 mb-1">Live transcription</p>
          <p className="text-sm text-gray-700 italic">
            {transcription || 'Listening...'}
          </p>
        </div>
      )}

      {/* Recording indicator */}
      {isRecording && (
        <div className="flex items-center gap-2 text-red-500">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-medium">Recording</span>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-2">
        {!isRecording ? (
          <Button
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
            onClick={onStartRecording}
            disabled={thinkTimeLeft > 0}
          >
            Start Answer
          </Button>
        ) : (
          <Button
            className="flex-1 bg-red-500 hover:bg-red-600 text-white"
            onClick={onStopRecording}
          >
            <Square className="mr-2 h-4 w-4" />
            Stop Recording
          </Button>
        )}

        <Button
          variant="outline"
          size="icon"
          onClick={handleHint}
          disabled={hintsUsed >= maxHints || !question.hint}
          title={`Hint (${maxHints - hintsUsed} left)`}
        >
          <Lightbulb className="h-4 w-4 text-amber-500" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={onSkip}
          title="Skip question"
        >
          <SkipForward className="h-4 w-4" />
        </Button>
      </div>

      {hintsUsed > 0 && (
        <Badge variant="outline" className="self-start text-xs text-amber-600 border-amber-300">
          {hintsUsed}/{maxHints} hints used
        </Badge>
      )}
    </div>
  )
}
