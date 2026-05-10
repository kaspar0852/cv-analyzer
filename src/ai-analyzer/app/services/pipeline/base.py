import json
import time
import logging
from abc import ABC, abstractmethod
from app.core.ollama_client import ollama_client

logger = logging.getLogger("AIAnalyzer")

class BaseStage(ABC):
    """Abstract base class for all pipeline stages."""
    
    def __init__(self, name: str):
        self.name = name
        self.timeout = 180.0 # Default timeout for stages
        self.num_predict = 4096

    def _extract_json(self, response_text: str) -> str:
        """Extract the first complete JSON object from a model response."""
        text = response_text.strip()
        start = text.find('{')
        if start == -1:
            return text

        depth = 0
        in_string = False
        escaped = False

        for index in range(start, len(text)):
            char = text[index]

            if in_string:
                if escaped:
                    escaped = False
                elif char == '\\':
                    escaped = True
                elif char == '"':
                    in_string = False
                continue

            if char == '"':
                in_string = True
            elif char == '{':
                depth += 1
            elif char == '}':
                depth -= 1
                if depth == 0:
                    return text[start:index + 1]

        return text[start:]

    async def run(self, **kwargs) -> dict:
        """Executes the stage with timing and logging."""
        start_time = time.time()
        logger.info(f">>> {self.name} Started")
        
        try:
            prompt = self.get_prompt(**kwargs)
            response_text = ollama_client.call_sync(
                prompt,
                timeout=self.timeout,
                num_predict=self.num_predict
            )
            
            try:
                result = json.loads(self._extract_json(response_text))
            except json.JSONDecodeError as je:
                logger.warning(f"--- ATTEMPTING JSON REPAIR FOR {self.name} ---")
                repaired_text = self._extract_json(response_text)
                open_braces = repaired_text.count('{')
                close_braces = repaired_text.count('}')
                if open_braces > close_braces:
                    repaired_text += '}' * (open_braces - close_braces)
                
                try:
                    result = json.loads(repaired_text)
                    logger.info(f"--- JSON REPAIRED SUCCESSFULLY FOR {self.name} ---")
                except json.JSONDecodeError:
                    logger.error(f"--- FAILED TO PARSE JSON FROM {self.name} EVEN AFTER REPAIR ---")
                    logger.error(f"RAW TEXT: {response_text}")
                    logger.error(f"PARSE ERROR: {je}")
                    return {"error": f"Invalid JSON format from AI in {self.name}"}

            duration = time.time() - start_time
            logger.info(f">>> {self.name} Completed ({duration:.2f}s)")
            logger.info(f"--- {self.name} RESULT ---")
            logger.info(json.dumps(result, indent=2))
            logger.info(f"--------------------------")
            
            return result
        except Exception as e:
            logger.error(f"Error in {self.name}: {e}")
            return {"error": f"Stage {self.name} failed: {str(e)}"}

    @abstractmethod
    def get_prompt(self, **kwargs) -> str:
        """Each stage must define its own prompt."""
        pass
