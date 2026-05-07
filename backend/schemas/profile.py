from pydantic import BaseModel
from typing import List, Optional, Dict


class Skill(BaseModel):
    name: str
    level: str  # Beginner, Intermediate, Advanced
    endorsements: Optional[int] = None


class Experience(BaseModel):
    company: str
    role: str
    startDate: str
    endDate: Optional[str] = None
    duration: str
    description: List[str]


class Project(BaseModel):
    name: str
    description: str
    techStack: List[str]
    url: Optional[str] = None


class Education(BaseModel):
    institution: str
    degree: str
    field: str
    graduationYear: int
    certifications: Optional[List[str]] = None


class TrainingProfile(BaseModel):
    learningStyle: str  # Visual, Auditory, Kinesthetic
    confidenceScore: float
    historicalData: Dict[str, Dict[str, float]] = {}
    pastSessionLogs: List[Dict] = []


class UserProfile(BaseModel):
    skills: List[Skill] = []
    experience: List[Experience] = []
    projects: List[Project] = []
    education: List[Education] = []
    seniorityLevel: str = "Junior"
    domainExposure: List[str] = []
    trainingProfile: TrainingProfile = TrainingProfile(
        learningStyle="Visual", confidenceScore=50.0
    )

    class Config:
        from_attributes = True


class UserProfileUpdate(BaseModel):
    skills: Optional[List[Skill]] = None
    experience: Optional[List[Experience]] = None
    projects: Optional[List[Project]] = None
    education: Optional[List[Education]] = None
    seniorityLevel: Optional[str] = None
    domainExposure: Optional[List[str]] = None
    trainingProfile: Optional[TrainingProfile] = None
