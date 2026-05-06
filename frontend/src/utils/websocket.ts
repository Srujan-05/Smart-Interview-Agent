import type { SessionMetrics } from '@/types'

type MetricsCallback = (metrics: SessionMetrics) => void

export class InterviewWebSocket {
  private ws: WebSocket | null = null
  private metricsCallback: MetricsCallback | null = null
  private reconnectAttempts = 0
  private readonly maxReconnects = 3
  private sessionId: string | null = null

  connect(sessionId: string) {
    this.sessionId = sessionId
    const wsUrl =
      (import.meta.env.VITE_WS_URL ?? 'ws://localhost:8000') +
      `/ws/interview?sessionId=${sessionId}`

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
      if (this.reconnectAttempts < this.maxReconnects && this.sessionId) {
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
    this.sessionId = null
    this.ws?.close()
    this.ws = null
  }
}

export const interviewSocket = new InterviewWebSocket()
