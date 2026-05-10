import json
import logging
from typing import Dict, Any
from app.services.pipeline.base import BaseStage

logger = logging.getLogger("AIAnalyzer")

class InterviewPrepStage(BaseStage):
    def __init__(self):
        super().__init__("Strategic Interview Prep")
        # Stage 8 is very heavy, increase timeout significantly
        self.timeout = 600
        self.num_predict = 12000

    def get_prompt(self, structured_data: Dict, cv_analysis: Dict, role_context: Dict, recommendations: Dict) -> str:
        """
        Generates the detailed prompt for Stage 8.
        """
        prompt = f"""
You are an elite technical interviewer. Generate a personalized interview preparation package.

CRITICAL: You MUST return ONLY valid JSON in the exact format specified below. Do not include any markdown formatting or extra text.

REQUIRED JSON STRUCTURE:
{{
  "interviewPrepPackage": {{
    "summary": "High-level strategy summary",
    "questions": [
      {{
        "id": "Q1",
        "category": "Technical | Behavioral | Gap-Targeting",
        "difficulty": "Easy | Medium | Hard",
        "question": "The actual question",
        "whyTheyreAsking": "Interviewer intent",
        "evaluationCriteria": ["What a good answer looks like"],
        "redFlags": ["What to avoid saying"],
        "answerStrategy": {{
            "framework": "STAR | CAR | Technical Deep Dive",
            "stepByStep": [
                {{ "step": "S/T/A/R", "guidance": "Detailed advice" }}
            ]
        }},
        "personalizedAnchors": [
            {{ "cvReference": "Specific project/skill from their CV", "howToUse": "How to anchor this answer" }}
        ],
        "isGapQuestion": true/false,
        "gapBridgeStrategy": {{
            "gapTopic": "The missing skill",
            "honestPivotApproach": "How to handle not knowing this",
            "transferableExperience": "What to mention instead",
            "learningCommitment": "Future plan"
        }}
      }}
    ]
  }}
}}

**INPUT DATA:**
CV Data: {json.dumps(structured_data)}
Gaps Identified: {json.dumps(cv_analysis.get('criticalGaps', []))}
Target Role: {role_context.get('roleSpecialization')} at {role_context.get('targetRoleLevel')} level.

Generate 10-12 questions. Ensure at least 3 are 'Gap-Targeting' based on the identified gaps.
"""
        return prompt
