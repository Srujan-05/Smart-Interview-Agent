import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { VideoPanel } from '@/components/Interview/VideoPanel'
import { QuestionPanel } from '@/components/Interview/QuestionPanel'
import { MetricsPanel } from '@/components/Interview/MetricsPanel'
import { LoadingSpinner } from '@/components/Common/LoadingSpinner'
import { useInterview } from '@/hooks/useInterview'
import { useMediaStream } from '@/hooks/useMediaStream'
import { useAppStore } from '@/store'

const QUESTION_DURATION = 120 // 2 minutes
const THINK_TIME = 30

export function Interview() {
  const navigate = useNavigate()
  const { liveMetrics, submitAnswer, finish } = useInterview()
  const currentSession = useAppStore((s) => s.currentSession)
  const { videoRef, isPermitted, requestPermissions, startRecording, stopRecording } =
    useMediaStream()

  const [questionTimer, setQuestionTimer] = useState(0)
  const [sessionElapsed, setSessionElapsed] = useState(0)
  const [thinkTimeLeft, setThinkTimeLeft] = useState(THINK_TIME)
  const [transcription, setTranscription] = useState('')
  const [hintsUsed, setHintsUsed] = useState(0)
  const [isRecordingLocal, setIsRecordingLocal] = useState(false)

  const currentQuestion =
    currentSession?.questions[currentSession.currentQuestionIndex]

  useEffect(() => {
    if (!isPermitted) requestPermissions()
  }, [isPermitted, requestPermissions])

  // Session timer
  useEffect(() => {
    const t = setInterval(() => setSessionElapsed((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [])

  // Think time countdown
  useEffect(() => {
    if (thinkTimeLeft <= 0 || isRecordingLocal) return
    const t = setTimeout(() => setThinkTimeLeft((n) => n - 1), 1000)
    return () => clearTimeout(t)
  }, [thinkTimeLeft, isRecordingLocal])

  // Question timer
  useEffect(() => {
    if (!isRecordingLocal) return
    const t = setInterval(() => setQuestionTimer((s) => s + 1), 1000)
    return () => clearInterval(t)
  }, [isRecordingLocal])

  const handleStartRecording = useCallback(() => {
    setIsRecordingLocal(true)
    startRecording()
  }, [startRecording])

  const handleStopRecording = useCallback(async () => {
    setIsRecordingLocal(false)
    await stopRecording()
    if (!currentQuestion || !liveMetrics) return

    await submitAnswer({
      questionId: currentQuestion.id,
      transcription,
      duration: questionTimer,
      retakeCount: 0,
      metrics: liveMetrics,
    })

    // Reset for next question
    setQuestionTimer(0)
    setThinkTimeLeft(THINK_TIME)
    setTranscription('')
  }, [stopRecording, currentQuestion, liveMetrics, submitAnswer, transcription, questionTimer])

  const handleSkip = useCallback(async () => {
    if (!currentQuestion || !liveMetrics) return
    await submitAnswer({
      questionId: currentQuestion.id,
      transcription: '',
      duration: 0,
      retakeCount: 0,
      metrics: liveMetrics,
    })
    setQuestionTimer(0)
    setThinkTimeLeft(THINK_TIME)
    setTranscription('')
  }, [currentQuestion, liveMetrics, submitAnswer])

  const handleFinish = useCallback(async () => {
    const feedbackData = await finish()
    if (feedbackData) {
      navigate(`/interview/feedback/${feedbackData.sessionId}`)
    } else {
      navigate('/')
    }
  }, [finish, navigate])

  const isLastQuestion =
    currentSession &&
    currentSession.currentQuestionIndex >= currentSession.questions.length - 1

  if (!currentSession) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-gray-500">No active session. Please start a new interview.</p>
          <button
            className="text-blue-500 underline text-sm"
            onClick={() => navigate('/interview/setup')}
          >
            Go to Setup
          </button>
        </div>
      </div>
    )
  }

  if (!currentQuestion) {
    return <LoadingSpinner label="Loading questions..." className="py-20" />
  }

  return (
    <div className="grid h-full grid-cols-[280px_1fr_260px] gap-4">
      {/* Left: Video */}
      <VideoPanel
        videoRef={videoRef}
        isPermitted={isPermitted}
        questionTimer={questionTimer}
        questionDuration={QUESTION_DURATION}
        confidenceScore={liveMetrics?.audioScores.pitchVariation ?? 0}
        visualScores={liveMetrics?.visualScores}
      />

      {/* Middle: Question */}
      <QuestionPanel
        question={currentQuestion}
        questionNumber={currentSession.currentQuestionIndex + 1}
        totalQuestions={currentSession.questions.length}
        transcription={transcription}
        isRecording={isRecordingLocal}
        hintsUsed={hintsUsed}
        maxHints={3}
        thinkTimeLeft={thinkTimeLeft}
        onStartRecording={handleStartRecording}
        onStopRecording={handleStopRecording}
        onSkip={handleSkip}
        onHint={() => setHintsUsed((n) => n + 1)}
      />

      {/* Right: Metrics */}
      <div className="space-y-4">
        <MetricsPanel metrics={liveMetrics} sessionElapsed={sessionElapsed} />

        {isLastQuestion && (
          <button
            className="w-full rounded-lg bg-green-500 py-2.5 text-sm font-semibold text-white hover:bg-green-600 transition-colors"
            onClick={handleFinish}
          >
            Finish & Get Feedback
          </button>
        )}
      </div>
    </div>
  )
}
