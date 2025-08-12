from fastapi import APIRouter, HTTPException, Depends
from typing import List
from sqlalchemy.orm import Session

from app.schemas.body_mapping import EmotionResult, BodyMarkings
from app.services.emotion_analysis import EmotionAnalysisService
from app.core.database import get_db
from app.models.body_mapping import BodyMapping, Sensation

router = APIRouter()

@router.post("/emotions/analyze", response_model=List[EmotionResult])
async def analyze_emotions_from_markings(markings: BodyMarkings):
    """Analyze emotions from body markings without saving to database"""
    try:
        emotions = EmotionAnalysisService.analyze_emotions(markings)
        return emotions
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze emotions: {str(e)}")

@router.get("/emotions/body-mapping/{mapping_id}", response_model=List[EmotionResult])
async def analyze_emotions_from_mapping(mapping_id: int, db: Session = Depends(get_db)):
    """Analyze emotions from a saved body mapping"""
    # Get the body mapping
    db_mapping = db.query(BodyMapping).filter(BodyMapping.id == mapping_id).first()
    if not db_mapping:
        raise HTTPException(status_code=404, detail="Body mapping not found")
    
    try:
        # Convert database sensations to BodyMarkings format
        front_markings = {}
        back_markings = {}
        
        for sensation in db_mapping.sensations:
            if sensation.view == "front":
                front_markings[sensation.body_region] = sensation.sensation_type
            elif sensation.view == "back":
                back_markings[sensation.body_region] = sensation.sensation_type
        
        # Create BodyMarkings object
        markings = BodyMarkings(front=front_markings, back=back_markings)
        
        # Analyze emotions
        emotions = EmotionAnalysisService.analyze_emotions(markings)
        return emotions
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze emotions: {str(e)}")

@router.get("/emotions/session/{session_id}", response_model=List[EmotionResult])
async def analyze_emotions_from_session(session_id: str, db: Session = Depends(get_db)):
    """Analyze emotions from a body mapping session"""
    # Get the body mapping by session ID
    db_mapping = db.query(BodyMapping).filter(BodyMapping.session_id == session_id).first()
    if not db_mapping:
        raise HTTPException(status_code=404, detail="Body mapping session not found")
    
    try:
        # Convert database sensations to BodyMarkings format
        front_markings = {}
        back_markings = {}
        
        for sensation in db_mapping.sensations:
            if sensation.view == "front":
                front_markings[sensation.body_region] = sensation.sensation_type
            elif sensation.view == "back":
                back_markings[sensation.body_region] = sensation.sensation_type
        
        # Create BodyMarkings object
        markings = BodyMarkings(front=front_markings, back=back_markings)
        
        # Analyze emotions
        emotions = EmotionAnalysisService.analyze_emotions(markings)
        return emotions
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze emotions: {str(e)}")

@router.get("/emotions/patterns")
async def get_emotion_patterns():
    """Get information about emotion patterns and body sensations"""
    try:
        patterns = EmotionAnalysisService.EMOTION_PATTERNS
        return {
            "message": "Emotion patterns retrieved successfully",
            "patterns": patterns
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve emotion patterns: {str(e)}")

@router.get("/emotions/sensations")
async def get_sensation_types():
    """Get information about different sensation types"""
    sensation_types = {
        "hot": {
            "description": "Strong, intense activation",
            "color": "sensation-hot",
            "emotional_associations": ["anger", "fear", "surprise", "pride"]
        },
        "warm": {
            "description": "Mild activation or positive energy",
            "color": "sensation-warm", 
            "emotional_associations": ["happiness", "love", "contentment", "pride"]
        },
        "cool": {
            "description": "Slight decrease in energy or detachment",
            "color": "sensation-cool",
            "emotional_associations": ["sadness", "fear", "disgust"]
        },
        "cold": {
            "description": "Marked withdrawal or strong negative emotion",
            "color": "sensation-cold",
            "emotional_associations": ["sadness", "fear", "shame", "withdrawal"]
        },
        "numb": {
            "description": "No sensation, feeling disconnected",
            "color": "sensation-numb",
            "emotional_associations": ["sadness", "shame", "emotional_numbness", "overwhelm"]
        }
    }
    
    return {
        "message": "Sensation types retrieved successfully",
        "sensation_types": sensation_types
    }
