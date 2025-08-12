from pydantic import BaseModel
from typing import Dict, List, Optional
from datetime import datetime

# Request schemas
class SensationCreate(BaseModel):
    body_region: str
    sensation_type: str  # hot, warm, cool, cold, numb
    view: str  # front or back

class BodyMappingCreate(BaseModel):
    session_id: str
    sensations: List[SensationCreate]

class BodyMappingUpdate(BaseModel):
    sensations: List[SensationCreate]

# Response schemas
class SensationResponse(BaseModel):
    id: int
    body_region: str
    sensation_type: str
    view: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class BodyMappingResponse(BaseModel):
    id: int
    session_id: str
    created_at: datetime
    sensations: List[SensationResponse]
    
    class Config:
        from_attributes = True

class EmotionResult(BaseModel):
    emotion: str
    confidence: float
    description: str
    patterns: List[str]

class EmotionAnalysisResponse(BaseModel):
    body_mapping_id: int
    emotions: List[EmotionResult]
    created_at: datetime
    
    class Config:
        from_attributes = True

# Internal schemas for processing
class BodyMarkings(BaseModel):
    front: Dict[str, Optional[str]]
    back: Dict[str, Optional[str]]
