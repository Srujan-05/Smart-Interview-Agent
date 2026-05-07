from pydantic import BaseModel, EmailStr
from typing import Optional


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: str
    email: str
    name: str
    phone: Optional[str] = None
    location: Optional[str] = None
    profileCompletion: int = 0


class AuthTokens(BaseModel):
    accessToken: str
    refreshToken: Optional[str] = None


class LoginResponse(BaseModel):
    accessToken: str
    user: UserOut


class TokenPayload(BaseModel):
    sub: str
    exp: int
