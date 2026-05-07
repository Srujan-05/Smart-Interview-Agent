from sqlalchemy import Column, String, ForeignKey, DateTime, func, Float
from sqlalchemy.dialects.sqlite import JSON
import uuid
from database import Base


class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    mode = Column(String(50), nullable=False)  # Behavioral, Technical, Mixed, Mock
    difficulty = Column(String(50), nullable=False)  # Easy, Medium, Hard, Adaptive
    job_id = Column(String(255), nullable=True)
    questions = Column(JSON, default=list, nullable=False)
    answers = Column(JSON, default=list, nullable=False)
    session_metrics = Column(JSON, default=dict, nullable=False)
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    ended_at = Column(DateTime(timezone=True), nullable=True)
    status = Column(String(50), default="active", nullable=False)

    def __repr__(self):
        return f"<InterviewSession {self.id}>"


class FeedbackReport(Base):
    __tablename__ = "feedback_reports"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(
        String(36), ForeignKey("interview_sessions.id"), unique=True, nullable=False
    )
    overall_score = Column(Float, nullable=False)
    breakdown = Column(JSON, default=dict, nullable=False)
    per_question_feedback = Column(JSON, default=list, nullable=False)
    recommendations = Column(JSON, default=dict, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<FeedbackReport {self.id}>"
