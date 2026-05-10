import json
import time
import logging
import uuid
from app.core.config import settings
from app.core.database import get_sessionmaker
from app.models.analysis import Analysis
from app.services.pipeline.stages import (
    ExtractionStage, ContextStage, ScoringStage, 
    RecommendationStage, ATSStage, CoverLetterStage, SalaryStage
)

logger = logging.getLogger("AIAnalyzer")

class AIService:
    """Orchestrator for the CV analysis pipeline with Database integration."""
    
    def __init__(self):
        # Initialize stages
        self.s1 = ExtractionStage()
        self.s2 = ContextStage()
        self.s3 = ScoringStage()
        self.s4 = RecommendationStage()
        self.s5 = ATSStage()
        self.s6 = CoverLetterStage()
        self.s7 = SalaryStage()

    async def analyze_cv_pipeline(self, raw_text: str, upload_id: str) -> str:
        pipeline_start_time = time.time()
        logger.info(f"== Starting Pipeline for UploadId: {upload_id} ==")

        # Create Initial DB Record
        async with get_sessionmaker()() as session:
            analysis_record = Analysis(
                upload_id=uuid.UUID(upload_id),
                status="Processing",
                model_name=settings.OLLAMA_MODEL,
                raw_text=raw_text # Optional: if you want to store input
            )
            session.add(analysis_record)
            await session.commit()
            await session.refresh(analysis_record)

        try:
            # Stage 1: Extraction
            structured_data = await self.s1.run(raw_text=raw_text)
            
            # Stage 2: Context
            role_context = await self.s2.run(structured_data=structured_data)
            
            # Stage 3: Scoring
            scoring_results = await self.s3.run(structured_data=structured_data, role_context=role_context)
            
            # Stage 4: Recommendations
            recommendations = await self.s4.run(scoring_results=scoring_results, role_context=role_context)
            
            # Stage 5: ATS
            ats_results = await self.s5.run(structured_data=structured_data, role_context=role_context)
            
            # Stage 6: Cover Letter
            cover_letter = await self.s6.run(role_context=role_context, scoring_results=scoring_results, recommendations=recommendations)
            
            # Stage 7: Salary
            salary = await self.s7.run(role_context=role_context)

            # Prepare results
            final_result_dict = {
                "structured_data": structured_data,
                "role_context": role_context,
                "scoring_results": scoring_results,
                "recommendations": recommendations,
                "ats_results": ats_results,
                "cover_letter_guidance": cover_letter,
                "salary_insights": salary
            }

            total_duration = time.time() - pipeline_start_time

            # Update DB Record with all data
            async with get_sessionmaker()() as session:
                # Re-fetch the record
                from sqlalchemy import select
                stmt = select(Analysis).where(Analysis.id == analysis_record.id)
                res = await session.execute(stmt)
                db_record = res.scalar_one()

                db_record.status = "Completed"
                db_record.primary_industry = role_context.get("primaryIndustry")
                db_record.target_role_level = role_context.get("targetRoleLevel")
                db_record.role_specialization = role_context.get("roleSpecialization")
                db_record.years_of_experience = role_context.get("yearsOfExperience")
                db_record.overall_score = scoring_results.get("overallScore")
                db_record.ats_score = ats_results.get("atsScore")
                db_record.full_result_json = final_result_dict
                db_record.duration_seconds = total_duration
                
                await session.commit()

            logger.info(f"== Pipeline Completed and Saved to DB in {total_duration:.2f}s ==")
            return final_result_dict
            
        except Exception as e:
            logger.error(f"Pipeline failed for {upload_id}: {e}")
            async with get_sessionmaker()() as session:
                from sqlalchemy import select
                stmt = select(Analysis).where(Analysis.id == analysis_record.id)
                res = await session.execute(stmt)
                db_record = res.scalar_one()
                db_record.status = "Failed"
                await session.commit()
            return {"error": str(e)}

ai_service = AIService()
