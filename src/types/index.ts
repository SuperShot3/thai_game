export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface ThaiSentence {
  thai: string[];
  thaiWords: string[];
  english: string;
  hints: string[];
  difficulty: Difficulty;
}

export interface GameState {
  difficulty: Difficulty;
  currentSentence: ThaiSentence;
  userAnswer: string[];
  isComplete: boolean;
  isCorrect: boolean;
  completionTime?: number;
  feedback: {
    isCorrect: boolean;
    message: string;
    correctAnswer?: string;
  };
} 