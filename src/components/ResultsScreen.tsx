import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BodyMap } from "./BodyMap";
import { type BodyMarkings, type EmotionResult } from "@/types/bodyMap";
import { RotateCcw, Download, Share2 } from "lucide-react";

interface ResultsScreenProps {
  markings: BodyMarkings;
  emotions: EmotionResult[];
  onRestart: () => void;
  isLoading?: boolean;
}

export const ResultsScreen = ({ markings, emotions, onRestart, isLoading = false }: ResultsScreenProps) => {
  const handleShare = () => {
    const emotionNames = emotions.map(e => e.emotion).join(', ');
    const text = `I just mapped my body sensations and discovered I might be feeling: ${emotionNames}. Try the Body Feeling Map yourself!`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Body Feeling Map Results',
        text: text,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <Card className="p-6 bg-card border border-border shadow-[var(--shadow-elegant)]">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Your Body-Emotion Map
            </h2>
            <p className="text-muted-foreground">
              Based on your marked sensations, here's what your body might be telling you:
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
                    onMarkingChange={() => {}} // Read-only in results
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
                    Back View
                  </h3>
                  <BodyMap 
                    view="back"
                    markings={markings}
                    onMarkingChange={() => {}} // Read-only in results
                  />
                </div>
              </div>
            </div>

            {/* Emotion Results */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Detected Emotions
                </h3>
                
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Analyzing your body sensations...</p>
                  </div>
                ) : emotions.length > 0 ? (
                  <div className="space-y-4">
                    {emotions.map((emotion, index) => (
                      <Card key={emotion.emotion} className="p-4 bg-accent/20">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-foreground">
                            {emotion.emotion}
                          </h4>
                          <Badge variant="secondary">
                            {Math.round(emotion.confidence * 100)}% match
                          </Badge>
                        </div>
                        
                        <Progress 
                          value={emotion.confidence * 100} 
                          className="mb-3"
                        />
                        
                        <p className="text-sm text-muted-foreground mb-3">
                          {emotion.description}
                        </p>
                        
                        <div>
                          <p className="text-xs font-medium text-foreground mb-1">
                            Detected patterns:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {emotion.patterns.slice(0, 3).map((pattern, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {pattern}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-4 bg-accent/20">
                    <p className="text-muted-foreground text-center">
                      No clear emotional patterns detected. This might indicate a neutral or calm state.
                    </p>
                  </Card>
                )}
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium text-foreground mb-2">Remember:</h4>
                <p className="text-sm text-muted-foreground">
                  This is an exploratory tool based on body mapping research. 
                  Your emotions are complex and personal. Use these insights 
                  as a starting point for self-reflection.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Button
              onClick={onRestart}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Start Over
            </Button>
            
            <Button
              onClick={handleShare}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share Results
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};