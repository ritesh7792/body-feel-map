export type Sensation = 'hot' | 'warm' | 'cool' | 'cold' | 'numb' | null;

export type BodyRegion = 
  | 'head' | 'neck' | 'chest' | 'abdomen' | 'left-arm' | 'right-arm' 
  | 'left-forearm' | 'right-forearm' | 'left-hand' | 'right-hand'
  | 'left-thigh' | 'right-thigh' | 'left-leg' | 'right-leg' 
  | 'left-foot' | 'right-foot' | 'upper-back' | 'lower-back';

export interface BodyMarkings {
  front: Record<BodyRegion, Sensation>;
  back: Record<BodyRegion, Sensation>;
}

export interface EmotionResult {
  emotion: string;
  confidence: number;
  description: string;
  patterns: string[];
}

export interface SensationInfo {
  color: string;
  label: string;
  description: string;
}

export const SENSATION_INFO: Record<Exclude<Sensation, null>, SensationInfo> = {
  hot: {
    color: 'sensation-hot',
    label: 'Hot',
    description: 'Strong, intense activation'
  },
  warm: {
    color: 'sensation-warm',
    label: 'Warm',
    description: 'Mild activation or positive energy'
  },
  cool: {
    color: 'sensation-cool',
    label: 'Cool',
    description: 'Slight decrease in energy or detachment'
  },
  cold: {
    color: 'sensation-cold',
    label: 'Cold',
    description: 'Marked withdrawal or strong negative emotion'
  },
  numb: {
    color: 'sensation-numb',
    label: 'Numb',
    description: 'No sensation, feeling disconnected'
  }
};