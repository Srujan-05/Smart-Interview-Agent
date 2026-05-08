import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Camera, Mic, CheckCircle, AlertCircle, Loader2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useMediaStream } from '@/hooks/useMediaStream'
import { useInterview } from '@/hooks/useInterview'
import { useAppStore } from '@/store'
import type { InterviewMode, DifficultyLevel } from '@/types'

const MODES: { value: InterviewMode; label: string; description: string }[] = [
  { value: 'Behavioral', label: 'Behavioral', description: 'STAR-based situational questions' },
  { value: 'Technical', label: 'Technical', description: 'Coding & system design' },
  { value: 'Mixed', label: 'Mixed', description: 'Balanced behavioural + technical' },
  { value: 'Mock', label: 'Mock Interview', description: 'Full 45-min interview simulation' },
]

const DIFFICULTIES: { value: DifficultyLevel; label: string }[] = [
  { value: 'Easy', label: 'Easy' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Hard', label: 'Hard' },
  { value: 'Adaptive', label: 'Adaptive' },
]

export function InterviewSetup() {
  const navigate = useNavigate()
  const location = useLocation()
  const currentSession = useAppStore((s) => s.currentSession)
  const setSession = useAppStore((s) => s.setSession)
  const [mode, setMode] = useState<InterviewMode>(
    (location.state as { mode?: InterviewMode } | null)?.mode ?? 'Behavioral',
  )
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Medium')
  const { stream, isPermitted, error: permError, videoRef, requestPermissions } =
    useMediaStream()
  const { begin, loading } = useInterview()

  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((t) => t.stop())
    }
  }, [stream])

  const handleStart = async () => {
    await begin({ mode, difficulty })
    navigate('/interview/session')
  }

  const handleResume = () => {
    navigate('/interview/session')
  }

  const handleStartNew = () => {
    setSession(null)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Interview Setup</h1>
        <p className="text-sm text-gray-500">Configure your practice session</p>
      </div>

      {/* Active session banner */}
      {currentSession && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-amber-900">You have an active session</p>
            <p className="text-sm text-amber-700 mt-1">
              Resume your interview or start a new one (this will discard your progress).
            </p>
            <div className="flex gap-3 mt-3">
              <Button
                onClick={handleResume}
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm"
              >
                Resume Session
              </Button>
              <Button
                onClick={handleStartNew}
                variant="outline"
                className="text-sm"
              >
                Start New
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mode selection */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Interview Mode</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          {MODES.map((m) => (
            <button
              key={m.value}
              onClick={() => setMode(m.value)}
              className={`rounded-xl border p-4 text-left transition-all ${
                mode === m.value
                  ? 'border-blue-400 bg-blue-50 ring-1 ring-blue-400'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <p className="font-semibold text-sm text-gray-900">{m.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{m.description}</p>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Difficulty selection */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Difficulty</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3 flex-wrap">
          {DIFFICULTIES.map((d) => (
            <button
              key={d.value}
              onClick={() => setDifficulty(d.value)}
              className={`rounded-lg border px-4 py-2 transition-all flex flex-col items-start ${
                difficulty === d.value
                  ? 'border-blue-400 bg-blue-500 text-white'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="text-sm font-medium">{d.label}</span>
              {d.value === 'Adaptive' && (
                <span
                  className={`text-xs mt-0.5 ${
                    difficulty === d.value ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  AI-driven · personalized
                </span>
              )}
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Media permissions */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Camera & Microphone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={requestPermissions}
              disabled={isPermitted}
            >
              {isPermitted ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Permissions granted
                </>
              ) : (
                <>
                  <Camera className="mr-2 h-4 w-4" />
                  Allow Camera & Mic
                </>
              )}
            </Button>
            {isPermitted && (
              <Badge className="bg-green-100 text-green-700 border-green-200 self-center">
                <Mic className="mr-1 h-3 w-3" /> Ready
              </Badge>
            )}
          </div>

          {permError && (
            <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {permError}
            </div>
          )}

          {/* Webcam preview */}
          {isPermitted && (
            <div className="overflow-hidden rounded-xl bg-gray-900 aspect-video max-w-sm">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="h-full w-full object-cover"
                style={{ transform: 'scaleX(-1)' }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Start */}
      <div className="flex justify-end">
        <Button
          className="bg-blue-500 hover:bg-blue-600 text-white px-8"
          onClick={handleStart}
          disabled={!isPermitted || loading}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Start Interview
        </Button>
      </div>
    </div>
  )
}
