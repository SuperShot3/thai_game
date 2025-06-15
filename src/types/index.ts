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

export interface WordCardProps {
  word: string;
  index: number;
  isDragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
}

export interface DropZoneProps {
  position: number;
  onDrop: (word: string) => void;
  isOccupied: boolean;
}

export interface GameBoardProps {
  difficulty: Difficulty;
  onGameComplete: (isCorrect: boolean, correctWords: number) => void;
}

export interface DifficultyProgress {
  easy: number;
  beginner: number;
  intermediate: number;
  advanced: number;
}

export interface DifficultySelectorProps {
  currentDifficulty: Difficulty;
  progress: DifficultyProgress;
} 