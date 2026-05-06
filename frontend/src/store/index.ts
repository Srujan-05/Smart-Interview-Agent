import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  User,
  UserProfile,
  Job,
  JobFilters,
  InterviewSession,
  SessionSummary,
} from '@/types'

interface AuthSlice {
  token: string | null
  user: User | null
  setAuth: (token: string, user: User) => void
  clearAuth: () => void
}

interface ProfileSlice {
  profile: UserProfile | null
  setProfile: (profile: UserProfile) => void
}

interface JobsSlice {
  jobs: Job[]
  filters: JobFilters
  savedJobs: string[]
  setJobs: (jobs: Job[]) => void
  setFilters: (filters: Partial<JobFilters>) => void
  toggleSaveJob: (jobId: string) => void
}

interface InterviewSlice {
  currentSession: InterviewSession | null
  sessionHistory: SessionSummary[]
  setSession: (session: InterviewSession | null) => void
  appendAnswer: (answer: InterviewSession['answers'][0]) => void
  setSessionHistory: (history: SessionSummary[]) => void
}

type AppStore = AuthSlice & ProfileSlice & JobsSlice & InterviewSlice

const defaultFilters: JobFilters = {
  query: '',
  location: '',
  experienceLevel: '',
  salaryMin: 0,
  salaryMax: 500000,
  skills: [],
  company: '',
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      // Auth
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      clearAuth: () => set({ token: null, user: null, profile: null }),

      // Profile
      profile: null,
      setProfile: (profile) => set({ profile }),

      // Jobs
      jobs: [],
      filters: defaultFilters,
      savedJobs: [],
      setJobs: (jobs) => set({ jobs }),
      setFilters: (filters) =>
        set((state) => ({ filters: { ...state.filters, ...filters } })),
      toggleSaveJob: (jobId) =>
        set((state) => {
          const saved = state.savedJobs.includes(jobId)
            ? state.savedJobs.filter((id) => id !== jobId)
            : [...state.savedJobs, jobId]
          return {
            savedJobs: saved,
            jobs: state.jobs.map((j) =>
              j.id === jobId ? { ...j, saved: !saved.includes(jobId) } : j,
            ),
          }
        }),

      // Interview
      currentSession: null,
      sessionHistory: [],
      setSession: (session) => set({ currentSession: session }),
      appendAnswer: (answer) =>
        set((state) => {
          if (!state.currentSession) return state
          return {
            currentSession: {
              ...state.currentSession,
              answers: [...state.currentSession.answers, answer],
              currentQuestionIndex:
                state.currentSession.currentQuestionIndex + 1,
            },
          }
        }),
      setSessionHistory: (history) => set({ sessionHistory: history }),
    }),
    {
      name: 'iphipi-store',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        savedJobs: state.savedJobs,
      }),
    },
  ),
)

// Selectors
export const selectIsAuthenticated = (state: AppStore) => !!state.token
export const selectSavedJobIds = (state: AppStore) => state.savedJobs

