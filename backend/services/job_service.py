import httpx
from config import settings
from typing import List, Dict, Any
import re


def jaccard_similarity(set1: set, set2: set) -> float:
    if not set1 and not set2:
        return 100.0
    if not set1 or not set2:
        return 0.0
    intersection = len(set1 & set2)
    union = len(set1 | set2)
    return (intersection / union) * 100 if union > 0 else 0.0


def extract_skills_from_text(text: str) -> set:
    """Extract potential skill keywords from job description."""
    if not text:
        return set()
    text = text.lower()
    common_skills = {
        "python", "javascript", "java", "c++", "c#", "go", "rust", "typescript",
        "react", "angular", "vue", "fastapi", "django", "flask", "spring",
        "sql", "mysql", "postgresql", "mongodb", "redis", "docker", "kubernetes",
        "aws", "azure", "gcp", "git", "agile", "scrum", "linux", "windows",
        "html", "css", "nodejs", "express", "rest", "graphql", "api", "testing",
    }
    found = set()
    for skill in common_skills:
        if skill in text:
            found.add(skill)
    return found


def calculate_match_score(job: Dict, user_skills: List[Dict]) -> float:
    """Calculate match score between job and user profile."""
    user_skill_names = {s["name"].lower() for s in user_skills}
    job_skills = extract_skills_from_text(job.get("description", ""))

    jaccard = jaccard_similarity(user_skill_names, job_skills)
    return min(100, max(0, jaccard))


async def search_jobs(
    query: str = "",
    location: str = "",
    salary_min: float = 0,
    salary_max: float = 500000,
    **kwargs
) -> List[Dict[str, Any]]:
    """
    Search jobs via Adzuna API.
    Returns job list with match score (TBD - will be calculated with user profile).
    """
    if not settings.ADZUNA_APP_ID or not settings.ADZUNA_APP_KEY:
        return _get_mock_jobs()

    try:
        async with httpx.AsyncClient() as client:
            params = {
                "app_id": settings.ADZUNA_APP_ID,
                "app_key": settings.ADZUNA_APP_KEY,
                "results_per_page": 20,
                "what": query or "engineer",
                "where": location or "United States",
            }

            response = await client.get(
                "https://api.adzuna.com/v1/api/jobs/us/search/1", params=params
            )
            response.raise_for_status()
            data = response.json()

            jobs = []
            for job in data.get("results", []):
                jobs.append(
                    {
                        "id": str(job.get("id", "")),
                        "title": job.get("title", ""),
                        "company": job.get("company", {}).get("display_name", ""),
                        "location": job.get("location", {}).get("display_name", ""),
                        "locationType": "Remote",
                        "salaryMin": job.get("salary_min"),
                        "salaryMax": job.get("salary_max"),
                        "experienceLevel": "Mid",
                        "skills": list(extract_skills_from_text(job.get("description", ""))),
                        "matchScore": 0.0,
                        "description": job.get("description", ""),
                        "requirements": [],
                        "aboutCompany": "",
                        "saved": False,
                        "applyUrl": job.get("redirect_url", ""),
                    }
                )
            return jobs
    except Exception as e:
        print(f"Error fetching jobs from Adzuna: {e}")
        return _get_mock_jobs()


def _get_mock_jobs() -> List[Dict[str, Any]]:
    """Returns mock job data for development."""
    return [
        {
            "id": "1",
            "title": "Senior Python Developer",
            "company": "TechCorp",
            "location": "San Francisco, CA",
            "locationType": "Hybrid",
            "salaryMin": 120000,
            "salaryMax": 180000,
            "experienceLevel": "Senior",
            "skills": ["python", "fastapi", "sql", "docker", "aws"],
            "matchScore": 85.0,
            "description": "We are looking for a senior Python developer with FastAPI, Docker, and AWS experience.",
            "requirements": ["5+ years experience", "Python expertise", "AWS knowledge"],
            "aboutCompany": "A leading tech company",
            "saved": False,
            "applyUrl": "https://example.com/job/1",
        },
        {
            "id": "2",
            "title": "Full Stack Engineer",
            "company": "StartupXYZ",
            "location": "New York, NY",
            "locationType": "Remote",
            "salaryMin": 100000,
            "salaryMax": 150000,
            "experienceLevel": "Mid",
            "skills": ["typescript", "react", "nodejs", "postgresql"],
            "matchScore": 72.0,
            "description": "Join our team as a full-stack engineer. Work with TypeScript, React, and Node.js.",
            "requirements": ["3+ years experience", "React/TypeScript skills"],
            "aboutCompany": "Fast-growing startup",
            "saved": False,
            "applyUrl": "https://example.com/job/2",
        },
    ]
