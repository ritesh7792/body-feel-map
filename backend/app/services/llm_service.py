#!/usr/bin/env python3
"""
LLM Service for Emotion Analysis
Prioritizes: 1) Gemini API, 2) OpenAI API, 3) Local pattern matching
"""

import os
import json
import requests
from typing import Dict, List, Optional
from abc import ABC, abstractmethod

class LLMProvider(ABC):
    """Abstract base class for LLM providers"""
    
    @abstractmethod
    def analyze_emotions(self, body_markings: Dict[str, str], view: str) -> Optional[Dict]:
        """Analyze emotions using the LLM provider"""
        pass

class GeminiProvider(LLMProvider):
    """Google Gemini API provider - PRIMARY SERVICE"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://generativelanguage.googleapis.com/v1beta/models"
        self.model = "gemini-1.5-flash"
    
    def analyze_emotions(self, body_markings: Dict[str, str], view: str) -> Optional[Dict]:
        """Analyze emotions using Gemini API"""
        try:
            # Create a prompt for emotion analysis
            sensations = ", ".join([f"{region}: {sensation}" for region, sensation in body_markings.items() if sensation])
            
            prompt = f"""
            Analyze the emotional state based on these body sensations from the {view} view:
            {sensations}
            
            Please provide:
            1. Primary emotion(s) detected
            2. Confidence level (0.0-1.0)
            3. Brief explanation
            4. Any patterns you notice
            
            Format your response as JSON with these fields:
            - emotion: string
            - confidence: float
            - description: string
            - patterns: array of strings
            - source: "gemini_api"
            """
            
            # Make the API call
            url = f"{self.base_url}/{self.model}:generateContent?key={self.api_key}"
            
            payload = {
                "contents": [{
                    "parts": [{
                        "text": prompt.strip()
                    }]
                }],
                "generationConfig": {
                    "temperature": 0.7,
                    "topK": 40,
                    "topP": 0.95,
                    "maxOutputTokens": 1024,
                }
            }
            
            response = requests.post(url, json=payload, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                
                # Extract the generated text
                if 'candidates' in result and len(result['candidates']) > 0:
                    generated_text = result['candidates'][0]['content']['parts'][0]['text']
                    
                    # Try to parse JSON from the response
                    try:
                        # Look for JSON in the response
                        json_start = generated_text.find('{')
                        json_end = generated_text.rfind('}') + 1
                        
                        if json_start != -1 and json_end > json_start:
                            json_text = generated_text[json_start:json_end]
                            parsed_result = json.loads(json_text)
                            
                            # Validate the structure
                            required_fields = ['emotion', 'confidence', 'description', 'patterns', 'source']
                            if all(field in parsed_result for field in required_fields):
                                return parsed_result
                            
                    except json.JSONDecodeError:
                        pass
                    
                    # If JSON parsing fails, create a structured response from the text
                    return self._create_structured_response(generated_text, body_markings)
                    
            elif response.status_code == 429:
                print("⚠️  Gemini API rate limit hit")
            elif response.status_code == 403:
                print("⚠️  Gemini API quota exceeded")
            else:
                print(f"⚠️  Gemini API error: HTTP {response.status_code}")
                
        except Exception as e:
            print(f"Gemini API error: {e}")
        
        return None
    
    def _create_structured_response(self, text: str, body_markings: Dict[str, str]) -> Dict:
        """Create a structured response from Gemini's text output"""
        # Extract emotion keywords from the text
        emotion_keywords = [
            'anger', 'happiness', 'sadness', 'fear', 'anxiety', 
            'love', 'disgust', 'surprise', 'shame', 'pride',
            'joy', 'excitement', 'calm', 'stress', 'relaxation',
            'contentment', 'frustration', 'worry', 'peace', 'tension'
        ]
        
        detected_emotion = "Mixed_Emotions"
        for emotion in emotion_keywords:
            if emotion.lower() in text.lower():
                detected_emotion = emotion.capitalize()
                break
        
        return {
            'emotion': detected_emotion,
            'confidence': 0.8,
            'description': f'Gemini AI analysis: {text[:200]}...',
            'patterns': ['gemini_ai_analysis'],
            'source': 'gemini_api'
        }

class OpenAIProvider(LLMProvider):
    """OpenAI API provider - SECONDARY SERVICE"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.openai.com/v1/chat/completions"
        self.model = "gpt-3.5-turbo"
    
    def analyze_emotions(self, body_markings: Dict[str, str], view: str) -> Optional[Dict]:
        """Analyze emotions using OpenAI API"""
        try:
            # Create a prompt for emotion analysis
            sensations = ", ".join([f"{region}: {sensation}" for region, sensation in body_markings.items() if sensation])
            
            prompt = f"""
            Analyze the emotional state based on these body sensations from the {view} view:
            {sensations}
            
            Please provide:
            1. Primary emotion(s) detected
            2. Confidence level (0.0-1.0)
            3. Brief explanation
            4. Any patterns you notice
            
            Format your response as JSON with these fields:
            - emotion: string
            - confidence: float
            - description: string
            - patterns: array of strings
            - source: "openai_api"
            """
            
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "model": self.model,
                "messages": [
                    {"role": "system", "content": "You are an expert in somatic psychology and emotion analysis."},
                    {"role": "user", "content": prompt.strip()}
                ],
                "max_tokens": 500,
                "temperature": 0.7
            }
            
            response = requests.post(self.base_url, headers=headers, json=payload, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                
                # Extract the generated text
                if 'choices' in result and len(result['choices']) > 0:
                    generated_text = result['choices'][0]['message']['content']
                    
                    # Try to parse JSON from the response
                    try:
                        # Look for JSON in the response
                        json_start = generated_text.find('{')
                        json_end = generated_text.rfind('}') + 1
                        
                        if json_start != -1 and json_end > json_start:
                            json_text = generated_text[json_start:json_end]
                            parsed_result = json.loads(json_text)
                            
                            # Validate the structure
                            required_fields = ['emotion', 'confidence', 'description', 'patterns', 'source']
                            if all(field in parsed_result for field in required_fields):
                                return parsed_result
                            
                    except json.JSONDecodeError:
                        pass
                    
                    # If JSON parsing fails, create a structured response from the text
                    return self._create_structured_response(generated_text, body_markings)
                    
            elif response.status_code == 429:
                print("⚠️  OpenAI API rate limit hit")
            elif response.status_code == 401:
                print("⚠️  OpenAI API key invalid")
            else:
                print(f"⚠️  OpenAI API error: HTTP {response.status_code}")
                
        except Exception as e:
            print(f"OpenAI API error: {e}")
        
        return None
    
    def _create_structured_response(self, text: str, body_markings: Dict[str, str]) -> Dict:
        """Create a structured response from OpenAI's text output"""
        # Extract emotion keywords from the text
        emotion_keywords = [
            'anger', 'happiness', 'sadness', 'fear', 'anxiety', 
            'love', 'disgust', 'surprise', 'shame', 'pride',
            'joy', 'excitement', 'calm', 'stress', 'relaxation',
            'contentment', 'frustration', 'worry', 'peace', 'tension'
        ]
        
        detected_emotion = "Mixed_Emotions"
        for emotion in emotion_keywords:
            if emotion.lower() in text.lower():
                detected_emotion = emotion.capitalize()
                break
        
        return {
            'emotion': detected_emotion,
            'confidence': 0.8,
            'description': f'OpenAI analysis: {text[:200]}...',
            'patterns': ['openai_ai_analysis'],
            'source': 'openai_api'
        }

class LocalPatternProvider(LLMProvider):
    """Local pattern matching provider - FINAL FALLBACK"""
    
    def __init__(self):
        # Define emotion patterns based on body sensations
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
        """Analyze emotions using local pattern matching"""
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

class LLMService:
    """Main LLM service that orchestrates different providers"""
    
    def __init__(self):
        self.providers = []
        
        # Priority 1: Gemini API
        gemini_key = os.getenv('GEMINI_API_KEY')
        if gemini_key:
            self.providers.append(GeminiProvider(gemini_key))
            print("✅ Gemini API provider initialized")
        else:
            print("⚠️  GEMINI_API_KEY not found, skipping Gemini API")
        
        # Priority 2: OpenAI API
        openai_key = os.getenv('OPENAI_API_KEY')
        if openai_key:
            self.providers.append(OpenAIProvider(openai_key))
            print("✅ OpenAI API provider initialized")
        else:
            print("⚠️  OPENAI_API_KEY not found, skipping OpenAI API")
        
        # Priority 3: Local pattern matching (always available)
        self.providers.append(LocalPatternProvider())
        print("✅ Local pattern provider initialized")
        
        print(f"🎯 Total providers: {len(self.providers)}")
    
    def analyze_emotions(self, body_markings: Dict[str, str], view: str) -> Dict:
        """Analyze emotions using available providers in priority order"""
        for i, provider in enumerate(self.providers):
            try:
                print(f"🔍 Trying provider {i+1}/{len(self.providers)}: {provider.__class__.__name__}")
                
                result = provider.analyze_emotions(body_markings, view)
                
                if result:
                    print(f"✅ Success with {provider.__class__.__name__}")
                    return result
                else:
                    print(f"❌ Failed with {provider.__class__.__name__}")
                    
            except Exception as e:
                print(f"❌ Error with {provider.__class__.__name__}: {e}")
                continue
        
        # This should never happen since LocalPatternProvider is always available
        print("❌ All providers failed - this shouldn't happen!")
        return {
            'emotion': 'Analysis_Error',
            'confidence': 0.0,
            'description': 'All emotion analysis providers failed',
            'patterns': ['system_error'],
            'source': 'error'
        }
