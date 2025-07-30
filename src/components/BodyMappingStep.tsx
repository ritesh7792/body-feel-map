import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BodyMap } from "./BodyMap";
import { type BodyMarkings, type BodyRegion, type Sensation, SENSATION_INFO } from "@/types/bodyMap";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface BodyMappingStepProps {
  view: 'front' | 'back';
  markings: BodyMarkings;
  onMarkingChange: (region: BodyRegion, sensation: Sensation) => void;
  onNext: () => void;
  onBack: () => void;
  canGoNext: boolean;
}

export const BodyMappingStep = ({ 
  view, 
  markings, 
  onMarkingChange, 
  onNext, 
  onBack, 
  canGoNext 
}: BodyMappingStepProps) => {
  const currentStep = view === 'front' ? 1 : 2;
  const progress = (currentStep / 2) * 100;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Step {currentStep} of 2
          </p>
        </div>

        <Card className="p-6 bg-card border border-border shadow-[var(--shadow-elegant)]">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {view === 'front' ? 'Front Body Mapping' : 'Back Body Mapping'}
            </h2>
            <p className="text-muted-foreground">
              {view === 'front' 
                ? "Tap or click on areas of the body's front and choose how they feel:"
                : "Mark areas on the back using the same sensations:"
              }
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="flex justify-center">
              <BodyMap 
                view={view}
                markings={markings}
                onMarkingChange={onMarkingChange}
              />
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Sensation Legend
                </h3>
                <div className="space-y-3">
                  {Object.entries(SENSATION_INFO).map(([sensation, info]) => (
                    <div key={sensation} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full bg-${info.color}`} />
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
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {view === 'front' ? 'Back to Intro' : 'Back to Front'}
            </Button>

            <Button
              onClick={onNext}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={!canGoNext}
            >
              {view === 'front' ? 'Continue to Back' : 'View Results'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};