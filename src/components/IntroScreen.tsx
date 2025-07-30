import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Brain, Thermometer } from "lucide-react";

interface IntroScreenProps {
  onStart: () => void;
}

export const IntroScreen = ({ onStart }: IntroScreenProps) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-2xl p-8 bg-card border border-border shadow-[var(--shadow-elegant)]">
        <div className="text-center space-y-6">
          <div className="flex justify-center items-center gap-4 mb-6">
            <Heart className="w-8 h-8 text-sensation-hot" />
            <Brain className="w-8 h-8 text-primary" />
            <Thermometer className="w-8 h-8 text-sensation-cool" />
          </div>
          
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Body Feeling Map
          </h1>
          
          <div className="text-left space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Our emotions show up as physical sensations—sometimes as heat, chill, or numbness—in certain parts of the body.
            </p>
            
            <p>
              In this experience, you'll mark both the front and back of a body map using the following sensations:
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-sensation-hot"></div>
                <span>Hot (intense activation)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-sensation-warm"></div>
                <span>Warm (positive energy)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-sensation-cool"></div>
                <span>Cool (mild detachment)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-sensation-cold"></div>
                <span>Cold (withdrawal)</span>
              </div>
              <div className="flex items-center gap-2 sm:col-span-2 justify-center">
                <div className="w-4 h-4 rounded-full bg-sensation-numb"></div>
                <span>Numb (disconnected)</span>
              </div>
            </div>
            
            <p>
              At the end, we'll suggest what emotion you might be experiencing, based on where you marked these sensations.
            </p>
          </div>
          
          <Button 
            onClick={onStart}
            size="lg"
            className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-[var(--shadow-glow)]"
          >
            Begin Body Mapping
          </Button>
        </div>
      </Card>
    </div>
  );
};