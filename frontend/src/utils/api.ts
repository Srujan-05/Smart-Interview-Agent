import axios from 'axios'
import type {
  User,
  UserProfile,
  Job,
  JobFilters,
  InterviewSession,
  InterviewStartConfig,
  SubmitAnswerPayload,
  FeedbackReport,
  SessionSummary,
  AuthTokens,
  LoginRequest,
  RegisterRequest,
} from '@/types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export const authApi = {
  login: (data: LoginRequest) =>
    api.post<AuthTokens & { user: User }>('/api/auth/login', data),

  register: (data: RegisterRequest) =>
    api.post<AuthTokens & { user: User }>('/api/auth/register', data),
}

export const resumeApi = {
  upload: (file: File) => {
    const form = new FormData()
    form.append('file', file)
    return api.post<{ message: string }>('/api/resume/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  parse: () => api.post<{ message: string }>('/api/resume/parse'),
}

export const profileApi = {
  get: () => api.get<UserProfile>('/api/profile'),
  update: (data: Partial<UserProfile>) => api.put<UserProfile>('/api/profile', data),
}

export const jobsApi = {
  getAll: (filters?: Partial<JobFilters>) =>
    api.get<Job[]>('/api/jobs', { params: filters }),
}

export const interviewApi = {
  start: (config: InterviewStartConfig) =>
    api.post<InterviewSession>('/api/interview/start', config),

  submitAnswer: (payload: SubmitAnswerPayload) =>
    api.post<{ message: string }>('/api/interview/submit-answer', payload),

  getFeedback: (sessionId: string) =>
    api.post<FeedbackReport>('/api/interview/get-feedback', { sessionId }),

  getSessions: () =>
    api.get<SessionSummary[]>('/api/interview/sessions'),
}

export default api
