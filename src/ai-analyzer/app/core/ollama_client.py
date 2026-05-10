import json
import logging
import httpx
from app.core.config import settings

logger = logging.getLogger("AIAnalyzer")

class OllamaClient:
    """Low-level client for Ollama API communication."""
    
    @staticmethod
    def call_sync(prompt: str, timeout: float = 180.0) -> str:
        """Synchronous call to Ollama."""
        try:
            import httpx as sync_httpx
            response = sync_httpx.post(
                settings.OLLAMA_URL,
                json={
                    "model": settings.OLLAMA_MODEL,
                    "prompt": prompt,
                    "stream": False,
                    "format": "json",
                    "options": {
                        "num_thread": 2,
                        "num_ctx": 4096,      # Slightly more context
                        "num_predict": 2048,  # Allow for longer recommendations
                    }
                },
                timeout=timeout
            )
            response.raise_for_status()
            result = response.json()
            return result.get("response", "{}")
        except Exception as e:
            logger.error(f"OllamaClient Error: {e}")
            return json.dumps({"error": str(e)})

ollama_client = OllamaClient()
