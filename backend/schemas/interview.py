from pydantic import BaseModel
from typing import List, Optional, Dict


class InterviewQuestion(BaseModel):
    id: str
    text: str
    type: str  # Technical, Behavioral, Situational
    difficulty: str  # Easy, Medium, Hard, Adaptive
    hint: Optional[str] = None
    expectedAnswer: Optional[str] = None


class InterviewAnswer(BaseModel):
    questionId: str
    transcription: str
    duration: int
    retakeCount: int = 0


class VisualScores(BaseModel):
    eyeContact: float
    posture: str  # Good, Fair, Poor
    engagementLevel: float
    stressLevel: float


class AudioScores(BaseModel):
    tone: str  # Confident, Neutral, Hesitant
    pitchVariation: float
    speechClarity: float
    speakingPace: float


class TechnicalScores(BaseModel):
    correctness: float
    completeness: float
    depth: float


class SessionMetrics(BaseModel):
    visualScores: VisualScores
    audioScores: AudioScores
    technicalScores: TechnicalScores


class InterviewSession(BaseModel):
    id: str
    mode: str  # Behavioral, Technical, Mixed, Mock
    difficulty: str  # Easy, Medium, Hard, Adaptive
    questions: List[InterviewQuestion]
    currentQuestionIndex: int
    answers: List[InterviewAnswer]
    startTime: str
    sessionMetrics: SessionMetrics

    class Config:
        from_attributes = True


class SubmitAnswerPayload(BaseModel):
    sessionId: str
    questionId: str
    transcription: str
    duration: int
    retakeCount: int = 0
    metrics: SessionMetrics


class QuestionFeedback(BaseModel):
    questionId: str
    questionText: str
    yourAnswer: str
    expectedAnswer: str
    score: float
    feedback: str
    tips: List[str]


class ScoreBreakdown(BaseModel):
    technicalCorrectness: float
    communication: float
    visualPresence: float
    audioQuality: float
    overall: float


class Recommendations(BaseModel):
    topAreasToImprove: List[str]
    personalizedTips: List[str]
    suggestedTopics: List[str]
    nextSessionRecommendation: str


class FeedbackReport(BaseModel):
    sessionId: str
    overallScore: float
    breakdown: ScoreBreakdown
    perQuestionFeedback: List[QuestionFeedback]
    recommendations: Recommendations
    appliedStrategy: Optional[dict] = None

    class Config:
        from_attributes = True


class SessionSummary(BaseModel):
    id: str
    date: str
    mode: str
    score: float
    duration: int

    class Config:
        from_attributes = True


class InterviewStartConfig(BaseModel):
    mode: str  # Behavioral, Technical, Mixed, Mock
    difficulty: str  # Easy, Medium, Hard, Adaptive
    jobId: Optional[str] = None
