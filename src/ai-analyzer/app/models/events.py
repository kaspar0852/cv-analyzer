from pydantic import BaseModel

class RawTextExtractedEvent(BaseModel):
    uploadId: str
    rawText: str

class CVAnalysisCompletedEvent(BaseModel):
    uploadId: str
    structuredJson: str
