import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { interviewSocket } from '@/utils/websocket'
import { interviewApi } from '@/utils/api'
import { useAppStore } from '@/store'
import type {
  InterviewStartConfig,
  SessionMetrics,
  SubmitAnswerPayload,
} from '@/types'

interface InterviewContextValue {
  isRecording: boolean
  liveMetrics: SessionMetrics | null
  startSession: (config: InterviewStartConfig) => Promise<void>
  startRecording: () => void
  stopRecording: () => void
  submitAnswer: (payload: Omit<SubmitAnswerPayload, 'sessionId'>) => Promise<void>
  endSession: () => Promise<string | null>
  pauseSocket: () => void
  resumeSocket: () => void
  reconnectSocket: (sessionId: string) => void
  nextQuestion: () => void
}

const InterviewContext = createContext<InterviewContextValue | null>(null)

export function InterviewProvider({ children }: { children: ReactNode }) {
  const { currentSession, setSession, nextQuestion } = useAppStore()
  const [isRecording, setIsRecording] = useState(false)
  const [liveMetrics, setLiveMetrics] = useState<SessionMetrics | null>(null)

  const startSession = useCallback(async (config: InterviewStartConfig) => {
    const res = await interviewApi.start(config)
    setSession(res.data)
    interviewSocket.connect(res.data.id)
    interviewSocket.onMetrics(setLiveMetrics)
  }, [setSession])

  const startRecording = useCallback(() => setIsRecording(true), [])
  const stopRecording = useCallback(() => setIsRecording(false), [])

  const submitAnswer = useCallback(
    async (payload: Omit<SubmitAnswerPayload, 'sessionId'>) => {
      if (!currentSession) return
      await interviewApi.submitAnswer({ ...payload, sessionId: currentSession.id })
    },
    [currentSession],
  )

  const endSession = useCallback(async (): Promise<string | null> => {
    if (!currentSession) return null
    interviewSocket.disconnect()
    const sessionId = currentSession.id
    setSession(null)
    return sessionId
  }, [currentSession, setSession])

  const pauseSocket = useCallback(() => {
    interviewSocket.pause()
  }, [])

  const resumeSocket = useCallback(() => {
    interviewSocket.resume()
  }, [])

  const reconnectSocket = useCallback((sessionId: string) => {
    interviewSocket.reconnectSocket(sessionId)
    interviewSocket.onMetrics(setLiveMetrics)
  }, [])

  return (
    <InterviewContext.Provider
      value={{
        isRecording,
        liveMetrics,
        startSession,
        startRecording,
        stopRecording,
        submitAnswer,
        endSession,
        pauseSocket,
        resumeSocket,
        reconnectSocket,
        nextQuestion,
      }}
    >
      {children}
    </InterviewContext.Provider>
  )
}

export function useInterviewContext() {
  const ctx = useContext(InterviewContext)
  if (!ctx)
    throw new Error('useInterviewContext must be used within InterviewProvider')
  return ctx
}
