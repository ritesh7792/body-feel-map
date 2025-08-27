#!/usr/bin/env python3
"""
Emotions router for emotion analysis endpoints
"""

from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from pydantic import BaseModel
from ..services.emotion_analysis import EmotionAnalysisService

# Request/Response models
class EmotionAnalysisRequest(BaseModel):
    body_markings: Dict[str, str]
    view: str = "front"

class EmotionAnalysisResponse(BaseModel):
    success: bool
    data: Dict[str, Any]
    message: str

router = APIRouter(prefix="/emotions", tags=["emotions"])

# Initialize the emotion analysis service
emotion_service = EmotionAnalysisService()

@router.options("/analyze")
async def analyze_emotions_options():
    """Handle OPTIONS request for CORS preflight"""
    return {"message": "OK"}

@router.post("/analyze", response_model=EmotionAnalysisResponse)
async def analyze_emotions(request: EmotionAnalysisRequest) -> EmotionAnalysisResponse:
    """Analyze emotions from body sensations"""
    try:
        # Validate input
        if not request.body_markings:
            raise HTTPException(status_code=400, detail="Body markings are required")
        
        if request.view not in ["front", "back"]:
            raise HTTPException(status_code=400, detail="View must be 'front' or 'back'")
        
        # Analyze emotions using the service
        result = emotion_service.analyze_emotions(request.body_markings, request.view)
        
        return EmotionAnalysisResponse(
            success=True,
            data=result,
            message="Emotion analysis completed successfully"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Emotion analysis failed: {str(e)}")

@router.get("/status")
async def get_service_status() -> Dict[str, Any]:
    """Get the status of the emotion analysis service"""
    try:
        status = emotion_service.get_service_status()
        return {
            "success": True,
            "data": status,
            "message": "Service status retrieved successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get service status: {str(e)}")

@router.post("/test")
async def test_emotion_analysis() -> Dict[str, Any]:
    """Test the emotion analysis service with sample data"""
    try:
        # Test with sample data
        test_markings = {
            'head': 'hot',
            'chest': 'warm',
            'left-arm': 'hot'
        }
        
        result = emotion_service.analyze_emotions(test_markings, 'front')
        
        return {
            "success": True,
            "data": {
                "test_markings": test_markings,
                "result": result
            },
            "message": "Test analysis completed successfully"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Test analysis failed: {str(e)}")
