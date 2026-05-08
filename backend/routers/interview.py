from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from schemas.interview import (
    InterviewStartConfig,
    InterviewSession as InterviewSessionSchema,
    SubmitAnswerPayload,
    FeedbackReport,
    SessionSummary,
    SessionMetrics,
)
from models.user import User
from models.session import InterviewSession, FeedbackReport as FeedbackReportModel
from database import get_db
from utils.auth import get_current_user
from services.interview_agent import generate_questions
from services.feedback_generator import generate_session_feedback
import uuid
import json
from datetime import datetime

router = APIRouter(prefix="/api/interview", tags=["interview"])


@router.post("/start", response_model=InterviewSessionSchema)
async def start_interview(
    config: InterviewStartConfig,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    session_id = str(uuid.uuid4())

    questions = await generate_questions(
        profile={"skills": []},
        mode=config.mode,
        difficulty=config.difficulty,
    )

    default_metrics = {
        "visualScores": {
            "eyeContact": 0,
            "posture": "Fair",
            "engagementLevel": 0,
            "stressLevel": 0,
        },
        "audioScores": {
            "tone": "Neutral",
            "pitchVariation": 0,
            "speechClarity": 0,
            "speakingPace": 0,
        },
        "technicalScores": {
            "correctness": 0,
            "completeness": 0,
            "depth": 0,
        },
    }

    session = InterviewSession(
        id=session_id,
        user_id=current_user.id,
        mode=config.mode,
        difficulty=config.difficulty,
        job_id=config.jobId,
        questions=[q.model_dump() if hasattr(q, 'model_dump') else q for q in questions],
        answers=[],
        session_metrics=default_metrics,
        status="active",
    )

    db.add(session)
    await db.commit()

    return InterviewSessionSchema(
        id=session_id,
        mode=config.mode,
        difficulty=config.difficulty,
        questions=questions,
        currentQuestionIndex=0,
        answers=[],
        startTime=datetime.utcnow().isoformat(),
        sessionMetrics=SessionMetrics(**default_metrics),
    )


@router.post("/submit-answer")
async def submit_answer(
    payload: SubmitAnswerPayload,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(InterviewSession).where(
            InterviewSession.id == payload.sessionId
            and InterviewSession.user_id == current_user.id
        )
    )
    session = result.scalar_one_or_none()

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found",
        )

    answer = {
        "questionId": payload.questionId,
        "transcription": payload.transcription,
        "duration": payload.duration,
        "retakeCount": payload.retakeCount,
    }

    answers = session.answers if isinstance(session.answers, list) else []
    answers.append(answer)
    session.answers = answers
    session.session_metrics = {
        "visualScores": payload.metrics.visualScores.model_dump(),
        "audioScores": payload.metrics.audioScores.model_dump(),
        "technicalScores": payload.metrics.technicalScores.model_dump(),
    }

    await db.commit()

    return {"message": "Answer submitted successfully"}


@router.post("/get-feedback", response_model=FeedbackReport)
async def get_feedback(
    data: dict,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    session_id = data.get("sessionId")

    result = await db.execute(
        select(InterviewSession).where(
            InterviewSession.id == session_id
            and InterviewSession.user_id == current_user.id
        )
    )
    session = result.scalar_one_or_none()

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found",
        )

    # Check if feedback already exists for this session
    feedback_result = await db.execute(
        select(FeedbackReportModel).where(FeedbackReportModel.session_id == session_id)
    )
    existing_feedback = feedback_result.scalar_one_or_none()

    if existing_feedback:
        # Return existing feedback
        return FeedbackReport(
            sessionId=session_id,
            overallScore=existing_feedback.overall_score,
            breakdown=existing_feedback.breakdown if isinstance(existing_feedback.breakdown, dict) else {},
            perQuestionFeedback=existing_feedback.per_question_feedback if isinstance(existing_feedback.per_question_feedback, list) else [],
            recommendations=existing_feedback.recommendations if isinstance(existing_feedback.recommendations, dict) else {},
        )

    session.status = "completed"
    session.ended_at = datetime.utcnow()

    feedback_data = await generate_session_feedback(
        session_data={
            "answers": session.answers if isinstance(session.answers, list) else [],
        },
        profile_data={},
    )

    feedback = FeedbackReportModel(
        id=str(uuid.uuid4()),
        session_id=session_id,
        overall_score=feedback_data.get("overallScore", 0),
        breakdown=feedback_data.get("breakdown", {}),
        per_question_feedback=feedback_data.get("perQuestionFeedback", []),
        recommendations=feedback_data.get("recommendations", {}),
    )

    db.add(feedback)
    await db.commit()

    return FeedbackReport(
        sessionId=session_id,
        overallScore=feedback_data["overallScore"],
        breakdown=feedback_data["breakdown"],
        perQuestionFeedback=feedback_data["perQuestionFeedback"],
        recommendations=feedback_data["recommendations"],
    )


@router.get("/sessions", response_model=list[SessionSummary])
async def get_sessions(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(InterviewSession)
        .where(InterviewSession.user_id == current_user.id)
        .order_by(InterviewSession.started_at.desc())
    )
    sessions = result.scalars().all()

    summaries = []
    for session in sessions:
        score = 0.0
        metrics = session.session_metrics if isinstance(session.session_metrics, dict) else {}
        if metrics:
            breakdown = metrics.get("breakdown", {})
            score = breakdown.get("overall", 0.0)

        duration = 0
        if session.ended_at and session.started_at:
            duration = int((session.ended_at - session.started_at).total_seconds())

        summaries.append(
            SessionSummary(
                id=session.id,
                date=session.started_at.isoformat(),
                mode=session.mode,
                score=score,
                duration=duration,
            )
        )

    return summaries
