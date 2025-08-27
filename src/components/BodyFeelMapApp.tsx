import { useState } from "react";
import { IntroScreen } from "./IntroScreen";
import { BodyMappingStep } from "./BodyMappingStep";
import { ResultsScreen } from "./ResultsScreen";
import { type BodyMarkings, type BodyRegion, type Sensation, type EmotionResult } from "@/types/bodyMap";
import { apiService } from "@/services/api";

type AppStep = 'intro' | 'mapping' | 'results';

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

  const handleMarkingChange = (region: BodyRegion, sensation: Sensation, view: 'front' | 'back') => {
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
      setCurrentStep('mapping');
    }
  };

  const handleBack = () => {
    if (currentStep === 'mapping') {
      setCurrentStep('intro');
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      // Analyze both front and back views if they have markings
      const frontMarkings = Object.values(markings.front).some(v => v !== null);
      const backMarkings = Object.values(markings.back).some(v => v !== null);
      
      let allEmotions: EmotionResult[] = [];
      
      if (frontMarkings) {
        const frontEmotions = await apiService.analyzeEmotions(markings, 'front');
        allEmotions.push(...frontEmotions);
      }
      
      if (backMarkings) {
        const backEmotions = await apiService.analyzeEmotions(markings, 'back');
        allEmotions.push(...backEmotions);
      }
      
      setEmotions(allEmotions);
      setCurrentStep('results');
    } catch (error) {
      console.error('Failed to analyze emotions:', error);
      // Fallback to empty emotions
      setEmotions([]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRestart = () => {
    setMarkings(createEmptyMarkings());
    setCurrentStep('intro');
  };



  const [emotions, setEmotions] = useState<EmotionResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  switch (currentStep) {
    case 'intro':
      return <IntroScreen onStart={handleNext} />;
    
    case 'mapping':
      return (
        <BodyMappingStep
          markings={markings}
          onMarkingChange={handleMarkingChange}
          onAnalyze={handleAnalyze}
          onBack={handleBack}
          isAnalyzing={isAnalyzing}
        />
      );
    
    case 'results':
      return (
        <ResultsScreen
          markings={markings}
          emotions={emotions}
          onRestart={handleRestart}
          onBackToMapping={() => setCurrentStep('mapping')}
          isLoading={isAnalyzing}
        />
      );
    
    default:
      return null;
  }
};