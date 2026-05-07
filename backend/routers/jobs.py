from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from schemas.job import Job
from models.user import User
from models.profile import Profile
from database import get_db
from utils.auth import get_current_user
from services.job_service import search_jobs, calculate_match_score
from typing import List

router = APIRouter(prefix="/api/jobs", tags=["jobs"])


@router.get("", response_model=List[Job])
async def get_jobs(
    query: str = Query("", description="Job title or keyword"),
    location: str = Query("", description="Job location"),
    experienceLevel: str = Query("", description="Experience level"),
    salaryMin: float = Query(0, description="Minimum salary"),
    salaryMax: float = Query(500000, description="Maximum salary"),
    skills: List[str] = Query([], description="Required skills"),
    company: str = Query("", description="Company name"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Profile).where(Profile.user_id == current_user.id)
    )
    profile = result.scalar_one_or_none()

    jobs = await search_jobs(
        query=query,
        location=location,
        salary_min=salaryMin,
        salary_max=salaryMax,
    )

    user_skills = profile.skills if profile and isinstance(profile.skills, list) else []

    for job in jobs:
        match_score = calculate_match_score(job, user_skills)
        job["matchScore"] = match_score

    return jobs
