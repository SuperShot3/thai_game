export type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'easy';

export interface DifficultyProgress {
  beginner: number;
  intermediate: number;
  advanced: number;
  easy: number;
}

export interface GameState {
  isComplete: boolean;
  isCorrect: boolean;
  completionTime?: number;
} 