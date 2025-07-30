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

  // Analyze each emotion pattern with improved sensitivity
  for (const [emotion, pattern] of Object.entries(EMOTION_PATTERNS)) {
    let matches = 0;
    let totalChecked = 0;
    const foundPatterns: string[] = [];

    // Check each sensation type in the pattern
    for (const [sensation, expectedRegions] of Object.entries(pattern)) {
      if (sensation === 'indicators' || sensation === 'description') continue;
      
      const regions = expectedRegions as string[];

      for (const region of regions) {
        totalChecked++;
        if (allMarkings[region as keyof typeof allMarkings] === sensation) {
          matches++;
          foundPatterns.push(`${sensation} ${region.replace('-', ' ')}`);
        }
      }
    }

    if (matches > 0 && totalChecked > 0) {
      // More generous confidence calculation
      const confidence = Math.min((matches / Math.max(totalChecked * 0.3, 1)), 1);
      
      // Lower threshold for inclusion
      if (confidence > 0.1) {
        results.push({
          emotion: emotion.charAt(0).toUpperCase() + emotion.slice(1),
          confidence,
          description: pattern.description,
          patterns: foundPatterns.length > 0 ? foundPatterns : pattern.indicators
        });
      }
    }
  }

  // If no strong matches, provide contextual suggestions based on individual sensations
  if (results.length === 0 || results.every(r => r.confidence < 0.2)) {
    const contextualResults = getContextualSuggestions(allMarkings);
    results.push(...contextualResults);
  }

  // Sort by confidence and return top results
  return results
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 3);
}

// New function to provide contextual suggestions when no clear patterns match
function getContextualSuggestions(markings: Record<string, any>): EmotionResult[] {
  const suggestions: EmotionResult[] = [];
  
  // Count sensations by type
  const sensationCounts = {
    hot: 0, warm: 0, cool: 0, cold: 0, numb: 0
  };
  
  const sensationRegions: Record<string, string[]> = {
    hot: [], warm: [], cool: [], cold: [], numb: []
  };

  for (const [region, sensation] of Object.entries(markings)) {
    if (sensation && sensationCounts.hasOwnProperty(sensation)) {
      sensationCounts[sensation as keyof typeof sensationCounts]++;
      sensationRegions[sensation].push(region.replace('-', ' '));
    }
  }

  // Cold legs/limbs often indicates fear or anxiety
  if (sensationCounts.cold > 0) {
    const coldLimbs = sensationRegions.cold.filter(region => 
      region.includes('leg') || region.includes('foot') || region.includes('arm') || region.includes('hand')
    );
    
    if (coldLimbs.length > 0) {
      suggestions.push({
        emotion: "Fear/Anxiety",
        confidence: 0.6,
        description: "Cold sensations in the limbs often indicate fear or anxiety, as the body redirects blood flow to vital organs.",
        patterns: [`Cold in: ${coldLimbs.join(', ')}`]
      });
    }
  }

  // Hot head/face often indicates anger or stress
  if (sensationCounts.hot > 0) {
    const hotHead = sensationRegions.hot.filter(region => 
      region.includes('head') || region.includes('face')
    );
    
    if (hotHead.length > 0) {
      suggestions.push({
        emotion: "Anger/Stress",
        confidence: 0.5,
        description: "Heat in the head or face area typically indicates anger, frustration, or intense stress.",
        patterns: [`Hot in: ${hotHead.join(', ')}`]
      });
    }
  }

  // Numb areas suggest emotional shutdown or overwhelm
  if (sensationCounts.numb > 0) {
    suggestions.push({
      emotion: "Emotional Numbness",
      confidence: 0.5,
      description: "Numbness in body areas can indicate emotional shutdown, overwhelm, or disconnection.",
      patterns: [`Numb areas: ${sensationRegions.numb.join(', ')}`]
    });
  }

  // General cold suggests withdrawal or sadness
  if (sensationCounts.cold > sensationCounts.hot + sensationCounts.warm) {
    suggestions.push({
      emotion: "Sadness/Withdrawal",
      confidence: 0.4,
      description: "Predominant cold sensations often indicate sadness, withdrawal, or low energy states.",
      patterns: [`Cold dominance in: ${sensationRegions.cold.join(', ')}`]
    });
  }

  // General warmth suggests positive states
  if (sensationCounts.warm > sensationCounts.cold + sensationCounts.cool) {
    suggestions.push({
      emotion: "Contentment/Warmth",
      confidence: 0.4,
      description: "Predominant warm sensations often indicate contentment, love, or positive emotional states.",
      patterns: [`Warmth in: ${sensationRegions.warm.join(', ')}`]
    });
  }

  return suggestions;
}