from app.services.pipeline.base import BaseStage
from app.prompts.templates import (
    EXTRACTION_PROMPT, CONTEXT_PROMPT, SCORING_PROMPT,
    RECOMMENDATION_PROMPT, ATS_PROMPT, COVER_LETTER_PROMPT, SALARY_PROMPT
)
import json

class ExtractionStage(BaseStage):
    def __init__(self):
        super().__init__("Stage 1: Extraction")

    def get_prompt(self, raw_text: str) -> str:
        return EXTRACTION_PROMPT.format(raw_text=raw_text)

class ContextStage(BaseStage):
    def __init__(self):
        super().__init__("Stage 2: Role Context")

    def get_prompt(self, structured_data: dict) -> str:
        return CONTEXT_PROMPT.format(structured_data=json.dumps(structured_data))

class ScoringStage(BaseStage):
    def __init__(self):
        super().__init__("Stage 3: Scoring & Gaps")

    def get_prompt(self, structured_data: dict, role_context: dict) -> str:
        industry = role_context.get("primaryIndustry", "Software Development")
        role = role_context.get("roleSpecialization", "Software Engineer")
        level = role_context.get("targetRoleLevel", "Mid-Level")
        return SCORING_PROMPT.format(
            industry=industry, 
            role=role, 
            level=level, 
            structured_data=json.dumps(structured_data)
        )

class RecommendationStage(BaseStage):
    def __init__(self):
        super().__init__("Stage 4: Recommendations")

    def get_prompt(self, scoring_results: dict, role_context: dict) -> str:
        industry = role_context.get("primaryIndustry", "Software Development")
        role = role_context.get("roleSpecialization", "Software Engineer")
        return RECOMMENDATION_PROMPT.format(
            industry=industry, 
            role=role, 
            scoring_results=json.dumps(scoring_results)
        )

class ATSStage(BaseStage):
    def __init__(self):
        super().__init__("Stage 5: ATS Check")

    def get_prompt(self, structured_data: dict, role_context: dict) -> str:
        industry = role_context.get("primaryIndustry", "Software Development")
        role = role_context.get("roleSpecialization", "Software Engineer")
        return ATS_PROMPT.format(
            industry=industry, 
            role=role, 
            structured_data=json.dumps(structured_data)
        )

class CoverLetterStage(BaseStage):
    def __init__(self):
        super().__init__("Stage 6: Cover Letter")

    def get_prompt(self, role_context: dict, scoring_results: dict, recommendations: dict) -> str:
        industry = role_context.get("primaryIndustry", "Software Development")
        role = role_context.get("roleSpecialization", "Software Engineer")
        years = role_context.get("yearsOfExperience", 0)
        level = role_context.get("targetRoleLevel", "Mid-Level")
        strengths = ", ".join(scoring_results.get("strengths", [])[:3])
        return COVER_LETTER_PROMPT.format(
            industry=industry,
            role=role,
            years=years,
            level=level,
            strengths=strengths,
            scoring_results=json.dumps(scoring_results),
            recommendations=json.dumps(recommendations)
        )

class SalaryStage(BaseStage):
    def __init__(self):
        super().__init__("Stage 7: Salary Insights")

    def get_prompt(self, structured_data: dict, role_context: dict) -> str:
        role = role_context.get("roleSpecialization", "Software Engineer")
        years = role_context.get("yearsOfExperience", 0)
        industry = role_context.get("primaryIndustry", "Software Development")
        skills = structured_data.get("skills", [])
        education = structured_data.get("education", [])
        experience = structured_data.get("experience", [])

        return SALARY_PROMPT.format(
            role_specialization=role,
            years_of_experience=years,
            technical_skills=json.dumps(skills),
            industry=industry,
            education=json.dumps(education),
            recent_companies=json.dumps(experience[:3]),
            has_international_experience="Unknown",
            key_technical_skills=json.dumps(skills),
            detected_industry=industry,
            education_level=json.dumps(education),
            latest_companies=json.dumps(experience[:3]),
            structured_cv_data=json.dumps(structured_data),
            role_context=json.dumps(role_context)
        )
