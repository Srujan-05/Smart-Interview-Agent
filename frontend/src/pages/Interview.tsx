import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { VideoPanel } from '@/components/Interview/VideoPanel'
import { QuestionPanel } from '@/components/Interview/QuestionPanel'
import { LoadingSpinner } from '@/components/Common/LoadingSpinner'
import { useInterview } from '@/hooks/useInterview'
import { useMediaStream } from '@/hooks/useMediaStream'
import { useInterviewContext } from '@/context/InterviewContext'
import { useAppStore } from '@/store'

const QUESTION_DURATION = 120 // 2 minutes
const THINK_TIME = 30

export function Interview() {
  const navigate = useNavigate()
  const { liveMetrics, submitAnswer, finish } = useInterview()
  const { pauseSocket, resumeSocket, nextQuestion } = useInterviewContext()
  const currentSession = useAppStore((s) => s.currentSession)
  const { videoRef, isPermitted, requestPermissions, startRecording, stopRecording, transcript, resetTranscript } =
    useMediaStream()

  const [questionTimer, setQuestionTimer] = useState(0)
  const [sessionElapsed, setSessionElapsed] = useState(0)
  const [thinkTimeLeft, setThinkTimeLeft] = useState(THINK_TIME)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [isRecordingLocal, setIsRecordingLocal] = useState(false)
  const [answerSubmitted, setAnswerSubmitted] = useState(false)

  const currentQuestion =
    currentSession?.questions[currentSession.currentQuestionIndex]

  useEffect(() => {
    if (!isPermitted) requestPermissions()
  }, [isPermitted, requestPermissions])

  // WebSocket lifecycle: resume on mount, pause on unmount
  useEffect(() => {
    if (currentSession) {
      resumeSocket()
    }
    return () => {
      pauseSocket()
    }
  }, [currentSession, pauseSocket, resumeSocket])

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
      transcription: transcript,
      duration: questionTimer,
      retakeCount: 0,
      metrics: liveMetrics,
    })

    setAnswerSubmitted(true)
  }, [stopRecording, currentQuestion, liveMetrics, submitAnswer, transcript, questionTimer])

  const handleSkip = useCallback(async () => {
    if (!currentQuestion || !liveMetrics) return
    await submitAnswer({
      questionId: currentQuestion.id,
      transcription: '',
      duration: 0,
      retakeCount: 0,
      metrics: liveMetrics,
    })
    setAnswerSubmitted(true)
  }, [currentQuestion, liveMetrics, submitAnswer])

  const handleNextQuestion = useCallback(() => {
    nextQuestion()
    setAnswerSubmitted(false)
    setQuestionTimer(0)
    setThinkTimeLeft(THINK_TIME)
    resetTranscript()
    setHintsUsed(0)
  }, [nextQuestion, resetTranscript])

  const handleExit = useCallback(async () => {
    if (window.confirm('Exit interview? Your answers so far will be saved.')) {
      const feedbackData = await finish()
      if (feedbackData) {
        navigate(`/interview/feedback/${feedbackData.sessionId}`)
      } else {
        navigate('/')
      }
    }
  }, [finish, navigate])

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
    <div className="grid h-full grid-cols-[280px_1fr_220px] gap-4">
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
        transcription={transcript}
        isRecording={isRecordingLocal}
        hintsUsed={hintsUsed}
        maxHints={3}
        thinkTimeLeft={thinkTimeLeft}
        onStartRecording={handleStartRecording}
        onStopRecording={handleStopRecording}
        onSkip={handleSkip}
        onHint={() => setHintsUsed((n) => n + 1)}
      />

      {/* Right: Session Info & Controls */}
      <div className="space-y-4">
        {/* Session Timer */}
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs font-semibold text-gray-600">SESSION TIME</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {Math.floor(sessionElapsed / 60)}:{String(sessionElapsed % 60).padStart(2, '0')}
          </p>
        </div>

        {/* Progress */}
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs font-semibold text-gray-600">PROGRESS</p>
          <p className="mt-2 text-lg font-semibold text-gray-900">
            Q {currentSession.currentQuestionIndex + 1} of {currentSession.questions.length}
          </p>
          <div className="mt-3 h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-blue-500 transition-all"
              style={{
                width: `${((currentSession.currentQuestionIndex + 1) / currentSession.questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Next/Finish Button */}
        {answerSubmitted && !isLastQuestion && (
          <button
            className="w-full rounded-lg bg-blue-500 py-2.5 text-sm font-semibold text-white hover:bg-blue-600 transition-colors"
            onClick={handleNextQuestion}
          >
            Next Question →
          </button>
        )}

        {isLastQuestion && answerSubmitted && (
          <button
            className="w-full rounded-lg bg-green-500 py-2.5 text-sm font-semibold text-white hover:bg-green-600 transition-colors"
            onClick={handleFinish}
          >
            Finish & Get Feedback
          </button>
        )}

        {/* Exit Button */}
        <button
          className="w-full rounded-lg border border-red-300 bg-white py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
          onClick={handleExit}
        >
          Exit Interview
        </button>
      </div>
    </div>
  )
}
