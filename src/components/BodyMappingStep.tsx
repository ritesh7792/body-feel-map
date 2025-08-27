import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BodyMap } from "./BodyMap";
import { type BodyMarkings, type BodyRegion, type Sensation, SENSATION_INFO } from "@/types/bodyMap";
import { ArrowLeft, Brain, RefreshCw } from "lucide-react";

interface BodyMappingStepProps {
  markings: BodyMarkings;
  onMarkingChange: (region: BodyRegion, sensation: Sensation, view: 'front' | 'back') => void;
  onAnalyze: () => void;
  onBack: () => void;
  isAnalyzing: boolean;
}

export const BodyMappingStep = ({ 
  markings, 
  onMarkingChange, 
  onAnalyze, 
  onBack, 
  isAnalyzing 
}: BodyMappingStepProps) => {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <Card className="p-6 bg-card border border-border shadow-[var(--shadow-elegant)]">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Body Sensation Mapping
            </h2>
            <p className="text-muted-foreground">
              Mark areas on your body and choose how they feel. You can analyze emotions anytime!
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Body Maps */}
            <div className="lg:col-span-2">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
                    Front View
                  </h3>
                  <BodyMap 
                    view="front"
                    markings={markings}
                    onMarkingChange={(region, sensation) => onMarkingChange(region, sensation, 'front')}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
                    Back View
                  </h3>
                  <BodyMap 
                    view="back"
                    markings={markings}
                    onMarkingChange={(region, sensation) => onMarkingChange(region, sensation, 'back')}
                  />
                </div>
              </div>
            </div>

            {/* Side Panel */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Sensation Legend
                </h3>
                <div className="space-y-3">
                  {Object.entries(SENSATION_INFO).map(([sensation, info]) => (
                    <div key={sensation} className="flex items-center gap-3">
                      <div 
                        className="w-5 h-5 rounded-full" 
                        style={{ backgroundColor: `hsl(var(--${info.color}))` }}
                      />
                      <div>
                        <span className="font-medium text-foreground">{info.label}</span>
                        <p className="text-sm text-muted-foreground">{info.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium text-foreground mb-2">Instructions:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Click on any body region to mark it</li>
                  <li>• Choose the sensation that best matches how you feel</li>
                  <li>• You can change markings anytime</li>
                  <li>• Not every region needs to be marked</li>
                </ul>
              </div>

              {/* Calculate Button */}
              <div className="pt-4">
                <Button
                  onClick={onAnalyze}
                  disabled={isAnalyzing}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-lg"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5 mr-2" />
                      Analyze Emotions
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Click anytime to analyze your current body sensations
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-start mt-8">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Intro
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};