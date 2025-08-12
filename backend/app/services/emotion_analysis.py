from typing import Dict, List, Optional
from app.schemas.body_mapping import BodyMarkings, EmotionResult

class EmotionAnalysisService:
    """Service for analyzing emotions based on body sensations"""
    
    # Emotion detection patterns based on established body mapping research
    EMOTION_PATTERNS = {
        "anger": {
            "hot": ["head", "chest", "left-arm", "right-arm", "left-hand", "right-hand"],
            "warm": ["neck", "abdomen"],
            "indicators": ["Hot face and arms", "Warm chest area", "Activated upper body"],
            "description": "Anger typically manifests as intense heat in the head, chest, and arms, representing the body's preparation for action."
        },
        "happiness": {
            "warm": ["head", "chest", "left-arm", "right-arm", "abdomen"],
            "hot": ["chest"],
            "indicators": ["Warm all over", "Especially warm chest", "Positive energy throughout"],
            "description": "Happiness creates a warm, energized feeling throughout the body, with particular warmth in the chest and limbs."
        },
        "sadness": {
            "cold": ["left-arm", "right-arm", "left-leg", "right-leg", "left-hand", "right-hand"],
            "cool": ["chest", "abdomen"],
            "numb": ["chest"],
            "indicators": ["Cold limbs", "Reduced chest activity", "Withdrawal of energy"],
            "description": "Sadness shows as coldness in the limbs and reduced activity in the torso, reflecting emotional withdrawal."
        },
        "fear": {
            "hot": ["head", "chest"],
            "cold": ["left-arm", "right-arm", "left-leg", "right-leg"],
            "cool": ["abdomen"],
            "indicators": ["Hot head and chest", "Cold limbs", "Fight-or-flight activation"],
            "description": "Fear creates intense activation in the head and chest while causing coldness in the limbs."
        },
        "anxiety": {
            "hot": ["head", "chest"],
            "warm": ["abdomen"],
            "cold": ["left-hand", "right-hand", "left-foot", "right-foot"],
            "indicators": ["Racing mind", "Chest tightness", "Cold extremities"],
            "description": "Anxiety manifests as heat in the head and chest with coldness in hands and feet."
        },
        "love": {
            "warm": ["head", "chest", "left-arm", "right-arm", "abdomen"],
            "hot": ["chest"],
            "indicators": ["Warm everywhere", "Glowing chest", "Full-body activation"],
            "description": "Love creates an all-encompassing warmth, especially strong in the chest area."
        },
        "disgust": {
            "cool": ["head", "chest"],
            "cold": ["abdomen"],
            "numb": ["left-arm", "right-arm"],
            "indicators": ["Cool upper body", "Cold stomach", "Reduced limb activity"],
            "description": "Disgust shows as coolness in the upper body and coldness in the stomach area."
        },
        "surprise": {
            "hot": ["head", "chest"],
            "warm": ["left-arm", "right-arm"],
            "indicators": ["Sudden head activation", "Chest response", "Alert limbs"],
            "description": "Surprise creates sudden activation in the head and chest with alertness in the arms."
        },
        "shame": {
            "hot": ["head"],
            "cold": ["chest", "abdomen"],
            "numb": ["left-arm", "right-arm"],
            "indicators": ["Hot face", "Cold torso", "Withdrawn limbs"],
            "description": "Shame manifests as heat in the face while the body feels cold and withdrawn."
        },
        "pride": {
            "hot": ["head", "chest"],
            "warm": ["abdomen", "left-arm", "right-arm"],
            "indicators": ["Expanded chest", "Head held high", "Strong posture"],
            "description": "Pride creates warmth and expansion in the upper body, particularly the chest and head."
        }
    }
    
    @classmethod
    def analyze_emotions(cls, markings: BodyMarkings) -> List[EmotionResult]:
        """Analyze emotions based on body sensations"""
        results = []
        
        # Combine front and back markings
        all_markings = {**markings.front, **markings.back}
        
        # Count how many regions have sensations
        marked_regions = sum(1 for sensation in all_markings.values() if sensation is not None)
        
        if marked_regions == 0:
            return [EmotionResult(
                emotion="Neutral/Calm",
                confidence=0.8,
                description="No significant sensations detected, suggesting a calm or neutral emotional state.",
                patterns=["No marked sensations"]
            )]
        
        # Analyze each emotion pattern
        for emotion, pattern in cls.EMOTION_PATTERNS.items():
            matches = 0
            total_checked = 0
            found_patterns = []
            
            # Check each sensation type in the pattern
            for sensation, expected_regions in pattern.items():
                if sensation in ["indicators", "description"]:
                    continue
                
                for region in expected_regions:
                    total_checked += 1
                    if all_markings.get(region) == sensation:
                        matches += 1
                        found_patterns.append(f"{sensation} {region.replace('-', ' ')}")
            
            if matches > 0 and total_checked > 0:
                confidence = min(matches / max(total_checked * 0.3, 1), 1.0)
                
                if confidence > 0.1:
                    results.append(EmotionResult(
                        emotion=emotion.capitalize(),
                        confidence=confidence,
                        description=pattern["description"],
                        patterns=found_patterns if found_patterns else pattern["indicators"]
                    ))
        
        # If no strong matches, provide contextual suggestions
        if not results or all(r.confidence < 0.2 for r in results):
            contextual_results = cls._get_contextual_suggestions(all_markings)
            results.extend(contextual_results)
        
        # Sort by confidence and return top results
        return sorted(results, key=lambda x: x.confidence, reverse=True)[:3]
    
    @classmethod
    def _get_contextual_suggestions(cls, markings: Dict[str, Optional[str]]) -> List[EmotionResult]:
        """Provide contextual suggestions when no clear patterns match"""
        suggestions = []
        
        # Count sensations by type
        sensation_counts = {
            "hot": 0, "warm": 0, "cool": 0, "cold": 0, "numb": 0
        }
        
        sensation_regions = {
            "hot": [], "warm": [], "cool": [], "cold": [], "numb": []
        }
        
        for region, sensation in markings.items():
            if sensation and sensation in sensation_counts:
                sensation_counts[sensation] += 1
                sensation_regions[sensation].append(region.replace("-", " "))
        
        # Cold legs/limbs often indicates fear or anxiety
        if sensation_counts["cold"] > 0:
            cold_limbs = [region for region in sensation_regions["cold"] 
                         if any(limb in region for limb in ["leg", "foot", "arm", "hand"])]
            
            if cold_limbs:
                suggestions.append(EmotionResult(
                    emotion="Fear/Anxiety",
                    confidence=0.6,
                    description="Cold sensations in the limbs often indicate fear or anxiety, as the body redirects blood flow to vital organs.",
                    patterns=[f"Cold in: {', '.join(cold_limbs)}"]
                ))
        
        # Hot head/face often indicates anger or stress
        if sensation_counts["hot"] > 0:
            hot_head = [region for region in sensation_regions["hot"] 
                       if any(head_part in region for head_part in ["head", "face"])]
            
            if hot_head:
                suggestions.append(EmotionResult(
                    emotion="Anger/Stress",
                    confidence=0.5,
                    description="Heat in the head or face area typically indicates anger, frustration, or intense stress.",
                    patterns=[f"Hot in: {', '.join(hot_head)}"]
                ))
        
        # Numb areas suggest emotional shutdown or overwhelm
        if sensation_counts["numb"] > 0:
            suggestions.append(EmotionResult(
                emotion="Emotional Numbness",
                confidence=0.5,
                description="Numbness in body areas can indicate emotional shutdown, overwhelm, or disconnection.",
                patterns=[f"Numb areas: {', '.join(sensation_regions['numb'])}"]
            ))
        
        # General cold suggests withdrawal or sadness
        if sensation_counts["cold"] > sensation_counts["hot"] + sensation_counts["warm"]:
            suggestions.append(EmotionResult(
                emotion="Sadness/Withdrawal",
                confidence=0.4,
                description="Predominant cold sensations often indicate sadness, withdrawal, or low energy states.",
                patterns=[f"Cold dominance in: {', '.join(sensation_regions['cold'])}"]
            ))
        
        # General warmth suggests positive states
        if sensation_counts["warm"] > sensation_counts["cold"] + sensation_counts["cool"]:
            suggestions.append(EmotionResult(
                emotion="Contentment/Warmth",
                confidence=0.4,
                description="Predominant warm sensations often indicate contentment, love, or positive emotional states.",
                patterns=[f"Warmth in: {', '.join(sensation_regions['warm'])}"]
            ))
        
        return suggestions
