import { useRef, useState, useCallback } from 'react'

interface MediaStreamState {
  stream: MediaStream | null
  isPermitted: boolean
  error: string | null
}

export function useMediaStream() {
  const [state, setState] = useState<MediaStreamState>({
    stream: null,
    isPermitted: false,
    error: null,
  })
  const [transcript, setTranscript] = useState('')
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const recognitionRef = useRef<any>(null)

  const requestPermissions = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })
      setState({ stream, isPermitted: true, error: null })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch {
      setState((s) => ({
        ...s,
        error: 'Camera/microphone access denied. Please allow permissions.',
      }))
    }
  }, [])

  const startRecording = useCallback(() => {
    if (!state.stream) return

    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop()
    }

    setTranscript('')
    chunksRef.current = []
    const recorder = new MediaRecorder(state.stream)
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data)
    }
    recorder.start(1000)
    recorderRef.current = recorder

    const SR = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition
    if (SR) {
      const recognition = new SR()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-US'
      recognition.onresult = (event: any) => {
        const text = Array.from(event.results)
          .map((r: any) => r[0].transcript)
          .join('')
        setTranscript(text)
      }
      recognition.start()
      recognitionRef.current = recognition
    }
  }, [state.stream])

  const stopRecording = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      recognitionRef.current?.stop()

      const recorder = recorderRef.current
      if (!recorder || recorder.state === 'inactive') {
        resolve(null)
        return
      }
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' })
        resolve(blob)
      }
      recorder.stop()
    })
  }, [])

  const stopStream = useCallback(() => {
    state.stream?.getTracks().forEach((t) => t.stop())
    setState({ stream: null, isPermitted: false, error: null })
  }, [state.stream])

  const resetTranscript = useCallback(() => {
    setTranscript('')
  }, [])

  return {
    stream: state.stream,
    isPermitted: state.isPermitted,
    error: state.error,
    videoRef,
    transcript,
    requestPermissions,
    startRecording,
    stopRecording,
    stopStream,
    resetTranscript,
  }
}
