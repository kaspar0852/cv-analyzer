import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, JSON
from sqlalchemy.dialects.postgresql import JSONB, UUID
from app.core.database import Base

class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    upload_id = Column(UUID(as_uuid=True), index=True, nullable=False)
    status = Column(String, default="Processing")
    raw_text = Column(String, nullable=True)
    
    # Professional Context (From Stage 2)
    primary_industry = Column(String, nullable=True)
    target_role_level = Column(String, nullable=True)
    role_specialization = Column(String, nullable=True)
    years_of_experience = Column(Integer, nullable=True)
    
    # Scoring (From Stage 3 & 5)
    overall_score = Column(Integer, nullable=True)
    ats_score = Column(Integer, nullable=True)
    
    # The "Full Result" JSONB storage
    full_result_json = Column(JSONB, nullable=True)
    
    # Metadata
    model_name = Column(String, nullable=True)
    duration_seconds = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
