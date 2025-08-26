#!/usr/bin/env python3
"""
Simple In-Memory Storage Service
Replaces PostgreSQL and Redis with simple Python dictionaries
"""

from typing import Dict, List, Optional
from datetime import datetime
import uuid

class MemoryStorage:
    """Simple in-memory storage for body mappings and sessions"""
    
    def __init__(self):
        # In-memory storage
        self.body_mappings: Dict[str, Dict] = {}
        self.sessions: Dict[str, Dict] = {}
        self.emotion_results: Dict[str, Dict] = {}
        
        # Simple counter for IDs
        self._counter = 1
    
    def create_session(self, session_id: Optional[str] = None) -> str:
        """Create a new session"""
        if not session_id:
            session_id = str(uuid.uuid4())
        
        self.sessions[session_id] = {
            'id': session_id,
            'created_at': datetime.now().isoformat(),
            'body_mappings': []
        }
        
        return session_id
    
    def save_body_mapping(self, session_id: str, body_markings: Dict[str, str], view: str) -> str:
        """Save body mapping to memory"""
        mapping_id = str(self._counter)
        self._counter += 1
        
        mapping_data = {
            'id': mapping_id,
            'session_id': session_id,
            'body_markings': body_markings,
            'view': view,
            'created_at': datetime.now().isoformat()
        }
        
        self.body_mappings[mapping_id] = mapping_data
        
        # Add to session
        if session_id in self.sessions:
            self.sessions[session_id]['body_mappings'].append(mapping_id)
        
        return mapping_id
    
    def get_body_mapping(self, mapping_id: str) -> Optional[Dict]:
        """Get body mapping by ID"""
        return self.body_mappings.get(mapping_id)
    
    def get_session_mappings(self, session_id: str) -> List[Dict]:
        """Get all body mappings for a session"""
        if session_id not in self.sessions:
            return []
        
        mapping_ids = self.sessions[session_id]['body_mappings']
        return [self.body_mappings.get(mid) for mid in mapping_ids if mid in self.body_mappings]
    
    def save_emotion_result(self, mapping_id: str, emotion_result: Dict) -> None:
        """Save emotion analysis result"""
        self.emotion_results[mapping_id] = {
            'mapping_id': mapping_id,
            'result': emotion_result,
            'created_at': datetime.now().isoformat()
        }
    
    def get_emotion_result(self, mapping_id: str) -> Optional[Dict]:
        """Get emotion analysis result by mapping ID"""
        return self.emotion_results.get(mapping_id)
    
    def list_sessions(self) -> List[Dict]:
        """List all sessions"""
        return list(self.sessions.values())
    
    def delete_session(self, session_id: str) -> bool:
        """Delete a session and all its mappings"""
        if session_id not in self.sessions:
            return False
        
        # Remove all mappings for this session
        mapping_ids = self.sessions[session_id]['body_mappings']
        for mid in mapping_ids:
            if mid in self.body_mappings:
                del self.body_mappings[mid]
            if mid in self.emotion_results:
                del self.emotion_results[mid]
        
        # Remove session
        del self.sessions[session_id]
        return True
    
    def get_stats(self) -> Dict:
        """Get storage statistics"""
        return {
            'total_sessions': len(self.sessions),
            'total_mappings': len(self.body_mappings),
            'total_emotion_results': len(self.emotion_results),
            'memory_usage': 'In-memory storage'
        }
    
    def clear_all(self) -> None:
        """Clear all data (useful for testing)"""
        self.body_mappings.clear()
        self.sessions.clear()
        self.emotion_results.clear()
        self._counter = 1

# Global instance
memory_storage = MemoryStorage()
