from fastapi import APIRouter, HTTPException, Depends
from typing import List
from sqlalchemy.orm import Session

from app.schemas.body_mapping import (
    BodyMappingCreate, 
    BodyMappingResponse, 
    BodyMappingUpdate,
    SensationCreate,
    SensationResponse
)
from app.services.emotion_analysis import EmotionAnalysisService
from app.core.database import get_db
from app.models.body_mapping import BodyMapping, Sensation

router = APIRouter()

@router.post("/body-mappings/", response_model=BodyMappingResponse)
async def create_body_mapping(
    body_mapping: BodyMappingCreate,
    db: Session = Depends(get_db)
):
    """Create a new body mapping session"""
    try:
        # Create the body mapping record
        db_body_mapping = BodyMapping(
            session_id=body_mapping.session_id,
            user_id=None  # TODO: Add user authentication
        )
        db.add(db_body_mapping)
        db.flush()  # Get the ID without committing
        
        # Create sensation records
        for sensation_data in body_mapping.sensations:
            db_sensation = Sensation(
                body_mapping_id=db_body_mapping.id,
                body_region=sensation_data.body_region,
                sensation_type=sensation_data.sensation_type,
                view=sensation_data.view
            )
            db.add(db_sensation)
        
        db.commit()
        db.refresh(db_body_mapping)
        
        return BodyMappingResponse(
            id=db_body_mapping.id,
            session_id=db_body_mapping.session_id,
            created_at=db_body_mapping.created_at,
            sensations=[
                SensationResponse(
                    id=s.id,
                    body_region=s.body_region,
                    sensation_type=s.sensation_type,
                    view=s.view,
                    created_at=s.created_at
                ) for s in db_body_mapping.sensations
            ]
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create body mapping: {str(e)}")

@router.get("/body-mappings/{mapping_id}", response_model=BodyMappingResponse)
async def get_body_mapping(mapping_id: int, db: Session = Depends(get_db)):
    """Get a specific body mapping by ID"""
    db_mapping = db.query(BodyMapping).filter(BodyMapping.id == mapping_id).first()
    if not db_mapping:
        raise HTTPException(status_code=404, detail="Body mapping not found")
    
    return BodyMappingResponse(
        id=db_mapping.id,
        session_id=db_mapping.session_id,
        created_at=db_mapping.created_at,
        sensations=[
            SensationResponse(
                id=s.id,
                body_region=s.body_region,
                sensation_type=s.sensation_type,
                view=s.view,
                created_at=s.created_at
            ) for s in db_mapping.sensations
        ]
    )

@router.get("/body-mappings/session/{session_id}", response_model=BodyMappingResponse)
async def get_body_mapping_by_session(session_id: str, db: Session = Depends(get_db)):
    """Get a body mapping by session ID"""
    db_mapping = db.query(BodyMapping).filter(BodyMapping.session_id == session_id).first()
    if not db_mapping:
        raise HTTPException(status_code=404, detail="Body mapping not found")
    
    return BodyMappingResponse(
        id=db_mapping.id,
        session_id=db_mapping.session_id,
        created_at=db_mapping.created_at,
        sensations=[
            SensationResponse(
                id=s.id,
                body_region=s.body_region,
                sensation_type=s.sensation_type,
                view=s.view,
                created_at=s.created_at
            ) for s in db_mapping.sensations
        ]
    )

@router.put("/body-mappings/{mapping_id}", response_model=BodyMappingResponse)
async def update_body_mapping(
    mapping_id: int,
    body_mapping_update: BodyMappingUpdate,
    db: Session = Depends(get_db)
):
    """Update an existing body mapping"""
    db_mapping = db.query(BodyMapping).filter(BodyMapping.id == mapping_id).first()
    if not db_mapping:
        raise HTTPException(status_code=404, detail="Body mapping not found")
    
    try:
        # Delete existing sensations
        db.query(Sensation).filter(Sensation.body_mapping_id == mapping_id).delete()
        
        # Create new sensations
        for sensation_data in body_mapping_update.sensations:
            db_sensation = Sensation(
                body_mapping_id=mapping_id,
                body_region=sensation_data.body_region,
                sensation_type=sensation_data.sensation_type,
                view=sensation_data.view
            )
            db.add(db_sensation)
        
        db.commit()
        db.refresh(db_mapping)
        
        return BodyMappingResponse(
            id=db_mapping.id,
            session_id=db_mapping.session_id,
            created_at=db_mapping.created_at,
            sensations=[
                SensationResponse(
                    id=s.id,
                    body_region=s.body_region,
                    sensation_type=s.sensation_type,
                    view=s.view,
                    created_at=s.created_at
                ) for s in db_mapping.sensations
            ]
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update body mapping: {str(e)}")

@router.delete("/body-mappings/{mapping_id}")
async def delete_body_mapping(mapping_id: int, db: Session = Depends(get_db)):
    """Delete a body mapping"""
    db_mapping = db.query(BodyMapping).filter(BodyMapping.id == mapping_id).first()
    if not db_mapping:
        raise HTTPException(status_code=404, detail="Body mapping not found")
    
    try:
        # Delete associated sensations first
        db.query(Sensation).filter(Sensation.body_mapping_id == mapping_id).delete()
        # Delete the body mapping
        db.delete(db_mapping)
        db.commit()
        return {"message": "Body mapping deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to delete body mapping: {str(e)}")

@router.post("/body-mappings/{mapping_id}/sensations/", response_model=SensationResponse)
async def add_sensation(
    mapping_id: int,
    sensation: SensationCreate,
    db: Session = Depends(get_db)
):
    """Add a single sensation to an existing body mapping"""
    db_mapping = db.query(BodyMapping).filter(BodyMapping.id == mapping_id).first()
    if not db_mapping:
        raise HTTPException(status_code=404, detail="Body mapping not found")
    
    try:
        db_sensation = Sensation(
            body_mapping_id=mapping_id,
            body_region=sensation.body_region,
            sensation_type=sensation.sensation_type,
            view=sensation.view
        )
        db.add(db_sensation)
        db.commit()
        db.refresh(db_sensation)
        
        return SensationResponse(
            id=db_sensation.id,
            body_region=db_sensation.body_region,
            sensation_type=db_sensation.sensation_type,
            view=db_sensation.view,
            created_at=db_sensation.created_at
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to add sensation: {str(e)}")
