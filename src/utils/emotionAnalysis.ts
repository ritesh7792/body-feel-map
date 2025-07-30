import { type BodyMarkings, type EmotionResult } from "@/types/bodyMap";

// Emotion detection patterns based on established body mapping research
const EMOTION_PATTERNS = {
  anger: {
    hot: ['head', 'chest', 'left-arm', 'right-arm', 'left-hand', 'right-hand'],
    warm: ['neck', 'abdomen'],
    indicators: ['Hot face and arms', 'Warm chest area', 'Activated upper body'],
    description: "Anger typically manifests as intense heat in the head, chest, and arms, representing the body's preparation for action."
  },
  happiness: {
    warm: ['head', 'chest', 'left-arm', 'right-arm', 'abdomen'],
    hot: ['chest'],
    indicators: ['Warm all over', 'Especially warm chest', 'Positive energy throughout'],
    description: "Happiness creates a warm, energized feeling throughout the body, with particular warmth in the chest and limbs."
  },
  sadness: {
    cold: ['left-arm', 'right-arm', 'left-leg', 'right-leg', 'left-hand', 'right-hand'],
    cool: ['chest', 'abdomen'],
    numb: ['chest'],
    indicators: ['Cold limbs', 'Reduced chest activity', 'Withdrawal of energy'],
    description: "Sadness shows as coldness in the limbs and reduced activity in the torso, reflecting emotional withdrawal."
  },
  fear: {
    hot: ['head', 'chest'],
    cold: ['left-arm', 'right-arm', 'left-leg', 'right-leg'],
    cool: ['abdomen'],
    indicators: ['Hot head and chest', 'Cold limbs', 'Fight-or-flight activation'],
    description: "Fear creates intense activation in the head and chest while causing coldness in the limbs."
  },
  anxiety: {
    hot: ['head', 'chest'],
    warm: ['abdomen'],
    cold: ['left-hand', 'right-hand', 'left-foot', 'right-foot'],
    indicators: ['Racing mind', 'Chest tightness', 'Cold extremities'],
    description: "Anxiety manifests as heat in the head and chest with coldness in hands and feet."
  },
  love: {
    warm: ['head', 'chest', 'left-arm', 'right-arm', 'abdomen'],
    hot: ['chest'],
    indicators: ['Warm everywhere', 'Glowing chest', 'Full-body activation'],
    description: "Love creates an all-encompassing warmth, especially strong in the chest area."
  },
  disgust: {
    cool: ['head', 'chest'],
    cold: ['abdomen'],
    numb: ['left-arm', 'right-arm'],
    indicators: ['Cool upper body', 'Cold stomach', 'Reduced limb activity'],
    description: "Disgust shows as coolness in the upper body and coldness in the stomach area."
  },
  surprise: {
    hot: ['head', 'chest'],
    warm: ['left-arm', 'right-arm'],
    indicators: ['Sudden head activation', 'Chest response', 'Alert limbs'],
    description: "Surprise creates sudden activation in the head and chest with alertness in the arms."
  },
  shame: {
    hot: ['head'],
    cold: ['chest', 'abdomen'],
    numb: ['left-arm', 'right-arm'],
    indicators: ['Hot face', 'Cold torso', 'Withdrawn limbs'],
    description: "Shame manifests as heat in the face while the body feels cold and withdrawn."
  },
  pride: {
    hot: ['head', 'chest'],
    warm: ['abdomen', 'left-arm', 'right-arm'],
    indicators: ['Expanded chest', 'Head held high', 'Strong posture'],
    description: "Pride creates warmth and expansion in the upper body, particularly the chest and head."
  }
};

export function analyzeEmotions(markings: BodyMarkings): EmotionResult[] {
  const results: EmotionResult[] = [];
  
  // Combine front and back markings
  const allMarkings = { ...markings.front, ...markings.back };
  
  // Count how many regions have sensations
  const markedRegions = Object.values(allMarkings).filter(sensation => sensation !== null).length;
  
  if (markedRegions === 0) {
    return [{
      emotion: "Neutral/Calm",
      confidence: 0.8,
      description: "No significant sensations detected, suggesting a calm or neutral emotional state.",
      patterns: ["No marked sensations"]
    }];
  }

  // Analyze each emotion pattern
  for (const [emotion, pattern] of Object.entries(EMOTION_PATTERNS)) {
    let matches = 0;
    let totalExpected = 0;
    const foundPatterns: string[] = [];

    // Check each sensation type in the pattern
    for (const [sensation, expectedRegions] of Object.entries(pattern)) {
      if (sensation === 'indicators' || sensation === 'description') continue;
      
      const regions = expectedRegions as string[];
      totalExpected += regions.length;

      for (const region of regions) {
        if (allMarkings[region as keyof typeof allMarkings] === sensation) {
          matches++;
          foundPatterns.push(`${sensation} ${region.replace('-', ' ')}`);
        }
      }
    }

    if (matches > 0) {
      const confidence = Math.min(matches / totalExpected, 1);
      
      // Only include emotions with reasonable confidence
      if (confidence > 0.15) {
        results.push({
          emotion: emotion.charAt(0).toUpperCase() + emotion.slice(1),
          confidence,
          description: pattern.description,
          patterns: foundPatterns.length > 0 ? foundPatterns : pattern.indicators
        });
      }
    }
  }

  // Sort by confidence and return top results
  return results
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 3);
}