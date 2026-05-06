import { useCallback, useState } from 'react'
import { UploadCloud, FileText, CheckCircle, XCircle } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { resumeApi } from '@/utils/api'
import { useProfile } from '@/hooks/useProfile'
import { cn } from '@/lib/utils'

const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

type UploadStatus = 'idle' | 'uploading' | 'parsing' | 'success' | 'error'

export function ResumeUpload() {
  const [status, setStatus] = useState<UploadStatus>('idle')
  const [progress, setProgress] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)
  const { fetchProfile } = useProfile()

  const handleFile = useCallback(
    async (file: File) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setErrorMsg('Only PDF and DOCX files are allowed.')
        setStatus('error')
        return
      }

      setStatus('uploading')
      setProgress(30)

      try {
        await resumeApi.upload(file)
        setProgress(60)
        setStatus('parsing')
        await resumeApi.parse()
        setProgress(100)
        setStatus('success')
        await fetchProfile()
      } catch {
        setErrorMsg('Upload failed. Please try again.')
        setStatus('error')
      }
    },
    [fetchProfile],
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile],
  )

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const reset = () => {
    setStatus('idle')
    setProgress(0)
    setErrorMsg('')
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragOver(true)
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={onDrop}
        className={cn(
          'flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors',
          isDragOver
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-200 bg-gray-50 hover:border-gray-300',
        )}
      >
        {status === 'idle' && (
          <>
            <UploadCloud className="mb-3 h-10 w-10 text-gray-400" />
            <p className="mb-1 text-sm font-medium text-gray-700">
              Drag & drop your resume here
            </p>
            <p className="mb-4 text-xs text-gray-500">PDF or DOCX, max 10MB</p>
            <label className="cursor-pointer inline-flex items-center rounded-lg border border-input bg-background px-2.5 py-1 text-[0.8rem] font-medium text-foreground hover:bg-muted transition-colors">
              Browse file
              <input
                type="file"
                accept=".pdf,.docx"
                className="sr-only"
                onChange={onInputChange}
              />
            </label>
          </>
        )}

        {(status === 'uploading' || status === 'parsing') && (
          <div className="w-full space-y-3 text-center">
            <FileText className="mx-auto h-10 w-10 text-blue-500 animate-pulse" />
            <p className="text-sm font-medium text-gray-700">
              {status === 'uploading' ? 'Uploading...' : 'Parsing resume...'}
            </p>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {status === 'success' && (
          <div className="text-center space-y-2">
            <CheckCircle className="mx-auto h-10 w-10 text-green-500" />
            <p className="text-sm font-semibold text-gray-800">
              Resume uploaded and parsed!
            </p>
            <Button variant="ghost" size="sm" onClick={reset}>
              Upload another
            </Button>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center space-y-2">
            <XCircle className="mx-auto h-10 w-10 text-red-500" />
            <p className="text-sm font-semibold text-gray-800">{errorMsg}</p>
            <Button variant="ghost" size="sm" onClick={reset}>
              Try again
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
