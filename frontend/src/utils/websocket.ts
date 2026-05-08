import type { SessionMetrics } from '@/types'

type MetricsCallback = (metrics: SessionMetrics) => void

export class InterviewWebSocket {
  private ws: WebSocket | null = null
  private metricsCallback: MetricsCallback | null = null
  private reconnectAttempts = 0
  private readonly maxReconnects = 3
  private sessionId: string | null = null
  private paused = false

  connect(sessionId: string) {
    if (this.paused) return
    if (this.ws && this.ws.readyState === WebSocket.OPEN) return

    this.sessionId = sessionId
    const token = localStorage.getItem('token')
    if (!token) {
      console.error('No authentication token found')
      return
    }
    const wsUrl =
      (import.meta.env.VITE_WS_URL ?? 'ws://localhost:8000') +
      `/ws/interview?sessionId=${sessionId}&token=${encodeURIComponent(token)}`

    this.ws = new WebSocket(wsUrl)

    this.ws.onopen = () => {
      this.reconnectAttempts = 0
    }

    this.ws.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data as string) as SessionMetrics
        this.metricsCallback?.(data)
      } catch {
        // ignore malformed frames
      }
    }

    this.ws.onclose = () => {
      if (!this.paused && this.reconnectAttempts < this.maxReconnects && this.sessionId) {
        this.reconnectAttempts++
        setTimeout(() => this.connect(this.sessionId!), 2000 * this.reconnectAttempts)
      }
    }
  }

  onMetrics(callback: MetricsCallback) {
    this.metricsCallback = callback
  }

  send(data: unknown) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data))
    }
  }

  disconnect() {
    this.paused = true
    this.sessionId = null
    this.reconnectAttempts = 0
    if (this.ws) {
      this.ws.onopen = null
      this.ws.onmessage = null
      this.ws.onclose = null
      this.ws.onerror = null
      this.ws.close()
      this.ws = null
    }
  }

  pause() {
    this.paused = true
    if (this.ws) {
      this.ws.onopen = null
      this.ws.onmessage = null
      this.ws.onclose = null
      this.ws.onerror = null
      this.ws.close()
    }
  }

  resume() {
    this.paused = false
    if (this.sessionId) {
      this.reconnectAttempts = 0
      this.connect(this.sessionId)
    }
  }

  reconnectSocket(sessionId: string) {
    this.sessionId = sessionId
    this.paused = false
    this.reconnectAttempts = 0
    this.connect(sessionId)
  }

  isPaused() {
    return this.paused
  }
}

export const interviewSocket = new InterviewWebSocket()
