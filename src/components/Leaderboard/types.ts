import { Difficulty } from '../../types';

export interface LeaderboardEntry {
  name: string;
  correctWords: number;
  incorrectWords: number;
  totalTime: number;
}

export interface LeaderboardProps {
  onClose?: () => void;
  showCloseButton?: boolean;
} 