import { useState } from "react";
import { IntroScreen } from "./IntroScreen";
import { BodyMappingStep } from "./BodyMappingStep";
import { ResultsScreen } from "./ResultsScreen";
import { type BodyMarkings, type BodyRegion, type Sensation } from "@/types/bodyMap";
import { analyzeEmotions } from "@/utils/emotionAnalysis";

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

  const handleNext = () => {
    if (currentStep === 'intro') {
      setCurrentStep('front');
    } else if (currentStep === 'front') {
      setCurrentStep('back');
    } else if (currentStep === 'back') {
      setCurrentStep('results');
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

  const emotions = currentStep === 'results' ? analyzeEmotions(markings) : [];

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
        />
      );
    
    default:
      return null;
  }
};