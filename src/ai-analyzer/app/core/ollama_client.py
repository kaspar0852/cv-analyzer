import json
import logging
import httpx
from app.core.config import settings

logger = logging.getLogger("AIAnalyzer")

class OllamaClient:
    """Low-level client for Ollama API communication."""
    
    @staticmethod
    def call_sync(prompt: str, timeout: float = 180.0, num_predict: int = 4096) -> str:
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
                        "num_thread": settings.OLLAMA_NUM_THREAD,
                        "num_ctx": settings.OLLAMA_NUM_CTX,
                        "num_predict": num_predict,
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
