import { useCallback, useState } from 'react'
import { interviewApi } from '@/utils/api'
import { useAppStore } from '@/store'
import { useInterviewContext } from '@/context/InterviewContext'
import type { FeedbackReport, InterviewStartConfig } from '@/types'

export function useInterview() {
  const { startSession, submitAnswer, endSession, isRecording, liveMetrics } =
    useInterviewContext()
  const currentSession = useAppStore((s) => s.currentSession)
  const sessionHistory = useAppStore((s) => s.sessionHistory)
  const setSessionHistory = useAppStore((s) => s.setSessionHistory)

  const [feedback, setFeedback] = useState<FeedbackReport | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const begin = useCallback(
    async (config: InterviewStartConfig) => {
      setLoading(true)
      setError(null)
      try {
        await startSession(config)
      } catch {
        setError('Failed to start interview session')
      } finally {
        setLoading(false)
      }
    },
    [startSession],
  )

  const finish = useCallback(async () => {
    const sessionId = await endSession()
    if (!sessionId) return null

    setLoading(true)
    try {
      const res = await interviewApi.getFeedback(sessionId)
      setFeedback(res.data)

      const histRes = await interviewApi.getSessions()
      setSessionHistory(histRes.data)

      return res.data
    } catch {
      setError('Failed to load feedback')
      return null
    } finally {
      setLoading(false)
    }
  }, [endSession, setSessionHistory])

  return {
    currentSession,
    sessionHistory,
    feedback,
    isRecording,
    liveMetrics,
    loading,
    error,
    begin,
    submitAnswer,
    finish,
  }
}
