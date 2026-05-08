export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced'
export type SeniorityLevel = 'Junior' | 'Mid' | 'Senior' | 'Lead'

export interface SeniorityMatchDetail {
  userYearsOfExperience: number
  requiredYearsMin: number
  requiredYearsMax: number
  adjustmentFactor: number
  adjustmentPoints: number
}

export type StrategyMode = 'retrieved' | 'exploratory' | 'fixed'

export interface AppliedStrategy {
  mode: StrategyMode
  difficulty: DifficultyLevel
  description: string
  focusAreas: string[]
  retrievedFromGroupSize?: number
  explorationReason?: string
}

export type LearningStyle = 'Visual' | 'Auditory' | 'Kinesthetic'
export type InterviewMode = 'Behavioral' | 'Technical' | 'Mixed' | 'Mock'
export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard' | 'Adaptive'
export type QuestionType = 'Technical' | 'Behavioral' | 'Situational'
export type PostureAssessment = 'Good' | 'Fair' | 'Poor'
export type ToneIndicator = 'Confident' | 'Neutral' | 'Hesitant'

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  location?: string
  profileCompletion: number
}

export interface Skill {
  name: string
  level: SkillLevel
  endorsements?: number
}

export interface Experience {
  company: string
  role: string
  startDate: string
  endDate?: string
  duration: string
  description: string[]
}

export interface Project {
  name: string
  description: string
  techStack: string[]
  url?: string
}

export interface Education {
  institution: string
  degree: string
  field: string
  graduationYear: string
  certifications?: string[]
}

export interface TrainingProfile {
  learningStyle: LearningStyle
  confidenceScore: number
  historicalData: Record<string, { attempts: number; avgScore: number }>
  pastSessionLogs: SessionSummary[]
}

export interface UserProfile {
  skills: Skill[]
  experience: Experience[]
  projects: Project[]
  education: Education[]
  seniorityLevel: SeniorityLevel
  yearsOfExperience: number
  domainExposure: string[]
  trainingProfile: TrainingProfile
}

export interface Job {
  id: string
  title: string
  company: string
  location: string
  locationType: 'Remote' | 'On-site' | 'Hybrid'
  salaryMin?: number
  salaryMax?: number
  experienceLevel: 'Entry' | 'Mid' | 'Senior'
  skills: string[]
  matchScore: number
  description: string
  requirements: string[]
  aboutCompany: string
  saved: boolean
  applyUrl?: string
  seniorityMatchDetail?: SeniorityMatchDetail
}

export interface JobFilters {
  query: string
  location: string
  experienceLevel: string
  salaryMin: number
  salaryMax: number
  skills: string[]
  company: string
}

export interface InterviewQuestion {
  id: string
  text: string
  type: QuestionType
  difficulty: DifficultyLevel
  hint?: string
  expectedAnswer?: string
}

export interface InterviewAnswer {
  questionId: string
  transcription: string
  duration: number
  retakeCount: number
}

export interface VisualScores {
  eyeContact: number
  posture: PostureAssessment
  engagementLevel: number
  stressLevel: number
}

export interface AudioScores {
  tone: ToneIndicator
  pitchVariation: number
  speechClarity: number
  speakingPace: number
}

export interface TechnicalScores {
  correctness: number
  completeness: number
  depth: number
}

export interface SessionMetrics {
  visualScores: VisualScores
  audioScores: AudioScores
  technicalScores: TechnicalScores
}

export interface InterviewSession {
  id: string
  mode: InterviewMode
  difficulty: DifficultyLevel
  questions: InterviewQuestion[]
  currentQuestionIndex: number
  answers: InterviewAnswer[]
  startTime: string
  sessionMetrics: SessionMetrics
}

export interface QuestionFeedback {
  questionId: string
  questionText: string
  yourAnswer: string
  expectedAnswer: string
  score: number
  feedback: string
  tips: string[]
}

export interface ScoreBreakdown {
  technicalCorrectness: number
  communication: number
  visualPresence: number
  audioQuality: number
  overall: number
}

export interface FeedbackReport {
  sessionId: string
  overallScore: number
  breakdown: ScoreBreakdown
  appliedStrategy: AppliedStrategy
  perQuestionFeedback: QuestionFeedback[]
  recommendations: {
    topAreasToImprove: string[]
    personalizedTips: string[]
    suggestedTopics: string[]
    nextSessionRecommendation: string
  }
}

export interface SessionSummary {
  id: string
  date: string
  mode: InterviewMode
  score: number
  duration: number
}

export interface AuthTokens {
  accessToken: string
  refreshToken?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface InterviewStartConfig {
  mode: InterviewMode
  difficulty: DifficultyLevel
  jobId?: string
}

export interface SubmitAnswerPayload {
  sessionId: string
  questionId: string
  transcription: string
  duration: number
  retakeCount: number
  metrics: SessionMetrics
}
