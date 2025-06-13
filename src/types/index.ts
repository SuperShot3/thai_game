export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface ThaiSentence {
  thai: string[];
  english: string;
  hints?: string[];
}

export interface GameState {
  difficulty: Difficulty;
  currentSentence: ThaiSentence;
  userAnswer: string[];
  isComplete: boolean;
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
  onGameComplete: (result: boolean) => void;
} 