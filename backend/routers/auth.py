from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from schemas.auth import LoginRequest, RegisterRequest, LoginResponse, UserOut
from models.user import User
from models.profile import Profile
from database import get_db
from utils.auth import hash_password, verify_password, create_access_token
import uuid
import json

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=LoginResponse)
async def register(req: RegisterRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == req.email))
    existing_user = result.scalar_one_or_none()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    user_id = str(uuid.uuid4())
    user = User(
        id=user_id,
        email=req.email,
        name=req.name,
        password_hash=hash_password(req.password),
    )
    db.add(user)

    profile = Profile(
        user_id=user_id,
        training_profile=json.dumps({
            "learningStyle": "Visual",
            "confidenceScore": 50.0,
            "historicalData": {},
            "pastSessionLogs": []
        }),
    )
    db.add(profile)
    await db.commit()

    access_token = create_access_token({"sub": user_id})
    return LoginResponse(
        accessToken=access_token,
        user=UserOut(
            id=user.id,
            email=user.email,
            name=user.name,
            phone=user.phone,
            location=user.location,
        ),
    )


@router.post("/login", response_model=LoginResponse)
async def login(req: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == req.email))
    user = result.scalar_one_or_none()

    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    access_token = create_access_token({"sub": user.id})
    return LoginResponse(
        accessToken=access_token,
        user=UserOut(
            id=user.id,
            email=user.email,
            name=user.name,
            phone=user.phone,
            location=user.location,
        ),
    )
