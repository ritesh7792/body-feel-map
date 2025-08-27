import { useState } from "react";
import { type BodyRegion, type Sensation, type BodyMarkings, SENSATION_INFO } from "@/types/bodyMap";
import { SensationSelector } from "./SensationSelector";
import { cn } from "@/lib/utils";

interface BodyMapProps {
  view: 'front' | 'back';
  markings: BodyMarkings;
  onMarkingChange: (region: BodyRegion, sensation: Sensation) => void;
}

export const BodyMap = ({ view, markings, onMarkingChange }: BodyMapProps) => {
  const [selectedRegion, setSelectedRegion] = useState<BodyRegion | null>(null);
  const [selectorPosition, setSelectorPosition] = useState({ x: 0, y: 0 });

  const handleRegionClick = (region: BodyRegion, event: React.MouseEvent) => {
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    setSelectorPosition({
      x: event.clientX,
      y: event.clientY
    });
    setSelectedRegion(region);
  };

  const handleSensationSelect = (sensation: Sensation) => {
    if (selectedRegion) {
      onMarkingChange(selectedRegion, sensation);
    }
    setSelectedRegion(null);
  };

  const getRegionColor = (region: BodyRegion): { className: string; style?: React.CSSProperties } => {
    const sensation = markings[view][region];
    if (!sensation) return { className: 'fill-muted hover:fill-accent' };
    const info = SENSATION_INFO[sensation];
    return { 
      className: 'opacity-80',
      style: { fill: `hsl(var(--${info.color}))` }
    };
  };

  return (
    <div className="relative">
      <svg
        viewBox="0 0 300 600"
        className="w-full max-w-[300px] mx-auto"
        style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }}
      >
        {view === 'front' ? (
          // Front view SVG
          <g>
            {/* Head */}
            <ellipse
              cx="150"
              cy="60"
              rx="35"
              ry="45"
              className={cn("cursor-pointer transition-all stroke-border stroke-2", getRegionColor('head').className)}
              style={getRegionColor('head').style}
              onClick={(e) => handleRegionClick('head', e)}
            />
            
            {/* Neck */}
            <rect
              x="135"
              y="100"
              width="30"
              height="25"
              className={cn("cursor-pointer transition-all stroke-border stroke-2", getRegionColor('neck').className)}
              style={getRegionColor('neck').style}
              onClick={(e) => handleRegionClick('neck', e)}
            />
            
            {/* Chest */}
            <ellipse
              cx="150"
              cy="170"
              rx="45"
              ry="35"
              className={cn("cursor-pointer transition-all stroke-border stroke-2", getRegionColor('chest').className)}
              style={getRegionColor('chest').style}
              onClick={(e) => handleRegionClick('chest', e)}
            />
            
            {/* Abdomen */}
            <ellipse
              cx="150"
              cy="230"
              rx="40"
              ry="30"
              className={cn("cursor-pointer transition-all stroke-border stroke-2", getRegionColor('abdomen').className)}
              style={getRegionColor('abdomen').style}
              onClick={(e) => handleRegionClick('abdomen', e)}
            />
            
            {/* Left Arm */}
            <ellipse
              cx="100"
              cy="155"
              rx="15"
              ry="40"
              className={cn("cursor-pointer transition-all stroke-border stroke-2", getRegionColor('left-arm').className)}
              style={getRegionColor('left-arm').style}
              onClick={(e) => handleRegionClick('left-arm', e)}
            />
            
            {/* Right Arm */}
            <ellipse
              cx="200"
              cy="155"
              rx="15"
              ry="40"
              className={cn("cursor-pointer transition-all stroke-border stroke-2", getRegionColor('right-arm').className)}
              style={getRegionColor('right-arm').style}
              onClick={(e) => handleRegionClick('right-arm', e)}
            />
            
            {/* Left Forearm */}
            <ellipse
              cx="85"
              cy="210"
              rx="12"
              ry="35"
              className={cn("cursor-pointer transition-all stroke-border stroke-2", getRegionColor('left-forearm').className)}
              style={getRegionColor('left-forearm').style}
              onClick={(e) => handleRegionClick('left-forearm', e)}
            />
            
            {/* Right Forearm */}
            <ellipse
              cx="215"
              cy="210"
              rx="12"
              ry="35"
              className={cn("cursor-pointer transition-all stroke-border stroke-2", getRegionColor('right-forearm').className)}
              style={getRegionColor('right-forearm').style}
              onClick={(e) => handleRegionClick('right-forearm', e)}
            />
            
            {/* Left Hand */}
            <ellipse
              cx="80"
              cy="255"
              rx="10"
              ry="15"
              className={cn("cursor-pointer transition-all stroke-border stroke-2", getRegionColor('left-hand').className)}
              style={getRegionColor('left-hand').style}
              onClick={(e) => handleRegionClick('left-hand', e)}
            />
            
            {/* Right Hand */}
            <ellipse
              cx="220"
              cy="255"
              rx="10"
              ry="15"
              className={cn("cursor-pointer transition-all stroke-border stroke-2", getRegionColor('right-hand').className)}
              style={getRegionColor('right-hand').style}
              onClick={(e) => handleRegionClick('right-hand', e)}
            />
            
            {/* Left Thigh */}
            <ellipse
              cx="125"
              cy="320"
              rx="20"
              ry="50"
              className={cn("cursor-pointer transition-all stroke-border stroke-2", getRegionColor('left-thigh').className)}
              style={getRegionColor('left-thigh').style}
              onClick={(e) => handleRegionClick('left-thigh', e)}
            />
            
            {/* Right Thigh */}
            <ellipse
              cx="175"
              cy="320"
              rx="20"
              ry="50"
              className={cn("cursor-pointer transition-all stroke-border stroke-2", getRegionColor('right-thigh').className)}
              style={getRegionColor('right-thigh').style}
              onClick={(e) => handleRegionClick('right-thigh', e)}
            />
            
            {/* Left Leg */}
            <ellipse
              cx="125"
              cy="430"
              rx="15"
              ry="50"
              className={cn("cursor-pointer transition-all stroke-border stroke-2", getRegionColor('left-leg').className)}
              style={getRegionColor('left-leg').style}
              onClick={(e) => handleRegionClick('left-leg', e)}
            />
            
            {/* Right Leg */}
            <ellipse
              cx="175"
              cy="430"
              rx="15"
              ry="50"
              className={cn("cursor-pointer transition-all stroke-border stroke-2", getRegionColor('right-leg').className)}
              style={getRegionColor('right-leg').style}
              onClick={(e) => handleRegionClick('right-leg', e)}
            />
            
            {/* Left Foot */}
            <ellipse
              cx="125"
              cy="510"
              rx="12"
              ry="20"
              className={cn("cursor-pointer transition-all stroke-border stroke-2", getRegionColor('left-foot').className)}
              style={getRegionColor('left-foot').style}
              onClick={(e) => handleRegionClick('left-foot', e)}
            />
            
            {/* Right Foot */}
            <ellipse
              cx="175"
              cy="510"
              rx="12"
              ry="20"
              className={cn("cursor-pointer transition-all stroke-border stroke-2", getRegionColor('right-foot').className)}
              style={getRegionColor('right-foot').style}
              onClick={(e) => handleRegionClick('right-foot', e)}
            />
          </g>
        ) : (
          // Back view SVG
          <g>
            {/* Head (back) */}
            <ellipse
              cx="150"
              cy="60"
              rx="35"
              ry="45"
              className={cn("cursor-pointer transition-all stroke-border stroke-2", getRegionColor('head').className)}
              style={getRegionColor('head').style}
              onClick={(e) => handleRegionClick('head', e)}
            />
            
            {/* Neck (back) */}
            <rect
              x="135"
              y="100"
              width="30"
              height="25"
              className={cn("cursor-pointer transition-all stroke-border stroke-2", getRegionColor('neck').className)}
              style={getRegionColor('neck').style}
              onClick={(e) => handleRegionClick('neck', e)}
            />
            
            {/* Upper Back */}
            <ellipse
              cx="150"
              cy="170"
              rx="45"
              ry="35"
              className={cn("cursor-pointer transition-all stroke-border stroke-2", getRegionColor('upper-back').className)}
              style={getRegionColor('upper-back').style}
              onClick={(e) => handleRegionClick('upper-back', e)}
            />
            
            {/* Lower Back */}
            <ellipse
              cx="150"
              cy="230"
              rx="40"
              ry="30"
              className={cn("cursor-pointer transition-all stroke-border stroke-2", getRegionColor('lower-back').className)}
              style={getRegionColor('lower-back').style}
              onClick={(e) => handleRegionClick('lower-back', e)}
            />
            
            {/* Arms and legs same as front but different mapping for back regions */}
            <ellipse
              cx="100"
              cy="155"
              rx="15"
              ry="40"
              className={cn("cursor-pointer transition-all stroke-border stroke-2", getRegionColor('left-arm').className)}
              style={getRegionColor('left-arm').style}
              onClick={(e) => handleRegionClick('left-arm', e)}
            />
            
            <ellipse
              cx="200"
              cy="155"
              rx="15"
              ry="40"
              className={cn("cursor-pointer transition-all stroke-border stroke-2", getRegionColor('right-arm').className)}
              style={getRegionColor('right-arm').style}
              onClick={(e) => handleRegionClick('right-arm', e)}
            />
            
            <ellipse
              cx="85"
              cy="210"
              rx="12"
              ry="35"
              className={cn("cursor-pointer transition-all stroke-border stroke-2", getRegionColor('left-forearm').className)}
              style={getRegionColor('left-forearm').style}
              onClick={(e) => handleRegionClick('left-forearm', e)}
            />
            
            <ellipse
              cx="215"
              cy="210"
              rx="12"
              ry="35"
              className={cn("cursor-pointer transition-all stroke-border stroke-2", getRegionColor('right-forearm').className)}
              style={getRegionColor('right-forearm').style}
              onClick={(e) => handleRegionClick('right-forearm', e)}
            />
            
            <ellipse
              cx="80"
              cy="255"
              rx="10"
              ry="15"
              className={cn("cursor-pointer transition-all stroke-border stroke-2", getRegionColor('left-hand').className)}
              style={getRegionColor('left-hand').style}
              onClick={(e) => handleRegionClick('left-hand', e)}
            />
            
            <ellipse
              cx="220"
              cy="255"
              rx="10"
              ry="15"
              className={cn("cursor-pointer transition-all stroke-border stroke-2", getRegionColor('right-hand').className)}
              style={getRegionColor('right-hand').style}
              onClick={(e) => handleRegionClick('right-hand', e)}
              />
            
            <ellipse
              cx="125"
              cy="320"
              rx="20"
              ry="50"
              className={cn("cursor-pointer transition-all stroke-border stroke-2", getRegionColor('left-thigh').className)}
              style={getRegionColor('left-thigh').style}
              onClick={(e) => handleRegionClick('left-thigh', e)}
            />
            
            <ellipse
              cx="175"
              cy="320"
              rx="20"
              ry="50"
              className={cn("cursor-pointer transition-all stroke-border stroke-2", getRegionColor('right-thigh').className)}
              style={getRegionColor('right-thigh').style}
              onClick={(e) => handleRegionClick('right-thigh', e)}
            />
            
            <ellipse
              cx="125"
              cy="430"
              rx="15"
              ry="50"
              className={cn("cursor-pointer transition-all stroke-border stroke-2", getRegionColor('left-leg').className)}
              style={getRegionColor('left-leg').style}
              onClick={(e) => handleRegionClick('left-leg', e)}
            />
            
            <ellipse
              cx="175"
              cy="430"
              rx="15"
              ry="50"
              className={cn("cursor-pointer transition-all stroke-border stroke-2", getRegionColor('right-leg').className)}
              style={getRegionColor('right-leg').style}
              onClick={(e) => handleRegionClick('right-leg', e)}
            />
            
            <ellipse
              cx="125"
              cy="510"
              rx="12"
              ry="20"
              className={cn("cursor-pointer transition-all stroke-border stroke-2", getRegionColor('left-foot').className)}
              style={getRegionColor('left-foot').style}
              onClick={(e) => handleRegionClick('left-foot', e)}
            />
            
            <ellipse
              cx="175"
              cy="510"
              rx="12"
              ry="20"
              className={cn("cursor-pointer transition-all stroke-border stroke-2", getRegionColor('right-foot').className)}
              style={getRegionColor('right-foot').style}
              onClick={(e) => handleRegionClick('right-foot', e)}
            />
          </g>
        )}
      </svg>

      {selectedRegion && (
        <SensationSelector
          position={selectorPosition}
          onSelect={handleSensationSelect}
          onClose={() => setSelectedRegion(null)}
        />
      )}
    </div>
  );
};