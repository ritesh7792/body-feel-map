#!/usr/bin/env python3
"""
Users Router - Simplified for in-memory storage
"""

from fastapi import APIRouter

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me")
async def get_current_user():
    """Get current user information (placeholder for future authentication)"""
    # TODO: Implement user authentication
    return {"message": "User authentication not yet implemented"}

@router.get("/profile")
async def get_user_profile():
    """Get user profile information (placeholder for future implementation)"""
    # TODO: Implement user profile
    return {"message": "User profile not yet implemented"}
