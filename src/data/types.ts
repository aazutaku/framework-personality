export type FrameworkType = 'threeC' | 'fourP' | 'pest' | 'swot' | 'fiveForces' | 'none';

export interface Choice {
  text: string;
  scores: Record<FrameworkType, number>;
}

export interface Question {
  id: number;
  question: string;
  emoji: string;
  choices: Choice[];
}

export interface FrameworkResult {
  type: FrameworkType;
  name: string;
  subtitle: string;
  emoji: string;
  description: string;
  traits: string[];
  weakness: string;
  drinkingAdvice: string;
  compatibility: {
    best: string;
    worst: string;
  };
}
