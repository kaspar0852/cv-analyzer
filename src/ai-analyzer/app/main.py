import logging
import threading
import asyncio
from fastapi import FastAPI
from sqlalchemy import text
from app.core.events import event_bus
from app.core.database import Base, get_engine, ensure_database_exists
from app.models.analysis import Analysis # Ensure model is imported for creation

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("AIAnalyzer")

app = FastAPI(title="AI Analyzer Service")

async def initialize_db():
    try:
        # 1. Ensure the DB itself exists
        await ensure_database_exists()
        
        # 2. Create the tables within that DB (if missing)
        async with get_engine().begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
            
        # 3. Ensure new columns exist (manual migration for existing tables)
        async with get_engine().begin() as conn:
            await conn.execute(text("ALTER TABLE analyses ADD COLUMN IF NOT EXISTS raw_text TEXT"))
            
        logger.info("Database initialized and schema verified successfully.")
    except Exception as e:
        logger.error(f"Error during DB initialization: {e}")

@app.on_event("startup")
def startup_event():
    # Run DB initialization in the background
    loop = asyncio.get_event_loop()
    if loop.is_running():
        loop.create_task(initialize_db())
    else:
        loop.run_until_complete(initialize_db())

    # Start RabbitMQ consumer in a background thread
    logger.info("Starting RabbitMQ consumer thread...")
    consumer_thread = threading.Thread(target=event_bus.start_consuming, daemon=True)
    consumer_thread.start()

@app.get("/")
async def root():
    return {"service": "AI Analyzer", "status": "running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.get("/api/analysis/{upload_id}")
async def get_analysis(upload_id: str):
    """Retrieves the full 7-stage analysis from the database."""
    from app.core.database import get_session
    from sqlalchemy import select
    
    async with get_session() as session:
        result = await session.execute(select(Analysis).filter(Analysis.upload_id == upload_id))
        analysis = result.scalars().first()
        
        if not analysis:
            from fastapi import HTTPException
            raise HTTPException(status_code=404, detail="Analysis not found")
            
        results = analysis.full_result_json or {}
        
        # Combine all stages into a single JSON response
        return {
            "uploadId": str(analysis.upload_id),
            "status": analysis.status,
            "overallScore": analysis.overall_score,
            "atsScore": analysis.ats_score,
            "primaryIndustry": analysis.primary_industry,
            "targetRoleLevel": analysis.target_role_level,
            "roleSpecialization": analysis.role_specialization,
            "yearsOfExperience": analysis.years_of_experience,
            "results": {
                "stage1_extraction": results.get("structured_data"),
                "stage2_context": results.get("role_context"),
                "stage3_scoring": results.get("scoring_results"),
                "stage4_recommendations": results.get("recommendations"),
                "stage5_ats": results.get("ats_results"),
                "stage6_cover_letter": results.get("cover_letter_guidance"),
                "stage7_salary": results.get("salary_insights")
            },
            "metadata": {
                "model": analysis.model_name,
                "duration": analysis.duration_seconds,
                "createdAt": analysis.created_at.isoformat()
            }
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
