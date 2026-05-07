from sqlalchemy import Column, String, ForeignKey, DateTime, func
from sqlalchemy.dialects.sqlite import JSON
from database import Base


class Profile(Base):
    __tablename__ = "profiles"

    user_id = Column(String(36), ForeignKey("users.id"), primary_key=True, unique=True)
    skills = Column(JSON, default=list, nullable=False)
    experience = Column(JSON, default=list, nullable=False)
    projects = Column(JSON, default=list, nullable=False)
    education = Column(JSON, default=list, nullable=False)
    seniority_level = Column(String(50), default="Junior", nullable=False)
    domain_exposure = Column(JSON, default=list, nullable=False)
    training_profile = Column(JSON, default=dict, nullable=False)
    resume_filename = Column(String(255), nullable=True)
    resume_path = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<Profile {self.user_id}>"
