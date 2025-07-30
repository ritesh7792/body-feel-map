import { SENSATION_INFO, type Sensation } from "@/types/bodyMap";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface SensationSelectorProps {
  onSelect: (sensation: Sensation) => void;
  onClose: () => void;
  position: { x: number; y: number };
}

export const SensationSelector = ({ onSelect, onClose, position }: SensationSelectorProps) => {
  const sensations: (keyof typeof SENSATION_INFO)[] = ['hot', 'warm', 'cool', 'cold', 'numb'];

  return (
    <div 
      className="absolute z-50 bg-card border border-border rounded-lg shadow-[var(--shadow-elegant)] p-3 min-w-[200px]"
      style={{ 
        left: Math.min(position.x, window.innerWidth - 220), 
        top: Math.min(position.y, window.innerHeight - 250) 
      }}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium text-foreground">Choose sensation:</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-6 w-6 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-1">
        {sensations.map((sensation) => {
          const info = SENSATION_INFO[sensation];
          return (
            <Button
              key={sensation}
              variant="ghost"
              className="w-full justify-start h-auto p-2 hover:bg-accent"
              onClick={() => onSelect(sensation)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full bg-${info.color}`} />
                <div className="text-left">
                  <div className="font-medium text-sm">{info.label}</div>
                  <div className="text-xs text-muted-foreground">{info.description}</div>
                </div>
              </div>
            </Button>
          );
        })}
        
        <Button
          variant="ghost"
          className="w-full justify-start h-auto p-2 hover:bg-accent"
          onClick={() => onSelect(null)}
        >
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full border border-border bg-transparent" />
            <div className="text-left">
              <div className="font-medium text-sm">Clear</div>
              <div className="text-xs text-muted-foreground">Remove sensation</div>
            </div>
          </div>
        </Button>
      </div>
    </div>
  );
};