import { useState } from "react";
import { IntroScreen } from "./IntroScreen";
import { BodyMappingStep } from "./BodyMappingStep";
import { ResultsScreen } from "./ResultsScreen";
import { type BodyMarkings, type BodyRegion, type Sensation, type EmotionResult } from "@/types/bodyMap";
import { apiService } from "@/services/api";

type AppStep = 'intro' | 'front' | 'back' | 'results';

const createEmptyMarkings = (): BodyMarkings => ({
  front: {
    head: null,
    neck: null,
    chest: null,
    abdomen: null,
    'left-arm': null,
    'right-arm': null,
    'left-forearm': null,
    'right-forearm': null,
    'left-hand': null,
    'right-hand': null,
    'left-thigh': null,
    'right-thigh': null,
    'left-leg': null,
    'right-leg': null,
    'left-foot': null,
    'right-foot': null,
    'upper-back': null,
    'lower-back': null,
  },
  back: {
    head: null,
    neck: null,
    chest: null,
    abdomen: null,
    'left-arm': null,
    'right-arm': null,
    'left-forearm': null,
    'right-forearm': null,
    'left-hand': null,
    'right-hand': null,
    'left-thigh': null,
    'right-thigh': null,
    'left-leg': null,
    'right-leg': null,
    'left-foot': null,
    'right-foot': null,
    'upper-back': null,
    'lower-back': null,
  }
});

export const BodyFeelMapApp = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>('intro');
  const [markings, setMarkings] = useState<BodyMarkings>(createEmptyMarkings);

  const handleMarkingChange = (region: BodyRegion, sensation: Sensation) => {
    const view = currentStep as 'front' | 'back';
    setMarkings(prev => ({
      ...prev,
      [view]: {
        ...prev[view],
        [region]: sensation
      }
    }));
  };

  const handleNext = async () => {
    if (currentStep === 'intro') {
      setCurrentStep('front');
    } else if (currentStep === 'front') {
      setCurrentStep('back');
    } else if (currentStep === 'back') {
      setCurrentStep('results');
      // Analyze emotions when moving to results
      setIsAnalyzing(true);
      try {
        const emotionResults = await apiService.analyzeEmotions(markings);
        setEmotions(emotionResults);
      } catch (error) {
        console.error('Failed to analyze emotions:', error);
        // Fallback to empty emotions
        setEmotions([]);
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep === 'front') {
      setCurrentStep('intro');
    } else if (currentStep === 'back') {
      setCurrentStep('front');
    }
  };

  const handleRestart = () => {
    setMarkings(createEmptyMarkings());
    setCurrentStep('intro');
  };

  // Check if user has marked at least one sensation (optional requirement)
  const canProceed = true; // Allow progression without requiring markings

  const [emotions, setEmotions] = useState<EmotionResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  switch (currentStep) {
    case 'intro':
      return <IntroScreen onStart={handleNext} />;
    
    case 'front':
    case 'back':
      return (
        <BodyMappingStep
          view={currentStep}
          markings={markings}
          onMarkingChange={handleMarkingChange}
          onNext={handleNext}
          onBack={handleBack}
          canGoNext={canProceed}
        />
      );
    
    case 'results':
      return (
        <ResultsScreen
          markings={markings}
          emotions={emotions}
          onRestart={handleRestart}
          isLoading={isAnalyzing}
        />
      );
    
    default:
      return null;
  }
};