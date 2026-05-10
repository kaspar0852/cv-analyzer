import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "rabbitmq-service")
    RABBITMQ_USER = os.getenv("RABBITMQ_USER", "guest")
    RABBITMQ_PASS = os.getenv("RABBITMQ_PASS", "guest")
    
    OLLAMA_URL = os.getenv("OLLAMA_URL", "http://host.docker.internal:11434/api/generate")
    OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "gemma4:e4b")
    OLLAMA_NUM_THREAD = int(os.getenv("OLLAMA_NUM_THREAD", "8"))
    OLLAMA_NUM_CTX = int(os.getenv("OLLAMA_NUM_CTX", "16384"))
    
    # Event Names
    RAW_TEXT_EVENT = "Contracts.Events:RawTextExtractedEvent"
    COMPLETION_EVENT = "Contracts.Events:CVAnalysisCompletedEvent"
    
settings = Config()
