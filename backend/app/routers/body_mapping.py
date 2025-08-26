#!/usr/bin/env python3
"""
Body Mapping Router - Simplified for in-memory storage
"""

from fastapi import APIRouter, HTTPException
from typing import Dict, List, Any
from pydantic import BaseModel
from ..services.memory_storage import memory_storage

# Request/Response models
class BodyMappingRequest(BaseModel):
    session_id: str
    body_markings: Dict[str, str]
    view: str = "front"

class BodyMappingResponse(BaseModel):
    success: bool
    data: Dict[str, Any]
    message: str

router = APIRouter(prefix="/body-mappings", tags=["body-mapping"])

@router.post("/", response_model=BodyMappingResponse)
async def create_body_mapping(request: BodyMappingRequest) -> BodyMappingResponse:
    """Create a new body mapping session"""
    try:
        # Validate view
        if request.view not in ["front", "back"]:
            raise HTTPException(status_code=400, detail="View must be 'front' or 'back'")
        
        # Create session if it doesn't exist
        if request.session_id not in memory_storage.sessions:
            memory_storage.create_session(request.session_id)
        
        # Save body mapping
        mapping_id = memory_storage.save_body_mapping(
            request.session_id, 
            request.body_markings, 
            request.view
        )
        
        return BodyMappingResponse(
            success=True,
            data={
                "mapping_id": mapping_id,
                "session_id": request.session_id,
                "body_markings": request.body_markings,
                "view": request.view
            },
            message="Body mapping created successfully"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create body mapping: {str(e)}")

@router.get("/{mapping_id}")
async def get_body_mapping(mapping_id: str) -> Dict[str, Any]:
    """Get a specific body mapping by ID"""
    mapping = memory_storage.get_body_mapping(mapping_id)
    if not mapping:
        raise HTTPException(status_code=404, detail="Body mapping not found")
    
    return {
        "success": True,
        "data": mapping,
        "message": "Body mapping retrieved successfully"
    }

@router.get("/session/{session_id}")
async def get_body_mappings_by_session(session_id: str) -> Dict[str, Any]:
    """Get all body mappings for a session"""
    mappings = memory_storage.get_session_mappings(session_id)
    
    return {
        "success": True,
        "data": {
            "session_id": session_id,
            "mappings": mappings
        },
        "message": "Session mappings retrieved successfully"
    }

@router.put("/{mapping_id}")
async def update_body_mapping(
    mapping_id: str,
    request: BodyMappingRequest
) -> Dict[str, Any]:
    """Update an existing body mapping"""
    existing_mapping = memory_storage.get_body_mapping(mapping_id)
    if not existing_mapping:
        raise HTTPException(status_code=404, detail="Body mapping not found")
    
    try:
        # Update the mapping
        existing_mapping['body_markings'] = request.body_markings
        existing_mapping['view'] = request.view
        
        return {
            "success": True,
            "data": existing_mapping,
            "message": "Body mapping updated successfully"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update body mapping: {str(e)}")

@router.delete("/{mapping_id}")
async def delete_body_mapping(mapping_id: str) -> Dict[str, Any]:
    """Delete a body mapping"""
    mapping = memory_storage.get_body_mapping(mapping_id)
    if not mapping:
        raise HTTPException(status_code=404, detail="Body mapping not found")
    
    try:
        # Remove from body mappings
        if mapping_id in memory_storage.body_mappings:
            del memory_storage.body_mappings[mapping_id]
        
        # Remove from emotion results
        if mapping_id in memory_storage.emotion_results:
            del memory_storage.emotion_results[mapping_id]
        
        return {
            "success": True,
            "message": "Body mapping deleted successfully"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete body mapping: {str(e)}")

@router.get("/")
async def list_body_mappings() -> Dict[str, Any]:
    """List all body mappings"""
    mappings = list(memory_storage.body_mappings.values())
    
    return {
        "success": True,
        "data": {
            "total": len(mappings),
            "mappings": mappings
        },
        "message": "Body mappings retrieved successfully"
    }

@router.get("/sessions/list")
async def list_sessions() -> Dict[str, Any]:
    """List all sessions"""
    sessions = memory_storage.list_sessions()
    
    return {
        "success": True,
        "data": {
            "total": len(sessions),
            "sessions": sessions
        },
        "message": "Sessions retrieved successfully"
    }

@router.delete("/sessions/{session_id}")
async def delete_session(session_id: str) -> Dict[str, Any]:
    """Delete a session and all its mappings"""
    success = memory_storage.delete_session(session_id)
    if not success:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return {
        "success": True,
        "message": "Session deleted successfully"
    }

@router.get("/stats/overview")
async def get_storage_stats() -> Dict[str, Any]:
    """Get storage statistics"""
    stats = memory_storage.get_stats()
    
    return {
        "success": True,
        "data": stats,
        "message": "Storage statistics retrieved successfully"
    }
