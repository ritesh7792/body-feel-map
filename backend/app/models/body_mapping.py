from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    body_mappings = relationship("BodyMapping", back_populates="user")

class BodyMapping(Base):
    __tablename__ = "body_mappings"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    session_id = Column(String, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="body_mappings")
    sensations = relationship("Sensation", back_populates="body_mapping")

class Sensation(Base):
    __tablename__ = "sensations"
    
    id = Column(Integer, primary_key=True, index=True)
    body_mapping_id = Column(Integer, ForeignKey("body_mappings.id"))
    body_region = Column(String, index=True)
    sensation_type = Column(String, index=True)  # hot, warm, cool, cold, numb
    view = Column(String)  # front or back
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    body_mapping = relationship("BodyMapping", back_populates="sensations")

class EmotionAnalysis(Base):
    __tablename__ = "emotion_analyses"
    
    id = Column(Integer, primary_key=True, index=True)
    body_mapping_id = Column(Integer, ForeignKey("body_mappings.id"))
    emotion = Column(String, index=True)
    confidence = Column(Integer)  # 0-100
    description = Column(Text)
    patterns = Column(Text)  # JSON string of patterns
    created_at = Column(DateTime, default=datetime.utcnow)
