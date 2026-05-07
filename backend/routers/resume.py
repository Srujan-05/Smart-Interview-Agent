from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.user import User
from models.profile import Profile
from database import get_db
from utils.auth import get_current_user
from utils.file_utils import validate_and_save_file
from services.resume_parser import parse_resume
from services.profile_analyzer import extract_profile_from_resume
import json

router = APIRouter(prefix="/api/resume", tags=["resume"])


@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    filepath = await validate_and_save_file(file, current_user.id)

    result = await db.execute(
        select(Profile).where(Profile.user_id == current_user.id)
    )
    profile = result.scalar_one_or_none()

    if not profile:
        profile = Profile(user_id=current_user.id)
        db.add(profile)

    profile.resume_filename = file.filename
    profile.resume_path = filepath
    await db.commit()

    return {"message": "Resume uploaded successfully"}


@router.post("/parse")
async def parse_resume_endpoint(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Profile).where(Profile.user_id == current_user.id)
    )
    profile = result.scalar_one_or_none()

    if not profile or not profile.resume_path:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No resume uploaded",
        )

    resume_text = parse_resume(profile.resume_path)
    existing_training = (
        profile.training_profile
        if isinstance(profile.training_profile, dict)
        else None
    )

    parsed_profile = await extract_profile_from_resume(resume_text, existing_training)

    profile.skills = parsed_profile.get("skills", [])
    profile.experience = parsed_profile.get("experience", [])
    profile.projects = parsed_profile.get("projects", [])
    profile.education = parsed_profile.get("education", [])
    profile.seniority_level = parsed_profile.get("seniorityLevel", "Junior")
    profile.domain_exposure = parsed_profile.get("domainExposure", [])
    profile.training_profile = parsed_profile.get("trainingProfile", {})

    await db.commit()

    return {"message": "Resume parsed successfully"}
