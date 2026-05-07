from pydantic import BaseModel
from typing import List, Optional


class JobFilters(BaseModel):
    query: str = ""
    location: str = ""
    experienceLevel: str = ""
    salaryMin: float = 0
    salaryMax: float = 500000
    skills: List[str] = []
    company: str = ""


class Job(BaseModel):
    id: str
    title: str
    company: str
    location: str
    locationType: str  # Remote, On-site, Hybrid
    salaryMin: Optional[float] = None
    salaryMax: Optional[float] = None
    experienceLevel: str  # Entry, Mid, Senior
    skills: List[str]
    matchScore: float
    description: str
    requirements: List[str]
    aboutCompany: str
    saved: bool = False
    applyUrl: Optional[str] = None

    class Config:
        from_attributes = True
