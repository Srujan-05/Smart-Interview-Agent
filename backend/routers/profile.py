from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from schemas.profile import UserProfile, UserProfileUpdate
from models.profile import Profile
from models.user import User
from database import get_db
from utils.auth import get_current_user
import json

router = APIRouter(prefix="/api/profile", tags=["profile"])


@router.get("", response_model=UserProfile)
async def get_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Profile).where(Profile.user_id == current_user.id)
    )
    profile = result.scalar_one_or_none()

    if not profile:
        profile = Profile(user_id=current_user.id)
        db.add(profile)
        await db.commit()

    return UserProfile(
        skills=profile.skills if isinstance(profile.skills, list) else [],
        experience=profile.experience if isinstance(profile.experience, list) else [],
        projects=profile.projects if isinstance(profile.projects, list) else [],
        education=profile.education if isinstance(profile.education, list) else [],
        seniorityLevel=profile.seniority_level or "Junior",
        domainExposure=profile.domain_exposure if isinstance(profile.domain_exposure, list) else [],
        trainingProfile=profile.training_profile
        if isinstance(profile.training_profile, dict)
        else {
            "learningStyle": "Visual",
            "confidenceScore": 50.0,
            "historicalData": {},
            "pastSessionLogs": [],
        },
    )


@router.put("", response_model=UserProfile)
async def update_profile(
    profile_data: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Profile).where(Profile.user_id == current_user.id)
    )
    profile = result.scalar_one_or_none()

    if not profile:
        profile = Profile(user_id=current_user.id)
        db.add(profile)

    if profile_data.skills is not None:
        profile.skills = [s.model_dump() for s in profile_data.skills]
    if profile_data.experience is not None:
        profile.experience = [e.model_dump() for e in profile_data.experience]
    if profile_data.projects is not None:
        profile.projects = [p.model_dump() for p in profile_data.projects]
    if profile_data.education is not None:
        profile.education = [ed.model_dump() for ed in profile_data.education]
    if profile_data.seniorityLevel is not None:
        profile.seniority_level = profile_data.seniorityLevel
    if profile_data.domainExposure is not None:
        profile.domain_exposure = profile_data.domainExposure
    if profile_data.trainingProfile is not None:
        profile.training_profile = profile_data.trainingProfile.model_dump()

    await db.commit()

    return UserProfile(
        skills=profile.skills if isinstance(profile.skills, list) else [],
        experience=profile.experience if isinstance(profile.experience, list) else [],
        projects=profile.projects if isinstance(profile.projects, list) else [],
        education=profile.education if isinstance(profile.education, list) else [],
        seniorityLevel=profile.seniority_level or "Junior",
        domainExposure=profile.domain_exposure if isinstance(profile.domain_exposure, list) else [],
        trainingProfile=profile.training_profile
        if isinstance(profile.training_profile, dict)
        else {
            "learningStyle": "Visual",
            "confidenceScore": 50.0,
            "historicalData": {},
            "pastSessionLogs": [],
        },
    )
