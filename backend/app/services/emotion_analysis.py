#!/usr/bin/env python3
"""
Emotion Analysis Service
Uses LLM service with priority: Gemini API -> OpenAI API -> Local patterns
"""

from typing import Dict, List
from .llm_service import LLMService

class EmotionAnalysisService:
    """Service for analyzing emotions from body sensations"""
    
    def __init__(self):
        # Initialize the LLM service with priority order
        self.llm_service = LLMService()
        
        # Keep the original patterns as a backup
        self.EMOTION_PATTERNS = {
            'hot': {
                'head': ['Anger', 'Stress', 'Frustration'],
                'chest': ['Anxiety', 'Excitement', 'Anger'],
                'stomach': ['Nervousness', 'Excitement', 'Anger'],
                'arms': ['Tension', 'Stress', 'Anger'],
                'legs': ['Tension', 'Stress', 'Anger']
            },
            'warm': {
                'head': ['Contentment', 'Happiness', 'Calm'],
                'chest': ['Love', 'Happiness', 'Contentment'],
                'stomach': ['Contentment', 'Happiness', 'Calm'],
                'arms': ['Relaxation', 'Contentment', 'Happiness'],
                'legs': ['Relaxation', 'Contentment', 'Happiness']
            },
            'cold': {
                'head': ['Fear', 'Shock', 'Sadness'],
                'chest': ['Fear', 'Sadness', 'Withdrawal'],
                'stomach': ['Fear', 'Anxiety', 'Sadness'],
                'arms': ['Fear', 'Withdrawal', 'Sadness'],
                'legs': ['Fear', 'Withdrawal', 'Sadness']
            },
            'cool': {
                'head': ['Calm', 'Peace', 'Relaxation'],
                'chest': ['Calm', 'Peace', 'Relaxation'],
                'stomach': ['Calm', 'Peace', 'Relaxation'],
                'arms': ['Calm', 'Peace', 'Relaxation'],
                'legs': ['Calm', 'Peace', 'Relaxation']
            },
            'numb': {
                'head': ['Shock', 'Disconnection', 'Trauma'],
                'chest': ['Shock', 'Disconnection', 'Trauma'],
                'stomach': ['Shock', 'Disconnection', 'Trauma'],
                'arms': ['Shock', 'Disconnection', 'Trauma'],
                'legs': ['Shock', 'Disconnection', 'Trauma']
            }
        }
    
    def analyze_emotions(self, body_markings: Dict[str, str], view: str) -> Dict:
        """Analyze emotions using the prioritized LLM service"""
        try:
            print(f"🧠 Analyzing emotions with LLM service...")
            print(f"   Body markings: {body_markings}")
            print(f"   View: {view}")
            
            # Use the LLM service (Gemini -> OpenAI -> Local patterns)
            result = self.llm_service.analyze_emotions(body_markings, view)
            
            if result:
                print(f"✅ Emotion analysis successful: {result.get('emotion', 'Unknown')}")
                return result
            else:
                print("⚠️  LLM service failed, using local patterns")
                return self._local_pattern_analysis(body_markings)
                
        except Exception as e:
            print(f"❌ Emotion analysis failed: {e}")
            print("🔄 Falling back to local pattern analysis")
            return self._local_pattern_analysis(body_markings)
    
    def _local_pattern_analysis(self, body_markings: Dict[str, str]) -> Dict:
        """Fallback to local pattern matching"""
        # Count different sensation types
        hot_count = sum(1 for sensation in body_markings.values() if sensation == 'hot')
        warm_count = sum(1 for sensation in body_markings.values() if sensation == 'warm')
        cold_count = sum(1 for sensation in body_markings.values() if sensation == 'cold')
        cool_count = sum(1 for sensation in body_markings.values() if sensation == 'cool')
        numb_count = sum(1 for sensation in body_markings.values() if sensation == 'numb')
        
        # Analyze patterns
        results = []
        
        # Pattern 1: High energy (hot sensations)
        if hot_count >= 2:
            results.append({
                'emotion': 'Anger/Excitement',
                'confidence': 0.8,
                'description': 'Multiple hot sensations suggest high energy emotions like anger or excitement',
                'patterns': [f'{hot_count} hot sensations'],
                'source': 'local_pattern_analysis'
            })
        
        # Pattern 2: Positive warmth
        if warm_count >= 2 and hot_count == 0:
            results.append({
                'emotion': 'Happiness/Contentment',
                'confidence': 0.7,
                'description': 'Warm sensations without hot suggest positive emotional state',
                'patterns': [f'{warm_count} warm sensations'],
                'source': 'local_pattern_analysis'
            })
        
        # Pattern 3: Withdrawal (cold sensations)
        if cold_count >= 2:
            results.append({
                'emotion': 'Sadness/Withdrawal',
                'confidence': 0.7,
                'description': 'Cold sensations suggest emotional withdrawal or sadness',
                'patterns': [f'{cold_count} cold sensations'],
                'source': 'local_pattern_analysis'
            })
        
        # Pattern 4: Anxiety (mixed hot and cold)
        if hot_count >= 1 and cold_count >= 1:
            results.append({
                'emotion': 'Anxiety/Stress',
                'confidence': 0.6,
                'description': 'Mixed hot and cold sensations suggest anxiety or stress',
                'patterns': [f'{hot_count} hot, {cold_count} cold'],
                'source': 'local_pattern_analysis'
            })
        
        # Pattern 5: Numbness
        if numb_count >= 1:
            results.append({
                'emotion': 'Disconnection/Shock',
                'confidence': 0.6,
                'description': 'Numb sensations suggest emotional disconnection or shock',
                'patterns': [f'{numb_count} numb sensations'],
                'source': 'local_pattern_analysis'
            })
        
        # If no clear patterns, provide general analysis
        if not results:
            total_sensations = len([s for s in body_markings.values() if s])
            if total_sensations == 0:
                results.append({
                    'emotion': 'Neutral/Calm',
                    'confidence': 0.8,
                    'description': 'No significant sensations detected, suggesting a calm state',
                    'patterns': ['no sensations'],
                    'source': 'local_pattern_analysis'
                })
            else:
                results.append({
                    'emotion': 'Mixed/Complex',
                    'confidence': 0.5,
                    'description': f'Complex pattern of {total_sensations} sensations suggests mixed emotions',
                    'patterns': [f'{total_sensations} total sensations'],
                    'source': 'local_pattern_analysis'
                })
        
        return results
    
    def get_service_status(self) -> Dict:
        """Get the status of the emotion analysis service"""
        return {
            'service': 'emotion_analysis',
            'status': 'active',
            'llm_providers': len(self.llm_service.providers),
            'primary_provider': 'Gemini API' if self.llm_service.providers else 'Local patterns only',
            'fallback_available': True
        }
